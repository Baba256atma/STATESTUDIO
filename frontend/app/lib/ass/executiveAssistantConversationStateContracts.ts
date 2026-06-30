/**
 * ASS-3 — Executive Conversation State Architecture constants.
 */

export const ASS_CONVERSATION_STATE_VERSION = "ASS/3" as const;
export const ASS_CONVERSATION_STATE_PLATFORM_ID = "executive-assistant-conversation-state-architecture" as const;
export const ASS_CONVERSATION_STATE_PLATFORM_NAME = "Executive Conversation State Architecture" as const;
export const ASS_CONVERSATION_STATE_DEPENDENCY = "ASS/2" as const;

export const ASS_CONVERSATION_STATE_TAGS = Object.freeze([
  "[ASS_3]",
  "[CONVERSATION_STATE]",
  "[CONTRACT_ONLY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME]",
  "[NO_STATE_MACHINE_EXECUTION]",
  "[DECLARATIVE_TRANSITIONS]",
] as const);

export const ASS_LIFECYCLE_STATE_KEYS = Object.freeze([
  "draft",
  "initializing",
  "active",
  "paused",
  "waiting",
  "completing",
  "completed",
  "failed",
  "archived",
] as const);

export const ASS_SESSION_STATE_KEYS = Object.freeze([
  "draft",
  "open",
  "active",
  "waiting",
  "paused",
  "closing",
  "closed",
] as const);

export const ASS_TURN_STATE_KEYS = Object.freeze([
  "pending",
  "active",
  "waiting",
  "completed",
  "failed",
  "placeholder",
] as const);

export const ASS_INTERACTION_STATE_KEYS = Object.freeze([
  "idle",
  "receiving",
  "processing",
  "responding",
  "blocked",
] as const);

export const ASS_WAITING_STATE_KEYS = Object.freeze([
  "awaiting_input",
  "awaiting_response",
  "awaiting_routing",
  "awaiting_external",
] as const);

export const ASS_COMPLETION_STATE_KEYS = Object.freeze([
  "success",
  "partial",
  "cancelled",
  "aborted",
] as const);

export const ASS_PAUSE_RESUME_STATE_KEYS = Object.freeze([
  "none",
  "pause_requested",
  "paused",
  "resume_requested",
  "resuming",
] as const);

export const ASS_STATE_CATEGORY_KEYS = Object.freeze([
  "lifecycle",
  "session",
  "turn",
  "interaction",
  "waiting",
  "completion",
  "pause_resume",
] as const);

export const ASS_FAILURE_METADATA_CODES = Object.freeze([
  "contract_unreachable",
  "validation_failed",
  "timeout_placeholder",
  "user_cancelled",
  "external_blocked",
] as const);

export const ASS_CONVERSATION_STATE_REGISTRY_KEYS = Object.freeze([
  "lifecycle_state_registry",
  "session_state_registry",
  "turn_state_registry",
  "interaction_state_registry",
  "waiting_state_registry",
  "completion_state_registry",
  "pause_resume_state_registry",
  "failure_metadata_registry",
  "transition_contract_registry",
  "state_snapshot_registry",
] as const);

export const ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveAssistantConversationStateArchitecture",
  "validateExecutiveAssistantConversationStateArchitecture",
  "getExecutiveAssistantConversationStateRegistry",
  "getExecutiveAssistantConversationStateManifest",
] as const);

export const ASS_CONVERSATION_STATE_COMPATIBLE_VERSIONS = Object.freeze(["ASS/1", "ASS/2"] as const);

export const ASS_CONVERSATION_STATE_PRINCIPLES = Object.freeze([
  "conversation_state_metadata_only",
  "declarative_transitions_no_execution",
  "immutable_frozen_state_records",
  "future_runtime_layers_consume_without_modification",
  "failure_metadata_reference_only",
  "no_timers_no_async_no_websockets",
] as const);

export const ASS_CONVERSATION_STATE_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "chat_runtime",
  "llm_execution",
  "prompt_execution",
  "response_generation",
  "memory_mutation",
  "recommendations",
  "app_business_logic",
  "state_machine_execution",
  "async_processing",
  "timers",
  "websocket_transport",
] as const);

export const ASS_STATE_DEFINITION_MANDATORY_FIELDS = Object.freeze([
  "stateId",
  "stateKey",
  "stateCategory",
  "label",
  "contractVersion",
  "conversationDependency",
  "terminal",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_TRANSITION_CONTRACT_MANDATORY_FIELDS = Object.freeze([
  "transitionId",
  "transitionKey",
  "stateCategory",
  "fromStateKey",
  "toStateKey",
  "declarativeOnly",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_FAILURE_METADATA_MANDATORY_FIELDS = Object.freeze([
  "failureMetadataId",
  "failureCode",
  "reasonRef",
  "recoverable",
  "retryEligible",
  "contractVersion",
  "registeredAt",
  "readOnly",
] as const);

export const ASS_STATE_SNAPSHOT_MANDATORY_FIELDS = Object.freeze([
  "snapshotId",
  "conversationIdRef",
  "lifecycleStateKey",
  "sessionStateKey",
  "turnStateKey",
  "interactionStateKey",
  "recordedAt",
  "readOnly",
] as const);

export const ASS_LIFECYCLE_TERMINAL_STATE_KEYS = Object.freeze(["archived"] as const);

export const ASS_SESSION_TERMINAL_STATE_KEYS = Object.freeze(["closed"] as const);

export const ASS_TURN_TERMINAL_STATE_KEYS = Object.freeze(["completed", "failed"] as const);

export const ASS_COMPLETION_TERMINAL_STATE_KEYS = Object.freeze(["success", "cancelled", "aborted"] as const);

export const ASS_LIFECYCLE_REQUIRED_PATH = Object.freeze([
  "draft",
  "initializing",
  "active",
  "completing",
  "completed",
] as const);

export const ASS_STATE_LABELS = Object.freeze({
  draft: "Draft Lifecycle",
  initializing: "Initializing Lifecycle",
  active: "Active Lifecycle",
  paused: "Paused Lifecycle",
  waiting: "Waiting Lifecycle",
  completing: "Completing Lifecycle",
  completed: "Completed Lifecycle",
  failed: "Failed Lifecycle",
  archived: "Archived Lifecycle",
  open: "Open Session",
  closing: "Closing Session",
  closed: "Closed Session",
  pending: "Pending Turn",
  placeholder: "Placeholder Turn",
  idle: "Idle Interaction",
  receiving: "Receiving Interaction",
  processing: "Processing Interaction",
  responding: "Responding Interaction",
  blocked: "Blocked Interaction",
  awaiting_input: "Awaiting Input",
  awaiting_response: "Awaiting Response",
  awaiting_routing: "Awaiting Routing",
  awaiting_external: "Awaiting External",
  success: "Success Completion",
  partial: "Partial Completion",
  cancelled: "Cancelled Completion",
  aborted: "Aborted Completion",
  none: "No Pause/Resume",
  pause_requested: "Pause Requested",
  resume_requested: "Resume Requested",
  resuming: "Resuming",
} as const);

export const ASS_DECLARATIVE_TRANSITIONS = Object.freeze([
  Object.freeze({ category: "lifecycle", from: "draft", to: "initializing", key: "lifecycle_start" }),
  Object.freeze({ category: "lifecycle", from: "initializing", to: "active", key: "lifecycle_activate" }),
  Object.freeze({ category: "lifecycle", from: "active", to: "waiting", key: "lifecycle_wait" }),
  Object.freeze({ category: "lifecycle", from: "waiting", to: "active", key: "lifecycle_resume_from_wait" }),
  Object.freeze({ category: "lifecycle", from: "active", to: "paused", key: "lifecycle_pause" }),
  Object.freeze({ category: "lifecycle", from: "paused", to: "active", key: "lifecycle_resume" }),
  Object.freeze({ category: "lifecycle", from: "active", to: "completing", key: "lifecycle_complete_start" }),
  Object.freeze({ category: "lifecycle", from: "completing", to: "completed", key: "lifecycle_complete_finish" }),
  Object.freeze({ category: "lifecycle", from: "active", to: "failed", key: "lifecycle_fail" }),
  Object.freeze({ category: "lifecycle", from: "waiting", to: "failed", key: "lifecycle_fail_from_wait" }),
  Object.freeze({ category: "lifecycle", from: "completed", to: "archived", key: "lifecycle_archive" }),
  Object.freeze({ category: "lifecycle", from: "failed", to: "archived", key: "lifecycle_archive_failed" }),
  Object.freeze({ category: "session", from: "draft", to: "open", key: "session_open" }),
  Object.freeze({ category: "session", from: "open", to: "active", key: "session_activate" }),
  Object.freeze({ category: "session", from: "active", to: "waiting", key: "session_wait" }),
  Object.freeze({ category: "session", from: "waiting", to: "active", key: "session_resume" }),
  Object.freeze({ category: "session", from: "active", to: "paused", key: "session_pause" }),
  Object.freeze({ category: "session", from: "paused", to: "active", key: "session_resume_from_pause" }),
  Object.freeze({ category: "session", from: "active", to: "closing", key: "session_close_start" }),
  Object.freeze({ category: "session", from: "closing", to: "closed", key: "session_close_finish" }),
  Object.freeze({ category: "turn", from: "placeholder", to: "pending", key: "turn_materialize" }),
  Object.freeze({ category: "turn", from: "pending", to: "active", key: "turn_activate" }),
  Object.freeze({ category: "turn", from: "active", to: "waiting", key: "turn_wait" }),
  Object.freeze({ category: "turn", from: "waiting", to: "active", key: "turn_resume" }),
  Object.freeze({ category: "turn", from: "active", to: "completed", key: "turn_complete" }),
  Object.freeze({ category: "turn", from: "active", to: "failed", key: "turn_fail" }),
  Object.freeze({ category: "interaction", from: "idle", to: "receiving", key: "interaction_receive" }),
  Object.freeze({ category: "interaction", from: "receiving", to: "processing", key: "interaction_process" }),
  Object.freeze({ category: "interaction", from: "processing", to: "responding", key: "interaction_respond" }),
  Object.freeze({ category: "interaction", from: "processing", to: "blocked", key: "interaction_block" }),
  Object.freeze({ category: "interaction", from: "blocked", to: "idle", key: "interaction_unblock" }),
  Object.freeze({ category: "interaction", from: "responding", to: "idle", key: "interaction_finish" }),
  Object.freeze({ category: "waiting", from: "awaiting_input", to: "awaiting_response", key: "waiting_input_received" }),
  Object.freeze({ category: "waiting", from: "awaiting_response", to: "awaiting_routing", key: "waiting_response_ready" }),
  Object.freeze({ category: "waiting", from: "awaiting_routing", to: "awaiting_external", key: "waiting_route_external" }),
  Object.freeze({ category: "waiting", from: "awaiting_external", to: "awaiting_input", key: "waiting_cycle_reset" }),
  Object.freeze({ category: "completion", from: "partial", to: "success", key: "completion_finalize" }),
  Object.freeze({ category: "pause_resume", from: "none", to: "pause_requested", key: "pause_request" }),
  Object.freeze({ category: "pause_resume", from: "pause_requested", to: "paused", key: "pause_apply" }),
  Object.freeze({ category: "pause_resume", from: "paused", to: "resume_requested", key: "resume_request" }),
  Object.freeze({ category: "pause_resume", from: "resume_requested", to: "resuming", key: "resume_apply" }),
  Object.freeze({ category: "pause_resume", from: "resuming", to: "none", key: "resume_complete" }),
] as const);
