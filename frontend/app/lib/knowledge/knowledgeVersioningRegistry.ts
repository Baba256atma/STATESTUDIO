/**
 * KNL-11 — Knowledge Versioning Platform metadata registry.
 */

import {
  KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
  KNOWLEDGE_VERSIONING_DEFAULT_LIMITS,
  KNOWLEDGE_VERSIONING_NAMESPACE,
  KNOWLEDGE_VERSIONING_OWNER,
  KNOWLEDGE_VERSIONING_PLATFORM_ID,
  VERSION_DEPENDENCY_KEYS,
  VERSION_EXTENSION_POINT_KEYS,
  VERSION_NAMESPACE_KEYS,
  VERSION_SCOPE_KEYS,
  VERSION_STATUS_KEYS,
  VERSIONED_ASSET_KNL_VERSION_MAP,
  VERSIONED_ASSET_KEYS,
  VERSIONED_ASSET_LABELS,
  VERSIONED_ASSET_PLATFORM_ID_MAP,
} from "./knowledgeVersioningCatalog.ts";
import type {
  KnowledgeVersion,
  KnowledgeVersionCompatibilityRegistrationInput,
  KnowledgeVersionRegistrationInput,
  KnowledgeVersioningPlatformSnapshot,
  KnowledgeVersioningPlatformState,
  KnowledgeVersioningResult,
  VersionCompatibility,
  VersionDependency,
  VersionExtensionPoint,
  VersionMetadata,
  VersionNamespace,
  VersionReleaseDescriptor,
  VersionStatus,
  VersionedKnowledgeAsset,
  VersionedKnowledgeAssetRegistrationInput,
} from "./knowledgeVersioningTypes.ts";
import {
  validateKnowledgeVersionCompatibilityRegistration,
  validateKnowledgeVersionRegistration,
  validateVersionedKnowledgeAssetRegistration,
} from "./knowledgeVersioningValidation.ts";
import { initializeKnowledgeValidationPlatform } from "./knowledgeValidationPlatformRegistry.ts";

export const KNOWLEDGE_VERSIONING_REGISTRY_VERSION = "KNL/11-REGISTRY-1" as const;

const versionRegistry = new Map<string, KnowledgeVersion>();
const assetRegistry = new Map<string, VersionedKnowledgeAsset>();
const compatibilityRegistry = new Map<string, VersionCompatibility>();
const dependencyRegistry = new Map<string, VersionDependency>();
const releaseRegistry = new Map<string, VersionReleaseDescriptor>();
const namespaceRegistry = new Map<string, VersionNamespace>();
const statusRegistry = new Map<string, VersionStatus>();
const extensionPointRegistry = new Map<string, VersionExtensionPoint>();
const metadataRegistry = new Map<string, VersionMetadata>();

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgeVersioningResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    namespace: KNOWLEDGE_VERSIONING_NAMESPACE,
    owner: KNOWLEDGE_VERSIONING_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetKnowledgeVersioningRegistryForTests(): void {
  versionRegistry.clear();
  assetRegistry.clear();
  compatibilityRegistry.clear();
  dependencyRegistry.clear();
  releaseRegistry.clear();
  namespaceRegistry.clear();
  statusRegistry.clear();
  extensionPointRegistry.clear();
  metadataRegistry.clear();
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isKnowledgeVersioningPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getKnowledgeVersioningPlatformState(
  timestamp: string = new Date(0).toISOString()
): KnowledgeVersioningPlatformState {
  const snapshot = getKnowledgeVersioningPlatformSnapshot();
  return Object.freeze({
    platformId: KNOWLEDGE_VERSIONING_PLATFORM_ID,
    contractVersion: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    retrievalDependency: "KNL/9",
    validationDependency: "KNL/10",
    initialized: platformInitialized,
    versionCount: snapshot.versionCount,
    assetCount: snapshot.assetCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeKnowledgeVersioningPlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeVersioningResult<KnowledgeVersioningPlatformState> {
  const validation = initializeKnowledgeValidationPlatform(timestamp);
  if (!validation.success) {
    return createResult(false, "KNL/10 Knowledge Validation Platform initialization failed.", null);
  }
  seedKnowledgeVersioningCatalog(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Knowledge versioning platform initialized.", getKnowledgeVersioningPlatformState(timestamp));
}

export function registerKnowledgeVersion(
  input: KnowledgeVersionRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeVersioningResult<KnowledgeVersion> {
  const validation = validateKnowledgeVersionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (versionRegistry.size >= KNOWLEDGE_VERSIONING_DEFAULT_LIMITS.maxRegisteredVersions) {
    return createResult(false, "Knowledge version registration limit reached.", null);
  }
  if (versionRegistry.has(input.versionId)) {
    return createResult(false, `Knowledge version already registered: ${input.versionId}.`, null);
  }
  const entry = Object.freeze({
    versionId: input.versionId,
    assetKey: input.assetKey,
    versionLabel: input.versionLabel,
    platformId: input.platformId,
    scopeKey: input.scopeKey,
    status: input.status,
    label: input.label,
    description: input.description,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-version-${input.versionId}`, timestamp),
    readOnly: true as const,
  });
  versionRegistry.set(entry.versionId, entry);
  return createResult(true, "Knowledge version registered.", entry);
}

export function registerVersionedKnowledgeAsset(
  input: VersionedKnowledgeAssetRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeVersioningResult<VersionedKnowledgeAsset> {
  const validation = validateVersionedKnowledgeAssetRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (assetRegistry.size >= KNOWLEDGE_VERSIONING_DEFAULT_LIMITS.maxRegisteredAssets) {
    return createResult(false, "Versioned knowledge asset registration limit reached.", null);
  }
  if (assetRegistry.has(input.assetId)) {
    return createResult(false, `Versioned knowledge asset already registered: ${input.assetId}.`, null);
  }
  const duplicateName = [...assetRegistry.values()].some(
    (entry) => entry.assetName.trim().toLowerCase() === input.assetName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Versioned asset name already registered: ${input.assetName}.`, null);
  }
  const entry = Object.freeze({
    assetId: input.assetId,
    assetKey: input.assetKey,
    assetName: input.assetName,
    platformId: input.platformId,
    versionLabel: input.versionLabel,
    scopeKey: input.scopeKey,
    status: input.status,
    label: input.label,
    description: input.description,
    lineage: Object.freeze({
      lineageId: `version-lineage-${input.assetId}`,
      assetKey: input.assetKey,
      versionLabel: input.versionLabel,
      description: input.lineageDescription,
      readOnly: true as const,
    }),
    changeDescriptor: Object.freeze({
      changeId: `version-change-${input.assetId}`,
      label: `${input.label} Change`,
      description: input.changeDescription,
      readOnly: true as const,
    }),
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-asset-${input.assetId}`, timestamp),
    readOnly: true as const,
  });
  assetRegistry.set(entry.assetId, entry);
  return createResult(true, "Versioned knowledge asset registered.", entry);
}

export function registerKnowledgeVersionCompatibility(
  input: KnowledgeVersionCompatibilityRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeVersioningResult<VersionCompatibility> {
  const validation = validateKnowledgeVersionCompatibilityRegistration(
    input,
    [...versionRegistry.values()].map((entry) => entry.versionLabel)
  );
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (compatibilityRegistry.size >= KNOWLEDGE_VERSIONING_DEFAULT_LIMITS.maxRegisteredCompatibilities) {
    return createResult(false, "Version compatibility registration limit reached.", null);
  }
  if (compatibilityRegistry.has(input.compatibilityId)) {
    return createResult(false, `Version compatibility already registered: ${input.compatibilityId}.`, null);
  }
  const entry = Object.freeze({
    compatibilityId: input.compatibilityId,
    assetKey: input.assetKey,
    versionLabel: input.versionLabel,
    compatibleWithVersion: input.compatibleWithVersion,
    platformId: input.platformId,
    label: input.label,
    description: input.description,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-compatibility-${input.compatibilityId}`, timestamp),
    readOnly: true as const,
  });
  compatibilityRegistry.set(entry.compatibilityId, entry);
  return createResult(true, "Knowledge version compatibility registered.", entry);
}

function registerVersionDependency(
  dependencyKey: (typeof VERSION_DEPENDENCY_KEYS)[number],
  assetKey: (typeof VERSIONED_ASSET_KEYS)[number],
  timestamp: string
): KnowledgeVersioningResult<VersionDependency> {
  const dependencyId = `version-dependency-${dependencyKey.replace("/", "-").toLowerCase()}-${assetKey}`;
  if (dependencyRegistry.has(dependencyId)) {
    return createResult(false, `Version dependency already registered: ${dependencyId}.`, null);
  }
  const entry = Object.freeze({
    dependencyId,
    dependencyKey,
    assetKey,
    label: dependencyKey,
    description: `${dependencyKey} version dependency metadata for ${VERSIONED_ASSET_LABELS[assetKey]}.`,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-dependency-${dependencyKey.replace("/", "-")}-${assetKey}`, timestamp),
    readOnly: true as const,
  });
  dependencyRegistry.set(entry.dependencyId, entry);
  return createResult(true, "Version dependency registered.", entry);
}

function registerVersionRelease(
  assetKey: (typeof VERSIONED_ASSET_KEYS)[number],
  versionLabel: string,
  timestamp: string
): KnowledgeVersioningResult<VersionReleaseDescriptor> {
  const releaseId = `version-release-${assetKey}`;
  if (releaseRegistry.has(releaseId)) {
    return createResult(false, `Version release already registered: ${releaseId}.`, null);
  }
  const entry = Object.freeze({
    releaseId,
    assetKey,
    versionLabel,
    label: `${VERSIONED_ASSET_LABELS[assetKey]} Release`,
    description: `Release descriptor metadata for ${VERSIONED_ASSET_LABELS[assetKey]} at ${versionLabel} (not executable).`,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-release-${assetKey}`, timestamp),
    readOnly: true as const,
  });
  releaseRegistry.set(entry.releaseId, entry);
  return createResult(true, "Version release registered.", entry);
}

function registerVersionNamespace(
  namespaceKey: (typeof VERSION_NAMESPACE_KEYS)[number],
  timestamp: string
): KnowledgeVersioningResult<VersionNamespace> {
  const namespaceId = `version-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Version namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} version namespace metadata.`,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Version namespace registered.", entry);
}

function registerVersionStatus(
  statusKey: (typeof VERSION_STATUS_KEYS)[number],
  timestamp: string
): KnowledgeVersioningResult<VersionStatus> {
  const statusId = `version-status-${statusKey}`;
  if (statusRegistry.has(statusId)) {
    return createResult(false, `Version status already registered: ${statusId}.`, null);
  }
  const entry = Object.freeze({
    statusId,
    statusKey,
    label: statusKey,
    description: `${statusKey} version status metadata.`,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-status-${statusKey}`, timestamp),
    readOnly: true as const,
  });
  statusRegistry.set(entry.statusId, entry);
  return createResult(true, "Version status registered.", entry);
}

function registerVersionExtensionPoint(
  extensionPointKey: (typeof VERSION_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): KnowledgeVersioningResult<VersionExtensionPoint> {
  const extensionPointId = `version-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Version extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} version extension point metadata.`,
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Version extension point registered.", entry);
}

export function getKnowledgeVersioningPlatformSnapshot(): KnowledgeVersioningPlatformSnapshot {
  return Object.freeze({
    platformVersion: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    versionCount: versionRegistry.size,
    assetCount: assetRegistry.size,
    compatibilityCount: compatibilityRegistry.size,
    dependencyCount: dependencyRegistry.size,
    releaseCount: releaseRegistry.size,
    namespaceCount: namespaceRegistry.size || VERSION_NAMESPACE_KEYS.length,
    statusCount: statusRegistry.size || VERSION_STATUS_KEYS.length,
    readOnly: true as const,
  });
}

export function getKnowledgeVersioningPlatformRegistry(): Readonly<{
  versions: readonly KnowledgeVersion[];
  assets: readonly VersionedKnowledgeAsset[];
  compatibilities: readonly VersionCompatibility[];
  dependencies: readonly VersionDependency[];
  releases: readonly VersionReleaseDescriptor[];
  namespaces: readonly VersionNamespace[];
  statuses: readonly VersionStatus[];
  extensionPoints: readonly VersionExtensionPoint[];
  metadataRecords: readonly VersionMetadata[];
  snapshot: KnowledgeVersioningPlatformSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    versions: Object.freeze(
      [...versionRegistry.values()].sort((a, b) => a.versionId.localeCompare(b.versionId))
    ),
    assets: Object.freeze(
      [...assetRegistry.values()].sort((a, b) => a.assetId.localeCompare(b.assetId))
    ),
    compatibilities: Object.freeze(
      [...compatibilityRegistry.values()].sort((a, b) => a.compatibilityId.localeCompare(b.compatibilityId))
    ),
    dependencies: Object.freeze(
      [...dependencyRegistry.values()].sort((a, b) => a.dependencyId.localeCompare(b.dependencyId))
    ),
    releases: Object.freeze(
      [...releaseRegistry.values()].sort((a, b) => a.releaseId.localeCompare(b.releaseId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    statuses: Object.freeze(
      [...statusRegistry.values()].sort((a, b) => a.statusId.localeCompare(b.statusId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getKnowledgeVersioningPlatformSnapshot(),
    readOnly: true as const,
  });
}

export function seedKnowledgeVersioningCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (versionRegistry.size > 0) {
    return;
  }
  for (const namespaceKey of VERSION_NAMESPACE_KEYS) {
    registerVersionNamespace(namespaceKey, timestamp);
  }
  for (const statusKey of VERSION_STATUS_KEYS) {
    registerVersionStatus(statusKey, timestamp);
  }
  for (const extensionPointKey of VERSION_EXTENSION_POINT_KEYS) {
    registerVersionExtensionPoint(extensionPointKey, timestamp);
  }
  for (const assetKey of VERSIONED_ASSET_KEYS) {
    const versionLabel = VERSIONED_ASSET_KNL_VERSION_MAP[assetKey];
    const platformId = VERSIONED_ASSET_PLATFORM_ID_MAP[assetKey];
    const versionId = `knowledge-version-${assetKey}`;
    const assetId = `versioned-asset-${assetKey}`;
    registerKnowledgeVersion(
      Object.freeze({
        versionId,
        assetKey,
        versionLabel,
        platformId,
        scopeKey: "platform",
        status: "active",
        label: `${VERSIONED_ASSET_LABELS[assetKey]} Version`,
        description: `Version metadata for ${VERSIONED_ASSET_LABELS[assetKey]} at ${versionLabel}.`,
      }),
      timestamp
    );
    registerVersionedKnowledgeAsset(
      Object.freeze({
        assetId,
        assetKey,
        assetName: assetKey,
        platformId,
        versionLabel,
        scopeKey: "registry",
        status: "active",
        label: `${VERSIONED_ASSET_LABELS[assetKey]} Asset`,
        description: `Versioned asset metadata for ${VERSIONED_ASSET_LABELS[assetKey]}.`,
        lineageDescription: `Lineage metadata for ${VERSIONED_ASSET_LABELS[assetKey]} at ${versionLabel}.`,
        changeDescription: `Change descriptor metadata for ${VERSIONED_ASSET_LABELS[assetKey]} (no mutation).`,
      }),
      timestamp
    );
    registerVersionRelease(assetKey, versionLabel, timestamp);
    registerVersionDependency(versionLabel as (typeof VERSION_DEPENDENCY_KEYS)[number], assetKey, timestamp);
    registerKnowledgeVersionCompatibility(
      Object.freeze({
        compatibilityId: `version-compatibility-${assetKey}`,
        assetKey,
        versionLabel,
        compatibleWithVersion: versionLabel,
        platformId,
        label: `${VERSIONED_ASSET_LABELS[assetKey]} Self Compatibility`,
        description: `Compatibility metadata for ${VERSIONED_ASSET_LABELS[assetKey]} at ${versionLabel}.`,
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("knowledge-versioning-platform-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const KnowledgeVersioningRegistry = Object.freeze({
  resetKnowledgeVersioningRegistryForTests,
  initializeKnowledgeVersioningPlatform,
  registerKnowledgeVersion,
  registerVersionedKnowledgeAsset,
  registerKnowledgeVersionCompatibility,
  getKnowledgeVersioningPlatformRegistry,
  getKnowledgeVersioningPlatformSnapshot,
  seedKnowledgeVersioningCatalog,
});
