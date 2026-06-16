import test from "node:test";
import assert from "node:assert/strict";

import {
  getLifecycleTransitionMatrix,
  isAllowedLifecycleTransition,
  resetExecutiveWorkspaceLifecycleForTests,
  validateLifecycleTransition,
} from "./executiveWorkspaceLifecycleContract.ts";
import {
  commitWorkspaceLifecycleOpen,
  initializeExecutiveWorkspaceLifecycle,
  pauseActiveWorkspaceLifecycle,
  prepareWorkspaceLifecycleOpen,
  resetExecutiveWorkspaceLifecycleRuntimeForTests,
  resumeActiveWorkspaceLifecycle,
  validateWorkspaceLifecycleOpen,
} from "./executiveWorkspaceLifecycleRuntime.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceLifecycleForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
});

test("defines allowed lifecycle transition matrix", () => {
  assert.equal(isAllowedLifecycleTransition("available", "opening"), true);
  assert.equal(isAllowedLifecycleTransition("opening", "active"), true);
  assert.equal(isAllowedLifecycleTransition("active", "paused"), true);
  assert.equal(isAllowedLifecycleTransition("paused", "active"), true);
  assert.equal(isAllowedLifecycleTransition("active", "completed"), true);
  assert.equal(isAllowedLifecycleTransition("completed", "closed"), true);
  assert.equal(isAllowedLifecycleTransition("closed", "active"), false);
  assert.equal(isAllowedLifecycleTransition("deprecated", "active"), false);
  assert.equal(isAllowedLifecycleTransition("opening", "registered"), false);

  const matrix = getLifecycleTransitionMatrix();
  assert.ok(matrix.available?.includes("opening"));
});

test("initializes lifecycle states from registry catalog", () => {
  const init = initializeExecutiveWorkspaceLifecycle();
  assert.equal(init.workspaceCount, 14);

  const analyze = validateWorkspaceLifecycleOpen("analyze");
  assert.equal(analyze.valid, true);
  assert.equal(analyze.state?.currentState, "available");

  const risk = validateWorkspaceLifecycleOpen("risk");
  assert.equal(risk.valid, true);
  assert.equal(risk.state?.currentState, "available");

  const timeline = validateWorkspaceLifecycleOpen("timeline");
  assert.equal(timeline.valid, true);
  assert.equal(timeline.state?.currentState, "available");
});

test("executes primary lifecycle flow: available → opening → active → completed → closed", () => {
  initializeExecutiveWorkspaceLifecycle();

  const prepare = prepareWorkspaceLifecycleOpen("analyze");
  assert.equal(prepare.accepted, true);
  assert.equal(prepare.state?.currentState, "opening");

  const commit = commitWorkspaceLifecycleOpen("analyze");
  assert.equal(commit.accepted, true);
  assert.equal(commit.state?.currentState, "active");
  assert.ok(commit.state?.activationTimestamp);
});

test("supports paused → active alternative path", () => {
  initializeExecutiveWorkspaceLifecycle();
  prepareWorkspaceLifecycleOpen("focus");
  commitWorkspaceLifecycleOpen("focus");

  const paused = pauseActiveWorkspaceLifecycle();
  assert.equal(paused.accepted, true);
  assert.equal(paused.state?.currentState, "paused");

  const resumed = resumeActiveWorkspaceLifecycle();
  assert.equal(resumed.accepted, true);
  assert.equal(resumed.state?.currentState, "active");
});

test("rejects invalid transitions safely", () => {
  initializeExecutiveWorkspaceLifecycle();
  const invalid = validateLifecycleTransition("closed", "active");
  assert.equal(invalid.valid, false);

  const futureOpen = prepareWorkspaceLifecycleOpen("governance");
  assert.equal(futureOpen.accepted, false);
});

test("settles previous active workspace when switching", () => {
  initializeExecutiveWorkspaceLifecycle();

  prepareWorkspaceLifecycleOpen("analyze");
  commitWorkspaceLifecycleOpen("analyze");

  prepareWorkspaceLifecycleOpen("war_room");
  commitWorkspaceLifecycleOpen("war_room");

  const analyzeState = validateWorkspaceLifecycleOpen("analyze");
  assert.equal(analyzeState.state?.currentState, "closed");
});

test("lifecycle initializes once", () => {
  const first = initializeExecutiveWorkspaceLifecycle();
  const second = initializeExecutiveWorkspaceLifecycle();
  assert.equal(first.workspaceCount, second.workspaceCount);
});
