import { test } from "node:test";
import * as assert from "node:assert/strict";

import { enrichDomainRelationships } from "./enrichDomainRelationships.ts";

const objects = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery", label: "Delivery", role: "output" },
];

const edges = [
  { id: "e1", from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.6 },
  { id: "e2", from: "inventory", to: "delivery", kind: "domain_dependency", weight: 0.7 },
];

test("enriches existing edges with semantic metadata", () => {
  const enriched = enrichDomainRelationships({ domainId: "supply_chain", objects, edges });

  assert.equal(enriched.length, 2);
  assert.equal(enriched[0]?.meta.semantic, "flow");
  assert.equal(enriched[1]?.meta.semantic, "dependency");
  assert.match(enriched[1]?.executiveExplanation ?? "", /depends/i);
});

test("does not mutate input objects or edges", () => {
  const objectCopy = structuredClone(objects);
  const edgeCopy = structuredClone(edges);

  enrichDomainRelationships({ domainId: "supply_chain", objects, edges });

  assert.deepEqual(objects, objectCopy);
  assert.deepEqual(edges, edgeCopy);
});

test("dedupes duplicate semantic edges", () => {
  const enriched = enrichDomainRelationships({
    domainId: "supply_chain",
    objects,
    edges: [...edges, { id: "e1b", from: "supplier", to: "inventory", kind: "domain_flow" }],
  });

  assert.equal(enriched.filter((item) => item.sourceObjectId === "supplier" && item.targetObjectId === "inventory").length, 1);
});

test("skips edges missing known objects", () => {
  const enriched = enrichDomainRelationships({
    domainId: "supply_chain",
    objects,
    edges: [{ id: "missing", from: "supplier", to: "unknown", kind: "domain_flow" }],
  });

  assert.equal(enriched.length, 0);
});
