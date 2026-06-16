import test from "node:test";
import assert from "node:assert/strict";

import {
  WAR_ROOM_FOUNDATION_TAG,
  WAR_ROOM_WORKSPACE_SECTION_ORDER,
} from "./warRoom/warRoomWorkspaceContract.ts";
import { WAR_ROOM_RUNTIME_STATE_TAG } from "./warRoom/warRoomStateContract.ts";
import {
  guardWarRoomCommitmentOwnershipBoundary,
  guardWarRoomForbiddenAction,
} from "./warRoom/warRoomBoundaryRuntime.ts";
import {
  resetWarRoomWorkspaceContextRuntimeForTests,
  syncWarRoomWorkspaceContext,
} from "./warRoom/warRoomWorkspaceContextRuntime.ts";
import { resetWarRoomActionPlanRuntimeForTests } from "./warRoom/warRoomActionPlanRuntime.ts";
import { resetWarRoomScenarioIntakeRuntimeForTests } from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomStateRuntimeForTests } from "./warRoom/warRoomStateRuntime.ts";
import { hydrateWarRoomWorkspaceStateOnMount } from "./warRoom/warRoomWorkspaceStateRuntime.ts";
import {
  buildWarRoomWorkspaceView,
  resetWarRoomWorkspaceRuntimeForTests,
} from "./warRoom/warRoomWorkspaceRuntime.ts";
import { verifyNexoraRule11CertificationCompliance } from "./governance/nexoraRule11BoundaryRuntime.ts";
import { verifyNexoraRule13CertificationCompliance } from "./governance/nexoraRule13CommitmentOwnershipRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";

test.beforeEach(() => {
  resetWarRoomWorkspaceContextRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomScenarioIntakeRuntimeForTests();
  resetWarRoomActionPlanRuntimeForTests();
  resetWarRoomWorkspaceRuntimeForTests();
});

test("buildWarRoomWorkspaceView returns five foundation sections", () => {
  hydrateWarRoomWorkspaceStateOnMount("test");
  const view = buildWarRoomWorkspaceView();
  assert.equal(view.workspaceId, "war_room");
  assert.equal(view.cards.length, 5);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...WAR_ROOM_WORKSPACE_SECTION_ORDER]
  );
});

test("war room cards use connected runtime copy without simulation ownership", () => {
  hydrateWarRoomWorkspaceStateOnMount("test");
  const view = buildWarRoomWorkspaceView();
  assert.equal(view.phase, "ready");
  assert.equal(view.source, "war_room_workspace_runtime_state");
  assert.equal(view.ownsCommitmentOnly, true);
  for (const card of view.cards) {
    assert.match(card.detail, /MRP_WARROOM_RUNTIME/);
  }
});

test("war room context sync updates workspace context on selection", () => {
  hydrateWarRoomWorkspaceStateOnMount("test");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  const view = buildWarRoomWorkspaceView();
  assert.equal(view.workspaceContext.hasSelection, true);
  assert.equal(view.workspaceContext.selectedObject, "Factory A");
  assert.equal(view.workspaceContext.strategyFocus, "Operational resilience");
});

test("war room context mounts war room workspace in dynamic zone", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "war_room",
  });
  assert.equal(plan.workspaceId, "war_room");
  assert.equal(plan.mountTarget, "war_room_workspace");
  assert.ok(plan.mountKey.includes("war_room_workspace"));
});

test("war room dashboard mode mounts war room workspace foundation", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "war_room",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "war_room");
  assert.equal(plan.mountTarget, "war_room_workspace");
});

test("executive registry exposes available war room workspace", () => {
  const entry = getExecutiveWorkspaceEntry("war_room");
  assert.equal(entry.availability, "available");
  assert.equal(entry.dashboardMode, "war_room");
  assert.equal(entry.shellComponent, "WarRoomWorkspace");
});

test("lifecycle resolves war room workspace from dashboard mode", () => {
  assert.equal(resolveWorkspaceIdFromDashboardMode("war_room"), "war_room");
});

test("exports foundation freeze tag", () => {
  assert.equal(WAR_ROOM_FOUNDATION_TAG, "[MRP_WARROOM_FOUNDATION]");
});

test("exports runtime freeze tag", () => {
  assert.equal(WAR_ROOM_RUNTIME_STATE_TAG, "[MRP_WARROOM_RUNTIME]");
});

test("blocks war room forbidden actions under Rule #11", () => {
  for (const action of ["generate_simulation", "modify_timeline", "own_forecasting"] as const) {
    const blocked = guardWarRoomForbiddenAction({ action, source: "test" });
    assert.equal(blocked.allowed, false, action);
  }
});

test("blocks war room simulation ownership under Rule #13", () => {
  for (const action of ["generate_simulation", "modify_timeline", "own_forecasting"] as const) {
    const blocked = guardWarRoomCommitmentOwnershipBoundary({ action, source: "test" });
    assert.equal(blocked.allowed, false, action);
  }
});

test("war room workspace satisfies Rule #11 certification compliance", () => {
  const result = verifyNexoraRule11CertificationCompliance("war_room");
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
});

test("war room workspace satisfies Rule #13 certification compliance", () => {
  const result = verifyNexoraRule13CertificationCompliance("war_room");
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
});

test("loading phase maps loading copy before hydrate completes", () => {
  const view = buildWarRoomWorkspaceView();
  assert.equal(view.phase, "loading");
  assert.match(view.cards[0]?.headline ?? "", /Loading/);
});
