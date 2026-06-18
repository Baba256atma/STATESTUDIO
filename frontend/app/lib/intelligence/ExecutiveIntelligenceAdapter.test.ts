import test from "node:test";
import assert from "node:assert/strict";

import {
  ExecutiveIntelligenceAdapter,
  buildExecutiveIntelligenceSnapshot,
  getExecutiveIntelligenceSnapshot,
  resetExecutiveIntelligenceAdapterForTests,
} from "./ExecutiveIntelligenceAdapter.ts";
import {
  EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  INT1_ADAPTER_COMPLETE_TAG,
} from "./executiveIntelligenceSnapshotContract.ts";
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
        relationships: [{ status: "broken", confidence: 20 }],
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

test("exports INT-1 adapter completion tag", () => {
  assert.equal(INT1_ADAPTER_COMPLETE_TAG, "[INT1_ADAPTER_COMPLETE]");
  assert.equal(EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC, "[EXEC_INTELLIGENCE_ADAPTER]");
  assert.equal(EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC, "[EXEC_INTELLIGENCE_ADAPTER_READY]");
});

test("builds read-only executive intelligence snapshot across DS-3 through DS-7", () => {
  const snapshot = buildExecutiveIntelligenceSnapshot({ sceneJson: SAMPLE_SCENE });

  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.sceneMutation, false);
  assert.equal(snapshot.objectMutation, false);
  assert.equal(snapshot.routingMutation, false);
  assert.equal(snapshot.mrpMutation, false);
  assert.equal(snapshot.legacyRouterUsage, false);
  assert.equal(snapshot.diagnostics.includes(EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTIC), true);
  assert.equal(snapshot.diagnostics.includes(EXEC_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC), true);

  assert.ok(snapshot.objectIntelligence.objectCount > 0);
  assert.ok(snapshot.relationshipIntelligence.relationshipCount > 0);
  assert.ok(snapshot.kpiIntelligence.kpiCount > 0);
  assert.ok(snapshot.riskIntelligence.topRisks.length > 0);
  assert.equal(snapshot.scenarioIntelligence.scenarioCount, 4);

  assert.equal(Object.isFrozen(snapshot), true);
});

test("consumes DS-3 object intelligence without mutation", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const snapshot = ExecutiveIntelligenceAdapter.buildExecutiveIntelligenceSnapshot({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(snapshot.objectIntelligence.sceneMutation, false);
  assert.equal(getExecutiveIntelligenceSnapshot().objectIntelligence.objectCount, snapshot.objectIntelligence.objectCount);
});

test("consumes DS-4 relationship intelligence", () => {
  const snapshot = buildExecutiveIntelligenceSnapshot({ sceneJson: SAMPLE_SCENE });
  assert.ok(snapshot.relationshipIntelligence.diagnostics.length > 0);
  assert.equal(snapshot.relationshipIntelligence.sceneMutation, false);
});

test("consumes DS-5 KPI intelligence", () => {
  const snapshot = buildExecutiveIntelligenceSnapshot({ sceneJson: SAMPLE_SCENE });
  assert.ok(snapshot.kpiIntelligence.diagnostics.length > 0);
  assert.equal(snapshot.kpiIntelligence.sceneMutation, false);
});

test("consumes DS-6 risk intelligence", () => {
  const snapshot = buildExecutiveIntelligenceSnapshot({ sceneJson: SAMPLE_SCENE });
  assert.ok(snapshot.riskIntelligence.diagnostics.length > 0);
  assert.equal(snapshot.riskIntelligence.sceneMutation, false);
});

test("consumes DS-7 scenario intelligence", () => {
  const snapshot = buildExecutiveIntelligenceSnapshot({ sceneJson: SAMPLE_SCENE });
  assert.ok(snapshot.scenarioIntelligence.diagnostics.length > 0);
  assert.equal(snapshot.scenarioIntelligence.sceneMutation, false);
});
