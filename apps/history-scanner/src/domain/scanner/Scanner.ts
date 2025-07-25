import { inject, injectable } from 'inversify';
import { Logger } from 'logger';
import { Scan } from '../scan/Scan';
import { ExceptionLogger } from 'exception-logger';
import { RangeScanner } from './RangeScanner';
import { ScanJob } from '../scan/ScanJob';
import { ScanError } from '../scan/ScanError';
import { ScanSettingsFactory } from '../scan/ScanSettingsFactory';
import { ScanSettings } from '../scan/ScanSettings';
import { ScanResult } from '../scan/ScanResult';
import { Url } from 'http-helper';
import { TYPES } from '../../infrastructure/di/di-types';
import { logWithTimestamp as log } from './logger';

export interface LedgerHeader {
	ledger: number;
	hash?: string;
}

@injectable()
export class Scanner {
	constructor(
		private rangeScanner: RangeScanner,
		private scanJobSettingsFactory: ScanSettingsFactory,
		@inject('Logger') private logger: Logger,
		@inject(TYPES.ExceptionLogger) private exceptionLogger: ExceptionLogger,
		private readonly rangeSize = 10000
	) {}

	async perform(time: Date, scanJob: ScanJob): Promise<Scan> {
		console.time('scan');

		const scanSettingsOrError =
			await this.scanJobSettingsFactory.determineSettings(scanJob);

		if (scanSettingsOrError.isErr()) {
			const error = scanSettingsOrError.error;
			return scanJob.createFailedScanCouldNotDetermineSettings(
				time,
				new Date(),
				error
			);
		}

		const scanSettings = scanSettingsOrError.value;

		log('Starting scan fromLedger:', scanSettings.fromLedger, 'toLedger:', scanSettings.toLedger);

		/*this.logger.info('Scan settings', {
			url: scanJob.url.value,
			fromLedger: scanSettings.fromLedger,
			toLedger: scanSettings.toLedger,
			concurrency: scanSettings.concurrency,
			isSlowArchive: scanSettings.isSlowArchive
		});*/

		const scanResult = await this.scanInRanges(scanJob.url, scanSettings);
		const scan = scanJob.createScanFromScanResult(
			time,
			new Date(),
			scanSettings,
			scanResult
		);
		console.timeEnd('scan');

		return scan;
	}

	private async scanInRanges(
		url: Url,
		scanSettings: ScanSettings
	): Promise<ScanResult> {
		const latestLedgerHeader: LedgerHeader = {
			ledger: scanSettings.latestScannedLedger,
			hash: scanSettings.latestScannedLedgerHeaderHash ?? undefined
		};

		let rangeFromLedger = scanSettings.fromLedger; //todo move to range generator
		let rangeToLedger =
			rangeFromLedger + this.rangeSize < scanSettings.toLedger
				? rangeFromLedger + this.rangeSize
				: scanSettings.toLedger;

		let alreadyScannedBucketHashes = new Set<string>();
		let error: ScanError | undefined;

		// calculate how many chunks (ranges) we’ll scan in total
		const totalRanges = Math.ceil(
			(scanSettings.toLedger - scanSettings.fromLedger) / this.rangeSize
		);

		let completedRanges = 0;
		let cumulativeDurationMs = 0;

		while (rangeFromLedger < scanSettings.toLedger && !error) {
			const startMs = Date.now();
			const rangeResult = await this.rangeScanner.scan(
				url,
				scanSettings.concurrency,
				rangeToLedger,
				rangeFromLedger,
				latestLedgerHeader.ledger,
				latestLedgerHeader.hash,
				alreadyScannedBucketHashes
			);

			const durationMs = Date.now() - startMs;
            cumulativeDurationMs += durationMs;
			completedRanges++;

			// compute ETA
			const avgMs = cumulativeDurationMs / completedRanges;
			const remainingRanges = totalRanges - completedRanges;
			let etaMs = avgMs * remainingRanges;

			const hours = Math.floor(etaMs / 3_600_000);
			etaMs -= hours * 3_600_000;
			const minutes = Math.floor(etaMs / 60_000);
			const seconds = Math.round((etaMs % 60_000) / 1000);

			// build ETA string
			const etaParts = [];
			if (hours > 0) etaParts.push(`${hours}h`);
			if (minutes > 0 || hours > 0) etaParts.push(`${minutes}m`);
			etaParts.push(`${seconds}s`);
			const etaStr = etaParts.join(' ');

			// log progress + ETA
			const pct = ((completedRanges / totalRanges) * 100).toFixed(1);
			log(`Progress ${pct}% , ETA ~${etaStr}`);
			if (rangeResult.isErr()) {
				error = rangeResult.error;
			} else {
				latestLedgerHeader.ledger = rangeResult.value.latestLedgerHeader
					? rangeResult.value.latestLedgerHeader.ledger
					: rangeToLedger;
				latestLedgerHeader.hash = rangeResult.value.latestLedgerHeader?.hash;

				alreadyScannedBucketHashes = rangeResult.value.scannedBucketHashes;

				rangeFromLedger += this.rangeSize;
				rangeToLedger =
					rangeFromLedger + this.rangeSize < scanSettings.toLedger
						? rangeFromLedger + this.rangeSize
						: scanSettings.toLedger;
			}
		}

		return {
			latestLedgerHeader,
			error
		};
	}
}
