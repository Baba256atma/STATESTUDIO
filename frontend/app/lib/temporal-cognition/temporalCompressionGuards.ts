import type { ExecutiveTemporalDigest } from "./temporalCompressionTypes";

export const TEMPORAL_COMPRESSION_MAX_DIGESTS = 10;
export const TEMPORAL_COMPRESSION_MAX_SUMMARIES = 10;
export const TEMPORAL_COMPRESSION_MAX_TIMELINES = 10;
export const TEMPORAL_COMPRESSION_MAX_SNAPSHOTS = 8;
export const TEMPORAL_COMPRESSION_MAX_SIGNALS = 10;
export const TEMPORAL_COMPRESSION_MAX_LAYERS = 8;
export const TEMPORAL_COMPRESSION_MIN_EVAL_INTERVAL_MS = 500;
export const TEMPORAL_COMPRESSION_MAX_RECURSION_DEPTH = 2;
export const TEMPORAL_COMPRESSION_MIN_CONFIDENCE = 0.5;
export const TEMPORAL_COMPRESSION_MIN_SIGNALS = 2;

const lastEvalAtByOrg = new Map<string, number>();
let compressionDepth = 0;

export function beginTemporalCompressionEvaluation(): boolean {
  if (compressionDepth >= TEMPORAL_COMPRESSION_MAX_RECURSION_DEPTH) return false;
  compressionDepth += 1;
  return true;
}

export function endTemporalCompressionEvaluation(): void {
  compressionDepth = Math.max(0, compressionDepth - 1);
}

export function shouldEvaluateTemporalCompression(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TEMPORAL_COMPRESSION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateExecutiveDigest(
  digest: ExecutiveTemporalDigest | null | undefined
): digest is ExecutiveTemporalDigest {
  if (!digest) return false;
  if (!digest.compressionId.trim() || !digest.summary.trim()) return false;
  if (digest.confidence < TEMPORAL_COMPRESSION_MIN_CONFIDENCE) return false;
  if (digest.distilledSignals.length < TEMPORAL_COMPRESSION_MIN_SIGNALS) return false;
  if (digest.summary.length < 40) return false;
  return Number.isFinite(digest.generatedAt);
}

export function shouldRetainExecutiveDigest(digest: ExecutiveTemporalDigest): boolean {
  if (!validateExecutiveDigest(digest)) return false;
  if (digest.compressionLevel === "raw" && digest.confidence < 0.65) return false;
  if (digest.abstractionState === "fragmented") return false;
  return true;
}

export function resetTemporalCompressionGuards(): void {
  lastEvalAtByOrg.clear();
  compressionDepth = 0;
}
