/**
 * SMM-2 — Immutable domain, contract, artifact, version, and extension registries.
 */

import { SMM_EXTENSION_POINT_KEYS, SMM_PLATFORM_CONTRACT_VERSION } from "./smmPlatformContracts.ts";
import { buildSmmPlatformFoundation } from "./smmPlatformExports.ts";
import {
  SMM_DOMAIN_ARTIFACT_KEYS,
  SMM_DOMAIN_CONTRACT_VERSION,
  SMM_DOMAIN_DEFAULT_LIMITS,
  SMM_DOMAIN_FOUNDATION_DEPENDENCY,
  SMM_DOMAIN_MANDATORY_IDENTITY_FIELDS,
  SMM_DOMAIN_MODEL_KEYS,
  SMM_DOMAIN_MODEL_LABELS,
  SMM_DOMAIN_VIEW_KEYS,
} from "./sharedMentalModelContracts.ts";
import type {
  SharedMentalModelArtifactKey,
  SharedMentalModelArtifactRegistration,
  SharedMentalModelContractRegistry,
  SharedMentalModelContractRegistration,
  SharedMentalModelDomainKey,
  SharedMentalModelDomainRegistration,
  SharedMentalModelExtensionRegistration,
  SharedMentalModelVersionRegistration,
} from "./sharedMentalModelTypes.ts";

const domainRegistry: SharedMentalModelDomainRegistration[] = [];
const contractRegistry: SharedMentalModelContractRegistration[] = [];
const artifactRegistry: SharedMentalModelArtifactRegistration[] = [];
const versionRegistry: SharedMentalModelVersionRegistration[] = [];
const extensionRegistry: SharedMentalModelExtensionRegistration[] = [];

let registryFrozen = false;

function resolveMandatoryFields(domainKey: SharedMentalModelDomainKey): readonly string[] {
  if (domainKey === "model_metadata") {
    return Object.freeze(["metadataId", "contractVersion", "foundationVersion", "label", "createdAt", "readOnly"]);
  }
  if (domainKey === "model_version") {
    return Object.freeze(["versionId", "modelId", "versionLabel", "compatibility", "metadata", "readOnly"]);
  }
  if ((SMM_DOMAIN_VIEW_KEYS as readonly string[]).includes(domainKey)) {
    return Object.freeze(["viewId", "modelId", "summaryRef", "metadata", "readOnly"]);
  }
  return SMM_DOMAIN_MANDATORY_IDENTITY_FIELDS;
}

function buildDomainRegistration(
  domainKey: SharedMentalModelDomainKey,
  timestamp: string
): SharedMentalModelDomainRegistration {
  return Object.freeze({
    domainId: `smm-domain-${domainKey}`,
    domainKey,
    label: SMM_DOMAIN_MODEL_LABELS[domainKey],
    description: `Interface-only ${SMM_DOMAIN_MODEL_LABELS[domainKey]} domain contract.`,
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    foundationVersion: SMM_DOMAIN_FOUNDATION_DEPENDENCY,
    mandatoryFields: resolveMandatoryFields(domainKey),
    interfaceOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildContractRegistration(
  domainKey: SharedMentalModelDomainKey,
  timestamp: string
): SharedMentalModelContractRegistration {
  return Object.freeze({
    contractId: `smm-contract-${domainKey}`,
    domainKey,
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    label: SMM_DOMAIN_MODEL_LABELS[domainKey],
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildArtifactRegistration(
  artifactKey: SharedMentalModelArtifactKey,
  timestamp: string
): SharedMentalModelArtifactRegistration {
  return Object.freeze({
    artifactId: `smm-artifact-${artifactKey}`,
    artifactKey,
    domainKey: artifactKey,
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildVersionRegistration(timestamp: string): SharedMentalModelVersionRegistration {
  return Object.freeze({
    versionEntryId: "smm-version-entry-default",
    modelVersion: SMM_DOMAIN_CONTRACT_VERSION,
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    foundationVersion: SMM_DOMAIN_FOUNDATION_DEPENDENCY,
    compatibility: Object.freeze([SMM_PLATFORM_CONTRACT_VERSION, SMM_DOMAIN_CONTRACT_VERSION]),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildExtensionRegistration(
  extensionPointKey: string,
  domainKey: SharedMentalModelDomainKey,
  timestamp: string
): SharedMentalModelExtensionRegistration {
  return Object.freeze({
    extensionId: `smm-extension-${extensionPointKey}-${domainKey}`,
    extensionPointKey,
    domainKey,
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    compatible: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function resetSharedMentalModelRegistryForTests(): void {
  domainRegistry.length = 0;
  contractRegistry.length = 0;
  artifactRegistry.length = 0;
  versionRegistry.length = 0;
  extensionRegistry.length = 0;
  registryFrozen = false;
}

export function seedSharedMentalModelRegistries(timestamp: string): void {
  if (registryFrozen) {
    return;
  }
  for (const domainKey of SMM_DOMAIN_MODEL_KEYS) {
    if (domainRegistry.length < SMM_DOMAIN_DEFAULT_LIMITS.maxDomainEntries) {
      domainRegistry.push(buildDomainRegistration(domainKey, timestamp));
    }
    if (contractRegistry.length < SMM_DOMAIN_DEFAULT_LIMITS.maxContractEntries) {
      contractRegistry.push(buildContractRegistration(domainKey, timestamp));
    }
  }
  for (const artifactKey of SMM_DOMAIN_ARTIFACT_KEYS) {
    if (artifactRegistry.length < SMM_DOMAIN_DEFAULT_LIMITS.maxArtifactEntries) {
      artifactRegistry.push(buildArtifactRegistration(artifactKey, timestamp));
    }
  }
  if (versionRegistry.length < SMM_DOMAIN_DEFAULT_LIMITS.maxVersionEntries) {
    versionRegistry.push(buildVersionRegistration(timestamp));
  }
  for (const extensionPointKey of SMM_EXTENSION_POINT_KEYS) {
    if (extensionRegistry.length >= SMM_DOMAIN_DEFAULT_LIMITS.maxExtensionEntries) {
      break;
    }
    extensionRegistry.push(buildExtensionRegistration(extensionPointKey, "mental_model", timestamp));
  }
  registryFrozen = true;
}

export function getSharedMentalModelContractRegistry(): SharedMentalModelContractRegistry {
  return Object.freeze({
    domainRegistry: Object.freeze([...domainRegistry]),
    domainCount: domainRegistry.length,
    contractRegistry: Object.freeze([...contractRegistry]),
    contractCount: contractRegistry.length,
    artifactRegistry: Object.freeze([...artifactRegistry]),
    artifactCount: artifactRegistry.length,
    versionRegistry: Object.freeze([...versionRegistry]),
    versionCount: versionRegistry.length,
    extensionRegistry: Object.freeze([...extensionRegistry]),
    extensionCount: extensionRegistry.length,
    readOnly: true as const,
  });
}

export function ensureSharedMentalModelDependenciesReady(timestamp: string): boolean {
  const foundation = buildSmmPlatformFoundation(timestamp);
  return foundation.success;
}

export function isSharedMentalModelRegistryFrozen(): boolean {
  return registryFrozen;
}

export function isSharedMentalModelDomainKey(value: string): value is SharedMentalModelDomainKey {
  return (SMM_DOMAIN_MODEL_KEYS as readonly string[]).includes(value);
}

export function isSharedMentalModelArtifactKey(value: string): value is SharedMentalModelArtifactKey {
  return (SMM_DOMAIN_ARTIFACT_KEYS as readonly string[]).includes(value);
}
