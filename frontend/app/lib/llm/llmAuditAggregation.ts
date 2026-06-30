/**
 * LLM-9 — Audit event aggregation.
 */

import { LLM_AUDIT_AGGREGATION_SCOPE_KEYS } from "./llmAuditContracts.ts";
import type {
  LlmAuditAggregationScopeKey,
  LlmAuditAggregationSummary,
  LlmAuditEvent,
} from "./llmAuditTypes.ts";

export function isLlmAuditAggregationScope(value: string): value is LlmAuditAggregationScopeKey {
  return (LLM_AUDIT_AGGREGATION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function resolveAuditAggregationScopeKey(
  event: LlmAuditEvent,
  scope: LlmAuditAggregationScopeKey
): string {
  switch (scope) {
    case "event_type":
      return event.eventType;
    case "severity":
      return event.severity;
    case "user":
      return event.userId;
    case "workspace":
      return event.workspaceId;
    case "organization":
      return event.organizationId;
    case "provider":
      return event.providerKey ?? "";
    case "trace":
      return event.traceId;
    default:
      return "";
  }
}

export function aggregateLlmAuditEventsByScope(
  events: readonly LlmAuditEvent[],
  scope: LlmAuditAggregationScopeKey,
  scopeKey: string
): LlmAuditAggregationSummary {
  const count = events.filter((event) => resolveAuditAggregationScopeKey(event, scope) === scopeKey).length;
  return Object.freeze({
    scope,
    scopeKey,
    eventCount: count,
    readOnly: true as const,
  });
}

export function aggregateLlmAuditEvents(events: readonly LlmAuditEvent[]): readonly LlmAuditAggregationSummary[] {
  const summaries = new Map<string, LlmAuditAggregationSummary>();
  for (const scope of LLM_AUDIT_AGGREGATION_SCOPE_KEYS) {
    const keys = new Set(
      events
        .map((event) => resolveAuditAggregationScopeKey(event, scope))
        .filter((key) => key.length > 0)
    );
    for (const scopeKey of keys) {
      const summary = aggregateLlmAuditEventsByScope(events, scope, scopeKey);
      if (summary.eventCount > 0) {
        summaries.set(`${scope}:${scopeKey}`, summary);
      }
    }
  }
  return Object.freeze([...summaries.values()].sort((left, right) =>
    `${left.scope}:${left.scopeKey}`.localeCompare(`${right.scope}:${right.scopeKey}`)
  ));
}

export function getAllAuditAggregationScopeKeys(): readonly LlmAuditAggregationScopeKey[] {
  return LLM_AUDIT_AGGREGATION_SCOPE_KEYS;
}
