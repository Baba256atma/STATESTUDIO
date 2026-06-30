/**
 * LLM-6 — Token usage recording.
 */

import { estimateTokenUsage } from "./llmTokenEstimator.ts";
import type { LlmTokenEstimateInput, LlmTokenRecordResult, LlmTokenUsageRecord } from "./llmTokenTypes.ts";
import { validateTokenRecord } from "./llmTokenValidation.ts";

export function buildTokenUsageRecord(
  input: LlmTokenEstimateInput,
  recordId: string,
  responseId: string,
  timestamp: string,
  overrides?: Partial<Pick<LlmTokenUsageRecord, "estimatedInputTokens" | "estimatedOutputTokens" | "totalTokens">>
): LlmTokenUsageRecord {
  const estimate = estimateTokenUsage(input);
  const estimatedInputTokens = overrides?.estimatedInputTokens ?? estimate.estimatedInputTokens;
  const estimatedOutputTokens = overrides?.estimatedOutputTokens ?? estimate.estimatedOutputTokens;
  const totalTokens = overrides?.totalTokens ?? estimatedInputTokens + estimatedOutputTokens;
  const request = input.runtimeRequest;
  return Object.freeze({
    recordId,
    requestId: request.requestId,
    responseId,
    providerKey: request.providerKey,
    modelKey: request.modelKey,
    userId: request.userId,
    workspaceId: request.workspaceId,
    organizationId: request.organizationId,
    sessionId: input.sessionId ?? request.correlationId,
    estimatedInputTokens,
    estimatedOutputTokens,
    totalTokens,
    timestamp,
    metadata: Object.freeze({
      traceId: request.traceId,
      correlationId: request.correlationId,
      estimationRuleId: estimate.estimationRuleId,
      dryRun: String(request.dryRun),
    }),
    readOnly: true as const,
  });
}

export function createTokenRecordResult(
  success: boolean,
  reason: string,
  record: LlmTokenUsageRecord | null
): LlmTokenRecordResult {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function validateTokenRecordPublic(record: LlmTokenUsageRecord) {
  return validateTokenRecord(record);
}
