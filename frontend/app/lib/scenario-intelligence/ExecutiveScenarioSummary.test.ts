import test from "node:test";
import assert from "node:assert/strict";

import {
  ExecutiveScenarioSummaryEngine,
  buildExecutiveScenarioSummary,
  getExecutiveScenarioSummary,
  resetExecutiveScenarioSummaryForTests,
} from "./ExecutiveScenarioSummary.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import { resetObjectImpactSimulationEngineForTests } from "./ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "./RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "./KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "./RiskImpactSimulationEngine.ts";
import {
  EXEC_SCENARIO_READY_DIAGNOSTIC,
  EXEC_SCENARIO_SUMMARY_DIAGNOSTIC,
} from "./executiveScenarioSummaryContract.ts";
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

test("builds executive scenario summary with aggregated impacts and SWOT", () => {
  const summary = buildExecutiveScenarioSummary({ sceneJson: SAMPLE_SCENE });

  assert.equal(summary.scenarioCount, 4);
  assert.equal(summary.readOnly, true);
  assert.equal(summary.sceneMutation, false);
  assert.equal(summary.simulationActive, false);
  assert.equal(summary.diagnostics.includes(EXEC_SCENARIO_SUMMARY_DIAGNOSTIC), true);
  assert.equal(summary.diagnostics.includes(EXEC_SCENARIO_READY_DIAGNOSTIC), true);

  const baseline = summary.summaryByScenarioId["scenario:baseline"];
  assert.ok(baseline);
  assert.ok(baseline.impactAggregation.objectImpactCount > 0);
  assert.ok(baseline.impactAggregation.relationshipImpactCount > 0);
  assert.ok(baseline.impactAggregation.kpiImpactCount > 0);
  assert.ok(baseline.impactAggregation.riskImpactCount > 0);
  assert.ok(baseline.strengths.length > 0);
  assert.ok(baseline.recommendedActions.length > 0);

  const risk = summary.summaryByScenarioId["scenario:risk"];
  assert.ok(risk);
  assert.ok(risk.threats.length > 0);
  assert.ok(risk.weaknesses.length > 0);

  const opportunity = summary.summaryByScenarioId["scenario:opportunity"];
  assert.ok(opportunity);
  assert.ok(opportunity.opportunities.length > 0);

  assert.ok(summary.executiveSummary.includes("4 scenario"));
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(summary.summaries), true);
  assert.equal(Object.isFrozen(summary.summaries[0]), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const summary = ExecutiveScenarioSummaryEngine.buildExecutiveScenarioSummary({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(summary.scenarioCount, 4);
  assert.equal(getExecutiveScenarioSummary().scenarioCount, 4);
});

test("generates recommended actions from threat and opportunity signals", () => {
  const summary = buildExecutiveScenarioSummary({ sceneJson: SAMPLE_SCENE });
  const risk = summary.summaryByScenarioId["scenario:risk"];

  assert.ok(risk);
  assert.ok(risk.recommendedActions.some((action) => action.priority === "immediate" || action.priority === "prioritize"));
  assert.equal(risk.recommendedActions.every((action) => action.actionId.length > 0), true);
});
