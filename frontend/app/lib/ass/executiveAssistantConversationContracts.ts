/**
 * ASS-2 — Executive Conversation Contract constants.
 */

export const ASS_CONVERSATION_CONTRACT_VERSION = "ASS/2" as const;
export const ASS_CONVERSATION_PLATFORM_ID = "executive-assistant-conversation-foundation" as const;
export const ASS_CONVERSATION_PLATFORM_NAME = "Executive Conversation Contract Foundation" as const;
export const ASS_CONVERSATION_FOUNDATION_DEPENDENCY = "ASS/1" as const;

export const ASS_CONVERSATION_TAGS = Object.freeze([
  "[ASS_2]",
  "[CONVERSATION_CONTRACTS]",
  "[CONTRACT_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[NO_INFERENCE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const ASS_PARTICIPANT_ROLE_KEYS = Object.freeze([
  "executive",
  "assistant",
  "system",
  "observer",
] as const);

export const ASS_MESSAGE_KIND_KEYS = Object.freeze([
  "user_input",
  "assistant_output",
  "system_notice",
] as const);

export const ASS_TURN_STATUS_KEYS = Object.freeze([
  "pending",
  "completed",
  "placeholder",
] as const);

export const ASS_SESSION_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "closed",
] as const);

export const ASS_CONVERSATION_REGISTRY_KEYS = Object.freeze([
  "conversation_identity_registry",
  "session_contract_registry",
  "message_contract_registry",
  "turn_contract_registry",
  "participant_role_registry",
  "scope_binding_registry",
] as const);

export const ASS_CONVERSATION_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantConversationContracts",
  "validateExecutiveAssistantConversationContracts",
  "getExecutiveAssistantConversationRegistry",
  "getExecutiveAssistantConversationManifest",
] as const);

export const ASS_CONVERSATION_COMPATIBLE_VERSIONS = Object.freeze(["ASS/1"] as const);

export const ASS_CONVERSATION_PRINCIPLES = Object.freeze([
  "conversation_contracts_metadata_only",
  "no_chat_runtime_no_message_execution",
  "intent_response_routing_placeholders_only",
  "immutable_message_and_turn_contracts",
  "future_phases_consume_without_modification",
  "reference_based_scope_binding",
] as const);

export const ASS_CONVERSATION_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "chat_runtime",
  "llm_execution",
  "prompt_execution",
  "response_generation",
  "memory_mutation",
  "recommendations",
  "app_business_logic",
  "conversation_management_runtime",
] as const);

export const ASS_CONVERSATION_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "conversationId",
  "contractVersion",
  "foundationVersion",
  "scopeKey",
  "participantRoleKeys",
  "createdAt",
  "readOnly",
] as const);

export const ASS_SESSION_MANDATORY_FIELDS = Object.freeze([
  "sessionId",
  "conversationId",
  "sessionStatus",
  "scopeBindingRef",
  "startedAt",
  "readOnly",
] as const);

export const ASS_MESSAGE_MANDATORY_FIELDS = Object.freeze([
  "messageId",
  "sessionId",
  "turnId",
  "messageKind",
  "participantRole",
  "contentRef",
  "createdAt",
  "readOnly",
] as const);

export const ASS_TURN_MANDATORY_FIELDS = Object.freeze([
  "turnId",
  "sessionId",
  "turnIndex",
  "turnStatus",
  "intentMetadata",
  "responseMetadata",
  "routingMetadata",
  "createdAt",
  "readOnly",
] as const);

export const ASS_PARTICIPANT_ROLE_LABELS = Object.freeze({
  executive: "Executive Participant",
  assistant: "Assistant Participant",
  system: "System Participant",
  observer: "Observer Participant",
} as const);

export const ASS_MESSAGE_KIND_LABELS = Object.freeze({
  user_input: "User Input Message",
  assistant_output: "Assistant Output Message",
  system_notice: "System Notice Message",
} as const);

export const ASS_CONVERSATION_DEFAULT_LIMITS = Object.freeze({
  maxIdentities: 4096,
  maxSessions: 4096,
  maxMessages: 8192,
  maxTurns: 8192,
  maxRoles: 16,
  maxScopeBindings: 2048,
} as const);
