import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_PHASE4C_COMPLETE_TAG,
  RISK_CERTIFIED_TAG,
  RISK_FOUNDATION_TAG,
  RISK_WORKSPACE_SECTION_ORDER,
} from "./risk/riskWorkspaceContract.ts";
import {
  hydrateRiskWorkspaceStateOnMount,
} from "./risk/riskWorkspaceStateRuntime.ts";
import { syncRiskWorkspaceData } from "./risk/riskWorkspaceDataRuntime.ts";
import { MRP_RISK_STATE_TAG } from "./risk/riskWorkspaceMetricsContract.ts";
import {
  buildRiskWorkspaceView,
  resetRiskWorkspaceRuntimeForTests,
} from "./risk/riskWorkspaceRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";

test.beforeEach(() => {
  resetRiskWorkspaceRuntimeForTests();
});

test("buildRiskWorkspaceView returns four foundation sections", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  const view = buildRiskWorkspaceView();
  assert.equal(view.workspaceId, "risk");
  assert.equal(view.cards.length, 4);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...RISK_WORKSPACE_SECTION_ORDER]
  );
});

test("risk cards use connected placeholder copy without BI claims", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ selectedObjectId: null, sceneJson: null });
  const view = buildRiskWorkspaceView();
  assert.equal(view.phase, "ready");
  assert.equal(view.source, "risk_workspace_runtime_state");
  for (const card of view.cards) {
    assert.match(card.detail, /MRP_RISK_STATE|\[MRP_RISK_STATE\]/);
  }
});

test("risk context mounts risk workspace in dynamic zone", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "risk",
  });
  assert.equal(plan.workspaceId, "risk");
  assert.equal(plan.mountTarget, "risk_workspace");
  assert.ok(plan.mountKey.includes("risk_workspace"));
});

test("risk dashboard mode mounts risk workspace foundation", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "risk",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "risk");
  assert.equal(plan.mountTarget, "risk_workspace");
});

test("executive registry exposes available risk workspace", () => {
  const entry = getExecutiveWorkspaceEntry("risk");
  assert.equal(entry.availability, "available");
  assert.equal(entry.dashboardMode, "risk");
  assert.equal(entry.shellComponent, "RiskWorkspace");
});

test("lifecycle resolves risk workspace from dashboard mode", () => {
  assert.equal(resolveWorkspaceIdFromDashboardMode("risk"), "risk");
});

test("exports foundation tag", () => {
  assert.equal(RISK_FOUNDATION_TAG, "[MRP_RISK_FOUNDATION]");
});

test("exports risk state tag", () => {
  assert.equal(MRP_RISK_STATE_TAG, "[MRP_RISK_STATE]");
});

test("exports certification freeze tags", () => {
  assert.equal(RISK_CERTIFIED_TAG, "[MRP_RISK_CERTIFIED]");
  assert.equal(MRP_PHASE4C_COMPLETE_TAG, "[MRP_PHASE4C_COMPLETE]");
});

test("loading phase maps loading copy before hydrate completes", () => {
  const view = buildRiskWorkspaceView();
  assert.equal(view.phase, "loading");
  assert.match(view.cards[0]?.headline ?? "", /Loading/);
});
