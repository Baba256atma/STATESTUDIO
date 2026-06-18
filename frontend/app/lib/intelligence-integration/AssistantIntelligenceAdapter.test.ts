import test from "node:test";
import assert from "node:assert/strict";

import {
  AssistantIntelligenceAdapter,
  buildAssistantIntelligenceAdapterRegistry,
  getAssistantIntelligenceAdapterRegistry,
  resetAssistantIntelligenceAdapterForTests,
} from "./AssistantIntelligenceAdapter.ts";
import {
  ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  INT3_ADAPTER_COMPLETE_TAG,
} from "./assistantIntelligenceAdapterContract.ts";
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
import { resetScenarioComparisonFoundationForTests } from "../scenario-intelligence/ScenarioComparisonFoundation.ts";
import { resetScenarioRecommendationEngineForTests } from "../scenario-intelligence/ScenarioRecommendationEngine.ts";
import { resetObjectExplanationEngineForTests } from "./ObjectExplanationEngine.ts";
import { resetRelationshipExplanationEngineForTests } from "./RelationshipExplanationEngine.ts";
import { resetKpiExplanationEngineForTests } from "./KpiExplanationEngine.ts";
import { resetRiskExplanationEngineForTests } from "./RiskExplanationEngine.ts";
import { resetScenarioExplanationEngineForTests } from "./ScenarioExplanationEngine.ts";

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
        metadata: { supplyRisk: 85, dependency: 88, strength: 0.9, redundancy: 6 },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "rel-dependency",
        sourceId: "inventory-1",
        targetId: "production-1",
        type: "dependency",
        direction: "uni",
        metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ],
    kpis: [
      {
        id: "schedule",
        label: "Schedule",
        objectId: "production-1",
        value: 42,
        target: 60,
        category: "Schedule",
        confidence: 55,
      },
    ],
    kpiSnapshots: [
      { kpiId: "schedule", value: 58, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "schedule", value: 50, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "schedule", value: 42, capturedAt: "2026-03-01T00:00:00.000Z" },
    ],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetAssistantIntelligenceAdapterForTests();
  resetObjectExplanationEngineForTests();
  resetRelationshipExplanationEngineForTests();
  resetKpiExplanationEngineForTests();
  resetRiskExplanationEngineForTests();
  resetScenarioExplanationEngineForTests();
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
  resetScenarioComparisonFoundationForTests();
  resetScenarioRecommendationEngineForTests();
});

test("exports INT-3 adapter completion tag", () => {
  assert.equal(INT3_ADAPTER_COMPLETE_TAG, "[INT3_ADAPTER_COMPLETE]");
  assert.equal(ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC, "[ASSISTANT_INTELLIGENCE_ADAPTER]");
  assert.equal(
    ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
    "[ASSISTANT_INTELLIGENCE_ADAPTER_READY]"
  );
});

test("builds read-only assistant intelligence snapshot with explanation registries", () => {
  const registry = buildAssistantIntelligenceAdapterRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.topologyMutation, false);
  assert.equal(registry.legacyRouterUsage, false);
  assert.equal(registry.diagnostics.includes(ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC), true);

  assert.ok(registry.snapshot.readOnly);
  assert.ok(registry.objectExplanations.explanationCount > 0);
  assert.ok(registry.relationshipExplanations.explanationCount > 0);
  assert.ok(registry.kpiExplanations.explanationCount > 0);
  assert.ok(registry.riskExplanations.explanationCount > 0);
  assert.ok(registry.scenarioExplanations.explanationCount > 0);
  assert.ok(registry.explanationCount > 0);
  assert.ok(registry.executiveSummary.includes("Assistant intelligence adapter ready"));
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.snapshot), true);
});

test("consumes executive snapshot without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  AssistantIntelligenceAdapter.buildAssistantIntelligenceAdapterRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(getAssistantIntelligenceAdapterRegistry().explanationCount > 0, true);
});
