import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { resetScenarioTimelineEventEngineForTests } from "./scenarioTimelineEventEngine.ts";
import { resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import { resetScenarioTimelineQueryEngineForTests } from "./scenarioTimelineQueryEngine.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import {
  createScenarioTimelineEvent,
  initializeScenarioTimeline,
  resetScenarioTimelinePlatformApiForTests,
} from "./scenarioTimelineApiLayer.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import {
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS,
} from "./scenarioTimelineAssistantConstants.ts";
import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineAssistantContracts.ts";
import {
  answerScenarioTimelineQuestion,
  buildScenarioTimelineAssistantContext,
  buildScenarioTimelineExplanation,
  buildScenarioTimelineHistoryExplanation,
  buildScenarioTimelineMilestones,
  buildScenarioTimelineRecentChanges,
  buildScenarioTimelineStatus,
  buildScenarioTimelineSummary,
  certifyScenarioTimelineAssistantIntegration,
  getScenarioTimelineAssistantIntegrationContract,
  validateScenarioTimelineAssistantContext,
} from "./scenarioTimelineAssistantIntegration.ts";
import { resetScenarioTimelineAssistantRegistryForTests } from "./scenarioTimelineAssistantRegistry.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-assistant-test-001";
const WORKSPACE_ID = "ws-assistant-test-001";

function resetFullStack(): void {
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
      eventId: `assistant-test-${stage}-${index}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "assistant-test",
      title: `Assistant test ${stage}`,
      summary: "APP-5:7 assistant integration test event.",
    });
    assert.equal(result.success, true, result.errors[0]?.message ?? "create failed");
  });
}

test.beforeEach(() => {
  resetFullStack();
  initializeScenarioTimeline(FIXED_TIME);
});

test("exports APP-5/7 assistant integration contract", () => {
  const contract = getScenarioTimelineAssistantIntegrationContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION);
  assert.equal(contract.consumesApiLayerOnly, true);
  assert.equal(contract.supportedQuestions.length, SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS.length);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.ts",
    allowedFiles: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("builds immutable assistant context from APP-5/6 APIs", () => {
  seedViaApi(["scenario_created", "scenario_updated", "scenario_simulated"]);

  const result = buildScenarioTimelineAssistantContext({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  });

  assert.equal(result.success, true);
  assert.equal(result.data?.readOnly, true);
  assert.equal(result.data?.scenarioId, SCENARIO_ID);
  assert.equal(result.data?.currentStage, "scenario_simulated");
  assert.ok((result.data?.timelineHistory.length ?? 0) >= 3);

  const validation = validateScenarioTimelineAssistantContext(result.data!);
  assert.equal(validation.success, true);
  assert.equal(validation.data?.valid, true);
});

test("builds summary, status, milestones, and recent changes", () => {
  seedViaApi(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.slice(0, 4));

  const summary = buildScenarioTimelineSummary({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(summary.success, true);
  assert.ok((summary.data?.narrative.length ?? 0) > 0);

  const status = buildScenarioTimelineStatus({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(status.success, true);
  assert.ok(status.data?.currentStage);

  const milestones = buildScenarioTimelineMilestones({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(milestones.success, true);
  assert.ok((milestones.data?.length ?? 0) > 0);

  const changes = buildScenarioTimelineRecentChanges({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(changes.success, true);
  assert.ok((changes.data?.length ?? 0) > 0);
});

test("builds explanations without LLM or recommendations", () => {
  seedViaApi(["scenario_created", "scenario_updated"]);

  const context = buildScenarioTimelineAssistantContext({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  }).data!;

  const explanation = buildScenarioTimelineExplanation(
    { scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID },
    context,
    "changes"
  );
  assert.equal(explanation.readOnly, true);
  assert.ok(explanation.explanation.length > 0);
  assert.ok(!explanation.explanation.toLowerCase().includes("recommend"));

  const historyExplanation = buildScenarioTimelineHistoryExplanation({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  });
  assert.equal(historyExplanation.success, true);
  assert.ok((historyExplanation.data?.explanation.length ?? 0) > 0);
});

test("answers supported timeline questions", () => {
  seedViaApi(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.slice(0, 5));

  for (const questionKey of SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS) {
    const answer = answerScenarioTimelineQuestion({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      questionKey,
    });
    assert.equal(answer.success, true, questionKey);
    assert.equal(answer.data?.questionKey, questionKey);
    assert.ok((answer.data?.answer.length ?? 0) > 0);
    assert.equal(answer.data?.context.readOnly, true);
  }
});

test("certifies APP-5/7 assistant integration", () => {
  const certification = certifyScenarioTimelineAssistantIntegration();
  assert.equal(certification.status, "PASS");
  assert.equal(certification.certified, true);
  assert.ok(certification.checks.every((entry) => entry.passed));
});
