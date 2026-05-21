import type { AdaptiveDecisionSequence } from "./adaptiveSequencingTypes";

export const ADAPTIVE_SEQUENCING_MAX_SEQUENCES = 10;
export const ADAPTIVE_SEQUENCING_MAX_SNAPSHOTS = 8;
export const ADAPTIVE_SEQUENCING_MAX_EVOLUTIONS = 10;
export const ADAPTIVE_SEQUENCING_MAX_TRANSITIONS = 10;
export const ADAPTIVE_SEQUENCING_MAX_SHIFTS = 10;
export const ADAPTIVE_SEQUENCING_MAX_SIGNALS = 10;
export const ADAPTIVE_SEQUENCING_MIN_EVAL_INTERVAL_MS = 500;
export const ADAPTIVE_SEQUENCING_MAX_RECURSION_DEPTH = 2;
export const ADAPTIVE_SEQUENCING_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let adaptationDepth = 0;

export function beginAdaptiveSequencingEvaluation(): boolean {
  if (adaptationDepth >= ADAPTIVE_SEQUENCING_MAX_RECURSION_DEPTH) return false;
  adaptationDepth += 1;
  return true;
}

export function endAdaptiveSequencingEvaluation(): void {
  adaptationDepth = Math.max(0, adaptationDepth - 1);
}

export function shouldEvaluateAdaptiveSequencing(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < ADAPTIVE_SEQUENCING_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateAdaptiveDecisionSequence(
  sequence: AdaptiveDecisionSequence | null | undefined
): sequence is AdaptiveDecisionSequence {
  if (!sequence) return false;
  if (!sequence.adaptiveSequenceId.trim() || !sequence.summary.trim()) return false;
  if (sequence.confidence < ADAPTIVE_SEQUENCING_MIN_CONFIDENCE) return false;
  if (sequence.sequencingTransitions.length < 1) return false;
  return Number.isFinite(sequence.generatedAt);
}

export function shouldRetainAdaptiveDecisionSequence(
  sequence: AdaptiveDecisionSequence
): boolean {
  if (!validateAdaptiveDecisionSequence(sequence)) return false;
  if (sequence.sequencingState === "unstable" && sequence.confidence < 0.65) {
    return false;
  }
  return true;
}

export function sequencingStateRank(state: AdaptiveDecisionSequence["sequencingState"]): number {
  const ranks: Record<AdaptiveDecisionSequence["sequencingState"], number> = {
    static: 1,
    stabilized: 2,
    evolving: 3,
    unstable: 4,
    adaptive: 5,
  };
  return ranks[state];
}

export function adaptationStrengthRank(
  strength: AdaptiveDecisionSequence["adaptationStrength"]
): number {
  const ranks: Record<AdaptiveDecisionSequence["adaptationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
  };
  return ranks[strength];
}

export function confidenceToSequencingLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetAdaptiveSequencingGuards(): void {
  lastEvalAtByOrg.clear();
  adaptationDepth = 0;
}
