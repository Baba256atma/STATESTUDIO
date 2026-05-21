import type {
  DecisionCategory,
  DecisionImpactLevel,
  ConsequencePropagationType,
  InstitutionalDecisionRecord,
} from "./decisionOutcomeTypes";

export const DECISION_OUTCOME_MAX_RECORDS = 32;
export const DECISION_OUTCOME_MAX_OBSERVATIONS = 24;
export const DECISION_OUTCOME_MAX_PATTERNS = 16;
export const DECISION_OUTCOME_MAX_CORRELATIONS = 16;
export const DECISION_OUTCOME_MIN_EVAL_INTERVAL_MS = 500;
export const DECISION_OUTCOME_MAX_RECURSION_DEPTH = 2;
export const DECISION_OUTCOME_MIN_CONFIDENCE = 0.4;

const lastEvalAtByOrg = new Map<string, number>();
let outcomeDepth = 0;

const VALID_IMPACT = new Set<DecisionImpactLevel>([
  "minimal",
  "moderate",
  "significant",
  "major",
  "systemic",
]);

const VALID_PROPAGATION = new Set<ConsequencePropagationType>([
  "isolated",
  "localized",
  "distributed",
  "cascading",
  "systemic",
]);

const VALID_CATEGORIES = new Set<DecisionCategory>([
  "operational",
  "governance",
  "resilience",
  "escalation",
  "coordination",
  "strategic",
  "recovery",
  "unknown",
]);

export function beginDecisionOutcomeEvaluation(): boolean {
  if (outcomeDepth >= DECISION_OUTCOME_MAX_RECURSION_DEPTH) return false;
  outcomeDepth += 1;
  return true;
}

export function endDecisionOutcomeEvaluation(): void {
  outcomeDepth = Math.max(0, outcomeDepth - 1);
}

export function shouldEvaluateDecisionOutcomes(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DECISION_OUTCOME_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateDecisionOutcomeRecord(
  record: InstitutionalDecisionRecord | null | undefined
): record is InstitutionalDecisionRecord {
  if (!record) return false;
  if (!record.decisionOutcomeId.trim() || !record.summary.trim()) return false;
  if (!VALID_IMPACT.has(record.impactLevel)) return false;
  if (!VALID_PROPAGATION.has(record.propagationType)) return false;
  if (!VALID_CATEGORIES.has(record.decisionCategory)) return false;
  if (record.confidence < DECISION_OUTCOME_MIN_CONFIDENCE) return false;
  return Number.isFinite(record.generatedAt);
}

export function shouldRetainDecisionOutcome(
  record: InstitutionalDecisionRecord,
  hasSupportingEvidence: boolean
): boolean {
  if (!validateDecisionOutcomeRecord(record)) return false;
  if (!hasSupportingEvidence && record.impactLevel === "major") return false;
  if (record.impactLevel === "minimal" && record.occurrenceCount < 2) return false;
  return true;
}

export function resetDecisionOutcomeGuards(): void {
  lastEvalAtByOrg.clear();
  outcomeDepth = 0;
}
