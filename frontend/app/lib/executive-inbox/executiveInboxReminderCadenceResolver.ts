/**
 * APP-11:5 — Executive Inbox Reminder cadence metadata resolver.
 */

import {
  EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS,
  EXECUTIVE_INBOX_REMINDER_SOURCE_CADENCE_MAP,
} from "./executiveInboxReminderEngineConstants.ts";
import type { ExecutiveInboxPriority } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { ExecutiveNotification } from "./executiveInboxNotificationEngineTypes.ts";
import type {
  NotificationReminderInput,
  ReminderCadence,
  ReminderCadenceKey,
} from "./executiveInboxReminderEngineTypes.ts";

const CADENCE_LABELS: Readonly<Record<ReminderCadenceKey, string>> = Object.freeze({
  immediate: "Immediate",
  same_day: "Same Day",
  next_day: "Next Day",
  weekly: "Weekly",
  monthly: "Monthly",
  custom_metadata: "Custom Metadata",
});

const CADENCE_DESCRIPTIONS: Readonly<Record<ReminderCadenceKey, string>> = Object.freeze({
  immediate: "Return to executive attention immediately (metadata only, no scheduling).",
  same_day: "Return to executive attention same day (metadata only, no scheduling).",
  next_day: "Return to executive attention next day (metadata only, no scheduling).",
  weekly: "Return to executive attention weekly (metadata only, no scheduling).",
  monthly: "Return to executive attention monthly (metadata only, no scheduling).",
  custom_metadata: "Custom cadence metadata label (no real scheduling).",
});

function resolveBaseCadenceKey(
  notification: ExecutiveNotification,
  priority: ExecutiveInboxPriority
): ReminderCadenceKey {
  if (notification.triggerType === "timeline_deadline") {
    return "same_day";
  }
  if (notification.triggerType === "executive_decision_required") {
    return "next_day";
  }
  if (notification.triggerType === "critical_priority") {
    return "immediate";
  }
  return EXECUTIVE_INBOX_REMINDER_SOURCE_CADENCE_MAP[priority.priorityLevel] ?? "weekly";
}

export function resolveReminderCadence(entry: NotificationReminderInput): ReminderCadence {
  const cadenceKey = entry.cadenceOverride ?? resolveBaseCadenceKey(entry.notification, entry.priority);
  const label = CADENCE_LABELS[cadenceKey];
  const description = CADENCE_DESCRIPTIONS[cadenceKey];
  return Object.freeze({
    cadenceKey,
    label,
    description,
    metadataOnly: true as const,
    customLabel: cadenceKey === "custom_metadata" ? entry.customCadenceLabel?.trim() : undefined,
    readOnly: true as const,
  });
}

export function isReminderCadenceKey(value: string): value is ReminderCadenceKey {
  return (EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS as readonly string[]).includes(value);
}

export const ExecutiveInboxReminderCadenceResolver = Object.freeze({
  resolveReminderCadence,
  isReminderCadenceKey,
});
