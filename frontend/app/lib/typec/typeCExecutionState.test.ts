import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTypeCMonitoringSignals,
  pauseTypeCExecution,
  startTypeCExecution,
  stopTypeCExecution,
} from "./typeCExecutionState.ts";
import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "./typeCScenarioSimulation.ts";

const scenario: TypeCScenarioDraft = {
  id: "scenario_supply",
  title: "Supply delay cascade risk",
  description: "Delay may propagate.",
  trigger: "Supplier delay",
  impact: "Delivery disruption",
  confidence: 0.9,
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  basedOnConnections: ["supplier->inventory", "inventory->delivery"],
};

const simulation: TypeCScenarioSimulation = {
  scenarioId: "scenario_supply",
  affectedObjectIds: ["supplier", "inventory", "delivery"],
  propagationPaths: [
    { from: "supplier", to: "inventory", intensity: 0.8 },
    { from: "inventory", to: "delivery", intensity: 0.6 },
  ],
  riskLevel: "high",
  summary: "Delay propagates from supplier to delivery.",
};

test("startTypeCExecution sets running state", () => {
  const state = startTypeCExecution({ scenario, simulation });
  assert.equal(state.scenarioId, "scenario_supply");
  assert.equal(state.status, "running");
  assert.equal(state.riskLevel, "high");
  assert.ok(typeof state.startedAt === "number");
});

test("pauseTypeCExecution changes status only", () => {
  const running = startTypeCExecution({ scenario, simulation });
  const paused = pauseTypeCExecution(running);
  assert.equal(paused.status, "paused");
  assert.equal(paused.scenarioId, running.scenarioId);
  assert.equal(paused.startedAt, running.startedAt);
  assert.deepEqual(paused.monitoredSignals, running.monitoredSignals);
});

test("stopTypeCExecution resets state", () => {
  const stopped = stopTypeCExecution();
  assert.equal(stopped.status, "stopped");
  assert.equal(stopped.scenarioId, "");
  assert.equal(stopped.startedAt, null);
  assert.deepEqual(stopped.monitoredSignals, []);
});

test("buildTypeCMonitoringSignals derives signals from propagation", () => {
  const signals = buildTypeCMonitoringSignals(simulation);
  assert.ok(signals.includes("Supplier delay risk"));
  assert.ok(signals.includes("Inventory instability"));
  assert.ok(signals.includes("Delivery instability"));
});

test("startTypeCExecution does not mutate scenario or simulation", () => {
  const before = JSON.stringify({ scenario, simulation });
  startTypeCExecution({ scenario, simulation });
  assert.equal(JSON.stringify({ scenario, simulation }), before);
});

test("repeated start produces valid state", () => {
  const first = startTypeCExecution({ scenario, simulation });
  const second = startTypeCExecution({ scenario, simulation });
  assert.equal(first.scenarioId, second.scenarioId);
  assert.equal(second.status, "running");
  assert.deepEqual(first.monitoredSignals, second.monitoredSignals);
});
