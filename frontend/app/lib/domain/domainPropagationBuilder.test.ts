import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainPropagationFrames } from "./domainPropagationBuilder.ts";

const objects = [
  { id: "supplier", label: "Supplier" },
  { id: "inventory", label: "Inventory" },
  { id: "delivery", label: "Delivery" },
];

const edges = [
  { from: "supplier", to: "inventory", kind: "risk_path", weight: 0.7 },
  { from: "inventory", to: "delivery", kind: "flow", weight: 0.55 },
];

test("builds deterministic propagation frames from edges", () => {
  const first = buildDomainPropagationFrames({ objects, edges });
  const second = buildDomainPropagationFrames({ objects, edges });

  assert.deepEqual(first, second);
  assert.equal(first.length, 2);
  assert.equal(first[0]?.activePropagationEvents[0]?.sourceObjectId, "supplier");
  assert.equal(first[0]?.activePropagationEvents[0]?.targetObjectId, "inventory");
});

test("frame ids are stable and propagation ordering is valid", () => {
  const frames = buildDomainPropagationFrames({ objects, edges });

  assert.ok(frames[0]?.activePropagationEvents[0]?.id.includes("supplier"));
  assert.ok((frames[1]?.timestamp ?? 0) > (frames[0]?.timestamp ?? 0));
  assert.deepEqual(frames[0]?.highlightedObjectIds, ["supplier", "inventory"]);
});

test("duplicate propagation events are prevented and frame count is constrained", () => {
  const manyHints = Array.from({ length: 12 }, (_, index) => ({
    sourceObjectId: index % 2 === 0 ? "supplier" : "inventory",
    targetObjectId: index % 2 === 0 ? "inventory" : "delivery",
    propagationType: "risk",
    propagationStrength: 0.5,
  }));

  const frames = buildDomainPropagationFrames({
    objects,
    propagationHints: manyHints,
  });

  assert.equal(frames.length, 2);
});

test("risk signals can increase target severity without mutating input", () => {
  const riskSignals = [
    {
      id: "risk-inventory",
      severity: "high",
      confidence: 0.8,
      relatedObjectIds: ["inventory"],
    },
  ];
  const before = JSON.stringify({ objects, edges, riskSignals });
  const frames = buildDomainPropagationFrames({ objects, edges, riskSignals });

  assert.equal(frames[0]?.activePropagationEvents[0]?.severity, "critical");
  assert.equal(JSON.stringify({ objects, edges, riskSignals }), before);
});
