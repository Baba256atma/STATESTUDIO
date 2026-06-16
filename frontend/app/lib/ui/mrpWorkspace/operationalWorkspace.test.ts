import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_PHASE4B_COMPLETE_TAG,
  OPERATIONAL_CERTIFIED_TAG,
  OPERATIONAL_FOUNDATION_TAG,
  OPERATIONAL_WORKSPACE_SECTION_ORDER,
} from "./operational/operationalWorkspaceContract.ts";
import {
  DEFAULT_OPERATIONAL_READY_STATE,
} from "./operational/operationalWorkspaceStateContract.ts";
import {
  hydrateOperationalWorkspaceStateOnMount,
  publishOperationalWorkspaceState,
} from "./operational/operationalWorkspaceStateRuntime.ts";
import {
  buildOperationalWorkspaceView,
  resetOperationalWorkspaceRuntimeForTests,
} from "./operational/operationalWorkspaceRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";

test.beforeEach(() => {
  resetOperationalWorkspaceRuntimeForTests();
});

test("buildOperationalWorkspaceView returns four foundation sections", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  const view = buildOperationalWorkspaceView();
  assert.equal(view.workspaceId, "operational");
  assert.equal(view.cards.length, 4);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...OPERATIONAL_WORKSPACE_SECTION_ORDER]
  );
});

test("operational status includes healthy warning critical scale when ready", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  const view = buildOperationalWorkspaceView();
  assert.equal(view.phase, "ready");
  assert.equal(view.operationalStatus, "healthy");
  assert.deepEqual(view.statusOptions, ["healthy", "warning", "critical"]);
  const statusCard = view.cards.find((card) => card.id === "operational_status");
  assert.equal(statusCard?.headline, "Healthy");
});

test("activity level includes low medium high scale when ready", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  const view = buildOperationalWorkspaceView();
  assert.equal(view.activityLevel, "medium");
  assert.deepEqual(view.activityOptions, ["low", "medium", "high"]);
  const activityCard = view.cards.find((card) => card.id === "activity_level");
  assert.equal(activityCard?.headline, "Medium");
});

test("runtime cards use connected defaults without BI claims", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  const view = buildOperationalWorkspaceView();
  const focus = view.cards.find((card) => card.id === "operational_focus");
  const notes = view.cards.find((card) => card.id === "operational_notes");

  assert.equal(view.source, "operational_workspace_runtime_state");
  assert.match(focus?.detail ?? "", /MRP:4:8/);
  assert.match(notes?.detail ?? "", /MRP:4:8/);
});

test("loading phase maps loading copy before hydrate completes", () => {
  const view = buildOperationalWorkspaceView();
  assert.equal(view.phase, "loading");
  assert.match(view.cards[0]?.headline ?? "", /Loading/);
});

test("sources context mounts operational workspace in dynamic zone", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "sources",
  });
  assert.equal(plan.workspaceId, "operational");
  assert.equal(plan.mountTarget, "operational_workspace");
  assert.ok(plan.mountKey.includes("operational_workspace"));
});

test("overview home still mounts executive summary workspace", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "executive_summary");
  assert.equal(plan.mountTarget, "executive_summary_workspace");
});

test("exports foundation tag", () => {
  assert.equal(OPERATIONAL_FOUNDATION_TAG, "[OPERATIONAL_FOUNDATION]");
});

test("exports certification freeze tags", () => {
  assert.equal(OPERATIONAL_CERTIFIED_TAG, "[OPERATIONAL_CERTIFIED]");
  assert.equal(MRP_PHASE4B_COMPLETE_TAG, "[MRP_PHASE4B_COMPLETE]");
});

test("publish updates workspace view without stale values", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: "warning",
    activityLevel: "high",
    operationalFocus: Object.freeze({
      headline: "Updated focus headline",
      detail: "Updated focus detail.",
    }),
  });
  const view = buildOperationalWorkspaceView();
  assert.equal(view.operationalStatus, "warning");
  assert.equal(view.activityLevel, "high");
  assert.equal(
    view.cards.find((card) => card.id === "operational_focus")?.headline,
    "Updated focus headline"
  );
  assert.equal(view.revision, 3);
});

test("ready defaults include object context after hydrate", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  const view = buildOperationalWorkspaceView();
  assert.equal(view.objectContext.hasSelection, false);
  assert.ok(view.objectContext.selectedObject.trim());
});

test("ready defaults remain defined after reset", () => {
  publishOperationalWorkspaceState({
    phase: "ready",
    operationalStatus: DEFAULT_OPERATIONAL_READY_STATE.operationalStatus,
    activityLevel: DEFAULT_OPERATIONAL_READY_STATE.activityLevel,
    operationalFocus: DEFAULT_OPERATIONAL_READY_STATE.operationalFocus,
    operationalNotes: DEFAULT_OPERATIONAL_READY_STATE.operationalNotes,
    objectContext: DEFAULT_OPERATIONAL_READY_STATE.objectContext,
  });
  const view = buildOperationalWorkspaceView();
  for (const card of view.cards) {
    assert.notEqual(card.headline, undefined);
    assert.notEqual(card.detail, undefined);
  }
  assert.ok(view.objectContext.selectedObject.trim());
});
