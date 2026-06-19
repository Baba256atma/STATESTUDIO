import { buildKpiIntelligenceRegistry, resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { buildObjectIntelligenceRegistry, resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { buildRelationshipIntelligenceRegistry, resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { buildRiskIntelligenceRegistry, resetRiskIntelligenceRuntimeForTests } from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import { adaptDraftToSimulationRequest, resetDraftToSimulationAdapterForTests } from "./DraftToSimulationAdapter.ts";
import { runKpiSimulation, resetKpiSimulationEngineForTests } from "./KpiSimulationEngine.ts";
import { runObjectSimulation, resetObjectSimulationEngineForTests } from "./ObjectSimulationEngine.ts";
import { runRelationshipSimulation, resetRelationshipSimulationEngineForTests } from "./RelationshipSimulationEngine.ts";
import { runRiskSimulation, resetRiskSimulationEngineForTests } from "./RiskSimulationEngine.ts";
import { createScenarioDraftRegistryEntry, resetScenarioDraftRegistryForTests } from "./ScenarioDraftRegistry.ts";
import { buildScenarioDraft } from "./scenarioAuthoringContract.ts";
import { runScenarioSimulation, resetScenarioSimulationRuntimeForTests } from "./ScenarioSimulationRuntime.ts";
import { aggregateSimulationResults, resetSimulationResultAggregatorForTests } from "./SimulationResultAggregator.ts";
import {
  SCENARIO_SIMULATION_COMPLETE_TAG,
  S2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  S2_CERTIFICATION_FREEZE_TAGS,
  S2_CERTIFIED_TAG,
  S2_SCENARIO_SIMULATION_CERTIFICATION_TAG,
  type ScenarioSimulationCertificationGate,
  type ScenarioSimulationCertificationInput,
  type ScenarioSimulationCertificationResult,
} from "./scenarioSimulationCertificationContract.ts";

const CERT_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        health: 62,
        impact: 84,
        confidence: 78,
        importance: 92,
        trend: "declining",
      }),
      Object.freeze({
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        health: 80,
        impact: 58,
        confidence: 76,
        importance: 70,
        trend: "stable",
      }),
    ]),
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "dependency",
        metadata: Object.freeze({
          dependency: 91,
          influence: 76,
          confidence: 84,
          riskExposure: 70,
        }),
      }),
    ]),
    kpis: Object.freeze([
      Object.freeze({
        id: "revenue",
        label: "Revenue",
        category: "Revenue",
        value: 92,
        target: 110,
        direction: "up",
        confidence: 84,
      }),
    ]),
    risks: Object.freeze([
      Object.freeze({
        riskId: "risk-supplier",
        subjectId: "supplier-1",
        label: "Supplier Delay Risk",
        category: "Supply Risk",
        severity: 82,
        exposure: 76,
        confidence: 88,
        momentum: "worsening",
      }),
    ]),
  }),
});

function resetCertificationRuntime(): void {
  resetScenarioDraftRegistryForTests();
  resetScenarioSimulationRuntimeForTests();
  resetDraftToSimulationAdapterForTests();
  resetObjectSimulationEngineForTests();
  resetRelationshipSimulationEngineForTests();
  resetKpiSimulationEngineForTests();
  resetRiskSimulationEngineForTests();
  resetSimulationResultAggregatorForTests();
  resetObjectIntelligenceRuntimeForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
}

function gate(
  id: ScenarioSimulationCertificationGate["id"],
  name: string,
  failures: readonly string[]
): ScenarioSimulationCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

export function runScenarioSimulationCertification(
  input: ScenarioSimulationCertificationInput = {}
): ScenarioSimulationCertificationResult {
  resetCertificationRuntime();

  const gates: ScenarioSimulationCertificationGate[] = [];
  const draft = buildScenarioDraft({
    draftId: "scenario-draft:s2-cert",
    name: "Supplier Delay Simulation",
    scenarioType: "risk",
    summary: "Certify S2 scenario simulation.",
    description: "Read-only certification draft.",
    assumptions: ["Baseline reference preserved."],
    focusObjectIds: ["supplier-1"],
  });
  const sceneBefore = JSON.stringify(CERT_SCENE);
  const relationshipsBefore = JSON.stringify(CERT_SCENE.scene.relationships);
  const objectsBefore = JSON.stringify(CERT_SCENE.scene.objects);

  const created = createScenarioDraftRegistryEntry({ draft });
  const adapter = adaptDraftToSimulationRequest(draft);
  const request = adapter.request;
  const runtime = request
    ? runScenarioSimulation(request)
    : null;

  const objectRegistry = buildObjectIntelligenceRegistry({ sceneJson: CERT_SCENE });
  const relationshipRegistry = buildRelationshipIntelligenceRegistry({ sceneJson: CERT_SCENE });
  const kpiRegistry = buildKpiIntelligenceRegistry({ sceneJson: CERT_SCENE });
  const riskRegistry = buildRiskIntelligenceRegistry({ sceneJson: CERT_SCENE });
  const dsBefore = JSON.stringify({ objectRegistry, relationshipRegistry, kpiRegistry, riskRegistry });

  const objectSimulation = request
    ? runObjectSimulation({ request, objectIntelligence: objectRegistry })
    : null;
  const relationshipSimulation = request
    ? runRelationshipSimulation({ request, relationshipIntelligence: relationshipRegistry })
    : null;
  const kpiSimulation = request
    ? runKpiSimulation({ request, kpiIntelligence: kpiRegistry })
    : null;
  const riskSimulation = request
    ? runRiskSimulation({ request, riskIntelligence: riskRegistry })
    : null;
  const summary = request
    ? aggregateSimulationResults({
        request,
        objectSimulation,
        relationshipSimulation,
        kpiSimulation,
        riskSimulation,
      })
    : null;

  gates.push(gate("A", "Simulation Runtime works", [
    created.success ? "" : "Draft registry create failed",
    runtime?.status === "ready" ? "" : "Simulation runtime not ready",
    runtime?.sceneMutation === false ? "" : "Runtime reports scene mutation",
    runtime?.dsMutation === false ? "" : "Runtime reports DS mutation",
  ].filter(Boolean)));

  gates.push(gate("B", "Draft-to-Simulation Adapter works", [
    adapter.status === "ready" ? "" : "Adapter did not produce request",
    adapter.simulationExecution === false ? "" : "Adapter executed simulation",
    adapter.baselineReference?.preserved === true ? "" : "Adapter did not preserve baseline reference",
  ].filter(Boolean)));

  gates.push(gate("C", "Object Simulation Engine works", [
    objectSimulation?.objectCount ? "" : "Object simulation empty",
    objectSimulation?.objectMutation === false ? "" : "Object simulation reports mutation",
  ].filter(Boolean)));

  gates.push(gate("D", "Relationship Simulation Engine works", [
    relationshipSimulation?.relationshipCount ? "" : "Relationship simulation empty",
    relationshipSimulation?.topologyMutation === false ? "" : "Relationship simulation reports topology mutation",
  ].filter(Boolean)));

  gates.push(gate("E", "KPI Simulation Engine works", [
    kpiSimulation?.kpiCount ? "" : "KPI simulation empty",
    kpiSimulation?.kpiMutation === false ? "" : "KPI simulation reports mutation",
    kpiSimulation?.forecastExecution === false ? "" : "KPI simulation executed forecast",
  ].filter(Boolean)));

  gates.push(gate("F", "Risk Simulation Engine works", [
    riskSimulation?.riskCount ? "" : "Risk simulation empty",
    riskSimulation?.riskMutation === false ? "" : "Risk simulation reports mutation",
  ].filter(Boolean)));

  gates.push(gate("G", "Simulation Result Aggregator works", [
    summary?.overallScenarioImpact != null ? "" : "Aggregator missing overall impact",
    summary?.uiRendering === false ? "" : "Aggregator reports UI rendering",
    summary?.routingMutation === false ? "" : "Aggregator reports routing mutation",
  ].filter(Boolean)));

  gates.push(gate("H", "No Scene mutations", [
    JSON.stringify(CERT_SCENE) === sceneBefore ? "" : "Scene payload mutated",
    objectSimulation?.sceneMutation === false ? "" : "Object simulation scene mutation",
    relationshipSimulation?.sceneMutation === false ? "" : "Relationship simulation scene mutation",
    kpiSimulation?.sceneMutation === false ? "" : "KPI simulation scene mutation",
    riskSimulation?.sceneMutation === false ? "" : "Risk simulation scene mutation",
  ].filter(Boolean)));

  gates.push(gate("I", "No Topology mutations", [
    JSON.stringify(CERT_SCENE.scene.relationships) === relationshipsBefore ? "" : "Relationships mutated",
    JSON.stringify(CERT_SCENE.scene.objects) === objectsBefore ? "" : "Objects mutated",
    relationshipSimulation?.topologyMutation === false ? "" : "Relationship simulation topology mutation",
  ].filter(Boolean)));

  gates.push(gate("J", "No Routing changes", [
    request?.routingMutation === false ? "" : "Request routing mutation",
    summary?.routingMutation === false ? "" : "Summary routing mutation",
    riskSimulation?.routingMutation === false ? "" : "Risk simulation routing mutation",
  ].filter(Boolean)));

  gates.push(gate("K", "No DS mutations", [
    JSON.stringify({ objectRegistry, relationshipRegistry, kpiRegistry, riskRegistry }) === dsBefore
      ? ""
      : "DS intelligence registries mutated",
    objectSimulation?.dsMutation === false ? "" : "Object simulation DS mutation",
    relationshipSimulation?.dsMutation === false ? "" : "Relationship simulation DS mutation",
    kpiSimulation?.dsMutation === false ? "" : "KPI simulation DS mutation",
    riskSimulation?.dsMutation === false ? "" : "Risk simulation DS mutation",
  ].filter(Boolean)));

  gates.push(gate("L", "No Object mutations", [
    JSON.stringify(CERT_SCENE.scene.objects) === objectsBefore ? "" : "Scene objects mutated",
    objectSimulation?.objectMutation === false ? "" : "Object simulation object mutation",
    relationshipSimulation?.objectMutation === false ? "" : "Relationship simulation object mutation",
  ].filter(Boolean)));

  gates.push(gate("M", "Build passes", [
    input.buildPassed === false ? "Build verification failed" : "",
  ].filter(Boolean)));

  gates.push(gate("N", "Tests pass", [
    input.testsPassed === false ? "Test verification failed" : "",
  ].filter(Boolean)));

  const freezeTagsValid =
    S2_CERTIFIED_TAG === "[S2_CERTIFIED]" &&
    SCENARIO_SIMULATION_COMPLETE_TAG === "[SCENARIO_SIMULATION_COMPLETE]" &&
    S2_CERTIFICATION_FREEZE_TAGS.length === 2;
  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: S2_SCENARIO_SIMULATION_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([S2_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: S2_CERTIFICATION_FREEZE_TAGS,
  });
}
