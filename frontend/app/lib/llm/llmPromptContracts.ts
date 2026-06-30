/**
 * LLM-4 — Prompt Builder contracts and constants.
 */

export const LLM_PROMPT_CONTRACT_VERSION = "LLM/4" as const;
export const LLM_PROMPT_PLATFORM_ID = "llm-prompt-builder" as const;
export const LLM_PROMPT_PLATFORM_NAME = "Prompt Builder" as const;
export const LLM_PROMPT_FOUNDATION_DEPENDENCY = "LLM/1" as const;
export const LLM_PROMPT_PROVIDER_DEPENDENCY = "LLM/2" as const;
export const LLM_PROMPT_RUNTIME_DEPENDENCY = "LLM/3" as const;

export const LLM_PROMPT_TAGS = Object.freeze([
  "[LLM_4]",
  "[PROMPT_BUILDER]",
  "[DETERMINISTIC]",
  "[PROVIDER_NEUTRAL]",
  "[NO_BUSINESS_LOGIC]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_PROMPT_SECTION_KEYS = Object.freeze([
  "system",
  "developer",
  "context_reference",
  "user",
  "constraints",
  "output_format",
  "safety",
  "metadata",
] as const);

export const LLM_PROMPT_REQUIRED_SECTION_KEYS = Object.freeze([
  "system",
  "user",
] as const);

export const LLM_PROMPT_TEMPLATE_KEYS = Object.freeze([
  "general_assistant",
  "executive_analysis",
  "object_analysis",
  "relationship_analysis",
  "kpi_analysis",
  "risk_analysis",
  "scenario_analysis",
  "timeline_analysis",
  "executive_summary",
] as const);

export const LLM_PROMPT_TYPE_KEYS = Object.freeze([
  "assistant",
  "analysis",
  "summary",
] as const);

export const LLM_PROMPT_PUBLIC_API_REGISTRY = Object.freeze([
  "buildPromptPackage",
  "validatePromptPackage",
  "registerPromptTemplate",
  "discoverPromptTemplates",
  "getPromptManifest",
  "getPromptRegistry",
  "buildLlmPromptBuilderLayer",
] as const);

export const LLM_PROMPT_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
] as const);

export const LLM_PROMPT_PRINCIPLES = Object.freeze([
  "prompt_composition_only",
  "provider_neutral_packages",
  "deterministic_assembly",
  "no_business_reasoning",
  "no_context_collection",
  "no_provider_formatting",
  "templates_define_structure_only",
] as const);

export const LLM_PROMPT_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredTemplates: 32,
  maxSectionsPerPackage: 16,
  maxContentRefLength: 4096,
} as const);

export const LLM_PROMPT_TEMPLATE_LABELS = Object.freeze({
  general_assistant: "General Assistant",
  executive_analysis: "Executive Analysis",
  object_analysis: "Object Analysis",
  relationship_analysis: "Relationship Analysis",
  kpi_analysis: "KPI Analysis",
  risk_analysis: "Risk Analysis",
  scenario_analysis: "Scenario Analysis",
  timeline_analysis: "Timeline Analysis",
  executive_summary: "Executive Summary",
} as const);

export const LLM_PROMPT_TEMPLATE_TYPES: Readonly<Record<(typeof LLM_PROMPT_TEMPLATE_KEYS)[number], (typeof LLM_PROMPT_TYPE_KEYS)[number]>> =
  Object.freeze({
    general_assistant: "assistant",
    executive_analysis: "analysis",
    object_analysis: "analysis",
    relationship_analysis: "analysis",
    kpi_analysis: "analysis",
    risk_analysis: "analysis",
    scenario_analysis: "analysis",
    timeline_analysis: "analysis",
    executive_summary: "summary",
  });

export const LLM_PROMPT_TEMPLATE_SECTIONS = Object.freeze({
  general_assistant: Object.freeze(["system", "user", "constraints", "output_format", "safety", "metadata"] as const),
  executive_analysis: Object.freeze(["system", "developer", "context_reference", "user", "constraints", "output_format", "safety"] as const),
  object_analysis: Object.freeze(["system", "context_reference", "user", "constraints", "output_format"] as const),
  relationship_analysis: Object.freeze(["system", "context_reference", "user", "constraints", "output_format"] as const),
  kpi_analysis: Object.freeze(["system", "context_reference", "user", "constraints", "output_format"] as const),
  risk_analysis: Object.freeze(["system", "context_reference", "user", "constraints", "output_format", "safety"] as const),
  scenario_analysis: Object.freeze(["system", "developer", "context_reference", "user", "constraints", "output_format"] as const),
  timeline_analysis: Object.freeze(["system", "context_reference", "user", "constraints", "output_format"] as const),
  executive_summary: Object.freeze(["system", "context_reference", "user", "output_format", "metadata"] as const),
});
