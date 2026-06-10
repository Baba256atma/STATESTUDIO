import test from "node:test";
import assert from "node:assert/strict";

import { buildDashboardHomeReturnAction } from "./dashboardHomeReturnPathContract.ts";

test("buildDashboardHomeReturnAction sets overview mode", () => {
  const action = buildDashboardHomeReturnAction();
  assert.equal(action.type, "setDashboardMode");
  if (action.type === "setDashboardMode") {
    assert.equal(action.mode, "overview");
  }
});

test("buildDashboardHomeReturnAction preserves object route", () => {
  const action = buildDashboardHomeReturnAction({
    objectId: "line-1",
    objectName: "Line 1",
  });
  if (action.type === "setDashboardMode") {
    assert.equal(action.routeObject?.objectId, "line-1");
    assert.equal(action.routeObject?.objectName, "Line 1");
  }
});
