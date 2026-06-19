/**
 * D:2:2 — Evidence Strength Engine.
 *
 * Measures evidence strength behind D:1 recommendations from read-only
 * DecisionInputProfile intelligence, DecisionRecommendation, and
 * DecisionExplanation inputs. Produces normalized EvidenceStrengthScore
 * outputs without mutating source systems.
 */

import type { DecisionExplanation, DecisionRecommendation } from "./DecisionRecommendationContract.ts";
import type { DecisionInputProfile } from "./decisionInputAggregatorContract.ts";
import {
  EMPTY_EVIDENCE_STRENGTH_RESULT,
  EVIDENCE_STRENGTH_DIMENSION_WEIGHTS,
  EVIDENCE_STRENGTH_ENGINE_DIAGNOSTICS,
  EVIDENCE_STRENGTH_ENGINE_VERSION,
  type EvidenceStrengthDimension,
  type EvidenceStrengthDimensionId,
  type EvidenceStrengthInput,
  type EvidenceStrengthResult,
  type EvidenceStrengthScore,
} from "./evidenceStrengthEngineContract.ts";

export {
  D2_EVIDENCE_STRENGTH_COMPLETE_TAG,
  EMPTY_EVIDENCE_STRENGTH_RESULT,
  EVIDENCE_STRENGTH_DIMENSION_WEIGHTS,
  EVIDENCE_STRENGTH_ENGINE_DIAGNOSTIC,
  EVIDENCE_STRENGTH_ENGINE_DIAGNOSTICS,
  EVIDENCE_STRENGTH_ENGINE_VERSION,
  EVIDENCE_STRENGTH_READY_DIAGNOSTIC,
  type EvidenceStrengthDimension,
  type EvidenceStrengthDimensionId,
  type EvidenceStrengthInput,
  type EvidenceStrengthResult,
  type EvidenceStrengthScore,
} from "./evidenceStrengthEngineContract.ts";

let latestEvidenceStrengthResult: EvidenceStrengthResult = EMPTY_EVIDENCE_STRENGTH_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function severityWeight(severity: "info" | "watch" | "warning" | "critical"): number {
  if (severity === "critical") return 100;
  if (severity === "warning") return 72;
  if (severity === "watch") return 42;
  return 16;
}

function collectKnownEvidenceSourceIds(profile: DecisionInputProfile): ReadonlySet<string> {
  return new Set([
    ...profile.dsIntelligence.objectProfiles.map((entry) => entry.objectId),
    ...profile.dsIntelligence.relationshipProfiles.map((entry) => entry.relationshipId),
    ...profile.dsIntelligence.kpiProfiles.map((entry) => entry.kpiId),
    ...profile.dsIntelligence.riskProfiles.map((entry) => entry.riskId),
    ...profile.warRoomSignals.signals.map((signal) => signal.signalId),
    ...profile.warRoomSignals.signals.map((signal) => signal.sourceId),
    ...profile.scenarioResults.scenarioResults.flatMap((result) => [
      ...result.keyPositiveEffects,
      ...result.keyNegativeEffects,
    ]),
  ]);
}

function scoreDataCompleteness(
  profile: DecisionInputProfile,
  explanation: DecisionExplanation
): number {
  const sliceScores = [
    profile.dsIntelligence.dsProfileCount > 0 ? 100 : 0,
    profile.scenarioResults.scenarioResultCount > 0 ? 100 : 0,
    profile.compareResults.compareResultCount > 0 ? 100 : 0,
    profile.warRoomSignals.signalCount > 0 ? 100 : 0,
  ];
  const sliceAverage = average(sliceScores);
  const evidenceBonus = Math.min(20, explanation.evidenceIds.length * 5);
  const readinessContribution = profile.readinessScore * 0.15;
  return clampScore(sliceAverage * 0.65 + evidenceBonus + readinessContribution);
}

function scoreSignalConsistency(
  profile: DecisionInputProfile,
  recommendation: DecisionRecommendation,
  explanation: DecisionExplanation
): number {
  const dimensionValues = recommendation.score.dimensions.map((dimension) => dimension.value);
  const dimensionSpread = standardDeviation(dimensionValues);
  const consistencyFromDimensions = clampScore(100 - dimensionSpread * 1.5);

  const knownSources = collectKnownEvidenceSourceIds(profile);
  const alignedEvidence =
    explanation.evidenceIds.length === 0
      ? 0
      : explanation.evidenceIds.filter((evidenceId) => knownSources.has(evidenceId)).length;
  const alignmentScore =
    explanation.evidenceIds.length === 0
      ? 35
      : clampScore((alignedEvidence / explanation.evidenceIds.length) * 100);

  const readinessDelta = Math.abs(recommendation.score.confidence - profile.readinessScore);
  const readinessAlignment = clampScore(100 - readinessDelta * 0.45);

  return clampScore((consistencyFromDimensions + alignmentScore + readinessAlignment) / 3);
}

function scoreSimulationCoverage(profile: DecisionInputProfile): number {
  const scenarioResults = profile.scenarioResults.scenarioResults;
  if (scenarioResults.length === 0) return 0;

  const coverageScores = scenarioResults.map((result) => {
    const entityCoverage = average([
      result.objectCount > 0 ? 100 : 0,
      result.relationshipCount > 0 ? 100 : 0,
      result.kpiCount > 0 ? 100 : 0,
      result.riskCount > 0 ? 100 : 0,
    ]);
    return clampScore(entityCoverage * 0.55 + result.confidence * 0.45);
  });

  const countBoost = Math.min(10, scenarioResults.length * 3);
  return clampScore(average(coverageScores) + countBoost);
}

function scoreCompareCoverage(profile: DecisionInputProfile): number {
  const { compareResults, compareResultCount, differenceCount } = profile.compareResults;
  if (compareResultCount === 0) return 0;

  const presenceScore = clampScore(Math.min(100, compareResultCount * 35 + differenceCount * 8));
  const confidenceScores = compareResults.flatMap((result) =>
    result.differences.map((difference) => clampScore(100 - Math.abs(difference.confidenceDelta) * 4))
  );
  const confidenceScore = confidenceScores.length > 0 ? average(confidenceScores) : 50;
  return clampScore(presenceScore * 0.55 + confidenceScore * 0.45);
}

function scoreWarRoomSignalStrength(
  profile: DecisionInputProfile,
  explanation: DecisionExplanation
): number {
  const { signals, signalCount, criticalSignalCount } = profile.warRoomSignals;
  if (signalCount === 0) return 0;

  const base = average(
    signals.map((signal) => severityWeight(signal.severity) * 0.55 + signal.confidence * 0.45)
  );
  const criticalBoost = Math.min(12, criticalSignalCount * 4);
  const evidenceBoost = explanation.evidenceIds.some((evidenceId) =>
    signals.some((signal) => signal.signalId === evidenceId || signal.sourceId === evidenceId)
  )
    ? 8
    : 0;

  return clampScore(base + criticalBoost + evidenceBoost);
}

function buildDimension(
  dimensionId: EvidenceStrengthDimensionId,
  label: string,
  value: number
): EvidenceStrengthDimension {
  return Object.freeze({
    dimensionId,
    label,
    value: clampScore(value),
    weight: EVIDENCE_STRENGTH_DIMENSION_WEIGHTS[dimensionId],
    readOnly: true as const,
    mutation: false as const,
  });
}

function weightedAverage(dimensions: readonly EvidenceStrengthDimension[]): number {
  const totalWeight = dimensions.reduce((sum, dimension) => sum + dimension.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = dimensions.reduce((sum, dimension) => sum + dimension.value * dimension.weight, 0);
  return clampScore(weighted / totalWeight);
}

export function measureEvidenceStrength(input: EvidenceStrengthInput): EvidenceStrengthScore {
  const dimensions = Object.freeze([
    buildDimension(
      "dataCompleteness",
      "Data Completeness",
      scoreDataCompleteness(input.inputProfile, input.explanation)
    ),
    buildDimension(
      "signalConsistency",
      "Signal Consistency",
      scoreSignalConsistency(input.inputProfile, input.recommendation, input.explanation)
    ),
    buildDimension(
      "simulationCoverage",
      "Simulation Coverage",
      scoreSimulationCoverage(input.inputProfile)
    ),
    buildDimension(
      "compareCoverage",
      "Compare Coverage",
      scoreCompareCoverage(input.inputProfile)
    ),
    buildDimension(
      "warRoomSignalStrength",
      "War Room Signal Strength",
      scoreWarRoomSignalStrength(input.inputProfile, input.explanation)
    ),
  ]);

  return Object.freeze({
    scoreId: `evidence-strength:${input.recommendation.recommendationId}:${input.evaluatedAt}`,
    recommendationId: input.recommendation.recommendationId,
    optionId: input.recommendation.option.optionId,
    value: weightedAverage(dimensions),
    evidenceCount: input.explanation.evidenceIds.length,
    dimensions,
    readOnly: true as const,
    mutation: false as const,
  });
}

export function evaluateEvidenceStrength(input: EvidenceStrengthInput): EvidenceStrengthResult {
  const score = measureEvidenceStrength(input);

  latestEvidenceStrengthResult = Object.freeze({
    version: EVIDENCE_STRENGTH_ENGINE_VERSION,
    evaluatedAt: input.evaluatedAt,
    profileId: input.inputProfile.profileId,
    recommendationId: input.recommendation.recommendationId,
    score,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: EVIDENCE_STRENGTH_ENGINE_DIAGNOSTICS,
  });

  return latestEvidenceStrengthResult;
}

export function getEvidenceStrengthResult(): EvidenceStrengthResult {
  return latestEvidenceStrengthResult;
}

export function resetEvidenceStrengthEngineForTests(): void {
  latestEvidenceStrengthResult = EMPTY_EVIDENCE_STRENGTH_RESULT;
}

export const EvidenceStrengthEngine = Object.freeze({
  measureEvidenceStrength,
  evaluateEvidenceStrength,
  getEvidenceStrengthResult,
  resetEvidenceStrengthEngineForTests,
  diagnostics: EVIDENCE_STRENGTH_ENGINE_DIAGNOSTICS,
  dimensionWeights: EVIDENCE_STRENGTH_DIMENSION_WEIGHTS,
  emptyResult: EMPTY_EVIDENCE_STRENGTH_RESULT,
});
