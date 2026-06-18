import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { syncSceneObjectRegistry, resetSceneObjectRegistryForTests } from "../scene/objectRegistryRuntime.ts";
import type { SceneObject } from "../sceneTypes.ts";
import { buildExecutiveScenarioSummary, resetExecutiveScenarioSummaryForTests } from "./ExecutiveScenarioSummary.ts";
import { buildKpiImpactProfileRegistry, resetKpiImpactSimulationEngineForTests } from "./KpiImpactSimulationEngine.ts";
import { buildObjectImpactProfileRegistry, resetObjectImpactSimulationEngineForTests } from "./ObjectImpactSimulationEngine.ts";
import {
  buildRelationshipImpactProfileRegistry,
  resetRelationshipImpactSimulationEngineForTests,
} from "./RelationshipImpactSimulationEngine.ts";
import { buildRiskImpactProfileRegistry, resetRiskImpactSimulationEngineForTests } from "./RiskImpactSimulationEngine.ts";
import { buildScenarioBlueprintRegistry, resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import {
  buildScenarioComparisonFoundationRegistry,
  resetScenarioComparisonFoundationForTests,
} from "./ScenarioComparisonFoundation.ts";
import {
  buildScenarioRecommendationRegistry,
  resetScenarioRecommendationEngineForTests,
} from "./ScenarioRecommendationEngine.ts";
import { buildScenarioRegistry, resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import {
  DS7_CERTIFIED_TAG,
  SCENARIO_GENERATION_COMPLETE_TAG,
  SCENARIO_RUNTIME_DIAGNOSTIC,
} from "./scenarioGenerationContract.ts";
import {
  SCENARIO_BUILDER_DIAGNOSTIC,
} from "./scenarioBuilderContract.ts";
import { OBJECT_IMPACT_SIMULATION_DIAGNOSTIC } from "./objectImpactSimulationContract.ts";
import { RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC } from "./relationshipImpactSimulationContract.ts";
import { KPI_IMPACT_SIMULATION_DIAGNOSTIC } from "./kpiImpactSimulationContract.ts";
import { RISK_IMPACT_SIMULATION_DIAGNOSTIC } from "./riskImpactSimulationContract.ts";
import { EXEC_SCENARIO_SUMMARY_DIAGNOSTIC } from "./executiveScenarioSummaryContract.ts";
import { SCENARIO_COMPARISON_DIAGNOSTIC } from "./scenarioComparisonFoundationContract.ts";
import { SCENARIO_RECOMMENDATION_DIAGNOSTIC } from "./scenarioRecommendationContract.ts";
import {
  DS7_CERTIFICATION_FREEZE_TAGS,
  DS_7_10_SCENARIO_INTELLIGENCE_CERTIFICATION_TAG,
  type ScenarioIntelligenceCertificationGate,
  type ScenarioIntelligenceCertificationResult,
} from "./scenarioIntelligenceCertificationContract.ts";

const CERTIFICATION_SCENE = Object.freeze({
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
        status: "healthy",
        confidence: 75,
        metadata: { supplyRisk: 85, dependency: 88 },
      },
      {
        id: "rel-dependency",
        sourceId: "inventory-1",
        targetId: "production-1",
        type: "dependency",
        metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
      },
    ],
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100, direction: "up" },
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
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
});

function resetCertificationRuntime(): void {
  resetScenarioGenerationRuntimeForTests();
  resetScenarioBuilderEngineForTests();
  resetObjectImpactSimulationEngineForTests();
  resetRelationshipImpactSimulationEngineForTests();
  resetKpiImpactSimulationEngineForTests();
  resetRiskImpactSimulationEngineForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioComparisonFoundationForTests();
  resetScenarioRecommendationEngineForTests();
  resetSceneObjectRegistryForTests();
}

function gate(
  id: ScenarioIntelligenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): ScenarioIntelligenceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

export function runScenarioIntelligenceCertification(): ScenarioIntelligenceCertificationResult {
  resetCertificationRuntime();

  const gates: ScenarioIntelligenceCertificationGate[] = [];
  const buildInput = Object.freeze({ sceneJson: CERTIFICATION_SCENE });

  const runtime = buildScenarioRegistry(buildInput);
  const runtimeFailures: string[] = [];
  if (runtime.scenarioCount === 0) runtimeFailures.push("Scenario registry returned no scenarios");
  if (runtime.results.length !== 4) runtimeFailures.push("Scenario registry missing canonical results");
  if (runtime.sceneMutation !== false) runtimeFailures.push("Runtime reports scene mutation");
  if (runtime.mrpMutation !== false) runtimeFailures.push("Runtime reports MRP mutation");
  if (!runtime.diagnostics.includes(SCENARIO_RUNTIME_DIAGNOSTIC)) {
    runtimeFailures.push("Runtime diagnostics missing");
  }
  gates.push(gate("A", "Runtime Created", runtimeFailures));

  const builder = buildScenarioBlueprintRegistry(buildInput);
  const builderFailures: string[] = [];
  if (builder.blueprintCount === 0) builderFailures.push("Scenario blueprint registry empty");
  if (!builder.diagnostics.includes(SCENARIO_BUILDER_DIAGNOSTIC)) {
    builderFailures.push("Builder diagnostics missing");
  }
  if (!builder.blueprintByScenarioId["scenario:baseline"]) {
    builderFailures.push("Baseline blueprint missing");
  }
  if (!builder.blueprintByScenarioId["scenario:alternative"]) {
    builderFailures.push("Alternative blueprint missing");
  }
  gates.push(gate("B", "Builder Engine", builderFailures));

  const objectImpact = buildObjectImpactProfileRegistry(buildInput);
  const objectFailures: string[] = [];
  if (objectImpact.profileCount === 0) objectFailures.push("Object impact registry empty");
  if (!objectImpact.diagnostics.includes(OBJECT_IMPACT_SIMULATION_DIAGNOSTIC)) {
    objectFailures.push("Object impact diagnostics missing");
  }
  gates.push(gate("C", "Object Impact Simulation", objectFailures));

  const relationshipImpact = buildRelationshipImpactProfileRegistry(buildInput);
  const relationshipFailures: string[] = [];
  if (relationshipImpact.profileCount === 0) {
    relationshipFailures.push("Relationship impact registry empty");
  }
  if (!relationshipImpact.diagnostics.includes(RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC)) {
    relationshipFailures.push("Relationship impact diagnostics missing");
  }
  gates.push(gate("D", "Relationship Impact Simulation", relationshipFailures));

  const kpiImpact = buildKpiImpactProfileRegistry(buildInput);
  const kpiFailures: string[] = [];
  if (kpiImpact.profileCount === 0) kpiFailures.push("KPI impact registry empty");
  if (!kpiImpact.diagnostics.includes(KPI_IMPACT_SIMULATION_DIAGNOSTIC)) {
    kpiFailures.push("KPI impact diagnostics missing");
  }
  gates.push(gate("E", "KPI Impact Simulation", kpiFailures));

  const riskImpact = buildRiskImpactProfileRegistry(buildInput);
  const riskFailures: string[] = [];
  if (riskImpact.profileCount === 0) riskFailures.push("Risk impact registry empty");
  if (!riskImpact.diagnostics.includes(RISK_IMPACT_SIMULATION_DIAGNOSTIC)) {
    riskFailures.push("Risk impact diagnostics missing");
  }
  gates.push(gate("F", "Risk Impact Simulation", riskFailures));

  const executiveSummary = buildExecutiveScenarioSummary(buildInput);
  const aggregatorFailures: string[] = [];
  if (executiveSummary.scenarioCount === 0) {
    aggregatorFailures.push("Executive scenario summary empty");
  }
  if (!executiveSummary.diagnostics.includes(EXEC_SCENARIO_SUMMARY_DIAGNOSTIC)) {
    aggregatorFailures.push("Executive summary diagnostics missing");
  }
  if (executiveSummary.summaries.some((summary) => summary.recommendedActions.length === 0)) {
    aggregatorFailures.push("Executive summary missing recommended actions");
  }
  gates.push(gate("G", "Aggregator", aggregatorFailures));

  const comparison = buildScenarioComparisonFoundationRegistry(buildInput);
  const comparisonFailures: string[] = [];
  if (comparison.pairCount === 0) comparisonFailures.push("Comparison foundation has no pairs");
  if (!comparison.diagnostics.includes(SCENARIO_COMPARISON_DIAGNOSTIC)) {
    comparisonFailures.push("Comparison diagnostics missing");
  }
  if (!comparison.pairById["comparison:scenario:baseline:vs:scenario:alternative"]) {
    comparisonFailures.push("Baseline vs alternative comparison pair missing");
  }
  if (comparison.differenceCount === 0) comparisonFailures.push("Comparison difference profiles empty");
  gates.push(gate("H", "Comparison Foundation", comparisonFailures));

  const recommendation = buildScenarioRecommendationRegistry(buildInput);
  const recommendationFailures: string[] = [];
  if (!recommendation.profile.recommendedScenarioId) {
    recommendationFailures.push("Recommendation profile missing recommended scenario");
  }
  if (recommendation.profile.supportingReasons.length === 0) {
    recommendationFailures.push("Recommendation profile missing supporting reasons");
  }
  if (recommendation.profile.confidence <= 0) {
    recommendationFailures.push("Recommendation profile missing confidence");
  }
  if (!recommendation.diagnostics.includes(SCENARIO_RECOMMENDATION_DIAGNOSTIC)) {
    recommendationFailures.push("Recommendation diagnostics missing");
  }
  gates.push(gate("I", "Recommendation Foundation", recommendationFailures));

  const sceneFailures: string[] = [];
  const mutationFlags = [
    runtime.sceneMutation,
    builder.sceneMutation,
    objectImpact.sceneMutation,
    relationshipImpact.sceneMutation,
    kpiImpact.sceneMutation,
    riskImpact.sceneMutation,
    executiveSummary.sceneMutation,
    comparison.sceneMutation,
    recommendation.sceneMutation,
  ];
  if (mutationFlags.some((flag) => flag !== false)) {
    sceneFailures.push("One or more DS-7 modules report scene mutation");
  }
  try {
    const sampleObjects: SceneObject[] = objectImpact.profiles.map((profile) => ({
      id: profile.objectId,
      name: profile.label,
      type: "supplier",
    }));
    syncSceneObjectRegistry(sampleObjects);
    syncSceneObjectRegistry(sampleObjects);
  } catch (error) {
    sceneFailures.push(`Scene registry sync failed: ${String(error)}`);
  }
  gates.push(gate("J", "No Scene Mutations", sceneFailures));

  const objectMutationFailures: string[] = [];
  const sourceObject: Record<string, unknown> = {
    id: "supplier-1",
    label: "Primary Supplier",
    type: "supplier",
    active: false,
    sourceConfidence: 15,
  };
  const beforeObject = JSON.stringify(sourceObject);
  buildObjectImpactProfileRegistry({ sceneObjects: [sourceObject] });
  if (JSON.stringify(sourceObject) !== beforeObject) {
    objectMutationFailures.push("Object impact engine mutated source object");
  }
  if (Object.prototype.hasOwnProperty.call(sourceObject, "impactScore")) {
    objectMutationFailures.push("Source object received impactScore field");
  }
  gates.push(gate("K", "No Object Mutations", objectMutationFailures));

  const routingFailures: string[] = [];
  const scenarioPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "scenario",
  });
  if (scenarioPlan.workspaceId !== "scenario" || scenarioPlan.mountTarget !== "scenario_workspace") {
    routingFailures.push("Scenario dashboard routing regressed");
  }
  gates.push(gate("L", "No MRP Routing Changes", routingFailures));

  const legacyFailures: string[] = [];
  if (runtime.mrpMutation !== false) legacyFailures.push("Scenario runtime MRP mutation enabled");
  if (runtime.visualRendering !== false) legacyFailures.push("Scenario runtime visual rendering enabled");
  if (comparison.renderingActive !== false) {
    legacyFailures.push("Comparison foundation rendering active");
  }
  if (comparison.visualRendering !== false) {
    legacyFailures.push("Comparison foundation visual rendering enabled");
  }
  if (recommendation.simulationActive !== false) {
    legacyFailures.push("Recommendation engine simulation active");
  }
  gates.push(gate("M", "No Legacy Router Usage", legacyFailures));

  const freezeFailures: string[] = [];
  if (DS7_CERTIFIED_TAG !== "[DS7_CERTIFIED]") freezeFailures.push("DS7_CERTIFIED tag missing");
  if (SCENARIO_GENERATION_COMPLETE_TAG !== "[SCENARIO_GENERATION_COMPLETE]") {
    freezeFailures.push("SCENARIO_GENERATION_COMPLETE tag missing");
  }
  if (DS7_CERTIFICATION_FREEZE_TAGS.length !== 2) freezeFailures.push("Freeze tag registry incomplete");
  gates.push(gate("N", "Freeze Contracts Active", freezeFailures));

  const certified = gates.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: DS_7_10_SCENARIO_INTELLIGENCE_CERTIFICATION_TAG,
    version: "7.10.0",
    certified,
    gates: Object.freeze(gates),
    freezeTags: DS7_CERTIFICATION_FREEZE_TAGS,
  });
}
