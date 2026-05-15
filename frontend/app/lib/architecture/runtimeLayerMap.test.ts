import assert from "node:assert/strict";
import test from "node:test";

import { getRuntimeLayer, listRuntimeLayers, validateRuntimeLayerMap } from "./runtimeLayerMap.ts";

test("runtime layer map defines production boundaries in order", () => {
  const layers = listRuntimeLayers();

  assert.deepEqual(layers.map((layer) => layer.id), [
    "ui",
    "executive_intelligence",
    "decision_intelligence",
    "propagation",
    "scene",
    "infrastructure",
  ]);
  assert.equal(getRuntimeLayer("scene")?.forbiddenResponsibilities.includes("derive executive strategy"), true);
});

test("runtime layer map validates without self-dependencies", () => {
  const result = validateRuntimeLayerMap();

  assert.equal(result.valid, true);
  assert.deepEqual(result.warnings, []);
});
