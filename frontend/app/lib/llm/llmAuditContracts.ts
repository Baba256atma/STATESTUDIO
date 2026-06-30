/**
 * LLM-9 — Audit & Observability contracts and constants.
 */

export const LLM_AUDIT_CONTRACT_VERSION = "LLM/9" as const;
export const LLM_AUDIT_PLATFORM_ID = "llm-audit-observability" as const;
export const LLM_AUDIT_PLATFORM_NAME = "Audit & Observability" as const;
export const LLM_AUDIT_ROUTER_DEPENDENCY = "LLM/8" as const;

export const LLM_AUDIT_TAGS = Object.freeze([
  "[LLM_9]",
  "[AUDIT_OBSERVABILITY]",
  "[DETERMINISTIC]",
  "[OBSERVATION_ONLY]",
  "[NO_EXECUTION]",
  "[NO_PROVIDER_CALLS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LLM_AUDIT_EVENT_TYPE_KEYS = Object.freeze([
  "request_created",
  "prompt_built",
  "context_built",
  "route_selected",
  "provider_request_started",
  "provider_response_received",
  "token_usage_recorded",
  "cost_estimated",
  "error_recorded",
  "request_completed",
  "request_failed",
] as const);

export const LLM_AUDIT_SEVERITY_KEYS = Object.freeze([
  "info",
  "warning",
  "error",
  "critical",
] as const);

export const LLM_AUDIT_TRACE_STATUS_KEYS = Object.freeze([
  "started",
  "in_progress",
  "completed",
  "failed",
] as const);

export const LLM_AUDIT_AGGREGATION_SCOPE_KEYS = Object.freeze([
  "event_type",
  "severity",
  "user",
  "workspace",
  "organization",
  "provider",
  "trace",
] as const);

export const LLM_AUDIT_PUBLIC_API_REGISTRY = Object.freeze([
  "recordLlmAuditEvent",
  "buildLlmTraceRecord",
  "validateLlmAuditEvent",
  "validateLlmTraceRecord",
  "aggregateLlmAuditEvents",
  "getLlmAuditManifest",
  "getLlmAuditRegistry",
  "buildLlmAuditObservabilityLayer",
] as const);

export const LLM_AUDIT_COMPATIBLE_VERSIONS = Object.freeze([
  "LLM/1",
  "LLM/2",
  "LLM/3",
  "LLM/4",
  "LLM/5",
  "LLM/6",
  "LLM/7",
  "LLM/8",
] as const);

export const LLM_AUDIT_PRINCIPLES = Object.freeze([
  "audit_observes_only_never_controls",
  "no_provider_calls",
  "no_billing_no_security_enforcement",
  "no_routing_decisions",
  "deterministic_event_recording",
  "trace_correlation_consistency",
  "informational_latency_placeholders_only",
] as const);

export const LLM_AUDIT_MANDATORY_EVENT_FIELDS = Object.freeze([
  "eventId",
  "eventType",
  "requestId",
  "traceId",
  "correlationId",
  "userId",
  "workspaceId",
  "organizationId",
  "severity",
  "timestamp",
  "readOnly",
] as const);

export const LLM_AUDIT_DEFAULT_LIMITS = Object.freeze({
  maxEvents: 8192,
  maxTraces: 4096,
} as const);

export const LLM_AUDIT_EVENT_TYPE_SEVERITY = Object.freeze({
  request_created: "info",
  prompt_built: "info",
  context_built: "info",
  route_selected: "info",
  provider_request_started: "info",
  provider_response_received: "info",
  token_usage_recorded: "info",
  cost_estimated: "info",
  error_recorded: "error",
  request_completed: "info",
  request_failed: "error",
} as const);

export const LLM_AUDIT_MUST_NOT_OWN = Object.freeze([
  "provider_execution",
  "billing",
  "security_enforcement",
  "routing_decisions",
  "request_modification",
  "live_provider_health",
] as const);

export const LLM_AUDIT_LATENCY_PLACEHOLDER_MS = null as null;
