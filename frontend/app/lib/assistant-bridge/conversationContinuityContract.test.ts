import test from "node:test";
import assert from "node:assert/strict";

import { buildDashboardExecutiveContextSummary } from "./assistantContextSyncContract.ts";
import {
  buildConversationContinuityFromSyncSummary,
  createInitialConversationContinuity,
  FUTURE_CONVERSATION_WORKSPACE_AWARENESS,
  formatWorkspaceAwareResponse,
  resetConversationContinuityForTests,
  resolveConversationToneFromIntent,
  resolveExecutiveIntentFromWorkspace,
  resolveWorkspaceAwarePromptHints,
} from "./conversationContinuityContract.ts";
import {
  initializeConversationContinuity,
  mergeConversationContinuityFromSync,
  resetConversationContinuityRuntimeForTests,
} from "./conversationContinuityRuntime.ts";

test.beforeEach(() => {
  resetConversationContinuityForTests();
  resetConversationContinuityRuntimeForTests();
});

test("resolves executive intent and conversation tone from workspace", () => {
  assert.equal(resolveExecutiveIntentFromWorkspace("analyze"), "analyze");
  assert.equal(resolveConversationToneFromIntent("analyze"), "analytical");
  assert.equal(resolveConversationToneFromIntent("war_room"), "operational");
  assert.equal(resolveConversationToneFromIntent("scenario"), "exploratory");
});

test("builds awareness from sync summary without ownership transfer", () => {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "supplier-a",
    dashboardRouteObjectName: "Supplier A",
    selectedObjectId: "supplier-a",
    selectedObjectName: "Supplier A",
    completionStatus: "active",
    routeType: "assistant_bridge",
  });

  const prev = createInitialConversationContinuity("session-1");
  const result = buildConversationContinuityFromSyncSummary(prev, summary);

  assert.equal(result.accepted, true);
  assert.equal(result.continuity?.sessionId, "session-1");
  assert.equal(result.continuity?.awareness.currentObjectId, "supplier-a");
  assert.equal(result.continuity?.awareness.executiveIntent, "analyze");
  assert.equal(result.continuity?.awareness.conversationTone, "analytical");
  assert.equal(result.continuity?.awareness.awarenessLevel, 4);
  assert.equal(result.continuity?.awareness.source, "assistant_continuity_runtime");
});

test("preserves conversation session across workspace changes", () => {
  let continuity = initializeConversationContinuity("stable-session");

  const openSummary = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "supplier-a",
    dashboardRouteObjectName: "Supplier A",
    selectedObjectId: "supplier-a",
    selectedObjectName: "Supplier A",
    completionStatus: "active",
    routeType: "assistant_bridge",
  });

  const openResult = mergeConversationContinuityFromSync(continuity, openSummary);
  assert.equal(openResult.accepted, true);
  continuity = openResult.continuity!;

  const returnSummary = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "supplier-a",
    dashboardRouteObjectName: "Supplier A",
    selectedObjectId: "supplier-a",
    selectedObjectName: "Supplier A",
    completionStatus: "returned_passive",
    routeType: "return_passive",
    lastWorkspaceType: "analyze",
    lastRouteType: "assistant_bridge",
  });

  const returnResult = mergeConversationContinuityFromSync(continuity, returnSummary);
  assert.equal(returnResult.accepted, true);
  assert.equal(returnResult.continuity?.sessionId, "stable-session");
  assert.equal(returnResult.continuity?.awareness.lifecyclePhase, "exit");
});

test("formats workspace-aware read-only responses", () => {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "supplier-a",
    dashboardRouteObjectName: "Supplier Risk Analysis",
    selectedObjectId: "supplier-a",
    selectedObjectName: "Supplier Risk Analysis",
    completionStatus: "active",
    routeType: "object_panel",
  });

  const prev = createInitialConversationContinuity("session-2");
  const { continuity } = buildConversationContinuityFromSyncSummary(prev, summary);
  const message = formatWorkspaceAwareResponse(continuity?.awareness ?? null);

  assert.ok(message?.includes("Supplier Risk Analysis"));
  assert.ok(message?.includes("Analyze"));
});

test("provides workspace-aware prompt hints without recommendations", () => {
  const hints = resolveWorkspaceAwarePromptHints("analyze");
  assert.ok(hints.some((h) => h.includes("inspect")));
  assert.equal(resolveWorkspaceAwarePromptHints("war_room").length >= 1, true);
});

test("reserves future workspace awareness placeholders", () => {
  assert.equal(FUTURE_CONVERSATION_WORKSPACE_AWARENESS.length, 5);
  assert.ok(FUTURE_CONVERSATION_WORKSPACE_AWARENESS.includes("decision_center"));
});
