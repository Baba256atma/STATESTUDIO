/**
 * DKL-8:9 — Knowledge Governance Public Index.
 *
 * Sole supported public release surface for DKL-8 Knowledge Governance.
 * Consumes only KnowledgeGovernanceFreezePlatform. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-8:9.
 *
 * Public exports (exactly 12):
 *   KnowledgeGovernancePlatformPublicFoundation
 *   KnowledgeGovernancePublicApiRegistry
 *   KnowledgeGovernancePublicIndexId
 *   KnowledgeGovernancePublicIndexVersion
 *   KnowledgeGovernancePublicIndexName
 *   KnowledgeGovernancePublicIndexNamespace
 *   KnowledgeGovernancePublicReleaseStatus
 *   KnowledgeGovernancePublicCertificationStatus
 *   KnowledgeGovernancePublicFreezeStatus
 *   getKnowledgeGovernancePublicSummary()
 *   getKnowledgeGovernancePublicApiCount()
 *   getKnowledgeGovernancePublicReleaseMetadata()
 */

import { KnowledgeGovernanceFreezePlatform } from "./knowledgeGovernanceFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type KnowledgeGovernancePublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type KnowledgeGovernancePublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: KnowledgeGovernancePublicApiKind;
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

type KnowledgeGovernanceReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-8:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = KnowledgeGovernanceFreezePlatform;
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

export const KnowledgeGovernancePublicIndexId =
  "DKL-8:9/KnowledgeGovernancePublicIndex" as const;

export const KnowledgeGovernancePublicIndexVersion = "1.0.0" as const;

export const KnowledgeGovernancePublicIndexName =
  "Knowledge Governance Public Index" as const;

export const KnowledgeGovernancePublicIndexNamespace =
  "nexora.dkl.knowledge-governance.public-index" as const;

export const KnowledgeGovernancePublicReleaseStatus = "Released" as const;

export const KnowledgeGovernancePublicCertificationStatus =
  "Certified" as const;

export const KnowledgeGovernancePublicFreezeStatus = "Frozen" as const;

const KnowledgeGovernancePublicStabilityStatus = "Stable" as const;
const KnowledgeGovernancePublicArchitectureStatus = "Complete" as const;
const KnowledgeGovernancePublicConsumerReadiness =
  "ReadyForConsumer" as const;
const KnowledgeGovernancePublicNextPhaseReadiness = "ReadyForDKL9" as const;

const PUBLIC_INDEX_API_NAMES = Object.freeze([
  "KnowledgeGovernancePlatformPublicFoundation",
  "KnowledgeGovernancePublicApiRegistry",
  "KnowledgeGovernancePublicIndexId",
  "KnowledgeGovernancePublicIndexVersion",
  "KnowledgeGovernancePublicIndexName",
  "KnowledgeGovernancePublicIndexNamespace",
  "KnowledgeGovernancePublicReleaseStatus",
  "KnowledgeGovernancePublicCertificationStatus",
  "KnowledgeGovernancePublicFreezeStatus",
  "getKnowledgeGovernancePublicSummary",
  "getKnowledgeGovernancePublicApiCount",
  "getKnowledgeGovernancePublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "DKL-8:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "knowledgeGovernanceFoundation.ts",
  }),
  "DKL-8:2": Object.freeze({
    section: "Registry",
    version: registry.identity.registryVersion,
    sourceReference: "knowledgeGovernanceRegistry.ts",
  }),
  "DKL-8:3": Object.freeze({
    section: "Model",
    version: model.identity.modelVersion,
    sourceReference: "knowledgeGovernanceModel.ts",
  }),
  "DKL-8:4": Object.freeze({
    section: "Validation",
    version: validation.identity.validationVersion,
    sourceReference: "knowledgeGovernanceValidation.ts",
  }),
  "DKL-8:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.manifestVersion,
    sourceReference: "knowledgeGovernanceManifest.ts",
  }),
  "DKL-8:6": Object.freeze({
    section: "Platform",
    version: platform.identity.platformVersion,
    sourceReference: "knowledgeGovernancePlatform.ts",
  }),
  "DKL-8:7": Object.freeze({
    section: "Certification",
    version: certification.identity.certificationVersion,
    sourceReference: "knowledgeGovernanceCertification.ts",
  }),
  "DKL-8:8": Object.freeze({
    section: "Freeze",
    version: freeze.identity.freezeVersion,
    sourceReference: "knowledgeGovernanceFreeze.ts",
  }),
  "DKL-8:9": Object.freeze({
    section: "PublicIndex",
    version: KnowledgeGovernancePublicIndexVersion,
    sourceReference: "knowledgeGovernancePublicIndex.ts",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

type UpstreamApiSource = Readonly<{
  exportName: string;
  id?: string;
  apiId?: string;
  kind?: KnowledgeGovernancePublicApiKind;
  version?: string;
  sourceReference?: string;
}>;

const classify = (exportName: string): KnowledgeGovernancePublicApiKind => {
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
): KnowledgeGovernancePublicApiEntry => {
  const meta = PHASE_META[phase];
  const exportName = typeof source === "string" ? source : source.exportName;
  const kind =
    typeof source === "string"
      ? classify(exportName)
      : (source.kind ?? classify(exportName));
  const upstreamApiId =
    typeof source === "string"
      ? `DKL-8:9/OwnedApi/${exportName}`
      : (source.id ?? source.apiId ?? `DKL-8:9/OwnedApi/${exportName}`);
  return Object.freeze({
    id: `DKL-8:9/PublicApi/${phase}/${exportName}`,
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
): readonly KnowledgeGovernancePublicApiEntry[] =>
  Object.freeze(
    sources.map((source, index) =>
      publicApiEntry(phase, source, startOrder + index),
    ),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries(
  "DKL-8:1",
  foundationApis,
  nextOrder,
);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("DKL-8:2", registryApis, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("DKL-8:3", modelApis, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("DKL-8:4", validationApis, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("DKL-8:5", manifestApis, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("DKL-8:6", platformApis, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "DKL-8:7",
  certificationApis,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("DKL-8:8", freezeApis, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "DKL-8:9",
  PUBLIC_INDEX_API_NAMES,
  nextOrder,
);

/** Canonical immutable Public API registry for DKL-8:1 through DKL-8:9. */
export const KnowledgeGovernancePublicApiRegistry: readonly KnowledgeGovernancePublicApiEntry[] =
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
): KnowledgeGovernanceReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-8:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

const RELEASE_GUARANTEES: readonly KnowledgeGovernanceReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform."),
    guarantee(5, "Validation is reached only through Manifest."),
    guarantee(6, "Model is reached only through Validation."),
    guarantee(7, "Registry is reached only through Model."),
    guarantee(8, "Foundation is reached only through Registry."),
    guarantee(9, "All nine DKL-8 phases are published through one namespace."),
    guarantee(10, "All prior phases remain preserved by canonical reference."),
    guarantee(11, "All approved public APIs are registered exactly once."),
    guarantee(12, "API counts are derived from Freeze-reachable registries."),
    guarantee(13, "Canonical Inventory Rule is preserved through Freeze."),
    guarantee(14, "Runtime Knowledge Governance execution remains absent."),
    guarantee(15, "Consumers must use the Public Index only."),
    guarantee(16, "DKL-8 is released and ready for approved consumers and DKL-9."),
  ]);

const publicIndexMetadata = Object.freeze({
  publicIndexId: KnowledgeGovernancePublicIndexId,
  publicIndexName: KnowledgeGovernancePublicIndexName,
  publicIndexVersion: KnowledgeGovernancePublicIndexVersion,
  publicIndexNamespace: KnowledgeGovernancePublicIndexNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "PublicIndex" as const,
  releaseStatus: KnowledgeGovernancePublicReleaseStatus,
  certificationStatus: KnowledgeGovernancePublicCertificationStatus,
  freezeStatus: KnowledgeGovernancePublicFreezeStatus,
  stabilityStatus: KnowledgeGovernancePublicStabilityStatus,
  architectureStatus: KnowledgeGovernancePublicArchitectureStatus,
  consumerReadiness: KnowledgeGovernancePublicConsumerReadiness,
  nextPhaseReadiness: KnowledgeGovernancePublicNextPhaseReadiness,
  publicApiCount: KnowledgeGovernancePublicApiRegistry.length,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  solePublicEntryPoint: "knowledgeGovernancePublicIndex.ts" as const,
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
  directPreviousPhaseModule: "knowledgeGovernanceFreeze.ts" as const,
  freezeOnly: true as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl9DirectImport: false as const,
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
export const KnowledgeGovernancePlatformPublicFoundation = Object.freeze({
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
    soleSupportedEntryPoint: "knowledgeGovernancePublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    approvedFutureConsumers: Object.freeze([
      "DKL-9",
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
  immutable: true as const,
  deterministic: true as const,
});

/** Exact unique Public API registry count derived from canonical collections. */
export function getKnowledgeGovernancePublicApiCount(): number {
  return KnowledgeGovernancePublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getKnowledgeGovernancePublicSummary() {
  return Object.freeze({
    publicIndexId: KnowledgeGovernancePublicIndexId,
    version: KnowledgeGovernancePublicIndexVersion,
    name: KnowledgeGovernancePublicIndexName,
    namespace: KnowledgeGovernancePublicIndexNamespace,
    releaseStatus: KnowledgeGovernancePublicReleaseStatus,
    certificationStatus: KnowledgeGovernancePublicCertificationStatus,
    freezeStatus: KnowledgeGovernancePublicFreezeStatus,
    stabilityStatus: KnowledgeGovernancePublicStabilityStatus,
    architectureStatus: KnowledgeGovernancePublicArchitectureStatus,
    consumerReadiness: KnowledgeGovernancePublicConsumerReadiness,
    nextPhaseReadiness: KnowledgeGovernancePublicNextPhaseReadiness,
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
    publicApiRegistryCount: KnowledgeGovernancePublicApiRegistry.length,
    dkl89ExportCount: 12 as const,
    foundationApiCount: foundationApis.length,
    registryApiCount: registryApis.length,
    modelApiCount: modelApis.length,
    validationApiCount: validationApis.length,
    manifestApiCount: manifestApis.length,
    platformApiCount: platformApis.length,
    certificationApiCount: certificationApis.length,
    freezeApiCount: freezeApis.length,
    publicIndexApiCount: PUBLIC_INDEX_API_NAMES.length,
    registryEntryCount: freeze.inventory.upstreamCertificationInventory
      .registryEntryCount,
    modelKindCount:
      freeze.inventory.upstreamCertificationInventory.modelKindCount,
    relationshipKindCount:
      freeze.inventory.upstreamCertificationInventory.relationshipKindCount,
    validationRuleCount:
      freeze.inventory.upstreamCertificationInventory.validationRuleCount,
    validationCategoryCount:
      freeze.inventory.upstreamCertificationInventory.validationCategoryCount,
    validationGateCount:
      freeze.inventory.upstreamCertificationInventory.validationGateCount,
    manifestTotalEntryCount:
      freeze.inventory.upstreamCertificationInventory.manifestTotalEntryCount,
    platformTotalEntryCount:
      freeze.inventory.upstreamCertificationInventory.platformTotalEntryCount,
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
export function getKnowledgeGovernancePublicReleaseMetadata() {
  return Object.freeze({
    id: KnowledgeGovernancePublicIndexId,
    version: KnowledgeGovernancePublicIndexVersion,
    name: KnowledgeGovernancePublicIndexName,
    namespace: KnowledgeGovernancePublicIndexNamespace,
    layer: "Data Knowledge Layer" as const,
    phase: "DKL-8" as const,
    stage: "PublicIndex" as const,
    releaseStatus: KnowledgeGovernancePublicReleaseStatus,
    certificationStatus: KnowledgeGovernancePublicCertificationStatus,
    freezeStatus: KnowledgeGovernancePublicFreezeStatus,
    stabilityStatus: KnowledgeGovernancePublicStabilityStatus,
    architectureStatus: KnowledgeGovernancePublicArchitectureStatus,
    consumerReadiness: KnowledgeGovernancePublicConsumerReadiness,
    nextPhaseReadiness: KnowledgeGovernancePublicNextPhaseReadiness,
    canonicalEntryPoint: "knowledgeGovernancePublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    phaseCount: 9 as const,
    publicApiCount: KnowledgeGovernancePublicApiRegistry.length,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
