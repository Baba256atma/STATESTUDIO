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
  compareDecisions,
  compareDecisionStates,
  compareMultipleDecisionStates,
  DECISION_COMPARISON_ENGINE_SELF_MANIFEST,
  getDecisionComparisonContract,
  initializeDecisionComparisonEngine,
  resetDecisionComparisonEngineForTests,
  validateDecisionComparison,
  runDecisionComparisonEngine,
} from "./decisionComparisonEngine.ts";
import { buildDecisionComparisonSnapshot } from "./decisionComparisonSnapshot.ts";
import {
  DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
} from "./decisionComparisonTypes.ts";
import {
  validateFoundationCompatibilityForComparison,
  validateQueryCompatibilityForComparison,
} from "./decisionComparisonValidation.ts";
import {
  getDecisionById,
  initializeDecisionQueryEngine,
  resetDecisionQueryEngineForTests,
} from "./decisionQueryEngine.ts";
import { resetDecisionQueryRegistryForTests } from "./decisionQueryRegistry.ts";
import {
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const LEFT_DECISION_ID = "decision-comparison-test-left";
const RIGHT_DECISION_ID = "decision-comparison-test-right";
const WORKSPACE_ID = "ws-comparison-test-001";

function resetPlatformStack(): void {
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
      createdBy: "comparison-test",
      title: `Comparison test event ${index + 1}`,
      summary: "Decision comparison engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    return result.data!;
  });

  const lifecycle = deriveDecisionLifecycle(buildDecisionHistory({ events: Object.freeze(events) }));
  const computed = computeDecisionState(lifecycle, FIXED_TIME);
  assert.equal(computed.success, true, computed.reason);
  return computed.data!;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-6/7 comparison contract vocabulary", () => {
  const contract = getDecisionComparisonContract();
  assert.equal(contract.contractVersion, DECISION_COMPARISON_ENGINE_CONTRACT_VERSION);
  assert.ok(contract.mandatoryFields.includes("lifecycleDiff"));
  assert.ok(contract.futureConsumers.length >= 4);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_COMPARISON_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionComparisonEngine.ts",
    allowedFiles: DECISION_COMPARISON_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_COMPARISON_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("compares two decisions via query engine", () => {
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

  const result = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });

  assert.equal(result.success, true, result.reason);
  assert.equal(result.data?.lifecycleDiff.left, "executed");
  assert.equal(result.data?.lifecycleDiff.right, "rejected");
  assert.equal(result.data?.lifecycleDiff.changed, true);
});

test("detects status version and terminal differences", () => {
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

  const result = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });

  assert.equal(result.data?.statusDiff.changed, true);
  assert.equal(result.data?.statusDiff.left, "committed");
  assert.equal(result.data?.statusDiff.right, "revoked");
  assert.ok(result.data?.versionDiff);
  assert.equal(typeof result.data?.versionDiff.left, "string");
  assert.equal(result.data?.terminalDiff.changed, true);
  assert.equal(result.data?.terminalDiff.left, false);
  assert.equal(result.data?.terminalDiff.right, true);
});

test("compares multiple decision states", () => {
  const left = seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);
  const right = seedDecision(RIGHT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ]);

  const multi = compareMultipleDecisionStates(Object.freeze([left, right]));
  assert.equal(multi.success, true, multi.reason);
  assert.equal(multi.data?.pairwiseComparisons.length, 1);
});

test("builds immutable comparison snapshots", () => {
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

  const result = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  const snapshot = buildDecisionComparisonSnapshot(result.data!);
  assert.equal(snapshot.readOnly, true);
  assert.equal(Object.isFrozen(snapshot.validationMessages), true);
});

test("rejects same-decision comparison", () => {
  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const result = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: LEFT_DECISION_ID,
  });
  assert.equal(result.success, false);
  assert.match(result.reason, /itself/i);
});

test("enforces workspace isolation across workspaces", () => {
  const left = seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);

  const otherWorkspaceEvents = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ].map((factory, index) => {
    const result = factory({
      decisionId: RIGHT_DECISION_ID,
      workspaceId: "ws-other",
      eventId: `${RIGHT_DECISION_ID}-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "comparison-test",
      title: `Other workspace event ${index + 1}`,
      summary: "Cross-workspace comparison test.",
    });
    assert.equal(result.success, true, result.reason);
    return result.data!;
  });

  const lifecycle = deriveDecisionLifecycle(
    buildDecisionHistory({ events: Object.freeze(otherWorkspaceEvents) })
  );
  const computed = computeDecisionState(lifecycle, FIXED_TIME);
  assert.equal(computed.success, true, computed.reason);
  const right = computed.data!;

  const result = compareDecisionStates(left, right);
  assert.equal(result.success, false);
  assert.match(result.reason, /workspace/i);
});

test("validates APP-6:1 through APP-6:6 compatibility", () => {
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

  assert.equal(validateFoundationCompatibilityForComparison(FIXED_TIME).valid, true);
  assert.equal(validateQueryCompatibilityForComparison().valid, true);
  assert.equal(
    validateDecisionComparison({
      leftDecisionId: LEFT_DECISION_ID,
      rightDecisionId: RIGHT_DECISION_ID,
    }).valid,
    true
  );
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("rejects comparison when engine is not initialized", () => {
  resetDecisionComparisonEngineForTests();
  const result = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("comparison resolves states only through query engine", () => {
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

  assert.ok(getDecisionById(LEFT_DECISION_ID));
  assert.ok(getDecisionById(RIGHT_DECISION_ID));

  const result = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  assert.equal(result.success, true);
  assert.equal(Object.isFrozen(result.data), true);
});

test("runs decision comparison engine certification", () => {
  const result = runDecisionComparisonEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 20);
});
