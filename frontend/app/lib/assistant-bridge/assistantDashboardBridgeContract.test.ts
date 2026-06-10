import test from "node:test";
import assert from "node:assert/strict";

import {
  ASSISTANT_EXECUTABLE_ACTIONS,
  ASSISTANT_FUTURE_ACTIONS,
  mapAssistantActionToDashboardMode,
  mapAssistantActionToObjectPanelAction,
  normalizeAssistantExecutiveActionKind,
  resetAssistantDashboardBridgeForTests,
} from "./assistantDashboardBridgeContract.ts";
import { routeAssistantExecutiveActionRequest } from "./assistantDashboardBridgeRuntime.ts";

test.beforeEach(() => {
  resetAssistantDashboardBridgeForTests();
});

test("defines executable and future action sets", () => {
  assert.equal(ASSISTANT_EXECUTABLE_ACTIONS.length, 5);
  assert.equal(ASSISTANT_FUTURE_ACTIONS.length, 5);
  assert.ok(ASSISTANT_EXECUTABLE_ACTIONS.includes("OPEN_ANALYZE"));
  assert.ok(ASSISTANT_FUTURE_ACTIONS.includes("OPEN_RISK"));
});

test("normalizes assistant action aliases", () => {
  assert.equal(normalizeAssistantExecutiveActionKind("analyze"), "OPEN_ANALYZE");
  assert.equal(normalizeAssistantExecutiveActionKind("OPEN_WAR_ROOM"), "OPEN_WARROOM");
  assert.equal(normalizeAssistantExecutiveActionKind("invalid"), null);
});

test("maps executable actions to dashboard modes and object panel actions", () => {
  assert.equal(mapAssistantActionToDashboardMode("OPEN_ANALYZE"), "analyze");
  assert.equal(mapAssistantActionToObjectPanelAction("OPEN_WARROOM"), "war_room");
});

test("routes valid assistant request to object panel input", () => {
  const result = routeAssistantExecutiveActionRequest({
    action: "OPEN_ANALYZE",
    objectId: "machine-a",
    objectName: "Machine A",
  });
  assert.equal(result.success, true);
  assert.equal(result.mode, "analyze");
  assert.equal(result.objectPanelAction, "analyze");
  assert.equal(result.objectPanelInput?.objectId, "machine-a");
  assert.equal(result.reason, "assistant_to_dashboard_mode");
});

test("rejects missing object", () => {
  const result = routeAssistantExecutiveActionRequest({
    action: "FOCUS_OBJECT",
    objectId: "",
  });
  assert.equal(result.success, false);
  assert.equal(result.reason, "missing_object");
});

test("rejects invalid action", () => {
  const result = routeAssistantExecutiveActionRequest({
    action: "DO_SOMETHING",
    objectId: "obj-1",
  });
  assert.equal(result.success, false);
  assert.equal(result.reason, "invalid_action");
});

test("rejects unauthorized future actions", () => {
  const result = routeAssistantExecutiveActionRequest({
    action: "OPEN_RISK",
    objectId: "obj-1",
  });
  assert.equal(result.success, false);
  assert.equal(result.reason, "unauthorized_future_action");
});

test("routes all executable actions", () => {
  for (const action of ASSISTANT_EXECUTABLE_ACTIONS) {
    const result = routeAssistantExecutiveActionRequest({
      action,
      objectId: "obj-1",
    });
    assert.equal(result.success, true, action);
    assert.ok(result.objectPanelInput, action);
  }
});
