import test from "node:test";
import assert from "node:assert/strict";

import {
  GOVERNANCE_FOUNDATION_TAG,
  GOVERNANCE_RUNTIME_TAG,
  GOVERNANCE_POLICY_INTELLIGENCE_TAG,
  GOVERNANCE_APPROVAL_LAYER_TAG,
  GOVERNANCE_DECISION_GATE_TAG,
  MRP_GOVERNANCE_CERTIFIED_TAG,
  MRP_PHASE5B_COMPLETE_TAG,
  GOVERNANCE_WORKSPACE_SECTION_ORDER,
  GOVERNANCE_WORKSPACE_SUBTITLE,
  GOVERNANCE_WORKSPACE_TITLE,
  GOVERNANCE_WORKSPACE_VERSION,
  CANONICAL_GOVERNANCE_WORKSPACE_OWNER,
} from "./governance/governanceWorkspaceContract.ts";
import { governanceWorkspaceRuntimeContract } from "./governance/governanceWorkspaceRuntime.ts";
import {
  guardGovernanceFoundationForbiddenAction,
  resetGovernanceWorkspaceFoundationBoundaryForTests,
} from "./governance/governanceWorkspaceFoundationBoundary.ts";
import { getMrpWorkspaceRegistryEntry } from "./mrpWorkspaceRegistry.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import {
  buildGovernanceWorkspaceView,
  hydrateGovernanceWorkspaceStateOnMount,
  resetGovernanceWorkspaceRuntimeForTests,
} from "./governance/governanceWorkspaceRuntime.ts";
import { detectDuplicateExecutiveWorkspaceDefinitions } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveExecutiveWorkspaceByDashboardMode } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { buildMrpContextHeaderView } from "../mrpContext/mrpContextResolver.ts";

test.beforeEach(() => {
  resetGovernanceWorkspaceRuntimeForTests();
  resetGovernanceWorkspaceFoundationBoundaryForTests();
});

test("exports governance foundation tag version and canonical owner", () => {
  assert.equal(GOVERNANCE_FOUNDATION_TAG, "[MRP_5B1_FOUNDATION]");
  assert.equal(GOVERNANCE_RUNTIME_TAG, "[MRP_5B2_RUNTIME]");
  assert.equal(GOVERNANCE_POLICY_INTELLIGENCE_TAG, "[MRP_5B3_POLICY]");
  assert.equal(GOVERNANCE_APPROVAL_LAYER_TAG, "[MRP_5B4_APPROVAL]");
  assert.equal(GOVERNANCE_DECISION_GATE_TAG, "[MRP_5B5_GATE]");
  assert.equal(MRP_GOVERNANCE_CERTIFIED_TAG, "[MRP_GOVERNANCE_CERTIFIED]");
  assert.equal(MRP_PHASE5B_COMPLETE_TAG, "[MRP_PHASE5B_COMPLETE]");
  assert.equal(GOVERNANCE_WORKSPACE_VERSION, "5B.6.0");
  assert.equal(CANONICAL_GOVERNANCE_WORKSPACE_OWNER, "GovernanceWorkspace");
});

test("registry entry uses governance foundation mount", () => {
  const entry = getMrpWorkspaceRegistryEntry("governance");
  assert.equal(entry.loaderStatus, "foundation");
  assert.equal(entry.mountTarget, "governance_workspace");
});

test("dashboardMode governance resolves to governance_workspace mount target", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "governance",
    dashboardContext: "governance",
    subWorkspaceMode: null,
  });
  assert.equal(plan.workspaceId, "governance");
  assert.equal(plan.mountTarget, "governance_workspace");
  assert.notEqual(plan.mountTarget, "loader_shell");
});

test("foundation view exposes six governance panels from runtime state", () => {
  hydrateGovernanceWorkspaceStateOnMount("test");
  const view = buildGovernanceWorkspaceView({ mountKey: "test" });
  assert.equal(view.workspaceId, "governance");
  assert.equal(view.title, GOVERNANCE_WORKSPACE_TITLE);
  assert.equal(view.subtitle, GOVERNANCE_WORKSPACE_SUBTITLE);
  assert.equal(view.ownsGovernanceReviewOnly, true);
  assert.equal(view.source, "governance_workspace_runtime_state");
  assert.equal(view.panels.length, 6);
  assert.equal(view.approvalLayerIntelligence.approvalChain.readOnly, true);
  assert.equal(view.approvalLayerIntelligence.authorityReview.warRoomOwnsCommitment, true);
  assert.equal(view.decisionGate.decidesReadiness, true);
  assert.equal(view.decisionGate.mayExecute, false);
  assert.deepEqual(
    view.panels.map((panel) => panel.id),
    [...GOVERNANCE_WORKSPACE_SECTION_ORDER]
  );
});

test("runtime contract exposes hydrate build trace reset with runtime tag", () => {
  assert.equal(governanceWorkspaceRuntimeContract.tag, GOVERNANCE_RUNTIME_TAG);
  assert.equal(governanceWorkspaceRuntimeContract.version, "5B.2.0");
  assert.equal(typeof governanceWorkspaceRuntimeContract.hydrateOnMount, "function");
  assert.equal(typeof governanceWorkspaceRuntimeContract.buildView, "function");
});

test("governance registry uses unique dashboardMode", () => {
  const duplicates = detectDuplicateExecutiveWorkspaceDefinitions();
  assert.equal(duplicates.some((entry) => entry.includes("dashboardMode:governance")), false);
  assert.equal(resolveExecutiveWorkspaceByDashboardMode("governance")?.id, "governance");
  assert.equal(resolveExecutiveWorkspaceByDashboardMode("governance")?.dashboardMode, "governance");
});

test("foundation boundary blocks forecasts scenarios and execution", () => {
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "generate_forecast" }).allowed, false);
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "create_scenario" }).allowed, false);
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "execute_decision" }).allowed, false);
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "replace_advisory" }).allowed, false);
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "replace_war_room" }).allowed, false);
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "scene_write" }).allowed, false);
  assert.equal(guardGovernanceFoundationForbiddenAction({ action: "object_mutation" }).allowed, false);
});

test("context header shows governance panel and subtitle mode", () => {
  const header = buildMrpContextHeaderView(
    {
      activeTab: "dashboard",
      dashboardMode: "governance",
      dashboardContext: "governance",
      selectedObjectId: "factory-a",
      selectedObjectLabel: "Factory A",
      routeObjectId: "factory-a",
      routeObjectName: "Factory A",
      subWorkspaceMode: null,
    },
    1
  );
  assert.equal(header.panelName, "Governance");
  assert.equal(header.activeMode, "Approval • Policy • Authority");
  assert.equal(header.selectedObject, "Factory A");
});
