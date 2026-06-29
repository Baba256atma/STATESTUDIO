/**
 * APP-11:5 — Executive Inbox Reminder Engine constants.
 */

import type { NotificationTriggerType } from "./executiveInboxNotificationEngineTypes.ts";

export const EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION = "APP-11/5" as const;
export const EXECUTIVE_INBOX_REMINDER_ENGINE_ARCHITECTURE_VERSION = "APP-11/5-reminder-engine-arch" as const;
export const EXECUTIVE_INBOX_REMINDER_ENGINE_OWNER = "executive-inbox-reminder-engine" as const;

export const EXECUTIVE_INBOX_REMINDER_ENGINE_TAGS = Object.freeze([
  "[APP11_5]",
  "[EXECUTIVE_INBOX_REMINDER_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_DELIVERY]",
  "[NO_SCHEDULING]",
  "[NO_CALENDAR]",
  "[NO_WORKFLOW]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INBOX_REMINDER_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "sendPushNotification",
  "sendEmail",
  "sendSms",
  "deliverReminder",
  "deliverNotification",
  "scheduleCalendarEvent",
  "createCalendarEvent",
  "backgroundJob",
  "cron(",
  "setInterval(",
  "setTimeout(",
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

export const EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES = Object.freeze([
  "load_notification_records",
  "validate_dependencies",
  "evaluate_reminder_eligibility",
  "determine_reminder_trigger",
  "resolve_cadence_metadata",
  "build_reminder_records",
  "attach_provenance",
  "validate_contracts",
  "register_reminders",
  "produce_immutable_reminder_results",
] as const);

export const EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS = Object.freeze([
  "critical_follow_up",
  "decision_deadline",
  "timeline_deadline",
  "risk_review",
  "strategy_review",
  "recommendation_follow_up",
  "workspace_follow_up",
  "report_review",
  "assistant_follow_up",
] as const);

export const EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS = Object.freeze([
  "immediate",
  "same_day",
  "next_day",
  "weekly",
  "monthly",
  "custom_metadata",
] as const);

export const EXECUTIVE_INBOX_REMINDER_MANDATORY_REMINDER_FIELDS = Object.freeze([
  "reminderId",
  "notificationId",
  "itemId",
  "priorityId",
  "workspaceId",
  "reminderTrigger",
  "cadence",
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

export const EXECUTIVE_INBOX_REMINDER_ENGINE_LIMITS = Object.freeze({
  maxRegisteredReminders: 4096,
  maxReminderEntries: 4096,
  maxExecutiveSummaryLength: 1024,
  maxEvidenceEntries: 16,
  maxCustomCadenceLabelLength: 128,
} as const);

export const EXECUTIVE_INBOX_REMINDER_NOTIFICATION_TRIGGER_MAP: Readonly<
  Record<NotificationTriggerType, (typeof EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS)[number]>
> = Object.freeze({
  critical_priority: "critical_follow_up",
  risk_escalation: "risk_review",
  executive_decision_required: "decision_deadline",
  strategic_event: "strategy_review",
  timeline_deadline: "timeline_deadline",
  recommendation_update: "recommendation_follow_up",
  workspace_alert: "workspace_follow_up",
  cross_scenario_learning_event: "strategy_review",
  system_advisory: "report_review",
});

export const EXECUTIVE_INBOX_REMINDER_SOURCE_CADENCE_MAP: Readonly<
  Record<string, (typeof EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS)[number]>
> = Object.freeze({
  critical: "immediate",
  high: "same_day",
  medium: "weekly",
  low: "monthly",
  informational: "monthly",
});

export const EXECUTIVE_INBOX_REMINDER_ELIGIBILITY_THRESHOLDS = Object.freeze({
  criticalAlwaysEligible: true,
  highAlwaysEligible: true,
  timeSensitivityMin: 50,
  decisionDependencyMin: 70,
  riskSeverityMin: 70,
  executiveVisibilityMin: 55,
} as const);

export const EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noDelivery: true,
  noScheduling: true,
  noCalendarIntegration: true,
  noBackgroundJobs: true,
  noPushNotifications: true,
  noEmail: true,
  noSms: true,
  noCompletedState: true,
  noSnoozeState: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  immutableReminders: true,
  deterministicOnly: true,
  consumerOnly: true,
  explainableOnly: true,
  cadenceMetadataOnly: true,
} as const);
