/**
 * LLM-2 — Provider adapter registry.
 */

import { LLM_PROVIDER_KEYS } from "./llmPlatformContracts.ts";
import { buildLlmPlatformFoundation } from "./llmPlatformExports.ts";
import {
  LLM_PROVIDER_CONTRACT_VERSION,
  LLM_PROVIDER_DEFAULT_LIMITS,
  LLM_PROVIDER_FOUNDATION_DEPENDENCY,
  LLM_PROVIDER_VENDOR_LABELS,
} from "./llmProviderContracts.ts";
import { buildLlmProviderCapabilitySet, getSupportedLlmProviderCapabilities } from "./llmProviderCapabilities.ts";
import type {
  LlmProviderAdapterContract,
  LlmProviderAdapterRegistrationInput,
  LlmProviderAdapterRegistry,
  LlmProviderAdapterResult,
  LlmProviderAuthMethodKey,
} from "./llmProviderTypes.ts";
import {
  validateLlmProviderAdapter,
  validateLlmProviderRegistrationInput,
  validateLlmProviderRegistryUniqueness,
} from "./llmProviderValidation.ts";

const adapterRegistry = new Map<string, LlmProviderAdapterContract>();

const DEFAULT_AUTH_METHODS: Record<(typeof LLM_PROVIDER_KEYS)[number], LlmProviderAuthMethodKey> = {
  gpt: "api_key",
  ollama: "local_credentials",
  claude: "api_key",
  gemini: "api_key",
  local_models: "none",
  future_providers: "api_key",
};

function createResult<T>(success: boolean, reason: string, data: T | null): LlmProviderAdapterResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetLlmProviderRegistryForTests(): void {
  adapterRegistry.clear();
}

export function getLlmProviderAdapterRegistry(): LlmProviderAdapterRegistry {
  const adapters = Object.freeze([...adapterRegistry.values()]);
  return Object.freeze({
    adapters,
    adapterCount: adapters.length,
    readOnly: true as const,
  });
}

export function discoverLlmProviderAdapters(): readonly LlmProviderAdapterContract[] {
  return getLlmProviderAdapterRegistry().adapters;
}

export function registerLlmProviderAdapter(
  input: LlmProviderAdapterRegistrationInput,
  timestamp: string
): LlmProviderAdapterResult<LlmProviderAdapterContract> {
  const inputValidation = validateLlmProviderRegistrationInput(input);
  if (!inputValidation.valid) {
    return createResult(false, inputValidation.issues[0]?.message ?? "Invalid registration input.", null);
  }
  if (adapterRegistry.has(input.providerKey)) {
    return createResult(false, `Provider adapter already registered: ${input.providerKey}.`, null);
  }
  if (adapterRegistry.size >= LLM_PROVIDER_DEFAULT_LIMITS.maxRegisteredAdapters) {
    return createResult(false, "Provider adapter registry limit reached.", null);
  }

  const supportedCapabilities = input.supportedCapabilities ?? getSupportedLlmProviderCapabilities(input.providerKey);
  const identity = Object.freeze({
    providerId: `llm-provider-adapter-${input.providerKey}`,
    providerKey: input.providerKey,
    displayName: input.displayName ?? LLM_PROVIDER_VENDOR_LABELS[input.providerKey],
    version: LLM_PROVIDER_CONTRACT_VERSION,
    vendor: LLM_PROVIDER_VENDOR_LABELS[input.providerKey],
    contractVersion: LLM_PROVIDER_CONTRACT_VERSION,
    supportedCapabilities,
    status: input.status ?? "registered",
    readOnly: true as const,
  });

  const adapter = Object.freeze({
    adapterId: `llm-adapter-${input.providerKey}`,
    identity,
    capabilities: buildLlmProviderCapabilitySet(input.providerKey),
    authContract: Object.freeze({
      authMethod: input.authMethod,
      credentialRef: `credential-ref-${input.providerKey}`,
      readOnly: true as const,
    }),
    foundationVersion: LLM_PROVIDER_FOUNDATION_DEPENDENCY,
    registeredAt: timestamp,
    readOnly: true as const,
  });

  const adapterValidation = validateLlmProviderAdapter(adapter);
  if (!adapterValidation.valid) {
    return createResult(false, adapterValidation.issues[0]?.message ?? "Adapter validation failed.", null);
  }

  adapterRegistry.set(input.providerKey, adapter);
  return createResult(true, "Provider adapter registered.", adapter);
}

export function seedDefaultLlmProviderAdapters(timestamp: string): void {
  for (const providerKey of LLM_PROVIDER_KEYS) {
    registerLlmProviderAdapter(
      Object.freeze({
        providerKey,
        authMethod: DEFAULT_AUTH_METHODS[providerKey],
      }),
      timestamp
    );
  }
}

export function ensureLlmProviderFoundationReady(timestamp: string): LlmProviderAdapterResult<true> {
  const foundation = buildLlmPlatformFoundation(timestamp);
  if (!foundation.success) {
    return createResult(false, "LLM/1 foundation initialization failed.", null);
  }
  return createResult(true, "LLM/1 foundation ready.", true);
}

export function validateLlmProviderRegistryState(): LlmProviderAdapterResult<true> {
  const registry = getLlmProviderAdapterRegistry();
  const uniqueness = validateLlmProviderRegistryUniqueness(registry.adapters);
  if (!uniqueness.valid) {
    return createResult(false, uniqueness.issues[0]?.message ?? "Registry uniqueness validation failed.", null);
  }
  return createResult(true, "Provider registry is valid.", true);
}
