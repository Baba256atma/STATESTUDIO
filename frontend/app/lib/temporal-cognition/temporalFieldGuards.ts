import type { OrganizationalTimeField } from "./temporalFieldTypes";

export const TEMPORAL_FIELD_MAX_FIELDS = 10;
export const TEMPORAL_FIELD_MAX_SNAPSHOTS = 8;
export const TEMPORAL_FIELD_MAX_PATTERNS = 10;
export const TEMPORAL_FIELD_MAX_STRATEGIC_FIELDS = 8;
export const TEMPORAL_FIELD_MAX_ERA_EVOLUTIONS = 8;
export const TEMPORAL_FIELD_MAX_CONTINUITY_FIELDS = 8;
export const TEMPORAL_FIELD_MAX_SIGNALS = 10;
export const TEMPORAL_FIELD_MIN_EVAL_INTERVAL_MS = 500;
export const TEMPORAL_FIELD_MAX_RECURSION_DEPTH = 2;
export const TEMPORAL_FIELD_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let fieldDepth = 0;

export function beginTemporalFieldEvaluation(): boolean {
  if (fieldDepth >= TEMPORAL_FIELD_MAX_RECURSION_DEPTH) return false;
  fieldDepth += 1;
  return true;
}

export function endTemporalFieldEvaluation(): void {
  fieldDepth = Math.max(0, fieldDepth - 1);
}

export function shouldEvaluateTemporalField(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TEMPORAL_FIELD_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateTimeField(
  field: OrganizationalTimeField | null | undefined
): field is OrganizationalTimeField {
  if (!field) return false;
  if (!field.temporalFieldId.trim() || !field.summary.trim()) return false;
  if (field.confidence < TEMPORAL_FIELD_MIN_CONFIDENCE) return false;
  if (field.fieldSignals.length === 0) return false;
  return Number.isFinite(field.generatedAt);
}

export function shouldRetainTimeField(field: OrganizationalTimeField): boolean {
  if (!validateTimeField(field)) return false;
  if (field.fieldStrength === "weak" && field.confidence < 0.62) return false;
  if (field.horizonState === "short_term" && field.fieldStrength === "weak") return false;
  return true;
}

export function confidenceToFieldLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function horizonRank(state: OrganizationalTimeField["horizonState"]): number {
  const ranks: Record<OrganizationalTimeField["horizonState"], number> = {
    short_term: 1,
    medium_term: 2,
    long_term: 3,
    institutional: 4,
    structural: 5,
  };
  return ranks[state];
}

export function resetTemporalFieldGuards(): void {
  lastEvalAtByOrg.clear();
  fieldDepth = 0;
}
