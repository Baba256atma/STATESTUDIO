import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCreatedEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  initializeDecisionEventEngine,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import {
  buildDecisionHistory,
  computeDecisionHistory,
  DECISION_HISTORY_ENGINE_SELF_MANIFEST,
  getDecisionHistory,
  getDecisionHistoryContract,
  getDecisionHistoryRegistry,
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
  validateDecisionHistory,
} from "./decisionHistoryEngine.ts";
import { buildDecisionHistorySnapshot } from "./decisionHistorySnapshot.ts";
import {
  DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
  DECISION_HISTORY_MANDATORY_FIELDS,
} from "./decisionHistoryTypes.ts";
import { runDecisionHistoryEngine } from "./decisionHistoryRunner.ts";
import {
  validateEngineEventCompatibility,
  validateFoundationCompatibility,
} from "./decisionHistoryValidation.ts";
import {
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const DECISION_ID = "decision-history-test-001";
const WORKSPACE_ID = "ws-history-test-001";

function resetPlatformStack(): void {
  resetDecisionHistoryEngineForTests();
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
  initializeDecisionHistoryEngine(FIXED_TIME);
}

function createHistoryEvents(): DecisionEngineEvent[] {
  const stages = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
  ] as const;

  const events: DecisionEngineEvent[] = [];
  stages.forEach((factory, index) => {
    const result = factory({
      decisionId: DECISION_ID,
      workspaceId: WORKSPACE_ID,
      eventId: `decision-history-test-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "history-test",
      title: `History test event ${index + 1}`,
      summary: "Decision history engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    events.push(result.data!);
  });
  return events;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-6/3 history contract vocabulary", () => {
  const contract = getDecisionHistoryContract();
  assert.equal(contract.contractVersion, DECISION_HISTORY_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, DECISION_HISTORY_MANDATORY_FIELDS.length);
  assert.equal(contract.supportedLifecycles.length, 9);
  assert.ok(contract.mandatoryFields.includes("decisionId"));
  assert.ok(contract.mandatoryFields.includes("currentLifecycle"));
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_HISTORY_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionHistoryEngine.ts",
    allowedFiles: DECISION_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_HISTORY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("buildDecisionHistory reconstructs chronological history", () => {
  const events = createHistoryEvents();
  const shuffled = [events[2]!, events[0]!, events[1]!];
  const history = buildDecisionHistory({ events: shuffled });

  assert.equal(history.eventCount, 3);
  assert.equal(history.orderedEvents[0]?.eventType, "DECISION_CREATED");
  assert.equal(history.orderedEvents.at(-1)?.eventType, "DECISION_APPROVED");
  assert.equal(history.currentLifecycle, "approved");
  assert.equal(history.readOnly, true);
  assert.equal(Object.isFrozen(history), true);
});

test("validateDecisionHistory accepts valid history", () => {
  const history = buildDecisionHistory({ events: createHistoryEvents() });
  const validation = validateDecisionHistory(history);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("rejects duplicate events in history input", () => {
  const events = createHistoryEvents();
  const history = buildDecisionHistory({ events: [events[0]!, events[0]!] });
  assert.equal(history.validationResult.valid, false);
  assert.ok(history.validationResult.issues.some((issue) => issue.code === "duplicate_event"));
});

test("rejects mixed decisionId aggregation", () => {
  const events = createHistoryEvents();
  const history = buildDecisionHistory({
    events: [
      events[0]!,
      Object.freeze({
        ...events[1]!,
        decisionId: "decision-other-001",
      }),
    ],
  });
  assert.equal(history.validationResult.valid, false);
  assert.ok(history.validationResult.issues.some((issue) => issue.code === "identity_mismatch"));
});

test("rejects invalid chronology", () => {
  const events = createHistoryEvents();
  const history = buildDecisionHistory({
    events: [
      events[0]!,
      Object.freeze({
        ...events[1]!,
        sequenceNumber: 1,
        timestamp: "2025-01-01T00:00:00.000Z",
      }),
    ],
  });
  assert.equal(history.validationResult.valid, false);
});

test("buildDecisionHistorySnapshot creates immutable snapshot", () => {
  const history = buildDecisionHistory({ events: createHistoryEvents() });
  const snapshot = buildDecisionHistorySnapshot(history, FIXED_TIME);
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.eventCount, 3);
  assert.equal(snapshot.latestEventId, history.latestEvent?.eventId);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("computeDecisionHistory registers retrievable history", () => {
  const events = createHistoryEvents();
  const result = computeDecisionHistory({ events });
  assert.equal(result.success, true);
  assert.equal(getDecisionHistory(DECISION_ID)?.eventCount, 3);
  assert.equal(getDecisionHistoryRegistry().registeredHistoryCount, 1);
});

test("validates APP-6:1 and APP-6:2 compatibility", () => {
  const events = createHistoryEvents();
  assert.equal(validateFoundationCompatibility(FIXED_TIME).valid, true);
  assert.equal(validateEngineEventCompatibility(events).valid, true);
  const history = buildDecisionHistory({ events });
  assert.equal(history.currentVersion?.foundationContractVersion, DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION);
  assert.equal(history.currentVersion?.engineVersion, DECISION_EVENT_ENGINE_CONTRACT_VERSION);
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("runs decision history engine certification", () => {
  const result = runDecisionHistoryEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 20);
});

test("rejects compute when engine is not initialized", () => {
  resetDecisionHistoryEngineForTests();
  const result = computeDecisionHistory({ events: createHistoryEvents() });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("history never mutates source events", () => {
  const events = createHistoryEvents();
  const originalTitles = events.map((event) => event.title);
  const history = buildDecisionHistory({ events });
  assert.deepEqual(
    history.events.map((event) => event.title),
    originalTitles
  );
  assert.notEqual(history.events, events);
});
