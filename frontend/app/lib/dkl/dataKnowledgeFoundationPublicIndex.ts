/**
 * DKL-1:9 — Data Knowledge Foundation Public Index.
 *
 * The single canonical, immutable public release surface for the complete DKL-1
 * Data Knowledge Foundation. This is the ONLY supported public entry point for
 * DKL-1. It aggregates — strictly by reference — the certified and frozen
 * architecture through the official public APIs of DKL-1:1 through DKL-1:8.
 *
 * Future DKL consumers must import only this file.
 *
 * Zero runtime behavior: no I/O, no network, no filesystem, no database,
 * no parsing, no reflection, no dynamic import, no async, no side effects.
 * It introduces no new architecture and modifies no earlier phase.
 */

import { DataKnowledgeFoundation } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationCertification } from "./dataKnowledgeFoundationCertificationIndex.ts";
import { DataKnowledgeFoundationFreeze } from "./dataKnowledgeFoundationFreezeIndex.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModel } from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationPlatform } from "./dataKnowledgeFoundationPlatformIndex.ts";
import { DataKnowledgeFoundationRegistry } from "./dataKnowledgeFoundationRegistryIndex.ts";
import { DataKnowledgeFoundationValidation } from "./dataKnowledgeFoundationValidation.ts";

type PublicReleaseStatus = "RELEASED";
type PublicCertificationStatus = "CERTIFIED";
type PublicFreezeStatus = "FROZEN";
type PublicStability = "STABLE";
type PublicReadiness = "ReadyForConsumer";

interface PublicIndexGuarantees {
  readonly released: true;
  readonly certified: true;
  readonly frozen: true;
  readonly stable: true;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deepFrozen: true;
  readonly deterministic: true;
  readonly publicApiStable: true;
  readonly canonicalReferencesPreserved: true;
  readonly readyForConsumer: true;
}

interface PublicIndexStatusDescriptor {
  readonly releaseStatus: PublicReleaseStatus;
  readonly certificationStatus: PublicCertificationStatus;
  readonly freezeStatus: PublicFreezeStatus;
  readonly stability: PublicStability;
  readonly readiness: PublicReadiness;
  readonly guarantees: PublicIndexGuarantees;
  readonly metadataOnly: true;
  readonly immutable: true;
}

interface PublicApiRegistryDescriptor {
  readonly releasedPhases: number;
  readonly releasedSections: number;
  readonly releasedPublicApis: number;
  readonly frozenApis: number;
  readonly certifiedApis: number;
  readonly namespace: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

interface PublicSummaryDescriptor {
  readonly publicIndexId: "DKL-1:9";
  readonly totalPhases: number;
  readonly totalSections: number;
  readonly totalReleasedApis: number;
  readonly certification: PublicCertificationStatus;
  readonly stability: PublicStability;
  readonly readiness: PublicReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

interface ReleaseMetadataDescriptor {
  readonly release: PublicReleaseStatus;
  readonly certification: PublicCertificationStatus;
  readonly freeze: PublicFreezeStatus;
  readonly stability: PublicStability;
  readonly readiness: PublicReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const DataKnowledgeFoundationPublicIndexId = "DKL-1:9";

export const DataKnowledgeFoundationPublicIndexVersion = "1.0.0";

export const DataKnowledgeFoundationPublicIndexName = "Data Knowledge Foundation Public Index";

export const DataKnowledgeFoundationPublicIndexNamespace = "nexora.dkl.foundation.public-index";

export const DataKnowledgeFoundationPublicIndexStatus = Object.freeze({
  releaseStatus: "RELEASED",
  certificationStatus: "CERTIFIED",
  freezeStatus: "FROZEN",
  stability: "STABLE",
  readiness: "ReadyForConsumer",
  guarantees: Object.freeze({
    released: true,
    certified: true,
    frozen: true,
    stable: true,
    metadataOnly: true,
    runtimeFree: true,
    deepFrozen: true,
    deterministic: true,
    publicApiStable: true,
    canonicalReferencesPreserved: true,
    readyForConsumer: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const satisfies PublicIndexStatusDescriptor);

export const DataKnowledgeFoundationPublicPlatform = Object.freeze({
  foundation: DataKnowledgeFoundation,
  registry: DataKnowledgeFoundationRegistry,
  model: DataKnowledgeFoundationModel,
  validation: DataKnowledgeFoundationValidation,
  manifest: DataKnowledgeFoundationManifest,
  platform: DataKnowledgeFoundationPlatform,
  certification: DataKnowledgeFoundationCertification,
  freeze: DataKnowledgeFoundationFreeze,
  publicIndex: DataKnowledgeFoundationPublicIndexStatus,
} as const);

type PublicPlatform = typeof DataKnowledgeFoundationPublicPlatform;
type PublicSectionName = keyof PublicPlatform;

const SECTION_NAMES = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
]);

export const DataKnowledgeFoundationPublicApiRegistry = Object.freeze({
  releasedPhases: 9,
  releasedSections: SECTION_NAMES.length,
  releasedPublicApis: 67,
  frozenApis: DataKnowledgeFoundationFreeze.summary.frozenApis,
  certifiedApis: DataKnowledgeFoundationFreeze.registry.frozenBaselines.totalPreCertificationApis,
  namespace: DataKnowledgeFoundationPublicIndexNamespace,
  metadataOnly: true,
  immutable: true,
} as const satisfies PublicApiRegistryDescriptor);

const RELEASE_METADATA: ReleaseMetadataDescriptor = Object.freeze({
  release: "RELEASED",
  certification: "CERTIFIED",
  freeze: "FROZEN",
  stability: "STABLE",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
});

const PUBLIC_SUMMARY: PublicSummaryDescriptor = Object.freeze({
  publicIndexId: "DKL-1:9",
  totalPhases: DataKnowledgeFoundationPublicApiRegistry.releasedPhases,
  totalSections: DataKnowledgeFoundationPublicApiRegistry.releasedSections,
  totalReleasedApis: DataKnowledgeFoundationPublicApiRegistry.releasedPublicApis,
  certification: "CERTIFIED",
  stability: "STABLE",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
});

export const getDataKnowledgeFoundationPublicPlatform = (): PublicPlatform =>
  DataKnowledgeFoundationPublicPlatform;

export const getDataKnowledgeFoundationPublicSummary = (): PublicSummaryDescriptor =>
  PUBLIC_SUMMARY;

export const getDataKnowledgeFoundationPublicApiRegistry = (): PublicApiRegistryDescriptor =>
  DataKnowledgeFoundationPublicApiRegistry;

export const getDataKnowledgeFoundationReleaseMetadata = (): ReleaseMetadataDescriptor =>
  RELEASE_METADATA;

export const getDataKnowledgeFoundationPublicSection = (
  sectionName: string
): PublicPlatform[PublicSectionName] | undefined => {
  if ((SECTION_NAMES as readonly string[]).includes(sectionName)) {
    return DataKnowledgeFoundationPublicPlatform[sectionName as PublicSectionName];
  }
  return undefined;
};
