/**
 * DKL-5:9 — Knowledge Validation Public Index.
 *
 * The sole canonical, immutable public release surface for the complete DKL-5
 * Knowledge Validation Platform (DKL-5:1 through DKL-5:8). Future consumers must
 * import DKL-5 only through this module.
 *
 * Depends exclusively on DKL-5:8 Freeze public APIs. Every prior-phase surface
 * is reached by reference through Freeze — never duplicated, never recreated.
 *
 * Ownership: owned exclusively by DKL-5:9.
 * Metadata only. Release surface only. Zero runtime behavior.
 */

import {
  KnowledgeValidationFreeze,
  KnowledgeValidationFreezeIdentity,
  KnowledgeValidationFreezeVersion,
  KnowledgeValidationFreezeLocks,
} from "./knowledgeValidationFreeze.ts";
import * as freezeModule from "./knowledgeValidationFreeze.ts";

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
  readonly kind:
    | "aggregate"
    | "identity"
    | "version"
    | "namespace"
    | "collection"
    | "helper"
    | "status"
    | "registry";
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
  readonly publicEntryPoint: "knowledgeValidationPublicIndex.ts";
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly numericScoring: false;
  readonly trustCalculation: false;
  readonly cleansing: false;
  readonly remediation: false;
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
  readonly nextPhaseReadiness: "ReadyForDKL6";
  readonly sectionCount: 9;
  readonly publicApiCount: number;
  readonly solePublicEntryPoint: "knowledgeValidationPublicIndex.ts";
  readonly evidenceOriented: true;
  readonly explainabilityActive: true;
  readonly partialUsabilityProtected: true;
  readonly runtimeValidationProhibited: true;
  readonly numericScoringProhibited: true;
  readonly trustCalculationProhibited: true;
  readonly cleansingProhibited: true;
  readonly remediationProhibited: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

interface PublicReleaseMetadataDescriptor {
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly namespace: string;
  readonly phase: "DKL-5:9";
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly stability: StabilityValue;
  readonly consumerReadiness: "ReadyForConsumer";
  readonly nextPhaseReadiness: "ReadyForDKL6";
  readonly publicApiCount: number;
  readonly namespaceSectionCount: 9;
  readonly solePublicEntryPoint: "knowledgeValidationPublicIndex.ts";
  readonly freezeVersion: string;
  readonly platformVersion: string;
  readonly lockIdentifier: string;
  readonly Released: true;
  readonly Certified: true;
  readonly Frozen: true;
  readonly Stable: true;
  readonly ReadyForConsumer: true;
  readonly ReadyForDKL6: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-5:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = KnowledgeValidationFreeze;
const certifiedPlatform = freeze.certifiedPlatform;
const certificationSurface = freeze.certification;

const FOUNDATION_APIS = Object.freeze([
  "KnowledgeValidationFoundation",
  "KnowledgeValidationFoundationIdentity",
  "KnowledgeValidationFoundationVersion",
  "KnowledgeValidationContracts",
  "KnowledgeValidationOwnership",
  "KnowledgeValidationBoundaries",
  "KnowledgeValidationLifecycle",
  "KnowledgeValidationDependencies",
] as const);

const REGISTRY_APIS = Object.freeze([
  "KnowledgeValidationRegistry",
  "KnowledgeValidationRegistryIdentity",
  "KnowledgeValidationRegistryVersion",
  "KnowledgeValidationRegistryNamespace",
  "KnowledgeValidationRegistryCollections",
  "KnowledgeValidationRegistryOwnership",
  "KnowledgeValidationRegistryDependencies",
  "KnowledgeValidationRegistrySummary",
] as const);

const MODEL_APIS = Object.freeze([
  "KnowledgeValidationModel",
  "KnowledgeValidationModelIdentity",
  "KnowledgeValidationModelVersion",
  "KnowledgeValidationModelNamespace",
  "KnowledgeValidationModelCatalog",
  "KnowledgeValidationModelRelationships",
  "KnowledgeValidationModelOwnership",
  "KnowledgeValidationModelDependencies",
] as const);

const VALIDATION_APIS = Object.freeze([
  "KnowledgeValidationValidation",
  "KnowledgeValidationValidationIdentity",
  "KnowledgeValidationValidationVersion",
  "KnowledgeValidationValidationNamespace",
  "KnowledgeValidationValidationRules",
  "KnowledgeValidationValidationCategories",
  "runKnowledgeValidationValidation",
  "getKnowledgeValidationValidationSummary",
] as const);

const MANIFEST_APIS = Object.freeze([
  "KnowledgeValidationManifest",
  "KnowledgeValidationManifestIdentity",
  "KnowledgeValidationManifestVersion",
  "KnowledgeValidationManifestNamespace",
  "KnowledgeValidationManifestInventory",
  "KnowledgeValidationManifestDependencies",
  "getKnowledgeValidationManifestSummary",
  "getKnowledgeValidationManifestStatistics",
] as const);

const PLATFORM_APIS = Object.freeze([
  "KnowledgeValidationPlatform",
  "KnowledgeValidationPlatformIdentity",
  "KnowledgeValidationPlatformVersion",
  "KnowledgeValidationPlatformNamespace",
  "KnowledgeValidationPlatformComponents",
  "KnowledgeValidationPlatformReadiness",
  "getKnowledgeValidationPlatformSummary",
  "getKnowledgeValidationPlatformStatus",
] as const);

const CERTIFICATION_APIS = Object.freeze([
  "KnowledgeValidationCertification",
  "KnowledgeValidationCertificationIdentity",
  "KnowledgeValidationCertificationVersion",
  "KnowledgeValidationCertificationNamespace",
  "KnowledgeValidationCertificationGates",
  "KnowledgeValidationCertificationEvidence",
  "runKnowledgeValidationCertification",
  "getKnowledgeValidationCertificationSummary",
] as const);

const FREEZE_APIS = Object.freeze([
  "KnowledgeValidationFreeze",
  "KnowledgeValidationFreezeIdentity",
  "KnowledgeValidationFreezeVersion",
  "KnowledgeValidationFreezeNamespace",
  "KnowledgeValidationFreezeComponents",
  "KnowledgeValidationFreezeLocks",
  "getKnowledgeValidationFreezeSummary",
  "getKnowledgeValidationFreezeStatus",
] as const);

const PUBLIC_INDEX_APIS = Object.freeze([
  "KnowledgeValidationPlatformPublicFoundation",
  "KnowledgeValidationPublicApiRegistry",
  "KnowledgeValidationPublicIndexId",
  "KnowledgeValidationPublicIndexVersion",
  "KnowledgeValidationPublicIndexName",
  "KnowledgeValidationPublicIndexNamespace",
  "KnowledgeValidationPublicReleaseStatus",
  "KnowledgeValidationPublicCertificationStatus",
  "KnowledgeValidationPublicFreezeStatus",
  "getKnowledgeValidationPublicSummary",
  "getKnowledgeValidationPublicApiCount",
  "getKnowledgeValidationPublicReleaseMetadata",
] as const);

const kindFor = (exportName: string): PublicApiEntry["kind"] => {
  if (
    exportName.startsWith("get") ||
    exportName.startsWith("run") ||
    exportName.startsWith("validate")
  ) {
    return "helper";
  }
  if (exportName.endsWith("Version")) return "version";
  if (exportName.endsWith("Namespace")) return "namespace";
  if (
    exportName.endsWith("Identity") ||
    exportName.endsWith("Id") ||
    exportName.endsWith("Name")
  ) {
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
    exportName.endsWith("Rules") ||
    exportName.endsWith("Categories")
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
    "DKL-5:1": "foundation",
    "DKL-5:2": "registry",
    "DKL-5:3": "model",
    "DKL-5:4": "validation",
    "DKL-5:5": "manifest",
    "DKL-5:6": "platform",
    "DKL-5:7": "certification",
    "DKL-5:8": "freeze",
    "DKL-5:9": "publicIndex",
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
    publicEntryPoint: "knowledgeValidationPublicIndex.ts" as const,
    metadataOnly: true as const,
    runtimeBehavior: false as const,
    numericScoring: false as const,
    trustCalculation: false as const,
    cleansing: false as const,
    remediation: false as const,
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
    "DKL-5:1",
    "DKL-5 Knowledge Validation Platform",
    "nexora.dkl.knowledge-validation.foundation",
  ),
  ...phaseEntries(
    REGISTRY_APIS,
    "DKL-5:2",
    "DKL-5 Knowledge Validation Registry",
    "nexora.dkl.knowledge-validation.registry",
  ),
  ...phaseEntries(
    MODEL_APIS,
    "DKL-5:3",
    "DKL-5 Knowledge Validation Model",
    "nexora.dkl.knowledge-validation.model",
  ),
  ...phaseEntries(
    VALIDATION_APIS,
    "DKL-5:4",
    "DKL-5 Knowledge Validation Validation",
    "nexora.dkl.knowledge-validation.validation",
  ),
  ...phaseEntries(
    MANIFEST_APIS,
    "DKL-5:5",
    "DKL-5 Knowledge Validation Manifest",
    "nexora.dkl.knowledge-validation.manifest",
  ),
  ...phaseEntries(
    PLATFORM_APIS,
    "DKL-5:6",
    "DKL-5 Knowledge Validation Platform",
    "nexora.dkl.knowledge-validation.platform",
  ),
  ...phaseEntries(
    CERTIFICATION_APIS,
    "DKL-5:7",
    "DKL-5 Knowledge Validation Certification",
    "nexora.dkl.knowledge-validation.certification",
  ),
  ...phaseEntries(
    FREEZE_APIS,
    "DKL-5:8",
    "DKL-5 Knowledge Validation Freeze",
    "nexora.dkl.knowledge-validation.freeze",
  ),
  ...phaseEntries(
    PUBLIC_INDEX_APIS,
    "DKL-5:9",
    "DKL-5 Knowledge Validation Public Index",
    "nexora.dkl.knowledge-validation.public",
  ),
]);

/** Immutable registry of every released public API from DKL-5:1 through DKL-5:9. */
export const KnowledgeValidationPublicApiRegistry = Object.freeze({
  registryId: "DKL-5:9/PublicApiRegistry",
  entries: PUBLIC_API_ENTRIES,
  entryCount: PUBLIC_API_ENTRIES.length,
  releasedPhases: 9 as const,
  releasedPublicApiCount: PUBLIC_API_ENTRIES.length,
  exportNames: Object.freeze(PUBLIC_API_ENTRIES.map((entry) => entry.exportName)),
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

export const KnowledgeValidationPublicIndexId =
  "DKL-5:9/KnowledgeValidationPublicIndex";
export const KnowledgeValidationPublicIndexVersion = "1.0.0";
export const KnowledgeValidationPublicIndexName =
  "Knowledge Validation Public Index";
export const KnowledgeValidationPublicIndexNamespace =
  "nexora.dkl.knowledge-validation.public";
export const KnowledgeValidationPublicReleaseStatus: ReleaseStatusValue =
  "Released";
export const KnowledgeValidationPublicCertificationStatus: CertificationStatusValue =
  "Certified";
export const KnowledgeValidationPublicFreezeStatus: FreezeStatusValue = "Frozen";

const CONSUMER_COMPATIBILITY = Object.freeze({
  compatibilityId: "DKL-5:9/ConsumerCompatibility",
  entries: Object.freeze([
    Object.freeze({
      id: "consumer-dkl-6",
      target: "DKL-6",
      status: "Compatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-dkl-later",
      target: "Later approved DKL phases",
      status: "Compatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-repository",
      target: "Future Knowledge Repository",
      status: "ForwardCompatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-services",
      target: "Future Knowledge Services",
      status: "ForwardCompatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-engine",
      target: "Executive Engine",
      status: "Restricted" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-advisor",
      target: "Advisor integration contracts",
      status: "Restricted" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-scene",
      target: "Scene integration contracts",
      status: "Restricted" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-nea",
      target: "NEA reference contracts",
      status: "Compatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-bo-runtime",
      target: "Future runtime Business Object layers",
      status: "ForwardCompatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-architecture-tooling",
      target: "Architecture validation tooling",
      status: "Compatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
    Object.freeze({
      id: "consumer-testing-tooling",
      target: "Testing tooling",
      status: "Compatible" as const,
      requiredImport: "knowledgeValidationPublicIndex.ts",
    }),
  ]),
  directInternalImports: "Forbidden" as const,
  unsupportedInternalImports: true,
  nonContractualInternalImports: true,
  soleSupportedEntryPoint: "knowledgeValidationPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
});

const PUBLIC_INDEX_SECTION = Object.freeze({
  id: KnowledgeValidationPublicIndexId,
  version: KnowledgeValidationPublicIndexVersion,
  name: KnowledgeValidationPublicIndexName,
  namespace: KnowledgeValidationPublicIndexNamespace,
  phase: "DKL-5:9" as const,
  releaseStatus: KnowledgeValidationPublicReleaseStatus,
  certificationStatus: KnowledgeValidationPublicCertificationStatus,
  freezeStatus: KnowledgeValidationPublicFreezeStatus,
  stability: "Stable" as const,
  consumerReadiness: "ReadyForConsumer" as const,
  nextPhaseReadiness: "ReadyForDKL6" as const,
  publicApiCount: KnowledgeValidationPublicApiRegistry.entryCount,
  soleEntryPointPath: "knowledgeValidationPublicIndex.ts",
  owner: "DKL-5 Knowledge Validation Public Index",
  evidenceOrientedGuarantee: true,
  explainabilityGuarantee: true,
  partialUsabilityGuarantee: true,
  runtimeValidationProhibition: true,
  numericScoringProhibition: true,
  trustCalculationProhibition: true,
  cleansingProhibition: true,
  remediationProhibition: true,
  consumerReadinessDeclarations: Object.freeze([
    ...certifiedPlatform.model.catalog.consumerSuitabilityStates.states,
  ]),
  executiveUsabilityDeclarations: Object.freeze([
    ...certifiedPlatform.model.catalog.executiveUsabilityCapabilities
      .capabilities,
  ]),
  apiRegistry: KnowledgeValidationPublicApiRegistry,
  consumerCompatibility: CONSUMER_COMPATIBILITY,
  freezeIdentity: KnowledgeValidationFreezeIdentity,
  freezeVersion: KnowledgeValidationFreezeVersion,
  freezeLocks: KnowledgeValidationFreezeLocks,
  freezeModuleExportCount: Object.keys(freezeModule).length,
  guarantees: Object.freeze({
    officiallyReleased: true,
    certified: true,
    frozen: true,
    stable: true,
    readyForApprovedConsumers: true,
    readyForDKL6: true,
    oneSupportedPublicEntryPoint: true,
    nineOrderedNamespaceSections: true,
    twelveTopLevelPublicExports: true,
    upstreamIncludedByReference: true,
    noInternalImplementationLeakage: true,
    noOwnershipTransfer: true,
    noMutableRegistrationApis: true,
    noRuntimeOrganizationalValidation: true,
    noNumericScoring: true,
    noAutomaticTrustCalculation: true,
    noCleansing: true,
    noRemediation: true,
    noEntityOrSemanticResolution: true,
    noConflictOrAmbiguityResolution: true,
    noPersistenceOrRepositoryBehavior: true,
    noSearchOrQueryExecution: true,
    noGraphTraversal: true,
    noAiOrSemanticInference: true,
    noExecutiveEngineBehavior: true,
    noAdvisorSceneOrUiBehavior: true,
    noSourceCodeScanning: true,
    noEnvironmentDependentBehavior: true,
    evidenceOrientedGuaranteesActive: true,
    explainabilityGuaranteesActive: true,
    partialUsabilityProtected: true,
    consumerReadinessDeclarationsStable: true,
    executiveUsabilityDeclarationsStable: true,
    allExportedMetadataImmutable: true,
    allHelperResultsDeterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * The one immutable, canonical public namespace for the complete DKL-5
 * Knowledge Validation Platform. Exactly nine ordered sections — reference only.
 */
export const KnowledgeValidationPlatformPublicFoundation = Object.freeze({
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
  identity: KnowledgeValidationPublicIndexId,
  version: KnowledgeValidationPublicIndexVersion,
  namespace: KnowledgeValidationPublicIndexNamespace,
  name: KnowledgeValidationPublicIndexName,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  nextPhaseReadiness: "ReadyForDKL6",
  sectionCount: 9 as const,
  publicApiCount: KnowledgeValidationPublicApiRegistry.entryCount,
  solePublicEntryPoint: "knowledgeValidationPublicIndex.ts",
  evidenceOriented: true,
  explainabilityActive: true,
  partialUsabilityProtected: true,
  runtimeValidationProhibited: true,
  numericScoringProhibited: true,
  trustCalculationProhibited: true,
  cleansingProhibited: true,
  remediationProhibited: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const RELEASE_METADATA: PublicReleaseMetadataDescriptor = Object.freeze({
  publicIndexId: KnowledgeValidationPublicIndexId,
  publicIndexVersion: KnowledgeValidationPublicIndexVersion,
  publicIndexName: KnowledgeValidationPublicIndexName,
  namespace: KnowledgeValidationPublicIndexNamespace,
  phase: "DKL-5:9",
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "Stable",
  consumerReadiness: "ReadyForConsumer",
  nextPhaseReadiness: "ReadyForDKL6",
  publicApiCount: KnowledgeValidationPublicApiRegistry.entryCount,
  namespaceSectionCount: 9 as const,
  solePublicEntryPoint: "knowledgeValidationPublicIndex.ts",
  freezeVersion: KnowledgeValidationFreezeVersion,
  platformVersion: certifiedPlatform.version,
  lockIdentifier: KnowledgeValidationFreezeIdentity.lockIdentifier,
  Released: true,
  Certified: true,
  Frozen: true,
  Stable: true,
  ReadyForConsumer: true,
  ReadyForDKL6: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Deterministic readonly public-index summary (stable reference). */
export function getKnowledgeValidationPublicSummary(): PublicIndexSummaryDescriptor {
  return SUMMARY;
}

/** Deterministic released public API count. */
export function getKnowledgeValidationPublicApiCount(): number {
  return KnowledgeValidationPublicApiRegistry.entryCount;
}

/** Deterministic readonly release metadata (stable reference). */
export function getKnowledgeValidationPublicReleaseMetadata(): PublicReleaseMetadataDescriptor {
  return RELEASE_METADATA;
}
