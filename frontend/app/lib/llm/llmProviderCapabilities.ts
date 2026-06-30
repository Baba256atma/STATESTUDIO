/**
 * LLM-2 — Provider capability declarations.
 */

import {
  LLM_PROVIDER_CAPABILITY_KEYS,
  LLM_PROVIDER_DEFAULT_CAPABILITIES,
  LLM_PROVIDER_RESERVED_CAPABILITY_KEYS,
} from "./llmProviderContracts.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmProviderCapabilityDeclaration, LlmProviderCapabilityKey } from "./llmProviderTypes.ts";

export function isLlmProviderCapabilityKey(value: string): value is LlmProviderCapabilityKey {
  return (LLM_PROVIDER_CAPABILITY_KEYS as readonly string[]).includes(value);
}

export function isLlmProviderReservedCapability(value: LlmProviderCapabilityKey): boolean {
  return (LLM_PROVIDER_RESERVED_CAPABILITY_KEYS as readonly string[]).includes(value);
}

export function buildLlmProviderCapabilityDeclaration(
  capabilityKey: LlmProviderCapabilityKey,
  supported: boolean
): LlmProviderCapabilityDeclaration {
  return Object.freeze({
    capabilityKey,
    supported,
    reserved: isLlmProviderReservedCapability(capabilityKey),
    readOnly: true as const,
  });
}

export function buildLlmProviderCapabilitySet(
  providerKey: LlmProviderKey
): readonly LlmProviderCapabilityDeclaration[] {
  const supportedKeys = new Set<string>(LLM_PROVIDER_DEFAULT_CAPABILITIES[providerKey]);
  return Object.freeze(
    LLM_PROVIDER_CAPABILITY_KEYS.map((capabilityKey) =>
      buildLlmProviderCapabilityDeclaration(capabilityKey, supportedKeys.has(capabilityKey))
    )
  );
}

export function getSupportedLlmProviderCapabilities(
  providerKey: LlmProviderKey
): readonly LlmProviderCapabilityKey[] {
  return LLM_PROVIDER_DEFAULT_CAPABILITIES[providerKey];
}

export function validateLlmProviderCapabilityConsistency(
  declared: readonly LlmProviderCapabilityKey[]
): readonly string[] {
  const issues: string[] = [];
  const unique = new Set(declared);
  if (unique.size !== declared.length) {
    issues.push("Duplicate capability keys in declaration.");
  }
  for (const key of declared) {
    if (!isLlmProviderCapabilityKey(key)) {
      issues.push(`Unknown capability key: ${key}`);
    }
  }
  return Object.freeze(issues);
}

export function getAllLlmProviderCapabilityKeys(): readonly LlmProviderCapabilityKey[] {
  return LLM_PROVIDER_CAPABILITY_KEYS;
}
