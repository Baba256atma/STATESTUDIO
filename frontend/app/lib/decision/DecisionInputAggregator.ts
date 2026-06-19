/**
 * D:1 — Decision Input Aggregator.
 *
 * Aggregates DS intelligence, scenario results, compare results, and war room
 * signals into a read-only DecisionInputProfile. This layer only reads source
 * intelligence; it does not recalculate source systems, mutate inputs, route,
 * render UI, or execute workflows.
 */

import {
  DECISION_INPUT_AGGREGATOR_DIAGNOSTICS,
  DECISION_INPUT_AGGREGATOR_VERSION,
  EMPTY_DECISION_INPUT_PROFILE,
  type DecisionCompareResultsSlice,
  type DecisionDsIntelligenceSlice,
  type DecisionInputAggregatorInput,
  type DecisionInputProfile,
  type DecisionScenarioResultsSlice,
  type DecisionWarRoomSignalsSlice,
} from "./decisionInputAggregatorContract.ts";

export {
  DECISION_INPUT_AGGREGATOR_DIAGNOSTIC,
  DECISION_INPUT_READY_DIAGNOSTIC,
  D1_INPUT_AGGREGATOR_COMPLETE_TAG,
  DECISION_INPUT_AGGREGATOR_VERSION,
  DECISION_INPUT_AGGREGATOR_DIAGNOSTICS,
  EMPTY_DECISION_INPUT_PROFILE,
  type DecisionCompareResultsSlice,
  type DecisionDsIntelligenceSlice,
  type DecisionInputAggregatorInput,
  type DecisionInputProfile,
  type DecisionScenarioResultsSlice,
  type DecisionWarRoomSignalsSlice,
} from "./decisionInputAggregatorContract.ts";

let latestDecisionInputProfile: DecisionInputProfile = EMPTY_DECISION_INPUT_PROFILE;

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function readinessScore(input: {
  dsProfileCount: number;
  scenarioResultCount: number;
  compareResultCount: number;
  signalCount: number;
}): number {
  const present = [
    input.dsProfileCount > 0,
    input.scenarioResultCount > 0,
    input.compareResultCount > 0,
    input.signalCount > 0,
  ].filter(Boolean).length;
  return Math.round((present / 4) * 100);
}

function buildDsIntelligenceSlice(input: DecisionInputAggregatorInput): DecisionDsIntelligenceSlice {
  const objectProfiles = Object.freeze([...(input.objectIntelligence?.profiles ?? [])]);
  const relationshipProfiles = Object.freeze([...(input.relationshipIntelligence?.profiles ?? [])]);
  const kpiProfiles = Object.freeze([...(input.kpiIntelligence?.profiles ?? [])]);
  const riskProfiles = Object.freeze([...(input.riskIntelligence?.profiles ?? [])]);

  return Object.freeze({
    objectProfiles,
    relationshipProfiles,
    kpiProfiles,
    riskProfiles,
    objectCount: objectProfiles.length,
    relationshipCount: relationshipProfiles.length,
    kpiCount: kpiProfiles.length,
    riskCount: riskProfiles.length,
    dsProfileCount:
      objectProfiles.length +
      relationshipProfiles.length +
      kpiProfiles.length +
      riskProfiles.length,
    readOnly: true as const,
    recalculation: false as const,
  });
}

function buildScenarioResultsSlice(input: DecisionInputAggregatorInput): DecisionScenarioResultsSlice {
  const scenarioResults = Object.freeze([...(input.scenarioResults ?? [])]);
  return Object.freeze({
    scenarioResults,
    scenarioResultCount: scenarioResults.length,
    averageScenarioConfidence: average(scenarioResults.map((result) => result.confidence)),
    readOnly: true as const,
    recalculation: false as const,
  });
}

function buildCompareResultsSlice(input: DecisionInputAggregatorInput): DecisionCompareResultsSlice {
  const compareResults = Object.freeze([...(input.compareResults ?? [])]);
  return Object.freeze({
    compareResults,
    compareResultCount: compareResults.length,
    differenceCount: compareResults.reduce((sum, result) => sum + result.differences.length, 0),
    readOnly: true as const,
    recalculation: false as const,
  });
}

function buildWarRoomSignalsSlice(input: DecisionInputAggregatorInput): DecisionWarRoomSignalsSlice {
  const signals = Object.freeze([...(input.warRoomSignals ?? [])]);
  return Object.freeze({
    signals,
    signalCount: signals.length,
    criticalSignalCount: signals.filter((signal) => signal.severity === "critical").length,
    readOnly: true as const,
    recalculation: false as const,
  });
}

export function aggregateDecisionInputs(input: DecisionInputAggregatorInput): DecisionInputProfile {
  const dsIntelligence = buildDsIntelligenceSlice(input);
  const scenarioResults = buildScenarioResultsSlice(input);
  const compareResults = buildCompareResultsSlice(input);
  const warRoomSignals = buildWarRoomSignalsSlice(input);
  const totalInputCount =
    dsIntelligence.dsProfileCount +
    scenarioResults.scenarioResultCount +
    compareResults.differenceCount +
    warRoomSignals.signalCount;

  latestDecisionInputProfile = Object.freeze({
    version: DECISION_INPUT_AGGREGATOR_VERSION,
    profileId: input.profileId,
    generatedAt: input.generatedAt,
    dsIntelligence,
    scenarioResults,
    compareResults,
    warRoomSignals,
    totalInputCount,
    readinessScore: readinessScore({
      dsProfileCount: dsIntelligence.dsProfileCount,
      scenarioResultCount: scenarioResults.scenarioResultCount,
      compareResultCount: compareResults.compareResultCount,
      signalCount: warRoomSignals.signalCount,
    }),
    readOnly: true as const,
    recalculation: false as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: DECISION_INPUT_AGGREGATOR_DIAGNOSTICS,
  });

  return latestDecisionInputProfile;
}

export function getDecisionInputProfile(): DecisionInputProfile {
  return latestDecisionInputProfile;
}

export function resetDecisionInputAggregatorForTests(): void {
  latestDecisionInputProfile = EMPTY_DECISION_INPUT_PROFILE;
}

export const DecisionInputAggregator = Object.freeze({
  aggregateDecisionInputs,
  getDecisionInputProfile,
  resetDecisionInputAggregatorForTests,
  diagnostics: DECISION_INPUT_AGGREGATOR_DIAGNOSTICS,
  emptyProfile: EMPTY_DECISION_INPUT_PROFILE,
});
