/**
 * APP-11:5 — Executive Inbox Reminder eligibility evaluator.
 */

import { EXECUTIVE_INBOX_REMINDER_ELIGIBILITY_THRESHOLDS } from "./executiveInboxReminderEngineConstants.ts";
import type { ExecutiveInboxPriority, PriorityDimensionKey } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { NotificationReminderInput, ReminderEligibility } from "./executiveInboxReminderEngineTypes.ts";

function dimensionScore(priority: ExecutiveInboxPriority, dimensionKey: PriorityDimensionKey): number {
  return priority.profile.dimensions.find((entry) => entry.dimensionKey === dimensionKey)?.score ?? 0;
}

export function evaluateReminderEligibility(entry: NotificationReminderInput): ReminderEligibility {
  const { notification, priority } = entry;
  const rules: string[] = [];
  const level = priority.priorityLevel;

  if (!notification.eligibility.eligible) {
    rules.push("notification_not_eligible");
    return Object.freeze({
      eligible: false,
      reason: "Reminder requires an eligible executive notification record.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (level === "critical" || level === "high") {
    rules.push(`${level}_priority_always_eligible`);
    return Object.freeze({
      eligible: true,
      reason: `${level} priority notification qualifies for executive reminder intent.`,
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  const timeSensitivity = dimensionScore(priority, "time_sensitivity");
  const decisionDependency = dimensionScore(priority, "decision_dependency");
  const riskSeverity = dimensionScore(priority, "risk_severity");
  const executiveVisibility = dimensionScore(priority, "executive_visibility");

  if (notification.triggerType === "timeline_deadline") {
    rules.push("timeline_deadline_trigger");
    return Object.freeze({
      eligible: true,
      reason: "Timeline deadline notification qualifies for reminder intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (
    notification.triggerType === "risk_escalation" &&
    riskSeverity >= EXECUTIVE_INBOX_REMINDER_ELIGIBILITY_THRESHOLDS.riskSeverityMin
  ) {
    rules.push("risk_severity_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Risk escalation notification exceeds severity threshold for reminder intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (
    notification.triggerType === "executive_decision_required" &&
    decisionDependency >= EXECUTIVE_INBOX_REMINDER_ELIGIBILITY_THRESHOLDS.decisionDependencyMin
  ) {
    rules.push("decision_dependency_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Decision notification exceeds dependency threshold for reminder intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (level === "medium" && timeSensitivity >= EXECUTIVE_INBOX_REMINDER_ELIGIBILITY_THRESHOLDS.timeSensitivityMin) {
    rules.push("medium_time_sensitivity_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Medium priority item meets time sensitivity threshold for reminder intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (executiveVisibility >= EXECUTIVE_INBOX_REMINDER_ELIGIBILITY_THRESHOLDS.executiveVisibilityMin) {
    rules.push("executive_visibility_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Notification meets executive visibility threshold for reminder intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  rules.push("default_ineligible");
  return Object.freeze({
    eligible: false,
    reason: `Notification ${notification.notificationId} does not meet deterministic reminder eligibility rules.`,
    evaluatedRules: Object.freeze(rules),
    readOnly: true as const,
  });
}

export const ExecutiveInboxReminderEligibilityEvaluator = Object.freeze({
  evaluateReminderEligibility,
});
