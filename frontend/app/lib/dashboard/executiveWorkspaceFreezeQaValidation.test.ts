import test from "node:test";
import assert from "node:assert/strict";

import {
  certifySingleActiveWorkspace,
  countActiveExecutiveWorkspaces,
  resolveWorkspaceFreezeVerdict,
  runWorkspaceFreezeQaMatrix,
  validateRegistryIntegrity,
  WORKSPACE_FREEZE_BRAKE_PREFIXES,
} from "./executiveWorkspaceFreezeQaValidation.ts";
import {
  getWorkspaceLifecycleState,
  resetExecutiveWorkspaceLifecycleRuntimeForTests,
} from "./executiveWorkspaceLifecycleRuntime.ts";
import {
  resetExecutiveWorkspaceRegistryRuntimeForTests,
} from "./executiveWorkspaceRegistryRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests,
} from "./executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "./executiveWorkspaceNavigationHistoryContract.ts";
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
import { routeObjectPanelActionRequest } from "../object-panel/objectPanelActionRouterRuntime.ts";
import { resetObjectPanelActionRouterForTests } from "../object-panel/objectPanelActionRouterContract.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetObjectPanelActionRouterForTests();
});

function forwardViaController(
  workspace: "focus" | "analyze" | "compare" | "scenario" | "war_room"
): void {
  const request = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: workspace,
    source: "object_panel",
  });
  assert.equal(request.approved, true, `forward ${workspace} request`);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true, `forward ${workspace} commit`);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

function assertExactlyOneActive(): void {
  const count = countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id));
  assert.equal(count, 1, `expected exactly one active workspace, got ${count}`);
}

function backToExpected(expected: "focus" | "analyze" | "compare" | "scenario"): void {
  const back = requestExecutiveWorkspaceBackNavigation();
  assert.equal(back.approved, true, `back to ${expected}`);
  assert.equal(back.targetWorkspaceId, expected);
  commitExecutiveWorkspaceBackNavigation(expected);
  assertActiveIs(expected);
  assertExactlyOneActive();
}

function assertActiveIs(workspace: "focus" | "analyze" | "compare" | "scenario" | "war_room"): void {
  const count = countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id));
  assert.equal(count, 1);
  const state = getWorkspaceLifecycleState(workspace);
  assert.equal(state?.currentState, "active");
}

test("freeze QA: registry integrity passes", () => {
  const results = validateRegistryIntegrity();
  assert.ok(results.every((r) => r.status === "pass"), results.map((r) => r.evidence).join("; "));
});

test("freeze QA: all brake prefixes registered", () => {
  assert.equal(WORKSPACE_FREEZE_BRAKE_PREFIXES.length, 5);
  const matrix = runWorkspaceFreezeQaMatrix();
  assert.equal(matrix.failCount, 0);
});

test("certification matrix: Analyze → Compare → Scenario → War Room → Analyze", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardViaController("analyze");
  assertActiveIs("analyze");
  assertExactlyOneActive();

  forwardViaController("compare");
  assertActiveIs("compare");
  assertExactlyOneActive();

  forwardViaController("scenario");
  assertActiveIs("scenario");
  assertExactlyOneActive();

  forwardViaController("war_room");
  assertActiveIs("war_room");
  assertExactlyOneActive();

  forwardViaController("analyze");
  assertActiveIs("analyze");
  assertExactlyOneActive();

  const summary = getWorkspaceNavigationSummary();
  assert.equal(summary.currentWorkspaceId, "analyze");
  assert.ok(summary.recentPath.includes("war_room"));
});

test("certification matrix: back navigation from Analyze, Compare, Scenario, War Room", () => {
  initializeExecutiveWorkspaceNavigationHistory();

  forwardViaController("focus");
  forwardViaController("analyze");
  backToExpected("focus");

  forwardViaController("analyze");
  forwardViaController("compare");
  backToExpected("analyze");

  forwardViaController("compare");
  forwardViaController("scenario");
  backToExpected("compare");

  forwardViaController("scenario");
  forwardViaController("war_room");
  backToExpected("scenario");
});

test("certification matrix: back navigation chain from Scenario → Compare → Analyze", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardViaController("focus");
  forwardViaController("analyze");
  forwardViaController("compare");
  forwardViaController("scenario");

  backToExpected("compare");
  backToExpected("analyze");
});

test("failure: missing workspace rejected at registry route", () => {
  const route = routeObjectPanelActionRequest({
    action: "analyze",
    objectId: "",
  });
  assert.equal(route.success, false);
  assert.equal(countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id)), 0);
});

test("failure: zero active workspaces fails certification", () => {
  assert.equal(certifySingleActiveWorkspace(0).status, "fail");
  assert.equal(certifySingleActiveWorkspace(1).status, "pass");
});

test("failure: future workspace rejected", () => {
  const request = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "risk",
    source: "dashboard_direct",
  });
  assert.equal(request.approved, false);
});

test("failure: empty back stack rejected", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardViaController("analyze");
  const back = requestExecutiveWorkspaceBackNavigation();
  assert.equal(back.approved, false);
  assertActiveIs("analyze");
});

test("failure: concurrent transition rejected", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  requestExecutiveWorkspaceTransition({ targetWorkspaceId: "analyze", source: "object_panel" });
  const concurrent = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "compare",
    source: "object_panel",
  });
  assert.equal(concurrent.approved, false);
  assert.equal(concurrent.reason, "concurrent_transition_detected");
  commitExecutiveWorkspaceTransition("analyze");
});

test("failure: multiple active workspaces fails certification", () => {
  const result = certifySingleActiveWorkspace(2);
  assert.equal(result.status, "fail");
});

test("integration: object panel router uses full stack", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  const route = routeObjectPanelActionRequest({
    action: "war_room",
    objectId: "line-3",
    objectName: "Line 3",
  });
  assert.equal(route.success, true);
  assert.equal(route.mode, "war_room");
});

test("history: back stack integrity after forward chain", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  forwardViaController("analyze");
  forwardViaController("compare");
  forwardViaController("scenario");

  const stack = getWorkspaceNavigationBackStack();
  assert.deepEqual(stack, ["compare", "analyze"]);
});

test("freeze verdict: core architecture passes with legacy warnings", () => {
  const matrix = runWorkspaceFreezeQaMatrix({ activeWorkspaceCount: 1 });
  assert.equal(matrix.failCount, 0);

  const verdict = resolveWorkspaceFreezeVerdict({
    failCount: matrix.failCount,
    warningCount: matrix.warningCount,
    legacyBypassCount: 3,
  });
  assert.equal(verdict, "PASS WITH WARNINGS");
});
