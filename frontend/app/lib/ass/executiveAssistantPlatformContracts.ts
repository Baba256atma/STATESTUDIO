/**
 * ASS-1 — Executive Assistant Platform contracts and constants.
 */

export const ASS_PLATFORM_CONTRACT_VERSION = "ASS/1" as const;
export const ASS_PLATFORM_ARCHITECTURE_VERSION = "ASS/1-arch" as const;
export const ASS_PLATFORM_API_VERSION = "ASS/1" as const;
export const ASS_PLATFORM_COMPATIBILITY_VERSION = "ASS/1-compat" as const;
export const ASS_PLATFORM_SOURCE = "executive-assistant-platform-foundation" as const;
export const ASS_PLATFORM_LOG_PREFIX = "[NexoraASS]" as const;
export const ASS_PLATFORM_LAYER_ID = "ASS" as const;

export const ASS_PLATFORM_ID = "executive-assistant-platform" as const;
export const ASS_PLATFORM_NAME = "Executive Assistant Platform" as const;

export const ASS_PLATFORM_TAGS = Object.freeze([
  "[ASS_1]",
  "[ASS_FOUNDATION]",
  "[ARCHITECTURE_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ORCHESTRATION_LAYER]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const ASS_PLATFORM_PRINCIPLES = Object.freeze([
  "orchestration_layer_not_intelligence_layer",
  "consumes_certified_platform_outputs_only",
  "no_chat_runtime_no_llm_orchestration",
  "deterministic_architecture_contracts",
  "no_hidden_state",
  "no_circular_dependencies",
  "no_duplicated_business_logic",
  "future_phases_extend_contracts_additively",
  "enterprise_scalable_architecture",
  "assistant_never_replaces_certified_platforms",
] as const);

export const ASS_CAPABILITY_KEYS = Object.freeze([
  "app_coordination",
  "llm_coordination",
  "smm_coordination",
  "idn_coordination",
  "lay_coordination",
  "conversation_architecture",
  "interaction_contracts",
  "routing_metadata",
] as const);

export const ASS_CONVERSATION_SCOPE_KEYS = Object.freeze([
  "executive",
  "workspace",
  "organization",
  "scenario",
  "session",
  "task",
] as const);

export const ASS_INTEGRATION_KEYS = Object.freeze([
  "APP",
  "LLM",
  "SMM",
  "IDN",
  "LAY",
] as const);

export const ASS_EXTENSION_POINT_KEYS = Object.freeze([
  "conversation_engine",
  "capability_router",
  "integration_adapter",
  "query_facade",
  "governance_facade",
  "platform_certification",
] as const);

export const ASS_REGISTRY_KEYS = Object.freeze([
  "platform_registry",
  "capability_registry",
  "integration_registry",
  "conversation_scope_registry",
  "extension_registry",
  "manifest_registry",
] as const);

export const ASS_PLATFORM_MUST_OWN = Object.freeze([
  "conversation_architecture",
  "interaction_contracts",
  "capability_registration",
  "integration_metadata",
  "routing_metadata",
  "platform_identity",
  "extension_point_registry",
] as const);

export const ASS_PLATFORM_MUST_NOT_OWN = Object.freeze([
  "chat_runtime",
  "ai_reasoning",
  "llm_orchestration",
  "prompt_execution",
  "tool_execution",
  "recommendations",
  "conversation_management",
  "memory_updates",
  "knowledge_generation",
  "mental_model_generation",
  "business_reasoning",
  "executive_recommendations",
  "organizational_governance",
  "scenario_intelligence",
  "business_knowledge",
  "mental_models",
  "executive_memory",
  "timeline",
  "runtime_execution",
] as const);

export const ASS_UPSTREAM_PLATFORM_KEYS = Object.freeze([
  "CORE",
  "KNL",
  "APP",
  "LLM",
  "SMM",
] as const);

export const ASS_DOWNSTREAM_PLATFORM_KEYS = Object.freeze(["IDN", "LAY"] as const);

export const ASS_COMPATIBLE_LAYER_KEYS = Object.freeze([
  "CORE",
  "KNL",
  "APP",
  "LLM",
  "SMM",
  "ASS",
  "IDN",
  "LAY",
] as const);

export const ASS_FUTURE_DEPENDENCY_RULES = Object.freeze([
  Object.freeze({
    ruleId: "ass-1-prerequisite",
    description: "All ASS phases must depend on ASS/1.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-runtime-in-foundation",
    description: "ASS/1 defines architecture only; no chat runtime or AI execution.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-core-modification",
    description: "ASS must not modify certified CORE platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-knl-modification",
    description: "ASS must not modify certified KNL platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-app-modification",
    description: "ASS must not modify certified APP platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-llm-modification",
    description: "ASS must not modify certified LLM platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-smm-modification",
    description: "ASS must not modify certified SMM platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "extend-only-contracts",
    description: "Future ASS phases extend contracts additively; no breaking changes to ASS/1.",
    enforced: true as const,
  }),
] as const);

export const ASS_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantPlatformFoundation",
  "validateExecutiveAssistantPlatform",
  "getExecutiveAssistantPlatformRegistry",
  "getExecutiveAssistantPlatformManifest",
  "ExecutiveAssistantPlatform",
] as const);

export const ASS_VERSION_PATTERN = /^ASS\/\d+$/;

export const ASS_RELEASE_METADATA = Object.freeze({
  releaseStage: "mvp-foundation",
  mvpStatus: "active",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  compatibilityLevel: "foundation",
  readOnly: true as const,
});

export const ASS_ARCHITECTURE_STACK = Object.freeze([
  "CORE",
  "KNL",
  "APP",
  "LLM",
  "SMM",
  "ASS",
  "IDN",
  "LAY",
  "EBUS",
  "INTG",
  "SEC",
  "OPS",
] as const);

export const ASS_POSITION_STATEMENT = Object.freeze({
  assistantIsNot: Object.freeze([
    "an_intelligence_layer",
    "an_llm_orchestrator",
    "a_knowledge_generator",
    "a_mental_model_engine",
    "a_recommendation_engine",
    "a_governance_authority",
    "a_runtime_execution_layer",
  ]),
  assistantIs: Object.freeze([
    "orchestration_layer_over_certified_platforms",
    "conversation_architecture_publisher",
    "capability_and_integration_metadata_registry",
    "consumer_of_app_llm_smm_certified_outputs",
    "publisher_of_assistant_contracts_for_future_idn_and_lay",
  ]),
  readOnly: true as const,
});

export const ASS_CAPABILITY_LABELS = Object.freeze({
  app_coordination: "APP Coordination",
  llm_coordination: "LLM Coordination",
  smm_coordination: "SMM Coordination",
  idn_coordination: "IDN Coordination",
  lay_coordination: "LAY Coordination",
  conversation_architecture: "Conversation Architecture",
  interaction_contracts: "Interaction Contracts",
  routing_metadata: "Routing Metadata",
} as const);

export const ASS_CONVERSATION_SCOPE_LABELS = Object.freeze({
  executive: "Executive Conversation Scope",
  workspace: "Workspace Conversation Scope",
  organization: "Organization Conversation Scope",
  scenario: "Scenario Conversation Scope",
  session: "Session Conversation Scope",
  task: "Task Conversation Scope",
} as const);

export const ASS_INTEGRATION_LABELS = Object.freeze({
  APP: "Application Platform Integration",
  LLM: "LLM Platform Integration",
  SMM: "Shared Mental Model Platform Integration",
  IDN: "Identity Platform Integration",
  LAY: "Layout Platform Integration",
} as const);

export const ASS_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "ass-conversation-engine", label: "Conversation Engine", phaseKey: "conversation_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "ass-capability-router", label: "Capability Router", phaseKey: "capability_router", status: "reserved" as const }),
  Object.freeze({ extensionId: "ass-integration-adapter", label: "Integration Adapter", phaseKey: "integration_adapter", status: "reserved" as const }),
  Object.freeze({ extensionId: "ass-query-facade", label: "Query Facade", phaseKey: "query_facade", status: "reserved" as const }),
  Object.freeze({ extensionId: "ass-governance-facade", label: "Governance Facade", phaseKey: "governance_facade", status: "reserved" as const }),
  Object.freeze({ extensionId: "ass-platform-certification", label: "Platform Certification", phaseKey: "platform_certification", status: "reserved" as const }),
] as const);

export const ASS_DEFAULT_LIMITS = Object.freeze({
  maxCapabilities: 32,
  maxIntegrations: 16,
  maxConversationScopes: 16,
  maxExtensionPoints: 32,
} as const);

export const ASS_UPSTREAM_CONSUMPTION_METADATA = Object.freeze({
  APP: Object.freeze({ consumes: "application_contracts", ownsBusinessLogic: false }),
  LLM: Object.freeze({ consumes: "llm_platform_contracts", ownsBusinessLogic: false }),
  SMM: Object.freeze({ consumes: "smm_platform_contracts", ownsBusinessLogic: false }),
  CORE: Object.freeze({ consumes: "core_boundaries", ownsBusinessLogic: false }),
  KNL: Object.freeze({ consumes: "knowledge_reference_only", ownsBusinessLogic: false }),
} as const);
