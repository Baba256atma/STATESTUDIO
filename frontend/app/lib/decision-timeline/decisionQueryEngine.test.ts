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
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import {
  DECISION_QUERY_ENGINE_CONTRACT_VERSION,
  DECISION_QUERY_FILTER_KEYS,
} from "./decisionQueryTypes.ts";
import {
  getActiveDecisions,
  getDecisionById,
  getDecisionsByCategory,
  getDecisionsByLifecycle,
  getDecisionsByStatus,
  getDecisionsByTag,
  getDecisionsByWorkspace,
  getRecentDecisions,
  getTerminalDecisions,
  initializeDecisionQueryEngine,
  listDecisionStates,
  queryDecisionStates,
  resetDecisionQueryEngineForTests,
  validateDecisionQuery,
  getDecisionQueryContract,
  DECISION_QUERY_ENGINE_SELF_MANIFEST,
  runDecisionQueryEngine,
} from "./decisionQueryEngine.ts";
import {
  registerDecisionQueryAttributes,
  resetDecisionQueryRegistryForTests,
} from "./decisionQueryRegistry.ts";
import { buildDecisionQuerySnapshot, freezeDecisionQuerySnapshot } from "./decisionQuerySnapshot.ts";
import { validateFoundationCompatibilityForQuery } from "./decisionQueryValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const DECISION_ID = "decision-query-test-001";
const WORKSPACE_ID = "ws-query-test-001";

function resetPlatformStack(): void {
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
}

function seedDecisionState(decisionId: string = DECISION_ID, workspaceId: string = WORKSPACE_ID) {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ] as const;

  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId,
      workspaceId,
      eventId: `${decisionId}-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "query-test",
      title: `Query test event ${index + 1}`,
      summary: "Decision query engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    return result.data!;
  });

  const lifecycle = deriveDecisionLifecycle(buildDecisionHistory({ events: Object.freeze(events) }));
  const computed = computeDecisionState(lifecycle, FIXED_TIME);
  assert.equal(computed.success, true, computed.reason);
  return computed.data!;
}

function seedTerminalDecisionState(decisionId: string = "decision-query-terminal-001") {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ] as const;

  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId,
      workspaceId: WORKSPACE_ID,
      eventId: `${decisionId}-event-${index + 1}`,
      timestamp: `2026-01-02T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "query-test",
      title: `Terminal query test event ${index + 1}`,
      summary: "Terminal decision query test event.",
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

test("exports APP-6/6 query contract vocabulary", () => {
  const contract = getDecisionQueryContract();
  assert.equal(contract.contractVersion, DECISION_QUERY_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.supportedFilters.length, DECISION_QUERY_FILTER_KEYS.length);
  assert.ok(contract.futureConsumers.length >= 5);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_QUERY_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionQueryEngine.ts",
    allowedFiles: DECISION_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_QUERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("queries decision by ID from state registry", () => {
  seedDecisionState();
  const state = getDecisionById(DECISION_ID);
  assert.equal(state?.decisionId, DECISION_ID);
  assert.equal(state?.currentLifecycle, "executed");
});

test("filters decisions by workspace", () => {
  seedDecisionState();
  const result = getDecisionsByWorkspace(WORKSPACE_ID);
  assert.equal(result.success, true);
  assert.equal(result.data?.totalCount, 1);
  assert.equal(result.data?.states[0]?.workspaceId, WORKSPACE_ID);
});

test("filters decisions by lifecycle and status", () => {
  seedDecisionState();
  const lifecycleResult = getDecisionsByLifecycle("executed");
  assert.equal(lifecycleResult.data?.totalCount, 1);

  const statusResult = getDecisionsByStatus("committed");
  assert.equal(statusResult.data?.states[0]?.currentStatus, "committed");
});

test("filters decisions by category and tag via query attributes", () => {
  seedDecisionState();
  registerDecisionQueryAttributes(DECISION_ID, {
    category: "governance",
    tags: Object.freeze(["priority", "executive"]),
  });

  const categoryResult = getDecisionsByCategory("governance");
  assert.equal(categoryResult.success, true);
  assert.equal(categoryResult.data?.totalCount, 1);

  const tagResult = getDecisionsByTag("priority");
  assert.equal(tagResult.success, true);
  assert.equal(tagResult.data?.totalCount, 1);
});

test("filters terminal and active decisions", () => {
  seedDecisionState();
  seedTerminalDecisionState();

  const terminalResult = getTerminalDecisions();
  assert.equal(terminalResult.success, true);
  assert.equal(terminalResult.data?.totalCount, 1);
  assert.equal(terminalResult.data?.states[0]?.isTerminal, true);

  const activeResult = getActiveDecisions();
  assert.equal(activeResult.success, true);
  assert.equal(activeResult.data?.totalCount, 1);
  assert.equal(activeResult.data?.states[0]?.decisionId, DECISION_ID);
});

test("applies stable sorting and recent query limit", () => {
  seedDecisionState("decision-query-test-002", WORKSPACE_ID);
  registerDecisionQueryAttributes("decision-query-test-002", { category: "operational" });
  seedDecisionState("decision-query-test-001", WORKSPACE_ID);
  registerDecisionQueryAttributes("decision-query-test-001", { category: "governance" });

  const sorted = queryDecisionStates({
    filters: Object.freeze({ workspaceId: WORKSPACE_ID }),
    sort: Object.freeze({ field: "decisionId", direction: "asc" }),
  });
  assert.equal(sorted.success, true);
  assert.equal(sorted.data?.states[0]?.decisionId, "decision-query-test-001");
  assert.equal(sorted.data?.states[1]?.decisionId, "decision-query-test-002");

  const recent = getRecentDecisions(1);
  assert.equal(recent.data?.totalCount, 1);
});

test("builds immutable query snapshots", () => {
  seedDecisionState();
  const result = listDecisionStates();
  assert.equal(result.success, true);
  const snapshot = buildDecisionQuerySnapshot(result.data!);
  const frozen = freezeDecisionQuerySnapshot(snapshot);
  assert.equal(frozen.readOnly, true);
  assert.equal(Object.isFrozen(frozen.states), true);
});

test("enforces workspace isolation validation", () => {
  seedDecisionState();
  const result = queryDecisionStates({
    filters: Object.freeze({ decisionId: DECISION_ID, workspaceId: "ws-other" }),
  });
  assert.equal(result.success, false);
  assert.match(result.reason, /workspace/i);
});

test("validates APP-6:1 through APP-6:5 compatibility", () => {
  seedDecisionState();
  assert.equal(validateFoundationCompatibilityForQuery(FIXED_TIME).valid, true);
  assert.equal(validateDecisionQuery({ filters: Object.freeze({}) }).valid, true);
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("rejects query when engine is not initialized", () => {
  resetDecisionQueryEngineForTests();
  const result = listDecisionStates();
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});

test("runs decision query engine certification", () => {
  const result = runDecisionQueryEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 20);
});

test("query results are immutable", () => {
  seedDecisionState();
  const result = listDecisionStates();
  assert.equal(Object.isFrozen(result.data), true);
  assert.equal(Object.isFrozen(result.data?.states), true);
});
