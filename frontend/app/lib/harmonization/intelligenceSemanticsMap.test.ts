import assert from "node:assert/strict";
import test from "node:test";

import {
  findSemanticRelationships,
  listIntelligenceSemantics,
  validateIntelligenceSemanticsMap,
} from "./intelligenceSemanticsMap.ts";

test("intelligence semantics map links core Type-C concepts", () => {
  const semantics = listIntelligenceSemantics();

  assert.equal(semantics.some((entry) => entry.source === "propagation" && entry.target === "fragility"), true);
  assert.equal(semantics.some((entry) => entry.source === "drift" && entry.target === "readiness"), true);
  assert.equal(semantics.every((entry) => entry.executiveMeaning.length > 0), true);
});

test("semantic relationships can be found by concept", () => {
  const relationships = findSemanticRelationships("readiness");

  assert.equal(relationships.length >= 2, true);
  assert.equal(relationships.some((entry) => entry.source === "drift" || entry.target === "drift"), true);
});

test("semantic map validates without duplicates or self loops", () => {
  const validation = validateIntelligenceSemanticsMap();

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.warnings, []);
});
