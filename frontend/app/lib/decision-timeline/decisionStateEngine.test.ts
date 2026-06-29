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
import { buildDecisionHistory } from "./decisionHistoryBuilder.ts";
import {
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
} from "./decisionHistoryEngine.ts";
import {
  deriveDecisionLifecycle,
  initializeDecisionLifecycleEngine,
  resetDecisionLifecycleEngineForTests,
} from "./decisionLifecycleEngine.ts";
import {
  computeDecisionState,
  DECISION_STATE_ENGINE_SELF_MANIFEST,
  deriveDecisionState,
  getDecisionState,
  getDecisionStateContract,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
  validateDecisionState,
} from "./decisionStateEngine.ts";
import { buildDecisionStateSnapshot } from "./decisionStateSnapshot.ts";
import { runDecisionStateEngine } from "./decisionStateRunner.ts";
import {
  DECISION_STATE_ENGINE_CONTRACT_VERSION,
  DECISION_STATE_MANDATORY_FIELDS,
} from "./decisionStateTypes.ts";
import {
  validateFoundationCompatibilityForState,
  validateHistoryCompatibilityForState,
  validateLifecycleCompatibility,
} from "./decisionStateValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const DECISION_ID = "decision-state-test-001";
const WORKSPACE_ID = "ws-state-test-001";

function resetPlatformStack(): void {
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
}

function createTestLifecycle() {
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
      eventId: `decision-state-test-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "state-test",
      title: `State test event ${index + 1}`,
      summary: "Decision state engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    return result.data!;
  });

  return deriveDecisionLifecycle(buildDecisionHistory({ events: Object.freeze(events) }));
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-6/5 state contract vocabulary", () => {
  const contract = getDecisionStateContract();
  assert.equal(contract.contractVersion, DECISION_STATE_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, DECISION_STATE_MANDATORY_FIELDS.length);
  assert.ok(contract.mandatoryFields.includes("currentLifecycle"));
  assert.ok(contract.mandatoryFields.includes("latestEventId"));
  assert.ok(contract.futureConsumers.length >= 6);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_STATE_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionStateEngine.ts",
    allowedFiles: DECISION_STATE_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_STATE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("derives decision state from lifecycle only", () => {
  const lifecycle = createTestLifecycle();
  const state = deriveDecisionState(lifecycle, FIXED_TIME);

  assert.equal(state.currentLifecycle, "executed");
  assert.equal(state.currentStatus, "committed");
  assert.equal(state.latestEventId, "decision-state-test-event-4");
  assert.equal(state.isValid, true);
  assert.equal(state.readOnly, true);
  assert.equal(Object.isFrozen(state), true);
  assert.ok(state.currentVersion.includes("APP-6/3"));
  assert.ok(state.currentVersion.includes("APP-6/4"));
});

test("validateDecisionState accepts valid derived state", () => {
  const lifecycle = createTestLifecycle();
  const state = deriveDecisionState(lifecycle, FIXED_TIME);
  const validation = validateDecisionState(state, lifecycle);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("buildDecisionStateSnapshot creates immutable snapshot", () => {
  const lifecycle = createTestLifecycle();
  const snapshot = buildDecisionStateSnapshot(deriveDecisionState(lifecycle, FIXED_TIME));
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.currentLifecycle, "executed");
  assert.equal(Object.isFrozen(snapshot), true);
  assert.ok(snapshot.snapshotId.includes(DECISION_ID));
});

test("computeDecisionState registers retrievable state", () => {
  const lifecycle = createTestLifecycle();
  const result = computeDecisionState(lifecycle, FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(getDecisionState(DECISION_ID)?.currentLifecycle, "executed");
});

test("validates APP-6:1 through APP-6:4 compatibility", () => {
  const lifecycle = createTestLifecycle();
  assert.equal(validateFoundationCompatibilityForState(FIXED_TIME).valid, true);
  assert.equal(validateLifecycleCompatibility(lifecycle).valid, true);
  assert.equal(validateHistoryCompatibilityForState(lifecycle).valid, true);
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("state mirrors lifecycle terminal and validity flags", () => {
  const lifecycle = createTestLifecycle();
  const state = deriveDecisionState(lifecycle, FIXED_TIME);
  assert.equal(state.isTerminal, lifecycle.isTerminal);
  assert.equal(state.isValid, lifecycle.isValid);
  assert.equal(state.validationMessages.length, lifecycle.validationMessages.length);
});

test("runs decision state engine certification", () => {
  const result = runDecisionStateEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 18);
});

test("rejects compute when engine is not initialized", () => {
  resetDecisionStateEngineForTests();
  const result = computeDecisionState(createTestLifecycle(), FIXED_TIME);
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("state does not mutate lifecycle input", () => {
  const lifecycle = createTestLifecycle();
  const transitionCountBefore = lifecycle.transitionCount;
  deriveDecisionState(lifecycle, FIXED_TIME);
  assert.equal(lifecycle.transitionCount, transitionCountBefore);
  assert.equal(lifecycle.readOnly, true);
});
