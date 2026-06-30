/**
 * LLM-7 — Cost estimation from token records.
 */

import { LLM_COST_ROUNDING_PRECISION } from "./llmCostContracts.ts";
import type { LlmCostEstimate, LlmCostEstimateInput, LlmCostPricingProfile } from "./llmCostTypes.ts";
import { lookupPricingProfile } from "./llmCostPricing.ts";

export function roundLlmCost(value: number): number {
  const factor = 10 ** LLM_COST_ROUNDING_PRECISION;
  return Math.round(value * factor) / factor;
}

export function calculateInputCost(inputTokens: number, profile: LlmCostPricingProfile): number {
  return roundLlmCost(inputTokens * profile.inputTokenPrice);
}

export function calculateOutputCost(outputTokens: number, profile: LlmCostPricingProfile): number {
  return roundLlmCost(outputTokens * profile.outputTokenPrice);
}

export function estimateLlmCost(
  input: LlmCostEstimateInput,
  profiles: readonly LlmCostPricingProfile[]
): LlmCostEstimate | null {
  const profile = lookupPricingProfile(profiles, input.tokenRecord.providerKey, input.tokenRecord.modelKey);
  if (!profile) {
    return null;
  }
  const inputCost = calculateInputCost(input.tokenRecord.estimatedInputTokens, profile);
  const outputCost = calculateOutputCost(input.tokenRecord.estimatedOutputTokens, profile);
  return Object.freeze({
    inputCost,
    outputCost,
    totalEstimatedCost: roundLlmCost(inputCost + outputCost),
    currency: profile.currency,
    pricingProfileId: profile.pricingProfileId,
    readOnly: true as const,
  });
}

export function buildLlmCostRecordFromTokenRecord(
  tokenRecord: LlmCostEstimateInput["tokenRecord"],
  estimate: LlmCostEstimate,
  costRecordId: string,
  timestamp: string
) {
  return Object.freeze({
    costRecordId,
    tokenRecordId: tokenRecord.recordId,
    requestId: tokenRecord.requestId,
    responseId: tokenRecord.responseId,
    providerKey: tokenRecord.providerKey,
    modelKey: tokenRecord.modelKey,
    userId: tokenRecord.userId,
    workspaceId: tokenRecord.workspaceId,
    organizationId: tokenRecord.organizationId,
    inputTokens: tokenRecord.estimatedInputTokens,
    outputTokens: tokenRecord.estimatedOutputTokens,
    inputCost: estimate.inputCost,
    outputCost: estimate.outputCost,
    totalEstimatedCost: estimate.totalEstimatedCost,
    currency: estimate.currency,
    pricingProfileId: estimate.pricingProfileId,
    timestamp,
    metadata: Object.freeze({
      tokenRecordId: tokenRecord.recordId,
      estimationRuleId: tokenRecord.metadata.estimationRuleId ?? "unknown",
    }),
    readOnly: true as const,
  });
}
