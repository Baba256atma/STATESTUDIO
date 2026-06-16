import test from "node:test";
import assert from "node:assert/strict";

import {
  GENERATED_SCENARIO_ORDER,
  GENERATED_SCENARIO_TITLES,
  MRP_SCENARIO_GENERATION_TAG,
  SCENARIO_DECISION_QUESTION,
} from "./scenario/scenarioGenerationContract.ts";
import {
  buildScenarioGenerationInput,
  buildScenarioGenerationSignature,
  deriveExecutiveScenarios,
} from "./scenario/scenarioGenerationResolver.ts";
import {
  resetScenarioGenerationRuntimeForTests,
  syncScenarioGeneration,
} from "./scenario/scenarioGenerationRuntime.ts";
import { guardScenarioForbiddenAction } from "./scenario/scenarioBoundaryRuntime.ts";
import { syncScenarioWorkspaceContext } from "./scenario/scenarioWorkspaceContextRuntime.ts";
import {
  getScenarioWorkspaceState,
  hydrateScenarioWorkspaceStateOnMount,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import { buildScenarioWorkspaceViewFromState } from "./scenario/scenarioWorkspaceStateViewMapper.ts";
import { syncRiskWorkspaceData } from "./risk/riskWorkspaceDataRuntime.ts";
import { resetRiskWorkspaceRuntimeForTests } from "./risk/riskWorkspaceRuntime.ts";
import { syncTimelineWorkspaceData } from "./timeline/timelineWorkspaceDataRuntime.ts";
import { resetTimelineWorkspaceRuntimeForTests } from "./timeline/timelineWorkspaceRuntime.ts";
import { hydrateRiskWorkspaceStateOnMount } from "./risk/riskWorkspaceStateRuntime.ts";
import { hydrateTimelineWorkspaceStateOnMount } from "./timeline/timelineWorkspaceStateRuntime.ts";
import type { SceneJson } from "../../sceneTypes.ts";

const sceneWithRisks: SceneJson = {
  scene: {
    objects: [
      { id: "a", type: "Supply", severity: "critical", status: "active" },
      { id: "b", type: "Supply", severity: "warning", status: "delayed" },
      { id: "c", type: "Finance", state: "stable", status: "ok" },
    ],
  },
} as SceneJson;

test.beforeEach(() => {
  resetScenarioGenerationRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
  resetRiskWorkspaceRuntimeForTests();
  resetTimelineWorkspaceRuntimeForTests();
});

test("exports scenario generation tag and decision question", () => {
  assert.equal(MRP_SCENARIO_GENERATION_TAG, "[MRP_SCENARIO_GENERATION]");
  assert.equal(SCENARIO_DECISION_QUESTION, "What could happen?");
});

test("deriveExecutiveScenarios returns Best Expected and Worst cases", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({
      selectedObjectId: "factory-a",
      selectedObjectLabel: "Factory A",
    })
  );
  assert.equal(scenarios.length, 3);
  assert.deepEqual(
    scenarios.map((row) => row.id),
    [...GENERATED_SCENARIO_ORDER]
  );
  assert.equal(scenarios[0]?.title, GENERATED_SCENARIO_TITLES.best_case);
  assert.equal(scenarios[1]?.title, GENERATED_SCENARIO_TITLES.expected_case);
  assert.equal(scenarios[2]?.title, GENERATED_SCENARIO_TITLES.worst_case);
  for (const row of scenarios) {
    assert.match(row.probability, /%$/);
    assert.ok(row.impact.length > 0);
    assert.ok(row.confidence.length > 0);
  }
});

test("scenario generation reads risk and timeline workspace data", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  hydrateTimelineWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
    sceneJson: sceneWithRisks,
  });
  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
    navigationHistoryEntries: [
      {
        workspaceId: "risk",
        targetWorkspaceId: "risk",
        timestamp: Date.now(),
        label: "Risk review",
      },
      {
        workspaceId: "timeline",
        targetWorkspaceId: "timeline",
        timestamp: Date.now() - 1000,
        label: "Timeline review",
      },
    ],
  });

  const input = buildScenarioGenerationInput({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  assert.ok(input.risk.riskCount >= 2);
  assert.ok(input.timeline.totalEvents >= 2);

  const scenarios = deriveExecutiveScenarios(input);
  assert.equal(scenarios.length, 3);
  assert.ok(
    Number.parseInt(scenarios[2]?.probability ?? "0", 10) <=
      Number.parseInt(scenarios[0]?.probability ?? "100", 10)
  );
});

test("syncScenarioGeneration publishes scenarios to workspace state", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });

  const state = getScenarioWorkspaceState();
  assert.equal(state.generatedScenarios.length, 3);
  assert.equal(state.generationReadOnly, true);
  assert.match(state.scenarioSummary.detail, /MRP_SCENARIO_GENERATION/);

  const view = buildScenarioWorkspaceViewFromState(state);
  assert.equal(view.generation.question, SCENARIO_DECISION_QUESTION);
  assert.equal(view.generation.scenarios.length, 3);
  assert.equal(view.generation.readOnly, true);
});

test("syncScenarioGeneration dedupes identical signatures", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioGeneration({ selectedObjectLabel: "Factory A", selectedObjectId: "a" });
  const revisionAfterFirst = getScenarioWorkspaceState().revision;
  syncScenarioGeneration({ selectedObjectLabel: "Factory A", selectedObjectId: "a" });
  assert.equal(getScenarioWorkspaceState().revision, revisionAfterFirst);
});

test("generation signature is stable for identical inputs", () => {
  const input = buildScenarioGenerationInput({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  assert.equal(
    buildScenarioGenerationSignature(input),
    buildScenarioGenerationSignature(input)
  );
});

test("scenario generation does not execute scenarios", () => {
  const blocked = guardScenarioForbiddenAction({
    action: "execute_action",
    source: "scenario_generation",
  });
  assert.equal(blocked.allowed, false);
});
