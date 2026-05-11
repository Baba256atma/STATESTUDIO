import { test } from "node:test";
import * as assert from "node:assert/strict";

import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import type { SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

const objects: SceneObject[] = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery_risk", label: "Delivery Risk", role: "risk" },
];

const edges: SceneLoopEdge[] = [
  { from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.72 },
  { from: "inventory", to: "delivery_risk", kind: "domain_risk_path", weight: 0.84 },
  { from: "supplier", to: "delivery_risk", kind: "domain_risk_path", weight: 0.8 },
];

test("fragility scoring is deterministic", () => {
  const first = calculateObjectFragilityScores({ objects, edges });
  const second = calculateObjectFragilityScores({ objects, edges });

  assert.deepEqual(second, first);
});

test("fragility score range and levels are valid", () => {
  const scores = calculateObjectFragilityScores({ objects, edges });

  assert.equal(scores.length, 3);
  for (const score of scores) {
    assert.ok(score.score >= 0 && score.score <= 100);
    assert.ok(["stable", "watch", "fragile", "critical"].includes(score.level));
  }
});

test("risk-connected object receives higher fragility than isolated object", () => {
  const scores = calculateObjectFragilityScores({
    objects: [...objects, { id: "monitor", label: "Monitor", role: "monitor" }],
    edges,
  });
  const risk = scores.find((score) => score.objectId === "delivery_risk");
  const monitor = scores.find((score) => score.objectId === "monitor");

  assert.ok((risk?.score ?? 0) > (monitor?.score ?? 0));
});

test("fragility scoring does not mutate input", () => {
  const objectCopy = structuredClone(objects);
  const edgeCopy = structuredClone(edges);
  calculateObjectFragilityScores({ objects, edges });

  assert.deepEqual(objects, objectCopy);
  assert.deepEqual(edges, edgeCopy);
});
