import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_PHASE4D_COMPLETE_TAG,
  TIMELINE_CERTIFIED_TAG,
  TIMELINE_FOUNDATION_TAG,
  TIMELINE_WORKSPACE_SECTION_ORDER,
} from "./timeline/timelineWorkspaceContract.ts";
import { resetTimelineObjectContextRuntimeForTests } from "./timeline/timelineObjectContextRuntime.ts";
import { resetTimelineWorkspaceDataRuntimeForTests } from "./timeline/timelineWorkspaceDataRuntime.ts";
import { hydrateTimelineWorkspaceStateOnMount } from "./timeline/timelineWorkspaceStateRuntime.ts";
import {
  resetTimelineWorkspaceRuntimeForTests,
  buildTimelineWorkspaceView,
} from "./timeline/timelineWorkspaceRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";
import { verifyNexoraRule11CertificationCompliance } from "./governance/nexoraRule11BoundaryRuntime.ts";

test.beforeEach(() => {
  resetTimelineObjectContextRuntimeForTests();
  resetTimelineWorkspaceDataRuntimeForTests();
  resetTimelineWorkspaceRuntimeForTests();
});

test("buildTimelineWorkspaceView returns five foundation sections", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  const view = buildTimelineWorkspaceView();
  assert.equal(view.workspaceId, "timeline");
  assert.equal(view.cards.length, 5);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...TIMELINE_WORKSPACE_SECTION_ORDER]
  );
});

test("timeline cards use connected placeholder copy without BI claims", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  const view = buildTimelineWorkspaceView();
  assert.equal(view.phase, "ready");
  assert.equal(view.source, "timeline_workspace_runtime_state");
  for (const card of view.cards) {
    assert.match(card.detail, /MRP:4D:1|MRP_TIMELINE_STATE/);
  }
});

test("timeline context mounts timeline workspace in dynamic zone", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "timeline",
  });
  assert.equal(plan.workspaceId, "timeline");
  assert.equal(plan.mountTarget, "timeline_workspace");
  assert.ok(plan.mountKey.includes("timeline_workspace"));
});

test("timeline dashboard mode mounts timeline workspace foundation", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "timeline",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "timeline");
  assert.equal(plan.mountTarget, "timeline_workspace");
});

test("executive registry exposes available timeline workspace", () => {
  const entry = getExecutiveWorkspaceEntry("timeline");
  assert.equal(entry.availability, "available");
  assert.equal(entry.dashboardMode, "timeline");
  assert.equal(entry.shellComponent, "TimelineWorkspace");
});

test("lifecycle resolves timeline workspace from dashboard mode", () => {
  assert.equal(resolveWorkspaceIdFromDashboardMode("timeline"), "timeline");
});

test("exports foundation tag", () => {
  assert.equal(TIMELINE_FOUNDATION_TAG, "[MRP_TIMELINE_FOUNDATION]");
});

test("exports certification freeze tags", () => {
  assert.equal(TIMELINE_CERTIFIED_TAG, "[MRP_TIMELINE_CERTIFIED]");
  assert.equal(MRP_PHASE4D_COMPLETE_TAG, "[MRP_PHASE4D_COMPLETE]");
});

test("timeline workspace satisfies Rule #11 executive decision boundary", () => {
  const result = verifyNexoraRule11CertificationCompliance("timeline");
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
});

test("loading phase maps loading copy before hydrate completes", () => {
  const view = buildTimelineWorkspaceView();
  assert.equal(view.phase, "loading");
  assert.match(view.cards[0]?.headline ?? "", /Loading/);
});
