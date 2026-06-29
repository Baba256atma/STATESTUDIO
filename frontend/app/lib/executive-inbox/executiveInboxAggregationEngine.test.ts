import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { buildExecutiveInboxFoundation } from "./executiveInboxFoundation.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP,
} from "./executiveInboxAggregationEngineConstants.ts";
import {
  ExecutiveInboxAggregationEngine,
  aggregateExecutiveInbox,
  getInboxItem,
  getInboxItems,
  inboxItemExists,
  initializeExecutiveInboxAggregation,
  registerInboxItem,
  resetExecutiveInboxAggregationEngineForTests,
  unregisterInboxItem,
  validateExecutiveInboxAggregation,
  validateExecutiveInboxItems,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST,
} from "./executiveInboxAggregationEngine.ts";
import { buildExecutiveInboxItemsFromRecords } from "./executiveInboxAggregationItemBuilder.ts";
import { getInboxAggregationSnapshot } from "./executiveInboxAggregationEngineRegistry.ts";
import {
  normalizeInboxSourceRecords,
  sortNormalizedRecordsDeterministically,
} from "./executiveInboxAggregationNormalizer.ts";
import {
  resetExecutiveInboxAggregationEnginePlatformForTests,
  runExecutiveInboxAggregationCertification,
} from "./executiveInboxAggregationEngineRunner.ts";
import type { CertifiedInboxSourceRecordInput } from "./executiveInboxAggregationEngineTypes.ts";
import {
  hasDuplicateIds,
  validateCertifiedInboxSourceRecordInput,
  validateExecutiveInboxItem,
  validateExecutiveInboxItemProvenance,
} from "./executiveInboxAggregationEngineValidation.ts";
import { isExecutiveInboxSourceType } from "./executiveInboxValidation.ts";
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

test.beforeEach(() => {
  resetExecutiveInboxAggregationEnginePlatformForTests();
  buildExecutiveInboxFoundation(FIXED_TIME);
  initializeExecutiveInboxAggregation(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxAggregationEngine.ts",
    allowedFiles: EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("aggregates executive inbox items from certified sources", () => {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-001",
      sessionLabel: "Executive Attention Session",
      sourceRecords: Object.freeze([
        sourceRecord("001", "scenario"),
        sourceRecord("002", "decision"),
        sourceRecord("003", "recommendation"),
      ]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.aggregatedItems.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.aggregatedItems.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("normalizes source records into immutable inbox items", () => {
  const normalized = sortNormalizedRecordsDeterministically(
    normalizeInboxSourceRecords(Object.freeze([sourceRecord("004", "timeline")]))
  );
  const items = buildExecutiveInboxItemsFromRecords(normalized, FIXED_TIME);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.ok(item);
  assert.equal(item.sourceType, "timeline");
  assert.equal(item.engineVersion, "APP-11/2");
  assert.equal(validateExecutiveInboxItem(item).valid, true);
});

test("preserves complete provenance on aggregated items", () => {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-provenance",
      sessionLabel: "Provenance Session",
      sourceRecords: Object.freeze([sourceRecord("005", "risk")]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  const item = result.aggregatedItems[0];
  assert.ok(item);
  assert.equal(validateExecutiveInboxItemProvenance(item.provenance).valid, true);
  assert.equal(item.provenance.foundationVersion, "APP-11/1");
  assert.equal(item.provenance.aggregationVersion, "APP-11/2");
  assert.ok(item.provenance.sourceApps.includes("APP-10"));
});

test("registers retrieves and unregisters inbox items", () => {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-registry",
      sessionLabel: "Registry Session",
      sourceRecords: Object.freeze([sourceRecord("006", "strategy")]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  const itemId = result.registeredItemIds[0];
  assert.ok(itemId);
  assert.equal(inboxItemExists(itemId), true);
  assert.ok(getInboxItem(itemId));
  assert.equal(getInboxItems(WORKSPACE).length, 1);
  const removed = unregisterInboxItem(itemId);
  assert.equal(removed.success, true);
  assert.equal(inboxItemExists(itemId), false);
});

test("rejects duplicate inbox item registration", () => {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-duplicate",
      sessionLabel: "Duplicate Session",
      sourceRecords: Object.freeze([sourceRecord("007", "workspace")]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  const item = result.aggregatedItems[0];
  assert.ok(item);
  const duplicate = registerInboxItem(item);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_item");
});

test("detects duplicate source ids in aggregation request", () => {
  const record = sourceRecord("008", "report");
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-dup-source",
      sessionLabel: "Duplicate Source Session",
      sourceRecords: Object.freeze([record, record]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects invalid certified source input", () => {
  const validation = validateCertifiedInboxSourceRecordInput(
    Object.freeze({
      ...sourceRecord("009", "assistant"),
      sourceApps: Object.freeze(["APP-99"]),
    })
  );
  assert.equal(validation.valid, false);
});

test("rejects workspace mismatch during aggregation", () => {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      sourceRecords: Object.freeze([
        Object.freeze({ ...sourceRecord("010", "scenario"), workspaceId: "ws-other" }),
      ]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-11:1 foundation before aggregation", () => {
  resetExecutiveInboxPlatformForTests();
  resetExecutiveInboxAggregationEngineForTests();
  initializeExecutiveInboxAggregation(FIXED_TIME);
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-no-foundation",
      sessionLabel: "No Foundation Session",
      sourceRecords: Object.freeze([sourceRecord("011", "decision")]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation/);
});

test("validates batch executive inbox aggregation", () => {
  const result = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-validation",
      sessionLabel: "Validation Session",
      sourceRecords: Object.freeze([sourceRecord("012", "scenario"), sourceRecord("013", "decision")]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(validateExecutiveInboxAggregation(result.aggregatedItems).valid, true);
  assert.equal(validateExecutiveInboxItems(result.aggregatedItems).valid, true);
});

test("exports pipeline stages and source vocabulary", () => {
  assert.equal(EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES.length, 8);
  assert.equal(isExecutiveInboxSourceType("scenario"), true);
  assert.equal(isExecutiveInboxSourceType("assistant"), true);
  assert.equal(EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION, "APP-11/2");
});

test("enforces public API rules without prioritization or notifications", () => {
  assert.equal(EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.noPrioritization, true);
  assert.equal(EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.noNotifications, true);
  assert.equal(EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
  assert.equal(EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.immutableItems, true);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b"]), false);
});

test("registry snapshot reflects registered items", () => {
  aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-session-snapshot",
      sessionLabel: "Snapshot Session",
      sourceRecords: Object.freeze([sourceRecord("014", "recommendation")]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getInboxAggregationSnapshot();
  assert.equal(snapshot.itemCount, 1);
  assert.equal(snapshot.registryVersion, "APP-11/2");
});

test("ExecutiveInboxAggregationEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxAggregationEngine.aggregateExecutiveInbox, "function");
  assert.equal(typeof ExecutiveInboxAggregationEngine.buildExecutiveInboxItems, "function");
  assert.equal(typeof ExecutiveInboxAggregationEngine.validateExecutiveInboxAggregation, "function");
  assert.equal(ExecutiveInboxAggregationEngine.version, "APP-11/2");
  assert.equal(ExecutiveInboxAggregationEngine.foundationVersion, "APP-11/1");
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive inbox aggregation engine certification", () => {
  const result = runExecutiveInboxAggregationCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-11/2");
});
