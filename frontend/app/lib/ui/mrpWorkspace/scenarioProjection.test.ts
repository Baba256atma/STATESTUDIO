import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_SCENARIO_PROJECTION_TAG,
  PROJECTION_SECTION_ORDER,
  PROJECTION_TREND_LABELS,
  SCENARIO_PROJECTION_CONTEXT,
  SCENARIO_PROJECTION_QUESTION,
} from "./scenario/scenarioProjectionContract.ts";
import {
  buildScenarioProjectionSignature,
  deriveScenarioProjectionLayer,
} from "./scenario/scenarioProjectionResolver.ts";
import {
  resetScenarioProjectionRuntimeForTests,
  syncScenarioProjection,
} from "./scenario/scenarioProjectionRuntime.ts";
import { guardScenarioForbiddenAction } from "./scenario/scenarioBoundaryRuntime.ts";
import { deriveExecutiveScenarios } from "./scenario/scenarioGenerationResolver.ts";
import { buildScenarioGenerationInput } from "./scenario/scenarioGenerationResolver.ts";
import { syncScenarioGeneration } from "./scenario/scenarioGenerationRuntime.ts";
import { syncScenarioComparison } from "./scenario/scenarioComparisonRuntime.ts";
import { syncScenarioWorkspaceContext } from "./scenario/scenarioWorkspaceContextRuntime.ts";
import {
  getScenarioWorkspaceState,
  hydrateScenarioWorkspaceStateOnMount,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import { buildScenarioWorkspaceViewFromState } from "./scenario/scenarioWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetScenarioProjectionRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
});

test("exports scenario projection tag and question", () => {
  assert.equal(MRP_SCENARIO_PROJECTION_TAG, "[MRP_SCENARIO_PROJECTION]");
  assert.equal(SCENARIO_PROJECTION_CONTEXT, "scenario");
  assert.equal(SCENARIO_PROJECTION_QUESTION, "What might happen next?");
});

test("deriveScenarioProjectionLayer maps expected best and worst trends", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({
      selectedObjectId: "a",
      selectedObjectLabel: "Factory A",
    })
  );
  const layer = deriveScenarioProjectionLayer({
    scenarios,
    projectionHorizon: "30 days",
  });

  assert.equal(layer.trends.length, 3);
  assert.equal(layer.trends[0]?.label, PROJECTION_TREND_LABELS.expected_trend);
  assert.equal(layer.trends[1]?.label, PROJECTION_TREND_LABELS.best_case_trend);
  assert.equal(layer.trends[2]?.label, PROJECTION_TREND_LABELS.worst_case_trend);
  assert.equal(layer.horizon, "30 days");
  assert.equal(layer.readOnly, true);
});

test("projection layer includes all impact sections", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({ selectedObjectLabel: "Factory A" })
  );
  const layer = deriveScenarioProjectionLayer({
    scenarios,
    projectionHorizon: "60 days",
  });
  assert.deepEqual(
    layer.sections.map((section) => section.id),
    [...PROJECTION_SECTION_ORDER]
  );
  for (const trend of layer.trends) {
    assert.equal(trend.curve.length, 5);
    assert.ok(trend.deltaLabel.length > 0);
  }
});

test("syncScenarioProjection publishes layer under dashboardContext scenario", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioComparison();
  syncScenarioProjection();

  const state = getScenarioWorkspaceState();
  assert.equal(state.projectionLayer.trends.length, 3);
  assert.equal(state.projectionLayer.sections.length, 4);
  assert.equal(state.projectionReadOnly, true);
  assert.match(state.futureProjection.detail, /MRP_SCENARIO_PROJECTION/);

  const view = buildScenarioWorkspaceViewFromState(state);
  assert.equal(view.projection.dashboardContext, "scenario");
  assert.equal(view.projection.question, "What might happen next?");
  assert.equal(view.projection.layer.trends.length, 3);
});

test("projection does not execute decisions modify timeline or open war room", () => {
  assert.equal(
    guardScenarioForbiddenAction({ action: "execute_action", source: "projection" }).allowed,
    false
  );
  assert.equal(
    guardScenarioForbiddenAction({ action: "modify_timeline", source: "projection" }).allowed,
    false
  );
  assert.equal(
    guardScenarioForbiddenAction({
      action: "open_war_room_automatically",
      source: "projection",
    }).allowed,
    false
  );
});

test("projection signature is stable for identical layer", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({ selectedObjectLabel: "Factory A" })
  );
  const layer = deriveScenarioProjectionLayer({
    scenarios,
    projectionHorizon: "30 days",
  });
  assert.equal(
    buildScenarioProjectionSignature(layer),
    buildScenarioProjectionSignature(layer)
  );
});

test("projection derives from scenario workspace state only", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioComparison();
  syncScenarioProjection();

  const state = getScenarioWorkspaceState();
  assert.equal(state.projectionLayer.horizon, state.workspaceContext.projectionHorizon);
  assert.equal(state.projectionLayer.trends[0]?.sourceScenarioId, "expected_case");
});
