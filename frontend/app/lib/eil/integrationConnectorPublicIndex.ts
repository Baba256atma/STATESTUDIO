/**
 * EIL-2:9 — Integration Connector Public Index.
 *
 * Sole supported public release surface for the EIL-2 Integration Connector Platform.
 * Consumes only the EIL-2:8 Integration Connector Freeze aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Consumer.
 *
 * Ownership: owned exclusively by EIL-2:9.
 *
 * Public exports (exactly 12):
 *   IntegrationConnectorPublicIndexIdentity
 *   IntegrationConnectorPublicNamespace
 *   IntegrationConnectorPublicApiRegistry
 *   IntegrationConnectorPublicApiCount
 *   IntegrationConnectorPublicInventory
 *   IntegrationConnectorPublicRelease
 *   IntegrationConnectorPublicReadiness
 *   IntegrationConnectorPublicSummary
 *   IntegrationConnectorConsumerEntry
 *   IntegrationConnectorPublicIndexPlatform
 *   IntegrationConnectorPublicExports
 *   IntegrationConnectorPublicMetadata
 *
 * Future consumers must import only integrationConnectorPublicIndex.ts.
 */

import {
  IntegrationConnectorFreezeIdentity,
  IntegrationConnectorFreezePlatform,
  IntegrationConnectorFreezeSummary,
} from "./integrationConnectorFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type IntegrationConnectorPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type IntegrationConnectorPublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: IntegrationConnectorPublicApiKind;
  version: string;
  status: "Released";
  stability: "Stable";
  sourceReference: string;
  public: true;
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  upstreamApiId: string;
  deterministicOrder: number;
  derivedFromFreeze: true;
  metadataOnly: true;
  immutable: true;
}>;

type IntegrationConnectorPublicNamespaceSection = Readonly<{
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

const freeze = IntegrationConnectorFreezePlatform;
const certification = freeze.certificationPlatform;
const platform = certification.integrationConnectorPlatform;
const manifest = platform.manifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const foundationApis = foundation.apiRegistry;

const chainIds = Object.freeze({
  freezeId: IntegrationConnectorFreezeIdentity.canonicalId,
  freezeVersion: IntegrationConnectorFreezeIdentity.version,
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

const PUBLIC_INDEX_PHASE = "EIL-2:9" as const;
const PUBLIC_INDEX_ID = "EIL-2:9/IntegrationConnectorPublicIndex" as const;
const PUBLIC_INDEX_NAME = "Integration Connector Public Index" as const;
const PUBLIC_INDEX_VERSION = "1.0.0" as const;
const PUBLIC_INDEX_NAMESPACE =
  "nexora.eil.integration-connector.public-index" as const;
const PUBLIC_INDEX_ENTRY = "integrationConnectorPublicIndex.ts" as const;

/**
 * Canonical immutable Public Index identity.
 */
export const IntegrationConnectorPublicIndexIdentity = Object.freeze({
  phaseId: PUBLIC_INDEX_PHASE,
  canonicalId: PUBLIC_INDEX_ID,
  name: PUBLIC_INDEX_NAME,
  version: PUBLIC_INDEX_VERSION,
  namespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  platform: "EIL-2" as const,
  phaseType: "PublicIndex" as const,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationConnectorFreeze.ts" as const,
  description:
    "Sole canonical public entry point publishing the frozen EIL-2 Integration Connector Platform for consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * ReadyForConsumer readiness declaration.
 */
export const IntegrationConnectorPublicReadiness = "ReadyForConsumer" as const;

/**
 * Exactly twelve stable public export names.
 */
export const IntegrationConnectorPublicExports = Object.freeze([
  "IntegrationConnectorPublicIndexIdentity",
  "IntegrationConnectorPublicNamespace",
  "IntegrationConnectorPublicApiRegistry",
  "IntegrationConnectorPublicApiCount",
  "IntegrationConnectorPublicInventory",
  "IntegrationConnectorPublicRelease",
  "IntegrationConnectorPublicReadiness",
  "IntegrationConnectorPublicSummary",
  "IntegrationConnectorConsumerEntry",
  "IntegrationConnectorPublicIndexPlatform",
  "IntegrationConnectorPublicExports",
  "IntegrationConnectorPublicMetadata",
] as const);

const PHASE_META = Object.freeze({
  "EIL-2:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "integrationConnectorFoundation.ts",
    namespace: foundation.identity.foundationNamespace,
    canonicalReference: chainIds.foundationId,
  }),
  "EIL-2:2": Object.freeze({
    section: "Registry",
    version: registry.identity.version,
    sourceReference: "integrationConnectorRegistry.ts",
    namespace: registry.identity.namespace,
    canonicalReference: chainIds.registryId,
  }),
  "EIL-2:3": Object.freeze({
    section: "Model",
    version: model.identity.version,
    sourceReference: "integrationConnectorModel.ts",
    namespace: model.identity.namespace,
    canonicalReference: chainIds.modelId,
  }),
  "EIL-2:4": Object.freeze({
    section: "Validation",
    version: validation.identity.version,
    sourceReference: "integrationConnectorValidation.ts",
    namespace: validation.identity.namespace,
    canonicalReference: chainIds.validationId,
  }),
  "EIL-2:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.version,
    sourceReference: "integrationConnectorManifest.ts",
    namespace: manifest.identity.namespace,
    canonicalReference: chainIds.manifestId,
  }),
  "EIL-2:6": Object.freeze({
    section: "Platform",
    version: platform.identity.version,
    sourceReference: "integrationConnectorPlatform.ts",
    namespace: platform.identity.namespace,
    canonicalReference: chainIds.platformId,
  }),
  "EIL-2:7": Object.freeze({
    section: "Certification",
    version: certification.identity.version,
    sourceReference: "integrationConnectorCertification.ts",
    namespace: certification.identity.namespace,
    canonicalReference: chainIds.certificationId,
  }),
  "EIL-2:8": Object.freeze({
    section: "Freeze",
    version: IntegrationConnectorFreezeIdentity.version,
    sourceReference: "integrationConnectorFreeze.ts",
    namespace: IntegrationConnectorFreezeIdentity.namespace,
    canonicalReference: chainIds.freezeId,
  }),
  "EIL-2:9": Object.freeze({
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
  "IntegrationConnectorRegistryIdentity",
  "IntegrationConnectorCategoryRegistry",
  "IntegrationConnectorContractRegistry",
  "IntegrationConnectorCapabilityRegistry",
  "IntegrationConnectorResponsibilityRegistry",
  "IntegrationConnectorRegistryCollections",
  "IntegrationConnectorRegistrySummary",
  "IntegrationConnectorRegistryPlatform",
] as const);

const MODEL_EXPORTS = Object.freeze([
  "IntegrationConnectorModelIdentity",
  "IntegrationConnectorDomainModels",
  "IntegrationConnectorRelationshipModels",
  "IntegrationConnectorEndpointModels",
  "IntegrationConnectorProtocolModels",
  "IntegrationConnectorModelCollections",
  "IntegrationConnectorModelSummary",
  "IntegrationConnectorModelPlatform",
] as const);

const VALIDATION_EXPORTS = Object.freeze([
  "IntegrationConnectorValidationIdentity",
  "IntegrationConnectorValidationRules",
  "IntegrationConnectorValidationCategories",
  "IntegrationConnectorValidationFindings",
  "IntegrationConnectorValidationReadiness",
  "IntegrationConnectorValidationCollections",
  "IntegrationConnectorValidationSummary",
  "IntegrationConnectorValidationPlatform",
] as const);

const MANIFEST_EXPORTS = Object.freeze([
  "IntegrationConnectorManifestIdentity",
  "IntegrationConnectorArchitectureManifest",
  "IntegrationConnectorInventoryManifest",
  "IntegrationConnectorDependencyManifest",
  "IntegrationConnectorCompatibilityManifest",
  "IntegrationConnectorManifestCollections",
  "IntegrationConnectorManifestSummary",
  "IntegrationConnectorManifestPlatform",
] as const);

const PLATFORM_EXPORTS = Object.freeze([
  "IntegrationConnectorPlatformIdentity",
  "IntegrationConnectorPlatformComposition",
  "IntegrationConnectorPlatformInventory",
  "IntegrationConnectorPlatformGuarantees",
  "IntegrationConnectorPlatformCompatibility",
  "IntegrationConnectorPlatformCollections",
  "IntegrationConnectorPlatformSummary",
  "IntegrationConnectorPlatform",
] as const);

const CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationConnectorCertificationIdentity",
  "IntegrationConnectorCertificationCriteria",
  "IntegrationConnectorCertificationGates",
  "IntegrationConnectorComplianceDeclarations",
  "IntegrationConnectorCertificationReadiness",
  "IntegrationConnectorCertificationCollections",
  "IntegrationConnectorCertificationSummary",
  "IntegrationConnectorCertificationPlatform",
] as const);

const FREEZE_EXPORTS = Object.freeze([
  "IntegrationConnectorFreezeIdentity",
  "IntegrationConnectorFreezeLocks",
  "IntegrationConnectorFreezeBaselines",
  "IntegrationConnectorFreezeCompatibility",
  "IntegrationConnectorFreezeExtensions",
  "IntegrationConnectorFreezeCollections",
  "IntegrationConnectorFreezeSummary",
  "IntegrationConnectorFreezePlatform",
] as const);

const classify = (
  exportName: string,
): IntegrationConnectorPublicApiKind => {
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
  return "Aggregate";
};

const publicApiEntry = (
  phase: PhaseKey,
  exportName: string,
  order: number,
  upstreamApiId?: string,
  kind?: IntegrationConnectorPublicApiKind,
): IntegrationConnectorPublicApiEntry => {
  const meta = PHASE_META[phase];
  return Object.freeze({
    id: `EIL-2:9/PublicApi/${phase}/${exportName}`,
    exportName,
    phase,
    section: meta.section,
    kind: kind ?? classify(exportName),
    version: meta.version,
    status: "Released" as const,
    stability: "Stable" as const,
    sourceReference: meta.sourceReference,
    public: true as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    upstreamApiId: upstreamApiId ?? `EIL-2:9/OwnedApi/${exportName}`,
    deterministicOrder: order,
    derivedFromFreeze: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  exportNames: readonly string[],
  startOrder: number,
): readonly IntegrationConnectorPublicApiEntry[] =>
  Object.freeze(
    exportNames.map((exportName, index) =>
      publicApiEntry(phase, exportName, startOrder + index),
    ),
  );

const foundationEntries: readonly IntegrationConnectorPublicApiEntry[] =
  Object.freeze(
    foundationApis.map((api, index) =>
      publicApiEntry(
        "EIL-2:1",
        api.exportName,
        index + 1,
        api.id,
        api.kind as IntegrationConnectorPublicApiKind,
      ),
    ),
  );

const registryEntries = phaseEntries(
  "EIL-2:2",
  REGISTRY_EXPORTS,
  foundationEntries.length + 1,
);
const modelEntries = phaseEntries(
  "EIL-2:3",
  MODEL_EXPORTS,
  foundationEntries.length + registryEntries.length + 1,
);
const validationEntries = phaseEntries(
  "EIL-2:4",
  VALIDATION_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    1,
);
const manifestEntries = phaseEntries(
  "EIL-2:5",
  MANIFEST_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    1,
);
const platformEntries = phaseEntries(
  "EIL-2:6",
  PLATFORM_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    manifestEntries.length +
    1,
);
const certificationEntries = phaseEntries(
  "EIL-2:7",
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
  "EIL-2:8",
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
  "EIL-2:9",
  IntegrationConnectorPublicExports,
  publicIndexStartOrder,
);

const upstreamNamespaceSections: readonly IntegrationConnectorPublicNamespaceSection[] =
  Object.freeze(
    freeze.baselines.map((baseline) => {
      const phase = baseline.sourcePhase as Exclude<PhaseKey, "EIL-2:9">;
      const meta = PHASE_META[phase];
      return Object.freeze({
        sectionId: `EIL-2:9/Namespace/${meta.section.replace(/\s+/g, "")}`,
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

const publicIndexNamespaceSection: IntegrationConnectorPublicNamespaceSection =
  Object.freeze({
    sectionId: "EIL-2:9/Namespace/PublicIndex",
    section: "Public Index",
    phaseId: PUBLIC_INDEX_PHASE,
    namespace: PUBLIC_INDEX_NAMESPACE,
    canonicalReference: PUBLIC_INDEX_ID,
    ordinal: freeze.baselines.length + 1,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly nine ordered public namespace sections.
 * Derived from Freeze baselines plus Public Index.
 */
export const IntegrationConnectorPublicNamespace: readonly IntegrationConnectorPublicNamespaceSection[] =
  Object.freeze([
    ...upstreamNamespaceSections,
    publicIndexNamespaceSection,
  ]);

/**
 * Canonical Public API Registry.
 * Foundation APIs are Freeze-reachable; remaining aggregate surfaces are
 * published in deterministic phase order with Public Index exports appended.
 */
export const IntegrationConnectorPublicApiRegistry: readonly IntegrationConnectorPublicApiEntry[] =
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
export const IntegrationConnectorPublicApiCount =
  IntegrationConnectorPublicApiRegistry.length;

/**
 * Immutable release metadata.
 */
export const IntegrationConnectorPublicRelease = Object.freeze({
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationConnectorPublicReadiness,
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
  releaseDate: "EIL-2.0.0" as const,
  releaseDescription:
    "Official public release of the frozen, certified EIL-2 Integration Connector Platform.",
  freezeId: chainIds.freezeId,
  freezeSummary: IntegrationConnectorFreezeSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Public inventory derived from Freeze and Public Index collections.
 */
export const IntegrationConnectorPublicInventory = Object.freeze({
  inventoryId: "EIL-2:9/Inventory",
  namespaceCount: IntegrationConnectorPublicNamespace.length,
  publicApiCount: IntegrationConnectorPublicApiRegistry.length,
  publicExportCount: IntegrationConnectorPublicExports.length,
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
export const IntegrationConnectorConsumerEntry = Object.freeze({
  entryId: "EIL-2:9/ConsumerEntry",
  entryPoint: PUBLIC_INDEX_ENTRY,
  soleSupportedEntry: true as const,
  directImportPolicy: "PublicIndexOnly" as const,
  prohibitedDirectImports: Object.freeze([
    "integrationConnectorFoundation.ts",
    "integrationConnectorRegistry.ts",
    "integrationConnectorModel.ts",
    "integrationConnectorValidation.ts",
    "integrationConnectorManifest.ts",
    "integrationConnectorPlatform.ts",
    "integrationConnectorCertification.ts",
    "integrationConnectorFreeze.ts",
  ]),
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationConnectorFreeze.ts" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Deterministic public release summary.
 */
export const IntegrationConnectorPublicSummary = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  version: PUBLIC_INDEX_VERSION,
  name: PUBLIC_INDEX_NAME,
  namespace: PUBLIC_INDEX_NAMESPACE,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationConnectorPublicReadiness,
  freezeId: chainIds.freezeId,
  namespaceCount: IntegrationConnectorPublicNamespace.length,
  publicApiCount: IntegrationConnectorPublicApiRegistry.length,
  publicExportCount: IntegrationConnectorPublicExports.length,
  consumerEntry: PUBLIC_INDEX_ENTRY,
  nextPhase: "EIL-2 Complete — ReadyForConsumer",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Public metadata envelope for consumers.
 */
export const IntegrationConnectorPublicMetadata = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  publicIndexName: PUBLIC_INDEX_NAME,
  publicIndexVersion: PUBLIC_INDEX_VERSION,
  publicIndexNamespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  phase: PUBLIC_INDEX_PHASE,
  stage: "PublicIndex" as const,
  release: IntegrationConnectorPublicRelease.release,
  certification: IntegrationConnectorPublicRelease.certification,
  freeze: IntegrationConnectorPublicRelease.freeze,
  stability: IntegrationConnectorPublicRelease.stability,
  readiness: IntegrationConnectorPublicReadiness,
  releaseDate: IntegrationConnectorPublicRelease.releaseDate,
  solePublicEntryPoint: PUBLIC_INDEX_ENTRY,
  directImportPolicy: "PublicIndexOnly" as const,
  publicApiCount: IntegrationConnectorPublicApiRegistry.length,
  namespaceCount: IntegrationConnectorPublicNamespace.length,
  publicExportCount: IntegrationConnectorPublicExports.length,
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
 * Canonical immutable Integration Connector Public Index platform.
 * Sole entry point for EIL-2 consumers.
 */
export const IntegrationConnectorPublicIndexPlatform = Object.freeze({
  identity: IntegrationConnectorPublicIndexIdentity,
  namespace: IntegrationConnectorPublicNamespace,
  apiRegistry: IntegrationConnectorPublicApiRegistry,
  apiCount: IntegrationConnectorPublicApiCount,
  inventory: IntegrationConnectorPublicInventory,
  release: IntegrationConnectorPublicRelease,
  readiness: IntegrationConnectorPublicReadiness,
  summary: IntegrationConnectorPublicSummary,
  consumerEntry: IntegrationConnectorConsumerEntry,
  exports: IntegrationConnectorPublicExports,
  metadata: IntegrationConnectorPublicMetadata,
  dependency: Object.freeze({
    dependencyId: "EIL-2:9/Dependency/EIL28Freeze",
    freezeOnly: true as const,
    freezeId: chainIds.freezeId,
    freezeVersion: chainIds.freezeVersion,
    directPreviousPhaseModule: "integrationConnectorFreeze.ts" as const,
    freezeInternalImport: false as const,
    certificationDirectImport: false as const,
    platformDirectImport: false as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    eil1Dependency: false as const,
    laterEil2PhaseImport: false as const,
    laterEilPhaseImport: false as const,
    canonicalPath:
      "EIL-2:9 → EIL-2:8 IntegrationConnectorFreezePlatform (exclusive)",
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
  }),
  freezePlatform: freeze,
  freezeIdentity: IntegrationConnectorFreezeIdentity,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: "Released" as const,
  nextPhase: "EIL-2 Complete — ReadyForConsumer",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimePlatform: false as const,
  connectorRuntime: false as const,
  endpointExecution: false as const,
  protocolExecution: false as const,
  certificationEngine: false as const,
  freezeEnforcement: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  httpClientBehavior: false as const,
  messageBrokerBehavior: false as const,
  eventBus: false as const,
  authenticationLogic: false as const,
  authorizationLogic: false as const,
  encryptionBehavior: false as const,
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
  stateMutation: false as const,
  eil1Dependency: false as const,
  importsLaterEil2Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
