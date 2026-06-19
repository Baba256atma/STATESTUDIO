/**
 * D:2:3 — Uncertainty Detection Engine.
 *
 * Detects uncertainty and weak decision areas from read-only DecisionInputProfile
 * and optional DecisionRecommendation inputs. Produces UncertaintyProfile outputs
 * without mutating source systems.
 */

import type { DecisionRecommendation } from "./DecisionRecommendationContract.ts";
import type { DecisionInputProfile } from "./decisionInputAggregatorContract.ts";
import {
  EMPTY_UNCERTAINTY_DETECTION_RESULT,
  EMPTY_UNCERTAINTY_PROFILE,
  UNCERTAINTY_DETECTION_CATEGORY_LABELS,
  UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
  UNCERTAINTY_DETECTION_ENGINE_VERSION,
  type UncertaintyDetectionCategoryId,
  type UncertaintyDetectionInput,
  type UncertaintyDetectionResult,
  type UncertaintyFinding,
  type UncertaintyProfile,
} from "./uncertaintyDetectionEngineContract.ts";

export {
  D2_UNCERTAINTY_COMPLETE_TAG,
  EMPTY_UNCERTAINTY_DETECTION_RESULT,
  EMPTY_UNCERTAINTY_PROFILE,
  UNCERTAINTY_DETECTION_CATEGORY_LABELS,
  UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC,
  UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
  UNCERTAINTY_DETECTION_ENGINE_VERSION,
  UNCERTAINTY_DETECTION_READY_DIAGNOSTIC,
  type UncertaintyDetectionCategoryId,
  type UncertaintyDetectionInput,
  type UncertaintyDetectionResult,
  type UncertaintyFinding,
  type UncertaintyProfile,
} from "./uncertaintyDetectionEngineContract.ts";

let latestUncertaintyDetectionResult: UncertaintyDetectionResult =
  EMPTY_UNCERTAINTY_DETECTION_RESULT;

const LOW_SIMULATION_CONFIDENCE_THRESHOLD = 65;
const WEAK_KPI_CONFIDENCE_THRESHOLD = 60;
const WEAK_KPI_INTELLIGENCE_THRESHOLD = 40;
const WEAK_RISK_CONFIDENCE_THRESHOLD = 60;
const SCENARIO_DISAGREEMENT_CONFIDENCE_DELTA = 15;
const CONFLICTING_SIGNAL_SPREAD_THRESHOLD = 35;

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

function buildFinding(input: {
  findingId: string;
  categoryId: UncertaintyDetectionCategoryId;
  detail: string;
  severity: number;
}): UncertaintyFinding {
  return Object.freeze({
    findingId: input.findingId,
    categoryId: input.categoryId,
    label: UNCERTAINTY_DETECTION_CATEGORY_LABELS[input.categoryId],
    severity: clampScore(input.severity),
    detail: input.detail,
    readOnly: true as const,
    mutation: false as const,
  });
}

function detectMissingData(profile: DecisionInputProfile): UncertaintyFinding[] {
  const findings: UncertaintyFinding[] = [];
  const missingSlices: string[] = [];

  if (profile.dsIntelligence.dsProfileCount === 0) missingSlices.push("DS intelligence");
  if (profile.scenarioResults.scenarioResultCount === 0) missingSlices.push("scenario simulation");
  if (profile.compareResults.compareResultCount === 0) missingSlices.push("scenario compare");
  if (profile.warRoomSignals.signalCount === 0) missingSlices.push("war room signals");

  if (missingSlices.length > 0) {
    findings.push(
      buildFinding({
        findingId: "missing-data-slices",
        categoryId: "missingData",
        detail: `Missing input slices: ${missingSlices.join(", ")}.`,
        severity: clampScore(missingSlices.length * 22),
      })
    );
  }

  if (profile.readinessScore < 50) {
    findings.push(
      buildFinding({
        findingId: "missing-data-readiness",
        categoryId: "missingData",
        detail: `Decision input readiness score is below executive threshold (${profile.readinessScore}).`,
        severity: clampScore(100 - profile.readinessScore),
      })
    );
  }

  return findings;
}

function detectConflictingSignals(
  profile: DecisionInputProfile,
  recommendation: DecisionRecommendation | null | undefined
): UncertaintyFinding[] {
  const findings: UncertaintyFinding[] = [];
  const hasCriticalWarRoom = profile.warRoomSignals.criticalSignalCount > 0;
  const positiveScenarioMovement = profile.scenarioResults.scenarioResults.some(
    (result) => result.kpiMovement.direction === "positive" && result.kpiMovement.delta >= 5
  );

  if (hasCriticalWarRoom && positiveScenarioMovement) {
    findings.push(
      buildFinding({
        findingId: "conflicting-war-room-scenario",
        categoryId: "conflictingSignals",
        detail: "Critical war room pressure conflicts with positive scenario KPI movement.",
        severity: 82,
      })
    );
  }

  const compareAdvantages = profile.compareResults.compareResults.flatMap((result) =>
    result.differences.map((difference) => difference.advantage)
  );
  const hasScenarioAAdvantage = compareAdvantages.includes("scenarioA");
  const hasScenarioBAdvantage = compareAdvantages.includes("scenarioB");
  if (hasScenarioAAdvantage && hasScenarioBAdvantage) {
    findings.push(
      buildFinding({
        findingId: "conflicting-compare-advantages",
        categoryId: "conflictingSignals",
        detail: "Compare results contain opposing scenario advantages across dimensions.",
        severity: 76,
      })
    );
  }

  if (recommendation) {
    const dimensionSpread = standardDeviation(
      recommendation.score.dimensions.map((dimension) => dimension.value)
    );
    if (dimensionSpread >= CONFLICTING_SIGNAL_SPREAD_THRESHOLD) {
      findings.push(
        buildFinding({
          findingId: "conflicting-score-dimensions",
          categoryId: "conflictingSignals",
          detail: `Recommendation score dimensions diverge by ${Math.round(dimensionSpread)} points.`,
          severity: clampScore(dimensionSpread * 1.4),
        })
      );
    }

    const readinessDelta = Math.abs(recommendation.score.confidence - profile.readinessScore);
    if (readinessDelta >= 30) {
      findings.push(
        buildFinding({
          findingId: "conflicting-confidence-readiness",
          categoryId: "conflictingSignals",
          detail: `Recommendation confidence (${recommendation.score.confidence}) diverges from input readiness (${profile.readinessScore}).`,
          severity: clampScore(readinessDelta * 1.2),
        })
      );
    }
  }

  return findings;
}

function detectLowSimulationConfidence(profile: DecisionInputProfile): UncertaintyFinding[] {
  const findings: UncertaintyFinding[] = [];

  for (const [index, result] of profile.scenarioResults.scenarioResults.entries()) {
    if (result.confidence < LOW_SIMULATION_CONFIDENCE_THRESHOLD) {
      findings.push(
        buildFinding({
          findingId: `low-simulation-confidence:${index}`,
          categoryId: "lowSimulationConfidence",
          detail: `Scenario simulation confidence (${result.confidence}) is below threshold (${LOW_SIMULATION_CONFIDENCE_THRESHOLD}).`,
          severity: clampScore(100 - result.confidence),
        })
      );
    }
  }

  if (
    profile.scenarioResults.scenarioResultCount > 0 &&
    profile.scenarioResults.averageScenarioConfidence < LOW_SIMULATION_CONFIDENCE_THRESHOLD
  ) {
    findings.push(
      buildFinding({
        findingId: "low-average-simulation-confidence",
        categoryId: "lowSimulationConfidence",
        detail: `Average scenario confidence (${profile.scenarioResults.averageScenarioConfidence}) is below threshold.`,
        severity: clampScore(100 - profile.scenarioResults.averageScenarioConfidence),
      })
    );
  }

  return findings;
}

function detectWeakKpiEvidence(profile: DecisionInputProfile): UncertaintyFinding[] {
  const findings: UncertaintyFinding[] = [];
  const kpiProfiles = profile.dsIntelligence.kpiProfiles;

  if (kpiProfiles.length === 0) {
    findings.push(
      buildFinding({
        findingId: "weak-kpi-missing",
        categoryId: "weakKpiEvidence",
        detail: "No KPI intelligence profiles are available for decision evidence.",
        severity: 78,
      })
    );
    return findings;
  }

  for (const kpiProfile of kpiProfiles) {
    if (
      kpiProfile.confidence < WEAK_KPI_CONFIDENCE_THRESHOLD ||
      kpiProfile.intelligenceScore < WEAK_KPI_INTELLIGENCE_THRESHOLD
    ) {
      findings.push(
        buildFinding({
          findingId: `weak-kpi:${kpiProfile.kpiId}`,
          categoryId: "weakKpiEvidence",
          detail: `KPI ${kpiProfile.label} has weak evidence (confidence ${kpiProfile.confidence}, intelligence score ${kpiProfile.intelligenceScore}).`,
          severity: clampScore(
            100 -
              average([kpiProfile.confidence, kpiProfile.intelligenceScore]) * 0.85
          ),
        })
      );
    }
  }

  return findings;
}

function detectWeakRiskEvidence(profile: DecisionInputProfile): UncertaintyFinding[] {
  const findings: UncertaintyFinding[] = [];
  const riskProfiles = profile.dsIntelligence.riskProfiles;
  const hasRiskSignals = profile.warRoomSignals.signals.some((signal) => signal.source === "risk");

  if (riskProfiles.length === 0) {
    findings.push(
      buildFinding({
        findingId: "weak-risk-missing",
        categoryId: "weakRiskEvidence",
        detail: hasRiskSignals
          ? "Risk war room signals exist without supporting risk intelligence profiles."
          : "No risk intelligence profiles are available for decision evidence.",
        severity: hasRiskSignals ? 84 : 72,
      })
    );
    return findings;
  }

  for (const riskProfile of riskProfiles) {
    if (riskProfile.confidence < WEAK_RISK_CONFIDENCE_THRESHOLD) {
      findings.push(
        buildFinding({
          findingId: `weak-risk:${riskProfile.riskId}`,
          categoryId: "weakRiskEvidence",
          detail: `Risk ${riskProfile.label} has weak evidence confidence (${riskProfile.confidence}).`,
          severity: clampScore(100 - riskProfile.confidence),
        })
      );
    }
  }

  return findings;
}

function detectScenarioDisagreement(profile: DecisionInputProfile): UncertaintyFinding[] {
  const findings: UncertaintyFinding[] = [];

  for (const result of profile.compareResults.compareResults) {
    const confidenceDeltas = result.differences.map((difference) =>
      Math.abs(difference.confidenceDelta)
    );
    const maxConfidenceDelta = confidenceDeltas.length > 0 ? Math.max(...confidenceDeltas) : 0;

    if (maxConfidenceDelta >= SCENARIO_DISAGREEMENT_CONFIDENCE_DELTA) {
      findings.push(
        buildFinding({
          findingId: `scenario-disagreement:${result.request.comparisonId}`,
          categoryId: "scenarioDisagreement",
          detail: `Scenario comparison ${result.request.comparisonId} shows confidence disagreement (delta ${maxConfidenceDelta}).`,
          severity: clampScore(maxConfidenceDelta * 3.5),
        })
      );
    }

    const advantages = new Set(result.differences.map((difference) => difference.advantage));
    if (advantages.has("scenarioA") && advantages.has("scenarioB")) {
      findings.push(
        buildFinding({
          findingId: `scenario-disagreement-advantage:${result.request.comparisonId}`,
          categoryId: "scenarioDisagreement",
          detail: `Scenario comparison ${result.request.comparisonId} reports mixed scenario advantages.`,
          severity: 80,
        })
      );
    }
  }

  return findings;
}

export function detectUncertaintyFindings(input: UncertaintyDetectionInput): readonly UncertaintyFinding[] {
  return Object.freeze([
    ...detectMissingData(input.inputProfile),
    ...detectConflictingSignals(input.inputProfile, input.recommendation),
    ...detectLowSimulationConfidence(input.inputProfile),
    ...detectWeakKpiEvidence(input.inputProfile),
    ...detectWeakRiskEvidence(input.inputProfile),
    ...detectScenarioDisagreement(input.inputProfile),
  ]);
}

export function buildUncertaintyProfile(input: UncertaintyDetectionInput): UncertaintyProfile {
  const findings = detectUncertaintyFindings(input);
  const detectedCategories = Object.freeze(
    Array.from(new Set(findings.map((finding) => finding.categoryId)))
  );
  const aggregateUncertainty =
    findings.length === 0
      ? 0
      : clampScore(average(findings.map((finding) => finding.severity)));
  const evidenceGapCount = findings.filter((finding) => finding.categoryId === "missingData").length;
  const weakAreaCount = findings.filter(
    (finding) =>
      finding.categoryId === "weakKpiEvidence" ||
      finding.categoryId === "weakRiskEvidence" ||
      finding.categoryId === "lowSimulationConfidence"
  ).length;

  return Object.freeze({
    version: UNCERTAINTY_DETECTION_ENGINE_VERSION,
    profileId: input.inputProfile.profileId
      ? `uncertainty:${input.inputProfile.profileId}`
      : "",
    evaluatedAt: input.evaluatedAt,
    recommendationId: input.recommendation?.recommendationId ?? null,
    findings,
    findingCount: findings.length,
    aggregateUncertainty,
    evidenceGapCount,
    weakAreaCount,
    detectedCategories,
    supportsMissingDataDetection: true as const,
    supportsConflictingSignalsDetection: true as const,
    supportsLowSimulationConfidenceDetection: true as const,
    supportsWeakKpiEvidenceDetection: true as const,
    supportsWeakRiskEvidenceDetection: true as const,
    supportsScenarioDisagreementDetection: true as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
  });
}

export function evaluateUncertainty(input: UncertaintyDetectionInput): UncertaintyDetectionResult {
  const profile = buildUncertaintyProfile(input);

  latestUncertaintyDetectionResult = Object.freeze({
    version: UNCERTAINTY_DETECTION_ENGINE_VERSION,
    evaluatedAt: input.evaluatedAt,
    profileId: input.inputProfile.profileId,
    recommendationId: input.recommendation?.recommendationId ?? null,
    profile,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
  });

  return latestUncertaintyDetectionResult;
}

export function getUncertaintyDetectionResult(): UncertaintyDetectionResult {
  return latestUncertaintyDetectionResult;
}

export function resetUncertaintyDetectionEngineForTests(): void {
  latestUncertaintyDetectionResult = EMPTY_UNCERTAINTY_DETECTION_RESULT;
}

export const UncertaintyDetectionEngine = Object.freeze({
  detectUncertaintyFindings,
  buildUncertaintyProfile,
  evaluateUncertainty,
  getUncertaintyDetectionResult,
  resetUncertaintyDetectionEngineForTests,
  diagnostics: UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
  emptyProfile: EMPTY_UNCERTAINTY_PROFILE,
  emptyResult: EMPTY_UNCERTAINTY_DETECTION_RESULT,
});
