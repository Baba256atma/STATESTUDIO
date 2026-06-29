/**
 * APP-11:4 — Executive Inbox Notification Engine constants.
 */

import type { ExecutiveInboxSourceType } from "./executiveInboxTypes.ts";

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION = "APP-11/4" as const;
export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_ARCHITECTURE_VERSION =
  "APP-11/4-notification-engine-arch" as const;
export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_OWNER = "executive-inbox-notification-engine" as const;

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_TAGS = Object.freeze([
  "[APP11_4]",
  "[EXECUTIVE_INBOX_NOTIFICATION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_DELIVERY]",
  "[NO_REMINDERS]",
  "[NO_SCHEDULING]",
  "[NO_WORKFLOW]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "sendPushNotification",
  "sendEmail",
  "sendSms",
  "deliverNotification",
  "scheduleReminder",
  "scheduleWork",
  "workflowEngine",
  "recommendationGenerator",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "openai",
  "prompt(",
  "predict(",
  "forecast(",
  "probabilistic",
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES = Object.freeze([
  "load_prioritized_inbox_items",
  "validate_dependencies",
  "evaluate_notification_eligibility",
  "determine_trigger_type",
  "build_notification_records",
  "attach_provenance",
  "validate_contracts",
  "register_notifications",
  "produce_immutable_notification_results",
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS = Object.freeze([
  "critical_priority",
  "risk_escalation",
  "executive_decision_required",
  "strategic_event",
  "timeline_deadline",
  "recommendation_update",
  "workspace_alert",
  "cross_scenario_learning_event",
  "system_advisory",
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_CATEGORY_KEYS = Object.freeze([
  "attention",
  "risk",
  "decision",
  "strategy",
  "operational",
  "advisory",
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_MANDATORY_NOTIFICATION_FIELDS = Object.freeze([
  "notificationId",
  "itemId",
  "priorityId",
  "workspaceId",
  "triggerType",
  "notificationCategory",
  "executiveSummary",
  "supportingEvidence",
  "profile",
  "eligibility",
  "provenance",
  "generationTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredNotifications: 4096,
  maxNotificationEntries: 4096,
  maxExecutiveSummaryLength: 1024,
  maxEvidenceEntries: 16,
} as const);

export const EXECUTIVE_INBOX_NOTIFICATION_SOURCE_TRIGGER_MAP: Readonly<
  Record<ExecutiveInboxSourceType, (typeof EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS)[number]>
> = Object.freeze({
  scenario: "strategic_event",
  decision: "executive_decision_required",
  timeline: "timeline_deadline",
  risk: "risk_escalation",
  strategy: "cross_scenario_learning_event",
  recommendation: "recommendation_update",
  workspace: "workspace_alert",
  report: "system_advisory",
  assistant: "system_advisory",
});

export const EXECUTIVE_INBOX_NOTIFICATION_SOURCE_CATEGORY_MAP: Readonly<
  Record<ExecutiveInboxSourceType, (typeof EXECUTIVE_INBOX_NOTIFICATION_CATEGORY_KEYS)[number]>
> = Object.freeze({
  scenario: "strategy",
  decision: "decision",
  timeline: "operational",
  risk: "risk",
  strategy: "strategy",
  recommendation: "strategy",
  workspace: "operational",
  report: "advisory",
  assistant: "advisory",
});

export const EXECUTIVE_INBOX_NOTIFICATION_ELIGIBILITY_THRESHOLDS = Object.freeze({
  criticalAlwaysEligible: true,
  highAlwaysEligible: true,
  mediumBusinessImpactMin: 50,
  mediumExecutiveVisibilityMin: 55,
  riskSeverityMin: 70,
  decisionDependencyMin: 70,
  regulatoryImportanceMin: 65,
} as const);

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noDelivery: true,
  noPushNotifications: true,
  noEmail: true,
  noSms: true,
  noReminders: true,
  noScheduling: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noReadUnreadState: true,
  immutableNotifications: true,
  deterministicOnly: true,
  consumerOnly: true,
  explainableOnly: true,
} as const);
