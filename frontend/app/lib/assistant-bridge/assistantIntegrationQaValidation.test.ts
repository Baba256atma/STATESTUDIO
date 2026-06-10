import test from "node:test";
import assert from "node:assert/strict";

import {
  ASSISTANT_EXECUTABLE_ACTIONS,
  ASSISTANT_FUTURE_ACTIONS,
} from "./assistantDashboardBridgeContract.ts";
import { routeAssistantExecutiveActionRequest } from "./assistantDashboardBridgeRuntime.ts";
import { consumeDashboardExecutiveContextSummary } from "./assistantContextSyncContract.ts";
import { buildConversationContinuityFromSyncSummary, createInitialConversationContinuity } from "./conversationContinuityContract.ts";
import { buildDashboardExecutiveContextSummary } from "./assistantContextSyncContract.ts";
import {
  runAssistantIntegrationQaMatrix,
  validateAssistantRouteMappingMatrix,
  validateFutureActionsBlocked,
} from "./assistantIntegrationQaValidation.ts";

test("QA matrix: all executable routes map to dashboard modes", () => {
  const results = validateAssistantRouteMappingMatrix();
  assert.equal(results.length, ASSISTANT_EXECUTABLE_ACTIONS.length);
  assert.ok(results.every((r) => r.status === "pass"), results.map((r) => r.evidence).join("; "));
});

test("QA matrix: future actions blocked at bridge", () => {
  const result = validateFutureActionsBlocked();
  assert.equal(result.status, "pass");

  for (const action of ASSISTANT_FUTURE_ACTIONS) {
    const route = routeAssistantExecutiveActionRequest({ action, objectId: "obj-1" });
    assert.equal(route.success, false, `Future action ${action} must not route`);
    assert.equal(route.reason, "unauthorized_future_action");
  }
});

test("QA matrix: full integration matrix has zero failures", () => {
  const matrix = runAssistantIntegrationQaMatrix();
  assert.equal(matrix.failCount, 0, matrix.results.filter((r) => r.status === "fail").map((r) => r.id).join(", "));
});

test("failure: missing object fails safely at bridge", () => {
  const route = routeAssistantExecutiveActionRequest({ action: "OPEN_ANALYZE", objectId: "" });
  assert.equal(route.success, false);
  assert.equal(route.reason, "missing_object");
});

test("failure: invalid action fails safely at bridge", () => {
  const route = routeAssistantExecutiveActionRequest({ action: "INVALID", objectId: "obj-1" });
  assert.equal(route.success, false);
  assert.equal(route.reason, "invalid_action");
});

test("failure: invalid sync contract rejected read-only", () => {
  const consumed = consumeDashboardExecutiveContextSummary({ source: "assistant" });
  assert.equal(consumed.accepted, false);
});

test("failure: invalid sync does not reset conversation session", () => {
  const prev = createInitialConversationContinuity("qa-session");
  const result = buildConversationContinuityFromSyncSummary(prev, { source: "invalid" });
  assert.equal(result.accepted, false);
  assert.equal(result.continuity?.sessionId, "qa-session");
});

test("continuity: session survives workspace transition", () => {
  let continuity = createInitialConversationContinuity("qa-transition");

  const active = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "obj-1",
    dashboardRouteObjectName: "Object 1",
    selectedObjectId: "obj-1",
    selectedObjectName: "Object 1",
    completionStatus: "active",
    routeType: "assistant_bridge",
  });

  const activeResult = buildConversationContinuityFromSyncSummary(continuity, active);
  continuity = activeResult.continuity!;

  const returned = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "obj-1",
    dashboardRouteObjectName: "Object 1",
    selectedObjectId: "obj-1",
    selectedObjectName: "Object 1",
    completionStatus: "returned_passive",
    routeType: "return_passive",
  });

  const returnResult = buildConversationContinuityFromSyncSummary(continuity, returned);
  assert.equal(returnResult.continuity?.sessionId, "qa-transition");
});
