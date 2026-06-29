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
  buildExecutiveNotifications,
  initializeExecutiveInboxNotificationEngine,
} from "./executiveInboxNotificationEngine.ts";
import {
  calculateExecutivePriorities,
  initializeExecutiveInboxPrioritization,
} from "./executiveInboxPrioritizationEngine.ts";
import {
  EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS,
  EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES,
  EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS,
} from "./executiveInboxReminderEngineConstants.ts";
import {
  ExecutiveInboxReminderEngine,
  buildExecutiveReminders,
  generateExecutiveReminders,
  getReminder,
  getReminders,
  initializeExecutiveInboxReminderEngine,
  registerReminder,
  reminderExists,
  unregisterReminder,
  validateExecutiveReminders,
  EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST,
} from "./executiveInboxReminderEngine.ts";
import { resolveReminderCadence } from "./executiveInboxReminderCadenceResolver.ts";
import { evaluateReminderEligibility } from "./executiveInboxReminderEligibilityEvaluator.ts";
import { getReminderRegistrySnapshot } from "./executiveInboxReminderEngineRegistry.ts";
import {
  resetExecutiveInboxReminderEnginePlatformForTests,
  runExecutiveInboxReminderCertification,
} from "./executiveInboxReminderEngineRunner.ts";
import { resolveReminderTrigger } from "./executiveInboxReminderTriggerResolver.ts";
import type { NotificationReminderInput } from "./executiveInboxReminderEngineTypes.ts";
import {
  hasDuplicateIds,
  isReminderCadenceKey,
  isReminderTriggerType,
  validateExecutiveReminderProvenance,
} from "./executiveInboxReminderEngineValidation.ts";
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

function buildReminderEntries(): readonly NotificationReminderInput[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-reminder-test-session",
      sessionLabel: "Reminder Test Session",
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
      sessionId: "inbox-reminder-test-session",
      items: Object.freeze(aggregation.aggregatedItems.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  const notifications = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-reminder-test-session",
      entries: Object.freeze(
        aggregation.aggregatedItems.map((item) => {
          const priority = priorities.find((entry) => entry.itemId === item.itemId)!;
          return Object.freeze({ item, priority });
        })
      ),
      generationTimestamp: FIXED_TIME,
    })
  );
  return Object.freeze(
    notifications.map((notification) => {
      const item = aggregation.aggregatedItems.find((entry) => entry.itemId === notification.itemId)!;
      const priority = priorities.find((entry) => entry.itemId === notification.itemId)!;
      return Object.freeze({ notification, priority, item });
    })
  );
}

test.beforeEach(() => {
  resetExecutiveInboxReminderEnginePlatformForTests();
  buildExecutiveInboxFoundation(FIXED_TIME);
  initializeExecutiveInboxAggregation(FIXED_TIME);
  initializeExecutiveInboxPrioritization(FIXED_TIME);
  initializeExecutiveInboxNotificationEngine(FIXED_TIME);
  initializeExecutiveInboxReminderEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxReminderEngine.ts",
    allowedFiles: EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("generates executive reminder records from notification records", () => {
  const entries = buildReminderEntries();
  const result = generateExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-reminder-test-session",
      entries,
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.ok(result.reminders.length >= 2);
  assert.equal(result.pipelineStages.length, EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.reminders.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("evaluates reminder eligibility deterministically", () => {
  const entries = buildReminderEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const eligibility = evaluateReminderEligibility(riskEntry);
  assert.equal(eligibility.eligible, true);
  assert.ok(eligibility.evaluatedRules.length > 0);
});

test("resolves reminder trigger types from notification context", () => {
  const entries = buildReminderEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const trigger = resolveReminderTrigger(riskEntry.notification, riskEntry.item);
  assert.equal(trigger.triggerType, "risk_review");
  assert.ok(trigger.reason.includes("Risk Review"));
});

test("resolves cadence metadata without scheduling behavior", () => {
  const entries = buildReminderEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const cadence = resolveReminderCadence(riskEntry);
  assert.equal(cadence.metadataOnly, true);
  assert.ok(cadence.description.includes("metadata only"));
});

test("preserves complete provenance on reminder records", () => {
  const entries = buildReminderEntries();
  const built = buildExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "provenance-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const reminder = built[0];
  assert.ok(reminder);
  assert.equal(validateExecutiveReminderProvenance(reminder.provenance).valid, true);
  assert.equal(reminder.provenance.foundationVersion, "APP-11/1");
  assert.equal(reminder.provenance.notificationVersion, "APP-11/4");
});

test("registers retrieves and unregisters reminders", () => {
  const entries = buildReminderEntries();
  const result = generateExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "registry-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const reminderId = result.registeredReminderIds[0];
  assert.ok(reminderId);
  assert.equal(reminderExists(reminderId), true);
  assert.ok(getReminder(reminderId));
  assert.equal(getReminders(WORKSPACE).length, 1);
  const removed = unregisterReminder(reminderId);
  assert.equal(removed.success, true);
  assert.equal(reminderExists(reminderId), false);
});

test("rejects duplicate reminder registration", () => {
  const entries = buildReminderEntries();
  const built = buildExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "duplicate-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const reminder = built[0];
  assert.ok(reminder);
  registerReminder(reminder);
  const duplicate = registerReminder(reminder);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_reminder");
});

test("rejects duplicate notification ids in reminder request", () => {
  const entries = buildReminderEntries();
  const entry = entries[0]!;
  const result = generateExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "dup-entries-session",
      entries: Object.freeze([entry, entry]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-11:1 through APP-11:4 before reminder generation", () => {
  const entries = buildReminderEntries();
  resetExecutiveInboxPlatformForTests();
  resetExecutiveInboxAggregationEngineForTests();
  const result = generateExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "no-deps-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation|Aggregation|Prioritization|Notification|foundation|aggregation|prioritization|notification/i);
});

test("validates executive reminder contracts", () => {
  const entries = buildReminderEntries();
  const built = buildExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-session",
      entries,
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(validateExecutiveReminders(built).valid, true);
});

test("exports pipeline stages and trigger vocabulary", () => {
  assert.equal(EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES.length, 10);
  assert.equal(isReminderTriggerType("risk_review"), true);
  assert.equal(isReminderCadenceKey("weekly"), true);
  assert.equal(EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS.length, 9);
  assert.equal(EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS.length, 6);
  assert.equal(EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION, "APP-11/5");
});

test("enforces public API rules without delivery or scheduling", () => {
  assert.equal(EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.noDelivery, true);
  assert.equal(EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.noScheduling, true);
  assert.equal(EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.cadenceMetadataOnly, true);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b"]), false);
});

test("registry snapshot reflects registered reminders", () => {
  const entries = buildReminderEntries();
  generateExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "snapshot-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getReminderRegistrySnapshot();
  assert.equal(snapshot.reminderCount, 1);
  assert.equal(snapshot.registryVersion, "APP-11/5");
});

test("ExecutiveInboxReminderEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxReminderEngine.generateExecutiveReminders, "function");
  assert.equal(typeof ExecutiveInboxReminderEngine.buildExecutiveReminders, "function");
  assert.equal(typeof ExecutiveInboxReminderEngine.validateExecutiveReminders, "function");
  assert.equal(ExecutiveInboxReminderEngine.version, "APP-11/5");
  assert.equal(ExecutiveInboxReminderEngine.notificationVersion, "APP-11/4");
});

test("regression: APP-10 platform remains valid", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive inbox reminder engine certification", () => {
  const result = runExecutiveInboxReminderCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-11/5");
});
