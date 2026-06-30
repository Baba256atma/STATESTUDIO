/**
 * LLM-5 — Context Builder contracts and constants.
 */

export const LLM_CONTEXT_CONTRACT_VERSION = "LLM/5" as const;
export const LLM_CONTEXT_PLATFORM_ID = "llm-context-builder" as const;
export const LLM_CONTEXT_PLATFORM_NAME = "Context Builder" as const;
export const LLM_CONTEXT_FOUNDATION_DEPENDENCY = "LLM/1" as const;
export const LLM_CONTEXT_PROVIDER_DEPENDENCY = "LLM/2" as const;
export const LLM_CONTEXT_RUNTIME_DEPENDENCY = "LLM/3" as const;
export const LLM_CONTEXT_PROMPT_DEPENDENCY = "LLM/4" as const;

export const LLM_CONTEXT_TAGS = Object.freeze([
  "[LLM_5]",
  "[CONTEXT_BUILDER]",
  "[DETERMINISTIC]",
  "[REFERENCE_ONLY]",
  "[NO_BUSINESS_LOGIC]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_CONTEXT_SOURCE_KEYS = Object.freeze([
  "knowledge_reference",
  "workspace_reference",
  "object_reference",
  "relationship_reference",
  "kpi_reference",
  "risk_reference",
  "timeline_reference",
  "scenario_reference",
  "user_instruction_reference",
  "memory_reference",
] as const);

export const LLM_CONTEXT_PLACEHOLDER_SOURCE_KEYS = Object.freeze([
  "memory_reference",
] as const);

export const LLM_CONTEXT_SECTION_ORDER = Object.freeze([
  "knowledge_reference",
  "workspace_reference",
  "object_reference",
  "relationship_reference",
  "kpi_reference",
  "risk_reference",
  "timeline_reference",
  "scenario_reference",
  "user_instruction_reference",
  "memory_reference",
] as const);

export const LLM_CONTEXT_PUBLIC_API_REGISTRY = Object.freeze([
  "buildContextPackage",
  "validateContextPackage",
  "registerContextSource",
  "discoverContextSources",
  "getContextManifest",
  "getContextRegistry",
  "buildLlmContextBuilderLayer",
] as const);

export const LLM_CONTEXT_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
] as const);

export const LLM_CONTEXT_PRINCIPLES = Object.freeze([
  "approved_references_only",
  "no_direct_app_or_knl_access",
  "no_business_reasoning",
  "deterministic_context_composition",
  "unresolved_references_reported",
  "provider_independent",
  "reference_resolution_not_data_fetching",
] as const);

export const LLM_CONTEXT_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredSources: 32,
  maxReferencesPerPackage: 64,
  maxSectionsPerPackage: 64,
  maxRefIdLength: 256,
} as const);

export const LLM_CONTEXT_SOURCE_LABELS = Object.freeze({
  knowledge_reference: "Knowledge Reference",
  workspace_reference: "Workspace Reference",
  object_reference: "Object Reference",
  relationship_reference: "Relationship Reference",
  kpi_reference: "KPI Reference",
  risk_reference: "Risk Reference",
  timeline_reference: "Timeline Reference",
  scenario_reference: "Scenario Reference",
  user_instruction_reference: "User Instruction Reference",
  memory_reference: "Memory Reference",
} as const);

export const LLM_CONTEXT_RESOLUTION_STATUS_KEYS = Object.freeze([
  "resolved",
  "unresolved",
  "placeholder",
] as const);
