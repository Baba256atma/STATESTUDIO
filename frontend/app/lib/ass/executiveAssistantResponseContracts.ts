/**
 * ASS-6 — Executive Response Contract Architecture constants.
 */

export const ASS_RESPONSE_VERSION = "ASS/6" as const;
export const ASS_RESPONSE_PLATFORM_ID = "executive-assistant-response-contract-architecture" as const;
export const ASS_RESPONSE_PLATFORM_NAME = "Executive Response Contract Architecture" as const;
export const ASS_RESPONSE_DEPENDENCY = "ASS/5" as const;

export const ASS_RESPONSE_TAGS = Object.freeze([
  "[ASS_6]",
  "[RESPONSE_CONTRACTS]",
  "[CONTRACT_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[NO_RESPONSE_GENERATION]",
  "[DECLARATIVE_RESPONSE]",
] as const);

export const ASS_RESPONSE_CATEGORY_KEYS = Object.freeze([
  "informative",
  "advisory",
  "confirmatory",
  "clarifying",
  "procedural",
  "summary",
  "escalation_notice",
] as const);

export const ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS = Object.freeze([
  "structure_unspecified",
  "structure_paragraph",
  "structure_bullet_list",
  "structure_numbered_steps",
  "structure_mixed",
] as const);

export const ASS_TONE_STYLE_METADATA_KEYS = Object.freeze([
  "tone_neutral",
  "tone_executive",
  "tone_supportive",
  "tone_direct",
  "tone_formal",
] as const);

export const ASS_EXPLANATION_METADATA_KEYS = Object.freeze([
  "explanation_not_required",
  "explanation_pending",
  "explanation_provided",
  "explanation_deferred",
  "explanation_reference_only",
] as const);

export const ASS_FOLLOW_UP_METADATA_KEYS = Object.freeze([
  "follow_up_not_required",
  "follow_up_pending",
  "follow_up_suggested",
  "follow_up_deferred",
  "follow_up_declined",
] as const);

export const ASS_ACTION_SUGGESTION_METADATA_KEYS = Object.freeze([
  "action_not_suggested",
  "action_pending",
  "action_suggested",
  "action_deferred",
  "action_reference_only",
] as const);

export const ASS_RESPONSE_INTENT_BINDING_KEYS = Object.freeze([
  "informative_intent_binding",
  "advisory_intent_binding",
  "confirmatory_intent_binding",
  "clarifying_intent_binding",
  "procedural_intent_binding",
  "summary_intent_binding",
  "escalation_intent_binding",
] as const);

export const ASS_RESPONSE_VALIDATION_CONTRACT_KEYS = Object.freeze([
  "response_identity_validation",
  "response_category_validation",
  "structure_placeholder_validation",
  "tone_style_validation",
  "explanation_metadata_validation",
  "follow_up_metadata_validation",
  "action_suggestion_validation",
  "response_intent_binding_validation",
] as const);

export const ASS_RESPONSE_REGISTRY_KEYS = Object.freeze([
  "response_identity_registry",
  "response_category_registry",
  "response_structure_placeholder_registry",
  "tone_style_metadata_registry",
  "explanation_metadata_registry",
  "follow_up_metadata_registry",
  "action_suggestion_metadata_registry",
  "response_intent_binding_registry",
  "response_validation_contract_registry",
  "response_binding_snapshot_registry",
] as const);

export const ASS_RESPONSE_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantResponseContractArchitecture",
  "validateExecutiveAssistantResponseContractArchitecture",
  "getExecutiveAssistantResponseRegistry",
  "getExecutiveAssistantResponseManifest",
] as const);

export const ASS_RESPONSE_COMPATIBLE_VERSIONS = Object.freeze(["ASS/1", "ASS/2", "ASS/3", "ASS/4", "ASS/5"] as const);

export const ASS_RESPONSE_PRINCIPLES = Object.freeze([
  "response_contracts_metadata_only",
  "declarative_response_no_generation",
  "structure_placeholders_only",
  "tone_style_metadata_declarative_only",
  "explanation_metadata_placeholder_only",
  "follow_up_metadata_placeholder_only",
  "action_suggestion_metadata_placeholder_only",
  "response_intent_bindings_reference_ass5_metadata_only",
  "future_runtime_layers_consume_without_modification",
] as const);

export const ASS_RESPONSE_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "response_generation",
  "llm_execution",
  "prompt_execution",
  "recommendations",
  "app_business_logic",
  "memory_mutation",
  "chat_runtime",
  "response_renderer",
  "content_synthesis",
] as const);

export const ASS_RESPONSE_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "responseId",
  "responseKey",
  "responseCategoryKey",
  "contractVersion",
  "intentDependency",
  "declarativeOnly",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_RESPONSE_CATEGORY_MANDATORY_FIELDS = Object.freeze([
  "categoryId",
  "categoryKey",
  "label",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_RESPONSE_STRUCTURE_MANDATORY_FIELDS = Object.freeze([
  "structureId",
  "structureKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_TONE_STYLE_MANDATORY_FIELDS = Object.freeze([
  "toneStyleId",
  "toneStyleKey",
  "label",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_EXPLANATION_MANDATORY_FIELDS = Object.freeze([
  "explanationId",
  "explanationKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_FOLLOW_UP_MANDATORY_FIELDS = Object.freeze([
  "followUpId",
  "followUpKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_ACTION_SUGGESTION_MANDATORY_FIELDS = Object.freeze([
  "actionSuggestionId",
  "actionSuggestionKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_RESPONSE_INTENT_BINDING_MANDATORY_FIELDS = Object.freeze([
  "bindingId",
  "bindingKey",
  "responseId",
  "interpretationId",
  "intentCategoryKey",
  "intentRouteBindingKey",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_RESPONSE_VALIDATION_MANDATORY_FIELDS = Object.freeze([
  "validationContractId",
  "validationKey",
  "mandatoryChecks",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_RESPONSE_BINDING_SNAPSHOT_MANDATORY_FIELDS = Object.freeze([
  "snapshotId",
  "responseId",
  "conversationIdRef",
  "responseCategoryKey",
  "structureKey",
  "toneStyleKey",
  "explanationKey",
  "followUpKey",
  "actionSuggestionKey",
  "intentBindingKey",
  "recordedAt",
  "readOnly",
] as const);

export const ASS_RESPONSE_CATEGORY_LABELS = Object.freeze({
  informative: "Informative Response",
  advisory: "Advisory Response",
  confirmatory: "Confirmatory Response",
  clarifying: "Clarifying Response",
  procedural: "Procedural Response",
  summary: "Summary Response",
  escalation_notice: "Escalation Notice Response",
} as const);

export const ASS_RESPONSE_STRUCTURE_LABELS = Object.freeze({
  structure_unspecified: "Unspecified Structure Placeholder",
  structure_paragraph: "Paragraph Structure Placeholder",
  structure_bullet_list: "Bullet List Structure Placeholder",
  structure_numbered_steps: "Numbered Steps Structure Placeholder",
  structure_mixed: "Mixed Structure Placeholder",
} as const);

export const ASS_RESPONSE_INTENT_BINDING_MAP = Object.freeze({
  informative_intent_binding: Object.freeze({
    intentCategoryKey: "information_seeking",
    intentRouteBindingKey: "llm_intent_route_binding",
    interpretationKey: "information_seeking",
  }),
  advisory_intent_binding: Object.freeze({
    intentCategoryKey: "decision_support",
    intentRouteBindingKey: "app_intent_route_binding",
    interpretationKey: "decision_support",
  }),
  confirmatory_intent_binding: Object.freeze({
    intentCategoryKey: "status_inquiry",
    intentRouteBindingKey: "smm_intent_route_binding",
    interpretationKey: "status_inquiry",
  }),
  clarifying_intent_binding: Object.freeze({
    intentCategoryKey: "clarification_request",
    intentRouteBindingKey: "scenario_intent_route_binding",
    interpretationKey: "clarification_request",
  }),
  procedural_intent_binding: Object.freeze({
    intentCategoryKey: "task_delegation",
    intentRouteBindingKey: "task_intent_route_binding",
    interpretationKey: "task_delegation",
  }),
  summary_intent_binding: Object.freeze({
    intentCategoryKey: "strategic_review",
    intentRouteBindingKey: "workspace_intent_route_binding",
    interpretationKey: "strategic_review",
  }),
  escalation_intent_binding: Object.freeze({
    intentCategoryKey: "scenario_exploration",
    intentRouteBindingKey: "scenario_intent_route_binding",
    interpretationKey: "scenario_exploration",
  }),
} as const);

export const ASS_RESPONSE_VALIDATION_CHECKS = Object.freeze({
  response_identity_validation: Object.freeze(["response_id_present", "category_valid", "declarative_only"]),
  response_category_validation: Object.freeze(["category_key_valid", "metadata_only"]),
  structure_placeholder_validation: Object.freeze(["structure_key_valid", "placeholder_only"]),
  tone_style_validation: Object.freeze(["tone_key_valid", "declarative_only"]),
  explanation_metadata_validation: Object.freeze(["explanation_key_valid", "placeholder_only"]),
  follow_up_metadata_validation: Object.freeze(["follow_up_key_valid", "placeholder_only"]),
  action_suggestion_validation: Object.freeze(["action_key_valid", "placeholder_only"]),
  response_intent_binding_validation: Object.freeze([
    "ass5_intent_category_ref",
    "ass5_route_binding_ref",
    "ass5_interpretation_ref",
  ]),
} as const);

export const ASS_TEMPLATE_RESPONSE_KEY = "ass-response-template" as const;
export const ASS_TEMPLATE_CONVERSATION_REF = "ass-conversation-template" as const;
