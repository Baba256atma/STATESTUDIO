/**
 * DKL-7:9 — Knowledge Services Public Index.
 *
 * Sole canonical, immutable, certified, frozen, and stable public release
 * surface for the complete DKL-7 Knowledge Services architecture.
 * Consumes only DKL-7:8 Freeze. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-7:9.
 *
 * Public exports (exactly 12):
 *   KnowledgeServicesPlatformPublicFoundation
 *   KnowledgeServicesPublicApiRegistry
 *   KnowledgeServicesPublicIndexId
 *   KnowledgeServicesPublicIndexVersion
 *   KnowledgeServicesPublicIndexName
 *   KnowledgeServicesPublicIndexNamespace
 *   KnowledgeServicesPublicReleaseStatus
 *   KnowledgeServicesPublicCertificationStatus
 *   KnowledgeServicesPublicFreezeStatus
 *   getKnowledgeServicesPublicSummary()
 *   getKnowledgeServicesPublicApiCount()
 *   getKnowledgeServicesPublicReleaseMetadata()
 */

import {
  getKnowledgeServicesFreezeInventoryCount,
  KnowledgeServicesFreeze,
  KnowledgeServicesFreezeId,
  KnowledgeServicesFreezeLock,
  KnowledgeServicesFreezeVersion,
} from "./knowledgeServicesFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type KnowledgeServicesPublicApiEntry = Readonly<{
  apiId: string;
  exportName: string;
  sourcePhase: string;
  sourceStage: string;
  sourceVersion: string;
  apiCategory: "Aggregate" | "IdentityConstant" | "MetadataConstant" | "Helper";
  releaseStatus: "Released";
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  stabilityStatus: "Stable";
  canonicalEntryPoint: "knowledgeServicesPublicIndex.ts";
  directImportPolicy: "PublicIndexOnly";
  consumerStatus: "ReadyForConsumer";
  runtimeBehaviorClassification:
    | "ImmutableMetadata"
    | "DeterministicMetadataHelper";
  executableKnowledgeService: false;
  deterministicOrder: number;
}>;

type KnowledgeServicesReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through DKL-7:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = KnowledgeServicesFreeze;
const certification = freeze.certification;
const platform = certification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const chainIds = Object.freeze({
  freezeId: KnowledgeServicesFreezeId,
  freezeVersion: KnowledgeServicesFreezeVersion,
  certificationId: certification.identity.certificationId,
  platformId: platform.identity.platformId,
  manifestId: platform.identity.manifestId,
  validationId: platform.identity.validationId,
  modelId: platform.identity.modelId,
  registryId: platform.identity.registryId,
  foundationId: platform.identity.foundationId,
  dkl6PublicIndexId: platform.identity.dkl6PublicIndexId,
});

// --------------------------------------------------------------------------
// Approved public API surfaces by phase (documented phase exports).
// --------------------------------------------------------------------------

const FOUNDATION_APIS = Object.freeze([
  "KnowledgeServicesFoundation",
  "KnowledgeServicesFoundationId",
  "KnowledgeServicesFoundationName",
  "KnowledgeServicesFoundationVersion",
  "KnowledgeServicesFoundationNamespace",
  "KnowledgeServicesFoundationStatus",
  "getKnowledgeServicesFoundationSummary",
] as const);

const REGISTRY_APIS = Object.freeze([
  "KnowledgeServicesRegistry",
  "KnowledgeServicesRegistryId",
  "KnowledgeServicesRegistryName",
  "KnowledgeServicesRegistryVersion",
  "KnowledgeServicesRegistryNamespace",
  "KnowledgeServicesRegistryStatus",
  "KnowledgeServicesRegistryEntries",
  "KnowledgeServicesCapabilityRegistry",
  "getKnowledgeServicesRegistrySummary",
  "getKnowledgeServicesRegistryInventoryCount",
] as const);

const MODEL_APIS = Object.freeze([
  "KnowledgeServicesModel",
  "KnowledgeServicesModelId",
  "KnowledgeServicesModelName",
  "KnowledgeServicesModelVersion",
  "KnowledgeServicesModelNamespace",
  "KnowledgeServicesModelStatus",
  "KnowledgeServicesRequestModels",
  "KnowledgeServicesResponseModels",
  "KnowledgeServicesResultModels",
  "KnowledgeServicesContextModels",
  "KnowledgeServicesModelRelationships",
  "getKnowledgeServicesModelSummary",
  "getKnowledgeServicesModelInventoryCount",
] as const);

const VALIDATION_APIS = Object.freeze([
  "KnowledgeServicesValidation",
  "KnowledgeServicesValidationId",
  "KnowledgeServicesValidationName",
  "KnowledgeServicesValidationVersion",
  "KnowledgeServicesValidationNamespace",
  "KnowledgeServicesValidationStatus",
  "KnowledgeServicesValidationGroups",
  "KnowledgeServicesValidationRules",
  "KnowledgeServicesValidationEvidence",
  "KnowledgeServicesValidationResults",
  "getKnowledgeServicesValidationSummary",
  "getKnowledgeServicesValidationRuleCount",
] as const);

const MANIFEST_APIS = Object.freeze(
  manifest.publicApi.map((item) => item.exportName),
);

const PLATFORM_APIS = Object.freeze(
  platform.publicApi.map((item) => item.exportName),
);

const CERTIFICATION_APIS = Object.freeze(
  certification.publicApi.map((item) => item.exportName),
);

const FREEZE_APIS = Object.freeze(
  freeze.publicApi.map((item) => item.exportName),
);

const PUBLIC_INDEX_APIS = Object.freeze([
  "KnowledgeServicesPlatformPublicFoundation",
  "KnowledgeServicesPublicApiRegistry",
  "KnowledgeServicesPublicIndexId",
  "KnowledgeServicesPublicIndexVersion",
  "KnowledgeServicesPublicIndexName",
  "KnowledgeServicesPublicIndexNamespace",
  "KnowledgeServicesPublicReleaseStatus",
  "KnowledgeServicesPublicCertificationStatus",
  "KnowledgeServicesPublicFreezeStatus",
  "getKnowledgeServicesPublicSummary",
  "getKnowledgeServicesPublicApiCount",
  "getKnowledgeServicesPublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "DKL-7:1": Object.freeze({
    stage: "Foundation",
    version: "1.0.0",
    identity: chainIds.foundationId,
  }),
  "DKL-7:2": Object.freeze({
    stage: "Registry",
    version: "1.0.0",
    identity: chainIds.registryId,
  }),
  "DKL-7:3": Object.freeze({
    stage: "Model",
    version: "1.0.0",
    identity: chainIds.modelId,
  }),
  "DKL-7:4": Object.freeze({
    stage: "Validation",
    version: "1.0.0",
    identity: chainIds.validationId,
  }),
  "DKL-7:5": Object.freeze({
    stage: "Manifest",
    version: "1.0.0",
    identity: chainIds.manifestId,
  }),
  "DKL-7:6": Object.freeze({
    stage: "Platform",
    version: "1.0.0",
    identity: chainIds.platformId,
  }),
  "DKL-7:7": Object.freeze({
    stage: "Certification",
    version: "1.0.0",
    identity: chainIds.certificationId,
  }),
  "DKL-7:8": Object.freeze({
    stage: "Freeze",
    version: KnowledgeServicesFreezeVersion,
    identity: chainIds.freezeId,
  }),
  "DKL-7:9": Object.freeze({
    stage: "PublicIndex",
    version: "1.0.0",
    identity: "DKL-7:9/KnowledgeServicesPublicIndex",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

const classify = (
  exportName: string,
): {
  apiCategory: KnowledgeServicesPublicApiEntry["apiCategory"];
  runtimeBehaviorClassification: KnowledgeServicesPublicApiEntry["runtimeBehaviorClassification"];
} => {
  if (exportName.startsWith("get")) {
    return {
      apiCategory: "Helper",
      runtimeBehaviorClassification: "DeterministicMetadataHelper",
    };
  }
  if (
    exportName.endsWith("Id") ||
    exportName.endsWith("Name") ||
    exportName.endsWith("Version") ||
    exportName.endsWith("Namespace")
  ) {
    return {
      apiCategory: "IdentityConstant",
      runtimeBehaviorClassification: "ImmutableMetadata",
    };
  }
  if (
    exportName.endsWith("Status") ||
    exportName.endsWith("Readiness") ||
    exportName.endsWith("Result") ||
    exportName.endsWith("Lock") ||
    exportName.endsWith("Inventory") ||
    exportName.endsWith("Compatibility") ||
    exportName.endsWith("Guarantees") ||
    exportName.endsWith("Gates") ||
    exportName.endsWith("Registry") ||
    exportName.endsWith("Entries") ||
    exportName.endsWith("Groups") ||
    exportName.endsWith("Rules") ||
    exportName.endsWith("Evidence") ||
    exportName.endsWith("Results") ||
    exportName.endsWith("Models") ||
    exportName.endsWith("Relationships")
  ) {
    return {
      apiCategory: "MetadataConstant",
      runtimeBehaviorClassification: "ImmutableMetadata",
    };
  }
  return {
    apiCategory: "Aggregate",
    runtimeBehaviorClassification: "ImmutableMetadata",
  };
};

const apiEntry = (
  phase: PhaseKey,
  exportName: string,
  order: number,
): KnowledgeServicesPublicApiEntry => {
  const meta = PHASE_META[phase];
  const classification = classify(exportName);
  return Object.freeze({
    apiId: `DKL-7:9/PublicApi/${phase}/${exportName}`,
    exportName,
    sourcePhase: phase,
    sourceStage: meta.stage,
    sourceVersion: meta.version,
    apiCategory: classification.apiCategory,
    releaseStatus: "Released" as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    stabilityStatus: "Stable" as const,
    canonicalEntryPoint: "knowledgeServicesPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    consumerStatus: "ReadyForConsumer" as const,
    runtimeBehaviorClassification:
      classification.runtimeBehaviorClassification,
    executableKnowledgeService: false as const,
    deterministicOrder: order,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  names: readonly string[],
  startOrder: number,
): readonly KnowledgeServicesPublicApiEntry[] =>
  Object.freeze(
    names.map((name, index) => apiEntry(phase, name, startOrder + index)),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries("DKL-7:1", FOUNDATION_APIS, nextOrder);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("DKL-7:2", REGISTRY_APIS, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("DKL-7:3", MODEL_APIS, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("DKL-7:4", VALIDATION_APIS, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("DKL-7:5", MANIFEST_APIS, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("DKL-7:6", PLATFORM_APIS, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "DKL-7:7",
  CERTIFICATION_APIS,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("DKL-7:8", FREEZE_APIS, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "DKL-7:9",
  PUBLIC_INDEX_APIS,
  nextOrder,
);

/** Canonical immutable Public API registry for DKL-7:1 through DKL-7:9. */
export const KnowledgeServicesPublicApiRegistry: readonly KnowledgeServicesPublicApiEntry[] =
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
): KnowledgeServicesReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-7:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

const RELEASE_GUARANTEES: readonly KnowledgeServicesReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform."),
    guarantee(5, "Validation is reached only through Manifest."),
    guarantee(6, "Model is reached only through Validation."),
    guarantee(7, "Registry is reached only through Model."),
    guarantee(8, "Foundation is reached only through Registry."),
    guarantee(9, "DKL-6 is reached only through Foundation."),
    guarantee(10, "All nine DKL-7 phases are published through one namespace."),
    guarantee(11, "All prior phases remain preserved by canonical reference."),
    guarantee(12, "All approved public APIs are registered exactly once."),
    guarantee(13, "All 12 services remain certified and frozen."),
    guarantee(14, "All 12 capabilities and 11 contracts remain protected."),
    guarantee(15, "Mutation modes remain zero."),
    guarantee(16, "Runtime Knowledge Service implementation remains absent."),
    guarantee(17, "Consumers must use the Public Index only."),
    guarantee(
      18,
      "DKL-7 is released and ready for approved consumers and DKL-8.",
    ),
  ]);

// --------------------------------------------------------------------------
// Public Index identity and release constants.
// --------------------------------------------------------------------------

export const KnowledgeServicesPublicIndexId =
  "DKL-7:9/KnowledgeServicesPublicIndex" as const;

export const KnowledgeServicesPublicIndexVersion = "1.0.0" as const;

export const KnowledgeServicesPublicIndexName =
  "Knowledge Services Public Index" as const;

export const KnowledgeServicesPublicIndexNamespace =
  "nexora.dkl.knowledge-services" as const;

export const KnowledgeServicesPublicReleaseStatus = "Released" as const;

export const KnowledgeServicesPublicCertificationStatus = "Certified" as const;

export const KnowledgeServicesPublicFreezeStatus = "Frozen" as const;

const KnowledgeServicesPublicStabilityStatus = "Stable" as const;
const KnowledgeServicesPublicArchitectureStatus = "Complete" as const;
const KnowledgeServicesPublicConsumerReadiness = "ReadyForConsumer" as const;
const KnowledgeServicesPublicNextPhaseReadiness = "ReadyForDKL8" as const;

const publicIndexMetadata = Object.freeze({
  publicIndexId: KnowledgeServicesPublicIndexId,
  publicIndexName: KnowledgeServicesPublicIndexName,
  publicIndexVersion: KnowledgeServicesPublicIndexVersion,
  publicIndexNamespace: KnowledgeServicesPublicIndexNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-7" as const,
  stage: "PublicIndex" as const,
  releaseStatus: KnowledgeServicesPublicReleaseStatus,
  certificationStatus: KnowledgeServicesPublicCertificationStatus,
  freezeStatus: KnowledgeServicesPublicFreezeStatus,
  stabilityStatus: KnowledgeServicesPublicStabilityStatus,
  architectureStatus: KnowledgeServicesPublicArchitectureStatus,
  consumerReadiness: KnowledgeServicesPublicConsumerReadiness,
  nextPhaseReadiness: KnowledgeServicesPublicNextPhaseReadiness,
  publicApiCount: KnowledgeServicesPublicApiRegistry.length,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  solePublicEntryPoint: "knowledgeServicesPublicIndex.ts" as const,
  directImportPolicy: "PublicIndexOnly" as const,
  runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
  freezeId: chainIds.freezeId,
  freezeVersion: chainIds.freezeVersion,
  certificationId: chainIds.certificationId,
  platformId: chainIds.platformId,
  manifestId: chainIds.manifestId,
  validationId: chainIds.validationId,
  modelId: chainIds.modelId,
  registryId: chainIds.registryId,
  foundationId: chainIds.foundationId,
  dkl6PublicIndexId: chainIds.dkl6PublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "knowledgeServicesFreeze.ts" as const,
  freezeOnly: true as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl6DirectImport: false as const,
  certificationReachedThroughFreeze: true as const,
  platformReachedThroughCertification: true as const,
  manifestReachedThroughPlatform: true as const,
  validationReachedThroughManifest: true as const,
  modelReachedThroughValidation: true as const,
  registryReachedThroughModel: true as const,
  foundationReachedThroughRegistry: true as const,
  dkl6ReachedThroughFoundation: true as const,
});

/**
 * Canonical nine-section public namespace.
 * Prior phases preserved by reference through the Freeze chain.
 */
export const KnowledgeServicesPlatformPublicFoundation = Object.freeze({
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
    soleSupportedEntryPoint: "knowledgeServicesPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    approvedFutureConsumers: Object.freeze([
      "DKL-8",
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

/** Exact unique Public API registry count. */
export function getKnowledgeServicesPublicApiCount(): number {
  return KnowledgeServicesPublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getKnowledgeServicesPublicSummary() {
  return Object.freeze({
    publicIndexId: KnowledgeServicesPublicIndexId,
    version: KnowledgeServicesPublicIndexVersion,
    name: KnowledgeServicesPublicIndexName,
    namespace: KnowledgeServicesPublicIndexNamespace,
    releaseStatus: KnowledgeServicesPublicReleaseStatus,
    certificationStatus: KnowledgeServicesPublicCertificationStatus,
    freezeStatus: KnowledgeServicesPublicFreezeStatus,
    stabilityStatus: KnowledgeServicesPublicStabilityStatus,
    architectureStatus: KnowledgeServicesPublicArchitectureStatus,
    consumerReadiness: KnowledgeServicesPublicConsumerReadiness,
    nextPhaseReadiness: KnowledgeServicesPublicNextPhaseReadiness,
    freezeId: chainIds.freezeId,
    certificationId: chainIds.certificationId,
    platformId: chainIds.platformId,
    manifestId: chainIds.manifestId,
    validationId: chainIds.validationId,
    modelId: chainIds.modelId,
    registryId: chainIds.registryId,
    foundationId: chainIds.foundationId,
    dkl6PublicIndexId: chainIds.dkl6PublicIndexId,
    phaseCount: 9 as const,
    completedPhaseCount: 9 as const,
    publicNamespaceSectionCount: 9 as const,
    publicApiRegistryCount: KnowledgeServicesPublicApiRegistry.length,
    dkl79ExportCount: 12 as const,
    serviceCount: platform.services.length,
    capabilityCount: platform.capabilities.length,
    contractCount: platform.contracts.length,
    modelInventoryCount: platform.model.totalInventoryCount,
    validationPassCount: platform.validation.passCount,
    validationFailCount: platform.validation.failCount,
    manifestInventoryCount: manifest.inventory.totalEntryCount,
    platformInventoryCount: platform.inventory.totalEntryCount,
    certificationInventoryCount: certification.inventory.totalEntryCount,
    freezeInventoryCount: getKnowledgeServicesFreezeInventoryCount(),
    frozenComponentCount: freeze.components.length,
    activeLockCount: freeze.locks.filter((item) => item.lockStatus === "Locked")
      .length,
    mutationModeCount: platform.inventory.mutationModeCount,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    releaseGuaranteeCount: RELEASE_GUARANTEES.length,
    freezeLock: KnowledgeServicesFreezeLock,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Deterministic frozen Public Index release metadata. */
export function getKnowledgeServicesPublicReleaseMetadata() {
  return Object.freeze({
    id: KnowledgeServicesPublicIndexId,
    version: KnowledgeServicesPublicIndexVersion,
    name: KnowledgeServicesPublicIndexName,
    namespace: KnowledgeServicesPublicIndexNamespace,
    layer: "Data Knowledge Layer" as const,
    phase: "DKL-7" as const,
    stage: "PublicIndex" as const,
    releaseStatus: KnowledgeServicesPublicReleaseStatus,
    certificationStatus: KnowledgeServicesPublicCertificationStatus,
    freezeStatus: KnowledgeServicesPublicFreezeStatus,
    stabilityStatus: KnowledgeServicesPublicStabilityStatus,
    architectureStatus: KnowledgeServicesPublicArchitectureStatus,
    consumerReadiness: KnowledgeServicesPublicConsumerReadiness,
    nextPhaseReadiness: KnowledgeServicesPublicNextPhaseReadiness,
    canonicalEntryPoint: "knowledgeServicesPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    phaseCount: 9 as const,
    publicApiCount: KnowledgeServicesPublicApiRegistry.length,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
