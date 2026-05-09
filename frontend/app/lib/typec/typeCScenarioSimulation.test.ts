import test from "node:test";
import assert from "node:assert/strict";

import { clearTypeCScenarioSimulation, simulateTypeCScenario } from "./typeCScenarioSimulation.ts";
import type { SceneJson } from "../sceneTypes.ts";
import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const supplyScene: SceneJson = {
  state_vector: {},
  scene: {
    objects: [
      { id: "supplier", label: "Supplier" },
      { id: "inventory", label: "Inventory" },
      { id: "delivery", label: "Delivery" },
    ],
    loops: [
      {
        id: "supply-chain",
        type: "delivery_customer",
        edges: [
          { from: "supplier", to: "inventory", kind: "dependency" },
          { from: "inventory", to: "delivery", kind: "dependency" },
        ],
      },
    ],
  },
};

const chainScenario: TypeCScenarioDraft = {
  id: "scenario_supply_chain",
  title: "Supply delay cascade risk",
  description: "Delay in supplier may propagate through inventory to delivery.",
  trigger: "Supplier delay > 2 days",
  impact: "Delivery disruption",
  confidence: 0.9,
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  basedOnConnections: ["supplier->inventory", "inventory->delivery"],
};

test("simulateTypeCScenario builds propagation from scenario graph", () => {
  const simulation = simulateTypeCScenario({ scenario: chainScenario, sceneJson: supplyScene });
  assert.equal(simulation.scenarioId, "scenario_supply_chain");
  assert.deepEqual(simulation.propagationPaths, [
    { from: "supplier", to: "inventory", intensity: 0.8 },
    { from: "inventory", to: "delivery", intensity: 0.6 },
  ]);
});

test("simulateTypeCScenario returns valid affected objects", () => {
  const simulation = simulateTypeCScenario({ scenario: chainScenario, sceneJson: supplyScene });
  assert.deepEqual(simulation.affectedObjectIds, ["supplier", "inventory", "delivery"]);
});

test("simulateTypeCScenario marks multi-node chains high risk", () => {
  const simulation = simulateTypeCScenario({ scenario: chainScenario, sceneJson: supplyScene });
  assert.equal(simulation.riskLevel, "high");
});

test("simulateTypeCScenario marks two-node impact medium risk", () => {
  const scenario: TypeCScenarioDraft = {
    ...chainScenario,
    id: "scenario_two_node",
    relatedObjectIds: ["supplier", "inventory"],
    basedOnConnections: ["supplier->inventory"],
  };
  const simulation = simulateTypeCScenario({ scenario, sceneJson: supplyScene });
  assert.equal(simulation.riskLevel, "medium");
  assert.deepEqual(simulation.propagationPaths, [{ from: "supplier", to: "inventory", intensity: 0.8 }]);
});

test("simulateTypeCScenario does not mutate input scene", () => {
  const before = clone(supplyScene);
  simulateTypeCScenario({ scenario: chainScenario, sceneJson: supplyScene });
  assert.deepEqual(supplyScene, before);
});

test("simulateTypeCScenario handles empty scenario safely", () => {
  const scenario: TypeCScenarioDraft = {
    ...chainScenario,
    id: "empty",
    relatedObjectIds: [],
    basedOnConnections: [],
  };
  const simulation = simulateTypeCScenario({ scenario, sceneJson: { state_vector: {}, scene: {} } });
  assert.equal(simulation.scenarioId, "empty");
  assert.equal(simulation.riskLevel, "low");
  assert.deepEqual(simulation.affectedObjectIds, []);
  assert.deepEqual(simulation.propagationPaths, []);
});

test("clearTypeCScenarioSimulation clears active simulation", () => {
  assert.equal(clearTypeCScenarioSimulation(), null);
});
