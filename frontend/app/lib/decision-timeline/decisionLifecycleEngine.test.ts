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
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import { buildDecisionHistory } from "./decisionHistoryBuilder.ts";
import {
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
} from "./decisionHistoryEngine.ts";
import {
  computeDecisionLifecycle,
  DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST,
  deriveDecisionLifecycle,
  getDecisionLifecycle,
  getDecisionLifecycleContract,
  initializeDecisionLifecycleEngine,
  resetDecisionLifecycleEngineForTests,
  validateDecisionLifecycle,
} from "./decisionLifecycleEngine.ts";
import {
  validateDecisionLifecycleTransition,
  DECISION_LIFECYCLE_INITIAL_STATE,
} from "./decisionLifecycleRules.ts";
import { buildDecisionLifecycleSnapshot } from "./decisionLifecycleSnapshot.ts";
import { runDecisionLifecycleEngine } from "./decisionLifecycleRunner.ts";
import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  DECISION_LIFECYCLE_MANDATORY_FIELDS,
} from "./decisionLifecycleTypes.ts";
import {
  validateFoundationCompatibilityForLifecycle,
  validateHistoryCompatibility,
} from "./decisionLifecycleValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const DECISION_ID = "decision-lifecycle-test-001";
const WORKSPACE_ID = "ws-lifecycle-test-001";

function resetPlatformStack(): void {
  resetDecisionLifecycleEngineForTests();
  resetDecisionHistoryEngineForTests();
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
  initializeDecisionHistoryEngine(FIXED_TIME);
  initializeDecisionLifecycleEngine(FIXED_TIME);
}

function createLifecycleEvents(): DecisionEngineEvent[] {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ] as const;

  const events: DecisionEngineEvent[] = [];
  factories.forEach((factory, index) => {
    const result = factory({
      decisionId: DECISION_ID,
      workspaceId: WORKSPACE_ID,
      eventId: `decision-lifecycle-test-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "lifecycle-test",
      title: `Lifecycle test event ${index + 1}`,
      summary: "Decision lifecycle engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    events.push(result.data!);
  });
  return events;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-6/4 lifecycle contract vocabulary", () => {
  const contract = getDecisionLifecycleContract();
  assert.equal(contract.contractVersion, DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, DECISION_LIFECYCLE_MANDATORY_FIELDS.length);
  assert.equal(contract.supportedLifecycles.length, 9);
  assert.ok(contract.mandatoryFields.includes("currentLifecycle"));
  assert.ok(contract.mandatoryFields.includes("currentStatus"));
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionLifecycleEngine.ts",
    allowedFiles: DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("derives lifecycle from valid decision history", () => {
  const history = buildDecisionHistory({ events: createLifecycleEvents() });
  const lifecycle = deriveDecisionLifecycle(history);

  assert.equal(lifecycle.currentLifecycle, "executed");
  assert.equal(lifecycle.currentStatus, "committed");
  assert.equal(lifecycle.previousLifecycle, "approved");
  assert.equal(lifecycle.transitionCount, 4);
  assert.equal(lifecycle.isValid, true);
  assert.equal(lifecycle.readOnly, true);
  assert.equal(Object.isFrozen(lifecycle), true);
});

test("validateDecisionLifecycle accepts valid derived lifecycle", () => {
  const lifecycle = deriveDecisionLifecycle(buildDecisionHistory({ events: createLifecycleEvents() }));
  const validation = validateDecisionLifecycle(lifecycle);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("rejects invalid transitions in derived lifecycle", () => {
  const events = createLifecycleEvents();
  const history = buildDecisionHistory({
    events: Object.freeze([
      ...events,
      Object.freeze({
        ...events[0]!,
        eventId: "decision-lifecycle-test-invalid-reopen",
        sequenceNumber: 5,
        timestamp: "2026-01-02T00:00:00.000Z",
      }),
    ]),
  });
  const lifecycle = deriveDecisionLifecycle(history);
  assert.equal(lifecycle.isValid, false);
  assert.ok(lifecycle.validationMessages.length > 0);
});

test("validates canonical invalid transition rules", () => {
  assert.equal(validateDecisionLifecycleTransition("completed", "proposed").valid, false);
  assert.equal(validateDecisionLifecycleTransition("archived", "approved").valid, false);
  assert.equal(validateDecisionLifecycleTransition("cancelled", "executed").valid, false);
  assert.equal(validateDecisionLifecycleTransition("proposed", "evaluated").valid, true);
  assert.equal(validateDecisionLifecycleTransition("approved", "executed").valid, true);
});

test("allows repeatable evaluated lifecycle", () => {
  const created = createDecisionCreatedEvent({
    decisionId: DECISION_ID,
    workspaceId: WORKSPACE_ID,
    eventId: "decision-lifecycle-test-created",
    timestamp: "2026-01-01T00:00:01.000Z",
    createdBy: "lifecycle-test",
    title: "Created",
    summary: "Created.",
  });
  const evaluatedOne = createDecisionUpdatedEvent({
    decisionId: DECISION_ID,
    workspaceId: WORKSPACE_ID,
    eventId: "decision-lifecycle-test-evaluated-1",
    timestamp: "2026-01-01T00:00:02.000Z",
    createdBy: "lifecycle-test",
    title: "Evaluated 1",
    summary: "First evaluation.",
  });
  const evaluatedTwo = createDecisionUpdatedEvent({
    decisionId: DECISION_ID,
    workspaceId: WORKSPACE_ID,
    eventId: "decision-lifecycle-test-evaluated-2",
    timestamp: "2026-01-01T00:00:03.000Z",
    createdBy: "lifecycle-test",
    title: "Evaluated 2",
    summary: "Second evaluation.",
  });
  const approved = createDecisionApprovedEvent({
    decisionId: DECISION_ID,
    workspaceId: WORKSPACE_ID,
    eventId: "decision-lifecycle-test-approved",
    timestamp: "2026-01-01T00:00:04.000Z",
    createdBy: "lifecycle-test",
    title: "Approved",
    summary: "Approved.",
  });
  assert.equal(created.success && evaluatedOne.success && evaluatedTwo.success && approved.success, true);
  const history = buildDecisionHistory({
    events: Object.freeze([created.data!, evaluatedOne.data!, evaluatedTwo.data!, approved.data!]),
  });
  const lifecycle = deriveDecisionLifecycle(history);
  assert.equal(lifecycle.isValid, true);
  assert.equal(lifecycle.currentLifecycle, "approved");
});

test("buildDecisionLifecycleSnapshot creates immutable snapshot", () => {
  const lifecycle = deriveDecisionLifecycle(buildDecisionHistory({ events: createLifecycleEvents() }));
  const snapshot = buildDecisionLifecycleSnapshot(lifecycle, FIXED_TIME);
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.currentLifecycle, "executed");
  assert.equal(snapshot.isValid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("computeDecisionLifecycle registers retrievable lifecycle", () => {
  const history = buildDecisionHistory({ events: createLifecycleEvents() });
  const result = computeDecisionLifecycle(history);
  assert.equal(result.success, true);
  assert.equal(getDecisionLifecycle(DECISION_ID)?.currentLifecycle, "executed");
});

test("validates APP-6:1 and APP-6:3 compatibility", () => {
  const history = buildDecisionHistory({ events: createLifecycleEvents() });
  assert.equal(validateFoundationCompatibilityForLifecycle(FIXED_TIME).valid, true);
  assert.equal(validateHistoryCompatibility(history).valid, true);
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("initial lifecycle must be proposed", () => {
  assert.equal(DECISION_LIFECYCLE_INITIAL_STATE, "proposed");
});

test("lifecycle derivation does not mutate history", () => {
  const events = createLifecycleEvents();
  const history = buildDecisionHistory({ events });
  const eventCountBefore = history.eventCount;
  deriveDecisionLifecycle(history);
  assert.equal(history.eventCount, eventCountBefore);
  assert.equal(history.readOnly, true);
});

test("runs decision lifecycle engine certification", () => {
  const result = runDecisionLifecycleEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 20);
});

test("rejects compute when engine is not initialized", () => {
  resetDecisionLifecycleEngineForTests();
  const result = computeDecisionLifecycle(buildDecisionHistory({ events: createLifecycleEvents() }));
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});
