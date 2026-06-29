/**
 * APP-11:5 — Executive Inbox Reminder trigger resolver.
 */

import {
  EXECUTIVE_INBOX_REMINDER_NOTIFICATION_TRIGGER_MAP,
  EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS,
} from "./executiveInboxReminderEngineConstants.ts";
import type { ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveNotification } from "./executiveInboxNotificationEngineTypes.ts";
import type { ReminderTrigger, ReminderTriggerType } from "./executiveInboxReminderEngineTypes.ts";

const TRIGGER_LABELS: Readonly<Record<ReminderTriggerType, string>> = Object.freeze({
  critical_follow_up: "Critical Follow-up",
  decision_deadline: "Decision Deadline",
  timeline_deadline: "Timeline Deadline",
  risk_review: "Risk Review",
  strategy_review: "Strategy Review",
  recommendation_follow_up: "Recommendation Follow-up",
  workspace_follow_up: "Workspace Follow-up",
  report_review: "Report Review",
  assistant_follow_up: "Assistant Follow-up",
});

const SOURCE_ASSISTANT_TRIGGER: ReminderTriggerType = "assistant_follow_up";

export function resolveReminderTriggerType(
  notification: ExecutiveNotification,
  item: ExecutiveInboxItem
): ReminderTriggerType {
  if (notification.triggerType === "critical_priority") {
    return "critical_follow_up";
  }
  if (item.sourceType === "assistant") {
    return SOURCE_ASSISTANT_TRIGGER;
  }
  if (item.sourceType === "report" && notification.triggerType === "system_advisory") {
    return "report_review";
  }
  return EXECUTIVE_INBOX_REMINDER_NOTIFICATION_TRIGGER_MAP[notification.triggerType];
}

export function resolveReminderTrigger(
  notification: ExecutiveNotification,
  item: ExecutiveInboxItem
): ReminderTrigger {
  const triggerType = resolveReminderTriggerType(notification, item);
  const label = TRIGGER_LABELS[triggerType];
  return Object.freeze({
    triggerType,
    label,
    reason: `${label} reminder intent derived from ${notification.triggerType} notification for ${item.sourceType} item.`,
    readOnly: true as const,
  });
}

export function isReminderTriggerType(value: string): value is ReminderTriggerType {
  return (EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS as readonly string[]).includes(value);
}

export const ExecutiveInboxReminderTriggerResolver = Object.freeze({
  resolveReminderTriggerType,
  resolveReminderTrigger,
  isReminderTriggerType,
});
