import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { resetScenarioTimelineEventEngineForTests } from "./scenarioTimelineEventEngine.ts";
import { resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import { resetScenarioTimelineQueryEngineForTests } from "./scenarioTimelineQueryEngine.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { resetScenarioTimelineAssistantRegistryForTests } from "./scenarioTimelineAssistantRegistry.ts";
import {
  createScenarioTimelineEvent,
  initializeScenarioTimeline,
  resetScenarioTimelinePlatformApiForTests,
} from "./scenarioTimelineApiLayer.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineDashboardConstants.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineDashboardContracts.ts";
import {
  buildScenarioTimelineDashboardContext,
  buildScenarioTimelineDashboardMetrics,
  buildScenarioTimelineDashboardMilestones,
  buildScenarioTimelineDashboardProgress,
  buildScenarioTimelineDashboardRecentChanges,
  buildScenarioTimelineDashboardStatus,
  buildScenarioTimelineDashboardSummary,
  buildScenarioTimelineDashboardViewModel,
  certifyScenarioTimelineDashboardIntegration,
  getScenarioTimelineDashboardIntegrationContract,
  validateScenarioTimelineDashboardContext,
} from "./scenarioTimelineDashboardIntegration.ts";
import { resetScenarioTimelineDashboardRegistryForTests } from "./scenarioTimelineDashboardRegistry.ts";
import { validateScenarioTimelineDashboardViewModel } from "./scenarioTimelineDashboardValidator.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-dashboard-test-001";
const WORKSPACE_ID = "ws-dashboard-test-001";

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

function seedViaApi(stages: readonly (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number][]): void {
  stages.forEach((stage, index) => {
    const result = createScenarioTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `dashboard-test-${stage}-${index}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "dashboard-test",
      title: `Dashboard test ${stage}`,
      summary: "APP-5:8 dashboard integration test event.",
    });
    assert.equal(result.success, true, result.errors[0]?.message ?? "create failed");
  });
}

test.beforeEach(() => {
  resetFullStack();
  initializeScenarioTimeline(FIXED_TIME);
});

test("exports APP-5/8 dashboard integration contract", () => {
  const contract = getScenarioTimelineDashboardIntegrationContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION);
  assert.equal(contract.consumesApiLayerOnly, true);
  assert.ok(contract.mandatoryViewModelFields.includes("executiveSummary"));
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.ts",
    allowedFiles: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("builds immutable dashboard context and view model", () => {
  seedViaApi(["scenario_created", "scenario_updated", "scenario_simulated"]);

  const contextResult = buildScenarioTimelineDashboardContext({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  });
  assert.equal(contextResult.success, true);
  assert.equal(contextResult.data?.readOnly, true);
  assert.equal(contextResult.data?.currentStage, "scenario_simulated");
  assert.ok((contextResult.data?.eventCount ?? 0) >= 3);

  const contextValidation = validateScenarioTimelineDashboardContext(contextResult.data!);
  assert.equal(contextValidation.success, true);

  const viewModelResult = buildScenarioTimelineDashboardViewModel({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  });
  assert.equal(viewModelResult.success, true);
  assert.equal(viewModelResult.data?.readOnly, true);
  assert.ok((viewModelResult.data?.executiveSummary.length ?? 0) > 0);

  const viewModelValidation = validateScenarioTimelineDashboardViewModel(viewModelResult.data!);
  assert.equal(viewModelValidation.success, true);
});

test("builds summary, status, progress, milestones, metrics, and changes", () => {
  seedViaApi(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.slice(0, 4));
  const input = { scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID };

  assert.equal(buildScenarioTimelineDashboardSummary(input).success, true);
  assert.equal(buildScenarioTimelineDashboardStatus(input).success, true);
  assert.equal(buildScenarioTimelineDashboardProgress(input).success, true);
  assert.equal(buildScenarioTimelineDashboardMilestones(input).success, true);
  assert.equal(buildScenarioTimelineDashboardMetrics(input).success, true);
  assert.equal(buildScenarioTimelineDashboardRecentChanges(input).success, true);
});

test("optional assistant context enriches dashboard summary", () => {
  seedViaApi(["scenario_created", "scenario_updated"]);

  const withAssistant = buildScenarioTimelineDashboardContext({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
    useAssistantContext: true,
  });
  assert.equal(withAssistant.success, true);
  assert.equal(withAssistant.data?.diagnostics.assistantContextUsed, true);
});

test("certifies APP-5/8 dashboard integration", () => {
  const certification = certifyScenarioTimelineDashboardIntegration();
  assert.equal(certification.status, "PASS");
  assert.equal(certification.certified, true);
  assert.ok(certification.checks.every((entry) => entry.passed));
});
