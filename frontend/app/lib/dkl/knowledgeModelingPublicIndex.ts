/**
 * DKL-4:9 — Knowledge Modeling Public Index.
 *
 * The sole canonical, immutable public release surface for the complete DKL-4
 * Knowledge Modeling Platform (DKL-4:1 through DKL-4:8). Future consumers must
 * import DKL-4 only through this module.
 *
 * Depends exclusively on DKL-4:8 Freeze public APIs. Every prior-phase surface
 * is reached by reference through Freeze — never duplicated, never recreated.
 *
 * Ownership: owned exclusively by DKL-4:9.
 * Metadata only. Release surface only. Zero runtime behavior.
 */

import {
  KnowledgeModelingFreeze,
  KnowledgeModelingFreezeIdentity,
  KnowledgeModelingFreezeVersion,
  KnowledgeModelingFreezeLocks,
} from "./knowledgeModelingFreeze.ts";
import * as freezeModule from "./knowledgeModelingFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type ReleaseStatusValue = "Released";
type CertificationStatusValue = "Certified";
type FreezeStatusValue = "Frozen";
type StabilityValue = "Stable";

interface PublicApiEntry {
  readonly id: string;
  readonly exportName: string;
  readonly sourcePhase: string;
  readonly sourceSection: string;
  readonly kind: "aggregate" | "identity" | "version" | "namespace" | "collection" | "helper" | "status" | "registry";
  readonly version: string;
  readonly namespace: string;
  readonly owner: string;
  readonly visibility: "Public";
  readonly stability: StabilityValue;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly compatibility: "Compatible";
  readonly deprecated: false;
  readonly replacement: null;
  readonly publicEntryPoint: "knowledgeModelingPublicIndex.ts";
  readonly metadataOnly: true;
  readonly runtimeBehavior: "Forbidden";
}

interface PublicIndexSummaryDescriptor {
  readonly identity: string;
  readonly version: string;
  readonly namespace: string;
  readonly name: string;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly stability: StabilityValue;
  readonly readiness: "ReadyForConsumer";
  readonly nextPhaseReadiness: "ReadyForDKL5";
  readonly sectionCount: 9;
  readonly publicApiCount: number;
  readonly solePublicEntryPoint: "knowledgeModelingPublicIndex.ts";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

interface PublicReleaseMetadataDescriptor {
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly namespace: string;
  readonly phase: "DKL-4:9";
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly stability: StabilityValue;
  readonly consumerReadiness: "ReadyForConsumer";
  readonly nextPhaseReadiness: "ReadyForDKL5";
  readonly publicApiCount: number;
  readonly namespaceSectionCount: 9;
  readonly solePublicEntryPoint: "knowledgeModelingPublicIndex.ts";
  readonly freezeVersion: string;
  readonly platformVersion: string;
  readonly lockIdentifier: string;
  readonly Released: true;
  readonly Certified: true;
  readonly Frozen: true;
  readonly Stable: true;
  readonly ReadyForConsumer: true;
  readonly ReadyForDKL5: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-4:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = KnowledgeModelingFreeze;
const certifiedPlatform = freeze.certifiedPlatform;
const certificationSurface = freeze.certification;

const FOUNDATION_APIS = Object.freeze([
  "KnowledgeModelingFoundation",
  "KnowledgeModelingFoundationVersion",
  "KnowledgeModelingFoundationIdentity",
  "KnowledgeModelingContracts",
  "KnowledgeModelingOwnership",
  "KnowledgeModelingBoundaries",
  "KnowledgeModelingLifecycle",
  "KnowledgeModelingDependencies",
] as const);

const REGISTRY_APIS = Object.freeze([
  "KnowledgeModelingRegistry",
  "KnowledgeModelingRegistryIdentity",
  "KnowledgeModelingRegistryVersion",
  "KnowledgeModelingRegistryNamespace",
  "KnowledgeModelingRegistryCollections",
  "KnowledgeModelingRegistryOwnership",
  "KnowledgeModelingRegistryDependencies",
  "KnowledgeModelingRegistrySummary",
] as const);

const MODEL_APIS = Object.freeze([
  "KnowledgeModelingModel",
  "KnowledgeModelingModelIdentity",
  "KnowledgeModelingModelVersion",
  "KnowledgeModelingModelNamespace",
  "KnowledgeModelingModelCatalog",
  "KnowledgeModelingModelRelationships",
  "KnowledgeModelingModelOwnership",
  "KnowledgeModelingModelDependencies",
] as const);

const VALIDATION_APIS = Object.freeze([
  "KnowledgeModelingValidation",
  "KnowledgeModelingValidationIdentity",
  "KnowledgeModelingValidationVersion",
  "KnowledgeModelingValidationNamespace",
  "KnowledgeModelingValidationRules",
  "KnowledgeModelingValidationOwnership",
  "KnowledgeModelingValidationReport",
  "validateKnowledgeModelingArchitecture",
] as const);

const MANIFEST_APIS = Object.freeze([
  "KnowledgeModelingManifest",
  "KnowledgeModelingManifestIdentity",
  "KnowledgeModelingManifestVersion",
  "KnowledgeModelingManifestNamespace",
  "KnowledgeModelingManifestInventory",
  "KnowledgeModelingManifestDependencies",
  "getKnowledgeModelingManifestSummary",
  "getKnowledgeModelingManifestStatistics",
] as const);

const PLATFORM_APIS = Object.freeze([
  "KnowledgeModelingPlatform",
  "KnowledgeModelingPlatformIdentity",
  "KnowledgeModelingPlatformVersion",
  "KnowledgeModelingPlatformNamespace",
  "KnowledgeModelingPlatformComponents",
  "KnowledgeModelingPlatformReadiness",
  "getKnowledgeModelingPlatformSummary",
  "getKnowledgeModelingPlatformStatus",
] as const);

const CERTIFICATION_APIS = Object.freeze([
  "KnowledgeModelingCertification",
  "KnowledgeModelingCertificationIdentity",
  "KnowledgeModelingCertificationVersion",
  "KnowledgeModelingCertificationNamespace",
  "KnowledgeModelingCertificationGates",
  "KnowledgeModelingCertificationEvidence",
  "runKnowledgeModelingCertification",
  "getKnowledgeModelingCertificationSummary",
] as const);

const FREEZE_APIS = Object.freeze([
  "KnowledgeModelingFreeze",
  "KnowledgeModelingFreezeIdentity",
  "KnowledgeModelingFreezeVersion",
  "KnowledgeModelingFreezeNamespace",
  "KnowledgeModelingFreezeComponents",
  "KnowledgeModelingFreezeLocks",
  "getKnowledgeModelingFreezeSummary",
  "getKnowledgeModelingFreezeStatus",
] as const);

const PUBLIC_INDEX_APIS = Object.freeze([
  "KnowledgeModelingPlatformPublicFoundation",
  "KnowledgeModelingPublicApiRegistry",
  "KnowledgeModelingPublicIndexId",
  "KnowledgeModelingPublicIndexVersion",
  "KnowledgeModelingPublicIndexName",
  "KnowledgeModelingPublicIndexNamespace",
  "KnowledgeModelingPublicReleaseStatus",
  "KnowledgeModelingPublicCertificationStatus",
  "KnowledgeModelingPublicFreezeStatus",
  "getKnowledgeModelingPublicSummary",
  "getKnowledgeModelingPublicApiCount",
  "getKnowledgeModelingPublicReleaseMetadata",
] as const);

const kindFor = (exportName: string): PublicApiEntry["kind"] => {
  if (exportName.startsWith("get") || exportName.startsWith("run") || exportName.startsWith("validate")) {
    return "helper";
  }
  if (exportName.endsWith("Version")) return "version";
  if (exportName.endsWith("Namespace")) return "namespace";
  if (exportName.endsWith("Identity") || exportName.endsWith("Id") || exportName.endsWith("Name")) {
    return "identity";
  }
  if (
    exportName.endsWith("Status") ||
    exportName.endsWith("Readiness") ||
    exportName.endsWith("Report")
  ) {
    return "status";
  }
  if (
    exportName.endsWith("Registry") ||
    exportName.endsWith("Collections") ||
    exportName.endsWith("Catalog") ||
    exportName.endsWith("Gates") ||
    exportName.endsWith("Evidence") ||
    exportName.endsWith("Locks") ||
    exportName.endsWith("Components") ||
    exportName.endsWith("Inventory") ||
    exportName.endsWith("Rules")
  ) {
    return "registry";
  }
  if (
    exportName.endsWith("Ownership") ||
    exportName.endsWith("Dependencies") ||
    exportName.endsWith("Relationships") ||
    exportName.endsWith("Contracts") ||
    exportName.endsWith("Boundaries") ||
    exportName.endsWith("Lifecycle")
  ) {
    return "collection";
  }
  return "aggregate";
};

const sectionFor = (sourcePhase: string): string => {
  const map: Record<string, string> = {
    "DKL-4:1": "foundation",
    "DKL-4:2": "registry",
    "DKL-4:3": "model",
    "DKL-4:4": "validation",
    "DKL-4:5": "manifest",
    "DKL-4:6": "platform",
    "DKL-4:7": "certification",
    "DKL-4:8": "freeze",
    "DKL-4:9": "publicIndex",
  };
  return map[sourcePhase] ?? "publicIndex";
};

const api = (
  exportName: string,
  sourcePhase: string,
  owner: string,
  namespace: string,
): PublicApiEntry =>
  Object.freeze({
    id: `${sourcePhase}/${exportName}`,
    exportName,
    sourcePhase,
    sourceSection: sectionFor(sourcePhase),
    kind: kindFor(exportName),
    version: "1.0.0",
    namespace,
    owner,
    visibility: "Public" as const,
    stability: "Stable" as const,
    releaseStatus: "Released" as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    compatibility: "Compatible" as const,
    deprecated: false as const,
    replacement: null,
    publicEntryPoint: "knowledgeModelingPublicIndex.ts" as const,
    metadataOnly: true as const,
    runtimeBehavior: "Forbidden" as const,
  });

const phaseEntries = (
  names: readonly string[],
  sourcePhase: string,
  owner: string,
  namespace: string,
): readonly PublicApiEntry[] =>
  Object.freeze(names.map((name) => api(name, sourcePhase, owner, namespace)));

const PUBLIC_API_ENTRIES: readonly PublicApiEntry[] = Object.freeze([
  ...phaseEntries(
    FOUNDATION_APIS,
    "DKL-4:1",
    "DKL-4 Knowledge Modeling Foundation",
    "nexora.dkl.knowledge-modeling.foundation",
  ),
  ...phaseEntries(
    REGISTRY_APIS,
    "DKL-4:2",
    "DKL-4 Knowledge Modeling Registry",
    "nexora.dkl.knowledge-modeling.registry",
  ),
  ...phaseEntries(
    MODEL_APIS,
    "DKL-4:3",
    "DKL-4 Knowledge Modeling Model",
    "nexora.dkl.knowledge-modeling.model",
  ),
  ...phaseEntries(
    VALIDATION_APIS,
    "DKL-4:4",
    "DKL-4 Knowledge Modeling Validation",
    "nexora.dkl.knowledge-modeling.validation",
  ),
  ...phaseEntries(
    MANIFEST_APIS,
    "DKL-4:5",
    "DKL-4 Knowledge Modeling Manifest",
    "nexora.dkl.knowledge-modeling.manifest",
  ),
  ...phaseEntries(
    PLATFORM_APIS,
    "DKL-4:6",
    "DKL-4 Knowledge Modeling Platform",
    "nexora.dkl.knowledge-modeling.platform",
  ),
  ...phaseEntries(
    CERTIFICATION_APIS,
    "DKL-4:7",
    "DKL-4 Knowledge Modeling Certification",
    "nexora.dkl.knowledge-modeling.certification",
  ),
  ...phaseEntries(
    FREEZE_APIS,
    "DKL-4:8",
    "DKL-4 Knowledge Modeling Freeze",
    "nexora.dkl.knowledge-modeling.freeze",
  ),
  ...phaseEntries(
    PUBLIC_INDEX_APIS,
    "DKL-4:9",
    "DKL-4 Knowledge Modeling Public Index",
    "nexora.dkl.knowledge-modeling.public",
  ),
]);

/** Immutable registry of every released public API from DKL-4:1 through DKL-4:9. */
export const KnowledgeModelingPublicApiRegistry = Object.freeze({
  registryId: "DKL-4:9/PublicApiRegistry",
  entries: PUBLIC_API_ENTRIES,
  entryCount: PUBLIC_API_ENTRIES.length,
  releasedPhases: 9 as const,
  releasedPublicApiCount: PUBLIC_API_ENTRIES.length,
  exportNames: Object.freeze(PUBLIC_API_ENTRIES.map((e) => e.exportName)),
  uniqueIds: true,
  uniqueExportNames: true,
  deterministicOrdering: true,
  internalOnlyExcluded: true,
  testArtifactsExcluded: true,
  mutableApisExcluded: true,
  runtimeImplementationApisExcluded: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

// --------------------------------------------------------------------------
// Identity and status primitives.
// --------------------------------------------------------------------------

export const KnowledgeModelingPublicIndexId =
  "DKL-4:9/KnowledgeModelingPublicIndex";
export const KnowledgeModelingPublicIndexVersion = "1.0.0";
export const KnowledgeModelingPublicIndexName = "Knowledge Modeling Public Index";
export const KnowledgeModelingPublicIndexNamespace =
  "nexora.dkl.knowledge-modeling.public";
export const KnowledgeModelingPublicReleaseStatus: ReleaseStatusValue = "Released";
export const KnowledgeModelingPublicCertificationStatus: CertificationStatusValue =
  "Certified";
export const KnowledgeModelingPublicFreezeStatus: FreezeStatusValue = "Frozen";

const CONSUMER_COMPATIBILITY = Object.freeze({
  compatibilityId: "DKL-4:9/ConsumerCompatibility",
  entries: Object.freeze([
    Object.freeze({
      id: "consumer-dkl-5",
      target: "DKL-5",
      status: "Compatible" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-dkl-6-plus",
      target: "DKL-6 and later approved DKL phases",
      status: "Compatible" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-engine",
      target: "Executive Engine",
      status: "Restricted" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-advisor",
      target: "Advisor integration contracts",
      status: "Restricted" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-scene",
      target: "Scene integration contracts",
      status: "Restricted" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-nea",
      target: "NEA reference contracts",
      status: "Compatible" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-bo-runtime",
      target: "Future Business Object runtime layers",
      status: "ForwardCompatible" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-tooling",
      target: "Testing and architecture tooling",
      status: "Compatible" as const,
      requiredImport: "knowledgeModelingPublicIndex.ts",
    }),
  ]),
  directInternalImports: "Forbidden" as const,
  unsupportedInternalImports: true,
  soleSupportedEntryPoint: "knowledgeModelingPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
});

const PUBLIC_INDEX_SECTION = Object.freeze({
  id: KnowledgeModelingPublicIndexId,
  version: KnowledgeModelingPublicIndexVersion,
  name: KnowledgeModelingPublicIndexName,
  namespace: KnowledgeModelingPublicIndexNamespace,
  phase: "DKL-4:9" as const,
  releaseStatus: KnowledgeModelingPublicReleaseStatus,
  certificationStatus: KnowledgeModelingPublicCertificationStatus,
  freezeStatus: KnowledgeModelingPublicFreezeStatus,
  stability: "Stable" as const,
  consumerReadiness: "ReadyForConsumer" as const,
  nextPhaseReadiness: "ReadyForDKL5" as const,
  publicApiCount: KnowledgeModelingPublicApiRegistry.entryCount,
  soleEntryPointPath: "knowledgeModelingPublicIndex.ts",
  owner: "DKL-4 Knowledge Modeling Public Index",
  apiRegistry: KnowledgeModelingPublicApiRegistry,
  consumerCompatibility: CONSUMER_COMPATIBILITY,
  freezeIdentity: KnowledgeModelingFreezeIdentity,
  freezeVersion: KnowledgeModelingFreezeVersion,
  freezeLocks: KnowledgeModelingFreezeLocks,
  freezeModuleExportCount: Object.keys(freezeModule).length,
  guarantees: Object.freeze({
    officiallyReleased: true,
    certified: true,
    frozen: true,
    stable: true,
    readyForApprovedConsumers: true,
    readyForDKL5: true,
    oneSupportedPublicEntryPoint: true,
    nineOrderedNamespaceSections: true,
    twelveTopLevelPublicExports: true,
    upstreamIncludedByReference: true,
    noInternalImplementationLeakage: true,
    noOwnershipTransfer: true,
    noBreakingMutationApis: true,
    noRuntimeKnowledgeObjectCreation: true,
    noRuntimeBusinessObjectCreation: true,
    noGraphConstructionOrTraversal: true,
    noPersistenceOrRepositoryBehavior: true,
    noSemanticInferenceOrAi: true,
    noExecutiveEngineBehavior: true,
    noSourceCodeScanning: true,
    noEnvironmentDependentBehavior: true,
    allExportedMetadataImmutable: true,
    allHelperResultsDeterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * The one immutable, canonical public namespace for the complete DKL-4
 * Knowledge Modeling Platform. Exactly nine ordered sections — reference only.
 */
export const KnowledgeModelingPlatformPublicFoundation = Object.freeze({
  foundation: certifiedPlatform.foundation,
  registry: certifiedPlatform.registry,
  model: certifiedPlatform.model,
  validation: certifiedPlatform.validation,
  manifest: certifiedPlatform.manifest,
  platform: certifiedPlatform,
  certification: certificationSurface,
  freeze,
  publicIndex: PUBLIC_INDEX_SECTION,
});

const SUMMARY: PublicIndexSummaryDescriptor = Object.freeze({
  identity: KnowledgeModelingPublicIndexId,
  version: KnowledgeModelingPublicIndexVersion,
  namespace: KnowledgeModelingPublicIndexNamespace,
  name: KnowledgeModelingPublicIndexName,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  nextPhaseReadiness: "ReadyForDKL5",
  sectionCount: 9 as const,
  publicApiCount: KnowledgeModelingPublicApiRegistry.entryCount,
  solePublicEntryPoint: "knowledgeModelingPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const RELEASE_METADATA: PublicReleaseMetadataDescriptor = Object.freeze({
  publicIndexId: KnowledgeModelingPublicIndexId,
  publicIndexVersion: KnowledgeModelingPublicIndexVersion,
  publicIndexName: KnowledgeModelingPublicIndexName,
  namespace: KnowledgeModelingPublicIndexNamespace,
  phase: "DKL-4:9",
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  consumerReadiness: "ReadyForConsumer",
  nextPhaseReadiness: "ReadyForDKL5",
  publicApiCount: KnowledgeModelingPublicApiRegistry.entryCount,
  namespaceSectionCount: 9 as const,
  solePublicEntryPoint: "knowledgeModelingPublicIndex.ts",
  freezeVersion: KnowledgeModelingFreezeVersion,
  platformVersion: certifiedPlatform.version,
  lockIdentifier: KnowledgeModelingFreezeIdentity.lockIdentifier,
  Released: true,
  Certified: true,
  Frozen: true,
  Stable: true,
  ReadyForConsumer: true,
  ReadyForDKL5: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Deterministic readonly public-index summary (stable reference). */
export function getKnowledgeModelingPublicSummary(): PublicIndexSummaryDescriptor {
  return SUMMARY;
}

/** Deterministic released public API count. */
export function getKnowledgeModelingPublicApiCount(): number {
  return KnowledgeModelingPublicApiRegistry.entryCount;
}

/** Deterministic readonly release metadata (stable reference). */
export function getKnowledgeModelingPublicReleaseMetadata(): PublicReleaseMetadataDescriptor {
  return RELEASE_METADATA;
}
