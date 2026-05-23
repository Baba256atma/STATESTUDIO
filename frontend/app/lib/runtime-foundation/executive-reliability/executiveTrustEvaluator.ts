import { confidenceLevelFromScore } from "../../confidence/confidenceNarratives.ts";
import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveTrustArtifact,
  ExecutiveTrustEvaluation,
  ReliabilityState,
} from "./executiveReliabilityTypes.ts";

export function clampTrustScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Number(Math.min(1, Math.max(0, score)).toFixed(2));
}

export function reliabilityStateFromTrustScore(score: number): ReliabilityState {
  const safe = clampTrustScore(score);
  if (safe >= 0.78) return "stable";
  if (safe >= 0.58) return "recovering";
  if (safe >= 0.36) return "degraded";
  return "unstable";
}

function validationPenalty(artifact: ExecutiveTrustArtifact): number {
  let penalty = 0;
  if (artifact.validationState === "invalid") penalty += 0.28;
  else if (artifact.validationState === "warning") penalty += 0.1;
  else if (artifact.validationState === "unknown" || !artifact.validationState) penalty += 0.06;
  if (artifact.contractValid === false) penalty += 0.18;
  if (artifact.executionChainComplete === false) penalty += 0.16;
  penalty += Math.min(0.24, (artifact.warningIndicators?.length ?? 0) * 0.06);
  return penalty;
}

function supportBoost(artifact: ExecutiveTrustArtifact): number {
  return Math.min(0.12, (artifact.supportingFactors?.length ?? 0) * 0.03);
}

export function evaluateExecutiveTrustArtifact(
  artifact: ExecutiveTrustArtifact,
  now = artifact.observedAt ?? artifact.generatedAt
): ExecutiveTrustEvaluation {
  const base = clampTrustScore(artifact.confidenceScore);
  const trustScore = clampTrustScore(base + supportBoost(artifact) - validationPenalty(artifact));
  const warningIndicators = [
    ...(artifact.warningIndicators ?? []),
    ...(artifact.validationState === "invalid" ? ["Validation failed for this executive-facing result."] : []),
    ...(artifact.contractValid === false ? ["Panel or output contract is not valid."] : []),
    ...(artifact.executionChainComplete === false ? ["Execution chain is incomplete."] : []),
  ];
  const supportingFactors = artifact.supportingFactors?.length
    ? [...artifact.supportingFactors]
    : ["Current output supplied deterministic confidence evidence."];
  const signature = stableSignature([
    "d10-executive-trust-evaluation",
    artifact.artifactId,
    artifact.sourceType,
    trustScore,
    warningIndicators,
  ]);

  return {
    evaluationId: stableSignature(["d10-trust-evaluation", artifact.artifactId]).slice(0, 56),
    artifactId: artifact.artifactId,
    sourceType: artifact.sourceType,
    trustScore,
    confidenceLevel: confidenceLevelFromScore(trustScore),
    reliabilityState: reliabilityStateFromTrustScore(trustScore),
    supportingFactors: Object.freeze(supportingFactors),
    warningIndicators: Object.freeze(warningIndicators),
    generatedAt: now,
    signature,
  };
}

export function evaluateExecutiveTrustArtifacts(
  artifacts: readonly ExecutiveTrustArtifact[],
  now: number
): readonly ExecutiveTrustEvaluation[] {
  return Object.freeze(
    [...artifacts]
      .sort((a, b) => a.artifactId.localeCompare(b.artifactId))
      .map((artifact) => evaluateExecutiveTrustArtifact(artifact, now))
  );
}

