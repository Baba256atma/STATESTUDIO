/**
 * APP-11:3 — Executive Inbox Prioritization Engine constants.
 */

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION = "APP-11/3" as const;
export const EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION = "APP-11/3-calc-v1" as const;
export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_ARCHITECTURE_VERSION =
  "APP-11/3-prioritization-engine-arch" as const;
export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_OWNER = "executive-inbox-prioritization-engine" as const;

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_TAGS = Object.freeze([
  "[APP11_3]",
  "[EXECUTIVE_INBOX_PRIORITIZATION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_NOTIFICATIONS]",
  "[NO_REMINDERS]",
  "[NO_SCHEDULING]",
  "[NO_WORKFLOW]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "sendNotification",
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

export const EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES = Object.freeze([
  "load_aggregated_inbox_items",
  "validate_dependencies",
  "evaluate_priority_dimensions",
  "calculate_deterministic_priority",
  "build_explanation",
  "attach_provenance",
  "validate_contracts",
  "register_priorities",
  "produce_immutable_results",
] as const);

export const EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS = Object.freeze([
  "business_impact",
  "risk_severity",
  "time_sensitivity",
  "strategic_importance",
  "decision_dependency",
  "executive_visibility",
  "regulatory_importance",
  "customer_impact",
  "financial_impact",
  "operational_impact",
] as const);

export const EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS = Object.freeze([
  "critical",
  "high",
  "medium",
  "low",
  "informational",
] as const);

export const EXECUTIVE_INBOX_PRIORITY_LEVEL_THRESHOLDS = Object.freeze({
  critical: 85,
  high: 70,
  medium: 50,
  low: 30,
  informational: 0,
} as const);

export const EXECUTIVE_INBOX_PRIORITIZATION_DEFAULT_WEIGHTS: Readonly<
  Record<(typeof EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS)[number], number>
> = Object.freeze({
  business_impact: 15,
  risk_severity: 15,
  time_sensitivity: 10,
  strategic_importance: 12,
  decision_dependency: 10,
  executive_visibility: 8,
  regulatory_importance: 8,
  customer_impact: 10,
  financial_impact: 7,
  operational_impact: 5,
});

export const EXECUTIVE_INBOX_PRIORITIZATION_MANDATORY_PRIORITY_FIELDS = Object.freeze([
  "priorityId",
  "itemId",
  "workspaceId",
  "priorityLevel",
  "weightedScore",
  "profile",
  "calculation",
  "provenance",
  "prioritizationTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredPriorities: 4096,
  maxInboxItems: 4096,
  maxExplanationLength: 2048,
  maxEvidenceEntries: 32,
} as const);

export const EXECUTIVE_INBOX_PRIORITIZATION_SOURCE_TYPE_BASELINE_SCORES: Readonly<
  Record<
    string,
    Readonly<Partial<Record<(typeof EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS)[number], number>>>
  >
> = Object.freeze({
  scenario: Object.freeze({
    strategic_importance: 75,
    business_impact: 65,
    executive_visibility: 60,
  }),
  decision: Object.freeze({
    decision_dependency: 80,
    business_impact: 70,
    executive_visibility: 65,
  }),
  timeline: Object.freeze({
    time_sensitivity: 80,
    operational_impact: 55,
    executive_visibility: 50,
  }),
  risk: Object.freeze({
    risk_severity: 85,
    regulatory_importance: 70,
    business_impact: 65,
  }),
  strategy: Object.freeze({
    strategic_importance: 85,
    business_impact: 75,
    financial_impact: 60,
  }),
  recommendation: Object.freeze({
    strategic_importance: 70,
    business_impact: 65,
    customer_impact: 55,
  }),
  workspace: Object.freeze({
    operational_impact: 70,
    executive_visibility: 45,
    business_impact: 50,
  }),
  report: Object.freeze({
    executive_visibility: 75,
    financial_impact: 55,
    business_impact: 50,
  }),
  assistant: Object.freeze({
    executive_visibility: 60,
    time_sensitivity: 45,
    business_impact: 40,
  }),
});

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noNotifications: true,
  noReminders: true,
  noScheduling: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noRecommendationGeneration: true,
  immutablePriorities: true,
  deterministicOnly: true,
  consumerOnly: true,
  explainableOnly: true,
} as const);
