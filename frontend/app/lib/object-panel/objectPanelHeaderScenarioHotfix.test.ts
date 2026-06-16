import test from "node:test";
import assert from "node:assert/strict";

import {
  OBJECT_PANEL_DASHBOARD_ACTIONS,
  objectPanelDashboardActionLabel,
} from "./objectPanelActionRouterContract.ts";
import {
  OBJECT_PANEL_HEADER_SCENARIO_REMOVED_TAG,
  SCENE_ACTION_DOCK_FORBIDDEN_HEADER_ACTIONS,
  SCENE_ACTION_DOCK_HEADER_ACTIONS,
} from "./objectPanelHeaderScenarioHotfixContract.ts";

test("exports object panel header scenario removed tag", () => {
  assert.equal(OBJECT_PANEL_HEADER_SCENARIO_REMOVED_TAG, "[OBJECT_PANEL_HEADER_SCENARIO_REMOVED]");
});

test("scene action dock header excludes scenario button", () => {
  const ids = SCENE_ACTION_DOCK_HEADER_ACTIONS.map((entry) => entry.id);
  assert.deepEqual(ids, ["object", "focus", "explain"]);
  assert.equal(ids.includes("scenario"), false);
  assert.equal(
    SCENE_ACTION_DOCK_HEADER_ACTIONS.some((entry) => entry.label === "Scenario"),
    false
  );
});

test("forbidden header actions include scenario", () => {
  assert.deepEqual(SCENE_ACTION_DOCK_FORBIDDEN_HEADER_ACTIONS, ["scenario"]);
});

test("canonical object panel action group still includes scenario", () => {
  assert.equal(OBJECT_PANEL_DASHBOARD_ACTIONS.includes("scenario"), true);
  assert.equal(objectPanelDashboardActionLabel("scenario"), "Scenario");
});

test("header dock retains focus and explain without scenario launch source", () => {
  const focus = SCENE_ACTION_DOCK_HEADER_ACTIONS.find((entry) => entry.id === "focus");
  const explain = SCENE_ACTION_DOCK_HEADER_ACTIONS.find((entry) => entry.id === "explain");
  assert.equal(focus?.dashboardAction, "focus");
  assert.equal(explain?.dashboardAction, "advisory");
  assert.equal(
    SCENE_ACTION_DOCK_HEADER_ACTIONS.some((entry) => entry.dashboardAction === "scenario"),
    false
  );
});
