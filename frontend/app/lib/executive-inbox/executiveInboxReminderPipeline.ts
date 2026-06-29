/**
 * APP-11:5 — Executive Inbox Reminder Engine deterministic pipeline.
 */

import { EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES } from "./executiveInboxReminderEngineConstants.ts";
import { registerReminder } from "./executiveInboxReminderEngineRegistry.ts";
import { buildExecutiveReminder } from "./executiveInboxReminderRecordBuilder.ts";
import type {
  ExecutiveInboxReminderRequest,
  ExecutiveReminder,
  NotificationReminderInput,
  ReminderGenerationResult,
} from "./executiveInboxReminderEngineTypes.ts";
import {
  validateExecutiveInboxReminderRequest,
  validateExecutiveReminder,
  validateReminderDependencies,
} from "./executiveInboxReminderEngineValidation.ts";

function emptyResult(
  request: ExecutiveInboxReminderRequest,
  reason: string,
  generationTimestamp: string
): ReminderGenerationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    reminders: Object.freeze([]),
    registeredReminderIds: Object.freeze([]),
    skippedEntries: 0,
    ineligibleEntries: 0,
    pipelineStages: EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

function sortEntriesDeterministically(
  entries: readonly NotificationReminderInput[]
): readonly NotificationReminderInput[] {
  return Object.freeze(
    [...entries].sort((left, right) =>
      left.notification.notificationId.localeCompare(right.notification.notificationId)
    )
  );
}

export function buildExecutiveReminders(
  request: ExecutiveInboxReminderRequest
): readonly ExecutiveReminder[] {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();
  const sortedEntries = sortEntriesDeterministically(request.entries);

  return Object.freeze(
    sortedEntries
      .map((entry) => buildExecutiveReminder(entry, generationTimestamp))
      .filter((reminder) => reminder.eligibility.eligible)
  );
}

export function generateExecutiveReminders(
  request: ExecutiveInboxReminderRequest
): ReminderGenerationResult {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();

  const dependencyValidation = validateReminderDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const requestValidation = validateExecutiveInboxReminderRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const sortedEntries = sortEntriesDeterministically(request.entries);
  const builtReminders: ExecutiveReminder[] = [];
  let ineligibleEntries = 0;

  for (const entry of sortedEntries) {
    const reminder = buildExecutiveReminder(entry, generationTimestamp);
    if (!reminder.eligibility.eligible) {
      ineligibleEntries += 1;
      continue;
    }
    builtReminders.push(reminder);
  }

  const registeredReminderIds: string[] = [];
  let skippedEntries = 0;

  for (const reminder of builtReminders) {
    const reminderValidation = validateExecutiveReminder(reminder);
    if (!reminderValidation.valid) {
      return emptyResult(
        request,
        `Reminder validation failed: ${reminderValidation.issues.map((issue) => issue.message).join("; ")}`,
        generationTimestamp
      );
    }
    const registration = registerReminder(reminder);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_reminder") {
        skippedEntries += 1;
        continue;
      }
      return emptyResult(request, registration.reason, generationTimestamp);
    }
    registeredReminderIds.push(reminder.reminderId);
  }

  const reminders = Object.freeze(
    registeredReminderIds
      .map((reminderId) => builtReminders.find((entry) => entry.reminderId === reminderId))
      .filter((entry): entry is ExecutiveReminder => entry !== undefined)
      .sort((left, right) => left.reminderId.localeCompare(right.reminderId))
  );

  return Object.freeze({
    success: reminders.length > 0 || ineligibleEntries > 0,
    reason:
      reminders.length > 0
        ? `Generated ${reminders.length} executive reminder record(s) deterministically.`
        : ineligibleEntries > 0
          ? "No notification records met reminder eligibility rules."
          : "No executive reminders were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    reminders,
    registeredReminderIds: Object.freeze(registeredReminderIds),
    skippedEntries,
    ineligibleEntries,
    pipelineStages: EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxReminderPipeline = Object.freeze({
  generateExecutiveReminders,
  buildExecutiveReminders,
  stages: EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES,
});
