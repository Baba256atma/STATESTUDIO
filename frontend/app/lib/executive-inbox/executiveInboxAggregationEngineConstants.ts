/**
 * APP-11:2 — Executive Inbox Aggregation Engine constants.
 */

import type { ExecutiveInboxSourceType } from "./executiveInboxTypes.ts";

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION = "APP-11/2" as const;
export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_ARCHITECTURE_VERSION =
  "APP-11/2-aggregation-engine-arch" as const;
export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_OWNER = "executive-inbox-aggregation-engine" as const;

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_TAGS = Object.freeze([
  "[APP11_2]",
  "[EXECUTIVE_INBOX_AGGREGATION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_PRIORITIZATION]",
  "[NO_NOTIFICATIONS]",
  "[NO_WORKFLOW]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "prioritizeInbox",
  "sendNotification",
  "scheduleReminder",
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
] as const);

export const EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES = Object.freeze([
  "load_certified_source_records",
  "validate_dependencies",
  "normalize_source_records",
  "build_inbox_items",
  "attach_provenance",
  "validate_contracts",
  "register_inbox_items",
  "produce_immutable_result",
] as const);

export const EXECUTIVE_INBOX_AGGREGATION_MANDATORY_ITEM_FIELDS = Object.freeze([
  "itemId",
  "sourceType",
  "sourceId",
  "workspaceId",
  "businessContext",
  "summary",
  "sourceReference",
  "provenance",
  "aggregationTimestamp",
  "engineVersion",
  "version",
  "metadata",
  "readOnly",
] as const);

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredItems: 4096,
  maxSourceRecords: 4096,
  maxSummaryLength: 1024,
  maxBusinessContextLength: 512,
  maxSourceAppsPerRecord: 12,
} as const);

export const EXECUTIVE_INBOX_AGGREGATION_CERTIFIED_SOURCE_APPS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10",
  "APP-11/1",
] as const);

export const EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP: Readonly<
  Record<ExecutiveInboxSourceType, { platformId: string; defaultAppId: string }>
> = Object.freeze({
  scenario: Object.freeze({ platformId: "scenario-timeline-platform", defaultAppId: "APP-5" }),
  decision: Object.freeze({ platformId: "decision-journal-platform", defaultAppId: "APP-8" }),
  timeline: Object.freeze({ platformId: "decision-timeline-platform", defaultAppId: "APP-6" }),
  risk: Object.freeze({ platformId: "business-timeline-platform", defaultAppId: "APP-7" }),
  strategy: Object.freeze({ platformId: "cross-scenario-learning-platform", defaultAppId: "APP-10" }),
  recommendation: Object.freeze({ platformId: "cross-scenario-learning-platform", defaultAppId: "APP-10" }),
  workspace: Object.freeze({ platformId: "executive-memory-platform", defaultAppId: "APP-4" }),
  report: Object.freeze({ platformId: "confidence-evolution-platform", defaultAppId: "APP-9" }),
  assistant: Object.freeze({ platformId: "int-platform", defaultAppId: "INT" }),
});

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noPrioritization: true,
  noNotifications: true,
  noReminders: true,
  noScheduling: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noRecommendationGeneration: true,
  immutableItems: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);
