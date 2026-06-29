/**
 * APP-4:1 — Executive Memory platform constants.
 * Versioning, reserved identifiers, limits, and certification tags.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryProviderId } from "./executiveMemoryTypes.ts";

export const EXECUTIVE_MEMORY_CONTRACT_VERSION = "APP-4/1" as const;
export const EXECUTIVE_MEMORY_ARCHITECTURE_VERSION = "APP-4/1-arch" as const;
export const EXECUTIVE_MEMORY_API_VERSION = "APP-4/1" as const;
export const EXECUTIVE_MEMORY_SOURCE = "executive-memory-foundation" as const;
export const EXECUTIVE_MEMORY_LOG_PREFIX = "[NexoraExecutiveMemory]" as const;
export const EXECUTIVE_MEMORY_PLATFORM = "nexora-type-c" as const;

export const EXECUTIVE_MEMORY_TAGS = Object.freeze([
  "[APP4_1]",
  "[EXECUTIVE_MEMORY_FOUNDATION]",
  "[EXECUTIVE_MEMORY_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NOT_CHAT_MEMORY]",
  "[NO_PERSISTENCE]",
  "[NO_RETRIEVAL]",
] as const);

export const EXECUTIVE_MEMORY_CATEGORY_KEYS = Object.freeze([
  "goal",
  "intent",
  "scenario",
  "decision",
  "evidence",
  "kpi_reference",
  "risk_reference",
  "object",
  "relationship",
  "timeline_reference",
  "confidence",
  "business_context",
  "tag",
  "metadata",
  "custom",
] as const satisfies readonly ExecutiveMemoryCategory[]);

export const EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS = Object.freeze([
  "executive-memory-system",
  "executive-memory-reserved",
  "executive-memory-internal",
  "executive-memory-placeholder",
  "chat-memory",
  "chat-memory-reserved",
] as const satisfies readonly ExecutiveMemoryProviderId[]);

export const EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS = Object.freeze([
  "memory-system",
  "memory-unknown",
  "memory-placeholder",
  "memory-reserved",
  "chat-memory",
] as const);

export const EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS = Object.freeze([
  "memoryId",
  "workspaceId",
  "category",
  "title",
  "summary",
  "createdAt",
  "updatedAt",
  "owner",
  "sourceModule",
  "contractVersion",
  "tags",
  "references",
  "customMetadata",
] as const);

export const EXECUTIVE_MEMORY_FUTURE_PHASE_KEYS = Object.freeze([
  "memory_storage",
  "memory_retrieval",
  "memory_ranking",
  "memory_lifecycle",
  "memory_assistant_integration",
  "memory_dashboard_integration",
  "memory_learning",
  "memory_recommendation",
] as const);

export const EXECUTIVE_MEMORY_MUST_NOT_OWN = Object.freeze([
  "chat_memory",
  "conversation_history",
  "assistant_dialogue",
  "dashboard_rendering",
  "memory_retrieval_engine",
  "memory_ranking_engine",
  "memory_persistence",
  "memory_search",
  "memory_recommendation",
  "memory_learning_engine",
  "scenario_execution",
  "decision_execution",
  "ui_rendering",
  "routing",
  "scene_rendering",
  "timeline_rendering",
] as const);

export const EXECUTIVE_MEMORY_FUTURE_COMPATIBILITY = Object.freeze({
  app4Ready: true,
  storageReady: true,
  retrievalReady: true,
  rankingReady: true,
  lifecycleReady: true,
  assistantIntegrationReady: true,
  dashboardIntegrationReady: true,
  learningReady: true,
  executiveIntentConsumerReady: true,
  scenarioIntelligenceConsumerReady: true,
  executiveTimeConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const EXECUTIVE_MEMORY_DEFAULT_LIMITS = Object.freeze({
  maxTitleLength: 256,
  maxSummaryLength: 2048,
  maxTags: 32,
  maxReferences: 64,
  maxCustomMetadataKeys: 32,
  maxCustomMetadataValueLength: 512,
  maxProviderLabelLength: 128,
} as const);
