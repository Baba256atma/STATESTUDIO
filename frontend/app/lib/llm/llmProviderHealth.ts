/**
 * LLM-2 — Provider health state contracts.
 */

import { LLM_PROVIDER_HEALTH_STATE_KEYS } from "./llmProviderContracts.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmProviderHealthContract, LlmProviderHealthStateKey } from "./llmProviderTypes.ts";

export function isLlmProviderHealthState(value: string): value is LlmProviderHealthStateKey {
  return (LLM_PROVIDER_HEALTH_STATE_KEYS as readonly string[]).includes(value);
}

export function buildLlmProviderHealthContract(
  healthId: string,
  providerKey: LlmProviderKey,
  state: LlmProviderHealthStateKey,
  message: string,
  checkedAt: string
): LlmProviderHealthContract {
  return Object.freeze({
    healthId,
    providerKey,
    state,
    message,
    checkedAt,
    readOnly: true as const,
  });
}

export function isLlmProviderOperational(state: LlmProviderHealthStateKey): boolean {
  return state === "healthy" || state === "degraded";
}

export function getAllLlmProviderHealthStates(): readonly LlmProviderHealthStateKey[] {
  return LLM_PROVIDER_HEALTH_STATE_KEYS;
}

export function resolveLlmProviderHealthExample(
  providerKey: LlmProviderKey,
  checkedAt: string
): LlmProviderHealthContract {
  return buildLlmProviderHealthContract(
    "llm-provider-health-example",
    providerKey,
    "healthy",
    "Provider adapter contract registered — no runtime health check performed.",
    checkedAt
  );
}
