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
import type { CertifiedInboxSourceRecordInput } from "./executiveInboxAggregationEngineTypes.ts";
import {
  calculateExecutivePriorities,
  initializeExecutiveInboxPrioritization,
} from "./executiveInboxPrioritizationEngine.ts";
import {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS,
} from "./executiveInboxNotificationEngineConstants.ts";
import {
  ExecutiveInboxNotificationEngine,
  buildExecutiveNotifications,
  generateExecutiveNotifications,
  getNotification,
  getNotifications,
  initializeExecutiveInboxNotificationEngine,
  notificationExists,
  registerNotification,
  unregisterNotification,
  validateExecutiveNotifications,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST,
} from "./executiveInboxNotificationEngine.ts";
import { evaluateNotificationEligibility } from "./executiveInboxNotificationEligibilityEvaluator.ts";
import { getNotificationRegistrySnapshot } from "./executiveInboxNotificationEngineRegistry.ts";
import {
  resetExecutiveInboxNotificationEnginePlatformForTests,
  runExecutiveInboxNotificationCertification,
} from "./executiveInboxNotificationEngineRunner.ts";
import { resolveNotificationTrigger } from "./executiveInboxNotificationTriggerResolver.ts";
import type { PrioritizedInboxNotificationInput } from "./executiveInboxNotificationEngineTypes.ts";
import {
  hasDuplicateIds,
  isNotificationCategory,
  isNotificationTriggerType,
  validateExecutiveNotificationProvenance,
} from "./executiveInboxNotificationEngineValidation.ts";
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

function buildPrioritizedEntries(): readonly PrioritizedInboxNotificationInput[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-notification-test-session",
      sessionLabel: "Notification Test Session",
      sourceRecords: Object.freeze([
        sourceRecord("001", "risk"),
        sourceRecord("002", "decision"),
        sourceRecord("003", "assistant"),
      ]),
      aggregationTimestamp: FIXED_TIME,
    })
  );
  const priorities = calculateExecutivePriorities(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-notification-test-session",
      items: Object.freeze(aggregation.aggregatedItems.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  return Object.freeze(
    aggregation.aggregatedItems.map((item) => {
      const priority = priorities.find((entry) => entry.itemId === item.itemId)!;
      return Object.freeze({ priority, item });
    })
  );
}

test.beforeEach(() => {
  resetExecutiveInboxNotificationEnginePlatformForTests();
  buildExecutiveInboxFoundation(FIXED_TIME);
  initializeExecutiveInboxAggregation(FIXED_TIME);
  initializeExecutiveInboxPrioritization(FIXED_TIME);
  initializeExecutiveInboxNotificationEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxNotificationEngine.ts",
    allowedFiles: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("generates executive notification records from prioritized items", () => {
  const entries = buildPrioritizedEntries();
  const result = generateExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-notification-test-session",
      entries,
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.ok(result.notifications.length >= 2);
  assert.equal(result.pipelineStages.length, EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.notifications.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("evaluates notification eligibility deterministically", () => {
  const entries = buildPrioritizedEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const eligibility = evaluateNotificationEligibility(riskEntry);
  assert.equal(eligibility.eligible, true);
  assert.ok(eligibility.evaluatedRules.length > 0);
});

test("resolves trigger types from source type and priority", () => {
  const entries = buildPrioritizedEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const trigger = resolveNotificationTrigger(riskEntry.priority, riskEntry.item);
  assert.equal(trigger.triggerType, "risk_escalation");
  assert.ok(trigger.reason.includes("Risk Escalation"));
});

test("preserves complete provenance on notification records", () => {
  const entries = buildPrioritizedEntries();
  const built = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "provenance-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const notification = built[0];
  assert.ok(notification);
  assert.equal(validateExecutiveNotificationProvenance(notification.provenance).valid, true);
  assert.equal(notification.provenance.foundationVersion, "APP-11/1");
  assert.equal(notification.provenance.prioritizationVersion, "APP-11/3");
});

test("registers retrieves and unregisters notifications", () => {
  const entries = buildPrioritizedEntries();
  const result = generateExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "registry-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const notificationId = result.registeredNotificationIds[0];
  assert.ok(notificationId);
  assert.equal(notificationExists(notificationId), true);
  assert.ok(getNotification(notificationId));
  assert.equal(getNotifications(WORKSPACE).length, 1);
  const removed = unregisterNotification(notificationId);
  assert.equal(removed.success, true);
  assert.equal(notificationExists(notificationId), false);
});

test("rejects duplicate notification registration", () => {
  const entries = buildPrioritizedEntries();
  const built = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "duplicate-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const notification = built[0];
  assert.ok(notification);
  registerNotification(notification);
  const duplicate = registerNotification(notification);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_notification");
});

test("rejects duplicate priority ids in notification request", () => {
  const entries = buildPrioritizedEntries();
  const entry = entries[0]!;
  const result = generateExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "dup-entries-session",
      entries: Object.freeze([entry, entry]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-11:1 through APP-11:3 before notification generation", () => {
  const entries = buildPrioritizedEntries();
  resetExecutiveInboxPlatformForTests();
  resetExecutiveInboxAggregationEngineForTests();
  const result = generateExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "no-deps-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation|Aggregation|Prioritization|foundation|aggregation|prioritization/i);
});

test("validates executive notification contracts", () => {
  const entries = buildPrioritizedEntries();
  const built = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-session",
      entries,
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(validateExecutiveNotifications(built).valid, true);
});

test("exports pipeline stages and trigger vocabulary", () => {
  assert.equal(EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES.length, 9);
  assert.equal(isNotificationTriggerType("risk_escalation"), true);
  assert.equal(isNotificationCategory("risk"), true);
  assert.equal(EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS.length, 9);
  assert.equal(EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION, "APP-11/4");
});

test("enforces public API rules without delivery or scheduling", () => {
  assert.equal(EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noDelivery, true);
  assert.equal(EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noPushNotifications, true);
  assert.equal(EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noScheduling, true);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b"]), false);
});

test("registry snapshot reflects registered notifications", () => {
  const entries = buildPrioritizedEntries();
  generateExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "snapshot-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getNotificationRegistrySnapshot();
  assert.equal(snapshot.notificationCount, 1);
  assert.equal(snapshot.registryVersion, "APP-11/4");
});

test("ExecutiveInboxNotificationEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxNotificationEngine.generateExecutiveNotifications, "function");
  assert.equal(typeof ExecutiveInboxNotificationEngine.buildExecutiveNotifications, "function");
  assert.equal(typeof ExecutiveInboxNotificationEngine.validateExecutiveNotifications, "function");
  assert.equal(ExecutiveInboxNotificationEngine.version, "APP-11/4");
  assert.equal(ExecutiveInboxNotificationEngine.prioritizationVersion, "APP-11/3");
});

test("regression: APP-10 platform remains valid", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive inbox notification engine certification", () => {
  const result = runExecutiveInboxNotificationCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-11/4");
});
