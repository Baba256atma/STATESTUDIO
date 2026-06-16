import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_WAR_ROOM_STATE,
  WAR_ROOM_RUNTIME_STATE_TAG,
  WAR_ROOM_STATUS_VALUES,
  type WarRoomStatus,
} from "./warRoom/warRoomStateContract.ts";
import {
  buildWarRoomStateSignature,
  resolveWarRoomStateFromContext,
} from "./warRoom/warRoomStateContextResolver.ts";
import {
  getWarRoomState,
  getWarRoomStatePublishCountForTests,
  getWarRoomStateServerSnapshot,
  hydrateWarRoomStateOnMount,
  publishWarRoomState,
  resetWarRoomStateRuntimeForTests,
  syncWarRoomStateFromContext,
} from "./warRoom/warRoomStateRuntime.ts";
import {
  selectWarRoomActionPlanIds,
  selectWarRoomActiveDecisionId,
  selectWarRoomActiveScenarioId,
  selectWarRoomHasActiveDecision,
  selectWarRoomIsUnderReview,
  selectWarRoomSelectedStrategy,
  selectWarRoomStatus,
  selectWarRoomStatusLabel,
  selectWarRoomWatchListIds,
} from "./warRoom/warRoomStateSelectors.ts";
import { DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT } from "./warRoom/warRoomWorkspaceContextContract.ts";
import { syncWarRoomWorkspaceContext } from "./warRoom/warRoomWorkspaceContextRuntime.ts";
import {
  getWarRoomWorkspaceState,
  hydrateWarRoomWorkspaceStateOnMount,
  resetWarRoomWorkspaceStateRuntimeForTests,
} from "./warRoom/warRoomWorkspaceStateRuntime.ts";
import { intakeScenarioCommitPackage } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomScenarioIntakeRuntimeForTests } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomActionPlanRuntimeForTests } from "./warRoom/warRoomActionPlanRuntime.ts";
import {
  resetWarRoomScenarioHandoffRuntimeForTests,
} from "./warRoom/warRoomScenarioHandoffRuntime.ts";
import { guardWarRoomForbiddenAction } from "./warRoom/warRoomBoundaryRuntime.ts";

test.beforeEach(() => {
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetWarRoomScenarioIntakeRuntimeForTests();
  resetWarRoomActionPlanRuntimeForTests();
});

test("exports runtime freeze tag and status values", () => {
  assert.equal(WAR_ROOM_RUNTIME_STATE_TAG, "[MRP_WARROOM_RUNTIME]");
  assert.deepEqual(WAR_ROOM_STATUS_VALUES, [
    "draft",
    "review",
    "approved",
    "active",
    "closed",
  ]);
});

test("default war room state starts in draft with empty collections", () => {
  assert.equal(DEFAULT_WAR_ROOM_STATE.status, "draft");
  assert.equal(DEFAULT_WAR_ROOM_STATE.activeDecisionId, null);
  assert.equal(DEFAULT_WAR_ROOM_STATE.activeScenarioId, null);
  assert.deepEqual(DEFAULT_WAR_ROOM_STATE.actionPlanIds, []);
  assert.deepEqual(DEFAULT_WAR_ROOM_STATE.watchListIds, []);
});

test("context resolver derives draft commitment state from workspace context", () => {
  const resolved = resolveWarRoomStateFromContext({
    workspaceContext: {
      ...DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
      selectedObjectId: "obj-1",
      selectedObject: "Factory A",
      strategyFocus: "Operational resilience",
      activeDecision: "Capacity stabilization",
      commitmentStatus: "Planning",
      hasSelection: true,
    },
  });

  assert.equal(resolved.activeDecisionId, "decision:obj-1");
  assert.equal(resolved.selectedStrategy, "Operational resilience");
  assert.equal(resolved.status, "draft");
  assert.equal(resolved.actionPlanIds.length, 1);
  assert.equal(resolved.watchListIds.length, 1);
  assert.equal(resolved.activeScenarioId, null);
});

test("context resolver consumes scenario handoff reference without scenario ownership claims", () => {
  const resolved = resolveWarRoomStateFromContext({
    workspaceContext: {
      ...DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
      selectedObjectId: "obj-1",
      selectedObject: "Factory A",
      strategyFocus: "Operational resilience",
      activeDecision: "Capacity stabilization",
      commitmentStatus: "Planning",
      hasSelection: true,
    },
    handoffActiveScenarioId: "expected_case",
    handoffSelectedStrategy: "Expected Case",
  });

  assert.equal(resolved.activeScenarioId, "expected_case");
  assert.equal(resolved.selectedStrategy, "Expected Case");
  assert.equal(resolved.status, "review");
});

test("selectors expose commitment runtime fields", () => {
  const state = resolveWarRoomStateFromContext({
    workspaceContext: {
      ...DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
      selectedObjectId: "obj-2",
      selectedObject: "Supplier Network",
      strategyFocus: "Supply continuity",
      activeDecision: "Dual-source activation",
      commitmentStatus: "Monitoring",
      hasSelection: true,
    },
    handoffActiveScenarioId: "worst_case",
    handoffSelectedStrategy: "Worst Case",
  });
  const runtimeState = publishWarRoomState(state).state;

  assert.equal(selectWarRoomActiveDecisionId(runtimeState), "decision:obj-2:worst_case");
  assert.equal(selectWarRoomActiveScenarioId(runtimeState), "worst_case");
  assert.equal(selectWarRoomSelectedStrategy(runtimeState), "Worst Case");
  assert.equal(selectWarRoomActionPlanIds(runtimeState).length, 1);
  assert.equal(selectWarRoomWatchListIds(runtimeState).length, 1);
  assert.equal(selectWarRoomStatus(runtimeState), "review");
  assert.equal(selectWarRoomStatusLabel(runtimeState), "Review");
  assert.equal(selectWarRoomHasActiveDecision(runtimeState), true);
  assert.equal(selectWarRoomIsUnderReview(runtimeState), true);
});

test("publishWarRoomState skips duplicate signatures", () => {
  const payload = {
    status: "approved" as WarRoomStatus,
    selectedStrategy: "Stabilize throughput",
  };
  const first = publishWarRoomState(payload);
  const second = publishWarRoomState(payload);

  assert.equal(first.changed, true);
  assert.equal(second.changed, false);
  assert.equal(getWarRoomStatePublishCountForTests(), 2);
});

test("hydrateWarRoomStateOnMount syncs workspace card snapshots", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-3",
    selectedObjectLabel: "Production Line",
  });
  hydrateWarRoomStateOnMount("runtime-test");

  const runtime = getWarRoomState();
  const workspace = getWarRoomWorkspaceState();

  assert.equal(runtime.status, "draft");
  assert.equal(runtime.activeDecisionId, "decision:obj-3");
  assert.match(workspace.strategySummary.detail, /MRP_WARROOM_RUNTIME/);
  assert.match(workspace.activeDecision.detail, /no Timeline ownership/);
  assert.match(workspace.decisionStatus.detail, /MRP_WARROOM_RUNTIME/);
});

test("workspace hydration delegates to war room runtime hydration", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-4",
    selectedObjectLabel: "Project Alpha",
  });
  hydrateWarRoomWorkspaceStateOnMount("workspace-test");

  assert.equal(getWarRoomWorkspaceState().phase, "ready");
  assert.equal(getWarRoomState().activeDecisionId, "decision:obj-4");
});

test("syncWarRoomStateFromContext picks up scenario handoff consumer state", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-5",
    selectedObjectLabel: "Factory A",
  });
  intakeScenarioCommitPackage({
    scenarioId: "expected_case",
    title: "Expected Case",
    probability: "55%",
    impact: "Medium",
    confidence: "High",
    selectedObjectId: "obj-5",
    createdAt: "2026-06-13T12:00:00.000Z",
  });

  const runtime = syncWarRoomStateFromContext();

  assert.equal(runtime.activeScenarioId, "expected_case");
  assert.equal(runtime.selectedStrategy, "Expected Case");
  assert.equal(runtime.status, "review");
  assert.equal(runtime.activeDecisionId, "decision:obj-5:expected_case");
});

test("getWarRoomStateServerSnapshot returns default draft state", () => {
  publishWarRoomState({ status: "active" });
  const snapshot = getWarRoomStateServerSnapshot();
  assert.equal(snapshot.status, "draft");
  assert.equal(snapshot.revision, 0);
});

test("buildWarRoomStateSignature is stable for identical payloads", () => {
  const payload = resolveWarRoomStateFromContext({
    workspaceContext: DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
  });
  assert.equal(
    buildWarRoomStateSignature(payload),
    buildWarRoomStateSignature(payload)
  );
});

test("war room runtime does not claim timeline or scenario ownership", () => {
  const blockedTimeline = guardWarRoomForbiddenAction({
    action: "modify_timeline",
    source: "runtime_boundary",
  });
  const blockedSimulation = guardWarRoomForbiddenAction({
    action: "generate_simulation",
    source: "runtime_boundary",
  });

  assert.equal(blockedTimeline.allowed, false);
  assert.equal(blockedSimulation.allowed, false);
});
