import test from "node:test";
import assert from "node:assert/strict";

import {
  hasPendingEmptySceneDeselectWork,
  isObjectSelectionPanelView,
  shouldCloseObjectPanelOnEmptySceneDeselect,
} from "./emptySceneClickDeselectRuntime.ts";
import {
  publishObjectClickSelectionContext,
  resetObjectClickSelectionContextCacheForTests,
} from "./objectClickSelectionContextCache.ts";

test.beforeEach(() => {
  resetObjectClickSelectionContextCacheForTests();
});

test("isObjectSelectionPanelView recognizes object panel views", () => {
  assert.equal(isObjectSelectionPanelView("executive_object"), true);
  assert.equal(isObjectSelectionPanelView("object"), true);
  assert.equal(isObjectSelectionPanelView("dashboard"), false);
});

test("shouldCloseObjectPanelOnEmptySceneDeselect closes open object panel after clear", () => {
  assert.equal(
    shouldCloseObjectPanelOnEmptySceneDeselect({
      panelView: "executive_object",
      panelIsOpen: true,
      selectedObjectId: null,
    }),
    true
  );
  assert.equal(
    shouldCloseObjectPanelOnEmptySceneDeselect({
      panelView: "dashboard",
      panelIsOpen: true,
      selectedObjectId: null,
    }),
    false
  );
});

test("hasPendingEmptySceneDeselectWork stays true while selectedObjectId remains set", () => {
  assert.equal(
    hasPendingEmptySceneDeselectWork({
      selectedObjectId: "obj-1",
      panelView: "executive_object",
      panelIsOpen: true,
    }),
    true
  );
});

test("hasPendingEmptySceneDeselectWork stays true while object click cache remains", () => {
  publishObjectClickSelectionContext({
    selectedObjectId: "obj-2",
    selectedObjectName: "Obj 2",
  });
  assert.equal(
    hasPendingEmptySceneDeselectWork({
      selectedObjectId: null,
      panelView: null,
      panelIsOpen: false,
    }),
    true
  );
});

test("NW-B:8-6A regression — empty scene deselect still required when panel remains open", () => {
  assert.equal(
    hasPendingEmptySceneDeselectWork({
      selectedObjectId: null,
      panelView: "object",
      panelIsOpen: true,
    }),
    true
  );
});
