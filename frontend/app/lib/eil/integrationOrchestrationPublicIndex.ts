/**
 * EIL-4:9 — Integration Orchestration Public Index.
 *
 * Sole supported public release surface for the EIL-4 Integration Orchestration Platform.
 * Consumes only the EIL-4:8 Integration Orchestration Freeze aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Consumer.
 *
 * Ownership: owned exclusively by EIL-4:9.
 *
 * Public exports (exactly 12):
 *   IntegrationOrchestrationPublicIndexIdentity
 *   IntegrationOrchestrationPublicNamespace
 *   IntegrationOrchestrationPublicApiRegistry
 *   IntegrationOrchestrationPublicApiCount
 *   IntegrationOrchestrationPublicInventory
 *   IntegrationOrchestrationPublicRelease
 *   IntegrationOrchestrationPublicReadiness
 *   IntegrationOrchestrationPublicSummary
 *   IntegrationOrchestrationConsumerEntry
 *   IntegrationOrchestrationPublicIndexPlatform
 *   IntegrationOrchestrationPublicExports
 *   IntegrationOrchestrationPublicMetadata
 *
 * Future consumers must import only integrationOrchestrationPublicIndex.ts.
 */

import {
  IntegrationOrchestrationFreezeIdentity,
  IntegrationOrchestrationFreezePlatform,
  IntegrationOrchestrationFreezeSummary,
} from "./integrationOrchestrationFreeze.ts";

// --------------------------------------------------------------------------
// Local readonly interfaces (non-exported — keeps runtime exports at twelve).
// --------------------------------------------------------------------------

type OrchestrationPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Collection"
  | "Helper";

/** Public API registry entry. */
interface IntegrationOrchestrationPublicApi {
  readonly apiId: string;
  readonly canonicalKey: string;
  readonly publicName: string;
  readonly namespace: string;
  readonly sourcePhase: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly exportName: string;
  readonly section: string;
  readonly kind: OrchestrationPublicApiKind;
  readonly version: string;
  readonly status: "Released";
  readonly stability: "Stable";
  readonly sourceReference: string;
  readonly public: true;
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly upstreamApiId: string;
  readonly derivedFromFreeze: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Public namespace section. */
interface IntegrationOrchestrationPublicNamespaceSection {
  readonly sectionId: string;
  readonly section: string;
  readonly phaseId: string;
  readonly namespace: string;
  readonly canonicalReference: string;
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Public namespace envelope. */
interface IntegrationOrchestrationPublicNamespace {
  readonly namespaceId: "EIL-4:9/Namespace";
  readonly sourcePhase: "EIL-4:9";
  readonly sections: readonly IntegrationOrchestrationPublicNamespaceSection[];
  readonly sectionCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public inventory. */
interface IntegrationOrchestrationPublicInventory {
  readonly inventoryId: "EIL-4:9/Inventory";
  readonly namespaceSectionCount: number;
  readonly publicApiCount: number;
  readonly publicExportCount: number;
  readonly freezeInventoryTotal: number;
  readonly freezeLockCount: number;
  readonly freezeBaselineCount: number;
  readonly freezeCompatibilityCount: number;
  readonly freezeExtensionCount: number;
  readonly freezeTotalEntryCount: number;
  readonly canonicalPlatformLockCount: number;
  readonly countsDerivedFromFreeze: true;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public release metadata. */
interface IntegrationOrchestrationPublicRelease {
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly releaseVersion: "1.0.0";
  readonly releaseNamespace: "nexora.eil.integration-orchestration.public-index";
  readonly releaseIdentity: "EIL-4:9/IntegrationOrchestrationPublicIndex";
  readonly releaseLineage: readonly string[];
  readonly releaseDate: "EIL-4.0.0";
  readonly releaseDescription: string;
  readonly freezeId: string;
  readonly freezeSummary: typeof IntegrationOrchestrationFreezeSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public summary. */
interface IntegrationOrchestrationPublicSummary {
  readonly publicIndexId: "EIL-4:9/IntegrationOrchestrationPublicIndex";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Public Index";
  readonly namespace: "nexora.eil.integration-orchestration.public-index";
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly freezeId: string;
  readonly namespaceSectionCount: number;
  readonly publicApiCount: number;
  readonly publicExportCount: number;
  readonly freezeInventoryTotal: number;
  readonly consumerEntry: "integrationOrchestrationPublicIndex.ts";
  readonly nextPhase: "EIL-4 Complete — ReadyForConsumer";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public metadata envelope. */
interface IntegrationOrchestrationPublicMetadata {
  readonly publicIndexId: "EIL-4:9/IntegrationOrchestrationPublicIndex";
  readonly publicIndexName: "Integration Orchestration Public Index";
  readonly publicIndexVersion: "1.0.0";
  readonly publicIndexNamespace: "nexora.eil.integration-orchestration.public-index";
  readonly layer: "EIL";
  readonly phase: "EIL-4:9";
  readonly stage: "PublicIndex";
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly releaseDate: "EIL-4.0.0";
  readonly solePublicEntryPoint: "integrationOrchestrationPublicIndex.ts";
  readonly directImportPolicy: "PublicIndexOnly";
  readonly publicApiCount: number;
  readonly namespaceSectionCount: number;
  readonly publicExportCount: number;
  readonly freezeInventoryTotal: number;
  readonly freezeId: string;
  readonly freezeVersion: string;
  readonly certificationId: string;
  readonly platformId: string;
  readonly manifestId: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly runtimeServiceStatus: "NotImplementedByPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public Index identity. */
interface IntegrationOrchestrationPublicIndexIdentity {
  readonly phaseId: "EIL-4:9";
  readonly canonicalId: "EIL-4:9/IntegrationOrchestrationPublicIndex";
  readonly name: "Integration Orchestration Public Index";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.public-index";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Public Index";
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly freezeDependency: string;
  readonly freezeEntryPoint: "integrationOrchestrationFreeze.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// --------------------------------------------------------------------------
// Canonical Freeze-reachable chain (sole upstream dependency).
// --------------------------------------------------------------------------

const freeze = IntegrationOrchestrationFreezePlatform;
const certification = freeze.certificationPlatform;
const platform = certification.integrationOrchestrationPlatform;
const manifest = platform.manifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const foundationApis = foundation.apiRegistry;

const chainIds = Object.freeze({
  freezeId: IntegrationOrchestrationFreezeIdentity.canonicalId,
  freezeVersion: IntegrationOrchestrationFreezeIdentity.version,
  certificationId: certification.identity.canonicalId,
  platformId: platform.identity.canonicalId,
  manifestId: manifest.identity.canonicalId,
  validationId: validation.identity.canonicalId,
  modelId: model.identity.canonicalId,
  registryId: registry.identity.canonicalId,
  foundationId: foundation.identity.foundationId,
});

// --------------------------------------------------------------------------
// Identity and release constants.
// --------------------------------------------------------------------------

const PUBLIC_INDEX_PHASE = "EIL-4:9" as const;
const PUBLIC_INDEX_ID = "EIL-4:9/IntegrationOrchestrationPublicIndex" as const;
const PUBLIC_INDEX_NAME = "Integration Orchestration Public Index" as const;
const PUBLIC_INDEX_VERSION = "1.0.0" as const;
const PUBLIC_INDEX_NAMESPACE =
  "nexora.eil.integration-orchestration.public-index" as const;
const PUBLIC_INDEX_ENTRY = "integrationOrchestrationPublicIndex.ts" as const;

/**
 * Canonical immutable Public Index identity.
 */
export const IntegrationOrchestrationPublicIndexIdentity: IntegrationOrchestrationPublicIndexIdentity =
  Object.freeze({
    phaseId: PUBLIC_INDEX_PHASE,
    canonicalId: PUBLIC_INDEX_ID,
    name: PUBLIC_INDEX_NAME,
    version: PUBLIC_INDEX_VERSION,
    namespace: PUBLIC_INDEX_NAMESPACE,
    layer: "EIL" as const,
    platform: "EIL-4" as const,
    phaseType: "Public Index" as const,
    release: "Released" as const,
    certification: "Certified" as const,
    freeze: "Frozen" as const,
    stability: "Stable" as const,
    readiness: "ReadyForConsumer" as const,
    freezeDependency: chainIds.freezeId,
    freezeEntryPoint: "integrationOrchestrationFreeze.ts" as const,
    description:
      "Sole canonical public entry point publishing the frozen EIL-4 Integration Orchestration Platform for consumers.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * ReadyForConsumer readiness declaration.
 */
export const IntegrationOrchestrationPublicReadiness = "ReadyForConsumer" as const;

/**
 * Exactly twelve stable public export names.
 */
export const IntegrationOrchestrationPublicExports = Object.freeze([
  "IntegrationOrchestrationPublicIndexIdentity",
  "IntegrationOrchestrationPublicNamespace",
  "IntegrationOrchestrationPublicApiRegistry",
  "IntegrationOrchestrationPublicApiCount",
  "IntegrationOrchestrationPublicInventory",
  "IntegrationOrchestrationPublicRelease",
  "IntegrationOrchestrationPublicReadiness",
  "IntegrationOrchestrationPublicSummary",
  "IntegrationOrchestrationConsumerEntry",
  "IntegrationOrchestrationPublicIndexPlatform",
  "IntegrationOrchestrationPublicExports",
  "IntegrationOrchestrationPublicMetadata",
] as const);

const PHASE_META = Object.freeze({
  "EIL-4:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "integrationOrchestrationFoundation.ts",
    namespace: foundation.identity.foundationNamespace,
    canonicalReference: chainIds.foundationId,
  }),
  "EIL-4:2": Object.freeze({
    section: "Registry",
    version: registry.identity.version,
    sourceReference: "integrationOrchestrationRegistry.ts",
    namespace: registry.identity.namespace,
    canonicalReference: chainIds.registryId,
  }),
  "EIL-4:3": Object.freeze({
    section: "Model",
    version: model.identity.version,
    sourceReference: "integrationOrchestrationModel.ts",
    namespace: model.identity.namespace,
    canonicalReference: chainIds.modelId,
  }),
  "EIL-4:4": Object.freeze({
    section: "Validation",
    version: validation.identity.version,
    sourceReference: "integrationOrchestrationValidation.ts",
    namespace: validation.identity.namespace,
    canonicalReference: chainIds.validationId,
  }),
  "EIL-4:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.version,
    sourceReference: "integrationOrchestrationManifest.ts",
    namespace: manifest.identity.namespace,
    canonicalReference: chainIds.manifestId,
  }),
  "EIL-4:6": Object.freeze({
    section: "Platform",
    version: platform.identity.version,
    sourceReference: "integrationOrchestrationPlatform.ts",
    namespace: platform.identity.namespace,
    canonicalReference: chainIds.platformId,
  }),
  "EIL-4:7": Object.freeze({
    section: "Certification",
    version: certification.identity.version,
    sourceReference: "integrationOrchestrationCertification.ts",
    namespace: certification.identity.namespace,
    canonicalReference: chainIds.certificationId,
  }),
  "EIL-4:8": Object.freeze({
    section: "Freeze",
    version: IntegrationOrchestrationFreezeIdentity.version,
    sourceReference: "integrationOrchestrationFreeze.ts",
    namespace: IntegrationOrchestrationFreezeIdentity.namespace,
    canonicalReference: chainIds.freezeId,
  }),
  "EIL-4:9": Object.freeze({
    section: "Public Index",
    version: PUBLIC_INDEX_VERSION,
    sourceReference: PUBLIC_INDEX_ENTRY,
    namespace: PUBLIC_INDEX_NAMESPACE,
    canonicalReference: PUBLIC_INDEX_ID,
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

/** Freeze-reachable aggregate export surfaces for phases without apiRegistry. */
const REGISTRY_EXPORTS = Object.freeze([
  "IntegrationOrchestrationRegistryIdentity",
  "IntegrationOrchestrationCategoryRegistry",
  "IntegrationOrchestrationContractRegistry",
  "IntegrationOrchestrationCapabilityRegistry",
  "IntegrationOrchestrationResponsibilityRegistry",
  "IntegrationOrchestrationRegistryCollections",
  "IntegrationOrchestrationRegistrySummary",
  "IntegrationOrchestrationRegistryPlatform",
] as const);

const MODEL_EXPORTS = Object.freeze([
  "IntegrationOrchestrationModelIdentity",
  "IntegrationOrchestrationDomainModels",
  "IntegrationOrchestrationRelationshipModels",
  "IntegrationOrchestrationTopologyModels",
  "IntegrationOrchestrationLifecycleModels",
  "IntegrationOrchestrationModelCollections",
  "IntegrationOrchestrationModelSummary",
  "IntegrationOrchestrationModelPlatform",
] as const);

const VALIDATION_EXPORTS = Object.freeze([
  "IntegrationOrchestrationValidationIdentity",
  "IntegrationOrchestrationValidationRules",
  "IntegrationOrchestrationValidationCategories",
  "IntegrationOrchestrationValidationFindings",
  "IntegrationOrchestrationValidationReadiness",
  "IntegrationOrchestrationValidationCollections",
  "IntegrationOrchestrationValidationSummary",
  "IntegrationOrchestrationValidationPlatform",
] as const);

const MANIFEST_EXPORTS = Object.freeze([
  "IntegrationOrchestrationManifestIdentity",
  "IntegrationOrchestrationArchitectureManifest",
  "IntegrationOrchestrationInventoryManifest",
  "IntegrationOrchestrationDependencyManifest",
  "IntegrationOrchestrationCompatibilityManifest",
  "IntegrationOrchestrationManifestCollections",
  "IntegrationOrchestrationManifestSummary",
  "IntegrationOrchestrationManifestPlatform",
] as const);

const PLATFORM_EXPORTS = Object.freeze([
  "IntegrationOrchestrationPlatformIdentity",
  "IntegrationOrchestrationPlatformComposition",
  "IntegrationOrchestrationPlatformInventory",
  "IntegrationOrchestrationPlatformGuarantees",
  "IntegrationOrchestrationPlatformCompatibility",
  "IntegrationOrchestrationPlatformCollections",
  "IntegrationOrchestrationPlatformSummary",
  "IntegrationOrchestrationPlatform",
] as const);

const CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationOrchestrationCertificationIdentity",
  "IntegrationOrchestrationCertificationCriteria",
  "IntegrationOrchestrationCertificationGates",
  "IntegrationOrchestrationComplianceDeclarations",
  "IntegrationOrchestrationCertificationReadiness",
  "IntegrationOrchestrationCertificationCollections",
  "IntegrationOrchestrationCertificationSummary",
  "IntegrationOrchestrationCertificationPlatform",
] as const);

const FREEZE_EXPORTS = Object.freeze([
  "IntegrationOrchestrationFreezeIdentity",
  "IntegrationOrchestrationFreezeLocks",
  "IntegrationOrchestrationFreezeBaselines",
  "IntegrationOrchestrationFreezeCompatibility",
  "IntegrationOrchestrationFreezeExtensions",
  "IntegrationOrchestrationFreezeCollections",
  "IntegrationOrchestrationFreezeSummary",
  "IntegrationOrchestrationFreezePlatform",
] as const);

const classify = (exportName: string): OrchestrationPublicApiKind => {
  if (exportName.startsWith("get")) {
    return "Helper";
  }
  if (
    exportName.endsWith("Id") ||
    exportName.endsWith("Name") ||
    exportName.endsWith("Version") ||
    exportName.endsWith("Namespace") ||
    exportName.endsWith("Identity")
  ) {
    return "IdentityConstant";
  }
  if (
    exportName.endsWith("Status") ||
    exportName.endsWith("Readiness") ||
    exportName.endsWith("Registry") ||
    exportName.endsWith("Count") ||
    exportName.endsWith("Exports") ||
    exportName.endsWith("Metadata") ||
    exportName.endsWith("Release") ||
    exportName.endsWith("Inventory") ||
    exportName.endsWith("Summary") ||
    exportName.endsWith("Entry")
  ) {
    return "MetadataConstant";
  }
  if (exportName.endsWith("Collections")) {
    return "Collection";
  }
  return "Aggregate";
};

const publicApiEntry = (
  phase: PhaseKey,
  exportName: string,
  order: number,
  upstreamApiId?: string,
  kind?: OrchestrationPublicApiKind,
): IntegrationOrchestrationPublicApi => {
  const meta = PHASE_META[phase];
  const resolvedKind = kind ?? classify(exportName);
  return Object.freeze({
    apiId: `EIL-4:9/PublicApi/${phase}/${exportName}`,
    canonicalKey: exportName,
    publicName: exportName,
    namespace: meta.namespace,
    sourcePhase: phase,
    ordinal: order,
    tags: Object.freeze([
      "public-api",
      meta.section.toLowerCase().replace(/\s+/g, "-"),
      resolvedKind.toLowerCase(),
    ]),
    exportName,
    section: meta.section,
    kind: resolvedKind,
    version: meta.version,
    status: "Released" as const,
    stability: "Stable" as const,
    sourceReference: meta.sourceReference,
    public: true as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    upstreamApiId: upstreamApiId ?? `EIL-4:9/OwnedApi/${exportName}`,
    derivedFromFreeze: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  exportNames: readonly string[],
  startOrder: number,
): readonly IntegrationOrchestrationPublicApi[] =>
  Object.freeze(
    exportNames.map((exportName, index) =>
      publicApiEntry(phase, exportName, startOrder + index),
    ),
  );

const foundationEntries: readonly IntegrationOrchestrationPublicApi[] =
  Object.freeze(
    foundationApis.map((api, index) =>
      publicApiEntry(
        "EIL-4:1",
        api.exportName,
        index + 1,
        api.id,
        api.kind as OrchestrationPublicApiKind,
      ),
    ),
  );

const registryEntries = phaseEntries(
  "EIL-4:2",
  REGISTRY_EXPORTS,
  foundationEntries.length + 1,
);
const modelEntries = phaseEntries(
  "EIL-4:3",
  MODEL_EXPORTS,
  foundationEntries.length + registryEntries.length + 1,
);
const validationEntries = phaseEntries(
  "EIL-4:4",
  VALIDATION_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    1,
);
const manifestEntries = phaseEntries(
  "EIL-4:5",
  MANIFEST_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    1,
);
const platformEntries = phaseEntries(
  "EIL-4:6",
  PLATFORM_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    manifestEntries.length +
    1,
);
const certificationEntries = phaseEntries(
  "EIL-4:7",
  CERTIFICATION_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    manifestEntries.length +
    platformEntries.length +
    1,
);
const freezeEntries = phaseEntries(
  "EIL-4:8",
  FREEZE_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    manifestEntries.length +
    platformEntries.length +
    certificationEntries.length +
    1,
);
const publicIndexStartOrder =
  foundationEntries.length +
  registryEntries.length +
  modelEntries.length +
  validationEntries.length +
  manifestEntries.length +
  platformEntries.length +
  certificationEntries.length +
  freezeEntries.length +
  1;
const publicIndexEntries = phaseEntries(
  "EIL-4:9",
  IntegrationOrchestrationPublicExports,
  publicIndexStartOrder,
);

const upstreamNamespaceSections: readonly IntegrationOrchestrationPublicNamespaceSection[] =
  Object.freeze(
    freeze.baselines.map((baseline) => {
      const phase = baseline.sourcePhase as Exclude<PhaseKey, "EIL-4:9">;
      const meta = PHASE_META[phase];
      return Object.freeze({
        sectionId: `EIL-4:9/Namespace/${meta.section.replace(/\s+/g, "")}`,
        section: meta.section,
        phaseId: phase,
        namespace: meta.namespace,
        canonicalReference: meta.canonicalReference,
        ordinal: baseline.ordinal,
        metadataOnly: true as const,
        immutable: true as const,
      });
    }),
  );

const publicIndexNamespaceSection: IntegrationOrchestrationPublicNamespaceSection =
  Object.freeze({
    sectionId: "EIL-4:9/Namespace/PublicIndex",
    section: "Public Index",
    phaseId: PUBLIC_INDEX_PHASE,
    namespace: PUBLIC_INDEX_NAMESPACE,
    canonicalReference: PUBLIC_INDEX_ID,
    ordinal: freeze.baselines.length + 1,
    metadataOnly: true as const,
    immutable: true as const,
  });

const publicNamespaceSections: readonly IntegrationOrchestrationPublicNamespaceSection[] =
  Object.freeze([
    ...upstreamNamespaceSections,
    publicIndexNamespaceSection,
  ]);

/**
 * Exactly nine ordered public namespace sections.
 * Derived from Freeze baselines plus Public Index.
 */
export const IntegrationOrchestrationPublicNamespace: IntegrationOrchestrationPublicNamespace =
  Object.freeze({
    namespaceId: "EIL-4:9/Namespace",
    sourcePhase: PUBLIC_INDEX_PHASE,
    sections: publicNamespaceSections,
    sectionCount: publicNamespaceSections.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Canonical Public API Registry.
 * Foundation APIs are Freeze-reachable; remaining aggregate surfaces are
 * published in deterministic phase order with Public Index exports appended.
 */
export const IntegrationOrchestrationPublicApiRegistry: readonly IntegrationOrchestrationPublicApi[] =
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

/**
 * Dynamically derived public API count.
 */
export const IntegrationOrchestrationPublicApiCount =
  IntegrationOrchestrationPublicApiRegistry.length;

/**
 * Immutable release metadata.
 */
export const IntegrationOrchestrationPublicRelease: IntegrationOrchestrationPublicRelease =
  Object.freeze({
    release: "Released" as const,
    certification: "Certified" as const,
    freeze: "Frozen" as const,
    stability: "Stable" as const,
    readiness: IntegrationOrchestrationPublicReadiness,
    releaseVersion: PUBLIC_INDEX_VERSION,
    releaseNamespace: PUBLIC_INDEX_NAMESPACE,
    releaseIdentity: PUBLIC_INDEX_ID,
    releaseLineage: Object.freeze([
      chainIds.foundationId,
      chainIds.registryId,
      chainIds.modelId,
      chainIds.validationId,
      chainIds.manifestId,
      chainIds.platformId,
      chainIds.certificationId,
      chainIds.freezeId,
      PUBLIC_INDEX_ID,
    ]),
    releaseDate: "EIL-4.0.0" as const,
    releaseDescription:
      "Official public release of the frozen, certified EIL-4 Integration Orchestration Platform.",
    freezeId: chainIds.freezeId,
    freezeSummary: IntegrationOrchestrationFreezeSummary,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Public inventory derived from Freeze and Public Index collections.
 */
export const IntegrationOrchestrationPublicInventory: IntegrationOrchestrationPublicInventory =
  Object.freeze({
    inventoryId: "EIL-4:9/Inventory",
    namespaceSectionCount:
      IntegrationOrchestrationPublicNamespace.sections.length,
    publicApiCount: IntegrationOrchestrationPublicApiRegistry.length,
    publicExportCount: IntegrationOrchestrationPublicExports.length,
    freezeInventoryTotal: freeze.inventory.totalFreezeEntryCount,
    freezeLockCount: freeze.inventory.lockCount,
    freezeBaselineCount: freeze.inventory.baselineCount,
    freezeCompatibilityCount: freeze.inventory.compatibilityCount,
    freezeExtensionCount: freeze.inventory.extensionCount,
    freezeTotalEntryCount: freeze.inventory.totalFreezeEntryCount,
    canonicalPlatformLockCount: freeze.inventory.canonicalPlatformLockCount,
    countsDerivedFromFreeze: true as const,
    countsDerivedFromCollections: true as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Sole supported consumer entry declaration.
 */
export const IntegrationOrchestrationConsumerEntry = Object.freeze({
  entryId: "EIL-4:9/ConsumerEntry",
  entryPoint: PUBLIC_INDEX_ENTRY,
  soleSupportedEntry: true as const,
  directImportPolicy: "PublicIndexOnly" as const,
  prohibitedDirectImports: Object.freeze([
    "integrationOrchestrationFoundation.ts",
    "integrationOrchestrationRegistry.ts",
    "integrationOrchestrationModel.ts",
    "integrationOrchestrationValidation.ts",
    "integrationOrchestrationManifest.ts",
    "integrationOrchestrationPlatform.ts",
    "integrationOrchestrationCertification.ts",
    "integrationOrchestrationFreeze.ts",
  ]),
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationOrchestrationFreeze.ts" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Deterministic public release summary.
 */
export const IntegrationOrchestrationPublicSummary: IntegrationOrchestrationPublicSummary =
  Object.freeze({
    publicIndexId: PUBLIC_INDEX_ID,
    version: PUBLIC_INDEX_VERSION,
    name: PUBLIC_INDEX_NAME,
    namespace: PUBLIC_INDEX_NAMESPACE,
    release: "Released" as const,
    certification: "Certified" as const,
    freeze: "Frozen" as const,
    stability: "Stable" as const,
    readiness: IntegrationOrchestrationPublicReadiness,
    freezeId: chainIds.freezeId,
    namespaceSectionCount:
      IntegrationOrchestrationPublicNamespace.sections.length,
    publicApiCount: IntegrationOrchestrationPublicApiRegistry.length,
    publicExportCount: IntegrationOrchestrationPublicExports.length,
    freezeInventoryTotal: freeze.inventory.totalFreezeEntryCount,
    consumerEntry: PUBLIC_INDEX_ENTRY,
    nextPhase: "EIL-4 Complete — ReadyForConsumer",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Public metadata envelope for consumers.
 */
export const IntegrationOrchestrationPublicMetadata: IntegrationOrchestrationPublicMetadata =
  Object.freeze({
    publicIndexId: PUBLIC_INDEX_ID,
    publicIndexName: PUBLIC_INDEX_NAME,
    publicIndexVersion: PUBLIC_INDEX_VERSION,
    publicIndexNamespace: PUBLIC_INDEX_NAMESPACE,
    layer: "EIL" as const,
    phase: PUBLIC_INDEX_PHASE,
    stage: "PublicIndex" as const,
    release: IntegrationOrchestrationPublicRelease.release,
    certification: IntegrationOrchestrationPublicRelease.certification,
    freeze: IntegrationOrchestrationPublicRelease.freeze,
    stability: IntegrationOrchestrationPublicRelease.stability,
    readiness: IntegrationOrchestrationPublicReadiness,
    releaseDate: IntegrationOrchestrationPublicRelease.releaseDate,
    solePublicEntryPoint: PUBLIC_INDEX_ENTRY,
    directImportPolicy: "PublicIndexOnly" as const,
    publicApiCount: IntegrationOrchestrationPublicApiRegistry.length,
    namespaceSectionCount:
      IntegrationOrchestrationPublicNamespace.sections.length,
    publicExportCount: IntegrationOrchestrationPublicExports.length,
    freezeInventoryTotal: freeze.inventory.totalFreezeEntryCount,
    freezeId: chainIds.freezeId,
    freezeVersion: chainIds.freezeVersion,
    certificationId: chainIds.certificationId,
    platformId: chainIds.platformId,
    manifestId: chainIds.manifestId,
    validationId: chainIds.validationId,
    modelId: chainIds.modelId,
    registryId: chainIds.registryId,
    foundationId: chainIds.foundationId,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "namespace",
  "apiRegistry",
  "inventory",
  "release",
  "readiness",
  "summary",
  "consumerEntry",
  "exports",
  "metadata",
  "dependency",
  "status",
] as const);

/**
 * Canonical immutable Integration Orchestration Public Index platform.
 * Sole entry point for EIL-4 consumers.
 */
export const IntegrationOrchestrationPublicIndexPlatform = Object.freeze({
  identity: IntegrationOrchestrationPublicIndexIdentity,
  namespace: IntegrationOrchestrationPublicNamespace,
  apiRegistry: IntegrationOrchestrationPublicApiRegistry,
  apiCount: IntegrationOrchestrationPublicApiCount,
  inventory: IntegrationOrchestrationPublicInventory,
  release: IntegrationOrchestrationPublicRelease,
  readiness: IntegrationOrchestrationPublicReadiness,
  summary: IntegrationOrchestrationPublicSummary,
  consumerEntry: IntegrationOrchestrationConsumerEntry,
  exports: IntegrationOrchestrationPublicExports,
  metadata: IntegrationOrchestrationPublicMetadata,
  dependency: Object.freeze({
    dependencyId: "EIL-4:9/Dependency/EIL48Freeze",
    freezeOnly: true as const,
    freezeId: chainIds.freezeId,
    freezeVersion: chainIds.freezeVersion,
    directPreviousPhaseModule: "integrationOrchestrationFreeze.ts" as const,
    freezeInternalImport: false as const,
    certificationDirectImport: false as const,
    platformDirectImport: false as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    previousEilPlatformDependency: false as const,
    laterEil4PhaseImport: false as const,
    laterEilPhaseImport: false as const,
    canonicalPath:
      "EIL-4:9 → EIL-4:8 IntegrationOrchestrationFreezePlatform (exclusive)",
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
  }),
  freezePlatform: freeze,
  freezeIdentity: IntegrationOrchestrationFreezeIdentity,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: "Released" as const,
  nextPhase: "EIL-4 Complete — ReadyForConsumer",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimePlatform: false as const,
  orchestrationEngine: false as const,
  workflowExecution: false as const,
  routingExecution: false as const,
  schedulingBehavior: false as const,
  certificationEngine: false as const,
  freezeEnforcement: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  queueBehavior: false as const,
  connectorExecution: false as const,
  adapterBehavior: false as const,
  dependencyInjection: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  networkingBehavior: false as const,
  loggingRuntime: false as const,
  monitoringRuntime: false as const,
  telemetryRuntime: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  sdkRuntime: false as const,
  apiBehavior: false as const,
  businessLogicBehavior: false as const,
  stateMutation: false as const,
  previousEilPlatformDependency: false as const,
  importsLaterEil4Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
