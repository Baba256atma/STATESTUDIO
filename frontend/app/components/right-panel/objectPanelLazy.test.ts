import assert from "node:assert/strict";
import test from "node:test";

import {
  CHECKPOINT1_OBJECT_PANEL_VISIBILITY_TAGS,
  NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX,
  resolveObjectPanelLazyObjectId,
  resolveObjectPanelLazyState,
  type ObjectPanelLazyResolutionInput,
} from "./objectPanelLazyRuntime.ts";

function baseProps(
  overrides: Partial<ObjectPanelLazyResolutionInput> = {}
): ObjectPanelLazyResolutionInput {
  return {
    view: "dashboard",
    contextId: null,
    selectedObjectId: null,
    activeExecutiveObjectId: null,
    focusedId: null,
    visibleSceneObjects: [{ id: "obj_warehouse_1", name: "Warehouse" }],
    hasVisibleSceneObjects: true,
    ...overrides,
  };
}

test("exports checkpoint visibility tags and diagnostic prefix", () => {
  assert.equal(NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX, "[NexoraObjectPanelVisibility]");
  assert.deepEqual(CHECKPOINT1_OBJECT_PANEL_VISIBILITY_TAGS, [
    "[CHECKPOINT1_OBJECT_PANEL_VISIBILITY_FIX]",
    "[READONLY_SELECTION_PANEL_OPEN]",
    "[OBJECT_PANEL_OPEN_WITHOUT_ROUTE_COMMIT]",
    "[NO_OBJECT_CLICK_WRITE_REINTRODUCED]",
    "[CHECKPOINT1_FIX_COMPLETE]",
  ]);
});

test("opens executive panel for dashboard view with readonly selectedObjectId", () => {
  const state = resolveObjectPanelLazyState(
    baseProps({
      view: "dashboard",
      selectedObjectId: "obj_warehouse_1",
    })
  );

  assert.equal(state.resolvedObjectId, "obj_warehouse_1");
  assert.equal(state.renderKind, "executive_panel");
  assert.equal(state.readonlySelectionPanelOpen, true);
});

test("opens executive panel for executive_object view with contextId", () => {
  const state = resolveObjectPanelLazyState(
    baseProps({
      view: "executive_object",
      contextId: "obj_warehouse_1",
    })
  );

  assert.equal(state.resolvedObjectId, "obj_warehouse_1");
  assert.equal(state.renderKind, "executive_panel");
  assert.equal(state.readonlySelectionPanelOpen, false);
});

test("returns no selection fallback when dashboard view has no selected object", () => {
  const state = resolveObjectPanelLazyState(
    baseProps({
      view: "dashboard",
      selectedObjectId: null,
    })
  );

  assert.equal(state.resolvedObjectId, null);
  assert.equal(state.renderKind, "no_selection_fallback");
});

test("returns object context fallback when selected object is not visible", () => {
  const state = resolveObjectPanelLazyState(
    baseProps({
      view: "dashboard",
      selectedObjectId: "obj_missing",
    })
  );

  assert.equal(state.resolvedObjectId, "obj_missing");
  assert.equal(state.renderKind, "object_context_fallback");
});

test("clears executive panel when selectedObjectId becomes null after prior selection", () => {
  const selected = resolveObjectPanelLazyState(
    baseProps({
      view: "dashboard",
      selectedObjectId: "obj_warehouse_1",
    })
  );
  const deselected = resolveObjectPanelLazyState(
    baseProps({
      view: "dashboard",
      selectedObjectId: null,
    })
  );

  assert.equal(selected.renderKind, "executive_panel");
  assert.equal(deselected.renderKind, "no_selection_fallback");
  assert.equal(deselected.resolvedObjectId, null);
});

test("resolves object id from contextId, activeExecutiveObjectId, selectedObjectId, then focusedId", () => {
  assert.equal(
    resolveObjectPanelLazyObjectId({
      contextId: "obj_context",
      activeExecutiveObjectId: "obj_active",
      selectedObjectId: "obj_selected",
      focusedId: "obj_focused",
    }),
    "obj_context"
  );
  assert.equal(
    resolveObjectPanelLazyObjectId({
      contextId: null,
      activeExecutiveObjectId: "obj_active",
      selectedObjectId: "obj_selected",
      focusedId: "obj_focused",
    }),
    "obj_active"
  );
  assert.equal(
    resolveObjectPanelLazyObjectId({
      contextId: null,
      activeExecutiveObjectId: null,
      selectedObjectId: "obj_selected",
      focusedId: "obj_focused",
    }),
    "obj_selected"
  );
  assert.equal(
    resolveObjectPanelLazyObjectId({
      contextId: null,
      activeExecutiveObjectId: null,
      selectedObjectId: null,
      focusedId: "obj_focused",
    }),
    "obj_focused"
  );
});

test("opens executive panel for readonly selection even when visible list is empty", () => {
  const state = resolveObjectPanelLazyState(
    baseProps({
      view: "object",
      selectedObjectId: "obj_warehouse_1",
      hasVisibleSceneObjects: false,
      visibleSceneObjects: [],
    })
  );

  assert.equal(state.renderKind, "executive_panel");
  assert.equal(state.resolvedObjectId, "obj_warehouse_1");
});
