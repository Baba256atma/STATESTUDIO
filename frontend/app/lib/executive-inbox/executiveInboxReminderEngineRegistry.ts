/**
 * APP-11:5 — Executive Inbox Reminder Engine immutable registry.
 */

import {
  EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS,
} from "./executiveInboxReminderEngineConstants.ts";
import type { InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type {
  ExecutiveReminder,
  ReminderEngineResult,
  ReminderId,
  ReminderRegistrySnapshot,
} from "./executiveInboxReminderEngineTypes.ts";
import { validateExecutiveReminder } from "./executiveInboxReminderEngineValidation.ts";

const reminderRegistry = new Map<ReminderId, ExecutiveReminder>();
const workspaceIndex = new Map<InboxWorkspaceId, Set<ReminderId>>();

function indexReminder(reminder: ExecutiveReminder): void {
  const ids = workspaceIndex.get(reminder.workspaceId) ?? new Set<ReminderId>();
  ids.add(reminder.reminderId);
  workspaceIndex.set(reminder.workspaceId, ids);
}

function unindexReminder(reminder: ExecutiveReminder): void {
  const ids = workspaceIndex.get(reminder.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(reminder.reminderId);
  if (ids.size === 0) {
    workspaceIndex.delete(reminder.workspaceId);
  }
}

export function resetExecutiveInboxReminderEngineRegistryForTests(): void {
  reminderRegistry.clear();
  workspaceIndex.clear();
}

export function reminderExists(reminderId: ReminderId): boolean {
  return reminderRegistry.has(reminderId);
}

export function registerReminder(reminder: ExecutiveReminder): ReminderEngineResult<ExecutiveReminder> {
  const validation = validateExecutiveReminder(reminder);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (reminderRegistry.has(reminder.reminderId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate reminder id: ${reminder.reminderId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_reminder",
        message: "Duplicate reminder id.",
        field: "reminderId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (reminderRegistry.size >= EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS.maxRegisteredReminders) {
    return Object.freeze({
      success: false,
      reason: "Reminder registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Reminder registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  reminderRegistry.set(reminder.reminderId, reminder);
  indexReminder(reminder);
  return Object.freeze({
    success: true,
    reason: "Executive reminder registered.",
    data: reminder,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterReminder(reminderId: ReminderId): ReminderEngineResult<ReminderId> {
  const existing = reminderRegistry.get(reminderId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Reminder not found: ${reminderId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Reminder not found.",
        field: "reminderId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  reminderRegistry.delete(reminderId);
  unindexReminder(existing);
  return Object.freeze({
    success: true,
    reason: "Executive reminder unregistered.",
    data: reminderId,
    error: null,
    readOnly: true as const,
  });
}

export function getReminder(reminderId: ReminderId): ExecutiveReminder | null {
  return reminderRegistry.get(reminderId) ?? null;
}

export function getReminders(workspaceId?: InboxWorkspaceId): readonly ExecutiveReminder[] {
  const sortByCadence = (left: ExecutiveReminder, right: ExecutiveReminder): number => {
    const cadenceDelta = left.cadence.cadenceKey.localeCompare(right.cadence.cadenceKey);
    if (cadenceDelta !== 0) {
      return cadenceDelta;
    }
    return left.reminderId.localeCompare(right.reminderId);
  };

  if (!workspaceId) {
    return Object.freeze([...reminderRegistry.values()].sort(sortByCadence));
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((reminderId) => reminderRegistry.get(reminderId))
      .filter((entry): entry is ExecutiveReminder => entry !== undefined)
      .sort(sortByCadence)
  );
}

export function getReminderRegistrySnapshot(): ReminderRegistrySnapshot {
  const reminderIds = Object.freeze([...reminderRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    reminderCount: reminderRegistry.size,
    reminderIds,
    readOnly: true as const,
  });
}

export const ExecutiveInboxReminderEngineRegistry = Object.freeze({
  resetExecutiveInboxReminderEngineRegistryForTests,
  reminderExists,
  registerReminder,
  unregisterReminder,
  getReminder,
  getReminders,
  getReminderRegistrySnapshot,
});
