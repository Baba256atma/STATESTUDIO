import assert from "node:assert/strict";
import test from "node:test";

import {
  LLM_AUDIT_CONTRACT_VERSION,
  LLM_AUDIT_EVENT_TYPE_KEYS,
  LLM_AUDIT_PRINCIPLES,
  LLM_AUDIT_PUBLIC_API_REGISTRY,
} from "./llmAuditContracts.ts";
import { aggregateLlmAuditEvents } from "./llmAuditAggregation.ts";
import {
  AuditObservabilityPlatform,
  buildLlmAuditObservabilityLayer,
  buildLlmTraceRecord,
  getLlmAuditManifest,
  getLlmAuditObservabilityLayerState,
  getLlmAuditPlatformManifest,
  getLlmAuditRegistry,
  recordLlmAuditEvent,
  resetLlmAuditObservabilityLayerForTests,
  validateLlmAuditEvent,
  validateLlmTraceRecord,
} from "./llmAuditExports.ts";
import { sortAuditEvents } from "./llmAuditEvents.ts";
import { validateAggregationConsistency } from "./llmAuditValidation.ts";
import { LLM_COST_CONTRACT_VERSION } from "./llmCostContracts.ts";
import { resetLlmCostEstimatorLayerForTests } from "./llmCostExports.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import { LLM_ROUTER_CONTRACT_VERSION } from "./llmRouterContracts.ts";
import { resetLlmModelRouterLayerForTests } from "./llmRouterExports.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION } from "./llmTokenContracts.ts";
import { resetLlmTokenMeterLayerForTests } from "./llmTokenExports.ts";
import { resetLlmContextBuilderLayerForTests } from "./llmContextExports.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function baseEventInput(eventType: (typeof LLM_AUDIT_EVENT_TYPE_KEYS)[number], timestampOffset = 0) {
  return Object.freeze({
    eventType,
    requestId: "req-audit-001",
    traceId: "trace-audit-001",
    correlationId: "corr-audit-001",
    userId: "user-1",
    workspaceId: "ws-1",
    organizationId: "org-1",
    providerKey: "gpt" as const,
    modelKey: "gpt-4o-mini",
    metadata: Object.freeze({ offset: String(timestampOffset) }),
  });
}

test.beforeEach(() => {
  resetLlmAuditObservabilityLayerForTests();
  resetLlmModelRouterLayerForTests();
  resetLlmCostEstimatorLayerForTests();
  resetLlmTokenMeterLayerForTests();
  resetLlmContextBuilderLayerForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/9 audit observability vocabulary", () => {
  assert.equal(LLM_AUDIT_CONTRACT_VERSION, "LLM/9");
  assert.equal(LLM_AUDIT_EVENT_TYPE_KEYS.length, 11);
  assert.equal(LLM_AUDIT_PUBLIC_API_REGISTRY.length, 8);
});

test("creates audit events with required fields", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  const result = recordLlmAuditEvent(baseEventInput("request_created"), "evt-001", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.event?.eventType, "request_created");
  assert.equal(result.event?.severity, "info");
  assert.equal(validateLlmAuditEvent(result.event!).valid, true);
});

test("builds trace records with ordered event IDs", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  recordLlmAuditEvent(baseEventInput("request_created"), "evt-001", FIXED_TIME);
  recordLlmAuditEvent(baseEventInput("prompt_built"), "evt-002", "2026-01-01T00:00:01.000Z");
  recordLlmAuditEvent(baseEventInput("route_selected"), "evt-003", "2026-01-01T00:00:02.000Z");
  recordLlmAuditEvent(baseEventInput("request_completed"), "evt-004", "2026-01-01T00:00:03.000Z");
  const trace = buildLlmTraceRecord("trace-audit-001", "req-audit-001");
  assert.ok(trace);
  assert.equal(trace?.status, "completed");
  assert.equal(trace?.eventIds.length, 4);
  assert.equal(trace?.durationMs, null);
  assert.equal(validateLlmTraceRecord(trace!, getLlmAuditRegistry().events).valid, true);
});

test("detects duplicate event IDs", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  assert.equal(recordLlmAuditEvent(baseEventInput("request_created"), "evt-dup", FIXED_TIME).success, true);
  assert.equal(recordLlmAuditEvent(baseEventInput("prompt_built"), "evt-dup", FIXED_TIME).success, false);
});

test("validates severity and correlation consistency", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  const errorEvent = recordLlmAuditEvent(
    Object.freeze({ ...baseEventInput("error_recorded"), severity: "error" as const, metadata: Object.freeze({ errorSummary: "Provider timeout" }) }),
    "evt-error",
    FIXED_TIME
  );
  assert.equal(errorEvent.event?.severity, "error");
  recordLlmAuditEvent(
    Object.freeze({ ...baseEventInput("request_failed"), metadata: Object.freeze({ message: "Request failed" }) }),
    "evt-failed",
    "2026-01-01T00:00:01.000Z"
  );
  const failedTrace = buildLlmTraceRecord("trace-audit-001", "req-audit-001");
  assert.equal(failedTrace?.status, "failed");
  assert.ok(failedTrace?.errorSummary);
});

test("aggregates audit events and generates manifest", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  recordLlmAuditEvent(baseEventInput("request_created"), "evt-a", FIXED_TIME);
  recordLlmAuditEvent(baseEventInput("token_usage_recorded"), "evt-b", "2026-01-01T00:00:01.000Z");
  recordLlmAuditEvent(baseEventInput("cost_estimated"), "evt-c", "2026-01-01T00:00:02.000Z");
  const registry = getLlmAuditRegistry();
  const aggregations = aggregateLlmAuditEvents(registry.events);
  assert.ok(aggregations.some((entry) => entry.scope === "event_type" && entry.scopeKey === "request_created"));
  assert.ok(aggregations.some((entry) => entry.scope === "trace" && entry.scopeKey === "trace-audit-001"));
  const eventTypeSummary = aggregations.find((entry) => entry.scope === "event_type" && entry.scopeKey === "token_usage_recorded")!;
  assert.equal(validateAggregationConsistency(registry.events, eventTypeSummary).valid, true);
  const manifest = getLlmAuditManifest(registry.events, registry.traces);
  assert.equal(manifest.auditVersion, "LLM/9");
  assert.equal(manifest.validationResult, "valid");
});

test("preserves deterministic event ordering", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  recordLlmAuditEvent(baseEventInput("route_selected"), "evt-z", "2026-01-01T00:00:01.000Z");
  recordLlmAuditEvent(baseEventInput("request_created"), "evt-a", FIXED_TIME);
  const sorted = sortAuditEvents(getLlmAuditRegistry().events);
  assert.equal(sorted[0].eventId, "evt-a");
  assert.equal(sorted[1].eventId, "evt-z");
});

test("exposes stable public exports", () => {
  buildLlmAuditObservabilityLayer(FIXED_TIME);
  const manifest = getLlmAuditPlatformManifest();
  assert.equal(manifest.version, "LLM/9");
  assert.deepEqual(manifest.publicApis, LLM_AUDIT_PUBLIC_API_REGISTRY);
  assert.equal(typeof AuditObservabilityPlatform.recordLlmAuditEvent, "function");
  assert.equal(getLlmAuditObservabilityLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_AUDIT_PRINCIPLES.includes("audit_observes_only_never_controls"));
});

test("maintains LLM-1 through LLM-8 compatibility", () => {
  const layer = buildLlmAuditObservabilityLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_TOKEN_CONTRACT_VERSION, "LLM/6");
  assert.equal(LLM_COST_CONTRACT_VERSION, "LLM/7");
  assert.equal(LLM_ROUTER_CONTRACT_VERSION, "LLM/8");
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmAuditContracts.ts",
    "llmAuditTypes.ts",
    "llmAuditEvents.ts",
    "llmAuditTrace.ts",
    "llmAuditValidation.ts",
    "llmAuditAggregation.ts",
    "llmAuditManifest.ts",
    "llmAuditRegistry.ts",
    "llmAuditExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
  }
});
