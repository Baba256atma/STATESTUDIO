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
  buildExecutiveReminders,
  initializeExecutiveInboxReminderEngine,
} from "./executiveInboxReminderEngine.ts";
import {
  EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES,
  EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS,
} from "./executiveInboxSchedulingEngineConstants.ts";
import {
  ExecutiveInboxSchedulingEngine,
  buildExecutiveScheduleIntents,
  generateExecutiveScheduleIntents,
  getScheduleIntent,
  getScheduleIntents,
  initializeExecutiveInboxSchedulingEngine,
  registerScheduleIntent,
  scheduleIntentExists,
  unregisterScheduleIntent,
  validateExecutiveScheduleIntents,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST,
} from "./executiveInboxSchedulingEngine.ts";
import { evaluateSchedulingEligibility } from "./executiveInboxSchedulingEligibilityEvaluator.ts";
import { getScheduleRegistrySnapshot } from "./executiveInboxSchedulingEngineRegistry.ts";
import {
  resetExecutiveInboxSchedulingEnginePlatformForTests,
  runExecutiveInboxSchedulingCertification,
} from "./executiveInboxSchedulingEngineRunner.ts";
import { resolveScheduleTrigger } from "./executiveInboxSchedulingTriggerResolver.ts";
import { resolveScheduleWindow } from "./executiveInboxSchedulingWindowResolver.ts";
import type { ReminderScheduleInput } from "./executiveInboxSchedulingEngineTypes.ts";
import {
  hasDuplicateIds,
  isScheduleTriggerType,
  isScheduleWindowKey,
  validateExecutiveScheduleProvenance,
} from "./executiveInboxSchedulingEngineValidation.ts";
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

function buildScheduleEntries(): readonly ReminderScheduleInput[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-test-session",
      sessionLabel: "Scheduling Test Session",
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
      sessionId: "inbox-scheduling-test-session",
      items: Object.freeze(aggregation.aggregatedItems.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: FIXED_TIME,
    })
  );
  const notifications = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-test-session",
      entries: Object.freeze(
        aggregation.aggregatedItems.map((item) => {
          const priority = priorities.find((entry) => entry.itemId === item.itemId)!;
          return Object.freeze({ item, priority });
        })
      ),
      generationTimestamp: FIXED_TIME,
    })
  );
  const reminders = buildExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-test-session",
      entries: Object.freeze(
        notifications.map((notification) => {
          const item = aggregation.aggregatedItems.find((entry) => entry.itemId === notification.itemId)!;
          const priority = priorities.find((entry) => entry.itemId === notification.itemId)!;
          return Object.freeze({ notification, priority, item });
        })
      ),
      generationTimestamp: FIXED_TIME,
    })
  );
  return Object.freeze(
    reminders.map((reminder) => {
      const item = aggregation.aggregatedItems.find((entry) => entry.itemId === reminder.itemId)!;
      const priority = priorities.find((entry) => entry.itemId === reminder.itemId)!;
      const notification = notifications.find((entry) => entry.notificationId === reminder.notificationId)!;
      return Object.freeze({ reminder, notification, priority, item });
    })
  );
}

test.beforeEach(() => {
  resetExecutiveInboxSchedulingEnginePlatformForTests();
  buildExecutiveInboxFoundation(FIXED_TIME);
  initializeExecutiveInboxAggregation(FIXED_TIME);
  initializeExecutiveInboxPrioritization(FIXED_TIME);
  initializeExecutiveInboxNotificationEngine(FIXED_TIME);
  initializeExecutiveInboxReminderEngine(FIXED_TIME);
  initializeExecutiveInboxSchedulingEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngine.ts",
    allowedFiles: EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("generates executive schedule intents from reminder records", () => {
  const entries = buildScheduleEntries();
  const result = generateExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-test-session",
      entries,
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.ok(result.scheduleIntents.length >= 2);
  assert.equal(result.pipelineStages.length, EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.scheduleIntents.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("evaluates scheduling eligibility deterministically", () => {
  const entries = buildScheduleEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const eligibility = evaluateSchedulingEligibility(riskEntry);
  assert.equal(eligibility.eligible, true);
  assert.ok(eligibility.evaluatedRules.length > 0);
});

test("resolves schedule trigger types from reminder context", () => {
  const entries = buildScheduleEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const trigger = resolveScheduleTrigger(riskEntry.reminder);
  assert.equal(trigger.triggerType, "risk_schedule");
  assert.ok(trigger.reason.includes("Risk Schedule"));
});

test("resolves schedule window metadata without calendar behavior", () => {
  const entries = buildScheduleEntries();
  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  assert.ok(riskEntry);
  const window = resolveScheduleWindow(riskEntry);
  assert.equal(window.metadataOnly, true);
  assert.ok(window.description.includes("metadata only"));
});

test("preserves complete provenance on schedule intents", () => {
  const entries = buildScheduleEntries();
  const built = buildExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "provenance-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const intent = built[0];
  assert.ok(intent);
  assert.equal(validateExecutiveScheduleProvenance(intent.provenance).valid, true);
  assert.equal(intent.provenance.foundationVersion, "APP-11/1");
  assert.equal(intent.provenance.reminderVersion, "APP-11/5");
});

test("registers retrieves and unregisters schedule intents", () => {
  const entries = buildScheduleEntries();
  const result = generateExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "registry-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const scheduleId = result.registeredScheduleIds[0];
  assert.ok(scheduleId);
  assert.equal(scheduleIntentExists(scheduleId), true);
  assert.ok(getScheduleIntent(scheduleId));
  assert.equal(getScheduleIntents(WORKSPACE).length, 1);
  const removed = unregisterScheduleIntent(scheduleId);
  assert.equal(removed.success, true);
  assert.equal(scheduleIntentExists(scheduleId), false);
});

test("rejects duplicate schedule intent registration", () => {
  const entries = buildScheduleEntries();
  const built = buildExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "duplicate-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const intent = built[0];
  assert.ok(intent);
  registerScheduleIntent(intent);
  const duplicate = registerScheduleIntent(intent);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_schedule");
});

test("rejects duplicate reminder ids in scheduling request", () => {
  const entries = buildScheduleEntries();
  const entry = entries[0]!;
  const result = generateExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "dup-entries-session",
      entries: Object.freeze([entry, entry]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-11:1 through APP-11:5 before scheduling generation", () => {
  const entries = buildScheduleEntries();
  resetExecutiveInboxPlatformForTests();
  resetExecutiveInboxAggregationEngineForTests();
  const result = generateExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "no-deps-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation|Aggregation|Prioritization|Notification|Reminder|foundation|aggregation|prioritization|notification|reminder/i);
});

test("validates executive schedule intent contracts", () => {
  const entries = buildScheduleEntries();
  const built = buildExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-session",
      entries,
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(validateExecutiveScheduleIntents(built).valid, true);
});

test("exports pipeline stages and schedule vocabulary", () => {
  assert.equal(EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES.length, 10);
  assert.equal(isScheduleTriggerType("risk_schedule"), true);
  assert.equal(isScheduleWindowKey("this_week"), true);
  assert.equal(EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS.length, 9);
  assert.equal(EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS.length, 7);
  assert.equal(EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION, "APP-11/6");
});

test("enforces public API rules without calendar or background jobs", () => {
  assert.equal(EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.noCalendarEvents, true);
  assert.equal(EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.noBackgroundJobs, true);
  assert.equal(EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.scheduleWindowMetadataOnly, true);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b"]), false);
});

test("registry snapshot reflects registered schedule intents", () => {
  const entries = buildScheduleEntries();
  generateExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "snapshot-session",
      entries: Object.freeze([entries[0]!]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getScheduleRegistrySnapshot();
  assert.equal(snapshot.scheduleCount, 1);
  assert.equal(snapshot.registryVersion, "APP-11/6");
});

test("ExecutiveInboxSchedulingEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxSchedulingEngine.generateExecutiveScheduleIntents, "function");
  assert.equal(typeof ExecutiveInboxSchedulingEngine.buildExecutiveScheduleIntents, "function");
  assert.equal(typeof ExecutiveInboxSchedulingEngine.validateExecutiveScheduleIntents, "function");
  assert.equal(ExecutiveInboxSchedulingEngine.version, "APP-11/6");
  assert.equal(ExecutiveInboxSchedulingEngine.reminderVersion, "APP-11/5");
});

test("regression: APP-10 platform remains valid", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive inbox scheduling engine certification", () => {
  const result = runExecutiveInboxSchedulingCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-11/6");
});
