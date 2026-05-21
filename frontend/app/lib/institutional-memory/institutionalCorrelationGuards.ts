import type {
  ExperienceCorrelationStrength,
  InstitutionalCorrelation,
  LearningPatternCategory,
} from "./institutionalCorrelationTypes";

export const INSTITUTIONAL_CORRELATION_MAX_CORRELATIONS = 32;
export const INSTITUTIONAL_CORRELATION_MAX_PATTERNS = 16;
export const INSTITUTIONAL_CORRELATION_MAX_LINKS = 48;
export const INSTITUTIONAL_CORRELATION_MAX_SEQUENCES = 24;
export const INSTITUTIONAL_CORRELATION_MIN_EVAL_INTERVAL_MS = 450;
export const INSTITUTIONAL_CORRELATION_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_CORRELATION_MIN_LINKED_MEMORIES = 2;

const lastEvalAtByOrg = new Map<string, number>();
let correlationDepth = 0;

const VALID_STRENGTHS = new Set<ExperienceCorrelationStrength>([
  "weak",
  "moderate",
  "strong",
  "systemic",
]);

const VALID_PATTERN_CATEGORIES = new Set<LearningPatternCategory>([
  "escalation_chain",
  "fragility_cycle",
  "governance_pressure",
  "resilience_growth",
  "coordination_breakdown",
  "operational_recovery",
  "systemic_instability",
  "unknown",
]);

export function beginInstitutionalCorrelationEvaluation(): boolean {
  if (correlationDepth >= INSTITUTIONAL_CORRELATION_MAX_RECURSION_DEPTH) return false;
  correlationDepth += 1;
  return true;
}

export function endInstitutionalCorrelationEvaluation(): void {
  correlationDepth = Math.max(0, correlationDepth - 1);
}

export function shouldEvaluateInstitutionalCorrelation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_CORRELATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateInstitutionalCorrelation(
  correlation: InstitutionalCorrelation | null | undefined
): correlation is InstitutionalCorrelation {
  if (!correlation) return false;
  if (!correlation.correlationId.trim() || !correlation.summary.trim()) return false;
  if (!VALID_STRENGTHS.has(correlation.strength)) return false;
  if (!VALID_PATTERN_CATEGORIES.has(correlation.category)) return false;
  if (correlation.linkedExperiences.length < INSTITUTIONAL_CORRELATION_MIN_LINKED_MEMORIES) {
    return false;
  }
  return Number.isFinite(correlation.generatedAt);
}

/** Suppress noisy weak correlations unless recurrence supports the pattern. */
export function shouldRetainCorrelation(correlation: InstitutionalCorrelation): boolean {
  if (correlation.strength === "weak" && correlation.occurrenceCount < 2) return false;
  if (correlation.category === "unknown" && correlation.strength === "weak") return false;
  return validateInstitutionalCorrelation(correlation);
}

export function resetInstitutionalCorrelationGuards(): void {
  lastEvalAtByOrg.clear();
  correlationDepth = 0;
}
