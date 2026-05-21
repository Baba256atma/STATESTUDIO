import type { TemporalMemorySyncRecord } from "./temporalMemorySyncTypes";

export const TEMPORAL_MEMORY_SYNC_MAX_RECORDS = 12;
export const TEMPORAL_MEMORY_SYNC_MAX_SNAPSHOTS = 8;
export const TEMPORAL_MEMORY_SYNC_MAX_SIGNALS = 10;
export const TEMPORAL_MEMORY_SYNC_MAX_BRIDGES = 8;
export const TEMPORAL_MEMORY_SYNC_MAX_ALIGNMENTS = 10;
export const TEMPORAL_MEMORY_SYNC_MAX_SEQUENCES = 10;
export const TEMPORAL_MEMORY_SYNC_MAX_FINGERPRINTS = 6;
export const TEMPORAL_MEMORY_SYNC_MIN_EVAL_INTERVAL_MS = 500;
export const TEMPORAL_MEMORY_SYNC_MAX_RECURSION_DEPTH = 2;
export const TEMPORAL_MEMORY_SYNC_MIN_CONFIDENCE = 0.45;

const lastEvalAtByOrg = new Map<string, number>();
let syncDepth = 0;

export function beginTemporalMemorySyncEvaluation(): boolean {
  if (syncDepth >= TEMPORAL_MEMORY_SYNC_MAX_RECURSION_DEPTH) return false;
  syncDepth += 1;
  return true;
}

export function endTemporalMemorySyncEvaluation(): void {
  syncDepth = Math.max(0, syncDepth - 1);
}

export function shouldEvaluateTemporalMemorySync(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TEMPORAL_MEMORY_SYNC_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateSyncRecord(
  record: TemporalMemorySyncRecord | null | undefined
): record is TemporalMemorySyncRecord {
  if (!record) return false;
  if (!record.syncId.trim() || !record.summary.trim()) return false;
  if (record.confidence < TEMPORAL_MEMORY_SYNC_MIN_CONFIDENCE) return false;
  if (record.crossPeriodSignals.length === 0) return false;
  if (!record.currentPeriodReference.trim()) return false;
  return Number.isFinite(record.generatedAt);
}

export function shouldRetainSyncRecord(record: TemporalMemorySyncRecord): boolean {
  if (!validateSyncRecord(record)) return false;
  if (record.periodState === "current" && !record.priorPeriodReference) return false;
  if (record.syncStrength === "weak" && record.confidence < 0.6) return false;
  return true;
}

export function confidenceToSyncLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetTemporalMemorySyncGuards(): void {
  lastEvalAtByOrg.clear();
  syncDepth = 0;
}
