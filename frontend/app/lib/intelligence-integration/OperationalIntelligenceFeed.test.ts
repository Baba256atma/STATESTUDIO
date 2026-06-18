import test from "node:test";
import assert from "node:assert/strict";

import {
  OperationalIntelligenceFeed,
  buildOperationalIntelligenceFeed,
  resetOperationalIntelligenceFeedForTests,
} from "./OperationalIntelligenceFeed.ts";
import {
  INT2_OPERATIONAL_FEED_COMPLETE_TAG,
  OPERATIONAL_FEED_DIAGNOSTIC,
  OPERATIONAL_FEED_READY_DIAGNOSTIC,
} from "./operationalIntelligenceFeedContract.ts";
import { attachOperationalIntelligenceFeed } from "../dashboard/operationalIntelligence/operationalIntelligenceFeedBridge.ts";
import { aggregateOperationalIntelligence } from "../dashboard/operationalIntelligence/operationalIntelligenceAggregation.ts";
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
  resetOperationalIntelligenceFeedForTests();
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

test("exports INT-2 operational feed completion tag", () => {
  assert.equal(INT2_OPERATIONAL_FEED_COMPLETE_TAG, "[INT2_OPERATIONAL_FEED_COMPLETE]");
  assert.equal(OPERATIONAL_FEED_DIAGNOSTIC, "[OPERATIONAL_FEED]");
  assert.equal(OPERATIONAL_FEED_READY_DIAGNOSTIC, "[OPERATIONAL_FEED_READY]");
});

test("builds read-only operational intelligence feed", () => {
  const feed = buildOperationalIntelligenceFeed({ sceneJson: SAMPLE_SCENE });

  assert.equal(feed.feedStatus, "bound");
  assert.equal(feed.readOnly, true);
  assert.equal(feed.sceneMutation, false);
  assert.equal(feed.objectHealth.title, "Object Health");
  assert.equal(feed.objectTrend.title, "Object Trend");
  assert.equal(feed.relationshipHealth.title, "Relationship Health");
  assert.equal(feed.relationshipDependency.title, "Relationship Dependency");
  assert.equal(feed.operationalKpiSignals.title, "Operational KPI Signals");
  assert.ok(feed.objectHealth.primaryValue.length > 0);
  assert.ok(feed.operationalKpiSignals.primaryValue.length > 0);
});

test("binds operational feed into existing panel structure", () => {
  const baseModel = aggregateOperationalIntelligence({
    dashboardContext: "sources",
    normalizedContext: null,
  });
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const enriched = attachOperationalIntelligenceFeed(baseModel, { sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(enriched.surfaceId, baseModel.surfaceId);
  assert.equal(enriched.headline, baseModel.headline);
  assert.equal(enriched.intelligenceFeed?.feedStatus, "bound");
  assert.ok(enriched.snapshot.health.level);
  assert.ok(enriched.snapshot.signals.recentSummary.length > 0);
});

test("consumes executive snapshot without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  OperationalIntelligenceFeed.buildOperationalIntelligenceFeed({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});
