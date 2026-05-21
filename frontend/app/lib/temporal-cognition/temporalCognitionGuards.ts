import type {
  StrategicTimelineSequence,
  TemporalSequenceType,
  TimelineCategory,
  TimelineState,
} from "./temporalCognitionTypes";

export const TEMPORAL_COGNITION_MAX_SEQUENCES = 16;
export const TEMPORAL_COGNITION_MAX_EVENTS = 32;
export const TEMPORAL_COGNITION_MAX_SNAPSHOTS = 8;
export const TEMPORAL_COGNITION_MAX_SIGNALS = 12;
export const TEMPORAL_COGNITION_MAX_FRAMES = 10;
export const TEMPORAL_COGNITION_MAX_EVOLUTION = 10;
export const TEMPORAL_COGNITION_MIN_EVAL_INTERVAL_MS = 500;
export const TEMPORAL_COGNITION_MAX_RECURSION_DEPTH = 2;
export const TEMPORAL_COGNITION_MIN_CONFIDENCE = 0.45;

const lastEvalAtByOrg = new Map<string, number>();
let temporalDepth = 0;

const VALID_SEQUENCE = new Set<TemporalSequenceType>([
  "isolated",
  "sequential",
  "recurring",
  "cascading",
  "cyclical",
]);

const VALID_STATE = new Set<TimelineState>([
  "emerging",
  "developing",
  "escalating",
  "stabilizing",
  "recovering",
]);

const VALID_CATEGORIES = new Set<TimelineCategory>([
  "fragility",
  "escalation",
  "governance",
  "resilience",
  "recovery",
  "operational",
  "coordination",
  "strategic",
  "unknown",
]);

export function beginTemporalCognitionEvaluation(): boolean {
  if (temporalDepth >= TEMPORAL_COGNITION_MAX_RECURSION_DEPTH) return false;
  temporalDepth += 1;
  return true;
}

export function endTemporalCognitionEvaluation(): void {
  temporalDepth = Math.max(0, temporalDepth - 1);
}

export function shouldEvaluateTemporalCognition(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TEMPORAL_COGNITION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateTimelineSequence(
  sequence: StrategicTimelineSequence | null | undefined
): sequence is StrategicTimelineSequence {
  if (!sequence) return false;
  if (!sequence.timelineId.trim() || !sequence.summary.trim()) return false;
  if (!VALID_SEQUENCE.has(sequence.sequenceType)) return false;
  if (!VALID_STATE.has(sequence.timelineState)) return false;
  if (!VALID_CATEGORIES.has(sequence.category)) return false;
  if (sequence.confidence < TEMPORAL_COGNITION_MIN_CONFIDENCE) return false;
  return Number.isFinite(sequence.generatedAt);
}

export function shouldRetainTimelineSequence(sequence: StrategicTimelineSequence): boolean {
  if (!validateTimelineSequence(sequence)) return false;
  if (sequence.sequenceType === "isolated" && sequence.occurrenceCount < 2) return false;
  if (sequence.events.length === 0 && sequence.confidence < 0.7) return false;
  return true;
}

export function resetTemporalCognitionGuards(): void {
  lastEvalAtByOrg.clear();
  temporalDepth = 0;
}
