import assert from "node:assert/strict";
import test from "node:test";
import {
  findLayersProducing,
  getIntelligenceLayer,
  listIntelligenceLayers,
} from "./intelligenceLayerRegistry.ts";

test("D2 intelligence layer registry exposes canonical ownership", () => {
  const layers = listIntelligenceLayers();
  assert.ok(layers.length >= 18);
  assert.ok(getIntelligenceLayer("monitoring"));
  assert.ok(getIntelligenceLayer("readiness"));
  assert.ok(getIntelligenceLayer("adaptation"));
  assert.ok(findLayersProducing("decision_readiness").some((layer) => layer.id === "readiness"));
});

test("D2 intelligence layer registry returns copy-safe entries", () => {
  const first = listIntelligenceLayers();
  first[0].consumes.push("mutated");
  const second = listIntelligenceLayers();
  assert.equal(second[0].consumes.includes("mutated"), false);
});
