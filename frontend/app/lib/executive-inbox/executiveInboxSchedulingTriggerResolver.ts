/**
 * APP-11:6 — Executive Inbox Scheduling trigger resolver.
 */

import {
  EXECUTIVE_INBOX_SCHEDULING_REMINDER_TRIGGER_MAP,
  EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS,
} from "./executiveInboxSchedulingEngineConstants.ts";
import type { ExecutiveReminder } from "./executiveInboxReminderEngineTypes.ts";
import type { ScheduleTrigger, ScheduleTriggerType } from "./executiveInboxSchedulingEngineTypes.ts";

const TRIGGER_LABELS: Readonly<Record<ScheduleTriggerType, string>> = Object.freeze({
  critical_attention: "Critical Attention Window",
  decision_schedule: "Decision Schedule",
  timeline_schedule: "Timeline Schedule",
  risk_schedule: "Risk Schedule",
  strategy_schedule: "Strategy Schedule",
  recommendation_schedule: "Recommendation Schedule",
  workspace_schedule: "Workspace Schedule",
  report_schedule: "Report Schedule",
  assistant_schedule: "Assistant Schedule",
});

export function resolveScheduleTriggerType(reminder: ExecutiveReminder): ScheduleTriggerType {
  return EXECUTIVE_INBOX_SCHEDULING_REMINDER_TRIGGER_MAP[reminder.reminderTrigger.triggerType];
}

export function resolveScheduleTrigger(reminder: ExecutiveReminder): ScheduleTrigger {
  const triggerType = resolveScheduleTriggerType(reminder);
  const label = TRIGGER_LABELS[triggerType];
  return Object.freeze({
    triggerType,
    label,
    reason: `${label} scheduling intent derived from ${reminder.reminderTrigger.triggerType} reminder.`,
    readOnly: true as const,
  });
}

export function isScheduleTriggerType(value: string): value is ScheduleTriggerType {
  return (EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS as readonly string[]).includes(value);
}

export const ExecutiveInboxSchedulingTriggerResolver = Object.freeze({
  resolveScheduleTriggerType,
  resolveScheduleTrigger,
  isScheduleTriggerType,
});
