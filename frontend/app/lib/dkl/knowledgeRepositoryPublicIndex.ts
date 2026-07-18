/**
 * DKL-6:9 — Knowledge Repository Public Index.
 *
 * The sole canonical, immutable public release surface for the complete DKL-6
 * Knowledge Repository architecture (DKL-6:1 through DKL-6:8). Future consumers
 * must import DKL-6 only through this module.
 *
 * Depends exclusively on DKL-6:8 Freeze public APIs. Every prior-phase surface
 * is reached by reference through Freeze — never duplicated, never recreated.
 *
 * Ownership: owned exclusively by DKL-6:9.
 * Metadata only. Release surface only. Zero runtime behavior.
 */

import {
  KnowledgeRepositoryFreeze,
  KnowledgeRepositoryFreezeId,
} from "./knowledgeRepositoryFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type KnowledgeRepositoryPublicApiEntry = Readonly<{
  id: string;
  phase: string;
  exportName: string;
  sourceIdentity: string;
  status: "Released";
  stability: "StableAndFrozen";
  owner: "DKL-6";
  public: true;
  runtimeBehavior: "None";
}>;

type KnowledgeRepositoryReleaseGuarantee = Readonly<{
  id: string;
  name: string;
  status: "Guaranteed";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-6:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = KnowledgeRepositoryFreeze;
const certification = freeze.certification;
const platform = certification.platform;

const FOUNDATION_APIS = Object.freeze([
  "KnowledgeRepositoryFoundation",
  "KnowledgeRepositoryFoundationId",
  "KnowledgeRepositoryFoundationVersion",
  "KnowledgeRepositoryFoundationNamespace",
  "KnowledgeRepositoryFoundationStatus",
  "getKnowledgeRepositoryFoundationSummary",
] as const);

const REGISTRY_APIS = Object.freeze([
  "KnowledgeRepositoryRegistry",
  "KnowledgeRepositoryRegistryId",
  "KnowledgeRepositoryRegistryVersion",
  "KnowledgeRepositoryRegistryName",
  "KnowledgeRepositoryRegistryNamespace",
  "KnowledgeRepositoryRegistryStatus",
  "getKnowledgeRepositoryRegistryEntryCount",
  "getKnowledgeRepositoryRegistrySummary",
] as const);

const MODEL_APIS = Object.freeze([
  "KnowledgeRepositoryModel",
  "KnowledgeRepositoryModelId",
  "KnowledgeRepositoryModelVersion",
  "KnowledgeRepositoryModelName",
  "KnowledgeRepositoryModelNamespace",
  "KnowledgeRepositoryModelStatus",
  "getKnowledgeRepositoryModelCount",
  "getKnowledgeRepositoryModelSummary",
] as const);

const VALIDATION_APIS = Object.freeze([
  "KnowledgeRepositoryValidation",
  "KnowledgeRepositoryValidationId",
  "KnowledgeRepositoryValidationVersion",
  "KnowledgeRepositoryValidationName",
  "KnowledgeRepositoryValidationNamespace",
  "KnowledgeRepositoryValidationStatus",
  "getKnowledgeRepositoryValidationRuleCount",
  "getKnowledgeRepositoryValidationSummary",
] as const);

const MANIFEST_APIS = Object.freeze([
  "KnowledgeRepositoryManifest",
  "KnowledgeRepositoryManifestId",
  "KnowledgeRepositoryManifestVersion",
  "KnowledgeRepositoryManifestName",
  "KnowledgeRepositoryManifestNamespace",
  "KnowledgeRepositoryManifestStatus",
  "getKnowledgeRepositoryManifestPublicApiCount",
  "getKnowledgeRepositoryManifestSummary",
] as const);

const PLATFORM_APIS = Object.freeze([
  "KnowledgeRepositoryPlatform",
  "KnowledgeRepositoryPlatformId",
  "KnowledgeRepositoryPlatformVersion",
  "KnowledgeRepositoryPlatformName",
  "KnowledgeRepositoryPlatformNamespace",
  "KnowledgeRepositoryPlatformStatus",
  "getKnowledgeRepositoryPlatformSummary",
  "getKnowledgeRepositoryPlatformPublicApiCount",
] as const);

const CERTIFICATION_APIS = Object.freeze([
  "KnowledgeRepositoryCertification",
  "KnowledgeRepositoryCertificationId",
  "KnowledgeRepositoryCertificationVersion",
  "KnowledgeRepositoryCertificationName",
  "KnowledgeRepositoryCertificationNamespace",
  "KnowledgeRepositoryCertificationStatus",
  "getKnowledgeRepositoryCertificationSummary",
  "getKnowledgeRepositoryCertificationPublicApiCount",
] as const);

const FREEZE_APIS = Object.freeze([
  "KnowledgeRepositoryFreeze",
  "KnowledgeRepositoryFreezeId",
  "KnowledgeRepositoryFreezeVersion",
  "KnowledgeRepositoryFreezeName",
  "KnowledgeRepositoryFreezeNamespace",
  "KnowledgeRepositoryFreezeStatus",
  "getKnowledgeRepositoryFreezeSummary",
  "getKnowledgeRepositoryFreezePublicApiCount",
] as const);

const PUBLIC_INDEX_APIS = Object.freeze([
  "KnowledgeRepositoryPlatformPublicFoundation",
  "KnowledgeRepositoryPublicApiRegistry",
  "KnowledgeRepositoryPublicIndexId",
  "KnowledgeRepositoryPublicIndexVersion",
  "KnowledgeRepositoryPublicIndexName",
  "KnowledgeRepositoryPublicIndexNamespace",
  "KnowledgeRepositoryPublicReleaseStatus",
  "KnowledgeRepositoryPublicCertificationStatus",
  "KnowledgeRepositoryPublicFreezeStatus",
  "getKnowledgeRepositoryPublicSummary",
  "getKnowledgeRepositoryPublicApiCount",
  "getKnowledgeRepositoryPublicReleaseMetadata",
] as const);

const SOURCE_IDENTITIES = Object.freeze({
  "DKL-6:1": "DKL-6:1/KnowledgeRepositoryFoundation",
  "DKL-6:2": "DKL-6:2/KnowledgeRepositoryRegistry",
  "DKL-6:3": "DKL-6:3/KnowledgeRepositoryModel",
  "DKL-6:4": "DKL-6:4/KnowledgeRepositoryValidation",
  "DKL-6:5": "DKL-6:5/KnowledgeRepositoryManifest",
  "DKL-6:6": "DKL-6:6/KnowledgeRepositoryPlatform",
  "DKL-6:7": "DKL-6:7/KnowledgeRepositoryCertification",
  "DKL-6:8": "DKL-6:8/KnowledgeRepositoryFreeze",
  "DKL-6:9": "DKL-6:9/KnowledgeRepositoryPublicIndex",
} as const);

function apiEntry(
  phase: keyof typeof SOURCE_IDENTITIES,
  exportName: string,
): KnowledgeRepositoryPublicApiEntry {
  return Object.freeze({
    id: `DKL-6:9/PublicApi/${phase}/${exportName}`,
    phase,
    exportName,
    sourceIdentity: SOURCE_IDENTITIES[phase],
    status: "Released" as const,
    stability: "StableAndFrozen" as const,
    owner: "DKL-6" as const,
    public: true as const,
    runtimeBehavior: "None" as const,
  });
}

function phaseEntries(
  phase: keyof typeof SOURCE_IDENTITIES,
  names: readonly string[],
): readonly KnowledgeRepositoryPublicApiEntry[] {
  return Object.freeze(names.map((name) => apiEntry(phase, name)));
}

const PUBLIC_API_ENTRIES: readonly KnowledgeRepositoryPublicApiEntry[] =
  Object.freeze([
    ...phaseEntries("DKL-6:1", FOUNDATION_APIS),
    ...phaseEntries("DKL-6:2", REGISTRY_APIS),
    ...phaseEntries("DKL-6:3", MODEL_APIS),
    ...phaseEntries("DKL-6:4", VALIDATION_APIS),
    ...phaseEntries("DKL-6:5", MANIFEST_APIS),
    ...phaseEntries("DKL-6:6", PLATFORM_APIS),
    ...phaseEntries("DKL-6:7", CERTIFICATION_APIS),
    ...phaseEntries("DKL-6:8", FREEZE_APIS),
    ...phaseEntries("DKL-6:9", PUBLIC_INDEX_APIS),
  ]);

function guarantee(
  name: string,
): KnowledgeRepositoryReleaseGuarantee {
  return Object.freeze({
    id: `DKL-6:9/Guarantee/${name}`,
    name,
    status: "Guaranteed" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

const RELEASE_GUARANTEES: readonly KnowledgeRepositoryReleaseGuarantee[] =
  Object.freeze([
    guarantee("CanonicalPublicIdentity"),
    guarantee("SolePublicEntryPoint"),
    guarantee("CanonicalNamespaceComposition"),
    guarantee("FrozenReferencePreservation"),
    guarantee("CertifiedRelease"),
    guarantee("StableAndFrozenRelease"),
    guarantee("PublicApiCompleteness"),
    guarantee("PublicApiUniqueness"),
    guarantee("BackwardCompatibility"),
    guarantee("AdditiveExtensionsOnly"),
    guarantee("RuntimeProhibition"),
    guarantee("ReadyForConsumer"),
    guarantee("ReadyForDKL7"),
  ]);

const CONSUMER_IMPORT_POLICY = Object.freeze({
  supportedImport: "knowledgeRepositoryPublicIndex.ts" as const,
  unsupportedConsumerImports: Object.freeze([
    "knowledgeRepositoryFoundation.ts",
    "knowledgeRepositoryRegistry.ts",
    "knowledgeRepositoryModel.ts",
    "knowledgeRepositoryValidation.ts",
    "knowledgeRepositoryManifest.ts",
    "knowledgeRepositoryPlatform.ts",
    "knowledgeRepositoryCertification.ts",
    "knowledgeRepositoryFreeze.ts",
    "all internal DKL-6 files",
  ] as const),
  soleSupportedEntryPoint: "knowledgeRepositoryPublicIndex.ts" as const,
  architecturalPolicyOnly: true as const,
  runtimeBehavior: "None" as const,
});

const FREEZE_ACCEPTANCE = Object.freeze({
  freezeStatus: freeze.result.status,
  certificationStatus: freeze.result.certificationStatus,
  baseline: freeze.result.baseline,
  stability: freeze.result.stability,
  frozenComponents: freeze.frozenComponents.length,
  compatibilityLocks: freeze.compatibilityLocks.length,
  dependencyLocks: freeze.dependencyLocks.length,
  coreLocks: freeze.coreLocks.length,
  extensionLocks: freeze.extensionLocks.length,
  boundaryLocks: freeze.boundaryLocks.length,
  regressionLocks: freeze.regressionLocks.length,
  guarantees: freeze.guarantees.length,
  freezeGates: freeze.gates.length,
  passedFreezeGates: freeze.gates.filter((gate) => gate.status === "Pass")
    .length,
  failedFreezeGates: freeze.gates.filter((gate) => gate.status !== "Pass")
    .length,
  frozenPublicApisThroughDKL68: freeze.publicApis.reduce(
    (sum, phase) => sum + phase.publicApiCount,
    0,
  ),
  unlockedLocks: freeze.result.unlockedCount,
  blockingIssues: freeze.result.blockingIssueCount,
  freezeReadiness: freeze.result.readiness,
  freezeIdentity: KnowledgeRepositoryFreezeId,
});

const PUBLIC_INDEX_SECTION = Object.freeze({
  id: "DKL-6:9/KnowledgeRepositoryPublicIndex" as const,
  version: "1.0.0" as const,
  name: "Knowledge Repository Public Index" as const,
  namespace: "nexora.dkl.repository.public" as const,
  releaseStatus: "Released" as const,
  certificationStatus: "Certified" as const,
  freezeStatus: "Frozen" as const,
  stability: "StableAndFrozen" as const,
  consumerReadiness: "ReadyForConsumer" as const,
  nextPhaseReadiness: "ReadyForDKL7" as const,
  soleEntryPoint: "knowledgeRepositoryPublicIndex.ts" as const,
  runtimeBehavior: "None" as const,
  guarantees: RELEASE_GUARANTEES,
  importPolicy: CONSUMER_IMPORT_POLICY,
  freezeAcceptance: FREEZE_ACCEPTANCE,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

// --------------------------------------------------------------------------
// Public exports (exactly twelve).
// --------------------------------------------------------------------------

export const KnowledgeRepositoryPublicIndexId =
  "DKL-6:9/KnowledgeRepositoryPublicIndex" as const;

export const KnowledgeRepositoryPublicIndexVersion = "1.0.0" as const;

export const KnowledgeRepositoryPublicIndexName =
  "Knowledge Repository Public Index" as const;

export const KnowledgeRepositoryPublicIndexNamespace =
  "nexora.dkl.repository.public" as const;

export const KnowledgeRepositoryPublicReleaseStatus = "Released" as const;

export const KnowledgeRepositoryPublicCertificationStatus =
  "Certified" as const;

export const KnowledgeRepositoryPublicFreezeStatus = "Frozen" as const;

/**
 * Canonical nine-section public namespace.
 * Sections 1–8 preserve Freeze-reachable canonical references.
 */
export const KnowledgeRepositoryPlatformPublicFoundation = Object.freeze({
  foundation: platform.foundation,
  registry: platform.registry,
  model: platform.model,
  validation: platform.validation,
  manifest: platform.manifest,
  platform,
  certification,
  freeze,
  publicIndex: PUBLIC_INDEX_SECTION,
});

/** Immutable registry of all DKL-6:1 through DKL-6:9 public APIs. */
export const KnowledgeRepositoryPublicApiRegistry = Object.freeze({
  id: "DKL-6:9/KnowledgeRepositoryPublicApiRegistry" as const,
  name: "Knowledge Repository Public API Registry" as const,
  entries: PUBLIC_API_ENTRIES,
  phaseCounts: Object.freeze({
    "DKL-6:1": FOUNDATION_APIS.length,
    "DKL-6:2": REGISTRY_APIS.length,
    "DKL-6:3": MODEL_APIS.length,
    "DKL-6:4": VALIDATION_APIS.length,
    "DKL-6:5": MANIFEST_APIS.length,
    "DKL-6:6": PLATFORM_APIS.length,
    "DKL-6:7": CERTIFICATION_APIS.length,
    "DKL-6:8": FREEZE_APIS.length,
    "DKL-6:9": PUBLIC_INDEX_APIS.length,
  }),
  entryCount: PUBLIC_API_ENTRIES.length,
  uniqueIds: true as const,
  uniqueExportNames: true as const,
  deterministicOrdering: true as const,
  owner: "DKL-6" as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Total declared public API count across DKL-6:1 through DKL-6:9. */
export function getKnowledgeRepositoryPublicApiCount(): number {
  return KnowledgeRepositoryPublicApiRegistry.entries.length;
}

/** Deterministic immutable public release metadata. */
export function getKnowledgeRepositoryPublicReleaseMetadata() {
  return Object.freeze({
    id: KnowledgeRepositoryPublicIndexId,
    version: KnowledgeRepositoryPublicIndexVersion,
    name: KnowledgeRepositoryPublicIndexName,
    namespace: KnowledgeRepositoryPublicIndexNamespace,
    releaseStatus: KnowledgeRepositoryPublicReleaseStatus,
    certificationStatus: KnowledgeRepositoryPublicCertificationStatus,
    freezeStatus: KnowledgeRepositoryPublicFreezeStatus,
    stability: "StableAndFrozen" as const,
    baseline: freeze.result.baseline,
    consumerReadiness: "ReadyForConsumer" as const,
    nextPhaseReadiness: "ReadyForDKL7" as const,
    soleEntryPoint: "knowledgeRepositoryPublicIndex.ts" as const,
    publicApiCount: getKnowledgeRepositoryPublicApiCount(),
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Deterministic immutable public summary. */
export function getKnowledgeRepositoryPublicSummary() {
  return Object.freeze({
    publicIndexId: KnowledgeRepositoryPublicIndexId,
    version: KnowledgeRepositoryPublicIndexVersion,
    name: KnowledgeRepositoryPublicIndexName,
    namespace: KnowledgeRepositoryPublicIndexNamespace,
    releaseStatus: KnowledgeRepositoryPublicReleaseStatus,
    certificationStatus: KnowledgeRepositoryPublicCertificationStatus,
    freezeStatus: KnowledgeRepositoryPublicFreezeStatus,
    stability: "StableAndFrozen" as const,
    freezeIdentity: KnowledgeRepositoryFreezeId,
    freezeBaseline: freeze.result.baseline,
    publicNamespaceSectionCount: 9 as const,
    publicApiCount: getKnowledgeRepositoryPublicApiCount(),
    foundationApiCount: FOUNDATION_APIS.length,
    registryApiCount: REGISTRY_APIS.length,
    modelApiCount: MODEL_APIS.length,
    validationApiCount: VALIDATION_APIS.length,
    manifestApiCount: MANIFEST_APIS.length,
    platformApiCount: PLATFORM_APIS.length,
    certificationApiCount: CERTIFICATION_APIS.length,
    freezeApiCount: FREEZE_APIS.length,
    publicIndexApiCount: PUBLIC_INDEX_APIS.length,
    frozenComponentCount: freeze.frozenComponents.length,
    totalLockCount: freeze.result.totalLocks,
    freezeGateCount: freeze.gates.length,
    passedFreezeGateCount: FREEZE_ACCEPTANCE.passedFreezeGates,
    failedFreezeGateCount: FREEZE_ACCEPTANCE.failedFreezeGates,
    unlockedLockCount: freeze.result.unlockedCount,
    blockingIssueCount: freeze.result.blockingIssueCount,
    consumerReadiness: "ReadyForConsumer" as const,
    nextPhaseReadiness: "ReadyForDKL7" as const,
    soleEntryPoint: "knowledgeRepositoryPublicIndex.ts" as const,
    releaseGuaranteeCount: RELEASE_GUARANTEES.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
