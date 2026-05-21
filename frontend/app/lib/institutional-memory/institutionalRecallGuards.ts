import type {
  InstitutionalRecallResult,
  OperationalSimilarityLevel,
  RecallCategory,
} from "./institutionalRecallTypes";

export const INSTITUTIONAL_RECALL_MAX_RESULTS = 24;
export const INSTITUTIONAL_RECALL_MAX_FRAMES = 12;
export const INSTITUTIONAL_RECALL_MAX_REFERENCES = 8;
export const INSTITUTIONAL_RECALL_MAX_MATCHES = 16;
export const INSTITUTIONAL_RECALL_MAX_RECONSTRUCTIONS = 12;
export const INSTITUTIONAL_RECALL_MAX_SIMILARITY_SCORES = 16;
export const INSTITUTIONAL_RECALL_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_RECALL_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_RECALL_MIN_CONFIDENCE = 0.45;
export const INSTITUTIONAL_RECALL_MIN_EVIDENCE_DEPTH = 3;

const lastEvalAtByOrg = new Map<string, number>();
let recallDepth = 0;

const VALID_SIMILARITY = new Set<OperationalSimilarityLevel>([
  "weak",
  "moderate",
  "strong",
  "highly_similar",
]);

const VALID_CATEGORIES = new Set<RecallCategory>([
  "fragility",
  "escalation",
  "governance",
  "recovery",
  "resilience",
  "operational",
  "coordination",
  "strategic",
  "unknown",
]);

export function beginInstitutionalRecall(): boolean {
  if (recallDepth >= INSTITUTIONAL_RECALL_MAX_RECURSION_DEPTH) return false;
  recallDepth += 1;
  return true;
}

export function endInstitutionalRecall(): void {
  recallDepth = Math.max(0, recallDepth - 1);
}

export function shouldEvaluateInstitutionalRecall(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_RECALL_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateInstitutionalRecall(
  recall: InstitutionalRecallResult | null | undefined
): recall is InstitutionalRecallResult {
  if (!recall) return false;
  if (!recall.recallId.trim() || !recall.title.trim() || !recall.summary.trim()) return false;
  if (!VALID_SIMILARITY.has(recall.similarityLevel)) return false;
  if (!VALID_CATEGORIES.has(recall.category)) return false;
  if (recall.confidence < INSTITUTIONAL_RECALL_MIN_CONFIDENCE) return false;
  return Number.isFinite(recall.generatedAt);
}

export function shouldRetainInstitutionalRecall(
  recall: InstitutionalRecallResult,
  evidenceDepth: number
): boolean {
  if (!validateInstitutionalRecall(recall)) return false;
  if (recall.similarityLevel === "weak" && recall.occurrenceCount < 2) return false;
  if (recall.similarityLevel === "highly_similar" && evidenceDepth < 4) return false;
  if (recall.relatedMemories.length === 0 && recall.confidence < 0.7) return false;
  return true;
}

export function similarityRank(level: OperationalSimilarityLevel): number {
  const ranks: Record<OperationalSimilarityLevel, number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    highly_similar: 4,
  };
  return ranks[level];
}

export function resetInstitutionalRecallGuards(): void {
  lastEvalAtByOrg.clear();
  recallDepth = 0;
}
