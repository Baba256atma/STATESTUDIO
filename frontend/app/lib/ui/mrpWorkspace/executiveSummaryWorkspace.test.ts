import test from "node:test";
import assert from "node:assert/strict";

import {
  EXEC_SUMMARY_CERTIFIED_TAG,
  EXEC_SUMMARY_FOUNDATION_TAG,
  MRP_PHASE4A_COMPLETE_TAG,
  EXECUTIVE_SUMMARY_WORKSPACE_SECTION_ORDER,
} from "./executiveSummary/executiveSummaryWorkspaceContract.ts";
import {
  syncExecutiveSummaryObjectContext,
} from "./executiveSummary/executiveSummaryObjectContextRuntime.ts";
import {
  hydrateExecutiveSummaryStateOnMount,
  publishExecutiveSummaryState,
} from "./executiveSummary/executiveSummaryStateRuntime.ts";
import {
  DEFAULT_EXECUTIVE_SUMMARY_READY_STATE,
} from "./executiveSummary/executiveSummaryStateContract.ts";
import {
  buildExecutiveSummaryWorkspaceView,
  resetExecutiveSummaryWorkspaceRuntimeForTests,
} from "./executiveSummary/executiveSummaryWorkspaceRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";

test.beforeEach(() => {
  resetExecutiveSummaryWorkspaceRuntimeForTests();
});

test("buildExecutiveSummaryWorkspaceView returns four foundation sections", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  const view = buildExecutiveSummaryWorkspaceView();
  assert.equal(view.workspaceId, "executive_summary");
  assert.equal(view.cards.length, 4);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...EXECUTIVE_SUMMARY_WORKSPACE_SECTION_ORDER]
  );
});

test("system status includes healthy warning critical scale when ready", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  const view = buildExecutiveSummaryWorkspaceView();
  assert.equal(view.phase, "ready");
  assert.equal(view.systemStatus, "healthy");
  assert.deepEqual(view.statusOptions, ["healthy", "warning", "critical"]);
  const statusCard = view.cards.find((card) => card.id === "system_status");
  assert.equal(statusCard?.headline, "Healthy");
});

test("runtime cards use connected defaults without BI claims", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  const view = buildExecutiveSummaryWorkspaceView();
  const topRisk = view.cards.find((card) => card.id === "top_risk");
  const topOpportunity = view.cards.find((card) => card.id === "top_opportunity");
  const attention = view.cards.find((card) => card.id === "recommended_attention");

  assert.equal(view.source, "executive_summary_runtime_state");
  assert.match(topRisk?.detail ?? "", /MRP:4:2/);
  assert.match(topOpportunity?.detail ?? "", /MRP:4:2/);
  assert.match(attention?.detail ?? "", /MRP:4:2/);
});

test("loading phase maps loading copy before hydrate completes", () => {
  const view = buildExecutiveSummaryWorkspaceView();
  assert.equal(view.phase, "loading");
  assert.match(view.cards[0]?.headline ?? "", /Loading/);
});

test("overview home mounts executive summary workspace in dynamic zone", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "executive_summary");
  assert.equal(plan.mountTarget, "executive_summary_workspace");
  assert.ok(plan.mountKey.includes("executive_summary_workspace"));
});

test("focus mode still delegates to dashboard runtime", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "focus",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "executive_summary");
  assert.equal(plan.mountTarget, "dashboard_runtime");
});

test("exports foundation tag", () => {
  assert.equal(EXEC_SUMMARY_FOUNDATION_TAG, "[EXEC_SUMMARY_FOUNDATION]");
});

test("exports certification freeze tags", () => {
  assert.equal(EXEC_SUMMARY_CERTIFIED_TAG, "[EXEC_SUMMARY_CERTIFIED]");
  assert.equal(MRP_PHASE4A_COMPLETE_TAG, "[MRP_PHASE4A_COMPLETE]");
});

test("publish updates workspace view without stale values", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  publishExecutiveSummaryState({
    phase: "ready",
    systemStatus: "warning",
    topRisk: Object.freeze({
      headline: "Updated risk headline",
      detail: "Updated risk detail.",
    }),
  });
  const view = buildExecutiveSummaryWorkspaceView();
  assert.equal(view.systemStatus, "warning");
  assert.equal(
    view.cards.find((card) => card.id === "top_risk")?.headline,
    "Updated risk headline"
  );
  assert.equal(view.revision, 3);
});

test("ready defaults remain defined after reset", () => {
  publishExecutiveSummaryState({
    phase: "ready",
    systemStatus: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.systemStatus,
    topRisk: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topRisk,
    topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.topOpportunity,
    recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_READY_STATE.recommendedAttention,
  });
  const view = buildExecutiveSummaryWorkspaceView();
  for (const card of view.cards) {
    assert.notEqual(card.headline, undefined);
    assert.notEqual(card.detail, undefined);
  }
  assert.ok(view.objectContext.selectedObject.trim());
});

test("object selection updates workspace object context", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  syncExecutiveSummaryObjectContext({
    selectedObjectId: "production-line",
    selectedObjectLabel: "Production Line",
  });
  const view = buildExecutiveSummaryWorkspaceView();
  assert.equal(view.objectContext.selectedObject, "Production Line");
  assert.equal(view.objectContext.objectStatus, "Active");
  assert.equal(view.objectContext.hasSelection, true);
});

test("object deselection restores safe defaults without losing summary cards", () => {
  hydrateExecutiveSummaryStateOnMount("test");
  syncExecutiveSummaryObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncExecutiveSummaryObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const view = buildExecutiveSummaryWorkspaceView();
  assert.equal(view.objectContext.hasSelection, false);
  assert.equal(view.cards.length, 4);
  assert.equal(view.systemStatus, "healthy");
});
