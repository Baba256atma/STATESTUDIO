/**
 * LLM-1 — Platform registry for providers, runtime contracts, and extension points.
 */

import {
  LLM_DEFAULT_LIMITS,
  LLM_EXTENSION_POINT_KEYS,
  LLM_EXTENSION_REGISTRY,
  LLM_PLATFORM_CONTRACT_VERSION,
  LLM_PLATFORM_SOURCE,
  LLM_PROVIDER_KEYS,
  LLM_PROVIDER_LABELS,
  LLM_RUNTIME_CONTRACT_KEYS,
} from "./llmPlatformContracts.ts";
import type {
  LlmExtensionPoint,
  LlmExtensionPointKey,
  LlmPlatformRegistry,
  LlmPlatformRegistrySnapshot,
  LlmPlatformResult,
  LlmProviderContract,
  LlmProviderKey,
  LlmRuntimeContract,
  LlmRuntimeContractKey,
} from "./llmPlatformTypes.ts";

const providerRegistry = new Map<string, LlmProviderContract>();
const runtimeContractRegistry = new Map<string, LlmRuntimeContract>();
const extensionPointRegistry = new Map<string, LlmExtensionPoint>();

function createMetadata(timestamp: string) {
  return Object.freeze({
    metadataId: `llm-metadata-${timestamp}`,
    metadataVersion: LLM_PLATFORM_CONTRACT_VERSION,
    owner: LLM_PLATFORM_SOURCE,
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function createResult<T>(success: boolean, reason: string, data: T | null): LlmPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetLlmPlatformRegistryForTests(): void {
  providerRegistry.clear();
  runtimeContractRegistry.clear();
  extensionPointRegistry.clear();
}

export function getLlmPlatformRegistrySnapshot(): LlmPlatformRegistrySnapshot {
  return Object.freeze({
    providerCount: providerRegistry.size,
    runtimeContractCount: runtimeContractRegistry.size,
    extensionPointCount: extensionPointRegistry.size,
    readOnly: true as const,
  });
}

export function getLlmPlatformRegistry(): LlmPlatformRegistry {
  return Object.freeze({
    providers: Object.freeze([...providerRegistry.values()]),
    runtimeContracts: Object.freeze([...runtimeContractRegistry.values()]),
    extensionPoints: Object.freeze([...extensionPointRegistry.values()]),
    snapshot: getLlmPlatformRegistrySnapshot(),
    readOnly: true as const,
  });
}

export function registerLlmProvider(
  providerKey: LlmProviderKey,
  timestamp: string
): LlmPlatformResult<LlmProviderContract> {
  if (providerRegistry.size >= LLM_DEFAULT_LIMITS.maxRegisteredProviders && !providerRegistry.has(providerKey)) {
    return createResult(false, "Provider registry limit reached.", null);
  }
  const contract = Object.freeze({
    providerId: `llm-provider-${providerKey}`,
    providerKey,
    label: LLM_PROVIDER_LABELS[providerKey],
    description: `Canonical ${LLM_PROVIDER_LABELS[providerKey]} contract — interchangeable, provider-agnostic.`,
    version: LLM_PLATFORM_CONTRACT_VERSION,
    interchangeable: true as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  providerRegistry.set(providerKey, contract);
  return createResult(true, "Provider contract registered.", contract);
}

export function registerLlmRuntimeContract(
  contractKey: LlmRuntimeContractKey,
  timestamp: string
): LlmPlatformResult<LlmRuntimeContract> {
  if (runtimeContractRegistry.size >= LLM_DEFAULT_LIMITS.maxRegisteredRuntimeContracts && !runtimeContractRegistry.has(contractKey)) {
    return createResult(false, "Runtime contract registry limit reached.", null);
  }
  const labels: Record<LlmRuntimeContractKey, string> = {
    runtime_execution: "Runtime Execution Contract",
    runtime_request: "Runtime Request Contract",
    runtime_response: "Runtime Response Contract",
    runtime_lifecycle: "Runtime Lifecycle Contract",
  };
  const contract = Object.freeze({
    contractId: `llm-runtime-contract-${contractKey}`,
    contractKey,
    label: labels[contractKey],
    description: `Interface-only ${labels[contractKey]} for future runtime phases.`,
    version: LLM_PLATFORM_CONTRACT_VERSION,
    interfaceOnly: true as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  runtimeContractRegistry.set(contractKey, contract);
  return createResult(true, "Runtime contract registered.", contract);
}

export function registerLlmExtensionPoint(
  extensionPointKey: LlmExtensionPointKey,
  timestamp: string
): LlmPlatformResult<LlmExtensionPoint> {
  if (extensionPointRegistry.size >= LLM_DEFAULT_LIMITS.maxRegisteredExtensionPoints && !extensionPointRegistry.has(extensionPointKey)) {
    return createResult(false, "Extension point registry limit reached.", null);
  }
  const registryEntry = LLM_EXTENSION_REGISTRY.find((entry) => entry.phaseKey === extensionPointKey);
  const extensionPoint = Object.freeze({
    extensionPointId: registryEntry?.extensionId ?? `llm-extension-${extensionPointKey}`,
    extensionPointKey,
    label: registryEntry?.label ?? extensionPointKey,
    description: `Reserved extension point for future ${extensionPointKey} phase.`,
    version: LLM_PLATFORM_CONTRACT_VERSION,
    status: "reserved" as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(extensionPointKey, extensionPoint);
  return createResult(true, "Extension point registered.", extensionPoint);
}

export function seedDefaultLlmPlatformRegistry(timestamp: string): void {
  for (const providerKey of LLM_PROVIDER_KEYS) {
    registerLlmProvider(providerKey, timestamp);
  }
  for (const contractKey of LLM_RUNTIME_CONTRACT_KEYS) {
    registerLlmRuntimeContract(contractKey, timestamp);
  }
  for (const extensionPointKey of LLM_EXTENSION_POINT_KEYS) {
    registerLlmExtensionPoint(extensionPointKey, timestamp);
  }
}

export function isLlmProviderKey(value: string): value is LlmProviderKey {
  return (LLM_PROVIDER_KEYS as readonly string[]).includes(value);
}

export function isLlmExtensionPointKey(value: string): value is LlmExtensionPointKey {
  return (LLM_EXTENSION_POINT_KEYS as readonly string[]).includes(value);
}

export function isLlmRuntimeContractKey(value: string): value is LlmRuntimeContractKey {
  return (LLM_RUNTIME_CONTRACT_KEYS as readonly string[]).includes(value);
}
