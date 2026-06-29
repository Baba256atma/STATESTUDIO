/**
 * APP-11:4 — Executive Inbox Notification eligibility evaluator.
 */

import { EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS } from "./executiveInboxNotificationEngineConstants.ts";
import type { ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveInboxPriority, PriorityDimensionKey } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { NotificationEligibility, PrioritizedInboxNotificationInput } from "./executiveInboxNotificationEngineTypes.ts";

function dimensionScore(priority: ExecutiveInboxPriority, dimensionKey: PriorityDimensionKey): number {
  return priority.profile.dimensions.find((entry) => entry.dimensionKey === dimensionKey)?.score ?? 0;
}

export function evaluateNotificationEligibility(
  entry: PrioritizedInboxNotificationInput
): NotificationEligibility {
  const { priority, item } = entry;
  const rules: string[] = [];
  const level = priority.priorityLevel;

  if (level === "critical") {
    rules.push("critical_priority_always_eligible");
    return Object.freeze({
      eligible: true,
      reason: "Critical priority inbox items always qualify for executive notification.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (level === "high") {
    rules.push("high_priority_always_eligible");
    return Object.freeze({
      eligible: true,
      reason: "High priority inbox items qualify for executive notification.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  const businessImpact = dimensionScore(priority, "business_impact");
  const executiveVisibility = dimensionScore(priority, "executive_visibility");
  const riskSeverity = dimensionScore(priority, "risk_severity");
  const decisionDependency = dimensionScore(priority, "decision_dependency");
  const regulatoryImportance = dimensionScore(priority, "regulatory_importance");

  if (level === "medium") {
    rules.push("medium_priority_dimension_gate");
    if (
      businessImpact >= EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS.mediumBusinessImpactMin ||
      executiveVisibility >= EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS.mediumExecutiveVisibilityMin
    ) {
      return Object.freeze({
        eligible: true,
        reason: "Medium priority item meets business impact or executive visibility threshold.",
        evaluatedRules: Object.freeze(rules),
        readOnly: true as const,
      });
    }
  }

  if (item.sourceType === "risk" && riskSeverity >= EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS.riskSeverityMin) {
    rules.push("risk_severity_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Risk item exceeds severity threshold for executive notification.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (
    item.sourceType === "decision" &&
    decisionDependency >= EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS.decisionDependencyMin
  ) {
    rules.push("decision_dependency_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Decision item exceeds dependency threshold for executive notification.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  if (regulatoryImportance >= EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS.regulatoryImportanceMin) {
    rules.push("regulatory_importance_threshold");
    return Object.freeze({
      eligible: true,
      reason: "Item exceeds regulatory importance threshold for executive notification.",
      evaluatedRules: Object.freeze(rules),
      readOnly: true as const,
    });
  }

  rules.push("default_ineligible");
  return Object.freeze({
    eligible: false,
    reason: `Inbox item ${item.itemId} does not meet deterministic notification eligibility rules.`,
    evaluatedRules: Object.freeze(rules),
    readOnly: true as const,
  });
}

export const ExecutiveInboxNotificationEligibilityEvaluator = Object.freeze({
  evaluateNotificationEligibility,
});
