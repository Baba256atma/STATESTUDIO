import assert from "node:assert/strict";
import test from "node:test";

import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import {
  LLM_RUNTIME_CONTRACT_VERSION,
  LLM_RUNTIME_DRY_RUN_OUTPUT_PREFIX,
  LLM_RUNTIME_FOUNDATION_DEPENDENCY,
  LLM_RUNTIME_PRINCIPLES,
  LLM_RUNTIME_PROVIDER_DEPENDENCY,
  LLM_RUNTIME_PUBLIC_API_REGISTRY,
  LLM_RUNTIME_STATUS_KEYS,
} from "./llmRuntimeContracts.ts";
import {
  LlmRuntimeContractLayer,
  buildLlmRuntimeContractLayer,
  buildLlmRuntimeRequestEnvelope,
  buildLlmRuntimeResponseEnvelope,
  executeDryRunRuntimeRequest,
  executeMockRuntimeRequest,
  getLlmRuntimeLayerState,
  getLlmRuntimeManifest,
  getLlmRuntimeRegistry,
  resetLlmRuntimeContractLayerForTests,
  validateLlmRuntimeRequest,
  validateLlmRuntimeResponse,
} from "./llmRuntimeExports.ts";
import {
  attachLlmRuntimeErrorToResponse,
  buildLlmRuntimeFailedResponse,
  normalizeLlmRuntimeError,
  validateLlmRuntimeErrorConsistency,
} from "./llmRuntimeErrors.ts";
import {
  getAllLlmRuntimeStatusKeys,
  isLlmRuntimeSuccessStatus,
  isLlmRuntimeTerminalStatus,
  resolveLlmRuntimeStatusForDryRun,
} from "./llmRuntimeStatus.ts";
import type { LlmRuntimeAdapterExecutionContract, LlmRuntimeRequestInput } from "./llmRuntimeTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildBaseRequestInput(overrides: Partial<LlmRuntimeRequestInput> = {}): LlmRuntimeRequestInput {
  return Object.freeze({
    requestId: "req-001",
    traceId: "trace-001",
    correlationId: "corr-001",
    userMessage: "Summarize the quarterly report.",
    systemInstructionRef: "system-instruction-ref-001",
    providerKey: "gpt",
    modelKey: "gpt-4o-mini",
    workspaceId: "ws-1",
    organizationId: "org-1",
    userId: "user-1",
    ...overrides,
  });
}

test.beforeEach(() => {
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/3 runtime contract vocabulary", () => {
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_RUNTIME_FOUNDATION_DEPENDENCY, "LLM/1");
  assert.equal(LLM_RUNTIME_PROVIDER_DEPENDENCY, "LLM/2");
  assert.equal(LLM_RUNTIME_STATUS_KEYS.length, 7);
  assert.equal(LLM_RUNTIME_PUBLIC_API_REGISTRY.length, 8);
});

test("creates normalized runtime request envelope", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const request = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput({ temperature: 0.2, maxTokens: 512 }));
  assert.equal(request.requestId, "req-001");
  assert.equal(request.traceId, "trace-001");
  assert.equal(request.correlationId, "corr-001");
  assert.equal(request.providerKey, "gpt");
  assert.equal(request.runtimeMode, "standard");
  assert.equal(request.dryRun, false);
  assert.equal(validateLlmRuntimeRequest(request).valid, true);
});

test("creates normalized runtime response envelope", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const request = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput());
  const response = buildLlmRuntimeResponseEnvelope(request, "completed", "Normalized output text.", FIXED_TIME, {
    tokenUsage: Object.freeze({ promptTokens: 10, completionTokens: 20, totalTokens: 30, readOnly: true as const }),
    cost: Object.freeze({ estimatedCost: 0.001, currency: "USD", readOnly: true as const }),
    latencyMs: 42,
  });
  assert.equal(response.requestId, request.requestId);
  assert.equal(response.status, "completed");
  assert.equal(response.outputText, "Normalized output text.");
  assert.equal(response.tokenUsage.totalTokens, 30);
  assert.equal(validateLlmRuntimeResponse(response, request).valid, true);
});

test("supports all runtime status values", () => {
  assert.equal(getAllLlmRuntimeStatusKeys().length, 7);
  assert.equal(isLlmRuntimeTerminalStatus("completed"), true);
  assert.equal(isLlmRuntimeTerminalStatus("running"), false);
  assert.equal(isLlmRuntimeSuccessStatus("dry_run"), true);
  assert.equal(resolveLlmRuntimeStatusForDryRun(true), "dry_run");
});

test("validates required fields provider compatibility and bounds", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const invalidProvider = buildLlmRuntimeRequestEnvelope(
    buildBaseRequestInput({ providerKey: "unknown" as "gpt" })
  );
  assert.equal(validateLlmRuntimeRequest(invalidProvider).valid, false);
  const invalidTemperature = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput({ temperature: 5 }));
  assert.equal(validateLlmRuntimeRequest(invalidTemperature).valid, false);
  const missingTrace = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput({ traceId: "  " }));
  assert.equal(validateLlmRuntimeRequest(missingTrace).valid, false);
});

test("normalizes runtime errors consistently", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const request = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput());
  const normalized = normalizeLlmRuntimeError("err-1", "gpt", "openai_timeout", "Normalized timeout.", request.requestId);
  assert.equal(normalized.category, "unknown_error");
  assert.equal(normalized.retryable, false);
  const failed = buildLlmRuntimeFailedResponse(request, "err-2", "timeout", "Request timed out.", FIXED_TIME);
  assert.equal(failed.status, "failed");
  assert.equal(validateLlmRuntimeErrorConsistency(failed).length, 0);
  const completed = buildLlmRuntimeResponseEnvelope(request, "completed", "ok", FIXED_TIME);
  const withError = attachLlmRuntimeErrorToResponse(completed, "err-3", "internal_error", "Failure");
  assert.equal(withError.status, "failed");
});

test("executes deterministic dry-run without provider calls", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const request = buildLlmRuntimeRequestEnvelope(
    buildBaseRequestInput({ runtimeMode: "dry_run", dryRun: true })
  );
  const result = executeDryRunRuntimeRequest(request, FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.response?.status, "dry_run");
  assert.ok(result.response?.outputText.includes(LLM_RUNTIME_DRY_RUN_OUTPUT_PREFIX));
  assert.equal(result.metadata?.dryRun, true);
  assert.equal(result.metadata?.lifecycle, "finalized");
});

test("executes deterministic mock runtime for tests", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const request = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput());
  const result = executeMockRuntimeRequest(request, "Mock executive summary.", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.response?.outputText, "Mock executive summary.");
  assert.equal(result.response?.status, "dry_run");
});

test("creates runtime registry with modes and validation rules", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const registry = getLlmRuntimeRegistry();
  assert.equal(registry.contractCount, 4);
  assert.equal(registry.modeCount, 3);
  assert.equal(registry.validationRuleCount, 8);
  assert.ok(registry.contracts.some((contract) => contract.contractKey === "adapter_execution"));
});

test("exposes stable public exports and manifest", () => {
  buildLlmRuntimeContractLayer(FIXED_TIME);
  const manifest = getLlmRuntimeManifest();
  assert.equal(manifest.version, "LLM/3");
  assert.equal(manifest.foundationDependency, "LLM/1");
  assert.equal(manifest.providerDependency, "LLM/2");
  assert.deepEqual(manifest.publicApis, LLM_RUNTIME_PUBLIC_API_REGISTRY);
  assert.equal(typeof LlmRuntimeContractLayer.executeDryRunRuntimeRequest, "function");
  assert.equal(getLlmRuntimeLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_RUNTIME_PRINCIPLES.includes("dry_run_never_calls_providers"));
});

test("defines provider adapter execution interface as signatures only", () => {
  const adapterContract: LlmRuntimeAdapterExecutionContract = Object.freeze({
    contractKey: "adapter_execution",
    executeNormalizedRequest: undefined as never,
    validateProviderReadiness: undefined as never,
    returnNormalizedResponse: undefined as never,
    returnNormalizedError: undefined as never,
    readOnly: true as const,
  });
  assert.equal(adapterContract.contractKey, "adapter_execution");
});

test("maintains LLM-1 and LLM-2 compatibility", () => {
  const layer = buildLlmRuntimeContractLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  const request = buildLlmRuntimeRequestEnvelope(buildBaseRequestInput());
  assert.equal(validateLlmRuntimeRequest(request).valid, true);
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmRuntimeContracts.ts",
    "llmRuntimeTypes.ts",
    "llmRuntimeEnvelope.ts",
    "llmRuntimeStatus.ts",
    "llmRuntimeErrors.ts",
    "llmRuntimeValidation.ts",
    "llmRuntimeMock.ts",
    "llmRuntimeRegistry.ts",
    "llmRuntimeExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
  }
});
