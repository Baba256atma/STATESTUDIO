import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { buildExecutiveInboxFoundation } from "./executiveInboxFoundation.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP,
} from "./executiveInboxAggregationEngineConstants.ts";
import {
  aggregateExecutiveInbox,
  initializeExecutiveInboxAggregation,
  resetExecutiveInboxAggregationEngineForTests,
} from "./executiveInboxAggregationEngine.ts";
import type { CertifiedInboxSourceRecordInput, ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import { resetExecutiveInboxAggregationEnginePlatformForTests } from "./executiveInboxAggregationEngineRunner.ts";
import {
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import {
  ExecutiveInboxPrioritizationEngine,
  calculateExecutivePriorities,
  getPriorities,
  getPriority,
  initializeExecutiveInboxPrioritization,
  prioritizeExecutiveInbox,
  priorityExists,
  registerPriority,
  resetExecutiveInboxPrioritizationEngineForTests,
  unregisterPriority,
  validateExecutivePriority,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST,
} from "./executiveInboxPrioritizationEngine.ts";
import { resolvePriorityLevel } from "./executiveInboxPrioritizationCalculator.ts";
import { evaluatePriorityDimensions } from "./executiveInboxPrioritizationDimensionEvaluator.ts";
import { getPriorityRegistrySnapshot } from "./executiveInboxPrioritizationEngineRegistry.ts";
import {
  resetExecutiveInboxPrioritizationEnginePlatformForTests,
  runExecutiveInboxPrioritizationCertification,
} from "./executiveInboxPrioritizationEngineRunner.ts";
import {
  hasDuplicateIds,
  isPriorityDimensionKey,
  isPriorityLevel,
  validateExecutivePriorityProvenance,
} from "./executiveInboxPrioritizationEngineValidation.ts";
import { resetExecutiveInboxPlatformForTests } from "./executiveInboxRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-001";

function sourceRecord(
  suffix: string,
  sourceType: CertifiedInboxSourceRecordInput["sourceType"]
): CertifiedInboxSourceRecordInput {
  const mapping = EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP[sourceType];
  return Object.freeze({
    sourceId: `inbox-source-${sourceType}-${suffix}`,
    sourceType,
    workspaceId: WORKSPACE,
    platformId: mapping.platformId,
    appId: mapping.defaultAppId,
    recordId: `${sourceType}-record-${suffix}`,
    businessContext: `Executive attention required for ${sourceType} ${suffix}.`,
    summary: `Review ${sourceType} matter ${suffix} from certified platform.`,
    sourceVersion: mapping.defaultAppId === "APP-5" ? "APP-5/1" : "APP-10/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9", "APP-10", "APP-11/1"]),
  });
}

function aggregateTestItems(): readonly ExecutiveInboxItem[] {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-prioritization-test-session",
      sessionLabel: "Prioritization Test Session",
      sourceRecords: Object.freeze([
        sourceRecord("001", "risk"),
        sourceRecord("002", "decision"),
        sourceRecord("003", "assistant"),
      ]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  return result.aggregatedItems;
}

test.beforeEach(() => {
  resetExecutiveInboxPrioritizationEnginePlatformForTests();
  buildExecutiveInboxFoundation(FIXED_TIME);
  initializeExecutiveInboxAggregation(FIXED_TIME);
  initializeExecutiveInboxPrioritization(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngine.ts",
    allowedFiles: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("prioritizes aggregated inbox items deterministically", () => {
  const items = aggregateTestItems();
  const result = prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-prioritization-test-session",
      items: Object.freeze(items.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.prioritizedItems.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.prioritizedItems.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("orders risk items above assistant items by weighted score", () => {
  const items = aggregateTestItems();
  const result = prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "ordering-session",
      items: Object.freeze(items.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.prioritizedItems[0]?.itemId, items.find((entry) => entry.sourceType === "risk")?.itemId);
  assert.ok((result.prioritizedItems[0]?.weightedScore ?? 0) > (result.prioritizedItems.at(-1)?.weightedScore ?? 0));
});

test("evaluates priority dimensions with explainable evidence", () => {
  const items = aggregateTestItems();
  const evaluation = evaluatePriorityDimensions(Object.freeze({ item: items[0]! }));
  assert.equal(evaluation.evidence.length, EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS.length);
  assert.ok(evaluation.evidence.every((entry) => entry.rationale.includes("scored")));
});

test("preserves complete provenance on priority profiles", () => {
  const items = aggregateTestItems();
  const calculated = calculateExecutivePriorities(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "provenance-session",
      items: Object.freeze([Object.freeze({ item: items[0]! })]),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  const priority = calculated[0];
  assert.ok(priority);
  assert.equal(validateExecutivePriorityProvenance(priority.provenance).valid, true);
  assert.equal(priority.provenance.foundationVersion, "APP-11/1");
  assert.equal(priority.provenance.calculationVersion, "APP-11/3-calc-v1");
});

test("registers retrieves and unregisters priorities", () => {
  const items = aggregateTestItems();
  const result = prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "registry-session",
      items: Object.freeze([Object.freeze({ item: items[0]! })]),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  const priorityId = result.registeredPriorityIds[0];
  assert.ok(priorityId);
  assert.equal(priorityExists(priorityId), true);
  assert.ok(getPriority(priorityId));
  assert.equal(getPriorities(WORKSPACE).length, 1);
  const removed = unregisterPriority(priorityId);
  assert.equal(removed.success, true);
  assert.equal(priorityExists(priorityId), false);
});

test("rejects duplicate priority registration", () => {
  const items = aggregateTestItems();
  const calculated = calculateExecutivePriorities(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "duplicate-session",
      items: Object.freeze([Object.freeze({ item: items[0]! })]),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  const priority = calculated[0];
  assert.ok(priority);
  registerPriority(priority);
  const duplicate = registerPriority(priority);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_priority");
});

test("rejects duplicate item ids in prioritization request", () => {
  const items = aggregateTestItems();
  const item = items[0]!;
  const result = prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "dup-items-session",
      items: Object.freeze([Object.freeze({ item }), Object.freeze({ item })]),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-11:1 and APP-11:2 before prioritization", () => {
  const items = aggregateTestItems();
  resetExecutiveInboxPlatformForTests();
  resetExecutiveInboxAggregationEngineForTests();
  const result = prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "no-deps-session",
      items: Object.freeze([Object.freeze({ item: items[0]! })]),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation|Aggregation|aggregation|foundation/i);
});

test("validates executive priority contracts", () => {
  const items = aggregateTestItems();
  const calculated = calculateExecutivePriorities(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-session",
      items: Object.freeze(items.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  assert.ok(calculated.every((entry) => validateExecutivePriority(entry).valid));
});

test("exports pipeline stages and priority vocabulary", () => {
  assert.equal(EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES.length, 9);
  assert.equal(isPriorityDimensionKey("business_impact"), true);
  assert.equal(isPriorityLevel("critical"), true);
  assert.equal(EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION, "APP-11/3");
});

test("enforces public API rules without notifications or scheduling", () => {
  assert.equal(EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.noNotifications, true);
  assert.equal(EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.noScheduling, true);
  assert.equal(EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.explainableOnly, true);
});

test("resolves priority levels deterministically", () => {
  assert.equal(resolvePriorityLevel(90), "critical");
  assert.equal(resolvePriorityLevel(75), "high");
  assert.equal(resolvePriorityLevel(55), "medium");
  assert.equal(resolvePriorityLevel(35), "low");
  assert.equal(resolvePriorityLevel(10), "informational");
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b"]), false);
});

test("registry snapshot reflects registered priorities", () => {
  const items = aggregateTestItems();
  prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "snapshot-session",
      items: Object.freeze([Object.freeze({ item: items[0]! })]),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getPriorityRegistrySnapshot();
  assert.equal(snapshot.priorityCount, 1);
  assert.equal(snapshot.registryVersion, "APP-11/3");
});

test("ExecutiveInboxPrioritizationEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxPrioritizationEngine.prioritizeExecutiveInbox, "function");
  assert.equal(typeof ExecutiveInboxPrioritizationEngine.calculateExecutivePriorities, "function");
  assert.equal(typeof ExecutiveInboxPrioritizationEngine.validateExecutivePriority, "function");
  assert.equal(ExecutiveInboxPrioritizationEngine.version, "APP-11/3");
  assert.equal(ExecutiveInboxPrioritizationEngine.aggregationVersion, "APP-11/2");
});

test("regression: APP-10 platform remains valid", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive inbox prioritization engine certification", () => {
  const result = runExecutiveInboxPrioritizationCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-11/3");
});
