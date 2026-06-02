import test from "node:test";
import assert from "node:assert/strict";

import { compareTypeCScenarioSimulations } from "../../typec/typeCScenarioComparison.ts";
import type { TypeCScenarioDraft } from "../../typec/typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation.ts";
import {
  buildExecutiveScenarioUniverse,
  buildScenarioComparisonDashboard,
  computeScenarioLayerDelta,
  resolveActiveUniverseSimulation,
  resolveComparisonMode,
  resolveGhostUniverseLayers,
  resolveUniverseObjectSelection,
} from "./executiveMultiScenarioUniverseRuntime.ts";
import {
  clearExecutiveScenarioUniverse,
  loadExecutiveScenarioUniverse,
  resetExecutiveScenarioUniverseForTests,
  setActiveScenarioLayer,
  setScenarioUniverseLayoutMode,
} from "./executiveMultiScenarioUniverseStore.ts";

function draft(id: string, title: string, confidence = 0.75): TypeCScenarioDraft {
  return {
    id,
    title,
    description: title,
    trigger: "trigger",
    impact: "impact",
    confidence,
    relatedObjectIds: ["obj_a", "obj_b"],
    basedOnConnections: ["obj_a->obj_b"],
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
    affectedObjectIds: Array.from({ length: affectedCount }, (_, index) => `obj_${index}`),
    propagationPaths: Array.from({ length: pathCount }, (_, index) => ({
      from: `obj_${index}`,
      to: `obj_${index + 1}`,
      intensity: 0.75,
    })),
    summary: `${scenarioId} summary`,
  };
}

test("buildExecutiveScenarioUniverse builds baseline plus alternatives", () => {
  const drafts = [draft("scenario_a", "Conservative"), draft("scenario_b", "Aggressive", 0.62)];
  const simulations = [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 3, 2)];
  const comparison = compareTypeCScenarioSimulations({ scenarios: drafts, simulations });
  const universe = buildExecutiveScenarioUniverse({
    comparison,
    drafts,
    simulations,
    sceneObjectIds: ["obj_a", "obj_b", "obj_c"],
  });

  assert.equal(universe.layers.length, 3);
  assert.equal(universe.layers[0]?.metadata.role, "baseline");
  assert.equal(universe.comparisonActive, true);
  assert.equal(universe.rankings.length, 2);
  assert.ok(universe.recommendation?.recommendedScenarioId);
});

test("computeScenarioLayerDelta classifies added objects and relationships", () => {
  const delta = computeScenarioLayerDelta({
    scenarioId: "scenario_a",
    simulation: simulation("scenario_a", "medium", 2, 1),
    baselineAffectedIds: [],
    baselinePaths: [],
  });

  assert.ok(delta.objectDeltas.some((entry) => entry.classification === "added"));
  assert.ok(delta.relationshipDeltas.some((entry) => entry.classification === "added"));
  assert.ok(delta.metricChanges.length > 0);
});

test("resolveComparisonMode maps layer counts to comparison modes", () => {
  assert.equal(resolveComparisonMode(2), "single");
  assert.equal(resolveComparisonMode(3), "dual");
  assert.equal(resolveComparisonMode(4), "triple");
});

test("resolveUniverseObjectSelection merges active and ghost highlights", () => {
  const universe = buildExecutiveScenarioUniverse({
    comparison: compareTypeCScenarioSimulations({
      scenarios: [draft("scenario_a", "A"), draft("scenario_b", "B")],
      simulations: [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 2, 2)],
    }),
    drafts: [draft("scenario_a", "A"), draft("scenario_b", "B")],
    simulations: [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 2, 2)],
  });

  const selection = resolveUniverseObjectSelection({ state: universe, layoutMode: "ghost" });
  assert.ok((selection?.highlighted_objects?.length ?? 0) > 0);
  assert.ok((selection?.risk_sources?.length ?? 0) > 0);
});

test("resolveGhostUniverseLayers excludes active scenario in ghost layout", () => {
  const universe = buildExecutiveScenarioUniverse({
    comparison: compareTypeCScenarioSimulations({
      scenarios: [draft("scenario_a", "A"), draft("scenario_b", "B")],
      simulations: [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 2, 2)],
    }),
    drafts: [draft("scenario_a", "A"), draft("scenario_b", "B")],
    simulations: [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 2, 2)],
  });

  const ghosts = resolveGhostUniverseLayers(universe);
  assert.ok(ghosts.length > 0);
  assert.ok(ghosts.every((layer) => layer.metadata.id !== universe.activeScenarioId));
});

test("buildScenarioComparisonDashboard marks active scenario row", () => {
  const universe = buildExecutiveScenarioUniverse({
    comparison: compareTypeCScenarioSimulations({
      scenarios: [draft("scenario_a", "A"), draft("scenario_b", "B")],
      simulations: [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 2, 2)],
    }),
    drafts: [draft("scenario_a", "A"), draft("scenario_b", "B")],
    simulations: [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "high", 2, 2)],
  });

  const dashboard = buildScenarioComparisonDashboard(universe);
  assert.equal(dashboard.length, universe.layers.length);
  assert.ok(dashboard.some((row) => row.active));
});

test("executiveMultiScenarioUniverseStore loads, switches, and clears", () => {
  resetExecutiveScenarioUniverseForTests();
  const drafts = [draft("scenario_a", "Conservative"), draft("scenario_b", "Balanced")];
  const simulations = [simulation("scenario_a", "low", 1, 1), simulation("scenario_b", "medium", 2, 1)];
  const comparison = compareTypeCScenarioSimulations({ scenarios: drafts, simulations });

  const loaded = loadExecutiveScenarioUniverse({
    comparison,
    drafts,
    simulations,
  });
  assert.equal(loaded?.comparisonActive, true);

  const switched = setActiveScenarioLayer("scenario_b", { focusCamera: false });
  assert.equal(switched?.activeScenarioId, "scenario_b");
  assert.equal(resolveActiveUniverseSimulation(switched)?.scenarioId, "scenario_b");

  setScenarioUniverseLayoutMode("overlay");
  assert.equal(resolveGhostUniverseLayers(switched)?.length, 0);

  clearExecutiveScenarioUniverse();
});
