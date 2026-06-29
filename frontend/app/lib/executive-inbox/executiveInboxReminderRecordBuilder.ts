/**
 * APP-11:5 — Executive Inbox Reminder record builder.
 */

import { EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION } from "./executiveInboxReminderEngineConstants.ts";
import { resolveReminderCadence } from "./executiveInboxReminderCadenceResolver.ts";
import { evaluateReminderEligibility } from "./executiveInboxReminderEligibilityEvaluator.ts";
import { resolveReminderTrigger } from "./executiveInboxReminderTriggerResolver.ts";
import type {
  ExecutiveReminder,
  ExecutiveReminderProfile,
  ExecutiveReminderProvenance,
  NotificationReminderInput,
  ReminderEligibility,
  ReminderEvidence,
} from "./executiveInboxReminderEngineTypes.ts";

export function buildReminderId(notificationId: string): string {
  return `executive-reminder-${notificationId}`;
}

export function buildExecutiveReminderProvenance(
  entry: NotificationReminderInput
): ExecutiveReminderProvenance {
  const { notification, priority, item } = entry;
  return Object.freeze({
    notificationId: notification.notificationId,
    itemId: item.itemId,
    priorityId: priority.priorityId,
    originatingPlatform: item.provenance.originatingPlatform,
    workspaceId: item.workspaceId,
    aggregationVersion: item.provenance.aggregationVersion,
    prioritizationVersion: priority.version,
    notificationVersion: notification.version,
    engineVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-11/1" as const,
    readOnly: true as const,
  });
}

export function buildSupportingEvidence(
  entry: NotificationReminderInput,
  eligibility: ReminderEligibility
): readonly ReminderEvidence[] {
  const notificationEvidence = entry.notification.supportingEvidence.slice(0, 2).map((entry) =>
    Object.freeze({
      evidenceId: `reminder-evidence-${entry.evidenceId}`,
      signal: entry.signal,
      rationale: entry.rationale,
      readOnly: true as const,
    })
  );
  const eligibilityEvidence = Object.freeze({
    evidenceId: `reminder-evidence-eligibility-${entry.notification.notificationId}`,
    signal: "reminder_eligibility_evaluation",
    rationale: eligibility.reason,
    readOnly: true as const,
  });
  const cadenceEvidence = Object.freeze({
    evidenceId: `reminder-evidence-cadence-${entry.notification.notificationId}`,
    signal: "cadence_metadata_resolution",
    rationale: resolveReminderCadence(entry).description,
    readOnly: true as const,
  });
  return Object.freeze([...notificationEvidence, eligibilityEvidence, cadenceEvidence]);
}

export function buildExecutiveSummary(entry: NotificationReminderInput): string {
  const cadence = resolveReminderCadence(entry);
  return `Executive reminder (${cadence.label} cadence) for ${entry.item.sourceType} notification: ${entry.notification.executiveSummary}`;
}

export function buildExecutiveReminderProfile(
  entry: NotificationReminderInput,
  generationTimestamp: string
): ExecutiveReminderProfile {
  const { notification, priority, item } = entry;
  const eligibility = evaluateReminderEligibility(entry);
  const reminderTrigger = resolveReminderTrigger(notification, item);
  const cadence = resolveReminderCadence(entry);
  const reminderId = buildReminderId(notification.notificationId);
  const provenance = buildExecutiveReminderProvenance(entry);

  return Object.freeze({
    profileId: `reminder-profile-${notification.notificationId}`,
    reminderId,
    notificationId: notification.notificationId,
    itemId: item.itemId,
    priorityId: priority.priorityId,
    workspaceId: item.workspaceId,
    reminderTrigger,
    cadence,
    executiveSummary: buildExecutiveSummary(entry),
    supportingEvidence: buildSupportingEvidence(entry, eligibility),
    eligibility,
    provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveReminder(
  entry: NotificationReminderInput,
  generationTimestamp: string
): ExecutiveReminder {
  const profile = buildExecutiveReminderProfile(entry, generationTimestamp);
  return Object.freeze({
    reminderId: profile.reminderId,
    notificationId: profile.notificationId,
    itemId: profile.itemId,
    priorityId: profile.priorityId,
    workspaceId: profile.workspaceId,
    reminderTrigger: profile.reminderTrigger,
    cadence: profile.cadence,
    executiveSummary: profile.executiveSummary,
    supportingEvidence: profile.supportingEvidence,
    profile,
    eligibility: profile.eligibility,
    provenance: profile.provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ExecutiveInboxReminderRecordBuilder = Object.freeze({
  buildReminderId,
  buildExecutiveReminderProvenance,
  buildSupportingEvidence,
  buildExecutiveSummary,
  buildExecutiveReminderProfile,
  buildExecutiveReminder,
});
