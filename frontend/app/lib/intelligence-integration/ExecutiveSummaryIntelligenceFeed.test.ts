import test from "node:test";
import assert from "node:assert/strict";

import {
  ExecutiveSummaryIntelligenceFeed,
  buildExecutiveSummaryIntelligenceFeed,
  resetExecutiveSummaryIntelligenceFeedForTests,
} from "./ExecutiveSummaryIntelligenceFeed.ts";
import {
  EXEC_SUMMARY_FEED_DIAGNOSTIC,
  EXEC_SUMMARY_FEED_READY_DIAGNOSTIC,
  INT2_EXEC_SUMMARY_COMPLETE_TAG,
} from "./executiveSummaryIntelligenceFeedContract.ts";
import { attachExecutiveSummaryIntelligenceFeed } from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { resetDashboardIntelligenceAdapterForTests } from "./DashboardIntelligenceAdapter.ts";
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
  resetExecutiveSummaryIntelligenceFeedForTests();
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

test("exports INT-2 executive summary completion tag", () => {
  assert.equal(INT2_EXEC_SUMMARY_COMPLETE_TAG, "[INT2_EXEC_SUMMARY_COMPLETE]");
  assert.equal(EXEC_SUMMARY_FEED_DIAGNOSTIC, "[EXEC_SUMMARY_FEED]");
  assert.equal(EXEC_SUMMARY_FEED_READY_DIAGNOSTIC, "[EXEC_SUMMARY_FEED_READY]");
});

test("builds read-only executive summary intelligence feed", () => {
  const feed = buildExecutiveSummaryIntelligenceFeed({ sceneJson: SAMPLE_SCENE });

  assert.equal(feed.feedStatus, "bound");
  assert.equal(feed.readOnly, true);
  assert.equal(feed.sceneMutation, false);
  assert.equal(feed.objectMutation, false);
  assert.equal(feed.mrpMutation, false);
  assert.equal(feed.routingMutation, false);
  assert.equal(feed.topologyMutation, false);
  assert.equal(feed.legacyRouterUsage, false);
  assert.equal(feed.topHealthSignals.title, "Top Health Signals");
  assert.equal(feed.topRisks.title, "Top Risks");
  assert.equal(feed.topKpiSignals.title, "Top KPI Signals");
  assert.equal(feed.topScenarioSignals.title, "Top Scenario Signals");
  assert.ok(feed.topHealthSignals.primaryValue.length > 0);
  assert.ok(feed.topRisks.primaryValue.length > 0);
  assert.ok(feed.topKpiSignals.primaryValue.length > 0);
  assert.ok(feed.topScenarioSignals.primaryValue.length > 0);
  assert.ok(feed.snapshot.readOnly);
});

test("binds intelligence feed into existing executive summary cards without layout changes", () => {
  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const enriched = attachExecutiveSummaryIntelligenceFeed(baseModel, { sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(enriched.cards.length, 4);
  assert.equal(enriched.surfaceId, baseModel.surfaceId);
  assert.equal(enriched.headline, baseModel.headline);
  assert.equal(enriched.visualBundle, baseModel.visualBundle);

  const healthCard = enriched.cards.find((card) => card.kind === "system_status");
  const riskCard = enriched.cards.find((card) => card.kind === "active_objects");
  const kpiCard = enriched.cards.find((card) => card.kind === "active_signals");
  const scenarioCard = enriched.cards.find((card) => card.kind === "executive_attention");

  assert.equal(healthCard?.title, "Top Health Signals");
  assert.equal(riskCard?.title, "Top Risks");
  assert.equal(kpiCard?.title, "Top KPI Signals");
  assert.equal(scenarioCard?.title, "Top Scenario Signals");
  assert.notEqual(healthCard?.primaryValue, baseModel.cards.find((card) => card.kind === "system_status")?.primaryValue);
});

test("consumes executive snapshot without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  ExecutiveSummaryIntelligenceFeed.buildExecutiveSummaryIntelligenceFeed({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});
