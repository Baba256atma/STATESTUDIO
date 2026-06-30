/**
 * ASS-8 — Executive Assistant Coordination Manifest constants.
 */

export const ASS_COORDINATION_VERSION = "ASS/8" as const;
export const ASS_COORDINATION_PLATFORM_ID = "executive-assistant-coordination-manifest" as const;
export const ASS_COORDINATION_PLATFORM_NAME = "Executive Assistant Coordination Manifest" as const;
export const ASS_COORDINATION_DEPENDENCY = "ASS/7" as const;

export const ASS_COORDINATION_TAGS = Object.freeze([
  "[ASS_8]",
  "[COORDINATION_MANIFEST]",
  "[METADATA_AGGREGATION]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[READ_ONLY_REFERENCES]",
] as const);

export const ASS_CERTIFIED_PHASE_KEYS = Object.freeze([
  "ASS/1",
  "ASS/2",
  "ASS/3",
  "ASS/4",
  "ASS/5",
  "ASS/6",
  "ASS/7",
] as const);

export const ASS_CERTIFIED_PHASE_LABELS = Object.freeze({
  "ASS/1": "Executive Assistant Platform Foundation",
  "ASS/2": "Executive Conversation Contract Foundation",
  "ASS/3": "Executive Conversation State Architecture",
  "ASS/4": "Executive Conversation Routing Architecture",
  "ASS/5": "Executive Intent Interpretation Contract",
  "ASS/6": "Executive Response Contract Architecture",
  "ASS/7": "Executive Clarification Architecture",
} as const);

export const ASS_CERTIFIED_PHASE_BUILD_APIS = Object.freeze({
  "ASS/1": "buildExecutiveAssistantPlatformFoundation",
  "ASS/2": "buildExecutiveAssistantConversationContracts",
  "ASS/3": "buildExecutiveAssistantConversationStateArchitecture",
  "ASS/4": "buildExecutiveAssistantRoutingArchitecture",
  "ASS/5": "buildExecutiveAssistantIntentInterpretationContracts",
  "ASS/6": "buildExecutiveAssistantResponseContractArchitecture",
  "ASS/7": "buildExecutiveAssistantClarificationArchitecture",
} as const);

export const ASS_CERTIFIED_PHASE_DEPENDENCIES = Object.freeze({
  "ASS/1": null,
  "ASS/2": "ASS/1",
  "ASS/3": "ASS/2",
  "ASS/4": "ASS/3",
  "ASS/5": "ASS/4",
  "ASS/6": "ASS/5",
  "ASS/7": "ASS/6",
} as const);

export const ASS_PHASE_REFERENCE_KEYS = Object.freeze([
  "conversation_contract_reference",
  "state_architecture_reference",
  "routing_architecture_reference",
  "intent_contract_reference",
  "response_contract_reference",
  "clarification_contract_reference",
] as const);

export const ASS_COORDINATION_REGISTRY_KEYS = Object.freeze([
  "assistant_coordination_identity_registry",
  "certified_ass_phase_registry",
  "conversation_contract_reference_registry",
  "state_architecture_reference_registry",
  "routing_architecture_reference_registry",
  "intent_contract_reference_registry",
  "response_contract_reference_registry",
  "clarification_contract_reference_registry",
  "cross_phase_compatibility_matrix_registry",
  "platform_coordination_manifest_registry",
] as const);

export const ASS_COORDINATION_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantCoordinationManifest",
  "validateExecutiveAssistantCoordinationManifest",
  "getExecutiveAssistantCoordinationRegistry",
  "getExecutiveAssistantCoordinationPlatformManifest",
] as const);

export const ASS_COORDINATION_COMPATIBLE_VERSIONS = Object.freeze([
  "ASS/1",
  "ASS/2",
  "ASS/3",
  "ASS/4",
  "ASS/5",
  "ASS/6",
  "ASS/7",
] as const);

export const ASS_COORDINATION_PRINCIPLES = Object.freeze([
  "coordination_metadata_aggregation_only",
  "read_only_references_to_certified_phases",
  "deterministic_platform_coordination_manifest",
  "no_runtime_coordination_no_assistant_execution",
  "cross_phase_compatibility_matrix_complete",
  "future_runtime_layers_consume_without_modification",
] as const);

export const ASS_COORDINATION_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "runtime_coordination",
  "assistant_execution",
  "llm_execution",
  "app_business_logic",
  "smm_mutation",
  "memory_mutation",
  "chat_runtime",
  "response_generation",
  "route_execution",
] as const);

export const ASS_COORDINATION_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "coordinationId",
  "coordinationKey",
  "platformVersion",
  "certifiedPhaseCount",
  "declarativeOnly",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CERTIFIED_PHASE_MANDATORY_FIELDS = Object.freeze([
  "phaseId",
  "phaseKey",
  "label",
  "buildApi",
  "dependencyKey",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_PHASE_REFERENCE_MANDATORY_FIELDS = Object.freeze([
  "referenceId",
  "referenceKey",
  "phaseKey",
  "manifestId",
  "platformId",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_COMPATIBILITY_MATRIX_MANDATORY_FIELDS = Object.freeze([
  "compatibilityId",
  "fromPhaseKey",
  "toPhaseKey",
  "compatible",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_PLATFORM_COORDINATION_MANIFEST_MANDATORY_FIELDS = Object.freeze([
  "manifestId",
  "platformId",
  "version",
  "title",
  "certifiedPhaseCount",
  "compatibilityEntryCount",
  "validationResult",
  "compatibility",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_PHASE_MANIFEST_REFERENCES = Object.freeze({
  "ASS/1": Object.freeze({
    manifestId: "executive-assistant-platform-manifest",
    platformId: "executive-assistant-platform",
  }),
  "ASS/2": Object.freeze({
    manifestId: "executive-assistant-conversation-foundation-manifest",
    platformId: "executive-assistant-conversation-foundation",
  }),
  "ASS/3": Object.freeze({
    manifestId: "executive-assistant-conversation-state-manifest",
    platformId: "executive-assistant-conversation-state-architecture",
  }),
  "ASS/4": Object.freeze({
    manifestId: "executive-assistant-routing-manifest",
    platformId: "executive-assistant-conversation-routing-architecture",
  }),
  "ASS/5": Object.freeze({
    manifestId: "executive-assistant-intent-manifest",
    platformId: "executive-assistant-intent-interpretation-contract",
  }),
  "ASS/6": Object.freeze({
    manifestId: "executive-assistant-response-manifest",
    platformId: "executive-assistant-response-contract-architecture",
  }),
  "ASS/7": Object.freeze({
    manifestId: "executive-assistant-clarification-manifest",
    platformId: "executive-assistant-clarification-architecture",
  }),
} as const);

export const ASS_PHASE_REFERENCE_PHASE_MAP = Object.freeze({
  conversation_contract_reference: "ASS/2",
  state_architecture_reference: "ASS/3",
  routing_architecture_reference: "ASS/4",
  intent_contract_reference: "ASS/5",
  response_contract_reference: "ASS/6",
  clarification_contract_reference: "ASS/7",
} as const);

export const ASS_COORDINATION_KEY = "executive-assistant-coordination" as const;
