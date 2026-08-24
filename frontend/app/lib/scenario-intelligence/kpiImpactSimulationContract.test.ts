import test from "node:test";
import assert from "node:assert/strict";

import {
  EMPTY_KPI_IMPACT_PROFILE_REGISTRY,
  KPI_IMPACT_READY_DIAGNOSTIC,
  KPI_IMPACT_SIMULATION_DIAGNOSTIC,
  KPI_IMPACT_SIMULATION_DIAGNOSTICS,
  KPI_IMPACT_SIMULATION_ENGINE_VERSION,
} from "./kpiImpactSimulationContract.ts";
import {
  getKpiImpactProfileRegistry,
  resetKpiImpactSimulationEngineForTests,
} from "./KpiImpactSimulationEngine.ts";

test("KPI impact contract exports a frozen empty registry", () => {
  resetKpiImpactSimulationEngineForTests();
  assert.equal(KPI_IMPACT_SIMULATION_ENGINE_VERSION, "7.5.0");
  assert.equal(getKpiImpactProfileRegistry(), EMPTY_KPI_IMPACT_PROFILE_REGISTRY);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.profileCount, 0);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.kpiCount, 0);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.scenarioCount, 0);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.profiles.length, 0);
  assert.deepEqual(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.profileById, {});
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.readOnly, true);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.sceneMutation, false);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.simulationActive, false);
  assert.equal(Object.isFrozen(EMPTY_KPI_IMPACT_PROFILE_REGISTRY), true);
  assert.equal(Object.isFrozen(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.profiles), true);
  assert.equal(Object.isFrozen(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.profileById), true);
  assert.deepEqual(
    [...KPI_IMPACT_SIMULATION_DIAGNOSTICS],
    [KPI_IMPACT_SIMULATION_DIAGNOSTIC, KPI_IMPACT_READY_DIAGNOSTIC],
  );
});

test("empty KPI impact registry is deterministic and not mutated", () => {
  const first = EMPTY_KPI_IMPACT_PROFILE_REGISTRY;
  const second = EMPTY_KPI_IMPACT_PROFILE_REGISTRY;
  assert.equal(first, second);
  assert.throws(() => {
    (first as { profileCount: number }).profileCount = 9;
  }, TypeError);
  assert.equal(EMPTY_KPI_IMPACT_PROFILE_REGISTRY.profileCount, 0);
});
