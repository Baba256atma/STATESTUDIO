import assert from "node:assert/strict";
import test from "node:test";

import {
  buildVisibleUiSceneTopologySignature,
  isVisibleUiSelectionOnlyChange,
  shouldSkipVisibleUiMaterialReconcileWrite,
} from "./visibleUiStateSignature.ts";

const baseState = {
  sceneJson: {
    scene: {
      objects: [{ id: "a" }, { id: "b" }],
    },
  },
  responseData: { ok: true },
  objectSelection: { highlighted_objects: ["a"] },
  selectedObjectId: "a",
  focusedId: "a",
  conflicts: [],
  memoryInsights: null,
  riskPropagation: null,
  strategicAdvice: null,
  decisionCockpit: null,
  opponentModel: null,
  strategicPatterns: null,
};

test("isVisibleUiSelectionOnlyChange detects selection-only updates", () => {
  const next = {
    ...baseState,
    selectedObjectId: "b",
    focusedId: "b",
    objectSelection: { highlighted_objects: ["b"] },
  };
  assert.equal(isVisibleUiSelectionOnlyChange(baseState, next), true);
  assert.equal(
    buildVisibleUiSceneTopologySignature(baseState),
    buildVisibleUiSceneTopologySignature(next)
  );
});

test("shouldSkipVisibleUiMaterialReconcileWrite skips selection-only object clicks", () => {
  const next = {
    ...baseState,
    selectedObjectId: "b",
    focusedId: "b",
    objectSelection: { highlighted_objects: ["b"] },
  };
  assert.equal(shouldSkipVisibleUiMaterialReconcileWrite(baseState, next), true);
});

test("isVisibleUiSelectionOnlyChange returns false when scene topology changes", () => {
  const next = {
    ...baseState,
    selectedObjectId: "b",
    sceneJson: {
      scene: {
        objects: [{ id: "a" }, { id: "b" }, { id: "c" }],
      },
    },
  };
  assert.equal(isVisibleUiSelectionOnlyChange(baseState, next), false);
});
