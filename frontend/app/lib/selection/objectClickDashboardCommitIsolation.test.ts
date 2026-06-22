import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateObjectClickDashboardCommitGuard,
  isObjectClickDashboardCommitSource,
} from "./objectClickDashboardCommitGuard.ts";
import {
  publishObjectClickSelectionContext,
  getObjectClickSelectionContext,
  resetObjectClickSelectionContextCacheForTests,
} from "./objectClickSelectionContextCache.ts";

test.beforeEach(() => {
  resetObjectClickSelectionContextCacheForTests();
});

test("blocks object-click dashboard commit sources", () => {
  assert.equal(
    isObjectClickDashboardCommitSource({ source: "object_click", intent: null, reason: null }),
    true
  );
  assert.equal(
    isObjectClickDashboardCommitSource({
      source: "object",
      intent: "object_selected",
      reason: "object_selected",
    }),
    true
  );
  assert.equal(
    evaluateObjectClickDashboardCommitGuard({
      source: "left_nav",
      intent: "default",
      reason: "nav",
    }).allowed,
    true
  );
});

test("selection context cache stores MRP read model without workspace writes", () => {
  publishObjectClickSelectionContext({
    selectedObjectId: "draft_expenses_2",
    selectedObjectName: "Expenses",
    selectedObjectType: "financial",
    selectedWorkspaceId: "ws-1",
    dashboardContext: "sources",
    surfaceId: "operational",
    eventId: "evt-1",
  });
  const cached = getObjectClickSelectionContext();
  assert.equal(cached?.selectedObjectId, "draft_expenses_2");
  assert.equal(cached?.selectedObjectName, "Expenses");
  assert.equal(cached?.selectedWorkspaceId, "ws-1");
  assert.equal(cached?.surfaceId, "operational");
});

test("NW-B:8-5 regression — rapid object selection publishes cache only", () => {
  const objectIds = Array.from({ length: 20 }, (_, index) => `obj-${index + 1}`);
  for (const objectId of objectIds) {
    publishObjectClickSelectionContext({
      selectedObjectId: objectId,
      selectedObjectName: objectId,
      selectedWorkspaceId: "ws-regression",
    });
  }
  const cached = getObjectClickSelectionContext();
  assert.equal(cached?.selectedObjectId, "obj-20");
  assert.equal(cached?.selectedWorkspaceId, "ws-regression");
});
