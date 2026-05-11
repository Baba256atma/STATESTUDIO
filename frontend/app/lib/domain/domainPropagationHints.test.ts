import { test } from "node:test";
import * as assert from "node:assert/strict";

import { deriveDomainPropagationHints } from "./domainPropagationHints.ts";
import type { SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

const objects: SceneObject[] = [
  { id: "supplier", label: "Supplier", role: "input" },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery", label: "Delivery", role: "output" },
];

const edges: SceneLoopEdge[] = [
  { from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.6 },
  { from: "inventory", to: "delivery", kind: "domain_risk_path", weight: 0.8 },
  { from: "missing", to: "delivery", kind: "domain_flow", weight: 0.5 },
];

test("propagation hints are stable", () => {
  const first = deriveDomainPropagationHints({ objects, edges });
  const second = deriveDomainPropagationHints({ objects, edges });

  assert.deepEqual(second, first);
});

test("propagation hints include only valid scene object edges", () => {
  const hints = deriveDomainPropagationHints({ objects, edges });

  assert.equal(hints.length, 2);
  assert.equal(hints.some((hint) => hint.sourceObjectId === "missing"), false);
});

test("propagation strength is clamped", () => {
  const hints = deriveDomainPropagationHints({
    objects,
    edges: [{ from: "supplier", to: "inventory", kind: "domain_risk_path", weight: 2 }],
  });

  assert.equal(hints[0]?.propagationStrength, 1);
});

test("risk paths become risk propagation hints", () => {
  const hints = deriveDomainPropagationHints({ objects, edges });

  assert.equal(hints.find((hint) => hint.sourceObjectId === "inventory")?.propagationType, "risk");
});
