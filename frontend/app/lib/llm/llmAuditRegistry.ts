/**
 * LLM-9 — Audit registry (in-memory, no persistence).
 */

import { buildLlmModelRouterLayer } from "./llmRouterExports.ts";
import { LLM_AUDIT_DEFAULT_LIMITS } from "./llmAuditContracts.ts";
import { buildLlmAuditEvent } from "./llmAuditEvents.ts";
import { buildLlmTraceRecord } from "./llmAuditTrace.ts";
import { aggregateLlmAuditEvents } from "./llmAuditAggregation.ts";
import type {
  LlmAuditEvent,
  LlmAuditEventInput,
  LlmAuditEventResult,
  LlmAuditRegistry,
  LlmAuditTraceRecord,
} from "./llmAuditTypes.ts";
import {
  validateDuplicateAuditEventIds,
  validateLlmAuditEvent,
  validateLlmTraceRecord,
} from "./llmAuditValidation.ts";

const eventRegistry = new Map<string, LlmAuditEvent>();
const traceRegistry = new Map<string, LlmAuditTraceRecord>();

function createEventResult(success: boolean, reason: string, event: LlmAuditEvent | null): LlmAuditEventResult {
  return Object.freeze({ success, reason, event, readOnly: true as const });
}

export function resetLlmAuditRegistryForTests(): void {
  eventRegistry.clear();
  traceRegistry.clear();
}

export function getLlmAuditRegistry(): LlmAuditRegistry {
  const events = Object.freeze([...eventRegistry.values()].sort((left, right) =>
    left.timestamp.localeCompare(right.timestamp) || left.eventId.localeCompare(right.eventId)
  ));
  const traces = Object.freeze([...traceRegistry.values()]);
  return Object.freeze({
    events,
    eventCount: events.length,
    traces,
    traceCount: traces.length,
    aggregations: aggregateLlmAuditEvents(events),
    readOnly: true as const,
  });
}

export function recordLlmAuditEvent(
  input: LlmAuditEventInput,
  eventId: string,
  timestamp: string = new Date(0).toISOString()
): LlmAuditEventResult {
  const duplicateValidation = validateDuplicateAuditEventIds([...eventRegistry.keys()], eventId);
  if (!duplicateValidation.valid) {
    return createEventResult(false, duplicateValidation.issues[0]?.message ?? "Duplicate event.", null);
  }
  if (eventRegistry.size >= LLM_AUDIT_DEFAULT_LIMITS.maxEvents && !eventRegistry.has(eventId)) {
    return createEventResult(false, "Audit event registry limit reached.", null);
  }
  const event = buildLlmAuditEvent(input, eventId, timestamp);
  const validation = validateLlmAuditEvent(event);
  if (!validation.valid) {
    return createEventResult(false, validation.issues[0]?.message ?? "Audit event validation failed.", null);
  }
  eventRegistry.set(eventId, event);
  const trace = buildLlmTraceRecord(event.traceId, event.requestId, getLlmAuditRegistry().events);
  if (trace) {
    const traceValidation = validateLlmTraceRecord(trace, getLlmAuditRegistry().events);
    if (traceValidation.valid && traceRegistry.size < LLM_AUDIT_DEFAULT_LIMITS.maxTraces) {
      traceRegistry.set(`${event.traceId}:${event.requestId}`, trace);
    }
  }
  return createEventResult(true, "Audit event recorded.", event);
}

export function buildLlmTraceRecordFromRegistry(
  traceId: string,
  requestId: string
): LlmAuditTraceRecord | null {
  return buildLlmTraceRecord(traceId, requestId, getLlmAuditRegistry().events);
}

export function lookupLlmAuditEvent(eventId: string): LlmAuditEvent | null {
  return eventRegistry.get(eventId) ?? null;
}

export function ensureLlmAuditDependenciesReady(timestamp: string): boolean {
  const routerLayer = buildLlmModelRouterLayer(timestamp);
  return routerLayer.success;
}
