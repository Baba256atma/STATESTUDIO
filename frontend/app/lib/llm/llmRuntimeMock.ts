/**
 * LLM-3 — Deterministic dry-run and mock runtime execution.
 */

import { LLM_RUNTIME_DRY_RUN_OUTPUT_PREFIX } from "./llmRuntimeContracts.ts";
import {
  buildEmptyCostPlaceholder,
  buildEmptyStructuredOutputPlaceholder,
  buildLlmRuntimeResponseEnvelope,
} from "./llmRuntimeEnvelope.ts";
import { resolveLlmRuntimeStatusForDryRun } from "./llmRuntimeStatus.ts";
import { validateLlmRuntimeRequest, validateLlmRuntimeResponse } from "./llmRuntimeValidation.ts";
import type {
  LlmRuntimeExecutionMetadata,
  LlmRuntimeExecutionResult,
  LlmRuntimeRequestEnvelope,
} from "./llmRuntimeTypes.ts";

export function buildLlmRuntimeExecutionMetadata(
  request: LlmRuntimeRequestEnvelope,
  startedAt: string,
  completedAt: string | null,
  lifecycle: LlmRuntimeExecutionMetadata["lifecycle"] = "finalized"
): LlmRuntimeExecutionMetadata {
  return Object.freeze({
    executionId: `llm-execution-${request.requestId}`,
    requestId: request.requestId,
    traceId: request.traceId,
    correlationId: request.correlationId,
    providerKey: request.providerKey,
    modelKey: request.modelKey,
    runtimeMode: request.runtimeMode,
    lifecycle,
    dryRun: request.dryRun,
    startedAt,
    completedAt,
    readOnly: true as const,
  });
}

export function buildSyntheticDryRunOutput(request: LlmRuntimeRequestEnvelope): string {
  return `${LLM_RUNTIME_DRY_RUN_OUTPUT_PREFIX} Synthetic normalized response for request ${request.requestId}. Provider calls were not executed.`;
}

export function executeDryRunRuntimeRequest(
  request: LlmRuntimeRequestEnvelope,
  timestamp: string = new Date(0).toISOString()
): LlmRuntimeExecutionResult {
  const validation = validateLlmRuntimeRequest(request);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues[0]?.message ?? "Request validation failed.",
      request,
      response: null,
      metadata: buildLlmRuntimeExecutionMetadata(request, timestamp, timestamp, "validated"),
      readOnly: true as const,
    });
  }

  const status = resolveLlmRuntimeStatusForDryRun(request.dryRun || request.runtimeMode === "dry_run" || request.runtimeMode === "mock");
  const outputText = buildSyntheticDryRunOutput(request);
  const response = buildLlmRuntimeResponseEnvelope(request, status, outputText, timestamp, {
    tokenUsage: Object.freeze({
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      readOnly: true as const,
    }),
    cost: Object.freeze({
      estimatedCost: 0,
      currency: "USD",
      readOnly: true as const,
    }),
    latencyMs: 0,
    structuredOutput: buildEmptyStructuredOutputPlaceholder(),
    metadata: Object.freeze({ executionMode: request.runtimeMode, dryRun: String(request.dryRun) }),
  });

  const responseValidation = validateLlmRuntimeResponse(response, request);
  if (!responseValidation.valid) {
    return Object.freeze({
      success: false,
      reason: responseValidation.issues[0]?.message ?? "Response validation failed.",
      request,
      response: null,
      metadata: buildLlmRuntimeExecutionMetadata(request, timestamp, timestamp, "finalized"),
      readOnly: true as const,
    });
  }

  return Object.freeze({
    success: true,
    reason: "Dry-run execution completed without provider calls.",
    request,
    response,
    metadata: buildLlmRuntimeExecutionMetadata(request, timestamp, timestamp, "finalized"),
    readOnly: true as const,
  });
}

export function executeMockRuntimeRequest(
  request: LlmRuntimeRequestEnvelope,
  mockOutput: string,
  timestamp: string = new Date(0).toISOString()
): LlmRuntimeExecutionResult {
  const dryRunRequest = Object.freeze({
    ...request,
    runtimeMode: "mock" as const,
    dryRun: true,
    readOnly: true as const,
  });
  const base = executeDryRunRuntimeRequest(dryRunRequest, timestamp);
  if (!base.success || !base.response) {
    return base;
  }
  const response = buildLlmRuntimeResponseEnvelope(dryRunRequest, "dry_run", mockOutput, timestamp, {
    responseId: base.response.responseId,
    tokenUsage: base.response.tokenUsage,
    cost: buildEmptyCostPlaceholder(),
    latencyMs: 0,
  });
  return Object.freeze({
    success: true,
    reason: "Mock execution completed.",
    request: dryRunRequest,
    response,
    metadata: base.metadata,
    readOnly: true as const,
  });
}
