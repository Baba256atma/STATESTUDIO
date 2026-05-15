import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildScenarioComparisonSummary,
  buildScenarioComparisonTitle,
} from "./scenarioComparisonNarratives.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

const scenarioA: DomainScenario = {
  id: "a",
  domainId: "finance",
  title: "Delay expansion",
  description: "Delay",
  type: "financial_pressure",
  confidence: 0.7,
  severity: "medium",
  relatedObjectIds: ["cash"],
  impacts: [],
  recommendedActions: [],
  executiveSummary: "Delay expansion.",
};

const scenarioB: DomainScenario = {
  ...scenarioA,
  id: "b",
  title: "Increase liquidity reserve",
};

test("comparison narratives are executive and comparative", () => {
  assert.equal(buildScenarioComparisonTitle({ scenarioA, scenarioB }), "finance scenario comparison");
  assert.match(
    buildScenarioComparisonSummary({
      scenarioA,
      scenarioB,
      recommendedScenarioId: "b",
      stabilityDelta: 14,
      fragilityDelta: -18,
      propagationDelta: -10,
    }),
    /stronger advisory option/i
  );
});
