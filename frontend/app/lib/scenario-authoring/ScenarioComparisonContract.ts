/**
 * C:1 — Canonical Compare Engine contract.
 *
 * Immutable read-only contracts for comparing Scenario A vs Scenario B or a
 * Scenario vs Baseline. No comparison execution, UI rendering, routing, scene,
 * topology, DS, object, or scenario mutation authority.
 */

import type { ExecutiveSimulationSummary } from "./simulationResultAggregatorContract.ts";

export const COMPARE_CONTRACT_DIAGNOSTIC = "[COMPARE_CONTRACT]" as const;

export const COMPARE_CONTRACT_READY_DIAGNOSTIC = "[COMPARE_CONTRACT_READY]" as const;

export const C1_COMPARE_CONTRACT_COMPLETE_TAG = "[C1_COMPARE_CONTRACT_COMPLETE]" as const;

export const SCENARIO_COMPARISON_CONTRACT_VERSION = "1.0.0" as const;

export type ScenarioComparisonMode = "scenario_vs_scenario" | "scenario_vs_baseline";

export type ScenarioComparisonSubject = Readonly<{
  scenarioId: string;
  label: string;
  summary: ExecutiveSimulationSummary;
  baseline: boolean;
}>;

export type ScenarioComparisonRequest = Readonly<{
  comparisonId: string;
  mode: ScenarioComparisonMode;
  scenarioA: ScenarioComparisonSubject;
  scenarioB: ScenarioComparisonSubject;
  readOnly: true;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  objectMutation: false;
}>;

export type ScenarioDifferenceProfile = Readonly<{
  differenceId: string;
  category?: "object" | "relationship" | "kpi" | "risk" | "overall";
  scenarioAId: string;
  scenarioBId: string;
  overallImpactDelta: number;
  riskMovementDelta: number;
  kpiMovementDelta: number;
  confidenceDelta: number;
  objectCountDelta: number;
  relationshipCountDelta: number;
  kpiCountDelta: number;
  riskCountDelta: number;
  advantage: "scenarioA" | "scenarioB" | "neutral";
  summary: string;
  readOnly: true;
  mutation: false;
}>;

export type ScenarioComparisonResult = Readonly<{
  version: typeof SCENARIO_COMPARISON_CONTRACT_VERSION;
  request: ScenarioComparisonRequest;
  differences: readonly ScenarioDifferenceProfile[];
  primaryDifference: ScenarioDifferenceProfile | null;
  comparedScenarioIds: readonly [string, string];
  supportsScenarioVsScenario: true;
  supportsScenarioVsBaseline: true;
  readOnly: true;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  objectMutation: false;
  diagnostics: readonly [
    typeof COMPARE_CONTRACT_DIAGNOSTIC,
    typeof COMPARE_CONTRACT_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioComparisonContract = Readonly<{
  version: typeof SCENARIO_COMPARISON_CONTRACT_VERSION;
  supportsScenarioVsScenario: true;
  supportsScenarioVsBaseline: true;
  requestContract: "ScenarioComparisonRequest";
  resultContract: "ScenarioComparisonResult";
  differenceContract: "ScenarioDifferenceProfile";
  readOnly: true;
  mutation: false;
  diagnostics: readonly [
    typeof COMPARE_CONTRACT_DIAGNOSTIC,
    typeof COMPARE_CONTRACT_READY_DIAGNOSTIC,
  ];
}>;

export const SCENARIO_COMPARISON_DIAGNOSTICS = Object.freeze([
  COMPARE_CONTRACT_DIAGNOSTIC,
  COMPARE_CONTRACT_READY_DIAGNOSTIC,
] as const);

export const SCENARIO_COMPARISON_CONTRACT: ScenarioComparisonContract = Object.freeze({
  version: SCENARIO_COMPARISON_CONTRACT_VERSION,
  supportsScenarioVsScenario: true,
  supportsScenarioVsBaseline: true,
  requestContract: "ScenarioComparisonRequest",
  resultContract: "ScenarioComparisonResult",
  differenceContract: "ScenarioDifferenceProfile",
  readOnly: true,
  mutation: false,
  diagnostics: SCENARIO_COMPARISON_DIAGNOSTICS,
});

function freezeSubject(subject: ScenarioComparisonSubject): ScenarioComparisonSubject {
  return Object.freeze({
    ...subject,
    summary: Object.freeze({
      ...subject.summary,
      request: Object.freeze({
        ...subject.summary.request,
        baselineReference: subject.summary.request.baselineReference
          ? Object.freeze({ ...subject.summary.request.baselineReference })
          : undefined,
      }),
      keyPositiveEffects: Object.freeze([...subject.summary.keyPositiveEffects]),
      keyNegativeEffects: Object.freeze([...subject.summary.keyNegativeEffects]),
      riskMovement: Object.freeze({ ...subject.summary.riskMovement }),
      kpiMovement: Object.freeze({ ...subject.summary.kpiMovement }),
      diagnostics: Object.freeze([...subject.summary.diagnostics]) as ExecutiveSimulationSummary["diagnostics"],
    }),
  });
}

export function buildScenarioComparisonRequest(
  input: Omit<
    ScenarioComparisonRequest,
    | "readOnly"
    | "mutation"
    | "sceneMutation"
    | "topologyMutation"
    | "routingMutation"
    | "dsMutation"
    | "objectMutation"
  >
): ScenarioComparisonRequest {
  return Object.freeze({
    comparisonId: input.comparisonId,
    mode: input.mode,
    scenarioA: freezeSubject(input.scenarioA),
    scenarioB: freezeSubject(input.scenarioB),
    readOnly: true as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
  });
}

export function buildScenarioDifferenceProfile(
  input: Omit<ScenarioDifferenceProfile, "readOnly" | "mutation">
): ScenarioDifferenceProfile {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildScenarioComparisonResult(
  input: Omit<
    ScenarioComparisonResult,
    | "version"
    | "comparedScenarioIds"
    | "supportsScenarioVsScenario"
    | "supportsScenarioVsBaseline"
    | "readOnly"
    | "mutation"
    | "sceneMutation"
    | "topologyMutation"
    | "routingMutation"
    | "dsMutation"
    | "objectMutation"
    | "diagnostics"
  >
): ScenarioComparisonResult {
  const differences = Object.freeze(input.differences.map((difference) => buildScenarioDifferenceProfile(difference)));
  const primaryDifference = input.primaryDifference
    ? buildScenarioDifferenceProfile(input.primaryDifference)
    : null;

  return Object.freeze({
    version: SCENARIO_COMPARISON_CONTRACT_VERSION,
    request: buildScenarioComparisonRequest(input.request),
    differences,
    primaryDifference,
    comparedScenarioIds: Object.freeze([
      input.request.scenarioA.scenarioId,
      input.request.scenarioB.scenarioId,
    ] as const),
    supportsScenarioVsScenario: true as const,
    supportsScenarioVsBaseline: true as const,
    readOnly: true as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
    diagnostics: SCENARIO_COMPARISON_DIAGNOSTICS,
  });
}
