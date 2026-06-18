import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachExecutiveSummaryIntelligenceFeed } from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { attachOperationalIntelligenceFeed } from "../dashboard/operationalIntelligence/operationalIntelligenceFeedBridge.ts";
import { aggregateOperationalIntelligence } from "../dashboard/operationalIntelligence/operationalIntelligenceAggregation.ts";
import { attachRiskIntelligenceFeed } from "../dashboard/riskIntelligence/riskIntelligenceFeedBridge.ts";
import { aggregateRiskIntelligence } from "../dashboard/riskIntelligence/riskIntelligenceAggregation.ts";
import { attachScenarioIntelligenceFeed } from "../dashboard/scenarioIntelligence/scenarioIntelligenceFeedBridge.ts";
import { aggregateScenarioIntelligence } from "../dashboard/scenarioIntelligence/scenarioIntelligenceAggregation.ts";
import {
  getDashboardSurfaceEntry,
  resolveDefaultDashboardLandingSurface,
} from "../dashboard/dashboardSurfaceRegistry.ts";
import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import {
  buildDashboardIntelligenceAdapterRegistry,
  resetDashboardIntelligenceAdapterForTests,
} from "./DashboardIntelligenceAdapter.ts";
import {
  buildExecutiveSummaryIntelligenceFeed,
  resetExecutiveSummaryIntelligenceFeedForTests,
} from "./ExecutiveSummaryIntelligenceFeed.ts";
import {
  buildOperationalIntelligenceFeed,
  resetOperationalIntelligenceFeedForTests,
} from "./OperationalIntelligenceFeed.ts";
import {
  buildRiskIntelligenceFeed,
  resetRiskIntelligenceFeedForTests,
} from "./RiskIntelligenceFeed.ts";
import {
  buildScenarioIntelligenceFeed,
  resetScenarioIntelligenceFeedForTests,
} from "./ScenarioIntelligenceFeed.ts";
import {
  DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  INT2_ADAPTER_COMPLETE_TAG,
} from "./dashboardIntelligenceAdapterContract.ts";
import {
  EXEC_SUMMARY_FEED_DIAGNOSTIC,
  EXEC_SUMMARY_FEED_READY_DIAGNOSTIC,
  INT2_EXEC_SUMMARY_COMPLETE_TAG,
} from "./executiveSummaryIntelligenceFeedContract.ts";
import {
  OPERATIONAL_FEED_DIAGNOSTIC,
  OPERATIONAL_FEED_READY_DIAGNOSTIC,
  INT2_OPERATIONAL_FEED_COMPLETE_TAG,
} from "./operationalIntelligenceFeedContract.ts";
import {
  RISK_FEED_DIAGNOSTIC,
  RISK_FEED_READY_DIAGNOSTIC,
  INT2_RISK_FEED_COMPLETE_TAG,
} from "./riskIntelligenceFeedContract.ts";
import {
  SCENARIO_FEED_DIAGNOSTIC,
  SCENARIO_FEED_READY_DIAGNOSTIC,
  INT2_SCENARIO_FEED_COMPLETE_TAG,
} from "./scenarioIntelligenceFeedContract.ts";
import {
  DASHBOARD_INTELLIGENCE_COMPLETE_TAG,
  INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  INT2_CERTIFICATION_FREEZE_TAGS,
  INT2_CERTIFIED_TAG,
  INT2_DASHBOARD_INTEGRATION_CERTIFICATION_TAG,
  type DashboardIntelligenceCertificationGate,
  type DashboardIntelligenceCertificationResult,
} from "./dashboardIntelligenceCertificationContract.ts";
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

const INT2_TEST_FILES = Object.freeze([
  "app/lib/intelligence-integration/DashboardIntelligenceAdapter.test.ts",
  "app/lib/intelligence-integration/ExecutiveSummaryIntelligenceFeed.test.ts",
  "app/lib/intelligence-integration/OperationalIntelligenceFeed.test.ts",
  "app/lib/intelligence-integration/RiskIntelligenceFeed.test.ts",
  "app/lib/intelligence-integration/ScenarioIntelligenceFeed.test.ts",
] as const);

const INT2_SURFACE_PATHS = Object.freeze([
  "app/components/dashboard/surfaces/ExecutiveSummarySurface.tsx",
  "app/components/dashboard/surfaces/OperationalIntelligenceSurface.tsx",
  "app/components/dashboard/surfaces/RiskIntelligenceSurface.tsx",
  "app/components/dashboard/surfaces/ScenarioIntelligenceSurface.tsx",
] as const);

function resetCertificationRuntime(): void {
  resetDashboardIntelligenceAdapterForTests();
  resetExecutiveIntelligenceAdapterForTests();
  resetExecutiveSummaryIntelligenceFeedForTests();
  resetOperationalIntelligenceFeedForTests();
  resetRiskIntelligenceFeedForTests();
  resetScenarioIntelligenceFeedForTests();
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
}

function gate(
  id: DashboardIntelligenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): DashboardIntelligenceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function collectGuardModules(
  adapter: ReturnType<typeof buildDashboardIntelligenceAdapterRegistry>,
  execSummaryFeed: ReturnType<typeof buildExecutiveSummaryIntelligenceFeed>,
  operationalFeed: ReturnType<typeof buildOperationalIntelligenceFeed>,
  riskFeed: ReturnType<typeof buildRiskIntelligenceFeed>,
  scenarioFeed: ReturnType<typeof buildScenarioIntelligenceFeed>
) {
  return Object.freeze([adapter, execSummaryFeed, operationalFeed, riskFeed, scenarioFeed]);
}

export function runDashboardIntelligenceCertification(): DashboardIntelligenceCertificationResult {
  resetCertificationRuntime();

  const gates: DashboardIntelligenceCertificationGate[] = [];
  const buildInput = Object.freeze({ sceneJson: CERTIFICATION_SCENE, selectedObjectId: "supplier-1" });

  const adapter = buildDashboardIntelligenceAdapterRegistry(buildInput);
  const adapterFailures: string[] = [];
  if (adapter.layerCount !== 5) adapterFailures.push("Dashboard adapter missing DS layer snapshots");
  if (adapter.readOnly !== true) adapterFailures.push("Dashboard adapter not read-only");
  if (adapter.sceneMutation !== false) adapterFailures.push("Dashboard adapter reports scene mutation");
  if (adapter.legacyRouterUsage !== false) adapterFailures.push("Dashboard adapter reports legacy router usage");
  if (!adapter.diagnostics.includes(DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTIC)) {
    adapterFailures.push("Dashboard adapter diagnostics missing DASHBOARD_INTELLIGENCE_ADAPTER");
  }
  if (!adapter.diagnostics.includes(DASHBOARD_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC)) {
    adapterFailures.push("Dashboard adapter diagnostics missing DASHBOARD_INTELLIGENCE_ADAPTER_READY");
  }
  if (INT2_ADAPTER_COMPLETE_TAG !== "[INT2_ADAPTER_COMPLETE]") {
    adapterFailures.push("INT2_ADAPTER_COMPLETE tag missing");
  }
  if (adapter.objectIntelligence.objectCount === 0) adapterFailures.push("Object intelligence empty");
  if (adapter.scenarioIntelligence.scenarioCount === 0) adapterFailures.push("Scenario intelligence empty");
  gates.push(gate("A", "Dashboard Adapter Works", adapterFailures));

  const execSummaryFeed = buildExecutiveSummaryIntelligenceFeed({ ...buildInput, adapterRegistry: adapter });
  const execSummaryFailures: string[] = [];
  if (execSummaryFeed.feedStatus !== "bound") execSummaryFailures.push("Executive summary feed not bound");
  if (!execSummaryFeed.diagnostics.includes(EXEC_SUMMARY_FEED_DIAGNOSTIC)) {
    execSummaryFailures.push("Executive summary feed missing EXEC_SUMMARY_FEED");
  }
  if (!execSummaryFeed.diagnostics.includes(EXEC_SUMMARY_FEED_READY_DIAGNOSTIC)) {
    execSummaryFailures.push("Executive summary feed missing EXEC_SUMMARY_FEED_READY");
  }
  if (INT2_EXEC_SUMMARY_COMPLETE_TAG !== "[INT2_EXEC_SUMMARY_COMPLETE]") {
    execSummaryFailures.push("INT2_EXEC_SUMMARY_COMPLETE tag missing");
  }
  const execSummaryModel = attachExecutiveSummaryIntelligenceFeed(
    aggregateExecutiveSummary({ dashboardContext: "overview", normalizedContext: null }),
    buildInput
  );
  if (execSummaryModel.cards.length !== 4) execSummaryFailures.push("Executive summary cards regressed");
  const healthCard = execSummaryModel.cards.find((card) => card.kind === "system_status");
  if (!healthCard?.title.includes("Health")) execSummaryFailures.push("Executive summary health card not enriched");
  gates.push(gate("B", "Executive Summary Feed Works", execSummaryFailures));

  const operationalFeed = buildOperationalIntelligenceFeed({ ...buildInput, adapterRegistry: adapter });
  const operationalFailures: string[] = [];
  if (operationalFeed.feedStatus !== "bound") operationalFailures.push("Operational feed not bound");
  if (!operationalFeed.diagnostics.includes(OPERATIONAL_FEED_DIAGNOSTIC)) {
    operationalFailures.push("Operational feed missing OPERATIONAL_FEED");
  }
  if (!operationalFeed.diagnostics.includes(OPERATIONAL_FEED_READY_DIAGNOSTIC)) {
    operationalFailures.push("Operational feed missing OPERATIONAL_FEED_READY");
  }
  if (INT2_OPERATIONAL_FEED_COMPLETE_TAG !== "[INT2_OPERATIONAL_FEED_COMPLETE]") {
    operationalFailures.push("INT2_OPERATIONAL_FEED_COMPLETE tag missing");
  }
  const operationalModel = attachOperationalIntelligenceFeed(
    aggregateOperationalIntelligence({ dashboardContext: "sources", normalizedContext: null }),
    buildInput
  );
  if (!operationalModel.intelligenceFeed) operationalFailures.push("Operational bridge did not attach feed");
  if (operationalModel.intelligenceFeed?.objectHealth.title !== "Object Health") {
    operationalFailures.push("Operational object health section missing");
  }
  gates.push(gate("C", "Operational Feed Works", operationalFailures));

  const riskFeed = buildRiskIntelligenceFeed({ ...buildInput, adapterRegistry: adapter });
  const riskFailures: string[] = [];
  if (riskFeed.feedStatus !== "bound") riskFailures.push("Risk feed not bound");
  if (!riskFeed.diagnostics.includes(RISK_FEED_DIAGNOSTIC)) riskFailures.push("Risk feed missing RISK_FEED");
  if (!riskFeed.diagnostics.includes(RISK_FEED_READY_DIAGNOSTIC)) {
    riskFailures.push("Risk feed missing RISK_FEED_READY");
  }
  if (INT2_RISK_FEED_COMPLETE_TAG !== "[INT2_RISK_FEED_COMPLETE]") {
    riskFailures.push("INT2_RISK_FEED_COMPLETE tag missing");
  }
  const riskModel = attachRiskIntelligenceFeed(
    aggregateRiskIntelligence({ dashboardContext: "risk", normalizedContext: null }),
    buildInput
  );
  if (!riskModel.intelligenceFeed) riskFailures.push("Risk bridge did not attach feed");
  if (riskModel.intelligenceFeed?.topRisks.title !== "Top Risks") {
    riskFailures.push("Risk top risks section missing");
  }
  gates.push(gate("D", "Risk Feed Works", riskFailures));

  const scenarioFeed = buildScenarioIntelligenceFeed({ ...buildInput, adapterRegistry: adapter });
  const scenarioFailures: string[] = [];
  if (scenarioFeed.feedStatus !== "bound") scenarioFailures.push("Scenario feed not bound");
  if (scenarioFeed.simulationActive !== false) scenarioFailures.push("Scenario feed reports simulation active");
  if (!scenarioFeed.diagnostics.includes(SCENARIO_FEED_DIAGNOSTIC)) {
    scenarioFailures.push("Scenario feed missing SCENARIO_FEED");
  }
  if (!scenarioFeed.diagnostics.includes(SCENARIO_FEED_READY_DIAGNOSTIC)) {
    scenarioFailures.push("Scenario feed missing SCENARIO_FEED_READY");
  }
  if (INT2_SCENARIO_FEED_COMPLETE_TAG !== "[INT2_SCENARIO_FEED_COMPLETE]") {
    scenarioFailures.push("INT2_SCENARIO_FEED_COMPLETE tag missing");
  }
  const scenarioModel = attachScenarioIntelligenceFeed(
    aggregateScenarioIntelligence({ dashboardContext: "scenario", normalizedContext: null }),
    buildInput
  );
  if (!scenarioModel.intelligenceFeed) scenarioFailures.push("Scenario bridge did not attach feed");
  if (scenarioModel.intelligenceFeed?.scenarioSummaries.title !== "Scenario Summaries") {
    scenarioFailures.push("Scenario summaries section missing");
  }
  gates.push(gate("E", "Scenario Feed Works", scenarioFailures));

  const guardModules = collectGuardModules(
    adapter,
    execSummaryFeed,
    operationalFeed,
    riskFeed,
    scenarioFeed
  );

  const sceneFailures: string[] = [];
  const sceneJson = structuredClone(CERTIFICATION_SCENE);
  const beforeScene = JSON.stringify(sceneJson);
  buildDashboardIntelligenceAdapterRegistry({ sceneJson });
  buildExecutiveSummaryIntelligenceFeed({ sceneJson });
  buildOperationalIntelligenceFeed({ sceneJson });
  buildRiskIntelligenceFeed({ sceneJson });
  buildScenarioIntelligenceFeed({ sceneJson });
  attachExecutiveSummaryIntelligenceFeed(
    aggregateExecutiveSummary({ dashboardContext: "overview", normalizedContext: null }),
    { sceneJson }
  );
  attachOperationalIntelligenceFeed(
    aggregateOperationalIntelligence({ dashboardContext: "sources", normalizedContext: null }),
    { sceneJson }
  );
  attachRiskIntelligenceFeed(
    aggregateRiskIntelligence({ dashboardContext: "risk", normalizedContext: null }),
    { sceneJson }
  );
  attachScenarioIntelligenceFeed(
    aggregateScenarioIntelligence({ dashboardContext: "scenario", normalizedContext: null }),
    { sceneJson }
  );
  if (JSON.stringify(sceneJson) !== beforeScene) {
    sceneFailures.push("INT-2 pipeline mutated scene payload");
  }
  if (guardModules.some((module) => module.sceneMutation !== false)) {
    sceneFailures.push("One or more INT-2 modules report scene mutation");
  }
  gates.push(gate("F", "No Scene Mutations", sceneFailures));

  const topologyFailures: string[] = [];
  const topologyScene = structuredClone(CERTIFICATION_SCENE) as {
    scene: { relationships: readonly unknown[]; objects: readonly unknown[] };
  };
  const beforeRelationships = JSON.stringify(topologyScene.scene.relationships);
  const beforeObjects = JSON.stringify(topologyScene.scene.objects);
  buildDashboardIntelligenceAdapterRegistry({ sceneJson: topologyScene });
  buildRiskIntelligenceFeed({ sceneJson: topologyScene });
  buildScenarioIntelligenceFeed({ sceneJson: topologyScene });
  if (JSON.stringify(topologyScene.scene.relationships) !== beforeRelationships) {
    topologyFailures.push("INT-2 pipeline mutated scene relationships");
  }
  if (JSON.stringify(topologyScene.scene.objects) !== beforeObjects) {
    topologyFailures.push("INT-2 pipeline mutated scene objects");
  }
  if (guardModules.some((module) => module.topologyMutation !== false)) {
    topologyFailures.push("One or more INT-2 modules report topology mutation");
  }
  gates.push(gate("G", "No Topology Mutations", topologyFailures));

  const routingFailures: string[] = [];
  const overviewPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "focus",
    dashboardContext: "overview",
  });
  if (overviewPlan.workspaceId !== "executive_summary") {
    routingFailures.push(`Overview context must resolve executive_summary workspace, got ${overviewPlan.workspaceId}`);
  }
  if (resolveDefaultDashboardLandingSurface() !== "executive_summary") {
    routingFailures.push("Default dashboard landing surface regressed");
  }
  if (guardModules.some((module) => module.routingMutation !== false)) {
    routingFailures.push("INT-2 modules report routing mutation");
  }
  gates.push(gate("H", "No Routing Changes", routingFailures));

  const objectFailures: string[] = [];
  if (guardModules.some((module) => module.objectMutation !== false)) {
    objectFailures.push("INT-2 modules report object mutation");
  }
  gates.push(gate("I", "No Object Mutations", objectFailures));

  const mrpFailures: string[] = [];
  for (const surfaceId of ["executive_summary", "operational", "risk", "scenario"] as const) {
    const entry = getDashboardSurfaceEntry(surfaceId);
    if (entry.status !== "active") mrpFailures.push(`${surfaceId} dashboard surface inactive`);
  }
  if (guardModules.some((module) => module.mrpMutation !== false)) {
    mrpFailures.push("INT-2 modules report MRP mutation");
  }
  for (const surfacePath of INT2_SURFACE_PATHS) {
    try {
      const source = readFileSync(join(FRONTEND_ROOT, surfacePath), "utf8");
      if (!source.includes("sceneJson")) {
        mrpFailures.push(`${surfacePath} missing sceneJson feed wiring`);
      }
    } catch (error) {
      mrpFailures.push(`Surface check failed for ${surfacePath}: ${String(error)}`);
    }
  }
  gates.push(gate("J", "No MRP Mutations", mrpFailures));

  const legacyFailures: string[] = [];
  if (guardModules.some((module) => module.legacyRouterUsage !== false)) {
    legacyFailures.push("INT-2 modules report legacy router usage");
  }
  if (scenarioFeed.simulationActive !== false) legacyFailures.push("Scenario feed simulation active");
  if (INT2_CERTIFIED_TAG !== "[INT2_CERTIFIED]") legacyFailures.push("INT2_CERTIFIED tag missing");
  if (DASHBOARD_INTELLIGENCE_COMPLETE_TAG !== "[DASHBOARD_INTELLIGENCE_COMPLETE]") {
    legacyFailures.push("DASHBOARD_INTELLIGENCE_COMPLETE tag missing");
  }
  if (INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC !== "[INT2_CERTIFICATION_COMPLETE]") {
    legacyFailures.push("INT2_CERTIFICATION_COMPLETE diagnostic missing");
  }
  if (INT2_CERTIFICATION_FREEZE_TAGS.length !== 2) {
    legacyFailures.push("Freeze tag registry incomplete");
  }
  gates.push(gate("K", "No Legacy Router Usage", legacyFailures));

  const buildFailures: string[] = [];
  const requiredModules = [
    "app/lib/intelligence-integration/DashboardIntelligenceAdapter.ts",
    "app/lib/intelligence-integration/ExecutiveSummaryIntelligenceFeed.ts",
    "app/lib/intelligence-integration/OperationalIntelligenceFeed.ts",
    "app/lib/intelligence-integration/RiskIntelligenceFeed.ts",
    "app/lib/intelligence-integration/ScenarioIntelligenceFeed.ts",
    "app/lib/dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts",
    "app/lib/dashboard/operationalIntelligence/operationalIntelligenceFeedBridge.ts",
    "app/lib/dashboard/riskIntelligence/riskIntelligenceFeedBridge.ts",
    "app/lib/dashboard/scenarioIntelligence/scenarioIntelligenceFeedBridge.ts",
    ...INT2_SURFACE_PATHS,
  ] as const;
  for (const modulePath of requiredModules) {
    if (!existsSync(join(FRONTEND_ROOT, modulePath))) {
      buildFailures.push(`Missing INT-2 module ${modulePath}`);
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
  gates.push(gate("L", "Build Passes", buildFailures));

  const testFailures: string[] = [];
  for (const testFile of INT2_TEST_FILES) {
    if (!existsSync(join(FRONTEND_ROOT, testFile))) {
      testFailures.push(`Missing INT-2 test file ${testFile}`);
    }
  }
  const testResult = spawnSync("node", ["--test", ...INT2_TEST_FILES], {
    cwd: FRONTEND_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (testResult.status !== 0) {
    testFailures.push("INT-2 test suite failed during certification");
  }
  gates.push(gate("M", "Tests Pass", testFailures));

  const freezeTagsValid =
    INT2_CERTIFIED_TAG === "[INT2_CERTIFIED]" &&
    DASHBOARD_INTELLIGENCE_COMPLETE_TAG === "[DASHBOARD_INTELLIGENCE_COMPLETE]" &&
    INT2_CERTIFICATION_FREEZE_TAGS.length === 2;

  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: INT2_DASHBOARD_INTEGRATION_CERTIFICATION_TAG,
    version: "2.6.0",
    certified,
    diagnostics: Object.freeze([INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: INT2_CERTIFICATION_FREEZE_TAGS,
  });
}
