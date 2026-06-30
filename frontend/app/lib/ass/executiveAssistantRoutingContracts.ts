/**
 * ASS-4 — Executive Conversation Routing Architecture constants.
 */

export const ASS_ROUTING_VERSION = "ASS/4" as const;
export const ASS_ROUTING_PLATFORM_ID = "executive-assistant-conversation-routing-architecture" as const;
export const ASS_ROUTING_PLATFORM_NAME = "Executive Conversation Routing Architecture" as const;
export const ASS_ROUTING_DEPENDENCY = "ASS/3" as const;

export const ASS_ROUTING_TAGS = Object.freeze([
  "[ASS_4]",
  "[ROUTING_ARCHITECTURE]",
  "[CONTRACT_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[NO_ROUTE_EXECUTION]",
  "[DECLARATIVE_ROUTES]",
] as const);

export const ASS_ROUTE_CATEGORY_KEYS = Object.freeze([
  "coordination",
  "scope_binding",
  "intent_resolution",
  "fallback",
  "escalation",
] as const);

export const ASS_COORDINATION_PLATFORM_KEYS = Object.freeze(["APP", "LLM", "SMM"] as const);

export const ASS_COORDINATION_ROUTE_KEYS = Object.freeze([
  "app_coordination_route",
  "llm_coordination_route",
  "smm_coordination_route",
] as const);

export const ASS_SCOPE_ROUTING_KEYS = Object.freeze([
  "workspace_routing",
  "scenario_routing",
  "task_routing",
] as const);

export const ASS_SCOPE_ROUTING_SCOPE_KEYS = Object.freeze(["workspace", "scenario", "task"] as const);

export const ASS_ROUTE_INTENT_PLACEHOLDER_KEYS = Object.freeze([
  "intent_unresolved",
  "intent_general",
  "intent_query",
  "intent_action",
  "intent_clarification",
] as const);

export const ASS_ROUTE_TARGET_PLACEHOLDER_KEYS = Object.freeze([
  "target_app_layer",
  "target_llm_layer",
  "target_smm_layer",
  "target_workspace_context",
  "target_scenario_context",
  "target_task_context",
  "target_unassigned",
] as const);

export const ASS_ROUTE_DECISION_PLACEHOLDER_KEYS = Object.freeze([
  "decision_pending",
  "decision_deferred",
  "decision_routed",
  "decision_blocked",
] as const);

export const ASS_ROUTE_CONFIDENCE_LEVEL_KEYS = Object.freeze([
  "confidence_unspecified",
  "confidence_low",
  "confidence_medium",
  "confidence_high",
  "confidence_declared",
] as const);

export const ASS_ROUTE_VALIDATION_CONTRACT_KEYS = Object.freeze([
  "route_identity_validation",
  "coordination_route_validation",
  "scope_routing_validation",
  "target_placeholder_validation",
  "decision_metadata_validation",
  "confidence_metadata_validation",
] as const);

export const ASS_ROUTING_REGISTRY_KEYS = Object.freeze([
  "routing_identity_registry",
  "route_category_registry",
  "intent_placeholder_registry",
  "target_placeholder_registry",
  "coordination_route_registry",
  "scope_routing_metadata_registry",
  "route_decision_metadata_registry",
  "route_confidence_metadata_registry",
  "route_validation_contract_registry",
  "route_binding_registry",
] as const);

export const ASS_ROUTING_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantRoutingArchitecture",
  "validateExecutiveAssistantRoutingArchitecture",
  "getExecutiveAssistantRoutingRegistry",
  "getExecutiveAssistantRoutingManifest",
] as const);

export const ASS_ROUTING_COMPATIBLE_VERSIONS = Object.freeze(["ASS/1", "ASS/2", "ASS/3"] as const);

export const ASS_ROUTING_PRINCIPLES = Object.freeze([
  "routing_metadata_only",
  "declarative_routes_no_execution",
  "coordination_routes_reference_app_llm_smm_only",
  "intent_and_target_placeholders_only",
  "decision_metadata_placeholder_only",
  "confidence_metadata_declarative_only",
  "future_runtime_layers_consume_without_modification",
] as const);

export const ASS_ROUTING_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "chat_runtime",
  "llm_execution",
  "prompt_execution",
  "response_generation",
  "memory_mutation",
  "recommendations",
  "app_business_logic",
  "route_execution",
  "runtime_router",
  "smm_mutation",
  "route_inference",
] as const);

export const ASS_ROUTING_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "routeId",
  "routeKey",
  "routeCategory",
  "contractVersion",
  "stateDependency",
  "declarativeOnly",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_ROUTE_CATEGORY_MANDATORY_FIELDS = Object.freeze([
  "categoryId",
  "categoryKey",
  "label",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_INTENT_PLACEHOLDER_MANDATORY_FIELDS = Object.freeze([
  "placeholderId",
  "placeholderKey",
  "label",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_TARGET_PLACEHOLDER_MANDATORY_FIELDS = Object.freeze([
  "placeholderId",
  "placeholderKey",
  "label",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_COORDINATION_ROUTE_MANDATORY_FIELDS = Object.freeze([
  "coordinationRouteId",
  "coordinationRouteKey",
  "platformKey",
  "intentPlaceholderKey",
  "targetPlaceholderKey",
  "decisionMetadata",
  "confidenceMetadata",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_SCOPE_ROUTING_MANDATORY_FIELDS = Object.freeze([
  "scopeRoutingId",
  "scopeRoutingKey",
  "scopeKey",
  "routingMetadataRef",
  "contextRef",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_ROUTE_DECISION_MANDATORY_FIELDS = Object.freeze([
  "decisionMetadataId",
  "decisionKey",
  "label",
  "placeholderOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_ROUTE_CONFIDENCE_MANDATORY_FIELDS = Object.freeze([
  "confidenceMetadataId",
  "confidenceKey",
  "label",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_ROUTE_VALIDATION_MANDATORY_FIELDS = Object.freeze([
  "validationContractId",
  "validationKey",
  "routeCategory",
  "mandatoryChecks",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_ROUTE_BINDING_MANDATORY_FIELDS = Object.freeze([
  "bindingId",
  "routeId",
  "conversationIdRef",
  "routeCategory",
  "coordinationRouteKey",
  "scopeRoutingKey",
  "decisionKey",
  "confidenceKey",
  "recordedAt",
  "readOnly",
] as const);

export const ASS_ROUTE_CATEGORY_LABELS = Object.freeze({
  coordination: "Coordination Route Category",
  scope_binding: "Scope Binding Route Category",
  intent_resolution: "Intent Resolution Route Category",
  fallback: "Fallback Route Category",
  escalation: "Escalation Route Category",
} as const);

export const ASS_INTENT_PLACEHOLDER_LABELS = Object.freeze({
  intent_unresolved: "Unresolved Intent Placeholder",
  intent_general: "General Intent Placeholder",
  intent_query: "Query Intent Placeholder",
  intent_action: "Action Intent Placeholder",
  intent_clarification: "Clarification Intent Placeholder",
} as const);

export const ASS_TARGET_PLACEHOLDER_LABELS = Object.freeze({
  target_app_layer: "APP Layer Target Placeholder",
  target_llm_layer: "LLM Layer Target Placeholder",
  target_smm_layer: "SMM Layer Target Placeholder",
  target_workspace_context: "Workspace Context Target Placeholder",
  target_scenario_context: "Scenario Context Target Placeholder",
  target_task_context: "Task Context Target Placeholder",
  target_unassigned: "Unassigned Target Placeholder",
} as const);

export const ASS_COORDINATION_ROUTE_TARGET_MAP = Object.freeze({
  app_coordination_route: "target_app_layer",
  llm_coordination_route: "target_llm_layer",
  smm_coordination_route: "target_smm_layer",
} as const);

export const ASS_COORDINATION_ROUTE_PLATFORM_MAP = Object.freeze({
  app_coordination_route: "APP",
  llm_coordination_route: "LLM",
  smm_coordination_route: "SMM",
} as const);

export const ASS_ROUTE_VALIDATION_CHECKS = Object.freeze({
  route_identity_validation: Object.freeze(["route_id_present", "route_category_valid", "declarative_only"]),
  coordination_route_validation: Object.freeze([
    "platform_key_valid",
    "target_placeholder_valid",
    "metadata_only",
  ]),
  scope_routing_validation: Object.freeze(["scope_key_valid", "context_ref_present", "metadata_only"]),
  target_placeholder_validation: Object.freeze(["placeholder_key_valid", "reference_only"]),
  decision_metadata_validation: Object.freeze(["placeholder_only", "no_inference"]),
  confidence_metadata_validation: Object.freeze(["declarative_only", "no_scoring_runtime"]),
} as const);

export const ASS_TEMPLATE_ROUTE_KEY = "ass-route-template" as const;
export const ASS_TEMPLATE_CONVERSATION_REF = "ass-conversation-template" as const;
