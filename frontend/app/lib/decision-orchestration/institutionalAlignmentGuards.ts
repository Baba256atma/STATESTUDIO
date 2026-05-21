import type { EnterprisePolicyAlignment } from "./institutionalAlignmentTypes";

export const INSTITUTIONAL_ALIGNMENT_MAX_ALIGNMENTS = 10;
export const INSTITUTIONAL_ALIGNMENT_MAX_SNAPSHOTS = 8;
export const INSTITUTIONAL_ALIGNMENT_MAX_SIGNALS = 10;
export const INSTITUTIONAL_ALIGNMENT_MAX_INDICATORS = 10;
export const INSTITUTIONAL_ALIGNMENT_MAX_FIELDS = 10;
export const INSTITUTIONAL_ALIGNMENT_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_ALIGNMENT_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_ALIGNMENT_MIN_CONFIDENCE = 0.48;
export const INSTITUTIONAL_ALIGNMENT_MAX_INFLATED_CONFIDENCE = 0.94;

const lastEvalAtByOrg = new Map<string, number>();
let alignmentDepth = 0;

export function beginInstitutionalAlignmentEvaluation(): boolean {
  if (alignmentDepth >= INSTITUTIONAL_ALIGNMENT_MAX_RECURSION_DEPTH) return false;
  alignmentDepth += 1;
  return true;
}

export function endInstitutionalAlignmentEvaluation(): void {
  alignmentDepth = Math.max(0, alignmentDepth - 1);
}

export function shouldEvaluateInstitutionalAlignment(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_ALIGNMENT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampAlignmentConfidence(score: number): number {
  return Number(
    Math.min(
      INSTITUTIONAL_ALIGNMENT_MAX_INFLATED_CONFIDENCE,
      Math.max(INSTITUTIONAL_ALIGNMENT_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateEnterprisePolicyAlignment(
  alignment: EnterprisePolicyAlignment | null | undefined
): alignment is EnterprisePolicyAlignment {
  if (!alignment) return false;
  if (!alignment.alignmentId.trim() || !alignment.summary.trim()) return false;
  if (alignment.confidence < INSTITUTIONAL_ALIGNMENT_MIN_CONFIDENCE) return false;
  if (alignment.confidence > INSTITUTIONAL_ALIGNMENT_MAX_INFLATED_CONFIDENCE) return false;
  if (alignment.alignmentSignals.length < 1) return false;
  return Number.isFinite(alignment.generatedAt);
}

export function shouldRetainEnterprisePolicyAlignment(
  alignment: EnterprisePolicyAlignment
): boolean {
  if (!validateEnterprisePolicyAlignment(alignment)) return false;
  if (
    alignment.coherenceState === "institutionally_aligned" &&
    alignment.confidence < 0.72
  ) {
    return false;
  }
  if (alignment.coherenceState === "fragmented" && alignment.confidence > 0.88) {
    return false;
  }
  return true;
}

export function coherenceStateRank(state: EnterprisePolicyAlignment["coherenceState"]): number {
  const ranks: Record<EnterprisePolicyAlignment["coherenceState"], number> = {
    fragmented: 1,
    conflicting: 2,
    stabilizing: 3,
    coherent: 4,
    institutionally_aligned: 5,
  };
  return ranks[state];
}

export function alignmentStrengthRank(
  strength: EnterprisePolicyAlignment["alignmentStrength"]
): number {
  const ranks: Record<EnterprisePolicyAlignment["alignmentStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    institutional_grade: 4,
  };
  return ranks[strength];
}

export function resetInstitutionalAlignmentGuards(): void {
  lastEvalAtByOrg.clear();
  alignmentDepth = 0;
}
