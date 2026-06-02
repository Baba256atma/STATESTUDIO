import test from "node:test";
import assert from "node:assert/strict";

import {
  extractSceneObjectIds,
  isExecutiveOperationalObjectScene,
  resolveExecutiveRenderFocusMode,
  sanitizeExecutiveObjectSelectionForRender,
  shouldRenderAllSceneObjects,
  shouldRestrictVisibilityToFocus,
} from "./executiveVisibleObjectPolicy.ts";
import { resolveSceneRenderObjects } from "./resolveSceneRenderObjects.ts";
import {
  buildSceneObjectPipelineTraceSignature,
  detectSceneObjectPipelineFilters,
  resetSceneObjectPipelineTraceLogsForTests,
  traceSceneObjectPipeline,
} from "./sceneObjectPipelineTrace.ts";

test("treats 6–12 object scenes as operational maps", () => {
  assert.equal(isExecutiveOperationalObjectScene(10), true);
  assert.equal(isExecutiveOperationalObjectScene(5), false);
  assert.equal(isExecutiveOperationalObjectScene(13), false);
});

test("does not restrict visibility unless executive focus mode is active", () => {
  assert.equal(
    shouldRestrictVisibilityToFocus({
      focusMode: "selected",
      executiveFocusModeEnabled: false,
    }),
    false
  );
  assert.equal(
    shouldRestrictVisibilityToFocus({
      focusMode: "selected",
      executiveFocusModeEnabled: true,
    }),
    true
  );
});

test("renders all scene objects by default when focus isolation is inactive", () => {
  assert.equal(
    shouldRenderAllSceneObjects({
      focusMode: "selected",
      selectedObjectId: "obj_delivery_1",
      executiveFocusModeEnabled: false,
    }),
    true
  );
  const scene = {
    scene: {
      objects: [{ id: "a" }, { id: "b" }, { id: "c" }],
    },
  };
  assert.equal(
    resolveSceneRenderObjects(scene, {
      focusMode: "selected",
      selectedObjectId: "a",
      executiveFocusModeEnabled: false,
    }).length,
    3
  );
});

test("forces render focus mode to all when focus isolation is inactive", () => {
  assert.equal(
    resolveExecutiveRenderFocusMode({
      focusMode: "selected",
      executiveFocusModeEnabled: false,
    }),
    "all"
  );
});

test("clears dim_unrelated on operational scenes without active focus isolation", () => {
  const sanitized = sanitizeExecutiveObjectSelectionForRender(
    {
      highlighted_objects: ["obj_delivery_1", "obj_supplier_1"],
      dim_unrelated_objects: true,
    },
    {
      objectCount: 10,
      focusMode: "selected",
      executiveFocusModeEnabled: false,
    }
  );
  assert.equal(sanitized?.dim_unrelated_objects, false);
});

test("detects single-object bottleneck filter", () => {
  const filters = detectSceneObjectPipelineFilters({
    sceneJsonCount: 10,
    visibleCount: 10,
    renderedCount: 1,
    staleSceneJsonCache: true,
    restrictToFocus: false,
    dimUnrelatedObjects: false,
    focusMode: "all",
    selectedObjectId: null,
    scenarioId: null,
    objectSelectionHighlightCount: 2,
  });
  assert.ok(filters.includes("single_object_bottleneck"));
  assert.ok(filters.includes("stale_scene_json_cache"));
  assert.ok(filters.includes("render_count_drop"));
});

test("logs once per stable pipeline signature", () => {
  resetSceneObjectPipelineTraceLogsForTests();
  const originalInfo = console.info;
  let callCount = 0;
  console.info = (...args: unknown[]) => {
    if (args[0] === "[Nexora][SceneObjectPipelineTrace]") callCount += 1;
    originalInfo(...args);
  };
  const snapshot = {
    sceneJsonObjectIds: ["a", "b"],
    visibleSceneObjectIds: ["a", "b"],
    renderedObjectIds: ["a", "b"],
    activeFilters: [],
    focusMode: "all" as const,
    selectedObjectId: null,
    scenarioId: null,
    executiveFocusModeEnabled: false,
    restrictToFocus: false,
    dimUnrelatedObjects: false,
  };
  traceSceneObjectPipeline(snapshot);
  traceSceneObjectPipeline(snapshot);
  console.info = originalInfo;
  assert.equal(callCount, 1);
});

test("builds stable signatures regardless of id order", () => {
  const a = buildSceneObjectPipelineTraceSignature({
    sceneJsonObjectIds: ["b", "a"],
    visibleSceneObjectIds: ["b", "a"],
    renderedObjectIds: ["b", "a"],
    activeFilters: [],
    focusMode: "all",
    selectedObjectId: null,
    scenarioId: null,
    executiveFocusModeEnabled: false,
    restrictToFocus: false,
    dimUnrelatedObjects: false,
  });
  const b = buildSceneObjectPipelineTraceSignature({
    sceneJsonObjectIds: ["a", "b"],
    visibleSceneObjectIds: ["a", "b"],
    renderedObjectIds: ["a", "b"],
    activeFilters: [],
    focusMode: "all",
    selectedObjectId: null,
    scenarioId: null,
    executiveFocusModeEnabled: false,
    restrictToFocus: false,
    dimUnrelatedObjects: false,
  });
  assert.equal(a, b);
});

test("extracts scene object ids from scene json", () => {
  assert.deepEqual(
    extractSceneObjectIds({
      scene: {
        objects: [{ id: "obj_supplier_1" }, { name: "warehouse" }],
      },
    }),
    ["obj_supplier_1", "warehouse"]
  );
});
