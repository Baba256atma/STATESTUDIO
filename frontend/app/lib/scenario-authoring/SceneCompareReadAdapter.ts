/**
 * C:2 — Scene Compare Read Adapter.
 *
 * Reads C:1 comparison output and executive comparison summary, then converts
 * them into a compare overlay profile. This adapter has no comparison,
 * simulation, scene, topology, or UI rendering authority.
 */

import {
  buildCompareOverlayMarker,
  buildCompareOverlayProfile,
  type CompareOverlayMarker,
  type CompareOverlayProfile,
} from "./CompareOverlayContract.ts";
import type { ExecutiveCompareSummary as ExecutiveCompareSummaryContract } from "./executiveCompareSummaryContract.ts";
import type { ScenarioComparisonResult, ScenarioDifferenceProfile } from "./ScenarioComparisonContract.ts";

export const SCENE_COMPARE_ADAPTER_DIAGNOSTIC = "[SCENE_COMPARE_ADAPTER]" as const;

export const SCENE_COMPARE_READY_DIAGNOSTIC = "[SCENE_COMPARE_READY]" as const;

export const C2_SCENE_ADAPTER_COMPLETE_TAG = "[C2_SCENE_ADAPTER_COMPLETE]" as const;

export const SCENE_COMPARE_READ_ADAPTER_VERSION = "1.0.0" as const;

export type SceneCompareReadAdapterInput = Readonly<{
  comparison: ScenarioComparisonResult;
  executiveSummary: ExecutiveCompareSummaryContract;
}>;

export type SceneCompareReadAdapterResult = Readonly<{
  version: typeof SCENE_COMPARE_READ_ADAPTER_VERSION;
  comparisonId: string;
  overlayProfile: CompareOverlayProfile;
  markerCount: number;
  readOnly: true;
  recalculation: false;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof SCENE_COMPARE_ADAPTER_DIAGNOSTIC,
    typeof SCENE_COMPARE_READY_DIAGNOSTIC,
  ];
}>;

export const SCENE_COMPARE_ADAPTER_DIAGNOSTICS = Object.freeze([
  SCENE_COMPARE_ADAPTER_DIAGNOSTIC,
  SCENE_COMPARE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENE_COMPARE_ADAPTER_RESULT: SceneCompareReadAdapterResult = Object.freeze({
  version: SCENE_COMPARE_READ_ADAPTER_VERSION,
  comparisonId: "",
  overlayProfile: buildCompareOverlayProfile({
    profileId: "",
    comparisonId: "",
    scenarioAId: "",
    scenarioBId: "",
    markers: Object.freeze([]),
  }),
  markerCount: 0,
  readOnly: true,
  recalculation: false,
  mutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  diagnostics: SCENE_COMPARE_ADAPTER_DIAGNOSTICS,
});

let latestSceneCompareAdapterResult: SceneCompareReadAdapterResult = EMPTY_SCENE_COMPARE_ADAPTER_RESULT;

function markerKind(category: ScenarioDifferenceProfile["category"]): CompareOverlayMarker["markerKind"] {
  if (category === "object" || category === "relationship" || category === "kpi" || category === "risk") {
    return category;
  }
  return "summary";
}

function scenarioRole(difference: ScenarioDifferenceProfile): CompareOverlayMarker["scenarioRole"] {
  if (difference.advantage === "scenarioA" || difference.advantage === "scenarioB") {
    return difference.advantage;
  }
  return "shared";
}

function summaryScenarioRole(
  recommendedOption: ExecutiveCompareSummaryContract["recommendedOption"]
): CompareOverlayMarker["scenarioRole"] {
  if (recommendedOption === "scenarioA" || recommendedOption === "scenarioB") {
    return recommendedOption;
  }
  return "shared";
}

function ensureAlignedC1Outputs(input: SceneCompareReadAdapterInput): void {
  const comparison = input.comparison;
  const summary = input.executiveSummary;
  const [scenarioAId, scenarioBId] = comparison.comparedScenarioIds;

  if (
    summary.comparisonId !== comparison.request.comparisonId ||
    summary.scenarioAId !== scenarioAId ||
    summary.scenarioBId !== scenarioBId
  ) {
    throw new Error("SceneCompareReadAdapter requires aligned C:1 comparison and executive summary output.");
  }
}

function buildDifferenceMarkers(comparison: ScenarioComparisonResult): readonly CompareOverlayMarker[] {
  return Object.freeze(
    comparison.differences.map((difference) =>
      buildCompareOverlayMarker({
        markerId: `scene-compare:${comparison.request.comparisonId}:${difference.differenceId}`,
        scenarioRole: scenarioRole(difference),
        markerKind: markerKind(difference.category),
        targetId: difference.differenceId,
        label: difference.summary,
        intensity: Math.abs(difference.overallImpactDelta),
        confidence: 100 - Math.abs(difference.confidenceDelta),
      })
    )
  );
}

function buildExecutiveSummaryMarker(
  comparison: ScenarioComparisonResult,
  summary: ExecutiveCompareSummaryContract
): CompareOverlayMarker {
  return buildCompareOverlayMarker({
    markerId: `scene-compare:${comparison.request.comparisonId}:executive-summary`,
    scenarioRole: summaryScenarioRole(summary.recommendedOption),
    markerKind: "summary",
    targetId: summary.comparisonId,
    label: summary.recommendationRationale,
    intensity: summary.comparisonConfidence,
    confidence: summary.comparisonConfidence,
  });
}

export function adaptSceneCompareRead(input: SceneCompareReadAdapterInput): SceneCompareReadAdapterResult {
  ensureAlignedC1Outputs(input);

  const markers = Object.freeze([
    ...buildDifferenceMarkers(input.comparison),
    buildExecutiveSummaryMarker(input.comparison, input.executiveSummary),
  ]);
  const overlayProfile = buildCompareOverlayProfile({
    profileId: `scene-compare-overlay:${input.comparison.request.comparisonId}`,
    comparisonId: input.comparison.request.comparisonId,
    scenarioAId: input.comparison.comparedScenarioIds[0],
    scenarioBId: input.comparison.comparedScenarioIds[1],
    markers,
  });

  latestSceneCompareAdapterResult = Object.freeze({
    version: SCENE_COMPARE_READ_ADAPTER_VERSION,
    comparisonId: input.comparison.request.comparisonId,
    overlayProfile,
    markerCount: overlayProfile.markerCount,
    readOnly: true as const,
    recalculation: false as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    diagnostics: SCENE_COMPARE_ADAPTER_DIAGNOSTICS,
  });

  return latestSceneCompareAdapterResult;
}

export function getSceneCompareReadAdapterResult(): SceneCompareReadAdapterResult {
  return latestSceneCompareAdapterResult;
}

export function resetSceneCompareReadAdapterForTests(): void {
  latestSceneCompareAdapterResult = EMPTY_SCENE_COMPARE_ADAPTER_RESULT;
}

export const SceneCompareReadAdapter = Object.freeze({
  adaptSceneCompareRead,
  getSceneCompareReadAdapterResult,
  resetSceneCompareReadAdapterForTests,
  diagnostics: SCENE_COMPARE_ADAPTER_DIAGNOSTICS,
  emptyResult: EMPTY_SCENE_COMPARE_ADAPTER_RESULT,
});
