/**
 * LLM-3 — Runtime error normalization.
 */

import { buildLlmProviderErrorContract, normalizeLlmProviderErrorCategory } from "./llmProviderErrors.ts";
import type { LlmProviderErrorCategoryKey } from "./llmProviderTypes.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import { buildEmptyErrorPlaceholder, buildLlmRuntimeResponseEnvelope } from "./llmRuntimeEnvelope.ts";
import type {
  LlmRuntimeErrorPlaceholder,
  LlmRuntimeRequestEnvelope,
  LlmRuntimeResponseEnvelope,
} from "./llmRuntimeTypes.ts";

export function buildLlmRuntimeErrorPlaceholder(
  errorId: string,
  category: LlmProviderErrorCategoryKey,
  message: string
): LlmRuntimeErrorPlaceholder {
  return Object.freeze({
    errorId,
    category,
    message,
    readOnly: true as const,
  });
}

export function normalizeLlmRuntimeError(
  errorId: string,
  providerKey: LlmProviderKey,
  rawCategory: string,
  message: string,
  requestId?: string
) {
  const category = normalizeLlmProviderErrorCategory(rawCategory);
  return buildLlmProviderErrorContract(errorId, providerKey, category, message, requestId);
}

export function attachLlmRuntimeErrorToResponse(
  response: LlmRuntimeResponseEnvelope,
  errorId: string,
  category: LlmProviderErrorCategoryKey,
  message: string
): LlmRuntimeResponseEnvelope {
  return Object.freeze({
    ...response,
    status: "failed",
    error: buildLlmRuntimeErrorPlaceholder(errorId, category, message),
    readOnly: true as const,
  });
}

export function validateLlmRuntimeErrorConsistency(
  response: LlmRuntimeResponseEnvelope
): readonly string[] {
  const issues: string[] = [];
  const hasError = response.error.errorId !== null;
  if (response.status === "failed" && !hasError) {
    issues.push("Failed status requires error placeholder.");
  }
  if (response.status !== "failed" && hasError) {
    issues.push("Non-failed status must not include error placeholder.");
  }
  if (hasError && !response.error.category) {
    issues.push("Error placeholder requires category.");
  }
  return Object.freeze(issues);
}

export function clearLlmRuntimeErrorPlaceholder(): LlmRuntimeErrorPlaceholder {
  return buildEmptyErrorPlaceholder();
}

export function buildLlmRuntimeFailedResponse(
  request: LlmRuntimeRequestEnvelope,
  errorId: string,
  category: LlmProviderErrorCategoryKey,
  message: string,
  createdAt: string
): LlmRuntimeResponseEnvelope {
  return buildLlmRuntimeResponseEnvelope(request, "failed", "", createdAt, {
    error: buildLlmRuntimeErrorPlaceholder(errorId, category, message),
  });
}
