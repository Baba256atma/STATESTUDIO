import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_WORKSPACE_HISTORY_DEPTH,
  resetExecutiveWorkspaceNavigationHistoryForTests,
  validateBackNavigationTarget,
} from "./executiveWorkspaceNavigationHistoryContract.ts";
import {
  resetExecutiveWorkspaceLifecycleRuntimeForTests,
} from "./executiveWorkspaceLifecycleRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests,
} from "./executiveWorkspaceTransitionControllerRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "./executiveWorkspaceRegistryRuntime.ts";
import {
  commitExecutiveWorkspaceBackNavigation,
  getWorkspaceNavigationBackStack,
  getWorkspaceNavigationSummary,
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
  requestExecutiveWorkspaceBackNavigation,
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "./executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
  requestExecutiveWorkspaceTransition,
} from "./executiveWorkspaceTransitionControllerRuntime.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
});

function forwardTo(workspace: "focus" | "analyze" | "compare" | "scenario" | "war_room"): void {
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

test("default history depth is 10", () => {
  assert.equal(DEFAULT_WORKSPACE_HISTORY_DEPTH, 10);
});

test("records forward navigation and builds back stack", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("focus");
  forwardTo("analyze");
  forwardTo("compare");

  const stack = getWorkspaceNavigationBackStack();
  assert.deepEqual(stack, ["analyze", "focus"]);

  const summary = getWorkspaceNavigationSummary();
  assert.equal(summary.currentWorkspaceId, "compare");
  assert.equal(summary.previousWorkspaceId, "analyze");
  assert.ok(summary.recentPath.includes("focus"));
  assert.ok(summary.recentPath.includes("compare"));
});

test("supports controlled back navigation through transition controller", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("focus");
  forwardTo("analyze");
  forwardTo("compare");
  forwardTo("scenario");

  assert.equal(getWorkspaceNavigationSummary().currentWorkspaceId, "scenario");

  const backRequest = requestExecutiveWorkspaceBackNavigation();
  assert.equal(backRequest.approved, true);
  assert.equal(backRequest.targetWorkspaceId, "compare");

  const backCommit = commitExecutiveWorkspaceBackNavigation("compare");
  assert.equal(backCommit.committed, true);
  assert.equal(getWorkspaceNavigationSummary().currentWorkspaceId, "compare");
  assert.deepEqual(getWorkspaceNavigationBackStack(), ["analyze", "focus"]);
});

test("rejects back navigation when stack is empty", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  const back = requestExecutiveWorkspaceBackNavigation();
  assert.equal(back.approved, false);
});

test("rejects invalid back navigation targets", () => {
  const validation = validateBackNavigationTarget("risk");
  assert.equal(validation.valid, false);
});

test("trims history to max depth", () => {
  initializeExecutiveWorkspaceNavigationHistory({ maxDepth: 3 });
  forwardTo("focus");
  forwardTo("analyze");
  forwardTo("compare");
  forwardTo("scenario");

  const summary = getWorkspaceNavigationSummary();
  assert.equal(summary.entryCount, 3);
  assert.equal(summary.maxDepth, 3);
  assert.equal(summary.recentPath.length, 3);
});

test("follows focus → analyze → compare → scenario path", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardTo("focus");
  forwardTo("analyze");
  forwardTo("compare");
  forwardTo("scenario");

  const summary = getWorkspaceNavigationSummary();
  assert.equal(summary.recentPath[summary.recentPath.length - 1], "scenario");
  assert.ok(summary.backStack.includes("compare"));
});
