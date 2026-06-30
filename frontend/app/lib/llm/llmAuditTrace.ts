/**
 * LLM-9 — Trace record builders.
 */

import { LLM_AUDIT_LATENCY_PLACEHOLDER_MS } from "./llmAuditContracts.ts";
import { compareAuditEventsByTimestamp, sortAuditEvents } from "./llmAuditEvents.ts";
import type { LlmAuditEvent, LlmAuditTraceRecord, LlmAuditTraceStatusKey } from "./llmAuditTypes.ts";

export function resolveTraceStatus(events: readonly LlmAuditEvent[]): LlmAuditTraceStatusKey {
  if (events.some((event) => event.eventType === "request_failed" || event.eventType === "error_recorded")) {
    return "failed";
  }
  if (events.some((event) => event.eventType === "request_completed")) {
    return "completed";
  }
  if (events.length > 1) {
    return "in_progress";
  }
  return "started";
}

export function resolveTraceErrorSummary(events: readonly LlmAuditEvent[]): string | null {
  const errorEvent = events.find((event) => event.eventType === "error_recorded" || event.eventType === "request_failed");
  return errorEvent?.metadata.errorSummary ?? errorEvent?.metadata.message ?? null;
}

export function buildLlmTraceRecord(
  traceId: string,
  requestId: string,
  events: readonly LlmAuditEvent[]
): LlmAuditTraceRecord | null {
  const traceEvents = events.filter((event) => event.traceId === traceId && event.requestId === requestId);
  if (traceEvents.length === 0) {
    return null;
  }
  const sorted = sortAuditEvents(traceEvents);
  const correlationId = sorted[0].correlationId;
  const startedAt = sorted[0].timestamp;
  const status = resolveTraceStatus(sorted);
  const completedAt = status === "completed" || status === "failed" ? sorted[sorted.length - 1].timestamp : null;
  return Object.freeze({
    traceId,
    correlationId,
    requestId,
    eventIds: Object.freeze(sorted.map((event) => event.eventId)),
    status,
    startedAt,
    completedAt,
    durationMs: LLM_AUDIT_LATENCY_PLACEHOLDER_MS,
    errorSummary: resolveTraceErrorSummary(sorted),
    readOnly: true as const,
  });
}

export function validateTraceEventOrdering(events: readonly LlmAuditEvent[]): readonly string[] {
  const issues: string[] = [];
  const sorted = sortAuditEvents(events);
  for (let index = 1; index < sorted.length; index += 1) {
    if (compareAuditEventsByTimestamp(sorted[index - 1], sorted[index]) > 0) {
      issues.push("Trace events are not in deterministic order.");
      break;
    }
  }
  return Object.freeze(issues);
}
