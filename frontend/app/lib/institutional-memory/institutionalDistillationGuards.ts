import type {
  DistilledInstitutionalInsight,
  InsightCategory,
  MemoryCompressionLevel,
} from "./institutionalDistillationTypes";

export const INSTITUTIONAL_DISTILLATION_MAX_INSIGHTS = 24;
export const INSTITUTIONAL_DISTILLATION_MAX_ARTIFACTS = 16;
export const INSTITUTIONAL_DISTILLATION_MAX_SUMMARIES = 8;
export const INSTITUTIONAL_DISTILLATION_MAX_WISDOM = 12;
export const INSTITUTIONAL_DISTILLATION_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_DISTILLATION_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_DISTILLATION_MIN_CONFIDENCE = 0.45;
export const INSTITUTIONAL_DISTILLATION_MIN_EVIDENCE_DEPTH = 3;

const lastEvalAtByOrg = new Map<string, number>();
let distillationDepth = 0;

const VALID_COMPRESSION = new Set<MemoryCompressionLevel>([
  "raw",
  "summarized",
  "condensed",
  "distilled",
  "strategic_core",
]);

const VALID_CATEGORIES = new Set<InsightCategory>([
  "fragility",
  "resilience",
  "governance",
  "escalation",
  "recovery",
  "operational",
  "coordination",
  "strategic",
  "unknown",
]);

export function beginInstitutionalDistillation(): boolean {
  if (distillationDepth >= INSTITUTIONAL_DISTILLATION_MAX_RECURSION_DEPTH) return false;
  distillationDepth += 1;
  return true;
}

export function endInstitutionalDistillation(): void {
  distillationDepth = Math.max(0, distillationDepth - 1);
}

export function shouldEvaluateInstitutionalDistillation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_DISTILLATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateDistilledInsight(
  insight: DistilledInstitutionalInsight | null | undefined
): insight is DistilledInstitutionalInsight {
  if (!insight) return false;
  if (!insight.distilledInsightId.trim() || !insight.title.trim() || !insight.summary.trim()) {
    return false;
  }
  if (!VALID_COMPRESSION.has(insight.compressionLevel)) return false;
  if (!VALID_CATEGORIES.has(insight.category)) return false;
  if (insight.confidence < INSTITUTIONAL_DISTILLATION_MIN_CONFIDENCE) return false;
  return Number.isFinite(insight.generatedAt);
}

export function shouldRetainDistilledInsight(
  insight: DistilledInstitutionalInsight,
  evidenceDepth: number
): boolean {
  if (!validateDistilledInsight(insight)) return false;
  if (evidenceDepth < INSTITUTIONAL_DISTILLATION_MIN_EVIDENCE_DEPTH) {
    if (insight.compressionLevel === "strategic_core" || insight.compressionLevel === "distilled") {
      return false;
    }
  }
  if (insight.compressionLevel === "raw" && insight.occurrenceCount < 2) return false;
  if (insight.supportingPatterns.length === 0 && insight.confidence < 0.7) return false;
  return true;
}

export function shouldAllowCompressionLevel(
  level: MemoryCompressionLevel,
  evidenceDepth: number
): boolean {
  if (level === "strategic_core" && evidenceDepth < 5) return false;
  if (level === "distilled" && evidenceDepth < 4) return false;
  if (level === "condensed" && evidenceDepth < 3) return false;
  return true;
}

export function resetInstitutionalDistillationGuards(): void {
  lastEvalAtByOrg.clear();
  distillationDepth = 0;
}
