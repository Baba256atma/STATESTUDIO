/**
 * APP-11:5 — Executive Inbox Reminder Engine validation.
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
import {
  EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS,
  EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS,
  EXECUTIVE_INBOX_REMINDER_MANDATORY_REMINDER_FIELDS,
  EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS,
} from "./executiveInboxReminderEngineConstants.ts";
import type {
  ExecutiveInboxReminderRequest,
  ExecutiveReminder,
  ExecutiveReminderProfile,
  ExecutiveReminderProvenance,
  ReminderCadence,
  ReminderEligibility,
  ReminderEvidence,
  ReminderTrigger,
  ReminderValidationIssue,
  ReminderValidationResult,
} from "./executiveInboxReminderEngineTypes.ts";

function issue(code: string, message: string, field?: string): ReminderValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ReminderValidationIssue[]): ReminderValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isReminderTriggerType(value: string): value is ReminderTrigger["triggerType"] {
  return (EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS as readonly string[]).includes(value);
}

export function isReminderCadenceKey(value: string): value is ReminderCadence["cadenceKey"] {
  return (EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS as readonly string[]).includes(value);
}

export function validateReminderTrigger(trigger: ReminderTrigger): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!isReminderTriggerType(trigger.triggerType)) {
    issues.push(issue("invalid_trigger", "triggerType is invalid.", "triggerType"));
  }
  if (!trigger.label.trim() || !trigger.reason.trim()) {
    issues.push(issue("invalid_trigger", "Trigger label and reason are required.", "trigger"));
  }
  return result(issues);
}

export function validateReminderCadence(cadence: ReminderCadence): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!isReminderCadenceKey(cadence.cadenceKey)) {
    issues.push(issue("invalid_cadence", "cadenceKey is invalid.", "cadenceKey"));
  }
  if (cadence.metadataOnly !== true) {
    issues.push(issue("invalid_cadence", "Cadence must be metadata-only.", "metadataOnly"));
  }
  if (!cadence.label.trim() || !cadence.description.trim()) {
    issues.push(issue("invalid_cadence", "Cadence label and description are required.", "cadence"));
  }
  if (
    cadence.cadenceKey === "custom_metadata" &&
    (!cadence.customLabel?.trim() ||
      cadence.customLabel.length > EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS.maxCustomCadenceLabelLength)
  ) {
    issues.push(issue("invalid_cadence", "customLabel is required for custom_metadata cadence.", "customLabel"));
  }
  return result(issues);
}

export function validateReminderEligibility(eligibility: ReminderEligibility): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!eligibility.reason.trim()) {
    issues.push(issue("invalid_eligibility", "Eligibility reason is required.", "reason"));
  }
  if (eligibility.evaluatedRules.length === 0) {
    issues.push(issue("invalid_eligibility", "evaluatedRules must not be empty.", "evaluatedRules"));
  }
  return result(issues);
}

export function validateReminderEvidence(evidence: ReminderEvidence): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!evidence.evidenceId.trim() || !evidence.signal.trim() || !evidence.rationale.trim()) {
    issues.push(issue("invalid_evidence", "Evidence fields are incomplete.", "evidence"));
  }
  return result(issues);
}

export function validateExecutiveReminderProvenance(
  provenance: ExecutiveReminderProvenance
): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!provenance.notificationId.trim() || !provenance.itemId.trim() || !provenance.priorityId.trim()) {
    issues.push(issue("missing_provenance", "notificationId, itemId, and priorityId are required.", "provenance"));
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
  if (provenance.engineVersion !== EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.foundationVersion !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch.", "provenance.foundationVersion"));
  }
  return result(issues);
}

export function validateExecutiveReminderProfile(profile: ExecutiveReminderProfile): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!profile.profileId.trim() || !profile.reminderId.trim()) {
    issues.push(issue("invalid_profile", "Profile identity is incomplete.", "profile"));
  }
  if (
    !profile.executiveSummary.trim() ||
    profile.executiveSummary.length > EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS.maxExecutiveSummaryLength
  ) {
    issues.push(issue("invalid_summary", "executiveSummary is invalid.", "executiveSummary"));
  }
  if (profile.supportingEvidence.length > EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS.maxEvidenceEntries) {
    issues.push(issue("limit_exceeded", "supportingEvidence exceeds limit.", "supportingEvidence"));
  }
  issues.push(...validateReminderTrigger(profile.reminderTrigger).issues);
  issues.push(...validateReminderCadence(profile.cadence).issues);
  issues.push(...validateReminderEligibility(profile.eligibility).issues);
  for (const entry of profile.supportingEvidence) {
    issues.push(...validateReminderEvidence(entry).issues);
  }
  issues.push(...validateExecutiveReminderProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveReminder(reminder: ExecutiveReminder): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  for (const field of EXECUTIVE_INBOX_REMINDER_MANDATORY_REMINDER_FIELDS) {
    if (!(field in reminder) || reminder[field as keyof ExecutiveReminder] === undefined) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (reminder.version !== EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (reminder.engineVersion !== EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "engineVersion mismatch.", "engineVersion"));
  }
  if (reminder.readOnly !== true) {
    issues.push(issue("invalid_reminder", "Reminder must be read-only.", "readOnly"));
  }
  issues.push(...validateExecutiveReminderProfile(reminder.profile).issues);
  issues.push(...validateExecutiveReminderProvenance(reminder.provenance).issues);
  return result(issues);
}

export function validateExecutiveReminders(reminders: readonly ExecutiveReminder[]): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (hasDuplicateIds(reminders.map((entry) => entry.reminderId))) {
    issues.push(issue("duplicate_reminders", "Reminders contain duplicate IDs.", "reminders"));
  }
  for (const reminder of reminders) {
    issues.push(...validateExecutiveReminder(reminder).issues);
  }
  return result(issues);
}

export function validateExecutiveInboxReminderRequest(
  request: ExecutiveInboxReminderRequest
): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (request.entries.length === 0) {
    issues.push(issue("missing_field", "entries must not be empty.", "entries"));
  }
  if (request.entries.length > EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS.maxReminderEntries) {
    issues.push(issue("limit_exceeded", "entries exceeds limit.", "entries"));
  }
  if (hasDuplicateIds(request.entries.map((entry) => entry.notification.notificationId))) {
    issues.push(issue("duplicate_entries", "entries contain duplicate notificationIds.", "entries"));
  }
  for (const entry of request.entries) {
    issues.push(...validateExecutiveNotification(entry.notification).issues);
    issues.push(...validateExecutivePriority(entry.priority).issues);
    issues.push(...validateExecutiveInboxItem(entry.item).issues);
    if (entry.notification.eligibility.eligible !== true) {
      issues.push(issue("notification_ineligible", "Notification must be eligible.", "notification"));
    }
    if (entry.notification.itemId !== entry.item.itemId || entry.notification.itemId !== entry.priority.itemId) {
      issues.push(issue("identity_mismatch", "Notification, item, and priority identity mismatch.", "itemId"));
    }
    if (entry.item.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Workspace mismatch for entry.", "workspaceId"));
    }
    if (entry.item.provenance.aggregationVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("invalid_dependency", "Item aggregation version incompatible.", "aggregationVersion"));
    }
    if (entry.cadenceOverride && !isReminderCadenceKey(entry.cadenceOverride)) {
      issues.push(issue("invalid_cadence", "cadenceOverride is invalid.", "cadenceOverride"));
    }
  }
  return result(issues);
}

export function validateReminderDependencies(): ReminderValidationResult {
  const issues: ReminderValidationIssue[] = [];
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
  return result(issues);
}
