/**
 * LLM-9 — Audit event and trace validation.
 */

import { isLlmProviderKey } from "./llmProviderValidation.ts";
import {
  LLM_AUDIT_COMPATIBLE_VERSIONS,
  LLM_AUDIT_CONTRACT_VERSION,
  LLM_AUDIT_MANDATORY_EVENT_FIELDS,
  LLM_AUDIT_ROUTER_DEPENDENCY,
  LLM_AUDIT_SEVERITY_KEYS,
  LLM_AUDIT_TRACE_STATUS_KEYS,
} from "./llmAuditContracts.ts";
import { isLlmAuditEventType } from "./llmAuditEvents.ts";
import { validateTraceEventOrdering } from "./llmAuditTrace.ts";
import type {
  LlmAuditAggregationSummary,
  LlmAuditEvent,
  LlmAuditTraceRecord,
  LlmAuditValidationIssue,
  LlmAuditValidationReport,
} from "./llmAuditTypes.ts";

function issue(code: string, message: string, field?: string): LlmAuditValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmAuditValidationIssue[]): LlmAuditValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isLlmAuditSeverity(value: string): value is (typeof LLM_AUDIT_SEVERITY_KEYS)[number] {
  return (LLM_AUDIT_SEVERITY_KEYS as readonly string[]).includes(value);
}

export function isLlmAuditTraceStatus(value: string): value is (typeof LLM_AUDIT_TRACE_STATUS_KEYS)[number] {
  return (LLM_AUDIT_TRACE_STATUS_KEYS as readonly string[]).includes(value);
}

export function validateLlmAuditEvent(event: LlmAuditEvent): LlmAuditValidationReport {
  const issues: LlmAuditValidationIssue[] = [];
  for (const field of LLM_AUDIT_MANDATORY_EVENT_FIELDS) {
    if (!(field in event)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!isLlmAuditEventType(event.eventType)) {
    issues.push(issue("invalid_event_type", "Event type is invalid.", "eventType"));
  }
  if (!isLlmAuditSeverity(event.severity)) {
    issues.push(issue("invalid_severity", "Severity is invalid.", "severity"));
  }
  if (!event.traceId.trim() || !event.correlationId.trim()) {
    issues.push(issue("missing_trace_correlation", "Trace ID and correlation ID are required."));
  }
  if (event.providerKey && !isLlmProviderKey(event.providerKey)) {
    issues.push(issue("invalid_provider_key", "Provider key is invalid.", "providerKey"));
  }
  return report(issues);
}

export function validateLlmTraceRecord(
  trace: LlmAuditTraceRecord,
  events: readonly LlmAuditEvent[]
): LlmAuditValidationReport {
  const issues: LlmAuditValidationIssue[] = [];
  if (!trace.traceId.trim() || !trace.correlationId.trim() || !trace.requestId.trim()) {
    issues.push(issue("missing_trace_identifiers", "Trace identifiers are required."));
  }
  if (!isLlmAuditTraceStatus(trace.status)) {
    issues.push(issue("invalid_trace_status", "Trace status is invalid.", "status"));
  }
  if (trace.eventIds.length === 0) {
    issues.push(issue("empty_trace_events", "Trace must include event IDs."));
  }
  const traceEvents = events.filter((event) => trace.eventIds.includes(event.eventId));
  if (traceEvents.length !== trace.eventIds.length) {
    issues.push(issue("missing_trace_events", "Trace references missing events."));
  }
  for (const event of traceEvents) {
    if (event.traceId !== trace.traceId) {
      issues.push(issue("trace_id_mismatch", "Event trace ID does not match trace record."));
    }
    if (event.correlationId !== trace.correlationId) {
      issues.push(issue("correlation_mismatch", "Event correlation ID does not match trace record."));
    }
    if (event.requestId !== trace.requestId) {
      issues.push(issue("request_id_mismatch", "Event request ID does not match trace record."));
    }
  }
  for (const message of validateTraceEventOrdering(traceEvents)) {
    issues.push(issue("invalid_event_order", message));
  }
  return report(issues);
}

export function validateDuplicateAuditEventIds(existingIds: readonly string[], eventId: string): LlmAuditValidationReport {
  if (existingIds.includes(eventId)) {
    return report([issue("duplicate_event_id", "Duplicate audit event ID.")]);
  }
  return report([]);
}

export function validateAuditVersionCompatibility(): LlmAuditValidationReport {
  if (!(LLM_AUDIT_COMPATIBLE_VERSIONS as readonly string[]).includes(LLM_AUDIT_ROUTER_DEPENDENCY)) {
    return report([issue("router_incompatible", "Audit layer is incompatible with router dependency.")]);
  }
  return report([]);
}

export function validateAggregationConsistency(
  events: readonly LlmAuditEvent[],
  summary: LlmAuditAggregationSummary
): LlmAuditValidationReport {
  const matching = events.filter((event) => {
    switch (summary.scope) {
      case "event_type":
        return event.eventType === summary.scopeKey;
      case "severity":
        return event.severity === summary.scopeKey;
      case "user":
        return event.userId === summary.scopeKey;
      case "workspace":
        return event.workspaceId === summary.scopeKey;
      case "organization":
        return event.organizationId === summary.scopeKey;
      case "provider":
        return event.providerKey === summary.scopeKey;
      case "trace":
        return event.traceId === summary.scopeKey;
      default:
        return false;
    }
  });
  if (matching.length !== summary.eventCount) {
    return report([issue("aggregation_count_mismatch", "Aggregation event count is inconsistent.")]);
  }
  return report([]);
}

export function getDefaultAuditCompatibility(): readonly string[] {
  return Object.freeze([...LLM_AUDIT_COMPATIBLE_VERSIONS, LLM_AUDIT_CONTRACT_VERSION]);
}
