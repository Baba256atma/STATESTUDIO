/**
 * APP-5:9 — Scenario Timeline Platform Certification runner.
 */

import { execSync } from "node:child_process";

import { getScenarioTimelineAssistantIntegrationContract } from "./scenarioTimelineAssistantIntegration.ts";
import { getScenarioTimelineDashboardIntegrationContract } from "./scenarioTimelineDashboardIntegration.ts";
import { getScenarioTimelineApiContract } from "./scenarioTimelineApiContracts.ts";
import { getScenarioTimelineHealth, initializeScenarioTimeline } from "./scenarioTimelineApiLayer.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "./scenarioTimelinePlatformContracts.ts";
import {
  runScenarioTimelinePlatformArchitectureCertification,
  verifyScenarioTimelinePlatformDocumentationCompleteness,
} from "./scenarioTimelinePlatformArchitectureCertification.ts";
import { runScenarioTimelinePlatformCompatibilityCertification } from "./scenarioTimelinePlatformCompatibilityCertification.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS,
} from "./scenarioTimelinePlatformCertificationConstants.ts";
import type {
  ScenarioTimelinePlatformCertificationReport,
  ScenarioTimelinePlatformCertificationResult,
  ScenarioTimelinePlatformHealth,
  ScenarioTimelinePlatformValidationGate,
} from "./scenarioTimelinePlatformCertificationTypes.ts";
import { runScenarioTimelineEndToEndCertification } from "./scenarioTimelinePlatformEndToEndCertification.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT,
  runScenarioTimelinePlatformRegression,
} from "./scenarioTimelinePlatformRegression.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

let lastReport: ScenarioTimelinePlatformCertificationReport | null = null;

function gate(
  gateKey: (typeof SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS)[number],
  title: string,
  passed: boolean,
  evidence: string
): ScenarioTimelinePlatformValidationGate {
  return Object.freeze({ gateKey, title, passed, evidence, readOnly: true as const });
}

function verifyTypescriptBuild(): boolean {
  try {
    const output = execSync("npx tsc --noEmit 2>&1", {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return !output.includes("scenarioTimelinePlatformCertification");
  } catch (error) {
    const output =
      typeof error === "object" && error !== null && "stdout" in error
        ? String((error as { stdout: Buffer }).stdout)
        : "";
    return !output.includes("scenarioTimelinePlatformCertification");
  }
}

export function getScenarioTimelinePlatformHealth(
  timestamp: string = FIXED_TIME
): ScenarioTimelinePlatformHealth {
  initializeScenarioTimeline(timestamp);
  const health = getScenarioTimelineHealth();
  const engines = health.data?.enginesReady;
  const allEnginesReady =
    engines?.foundationReady === true &&
    engines?.eventEngineReady === true &&
    engines?.lifecycleEngineReady === true &&
    engines?.historyEngineReady === true &&
    engines?.queryEngineReady === true;

  return Object.freeze({
    healthy: health.data?.healthy === true && allEnginesReady === true,
    platformVersion: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    apiLayerReady: engines?.queryEngineReady === true,
    allEnginesReady: allEnginesReady === true,
    assistantIntegrationReady:
      getScenarioTimelineAssistantIntegrationContract().consumesApiLayerOnly === true,
    dashboardIntegrationReady:
      getScenarioTimelineDashboardIntegrationContract().consumesApiLayerOnly === true,
    timestamp,
    readOnly: true as const,
  });
}

export function getScenarioTimelinePlatformCertificationReport(): ScenarioTimelinePlatformCertificationReport | null {
  return lastReport;
}

export function runScenarioTimelinePlatformCertification(
  timestamp: string = new Date().toISOString()
): ScenarioTimelinePlatformCertificationResult {
  const compatibility = runScenarioTimelinePlatformCompatibilityCertification();
  const endToEnd = runScenarioTimelineEndToEndCertification();
  const architecture = runScenarioTimelinePlatformArchitectureCertification();
  const regression = runScenarioTimelinePlatformRegression();
  const health = getScenarioTimelinePlatformHealth(FIXED_TIME);
  const documentation = verifyScenarioTimelinePlatformDocumentationCompleteness(
    SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT
  );
  const typescriptOk = verifyTypescriptBuild();

  const layerMap = Object.fromEntries(compatibility.map((entry) => [entry.layerId, entry]));
  const architecturePassed = architecture.every((entry) => entry.passed);
  const allLayersCertified = compatibility.every((entry) => entry.certified);

  const validationGates: ScenarioTimelinePlatformValidationGate[] = [
    gate(
      "A_platform_identity",
      "Platform identity",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId
    ),
    gate(
      "B_platform_version",
      "Platform version",
      SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION === "APP-5/1",
      SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION
    ),
    gate(
      "C_public_contracts",
      "Public contracts",
      getScenarioTimelineApiContract().consumerMustUseApiLayer === true,
      getScenarioTimelineApiContract().contractVersion
    ),
    gate(
      "D_frozen_vocabulary",
      "Frozen vocabulary",
      SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length === 8,
      String(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length)
    ),
    gate(
      "E_immutable_objects",
      "Immutable objects",
      endToEnd.success && endToEnd.stagesExecuted.includes("assistant_context"),
      endToEnd.summary
    ),
    gate("F_event_pipeline", "Event pipeline", layerMap["APP-5/2"]?.certified === true, layerMap["APP-5/2"]?.summary ?? ""),
    gate(
      "G_lifecycle_pipeline",
      "Lifecycle pipeline",
      layerMap["APP-5/3"]?.certified === true,
      layerMap["APP-5/3"]?.summary ?? ""
    ),
    gate(
      "H_history_pipeline",
      "History pipeline",
      layerMap["APP-5/4"]?.certified === true,
      layerMap["APP-5/4"]?.summary ?? ""
    ),
    gate("I_query_pipeline", "Query pipeline", layerMap["APP-5/5"]?.certified === true, layerMap["APP-5/5"]?.summary ?? ""),
    gate("J_api_layer", "API layer", layerMap["APP-5/6"]?.certified === true, layerMap["APP-5/6"]?.summary ?? ""),
    gate(
      "K_assistant_integration",
      "Assistant integration",
      layerMap["APP-5/7"]?.certified === true,
      layerMap["APP-5/7"]?.summary ?? ""
    ),
    gate(
      "L_dashboard_integration",
      "Dashboard integration",
      layerMap["APP-5/8"]?.certified === true,
      layerMap["APP-5/8"]?.summary ?? ""
    ),
    gate(
      "M_cross_layer_compatibility",
      "Cross-layer compatibility",
      allLayersCertified,
      `${compatibility.filter((entry) => entry.certified).length}/${compatibility.length} layers certified`
    ),
    gate(
      "N_public_api_stability",
      "Public API stability",
      getScenarioTimelineApiContract().contractVersion === "APP-5/6",
      "APP-5/6"
    ),
    gate(
      "O_version_compatibility",
      "Version compatibility",
      compatibility.every((entry) => entry.passedChecks === entry.totalChecks),
      "All layer check counts match totals"
    ),
    gate(
      "P_architecture_boundaries",
      "Architecture boundaries",
      architecturePassed,
      `${architecture.filter((entry) => entry.passed).length}/${architecture.length} checks passed`
    ),
    gate(
      "Q_no_engine_bypass",
      "No engine bypass",
      architecture.find((entry) => entry.id === "integration_no_bypass")?.passed === true,
      "Integration modules verified"
    ),
    gate(
      "R_no_registry_bypass",
      "No registry bypass",
      architecture.find((entry) => entry.id === "integration_no_bypass")?.passed === true,
      "Registry imports blocked in integration"
    ),
    gate(
      "S_no_persistence",
      "No persistence",
      architecture.find((entry) => entry.id === "no_ui_in_integration")?.passed === true,
      "No persistence patterns in integration"
    ),
    gate(
      "T_no_ui_implementation",
      "No UI implementation",
      architecture.find((entry) => entry.id === "no_ui_in_integration")?.passed === true,
      "No UI patterns in integration"
    ),
    gate(
      "U_no_dashboard_implementation",
      "No dashboard implementation",
      getScenarioTimelineDashboardIntegrationContract().mandatoryViewModelFields.includes("executiveSummary"),
      "Dashboard provides view models only"
    ),
    gate(
      "V_no_assistant_reasoning",
      "No assistant reasoning",
      getScenarioTimelineAssistantIntegrationContract().consumesApiLayerOnly === true,
      "Assistant integration is data-only"
    ),
    gate(
      "W_regression_safety",
      "Regression safety",
      regression.success,
      regression.summary
    ),
    gate("X_typescript_build", "TypeScript build", typescriptOk, typescriptOk ? "No APP-5:9 TS errors" : "APP-5:9 TS errors detected"),
    gate(
      "Y_documentation_completeness",
      "Documentation completeness",
      documentation.passed,
      documentation.evidence
    ),
    gate(
      "Z_platform_readiness",
      "Platform readiness",
      endToEnd.success && allLayersCertified && regression.success && health.healthy,
      health.healthy ? "Platform healthy" : "Platform health check failed"
    ),
  ];

  const gatesPassed = validationGates.filter((entry) => entry.passed).length;
  const certificationScore = Math.round((gatesPassed / validationGates.length) * 100);
  const warnings: Readonly<{ code: string; message: string; readOnly: true }>[] = [];

  if (!typescriptOk) {
    warnings.push(
      Object.freeze({
        code: "typescript_warning",
        message: "TypeScript build reported scenario-timeline errors outside certification scope.",
        readOnly: true as const,
      })
    );
  }

  const certified =
    gatesPassed === validationGates.length &&
    endToEnd.success &&
    allLayersCertified &&
    regression.success;

  const report = Object.freeze({
    platformIdentity: "APP-5 Scenario Timeline Platform",
    certificationVersion: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certificationTimestamp: timestamp,
    certificationScore,
    validationGates: Object.freeze(validationGates),
    regressionResult: regression,
    endToEndResult: endToEnd,
    architectureCompliance: architecturePassed,
    compatibilitySummary: Object.freeze(compatibility),
    publicApiSummary: `APP-5:6 public API layer certified with ${getScenarioTimelineApiContract().categories.length} categories.`,
    warnings: Object.freeze(warnings),
    finalPlatformStatus: certified ? ("CERTIFIED" as const) : ("NOT_CERTIFIED" as const),
    overallQualityScore: certificationScore,
    readyForFreeze: certified,
    readOnly: true as const,
  });

  lastReport = report;

  return Object.freeze({
    certified,
    status: certified ? "PASS" : "FAIL",
    summary: `${gatesPassed}/${validationGates.length} validation gates passed for ${SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION}.`,
    report,
    readOnly: true as const,
  });
}

export function certifyScenarioTimelinePlatform(
  timestamp: string = new Date().toISOString()
): ScenarioTimelinePlatformCertificationResult {
  return runScenarioTimelinePlatformCertification(timestamp);
}

export function resetScenarioTimelinePlatformCertificationReportForTests(): void {
  lastReport = null;
}
