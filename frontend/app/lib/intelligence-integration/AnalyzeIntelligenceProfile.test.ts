import test from "node:test";
import assert from "node:assert/strict";

import {
  AnalyzeIntelligenceProfileRuntime,
  buildAnalyzeIntelligenceProfile,
  getAnalyzeIntelligenceProfile,
  resetAnalyzeIntelligenceProfileForTests,
} from "./AnalyzeIntelligenceProfile.ts";
import { resetExecutiveIntelligenceAdapterForTests } from "./ExecutiveIntelligenceAdapter.ts";
import { ANALYZE_CONTRACT_DIAGNOSTIC } from "./analyzeIntelligenceProfileContract.ts";
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
  resetAnalyzeIntelligenceProfileForTests();
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

test("builds canonical analyze intelligence profile with required exposures", () => {
  const profile = buildAnalyzeIntelligenceProfile({ sceneJson: SAMPLE_SCENE });

  assert.equal(profile.readOnly, true);
  assert.equal(profile.sceneMutation, false);
  assert.equal(profile.objectMutation, false);
  assert.equal(profile.routingMutation, false);
  assert.equal(profile.mrpMutation, false);
  assert.equal(profile.simulationActive, false);
  assert.equal(profile.uiRendering, false);
  assert.equal(profile.diagnostics.includes(ANALYZE_CONTRACT_DIAGNOSTIC), true);

  assert.equal(profile.health.contractReady, true);
  assert.equal(profile.impact.contractReady, true);
  assert.equal(profile.trend.contractReady, true);
  assert.equal(profile.importance.contractReady, true);
  assert.equal(profile.risk.contractReady, true);
  assert.equal(profile.scenarioSummary.contractReady, true);
  assert.equal(profile.confidence.contractReady, true);

  assert.ok(profile.health.score >= 0);
  assert.ok(profile.impact.score >= 0);
  assert.ok(profile.importance.score >= 0);
  assert.ok(profile.risk.score >= 0);
  assert.ok(profile.risk.topRisks.length > 0);
  assert.equal(profile.scenarioSummary.scenarioCount, 4);
  assert.ok(profile.scenarioSummary.recommendedScenarioId.length > 0);
  assert.ok(profile.analyzeSummary.includes("Analyze intelligence profile ready"));
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.health), true);
  assert.equal(Object.isFrozen(profile.scenarioSummary), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const profile = AnalyzeIntelligenceProfileRuntime.buildAnalyzeIntelligenceProfile({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.ok(profile.health.score >= 0);
  assert.equal(getAnalyzeIntelligenceProfile().profileId, profile.profileId);
});

test("maps adapter intelligence into analyze trend and scenario summary sections", () => {
  const profile = buildAnalyzeIntelligenceProfile({ sceneJson: SAMPLE_SCENE });

  assert.ok(profile.trend.summary.includes("Object trend posture"));
  assert.ok(profile.scenarioSummary.summary.includes("scenario"));
  assert.equal(profile.scenarioSummary.comparisonPairCount, 1);
  assert.ok(profile.scenarioSummary.confidence > 0);
  assert.ok(profile.confidence.score >= 0);
});
