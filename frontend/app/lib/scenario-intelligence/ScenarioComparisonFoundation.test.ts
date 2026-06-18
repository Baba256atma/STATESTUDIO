import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioComparisonFoundation,
  buildScenarioComparisonFoundationRegistry,
  getScenarioComparisonFoundationRegistry,
  resetScenarioComparisonFoundationForTests,
} from "./ScenarioComparisonFoundation.ts";
import { resetExecutiveScenarioSummaryForTests } from "./ExecutiveScenarioSummary.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import { resetObjectImpactSimulationEngineForTests } from "./ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "./RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "./KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "./RiskImpactSimulationEngine.ts";
import {
  SCENARIO_COMPARISON_DIAGNOSTIC,
  SCENARIO_COMPARISON_READY_DIAGNOSTIC,
} from "./scenarioComparisonFoundationContract.ts";
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

test("builds baseline vs alternative comparison with difference profiles", () => {
  const registry = buildScenarioComparisonFoundationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.pairCount, 1);
  assert.equal(registry.foundationOnly, true);
  assert.equal(registry.comparisonActive, false);
  assert.equal(registry.renderingActive, false);
  assert.equal(registry.visualRendering, false);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.diagnostics.includes(SCENARIO_COMPARISON_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(SCENARIO_COMPARISON_READY_DIAGNOSTIC), true);

  const baselineVsAlternative =
    registry.pairById["comparison:scenario:baseline:vs:scenario:alternative"];
  assert.ok(baselineVsAlternative);
  assert.equal(baselineVsAlternative.pairKind, "baseline_vs_alternative");
  assert.equal(baselineVsAlternative.leftScenarioId, "scenario:baseline");
  assert.equal(baselineVsAlternative.rightScenarioId, "scenario:alternative");
  assert.equal(baselineVsAlternative.comparisonReady, true);
  assert.equal(baselineVsAlternative.renderingActive, false);
  assert.ok(baselineVsAlternative.differenceCount > 0);
  assert.equal(registry.differenceCount, baselineVsAlternative.differenceCount);

  const compositeDiff = baselineVsAlternative.differenceProfiles.find(
    (profile) => profile.subjectId === "composite-impact"
  );
  assert.ok(compositeDiff);
  assert.equal(compositeDiff.dimension, "composite");
  assert.equal(compositeDiff.comparisonReady, true);
  assert.ok(["up", "down", "neutral"].includes(compositeDiff.direction));

  assert.ok(registry.executiveScenarioSummary.scenarioCount === 4);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.pairs), true);
  assert.equal(Object.isFrozen(registry.pairs[0]), true);
  assert.equal(Object.isFrozen(registry.differenceProfiles), true);
});

test("supports custom scenario A vs scenario B comparison pairs", () => {
  const registry = buildScenarioComparisonFoundationRegistry({
    sceneJson: SAMPLE_SCENE,
    comparisonPairs: Object.freeze([
      Object.freeze({
        pairKind: "scenario_a_vs_b" as const,
        leftScenarioId: "scenario:risk",
        rightScenarioId: "scenario:opportunity",
      }),
    ]),
  });

  assert.equal(registry.pairCount, 1);
  const pair = registry.pairById["comparison:scenario:risk:vs:scenario:opportunity"];
  assert.ok(pair);
  assert.equal(pair.pairKind, "scenario_a_vs_b");
  assert.equal(pair.leftScenarioType, "risk");
  assert.equal(pair.rightScenarioType, "opportunity");
  assert.ok(pair.differenceProfiles.some((profile) => profile.dimension === "swot"));
  assert.ok(pair.differenceProfiles.some((profile) => profile.dimension === "object"));
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  const registry = ScenarioComparisonFoundation.buildScenarioComparisonFoundationRegistry({
    sceneJson,
  });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.pairCount, 1);
  assert.equal(getScenarioComparisonFoundationRegistry().pairCount, 1);
});

test("indexes difference profiles by id for comparison-ready lookup", () => {
  const registry = buildScenarioComparisonFoundationRegistry({ sceneJson: SAMPLE_SCENE });
  const pair = registry.pairs[0];

  assert.ok(pair);
  for (const profile of pair.differenceProfiles) {
    assert.equal(registry.differenceById[profile.differenceId], profile);
    assert.equal(profile.leftScenarioId, pair.leftScenarioId);
    assert.equal(profile.rightScenarioId, pair.rightScenarioId);
  }
});
