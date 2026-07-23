/**
 * EIL-6:9 — Integration Observability Public Index.
 *
 * Sole supported public release surface for the EIL-6 Integration Observability Platform.
 * Consumes only the EIL-6:8 Integration Observability Freeze aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Consumer.
 *
 * Ownership: owned exclusively by EIL-6:9.
 *
 * Public exports (exactly 12):
 *   IntegrationObservabilityPublicIndexIdentity
 *   IntegrationObservabilityPublicNamespace
 *   IntegrationObservabilityPublicApiRegistry
 *   IntegrationObservabilityPublicApiCount
 *   IntegrationObservabilityPublicInventory
 *   IntegrationObservabilityPublicRelease
 *   IntegrationObservabilityPublicReadiness
 *   IntegrationObservabilityPublicSummary
 *   IntegrationObservabilityConsumerEntry
 *   IntegrationObservabilityPublicIndex
 *   IntegrationObservabilityPublicExports
 *   IntegrationObservabilityPublicMetadata
 *
 * Future consumers must import only integrationObservabilityPublicIndex.ts.
 */

import {
  IntegrationObservabilityFreeze,
  IntegrationObservabilityFreezeIdentity,
  IntegrationObservabilityFreezeLockId,
} from "./integrationObservabilityFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type ObservabilityPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Collection"
  | "Helper";

type ObservabilityPublicApiEntry = Readonly<{
  apiId: string;
  canonicalKey: string;
  publicName: string;
  namespace: string;
  sourcePhase: string;
  ordinal: number;
  tags: readonly string[];
  exportName: string;
  section: string;
  kind: ObservabilityPublicApiKind;
  version: string;
  status: "Released";
  stability: "Stable";
  exported: true;
  sourceReference: string;
  public: true;
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  upstreamApiId: string;
  derivedFromFreeze: true;
  metadataOnly: true;
  immutable: true;
}>;

type ObservabilityPublicNamespaceSection = Readonly<{
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

const freeze = IntegrationObservabilityFreeze;
const certification = freeze.certificationReference.aggregate;
const platform = certification.platformReference.aggregate;
const manifest = platform.manifestReference.aggregate;
const validation = manifest.validationReference.aggregate;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;
const foundationApis = foundation.apiRegistry;

const chainIds = Object.freeze({
  freezeId: IntegrationObservabilityFreezeIdentity.canonicalId,
  freezeVersion: IntegrationObservabilityFreezeIdentity.version,
  lockId: IntegrationObservabilityFreezeLockId,
  certificationId: certification.identity.canonicalId,
  platformId: platform.identity.canonicalId,
  manifestId: manifest.identity.canonicalId,
  validationId: validation.identity.canonicalId,
  modelId: model.identity.canonicalId,
  registryId: registry.identity.canonicalId,
  foundationId: foundation.identity.canonicalId,
});

// --------------------------------------------------------------------------
// Identity and release constants.
// --------------------------------------------------------------------------

const PUBLIC_INDEX_PHASE = "EIL-6:9" as const;
const PUBLIC_INDEX_ID = "EIL-6:9/IntegrationObservabilityPublicIndex" as const;
const PUBLIC_INDEX_NAME = "Integration Observability Public Index" as const;
const PUBLIC_INDEX_VERSION = "1.0.0" as const;
const PUBLIC_INDEX_NAMESPACE =
  "nexora.eil.integration-observability.public-index" as const;
const PUBLIC_INDEX_ENTRY = "integrationObservabilityPublicIndex.ts" as const;
const PUBLIC_INDEX_CONSUMER_IMPORT =
  'frontend/app/lib/eil/integrationObservability/integrationObservabilityPublicIndex' as const;

/**
 * Canonical immutable Public Index identity.
 */
export const IntegrationObservabilityPublicIndexIdentity = Object.freeze({
  phaseId: PUBLIC_INDEX_PHASE,
  canonicalId: PUBLIC_INDEX_ID,
  name: PUBLIC_INDEX_NAME,
  version: PUBLIC_INDEX_VERSION,
  namespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "PublicIndex" as const,
  status: "Released" as const,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  lockId: IntegrationObservabilityFreezeLockId,
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationObservabilityFreeze.ts" as const,
  description:
    "Sole canonical public entry point publishing the frozen EIL-6 Integration Observability Platform for consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * ReadyForConsumer readiness declaration.
 */
export const IntegrationObservabilityPublicReadiness =
  "ReadyForConsumer" as const;

/**
 * Exactly twelve stable public export names.
 */
export const IntegrationObservabilityPublicExports = Object.freeze([
  "IntegrationObservabilityPublicIndexIdentity",
  "IntegrationObservabilityPublicNamespace",
  "IntegrationObservabilityPublicApiRegistry",
  "IntegrationObservabilityPublicApiCount",
  "IntegrationObservabilityPublicInventory",
  "IntegrationObservabilityPublicRelease",
  "IntegrationObservabilityPublicReadiness",
  "IntegrationObservabilityPublicSummary",
  "IntegrationObservabilityConsumerEntry",
  "IntegrationObservabilityPublicIndex",
  "IntegrationObservabilityPublicExports",
  "IntegrationObservabilityPublicMetadata",
] as const);

const PHASE_META = Object.freeze({
  "EIL-6:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.version,
    sourceReference: "integrationObservabilityFoundation.ts",
    namespace: foundation.identity.namespace,
    canonicalReference: chainIds.foundationId,
  }),
  "EIL-6:2": Object.freeze({
    section: "Registry",
    version: registry.identity.version,
    sourceReference: "integrationObservabilityRegistry.ts",
    namespace: registry.identity.namespace,
    canonicalReference: chainIds.registryId,
  }),
  "EIL-6:3": Object.freeze({
    section: "Model",
    version: model.identity.version,
    sourceReference: "integrationObservabilityModel.ts",
    namespace: model.identity.namespace,
    canonicalReference: chainIds.modelId,
  }),
  "EIL-6:4": Object.freeze({
    section: "Validation",
    version: validation.identity.version,
    sourceReference: "integrationObservabilityValidation.ts",
    namespace: validation.identity.namespace,
    canonicalReference: chainIds.validationId,
  }),
  "EIL-6:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.version,
    sourceReference: "integrationObservabilityManifest.ts",
    namespace: manifest.identity.namespace,
    canonicalReference: chainIds.manifestId,
  }),
  "EIL-6:6": Object.freeze({
    section: "Platform",
    version: platform.identity.version,
    sourceReference: "integrationObservabilityPlatform.ts",
    namespace: platform.identity.namespace,
    canonicalReference: chainIds.platformId,
  }),
  "EIL-6:7": Object.freeze({
    section: "Certification",
    version: certification.identity.version,
    sourceReference: "integrationObservabilityCertification.ts",
    namespace: certification.identity.namespace,
    canonicalReference: chainIds.certificationId,
  }),
  "EIL-6:8": Object.freeze({
    section: "Freeze",
    version: IntegrationObservabilityFreezeIdentity.version,
    sourceReference: "integrationObservabilityFreeze.ts",
    namespace: IntegrationObservabilityFreezeIdentity.namespace,
    canonicalReference: chainIds.freezeId,
  }),
  "EIL-6:9": Object.freeze({
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
  "IntegrationObservabilityRegistryIdentity",
  "IntegrationObservabilityDomainRegistry",
  "IntegrationObservabilityContractRegistry",
  "IntegrationObservabilityCapabilityRegistry",
  "IntegrationObservabilityMetricRegistry",
  "IntegrationObservabilityEventRegistry",
  "IntegrationObservabilityLifecycleRegistry",
  "IntegrationObservabilityRegistry",
] as const);

const MODEL_EXPORTS = Object.freeze([
  "IntegrationObservabilityModelIdentity",
  "IntegrationObservabilityDomainModels",
  "IntegrationObservabilityContractModels",
  "IntegrationObservabilityCapabilityModels",
  "IntegrationObservabilityMetricModels",
  "IntegrationObservabilityEventModels",
  "IntegrationObservabilityLifecycleModels",
  "IntegrationObservabilityModel",
] as const);

const VALIDATION_EXPORTS = Object.freeze([
  "IntegrationObservabilityValidationIdentity",
  "IntegrationObservabilityValidationCategories",
  "IntegrationObservabilityValidationRules",
  "IntegrationObservabilityValidationGates",
  "IntegrationObservabilityValidationResults",
  "IntegrationObservabilityValidationInventory",
  "IntegrationObservabilityValidationReport",
  "IntegrationObservabilityValidation",
] as const);

const MANIFEST_EXPORTS = Object.freeze([
  "IntegrationObservabilityManifestIdentity",
  "IntegrationObservabilityManifestGuarantees",
  "IntegrationObservabilityManifestCompatibility",
  "IntegrationObservabilityManifestDependencies",
  "IntegrationObservabilityManifestExports",
  "IntegrationObservabilityManifestReadiness",
  "IntegrationObservabilityManifest",
  "IntegrationObservabilityManifestCanonicalId",
] as const);

const PLATFORM_EXPORTS = Object.freeze([
  "IntegrationObservabilityPlatformIdentity",
  "IntegrationObservabilityPlatformComposition",
  "IntegrationObservabilityPlatformCapabilities",
  "IntegrationObservabilityPlatformCompatibility",
  "IntegrationObservabilityPlatformDependencies",
  "IntegrationObservabilityPlatformReadiness",
  "IntegrationObservabilityPlatform",
  "IntegrationObservabilityPlatformCanonicalId",
] as const);

const CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationObservabilityCertificationIdentity",
  "IntegrationObservabilityCertificationCriteria",
  "IntegrationObservabilityCertificationGates",
  "IntegrationObservabilityCertificationResults",
  "IntegrationObservabilityCertificationDependencies",
  "IntegrationObservabilityCertificationReadiness",
  "IntegrationObservabilityCertification",
  "IntegrationObservabilityCertificationAggregateResult",
] as const);

const FREEZE_EXPORTS = Object.freeze([
  "IntegrationObservabilityFreezeIdentity",
  "IntegrationObservabilityFreezeLocks",
  "IntegrationObservabilityFreezeBaselines",
  "IntegrationObservabilityFreezeCompatibility",
  "IntegrationObservabilityFreezeExtensions",
  "IntegrationObservabilityFreezeArchitecture",
  "IntegrationObservabilityFreeze",
  "IntegrationObservabilityFreezeLockId",
] as const);

const classify = (exportName: string): ObservabilityPublicApiKind => {
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
    exportName.endsWith("Entry") ||
    exportName.endsWith("Result")
  ) {
    return "MetadataConstant";
  }
  if (
    exportName.endsWith("Collections") ||
    exportName.endsWith("Models") ||
    exportName.endsWith("Locks") ||
    exportName.endsWith("Baselines") ||
    exportName.endsWith("Extensions") ||
    exportName.endsWith("Criteria") ||
    exportName.endsWith("Gates") ||
    exportName.endsWith("Results") ||
    exportName.endsWith("Guarantees") ||
    exportName.endsWith("Capabilities")
  ) {
    return "Collection";
  }
  return "Aggregate";
};

const publicApiEntry = (
  phase: PhaseKey,
  exportName: string,
  order: number,
  upstreamApiId?: string,
  kind?: ObservabilityPublicApiKind,
): ObservabilityPublicApiEntry => {
  const meta = PHASE_META[phase];
  const resolvedKind = kind ?? classify(exportName);
  return Object.freeze({
    apiId: `EIL-6:9/PublicApi/${phase}/${exportName}`,
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
    exported: true as const,
    sourceReference: meta.sourceReference,
    public: true as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    upstreamApiId: upstreamApiId ?? `EIL-6:9/OwnedApi/${exportName}`,
    derivedFromFreeze: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  exportNames: readonly string[],
  startOrder: number,
): readonly ObservabilityPublicApiEntry[] =>
  Object.freeze(
    exportNames.map((exportName, index) =>
      publicApiEntry(phase, exportName, startOrder + index),
    ),
  );

/**
 * Freeze-reachable API registry surface composed from Foundation apiRegistry
 * plus frozen phase export declarations (metadata only).
 */
const freezeApiRegistry: readonly ObservabilityPublicApiEntry[] = Object.freeze([
  ...foundationApis.map((api, index) =>
    publicApiEntry(
      "EIL-6:1",
      api.exportName,
      index + 1,
      api.id,
      api.kind as ObservabilityPublicApiKind,
    ),
  ),
  ...phaseEntries("EIL-6:2", REGISTRY_EXPORTS, foundationApis.length + 1),
  ...phaseEntries(
    "EIL-6:3",
    MODEL_EXPORTS,
    foundationApis.length + REGISTRY_EXPORTS.length + 1,
  ),
  ...phaseEntries(
    "EIL-6:4",
    VALIDATION_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-6:5",
    MANIFEST_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      VALIDATION_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-6:6",
    PLATFORM_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      VALIDATION_EXPORTS.length +
      MANIFEST_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-6:7",
    CERTIFICATION_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      VALIDATION_EXPORTS.length +
      MANIFEST_EXPORTS.length +
      PLATFORM_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-6:8",
    FREEZE_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      VALIDATION_EXPORTS.length +
      MANIFEST_EXPORTS.length +
      PLATFORM_EXPORTS.length +
      CERTIFICATION_EXPORTS.length +
      1,
  ),
]);

const publicIndexEntries = phaseEntries(
  "EIL-6:9",
  IntegrationObservabilityPublicExports,
  freezeApiRegistry.length + 1,
);

const publicNamespaceSections: readonly ObservabilityPublicNamespaceSection[] =
  Object.freeze(
    (
      [
        "EIL-6:1",
        "EIL-6:2",
        "EIL-6:3",
        "EIL-6:4",
        "EIL-6:5",
        "EIL-6:6",
        "EIL-6:7",
        "EIL-6:8",
        "EIL-6:9",
      ] as const
    ).map((phase, index) => {
      const meta = PHASE_META[phase];
      return Object.freeze({
        sectionId: `EIL-6:9/Namespace/${meta.section.replace(/\s+/g, "")}`,
        section: meta.section,
        phaseId: phase,
        namespace: meta.namespace,
        canonicalReference: meta.canonicalReference,
        ordinal: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
      });
    }),
  );

/**
 * Exactly nine ordered public namespace sections.
 */
export const IntegrationObservabilityPublicNamespace = Object.freeze({
  namespaceId: "EIL-6:9/Namespace" as const,
  sourcePhase: PUBLIC_INDEX_PHASE,
  sections: publicNamespaceSections,
  sectionCount: publicNamespaceSections.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical Public API Registry.
 * Derived exclusively from Freeze-reachable API registry + Public Index exports.
 */
export const IntegrationObservabilityPublicApiRegistry: readonly ObservabilityPublicApiEntry[] =
  Object.freeze([...freezeApiRegistry, ...publicIndexEntries]);

/**
 * Dynamically derived public API count.
 */
export const IntegrationObservabilityPublicApiCount =
  IntegrationObservabilityPublicApiRegistry.length;

/**
 * Immutable release metadata.
 */
export const IntegrationObservabilityPublicRelease = Object.freeze({
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationObservabilityPublicReadiness,
  releaseVersion: PUBLIC_INDEX_VERSION,
  releaseNamespace: PUBLIC_INDEX_NAMESPACE,
  releaseIdentity: PUBLIC_INDEX_ID,
  lockId: IntegrationObservabilityFreezeLockId,
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
  releaseDate: "EIL-6.0.0" as const,
  releaseDescription:
    "Official public release of the frozen, certified EIL-6 Integration Observability Platform.",
  freezeId: chainIds.freezeId,
  freezeIdentity: IntegrationObservabilityFreezeIdentity,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Inventory derived exclusively from Freeze — never redefined.
 */
export const IntegrationObservabilityPublicInventory = Object.freeze({
  inventoryId: "EIL-6:9/Inventory" as const,
  namespaceSectionCount: publicNamespaceSections.length,
  publicApiCount: IntegrationObservabilityPublicApiRegistry.length,
  publicExportCount: IntegrationObservabilityPublicExports.length,
  freezeLockCount: freeze.architecturalLocks.length,
  freezeBaselineCount: freeze.frozenBaselines.length,
  freezeCompatibilityCount: freeze.compatibility.length,
  freezeExtensionCount: freeze.extensions.length,
  certificationDerivedInventory: freeze.certificationDerivedInventory,
  validationCategoryCount:
    freeze.certificationDerivedInventory.categoryCount,
  validationRuleCount: freeze.certificationDerivedInventory.ruleCount,
  validationGateCount: freeze.certificationDerivedInventory.gateCount,
  totalValidationInventory:
    freeze.certificationDerivedInventory.totalValidationInventory,
  validationAggregateResult:
    freeze.certificationDerivedInventory.validationAggregateResult,
  certificationAggregateResult:
    freeze.certificationDerivedInventory.certificationAggregateResult,
  countsDerivedFromFreeze: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Sole supported consumer entry declaration.
 */
export const IntegrationObservabilityConsumerEntry = Object.freeze({
  entryId: "EIL-6:9/ConsumerEntry" as const,
  entryPoint: PUBLIC_INDEX_ENTRY,
  importPath: PUBLIC_INDEX_CONSUMER_IMPORT,
  soleSupportedEntry: true as const,
  alternateEntryPoints: false as const,
  mayImportFoundationDirectly: false as const,
  mayImportRegistryDirectly: false as const,
  mayImportModelDirectly: false as const,
  mayImportValidationDirectly: false as const,
  mayImportManifestDirectly: false as const,
  mayImportPlatformDirectly: false as const,
  mayImportCertificationDirectly: false as const,
  mayImportFreezeDirectly: false as const,
  mustImportPublicIndexOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Public Index summary.
 */
export const IntegrationObservabilityPublicSummary = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  version: PUBLIC_INDEX_VERSION,
  name: PUBLIC_INDEX_NAME,
  namespace: PUBLIC_INDEX_NAMESPACE,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationObservabilityPublicReadiness,
  freezeId: chainIds.freezeId,
  lockId: IntegrationObservabilityFreezeLockId,
  namespaceSectionCount: publicNamespaceSections.length,
  publicApiCount: IntegrationObservabilityPublicApiRegistry.length,
  publicExportCount: IntegrationObservabilityPublicExports.length,
  consumerEntry: PUBLIC_INDEX_ENTRY,
  nextPhase: "EIL-6 Complete — ReadyForConsumer" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Public metadata envelope.
 */
export const IntegrationObservabilityPublicMetadata = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  publicIndexName: PUBLIC_INDEX_NAME,
  publicIndexVersion: PUBLIC_INDEX_VERSION,
  publicIndexNamespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  phase: PUBLIC_INDEX_PHASE,
  stage: "PublicIndex" as const,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationObservabilityPublicReadiness,
  lockId: IntegrationObservabilityFreezeLockId,
  releaseDate: "EIL-6.0.0" as const,
  solePublicEntryPoint: PUBLIC_INDEX_ENTRY,
  directImportPolicy: "PublicIndexOnly" as const,
  publicApiCount: IntegrationObservabilityPublicApiRegistry.length,
  namespaceSectionCount: publicNamespaceSections.length,
  publicExportCount: IntegrationObservabilityPublicExports.length,
  freezeId: chainIds.freezeId,
  freezeVersion: chainIds.freezeVersion,
  certificationId: chainIds.certificationId,
  platformId: chainIds.platformId,
  manifestId: chainIds.manifestId,
  validationId: chainIds.validationId,
  modelId: chainIds.modelId,
  registryId: chainIds.registryId,
  foundationId: chainIds.foundationId,
  freezeReference: Object.freeze({
    canonicalId: chainIds.freezeId,
    identity: IntegrationObservabilityFreezeIdentity,
    aggregate: freeze,
    lockId: IntegrationObservabilityFreezeLockId,
    entryPoint: "integrationObservabilityFreeze.ts" as const,
    exclusive: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Public Index aggregate.
 */
export const IntegrationObservabilityPublicIndex = Object.freeze({
  identity: IntegrationObservabilityPublicIndexIdentity,
  namespace: IntegrationObservabilityPublicNamespace,
  apiRegistry: IntegrationObservabilityPublicApiRegistry,
  apiCount: IntegrationObservabilityPublicApiCount,
  exports: IntegrationObservabilityPublicExports,
  inventory: IntegrationObservabilityPublicInventory,
  release: IntegrationObservabilityPublicRelease,
  readiness: IntegrationObservabilityPublicReadiness,
  summary: IntegrationObservabilityPublicSummary,
  consumerEntry: IntegrationObservabilityConsumerEntry,
  metadata: IntegrationObservabilityPublicMetadata,
  freezeReference: IntegrationObservabilityPublicMetadata.freezeReference,
  lockId: IntegrationObservabilityFreezeLockId,
  version: PUBLIC_INDEX_VERSION,
  status: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  nextPhase: "EIL-6 Complete — ReadyForConsumer" as const,
  dependency: Object.freeze({
    dependencyId: "EIL-6:9/Dependency/EIL68Freeze",
    upstreamPhase: "EIL-6:8" as const,
    upstreamCanonicalId: chainIds.freezeId,
    freezeOnly: true as const,
    bypassesFreeze: false as const,
    directPreviousPhaseModule: "integrationObservabilityFreeze.ts" as const,
    canonicalPath:
      "EIL-6:9 → EIL-6:8 IntegrationObservabilityFreeze (exclusive)",
    metadataOnly: true as const,
  }),
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  monitoringEngine: false as const,
  telemetryPipeline: false as const,
  openTelemetry: false as const,
  prometheus: false as const,
  grafana: false as const,
  loggingFramework: false as const,
  tracingRuntime: false as const,
  metricsEngine: false as const,
  alertEngine: false as const,
  healthEngine: false as const,
  dashboard: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  workerBehavior: false as const,
  apiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  immutable: true as const,
  deterministic: true as const,
});
