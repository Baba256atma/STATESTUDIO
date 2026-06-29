import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS,
  EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER,
} from "./executiveTimeCameraResolver.ts";
import {
  EXECUTIVE_TIME_CAMERA_TAGS,
  EXECUTIVE_TIME_CAMERA_MANIFEST,
  runExecutiveTimeCameraCertification,
} from "./executiveTimeCameraCertification.ts";
import {
  getExecutiveTimeCameraPosition,
  getHistory,
  jumpToCurrentQuarter,
  jumpToCurrentYear,
  jumpToFutureProjection,
  jumpToPastReview,
  jumpToToday,
  moveBackward,
  moveForward,
  moveToContext,
  next,
  previous,
  resetCamera,
  resetExecutiveTimeCameraForTests,
} from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_CAMERA_VERSION } from "./executiveTimeCameraTypes.ts";
import { runExecutiveTimeContextCertification } from "./executiveTimeContextCertification.ts";
import { resolveCurrentContext, switchExecutiveTimeContext } from "./executiveTimeContextEngine.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS, EXECUTIVE_TIME_MUST_NOT_OWN } from "./executiveTimeContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
});

test("exports required camera tags and navigation ladder", () => {
  assert.equal(EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER.length, 7);
  for (const tag of EXECUTIVE_TIME_CAMERA_TAGS) {
    assert.ok(tag.startsWith("["), tag);
  }
});

test("moveToContext navigates through context engine", () => {
  const workspaceId = "ws-camera-move";
  const result = moveToContext({ workspaceId, contextId: "this_week", source: "user", reason: "manual_selection" });
  assert.equal(result.success, true);
  assert.equal(result.position?.currentContext, "this_week");
  assert.equal(result.position?.version, EXECUTIVE_TIME_CAMERA_VERSION);
  assert.equal(resolveCurrentContext({ workspaceId }).id, "this_week");
});

test("moveForward and moveBackward traverse the navigation ladder", () => {
  const workspaceId = "ws-camera-ladder";
  moveToContext({ workspaceId, contextId: "now", source: "system", reason: "initialization" });
  const forward = moveForward({ workspaceId, source: "user" });
  assert.equal(forward.success, true);
  assert.equal(forward.position?.currentContext, "today");

  moveToContext({ workspaceId, contextId: "this_week", source: "user" });
  const backward = moveBackward({ workspaceId, source: "user" });
  assert.equal(backward.success, true);
  assert.equal(backward.position?.currentContext, "today");
});

test("jump operations update context metadata", () => {
  const workspaceId = "ws-camera-jump";
  assert.equal(jumpToToday({ workspaceId }).success, true);
  assert.equal(jumpToCurrentQuarter({ workspaceId }).success, true);
  assert.equal(jumpToCurrentYear({ workspaceId }).success, true);
  assert.equal(jumpToFutureProjection({ workspaceId }).success, true);
  assert.equal(jumpToPastReview({ workspaceId }).success, true);
  assert.equal(resolveCurrentContext({ workspaceId }).id, "past_review");
});

test("resetCamera restores now and clears history", () => {
  const workspaceId = "ws-camera-reset";
  moveToContext({ workspaceId, contextId: "this_month", source: "user" });
  assert.ok(getHistory(workspaceId).entries.length > 0);
  const reset = resetCamera({ workspaceId, source: "system", reason: "restore" });
  assert.equal(reset.success, true);
  assert.equal(reset.position?.currentContext, "now");
  assert.equal(getHistory(workspaceId).entries.length, 1);
  assert.equal(getHistory(workspaceId).entries[0]?.position.currentContext, "now");
});

test("rejects duplicate and invalid navigation", () => {
  const workspaceId = "ws-camera-guard";
  moveToContext({ workspaceId, contextId: "today", source: "user" });
  const duplicate = moveToContext({ workspaceId, contextId: "today", source: "user" });
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_navigation");

  const invalid = moveToContext({ workspaceId: "   ", contextId: "today", validateWorkspace: true });
  assert.equal(invalid.success, false);

  const unauthorized = switchExecutiveTimeContext({
    workspaceId,
    contextId: "this_year",
    mutationAuthority: "unauthorized" as "APP-1/3-executive-time-camera",
  });
  assert.equal(unauthorized.success, false);
});

test("maintains navigation history with previous and next", () => {
  const workspaceId = "ws-camera-history";
  moveToContext({ workspaceId, contextId: "now", source: "system", reason: "initialization" });
  moveToContext({ workspaceId, contextId: "today", source: "user" });
  moveToContext({ workspaceId, contextId: "this_week", source: "user" });

  const back = previous({ workspaceId });
  assert.equal(back.success, true);
  assert.equal(resolveCurrentContext({ workspaceId }).id, "today");

  const forwardAgain = next({ workspaceId });
  assert.equal(forwardAgain.success, true);
  assert.equal(resolveCurrentContext({ workspaceId }).id, "this_week");
});

test("camera position metadata is immutable and complete", () => {
  const workspaceId = "ws-camera-position";
  moveToContext({ workspaceId, contextId: "this_quarter", source: "user", reason: "planning" });
  const position = getExecutiveTimeCameraPosition(workspaceId);
  assert.ok(position);
  assert.equal(position!.currentContext, "this_quarter");
  assert.equal(position!.navigationSource, "user");
  assert.equal(position!.navigationReason, "planning");
  assert.equal(position!.mode, "manual");
  assert.throws(() => {
    (position as { currentContext: string }).currentContext = "today";
  });
});

test("future consumer binding contracts are interface-only", () => {
  assert.equal(EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.dashboard.integrationImplemented, false);
  assert.equal(EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.assistant.readOnly, true);
  assert.equal(EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.timeline.consumes, "resolveCurrentContext");
  assert.equal(EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.scenario.integrationImplemented, false);
  assert.equal(EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.recommendation.integrationImplemented, false);
});

test("manifest blocks external runtime mutation paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_CAMERA_MANIFEST).valid, true);
  for (const filePath of [
    "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
    "frontend/app/components/panels/TimelinePanel.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_TIME_CAMERA_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("APP-1:2 context certification still passes", () => {
  assert.equal(runExecutiveTimeContextCertification().certified, true);
});

test("documents deferred runtime ownership", () => {
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("prediction_engine"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_panel_ui"));
});

test("camera certification passes all gates", () => {
  const result = runExecutiveTimeCameraCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks.length, 0);
  for (const tag of EXECUTIVE_TIME_CAMERA_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
