import test from "node:test";
import assert from "node:assert/strict";

import {
  RiskImpactSimulationEngine,
  buildRiskImpactProfileRegistry,
  getRiskImpactProfileRegistry,
  resetRiskImpactSimulationEngineForTests,
} from "./RiskImpactSimulationEngine.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import {
  RISK_IMPACT_READY_DIAGNOSTIC,
  RISK_IMPACT_SIMULATION_DIAGNOSTIC,
} from "./riskImpactSimulationContract.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";
import { resetRelationshipRiskEngineForTests } from "../risk-intelligence/RelationshipRiskEngine.ts";
import { resetKpiRiskEngineForTests } from "../risk-intelligence/KpiRiskEngine.ts";
import { resetRiskPropagationEngineForTests } from "../risk-intelligence/RiskPropagationEngine.ts";
import { resetExecutiveRiskSummaryForTests } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../risk-intelligence/RiskIntelligenceRuntime.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      {
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        active: false,
        sourceConfidence: 15,
        relationships: [{ status: "broken", confidence: 20 }],
      },
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        activityLevel: 55,
      },
      {
        id: "production-1",
        label: "Production",
        type: "production",
        role: "executive",
        importance: 90,
        active: false,
        sourceConfidence: 20,
      },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        direction: "uni",
        metadata: { supplyRisk: 85, dependency: 88, strength: 0.9 },
      },
      {
        id: "rel-dependency",
        sourceId: "inventory-1",
        targetId: "production-1",
        type: "dependency",
        direction: "uni",
        metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
      },
    ],
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100, direction: "up" },
    ],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetRiskImpactSimulationEngineForTests();
  resetScenarioBuilderEngineForTests();
  resetScenarioGenerationRuntimeForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetRiskIntelligenceRuntimeForTests();
});

test("builds immutable risk impact profiles from risk intelligence", () => {
  const registry = buildRiskImpactProfileRegistry({ sceneJson: SAMPLE_SCENE });

  assert.ok(registry.scenarioCount === 4);
  assert.ok(registry.subjectCount > 0);
  assert.ok(registry.profileCount > registry.scenarioCount);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.diagnostics.includes(RISK_IMPACT_SIMULATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RISK_IMPACT_READY_DIAGNOSTIC), true);

  const propagationBaseline = registry.profilesByScenarioId["scenario:baseline"]?.find(
    (profile) => profile.subjectKind === "propagation"
  );
  assert.ok(propagationBaseline);
  assert.equal(propagationBaseline.impactResult.netRiskDelta, 0);
  assert.equal(propagationBaseline.impactResult.riskIncrease.increaseDetected, false);
  assert.equal(propagationBaseline.impactResult.riskDecrease.decreaseDetected, false);

  const propagationRisk = registry.profilesByScenarioId["scenario:risk"]?.find(
    (profile) => profile.subjectKind === "propagation"
  );
  assert.ok(propagationRisk);
  assert.equal(propagationRisk.impactResult.riskIncrease.increaseDetected, true);
  assert.ok(propagationRisk.impactResult.riskPropagation.propagationDelta > 0);

  const objectRisk = registry.profiles.find(
    (profile) =>
      profile.scenarioId === "scenario:risk" &&
      profile.subjectKind === "object" &&
      profile.subjectId === "supplier-1"
  );
  assert.ok(objectRisk);
  assert.ok(objectRisk.impactResult.netRiskDelta >= 0);
  assert.equal(objectRisk.impactResult.applied, false);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const registry = RiskImpactSimulationEngine.buildRiskImpactProfileRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.ok(registry.profileCount > 0);
  assert.equal(getRiskImpactProfileRegistry().profileCount, registry.profileCount);
});

test("indexes profiles by subject and scenario with opportunity risk decrease", () => {
  const registry = buildRiskImpactProfileRegistry({ sceneJson: SAMPLE_SCENE });

  const opportunityPropagation = registry.profilesByScenarioId["scenario:opportunity"]?.find(
    (profile) => profile.subjectKind === "propagation"
  );
  assert.ok(opportunityPropagation);
  assert.equal(opportunityPropagation.impactResult.riskDecrease.decreaseDetected, true);
  assert.ok(opportunityPropagation.impactResult.netRiskDelta < 0);
  assert.ok(registry.profilesBySubjectId["business-graph-propagation"]?.length === 4);
});
