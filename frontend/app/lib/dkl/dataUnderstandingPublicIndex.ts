/**
 * DKL-3:9 — Data Understanding Public Index.
 *
 * The sole canonical, immutable public release surface for the complete DKL-3
 * Data Understanding Platform (DKL-3:1 through DKL-3:8). Future consumers must
 * import DKL-3 only through this module.
 *
 * Depends exclusively on DKL-3:8 Freeze public APIs. Every prior-phase surface
 * is reached by reference through Freeze — never duplicated, never recreated.
 *
 * Ownership: owned exclusively by DKL-3:9.
 * Metadata only. Release surface only. Zero runtime behavior.
 */

import {
  DataUnderstandingFreeze,
  DataUnderstandingFreezeIdentity,
  DataUnderstandingFreezeVersion,
  DataUnderstandingFreezeRegistry,
  DataUnderstandingFreezeCompatibility,
  DataUnderstandingFreezeLocks,
  DataUnderstandingFreezeManifest,
  DataUnderstandingFreezeSummary,
} from "./dataUnderstandingFreeze.ts";
import * as freezeModule from "./dataUnderstandingFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type ReleaseStatusValue = "Released";
type CertificationStatusValue = "Certified";
type FreezeStatusValue = "Frozen";
type StabilityValue = "Stable";
type OwnershipValue = string;

interface PublicApiEntry {
  readonly identity: string;
  readonly name: string;
  readonly sourcePhase: string;
  readonly version: string;
  readonly releaseStatus: ReleaseStatusValue;
  readonly stability: StabilityValue;
  readonly ownership: OwnershipValue;
}

interface PublicIndexSummaryDescriptor {
  readonly publicIndexId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly phaseCount: 9;
  readonly namespaceSectionCount: 9;
  readonly frozenPhaseCount: 7;
  readonly frozenPublicApiCount: 56;
  readonly freezePublicApiCount: 8;
  readonly publicIndexPublicApiCount: 12;
  readonly totalReleasedPublicApiCount: 76;
  readonly lockCount: number;
  readonly compatibilityCount: number;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly platformStatus: "PlatformComplete";
  readonly stability: StabilityValue;
  readonly readiness: "ReadyForConsumer";
  readonly readyForDKL4: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

interface PublicReleaseMetadataDescriptor {
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly namespace: string;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly platformStatus: "PlatformComplete";
  readonly readiness: "ReadyForConsumer";
  readonly readyForDKL4: true;
  readonly stability: StabilityValue;
  readonly publicApiCount: 76;
  readonly namespaceSectionCount: 9;
  readonly freezeVersion: string;
  readonly platformVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly Released: true;
  readonly Certified: true;
  readonly Frozen: true;
  readonly Stable: true;
  readonly ReadyForConsumer: true;
  readonly ReadyForDKL4: true;
}

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-3:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = DataUnderstandingFreeze;
const certifiedPlatform = freeze.certifiedPlatform;
const certificationSurface = freeze.certification;

const FOUNDATION_APIS = Object.freeze([
  "DataUnderstandingFoundation",
  "DataUnderstandingContracts",
  "DataUnderstandingOwnership",
  "DataUnderstandingBoundaries",
  "DataUnderstandingLifecycle",
  "DataUnderstandingEvidenceCatalog",
  "DataUnderstandingFoundationVersion",
  "validateDataUnderstandingFoundationInput",
] as const);

const REGISTRY_APIS = Object.freeze([
  "DataUnderstandingRegistry",
  "DataUnderstandingSubjectRegistry",
  "DataUnderstandingCandidateRegistry",
  "DataUnderstandingEvidenceRegistry",
  "DataUnderstandingClarificationRegistry",
  "DataUnderstandingRegistryManifest",
  "DataUnderstandingRegistryVersion",
  "DataUnderstandingRegistryIdentity",
] as const);

const MODEL_APIS = Object.freeze([
  "DataUnderstandingModel",
  "DataUnderstandingCandidateModel",
  "DataUnderstandingEvidenceModel",
  "DataUnderstandingRelationshipModel",
  "DataUnderstandingSnapshotModel",
  "DataUnderstandingModelManifest",
  "DataUnderstandingModelVersion",
  "DataUnderstandingModelIdentity",
] as const);

const VALIDATION_APIS = Object.freeze([
  "DataUnderstandingValidation",
  "DataUnderstandingValidationRules",
  "DataUnderstandingValidationOwnership",
  "DataUnderstandingValidationBoundaries",
  "DataUnderstandingValidationManifest",
  "DataUnderstandingValidationReport",
  "DataUnderstandingValidationVersion",
  "validateDataUnderstandingModel",
] as const);

const MANIFEST_APIS = Object.freeze([
  "DataUnderstandingManifest",
  "DataUnderstandingManifestInventory",
  "DataUnderstandingManifestDependencies",
  "DataUnderstandingManifestCompatibility",
  "DataUnderstandingManifestReadiness",
  "DataUnderstandingManifestSummary",
  "DataUnderstandingManifestVersion",
  "DataUnderstandingManifestIdentity",
] as const);

const PLATFORM_APIS = Object.freeze([
  "DataUnderstandingPlatform",
  "DataUnderstandingPlatformRegistry",
  "DataUnderstandingPlatformCompatibility",
  "DataUnderstandingPlatformDependencies",
  "DataUnderstandingPlatformReadiness",
  "DataUnderstandingPlatformSummary",
  "DataUnderstandingPlatformVersion",
  "DataUnderstandingPlatformIdentity",
] as const);

const CERTIFICATION_APIS = Object.freeze([
  "DataUnderstandingCertification",
  "DataUnderstandingCertificationRegistry",
  "DataUnderstandingCertificationCompatibility",
  "DataUnderstandingCertificationEvidence",
  "DataUnderstandingCertificationManifest",
  "DataUnderstandingCertificationReport",
  "DataUnderstandingCertificationVersion",
  "DataUnderstandingCertificationIdentity",
] as const);

const FREEZE_APIS = Object.freeze([
  "DataUnderstandingFreeze",
  "DataUnderstandingFreezeRegistry",
  "DataUnderstandingFreezeCompatibility",
  "DataUnderstandingFreezeLocks",
  "DataUnderstandingFreezeManifest",
  "DataUnderstandingFreezeSummary",
  "DataUnderstandingFreezeVersion",
  "DataUnderstandingFreezeIdentity",
] as const);

const PUBLIC_INDEX_APIS = Object.freeze([
  "DataUnderstandingPlatformPublicFoundation",
  "DataUnderstandingPublicApiRegistry",
  "DataUnderstandingPublicIndexId",
  "DataUnderstandingPublicIndexVersion",
  "DataUnderstandingPublicIndexName",
  "DataUnderstandingPublicIndexNamespace",
  "DataUnderstandingPublicReleaseStatus",
  "DataUnderstandingPublicCertificationStatus",
  "DataUnderstandingPublicFreezeStatus",
  "getDataUnderstandingPublicSummary",
  "getDataUnderstandingPublicApiCount",
  "getDataUnderstandingPublicReleaseMetadata",
] as const);

const api = (
  name: string,
  sourcePhase: string,
  ownership: string,
): PublicApiEntry =>
  Object.freeze({
    identity: `${sourcePhase}/${name}`,
    name,
    sourcePhase,
    version: "1.0.0",
    releaseStatus: "Released" as const,
    stability: "Stable" as const,
    ownership,
  });

const phaseEntries = (
  names: readonly string[],
  sourcePhase: string,
  ownership: string,
): readonly PublicApiEntry[] =>
  Object.freeze(names.map((name) => api(name, sourcePhase, ownership)));

const PUBLIC_API_ENTRIES: readonly PublicApiEntry[] = Object.freeze([
  ...phaseEntries(FOUNDATION_APIS, "DKL-3:1", "DKL-3:1 Data Understanding Foundation"),
  ...phaseEntries(REGISTRY_APIS, "DKL-3:2", "DKL-3:2 Data Understanding Registry"),
  ...phaseEntries(MODEL_APIS, "DKL-3:3", "DKL-3:3 Data Understanding Model"),
  ...phaseEntries(VALIDATION_APIS, "DKL-3:4", "DKL-3:4 Data Understanding Validation"),
  ...phaseEntries(MANIFEST_APIS, "DKL-3:5", "DKL-3:5 Data Understanding Manifest"),
  ...phaseEntries(PLATFORM_APIS, "DKL-3:6", "DKL-3:6 Data Understanding Platform"),
  ...phaseEntries(CERTIFICATION_APIS, "DKL-3:7", "DKL-3:7 Data Understanding Certification"),
  ...phaseEntries(FREEZE_APIS, "DKL-3:8", "DKL-3:8 Data Understanding Freeze"),
  ...phaseEntries(PUBLIC_INDEX_APIS, "DKL-3:9", "DKL-3:9 Data Understanding Public Index"),
]);

/** Immutable registry of every released public API from DKL-3:1 through DKL-3:9. */
export const DataUnderstandingPublicApiRegistry = Object.freeze({
  registryId: "DKL-3:9/PublicApiRegistry",
  entries: PUBLIC_API_ENTRIES,
  entryCount: PUBLIC_API_ENTRIES.length,
  releasedPhases: 9 as const,
  releasedPublicApiCount: 76 as const,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

// --------------------------------------------------------------------------
// Identity and status primitives.
// --------------------------------------------------------------------------

export const DataUnderstandingPublicIndexId = "DKL-3:9/DataUnderstandingPublicIndex";
export const DataUnderstandingPublicIndexVersion = "1.0.0";
export const DataUnderstandingPublicIndexName = "Data Understanding Public Index";
export const DataUnderstandingPublicIndexNamespace =
  "nexora.dkl.data-understanding.public";
export const DataUnderstandingPublicReleaseStatus: ReleaseStatusValue = "Released";
export const DataUnderstandingPublicCertificationStatus: CertificationStatusValue =
  "Certified";
export const DataUnderstandingPublicFreezeStatus: FreezeStatusValue = "Frozen";

const PUBLIC_INDEX_SECTION = Object.freeze({
  identity: Object.freeze({
    publicIndexId: DataUnderstandingPublicIndexId,
    publicIndexVersion: DataUnderstandingPublicIndexVersion,
    publicIndexName: DataUnderstandingPublicIndexName,
    publicIndexNamespace: DataUnderstandingPublicIndexNamespace,
    platformId: "DKL-3" as const,
    owner: "DKL-3:9 Data Understanding Public Index",
    sourcePhase: "DKL-3:9" as const,
  }),
  releaseStatus: DataUnderstandingPublicReleaseStatus,
  certificationStatus: DataUnderstandingPublicCertificationStatus,
  freezeStatus: DataUnderstandingPublicFreezeStatus,
  platformStatus: "PlatformComplete" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  readyForDKL4: true as const,
  apiRegistry: DataUnderstandingPublicApiRegistry,
  freezeIdentity: DataUnderstandingFreezeIdentity,
  freezeVersion: DataUnderstandingFreezeVersion,
  freezeRegistry: DataUnderstandingFreezeRegistry,
  freezeCompatibility: DataUnderstandingFreezeCompatibility,
  freezeLocks: DataUnderstandingFreezeLocks,
  freezeManifest: DataUnderstandingFreezeManifest,
  freezeSummary: DataUnderstandingFreezeSummary,
  freezeModuleExportCount: Object.keys(freezeModule).length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * The one immutable, canonical public namespace for the complete DKL-3
 * Data Understanding Platform. Exactly nine ordered sections — reference only.
 */
export const DataUnderstandingPlatformPublicFoundation = Object.freeze({
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
  publicIndexId: DataUnderstandingPublicIndexId,
  version: DataUnderstandingPublicIndexVersion,
  name: DataUnderstandingPublicIndexName,
  namespace: DataUnderstandingPublicIndexNamespace,
  phaseCount: 9 as const,
  namespaceSectionCount: 9 as const,
  frozenPhaseCount: 7 as const,
  frozenPublicApiCount: 56 as const,
  freezePublicApiCount: 8 as const,
  publicIndexPublicApiCount: 12 as const,
  totalReleasedPublicApiCount: 76 as const,
  lockCount: DataUnderstandingFreezeLocks.lockCount,
  compatibilityCount: DataUnderstandingFreezeCompatibility.entryCount,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  platformStatus: "PlatformComplete",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  readyForDKL4: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const RELEASE_METADATA: PublicReleaseMetadataDescriptor = Object.freeze({
  publicIndexId: DataUnderstandingPublicIndexId,
  publicIndexVersion: DataUnderstandingPublicIndexVersion,
  publicIndexName: DataUnderstandingPublicIndexName,
  namespace: DataUnderstandingPublicIndexNamespace,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  platformStatus: "PlatformComplete",
  readiness: "ReadyForConsumer",
  readyForDKL4: true,
  stability: "Stable",
  publicApiCount: 76 as const,
  namespaceSectionCount: 9 as const,
  freezeVersion: DataUnderstandingFreezeVersion,
  platformVersion: certifiedPlatform.version,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  Released: true,
  Certified: true,
  Frozen: true,
  Stable: true,
  ReadyForConsumer: true,
  ReadyForDKL4: true,
});

/** Deterministic readonly public-index summary (stable reference). */
export function getDataUnderstandingPublicSummary(): PublicIndexSummaryDescriptor {
  return SUMMARY;
}

/** Deterministic released public API count (stable literal). */
export function getDataUnderstandingPublicApiCount(): number {
  return DataUnderstandingPublicApiRegistry.releasedPublicApiCount;
}

/** Deterministic readonly release metadata (stable reference). */
export function getDataUnderstandingPublicReleaseMetadata(): PublicReleaseMetadataDescriptor {
  return RELEASE_METADATA;
}
