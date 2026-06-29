/**
 * APP-11:6 — Executive Inbox Scheduling intent builder.
 */

import { EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION } from "./executiveInboxSchedulingEngineConstants.ts";
import { evaluateSchedulingEligibility } from "./executiveInboxSchedulingEligibilityEvaluator.ts";
import { resolveScheduleTrigger } from "./executiveInboxSchedulingTriggerResolver.ts";
import { resolveScheduleWindow } from "./executiveInboxSchedulingWindowResolver.ts";
import type {
  ExecutiveScheduleIntent,
  ExecutiveScheduleProfile,
  ExecutiveScheduleProvenance,
  ReminderScheduleInput,
  ScheduleEligibility,
  ScheduleEvidence,
} from "./executiveInboxSchedulingEngineTypes.ts";

export function buildScheduleId(reminderId: string): string {
  return `executive-schedule-${reminderId.replace("executive-reminder-", "")}`;
}

export function buildExecutiveScheduleProvenance(entry: ReminderScheduleInput): ExecutiveScheduleProvenance {
  const { reminder, notification, priority, item } = entry;
  return Object.freeze({
    reminderId: reminder.reminderId,
    notificationId: notification.notificationId,
    itemId: item.itemId,
    priorityId: priority.priorityId,
    originatingPlatform: item.provenance.originatingPlatform,
    workspaceId: item.workspaceId,
    aggregationVersion: item.provenance.aggregationVersion,
    prioritizationVersion: priority.version,
    notificationVersion: notification.version,
    reminderVersion: reminder.version,
    engineVersion: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-11/1" as const,
    readOnly: true as const,
  });
}

export function buildSupportingEvidence(
  entry: ReminderScheduleInput,
  eligibility: ScheduleEligibility
): readonly ScheduleEvidence[] {
  const reminderEvidence = entry.reminder.supportingEvidence.slice(0, 2).map((evidence) =>
    Object.freeze({
      evidenceId: `schedule-evidence-${evidence.evidenceId}`,
      signal: evidence.signal,
      rationale: evidence.rationale,
      readOnly: true as const,
    })
  );
  const eligibilityEvidence = Object.freeze({
    evidenceId: `schedule-evidence-eligibility-${entry.reminder.reminderId}`,
    signal: "scheduling_eligibility_evaluation",
    rationale: eligibility.reason,
    readOnly: true as const,
  });
  const windowEvidence = Object.freeze({
    evidenceId: `schedule-evidence-window-${entry.reminder.reminderId}`,
    signal: "schedule_window_metadata",
    rationale: resolveScheduleWindow(entry).description,
    readOnly: true as const,
  });
  return Object.freeze([...reminderEvidence, eligibilityEvidence, windowEvidence]);
}

export function buildExecutiveSummary(entry: ReminderScheduleInput): string {
  const window = resolveScheduleWindow(entry);
  return `Executive schedule intent (${window.label} window) for ${entry.item.sourceType} reminder: ${entry.reminder.executiveSummary}`;
}

export function buildExecutiveScheduleProfile(
  entry: ReminderScheduleInput,
  generationTimestamp: string
): ExecutiveScheduleProfile {
  const { reminder, notification, priority, item } = entry;
  const eligibility = evaluateSchedulingEligibility(entry);
  const scheduleTrigger = resolveScheduleTrigger(reminder);
  const scheduleWindow = resolveScheduleWindow(entry);
  const scheduleId = buildScheduleId(reminder.reminderId);
  const provenance = buildExecutiveScheduleProvenance(entry);

  return Object.freeze({
    profileId: `schedule-profile-${reminder.reminderId}`,
    scheduleId,
    reminderId: reminder.reminderId,
    notificationId: notification.notificationId,
    itemId: item.itemId,
    priorityId: priority.priorityId,
    workspaceId: item.workspaceId,
    scheduleTrigger,
    scheduleWindow,
    executiveSummary: buildExecutiveSummary(entry),
    supportingEvidence: buildSupportingEvidence(entry, eligibility),
    eligibility,
    provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveScheduleIntent(
  entry: ReminderScheduleInput,
  generationTimestamp: string
): ExecutiveScheduleIntent {
  const profile = buildExecutiveScheduleProfile(entry, generationTimestamp);
  return Object.freeze({
    scheduleId: profile.scheduleId,
    reminderId: profile.reminderId,
    notificationId: profile.notificationId,
    itemId: profile.itemId,
    priorityId: profile.priorityId,
    workspaceId: profile.workspaceId,
    scheduleTrigger: profile.scheduleTrigger,
    scheduleWindow: profile.scheduleWindow,
    executiveSummary: profile.executiveSummary,
    supportingEvidence: profile.supportingEvidence,
    profile,
    eligibility: profile.eligibility,
    provenance: profile.provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ExecutiveInboxSchedulingIntentBuilder = Object.freeze({
  buildScheduleId,
  buildExecutiveScheduleProvenance,
  buildSupportingEvidence,
  buildExecutiveSummary,
  buildExecutiveScheduleProfile,
  buildExecutiveScheduleIntent,
});
