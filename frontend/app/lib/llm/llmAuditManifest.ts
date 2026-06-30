/**
 * LLM-9 — Observability manifest generation.
 */

import { LLM_AUDIT_CONTRACT_VERSION } from "./llmAuditContracts.ts";
import { aggregateLlmAuditEvents } from "./llmAuditAggregation.ts";
import { getDefaultAuditCompatibility, validateAuditVersionCompatibility } from "./llmAuditValidation.ts";
import type { LlmAuditEvent, LlmAuditManifest, LlmAuditTraceRecord } from "./llmAuditTypes.ts";

export function getLlmAuditManifest(
  events: readonly LlmAuditEvent[],
  traces: readonly LlmAuditTraceRecord[]
): LlmAuditManifest {
  const versionValidation = validateAuditVersionCompatibility();
  return Object.freeze({
    manifestId: `audit-manifest-${events.length}`,
    auditVersion: LLM_AUDIT_CONTRACT_VERSION,
    totalEvents: events.length,
    totalTraces: traces.length,
    aggregationSummary: aggregateLlmAuditEvents(events),
    validationResult: versionValidation.valid ? "valid" : "invalid",
    compatibility: getDefaultAuditCompatibility(),
    readOnly: true as const,
  });
}
