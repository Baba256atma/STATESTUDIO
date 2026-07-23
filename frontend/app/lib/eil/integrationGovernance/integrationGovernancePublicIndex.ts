/**
 * EIL-7:9 — Integration Governance Public Index.
 *
 * Sole supported public release surface for the EIL-7 Integration Governance Platform.
 * Consumes only the EIL-7:8 Integration Governance Freeze aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Consumer.
 *
 * Ownership: owned exclusively by EIL-7:9.
 *
 * Public exports (exactly 12):
 *   IntegrationGovernancePublicIndexIdentity
 *   IntegrationGovernancePublicNamespace
 *   IntegrationGovernancePublicApiRegistry
 *   IntegrationGovernancePublicApiCount
 *   IntegrationGovernancePublicInventory
 *   IntegrationGovernancePublicRelease
 *   IntegrationGovernancePublicReadiness
 *   IntegrationGovernancePublicSummary
 *   IntegrationGovernanceConsumerEntry
 *   IntegrationGovernancePublicIndex
 *   IntegrationGovernancePublicExports
 *   IntegrationGovernancePublicMetadata
 *
 * Future consumers must import only integrationGovernancePublicIndex.ts.
 */

import {
  IntegrationGovernanceFreeze,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
} from "./integrationGovernanceFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type GovernancePublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Collection"
  | "Helper";

type GovernancePublicApiEntry = Readonly<{
  apiId: string;
  canonicalKey: string;
  publicName: string;
  namespace: string;
  sourcePhase: string;
  ordinal: number;
  tags: readonly string[];
  exportName: string;
  section: string;
  kind: GovernancePublicApiKind;
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

type GovernancePublicNamespaceSection = Readonly<{
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

const freeze = IntegrationGovernanceFreeze;
const certification = freeze.certificationReference.aggregate;
const platform = certification.platformReference.aggregate;
const manifest = platform.manifestReference.aggregate;
const validation = manifest.validationReference.aggregate;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;
const foundationApis = foundation.apiRegistry;

const chainIds = Object.freeze({
  freezeId: IntegrationGovernanceFreezeIdentity.canonicalId,
  freezeVersion: IntegrationGovernanceFreezeIdentity.version,
  lockId: IntegrationGovernanceFreezeLockId,
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

const PUBLIC_INDEX_PHASE = "EIL-7:9" as const;
const PUBLIC_INDEX_ID = "EIL-7:9/IntegrationGovernancePublicIndex" as const;
const PUBLIC_INDEX_NAME = "Integration Governance Public Index" as const;
const PUBLIC_INDEX_VERSION = "1.0.0" as const;
const PUBLIC_INDEX_NAMESPACE =
  "nexora.eil.integration-governance.public-index" as const;
const PUBLIC_INDEX_ENTRY = "integrationGovernancePublicIndex.ts" as const;
const PUBLIC_INDEX_CONSUMER_IMPORT =
  "frontend/app/lib/eil/integrationGovernance/integrationGovernancePublicIndex" as const;

/**
 * Canonical immutable Public Index identity.
 */
export const IntegrationGovernancePublicIndexIdentity = Object.freeze({
  phaseId: PUBLIC_INDEX_PHASE,
  canonicalId: PUBLIC_INDEX_ID,
  name: PUBLIC_INDEX_NAME,
  version: PUBLIC_INDEX_VERSION,
  namespace: PUBLIC_INDEX_NAMESPACE,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "PublicIndex" as const,
  status: "Released" as const,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForConsumer" as const,
  lockId: IntegrationGovernanceFreezeLockId,
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationGovernanceFreeze.ts" as const,
  description:
    "Sole canonical public entry point publishing the frozen EIL-7 Integration Governance Platform for consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * ReadyForConsumer readiness declaration.
 */
export const IntegrationGovernancePublicReadiness =
  "ReadyForConsumer" as const;

/**
 * Exactly twelve stable public export names.
 */
export const IntegrationGovernancePublicExports = Object.freeze([
  "IntegrationGovernancePublicIndexIdentity",
  "IntegrationGovernancePublicNamespace",
  "IntegrationGovernancePublicApiRegistry",
  "IntegrationGovernancePublicApiCount",
  "IntegrationGovernancePublicInventory",
  "IntegrationGovernancePublicRelease",
  "IntegrationGovernancePublicReadiness",
  "IntegrationGovernancePublicSummary",
  "IntegrationGovernanceConsumerEntry",
  "IntegrationGovernancePublicIndex",
  "IntegrationGovernancePublicExports",
  "IntegrationGovernancePublicMetadata",
] as const);

const PHASE_META = Object.freeze({
  "EIL-7:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.version,
    sourceReference: "integrationGovernanceFoundation.ts",
    namespace: foundation.identity.namespace,
    canonicalReference: chainIds.foundationId,
  }),
  "EIL-7:2": Object.freeze({
    section: "Registry",
    version: registry.identity.version,
    sourceReference: "integrationGovernanceRegistry.ts",
    namespace: registry.identity.namespace,
    canonicalReference: chainIds.registryId,
  }),
  "EIL-7:3": Object.freeze({
    section: "Model",
    version: model.identity.version,
    sourceReference: "integrationGovernanceModel.ts",
    namespace: model.identity.namespace,
    canonicalReference: chainIds.modelId,
  }),
  "EIL-7:4": Object.freeze({
    section: "Validation",
    version: validation.identity.version,
    sourceReference: "integrationGovernanceValidation.ts",
    namespace: validation.identity.namespace,
    canonicalReference: chainIds.validationId,
  }),
  "EIL-7:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.version,
    sourceReference: "integrationGovernanceManifest.ts",
    namespace: manifest.identity.namespace,
    canonicalReference: chainIds.manifestId,
  }),
  "EIL-7:6": Object.freeze({
    section: "Platform",
    version: platform.identity.version,
    sourceReference: "integrationGovernancePlatform.ts",
    namespace: platform.identity.namespace,
    canonicalReference: chainIds.platformId,
  }),
  "EIL-7:7": Object.freeze({
    section: "Certification",
    version: certification.identity.version,
    sourceReference: "integrationGovernanceCertification.ts",
    namespace: certification.identity.namespace,
    canonicalReference: chainIds.certificationId,
  }),
  "EIL-7:8": Object.freeze({
    section: "Freeze",
    version: IntegrationGovernanceFreezeIdentity.version,
    sourceReference: "integrationGovernanceFreeze.ts",
    namespace: IntegrationGovernanceFreezeIdentity.namespace,
    canonicalReference: chainIds.freezeId,
  }),
  "EIL-7:9": Object.freeze({
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
  "IntegrationGovernanceRegistryIdentity",
  "IntegrationGovernanceDomainRegistry",
  "IntegrationGovernanceContractRegistry",
  "IntegrationGovernanceCapabilityRegistry",
  "IntegrationGovernancePolicyRegistry",
  "IntegrationGovernanceComplianceRegistry",
  "IntegrationGovernanceLifecycleRegistry",
  "IntegrationGovernanceRegistry",
] as const);

const MODEL_EXPORTS = Object.freeze([
  "IntegrationGovernanceModelIdentity",
  "IntegrationGovernanceDomainModels",
  "IntegrationGovernanceContractModels",
  "IntegrationGovernanceCapabilityModels",
  "IntegrationGovernancePolicyModels",
  "IntegrationGovernanceComplianceModels",
  "IntegrationGovernanceLifecycleModels",
  "IntegrationGovernanceModel",
] as const);

const VALIDATION_EXPORTS = Object.freeze([
  "IntegrationGovernanceValidationIdentity",
  "IntegrationGovernanceValidationCategories",
  "IntegrationGovernanceValidationRules",
  "IntegrationGovernanceValidationGates",
  "IntegrationGovernanceValidationResults",
  "IntegrationGovernanceValidationInventory",
  "IntegrationGovernanceValidationReport",
  "IntegrationGovernanceValidation",
] as const);

const MANIFEST_EXPORTS = Object.freeze([
  "IntegrationGovernanceManifestIdentity",
  "IntegrationGovernanceManifestGuarantees",
  "IntegrationGovernanceManifestCompatibility",
  "IntegrationGovernanceManifestDependencies",
  "IntegrationGovernanceManifestExports",
  "IntegrationGovernanceManifestReadiness",
  "IntegrationGovernanceManifest",
  "IntegrationGovernanceManifestCanonicalId",
] as const);

const PLATFORM_EXPORTS = Object.freeze([
  "IntegrationGovernancePlatformIdentity",
  "IntegrationGovernancePlatformComposition",
  "IntegrationGovernancePlatformCapabilities",
  "IntegrationGovernancePlatformCompatibility",
  "IntegrationGovernancePlatformDependencies",
  "IntegrationGovernancePlatformReadiness",
  "IntegrationGovernancePlatform",
  "IntegrationGovernancePlatformCanonicalId",
] as const);

const CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationGovernanceCertificationIdentity",
  "IntegrationGovernanceCertificationCriteria",
  "IntegrationGovernanceCertificationGates",
  "IntegrationGovernanceCertificationResults",
  "IntegrationGovernanceCertificationDependencies",
  "IntegrationGovernanceCertificationReadiness",
  "IntegrationGovernanceCertification",
  "IntegrationGovernanceCertificationAggregateResult",
] as const);

const FREEZE_EXPORTS = Object.freeze([
  "IntegrationGovernanceFreezeIdentity",
  "IntegrationGovernanceFreezeLocks",
  "IntegrationGovernanceFreezeBaselines",
  "IntegrationGovernanceFreezeCompatibility",
  "IntegrationGovernanceFreezeExtensions",
  "IntegrationGovernanceFreezeArchitecture",
  "IntegrationGovernanceFreeze",
  "IntegrationGovernanceFreezeLockId",
] as const);

const classify = (exportName: string): GovernancePublicApiKind => {
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
  kind?: GovernancePublicApiKind,
): GovernancePublicApiEntry => {
  const meta = PHASE_META[phase];
  const resolvedKind = kind ?? classify(exportName);
  return Object.freeze({
    apiId: `EIL-7:9/PublicApi/${phase}/${exportName}`,
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
    upstreamApiId: upstreamApiId ?? `EIL-7:9/OwnedApi/${exportName}`,
    derivedFromFreeze: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  exportNames: readonly string[],
  startOrder: number,
): readonly GovernancePublicApiEntry[] =>
  Object.freeze(
    exportNames.map((exportName, index) =>
      publicApiEntry(phase, exportName, startOrder + index),
    ),
  );

/**
 * Freeze-reachable API registry surface composed from Foundation apiRegistry
 * plus frozen phase export declarations (metadata only).
 */
const freezeApiRegistry: readonly GovernancePublicApiEntry[] = Object.freeze([
  ...foundationApis.map((api, index) =>
    publicApiEntry(
      "EIL-7:1",
      api.exportName,
      index + 1,
      api.id,
      api.kind as GovernancePublicApiKind,
    ),
  ),
  ...phaseEntries("EIL-7:2", REGISTRY_EXPORTS, foundationApis.length + 1),
  ...phaseEntries(
    "EIL-7:3",
    MODEL_EXPORTS,
    foundationApis.length + REGISTRY_EXPORTS.length + 1,
  ),
  ...phaseEntries(
    "EIL-7:4",
    VALIDATION_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-7:5",
    MANIFEST_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      VALIDATION_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-7:6",
    PLATFORM_EXPORTS,
    foundationApis.length +
      REGISTRY_EXPORTS.length +
      MODEL_EXPORTS.length +
      VALIDATION_EXPORTS.length +
      MANIFEST_EXPORTS.length +
      1,
  ),
  ...phaseEntries(
    "EIL-7:7",
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
    "EIL-7:8",
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
  "EIL-7:9",
  IntegrationGovernancePublicExports,
  freezeApiRegistry.length + 1,
);

const publicNamespaceSections: readonly GovernancePublicNamespaceSection[] =
  Object.freeze(
    (
      [
        "EIL-7:1",
        "EIL-7:2",
        "EIL-7:3",
        "EIL-7:4",
        "EIL-7:5",
        "EIL-7:6",
        "EIL-7:7",
        "EIL-7:8",
        "EIL-7:9",
      ] as const
    ).map((phase, index) => {
      const meta = PHASE_META[phase];
      return Object.freeze({
        sectionId: `EIL-7:9/Namespace/${meta.section.replace(/\s+/g, "")}`,
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
export const IntegrationGovernancePublicNamespace = Object.freeze({
  namespaceId: "EIL-7:9/Namespace" as const,
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
export const IntegrationGovernancePublicApiRegistry: readonly GovernancePublicApiEntry[] =
  Object.freeze([...freezeApiRegistry, ...publicIndexEntries]);

/**
 * Dynamically derived public API count.
 */
export const IntegrationGovernancePublicApiCount =
  IntegrationGovernancePublicApiRegistry.length;

/**
 * Immutable release metadata.
 */
export const IntegrationGovernancePublicRelease = Object.freeze({
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationGovernancePublicReadiness,
  releaseVersion: PUBLIC_INDEX_VERSION,
  releaseNamespace: PUBLIC_INDEX_NAMESPACE,
  releaseIdentity: PUBLIC_INDEX_ID,
  lockId: IntegrationGovernanceFreezeLockId,
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
  releaseDate: "EIL-7.0.0" as const,
  releaseDescription:
    "Official public release of the frozen, certified EIL-7 Integration Governance Platform.",
  freezeId: chainIds.freezeId,
  freezeIdentity: IntegrationGovernanceFreezeIdentity,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Inventory derived exclusively from Freeze — never redefined.
 */
export const IntegrationGovernancePublicInventory = Object.freeze({
  inventoryId: "EIL-7:9/Inventory" as const,
  namespaceSectionCount: publicNamespaceSections.length,
  publicApiCount: IntegrationGovernancePublicApiRegistry.length,
  publicExportCount: IntegrationGovernancePublicExports.length,
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
export const IntegrationGovernanceConsumerEntry = Object.freeze({
  entryId: "EIL-7:9/ConsumerEntry" as const,
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
export const IntegrationGovernancePublicSummary = Object.freeze({
  publicIndexId: PUBLIC_INDEX_ID,
  version: PUBLIC_INDEX_VERSION,
  name: PUBLIC_INDEX_NAME,
  namespace: PUBLIC_INDEX_NAMESPACE,
  release: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  readiness: IntegrationGovernancePublicReadiness,
  freezeId: chainIds.freezeId,
  lockId: IntegrationGovernanceFreezeLockId,
  namespaceSectionCount: publicNamespaceSections.length,
  publicApiCount: IntegrationGovernancePublicApiRegistry.length,
  publicExportCount: IntegrationGovernancePublicExports.length,
  consumerEntry: PUBLIC_INDEX_ENTRY,
  nextPhase: "EIL-7 Complete — ReadyForConsumer" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Public metadata envelope.
 */
export const IntegrationGovernancePublicMetadata = Object.freeze({
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
  readiness: IntegrationGovernancePublicReadiness,
  lockId: IntegrationGovernanceFreezeLockId,
  releaseDate: "EIL-7.0.0" as const,
  solePublicEntryPoint: PUBLIC_INDEX_ENTRY,
  directImportPolicy: "PublicIndexOnly" as const,
  publicApiCount: IntegrationGovernancePublicApiRegistry.length,
  namespaceSectionCount: publicNamespaceSections.length,
  publicExportCount: IntegrationGovernancePublicExports.length,
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
    identity: IntegrationGovernanceFreezeIdentity,
    aggregate: freeze,
    lockId: IntegrationGovernanceFreezeLockId,
    entryPoint: "integrationGovernanceFreeze.ts" as const,
    exclusive: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Public Index aggregate.
 */
export const IntegrationGovernancePublicIndex = Object.freeze({
  identity: IntegrationGovernancePublicIndexIdentity,
  namespace: IntegrationGovernancePublicNamespace,
  apiRegistry: IntegrationGovernancePublicApiRegistry,
  apiCount: IntegrationGovernancePublicApiCount,
  exports: IntegrationGovernancePublicExports,
  inventory: IntegrationGovernancePublicInventory,
  release: IntegrationGovernancePublicRelease,
  readiness: IntegrationGovernancePublicReadiness,
  summary: IntegrationGovernancePublicSummary,
  consumerEntry: IntegrationGovernanceConsumerEntry,
  metadata: IntegrationGovernancePublicMetadata,
  freezeReference: IntegrationGovernancePublicMetadata.freezeReference,
  lockId: IntegrationGovernanceFreezeLockId,
  version: PUBLIC_INDEX_VERSION,
  status: "Released" as const,
  certification: "Certified" as const,
  freeze: "Frozen" as const,
  stability: "Stable" as const,
  nextPhase: "EIL-7 Complete — ReadyForConsumer" as const,
  dependency: Object.freeze({
    dependencyId: "EIL-7:9/Dependency/EIL78Freeze",
    upstreamPhase: "EIL-7:8" as const,
    upstreamCanonicalId: chainIds.freezeId,
    freezeOnly: true as const,
    bypassesFreeze: false as const,
    directPreviousPhaseModule: "integrationGovernanceFreeze.ts" as const,
    canonicalPath:
      "EIL-7:9 → EIL-7:8 IntegrationGovernanceFreeze (exclusive)",
    metadataOnly: true as const,
  }),
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  governanceEngine: false as const,
  policyEngine: false as const,
  complianceEngine: false as const,
  certificationEngine: false as const,
  monitoringEngine: false as const,
  runtimeValidation: false as const,
  approvalWorkflow: false as const,
  auditRuntime: false as const,
  riskRuntime: false as const,
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
