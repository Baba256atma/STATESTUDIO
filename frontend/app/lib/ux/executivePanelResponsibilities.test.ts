import assert from "node:assert/strict";
import test from "node:test";

import {
  getExecutivePanelResponsibility,
  listExecutivePanelResponsibilities,
  recommendPanelForSignal,
} from "./executivePanelResponsibilities.ts";

test("defines clear executive panel responsibilities", () => {
  const panels = listExecutivePanelResponsibilities();

  assert.equal(panels.length >= 8, true);
  assert.equal(getExecutivePanelResponsibility("war_room")?.primaryResponsibility.includes("Strategic workflow"), true);
  assert.equal(getExecutivePanelResponsibility("advice")?.canonicalView, "advice");
});

test("routes immediate focus to the primary decision strip", () => {
  const panel = recommendPanelForSignal({
    sourceType: "readiness",
    level: "immediate_focus",
  });

  assert.equal(panel.id, "decision_strip");
  assert.equal(panel.maxPrimaryItems, 1);
});

test("routes supporting signals to owning panels without route mutation", () => {
  assert.equal(recommendPanelForSignal({ sourceType: "drift", level: "strategic_context" }).id, "monitoring");
  assert.equal(recommendPanelForSignal({ sourceType: "comparison", level: "supporting_intelligence" }).id, "compare");
  assert.equal(recommendPanelForSignal({ sourceType: "unknown", level: "supporting_intelligence" }).id, "executive_dashboard");
});
