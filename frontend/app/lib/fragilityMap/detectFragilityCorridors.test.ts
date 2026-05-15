import test from "node:test";
import assert from "node:assert/strict";

import { detectFragilityCorridors } from "./detectFragilityCorridors.ts";

test("detects high-risk operational fragility corridors", () => {
  const corridors = detectFragilityCorridors({
    propagationHints: [
      { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.9, propagationType: "dependency" },
      { sourceObjectId: "inventory", targetObjectId: "delivery", propagationStrength: 0.82, propagationType: "delay" },
    ],
    fragilityScores: [
      { objectId: "supplier", score: 88, level: "critical" },
      { objectId: "inventory", score: 72, level: "fragile" },
      { objectId: "delivery", score: 58, level: "fragile" },
    ],
    relationships: [
      {
        edgeId: "edge_supplier_inventory",
        sourceObjectId: "supplier",
        targetObjectId: "inventory",
        relationshipType: "dependency",
        meta: { semantic: "dependency", strength: 0.9, directional: true },
        executiveExplanation: "Inventory depends on supplier stability.",
      },
      {
        edgeId: "edge_inventory_delivery",
        sourceObjectId: "inventory",
        targetObjectId: "delivery",
        relationshipType: "flow",
        meta: { semantic: "flow", strength: 0.8, directional: true },
        executiveExplanation: "Delivery depends on inventory flow.",
      },
    ],
    domainIds: ["supply_chain", "retail"],
  });

  assert.equal(corridors.length, 1);
  assert.deepEqual(corridors[0].objectPath, ["supplier", "inventory", "delivery"]);
  assert.ok(corridors[0].relatedEdgeIds.includes("edge_supplier_inventory"));
});

test("corridor detection is deterministic and does not mutate input", () => {
  const input = {
    propagationHints: [
      { sourceObjectId: "a", targetObjectId: "b", propagationStrength: 0.7, propagationType: "risk" as const },
      { sourceObjectId: "b", targetObjectId: "c", propagationStrength: 0.7, propagationType: "dependency" as const },
    ],
    fragilityScores: [
      { objectId: "a", score: 70, level: "fragile" as const },
      { objectId: "b", score: 70, level: "fragile" as const },
      { objectId: "c", score: 70, level: "fragile" as const },
    ],
  };
  const before = JSON.stringify(input);
  const first = detectFragilityCorridors(input);
  const second = detectFragilityCorridors(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});
