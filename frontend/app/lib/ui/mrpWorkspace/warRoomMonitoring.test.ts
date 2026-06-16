import test from "node:test";
import assert from "node:assert/strict";

import {
  WAR_ROOM_MONITORING_PURPOSE,
  WAR_ROOM_MONITORING_TAG,
  WAR_ROOM_MONITOR_CATEGORY_ORDER,
  WAR_ROOM_MONITORING_VISUAL_SECTION_ORDER,
} from "./warRoom/warRoomMonitoringContract.ts";
import {
  buildWarRoomMonitoringDecisionStatusCardSnapshot,
  buildWarRoomMonitoringWatchListCardSnapshot,
  deriveWarRoomMonitoringLayer,
} from "./warRoom/warRoomMonitoringResolver.ts";
import {
  guardWarRoomMonitoringForbiddenAction,
  resetWarRoomMonitoringRuntimeForTests,
  syncWarRoomMonitoring,
} from "./warRoom/warRoomMonitoringRuntime.ts";
import { DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT } from "./warRoom/warRoomWorkspaceContextContract.ts";
import { syncWarRoomWorkspaceContext } from "./warRoom/warRoomWorkspaceContextRuntime.ts";
import {
  getWarRoomWorkspaceState,
  hydrateWarRoomWorkspaceStateOnMount,
  resetWarRoomWorkspaceStateRuntimeForTests,
} from "./warRoom/warRoomWorkspaceStateRuntime.ts";
import { buildWarRoomWorkspaceViewFromState } from "./warRoom/warRoomWorkspaceStateViewMapper.ts";
import { intakeScenarioCommitPackage } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomActionPlanRuntimeForTests } from "./warRoom/warRoomActionPlanRuntime.ts";
import { resetWarRoomScenarioHandoffRuntimeForTests } from "./warRoom/warRoomScenarioHandoffRuntime.ts";
import { resetWarRoomScenarioIntakeRuntimeForTests } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomStateRuntimeForTests } from "./warRoom/warRoomStateRuntime.ts";

test.beforeEach(() => {
  resetWarRoomMonitoringRuntimeForTests();
  resetWarRoomActionPlanRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetWarRoomScenarioIntakeRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
});

test("exports monitoring freeze tag and purpose", () => {
  assert.equal(WAR_ROOM_MONITORING_TAG, "[MRP_WARROOM_MONITORING]");
  assert.equal(WAR_ROOM_MONITORING_PURPOSE, "Track execution after commitment.");
  assert.deepEqual(WAR_ROOM_MONITOR_CATEGORY_ORDER, [
    "critical_objects",
    "strategic_risks",
    "operational_signals",
    "decision_health",
  ]);
  assert.deepEqual(WAR_ROOM_MONITORING_VISUAL_SECTION_ORDER, [
    "watch_list",
    "alerts",
    "decision_health",
    "escalation_indicators",
  ]);
});

test("deriveWarRoomMonitoringLayer covers four monitor categories", () => {
  const layer = deriveWarRoomMonitoringLayer({
    selectedStrategy: "Operational resilience",
    activeDecisionId: "decision:obj-1:expected_case",
    status: "review",
    workspaceContext: {
      ...DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
      selectedObjectId: "obj-1",
      selectedObject: "Factory A",
      strategyFocus: "Operational resilience",
      activeDecision: "Capacity stabilization",
      commitmentStatus: "Planning",
      hasSelection: true,
    },
    commitPackage: null,
    actionPlanItemCount: 0,
  });

  assert.equal(layer.watchItems.length, 4);
  assert.deepEqual(
    layer.watchItems.map((item) => item.category),
    [...WAR_ROOM_MONITOR_CATEGORY_ORDER]
  );
  assert.equal(layer.executionTrackingOwned, true);
});

test("syncWarRoomMonitoring updates workspace cards with monitoring tag", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-2",
    selectedObjectLabel: "Production Line",
  });
  syncWarRoomMonitoring();

  const workspace = getWarRoomWorkspaceState();
  assert.match(workspace.watchList.detail, /MRP_WARROOM_MONITORING/);
  assert.match(workspace.watchList.detail, /no simulation logic/);
  assert.match(workspace.decisionStatus.detail, /MRP_WARROOM_MONITORING/);
  assert.equal(workspace.monitoringExecutionTracked, true);
});

test("buildWarRoomWorkspaceView exposes monitoring surface", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-3",
    selectedObjectLabel: "Project Alpha",
  });
  syncWarRoomMonitoring();

  const view = buildWarRoomWorkspaceViewFromState(getWarRoomWorkspaceState());
  assert.equal(view.monitoring.executionTrackingOwned, true);
  assert.equal(view.monitoring.watchList.length, 4);
  assert.match(view.scanPurpose, /Track execution after commitment/);
});

test("scenario intake populates monitoring layer without simulation", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-4",
    selectedObjectLabel: "Factory A",
  });
  const intake = intakeScenarioCommitPackage(
    {
      scenarioId: "expected_case",
      title: "Expected Case",
      probability: "55%",
      impact: "Medium",
      confidence: "High",
      selectedObjectId: "obj-4",
      createdAt: "2026-06-13T12:00:00.000Z",
    },
    "test"
  );

  assert.equal(intake.ok, true);
  assert.match(getWarRoomWorkspaceState().watchList.detail, /MRP_WARROOM_MONITORING/);
  assert.ok(getWarRoomWorkspaceState().monitoringLayer.watchItems.length > 0);
});

test("monitoring card snapshots describe execution tracking ownership", () => {
  const layer = deriveWarRoomMonitoringLayer({
    selectedStrategy: "Supply continuity",
    activeDecisionId: "decision:obj-5:worst_case",
    status: "active",
    workspaceContext: {
      ...DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
      selectedObjectId: "obj-5",
      selectedObject: "Supplier Network",
      strategyFocus: "Supply continuity",
      activeDecision: "Dual-source activation",
      commitmentStatus: "Monitoring",
      hasSelection: true,
    },
    commitPackage: null,
    actionPlanItemCount: 3,
  });

  const watchSnapshot = buildWarRoomMonitoringWatchListCardSnapshot(layer);
  const statusSnapshot = buildWarRoomMonitoringDecisionStatusCardSnapshot(layer, "active");
  assert.match(watchSnapshot.headline, /Watch List active/);
  assert.match(statusSnapshot.detail, /Timeline owns history/);
});

test("guardWarRoomMonitoringForbiddenAction blocks timeline ownership", () => {
  const guard = guardWarRoomMonitoringForbiddenAction({
    action: "modify_timeline",
    source: "test",
  });
  assert.equal(guard.allowed, false);
});

test("hydrated workspace includes monitoring layer after sync", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-6",
    selectedObjectLabel: "Factory A",
  });
  hydrateWarRoomWorkspaceStateOnMount("mount");
  syncWarRoomMonitoring();

  assert.equal(getWarRoomWorkspaceState().phase, "ready");
  assert.equal(getWarRoomWorkspaceState().monitoringLayer.executionTrackingOwned, true);
});
