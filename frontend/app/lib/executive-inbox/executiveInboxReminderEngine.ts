/**
 * APP-11:5 — Executive Inbox Reminder Engine.
 * Deterministic executive reminder intent record generation from notification records.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_INBOX_MUST_NOT_OWN, EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxNotificationEngineConstants.ts";
import { EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST } from "./executiveInboxNotificationEngine.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxPrioritizationEngineConstants.ts";
import {
  EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_REMINDER_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_REMINDER_ENGINE_TAGS,
  EXECUTIVE_INBOX_REMINDER_MANDATORY_REMINDER_FIELDS,
} from "./executiveInboxReminderEngineConstants.ts";
import {
  buildExecutiveReminders,
  generateExecutiveReminders as generateExecutiveRemindersFromPipeline,
} from "./executiveInboxReminderPipeline.ts";
import {
  getReminder,
  getReminders,
  getReminderRegistrySnapshot,
  reminderExists,
  registerReminder,
  resetExecutiveInboxReminderEngineRegistryForTests,
  unregisterReminder,
} from "./executiveInboxReminderEngineRegistry.ts";
import type {
  ExecutiveInboxReminderEngineState,
  ExecutiveInboxReminderRequest,
  ReminderEngineResult,
  ReminderGenerationResult,
} from "./executiveInboxReminderEngineTypes.ts";
import {
  validateExecutiveReminder,
  validateExecutiveReminders,
  validateReminderDependencies,
} from "./executiveInboxReminderEngineValidation.ts";

export const EXECUTIVE_INBOX_REMINDER_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_INBOX_REMINDER_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/5",
  title: "Executive Inbox Reminder Engine",
  goal: "Deterministic executive reminder eligibility, intent records, cadence metadata, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngineConstants.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngineTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngineValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEligibilityEvaluator.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderTriggerResolver.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderCadenceResolver.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderRecordBuilder.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngineRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderPipeline.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngine.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngineRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxReminderEngine.test.ts",
    "docs/app-11-5-executive-inbox-reminder-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_REMINDER_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-11/1", "APP-11/2", "APP-11/3", "APP-11/4"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_REMINDER_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeExecutiveInboxReminderEngine(
  timestamp: string = engineTimestamp
): ExecutiveInboxReminderEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getExecutiveInboxReminderEngineState(timestamp);
}

export function isExecutiveInboxReminderEngineInitialized(): boolean {
  return engineInitialized;
}

export function getExecutiveInboxReminderEngineState(
  timestamp: string = engineTimestamp
): ExecutiveInboxReminderEngineState {
  const registry = getReminderRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-inbox-reminder-engine",
    contractVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredReminderCount: registry.reminderCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveInboxReminderEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveInboxReminderEngineRegistryForTests();
}

function assertEngineReady<T>(): ReminderEngineResult<T> | null {
  const dependencyValidation = validateReminderDependencies();
  if (!dependencyValidation.valid) {
    const firstIssue = dependencyValidation.issues[0];
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: firstIssue?.code ?? "dependency_incompatible",
        message: firstIssue?.message ?? "Dependencies not satisfied.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isExecutiveInboxReminderEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Inbox Reminder Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "engine_not_initialized",
        message: "Engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  return null;
}

export function generateExecutiveRemindersWithEngine(
  request: ExecutiveInboxReminderRequest
): ReminderGenerationResult {
  const blocked = assertEngineReady<ReminderGenerationResult>();
  if (blocked) {
    const generationTimestamp = request.generationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      reminders: Object.freeze([]),
      registeredReminderIds: Object.freeze([]),
      skippedEntries: 0,
      ineligibleEntries: 0,
      pipelineStages: Object.freeze([]),
      generationTimestamp,
      readOnly: true as const,
    });
  }
  return generateExecutiveRemindersFromPipeline(request);
}

export {
  generateExecutiveRemindersWithEngine as generateExecutiveReminders,
  buildExecutiveReminders,
  validateExecutiveReminders,
};
export {
  registerReminder,
  unregisterReminder,
  getReminder,
  getReminders,
  reminderExists,
  getReminderRegistrySnapshot,
};
export { validateExecutiveReminder };
export { runExecutiveInboxReminderCertification } from "./executiveInboxReminderEngineRunner.ts";

export const EXECUTIVE_INBOX_REMINDER_ENGINE_VERSION = EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;

export const ExecutiveInboxReminderEngine = Object.freeze({
  initializeExecutiveInboxReminderEngine,
  isExecutiveInboxReminderEngineInitialized,
  getExecutiveInboxReminderEngineState,
  generateExecutiveReminders: generateExecutiveRemindersWithEngine,
  buildExecutiveReminders,
  validateExecutiveReminders,
  registerReminder,
  getReminders,
  getReminder,
  reminderExists,
  resetExecutiveInboxReminderEngineForTests,
  version: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  aggregationVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  prioritizationVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  notificationVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_INBOX_REMINDER_MANDATORY_REMINDER_FIELDS,
  tags: EXECUTIVE_INBOX_REMINDER_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_INBOX_MUST_NOT_OWN,
});
