import assert from "node:assert/strict";
import test from "node:test";

import {
  CHECKPOINT1_FIX2_OBJECT_PANEL_RENDER_TAGS,
  isDedicatedObjectPanelView,
  resolveReadonlySelectedObjectId,
  shouldRenderReadonlyObjectPanel,
} from "./rightPanelHostReadonlyObjectPanelRuntime.ts";

test("exports CHECKPOINT-1-FIX-2 tags", () => {
  assert.deepEqual(CHECKPOINT1_FIX2_OBJECT_PANEL_RENDER_TAGS, [
    "[CHECKPOINT1_RIGHT_PANEL_HOST_OBJECT_RENDER_FIX]",
    "[READONLY_SELECTION_RENDER_PATH]",
    "[OBJECT_PANEL_OPEN_WITH_DASHBOARD_VIEW]",
    "[NO_ROUTE_COMMIT_REINTRODUCED]",
    "[CHECKPOINT1_FIX2_COMPLETE]",
  ]);
});

test("readonly object panel renders before empty dashboard fallback when selection exists", () => {
  assert.equal(
    shouldRenderReadonlyObjectPanel({
      viewToRender: "dashboard",
      rightPanelOpen: true,
      selectedObjectId: "obj_warehouse_1",
    }),
    true,
    "RightPanelHost must evaluate this path before blockedWhenNoRealData empty dashboard fallback"
  );
});

test("does not render readonly object panel when dashboard view has no selection", () => {
  assert.equal(
    shouldRenderReadonlyObjectPanel({
      viewToRender: "dashboard",
      rightPanelOpen: true,
      contextId: null,
      activeExecutiveObjectId: null,
      selectedObjectId: null,
      focusedId: null,
    }),
    false
  );
});

test("does not render readonly object panel when dedicated object view already handles it", () => {
  assert.equal(isDedicatedObjectPanelView("object"), true);
  assert.equal(isDedicatedObjectPanelView("executive_object"), true);
  assert.equal(isDedicatedObjectPanelView("object_focus"), true);
  assert.equal(
    shouldRenderReadonlyObjectPanel({
      viewToRender: "object",
      rightPanelOpen: true,
      selectedObjectId: "obj_warehouse_1",
    }),
    false
  );
});

test("does not render readonly object panel when right panel is closed", () => {
  assert.equal(
    shouldRenderReadonlyObjectPanel({
      viewToRender: "dashboard",
      rightPanelOpen: false,
      selectedObjectId: "obj_warehouse_1",
    }),
    false
  );
});

test("clears readonly object panel after deselect", () => {
  const selected = shouldRenderReadonlyObjectPanel({
    viewToRender: "dashboard",
    rightPanelOpen: true,
    selectedObjectId: "obj_warehouse_1",
  });
  const deselected = shouldRenderReadonlyObjectPanel({
    viewToRender: "dashboard",
    rightPanelOpen: true,
    selectedObjectId: null,
    contextId: null,
    activeExecutiveObjectId: null,
    focusedId: null,
  });

  assert.equal(selected, true);
  assert.equal(deselected, false);
  assert.equal(resolveReadonlySelectedObjectId({ selectedObjectId: null }), null);
});

test("resolves readonly object id from contextId, activeExecutiveObjectId, selectedObjectId, then focusedId", () => {
  assert.equal(
    resolveReadonlySelectedObjectId({
      contextId: "obj_context",
      activeExecutiveObjectId: "obj_active",
      selectedObjectId: "obj_selected",
      focusedId: "obj_focused",
    }),
    "obj_context"
  );
  assert.equal(
    resolveReadonlySelectedObjectId({
      selectedObjectId: "obj_selected",
      focusedId: "obj_focused",
    }),
    "obj_selected"
  );
});
