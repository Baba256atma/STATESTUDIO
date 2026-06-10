import test from "node:test";
import assert from "node:assert/strict";

import {
  isSingleActiveExecutiveWorkspace,
  resetExecutiveWorkspaceTransitionControllerForTests,
  SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS,
  validateExecutiveWorkspaceTransitionTarget,
} from "./executiveWorkspaceTransitionControllerContract.ts";
import {
  resetExecutiveWorkspaceLifecycleRuntimeForTests,
} from "./executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "./executiveWorkspaceRegistryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
  requestExecutiveWorkspaceTransition,
  requestPassiveWorkspacePause,
  requestPassiveWorkspaceResume,
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests,
} from "./executiveWorkspaceTransitionControllerRuntime.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
});

test("defines single-active executive workspace set", () => {
  assert.equal(SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS.length, 5);
  assert.ok(isSingleActiveExecutiveWorkspace("analyze"));
  assert.equal(isSingleActiveExecutiveWorkspace("overview"), false);
});

test("validates transition targets through registry", () => {
  const analyze = validateExecutiveWorkspaceTransitionTarget("analyze");
  assert.equal(analyze.valid, true);

  const risk = validateExecutiveWorkspaceTransitionTarget("risk");
  assert.equal(risk.valid, false);
});

test("enforces single active workspace through transition flow", () => {
  const first = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "analyze",
    source: "object_panel",
  });
  assert.equal(first.approved, true);
  commitExecutiveWorkspaceTransition("analyze");

  const second = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "compare",
    source: "object_panel",
  });
  assert.equal(second.approved, true);
  commitExecutiveWorkspaceTransition("compare");

  const analyzeState = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "analyze",
    source: "object_panel",
  });
  assert.equal(analyzeState.approved, true);
});

test("supports focus → analyze → compare → scenario → war_room → focus chain", () => {
  const chain = ["focus", "analyze", "compare", "scenario", "war_room", "focus"] as const;
  for (const target of chain) {
    const result = requestExecutiveWorkspaceTransition({
      targetWorkspaceId: target,
      source: "dashboard_direct",
    });
    assert.equal(result.approved, true, `transition to ${target} should approve`);
    commitExecutiveWorkspaceTransition(target);
  }
});

test("rejects future workspace transitions", () => {
  const result = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "risk",
    source: "assistant_bridge",
  });
  assert.equal(result.approved, false);
});

test("supports passive pause and resume without workspace switch", () => {
  requestExecutiveWorkspaceTransition({ targetWorkspaceId: "focus", source: "object_panel" });
  commitExecutiveWorkspaceTransition("focus");

  const paused = requestPassiveWorkspacePause();
  assert.equal(paused.approved, true);

  const resumed = requestPassiveWorkspaceResume();
  assert.equal(resumed.approved, true);
});

test("blocks concurrent transition requests before commit", () => {
  const first = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "analyze",
    source: "object_panel",
  });
  assert.equal(first.approved, true);

  const concurrent = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "compare",
    source: "object_panel",
  });
  assert.equal(concurrent.approved, false);
  assert.equal(concurrent.reason, "concurrent_transition_detected");

  commitExecutiveWorkspaceTransition("analyze");
});
