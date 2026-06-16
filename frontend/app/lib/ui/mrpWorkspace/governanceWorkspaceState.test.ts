import test from "node:test";
import assert from "node:assert/strict";

import {
  GOVERNANCE_RUNTIME_TAG,
  GOVERNANCE_STATE_TAG,
  GOVERNANCE_WORKSPACE_STATE_VERSION,
  createGovernanceLoadingState,
  createGovernanceReadyState,
  getGovernanceActiveMountKeyForTests,
  getGovernanceWorkspaceState,
  getGovernanceWorkspaceStatePublishCountForTests,
  getGovernanceWorkspaceStateServerSnapshot,
  hydrateGovernanceWorkspaceStateOnMount,
  resetGovernanceWorkspaceStateForTests,
  resolveGovernanceSelectedObjectId,
  syncGovernanceWorkspaceContext,
  teardownGovernanceWorkspaceStateOnUnmount,
} from "./governance/governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governance/governanceWorkspaceStateViewMapper.ts";
import type { MrpContextStoreSnapshot } from "../mrpContext/mrpContextStoreContract.ts";

test.beforeEach(() => {
  resetGovernanceWorkspaceStateForTests();
});

const baseSnapshot = Object.freeze({
  revision: 1,
  selectedObjectId: "factory-a",
  activeTab: "dashboard",
  dashboardMode: "governance",
  dashboardContext: "governance",
  signature: "test-signature",
  header: Object.freeze({
    panelName: "Governance",
    activeMode: "Approval • Policy • Authority",
    selectedObject: "Factory A",
    backLabel: "← Back",
    showBackNavigation: false,
    revision: 1,
    source: "mrp_context_store" as const,
  }),
}) as MrpContextStoreSnapshot;

test("exports governance runtime state tag and version", () => {
  assert.equal(GOVERNANCE_RUNTIME_TAG, "[MRP_5B2_RUNTIME]");
  assert.equal(GOVERNANCE_STATE_TAG, "[GOVERNANCE_STATE]");
  assert.equal(GOVERNANCE_WORKSPACE_STATE_VERSION, "5B.2.0");
});

test("server snapshot stays in loading phase for hydration safety", () => {
  const snapshot = getGovernanceWorkspaceStateServerSnapshot();
  assert.equal(snapshot.phase, "loading");
  assert.equal(snapshot.workspaceId, "governance");
  assert.equal(snapshot.selectedObjectId, null);
});

test("hydrate on mount transitions to ready phase", () => {
  hydrateGovernanceWorkspaceStateOnMount("gov-mount-1");
  const state = getGovernanceWorkspaceState();
  assert.equal(state.phase, "ready");
  assert.equal(state.workspaceId, "governance");
  assert.equal(getGovernanceActiveMountKeyForTests(), "gov-mount-1");
});

test("teardown on unmount closes workspace state", () => {
  hydrateGovernanceWorkspaceStateOnMount("gov-mount-1");
  teardownGovernanceWorkspaceStateOnUnmount("gov-mount-1");
  assert.equal(getGovernanceWorkspaceState().phase, "closed");
  assert.equal(getGovernanceActiveMountKeyForTests(), null);
});

test("syncGovernanceWorkspaceContext preserves route object over snapshot", () => {
  hydrateGovernanceWorkspaceStateOnMount("gov-mount-1");
  syncGovernanceWorkspaceContext(baseSnapshot, {
    routeObjectId: "route-obj",
    selectedObjectId: "prop-obj",
  });
  assert.equal(getGovernanceWorkspaceState().selectedObjectId, "route-obj");
});

test("syncGovernanceWorkspaceContext falls back to mrp snapshot selectedObjectId", () => {
  hydrateGovernanceWorkspaceStateOnMount("gov-mount-1");
  syncGovernanceWorkspaceContext(baseSnapshot, {});
  assert.equal(getGovernanceWorkspaceState().selectedObjectId, "factory-a");
});

test("object context survives remount after teardown", () => {
  hydrateGovernanceWorkspaceStateOnMount("gov-mount-1");
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });
  teardownGovernanceWorkspaceStateOnUnmount("gov-mount-1");

  hydrateGovernanceWorkspaceStateOnMount("gov-mount-2");
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });

  const state = getGovernanceWorkspaceState();
  assert.equal(state.selectedObjectId, "factory-a");
  assert.equal(state.phase, "ready");
  assert.equal(state.approvalStatus, "ready_for_review");
});

test("resolveGovernanceSelectedObjectId prefers route then props then snapshot", () => {
  assert.equal(
    resolveGovernanceSelectedObjectId(baseSnapshot, {
      routeObjectId: "route",
      selectedObjectId: "prop",
    }),
    "route"
  );
  assert.equal(
    resolveGovernanceSelectedObjectId(baseSnapshot, {
      selectedObjectId: "prop",
    }),
    "prop"
  );
  assert.equal(resolveGovernanceSelectedObjectId(baseSnapshot, {}), "factory-a");
});

test("publishGovernanceWorkspaceState dedupes identical signatures", () => {
  hydrateGovernanceWorkspaceStateOnMount("test");
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });
  const revisionAfterFirst = getGovernanceWorkspaceState().revision;
  const publishAfterFirst = getGovernanceWorkspaceStatePublishCountForTests();

  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });

  assert.equal(getGovernanceWorkspaceState().revision, revisionAfterFirst);
  assert.equal(getGovernanceWorkspaceStatePublishCountForTests(), publishAfterFirst);
});

test("view mapper surfaces runtime state statuses", () => {
  const view = buildGovernanceWorkspaceViewFromState(
    createGovernanceReadyState({
      selectedObjectId: "factory-a",
      approvalStatus: "ready_for_review",
      policyStatus: "partial",
      constraintStatus: "review_required",
    })
  );
  assert.equal(view.source, "governance_workspace_runtime_state");
  assert.equal(view.selectedObjectId, "factory-a");
  assert.match(view.panels.find((panel) => panel.id === "approval_chain")?.headline ?? "", /Approval chain/);
  assert.equal(view.approvalLayerIntelligence.approvalChain.overallStatus, "Pending");
});


test("loading state factory matches SSR snapshot shape", () => {
  const loading = createGovernanceLoadingState(0);
  const server = getGovernanceWorkspaceStateServerSnapshot();
  assert.equal(loading.phase, server.phase);
  assert.equal(loading.workspaceId, server.workspaceId);
});
