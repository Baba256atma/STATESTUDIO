/**
 * LLM-2 — Standardized provider error contracts.
 */

import { LLM_PROVIDER_ERROR_CATEGORY_KEYS } from "./llmProviderContracts.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmProviderErrorCategoryKey, LlmProviderErrorContract } from "./llmProviderTypes.ts";

export function isLlmProviderErrorCategory(value: string): value is LlmProviderErrorCategoryKey {
  return (LLM_PROVIDER_ERROR_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isLlmProviderErrorRetryable(category: LlmProviderErrorCategoryKey): boolean {
  switch (category) {
    case "rate_limit":
    case "timeout":
    case "provider_unavailable":
      return true;
    default:
      return false;
  }
}

export function buildLlmProviderErrorContract(
  errorId: string,
  providerKey: LlmProviderKey,
  category: LlmProviderErrorCategoryKey,
  message: string,
  requestId?: string
): LlmProviderErrorContract {
  return Object.freeze({
    errorId,
    requestId,
    providerKey,
    category,
    message,
    retryable: isLlmProviderErrorRetryable(category),
    readOnly: true as const,
  });
}

export function normalizeLlmProviderErrorCategory(value: string): LlmProviderErrorCategoryKey {
  if (isLlmProviderErrorCategory(value)) {
    return value;
  }
  return "unknown_error";
}

export function getAllLlmProviderErrorCategories(): readonly LlmProviderErrorCategoryKey[] {
  return LLM_PROVIDER_ERROR_CATEGORY_KEYS;
}

export function resolveLlmProviderErrorExample(
  providerKey: LlmProviderKey
): LlmProviderErrorContract {
  return buildLlmProviderErrorContract(
    "llm-provider-error-example",
    providerKey,
    "invalid_request",
    "Example normalized provider error — no provider-specific details exposed."
  );
}
