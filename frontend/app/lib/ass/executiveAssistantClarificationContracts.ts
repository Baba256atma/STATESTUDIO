/**
 * ASS-7 — Executive Clarification Architecture constants.
 */

export const ASS_CLARIFICATION_VERSION = "ASS/7" as const;
export const ASS_CLARIFICATION_PLATFORM_ID = "executive-assistant-clarification-architecture" as const;
export const ASS_CLARIFICATION_PLATFORM_NAME = "Executive Clarification Architecture" as const;
export const ASS_CLARIFICATION_DEPENDENCY = "ASS/6" as const;

export const ASS_CLARIFICATION_TAGS = Object.freeze([
  "[ASS_7]",
  "[CLARIFICATION_ARCHITECTURE]",
  "[CONTRACT_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[NO_QUESTION_GENERATION]",
  "[DECLARATIVE_CLARIFICATION]",
] as const);

export const ASS_CLARIFICATION_CATEGORY_KEYS = Object.freeze([
  "ambiguity_resolution",
  "missing_context",
  "scope_confirmation",
  "intent_disambiguation",
  "priority_confirmation",
  "constraint_confirmation",
  "follow_up_clarification",
] as const);

export const ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS = Object.freeze([
  "trigger_unspecified",
  "trigger_ambiguity_detected",
  "trigger_context_missing",
  "trigger_scope_unclear",
  "trigger_intent_unclear",
  "trigger_priority_unclear",
] as const);

export const ASS_QUESTION_TYPE_METADATA_KEYS = Object.freeze([
  "question_type_open",
  "question_type_closed",
  "question_type_binary",
  "question_type_multi_choice",
  "question_type_reference",
] as const);

export const ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS = Object.freeze([
  "resolution_not_required",
  "resolution_pending",
  "resolution_suggested",
  "resolution_deferred",
  "resolution_reference_only",
] as const);

export const ASS_MISSING_CONTEXT_METADATA_KEYS = Object.freeze([
  "context_complete",
  "context_partial",
  "context_missing",
  "context_deferred",
  "context_reference_only",
] as const);

export const ASS_CLARIFICATION_PRIORITY_METADATA_KEYS = Object.freeze([
  "priority_low",
  "priority_medium",
  "priority_high",
  "priority_urgent",
  "priority_unspecified",
] as const);

export const ASS_CLARIFICATION_INTENT_BINDING_KEYS = Object.freeze([
  "ambiguity_intent_binding",
  "missing_context_intent_binding",
  "scope_intent_binding",
  "intent_disambiguation_binding",
  "priority_intent_binding",
  "constraint_intent_binding",
  "follow_up_intent_binding",
] as const);

export const ASS_CLARIFICATION_RESPONSE_BINDING_KEYS = Object.freeze([
  "ambiguity_response_binding",
  "missing_context_response_binding",
  "scope_response_binding",
  "intent_disambiguation_response_binding",
  "priority_response_binding",
  "constraint_response_binding",
  "follow_up_response_binding",
] as const);

export const ASS_CLARIFICATION_VALIDATION_CONTRACT_KEYS = Object.freeze([
  "clarification_identity_validation",
  "clarification_category_validation",
  "trigger_placeholder_validation",
  "question_type_validation",
  "ambiguity_resolution_validation",
  "missing_context_validation",
  "priority_metadata_validation",
  "clarification_intent_binding_validation",
  "clarification_response_binding_validation",
] as const);

export const ASS_CLARIFICATION_REGISTRY_KEYS = Object.freeze([
  "clarification_identity_registry",
  "clarification_category_registry",
  "clarification_trigger_placeholder_registry",
  "question_type_metadata_registry",
  "ambiguity_resolution_metadata_registry",
  "missing_context_metadata_registry",
  "clarification_priority_metadata_registry",
  "clarification_intent_binding_registry",
  "clarification_response_binding_registry",
  "clarification_binding_snapshot_registry",
] as const);

export const ASS_CLARIFICATION_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantClarificationArchitecture",
  "validateExecutiveAssistantClarificationArchitecture",
  "getExecutiveAssistantClarificationRegistry",
  "getExecutiveAssistantClarificationManifest",
] as const);

export const ASS_CLARIFICATION_COMPATIBLE_VERSIONS = Object.freeze([
  "ASS/1",
  "ASS/2",
  "ASS/3",
  "ASS/4",
  "ASS/5",
  "ASS/6",
] as const);

export const ASS_CLARIFICATION_PRINCIPLES = Object.freeze([
  "clarification_metadata_only",
  "declarative_clarification_no_question_generation",
  "trigger_placeholders_only",
  "question_type_metadata_declarative_only",
  "ambiguity_resolution_metadata_placeholder_only",
  "missing_context_metadata_placeholder_only",
  "priority_metadata_declarative_only",
  "clarification_intent_bindings_reference_ass5_metadata_only",
  "clarification_response_bindings_reference_ass6_metadata_only",
  "future_runtime_layers_consume_without_modification",
] as const);

export const ASS_CLARIFICATION_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "question_generation",
  "llm_execution",
  "prompt_execution",
  "intent_detection_runtime",
  "response_generation",
  "memory_mutation",
  "chat_runtime",
  "clarification_renderer",
  "inference_engine",
] as const);

export const ASS_CLARIFICATION_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "clarificationId",
  "clarificationKey",
  "clarificationCategoryKey",
  "contractVersion",
  "responseDependency",
  "declarativeOnly",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_CATEGORY_MANDATORY_FIELDS = Object.freeze([
  "categoryId",
  "categoryKey",
  "label",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_TRIGGER_MANDATORY_FIELDS = Object.freeze([
  "triggerId",
  "triggerKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_QUESTION_TYPE_MANDATORY_FIELDS = Object.freeze([
  "questionTypeId",
  "questionTypeKey",
  "label",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_AMBIGUITY_RESOLUTION_MANDATORY_FIELDS = Object.freeze([
  "resolutionId",
  "resolutionKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_MISSING_CONTEXT_MANDATORY_FIELDS = Object.freeze([
  "missingContextId",
  "missingContextKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_PRIORITY_MANDATORY_FIELDS = Object.freeze([
  "priorityId",
  "priorityKey",
  "label",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_INTENT_BINDING_MANDATORY_FIELDS = Object.freeze([
  "bindingId",
  "bindingKey",
  "clarificationId",
  "interpretationId",
  "intentCategoryKey",
  "intentRouteBindingKey",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_RESPONSE_BINDING_MANDATORY_FIELDS = Object.freeze([
  "bindingId",
  "bindingKey",
  "clarificationId",
  "responseId",
  "responseCategoryKey",
  "responseIntentBindingKey",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_BINDING_SNAPSHOT_MANDATORY_FIELDS = Object.freeze([
  "snapshotId",
  "clarificationId",
  "conversationIdRef",
  "clarificationCategoryKey",
  "triggerKey",
  "questionTypeKey",
  "resolutionKey",
  "missingContextKey",
  "priorityKey",
  "intentBindingKey",
  "responseBindingKey",
  "recordedAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_CATEGORY_LABELS = Object.freeze({
  ambiguity_resolution: "Ambiguity Resolution Clarification",
  missing_context: "Missing Context Clarification",
  scope_confirmation: "Scope Confirmation Clarification",
  intent_disambiguation: "Intent Disambiguation Clarification",
  priority_confirmation: "Priority Confirmation Clarification",
  constraint_confirmation: "Constraint Confirmation Clarification",
  follow_up_clarification: "Follow-up Clarification",
} as const);

export const ASS_CLARIFICATION_TRIGGER_LABELS = Object.freeze({
  trigger_unspecified: "Unspecified Trigger Placeholder",
  trigger_ambiguity_detected: "Ambiguity Detected Trigger Placeholder",
  trigger_context_missing: "Context Missing Trigger Placeholder",
  trigger_scope_unclear: "Scope Unclear Trigger Placeholder",
  trigger_intent_unclear: "Intent Unclear Trigger Placeholder",
  trigger_priority_unclear: "Priority Unclear Trigger Placeholder",
} as const);

export const ASS_CLARIFICATION_INTENT_BINDING_MAP = Object.freeze({
  ambiguity_intent_binding: Object.freeze({
    intentCategoryKey: "clarification_request",
    intentRouteBindingKey: "scenario_intent_route_binding",
    interpretationKey: "clarification_request",
  }),
  missing_context_intent_binding: Object.freeze({
    intentCategoryKey: "information_seeking",
    intentRouteBindingKey: "llm_intent_route_binding",
    interpretationKey: "information_seeking",
  }),
  scope_intent_binding: Object.freeze({
    intentCategoryKey: "scenario_exploration",
    intentRouteBindingKey: "workspace_intent_route_binding",
    interpretationKey: "scenario_exploration",
  }),
  intent_disambiguation_binding: Object.freeze({
    intentCategoryKey: "clarification_request",
    intentRouteBindingKey: "scenario_intent_route_binding",
    interpretationKey: "clarification_request",
  }),
  priority_intent_binding: Object.freeze({
    intentCategoryKey: "decision_support",
    intentRouteBindingKey: "app_intent_route_binding",
    interpretationKey: "decision_support",
  }),
  constraint_intent_binding: Object.freeze({
    intentCategoryKey: "task_delegation",
    intentRouteBindingKey: "task_intent_route_binding",
    interpretationKey: "task_delegation",
  }),
  follow_up_intent_binding: Object.freeze({
    intentCategoryKey: "status_inquiry",
    intentRouteBindingKey: "smm_intent_route_binding",
    interpretationKey: "status_inquiry",
  }),
} as const);

export const ASS_CLARIFICATION_RESPONSE_BINDING_MAP = Object.freeze({
  ambiguity_response_binding: Object.freeze({
    responseCategoryKey: "clarifying",
    responseIntentBindingKey: "clarifying_intent_binding",
  }),
  missing_context_response_binding: Object.freeze({
    responseCategoryKey: "informative",
    responseIntentBindingKey: "informative_intent_binding",
  }),
  scope_response_binding: Object.freeze({
    responseCategoryKey: "confirmatory",
    responseIntentBindingKey: "confirmatory_intent_binding",
  }),
  intent_disambiguation_response_binding: Object.freeze({
    responseCategoryKey: "clarifying",
    responseIntentBindingKey: "clarifying_intent_binding",
  }),
  priority_response_binding: Object.freeze({
    responseCategoryKey: "advisory",
    responseIntentBindingKey: "advisory_intent_binding",
  }),
  constraint_response_binding: Object.freeze({
    responseCategoryKey: "procedural",
    responseIntentBindingKey: "procedural_intent_binding",
  }),
  follow_up_response_binding: Object.freeze({
    responseCategoryKey: "summary",
    responseIntentBindingKey: "summary_intent_binding",
  }),
} as const);

export const ASS_CLARIFICATION_BINDING_CATEGORY_MAP = Object.freeze({
  ambiguity_intent_binding: "ambiguity_resolution",
  missing_context_intent_binding: "missing_context",
  scope_intent_binding: "scope_confirmation",
  intent_disambiguation_binding: "intent_disambiguation",
  priority_intent_binding: "priority_confirmation",
  constraint_intent_binding: "constraint_confirmation",
  follow_up_intent_binding: "follow_up_clarification",
} as const);

export const ASS_CLARIFICATION_VALIDATION_CHECKS = Object.freeze({
  clarification_identity_validation: Object.freeze(["clarification_id_present", "category_valid", "declarative_only"]),
  clarification_category_validation: Object.freeze(["category_key_valid", "metadata_only"]),
  trigger_placeholder_validation: Object.freeze(["trigger_key_valid", "placeholder_only"]),
  question_type_validation: Object.freeze(["question_type_key_valid", "declarative_only"]),
  ambiguity_resolution_validation: Object.freeze(["resolution_key_valid", "placeholder_only"]),
  missing_context_validation: Object.freeze(["missing_context_key_valid", "placeholder_only"]),
  priority_metadata_validation: Object.freeze(["priority_key_valid", "declarative_only"]),
  clarification_intent_binding_validation: Object.freeze([
    "ass5_intent_category_ref",
    "ass5_route_binding_ref",
    "ass5_interpretation_ref",
  ]),
  clarification_response_binding_validation: Object.freeze([
    "ass6_response_category_ref",
    "ass6_response_intent_binding_ref",
  ]),
} as const);

export const ASS_TEMPLATE_CLARIFICATION_KEY = "ass-clarification-template" as const;
export const ASS_TEMPLATE_CONVERSATION_REF = "ass-conversation-template" as const;
