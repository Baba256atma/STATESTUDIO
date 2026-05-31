/**
 * E2:76 — Detect repeating runtime loop candidates (development diagnostics only).
 */

export type LoopRootCandidate = {
  source: string;
  action: string;
  count: number;
  signature: string;
  firstTimestamp: number;
  lastTimestamp: number;
};

type LoopBucket = {
  source: string;
  action: string;
  signature: string;
  count: number;
  firstTimestamp: number;
  lastTimestamp: number;
  timestamps: number[];
};

const WINDOW_MS = 5000;
const MIN_REPEATS = 3;
const buckets = new Map<string, LoopBucket>();
const emittedKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function bucketKey(source: string, action: string, signature: string): string {
  return `${source}::${action}::${signature}`;
}

function trimTimestamps(bucket: LoopBucket, now: number): void {
  const cutoff = now - WINDOW_MS;
  while (bucket.timestamps.length > 0 && bucket.timestamps[0]! < cutoff) {
    bucket.timestamps.shift();
  }
  bucket.count = bucket.timestamps.length;
  bucket.firstTimestamp = bucket.timestamps[0] ?? now;
  bucket.lastTimestamp = bucket.timestamps[bucket.timestamps.length - 1] ?? now;
}

export function recordLoopObservation(
  source: string,
  action: string,
  signature: string,
  timestamp: number = Date.now()
): void {
  if (!isDev()) return;

  const key = bucketKey(source, action, signature);
  const existing = buckets.get(key) ?? {
    source,
    action,
    signature,
    count: 0,
    firstTimestamp: timestamp,
    lastTimestamp: timestamp,
    timestamps: [],
  };

  existing.timestamps.push(timestamp);
  trimTimestamps(existing, timestamp);
  buckets.set(key, existing);

  if (existing.count < MIN_REPEATS) return;
  if (existing.lastTimestamp - existing.firstTimestamp > WINDOW_MS) return;
  if (emittedKeys.has(key)) return;

  emittedKeys.add(key);
  const payload: LoopRootCandidate = {
    source,
    action,
    count: existing.count,
    signature,
    firstTimestamp: existing.firstTimestamp,
    lastTimestamp: existing.lastTimestamp,
  };
  globalThis.console?.warn?.("[Nexora][LoopRootCandidate]", payload);
}

export function resetRuntimeLoopDetectorForTests(): void {
  buckets.clear();
  emittedKeys.clear();
}

export function getLoopRootCandidatesForTests(): LoopRootCandidate[] {
  return getLoopRootCandidates();
}

export function getLoopRootCandidates(): LoopRootCandidate[] {
  return Array.from(buckets.values())
    .filter((bucket) => bucket.count >= MIN_REPEATS)
    .map((bucket) => ({
      source: bucket.source,
      action: bucket.action,
      count: bucket.count,
      signature: bucket.signature,
      firstTimestamp: bucket.firstTimestamp,
      lastTimestamp: bucket.lastTimestamp,
    }));
}
