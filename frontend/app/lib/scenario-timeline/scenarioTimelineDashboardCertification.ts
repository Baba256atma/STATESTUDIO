/**
 * APP-5:8 — Scenario Timeline Dashboard Integration certification.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { buildScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantIntegration.ts";
import { resetScenarioTimelineAssistantRegistryForTests } from "./scenarioTimelineAssistantRegistry.ts";
import {
  createScenarioTimelineEvent,
  initializeScenarioTimeline,
  resetScenarioTimelinePlatformApiForTests,
} from "./scenarioTimelineApiLayer.ts";
import { resetScenarioTimelineEventEngineForTests } from "./scenarioTimelineEventEngine.ts";
import { resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import { resetScenarioTimelineQueryEngineForTests } from "./scenarioTimelineQueryEngine.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";
import {
  SCENARIO_TIMELINE_DASHBOARD_FORBIDDEN_API_IMPORTS,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
} from "./scenarioTimelineDashboardConstants.ts";
import { validateScenarioTimelineDashboardCompatibility } from "./scenarioTimelineDashboardCompatibility.ts";
import {
  getScenarioTimelineDashboardIntegrationContract,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST,
} from "./scenarioTimelineDashboardContracts.ts";
import {
  buildScenarioTimelineDashboardContext,
  buildScenarioTimelineDashboardMetrics,
  buildScenarioTimelineDashboardMilestones,
  buildScenarioTimelineDashboardProgress,
  buildScenarioTimelineDashboardRecentChanges,
  buildScenarioTimelineDashboardStatus,
  buildScenarioTimelineDashboardSummary,
  buildScenarioTimelineDashboardViewModel,
  validateScenarioTimelineDashboardContext,
} from "./scenarioTimelineDashboardIntegration.ts";
import { resetScenarioTimelineDashboardRegistryForTests } from "./scenarioTimelineDashboardRegistry.ts";
import { validateScenarioTimelineDashboardViewModel } from "./scenarioTimelineDashboardValidator.ts";
import type {
  ScenarioTimelineDashboardCertificationCheck,
  ScenarioTimelineDashboardIntegrationCertificationResult,
} from "./scenarioTimelineDashboardTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-dashboard-cert-001";
const WORKSPACE_ID = "ws-dashboard-cert-001";

const DASHBOARD_MODULES = Object.freeze([
  "app/lib/scenario-timeline/scenarioTimelineDashboardAdapter.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardContext.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardViewModel.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardSummary.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardMetrics.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.ts",
] as const);

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioTimelineDashboardCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function resetFullStack(): void {
  resetScenarioTimelineDashboardRegistryForTests();
  resetScenarioTimelineAssistantRegistryForTests();
  resetScenarioTimelinePlatformApiForTests();
  resetScenarioTimelineQueryEngineForTests();
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
}

function seedTimelineViaApi(): void {
  (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).forEach((stage, index) => {
    const result = createScenarioTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `dashboard-cert-${stage}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "dashboard-certification",
      title: `Dashboard certification ${stage}`,
      summary: "APP-5:8 dashboard integration certification event.",
    });
    if (!result.success) {
      throw new Error(result.errors[0]?.message ?? "seed failed");
    }
  });
}

function dashboardModulesAvoidDirectEngineImports(): boolean {
  return DASHBOARD_MODULES.every((path) => {
    const source = readModule(path);
    return SCENARIO_TIMELINE_DASHBOARD_FORBIDDEN_API_IMPORTS.every((pattern) => !source.includes(pattern));
  });
}

function dashboardAdapterUsesApiLayerOnly(): boolean {
  const adapterSource = readModule("app/lib/scenario-timeline/scenarioTimelineDashboardAdapter.ts");
  return (
    adapterSource.includes("scenarioTimelineApiLayer.ts") &&
    !adapterSource.includes("scenarioTimelineEventEngine.ts")
  );
}

function dashboardContextBuilderUsesAssistantPublicApiOnly(): boolean {
  const source = readModule("app/lib/scenario-timeline/scenarioTimelineDashboardContext.ts");
  return (
    source.includes("scenarioTimelineAssistantIntegration.ts") &&
    !source.includes("scenarioTimelineAssistantAdapter.ts")
  );
}

export function certifyScenarioTimelineDashboardIntegration(): ScenarioTimelineDashboardIntegrationCertificationResult {
  resetFullStack();
  initializeScenarioTimeline(FIXED_TIME);
  seedTimelineViaApi();

  const checks: ScenarioTimelineDashboardCertificationCheck[] = [];
  const input = { scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID };

  checks.push(
    check(
      "manifest_valid",
      "Stage manifest validates",
      validateStageManifest(SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST).valid,
      SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary evaluation passes",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.ts",
        allowedFiles: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed,
      "scenarioTimelineDashboardIntegration.ts"
    )
  );

  checks.push(
    check(
      "dashboard_contract",
      "Dashboard integration contract exposes mandatory fields",
      getScenarioTimelineDashboardIntegrationContract().mandatoryViewModelFields.length >= 18,
      String(getScenarioTimelineDashboardIntegrationContract().mandatoryViewModelFields.length)
    )
  );

  checks.push(
    check(
      "no_engine_bypass",
      "Dashboard modules avoid direct engine/registry imports",
      dashboardModulesAvoidDirectEngineImports(),
      DASHBOARD_MODULES.join(", ")
    )
  );

  checks.push(
    check(
      "api_layer_adapter",
      "Dashboard adapter consumes APP-5:6 API layer only",
      dashboardAdapterUsesApiLayerOnly(),
      "scenarioTimelineDashboardAdapter.ts"
    )
  );

  checks.push(
    check(
      "assistant_public_api_only",
      "Optional assistant context uses APP-5:7 public API only",
      dashboardContextBuilderUsesAssistantPublicApiOnly(),
      "scenarioTimelineDashboardContext.ts"
    )
  );

  const compatibility = validateScenarioTimelineDashboardCompatibility();
  checks.push(check("app5_1_compat", "APP-5:1 compatibility", compatibility.app5_1, String(compatibility.app5_1)));
  checks.push(check("app5_2_compat", "APP-5:2 compatibility", compatibility.app5_2, String(compatibility.app5_2)));
  checks.push(check("app5_3_compat", "APP-5:3 compatibility", compatibility.app5_3, String(compatibility.app5_3)));
  checks.push(check("app5_4_compat", "APP-5:4 compatibility", compatibility.app5_4, String(compatibility.app5_4)));
  checks.push(check("app5_5_compat", "APP-5:5 compatibility", compatibility.app5_5, String(compatibility.app5_5)));
  checks.push(check("app5_6_compat", "APP-5:6 compatibility", compatibility.app5_6, String(compatibility.app5_6)));
  checks.push(check("app5_7_compat", "APP-5:7 compatibility", compatibility.app5_7, String(compatibility.app5_7)));

  const contextResult = buildScenarioTimelineDashboardContext(input);
  checks.push(
    check(
      "context_builder",
      "Dashboard context builder produces immutable context",
      contextResult.success === true && contextResult.data?.readOnly === true,
      contextResult.reason
    )
  );

  const contextValidation = contextResult.data
    ? validateScenarioTimelineDashboardContext(contextResult.data)
    : null;
  checks.push(
    check(
      "context_validator",
      "Dashboard context validator passes",
      contextValidation?.success === true && contextValidation.data?.valid === true,
      contextValidation?.reason ?? "no context"
    )
  );

  const viewModelResult = buildScenarioTimelineDashboardViewModel(input);
  checks.push(
    check(
      "viewmodel_builder",
      "Dashboard ViewModel builder produces immutable view model",
      viewModelResult.success === true && viewModelResult.data?.readOnly === true,
      viewModelResult.reason
    )
  );

  const viewModelValidation = viewModelResult.data
    ? validateScenarioTimelineDashboardViewModel(viewModelResult.data)
    : null;
  checks.push(
    check(
      "viewmodel_validator",
      "Dashboard ViewModel validator passes",
      viewModelValidation?.success === true && viewModelValidation.data?.valid === true,
      viewModelValidation?.reason ?? "no view model"
    )
  );

  const summary = buildScenarioTimelineDashboardSummary(input);
  checks.push(
    check(
      "summary_builder",
      "Dashboard summary builder returns narrative",
      summary.success === true && (summary.data?.summary.length ?? 0) > 0,
      summary.reason
    )
  );

  const status = buildScenarioTimelineDashboardStatus(input);
  checks.push(
    check(
      "status_builder",
      "Dashboard status builder returns lifecycle status",
      status.success === true && status.data?.currentStage !== null,
      status.reason
    )
  );

  const progress = buildScenarioTimelineDashboardProgress(input);
  checks.push(
    check(
      "progress_builder",
      "Dashboard progress builder returns progress",
      progress.success === true && progress.data?.progress !== null,
      progress.reason
    )
  );

  const milestones = buildScenarioTimelineDashboardMilestones(input);
  checks.push(
    check(
      "milestone_builder",
      "Dashboard milestone builder returns milestones",
      milestones.success === true && (milestones.data?.length ?? 0) > 0,
      milestones.reason
    )
  );

  const metrics = buildScenarioTimelineDashboardMetrics(input);
  checks.push(
    check(
      "metrics_builder",
      "Dashboard metrics builder returns metrics",
      metrics.success === true && metrics.data?.readOnly === true,
      metrics.reason
    )
  );

  const recentChanges = buildScenarioTimelineDashboardRecentChanges(input);
  checks.push(
    check(
      "change_builder",
      "Dashboard recent changes builder returns change records",
      recentChanges.success === true,
      recentChanges.reason
    )
  );

  const assistantOptional = buildScenarioTimelineDashboardContext({
    ...input,
    useAssistantContext: true,
  });
  checks.push(
    check(
      "optional_assistant_context",
      "Optional APP-5:7 assistant context integration works",
      assistantOptional.success === true && assistantOptional.data?.diagnostics.assistantContextUsed === true,
      assistantOptional.reason
    )
  );

  const assistantDirect = buildScenarioTimelineAssistantContext(input);
  checks.push(
    check(
      "app5_7_context_available",
      "APP-5:7 assistant context remains available",
      assistantDirect.success === true,
      assistantDirect.reason
    )
  );

  const identity = resolveScenarioIdentityExample();
  checks.push(
    check(
      "app2_identity_regression",
      "APP-2 scenario identity contract remains compatible",
      validateScenarioIdentityShape(identity).valid,
      identity.scenarioId
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const certified = passedCount === checks.length;

  return Object.freeze({
    certified,
    status: certified ? "PASS" : "FAIL",
    summary: `${passedCount}/${checks.length} certification checks passed for ${SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION}.`,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}
