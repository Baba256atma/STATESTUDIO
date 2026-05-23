import type {
  ExecutiveReliabilitySnapshot,
  ExecutiveTrustArtifact,
  ExecutiveTrustEvaluation,
  RuntimeConsistencyAnalysis,
  TrustRiskClassification,
} from "./executiveReliabilityTypes.ts";

function validScore(score: number): boolean {
  return Number.isFinite(score) && score >= 0 && score <= 1;
}

export function validateExecutiveTrustArtifact(
  artifact: ExecutiveTrustArtifact | null | undefined
): artifact is ExecutiveTrustArtifact {
  if (!artifact) return false;
  if (!artifact.artifactId.trim() || !artifact.title.trim()) return false;
  if (!artifact.conclusion.trim()) return false;
  if (!Number.isFinite(artifact.generatedAt)) return false;
  return validScore(artifact.confidenceScore);
}

export function validateExecutiveTrustEvaluation(
  evaluation: ExecutiveTrustEvaluation | null | undefined
): evaluation is ExecutiveTrustEvaluation {
  if (!evaluation) return false;
  if (!evaluation.evaluationId.trim() || !evaluation.artifactId.trim() || !evaluation.signature.trim()) return false;
  if (!Number.isFinite(evaluation.generatedAt)) return false;
  return validScore(evaluation.trustScore);
}

export function validateRuntimeConsistencyAnalysis(
  analysis: RuntimeConsistencyAnalysis | null | undefined
): analysis is RuntimeConsistencyAnalysis {
  if (!analysis) return false;
  if (!analysis.signature.trim()) return false;
  return Number.isFinite(analysis.generatedAt);
}

export function validateTrustRiskClassification(
  risk: TrustRiskClassification | null | undefined
): risk is TrustRiskClassification {
  if (!risk) return false;
  return Boolean(risk.riskId.trim() && risk.source.trim() && risk.reason.trim() && risk.recommendedNextAction.trim());
}

export function validateExecutiveReliabilitySnapshot(
  snapshot: ExecutiveReliabilitySnapshot | null | undefined
): snapshot is ExecutiveReliabilitySnapshot {
  if (!snapshot) return false;
  if (!snapshot.snapshotId.trim() || !snapshot.organizationId.trim() || !snapshot.signature.trim()) return false;
  if (!snapshot.answer.trim()) return false;
  if (!Number.isFinite(snapshot.generatedAt)) return false;
  if (!validScore(snapshot.summary.trustScore)) return false;
  if (!validateRuntimeConsistencyAnalysis(snapshot.consistency)) return false;
  return snapshot.evaluations.every(validateExecutiveTrustEvaluation) &&
    snapshot.risks.every(validateTrustRiskClassification);
}

