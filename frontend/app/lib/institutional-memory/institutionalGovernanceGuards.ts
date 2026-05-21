import type {
  CognitiveGovernanceStatus,
  InstitutionalLearningGovernanceSnapshot,
  IntegrityLevel,
  TrustCategory,
} from "./institutionalGovernanceTypes";

export const INSTITUTIONAL_GOVERNANCE_MAX_SNAPSHOTS = 16;
export const INSTITUTIONAL_GOVERNANCE_MAX_SIGNALS = 16;
export const INSTITUTIONAL_GOVERNANCE_MAX_VALIDATIONS = 12;
export const INSTITUTIONAL_GOVERNANCE_MAX_OBSERVATIONS = 12;
export const INSTITUTIONAL_GOVERNANCE_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_GOVERNANCE_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_GOVERNANCE_MIN_CONFIDENCE = 0.45;
export const INSTITUTIONAL_GOVERNANCE_MAX_LAYER_DEPTH = 48;
export const INSTITUTIONAL_GOVERNANCE_AMPLIFICATION_THRESHOLD = 28;

const lastEvalAtByOrg = new Map<string, number>();
let governanceDepth = 0;

const VALID_STATUS = new Set<CognitiveGovernanceStatus>([
  "stable",
  "monitored",
  "degraded",
  "unstable",
  "recovering",
]);

const VALID_INTEGRITY = new Set<IntegrityLevel>([
  "weak",
  "moderate",
  "strong",
  "verified",
]);

const VALID_TRUST = new Set<TrustCategory>([
  "memory_consistency",
  "correlation_validity",
  "resilience_integrity",
  "governance_stability",
  "strategic_reliability",
  "operational_coherence",
  "unknown",
]);

export function beginInstitutionalGovernanceEvaluation(): boolean {
  if (governanceDepth >= INSTITUTIONAL_GOVERNANCE_MAX_RECURSION_DEPTH) return false;
  governanceDepth += 1;
  return true;
}

export function endInstitutionalGovernanceEvaluation(): void {
  governanceDepth = Math.max(0, governanceDepth - 1);
}

export function shouldEvaluateInstitutionalGovernance(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_GOVERNANCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateGovernanceSnapshot(
  snapshot: InstitutionalLearningGovernanceSnapshot | null | undefined
): snapshot is InstitutionalLearningGovernanceSnapshot {
  if (!snapshot) return false;
  if (!snapshot.governanceSnapshotId.trim() || !snapshot.summary.trim()) return false;
  if (!VALID_STATUS.has(snapshot.governanceStatus)) return false;
  if (!VALID_INTEGRITY.has(snapshot.integrityLevel)) return false;
  if (snapshot.confidence < INSTITUTIONAL_GOVERNANCE_MIN_CONFIDENCE) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function integrityRank(level: IntegrityLevel): number {
  const ranks: Record<IntegrityLevel, number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    verified: 4,
  };
  return ranks[level];
}

export function statusSeverity(status: CognitiveGovernanceStatus): number {
  const ranks: Record<CognitiveGovernanceStatus, number> = {
    stable: 5,
    recovering: 4,
    monitored: 3,
    degraded: 2,
    unstable: 1,
  };
  return ranks[status];
}

export function shouldRetainGovernanceSnapshot(
  snapshot: InstitutionalLearningGovernanceSnapshot
): boolean {
  if (!validateGovernanceSnapshot(snapshot)) return false;
  if (snapshot.integrityLevel === "verified" && snapshot.observations.length < 2) return false;
  return true;
}

export function shouldAllowIntegrityPromotion(
  proposed: IntegrityLevel,
  layerDepth: number
): boolean {
  if (proposed === "verified" && layerDepth < 6) return false;
  if (proposed === "strong" && layerDepth < 4) return false;
  return true;
}

export function resetInstitutionalGovernanceGuards(): void {
  lastEvalAtByOrg.clear();
  governanceDepth = 0;
}
