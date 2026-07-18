/**
 * DKL-2:9 — Data Source & Knowledge Registry Public Index.
 *
 * The sole canonical, immutable, released public entry point for the complete
 * Nexora DKL-2 Data Source & Knowledge Registry Platform (DKL-2:1 through
 * DKL-2:8). Every future consumer must import DKL-2 through this module. Direct
 * consumption of earlier DKL-2 phase modules is internal architectural usage.
 *
 * This phase introduces no new architecture, registry entries, models,
 * validation rules, manifests, capabilities, or runtime behavior. It publishes
 * the frozen architecture as one clear, stable, consumer-ready release surface.
 *
 * Ownership: owned exclusively by DKL-2:9.
 * Dependency rules: consumes DKL-2 exclusively through the DKL-2:8 Freeze
 * Platform. The canonical chain is:
 *   publicIndex -> freeze -> certification -> platform -> manifest ->
 *   validation -> model -> registry -> foundation
 * Forward-only, cycle-free, public-API-only. Zero runtime behavior: no I/O, no
 * network, no reflection, no async, no side effects, no mutation.
 */

import { DataSourceKnowledgeFreezePlatform } from "./dataSourceKnowledgeFreezePlatform.ts";
import * as freezeModule from "./dataSourceKnowledgeFreezePlatform.ts";

// --------------------------------------------------------------------------
// Local vocabulary (type-only, non-exported to keep runtime exports at 12).
// --------------------------------------------------------------------------

type NamespaceSectionName =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform"
  | "certification"
  | "freeze"
  | "publicIndex";

type ApiKind =
  | "NamespaceSection"
  | "Namespace"
  | "Platform"
  | "Registry"
  | "Value"
  | "Readiness"
  | "Lookup";

type ReleaseStatusValue = "Released";
type CertificationStatusValue = "Certified";
type FreezeStatusValue = "Frozen";
type StabilityValue = "StableAndFrozen";
type VisibilityValue = "Public";
type ReadinessValue = "ReadyForConsumers";

interface PublicApiEntry {
  readonly apiId: string;
  readonly apiName: string;
  readonly apiKind: ApiKind;
  readonly ownerPhase: string;
  readonly namespaceSection: NamespaceSectionName;
  readonly sourceModule: string;
  readonly stability: StabilityValue;
  readonly releaseStatus: ReleaseStatusValue;
  readonly visibility: VisibilityValue;
  readonly description: string;
}

interface PublicIndexIdentityDescriptor {
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly stability: StabilityValue;
  readonly readiness: ReadinessValue;
}

interface PublicIndexReleaseMetadataDescriptor {
  readonly releaseId: string;
  readonly releaseVersion: string;
  readonly releaseName: string;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly stability: StabilityValue;
  readonly namespaceSectionCount: number;
  readonly priorFrozenRuntimeApiCount: number;
  readonly publicIndexRuntimeExportCount: number;
  readonly registryEntryCount: number;
  readonly modelCount: number;
  readonly validationPassCount: number;
  readonly certificationGateCount: number;
  readonly freezeGuaranteeCount: number;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly readiness: ReadinessValue;
  readonly nextConsumer: string;
  readonly futureCompatibleConsumers: readonly string[];
}

interface PublicIndexReadinessDescriptor {
  readonly status: "PublicIndexComplete";
  readonly completion: readonly string[];
  readonly released: boolean;
  readonly certified: boolean;
  readonly frozen: boolean;
  readonly stableAndFrozen: boolean;
  readonly metadataOnly: boolean;
  readonly runtimeFree: boolean;
  readonly deterministic: boolean;
  readonly immutable: boolean;
  readonly ownershipProtected: boolean;
  readonly publicSurfaceControlled: boolean;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly readiness: ReadinessValue;
}

interface PublicIndexSummaryDescriptor {
  readonly phaseCount: number;
  readonly namespaceSectionCount: number;
  readonly priorFrozenRuntimeApiCount: number;
  readonly publicIndexRuntimeExportCount: number;
  readonly registeredPublicApiCount: number;
  readonly registryEntryCount: number;
  readonly modelCount: number;
  readonly validationRuleCount: number;
  readonly validationPassCount: number;
  readonly certificationGateCount: number;
  readonly freezeGuaranteeCount: number;
  readonly releaseStatus: ReleaseStatusValue;
  readonly certificationStatus: CertificationStatusValue;
  readonly freezeStatus: FreezeStatusValue;
  readonly stability: StabilityValue;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly readiness: ReadinessValue;
  readonly nextConsumer: string;
}

// --------------------------------------------------------------------------
// Canonical references reachable through the DKL-2:8 Freeze Platform only.
// No copying, no rehydration, no restructuring — reference identity preserved.
// --------------------------------------------------------------------------

const freeze = DataSourceKnowledgeFreezePlatform;
const completePlatform = freeze.certifiedPlatform; // DKL-2:6 complete aggregate
const foundationSurface = completePlatform.foundation; // DKL-2:1
const registrySurface = completePlatform.registry; // DKL-2:2 registry-entry platform
const modelSurface = completePlatform.model; // DKL-2:3
const validationSurface = completePlatform.validation; // DKL-2:4
const manifestSurface = completePlatform.manifest; // DKL-2:5
const certificationSurface = freeze.certification; // DKL-2:7

// Frozen runtime API accounting. Prior frozen module-level runtime APIs cover
// DKL-2:1..2:7 (52 via the freeze registry) plus the eight DKL-2:8 freeze
// module exports, yielding the canonical 60. Derived, never hardcoded.
const PRIOR_FROZEN_RUNTIME_API_COUNT =
  freeze.summary.frozenRuntimeApiCount + Object.keys(freezeModule).length;
const PUBLIC_INDEX_RUNTIME_EXPORT_COUNT = 12;
const NAMESPACE_SECTION_COUNT = 9;

// --------------------------------------------------------------------------
// Public-index identity.
// --------------------------------------------------------------------------

const IDENTITY: PublicIndexIdentityDescriptor = Object.freeze({
  publicIndexId: "DKL-2:9",
  publicIndexVersion: "1.0.0",
  publicIndexName: "Data Source & Knowledge Registry Public Index",
  publicIndexNamespace: "nexora.dkl.dsk-registry.public",
  platformId: "DKL-2",
  platformVersion: "1.0.0",
  owner: "DKL-2:9",
  sourcePhase: "DKL-2:9",
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "StableAndFrozen",
  readiness: "ReadyForConsumers",
});

// --------------------------------------------------------------------------
// Public API Registry — every approved public API of the DKL-2 Public Index.
// --------------------------------------------------------------------------

const PUBLIC_API_ENTRIES: readonly PublicApiEntry[] = Object.freeze([
  // Nine inherited namespace sections.
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-FOUNDATION",
    apiName: "foundation",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:1",
    namespaceSection: "foundation",
    sourceModule: "dataSourceKnowledgeRegistryFoundation.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:1 foundation surface (identity, ownership, boundaries, contracts).",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-REGISTRY",
    apiName: "registry",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:2",
    namespaceSection: "registry",
    sourceModule: "dataSourceKnowledgeRegistryPlatform.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:2 registry-entry platform (data-source, knowledge, connector, content, source-group, compatibility, manifest).",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-MODEL",
    apiName: "model",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:3",
    namespaceSection: "model",
    sourceModule: "dataSourceRegistryModelPlatform.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:3 model platform.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-VALIDATION",
    apiName: "validation",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:4",
    namespaceSection: "validation",
    sourceModule: "dataSourceKnowledgeValidationRunner.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:4 validation platform.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-MANIFEST",
    apiName: "manifest",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:5",
    namespaceSection: "manifest",
    sourceModule: "dataSourceKnowledgeRegistryManifestPlatform.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:5 manifest platform.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-PLATFORM",
    apiName: "platform",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:6",
    namespaceSection: "platform",
    sourceModule: "dataSourceKnowledgeRegistryPlatformIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:6 complete aggregate platform, also exported as DataSourceKnowledgeRegistryPlatform.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-CERTIFICATION",
    apiName: "certification",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:7",
    namespaceSection: "certification",
    sourceModule: "dataSourceKnowledgeCertificationPlatform.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:7 certification platform.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-FREEZE",
    apiName: "freeze",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:8",
    namespaceSection: "freeze",
    sourceModule: "dataSourceKnowledgeFreezePlatform.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Canonical DKL-2:8 freeze platform.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-SECTION-PUBLIC-INDEX",
    apiName: "publicIndex",
    apiKind: "NamespaceSection",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "DKL-2:9 release metadata, identity, public API registry, summary, and readiness.",
  }),
  // Twelve DKL-2:9 top-level public exports.
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-PUBLIC-PLATFORM",
    apiName: "DataSourceKnowledgeRegistryPublicPlatform",
    apiKind: "Namespace",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The canonical nine-section public namespace for DKL-2.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-PLATFORM",
    apiName: "DataSourceKnowledgeRegistryPlatform",
    apiKind: "Platform",
    ownerPhase: "DKL-2:6",
    namespaceSection: "platform",
    sourceModule: "dataSourceKnowledgeRegistryPlatformIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The one canonical complete DKL-2 platform (DKL-2:6 aggregate).",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-API-REGISTRY",
    apiName: "DataSourceKnowledgeRegistryPublicApiRegistry",
    apiKind: "Registry",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The immutable registry of every approved DKL-2 public API.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-ID",
    apiName: "DataSourceKnowledgeRegistryPublicIndexId",
    apiKind: "Value",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The stable public-index identifier.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-VERSION",
    apiName: "DataSourceKnowledgeRegistryPublicIndexVersion",
    apiKind: "Value",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The stable public-index version.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-NAME",
    apiName: "DataSourceKnowledgeRegistryPublicIndexName",
    apiKind: "Value",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The stable public-index name.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-NAMESPACE",
    apiName: "DataSourceKnowledgeRegistryPublicIndexNamespace",
    apiKind: "Value",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The stable public-index namespace string.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-RELEASE-STATUS",
    apiName: "DataSourceKnowledgeRegistryPublicIndexReleaseStatus",
    apiKind: "Value",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The published release status (Released).",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-READINESS",
    apiName: "DataSourceKnowledgeRegistryPublicIndexReadiness",
    apiKind: "Readiness",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "The immutable release-readiness declaration.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-GET-BY-ID",
    apiName: "getDataSourceKnowledgeRegistryPublicApiById",
    apiKind: "Lookup",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Deterministic public API lookup by id.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-GET-BY-SECTION",
    apiName: "getDataSourceKnowledgeRegistryPublicApisBySection",
    apiKind: "Lookup",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Deterministic public API lookup by namespace section.",
  }),
  Object.freeze<PublicApiEntry>({
    apiId: "DKL-2:9/API-EXPORT-GET-SUMMARY",
    apiName: "getDataSourceKnowledgeRegistryPublicIndexSummary",
    apiKind: "Lookup",
    ownerPhase: "DKL-2:9",
    namespaceSection: "publicIndex",
    sourceModule: "dataSourceKnowledgeRegistryPublicIndex.ts",
    stability: "StableAndFrozen",
    releaseStatus: "Released",
    visibility: "Public",
    description: "Deterministic canonical public-index summary accessor.",
  }),
]);

/** The immutable registry describing every approved DKL-2 public API. */
export const DataSourceKnowledgeRegistryPublicApiRegistry: readonly PublicApiEntry[] =
  PUBLIC_API_ENTRIES;

// --------------------------------------------------------------------------
// Release metadata.
// --------------------------------------------------------------------------

const RELEASE_METADATA: PublicIndexReleaseMetadataDescriptor = Object.freeze({
  releaseId: "DKL-2",
  releaseVersion: "1.0.0",
  releaseName: "Data Source & Knowledge Registry Platform",
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "StableAndFrozen",
  namespaceSectionCount: NAMESPACE_SECTION_COUNT,
  priorFrozenRuntimeApiCount: PRIOR_FROZEN_RUNTIME_API_COUNT,
  publicIndexRuntimeExportCount: PUBLIC_INDEX_RUNTIME_EXPORT_COUNT,
  registryEntryCount: freeze.summary.registryEntryCount,
  modelCount: freeze.summary.modelCount,
  validationPassCount: freeze.summary.validationPassCount,
  certificationGateCount: freeze.summary.certificationGateCount,
  freezeGuaranteeCount: freeze.summary.guaranteeCount,
  blockingIssueCount: 0,
  warningCount: 0,
  readiness: "ReadyForConsumers",
  nextConsumer: "DKL-3",
  futureCompatibleConsumers: Object.freeze([
    "DKL-3",
    "CSV Integration v1",
    "Business Object Mapping",
  ]),
});

// --------------------------------------------------------------------------
// Release readiness.
// --------------------------------------------------------------------------

/** Immutable release-readiness declaration for the DKL-2 Public Index. */
export const DataSourceKnowledgeRegistryPublicIndexReadiness: PublicIndexReadinessDescriptor =
  Object.freeze({
    status: "PublicIndexComplete",
    completion: Object.freeze([
      "PublicIndexComplete",
      "Released",
      "Certified",
      "Frozen",
      "StableAndFrozen",
      "MetadataOnly",
      "RuntimeFree",
      "Deterministic",
      "Immutable",
      "OwnershipProtected",
      "PublicSurfaceControlled",
      "ReadyForConsumers",
    ]),
    released: true,
    certified: true,
    frozen: true,
    stableAndFrozen: true,
    metadataOnly: true,
    runtimeFree: true,
    deterministic: true,
    immutable: true,
    ownershipProtected: true,
    publicSurfaceControlled: true,
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForConsumers",
  });

// --------------------------------------------------------------------------
// publicIndex namespace section (DKL-2:9 release surface).
// --------------------------------------------------------------------------

const PUBLIC_INDEX_SECTION = Object.freeze({
  identity: IDENTITY,
  release: RELEASE_METADATA,
  apiRegistry: DataSourceKnowledgeRegistryPublicApiRegistry,
  readiness: DataSourceKnowledgeRegistryPublicIndexReadiness,
});

// --------------------------------------------------------------------------
// The canonical nine-section public namespace (exact order preserved).
// Each section is a canonical reference — no cloning, no reconstruction.
// --------------------------------------------------------------------------

/** The one immutable, canonical public namespace for the complete DKL-2 platform. */
export const DataSourceKnowledgeRegistryPublicPlatform = Object.freeze({
  foundation: foundationSurface,
  registry: registrySurface,
  model: modelSurface,
  validation: validationSurface,
  manifest: manifestSurface,
  platform: completePlatform,
  certification: certificationSurface,
  freeze: freeze,
  publicIndex: PUBLIC_INDEX_SECTION,
});

/**
 * The one canonical complete DKL-2 platform object — the DKL-2:6 aggregate,
 * reached through the frozen DKL-2:8 architecture. This is the same reference
 * held by the `platform` namespace section. The DKL-2:2 registry-entry platform
 * is intentionally NOT re-exported under this name; it is reachable only through
 * the `registry` namespace section.
 */
export const DataSourceKnowledgeRegistryPlatform = completePlatform;

// --------------------------------------------------------------------------
// Immutable public-index identity primitives.
// --------------------------------------------------------------------------

/** The stable public-index identifier. */
export const DataSourceKnowledgeRegistryPublicIndexId: string = IDENTITY.publicIndexId;
/** The stable public-index version. */
export const DataSourceKnowledgeRegistryPublicIndexVersion: string = IDENTITY.publicIndexVersion;
/** The stable public-index name. */
export const DataSourceKnowledgeRegistryPublicIndexName: string = IDENTITY.publicIndexName;
/** The stable public-index namespace string. */
export const DataSourceKnowledgeRegistryPublicIndexNamespace: string = IDENTITY.publicIndexNamespace;
/** The published release status (Released). */
export const DataSourceKnowledgeRegistryPublicIndexReleaseStatus: string = IDENTITY.releaseStatus;

// --------------------------------------------------------------------------
// Canonical, deeply frozen public-index summary (single stable reference).
// --------------------------------------------------------------------------

const SUMMARY: PublicIndexSummaryDescriptor = Object.freeze({
  phaseCount: NAMESPACE_SECTION_COUNT,
  namespaceSectionCount: NAMESPACE_SECTION_COUNT,
  priorFrozenRuntimeApiCount: PRIOR_FROZEN_RUNTIME_API_COUNT,
  publicIndexRuntimeExportCount: PUBLIC_INDEX_RUNTIME_EXPORT_COUNT,
  registeredPublicApiCount: DataSourceKnowledgeRegistryPublicApiRegistry.length,
  registryEntryCount: freeze.summary.registryEntryCount,
  modelCount: freeze.summary.modelCount,
  validationRuleCount: freeze.baseline.validation.validationRuleCount,
  validationPassCount: freeze.summary.validationPassCount,
  certificationGateCount: freeze.summary.certificationGateCount,
  freezeGuaranteeCount: freeze.summary.guaranteeCount,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "StableAndFrozen",
  blockingIssueCount: 0,
  warningCount: 0,
  readiness: "ReadyForConsumers",
  nextConsumer: "DKL-3",
});

const EMPTY_API_LIST: readonly PublicApiEntry[] = Object.freeze([]);

// --------------------------------------------------------------------------
// Deterministic, side-effect-free lookups.
// --------------------------------------------------------------------------

/** Return the canonical immutable API entry for `id`, or undefined if unknown. */
export function getDataSourceKnowledgeRegistryPublicApiById(
  id: string,
): PublicApiEntry | undefined {
  return DataSourceKnowledgeRegistryPublicApiRegistry.find((entry) => entry.apiId === id);
}

/** Return, in deterministic registry order, all public APIs owned by `section`. */
export function getDataSourceKnowledgeRegistryPublicApisBySection(
  section: NamespaceSectionName,
): readonly PublicApiEntry[] {
  const matches = DataSourceKnowledgeRegistryPublicApiRegistry.filter(
    (entry) => entry.namespaceSection === section,
  );
  return matches.length === 0 ? EMPTY_API_LIST : Object.freeze(matches);
}

/** Return the canonical, deeply frozen public-index summary (stable reference). */
export function getDataSourceKnowledgeRegistryPublicIndexSummary(): PublicIndexSummaryDescriptor {
  return SUMMARY;
}
