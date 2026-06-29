/**
 * APP-3:1 — Executive Intent platform constants.
 * Versioning, reserved identifiers, limits, namespaces, and tags.
 */

import type {
  IntentCategory,
  IntentLifecycleStage,
  IntentPriority,
  IntentRelationType,
  IntentScope,
  IntentSource,
  IntentStatus,
} from "./executiveIntentTypes.ts";

export const EXECUTIVE_INTENT_CONTRACT_VERSION = "APP-3/1" as const;
export const EXECUTIVE_INTENT_ARCHITECTURE_VERSION = "APP-3/1-arch" as const;
export const EXECUTIVE_INTENT_API_VERSION = "APP-3/1" as const;
export const EXECUTIVE_INTENT_SOURCE = "executive-intent-contract" as const;
export const EXECUTIVE_INTENT_LOG_PREFIX = "[NexoraExecutiveIntent]" as const;
export const EXECUTIVE_INTENT_PLATFORM = "nexora-type-c" as const;

export const EXECUTIVE_INTENT_TAGS = Object.freeze([
  "[APP3_1]",
  "[EXECUTIVE_INTENT_FOUNDATION]",
  "[EXECUTIVE_INTENT_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_AI_REASONING]",
  "[NO_ML]",
  "[NO_LLM]",
  "[NO_RUNTIME_EXECUTION]",
  "[WORKSPACE_AWARE]",
] as const);

export const INTENT_CATEGORY_KEYS = Object.freeze([
  "strategic",
  "financial",
  "operational",
  "growth",
  "innovation",
  "risk_reduction",
  "customer",
  "people",
  "compliance",
  "technology",
  "custom",
] as const satisfies readonly IntentCategory[]);

export const INTENT_PRIORITY_KEYS = Object.freeze([
  "very_low",
  "low",
  "medium",
  "high",
  "critical",
] as const satisfies readonly IntentPriority[]);

export const INTENT_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
  "archived",
] as const satisfies readonly IntentStatus[]);

export const INTENT_SCOPE_KEYS = Object.freeze([
  "enterprise",
  "business_unit",
  "department",
  "project",
  "scenario",
  "object",
  "custom",
] as const satisfies readonly IntentScope[]);

export const INTENT_LIFECYCLE_KEYS = Object.freeze([
  "created",
  "validated",
  "approved",
  "activated",
  "updated",
  "completed",
  "archived",
] as const satisfies readonly IntentLifecycleStage[]);

export const INTENT_SOURCE_KEYS = Object.freeze([
  "executive",
  "assistant",
  "imported",
  "workspace",
  "scenario",
  "manual",
  "api",
] as const satisfies readonly IntentSource[]);

export const INTENT_RELATION_TYPE_KEYS = Object.freeze([
  "parent",
  "child",
  "depends_on",
  "supports",
  "blocks",
  "conflicts_with",
  "supersedes",
  "related",
] as const satisfies readonly IntentRelationType[]);

export const EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS = Object.freeze([
  "intentId",
  "title",
  "summary",
  "description",
  "createdAt",
  "updatedAt",
  "version",
  "owner",
  "workspaceId",
  "tags",
  "priority",
  "status",
  "scope",
  "category",
  "source",
  "lifecycle",
  "references",
  "assumptions",
  "constraints",
  "dependencies",
  "evidence",
  "confidenceReference",
  "conflictReference",
  "customMetadata",
] as const);

export const EXECUTIVE_INTENT_RESERVED_IDS = Object.freeze([
  "intent-system",
  "intent-unknown",
  "intent-placeholder",
  "intent-reserved",
] as const);

export const EXECUTIVE_INTENT_RESERVED_NAMESPACES = Object.freeze([
  "nexora.intent.system",
  "nexora.intent.reserved",
  "nexora.intent.internal",
  "nexora.intent.future",
] as const);

export const EXECUTIVE_INTENT_DEFAULT_LIMITS = Object.freeze({
  maxTitleLength: 256,
  maxSummaryLength: 1024,
  maxDescriptionLength: 4096,
  maxTags: 32,
  maxReferences: 64,
  maxAssumptions: 32,
  maxConstraints: 32,
  maxDependencies: 64,
  maxEvidence: 64,
  maxRelations: 128,
  maxCustomMetadataKeys: 32,
  maxCustomMetadataValueLength: 512,
} as const);

export const EXECUTIVE_INTENT_PRIORITY_RANK: Readonly<Record<IntentPriority, number>> = Object.freeze({
  very_low: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
});

export const EXECUTIVE_INTENT_FUTURE_PHASE_KEYS = Object.freeze([
  "intent_extraction",
  "intent_classification",
  "intent_evolution",
  "intent_timeline",
  "intent_confidence",
  "intent_conflict_detection",
  "intent_recommendation",
  "intent_memory",
  "intent_analytics",
] as const);

export const EXECUTIVE_INTENT_RESERVED_FIELDS = Object.freeze([
  Object.freeze({
    fieldKey: "extractionHints",
    reservedFor: "intent_extraction" as const,
    description: "Reserved for APP-3 extraction phase.",
  }),
  Object.freeze({
    fieldKey: "classificationLabels",
    reservedFor: "intent_classification" as const,
    description: "Reserved for APP-3 classification phase.",
  }),
  Object.freeze({
    fieldKey: "evolutionTrail",
    reservedFor: "intent_evolution" as const,
    description: "Reserved for APP-3 evolution phase.",
  }),
  Object.freeze({
    fieldKey: "timelineAnchors",
    reservedFor: "intent_timeline" as const,
    description: "Reserved for APP-3 timeline phase.",
  }),
  Object.freeze({
    fieldKey: "confidenceProfile",
    reservedFor: "intent_confidence" as const,
    description: "Reserved for APP-3 confidence phase.",
  }),
  Object.freeze({
    fieldKey: "conflictGraph",
    reservedFor: "intent_conflict_detection" as const,
    description: "Reserved for APP-3 conflict detection phase.",
  }),
  Object.freeze({
    fieldKey: "recommendationLinks",
    reservedFor: "intent_recommendation" as const,
    description: "Reserved for APP-3 recommendation phase.",
  }),
  Object.freeze({
    fieldKey: "memoryBindings",
    reservedFor: "intent_memory" as const,
    description: "Reserved for APP-3 memory phase.",
  }),
  Object.freeze({
    fieldKey: "analyticsMetrics",
    reservedFor: "intent_analytics" as const,
    description: "Reserved for APP-3 analytics phase.",
  }),
]);

export const EXECUTIVE_INTENT_MUST_NOT_OWN = Object.freeze([
  "intent_extraction",
  "intent_detection",
  "intent_reasoning",
  "intent_scoring",
  "intent_comparison",
  "intent_conflict_analysis",
  "intent_history",
  "intent_evolution_engine",
  "intent_dashboard",
  "intent_assistant",
  "intent_storage",
  "intent_execution",
  "recommendation_engine",
  "goal_planner",
  "scenario_generator",
  "ai_inference",
  "ml_inference",
  "llm_reasoning",
] as const);

export const EXECUTIVE_INTENT_FUTURE_COMPATIBILITY = Object.freeze({
  app3Ready: true,
  extractionReady: true,
  classificationReady: true,
  evolutionReady: true,
  timelineReady: true,
  confidenceReady: true,
  conflictDetectionReady: true,
  recommendationReady: true,
  memoryReady: true,
  analyticsReady: true,
  governanceReady: true,
  decisionJournalReady: true,
  executiveTimeConsumerOnly: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS = Object.freeze([
  Object.freeze({ key: "created", order: 0, label: "Created", description: "Intent record created." }),
  Object.freeze({ key: "validated", order: 1, label: "Validated", description: "Intent shape validated." }),
  Object.freeze({ key: "approved", order: 2, label: "Approved", description: "Intent approved for activation." }),
  Object.freeze({ key: "activated", order: 3, label: "Activated", description: "Intent is active." }),
  Object.freeze({ key: "updated", order: 4, label: "Updated", description: "Intent metadata updated." }),
  Object.freeze({ key: "completed", order: 5, label: "Completed", description: "Intent achieved or closed." }),
  Object.freeze({ key: "archived", order: 6, label: "Archived", description: "Intent archived." }),
] as const);

export const EXECUTIVE_INTENT_TERMINAL_STATUSES = Object.freeze(["completed", "cancelled", "archived"] as const);

export const EXECUTIVE_INTENT_TERMINAL_LIFECYCLE_STAGES = Object.freeze(["completed", "archived"] as const);
