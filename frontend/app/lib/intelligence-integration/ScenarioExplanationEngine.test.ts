import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioExplanationEngine,
  buildScenarioExplanationRegistry,
  resetScenarioExplanationEngineForTests,
} from "./ScenarioExplanationEngine.ts";
import {
  INT3_SCENARIO_EXPLANATION_COMPLETE_TAG,
  SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC,
  SCENARIO_EXPLANATION_READY_DIAGNOSTIC,
} from "./scenarioExplanationEngineContract.ts";
import { resetExecutiveScenarioSummaryForTests } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import { resetScenarioComparisonFoundationForTests } from "../scenario-intelligence/ScenarioComparisonFoundation.ts";
import { resetScenarioRecommendationEngineForTests } from "../scenario-intelligence/ScenarioRecommendationEngine.ts";
import { resetScenarioBuilderEngineForTests } from "../scenario-intelligence/ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "../scenario-intelligence/ScenarioGenerationRuntime.ts";
import { resetObjectImpactSimulationEngineForTests } from "../scenario-intelligence/ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "../scenario-intelligence/RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "../scenario-intelligence/KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "../scenario-intelligence/RiskImpactSimulationEngine.ts";
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
  resetScenarioExplanationEngineForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioComparisonFoundationForTests();
  resetScenarioRecommendationEngineForTests();
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

test("exports INT-3 scenario explanation completion tag", () => {
  assert.equal(INT3_SCENARIO_EXPLANATION_COMPLETE_TAG, "[INT3_SCENARIO_EXPLANATION_COMPLETE]");
  assert.equal(SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC, "[SCENARIO_EXPLANATION_ENGINE]");
  assert.equal(SCENARIO_EXPLANATION_READY_DIAGNOSTIC, "[SCENARIO_EXPLANATION_READY]");
});

test("generates template-driven executive scenario explanations", () => {
  const registry = buildScenarioExplanationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.explanationReady, true);
  assert.ok(registry.explanationCount > 0);
  assert.ok(registry.explanations.length > 0);

  const baseline = registry.explanations.find(
    (entry) => entry.scenarioId === "scenario:baseline"
  );
  assert.ok(baseline);

  for (const explanation of registry.explanations) {
    assert.ok(explanation.summaryExplanation.length > 0);
    assert.ok(explanation.confidenceExplanation.length > 0);
    assert.ok(explanation.scenarioStrengths.length > 0);
    assert.ok(explanation.scenarioWeaknesses.length > 0);
    assert.ok(explanation.scenarioRecommendations.length > 0);
    assert.ok(explanation.executiveSummary.length > 0);
  }

  assert.ok(registry.explanations.some((entry) => entry.comparisonExplanation));
  assert.ok(registry.explanations.some((entry) => entry.recommendationExplanation));

  assert.equal(registry.diagnostics.includes(SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(SCENARIO_EXPLANATION_READY_DIAGNOSTIC), true);
});

test("consumes scenario intelligence without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  ScenarioExplanationEngine.buildScenarioExplanationRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});
