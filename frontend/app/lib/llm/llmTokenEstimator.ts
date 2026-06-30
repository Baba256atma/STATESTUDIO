/**
 * LLM-6 — Deterministic token estimation (no provider tokenizers).
 */

import { LLM_TOKEN_ESTIMATION_RULE } from "./llmTokenContracts.ts";
import type { LlmTokenEstimate, LlmTokenEstimateInput } from "./llmTokenTypes.ts";

export function estimateTokensFromText(text: string): number {
  if (!text.trim()) {
    return 0;
  }
  return Math.ceil(text.length / LLM_TOKEN_ESTIMATION_RULE.charsPerToken);
}

export function estimateInputTokens(input: LlmTokenEstimateInput): number {
  const request = input.runtimeRequest;
  const parts = [
    request.userMessage,
    request.systemInstructionRef,
    input.additionalInputText ?? "",
    request.metadata.contextRef ?? "",
  ];
  return estimateTokensFromText(parts.join(" "));
}

export function estimateOutputTokens(input: LlmTokenEstimateInput): number {
  if (input.runtimeResponse?.outputText) {
    return estimateTokensFromText(input.runtimeResponse.outputText);
  }
  return estimateTokensFromText(input.additionalOutputText ?? "");
}

export function estimateTokenUsage(input: LlmTokenEstimateInput): LlmTokenEstimate {
  const estimatedInputTokens = estimateInputTokens(input);
  const estimatedOutputTokens = estimateOutputTokens(input);
  return Object.freeze({
    estimatedInputTokens,
    estimatedOutputTokens,
    totalTokens: estimatedInputTokens + estimatedOutputTokens,
    estimationRuleId: LLM_TOKEN_ESTIMATION_RULE.ruleId,
    readOnly: true as const,
  });
}

export function buildRequestTokenSummary(input: LlmTokenEstimateInput): Readonly<{ estimatedInputTokens: number; readOnly: true }> {
  return Object.freeze({
    estimatedInputTokens: estimateInputTokens(input),
    readOnly: true as const,
  });
}

export function buildResponseTokenSummary(input: LlmTokenEstimateInput): Readonly<{ estimatedOutputTokens: number; readOnly: true }> {
  return Object.freeze({
    estimatedOutputTokens: estimateOutputTokens(input),
    readOnly: true as const,
  });
}
