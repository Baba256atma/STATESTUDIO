import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_RUNTIME_BRAKE_LOG,
  SVIE_RUNTIME_FOUNDATION_TAG,
  SVIE_RUNTIME_READY_LOG,
} from "./svieRuntimeFoundationContract.ts";
import {
  buildSvieRuntimeSnapshot,
  getSvieRuntimeSnapshot,
  guardSvieDashboardWrite,
  guardSvieRouteWrite,
  guardSvieWorkspaceWrite,
  initializeSvieRuntime,
  isSvieRuntimeInitialized,
  resetSvieRuntimeFoundationForTests,
} from "./svieRuntimeFoundation.ts";
import { readSceneObjectsFromJson, resolveSvieObjectState } from "./svieRuntimeFoundationResolver.ts";

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
});

test("exports SVIE foundation tag", () => {
  assert.equal(SVIE_RUNTIME_FOUNDATION_TAG, "[SVIE:1:1_RUNTIME_FOUNDATION]");
});

test("A — runtime initializes and emits RuntimeReady once", () => {
  const warnings: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    warnings.push(String(args[0] ?? ""));
  };

  try {
    assert.equal(isSvieRuntimeInitialized(), false);
    const init = initializeSvieRuntime();
    assert.equal(init.initialized, true);
    assert.equal(init.readOnly, true);
    assert.equal(isSvieRuntimeInitialized(), true);

    initializeSvieRuntime();
    assert.equal(warnings.filter((entry) => entry === SVIE_RUNTIME_READY_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("builds render-ready visual metadata from scene objects", () => {
  initializeSvieRuntime();
  const snapshot = buildSvieRuntimeSnapshot({
    sceneJson: {
      state_vector: { volatility: 0.2, intensity: 0.3 },
      scene: {
        objects: [
          { id: "line-1", scanner_severity: "high", emphasis: 0.9 },
          { id: "line-2", scanner_highlighted: true, tags: ["growth"] },
          { id: "line-3" },
        ],
      },
    },
    selectedObjectId: "line-3",
  });

  assert.equal(snapshot.objects.length, 3);
  assert.equal(snapshot.objects[0]?.objectId, "line-1");
  assert.equal(snapshot.objects[0]?.healthLevel, "critical");
  assert.ok((snapshot.objects.find((entry) => entry.objectId === "line-3")?.visualPriority ?? 0) >= 25);
  assert.ok(snapshot.generatedAt > 0);
  assert.equal(getSvieRuntimeSnapshot(), snapshot);
});

test("resolver reads scene objects without mutation", () => {
  const sceneJson = Object.freeze({
    scene: Object.freeze({
      objects: Object.freeze([Object.freeze({ id: "obj-a", emphasis: 0.6 })]),
    }),
  });

  const objects = readSceneObjectsFromJson(sceneJson);
  assert.equal(objects.length, 1);
  assert.equal(objects[0]?.id, "obj-a");

  const state = resolveSvieObjectState(objects[0]!, { metrics: null, selectedObjectId: null });
  assert.equal(state?.healthLevel, "warning");
});

test("B/C/D — dashboard, route, and workspace writes are blocked with brakes", () => {
  initializeSvieRuntime();
  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(String(args[0] ?? ""));
  };

  try {
    const dashboard = guardSvieDashboardWrite({ action: "setDashboardMode", source: "svie-test" });
    const route = guardSvieRouteWrite({ action: "requestWorkspaceLaunch", source: "svie-test" });
    const workspace = guardSvieWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-test",
    });

    assert.equal(dashboard.allowed, false);
    assert.equal(route.allowed, false);
    assert.equal(workspace.allowed, false);

    guardSvieDashboardWrite({ action: "setDashboardMode", source: "svie-test" });
    assert.equal(warnings.filter((entry) => entry === SVIE_RUNTIME_BRAKE_LOG).length, 3);
  } finally {
    console.warn = originalWarn;
  }
});
