import test from "node:test";
import assert from "node:assert/strict";

import {
  buildContextSummarySignature,
  buildDashboardExecutiveContextSummary,
  consumeDashboardExecutiveContextSummary,
  FUTURE_EXECUTIVE_WORKSPACE_TYPES,
  formatExecutiveContinuityMessage,
  resetAssistantContextSyncForTests,
  validateDashboardExecutiveContextSummary,
} from "./assistantContextSyncContract.ts";

test.beforeEach(() => {
  resetAssistantContextSyncForTests();
});

test("builds executive context summary from dashboard state", () => {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "supplier-a",
    dashboardRouteObjectName: "Supplier A",
    selectedObjectId: "supplier-a",
    selectedObjectName: "Supplier A",
    completionStatus: "active",
    routeType: "assistant_bridge",
  });

  assert.equal(summary.workspaceType, "analyze");
  assert.equal(summary.objectId, "supplier-a");
  assert.equal(summary.workspaceStatus, "active");
  assert.equal(summary.completionStatus, "active");
  assert.equal(summary.routeType, "assistant_bridge");
  assert.equal(summary.source, "dashboard_runtime");
});

test("validates dashboard runtime source contract", () => {
  const valid = validateDashboardExecutiveContextSummary(
    buildDashboardExecutiveContextSummary({
      dashboardMode: "focus",
      dashboardRouteObjectId: "obj-1",
      dashboardRouteObjectName: "Object 1",
      selectedObjectId: "obj-1",
      selectedObjectName: "Object 1",
      completionStatus: "opened",
      routeType: "object_panel",
    })
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.summary?.workspaceType, "focus");

  const invalid = validateDashboardExecutiveContextSummary({ source: "assistant" });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.reason, "invalid_sync_contract");
});

test("consumes read-only copy without mutation", () => {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "war_room",
    dashboardRouteObjectId: "line-3",
    dashboardRouteObjectName: "Line 3",
    selectedObjectId: "line-3",
    selectedObjectName: "Line 3",
    completionStatus: "returned_passive",
    routeType: "return_passive",
  });

  const result = consumeDashboardExecutiveContextSummary(summary);
  assert.equal(result.accepted, true);
  assert.equal(result.reason, "consumed_read_only_copy");
  assert.deepEqual(result.summary, summary);
});

test("formats passive return continuity message", () => {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "analyze",
    dashboardRouteObjectId: "supplier-a",
    dashboardRouteObjectName: "Supplier A",
    selectedObjectId: "supplier-a",
    selectedObjectName: "Supplier A",
    completionStatus: "returned_passive",
    routeType: "return_passive",
  });

  const message = formatExecutiveContinuityMessage(summary);
  assert.ok(message?.includes("returned"));
  assert.ok(message?.includes("Supplier A"));
});

test("dedupes context summary signatures", () => {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "compare",
    dashboardRouteObjectId: "obj-1",
    dashboardRouteObjectName: "Object 1",
    selectedObjectId: "obj-1",
    selectedObjectName: "Object 1",
    completionStatus: "active",
    routeType: "object_panel",
  });

  const sigA = buildContextSummarySignature(summary);
  const sigB = buildContextSummarySignature({
    ...summary,
    completionStatus: "returned_passive",
    routeType: "return_passive",
  });
  assert.notEqual(sigA, sigB);
});

test("reserves future executive workspace placeholders", () => {
  assert.ok(FUTURE_EXECUTIVE_WORKSPACE_TYPES.includes("risk"));
  assert.ok(FUTURE_EXECUTIVE_WORKSPACE_TYPES.includes("decision_center"));
  assert.equal(FUTURE_EXECUTIVE_WORKSPACE_TYPES.length, 5);
});
