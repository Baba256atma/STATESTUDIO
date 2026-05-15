import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyExecutiveUxSignal,
  rankExecutiveUxSignals,
  selectPrimaryExecutiveFocus,
} from "./executiveSignalHierarchy.ts";

test("classifies critical executive signals as immediate focus", () => {
  const signal = classifyExecutiveUxSignal({
    id: "alert-critical",
    sourceType: "alert",
    severity: "critical",
    confidence: 0.9,
  });

  assert.equal(signal.level, "immediate_focus");
  assert.equal(signal.rankScore >= 0.72, true);
});

test("ranks executive UX signals deterministically and dedupes repeated source signals", () => {
  const ranked = rankExecutiveUxSignals([
    {
      id: "monitoring-1",
      sourceType: "monitoring",
      severity: "high",
      confidence: 0.8,
      relatedObjectIds: ["delivery"],
    },
    {
      id: "alert-1",
      sourceType: "alert",
      severity: "critical",
      confidence: 0.7,
      relatedObjectIds: ["supplier"],
    },
    {
      id: "alert-1",
      sourceType: "alert",
      severity: "critical",
      confidence: 0.7,
      relatedObjectIds: ["supplier"],
    },
  ]);

  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].id, "alert-1");
  assert.deepEqual(ranked.map((item) => item.displayOrder), [1, 2]);
});

test("selects only one primary executive focus", () => {
  const focus = selectPrimaryExecutiveFocus([
    { id: "memory", sourceType: "memory", severity: "low", confidence: 0.4 },
    { id: "readiness", sourceType: "readiness", severity: "critical", confidence: 0.85 },
  ]);

  assert.equal(focus?.id, "readiness");
  assert.equal(focus?.level, "immediate_focus");
});
