/**
 * LLM-10 — Security policy registry (in-memory, no persistence).
 */

import { buildLlmContextBuilderLayer } from "./llmContextExports.ts";
import {
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_DEFAULT_LIMITS,
  LLM_SECURITY_POLICY_KEYS,
} from "./llmSecurityContracts.ts";
import {
  buildLlmSecurityPolicyRegistration,
  getAllLlmSecurityPolicyKeys,
  isLlmSecurityPolicyKey,
} from "./llmSecurityPolicies.ts";
import type {
  LlmSecurityPolicyInput,
  LlmSecurityPolicyKey,
  LlmSecurityPolicyRegistration,
  LlmSecurityRegistry,
} from "./llmSecurityTypes.ts";
import { validateSecurityPolicyCompatibility } from "./llmSecurityValidation.ts";

const policyRegistry = new Map<LlmSecurityPolicyKey, LlmSecurityPolicyRegistration>();

export function resetLlmSecurityRegistryForTests(): void {
  policyRegistry.clear();
}

export function registerSecurityPolicy(
  input: LlmSecurityPolicyInput,
  timestamp: string
): LlmSecurityPolicyRegistration {
  const registration = buildLlmSecurityPolicyRegistration(input, timestamp);
  const validation = validateSecurityPolicyCompatibility(registration);
  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Security policy registration failed.");
  }
  policyRegistry.set(registration.policyKey, registration);
  return registration;
}

export function discoverSecurityPolicies(): readonly LlmSecurityPolicyRegistration[] {
  return getSecurityRegistry().policies;
}

export function lookupSecurityPolicy(policyKey: LlmSecurityPolicyKey): LlmSecurityPolicyRegistration | null {
  return policyRegistry.get(policyKey) ?? null;
}

export function getSecurityRegistry(): LlmSecurityRegistry {
  const policies = Object.freeze([...policyRegistry.values()].sort((left, right) =>
    left.policyKey.localeCompare(right.policyKey)
  ));
  return Object.freeze({
    policies,
    policyCount: policies.length,
    readOnly: true as const,
  });
}

export function seedDefaultSecurityPolicies(timestamp: string): void {
  if (policyRegistry.size >= LLM_SECURITY_DEFAULT_LIMITS.maxRegisteredPolicies) {
    return;
  }
  for (const policyKey of LLM_SECURITY_POLICY_KEYS) {
    registerSecurityPolicy(Object.freeze({ policyKey }), timestamp);
  }
}

export function ensureLlmSecurityDependenciesReady(timestamp: string): boolean {
  const contextLayer = buildLlmContextBuilderLayer(timestamp);
  return contextLayer.success;
}

export function lookupSecurityPolicyCompatibility(policyKey: LlmSecurityPolicyKey): readonly string[] | null {
  const policy = policyRegistry.get(policyKey);
  if (!policy) {
    return null;
  }
  return Object.freeze([LLM_SECURITY_CONTRACT_VERSION, policy.version]);
}

export { isLlmSecurityPolicyKey, getAllLlmSecurityPolicyKeys };
