/**
 * LLM-10 — Public Security & Redaction Guard exports and facade.
 */

import {
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_PLATFORM_ID,
  LLM_SECURITY_PLATFORM_NAME,
  LLM_SECURITY_POLICY_KEYS,
  LLM_SECURITY_PRINCIPLES,
  LLM_SECURITY_PUBLIC_API_REGISTRY,
  LLM_SECURITY_REDACTION_RULE_KEYS,
  LLM_SECURITY_CONTEXT_DEPENDENCY,
  LLM_SECURITY_PROMPT_DEPENDENCY,
} from "./llmSecurityContracts.ts";
import { inspectPromptSecurity } from "./llmSecurityInspector.ts";
import { getSecurityManifest } from "./llmSecurityManifest.ts";
import { redactPromptPackage } from "./llmSecurityRedaction.ts";
import {
  discoverSecurityPolicies,
  ensureLlmSecurityDependenciesReady,
  getSecurityRegistry,
  lookupSecurityPolicy,
  registerSecurityPolicy,
  resetLlmSecurityRegistryForTests,
  seedDefaultSecurityPolicies,
} from "./llmSecurityRegistry.ts";
import type {
  LlmSecurityLayerState,
  LlmSecurityPlatformManifest,
  LlmSecurityPolicyRegistration,
} from "./llmSecurityTypes.ts";
import { validateSecurityDecision } from "./llmSecurityValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmSecurityRedactionLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmSecurityRegistryForTests();
}

export function getLlmSecurityRedactionLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmSecurityLayerState {
  return Object.freeze({
    contractVersion: LLM_SECURITY_CONTRACT_VERSION,
    contextDependency: LLM_SECURITY_CONTEXT_DEPENDENCY,
    promptDependency: LLM_SECURITY_PROMPT_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSecurityRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmSecurityRedactionLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmSecurityLayerState | null; readOnly: true }> {
  if (!ensureLlmSecurityDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/5 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedDefaultSecurityPolicies(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Security & Redaction Guard layer created.",
    data: getLlmSecurityRedactionLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmSecurityPlatformManifest(): LlmSecurityPlatformManifest {
  return Object.freeze({
    manifestId: "llm-security-redaction-platform-manifest",
    platformId: LLM_SECURITY_PLATFORM_ID,
    version: LLM_SECURITY_CONTRACT_VERSION,
    title: LLM_SECURITY_PLATFORM_NAME,
    goal: "Deterministic prompt inspection, redaction, and allow/deny decisions before provider eligibility.",
    publicApis: LLM_SECURITY_PUBLIC_API_REGISTRY,
    policyKeys: LLM_SECURITY_POLICY_KEYS,
    redactionRuleKeys: LLM_SECURITY_REDACTION_RULE_KEYS,
    readOnly: true as const,
  });
}

export function redactPromptPackagePublic(
  promptPackage: Parameters<typeof redactPromptPackage>[0],
  policyKey: Parameters<typeof lookupSecurityPolicy>[0] = "public"
) {
  const policy = lookupSecurityPolicy(policyKey);
  if (!policy) {
    return Object.freeze({
      success: false,
      reason: "Security policy is not registered.",
      package: null,
      summary: null,
      readOnly: true as const,
    });
  }
  return redactPromptPackage(promptPackage, policy);
}

export {
  inspectPromptSecurity,
  redactPromptPackagePublic as redactPromptPackage,
  validateSecurityDecision,
  registerSecurityPolicy,
  discoverSecurityPolicies,
  getSecurityManifest,
  getSecurityRegistry,
  LLM_SECURITY_PUBLIC_API_REGISTRY,
  LLM_SECURITY_PRINCIPLES,
};

export const SecurityRedactionPlatform = Object.freeze({
  inspectPromptSecurity,
  redactPromptPackage: redactPromptPackagePublic,
  validateSecurityDecision,
  registerSecurityPolicy,
  discoverSecurityPolicies,
  getSecurityManifest,
  getSecurityRegistry,
  buildLlmSecurityRedactionLayer,
  getLlmSecurityPlatformManifest,
  getLlmSecurityRedactionLayerState,
  resetLlmSecurityRedactionLayerForTests,
  version: LLM_SECURITY_CONTRACT_VERSION,
});

export type { LlmSecurityPolicyRegistration };
