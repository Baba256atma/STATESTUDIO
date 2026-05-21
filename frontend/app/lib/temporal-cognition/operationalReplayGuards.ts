import type {
  OperationalReplaySequence,
  ReplayProgressionState,
} from "./operationalReplayTypes";

export const OPERATIONAL_REPLAY_MAX_SEQUENCES = 12;
export const OPERATIONAL_REPLAY_MAX_SCENARIOS = 10;
export const OPERATIONAL_REPLAY_MAX_FRAMES = 10;
export const OPERATIONAL_REPLAY_MAX_SNAPSHOTS = 8;
export const OPERATIONAL_REPLAY_MAX_EVENTS = 16;
export const OPERATIONAL_REPLAY_MIN_EVAL_INTERVAL_MS = 500;
export const OPERATIONAL_REPLAY_MAX_RECURSION_DEPTH = 2;
export const OPERATIONAL_REPLAY_MIN_CONFIDENCE = 0.45;
export const OPERATIONAL_REPLAY_MAX_SEQUENCE_LENGTH = 8;

const lastEvalAtByOrg = new Map<string, number>();
let replayDepth = 0;

const VALID_STATES = new Set<ReplayProgressionState>([
  "initiated",
  "developing",
  "propagating",
  "destabilizing",
  "stabilizing",
  "recovering",
  "resolved",
]);

export function beginOperationalReplayEvaluation(): boolean {
  if (replayDepth >= OPERATIONAL_REPLAY_MAX_RECURSION_DEPTH) return false;
  replayDepth += 1;
  return true;
}

export function endOperationalReplayEvaluation(): void {
  replayDepth = Math.max(0, replayDepth - 1);
}

export function shouldEvaluateOperationalReplay(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < OPERATIONAL_REPLAY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateReplaySequence(
  replay: OperationalReplaySequence | null | undefined
): replay is OperationalReplaySequence {
  if (!replay) return false;
  if (!replay.replayId.trim() || !replay.summary.trim()) return false;
  if (!VALID_STATES.has(replay.replayState)) return false;
  if (replay.confidence < OPERATIONAL_REPLAY_MIN_CONFIDENCE) return false;
  if (replay.replaySequence.length === 0) return false;
  if (replay.replaySequence.length > OPERATIONAL_REPLAY_MAX_SEQUENCE_LENGTH) return false;
  return Number.isFinite(replay.generatedAt);
}

export function shouldRetainReplaySequence(replay: OperationalReplaySequence): boolean {
  if (!validateReplaySequence(replay)) return false;
  if (replay.replayState === "initiated" && replay.replaySequence.length < 2) return false;
  if (replay.confidence < 0.55 && replay.replaySequence.length < 3) return false;
  return true;
}

export function confidenceToReplayLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetOperationalReplayGuards(): void {
  lastEvalAtByOrg.clear();
  replayDepth = 0;
}
