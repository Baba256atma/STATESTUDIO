/**
 * APP-11:6 — Executive Inbox Scheduling window metadata resolver.
 */

import {
  EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS,
  EXECUTIVE_INBOX_SCHEDULING_CADENCE_WINDOW_MAP,
} from "./executiveInboxSchedulingEngineConstants.ts";
import type { ExecutiveInboxPriority } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { ExecutiveReminder } from "./executiveInboxReminderEngineTypes.ts";
import type {
  ReminderScheduleInput,
  ScheduleWindow,
  ScheduleWindowKey,
} from "./executiveInboxSchedulingEngineTypes.ts";

const WINDOW_LABELS: Readonly<Record<ScheduleWindowKey, string>> = Object.freeze({
  immediate: "Immediate",
  today: "Today",
  tomorrow: "Tomorrow",
  this_week: "This Week",
  next_week: "Next Week",
  this_month: "This Month",
  custom_metadata: "Custom Metadata",
});

const WINDOW_DESCRIPTIONS: Readonly<Record<ScheduleWindowKey, string>> = Object.freeze({
  immediate: "Return to executive attention immediately (metadata only, no calendar event).",
  today: "Planned attention window today (metadata only, no calendar event).",
  tomorrow: "Planned attention window tomorrow (metadata only, no calendar event).",
  this_week: "Planned attention window this week (metadata only, no calendar event).",
  next_week: "Planned attention window next week (metadata only, no calendar event).",
  this_month: "Planned attention window this month (metadata only, no calendar event).",
  custom_metadata: "Custom schedule window metadata (no real scheduling).",
});

function resolveBaseWindowKey(reminder: ExecutiveReminder, priority: ExecutiveInboxPriority): ScheduleWindowKey {
  if (priority.priorityLevel === "critical") {
    return "immediate";
  }
  if (reminder.reminderTrigger.triggerType === "timeline_deadline") {
    return "today";
  }
  if (reminder.reminderTrigger.triggerType === "decision_deadline") {
    return "tomorrow";
  }
  return EXECUTIVE_INBOX_SCHEDULING_CADENCE_WINDOW_MAP[reminder.cadence.cadenceKey];
}

export function resolveScheduleWindow(entry: ReminderScheduleInput): ScheduleWindow {
  const windowKey = entry.windowOverride ?? resolveBaseWindowKey(entry.reminder, entry.priority);
  const label = WINDOW_LABELS[windowKey];
  const description = WINDOW_DESCRIPTIONS[windowKey];
  return Object.freeze({
    windowKey,
    label,
    description,
    metadataOnly: true as const,
    customLabel: windowKey === "custom_metadata" ? entry.customWindowLabel?.trim() : undefined,
    metadataDate: entry.metadataDate?.trim() || undefined,
    readOnly: true as const,
  });
}

export function isScheduleWindowKey(value: string): value is ScheduleWindowKey {
  return (EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS as readonly string[]).includes(value);
}

export const ExecutiveInboxSchedulingWindowResolver = Object.freeze({
  resolveScheduleWindow,
  isScheduleWindowKey,
});
