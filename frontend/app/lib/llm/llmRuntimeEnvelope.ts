/**
 * LLM-3 — Runtime request/response envelope factories.
 */

import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import type {
  LlmRuntimeCostPlaceholder,
  LlmRuntimeErrorPlaceholder,
  LlmRuntimeRequestEnvelope,
  LlmRuntimeRequestInput,
  LlmRuntimeResponseEnvelope,
  LlmRuntimeStatusKey,
  LlmRuntimeStructuredOutputPlaceholder,
  LlmRuntimeTokenUsagePlaceholder,
} from "./llmRuntimeTypes.ts";

export function buildEmptyTokenUsagePlaceholder(): LlmRuntimeTokenUsagePlaceholder {
  return Object.freeze({
    promptTokens: null,
    completionTokens: null,
    totalTokens: null,
    readOnly: true as const,
  });
}

export function buildEmptyCostPlaceholder(): LlmRuntimeCostPlaceholder {
  return Object.freeze({
    estimatedCost: null,
    currency: "USD",
    readOnly: true as const,
  });
}

export function buildEmptyStructuredOutputPlaceholder(): LlmRuntimeStructuredOutputPlaceholder {
  return Object.freeze({
    schemaRef: null,
    payloadRef: null,
    readOnly: true as const,
  });
}

export function buildEmptyErrorPlaceholder(): LlmRuntimeErrorPlaceholder {
  return Object.freeze({
    errorId: null,
    category: null,
    message: null,
    readOnly: true as const,
  });
}

export function buildLlmRuntimeRequestEnvelope(input: LlmRuntimeRequestInput): LlmRuntimeRequestEnvelope {
  const dryRun = input.dryRun ?? input.runtimeMode === "dry_run";
  return Object.freeze({
    requestId: input.requestId,
    traceId: input.traceId,
    correlationId: input.correlationId,
    userMessage: input.userMessage,
    systemInstructionRef: input.systemInstructionRef,
    providerKey: input.providerKey,
    modelKey: input.modelKey,
    runtimeMode: input.runtimeMode ?? (dryRun ? "dry_run" : "standard"),
    temperature: input.temperature,
    maxTokens: input.maxTokens,
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    userId: input.userId,
    metadata: Object.freeze({ ...(input.metadata ?? {}), contractVersion: LLM_RUNTIME_CONTRACT_VERSION }),
    dryRun,
    readOnly: true as const,
  });
}

export function buildLlmRuntimeResponseEnvelope(
  request: LlmRuntimeRequestEnvelope,
  status: LlmRuntimeStatusKey,
  outputText: string,
  createdAt: string,
  overrides: Partial<{
    responseId: string;
    tokenUsage: LlmRuntimeTokenUsagePlaceholder;
    cost: LlmRuntimeCostPlaceholder;
    latencyMs: number | null;
    error: LlmRuntimeErrorPlaceholder;
    structuredOutput: LlmRuntimeStructuredOutputPlaceholder;
    metadata: Readonly<Record<string, string>>;
  }> = {}
): LlmRuntimeResponseEnvelope {
  return Object.freeze({
    responseId: overrides.responseId ?? `llm-response-${request.requestId}`,
    requestId: request.requestId,
    providerKey: request.providerKey,
    modelKey: request.modelKey,
    status,
    outputText,
    structuredOutput: overrides.structuredOutput ?? buildEmptyStructuredOutputPlaceholder(),
    tokenUsage: overrides.tokenUsage ?? buildEmptyTokenUsagePlaceholder(),
    cost: overrides.cost ?? buildEmptyCostPlaceholder(),
    latencyMs: overrides.latencyMs ?? null,
    error: overrides.error ?? buildEmptyErrorPlaceholder(),
    metadata: Object.freeze({
      ...request.metadata,
      ...(overrides.metadata ?? {}),
      traceId: request.traceId,
      correlationId: request.correlationId,
    }),
    createdAt,
    readOnly: true as const,
  });
}
