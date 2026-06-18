import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import {
  buildAssistantIntelligenceAdapterRegistry,
  resetAssistantIntelligenceAdapterForTests,
} from "./AssistantIntelligenceAdapter.ts";
import {
  ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  INT3_ADAPTER_COMPLETE_TAG,
} from "./assistantIntelligenceAdapterContract.ts";
import {
  buildObjectExplanationRegistry,
  resetObjectExplanationEngineForTests,
} from "./ObjectExplanationEngine.ts";
import {
  OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC,
  OBJECT_EXPLANATION_READY_DIAGNOSTIC,
  INT3_OBJECT_EXPLANATION_COMPLETE_TAG,
} from "./objectExplanationEngineContract.ts";
import {
  buildRelationshipExplanationRegistry,
  resetRelationshipExplanationEngineForTests,
} from "./RelationshipExplanationEngine.ts";
import {
  RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC,
  INT3_RELATIONSHIP_EXPLANATION_COMPLETE_TAG,
} from "./relationshipExplanationEngineContract.ts";
import {
  buildKpiExplanationRegistry,
  resetKpiExplanationEngineForTests,
} from "./KpiExplanationEngine.ts";
import {
  KPI_EXPLANATION_ENGINE_DIAGNOSTIC,
  KPI_EXPLANATION_READY_DIAGNOSTIC,
  INT3_KPI_EXPLANATION_COMPLETE_TAG,
} from "./kpiExplanationEngineContract.ts";
import {
  buildRiskExplanationRegistry,
  resetRiskExplanationEngineForTests,
} from "./RiskExplanationEngine.ts";
import {
  RISK_EXPLANATION_ENGINE_DIAGNOSTIC,
  RISK_EXPLANATION_READY_DIAGNOSTIC,
  INT3_RISK_EXPLANATION_COMPLETE_TAG,
} from "./riskExplanationEngineContract.ts";
import {
  buildScenarioExplanationRegistry,
  resetScenarioExplanationEngineForTests,
} from "./ScenarioExplanationEngine.ts";
import {
  SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC,
  SCENARIO_EXPLANATION_READY_DIAGNOSTIC,
  INT3_SCENARIO_EXPLANATION_COMPLETE_TAG,
} from "./scenarioExplanationEngineContract.ts";
import {
  ASSISTANT_INTELLIGENCE_COMPLETE_TAG,
  INT3_ASSISTANT_INTEGRATION_CERTIFICATION_TAG,
  INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  INT3_CERTIFICATION_FREEZE_TAGS,
  INT3_CERTIFIED_TAG,
  type AssistantIntelligenceCertificationGate,
  type AssistantIntelligenceCertificationResult,
} from "./assistantIntelligenceCertificationContract.ts";
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
import { resetScenarioComparisonFoundationForTests } from "../scenario-intelligence/ScenarioComparisonFoundation.ts";
import { resetScenarioRecommendationEngineForTests } from "../scenario-intelligence/ScenarioRecommendationEngine.ts";

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
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
});

const FRONTEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const INT3_TEST_FILES = Object.freeze([
  "app/lib/intelligence-integration/AssistantIntelligenceAdapter.test.ts",
  "app/lib/intelligence-integration/ObjectExplanationEngine.test.ts",
  "app/lib/intelligence-integration/RelationshipExplanationEngine.test.ts",
  "app/lib/intelligence-integration/KpiExplanationEngine.test.ts",
  "app/lib/intelligence-integration/RiskExplanationEngine.test.ts",
  "app/lib/intelligence-integration/ScenarioExplanationEngine.test.ts",
] as const);

function resetCertificationRuntime(): void {
  resetAssistantIntelligenceAdapterForTests();
  resetObjectExplanationEngineForTests();
  resetRelationshipExplanationEngineForTests();
  resetKpiExplanationEngineForTests();
  resetRiskExplanationEngineForTests();
  resetScenarioExplanationEngineForTests();
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
}

function gate(
  id: AssistantIntelligenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): AssistantIntelligenceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

type GuardModule = Readonly<{
  sceneMutation: boolean;
  objectMutation: boolean;
  mrpMutation: boolean;
  routingMutation: boolean;
  topologyMutation: boolean;
  legacyRouterUsage: boolean;
  simulationActive?: boolean;
}>;

function collectGuardModules(
  adapter: ReturnType<typeof buildAssistantIntelligenceAdapterRegistry>,
  objectExplanations: ReturnType<typeof buildObjectExplanationRegistry>,
  relationshipExplanations: ReturnType<typeof buildRelationshipExplanationRegistry>,
  kpiExplanations: ReturnType<typeof buildKpiExplanationRegistry>,
  riskExplanations: ReturnType<typeof buildRiskExplanationRegistry>,
  scenarioExplanations: ReturnType<typeof buildScenarioExplanationRegistry>
): readonly GuardModule[] {
  return Object.freeze([
    adapter,
    objectExplanations,
    relationshipExplanations,
    kpiExplanations,
    riskExplanations,
    scenarioExplanations,
  ]);
}

export function runAssistantIntelligenceCertification(): AssistantIntelligenceCertificationResult {
  resetCertificationRuntime();

  const gates: AssistantIntelligenceCertificationGate[] = [];
  const buildInput = Object.freeze({ sceneJson: CERTIFICATION_SCENE, selectedObjectId: "supplier-1" });

  const adapter = buildAssistantIntelligenceAdapterRegistry(buildInput);
  const adapterFailures: string[] = [];
  if (adapter.readOnly !== true) adapterFailures.push("Assistant adapter not read-only");
  if (adapter.simulationActive !== false) adapterFailures.push("Assistant adapter reports simulation active");
  if (adapter.explanationCount === 0) adapterFailures.push("Assistant adapter produced no explanations");
  if (!adapter.diagnostics.includes(ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC)) {
    adapterFailures.push("Assistant adapter missing ASSISTANT_INTELLIGENCE_ADAPTER");
  }
  if (!adapter.diagnostics.includes(ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC)) {
    adapterFailures.push("Assistant adapter missing ASSISTANT_INTELLIGENCE_ADAPTER_READY");
  }
  if (INT3_ADAPTER_COMPLETE_TAG !== "[INT3_ADAPTER_COMPLETE]") {
    adapterFailures.push("INT3_ADAPTER_COMPLETE tag missing");
  }
  if (adapter.snapshot.objectIntelligence.objectCount === 0) {
    adapterFailures.push("Assistant snapshot missing object intelligence");
  }
  if (adapter.snapshot.scenarioIntelligence.scenarioCount === 0) {
    adapterFailures.push("Assistant snapshot missing scenario intelligence");
  }
  gates.push(gate("A", "Assistant Adapter Works", adapterFailures));

  const objectExplanations = buildObjectExplanationRegistry(buildInput);
  const objectFailures: string[] = [];
  if (objectExplanations.explanationCount === 0) objectFailures.push("No object explanations generated");
  if (objectExplanations.explanationReady !== true) objectFailures.push("Object explanations not ready");
  if (!objectExplanations.diagnostics.includes(OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC)) {
    objectFailures.push("Object explanation missing OBJECT_EXPLANATION_ENGINE");
  }
  if (!objectExplanations.diagnostics.includes(OBJECT_EXPLANATION_READY_DIAGNOSTIC)) {
    objectFailures.push("Object explanation missing OBJECT_EXPLANATION_READY");
  }
  if (INT3_OBJECT_EXPLANATION_COMPLETE_TAG !== "[INT3_OBJECT_EXPLANATION_COMPLETE]") {
    objectFailures.push("INT3_OBJECT_EXPLANATION_COMPLETE tag missing");
  }
  gates.push(gate("B", "Object Explanation Engine Works", objectFailures));

  const relationshipExplanations = buildRelationshipExplanationRegistry(buildInput);
  const relationshipFailures: string[] = [];
  if (relationshipExplanations.explanationCount === 0) {
    relationshipFailures.push("No relationship explanations generated");
  }
  if (!relationshipExplanations.diagnostics.includes(RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC)) {
    relationshipFailures.push("Relationship explanation missing RELATIONSHIP_EXPLANATION_ENGINE");
  }
  if (!relationshipExplanations.diagnostics.includes(RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC)) {
    relationshipFailures.push("Relationship explanation missing RELATIONSHIP_EXPLANATION_READY");
  }
  if (INT3_RELATIONSHIP_EXPLANATION_COMPLETE_TAG !== "[INT3_RELATIONSHIP_EXPLANATION_COMPLETE]") {
    relationshipFailures.push("INT3_RELATIONSHIP_EXPLANATION_COMPLETE tag missing");
  }
  gates.push(gate("C", "Relationship Explanation Engine Works", relationshipFailures));

  const kpiExplanations = buildKpiExplanationRegistry(buildInput);
  const kpiFailures: string[] = [];
  if (kpiExplanations.explanationCount === 0) kpiFailures.push("No KPI explanations generated");
  if (!kpiExplanations.diagnostics.includes(KPI_EXPLANATION_ENGINE_DIAGNOSTIC)) {
    kpiFailures.push("KPI explanation missing KPI_EXPLANATION_ENGINE");
  }
  if (!kpiExplanations.diagnostics.includes(KPI_EXPLANATION_READY_DIAGNOSTIC)) {
    kpiFailures.push("KPI explanation missing KPI_EXPLANATION_READY");
  }
  if (INT3_KPI_EXPLANATION_COMPLETE_TAG !== "[INT3_KPI_EXPLANATION_COMPLETE]") {
    kpiFailures.push("INT3_KPI_EXPLANATION_COMPLETE tag missing");
  }
  gates.push(gate("D", "KPI Explanation Engine Works", kpiFailures));

  const riskExplanations = buildRiskExplanationRegistry(buildInput);
  const riskFailures: string[] = [];
  if (riskExplanations.explanationCount === 0) riskFailures.push("No risk explanations generated");
  if (!riskExplanations.diagnostics.includes(RISK_EXPLANATION_ENGINE_DIAGNOSTIC)) {
    riskFailures.push("Risk explanation missing RISK_EXPLANATION_ENGINE");
  }
  if (!riskExplanations.diagnostics.includes(RISK_EXPLANATION_READY_DIAGNOSTIC)) {
    riskFailures.push("Risk explanation missing RISK_EXPLANATION_READY");
  }
  if (INT3_RISK_EXPLANATION_COMPLETE_TAG !== "[INT3_RISK_EXPLANATION_COMPLETE]") {
    riskFailures.push("INT3_RISK_EXPLANATION_COMPLETE tag missing");
  }
  gates.push(gate("E", "Risk Explanation Engine Works", riskFailures));

  const scenarioExplanations = buildScenarioExplanationRegistry(buildInput);
  const scenarioFailures: string[] = [];
  if (scenarioExplanations.explanationCount === 0) {
    scenarioFailures.push("No scenario explanations generated");
  }
  if (scenarioExplanations.simulationActive !== false) {
    scenarioFailures.push("Scenario explanation reports simulation active");
  }
  if (!scenarioExplanations.diagnostics.includes(SCENARIO_EXPLANATION_ENGINE_DIAGNOSTIC)) {
    scenarioFailures.push("Scenario explanation missing SCENARIO_EXPLANATION_ENGINE");
  }
  if (!scenarioExplanations.diagnostics.includes(SCENARIO_EXPLANATION_READY_DIAGNOSTIC)) {
    scenarioFailures.push("Scenario explanation missing SCENARIO_EXPLANATION_READY");
  }
  if (INT3_SCENARIO_EXPLANATION_COMPLETE_TAG !== "[INT3_SCENARIO_EXPLANATION_COMPLETE]") {
    scenarioFailures.push("INT3_SCENARIO_EXPLANATION_COMPLETE tag missing");
  }
  gates.push(gate("F", "Scenario Explanation Engine Works", scenarioFailures));

  const guardModules = collectGuardModules(
    adapter,
    objectExplanations,
    relationshipExplanations,
    kpiExplanations,
    riskExplanations,
    scenarioExplanations
  );

  const sceneFailures: string[] = [];
  const sceneJson = structuredClone(CERTIFICATION_SCENE);
  const beforeScene = JSON.stringify(sceneJson);
  buildAssistantIntelligenceAdapterRegistry({ sceneJson });
  buildObjectExplanationRegistry({ sceneJson });
  buildRelationshipExplanationRegistry({ sceneJson });
  buildKpiExplanationRegistry({ sceneJson });
  buildRiskExplanationRegistry({ sceneJson });
  buildScenarioExplanationRegistry({ sceneJson });
  if (JSON.stringify(sceneJson) !== beforeScene) {
    sceneFailures.push("INT-3 pipeline mutated scene payload");
  }
  if (guardModules.some((module) => module.sceneMutation !== false)) {
    sceneFailures.push("One or more INT-3 modules report scene mutation");
  }
  gates.push(gate("G", "No Scene Mutations", sceneFailures));

  const topologyFailures: string[] = [];
  const topologyScene = structuredClone(CERTIFICATION_SCENE) as {
    scene: { relationships: readonly unknown[]; objects: readonly unknown[] };
  };
  const beforeRelationships = JSON.stringify(topologyScene.scene.relationships);
  const beforeObjects = JSON.stringify(topologyScene.scene.objects);
  buildAssistantIntelligenceAdapterRegistry({ sceneJson: topologyScene });
  buildRiskExplanationRegistry({ sceneJson: topologyScene });
  buildScenarioExplanationRegistry({ sceneJson: topologyScene });
  if (JSON.stringify(topologyScene.scene.relationships) !== beforeRelationships) {
    topologyFailures.push("INT-3 pipeline mutated scene relationships");
  }
  if (JSON.stringify(topologyScene.scene.objects) !== beforeObjects) {
    topologyFailures.push("INT-3 pipeline mutated scene objects");
  }
  if (guardModules.some((module) => module.topologyMutation !== false)) {
    topologyFailures.push("One or more INT-3 modules report topology mutation");
  }
  gates.push(gate("H", "No Topology Mutations", topologyFailures));

  const routingFailures: string[] = [];
  const advisoryPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "advisory",
    dashboardContext: "advisory",
  });
  if (advisoryPlan.workspaceId !== "advisory") {
    routingFailures.push(`Advisory context must resolve advisory workspace, got ${advisoryPlan.workspaceId}`);
  }
  if (guardModules.some((module) => module.routingMutation !== false)) {
    routingFailures.push("INT-3 modules report routing mutation");
  }
  gates.push(gate("I", "No Routing Changes", routingFailures));

  const objectMutationFailures: string[] = [];
  if (guardModules.some((module) => module.objectMutation !== false)) {
    objectMutationFailures.push("INT-3 modules report object mutation");
  }
  gates.push(gate("J", "No Object Mutations", objectMutationFailures));

  const mrpFailures: string[] = [];
  if (guardModules.some((module) => module.mrpMutation !== false)) {
    mrpFailures.push("INT-3 modules report MRP mutation");
  }
  if (adapter.simulationActive !== false) mrpFailures.push("Assistant adapter simulation active");
  gates.push(gate("K", "No MRP Mutations", mrpFailures));

  const legacyFailures: string[] = [];
  if (guardModules.some((module) => module.legacyRouterUsage !== false)) {
    legacyFailures.push("INT-3 modules report legacy router usage");
  }
  if (INT3_CERTIFIED_TAG !== "[INT3_CERTIFIED]") legacyFailures.push("INT3_CERTIFIED tag missing");
  if (ASSISTANT_INTELLIGENCE_COMPLETE_TAG !== "[ASSISTANT_INTELLIGENCE_COMPLETE]") {
    legacyFailures.push("ASSISTANT_INTELLIGENCE_COMPLETE tag missing");
  }
  if (INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC !== "[INT3_CERTIFICATION_COMPLETE]") {
    legacyFailures.push("INT3_CERTIFICATION_COMPLETE diagnostic missing");
  }
  if (INT3_CERTIFICATION_FREEZE_TAGS.length !== 2) {
    legacyFailures.push("Freeze tag registry incomplete");
  }
  gates.push(gate("L", "No Legacy Router Usage", legacyFailures));

  const buildFailures: string[] = [];
  const requiredModules = [
    "app/lib/intelligence-integration/AssistantIntelligenceAdapter.ts",
    "app/lib/intelligence-integration/ObjectExplanationEngine.ts",
    "app/lib/intelligence-integration/RelationshipExplanationEngine.ts",
    "app/lib/intelligence-integration/KpiExplanationEngine.ts",
    "app/lib/intelligence-integration/RiskExplanationEngine.ts",
    "app/lib/intelligence-integration/ScenarioExplanationEngine.ts",
    "app/lib/intelligence-integration/assistantIntelligenceCertification.ts",
  ] as const;
  for (const modulePath of requiredModules) {
    if (!existsSync(join(FRONTEND_ROOT, modulePath))) {
      buildFailures.push(`Missing INT-3 module ${modulePath}`);
    }
  }
  const buildResult = spawnSync("npm", ["run", "build"], {
    cwd: FRONTEND_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (buildResult.status !== 0) {
    buildFailures.push("npm run build failed during certification");
  }
  gates.push(gate("M", "Build Passes", buildFailures));

  const testFailures: string[] = [];
  for (const testFile of INT3_TEST_FILES) {
    if (!existsSync(join(FRONTEND_ROOT, testFile))) {
      testFailures.push(`Missing INT-3 test file ${testFile}`);
    }
  }
  const testResult = spawnSync("node", ["--test", ...INT3_TEST_FILES], {
    cwd: FRONTEND_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (testResult.status !== 0) {
    testFailures.push("INT-3 test suite failed during certification");
  }
  gates.push(gate("N", "Tests Pass", testFailures));

  const freezeTagsValid =
    INT3_CERTIFIED_TAG === "[INT3_CERTIFIED]" &&
    ASSISTANT_INTELLIGENCE_COMPLETE_TAG === "[ASSISTANT_INTELLIGENCE_COMPLETE]" &&
    INT3_CERTIFICATION_FREEZE_TAGS.length === 2;

  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: INT3_ASSISTANT_INTEGRATION_CERTIFICATION_TAG,
    version: "3.6.0",
    certified,
    diagnostics: Object.freeze([INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: INT3_CERTIFICATION_FREEZE_TAGS,
  });
}
