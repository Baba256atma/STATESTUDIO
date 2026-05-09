import test from "node:test";
import assert from "node:assert/strict";

import { compareTypeCScenarioSimulations } from "./typeCScenarioComparison.ts";
import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "./typeCScenarioSimulation.ts";

function scenario(id: string, title: string, confidence: number): TypeCScenarioDraft {
  return {
    id,
    title,
    description: title,
    trigger: "trigger",
    impact: "impact",
    confidence,
    relatedObjectIds: [],
    basedOnConnections: [],
  };
}

function simulation(
  scenarioId: string,
  riskLevel: TypeCScenarioSimulation["riskLevel"],
  affectedCount: number,
  pathCount: number
): TypeCScenarioSimulation {
  return {
    scenarioId,
    riskLevel,
    affectedObjectIds: Array.from({ length: affectedCount }, (_, index) => `obj-${index}`),
    propagationPaths: Array.from({ length: pathCount }, (_, index) => ({
      from: `obj-${index}`,
      to: `obj-${index + 1}`,
      intensity: 0.8,
    })),
    summary: `${scenarioId} summary`,
  };
}

test("compareTypeCScenarioSimulations compares 2+ scenarios", () => {
  const comparison = compareTypeCScenarioSimulations({
    scenarios: [scenario("a", "A", 0.8), scenario("b", "B", 0.7)],
    simulations: [simulation("a", "medium", 2, 1), simulation("b", "high", 3, 2)],
  });
  assert.equal(comparison.rows.length, 2);
  assert.deepEqual(comparison.scenarioIds, ["a", "b"]);
});

test("compareTypeCScenarioSimulations selects lowest-risk best option", () => {
  const comparison = compareTypeCScenarioSimulations({
    scenarios: [scenario("safe", "Safe", 0.6), scenario("risky", "Risky", 0.9)],
    simulations: [simulation("safe", "low", 1, 0), simulation("risky", "high", 4, 3)],
  });
  assert.equal(comparison.bestOptionId, "safe");
});

test("compareTypeCScenarioSimulations selects highest-risk scenario", () => {
  const comparison = compareTypeCScenarioSimulations({
    scenarios: [scenario("medium", "Medium", 0.7), scenario("high", "High", 0.8)],
    simulations: [simulation("medium", "medium", 2, 1), simulation("high", "high", 3, 2)],
  });
  assert.equal(comparison.highestRiskScenarioId, "high");
});

test("compareTypeCScenarioSimulations caps rows", () => {
  const scenarios = Array.from({ length: 7 }, (_, index) => scenario(`s-${index}`, `S ${index}`, 0.6));
  const simulations = scenarios.map((item) => simulation(item.id, "medium", 2, 1));
  const comparison = compareTypeCScenarioSimulations({ scenarios, simulations });
  assert.equal(comparison.rows.length, 5);
});

test("compareTypeCScenarioSimulations returns safe comparison for empty input", () => {
  const comparison = compareTypeCScenarioSimulations({ scenarios: [], simulations: [] });
  assert.equal(comparison.id, "typec_compare_empty");
  assert.equal(comparison.bestOptionId, null);
  assert.equal(comparison.highestRiskScenarioId, null);
  assert.deepEqual(comparison.rows, []);
});

test("compareTypeCScenarioSimulations does not mutate inputs", () => {
  const scenarios = [scenario("a", "A", 0.8), scenario("b", "B", 0.7)];
  const simulations = [simulation("a", "medium", 2, 1), simulation("b", "high", 3, 2)];
  const before = JSON.stringify({ scenarios, simulations });
  compareTypeCScenarioSimulations({ scenarios, simulations });
  assert.equal(JSON.stringify({ scenarios, simulations }), before);
});
