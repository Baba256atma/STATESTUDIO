import assert from "node:assert/strict";
import test from "node:test";
import { detectStrategicDriftPatterns } from "./detectStrategicDriftPatterns.ts";

test("strategic drift patterns derive from repeated memory and drift signals", () => {
  const patterns = detectStrategicDriftPatterns({
    driftSignals: [{
      id: "drift_supplier",
      title: "Supplier drift",
      summary: "Supplier drift.",
      driftType: "coordination_decay",
      relatedObjectIds: ["supplier", "delivery"],
      driftIntensity: 0.72,
      confidence: 0.8,
      createdAt: 0,
    }],
    strategicMemory: [{
      id: "memory_supplier",
      category: "propagation",
      title: "Supplier propagation recurrence",
      summary: "Repeated pressure.",
      relatedObjectIds: ["supplier", "delivery"],
      severity: "high",
      confidence: 0.78,
      recurrenceCount: 4,
      firstObservedAt: 0,
      lastObservedAt: 0,
      domainId: "supply_chain",
    }],
  });

  assert.equal(patterns.length, 2);
  assert.equal(patterns[0].recurrenceScore >= patterns[1].recurrenceScore, true);
  assert.ok(patterns.some((pattern) => pattern.driftType === "propagation_expansion"));
});

test("strategic drift patterns are deterministic", () => {
  const input = {
    strategicMemory: [{
      id: "memory_dependency",
      category: "dependency" as const,
      title: "Dependency recurrence",
      summary: "Repeated dependency pressure.",
      relatedObjectIds: ["inventory", "delivery"],
      recurrenceCount: 3,
      firstObservedAt: 0,
      lastObservedAt: 0,
    }],
  };

  assert.deepEqual(detectStrategicDriftPatterns(input), detectStrategicDriftPatterns(input));
});
