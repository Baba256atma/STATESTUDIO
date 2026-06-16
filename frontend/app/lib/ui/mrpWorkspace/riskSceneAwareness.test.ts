import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import {
  DEFAULT_RISK_SCENE_AWARENESS,
  MRP_RISK_SCENE_AWARE_TAG,
  RISK_SCENE_COVERAGE_LABELS,
  RISK_SCENE_FORBIDDEN_CAPABILITIES,
  RISK_SCENE_READ_FIELDS,
} from "./risk/riskSceneAwarenessContract.ts";
import {
  resolveRiskSceneAwareness,
  resolveRiskSceneCoverage,
} from "./risk/riskSceneAwarenessResolver.ts";
import {
  assertRiskSceneReadOnly,
  getRiskSceneAwarenessSnapshot,
  guardRiskSceneWrite,
  resetRiskSceneAwarenessRuntimeForTests,
  syncRiskSceneAwareness,
} from "./risk/riskSceneAwarenessRuntime.ts";
import {
  getRiskWorkspaceState,
  hydrateRiskWorkspaceStateOnMount,
  resetRiskWorkspaceStateRuntimeForTests,
} from "./risk/riskWorkspaceStateRuntime.ts";
import { buildRiskWorkspaceViewFromState } from "./risk/riskWorkspaceStateViewMapper.ts";
import { resetRiskWorkspaceDataRuntimeForTests } from "./risk/riskWorkspaceDataRuntime.ts";

test.beforeEach(() => {
  resetRiskSceneAwarenessRuntimeForTests();
  resetRiskWorkspaceDataRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
});

const sceneWithRisks: SceneJson = {
  scene: {
    objects: [
      { id: "1", label: "A", severity: "critical" },
      { id: "2", label: "B", status: "delayed" },
      { id: "3", label: "C", state: "stable" },
      { id: "4", label: "D", state: "stable" },
      { id: "5", label: "E", state: "stable" },
    ],
  },
} as SceneJson;

test("exports risk scene awareness tag", () => {
  assert.equal(MRP_RISK_SCENE_AWARE_TAG, "[MRP_RISK_SCENE_AWARE]");
});

test("defines read-only scene fields and forbidden capabilities", () => {
  assert.deepEqual(RISK_SCENE_READ_FIELDS, [
    "selectedObject",
    "sceneObjects",
    "workspaceDiagnostics",
  ]);
  assert.deepEqual(RISK_SCENE_FORBIDDEN_CAPABILITIES, [
    "move_objects",
    "modify_topology",
    "modify_scene",
    "change_camera",
    "control_scene",
  ]);
});

test("resolveRiskSceneCoverage counts monitored and risk objects", () => {
  const coverage = resolveRiskSceneCoverage(sceneWithRisks);
  assert.equal(coverage.objectsMonitored, 5);
  assert.equal(coverage.objectsWithRisk, 2);
  assert.equal(coverage.criticalObjects, 1);
});

test("resolveRiskSceneAwareness remains read-only", () => {
  const snapshot = resolveRiskSceneAwareness({
    selectedObjectId: "1",
    sceneJson: sceneWithRisks,
  });
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.selectedObjectId, "1");
  assert.equal(assertRiskSceneReadOnly(snapshot), true);
});

test("guardRiskSceneWrite blocks scene mutations", () => {
  const blocked = guardRiskSceneWrite({
    capability: "modify_scene",
    source: "risk_workspace",
  });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.tag, MRP_RISK_SCENE_AWARE_TAG);
  assert.match(blocked.reason, /read-only/);
});

test("syncRiskSceneAwareness updates workspace state coverage read-only", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskSceneAwareness({ sceneJson: sceneWithRisks, selectedObjectId: "1" });

  const state = getRiskWorkspaceState();
  assert.equal(state.sceneCoverage.objectsMonitored, 5);
  assert.equal(state.sceneCoverage.objectsWithRisk, 2);
  assert.equal(state.sceneCoverage.criticalObjects, 1);
  assert.equal(state.sceneAwarenessReadOnly, true);
  assert.equal(getRiskSceneAwarenessSnapshot().readOnly, true);
});

test("syncRiskSceneAwareness dedupes identical signatures", () => {
  syncRiskSceneAwareness({ sceneJson: sceneWithRisks });
  const revisionAfterFirst = getRiskSceneAwarenessSnapshot().revision;

  syncRiskSceneAwareness({ sceneJson: sceneWithRisks });
  assert.equal(getRiskSceneAwarenessSnapshot().revision, revisionAfterFirst);
});

test("workspace view includes scene coverage", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskSceneAwareness({ sceneJson: sceneWithRisks });
  const view = buildRiskWorkspaceViewFromState(getRiskWorkspaceState());

  assert.equal(view.sceneCoverage.objectsMonitored, 5);
  assert.equal(view.sceneAwarenessReadOnly, true);
});

test("empty scene returns zero coverage defaults", () => {
  const coverage = resolveRiskSceneCoverage(null);
  assert.deepEqual(coverage, DEFAULT_RISK_SCENE_AWARENESS.coverage);
});

test("exports risk coverage labels", () => {
  assert.equal(RISK_SCENE_COVERAGE_LABELS.objectsMonitored, "Objects Monitored");
  assert.equal(RISK_SCENE_COVERAGE_LABELS.objectsWithRisk, "Objects With Risk");
  assert.equal(RISK_SCENE_COVERAGE_LABELS.criticalObjects, "Critical Objects");
});
