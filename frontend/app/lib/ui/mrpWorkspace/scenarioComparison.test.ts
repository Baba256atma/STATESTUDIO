import test from "node:test";
import assert from "node:assert/strict";

import {
  COMPARISON_SCENARIO_LABELS,
  COMPARISON_SECTION_ORDER,
  MRP_SCENARIO_COMPARISON_TAG,
  SCENARIO_COMPARISON_CONTEXT,
} from "./scenario/scenarioComparisonContract.ts";
import {
  buildScenarioComparisonColumns,
  buildScenarioComparisonSignature,
  deriveScenarioComparisonMatrix,
} from "./scenario/scenarioComparisonResolver.ts";
import {
  resetScenarioComparisonRuntimeForTests,
  syncScenarioComparison,
} from "./scenario/scenarioComparisonRuntime.ts";
import {
  resetScenarioProjectionRuntimeForTests,
} from "./scenario/scenarioProjectionRuntime.ts";
import { guardScenarioForbiddenAction } from "./scenario/scenarioBoundaryRuntime.ts";
import { deriveExecutiveScenarios } from "./scenario/scenarioGenerationResolver.ts";
import { buildScenarioGenerationInput } from "./scenario/scenarioGenerationResolver.ts";
import { syncScenarioGeneration } from "./scenario/scenarioGenerationRuntime.ts";
import { syncScenarioWorkspaceContext } from "./scenario/scenarioWorkspaceContextRuntime.ts";
import {
  getScenarioWorkspaceState,
  hydrateScenarioWorkspaceStateOnMount,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import { buildScenarioWorkspaceViewFromState } from "./scenario/scenarioWorkspaceStateViewMapper.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";

test.beforeEach(() => {
  resetScenarioComparisonRuntimeForTests();
  resetScenarioProjectionRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
});

test("exports scenario comparison tag and scenario context", () => {
  assert.equal(MRP_SCENARIO_COMPARISON_TAG, "[MRP_SCENARIO_COMPARISON]");
  assert.equal(SCENARIO_COMPARISON_CONTEXT, "scenario");
});

test("deriveScenarioComparisonMatrix maps scenarios A B and C", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({
      selectedObjectId: "a",
      selectedObjectLabel: "Factory A",
    })
  );
  const matrix = deriveScenarioComparisonMatrix({ scenarios });

  assert.equal(matrix.columns.length, 3);
  assert.equal(matrix.rows.length, COMPARISON_SECTION_ORDER.length);
  assert.equal(matrix.columns[0]?.label, COMPARISON_SCENARIO_LABELS.scenario_a);
  assert.equal(matrix.columns[1]?.label, COMPARISON_SCENARIO_LABELS.scenario_b);
  assert.equal(matrix.columns[2]?.label, COMPARISON_SCENARIO_LABELS.scenario_c);
  assert.equal(matrix.readOnly, true);
});

test("comparison matrix includes all executive comparison sections", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({ selectedObjectLabel: "Factory A" })
  );
  const matrix = deriveScenarioComparisonMatrix({ scenarios });
  assert.deepEqual(
    matrix.rows.map((row) => row.id),
    [...COMPARISON_SECTION_ORDER]
  );
  for (const row of matrix.rows) {
    assert.ok(row.cells.scenario_a);
    assert.ok(row.cells.scenario_b);
    assert.ok(row.cells.scenario_c);
  }
});

test("syncScenarioComparison publishes matrix under dashboardContext scenario", () => {
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

  const state = getScenarioWorkspaceState();
  assert.equal(state.comparisonMatrix.columns.length, 3);
  assert.equal(state.comparisonMatrix.rows.length, 5);
  assert.equal(state.comparisonReadOnly, true);
  assert.match(state.scenarioComparison.detail, /MRP_SCENARIO_COMPARISON/);

  const view = buildScenarioWorkspaceViewFromState(state);
  assert.equal(view.comparison.dashboardContext, "scenario");
  assert.equal(view.comparison.matrix.rows.length, 5);
});

test("scenario context mount plan uses dashboardContext scenario", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "scenario",
  });
  assert.equal(plan.workspaceId, "scenario");
  assert.equal(plan.mountTarget, "scenario_workspace");
});

test("comparison signature is stable for identical matrix", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({ selectedObjectLabel: "Factory A" })
  );
  const matrix = deriveScenarioComparisonMatrix({ scenarios });
  assert.equal(
    buildScenarioComparisonSignature(matrix),
    buildScenarioComparisonSignature(matrix)
  );
});

test("comparison does not execute decisions or open war room", () => {
  assert.equal(
    guardScenarioForbiddenAction({ action: "execute_action", source: "comparison" }).allowed,
    false
  );
  assert.equal(
    guardScenarioForbiddenAction({
      action: "open_war_room_automatically",
      source: "comparison",
    }).allowed,
    false
  );
});

test("buildScenarioComparisonColumns preserves generated scenario metadata", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({ selectedObjectLabel: "Factory A" })
  );
  const columns = buildScenarioComparisonColumns(scenarios);
  assert.equal(columns[0]?.title, "Best Case");
  assert.match(columns[0]?.probability ?? "", /%$/);
});
