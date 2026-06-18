import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioRecommendationEngine,
  buildScenarioRecommendationRegistry,
  getScenarioRecommendationRegistry,
  resetScenarioRecommendationEngineForTests,
} from "./ScenarioRecommendationEngine.ts";
import { resetExecutiveScenarioSummaryForTests } from "./ExecutiveScenarioSummary.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import { resetObjectImpactSimulationEngineForTests } from "./ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "./RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "./KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "./RiskImpactSimulationEngine.ts";
import { resetScenarioComparisonFoundationForTests } from "./ScenarioComparisonFoundation.ts";
import {
  SCENARIO_RECOMMENDATION_DIAGNOSTIC,
  SCENARIO_RECOMMENDATION_READY_DIAGNOSTIC,
} from "./scenarioRecommendationContract.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";
import { resetRelationshipRiskEngineForTests } from "../risk-intelligence/RelationshipRiskEngine.ts";
import { resetKpiRiskEngineForTests } from "../risk-intelligence/KpiRiskEngine.ts";
import { resetRiskPropagationEngineForTests } from "../risk-intelligence/RiskPropagationEngine.ts";
import { resetExecutiveRiskSummaryForTests } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetObjectHealthEngineForTests } from "../object-intelligence/ObjectHealthEngine.ts";
import { resetObjectImportanceEngineForTests } from "../object-intelligence/ObjectImportanceEngine.ts";
import { resetObjectTrendEngineForTests } from "../object-intelligence/ObjectTrendEngine.ts";
import { resetDependencyIntelligenceEngineForTests } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resetRelationshipInfluenceEngineForTests } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { resetRelationshipRiskExposureEngineForTests } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";

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
  resetScenarioRecommendationEngineForTests();
  resetScenarioComparisonFoundationForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioBuilderEngineForTests();
  resetScenarioGenerationRuntimeForTests();
  resetObjectImpactSimulationEngineForTests();
  resetRelationshipImpactSimulationEngineForTests();
  resetKpiImpactSimulationEngineForTests();
  resetRiskImpactSimulationEngineForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetObjectHealthEngineForTests();
  resetObjectImportanceEngineForTests();
  resetObjectTrendEngineForTests();
  resetDependencyIntelligenceEngineForTests();
  resetRelationshipInfluenceEngineForTests();
  resetRelationshipRiskExposureEngineForTests();
});

test("builds recommendation profile from scenario results with reasons and confidence", () => {
  const registry = buildScenarioRecommendationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.recommendationReady, true);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.diagnostics.includes(SCENARIO_RECOMMENDATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(SCENARIO_RECOMMENDATION_READY_DIAGNOSTIC), true);

  const { profile } = registry;
  assert.equal(profile.recommendationReady, true);
  assert.equal(profile.readOnly, true);
  assert.equal(profile.scenarioResultCount, 4);
  assert.ok(profile.recommendedScenarioId.length > 0);
  assert.ok(["baseline", "alternative", "risk", "opportunity"].includes(profile.recommendedScenarioType));
  assert.notEqual(profile.recommendedScenarioType, "risk");
  assert.equal(profile.recommendedScenarioResult.scenarioId, profile.recommendedScenarioId);
  assert.ok(profile.confidence > 0);
  assert.ok(["low", "moderate", "high"].includes(profile.confidenceLevel));
  assert.ok(profile.supportingReasons.length > 0);
  assert.ok(profile.supportingReasons.some((reason) => reason.kind === "scenario_result"));
  assert.ok(profile.supportingReasons.some((reason) => reason.kind === "impact_confidence"));
  assert.equal(profile.candidateScores.length, 4);
  assert.equal(profile.candidateScores[0]?.rank, 1);
  assert.equal(profile.candidateScores[0]?.scenarioId, profile.recommendedScenarioId);

  assert.equal(registry.scenarioResults.length, 4);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.supportingReasons), true);
});

test("consumes explicit scenario results without mutating source records", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);
  const scenarioRegistry = buildScenarioRecommendationRegistry({ sceneJson }).scenarioRegistry;
  const scenarioResults = Object.freeze([...scenarioRegistry.results]);

  resetScenarioRecommendationEngineForTests();

  const registry = ScenarioRecommendationEngine.buildScenarioRecommendationRegistry({
    sceneJson,
    scenarioResults,
  });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.profile.scenarioResultCount, 4);
  assert.equal(getScenarioRecommendationRegistry().profile.recommendationId, registry.profile.recommendationId);
});

test("ranks opportunity or alternative ahead of risk scenario", () => {
  const registry = buildScenarioRecommendationRegistry({ sceneJson: SAMPLE_SCENE });
  const riskRank = registry.profile.candidateScores.find(
    (candidate) => candidate.scenarioType === "risk"
  )?.rank;
  const winnerRank = registry.profile.candidateScores[0]?.rank;

  assert.equal(winnerRank, 1);
  assert.ok(riskRank && riskRank > 1);
});

test("includes executive-derived supporting reasons when available", () => {
  const registry = buildScenarioRecommendationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.ok(
    registry.profile.supportingReasons.some(
      (reason) => reason.kind === "composite_impact" || reason.kind === "opportunity_signal"
    )
  );
  assert.ok(registry.executiveScenarioSummary.scenarioCount === 4);
});
