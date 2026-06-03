import test from "node:test";
import assert from "node:assert/strict";

import {
  buildConnectionRuntimeStabilitySummary,
  emitConnectionRuntimeStabilitySummary,
  recordConnectionLineRebuild,
  recordGeometryCreated,
  recordGeometryDisposed,
  recordObjectSelection,
  recordSceneCanvasRender,
  recordTopologyRebuild,
  resetConnectionRuntimeStabilityAuditForTests,
} from "./connectionRuntimeStabilityAudit.ts";

test.beforeEach(() => {
  resetConnectionRuntimeStabilityAuditForTests();
});

test("audit counters accumulate in development mode", () => {
  recordSceneCanvasRender("scene-a");
  recordTopologyRebuild("topology-binding");
  recordConnectionLineRebuild("topology-connection-lines");
  recordGeometryCreated("overlay-flow-lines");
  recordGeometryDisposed("overlay-flow-lines");
  recordObjectSelection("obj-1");

  const summary = buildConnectionRuntimeStabilitySummary("test");
  assert.equal(summary.renderCount, 1);
  assert.equal(summary.topologyRebuildCount, 1);
  assert.equal(summary.connectionLineRebuildCount, 1);
  assert.equal(summary.geometryLiveEstimate, 0);
  assert.equal(summary.objectSelectionCount, 1);
});

test("emitConnectionRuntimeStabilitySummary dedupes identical snapshots", () => {
  const warnings: unknown[] = [];
  const originalWarn = globalThis.console.warn;
  globalThis.console.warn = (...args: unknown[]) => {
    warnings.push(args[0]);
  };

  try {
    recordSceneCanvasRender("scene-b");
    emitConnectionRuntimeStabilitySummary("first");
    emitConnectionRuntimeStabilitySummary("first");
    assert.equal(warnings.length, 1);
    assert.equal(warnings[0], "[NEXORA_RUNTIME_STABILITY_AUDIT]");
  } finally {
    globalThis.console.warn = originalWarn;
  }
});

test("threshold flags classify storms", () => {
  for (let index = 0; index < 65; index += 1) {
    recordSceneCanvasRender(`scene-${index}`);
  }
  const summary = buildConnectionRuntimeStabilitySummary("storm-test");
  assert.equal(summary.possibleRenderLoop, true);
});
