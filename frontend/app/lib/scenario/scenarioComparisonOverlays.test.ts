import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildScenarioComparisonOverlayState } from "./scenarioComparisonOverlays.ts";
import type { ScenarioComparison } from "./scenarioCompareTypes.ts";

const comparisons: ScenarioComparison[] = [
  {
    id: "c1",
    scenarioAId: "a",
    scenarioBId: "b",
    comparisonTitle: "Supply comparison",
    executiveSummary: "B is safer.",
    stabilityDelta: 12,
    fragilityDelta: -20,
    propagationDelta: -14,
    confidenceDelta: 8,
    recommendedScenarioId: "b",
    tradeoffs: ["B reduces fragility."],
    createdAt: 0,
  },
];

test("comparison overlay state is passive metadata", () => {
  const overlay = buildScenarioComparisonOverlayState({ comparisons });

  assert.equal(overlay.comparisonSummaries.length, 1);
  assert.deepEqual(overlay.recommendedScenarioIds, ["b"]);
});

test("comparison overlay state does not mutate input", () => {
  const copy = structuredClone(comparisons);
  buildScenarioComparisonOverlayState({ comparisons });

  assert.deepEqual(comparisons, copy);
});
