import assert from "node:assert/strict";
import test from "node:test";
import {
  rankExecutiveSignals,
  topExecutiveSignals,
} from "./executiveSignalHierarchy.ts";

test("executive signal hierarchy ranks attention without treating all signals equally", () => {
  const ranked = rankExecutiveSignals([
    { id: "memory_1", sourceType: "memory", severity: "low", confidence: 0.6 },
    { id: "alert_1", sourceType: "alert", severity: "critical", confidence: 0.8 },
    { id: "monitoring_1", sourceType: "monitoring", severity: "high", confidence: 0.7 },
  ]);

  assert.equal(ranked[0].id, "alert_1");
  assert.equal(ranked[0].visibility, "primary");
  assert.equal(topExecutiveSignals(ranked, 2).length, 2);
});
