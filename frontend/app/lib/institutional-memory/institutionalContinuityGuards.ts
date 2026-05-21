import type {
  ContinuityLevel,
  InstitutionalWisdomArtifact,
  StrategicWisdomCategory,
} from "./institutionalContinuityTypes";

export const INSTITUTIONAL_CONTINUITY_MAX_ARTIFACTS = 20;
export const INSTITUTIONAL_CONTINUITY_MAX_RECORDS = 12;
export const INSTITUTIONAL_CONTINUITY_MAX_SIGNALS = 12;
export const INSTITUTIONAL_CONTINUITY_MAX_ANCHORS = 12;
export const INSTITUTIONAL_CONTINUITY_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_CONTINUITY_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_CONTINUITY_MIN_CONFIDENCE = 0.5;
export const INSTITUTIONAL_CONTINUITY_MIN_EVIDENCE_DEPTH = 5;
export const INSTITUTIONAL_CONTINUITY_MIN_OCCURRENCE_FOR_FOUNDATIONAL = 2;

const lastEvalAtByOrg = new Map<string, number>();
let continuityDepth = 0;

const VALID_CONTINUITY = new Set<ContinuityLevel>([
  "temporary",
  "retained",
  "persistent",
  "institutionalized",
  "foundational",
]);

const VALID_CATEGORIES = new Set<StrategicWisdomCategory>([
  "fragility",
  "resilience",
  "governance",
  "recovery",
  "operational",
  "coordination",
  "escalation",
  "strategic",
  "unknown",
]);

export function beginInstitutionalContinuityEvaluation(): boolean {
  if (continuityDepth >= INSTITUTIONAL_CONTINUITY_MAX_RECURSION_DEPTH) return false;
  continuityDepth += 1;
  return true;
}

export function endInstitutionalContinuityEvaluation(): void {
  continuityDepth = Math.max(0, continuityDepth - 1);
}

export function shouldEvaluateInstitutionalContinuity(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_CONTINUITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateWisdomArtifact(
  artifact: InstitutionalWisdomArtifact | null | undefined
): artifact is InstitutionalWisdomArtifact {
  if (!artifact) return false;
  if (!artifact.wisdomArtifactId.trim() || !artifact.title.trim() || !artifact.summary.trim()) {
    return false;
  }
  if (!VALID_CONTINUITY.has(artifact.continuityLevel)) return false;
  if (!VALID_CATEGORIES.has(artifact.category)) return false;
  if (artifact.confidence < INSTITUTIONAL_CONTINUITY_MIN_CONFIDENCE) return false;
  return Number.isFinite(artifact.generatedAt);
}

export function continuityRank(level: ContinuityLevel): number {
  const ranks: Record<ContinuityLevel, number> = {
    temporary: 1,
    retained: 2,
    persistent: 3,
    institutionalized: 4,
    foundational: 5,
  };
  return ranks[level];
}

export function shouldRetainWisdomArtifact(
  artifact: InstitutionalWisdomArtifact,
  evidenceDepth: number
): boolean {
  if (!validateWisdomArtifact(artifact)) return false;
  if (artifact.continuityLevel === "foundational" && evidenceDepth < 6) return false;
  if (artifact.continuityLevel === "institutionalized" && evidenceDepth < 5) return false;
  if (artifact.continuityLevel === "temporary" && artifact.occurrenceCount < 2) return false;
  if (artifact.supportingPatterns.length === 0 && artifact.confidence < 0.75) return false;
  return true;
}

export function shouldAllowContinuityPromotion(
  proposed: ContinuityLevel,
  evidenceDepth: number,
  occurrenceCount: number
): boolean {
  if (proposed === "foundational" && (evidenceDepth < 6 || occurrenceCount < 2)) return false;
  if (proposed === "institutionalized" && evidenceDepth < 5) return false;
  if (proposed === "persistent" && evidenceDepth < 4) return false;
  return true;
}

export function resetInstitutionalContinuityGuards(): void {
  lastEvalAtByOrg.clear();
  continuityDepth = 0;
}
