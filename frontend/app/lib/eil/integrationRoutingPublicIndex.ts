/**
 * EIL-3:9 — Integration Routing Public Index.
 *
 * Sole supported public release surface for the EIL-3 Integration Routing Platform.
 * Consumes only the EIL-3:8 Integration Routing Freeze aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Consumer.
 *
 * Ownership: owned exclusively by EIL-3:9.
 *
 * Public exports (exactly 12):
 *   IntegrationRoutingPublicIndexIdentity
 *   IntegrationRoutingPublicNamespace
 *   IntegrationRoutingPublicApiRegistry
 *   IntegrationRoutingPublicApiCount
 *   IntegrationRoutingPublicInventory
 *   IntegrationRoutingPublicRelease
 *   IntegrationRoutingPublicReadiness
 *   IntegrationRoutingPublicSummary
 *   IntegrationRoutingConsumerEntry
 *   IntegrationRoutingPublicIndexPlatform
 *   IntegrationRoutingPublicExports
 *   IntegrationRoutingPublicMetadata
 *
 * Future consumers must import only integrationRoutingPublicIndex.ts.
 */

import {
  IntegrationRoutingFreezeIdentity,
  IntegrationRoutingFreezePlatform,
  IntegrationRoutingFreezeSummary,
} from "./integrationRoutingFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type RoutingPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Collection"
  | "Helper";

type RoutingPublicApiEntry = Readonly<{
  apiId: string;
  canonicalKey: string;
  publicName: string;
  namespace: string;
  sourcePhase: string;
  ordinal: number;
  tags: readonly string[];
  exportName: string;
  section: string;
  kind: RoutingPublicApiKind;
  version: string;
  status: "Released";
  stability: "Stable";
  sourceReference: string;
  public: true;
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  upstreamApiId: string;
  derivedFromFreeze: true;
  metadataOnly: true;
  immutable: true;
}>;

type RoutingPublicNamespaceSection = Readonly<{
  sectionId: string;
  section: string;
  phaseId: string;
  namespace: string;
  canonicalReference: string;
  ordinal: number;
  metadataOnly: true;
  immutable: true;
}>;

// --------------------------------------------------------------------------
// Canonical Freeze-reachable chain (sole upstream dependency).
// --------------------------------------------------------------------------

const freeze = IntegrationRoutingFreezePlatform;
const certification = freeze.certificationPlatform;
const platform = certification.integrationRoutingPlatform;
const manifest = platform.manifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const foundationApis = foundation.apiRegistry;

const chainIds = Object.freeze({
  freezeId: IntegrationRoutingFreezeIdentity.canonicalId,
  freezeVersion: IntegrationRoutingFreezeIdentity.version,
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

const PUBLIC_INDEX_PHASE = "EIL-3:9" as const;
const PUBLIC_INDEX_ID = "EIL-3:9/IntegrationRoutingPublicIndex" as const;
const PUBLIC_INDEX_NAME = "Integration Routing Public Index" as const;
const PUBLIC_INDEX_VERSION = "1.0.0" as const;
const PUBLIC_INDEX_NAMESPACE =
  "nexora.eil.integration-routing.public-index" as const;
const PUBLIC_INDEX_ENTRY = "integrationRoutingPublicIndex.ts" as const;

/**
 * Canonical immutable Public Index identity.
 */
export const IntegrationRoutingPublicIndexIdentity = Object.freeze({
  phaseId: PUBLIC_INDEX_PHASE,
  canonicalId: PUBLIC_INDEX_ID,
  name: PUBLIC_INDEX_NAME,
  version: PUBLIC_INDEX_VERSION,
  namespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  platform: "EIL-3" as const,
  phaseType: "PublicIndex" as const,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationRoutingFreeze.ts" as const,
  description:
    "Sole canonical public entry point publishing the frozen EIL-3 Integration Routing Platform for consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * ReadyForConsumer readiness declaration.
 */
export const IntegrationRoutingPublicReadiness = "ReadyForConsumer" as const;

/**
 * Exactly twelve stable public export names.
 */
export const IntegrationRoutingPublicExports = Object.freeze([
  "IntegrationRoutingPublicIndexIdentity",
  "IntegrationRoutingPublicNamespace",
  "IntegrationRoutingPublicApiRegistry",
  "IntegrationRoutingPublicApiCount",
  "IntegrationRoutingPublicInventory",
  "IntegrationRoutingPublicRelease",
  "IntegrationRoutingPublicReadiness",
  "IntegrationRoutingPublicSummary",
  "IntegrationRoutingConsumerEntry",
  "IntegrationRoutingPublicIndexPlatform",
  "IntegrationRoutingPublicExports",
  "IntegrationRoutingPublicMetadata",
] as const);

const PHASE_META = Object.freeze({
  "EIL-3:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "integrationRoutingFoundation.ts",
    namespace: foundation.identity.foundationNamespace,
    canonicalReference: chainIds.foundationId,
  }),
  "EIL-3:2": Object.freeze({
    section: "Registry",
    version: registry.identity.version,
    sourceReference: "integrationRoutingRegistry.ts",
    namespace: registry.identity.namespace,
    canonicalReference: chainIds.registryId,
  }),
  "EIL-3:3": Object.freeze({
    section: "Model",
    version: model.identity.version,
    sourceReference: "integrationRoutingModel.ts",
    namespace: model.identity.namespace,
    canonicalReference: chainIds.modelId,
  }),
  "EIL-3:4": Object.freeze({
    section: "Validation",
    version: validation.identity.version,
    sourceReference: "integrationRoutingValidation.ts",
    namespace: validation.identity.namespace,
    canonicalReference: chainIds.validationId,
  }),
  "EIL-3:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.version,
    sourceReference: "integrationRoutingManifest.ts",
    namespace: manifest.identity.namespace,
    canonicalReference: chainIds.manifestId,
  }),
  "EIL-3:6": Object.freeze({
    section: "Platform",
    version: platform.identity.version,
    sourceReference: "integrationRoutingPlatform.ts",
    namespace: platform.identity.namespace,
    canonicalReference: chainIds.platformId,
  }),
  "EIL-3:7": Object.freeze({
    section: "Certification",
    version: certification.identity.version,
    sourceReference: "integrationRoutingCertification.ts",
    namespace: certification.identity.namespace,
    canonicalReference: chainIds.certificationId,
  }),
  "EIL-3:8": Object.freeze({
    section: "Freeze",
    version: IntegrationRoutingFreezeIdentity.version,
    sourceReference: "integrationRoutingFreeze.ts",
    namespace: IntegrationRoutingFreezeIdentity.namespace,
    canonicalReference: chainIds.freezeId,
  }),
  "EIL-3:9": Object.freeze({
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
  "IntegrationRoutingRegistryIdentity",
  "IntegrationRoutingCategoryRegistry",
  "IntegrationRoutingContractRegistry",
  "IntegrationRoutingCapabilityRegistry",
  "IntegrationRoutingResponsibilityRegistry",
  "IntegrationRoutingRegistryCollections",
  "IntegrationRoutingRegistrySummary",
  "IntegrationRoutingRegistryPlatform",
] as const);

const MODEL_EXPORTS = Object.freeze([
  "IntegrationRoutingModelIdentity",
  "IntegrationRoutingDomainModels",
  "IntegrationRoutingRelationshipModels",
  "IntegrationRoutingTopologyModels",
  "IntegrationRoutingLifecycleModels",
  "IntegrationRoutingModelCollections",
  "IntegrationRoutingModelSummary",
  "IntegrationRoutingModelPlatform",
] as const);

const VALIDATION_EXPORTS = Object.freeze([
  "IntegrationRoutingValidationIdentity",
  "IntegrationRoutingValidationRules",
  "IntegrationRoutingValidationCategories",
  "IntegrationRoutingValidationFindings",
  "IntegrationRoutingValidationReadiness",
  "IntegrationRoutingValidationCollections",
  "IntegrationRoutingValidationSummary",
  "IntegrationRoutingValidationPlatform",
] as const);

const MANIFEST_EXPORTS = Object.freeze([
  "IntegrationRoutingManifestIdentity",
  "IntegrationRoutingArchitectureManifest",
  "IntegrationRoutingInventoryManifest",
  "IntegrationRoutingDependencyManifest",
  "IntegrationRoutingCompatibilityManifest",
  "IntegrationRoutingManifestCollections",
  "IntegrationRoutingManifestSummary",
  "IntegrationRoutingManifestPlatform",
] as const);

const PLATFORM_EXPORTS = Object.freeze([
  "IntegrationRoutingPlatformIdentity",
  "IntegrationRoutingPlatformComposition",
  "IntegrationRoutingPlatformInventory",
  "IntegrationRoutingPlatformGuarantees",
  "IntegrationRoutingPlatformCompatibility",
  "IntegrationRoutingPlatformCollections",
  "IntegrationRoutingPlatformSummary",
  "IntegrationRoutingPlatform",
] as const);

const CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationRoutingCertificationIdentity",
  "IntegrationRoutingCertificationCriteria",
  "IntegrationRoutingCertificationGates",
  "IntegrationRoutingComplianceDeclarations",
  "IntegrationRoutingCertificationReadiness",
  "IntegrationRoutingCertificationCollections",
  "IntegrationRoutingCertificationSummary",
  "IntegrationRoutingCertificationPlatform",
] as const);

const FREEZE_EXPORTS = Object.freeze([
  "IntegrationRoutingFreezeIdentity",
  "IntegrationRoutingFreezeLocks",
  "IntegrationRoutingFreezeBaselines",
  "IntegrationRoutingFreezeCompatibility",
  "IntegrationRoutingFreezeExtensions",
  "IntegrationRoutingFreezeCollections",
  "IntegrationRoutingFreezeSummary",
  "IntegrationRoutingFreezePlatform",
] as const);

const classify = (exportName: string): RoutingPublicApiKind => {
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
  kind?: RoutingPublicApiKind,
): RoutingPublicApiEntry => {
  const meta = PHASE_META[phase];
  const resolvedKind = kind ?? classify(exportName);
  return Object.freeze({
    apiId: `EIL-3:9/PublicApi/${phase}/${exportName}`,
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
    upstreamApiId: upstreamApiId ?? `EIL-3:9/OwnedApi/${exportName}`,
    derivedFromFreeze: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  exportNames: readonly string[],
  startOrder: number,
): readonly RoutingPublicApiEntry[] =>
  Object.freeze(
    exportNames.map((exportName, index) =>
      publicApiEntry(phase, exportName, startOrder + index),
    ),
  );

const foundationEntries: readonly RoutingPublicApiEntry[] = Object.freeze(
  foundationApis.map((api, index) =>
    publicApiEntry(
      "EIL-3:1",
      api.exportName,
      index + 1,
      api.id,
      api.kind as RoutingPublicApiKind,
    ),
  ),
);

const registryEntries = phaseEntries(
  "EIL-3:2",
  REGISTRY_EXPORTS,
  foundationEntries.length + 1,
);
const modelEntries = phaseEntries(
  "EIL-3:3",
  MODEL_EXPORTS,
  foundationEntries.length + registryEntries.length + 1,
);
const validationEntries = phaseEntries(
  "EIL-3:4",
  VALIDATION_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    1,
);
const manifestEntries = phaseEntries(
  "EIL-3:5",
  MANIFEST_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    1,
);
const platformEntries = phaseEntries(
  "EIL-3:6",
  PLATFORM_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    manifestEntries.length +
    1,
);
const certificationEntries = phaseEntries(
  "EIL-3:7",
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
  "EIL-3:8",
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
  "EIL-3:9",
  IntegrationRoutingPublicExports,
  publicIndexStartOrder,
);

const upstreamNamespaceSections: readonly RoutingPublicNamespaceSection[] =
  Object.freeze(
    freeze.baselines.map((baseline) => {
      const phase = baseline.sourcePhase as Exclude<PhaseKey, "EIL-3:9">;
      const meta = PHASE_META[phase];
      return Object.freeze({
        sectionId: `EIL-3:9/Namespace/${meta.section.replace(/\s+/g, "")}`,
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

const publicIndexNamespaceSection: RoutingPublicNamespaceSection = Object.freeze(
  {
    sectionId: "EIL-3:9/Namespace/PublicIndex",
    section: "Public Index",
    phaseId: PUBLIC_INDEX_PHASE,
    namespace: PUBLIC_INDEX_NAMESPACE,
    canonicalReference: PUBLIC_INDEX_ID,
    ordinal: freeze.baselines.length + 1,
    metadataOnly: true as const,
    immutable: true as const,
  },
);

const publicNamespaceSections: readonly RoutingPublicNamespaceSection[] =
  Object.freeze([
    ...upstreamNamespaceSections,
    publicIndexNamespaceSection,
  ]);

/**
 * Exactly nine ordered public namespace sections.
 * Derived from Freeze baselines plus Public Index.
 */
export const IntegrationRoutingPublicNamespace = Object.freeze({
  namespaceId: "EIL-3:9/Namespace",
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
export const IntegrationRoutingPublicApiRegistry: readonly RoutingPublicApiEntry[] =
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
export const IntegrationRoutingPublicApiCount =
  IntegrationRoutingPublicApiRegistry.length;

/**
 * Immutable release metadata.
 */
export const IntegrationRoutingPublicRelease = Object.freeze({
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationRoutingPublicReadiness,
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
  releaseDate: "EIL-3.0.0" as const,
  releaseDescription:
    "Official public release of the frozen, certified EIL-3 Integration Routing Platform.",
  freezeId: chainIds.freezeId,
  freezeSummary: IntegrationRoutingFreezeSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Public inventory derived from Freeze and Public Index collections.
 */
export const IntegrationRoutingPublicInventory = Object.freeze({
  inventoryId: "EIL-3:9/Inventory",
  namespaceSectionCount: IntegrationRoutingPublicNamespace.sections.length,
  publicApiCount: IntegrationRoutingPublicApiRegistry.length,
  publicExportCount: IntegrationRoutingPublicExports.length,
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
export const IntegrationRoutingConsumerEntry = Object.freeze({
  entryId: "EIL-3:9/ConsumerEntry",
  entryPoint: PUBLIC_INDEX_ENTRY,
  soleSupportedEntry: true as const,
  directImportPolicy: "PublicIndexOnly" as const,
  prohibitedDirectImports: Object.freeze([
    "integrationRoutingFoundation.ts",
    "integrationRoutingRegistry.ts",
    "integrationRoutingModel.ts",
    "integrationRoutingValidation.ts",
    "integrationRoutingManifest.ts",
    "integrationRoutingPlatform.ts",
    "integrationRoutingCertification.ts",
    "integrationRoutingFreeze.ts",
  ]),
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationRoutingFreeze.ts" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Deterministic public release summary.
 */
export const IntegrationRoutingPublicSummary = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  version: PUBLIC_INDEX_VERSION,
  name: PUBLIC_INDEX_NAME,
  namespace: PUBLIC_INDEX_NAMESPACE,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationRoutingPublicReadiness,
  freezeId: chainIds.freezeId,
  namespaceSectionCount: IntegrationRoutingPublicNamespace.sections.length,
  publicApiCount: IntegrationRoutingPublicApiRegistry.length,
  publicExportCount: IntegrationRoutingPublicExports.length,
  freezeInventoryTotal: freeze.inventory.totalFreezeEntryCount,
  consumerEntry: PUBLIC_INDEX_ENTRY,
  nextPhase: "EIL-3 Complete — ReadyForConsumer",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Public metadata envelope for consumers.
 */
export const IntegrationRoutingPublicMetadata = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  publicIndexName: PUBLIC_INDEX_NAME,
  publicIndexVersion: PUBLIC_INDEX_VERSION,
  publicIndexNamespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  phase: PUBLIC_INDEX_PHASE,
  stage: "PublicIndex" as const,
  release: IntegrationRoutingPublicRelease.release,
  certification: IntegrationRoutingPublicRelease.certification,
  freeze: IntegrationRoutingPublicRelease.freeze,
  stability: IntegrationRoutingPublicRelease.stability,
  readiness: IntegrationRoutingPublicReadiness,
  releaseDate: IntegrationRoutingPublicRelease.releaseDate,
  solePublicEntryPoint: PUBLIC_INDEX_ENTRY,
  directImportPolicy: "PublicIndexOnly" as const,
  publicApiCount: IntegrationRoutingPublicApiRegistry.length,
  namespaceSectionCount: IntegrationRoutingPublicNamespace.sections.length,
  publicExportCount: IntegrationRoutingPublicExports.length,
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
 * Canonical immutable Integration Routing Public Index platform.
 * Sole entry point for EIL-3 consumers.
 */
export const IntegrationRoutingPublicIndexPlatform = Object.freeze({
  identity: IntegrationRoutingPublicIndexIdentity,
  namespace: IntegrationRoutingPublicNamespace,
  apiRegistry: IntegrationRoutingPublicApiRegistry,
  apiCount: IntegrationRoutingPublicApiCount,
  inventory: IntegrationRoutingPublicInventory,
  release: IntegrationRoutingPublicRelease,
  readiness: IntegrationRoutingPublicReadiness,
  summary: IntegrationRoutingPublicSummary,
  consumerEntry: IntegrationRoutingConsumerEntry,
  exports: IntegrationRoutingPublicExports,
  metadata: IntegrationRoutingPublicMetadata,
  dependency: Object.freeze({
    dependencyId: "EIL-3:9/Dependency/EIL38Freeze",
    freezeOnly: true as const,
    freezeId: chainIds.freezeId,
    freezeVersion: chainIds.freezeVersion,
    directPreviousPhaseModule: "integrationRoutingFreeze.ts" as const,
    freezeInternalImport: false as const,
    certificationDirectImport: false as const,
    platformDirectImport: false as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    previousEilPlatformDependency: false as const,
    laterEil3PhaseImport: false as const,
    laterEilPhaseImport: false as const,
    canonicalPath:
      "EIL-3:9 → EIL-3:8 IntegrationRoutingFreezePlatform (exclusive)",
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
  }),
  freezePlatform: freeze,
  freezeIdentity: IntegrationRoutingFreezeIdentity,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: "Released" as const,
  nextPhase: "EIL-3 Complete — ReadyForConsumer",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimePlatform: false as const,
  routingEngine: false as const,
  messageExecution: false as const,
  orchestrationBehavior: false as const,
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
  importsLaterEil3Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
