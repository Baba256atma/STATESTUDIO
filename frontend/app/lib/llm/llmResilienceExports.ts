/**
 * LLM-11 — Public Resilience Coordinator exports and facade.
 */

import {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_FAILURE_CATEGORY_KEYS,
  LLM_RESILIENCE_FALLBACK_POLICY_KEYS,
  LLM_RESILIENCE_PLATFORM_ID,
  LLM_RESILIENCE_PLATFORM_NAME,
  LLM_RESILIENCE_PRINCIPLES,
  LLM_RESILIENCE_PUBLIC_API_REGISTRY,
  LLM_RESILIENCE_RETRY_POLICY_KEYS,
  LLM_RESILIENCE_ROUTER_DEPENDENCY,
  LLM_RESILIENCE_SECURITY_DEPENDENCY,
  LLM_RESILIENCE_TIMEOUT_POLICY_KEYS,
} from "./llmResilienceContracts.ts";
import { getResilienceManifest } from "./llmResilienceManifest.ts";
import {
  buildResilienceDecision,
  discoverResiliencePolicies,
  ensureLlmResilienceDependenciesReady,
  getResilienceRegistry,
  registerFallbackPolicy,
  registerRetryPolicy,
  registerTimeoutPolicy,
  resetLlmResilienceRegistryForTests,
  seedDefaultResiliencePolicies,
} from "./llmResilienceRegistry.ts";
import type {
  LlmResilienceLayerState,
  LlmResiliencePlatformManifest,
} from "./llmResilienceTypes.ts";
import { validateResilienceDecision } from "./llmResilienceValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmResilienceCoordinatorLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmResilienceRegistryForTests();
}

export function getLlmResilienceCoordinatorLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmResilienceLayerState {
  return Object.freeze({
    contractVersion: LLM_RESILIENCE_CONTRACT_VERSION,
    securityDependency: LLM_RESILIENCE_SECURITY_DEPENDENCY,
    routerDependency: LLM_RESILIENCE_ROUTER_DEPENDENCY,
    initialized: layerInitialized,
    registry: getResilienceRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmResilienceCoordinatorLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmResilienceLayerState | null; readOnly: true }> {
  if (!ensureLlmResilienceDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/10 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedDefaultResiliencePolicies(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Retry, Timeout & Fallback Coordinator layer created.",
    data: getLlmResilienceCoordinatorLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmResiliencePlatformManifest(): LlmResiliencePlatformManifest {
  return Object.freeze({
    manifestId: "llm-resilience-coordinator-platform-manifest",
    platformId: LLM_RESILIENCE_PLATFORM_ID,
    version: LLM_RESILIENCE_CONTRACT_VERSION,
    title: LLM_RESILIENCE_PLATFORM_NAME,
    goal: "Deterministic retry, timeout, cancellation, and fallback coordination for future runtime execution.",
    publicApis: LLM_RESILIENCE_PUBLIC_API_REGISTRY,
    retryPolicyKeys: LLM_RESILIENCE_RETRY_POLICY_KEYS,
    timeoutPolicyKeys: LLM_RESILIENCE_TIMEOUT_POLICY_KEYS,
    fallbackPolicyKeys: LLM_RESILIENCE_FALLBACK_POLICY_KEYS,
    failureCategoryKeys: LLM_RESILIENCE_FAILURE_CATEGORY_KEYS,
    readOnly: true as const,
  });
}

export {
  buildResilienceDecision,
  validateResilienceDecision,
  registerRetryPolicy,
  registerTimeoutPolicy,
  registerFallbackPolicy,
  discoverResiliencePolicies,
  getResilienceManifest,
  getResilienceRegistry,
  LLM_RESILIENCE_PUBLIC_API_REGISTRY,
  LLM_RESILIENCE_PRINCIPLES,
};

export const ResilienceCoordinatorPlatform = Object.freeze({
  buildResilienceDecision,
  validateResilienceDecision,
  registerRetryPolicy,
  registerTimeoutPolicy,
  registerFallbackPolicy,
  discoverResiliencePolicies,
  getResilienceManifest,
  getResilienceRegistry,
  buildLlmResilienceCoordinatorLayer,
  getLlmResiliencePlatformManifest,
  getLlmResilienceCoordinatorLayerState,
  resetLlmResilienceCoordinatorLayerForTests,
  version: LLM_RESILIENCE_CONTRACT_VERSION,
});
