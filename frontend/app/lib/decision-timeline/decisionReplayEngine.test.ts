import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCreatedEvent,
  createDecisionExecutedEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  initializeDecisionEventEngine,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import {
  computeDecisionHistory,
  getDecisionHistory,
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
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import {
  createDecisionReplay,
  DECISION_REPLAY_ENGINE_SELF_MANIFEST,
  getDecisionReplayContract,
  getReplaySnapshot,
  initializeDecisionReplayEngine,
  jumpToEvent,
  jumpToIndex,
  moveFirst,
  moveLast,
  moveNext,
  movePrevious,
  resetDecisionReplayEngineForTests,
  resetReplay,
  validateDecisionReplay,
  runDecisionReplayEngine,
} from "./decisionReplayEngine.ts";
import {
  buildDecisionReplaySnapshot,
  freezeDecisionReplaySnapshot,
} from "./decisionReplaySnapshot.ts";
import { DECISION_REPLAY_ENGINE_CONTRACT_VERSION } from "./decisionReplayTypes.ts";
import {
  validateFoundationCompatibilityForReplay,
  validateQueryCompatibilityForReplay,
} from "./decisionReplayValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const DECISION_ID = "decision-replay-test-001";
const WORKSPACE_ID = "ws-replay-test-001";

function resetPlatformStack(): void {
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
}

function seedReplayDecision() {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ] as const;

  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId: DECISION_ID,
      workspaceId: WORKSPACE_ID,
      eventId: `${DECISION_ID}-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "replay-test",
      title: `Replay test event ${index + 1}`,
      summary: "Decision replay engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    return result.data!;
  });

  const historyResult = computeDecisionHistory({ events: Object.freeze(events) });
  assert.equal(historyResult.success, true, historyResult.reason);

  const lifecycle = deriveDecisionLifecycle(historyResult.data!);
  const stateResult = computeDecisionState(lifecycle, FIXED_TIME);
  assert.equal(stateResult.success, true, stateResult.reason);

  return historyResult.data!;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-6/8 replay contract vocabulary", () => {
  const contract = getDecisionReplayContract();
  assert.equal(contract.contractVersion, DECISION_REPLAY_ENGINE_CONTRACT_VERSION);
  assert.ok(contract.mandatoryFields.includes("cursorIndex"));
  assert.ok(contract.supportedCursorActions.includes("jumpToEvent"));
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_REPLAY_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionReplayEngine.ts",
    allowedFiles: DECISION_REPLAY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_REPLAY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates replay at first event", () => {
  seedReplayDecision();
  const result = createDecisionReplay({ decisionId: DECISION_ID, workspaceId: WORKSPACE_ID });
  assert.equal(result.success, true, result.reason);
  assert.equal(result.data?.isFirst, true);
  assert.equal(result.data?.cursorIndex, 0);
  assert.equal(result.data?.currentEvent?.eventId, `${DECISION_ID}-event-1`);
  assert.equal(result.data?.totalEvents, 4);
});

test("navigates next previous first and last", () => {
  seedReplayDecision();
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  const replayId = created.data!.replayId;

  const last = moveLast(replayId);
  assert.equal(last.data?.isLast, true);
  assert.equal(last.data?.cursorIndex, 3);

  const prev = movePrevious(replayId);
  assert.equal(prev.data?.cursorIndex, 2);

  const next = moveNext(replayId);
  assert.equal(next.data?.cursorIndex, 3);

  const first = moveFirst(replayId);
  assert.equal(first.data?.isFirst, true);
  assert.equal(first.data?.cursorIndex, 0);
});

test("jumps to index and event", () => {
  seedReplayDecision();
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  const replayId = created.data!.replayId;

  const byIndex = jumpToIndex(replayId, 2);
  assert.equal(byIndex.success, true);
  assert.equal(byIndex.data?.cursorIndex, 2);

  const byEvent = jumpToEvent(replayId, `${DECISION_ID}-event-4`);
  assert.equal(byEvent.success, true);
  assert.equal(byEvent.data?.currentEvent?.eventId, `${DECISION_ID}-event-4`);
});

test("resets replay to first event", () => {
  seedReplayDecision();
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  const replayId = created.data!.replayId;
  moveLast(replayId);
  const reset = resetReplay(replayId);
  assert.equal(reset.data?.cursorIndex, 0);
  assert.equal(reset.data?.isFirst, true);
});

test("rejects invalid cursor index", () => {
  seedReplayDecision();
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  const result = jumpToIndex(created.data!.replayId, 99);
  assert.equal(result.success, false);
  assert.match(result.reason, /bounds|index/i);
});

test("builds immutable replay snapshots", () => {
  seedReplayDecision();
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  const snapshot = freezeDecisionReplaySnapshot(buildDecisionReplaySnapshot(created.data!));
  assert.equal(snapshot.readOnly, true);
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(getReplaySnapshot(created.data!.replayId)?.replayId, created.data!.replayId);
});

test("does not mutate registered history during navigation", () => {
  const historyBefore = seedReplayDecision();
  const eventCountBefore = historyBefore.eventCount;
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  moveLast(created.data!.replayId);
  moveNext(created.data!.replayId);
  jumpToEvent(created.data!.replayId, `${DECISION_ID}-event-2`);

  const historyAfter = getDecisionHistory(DECISION_ID);
  assert.equal(historyAfter?.eventCount, eventCountBefore);
  assert.equal(historyAfter?.orderedEvents[0]?.eventId, historyBefore.orderedEvents[0]?.eventId);
});

test("enforces workspace isolation on replay creation", () => {
  seedReplayDecision();
  const result = createDecisionReplay({
    decisionId: DECISION_ID,
    workspaceId: "ws-other",
  });
  assert.equal(result.success, false);
  assert.match(result.reason, /workspace/i);
});

test("validates APP-6:1 through APP-6:7 compatibility", () => {
  seedReplayDecision();
  assert.equal(validateFoundationCompatibilityForReplay(FIXED_TIME).valid, true);
  assert.equal(validateQueryCompatibilityForReplay().valid, true);
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  assert.equal(validateDecisionReplay(created.data!).valid, true);
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("rejects replay when engine is not initialized", () => {
  resetDecisionReplayEngineForTests();
  const result = createDecisionReplay({ decisionId: DECISION_ID });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("runs decision replay engine certification", () => {
  const result = runDecisionReplayEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 22);
});

test("replay output remains immutable", () => {
  seedReplayDecision();
  const created = createDecisionReplay({ decisionId: DECISION_ID });
  assert.equal(Object.isFrozen(created.data), true);
});
