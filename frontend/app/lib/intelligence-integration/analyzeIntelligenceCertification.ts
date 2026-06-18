import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachAnalyzeIntelligenceBinding } from "../dashboard/analyze/analyzeIntelligenceBindingBridge.ts";
import { ANALYZE_MODE_LEGACY_FINDINGS } from "../dashboard/analyze/analyzeModeLegacyFindings.ts";
import {
  ANALYZE_WORKSPACE_MODULES,
  resolveAnalyzeModeContext,
} from "../dashboard/analyze/analyzeModeContract.ts";
import { resolveExecutiveWorkspaceByDashboardMode } from "../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { syncSceneObjectRegistry, resetSceneObjectRegistryForTests } from "../scene/objectRegistryRuntime.ts";
import type { SceneObject } from "../sceneTypes.ts";
import { buildAnalyzeIntelligenceProfile, resetAnalyzeIntelligenceProfileForTests } from "./AnalyzeIntelligenceProfile.ts";
import { resolveAnalyzeIntelligenceBinding, resetAnalyzeIntelligenceBindingForTests } from "./AnalyzeIntelligenceBinding.ts";
import {
  buildExecutiveIntelligenceAdapterRegistry,
  resetExecutiveIntelligenceAdapterForTests,
} from "./ExecutiveIntelligenceAdapter.ts";
import {
  ANALYZE_BINDING_DIAGNOSTIC,
  ANALYZE_BINDING_READY_DIAGNOSTIC,
} from "./analyzeIntelligenceBindingContract.ts";
import {
  ANALYZE_CONTRACT_DIAGNOSTIC,
  ANALYZE_CONTRACT_READY_DIAGNOSTIC,
} from "./analyzeIntelligenceProfileContract.ts";
import {
  ANALYZE_SUMMARY_READY_DIAGNOSTIC,
  ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC,
  buildAnalyzeExecutiveSummaryView,
} from "./analyzeExecutiveSummaryContract.ts";
import {
  INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
} from "./executiveIntelligenceAdapterContract.ts";
import {
  ANALYZE_INTELLIGENCE_COMPLETE_TAG,
  INT1_CERTIFICATION_FREEZE_TAGS,
  INT1_CERTIFIED_TAG,
  INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG,
  type AnalyzeIntelligenceCertificationGate,
  type AnalyzeIntelligenceCertificationResult,
} from "./analyzeIntelligenceCertificationContract.ts";
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
});

const FRONTEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const ANALYZE_WORKSPACE_SHELL_PATH = join(
  FRONTEND_ROOT,
  "app/components/dashboard/analyze/AnalyzeWorkspaceShell.tsx"
);

const INT1_TEST_FILES = Object.freeze([
  "app/lib/intelligence/ExecutiveIntelligenceAdapter.test.ts",
  "app/lib/intelligence/AnalyzeIntelligenceProfile.test.ts",
  "app/lib/intelligence/AnalyzeIntelligenceBinding.test.ts",
  "app/lib/intelligence/analyzeExecutiveSummarySurfaceContract.test.ts",
  "app/lib/intelligence-integration/ExecutiveIntelligenceAdapter.test.ts",
  "app/lib/intelligence-integration/AnalyzeIntelligenceProfile.test.ts",
  "app/lib/intelligence-integration/AnalyzeIntelligenceBinding.test.ts",
  "app/lib/intelligence-integration/analyzeExecutiveSummaryContract.test.ts",
  "app/lib/dashboard/analyze/analyzeIntelligenceBindingBridge.test.ts",
  "app/lib/dashboard/analyze/analyzeModeContract.test.ts",
] as const);

function resetCertificationRuntime(): void {
  resetExecutiveIntelligenceAdapterForTests();
  resetAnalyzeIntelligenceProfileForTests();
  resetAnalyzeIntelligenceBindingForTests();
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
  resetSceneObjectRegistryForTests();
}

function gate(
  id: AnalyzeIntelligenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): AnalyzeIntelligenceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function buildAnalyzeContext(objectId: string, objectName: string) {
  return Object.freeze({
    objectId,
    objectName,
    analysisStatus: "ready" as const,
    analysisStatusLabel: "Ready",
    modules: ANALYZE_WORKSPACE_MODULES,
    intelligence: null,
    executiveSummary: null,
  });
}

export function runAnalyzeIntelligenceCertification(): AnalyzeIntelligenceCertificationResult {
  resetCertificationRuntime();

  const gates: AnalyzeIntelligenceCertificationGate[] = [];
  const buildInput = Object.freeze({ sceneJson: CERTIFICATION_SCENE, selectedObjectId: "supplier-1" });

  const adapter = buildExecutiveIntelligenceAdapterRegistry(buildInput);
  const adapterFailures: string[] = [];
  if (adapter.layerCount !== 5) adapterFailures.push("Adapter missing DS layer snapshots");
  if (adapter.readOnly !== true) adapterFailures.push("Adapter not read-only");
  if (adapter.sceneMutation !== false) adapterFailures.push("Adapter reports scene mutation");
  if (adapter.legacyRouterUsage !== false) adapterFailures.push("Adapter reports legacy router usage");
  if (!adapter.diagnostics.includes(INTELLIGENCE_ADAPTER_DIAGNOSTIC)) {
    adapterFailures.push("Adapter diagnostics missing EXEC_INTELLIGENCE_ADAPTER");
  }
  if (!adapter.diagnostics.includes(INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC)) {
    adapterFailures.push("Adapter diagnostics missing EXEC_INTELLIGENCE_ADAPTER_READY");
  }
  if (adapter.objectIntelligence.objectCount === 0) adapterFailures.push("Object intelligence empty");
  if (adapter.scenarioIntelligence.scenarioCount === 0) adapterFailures.push("Scenario intelligence empty");
  gates.push(gate("A", "Executive Intelligence Adapter Works", adapterFailures));

  const profile = buildAnalyzeIntelligenceProfile({ ...buildInput, adapterRegistry: adapter });
  const contractFailures: string[] = [];
  if (profile.profileId === "analyze-intelligence:none") {
    contractFailures.push("Analyze profile not materialized");
  }
  if (profile.readOnly !== true) contractFailures.push("Profile not read-only");
  if (profile.sceneMutation !== false) contractFailures.push("Profile reports scene mutation");
  if (!profile.diagnostics.includes(ANALYZE_CONTRACT_DIAGNOSTIC)) {
    contractFailures.push("Profile diagnostics missing ANALYZE_INTELLIGENCE_CONTRACT");
  }
  if (!profile.diagnostics.includes(ANALYZE_CONTRACT_READY_DIAGNOSTIC)) {
    contractFailures.push("Profile diagnostics missing ANALYZE_INTELLIGENCE_CONTRACT_READY");
  }
  if (!profile.health.contractReady) contractFailures.push("Health exposure not ready");
  if (!profile.impact.contractReady) contractFailures.push("Impact exposure not ready");
  if (!profile.trend.contractReady) contractFailures.push("Trend exposure not ready");
  if (!profile.importance.contractReady) contractFailures.push("Importance exposure not ready");
  if (!profile.risk.contractReady) contractFailures.push("Risk exposure not ready");
  if (!profile.confidence.contractReady) contractFailures.push("Confidence exposure not ready");
  if (!profile.scenarioSummary.contractReady) contractFailures.push("Scenario summary exposure not ready");
  gates.push(gate("B", "Analyze Contract Works", contractFailures));

  const binding = resolveAnalyzeIntelligenceBinding({
    objectId: "supplier-1",
    objectName: "Primary Supplier",
    selectedObjectId: "supplier-1",
    sceneJson: CERTIFICATION_SCENE,
  });
  const bindingFailures: string[] = [];
  if (binding.bindingStatus !== "bound") bindingFailures.push(`Binding status ${binding.bindingStatus}`);
  if (!binding.view) bindingFailures.push("Binding view missing");
  if (binding.sceneMutation !== false) bindingFailures.push("Binding reports scene mutation");
  if (!binding.diagnostics.includes(ANALYZE_BINDING_DIAGNOSTIC)) {
    bindingFailures.push("Binding diagnostics missing ANALYZE_BINDING");
  }
  if (!binding.diagnostics.includes(ANALYZE_BINDING_READY_DIAGNOSTIC)) {
    bindingFailures.push("Binding diagnostics missing ANALYZE_BINDING_READY");
  }
  if (binding.view && binding.view.bindingReady !== true) {
    bindingFailures.push("Binding view not ready");
  }
  gates.push(gate("C", "Analyze Binding Works", bindingFailures));

  const bridgedContext = attachAnalyzeIntelligenceBinding(
    buildAnalyzeContext("supplier-1", "Primary Supplier"),
    { objectId: "supplier-1", sceneJson: CERTIFICATION_SCENE }
  );
  const summaryFailures: string[] = [];
  if (!bridgedContext?.executiveSummary) {
    summaryFailures.push("Bridge did not attach executive summary");
  }
  const summary = bridgedContext?.executiveSummary;
  if (summary) {
    if (summary.summaryReady !== true) summaryFailures.push("Executive summary not ready");
    for (const field of [
      "healthLabel",
      "impactLabel",
      "trendLabel",
      "importanceLabel",
      "riskLabel",
      "confidenceLabel",
      "scenarioSummaryLabel",
    ] as const) {
      if (!summary[field].length) summaryFailures.push(`${field} missing`);
    }
  }
  if (binding.view) {
    const directSummary = buildAnalyzeExecutiveSummaryView({
      intelligence: binding.view,
      profile: binding.profile,
    });
    if (directSummary.healthLabel !== String(binding.view.healthScore)) {
      summaryFailures.push("Health label mismatch in summary builder");
    }
  }
  try {
    const shellSource = readFileSync(ANALYZE_WORKSPACE_SHELL_PATH, "utf8");
    if (!shellSource.includes("data-nx-analyze-summary-surface")) {
      summaryFailures.push("AnalyzeWorkspaceShell missing analyze summary surface attribute");
    }
    if (!shellSource.includes("ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC")) {
      summaryFailures.push("AnalyzeWorkspaceShell missing ANALYZE_SUMMARY_SURFACE diagnostic binding");
    }
    if (!shellSource.includes("analyze-executive-summary-empty")) {
      summaryFailures.push("AnalyzeWorkspaceShell missing intelligence empty-state surface");
    }
    for (const metric of [
      "Health",
      "Impact",
      "Trend",
      "Importance",
      "Risk",
      "Confidence",
      "Scenario Summary",
    ] as const) {
      if (!shellSource.includes(`metricCell("${metric}"`)) {
        summaryFailures.push(`AnalyzeWorkspaceShell missing ${metric} metric cell`);
      }
    }
  } catch (error) {
    summaryFailures.push(`AnalyzeWorkspaceShell source check failed: ${String(error)}`);
  }
  if (ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC !== "[ANALYZE_SUMMARY_SURFACE]") {
    summaryFailures.push("ANALYZE_SUMMARY_SURFACE diagnostic missing");
  }
  if (ANALYZE_SUMMARY_READY_DIAGNOSTIC !== "[ANALYZE_SUMMARY_READY]") {
    summaryFailures.push("ANALYZE_SUMMARY_READY diagnostic missing");
  }
  gates.push(gate("D", "Analyze Summary Renders", summaryFailures));

  const selectionFailures: string[] = [];
  const analyzeMode = resolveAnalyzeModeContext({
    selectedObjectId: "supplier-1",
    routeObjectId: "supplier-1",
    routeObjectName: "Primary Supplier",
    panelData: {
      objectId: "supplier-1",
      objectName: "Primary Supplier",
      objectType: "supplier",
      insight: "Supplier insight",
      riskLevel: "medium",
      recommendedAction: "Monitor",
    },
  });
  if (analyzeMode.reason !== "resolved") {
    selectionFailures.push(`Analyze mode context reason ${analyzeMode.reason}`);
  }
  if (analyzeMode.objectId !== "supplier-1") {
    selectionFailures.push("Analyze mode object selection mismatch");
  }
  if (bridgedContext?.objectId !== "supplier-1") {
    selectionFailures.push("Binding bridge mutated object selection");
  }
  if (bridgedContext?.objectName !== "Primary Supplier") {
    selectionFailures.push("Binding bridge mutated object name");
  }
  gates.push(gate("E", "Object Selection Preserved", selectionFailures));

  const sceneFailures: string[] = [];
  const sceneJson = structuredClone(CERTIFICATION_SCENE);
  const beforeScene = JSON.stringify(sceneJson);
  buildExecutiveIntelligenceAdapterRegistry({ sceneJson });
  buildAnalyzeIntelligenceProfile({ sceneJson, adapterRegistry: adapter });
  resolveAnalyzeIntelligenceBinding({
    objectId: "supplier-1",
    objectName: "Primary Supplier",
    sceneJson,
  });
  attachAnalyzeIntelligenceBinding(buildAnalyzeContext("supplier-1", "Primary Supplier"), {
    objectId: "supplier-1",
    sceneJson,
  });
  if (JSON.stringify(sceneJson) !== beforeScene) {
    sceneFailures.push("INT-1 pipeline mutated scene payload");
  }
  const mutationFlags = [
    adapter.sceneMutation,
    profile.sceneMutation,
    binding.sceneMutation,
    adapter.objectMutation,
    profile.objectMutation,
    binding.objectMutation,
  ];
  if (mutationFlags.some((flag) => flag !== false)) {
    sceneFailures.push("One or more INT-1 modules report scene or object mutation");
  }
  try {
    const sampleObjects: SceneObject[] = adapter.objectIntelligence.profiles.map((entry) => ({
      id: entry.objectId,
      name: entry.objectId,
      type: "supplier",
    }));
    syncSceneObjectRegistry(sampleObjects);
    syncSceneObjectRegistry(sampleObjects);
  } catch (error) {
    sceneFailures.push(`Scene registry sync failed: ${String(error)}`);
  }
  gates.push(gate("F", "Scene Unchanged", sceneFailures));

  const topologyFailures: string[] = [];
  const topologyScene = structuredClone(CERTIFICATION_SCENE) as {
    scene: { relationships: readonly unknown[]; objects: readonly unknown[] };
  };
  const beforeRelationships = JSON.stringify(topologyScene.scene.relationships);
  const beforeObjects = JSON.stringify(topologyScene.scene.objects);
  buildExecutiveIntelligenceAdapterRegistry({ sceneJson: topologyScene });
  resolveAnalyzeIntelligenceBinding({
    objectId: "supplier-1",
    sceneJson: topologyScene,
  });
  if (JSON.stringify(topologyScene.scene.relationships) !== beforeRelationships) {
    topologyFailures.push("INT-1 pipeline mutated scene relationships");
  }
  if (JSON.stringify(topologyScene.scene.objects) !== beforeObjects) {
    topologyFailures.push("INT-1 pipeline mutated scene objects");
  }
  gates.push(gate("G", "Topology Unchanged", topologyFailures));

  const routingFailures: string[] = [];
  const analyzePlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "analyze",
    dashboardContext: "risk",
  });
  if (analyzePlan.workspaceId !== "risk") {
    routingFailures.push(`Analyze mode must resolve risk workspace, got ${analyzePlan.workspaceId}`);
  }
  const routingFlags = [adapter.routingMutation, profile.routingMutation, binding.routingMutation];
  if (routingFlags.some((flag) => flag !== false)) {
    routingFailures.push("INT-1 modules report routing mutation");
  }
  gates.push(gate("H", "Routing Unchanged", routingFailures));

  const mrpFailures: string[] = [];
  const analyzeWorkspace = resolveExecutiveWorkspaceByDashboardMode("analyze");
  if (analyzeWorkspace?.shellComponent !== "AnalyzeWorkspaceShell") {
    mrpFailures.push("Analyze workspace shell registration regressed");
  }
  const mrpFlags = [adapter.mrpMutation, profile.mrpMutation, binding.mrpMutation];
  if (mrpFlags.some((flag) => flag !== false)) {
    mrpFailures.push("INT-1 modules report MRP mutation");
  }
  gates.push(gate("I", "MRP Unchanged", mrpFailures));

  const legacyFailures: string[] = [];
  if (adapter.simulationActive !== false) legacyFailures.push("Adapter simulation active");
  if (profile.simulationActive !== false) legacyFailures.push("Profile simulation active");
  if (binding.simulationActive !== false) legacyFailures.push("Binding simulation active");
  if (adapter.legacyRouterUsage !== false) legacyFailures.push("Adapter legacy router usage enabled");
  const legacyStatuses = Object.values(ANALYZE_MODE_LEGACY_FINDINGS).map((entry) => entry.status);
  if (legacyStatuses.some((status) => status === "regression" || status === "active_legacy_route")) {
    legacyFailures.push("Analyze legacy findings report routing regression");
  }
  if (INT1_CERTIFIED_TAG !== "[INT1_CERTIFIED]") legacyFailures.push("INT1_CERTIFIED tag missing");
  if (ANALYZE_INTELLIGENCE_COMPLETE_TAG !== "[ANALYZE_INTELLIGENCE_COMPLETE]") {
    legacyFailures.push("ANALYZE_INTELLIGENCE_COMPLETE tag missing");
  }
  if (INT1_CERTIFICATION_FREEZE_TAGS.length !== 2) {
    legacyFailures.push("Freeze tag registry incomplete");
  }
  gates.push(gate("J", "No Legacy Router Usage", legacyFailures));

  const buildFailures: string[] = [];
  const requiredModules = [
    "app/lib/intelligence/ExecutiveIntelligenceAdapter.ts",
    "app/lib/intelligence/AnalyzeIntelligenceProfile.ts",
    "app/lib/intelligence/AnalyzeIntelligenceBinding.ts",
    "app/lib/intelligence/analyzeExecutiveSummarySurfaceContract.ts",
    "app/components/dashboard/analyze/AnalyzeWorkspaceShell.tsx",
    "app/lib/dashboard/analyze/analyzeIntelligenceBindingBridge.ts",
  ] as const;
  for (const modulePath of requiredModules) {
    if (!existsSync(join(FRONTEND_ROOT, modulePath))) {
      buildFailures.push(`Missing INT-1 module ${modulePath}`);
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
  gates.push(gate("K", "Build Passes", buildFailures));

  const testFailures: string[] = [];
  for (const testFile of INT1_TEST_FILES) {
    if (!existsSync(join(FRONTEND_ROOT, testFile))) {
      testFailures.push(`Missing INT-1 test file ${testFile}`);
    }
  }
  const testResult = spawnSync("node", ["--test", ...INT1_TEST_FILES], {
    cwd: FRONTEND_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (testResult.status !== 0) {
    testFailures.push("INT-1 test suite failed during certification");
  }
  gates.push(gate("L", "Tests Pass", testFailures));

  const freezeTagsValid =
    INT1_CERTIFIED_TAG === "[INT1_CERTIFIED]" &&
    ANALYZE_INTELLIGENCE_COMPLETE_TAG === "[ANALYZE_INTELLIGENCE_COMPLETE]" &&
    INT1_CERTIFICATION_FREEZE_TAGS.length === 2;

  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG,
    version: "1.5.0",
    certified,
    gates: Object.freeze(gates),
    freezeTags: INT1_CERTIFICATION_FREEZE_TAGS,
  });
}
