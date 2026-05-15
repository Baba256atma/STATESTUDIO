import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildWarRoomFlowOverlayState,
  buildWarRoomFocusStripState,
} from "./warRoomFlowOverlays.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { WarRoomFlowState } from "./warRoomFlowTypes.ts";

const flow: WarRoomFlowState = {
  currentStage: "scenario_compare",
  activeScenarioId: "scenario_b",
  comparedScenarioIds: ["scenario_a", "scenario_b"],
  selectedInsightId: "insight_a",
  recommendedFocus: "Compare supplier alternatives",
  executiveSummary: "Comparing strategic alternatives.",
  updatedAt: 0,
};

const insight: ExecutiveInsight = {
  id: "insight_a",
  title: "Supplier Dependency Fragility",
  summary: "Supplier dependency is elevated.",
  category: "dependency",
  severity: "critical",
  confidence: 0.9,
  priorityScore: 92,
  affectedObjectIds: ["supplier"],
  recommendedFocus: "Reduce supplier dependency",
  createdAt: 0,
};

test("overlay state keeps War Room flow metadata read-only", () => {
  const overlay = buildWarRoomFlowOverlayState({ flow });

  assert.equal(overlay.currentStage, "scenario_compare");
  assert.equal(overlay.stageLabel, "Scenario Compare");
  assert.deepEqual(overlay.comparedScenarioIds, ["scenario_a", "scenario_b"]);
  assert.ok(overlay.softPanelHints.includes("compare"));
});

test("overlay state copies compared ids defensively", () => {
  const overlay = buildWarRoomFlowOverlayState({ flow });
  overlay.comparedScenarioIds.push("mutated");

  assert.deepEqual(flow.comparedScenarioIds, ["scenario_a", "scenario_b"]);
});

test("focus strip surfaces executive orientation", () => {
  const strip = buildWarRoomFocusStripState({ flow, topInsight: insight });

  assert.equal(strip.stageLabel, "Scenario Compare");
  assert.equal(strip.executiveFocus, "Compare supplier alternatives");
  assert.equal(strip.priority, "critical");
  assert.ok(strip.summary.includes("Comparing"));
});
