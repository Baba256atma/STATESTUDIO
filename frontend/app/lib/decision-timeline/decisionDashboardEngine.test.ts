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
  buildDecisionDashboardModel,
  buildDecisionDashboardSummary,
  DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST,
  getDecisionDashboardContract,
  getDecisionDashboardModel,
  initializeDecisionDashboardIntegration,
  resetDecisionDashboardIntegrationForTests,
  validateDecisionDashboard,
  runDecisionDashboardIntegration,
} from "./decisionDashboardEngine.ts";
import { DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./decisionDashboardTypes.ts";
import {
  validateEngineCompatibilityForDashboard,
  validateFoundationCompatibilityForDashboard,
} from "./decisionDashboardValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const LEFT_DECISION_ID = "decision-dashboard-test-left";
const RIGHT_DECISION_ID = "decision-dashboard-test-right";
const WORKSPACE_ID = "ws-dashboard-test-001";

function resetPlatformStack(): void {
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
      createdBy: "dashboard-test",
      title: `Dashboard test event ${index + 1}`,
      summary: "Decision dashboard integration test event.",
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

test("exports APP-6/9 dashboard contract vocabulary", () => {
  const contract = getDecisionDashboardContract();
  assert.equal(contract.contractVersion, DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION);
  assert.ok(contract.supportedBindings.includes("single_decision"));
  assert.ok(contract.futureConsumers.length >= 2);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionDashboardEngine.ts",
    allowedFiles: DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("builds single decision dashboard model", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const result = buildDecisionDashboardModel({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });

  assert.equal(result.success, true, result.reason);
  assert.equal(result.data?.decisionState?.lifecycle, "executed");
  assert.ok(result.data?.modelId);
  assert.ok(getDecisionDashboardModel(result.data!.modelId));
});

test("builds decision list and recent models", () => {
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

  const list = buildDecisionDashboardModel({ binding: "decision_list" });
  assert.equal(list.data?.decisionStates.length, 2);

  const recent = buildDecisionDashboardModel({ binding: "recent_decisions", recentLimit: 1 });
  assert.equal(recent.data?.decisionStates.length, 1);
});

test("builds comparison and replay dashboard models", () => {
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

  const comparison = buildDecisionDashboardModel({
    binding: "decision_comparison",
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  assert.equal(comparison.success, true, comparison.reason);
  assert.equal(comparison.data?.comparisonSummary?.hasDifferences, true);

  const replay = buildDecisionDashboardModel({
    binding: "replay_summary",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  assert.equal(replay.success, true, replay.reason);
  assert.equal(replay.data?.replaySummary?.totalEvents, 4);
});

test("builds active and terminal dashboard models", () => {
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

  const active = buildDecisionDashboardModel({ binding: "active_decisions" });
  assert.equal(active.data?.decisionStates.length, 1);

  const terminal = buildDecisionDashboardModel({ binding: "terminal_decisions" });
  assert.equal(terminal.data?.decisionStates.length, 1);
});

test("builds dashboard summary from certified outputs", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const summary = buildDecisionDashboardSummary({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(summary.success, true);
  assert.match(summary.data?.decisionSummary ?? "", /executed/i);
});

test("dashboard models are immutable", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const result = buildDecisionDashboardModel({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(Object.isFrozen(result.data), true);
  assert.equal(Object.isFrozen(result.data?.decisionStates), true);
});

test("validates APP-6:1 through APP-6:8 compatibility", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  assert.equal(validateFoundationCompatibilityForDashboard(FIXED_TIME).valid, true);
  assert.equal(validateEngineCompatibilityForDashboard().valid, true);
  const model = buildDecisionDashboardModel({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(
    validateDecisionDashboard({ binding: "single_decision", decisionId: LEFT_DECISION_ID }, model.data!).valid,
    true
  );
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
});

test("rejects dashboard build when integration is not initialized", () => {
  resetDecisionDashboardIntegrationForTests();
  const result = buildDecisionDashboardModel({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
  });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("runs decision dashboard integration certification", () => {
  const result = runDecisionDashboardIntegration();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 22);
});
