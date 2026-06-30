/**
 * SMM-1 — Platform registry for scopes, artifact types, model contracts, and extension points.
 */

import {
  SMM_DEFAULT_LIMITS,
  SMM_EXTENSION_POINT_KEYS,
  SMM_EXTENSION_REGISTRY,
  SMM_MODEL_ARTIFACT_TYPE_KEYS,
  SMM_MODEL_ARTIFACT_TYPE_LABELS,
  SMM_MODEL_CONTRACT_KEYS,
  SMM_MODEL_CONTRACT_LABELS,
  SMM_MODEL_SCOPE_KEYS,
  SMM_MODEL_SCOPE_LABELS,
  SMM_PLATFORM_CONTRACT_VERSION,
  SMM_PLATFORM_SOURCE,
} from "./smmPlatformContracts.ts";
import type {
  SmmExtensionPoint,
  SmmExtensionPointKey,
  SmmModelArtifactTypeContract,
  SmmModelArtifactTypeKey,
  SmmModelContract,
  SmmModelContractKey,
  SmmModelScopeContract,
  SmmModelScopeKey,
  SmmPlatformRegistry,
  SmmPlatformRegistrySnapshot,
  SmmPlatformResult,
} from "./smmPlatformTypes.ts";

const scopeRegistry = new Map<string, SmmModelScopeContract>();
const artifactTypeRegistry = new Map<string, SmmModelArtifactTypeContract>();
const modelContractRegistry = new Map<string, SmmModelContract>();
const extensionPointRegistry = new Map<string, SmmExtensionPoint>();

function createMetadata(timestamp: string) {
  return Object.freeze({
    metadataId: `smm-metadata-${timestamp}`,
    metadataVersion: SMM_PLATFORM_CONTRACT_VERSION,
    owner: SMM_PLATFORM_SOURCE,
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function createResult<T>(success: boolean, reason: string, data: T | null): SmmPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetSmmPlatformRegistryForTests(): void {
  scopeRegistry.clear();
  artifactTypeRegistry.clear();
  modelContractRegistry.clear();
  extensionPointRegistry.clear();
}

export function getSmmPlatformRegistrySnapshot(): SmmPlatformRegistrySnapshot {
  return Object.freeze({
    scopeCount: scopeRegistry.size,
    artifactTypeCount: artifactTypeRegistry.size,
    modelContractCount: modelContractRegistry.size,
    extensionPointCount: extensionPointRegistry.size,
    readOnly: true as const,
  });
}

export function getSmmPlatformRegistry(): SmmPlatformRegistry {
  return Object.freeze({
    scopes: Object.freeze([...scopeRegistry.values()]),
    artifactTypes: Object.freeze([...artifactTypeRegistry.values()]),
    modelContracts: Object.freeze([...modelContractRegistry.values()]),
    extensionPoints: Object.freeze([...extensionPointRegistry.values()]),
    snapshot: getSmmPlatformRegistrySnapshot(),
    readOnly: true as const,
  });
}

export function registerSmmModelScope(
  scopeKey: SmmModelScopeKey,
  timestamp: string
): SmmPlatformResult<SmmModelScopeContract> {
  if (scopeRegistry.size >= SMM_DEFAULT_LIMITS.maxRegisteredScopes && !scopeRegistry.has(scopeKey)) {
    return createResult(false, "Model scope registry limit reached.", null);
  }
  const contract = Object.freeze({
    scopeId: `smm-scope-${scopeKey}`,
    scopeKey,
    label: SMM_MODEL_SCOPE_LABELS[scopeKey],
    description: `Canonical ${SMM_MODEL_SCOPE_LABELS[scopeKey]} for shared mental model references.`,
    version: SMM_PLATFORM_CONTRACT_VERSION,
    referenceOnly: true as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  scopeRegistry.set(scopeKey, contract);
  return createResult(true, "Model scope contract registered.", contract);
}

export function registerSmmModelArtifactType(
  artifactTypeKey: SmmModelArtifactTypeKey,
  timestamp: string
): SmmPlatformResult<SmmModelArtifactTypeContract> {
  if (artifactTypeRegistry.size >= SMM_DEFAULT_LIMITS.maxRegisteredArtifactTypes && !artifactTypeRegistry.has(artifactTypeKey)) {
    return createResult(false, "Model artifact type registry limit reached.", null);
  }
  const contract = Object.freeze({
    artifactTypeId: `smm-artifact-type-${artifactTypeKey}`,
    artifactTypeKey,
    label: SMM_MODEL_ARTIFACT_TYPE_LABELS[artifactTypeKey],
    description: `Declarative ${SMM_MODEL_ARTIFACT_TYPE_LABELS[artifactTypeKey]} — no inference implementation.`,
    version: SMM_PLATFORM_CONTRACT_VERSION,
    declarativeOnly: true as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  artifactTypeRegistry.set(artifactTypeKey, contract);
  return createResult(true, "Model artifact type contract registered.", contract);
}

export function registerSmmModelContract(
  contractKey: SmmModelContractKey,
  timestamp: string
): SmmPlatformResult<SmmModelContract> {
  if (modelContractRegistry.size >= SMM_DEFAULT_LIMITS.maxRegisteredModelContracts && !modelContractRegistry.has(contractKey)) {
    return createResult(false, "Model contract registry limit reached.", null);
  }
  const contract = Object.freeze({
    contractId: `smm-model-contract-${contractKey}`,
    contractKey,
    label: SMM_MODEL_CONTRACT_LABELS[contractKey],
    description: `Interface-only ${SMM_MODEL_CONTRACT_LABELS[contractKey]} for future SMM phases.`,
    version: SMM_PLATFORM_CONTRACT_VERSION,
    interfaceOnly: true as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  modelContractRegistry.set(contractKey, contract);
  return createResult(true, "Model contract registered.", contract);
}

export function registerSmmExtensionPoint(
  extensionPointKey: SmmExtensionPointKey,
  timestamp: string
): SmmPlatformResult<SmmExtensionPoint> {
  if (extensionPointRegistry.size >= SMM_DEFAULT_LIMITS.maxRegisteredExtensionPoints && !extensionPointRegistry.has(extensionPointKey)) {
    return createResult(false, "Extension point registry limit reached.", null);
  }
  const registryEntry = SMM_EXTENSION_REGISTRY.find((entry) => entry.phaseKey === extensionPointKey);
  const extensionPoint = Object.freeze({
    extensionPointId: registryEntry?.extensionId ?? `smm-extension-${extensionPointKey}`,
    extensionPointKey,
    label: registryEntry?.label ?? extensionPointKey,
    description: `Reserved extension point for future ${extensionPointKey} phase.`,
    version: SMM_PLATFORM_CONTRACT_VERSION,
    status: "reserved" as const,
    metadata: createMetadata(timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(extensionPointKey, extensionPoint);
  return createResult(true, "Extension point registered.", extensionPoint);
}

export function seedDefaultSmmPlatformRegistry(timestamp: string): void {
  for (const scopeKey of SMM_MODEL_SCOPE_KEYS) {
    registerSmmModelScope(scopeKey, timestamp);
  }
  for (const artifactTypeKey of SMM_MODEL_ARTIFACT_TYPE_KEYS) {
    registerSmmModelArtifactType(artifactTypeKey, timestamp);
  }
  for (const contractKey of SMM_MODEL_CONTRACT_KEYS) {
    registerSmmModelContract(contractKey, timestamp);
  }
  for (const extensionPointKey of SMM_EXTENSION_POINT_KEYS) {
    registerSmmExtensionPoint(extensionPointKey, timestamp);
  }
}

export function isSmmModelScopeKey(value: string): value is SmmModelScopeKey {
  return (SMM_MODEL_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isSmmModelArtifactTypeKey(value: string): value is SmmModelArtifactTypeKey {
  return (SMM_MODEL_ARTIFACT_TYPE_KEYS as readonly string[]).includes(value);
}

export function isSmmModelContractKey(value: string): value is SmmModelContractKey {
  return (SMM_MODEL_CONTRACT_KEYS as readonly string[]).includes(value);
}

export function isSmmExtensionPointKey(value: string): value is SmmExtensionPointKey {
  return (SMM_EXTENSION_POINT_KEYS as readonly string[]).includes(value);
}
