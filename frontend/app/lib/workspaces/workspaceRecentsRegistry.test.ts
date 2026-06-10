import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWorkspaceRecentsView,
  validateRecentReturnPath,
  assertRecentsCannotMutateHistory,
} from "./workspaceRecentsRegistry.ts";
import { resetWorkspaceRecentsBrakesForTests } from "./workspaceRecentsContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../dashboard/executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import {
  commitExecutiveWorkspaceBackNavigation,
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
  requestExecutiveWorkspaceBackNavigation,
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
  requestExecutiveWorkspaceTransition,
} from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";

test.beforeEach(() => {
  resetWorkspaceRecentsBrakesForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function forwardTo(workspace: "analyze" | "compare" | "scenario" | "war_room"): void {
  const request = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: workspace,
    source: "object_panel",
  });
  assert.equal(request.approved, true);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

test("builds recents from navigation history", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");
  forwardTo("compare");

  const recents = buildWorkspaceRecentsView({
    activeWorkspaceId: "compare",
    selectedObjectLabel: "Demand Model",
  });

  assert.ok(recents.items.length >= 2);
  assert.equal(recents.currentWorkspaceId, "compare");
  assert.ok(recents.recentPath.includes("analyze"));
});

test("activity summaries are informational", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");

  const recents = buildWorkspaceRecentsView({
    selectedObjectLabel: "Customer Satisfaction",
  });
  assert.ok(recents.items[0]?.contextSummary.includes("Customer Satisfaction"));
});

test("return via back stack head uses back_via_history", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");
  forwardTo("compare");

  const validation = validateRecentReturnPath({
    workspaceId: "analyze",
    activeWorkspaceId: "compare",
    selectedObjectId: "obj-1",
  });
  assert.equal(validation.approved, true);
  assert.equal(validation.returnKind, "back_via_history");
});

test("return to non-back recent uses forward_via_launch", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");
  forwardTo("compare");
  forwardTo("scenario");

  const validation = validateRecentReturnPath({
    workspaceId: "analyze",
    activeWorkspaceId: "scenario",
    selectedObjectId: "obj-1",
  });
  assert.equal(validation.approved, true);
  assert.equal(validation.returnKind, "forward_via_launch");
});

test("blocks return to active workspace", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");

  const validation = validateRecentReturnPath({
    workspaceId: "analyze",
    activeWorkspaceId: "analyze",
    selectedObjectId: "obj-1",
  });
  assert.equal(validation.approved, false);
  assert.equal(validation.reason, "already_active");
});

test("blocks invalid recent entry not in history", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");

  const validation = validateRecentReturnPath({
    workspaceId: "war_room",
    activeWorkspaceId: "analyze",
    selectedObjectId: "obj-1",
  });
  assert.equal(validation.approved, false);
});

test("navigate back preserves history for recents projection", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");
  forwardTo("compare");

  const back = requestExecutiveWorkspaceBackNavigation();
  assert.equal(back.approved, true);
  commitExecutiveWorkspaceBackNavigation("analyze");

  const recents = buildWorkspaceRecentsView({ activeWorkspaceId: "analyze" });
  assert.equal(recents.currentWorkspaceId, "analyze");
  assert.ok(recents.items.some((item) => item.activityType === "return_navigation"));
});

test("recents cannot mutate history", () => {
  assertRecentsCannotMutateHistory("delete");
  assertRecentsCannotMutateHistory("reorder");
});

test("retention policy trims projection", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("focus");
  forwardTo("analyze");
  forwardTo("compare");
  forwardTo("scenario");

  const recents = buildWorkspaceRecentsView({ retention: { maxRecentEntries: 2 } });
  assert.ok(recents.items.length <= 2);
  assert.equal(recents.retentionLimit, 2);
});

test("validation matrix: analyze compare scenario war room chain", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("analyze");
  forwardTo("compare");
  forwardTo("scenario");
  forwardTo("war_room");

  const recents = buildWorkspaceRecentsView({
    activeWorkspaceId: "war_room",
    selectedObjectLabel: "Line 3",
  });
  assert.ok(recents.items.length >= 4);
  assert.ok(recents.recentPath.includes("war_room"));
});
