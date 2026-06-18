import test from "node:test";
import assert from "node:assert/strict";

import {
  DashboardIntelligenceAdapter,
  buildDashboardIntelligenceAdapterRegistry,
  getDashboardIntelligenceAdapterRegistry,
  resetDashboardIntelligenceAdapterForTests,
} from "./DashboardIntelligenceAdapter.ts";
import {
  DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  INT2_ADAPTER_COMPLETE_TAG,
} from "./dashboardIntelligenceAdapterContract.ts";
import { resetExecutiveIntelligenceAdapterForTests } from "../intelligence/ExecutiveIntelligenceAdapter.ts";
import { resetExecutiveObjectIntelligenceSummaryForTests } from "../object-intelligence/ExecutiveObjectIntelligenceSummary.ts";
import { resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { resetObjectHealthEngineForTests } from "../object-intelligence/ObjectHealthEngine.ts";
import { resetObjectImpactEngineForTests } from "../object-intelligence/ObjectImpactEngine.ts";
import { resetObjectConfidenceEngineForTests } from "../object-intelligence/ObjectConfidenceEngine.ts";
import { resetObjectTrendEngineForTests } from "../object-intelligence/ObjectTrendEngine.ts";
import { resetObjectImportanceEngineForTests } from "../object-intelligence/ObjectImportanceEngine.ts";
import { resetExecutiveRelationshipSummaryForTests } from "../relationship-intelligence/ExecutiveRelationshipSummary.ts";
import { resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { resetRelationshipStrengthEngineForTests } from "../relationship-intelligence/RelationshipStrengthEngine.ts";
import { resetDependencyIntelligenceEngineForTests } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resetRelationshipInfluenceEngineForTests } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { resetRelationshipRiskExposureEngineForTests } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";
import { resetExecutiveKpiSummaryForTests } from "../kpi-intelligence/ExecutiveKpiSummary.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetKpiDiscoveryEngineForTests } from "../kpi-intelligence/KpiDiscoveryEngine.ts";
import { resetKpiHealthEngineForTests } from "../kpi-intelligence/KpiHealthEngine.ts";
import { resetKpiTrendEngineForTests } from "../kpi-intelligence/KpiTrendEngine.ts";
import { resetKpiDependencyEngineForTests } from "../kpi-intelligence/KpiDependencyEngine.ts";
import { resetKpiImpactEngineForTests } from "../kpi-intelligence/KpiImpactEngine.ts";
import { resetExecutiveRiskSummaryForTests } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";
import { resetRelationshipRiskEngineForTests } from "../risk-intelligence/RelationshipRiskEngine.ts";
import { resetKpiRiskEngineForTests } from "../risk-intelligence/KpiRiskEngine.ts";
import { resetRiskPropagationEngineForTests } from "../risk-intelligence/RiskPropagationEngine.ts";
import { resetExecutiveScenarioSummaryForTests } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import { resetScenarioGenerationRuntimeForTests } from "../scenario-intelligence/ScenarioGenerationRuntime.ts";
import { resetScenarioBuilderEngineForTests } from "../scenario-intelligence/ScenarioBuilderEngine.ts";
import { resetObjectImpactSimulationEngineForTests } from "../scenario-intelligence/ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "../scenario-intelligence/RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "../scenario-intelligence/KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "../scenario-intelligence/RiskImpactSimulationEngine.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      {
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        active: false,
        sourceConfidence: 15,
      },
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        activityLevel: 55,
      },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        status: "healthy",
        confidence: 75,
        metadata: { supplyRisk: 85, dependency: 88 },
      },
    ],
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100, direction: "up" },
    ],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetDashboardIntelligenceAdapterForTests();
  resetExecutiveIntelligenceAdapterForTests();
  resetExecutiveObjectIntelligenceSummaryForTests();
  resetObjectIntelligenceRuntimeForTests();
  resetObjectHealthEngineForTests();
  resetObjectImpactEngineForTests();
  resetObjectConfidenceEngineForTests();
  resetObjectTrendEngineForTests();
  resetObjectImportanceEngineForTests();
  resetExecutiveRelationshipSummaryForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetRelationshipStrengthEngineForTests();
  resetDependencyIntelligenceEngineForTests();
  resetRelationshipInfluenceEngineForTests();
  resetRelationshipRiskExposureEngineForTests();
  resetExecutiveKpiSummaryForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetKpiDiscoveryEngineForTests();
  resetKpiHealthEngineForTests();
  resetKpiTrendEngineForTests();
  resetKpiDependencyEngineForTests();
  resetKpiImpactEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioGenerationRuntimeForTests();
  resetScenarioBuilderEngineForTests();
  resetObjectImpactSimulationEngineForTests();
  resetRelationshipImpactSimulationEngineForTests();
  resetKpiImpactSimulationEngineForTests();
  resetRiskImpactSimulationEngineForTests();
});

test("exports INT-2 adapter completion tag", () => {
  assert.equal(INT2_ADAPTER_COMPLETE_TAG, "[INT2_ADAPTER_COMPLETE]");
  assert.equal(DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC, "[DASHBOARD_INTELLIGENCE_ADAPTER]");
  assert.equal(DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC, "[DASHBOARD_INTELLIGENCE_ADAPTER_READY]");
});

test("builds read-only dashboard intelligence adapter from executive snapshot", () => {
  const registry = buildDashboardIntelligenceAdapterRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.topologyMutation, false);
  assert.equal(registry.legacyRouterUsage, false);
  assert.equal(registry.diagnostics.includes(DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC), true);

  assert.equal(registry.layerCount, 5);
  assert.equal(registry.layers.length, 5);
  assert.ok(registry.snapshot.readOnly);
  assert.ok(registry.objectIntelligence.objectCount > 0);
  assert.ok(registry.relationshipIntelligence.relationshipCount > 0);
  assert.ok(registry.kpiIntelligence.kpiCount > 0);
  assert.ok(registry.riskIntelligence.topRisks.length > 0);
  assert.equal(registry.scenarioIntelligence.scenarioCount, 4);

  assert.equal(registry.layers[0]?.layer, "object");
  assert.equal(registry.layers[1]?.layer, "relationship");
  assert.equal(registry.layers[2]?.layer, "kpi");
  assert.equal(registry.layers[3]?.layer, "risk");
  assert.equal(registry.layers[4]?.layer, "scenario");
  assert.equal(registry.layers.every((layer) => layer.adapterReady === true), true);

  assert.ok(registry.adapterSummary.includes("Dashboard intelligence adapter ready"));
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.snapshot), true);
});

test("consumes executive snapshot without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const registry = DashboardIntelligenceAdapter.buildDashboardIntelligenceAdapterRegistry({
    sceneJson,
  });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.snapshot.sceneMutation, false);
  assert.equal(getDashboardIntelligenceAdapterRegistry().layerCount, 5);
});
