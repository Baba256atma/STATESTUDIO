import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCompareOverlayMarker,
  buildCompareOverlayProfile,
  buildCompareOverlayProfileFromComparison,
  buildCompareOverlayState,
  C2_OVERLAY_CONTRACT_COMPLETE_TAG,
  COMPARE_OVERLAY_CONTRACT,
  COMPARE_OVERLAY_CONTRACT_DIAGNOSTIC,
  COMPARE_OVERLAY_READY_DIAGNOSTIC,
} from "./CompareOverlayContract.ts";
import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "./ScenarioComparisonContract.ts";
import { EMPTY_EXECUTIVE_SIMULATION_SUMMARY } from "./simulationResultAggregatorContract.ts";

function comparison() {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare:overlay",
    mode: "scenario_vs_scenario",
    scenarioA: {
      scenarioId: "scenario-a",
      label: "Scenario A",
      summary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
      baseline: false,
    },
    scenarioB: {
      scenarioId: "scenario-b",
      label: "Scenario B",
      summary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
      baseline: false,
    },
  });
  const objectDifference = buildScenarioDifferenceProfile({
    differenceId: "object-diff",
    category: "object",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 8,
    riskMovementDelta: -2,
    kpiMovementDelta: 0,
    confidenceDelta: 4,
    objectCountDelta: 1,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 0,
    advantage: "scenarioA",
    summary: "Object difference favors Scenario A.",
  });
  return buildScenarioComparisonResult({
    request,
    differences: [objectDifference],
    primaryDifference: objectDifference,
  });
}

test("exports C2 overlay contract tag and diagnostics", () => {
  assert.equal(C2_OVERLAY_CONTRACT_COMPLETE_TAG, "[C2_OVERLAY_CONTRACT_COMPLETE]");
  assert.equal(COMPARE_OVERLAY_CONTRACT_DIAGNOSTIC, "[COMPARE_OVERLAY_CONTRACT]");
  assert.equal(COMPARE_OVERLAY_READY_DIAGNOSTIC, "[COMPARE_OVERLAY_READY]");
  assert.equal(COMPARE_OVERLAY_CONTRACT.supportsScenarioAvsB, true);
  assert.equal(COMPARE_OVERLAY_CONTRACT.readOnly, true);
  assert.equal(COMPARE_OVERLAY_CONTRACT.sceneMutation, false);
  assert.equal(COMPARE_OVERLAY_CONTRACT.topologyMutation, false);
});

test("builds immutable overlay marker profile and state", () => {
  const marker = buildCompareOverlayMarker({
    markerId: "marker-1",
    scenarioRole: "scenarioA",
    markerKind: "object",
    targetId: "supplier-1",
    label: "Supplier advantage",
    intensity: 120,
    confidence: 88,
  });
  const profile = buildCompareOverlayProfile({
    profileId: "profile-1",
    comparisonId: "compare-1",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    markers: [marker],
  });
  const state = buildCompareOverlayState({
    activeComparisonId: "compare-1",
    profiles: [profile],
  });

  assert.equal(marker.intensity, 100);
  assert.equal(marker.sceneMutation, false);
  assert.equal(profile.markerCount, 1);
  assert.equal(state.profileCount, 1);
  assert.equal(state.markerCount, 1);
  assert.equal(state.supportsScenarioAvsB, true);
  assert.equal(state.sceneMutation, false);
  assert.equal(state.topologyMutation, false);
  assert.equal(Object.isFrozen(marker), true);
  assert.equal(Object.isFrozen(profile.markers), true);
  assert.equal(Object.isFrozen(state.markers), true);
  assert.throws(() => {
    (state.markers as unknown as object[]).push({});
  }, TypeError);
});

test("builds Scenario A vs B overlay profile from comparison result without mutation", () => {
  const result = comparison();
  const before = JSON.stringify(result);

  const profile = buildCompareOverlayProfileFromComparison(result);

  assert.equal(profile.comparisonId, "compare:overlay");
  assert.equal(profile.scenarioAId, "scenario-a");
  assert.equal(profile.scenarioBId, "scenario-b");
  assert.equal(profile.markers[0]?.scenarioRole, "scenarioA");
  assert.equal(profile.markers[0]?.markerKind, "object");
  assert.equal(profile.sceneMutation, false);
  assert.equal(profile.topologyMutation, false);
  assert.equal(JSON.stringify(result), before);
});
