/**
 * DKL-9:9 — Data Knowledge Suite Public Index.
 *
 * Sole supported public release surface for the Data Knowledge Suite.
 * Consumes only DataKnowledgeSuiteFreezePlatform. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-9:9.
 *
 * Public exports (exactly 12):
 *   DataKnowledgeSuitePlatformPublicFoundation
 *   DataKnowledgeSuitePublicApiRegistry
 *   DataKnowledgeSuitePublicIndexId
 *   DataKnowledgeSuitePublicIndexVersion
 *   DataKnowledgeSuitePublicIndexName
 *   DataKnowledgeSuitePublicIndexNamespace
 *   DataKnowledgeSuitePublicReleaseStatus
 *   DataKnowledgeSuitePublicCertificationStatus
 *   DataKnowledgeSuitePublicFreezeStatus
 *   getDataKnowledgeSuitePublicSummary()
 *   getDataKnowledgeSuitePublicApiCount()
 *   getDataKnowledgeSuitePublicReleaseMetadata()
 */

import { DataKnowledgeSuiteFreezePlatform } from "./dataKnowledgeSuiteFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type DataKnowledgeSuitePublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type DataKnowledgeSuitePublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: DataKnowledgeSuitePublicApiKind;
  version: string;
  status: "Released";
  stability: "Stable";
  sourceReference: string;
  public: true;
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  upstreamApiId: string;
  deterministicOrder: number;
}>;

type DataKnowledgeSuiteReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-9:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = DataKnowledgeSuiteFreezePlatform;
const certification = freeze.certification;
const platform = freeze.platform;
const manifest = freeze.manifest;
const validation = freeze.validation;
const model = freeze.model;
const registry = freeze.registry;
const foundation = freeze.foundation;

const foundationApis = foundation.apiRegistry;
const registryApis = registry.apiRegistry;
const modelApis = model.apiRegistry;
const validationApis = validation.apiRegistry;
const manifestApis = manifest.apiRegistry;
const platformApis = platform.apiRegistry;
const certificationApis = certification.apiRegistry;
const freezeApis = freeze.apiRegistry;

const chainIds = Object.freeze({
  freezeId: freeze.identity.freezeId,
  freezeVersion: freeze.identity.freezeVersion,
  freezeLock: freeze.lock.id,
  certificationId: certification.identity.certificationId,
  platformId: platform.identity.platformId,
  manifestId: manifest.identity.manifestId,
  validationId: validation.identity.validationId,
  modelId: model.identity.modelId,
  registryId: registry.identity.registryId,
  foundationId: foundation.identity.foundationId,
});

// --------------------------------------------------------------------------
// Public Index identity and release constants.
// --------------------------------------------------------------------------

export const DataKnowledgeSuitePublicIndexId =
  "DKL-9:9/DataKnowledgeSuitePublicIndex" as const;

export const DataKnowledgeSuitePublicIndexVersion = "1.0.0" as const;

export const DataKnowledgeSuitePublicIndexName =
  "Data Knowledge Suite Public Index" as const;

export const DataKnowledgeSuitePublicIndexNamespace =
  "nexora.dkl.data-knowledge-suite.public-index" as const;

export const DataKnowledgeSuitePublicReleaseStatus = "Released" as const;

export const DataKnowledgeSuitePublicCertificationStatus =
  "Certified" as const;

export const DataKnowledgeSuitePublicFreezeStatus = "Frozen" as const;

const DataKnowledgeSuitePublicStabilityStatus = "Stable" as const;
const DataKnowledgeSuitePublicArchitectureStatus = "Complete" as const;
const DataKnowledgeSuitePublicConsumerReadiness = "ReadyForConsumer" as const;
const DataKnowledgeSuitePublicNextPhaseReadiness =
  "DKL Layer Complete" as const;

const PUBLIC_INDEX_API_NAMES = Object.freeze([
  "DataKnowledgeSuitePlatformPublicFoundation",
  "DataKnowledgeSuitePublicApiRegistry",
  "DataKnowledgeSuitePublicIndexId",
  "DataKnowledgeSuitePublicIndexVersion",
  "DataKnowledgeSuitePublicIndexName",
  "DataKnowledgeSuitePublicIndexNamespace",
  "DataKnowledgeSuitePublicReleaseStatus",
  "DataKnowledgeSuitePublicCertificationStatus",
  "DataKnowledgeSuitePublicFreezeStatus",
  "getDataKnowledgeSuitePublicSummary",
  "getDataKnowledgeSuitePublicApiCount",
  "getDataKnowledgeSuitePublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "DKL-9:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "dataKnowledgeSuiteFoundation.ts",
  }),
  "DKL-9:2": Object.freeze({
    section: "Registry",
    version: registry.identity.registryVersion,
    sourceReference: "dataKnowledgeSuiteRegistry.ts",
  }),
  "DKL-9:3": Object.freeze({
    section: "Model",
    version: model.identity.modelVersion,
    sourceReference: "dataKnowledgeSuiteModel.ts",
  }),
  "DKL-9:4": Object.freeze({
    section: "Validation",
    version: validation.identity.validationVersion,
    sourceReference: "dataKnowledgeSuiteValidation.ts",
  }),
  "DKL-9:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.manifestVersion,
    sourceReference: "dataKnowledgeSuiteManifest.ts",
  }),
  "DKL-9:6": Object.freeze({
    section: "Platform",
    version: platform.identity.platformVersion,
    sourceReference: "dataKnowledgeSuitePlatform.ts",
  }),
  "DKL-9:7": Object.freeze({
    section: "Certification",
    version: certification.identity.certificationVersion,
    sourceReference: "dataKnowledgeSuiteCertification.ts",
  }),
  "DKL-9:8": Object.freeze({
    section: "Freeze",
    version: freeze.identity.freezeVersion,
    sourceReference: "dataKnowledgeSuiteFreeze.ts",
  }),
  "DKL-9:9": Object.freeze({
    section: "PublicIndex",
    version: DataKnowledgeSuitePublicIndexVersion,
    sourceReference: "dataKnowledgeSuitePublicIndex.ts",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

type UpstreamApiSource = Readonly<{
  exportName: string;
  id?: string;
  apiId?: string;
  kind?: DataKnowledgeSuitePublicApiKind;
  version?: string;
  sourceReference?: string;
}>;

const classify = (exportName: string): DataKnowledgeSuitePublicApiKind => {
  if (exportName.startsWith("get")) {
    return "Helper";
  }
  if (
    exportName.endsWith("Id") ||
    exportName.endsWith("Name") ||
    exportName.endsWith("Version") ||
    exportName.endsWith("Namespace")
  ) {
    return "IdentityConstant";
  }
  if (
    exportName.endsWith("Status") ||
    exportName.endsWith("Readiness") ||
    exportName.endsWith("Registry")
  ) {
    return "MetadataConstant";
  }
  return "Aggregate";
};

const publicApiEntry = (
  phase: PhaseKey,
  source: UpstreamApiSource | string,
  order: number,
): DataKnowledgeSuitePublicApiEntry => {
  const meta = PHASE_META[phase];
  const exportName = typeof source === "string" ? source : source.exportName;
  const kind =
    typeof source === "string"
      ? classify(exportName)
      : (source.kind ?? classify(exportName));
  const upstreamApiId =
    typeof source === "string"
      ? `DKL-9:9/OwnedApi/${exportName}`
      : (source.id ?? source.apiId ?? `DKL-9:9/OwnedApi/${exportName}`);
  return Object.freeze({
    id: `DKL-9:9/PublicApi/${phase}/${exportName}`,
    exportName,
    phase,
    section: meta.section,
    kind,
    version:
      typeof source === "string"
        ? meta.version
        : (source.version ?? meta.version),
    status: "Released" as const,
    stability: "Stable" as const,
    sourceReference:
      typeof source === "string"
        ? meta.sourceReference
        : (source.sourceReference ?? meta.sourceReference),
    public: true as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    upstreamApiId,
    deterministicOrder: order,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  sources: readonly UpstreamApiSource[] | readonly string[],
  startOrder: number,
): readonly DataKnowledgeSuitePublicApiEntry[] =>
  Object.freeze(
    sources.map((source, index) =>
      publicApiEntry(phase, source, startOrder + index),
    ),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries("DKL-9:1", foundationApis, nextOrder);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("DKL-9:2", registryApis, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("DKL-9:3", modelApis, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("DKL-9:4", validationApis, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("DKL-9:5", manifestApis, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("DKL-9:6", platformApis, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "DKL-9:7",
  certificationApis,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("DKL-9:8", freezeApis, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "DKL-9:9",
  PUBLIC_INDEX_API_NAMES,
  nextOrder,
);

/**
 * Architectural boundary for DataKnowledgeSuitePublicApiRegistry.
 * Metadata only — not a top-level public export (preserves exactly 12).
 */
const DATA_KNOWLEDGE_SUITE_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE =
  Object.freeze({
    ownership:
      "Owns only the canonical public release surface of DKL-9.",
    prohibition:
      "Must never flatten, duplicate, reconstruct, or republish the public APIs of DKL-1 through DKL-8.",
    access:
      "Earlier DKL layers remain available exclusively through canonical references preserved by DataKnowledgeSuiteFreezePlatform.",
    principles: Object.freeze([
      "Sole Public Entry Point",
      "Canonical Reference Preservation",
      "Canonical Inventory Rule",
      "No Reconstruction Rule",
    ] as const),
  } as const);

/**
 * Canonical immutable Public API registry for the DKL-9 public release surface.
 *
 * Owns only the DKL-9 public release surface (DKL-9:1 through DKL-9:9 top-level
 * exports registered through Freeze-reachable stage registries). It never
 * republishes, flattens, duplicates, or reconstructs DKL-1 through DKL-8 APIs.
 * Earlier DKL layers remain accessible exclusively through canonical references
 * preserved by DataKnowledgeSuiteFreezePlatform.
 *
 * This preserves:
 *   - Sole Public Entry Point
 *   - Canonical Reference Preservation
 *   - Canonical Inventory Rule
 *   - No Reconstruction Rule
 *
 * @see DATA_KNOWLEDGE_SUITE_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE
 */
export const DataKnowledgeSuitePublicApiRegistry: readonly DataKnowledgeSuitePublicApiEntry[] =
  Object.freeze([
    ...foundationEntries,
    ...registryEntries,
    ...modelEntries,
    ...validationEntries,
    ...manifestEntries,
    ...platformEntries,
    ...certificationEntries,
    ...freezeEntries,
    ...publicIndexEntries,
  ]);

const guarantee = (
  order: number,
  statement: string,
): DataKnowledgeSuiteReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-9:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

const RELEASE_GUARANTEES: readonly DataKnowledgeSuiteReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform."),
    guarantee(5, "Validation is reached only through Manifest."),
    guarantee(6, "Model is reached only through Validation."),
    guarantee(7, "Registry is reached only through Model."),
    guarantee(8, "Foundation is reached only through Registry."),
    guarantee(9, "All nine DKL-9 phases are published through one namespace."),
    guarantee(10, "All prior phases remain preserved by canonical reference."),
    guarantee(11, "All approved public APIs are registered exactly once."),
    guarantee(12, "API counts are derived from Freeze-reachable registries."),
    guarantee(13, "Canonical Inventory Rule is preserved through Freeze."),
    guarantee(14, "Runtime Suite execution remains absent."),
    guarantee(15, "Consumers must use the Public Index only."),
    guarantee(16, "DKL-9 is released and the DKL Layer is complete."),
  ]);

const publicIndexMetadata = Object.freeze({
  publicIndexId: DataKnowledgeSuitePublicIndexId,
  publicIndexName: DataKnowledgeSuitePublicIndexName,
  publicIndexVersion: DataKnowledgeSuitePublicIndexVersion,
  publicIndexNamespace: DataKnowledgeSuitePublicIndexNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "PublicIndex" as const,
  releaseStatus: DataKnowledgeSuitePublicReleaseStatus,
  certificationStatus: DataKnowledgeSuitePublicCertificationStatus,
  freezeStatus: DataKnowledgeSuitePublicFreezeStatus,
  stabilityStatus: DataKnowledgeSuitePublicStabilityStatus,
  architectureStatus: DataKnowledgeSuitePublicArchitectureStatus,
  consumerReadiness: DataKnowledgeSuitePublicConsumerReadiness,
  nextPhaseReadiness: DataKnowledgeSuitePublicNextPhaseReadiness,
  publicApiCount: DataKnowledgeSuitePublicApiRegistry.length,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  architecturalPrinciple:
    DATA_KNOWLEDGE_SUITE_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE,
  solePublicEntryPoint: "dataKnowledgeSuitePublicIndex.ts" as const,
  directImportPolicy: "PublicIndexOnly" as const,
  runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
  freezeId: chainIds.freezeId,
  freezeVersion: chainIds.freezeVersion,
  freezeLock: chainIds.freezeLock,
  certificationId: chainIds.certificationId,
  platformId: chainIds.platformId,
  manifestId: chainIds.manifestId,
  validationId: chainIds.validationId,
  modelId: chainIds.modelId,
  registryId: chainIds.registryId,
  foundationId: chainIds.foundationId,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "dataKnowledgeSuiteFreeze.ts" as const,
  freezeOnly: true as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl1DirectImport: false as const,
  dkl8DirectImport: false as const,
  earlierDkl9StageDirectImport: false as const,
  certificationReachedThroughFreeze: true as const,
  platformReachedThroughCertification: true as const,
  manifestReachedThroughPlatform: true as const,
  validationReachedThroughManifest: true as const,
  modelReachedThroughValidation: true as const,
  registryReachedThroughModel: true as const,
  foundationReachedThroughRegistry: true as const,
});

/**
 * Canonical nine-section public namespace.
 * Prior phases preserved by reference through the Freeze chain.
 */
export const DataKnowledgeSuitePlatformPublicFoundation = Object.freeze({
  foundation,
  registry,
  model,
  validation,
  manifest,
  platform,
  certification,
  freeze,
  publicIndex: publicIndexMetadata,
  dependencyDeclarations,
  consumerImportPolicy: Object.freeze({
    soleSupportedEntryPoint: "dataKnowledgeSuitePublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    approvedFutureConsumers: Object.freeze([
      "Executive Engine",
      "Advisor",
      "approved internal Nexora services",
    ] as const),
    architecturalAndMetadataAccessOnly: true as const,
    runtimeServiceOperational: false as const,
  }),
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  mutationBehavior: false as const,
  persists: false as const,
  retrieves: false as const,
  enforcesPolicies: false as const,
  rebuildsInventories: false as const,
  rebuildsApiRegistries: false as const,
  recertifies: false as const,
  refreezes: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Exact unique Public API registry count derived from canonical collections. */
export function getDataKnowledgeSuitePublicApiCount(): number {
  return DataKnowledgeSuitePublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getDataKnowledgeSuitePublicSummary() {
  const upstream = freeze.inventory.upstreamCertificationInventory;
  return Object.freeze({
    publicIndexId: DataKnowledgeSuitePublicIndexId,
    version: DataKnowledgeSuitePublicIndexVersion,
    name: DataKnowledgeSuitePublicIndexName,
    namespace: DataKnowledgeSuitePublicIndexNamespace,
    releaseStatus: DataKnowledgeSuitePublicReleaseStatus,
    certificationStatus: DataKnowledgeSuitePublicCertificationStatus,
    freezeStatus: DataKnowledgeSuitePublicFreezeStatus,
    stabilityStatus: DataKnowledgeSuitePublicStabilityStatus,
    architectureStatus: DataKnowledgeSuitePublicArchitectureStatus,
    consumerReadiness: DataKnowledgeSuitePublicConsumerReadiness,
    nextPhaseReadiness: DataKnowledgeSuitePublicNextPhaseReadiness,
    freezeId: chainIds.freezeId,
    freezeLock: chainIds.freezeLock,
    certificationId: chainIds.certificationId,
    platformId: chainIds.platformId,
    manifestId: chainIds.manifestId,
    validationId: chainIds.validationId,
    modelId: chainIds.modelId,
    registryId: chainIds.registryId,
    foundationId: chainIds.foundationId,
    phaseCount: 9 as const,
    completedPhaseCount: 9 as const,
    publicNamespaceSectionCount: 9 as const,
    publicApiRegistryCount: DataKnowledgeSuitePublicApiRegistry.length,
    dkl99ExportCount: 12 as const,
    foundationApiCount: foundationApis.length,
    registryApiCount: registryApis.length,
    modelApiCount: modelApis.length,
    validationApiCount: validationApis.length,
    manifestApiCount: manifestApis.length,
    platformApiCount: platformApis.length,
    certificationApiCount: certificationApis.length,
    freezeApiCount: freezeApis.length,
    publicIndexApiCount: PUBLIC_INDEX_API_NAMES.length,
    capabilityCount: upstream.capabilityCount,
    publicApiInventoryTotal: upstream.publicApiInventoryTotal,
    validationRuleCount: upstream.validationRuleCount,
    validationCategoryCount: upstream.validationCategoryCount,
    validationGateCount: upstream.validationGateCount,
    modelKindCount: upstream.modelKindCount,
    registryTotalEntryCount: upstream.registryTotalEntryCount,
    manifestTotalEntryCount: upstream.manifestTotalEntryCount,
    platformTotalEntryCount: upstream.platformTotalEntryCount,
    freezeTotalEntryCount: freeze.inventory.totalEntryCount,
    frozenComponentCount: freeze.inventory.frozenComponentCount,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    releaseGuaranteeCount: RELEASE_GUARANTEES.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Deterministic frozen Public Index release metadata. */
export function getDataKnowledgeSuitePublicReleaseMetadata() {
  return Object.freeze({
    id: DataKnowledgeSuitePublicIndexId,
    version: DataKnowledgeSuitePublicIndexVersion,
    name: DataKnowledgeSuitePublicIndexName,
    namespace: DataKnowledgeSuitePublicIndexNamespace,
    layer: "Data Knowledge Layer" as const,
    phase: "DKL-9" as const,
    stage: "PublicIndex" as const,
    releaseStatus: DataKnowledgeSuitePublicReleaseStatus,
    certificationStatus: DataKnowledgeSuitePublicCertificationStatus,
    freezeStatus: DataKnowledgeSuitePublicFreezeStatus,
    stabilityStatus: DataKnowledgeSuitePublicStabilityStatus,
    architectureStatus: DataKnowledgeSuitePublicArchitectureStatus,
    consumerReadiness: DataKnowledgeSuitePublicConsumerReadiness,
    nextPhaseReadiness: DataKnowledgeSuitePublicNextPhaseReadiness,
    canonicalEntryPoint: "dataKnowledgeSuitePublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    phaseCount: 9 as const,
    publicApiCount: DataKnowledgeSuitePublicApiRegistry.length,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
