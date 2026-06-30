/**
 * LLM-9 — Audit & Observability domain types.
 */

import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type {
  LLM_AUDIT_AGGREGATION_SCOPE_KEYS,
  LLM_AUDIT_CONTRACT_VERSION,
  LLM_AUDIT_EVENT_TYPE_KEYS,
  LLM_AUDIT_SEVERITY_KEYS,
  LLM_AUDIT_TRACE_STATUS_KEYS,
} from "./llmAuditContracts.ts";

export type LlmAuditEventTypeKey = (typeof LLM_AUDIT_EVENT_TYPE_KEYS)[number];
export type LlmAuditSeverityKey = (typeof LLM_AUDIT_SEVERITY_KEYS)[number];
export type LlmAuditTraceStatusKey = (typeof LLM_AUDIT_TRACE_STATUS_KEYS)[number];
export type LlmAuditAggregationScopeKey = (typeof LLM_AUDIT_AGGREGATION_SCOPE_KEYS)[number];

export type LlmAuditEvent = Readonly<{
  eventId: string;
  eventType: LlmAuditEventTypeKey;
  requestId: string;
  responseId?: string;
  traceId: string;
  correlationId: string;
  providerKey?: LlmProviderKey;
  modelKey?: string;
  userId: string;
  workspaceId: string;
  organizationId: string;
  severity: LlmAuditSeverityKey;
  timestamp: string;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type LlmAuditEventInput = Readonly<{
  eventType: LlmAuditEventTypeKey;
  requestId: string;
  responseId?: string;
  traceId: string;
  correlationId: string;
  providerKey?: LlmProviderKey;
  modelKey?: string;
  userId: string;
  workspaceId: string;
  organizationId: string;
  severity?: LlmAuditSeverityKey;
  metadata?: Readonly<Record<string, string>>;
}>;

export type LlmAuditTraceRecord = Readonly<{
  traceId: string;
  correlationId: string;
  requestId: string;
  eventIds: readonly string[];
  status: LlmAuditTraceStatusKey;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  errorSummary: string | null;
  readOnly: true;
}>;

export type LlmAuditAggregationSummary = Readonly<{
  scope: LlmAuditAggregationScopeKey;
  scopeKey: string;
  eventCount: number;
  readOnly: true;
}>;

export type LlmAuditRegistry = Readonly<{
  events: readonly LlmAuditEvent[];
  eventCount: number;
  traces: readonly LlmAuditTraceRecord[];
  traceCount: number;
  aggregations: readonly LlmAuditAggregationSummary[];
  readOnly: true;
}>;

export type LlmAuditManifest = Readonly<{
  manifestId: string;
  auditVersion: typeof LLM_AUDIT_CONTRACT_VERSION;
  totalEvents: number;
  totalTraces: number;
  aggregationSummary: readonly LlmAuditAggregationSummary[];
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type LlmAuditValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type LlmAuditValidationReport = Readonly<{
  valid: boolean;
  issues: readonly LlmAuditValidationIssue[];
  readOnly: true;
}>;

export type LlmAuditEventResult = Readonly<{
  success: boolean;
  reason: string;
  event: LlmAuditEvent | null;
  readOnly: true;
}>;

export type LlmAuditObservabilityLayerState = Readonly<{
  contractVersion: typeof LLM_AUDIT_CONTRACT_VERSION;
  routerDependency: typeof import("./llmAuditContracts.ts").LLM_AUDIT_ROUTER_DEPENDENCY;
  initialized: boolean;
  registry: LlmAuditRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type LlmAuditPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./llmAuditContracts.ts").LLM_AUDIT_PLATFORM_ID;
  version: typeof LLM_AUDIT_CONTRACT_VERSION;
  title: typeof import("./llmAuditContracts.ts").LLM_AUDIT_PLATFORM_NAME;
  goal: string;
  publicApis: readonly string[];
  eventTypes: readonly string[];
  readOnly: true;
}>;
