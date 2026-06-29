/**
 * APP-11:4 — Executive Inbox Notification trigger resolver.
 */

import {
  EXECUTIVE_INBOX_NOTIFICATION_SOURCE_TRIGGER_MAP,
  EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS,
} from "./executiveInboxNotificationEngineConstants.ts";
import type { ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveInboxPriority } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { NotificationTrigger, NotificationTriggerType } from "./executiveInboxNotificationEngineTypes.ts";

const TRIGGER_LABELS: Readonly<Record<NotificationTriggerType, string>> = Object.freeze({
  critical_priority: "Critical Priority",
  risk_escalation: "Risk Escalation",
  executive_decision_required: "Executive Decision Required",
  strategic_event: "Strategic Event",
  timeline_deadline: "Timeline Deadline",
  recommendation_update: "Recommendation Update",
  workspace_alert: "Workspace Alert",
  cross_scenario_learning_event: "Cross-Scenario Learning Event",
  system_advisory: "System Advisory",
});

export function resolveNotificationTriggerType(
  priority: ExecutiveInboxPriority,
  item: ExecutiveInboxItem
): NotificationTriggerType {
  if (priority.priorityLevel === "critical") {
    return "critical_priority";
  }
  return EXECUTIVE_INBOX_NOTIFICATION_SOURCE_TRIGGER_MAP[item.sourceType];
}

export function resolveNotificationTrigger(
  priority: ExecutiveInboxPriority,
  item: ExecutiveInboxItem
): NotificationTrigger {
  const triggerType = resolveNotificationTriggerType(priority, item);
  const label = TRIGGER_LABELS[triggerType];
  const reason =
    triggerType === "critical_priority"
      ? `Critical priority level (${priority.priorityLevel}) requires executive attention notification.`
      : `${label} trigger derived from ${item.sourceType} source type with ${priority.priorityLevel} priority.`;
  return Object.freeze({
    triggerType,
    label,
    reason,
    readOnly: true as const,
  });
}

export function isNotificationTriggerType(value: string): value is NotificationTriggerType {
  return (EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS as readonly string[]).includes(value);
}

export const ExecutiveInboxNotificationTriggerResolver = Object.freeze({
  resolveNotificationTriggerType,
  resolveNotificationTrigger,
  isNotificationTriggerType,
});
