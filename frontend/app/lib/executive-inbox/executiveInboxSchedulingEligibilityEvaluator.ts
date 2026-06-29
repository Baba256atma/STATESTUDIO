/**
 * APP-11:6 — Executive Inbox Scheduling eligibility evaluator.
 */

import { EXECUTIVE_INBOX_SCHEDULING_ELIGIBILITY_THRESHOLDS } from "./executiveInboxSchedulingEngineConstants.ts";
import type { ExecutiveInboxPriority, PriorityDimensionKey } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { ReminderScheduleInput, ScheduleEligibility } from "./executiveInboxSchedulingEngineTypes.ts";

function dimensionScore(priority: ExecutiveInboxPriority, dimensionKey: PriorityDimensionKey): number {
  return priority.profile.dimensions.find((entry) => entry.dimensionKey === dimensionKey)?.score ?? 0;
}

export function evaluateSchedulingEligibility(entry: ReminderScheduleInput): ScheduleEligibility {
  const { reminder, priority } = entry;
  const rules: string[] = [];
  const level = priority.priorityLevel;

  if (!reminder.eligibility.eligible) {
    rules.push("reminder_not_eligible");
    return Object.freeze({
      eligible: false,
      reason: "Scheduling requires an eligible executive reminder record.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (level === "critical" || level === "high") {
    rules.push(`${level}_priority_always_eligible`);
    return Object.freeze({
      eligible: true,
      reason: `${level} priority reminder qualifies for scheduling intent.`,
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  const cadenceKey = reminder.cadence.cadenceKey;
  if (cadenceKey === "immediate" || cadenceKey === "same_day" || cadenceKey === "next_day") {
    rules.push("cadence_requires_scheduling");
    return Object.freeze({
      eligible: true,
      reason: `Reminder cadence ${cadenceKey} requires scheduling intent metadata.`,
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  const timeSensitivity = dimensionScore(priority, "time_sensitivity");
  const decisionDependency = dimensionScore(priority, "decision_dependency");
  const riskSeverity = dimensionScore(priority, "risk_severity");
  const executiveVisibility = dimensionScore(priority, "executive_visibility");

  if (reminder.reminderTrigger.triggerType === "timeline_deadline") {
    rules.push("timeline_deadline_trigger");
    return Object.freeze({
      eligible: true,
      reason: "Timeline deadline reminder qualifies for scheduling intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (
    reminder.reminderTrigger.triggerType === "risk_review" &&
    riskSeverity >= EXECUTIVE_INBOX_SCHEDULING_ELIGIBILITY_THRESHOLDS.riskSeverityMin
  ) {
    rules.push("risk_severity_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Risk review reminder exceeds severity threshold for scheduling intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (
    reminder.reminderTrigger.triggerType === "decision_deadline" &&
    decisionDependency >= EXECUTIVE_INBOX_SCHEDULING_ELIGIBILITY_THRESHOLDS.decisionDependencyMin
  ) {
    rules.push("decision_dependency_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Decision deadline reminder exceeds dependency threshold for scheduling intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (timeSensitivity >= EXECUTIVE_INBOX_SCHEDULING_ELIGIBILITY_THRESHOLDS.timeSensitivityMin) {
    rules.push("time_sensitivity_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Reminder meets time sensitivity threshold for scheduling intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (executiveVisibility >= EXECUTIVE_INBOX_SCHEDULING_ELIGIBILITY_THRESHOLDS.executiveVisibilityMin) {
    rules.push("executive_visibility_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Reminder meets executive visibility threshold for scheduling intent.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  rules.push("default_ineligible");
  return Object.freeze({
    eligible: false,
    reason: `Reminder ${reminder.reminderId} does not meet deterministic scheduling eligibility rules.`,
    evaluatedRules: Object.freeze(rules),
    readOnly: true as const,
  });
}

export const ExecutiveInboxSchedulingEligibilityEvaluator = Object.freeze({
  evaluateSchedulingEligibility,
});
