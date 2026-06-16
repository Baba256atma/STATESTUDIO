import test from "node:test";
import assert from "node:assert/strict";

import {
  WAR_ROOM_ACTION_PLAN_PURPOSE,
  WAR_ROOM_ACTION_PLAN_SECTION_ORDER,
  WAR_ROOM_ACTION_PLAN_TAG,
  WAR_ROOM_ACTION_ITEM_STATUS_VALUES,
} from "./warRoom/warRoomActionPlanContract.ts";
import {
  buildWarRoomActionPlanCardSnapshot,
  deriveWarRoomActionPlanLayer,
} from "./warRoom/warRoomActionPlanResolver.ts";
import {
  resetWarRoomActionPlanRuntimeForTests,
  syncWarRoomActionPlan,
} from "./warRoom/warRoomActionPlanRuntime.ts";
import { DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT } from "./warRoom/warRoomWorkspaceContextContract.ts";
import { syncWarRoomWorkspaceContext } from "./warRoom/warRoomWorkspaceContextRuntime.ts";
import {
  getWarRoomWorkspaceState,
  hydrateWarRoomWorkspaceStateOnMount,
  resetWarRoomWorkspaceStateRuntimeForTests,
} from "./warRoom/warRoomWorkspaceStateRuntime.ts";
import { buildWarRoomWorkspaceViewFromState } from "./warRoom/warRoomWorkspaceStateViewMapper.ts";
import { intakeScenarioCommitPackage } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomScenarioHandoffRuntimeForTests } from "./warRoom/warRoomScenarioHandoffRuntime.ts";
import { resetWarRoomScenarioIntakeRuntimeForTests } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomStateRuntimeForTests } from "./warRoom/warRoomStateRuntime.ts";

test.beforeEach(() => {
  resetWarRoomActionPlanRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetWarRoomScenarioIntakeRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
});

test("exports action plan freeze tag and purpose", () => {
  assert.equal(WAR_ROOM_ACTION_PLAN_TAG, "[MRP_WARROOM_ACTION_PLAN]");
  assert.equal(WAR_ROOM_ACTION_PLAN_PURPOSE, "Translate strategy into actions.");
  assert.deepEqual(WAR_ROOM_ACTION_ITEM_STATUS_VALUES, ["pending", "active", "complete"]);
});

test("deriveWarRoomActionPlanLayer returns three executive sections", () => {
  const layer = deriveWarRoomActionPlanLayer({
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
  });

  assert.deepEqual(
    layer.sections.map((section) => section.id),
    [...WAR_ROOM_ACTION_PLAN_SECTION_ORDER]
  );
  assert.equal(layer.sections[0]?.label, "Immediate Actions");
  assert.equal(layer.sections[1]?.label, "Near-Term Actions");
  assert.equal(layer.sections[2]?.label, "Long-Term Actions");
});

test("action items include title owner priority and status", () => {
  const layer = deriveWarRoomActionPlanLayer({
    selectedStrategy: "Expected Case",
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
  });

  const immediate = layer.sections[0]?.items ?? [];
  assert.ok(immediate.length >= 1);
  const item = immediate[0]!;
  assert.ok(item.title.trim());
  assert.ok(item.owner.trim());
  assert.ok(item.priority);
  assert.ok(WAR_ROOM_ACTION_ITEM_STATUS_VALUES.includes(item.status));
});

test("syncWarRoomActionPlan updates workspace card with action plan tag", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-2",
    selectedObjectLabel: "Production Line",
  });
  syncWarRoomActionPlan();

  const workspace = getWarRoomWorkspaceState();
  assert.match(workspace.actionPlan.detail, /MRP_WARROOM_ACTION_PLAN/);
  assert.match(workspace.actionPlan.detail, /no scenario regeneration/);
  assert.equal(workspace.actionPlanExecutionOwned, true);
});

test("buildWarRoomWorkspaceView exposes action plan surface", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-3",
    selectedObjectLabel: "Project Alpha",
  });
  syncWarRoomActionPlan();

  const view = buildWarRoomWorkspaceViewFromState(getWarRoomWorkspaceState());
  assert.equal(view.actionPlan.executionPlanningOwned, true);
  assert.equal(view.actionPlan.sections.length, 3);
  assert.match(view.scanPurpose, /Translate strategy into actions/);
});

test("scenario intake populates action plan without scenario regeneration", () => {
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
  assert.match(getWarRoomWorkspaceState().actionPlan.detail, /MRP_WARROOM_ACTION_PLAN/);
  assert.ok(
    getWarRoomWorkspaceState().actionPlanLayer.sections.some((section) => section.items.length > 0)
  );
});

test("buildWarRoomActionPlanCardSnapshot describes execution planning ownership", () => {
  const layer = deriveWarRoomActionPlanLayer({
    selectedStrategy: "Supply continuity",
    activeDecisionId: "decision:obj-5:worst_case",
    status: "draft",
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
  });
  const snapshot = buildWarRoomActionPlanCardSnapshot(layer);
  assert.match(snapshot.headline, /Action Plan Panel active/);
  assert.match(snapshot.detail, /execution planning owned by War Room/);
});

test("hydrated workspace includes action plan layer after sync", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-6",
    selectedObjectLabel: "Factory A",
  });
  hydrateWarRoomWorkspaceStateOnMount("mount");
  syncWarRoomActionPlan();

  assert.equal(getWarRoomWorkspaceState().phase, "ready");
  assert.equal(getWarRoomWorkspaceState().actionPlanLayer.executionPlanningOwned, true);
});
