/**
 * ASS-5 — Executive Intent Interpretation Contract constants.
 */

export const ASS_INTENT_VERSION = "ASS/5" as const;
export const ASS_INTENT_PLATFORM_ID = "executive-assistant-intent-interpretation-contract" as const;
export const ASS_INTENT_PLATFORM_NAME = "Executive Intent Interpretation Contract" as const;
export const ASS_INTENT_DEPENDENCY = "ASS/4" as const;

export const ASS_INTENT_TAGS = Object.freeze([
  "[ASS_5]",
  "[INTENT_INTERPRETATION]",
  "[CONTRACT_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[NO_CLASSIFIER]",
  "[DECLARATIVE_INTENT]",
] as const);

export const ASS_EXECUTIVE_INTENT_CATEGORY_KEYS = Object.freeze([
  "information_seeking",
  "decision_support",
  "task_delegation",
  "status_inquiry",
  "clarification_request",
  "strategic_review",
  "scenario_exploration",
] as const);

export const ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS = Object.freeze([
  "signal_unspecified",
  "signal_textual",
  "signal_contextual",
  "signal_structural",
  "signal_implicit",
] as const);

export const ASS_AMBIGUITY_METADATA_KEYS = Object.freeze([
  "ambiguity_none",
  "ambiguity_low",
  "ambiguity_moderate",
  "ambiguity_high",
  "ambiguity_unresolved",
] as const);

export const ASS_CLARIFICATION_METADATA_KEYS = Object.freeze([
  "clarification_not_required",
  "clarification_pending",
  "clarification_requested",
  "clarification_provided",
  "clarification_deferred",
] as const);

export const ASS_INTENT_CONFIDENCE_LEVEL_KEYS = Object.freeze([
  "confidence_unspecified",
  "confidence_low",
  "confidence_medium",
  "confidence_high",
  "confidence_declared",
] as const);

export const ASS_INTENT_ROUTE_BINDING_KEYS = Object.freeze([
  "app_intent_route_binding",
  "llm_intent_route_binding",
  "smm_intent_route_binding",
  "workspace_intent_route_binding",
  "scenario_intent_route_binding",
  "task_intent_route_binding",
] as const);

export const ASS_INTENT_VALIDATION_CONTRACT_KEYS = Object.freeze([
  "intent_identity_validation",
  "intent_category_validation",
  "signal_placeholder_validation",
  "ambiguity_metadata_validation",
  "clarification_metadata_validation",
  "confidence_metadata_validation",
  "intent_route_binding_validation",
] as const);

export const ASS_INTENT_REGISTRY_KEYS = Object.freeze([
  "intent_interpretation_identity_registry",
  "executive_intent_category_registry",
  "intent_signal_placeholder_registry",
  "ambiguity_metadata_registry",
  "clarification_metadata_registry",
  "intent_confidence_metadata_registry",
  "intent_route_binding_registry",
  "intent_validation_contract_registry",
  "intent_binding_snapshot_registry",
] as const);

export const ASS_INTENT_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantIntentInterpretationContracts",
  "validateExecutiveAssistantIntentInterpretationContracts",
  "getExecutiveAssistantIntentRegistry",
  "getExecutiveAssistantIntentManifest",
] as const);

export const ASS_INTENT_COMPATIBLE_VERSIONS = Object.freeze(["ASS/1", "ASS/2", "ASS/3", "ASS/4"] as const);

export const ASS_INTENT_PRINCIPLES = Object.freeze([
  "intent_interpretation_metadata_only",
  "declarative_intent_no_detection_runtime",
  "signal_placeholders_only",
  "ambiguity_metadata_declarative_only",
  "clarification_metadata_placeholder_only",
  "confidence_metadata_declarative_only",
  "intent_route_bindings_reference_ass4_metadata_only",
  "future_runtime_layers_consume_without_modification",
] as const);

export const ASS_INTENT_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "intent_detection_runtime",
  "intent_classifier",
  "llm_execution",
  "prompt_execution",
  "response_generation",
  "memory_mutation",
  "recommendations",
  "app_business_logic",
  "route_execution",
  "inference_engine",
] as const);

export const ASS_INTENT_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "interpretationId",
  "interpretationKey",
  "intentCategoryKey",
  "contractVersion",
  "routingDependency",
  "declarativeOnly",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_CATEGORY_MANDATORY_FIELDS = Object.freeze([
  "categoryId",
  "categoryKey",
  "label",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_SIGNAL_MANDATORY_FIELDS = Object.freeze([
  "signalId",
  "signalKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_AMBIGUITY_MANDATORY_FIELDS = Object.freeze([
  "ambiguityId",
  "ambiguityKey",
  "label",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_CLARIFICATION_MANDATORY_FIELDS = Object.freeze([
  "clarificationId",
  "clarificationKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_CONFIDENCE_MANDATORY_FIELDS = Object.freeze([
  "confidenceId",
  "confidenceKey",
  "label",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_ROUTE_BINDING_MANDATORY_FIELDS = Object.freeze([
  "bindingId",
  "bindingKey",
  "interpretationId",
  "coordinationRouteKey",
  "scopeRoutingKey",
  "routeCategoryKey",
  "intentPlaceholderKey",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_VALIDATION_MANDATORY_FIELDS = Object.freeze([
  "validationContractId",
  "validationKey",
  "mandatoryChecks",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_BINDING_SNAPSHOT_MANDATORY_FIELDS = Object.freeze([
  "snapshotId",
  "interpretationId",
  "conversationIdRef",
  "intentCategoryKey",
  "signalKey",
  "ambiguityKey",
  "clarificationKey",
  "confidenceKey",
  "routeBindingKey",
  "recordedAt",
  "readOnly",
] as const);

export const ASS_INTENT_CATEGORY_LABELS = Object.freeze({
  information_seeking: "Information Seeking Intent",
  decision_support: "Decision Support Intent",
  task_delegation: "Task Delegation Intent",
  status_inquiry: "Status Inquiry Intent",
  clarification_request: "Clarification Request Intent",
  strategic_review: "Strategic Review Intent",
  scenario_exploration: "Scenario Exploration Intent",
} as const);

export const ASS_INTENT_SIGNAL_LABELS = Object.freeze({
  signal_unspecified: "Unspecified Signal Placeholder",
  signal_textual: "Textual Signal Placeholder",
  signal_contextual: "Contextual Signal Placeholder",
  signal_structural: "Structural Signal Placeholder",
  signal_implicit: "Implicit Signal Placeholder",
} as const);

export const ASS_INTENT_ROUTE_BINDING_MAP = Object.freeze({
  app_intent_route_binding: Object.freeze({
    coordinationRouteKey: "app_coordination_route",
    scopeRoutingKey: "workspace_routing",
    routeCategoryKey: "coordination",
    intentPlaceholderKey: "intent_action",
  }),
  llm_intent_route_binding: Object.freeze({
    coordinationRouteKey: "llm_coordination_route",
    scopeRoutingKey: "scenario_routing",
    routeCategoryKey: "coordination",
    intentPlaceholderKey: "intent_query",
  }),
  smm_intent_route_binding: Object.freeze({
    coordinationRouteKey: "smm_coordination_route",
    scopeRoutingKey: "task_routing",
    routeCategoryKey: "coordination",
    intentPlaceholderKey: "intent_general",
  }),
  workspace_intent_route_binding: Object.freeze({
    coordinationRouteKey: "app_coordination_route",
    scopeRoutingKey: "workspace_routing",
    routeCategoryKey: "scope_binding",
    intentPlaceholderKey: "intent_unresolved",
  }),
  scenario_intent_route_binding: Object.freeze({
    coordinationRouteKey: "llm_coordination_route",
    scopeRoutingKey: "scenario_routing",
    routeCategoryKey: "scope_binding",
    intentPlaceholderKey: "intent_clarification",
  }),
  task_intent_route_binding: Object.freeze({
    coordinationRouteKey: "smm_coordination_route",
    scopeRoutingKey: "task_routing",
    routeCategoryKey: "scope_binding",
    intentPlaceholderKey: "intent_action",
  }),
} as const);

export const ASS_INTENT_VALIDATION_CHECKS = Object.freeze({
  intent_identity_validation: Object.freeze(["interpretation_id_present", "category_valid", "declarative_only"]),
  intent_category_validation: Object.freeze(["category_key_valid", "metadata_only"]),
  signal_placeholder_validation: Object.freeze(["signal_key_valid", "placeholder_only"]),
  ambiguity_metadata_validation: Object.freeze(["ambiguity_key_valid", "declarative_only"]),
  clarification_metadata_validation: Object.freeze(["clarification_key_valid", "placeholder_only"]),
  confidence_metadata_validation: Object.freeze(["confidence_key_valid", "declarative_only"]),
  intent_route_binding_validation: Object.freeze([
    "ass4_coordination_route_ref",
    "ass4_scope_routing_ref",
    "ass4_route_category_ref",
    "ass4_intent_placeholder_ref",
  ]),
} as const);

export const ASS_TEMPLATE_INTERPRETATION_KEY = "ass-intent-interpretation-template" as const;
export const ASS_TEMPLATE_CONVERSATION_REF = "ass-conversation-template" as const;
