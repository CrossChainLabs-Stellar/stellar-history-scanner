export function logWithTimestamp(message: string, ...params: any[]): void {
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${message}`, ...params);
}