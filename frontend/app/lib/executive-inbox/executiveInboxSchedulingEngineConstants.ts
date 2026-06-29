/**
 * APP-11:6 — Executive Inbox Scheduling Engine constants.
 */

import type { ReminderCadenceKey, ReminderTriggerType } from "./executiveInboxReminderEngineTypes.ts";

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION = "APP-11/6" as const;
export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_ARCHITECTURE_VERSION =
  "APP-11/6-scheduling-engine-arch" as const;
export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_OWNER = "executive-inbox-scheduling-engine" as const;

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_TAGS = Object.freeze([
  "[APP11_6]",
  "[EXECUTIVE_INBOX_SCHEDULING_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_CALENDAR]",
  "[NO_BACKGROUND_JOBS]",
  "[NO_DELIVERY]",
  "[METADATA_ONLY]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "createCalendarEvent",
  "scheduleCalendarEvent",
  "googleCalendar",
  "outlookCalendar",
  "backgroundJob",
  "cron(",
  "setInterval(",
  "setTimeout(",
  "deliverReminder",
  "deliverNotification",
  "sendPushNotification",
  "sendEmail",
  "sendSms",
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

export const EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES = Object.freeze([
  "load_reminder_records",
  "validate_dependencies",
  "evaluate_scheduling_eligibility",
  "determine_schedule_trigger",
  "resolve_schedule_window_metadata",
  "build_scheduling_intent_records",
  "attach_provenance",
  "validate_contracts",
  "register_schedule_intents",
  "produce_immutable_scheduling_results",
] as const);

export const EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS = Object.freeze([
  "critical_attention",
  "decision_schedule",
  "timeline_schedule",
  "risk_schedule",
  "strategy_schedule",
  "recommendation_schedule",
  "workspace_schedule",
  "report_schedule",
  "assistant_schedule",
] as const);

export const EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS = Object.freeze([
  "immediate",
  "today",
  "tomorrow",
  "this_week",
  "next_week",
  "this_month",
  "custom_metadata",
] as const);

export const EXECUTIVE_INBOX_SCHEDULING_MANDATORY_SCHEDULE_FIELDS = Object.freeze([
  "scheduleId",
  "reminderId",
  "notificationId",
  "itemId",
  "priorityId",
  "workspaceId",
  "scheduleTrigger",
  "scheduleWindow",
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

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS = Object.freeze({
  maxRegisteredSchedules: 4096,
  maxScheduleEntries: 4096,
  maxExecutiveSummaryLength: 1024,
  maxEvidenceEntries: 16,
  maxCustomWindowLabelLength: 128,
} as const);

export const EXECUTIVE_INBOX_SCHEDULING_REMINDER_TRIGGER_MAP: Readonly<
  Record<ReminderTriggerType, (typeof EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS)[number]>
> = Object.freeze({
  critical_follow_up: "critical_attention",
  decision_deadline: "decision_schedule",
  timeline_deadline: "timeline_schedule",
  risk_review: "risk_schedule",
  strategy_review: "strategy_schedule",
  recommendation_follow_up: "recommendation_schedule",
  workspace_follow_up: "workspace_schedule",
  report_review: "report_schedule",
  assistant_follow_up: "assistant_schedule",
});

export const EXECUTIVE_INBOX_SCHEDULING_CADENCE_WINDOW_MAP: Readonly<
  Record<ReminderCadenceKey, (typeof EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS)[number]>
> = Object.freeze({
  immediate: "immediate",
  same_day: "today",
  next_day: "tomorrow",
  weekly: "this_week",
  monthly: "this_month",
  custom_metadata: "custom_metadata",
});

export const EXECUTIVE_INBOX_SCHEDULING_ELIGIBILITY_THRESHOLDS = Object.freeze({
  criticalAlwaysEligible: true,
  highAlwaysEligible: true,
  timeSensitivityMin: 50,
  decisionDependencyMin: 70,
  riskSeverityMin: 70,
  executiveVisibilityMin: 55,
} as const);

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noCalendarEvents: true,
  noBackgroundJobs: true,
  noTimers: true,
  noDelivery: true,
  noExecutionState: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  immutableScheduleIntents: true,
  deterministicOnly: true,
  consumerOnly: true,
  explainableOnly: true,
  scheduleWindowMetadataOnly: true,
} as const);
