import assert from "node:assert/strict";
import test from "node:test";

import {
  CHECKPOINT1_FIX4_HOMESCREEN_SELECTED_OBJECT_TAGS,
  resolveRightPanelSelectedObjectId,
} from "./homeScreenRightPanelSelectedObject.ts";

test("exports CHECKPOINT-1-FIX-4 tags", () => {
  assert.deepEqual(CHECKPOINT1_FIX4_HOMESCREEN_SELECTED_OBJECT_TAGS, [
    "[CHECKPOINT1_FIX4_HOMESCREEN_SELECTED_OBJECT_PROP]",
    "[READONLY_SELECTION_PASSED_TO_RIGHT_PANEL]",
    "[OBJECT_PANEL_PROP_WIRING_FIXED]",
    "[NO_ROUTE_COMMIT_REINTRODUCED]",
    "[CHECKPOINT1_FIX4_COMPLETE]",
  ]);
});

test("passes selectedObjectIdState when canonical selected id is null", () => {
  assert.equal(
    resolveRightPanelSelectedObjectId({
      canonicalSelectedId: null,
      selectedObjectIdState: "obj_warehouse_1",
    }),
    "obj_warehouse_1"
  );
});

test("prefers canonical selected id when both are present", () => {
  assert.equal(
    resolveRightPanelSelectedObjectId({
      canonicalSelectedId: "obj_customer_1",
      selectedObjectIdState: "obj_warehouse_1",
    }),
    "obj_customer_1"
  );
});

test("returns null when both ids are null", () => {
  assert.equal(
    resolveRightPanelSelectedObjectId({
      canonicalSelectedId: null,
      selectedObjectIdState: null,
    }),
    null
  );
});

test("returns null after deselect clears selectedObjectIdState", () => {
  assert.equal(
    resolveRightPanelSelectedObjectId({
      canonicalSelectedId: null,
      selectedObjectIdState: null,
    }),
    null
  );
});

test("trims whitespace from fallback ids", () => {
  assert.equal(
    resolveRightPanelSelectedObjectId({
      canonicalSelectedId: " ",
      selectedObjectIdState: " obj_warehouse_1 ",
    }),
    "obj_warehouse_1"
  );
});
