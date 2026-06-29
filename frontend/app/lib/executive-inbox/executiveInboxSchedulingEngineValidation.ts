/**
 * APP-11:6 — Executive Inbox Scheduling Engine validation.
 */

import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { isExecutiveInboxAggregationInitialized } from "./executiveInboxAggregationEngine.ts";
import { validateExecutiveInboxItem } from "./executiveInboxAggregationEngineValidation.ts";
import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { isExecutiveInboxPlatformInitialized } from "./executiveInboxFoundation.ts";
import { EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxNotificationEngineConstants.ts";
import { isExecutiveInboxNotificationEngineInitialized } from "./executiveInboxNotificationEngine.ts";
import { validateExecutiveNotification } from "./executiveInboxNotificationEngineValidation.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxPrioritizationEngineConstants.ts";
import { isExecutiveInboxPrioritizationInitialized } from "./executiveInboxPrioritizationEngine.ts";
import { validateExecutivePriority } from "./executiveInboxPrioritizationEngineValidation.ts";
import { EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION } from "./executiveInboxReminderEngineConstants.ts";
import { isExecutiveInboxReminderEngineInitialized } from "./executiveInboxReminderEngine.ts";
import { validateExecutiveReminder } from "./executiveInboxReminderEngineValidation.ts";
import {
  EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS,
  EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS,
  EXECUTIVE_INBOX_SCHEDULING_MANDATORY_SCHEDULE_FIELDS,
} from "./executiveInboxSchedulingEngineConstants.ts";
import type {
  ExecutiveInboxSchedulingRequest,
  ExecutiveScheduleIntent,
  ExecutiveScheduleProfile,
  ExecutiveScheduleProvenance,
  ScheduleEligibility,
  ScheduleEvidence,
  ScheduleTrigger,
  ScheduleValidationIssue,
  ScheduleValidationResult,
  ScheduleWindow,
} from "./executiveInboxSchedulingEngineTypes.ts";

function issue(code: string, message: string, field?: string): ScheduleValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScheduleValidationIssue[]): ScheduleValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isScheduleTriggerType(value: string): value is ScheduleTrigger["triggerType"] {
  return (EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS as readonly string[]).includes(value);
}

export function isScheduleWindowKey(value: string): value is ScheduleWindow["windowKey"] {
  return (EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS as readonly string[]).includes(value);
}

export function validateScheduleTrigger(trigger: ScheduleTrigger): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!isScheduleTriggerType(trigger.triggerType)) {
    issues.push(issue("invalid_trigger", "triggerType is invalid.", "triggerType"));
  }
  if (!trigger.label.trim() || !trigger.reason.trim()) {
    issues.push(issue("invalid_trigger", "Trigger label and reason are required.", "trigger"));
  }
  return result(issues);
}

export function validateScheduleWindow(window: ScheduleWindow): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!isScheduleWindowKey(window.windowKey)) {
    issues.push(issue("invalid_window", "windowKey is invalid.", "windowKey"));
  }
  if (window.metadataOnly !== true) {
    issues.push(issue("invalid_window", "Schedule window must be metadata-only.", "metadataOnly"));
  }
  if (!window.label.trim() || !window.description.trim()) {
    issues.push(issue("invalid_window", "Window label and description are required.", "scheduleWindow"));
  }
  if (
    window.windowKey === "custom_metadata" &&
    (!window.customLabel?.trim() ||
      window.customLabel.length > EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS.maxCustomWindowLabelLength)
  ) {
    issues.push(issue("invalid_window", "customLabel is required for custom_metadata window.", "customLabel"));
  }
  return result(issues);
}

export function validateScheduleEligibility(eligibility: ScheduleEligibility): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!eligibility.reason.trim()) {
    issues.push(issue("invalid_eligibility", "Eligibility reason is required.", "reason"));
  }
  if (eligibility.evaluatedRules.length === 0) {
    issues.push(issue("invalid_eligibility", "evaluatedRules must not be empty.", "evaluatedRules"));
  }
  return result(issues);
}

export function validateScheduleEvidence(evidence: ScheduleEvidence): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!evidence.evidenceId.trim() || !evidence.signal.trim() || !evidence.rationale.trim()) {
    issues.push(issue("invalid_evidence", "Evidence fields are incomplete.", "evidence"));
  }
  return result(issues);
}

export function validateExecutiveScheduleProvenance(
  provenance: ExecutiveScheduleProvenance
): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (
    !provenance.reminderId.trim() ||
    !provenance.notificationId.trim() ||
    !provenance.itemId.trim() ||
    !provenance.priorityId.trim()
  ) {
    issues.push(issue("missing_provenance", "Reminder chain IDs are required.", "provenance"));
  }
  if (!provenance.originatingPlatform.trim() || !provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "originatingPlatform and workspaceId are required.", "provenance"));
  }
  if (!provenance.aggregationVersion.trim()) {
    issues.push(issue("missing_provenance", "aggregationVersion is required.", "provenance.aggregationVersion"));
  }
  if (provenance.prioritizationVersion !== EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "prioritizationVersion mismatch.", "provenance.prioritizationVersion"));
  }
  if (provenance.notificationVersion !== EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "notificationVersion mismatch.", "provenance.notificationVersion"));
  }
  if (provenance.reminderVersion !== EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "reminderVersion mismatch.", "provenance.reminderVersion"));
  }
  if (provenance.engineVersion !== EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.foundationVersion !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch.", "provenance.foundationVersion"));
  }
  return result(issues);
}

export function validateExecutiveScheduleProfile(profile: ExecutiveScheduleProfile): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!profile.profileId.trim() || !profile.scheduleId.trim()) {
    issues.push(issue("invalid_profile", "Profile identity is incomplete.", "profile"));
  }
  if (
    !profile.executiveSummary.trim() ||
    profile.executiveSummary.length > EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS.maxExecutiveSummaryLength
  ) {
    issues.push(issue("invalid_summary", "executiveSummary is invalid.", "executiveSummary"));
  }
  if (profile.supportingEvidence.length > EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS.maxEvidenceEntries) {
    issues.push(issue("limit_exceeded", "supportingEvidence exceeds limit.", "supportingEvidence"));
  }
  issues.push(...validateScheduleTrigger(profile.scheduleTrigger).issues);
  issues.push(...validateScheduleWindow(profile.scheduleWindow).issues);
  issues.push(...validateScheduleEligibility(profile.eligibility).issues);
  for (const entry of profile.supportingEvidence) {
    issues.push(...validateScheduleEvidence(entry).issues);
  }
  issues.push(...validateExecutiveScheduleProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveScheduleIntent(intent: ExecutiveScheduleIntent): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  for (const field of EXECUTIVE_INBOX_SCHEDULING_MANDATORY_SCHEDULE_FIELDS) {
    if (!(field in intent) || intent[field as keyof ExecutiveScheduleIntent] === undefined) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (intent.version !== EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (intent.engineVersion !== EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "engineVersion mismatch.", "engineVersion"));
  }
  if (intent.readOnly !== true) {
    issues.push(issue("invalid_schedule", "Schedule intent must be read-only.", "readOnly"));
  }
  issues.push(...validateExecutiveScheduleProfile(intent.profile).issues);
  issues.push(...validateExecutiveScheduleProvenance(intent.provenance).issues);
  return result(issues);
}

export function validateExecutiveScheduleIntents(
  intents: readonly ExecutiveScheduleIntent[]
): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (hasDuplicateIds(intents.map((entry) => entry.scheduleId))) {
    issues.push(issue("duplicate_schedules", "Schedule intents contain duplicate IDs.", "scheduleIntents"));
  }
  for (const intent of intents) {
    issues.push(...validateExecutiveScheduleIntent(intent).issues);
  }
  return result(issues);
}

export function validateExecutiveInboxSchedulingRequest(
  request: ExecutiveInboxSchedulingRequest
): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (request.entries.length === 0) {
    issues.push(issue("missing_field", "entries must not be empty.", "entries"));
  }
  if (request.entries.length > EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS.maxScheduleEntries) {
    issues.push(issue("limit_exceeded", "entries exceeds limit.", "entries"));
  }
  if (hasDuplicateIds(request.entries.map((entry) => entry.reminder.reminderId))) {
    issues.push(issue("duplicate_entries", "entries contain duplicate reminderIds.", "entries"));
  }
  for (const entry of request.entries) {
    issues.push(...validateExecutiveReminder(entry.reminder).issues);
    issues.push(...validateExecutiveNotification(entry.notification).issues);
    issues.push(...validateExecutivePriority(entry.priority).issues);
    issues.push(...validateExecutiveInboxItem(entry.item).issues);
    if (entry.reminder.eligibility.eligible !== true) {
      issues.push(issue("reminder_ineligible", "Reminder must be eligible.", "reminder"));
    }
    if (entry.reminder.notificationId !== entry.notification.notificationId) {
      issues.push(issue("identity_mismatch", "Reminder and notification identity mismatch.", "notificationId"));
    }
    if (
      entry.reminder.priorityId !== entry.priority.priorityId ||
      entry.reminder.itemId !== entry.item.itemId ||
      entry.reminder.itemId !== entry.priority.itemId
    ) {
      issues.push(issue("identity_mismatch", "Reminder chain identity mismatch.", "itemId"));
    }
    if (entry.item.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Workspace mismatch for entry.", "workspaceId"));
    }
    if (entry.item.provenance.aggregationVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("invalid_dependency", "Item aggregation version incompatible.", "aggregationVersion"));
    }
    if (entry.windowOverride && !isScheduleWindowKey(entry.windowOverride)) {
      issues.push(issue("invalid_window", "windowOverride is invalid.", "windowOverride"));
    }
  }
  return result(issues);
}

export function validateSchedulingDependencies(): ScheduleValidationResult {
  const issues: ScheduleValidationIssue[] = [];
  if (!isExecutiveInboxPlatformInitialized()) {
    issues.push(issue("foundation_incompatible", "APP-11:1 foundation is not initialized.", "foundation"));
  }
  if (!isExecutiveInboxAggregationInitialized()) {
    issues.push(issue("aggregation_incompatible", "APP-11:2 aggregation engine is not initialized.", "aggregation"));
  }
  if (!isExecutiveInboxPrioritizationInitialized()) {
    issues.push(
      issue("prioritization_incompatible", "APP-11:3 prioritization engine is not initialized.", "prioritization")
    );
  }
  if (!isExecutiveInboxNotificationEngineInitialized()) {
    issues.push(
      issue("notification_incompatible", "APP-11:4 notification engine is not initialized.", "notification")
    );
  }
  if (!isExecutiveInboxReminderEngineInitialized()) {
    issues.push(issue("reminder_incompatible", "APP-11:5 reminder engine is not initialized.", "reminder"));
  }
  return result(issues);
}
