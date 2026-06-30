/**
 * LLM-9 — Public Audit & Observability exports and facade.
 */

import {
  LLM_AUDIT_CONTRACT_VERSION,
  LLM_AUDIT_EVENT_TYPE_KEYS,
  LLM_AUDIT_PLATFORM_ID,
  LLM_AUDIT_PLATFORM_NAME,
  LLM_AUDIT_PRINCIPLES,
  LLM_AUDIT_PUBLIC_API_REGISTRY,
  LLM_AUDIT_ROUTER_DEPENDENCY,
} from "./llmAuditContracts.ts";
import { aggregateLlmAuditEvents } from "./llmAuditAggregation.ts";
import { getLlmAuditManifest } from "./llmAuditManifest.ts";
import { buildLlmTraceRecord } from "./llmAuditTrace.ts";
import {
  ensureLlmAuditDependenciesReady,
  getLlmAuditRegistry,
  lookupLlmAuditEvent,
  recordLlmAuditEvent,
  resetLlmAuditRegistryForTests,
} from "./llmAuditRegistry.ts";
import type {
  LlmAuditEvent,
  LlmAuditObservabilityLayerState,
  LlmAuditPlatformManifest,
  LlmAuditTraceRecord,
} from "./llmAuditTypes.ts";
import { validateLlmAuditEvent, validateLlmTraceRecord } from "./llmAuditValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmAuditObservabilityLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmAuditRegistryForTests();
}

export function getLlmAuditObservabilityLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmAuditObservabilityLayerState {
  return Object.freeze({
    contractVersion: LLM_AUDIT_CONTRACT_VERSION,
    routerDependency: LLM_AUDIT_ROUTER_DEPENDENCY,
    initialized: layerInitialized,
    registry: getLlmAuditRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmAuditObservabilityLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmAuditObservabilityLayerState | null; readOnly: true }> {
  if (!ensureLlmAuditDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/8 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Audit & Observability layer created.",
    data: getLlmAuditObservabilityLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmAuditPlatformManifest(): LlmAuditPlatformManifest {
  return Object.freeze({
    manifestId: "llm-audit-observability-manifest",
    platformId: LLM_AUDIT_PLATFORM_ID,
    version: LLM_AUDIT_CONTRACT_VERSION,
    title: LLM_AUDIT_PLATFORM_NAME,
    goal: "Deterministic audit events, trace records, and observability manifests without execution or control.",
    publicApis: LLM_AUDIT_PUBLIC_API_REGISTRY,
    eventTypes: LLM_AUDIT_EVENT_TYPE_KEYS,
    readOnly: true as const,
  });
}

export function buildLlmTraceRecordPublic(
  traceId: string,
  requestId: string,
  events?: readonly LlmAuditEvent[]
): LlmAuditTraceRecord | null {
  const sourceEvents = events ?? getLlmAuditRegistry().events;
  return buildLlmTraceRecord(traceId, requestId, sourceEvents);
}

export {
  recordLlmAuditEvent,
  buildLlmTraceRecordPublic as buildLlmTraceRecord,
  validateLlmAuditEvent,
  validateLlmTraceRecord,
  aggregateLlmAuditEvents,
  getLlmAuditManifest,
  getLlmAuditRegistry,
  lookupLlmAuditEvent,
  LLM_AUDIT_PUBLIC_API_REGISTRY,
  LLM_AUDIT_PRINCIPLES,
};

export const AuditObservabilityPlatform = Object.freeze({
  recordLlmAuditEvent,
  buildLlmTraceRecord: buildLlmTraceRecordPublic,
  validateLlmAuditEvent,
  validateLlmTraceRecord,
  aggregateLlmAuditEvents,
  getLlmAuditManifest,
  getLlmAuditRegistry,
  buildLlmAuditObservabilityLayer,
  getLlmAuditPlatformManifest,
  getLlmAuditObservabilityLayerState,
  resetLlmAuditObservabilityLayerForTests,
  version: LLM_AUDIT_CONTRACT_VERSION,
});
