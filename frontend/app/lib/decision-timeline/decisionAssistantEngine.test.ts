import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCreatedEvent,
  createDecisionExecutedEvent,
  createDecisionRejectedEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  initializeDecisionEventEngine,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import {
  computeDecisionHistory,
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
} from "./decisionHistoryEngine.ts";
import {
  deriveDecisionLifecycle,
  initializeDecisionLifecycleEngine,
  resetDecisionLifecycleEngineForTests,
} from "./decisionLifecycleEngine.ts";
import {
  initializeDecisionComparisonEngine,
  resetDecisionComparisonEngineForTests,
} from "./decisionComparisonEngine.ts";
import {
  initializeDecisionQueryEngine,
  resetDecisionQueryEngineForTests,
} from "./decisionQueryEngine.ts";
import { resetDecisionQueryRegistryForTests } from "./decisionQueryRegistry.ts";
import {
  initializeDecisionReplayEngine,
  resetDecisionReplayEngineForTests,
} from "./decisionReplayEngine.ts";
import {
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import {
  initializeDecisionDashboardIntegration,
  resetDecisionDashboardIntegrationForTests,
} from "./decisionDashboardEngine.ts";
import {
  buildDecisionAssistantModel,
  buildDecisionAssistantSummary,
  buildDecisionExplanation,
  DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST,
  getDecisionAssistantContract,
  getDecisionAssistantModel,
  initializeDecisionAssistantIntegration,
  resetDecisionAssistantIntegrationForTests,
  validateDecisionAssistant,
  runDecisionAssistantIntegration,
} from "./decisionAssistantEngine.ts";
import { DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION } from "./decisionAssistantTypes.ts";
import {
  validateEngineCompatibilityForAssistant,
  validateFoundationCompatibilityForAssistant,
} from "./decisionAssistantValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const LEFT_DECISION_ID = "decision-assistant-test-left";
const RIGHT_DECISION_ID = "decision-assistant-test-right";
const WORKSPACE_ID = "ws-assistant-test-001";

function resetPlatformStack(): void {
  resetDecisionAssistantIntegrationForTests();
  resetDecisionDashboardIntegrationForTests();
  resetDecisionReplayEngineForTests();
  resetDecisionComparisonEngineForTests();
  resetDecisionQueryEngineForTests();
  resetDecisionQueryRegistryForTests();
  resetDecisionStateEngineForTests();
  resetDecisionLifecycleEngineForTests();
  resetDecisionHistoryEngineForTests();
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
  initializeDecisionHistoryEngine(FIXED_TIME);
  initializeDecisionLifecycleEngine(FIXED_TIME);
  initializeDecisionStateEngine(FIXED_TIME);
  initializeDecisionQueryEngine(FIXED_TIME);
  initializeDecisionComparisonEngine(FIXED_TIME);
  initializeDecisionReplayEngine(FIXED_TIME);
  initializeDecisionDashboardIntegration(FIXED_TIME);
  initializeDecisionAssistantIntegration(FIXED_TIME);
}

function seedDecision(
  decisionId: string,
  factories: readonly [
    typeof createDecisionCreatedEvent,
    typeof createDecisionUpdatedEvent,
    typeof createDecisionApprovedEvent | typeof createDecisionRejectedEvent,
    ...(typeof createDecisionExecutedEvent)[]
  ]
) {
  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId,
      workspaceId: WORKSPACE_ID,
      eventId: `${decisionId}-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "assistant-test",
      title: `Assistant test event ${index + 1}`,
      summary: "Decision assistant integration test event.",
    });
    assert.equal(result.success, true, result.reason);
    return result.data!;
  });

  const historyResult = computeDecisionHistory({ events: Object.freeze(events) });
  assert.equal(historyResult.success, true, historyResult.reason);
  const lifecycle = deriveDecisionLifecycle(historyResult.data!);
  const stateResult = computeDecisionState(lifecycle, FIXED_TIME);
  assert.equal(stateResult.success, true, stateResult.reason);
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-6/10 assistant contract vocabulary", () => {
  const contract = getDecisionAssistantContract();
  assert.equal(contract.contractVersion, DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION);
  assert.ok(contract.supportedBindings.includes("single_decision_explanation"));
  assert.ok(contract.futureConsumers.length >= 2);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionAssistantEngine.ts",
    allowedFiles: DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("builds single decision explanation model", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const result = buildDecisionAssistantModel({
    binding: "single_decision_explanation",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });

  assert.equal(result.success, true, result.reason);
  assert.equal(result.data?.lifecycle, "executed");
  assert.ok(result.data?.decisionExplanation);
  assert.ok(getDecisionAssistantModel(result.data!.modelId));
});

test("builds decision summary and status explanation", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const summary = buildDecisionAssistantSummary({
    binding: "decision_summary",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(summary.success, true);
  assert.match(summary.data?.decisionSummary ?? "", /executed/i);

  const status = buildDecisionExplanation({
    binding: "status_explanation",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(status.success, true);
  assert.match(status.data?.decisionExplanation ?? "", /executed/i);
});

test("builds comparison and replay assistant models", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);
  seedDecision(RIGHT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ]);

  const comparison = buildDecisionAssistantModel({
    binding: "comparison_summary",
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  assert.equal(comparison.success, true, comparison.reason);
  assert.equal(comparison.data?.comparisonSummary?.hasDifferences, true);

  const replay = buildDecisionAssistantModel({
    binding: "replay_summary",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  assert.equal(replay.success, true, replay.reason);
  assert.equal(replay.data?.replaySummary?.totalEvents, 4);
});

test("builds active and terminal assistant summaries", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);
  seedDecision(RIGHT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ]);

  const active = buildDecisionAssistantModel({ binding: "active_decision_summary", workspaceId: WORKSPACE_ID });
  assert.equal(active.data?.decisionStateSummaries.length, 1);

  const terminal = buildDecisionAssistantModel({ binding: "terminal_decision_summary", workspaceId: WORKSPACE_ID });
  assert.equal(terminal.data?.decisionStateSummaries.length, 1);
});

test("assistant models are immutable", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const result = buildDecisionAssistantModel({
    binding: "single_decision_explanation",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(Object.isFrozen(result.data), true);
  assert.equal(Object.isFrozen(result.data?.decisionStateSummaries), true);
});

test("validates APP-6:1 through APP-6:9 compatibility", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  assert.equal(validateFoundationCompatibilityForAssistant(FIXED_TIME).valid, true);
  assert.equal(validateEngineCompatibilityForAssistant().valid, true);
  const model = buildDecisionAssistantModel({
    binding: "single_decision_explanation",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(
    validateDecisionAssistant(
      { binding: "single_decision_explanation", decisionId: LEFT_DECISION_ID },
      model.data!
    ).valid,
    true
  );
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
});

test("rejects assistant build when integration is not initialized", () => {
  resetDecisionAssistantIntegrationForTests();
  const result = buildDecisionAssistantModel({
    binding: "single_decision_explanation",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("runs decision assistant integration certification", () => {
  const result = runDecisionAssistantIntegration();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 22);
});
