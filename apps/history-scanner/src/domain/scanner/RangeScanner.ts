import { CheckPointGenerator } from '../check-point/CheckPointGenerator';
import { inject, injectable } from 'inversify';
import { Logger } from 'logger';
import { err, ok, Result } from 'neverthrow';
import { ExceptionLogger } from 'exception-logger';
import { BucketScanState, CategoryScanState } from './ScanState';
import { HttpQueue, Url } from 'http-helper';
import * as http from 'http';
import * as https from 'https';
import { CategoryScanner } from './CategoryScanner';
import { BucketScanner } from './BucketScanner';
import { ScanError } from '../scan/ScanError';
import { LedgerHeader } from './Scanner';
import { TYPES } from '../../infrastructure/di/di-types';
import { logWithTimestamp as log } from './logger';

export interface RangeScanResult {
	latestLedgerHeader?: LedgerHeader;
	scannedBucketHashes: Set<string>;
}
/**
 * Scan a specific range of a history archive
 */
@injectable()
export class RangeScanner {
	constructor(
		private checkPointGenerator: CheckPointGenerator,
		private categoryScanner: CategoryScanner,
		private bucketScanner: BucketScanner,
		@inject(TYPES.HttpQueue) private httpQueue: HttpQueue,
		@inject('Logger') private logger: Logger,
		@inject(TYPES.ExceptionLogger) private exceptionLogger: ExceptionLogger
	) {}

	async scan(
		baseUrl: Url,
		concurrency: number,
		toLedger: number,
		fromLedger: number,
		latestScannedLedger: number,
		latestScannedLedgerHeaderHash: string | null = null,
		alreadyScannedBucketHashes = new Set<string>()
	): Promise<Result<RangeScanResult, ScanError>> {
		log('Range [', fromLedger, ':', toLedger, ']');

		const httpAgent = new http.Agent({
			keepAlive: true,
			scheduling: 'fifo'
		});
		const httpsAgent = new https.Agent({
			keepAlive: true,
			scheduling: 'fifo'
		});

		const hasScanState = new CategoryScanState(
			baseUrl,
			concurrency,
			httpAgent,
			httpsAgent,
			this.checkPointGenerator.generate(fromLedger, toLedger),
			new Map<number, string>(),
			latestScannedLedgerHeaderHash !== null
				? {
						ledger: latestScannedLedger,
						hash: latestScannedLedgerHeaderHash
					}
				: undefined
		);

		const bucketHashesOrError =
			await this.scanHASFilesAndReturnBucketHashes(hasScanState);
		if (bucketHashesOrError.isErr()) return err(bucketHashesOrError.error);
		const bucketHashesToScan = bucketHashesOrError.value.bucketHashes;

		const categoryScanState = new CategoryScanState(
			baseUrl,
			concurrency,
			httpAgent,
			httpsAgent,
			this.checkPointGenerator.generate(fromLedger, toLedger),
			bucketHashesOrError.value.bucketListHashes,
			latestScannedLedgerHeaderHash
				? {
						ledger: latestScannedLedger,
						hash: latestScannedLedgerHeaderHash
					}
				: undefined
		);
		const categoryScanResult = await this.scanCategories(categoryScanState);
		if (categoryScanResult.isErr()) return err(categoryScanResult.error);

		const bucketScanState = new BucketScanState(
			baseUrl,
			concurrency,
			httpAgent,
			httpsAgent,
			new Set(
				Array.from(bucketHashesToScan).filter(
					(hashToScan) => !alreadyScannedBucketHashes.has(hashToScan)
				)
			)
		);

		const bucketScanResult = await this.scanBucketFiles(bucketScanState);
		if (bucketScanResult.isErr()) return err(bucketScanResult.error);

		httpAgent.destroy();
		httpsAgent.destroy();

		return ok({
			latestLedgerHeader: categoryScanResult.value,
			scannedBucketHashes: new Set([
				...bucketScanState.bucketHashesToScan,
				...alreadyScannedBucketHashes
			])
		});
	}

	private async scanHASFilesAndReturnBucketHashes(
		scanState: CategoryScanState
	): Promise<
		Result<
			{
				bucketHashes: Set<string>;
				bucketListHashes: Map<number, string>;
			},
			ScanError
		>
	> {
		log('Scanning HAS files');

		const scanHASResult =
			await this.categoryScanner.scanHASFilesAndReturnBucketHashes(scanState);

		if (scanHASResult.isErr()) {
			return err(scanHASResult.error);
		}

		return ok(scanHASResult.value);
	}

	private async scanBucketFiles(
		scanState: BucketScanState
	): Promise<Result<void, ScanError>> {
		log('Scanning', scanState.bucketHashesToScan.size,'buckets');

		const scanBucketsResult = await this.bucketScanner.scan(scanState, true);

		return scanBucketsResult;
	}

	private async scanCategories(
		scanState: CategoryScanState
	): Promise<Result<LedgerHeader | undefined, ScanError>> {
		log('Scanning other category files');

		const scanOtherCategoriesResult =
			await this.categoryScanner.scanOtherCategories(scanState, true);


		return scanOtherCategoriesResult;
	}
}
