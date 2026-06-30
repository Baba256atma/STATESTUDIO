/**
 * LLM-9 — Audit event builders and recording helpers.
 */

import {
  LLM_AUDIT_CONTRACT_VERSION,
  LLM_AUDIT_EVENT_TYPE_SEVERITY,
} from "./llmAuditContracts.ts";
import type { LlmAuditEvent, LlmAuditEventInput, LlmAuditEventTypeKey, LlmAuditSeverityKey } from "./llmAuditTypes.ts";

export function isLlmAuditEventType(value: string): value is LlmAuditEventTypeKey {
  return value in LLM_AUDIT_EVENT_TYPE_SEVERITY;
}

export function resolveDefaultEventSeverity(eventType: LlmAuditEventTypeKey): LlmAuditSeverityKey {
  return LLM_AUDIT_EVENT_TYPE_SEVERITY[eventType];
}

export function buildLlmAuditEvent(
  input: LlmAuditEventInput,
  eventId: string,
  timestamp: string
): LlmAuditEvent {
  return Object.freeze({
    eventId,
    eventType: input.eventType,
    requestId: input.requestId,
    responseId: input.responseId,
    traceId: input.traceId,
    correlationId: input.correlationId,
    providerKey: input.providerKey,
    modelKey: input.modelKey,
    userId: input.userId,
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    severity: input.severity ?? resolveDefaultEventSeverity(input.eventType),
    timestamp,
    metadata: Object.freeze({
      contractVersion: LLM_AUDIT_CONTRACT_VERSION,
      ...(input.metadata ?? {}),
    }),
    readOnly: true as const,
  });
}

export function getAllLlmAuditEventTypes(): readonly LlmAuditEventTypeKey[] {
  return Object.freeze(Object.keys(LLM_AUDIT_EVENT_TYPE_SEVERITY) as LlmAuditEventTypeKey[]);
}

export function compareAuditEventsByTimestamp(left: LlmAuditEvent, right: LlmAuditEvent): number {
  const timeCompare = left.timestamp.localeCompare(right.timestamp);
  if (timeCompare !== 0) {
    return timeCompare;
  }
  return left.eventId.localeCompare(right.eventId);
}

export function sortAuditEvents(events: readonly LlmAuditEvent[]): readonly LlmAuditEvent[] {
  return Object.freeze([...events].sort(compareAuditEventsByTimestamp));
}
