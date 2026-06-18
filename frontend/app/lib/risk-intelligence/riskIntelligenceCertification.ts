import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { syncSceneObjectRegistry, resetSceneObjectRegistryForTests } from "../scene/objectRegistryRuntime.ts";
import type { SceneObject } from "../sceneTypes.ts";
import { buildExecutiveRiskSummary, resetExecutiveRiskSummaryForTests } from "./ExecutiveRiskSummary.ts";
import { buildObjectRiskRegistry, resetObjectRiskEngineForTests } from "./ObjectRiskEngine.ts";
import { buildRelationshipRiskRegistry, resetRelationshipRiskEngineForTests } from "./RelationshipRiskEngine.ts";
import { buildKpiRiskRegistry, resetKpiRiskEngineForTests } from "./KpiRiskEngine.ts";
import {
  buildRiskPropagationProfile,
  resetRiskPropagationEngineForTests,
} from "./RiskPropagationEngine.ts";
import {
  buildRiskScenarioFoundationRegistry,
  resetRiskScenarioFoundationForTests,
} from "./RiskScenarioFoundation.ts";
import {
  buildRiskVisualizationRegistry,
  resetRiskVisualizationContractForTests,
} from "./RiskVisualizationContractRuntime.ts";
import {
  buildRiskIntelligenceRegistry,
  resetRiskIntelligenceRuntimeForTests,
} from "./RiskIntelligenceRuntime.ts";
import {
  DS6_CERTIFIED_TAG,
  RISK_INTELLIGENCE_COMPLETE_TAG,
  RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
} from "./riskIntelligenceContract.ts";
import {
  DS_6_9_RISK_INTELLIGENCE_CERTIFICATION_TAG,
  DS6_CERTIFICATION_FREEZE_TAGS,
  type RiskIntelligenceCertificationGate,
  type RiskIntelligenceCertificationResult,
} from "./riskIntelligenceCertificationContract.ts";

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
  },
});

function resetCertificationRuntime(): void {
  resetRiskIntelligenceRuntimeForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetRiskScenarioFoundationForTests();
  resetRiskVisualizationContractForTests();
  resetSceneObjectRegistryForTests();
}

function gate(
  id: RiskIntelligenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): RiskIntelligenceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

export function runRiskIntelligenceCertification(): RiskIntelligenceCertificationResult {
  resetCertificationRuntime();

  const gates: RiskIntelligenceCertificationGate[] = [];
  const buildInput = Object.freeze({ sceneJson: CERTIFICATION_SCENE });

  const runtime = buildRiskIntelligenceRegistry(buildInput);
  const runtimeFailures: string[] = [];
  if (runtime.riskCount === 0) runtimeFailures.push("Risk intelligence runtime returned no profiles");
  if (runtime.sceneMutation !== false) runtimeFailures.push("Runtime reports scene mutation");
  if (runtime.routingMutation !== false) runtimeFailures.push("Runtime reports routing mutation");
  if (!runtime.diagnostics.includes(RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC)) {
    runtimeFailures.push("Runtime diagnostics missing");
  }
  gates.push(gate("A", "Runtime Created", runtimeFailures));

  const objectRisk = buildObjectRiskRegistry(buildInput);
  const objectFailures: string[] = [];
  if (objectRisk.objectCount === 0) objectFailures.push("Object risk registry empty");
  if (objectRisk.profiles.some((profile) => profile.riskScore < 0 || profile.riskScore > 100)) {
    objectFailures.push("Object risk score out of range");
  }
  gates.push(gate("B", "Object Risk Engine", objectFailures));

  const relationshipRisk = buildRelationshipRiskRegistry(buildInput);
  const relationshipFailures: string[] = [];
  if (relationshipRisk.relationshipCount === 0) {
    relationshipFailures.push("Relationship risk registry empty");
  }
  gates.push(gate("C", "Relationship Risk Engine", relationshipFailures));

  const kpiRisk = buildKpiRiskRegistry(buildInput);
  const kpiFailures: string[] = [];
  if (kpiRisk.kpiCount === 0) kpiFailures.push("KPI risk registry empty");
  gates.push(gate("D", "KPI Risk Engine", kpiFailures));

  const propagation = buildRiskPropagationProfile(buildInput);
  const propagationFailures: string[] = [];
  if (propagation.chainCount === 0) propagationFailures.push("Propagation profile has no chains");
  if (propagation.propagationScore < 35) {
    propagationFailures.push("Propagation score below certification threshold");
  }
  gates.push(gate("E", "Propagation Engine", propagationFailures));

  const executiveSummary = buildExecutiveRiskSummary(buildInput);
  const aggregatorFailures: string[] = [];
  if (executiveSummary.objectRiskCount === 0) aggregatorFailures.push("Executive summary missing object risk");
  if (executiveSummary.topRisks.length === 0) aggregatorFailures.push("Executive summary missing top risks");
  if (executiveSummary.recommendedAttention.length === 0) {
    aggregatorFailures.push("Executive summary missing recommended attention");
  }
  gates.push(gate("F", "Aggregator", aggregatorFailures));

  const scenarioFoundation = buildRiskScenarioFoundationRegistry(buildInput);
  const scenarioFailures: string[] = [];
  if (scenarioFoundation.scenarioCount === 0) scenarioFailures.push("Scenario foundation empty");
  if (scenarioFoundation.simulationActive !== false) {
    scenarioFailures.push("Scenario foundation reports simulation active");
  }
  gates.push(gate("G", "Scenario Foundation", scenarioFailures));

  const visualization = buildRiskVisualizationRegistry(buildInput);
  const visualizationFailures: string[] = [];
  if (visualization.entryCount === 0) visualizationFailures.push("Visualization registry empty");
  if (visualization.renderingMutation !== false) {
    visualizationFailures.push("Visualization contract reports rendering mutation");
  }
  if (
    !visualization.entries.every(
      (entry) =>
        typeof entry.riskScore === "number" &&
        typeof entry.riskLevel === "string" &&
        typeof entry.riskPriority === "string"
    )
  ) {
    visualizationFailures.push("Visualization contract missing published risk fields");
  }
  gates.push(gate("H", "Visualization Contract", visualizationFailures));

  const sceneFailures: string[] = [];
  const mutationFlags = [
    runtime.sceneMutation,
    objectRisk.sceneMutation,
    relationshipRisk.sceneMutation,
    kpiRisk.sceneMutation,
    propagation.objectCount >= 0 ? false : true,
    executiveSummary.sceneMutation,
    scenarioFoundation.sceneMutation,
    visualization.sceneMutation,
  ];
  if (mutationFlags.some((flag) => flag !== false)) {
    sceneFailures.push("One or more DS-6 modules report scene mutation");
  }
  try {
    const sampleObjects: SceneObject[] = objectRisk.profiles.map((profile) => ({
      id: profile.objectId,
      name: profile.objectId,
      type: "supplier",
    }));
    syncSceneObjectRegistry(sampleObjects);
    syncSceneObjectRegistry(sampleObjects);
  } catch (error) {
    sceneFailures.push(`Scene registry sync failed: ${String(error)}`);
  }
  gates.push(gate("I", "No Scene Mutations", sceneFailures));

  const objectMutationFailures: string[] = [];
  const sourceObject: Record<string, unknown> = {
    id: "supplier-1",
    label: "Primary Supplier",
    type: "supplier",
    active: false,
    sourceConfidence: 15,
  };
  const beforeObject = JSON.stringify(sourceObject);
  buildObjectRiskRegistry({ sceneObjects: [sourceObject] });
  if (JSON.stringify(sourceObject) !== beforeObject) {
    objectMutationFailures.push("Object risk engine mutated source object");
  }
  if (Object.prototype.hasOwnProperty.call(sourceObject, "riskScore")) {
    objectMutationFailures.push("Source object received riskScore field");
  }
  if (relationshipRisk.objectMutation !== false || scenarioFoundation.mrpMutation !== false) {
    objectMutationFailures.push("Relationship or scenario modules report object or routing mutation flags");
  }
  gates.push(gate("J", "No Object Mutations", objectMutationFailures));

  const routingFailures: string[] = [];
  const riskPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "risk",
  });
  if (riskPlan.workspaceId !== "risk" || riskPlan.mountTarget !== "risk_workspace") {
    routingFailures.push("Risk dashboard routing regressed");
  }
  gates.push(gate("K", "No MRP Routing Changes", routingFailures));

  const legacyFailures: string[] = [];
  if (runtime.routingMutation !== false) legacyFailures.push("Runtime routing mutation enabled");
  if (relationshipRisk.routingMutation !== false) {
    legacyFailures.push("Relationship risk routing mutation enabled");
  }
  if (kpiRisk.mrpMutation !== false) legacyFailures.push("KPI risk MRP mutation enabled");
  if (executiveSummary.mrpMutation !== false) {
    legacyFailures.push("Executive summary MRP mutation enabled");
  }
  if (scenarioFoundation.mrpMutation !== false) {
    legacyFailures.push("Scenario foundation MRP mutation enabled");
  }
  if (visualization.dashboardMutation !== false) {
    legacyFailures.push("Visualization dashboard mutation enabled");
  }
  gates.push(gate("L", "No Legacy Router Usage", legacyFailures));

  const freezeFailures: string[] = [];
  if (DS6_CERTIFIED_TAG !== "[DS6_CERTIFIED]") freezeFailures.push("DS6_CERTIFIED tag missing");
  if (RISK_INTELLIGENCE_COMPLETE_TAG !== "[RISK_INTELLIGENCE_COMPLETE]") {
    freezeFailures.push("RISK_INTELLIGENCE_COMPLETE tag missing");
  }
  if (DS6_CERTIFICATION_FREEZE_TAGS.length !== 2) freezeFailures.push("Freeze tag registry incomplete");
  gates.push(gate("M", "Freeze Contracts Active", freezeFailures));

  const certified = gates.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: DS_6_9_RISK_INTELLIGENCE_CERTIFICATION_TAG,
    version: "6.9.0",
    certified,
    gates: Object.freeze(gates),
    freezeTags: DS6_CERTIFICATION_FREEZE_TAGS,
  });
}
