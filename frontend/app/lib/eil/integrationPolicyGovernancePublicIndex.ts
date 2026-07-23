/**
 * EIL-5:9 — Integration Policy & Governance Public Index.
 *
 * Sole supported public release surface for the EIL-5 Integration Policy & Governance Platform.
 * Consumes only the EIL-5:8 Integration Policy & Governance Freeze aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Consumer.
 *
 * Ownership: owned exclusively by EIL-5:9.
 *
 * Public exports (exactly 12):
 *   IntegrationPolicyGovernancePublicIndexIdentity
 *   IntegrationPolicyGovernancePublicNamespace
 *   IntegrationPolicyGovernancePublicApiRegistry
 *   IntegrationPolicyGovernancePublicApiCount
 *   IntegrationPolicyGovernancePublicInventory
 *   IntegrationPolicyGovernancePublicRelease
 *   IntegrationPolicyGovernancePublicReadiness
 *   IntegrationPolicyGovernancePublicSummary
 *   IntegrationPolicyGovernanceConsumerEntry
 *   IntegrationPolicyGovernancePublicIndexPlatform
 *   IntegrationPolicyGovernancePublicExports
 *   IntegrationPolicyGovernancePublicMetadata
 *
 * Future consumers must import only integrationPolicyGovernancePublicIndex.ts.
 */

import {
  IntegrationPolicyGovernanceFreezeIdentity,
  IntegrationPolicyGovernanceFreezePlatform,
  IntegrationPolicyGovernanceFreezeSummary,
} from "./integrationPolicyGovernanceFreeze.ts";

// --------------------------------------------------------------------------
// Local readonly interfaces (non-exported — keeps runtime exports at twelve).
// --------------------------------------------------------------------------

type PolicyGovernancePublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Collection"
  | "Helper";

/** Public API registry entry. */
interface IntegrationPolicyGovernancePublicApi {
  readonly apiId: string;
  readonly canonicalKey: string;
  readonly publicName: string;
  readonly namespace: string;
  readonly sourcePhase: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly exportName: string;
  readonly section: string;
  readonly kind: PolicyGovernancePublicApiKind;
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
interface IntegrationPolicyGovernancePublicNamespaceSection {
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
interface IntegrationPolicyGovernancePublicNamespace {
  readonly namespaceId: "EIL-5:9/Namespace";
  readonly sourcePhase: "EIL-5:9";
  readonly sections: readonly IntegrationPolicyGovernancePublicNamespaceSection[];
  readonly sectionCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public inventory. */
interface IntegrationPolicyGovernancePublicInventory {
  readonly inventoryId: "EIL-5:9/Inventory";
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
interface IntegrationPolicyGovernancePublicRelease {
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly releaseVersion: "1.0.0";
  readonly releaseNamespace: "nexora.eil.integration-policy-governance.public-index";
  readonly releaseIdentity: "EIL-5:9/IntegrationPolicyGovernancePublicIndex";
  readonly releaseLineage: readonly string[];
  readonly releaseDate: "EIL-5.0.0";
  readonly releaseDescription: string;
  readonly freezeId: string;
  readonly freezeSummary: typeof IntegrationPolicyGovernanceFreezeSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public summary. */
interface IntegrationPolicyGovernancePublicSummary {
  readonly publicIndexId: "EIL-5:9/IntegrationPolicyGovernancePublicIndex";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Public Index";
  readonly namespace: "nexora.eil.integration-policy-governance.public-index";
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
  readonly consumerEntry: "integrationPolicyGovernancePublicIndex.ts";
  readonly nextPhase: "EIL-5 Complete — ReadyForConsumer";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Public metadata envelope. */
interface IntegrationPolicyGovernancePublicMetadata {
  readonly publicIndexId: "EIL-5:9/IntegrationPolicyGovernancePublicIndex";
  readonly publicIndexName: "Integration Policy & Governance Public Index";
  readonly publicIndexVersion: "1.0.0";
  readonly publicIndexNamespace: "nexora.eil.integration-policy-governance.public-index";
  readonly layer: "EIL";
  readonly phase: "EIL-5:9";
  readonly stage: "PublicIndex";
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly releaseDate: "EIL-5.0.0";
  readonly solePublicEntryPoint: "integrationPolicyGovernancePublicIndex.ts";
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
interface IntegrationPolicyGovernancePublicIndexIdentity {
  readonly phaseId: "EIL-5:9";
  readonly canonicalId: "EIL-5:9/IntegrationPolicyGovernancePublicIndex";
  readonly name: "Integration Policy & Governance Public Index";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.public-index";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Public Index";
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly freezeDependency: string;
  readonly freezeEntryPoint: "integrationPolicyGovernanceFreeze.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// --------------------------------------------------------------------------
// Canonical Freeze-reachable chain (sole upstream dependency).
// --------------------------------------------------------------------------

const freeze = IntegrationPolicyGovernanceFreezePlatform;
const certification = freeze.certificationPlatform;
const platform = certification.integrationPolicyGovernancePlatform;
const manifest = platform.manifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const foundationApis = foundation.apiRegistry;

const chainIds = Object.freeze({
  freezeId: IntegrationPolicyGovernanceFreezeIdentity.canonicalId,
  freezeVersion: IntegrationPolicyGovernanceFreezeIdentity.version,
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

const PUBLIC_INDEX_PHASE = "EIL-5:9" as const;
const PUBLIC_INDEX_ID =
  "EIL-5:9/IntegrationPolicyGovernancePublicIndex" as const;
const PUBLIC_INDEX_NAME =
  "Integration Policy & Governance Public Index" as const;
const PUBLIC_INDEX_VERSION = "1.0.0" as const;
const PUBLIC_INDEX_NAMESPACE =
  "nexora.eil.integration-policy-governance.public-index" as const;
const PUBLIC_INDEX_ENTRY =
  "integrationPolicyGovernancePublicIndex.ts" as const;

/**
 * Canonical immutable Public Index identity.
 */
export const IntegrationPolicyGovernancePublicIndexIdentity: IntegrationPolicyGovernancePublicIndexIdentity =
  Object.freeze({
    phaseId: PUBLIC_INDEX_PHASE,
    canonicalId: PUBLIC_INDEX_ID,
    name: PUBLIC_INDEX_NAME,
    version: PUBLIC_INDEX_VERSION,
    namespace: PUBLIC_INDEX_NAMESPACE,
    layer: "EIL" as const,
    platform: "EIL-5" as const,
    phaseType: "Public Index" as const,
    release: "Released" as const,
    certification: "Certified" as const,
    freeze: "Frozen" as const,
    stability: "Stable" as const,
    readiness: "ReadyForConsumer" as const,
    freezeDependency: chainIds.freezeId,
    freezeEntryPoint: "integrationPolicyGovernanceFreeze.ts" as const,
    description:
      "Sole canonical public entry point publishing the frozen EIL-5 Integration Policy & Governance Platform for consumers.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * ReadyForConsumer readiness declaration.
 */
export const IntegrationPolicyGovernancePublicReadiness =
  "ReadyForConsumer" as const;

/**
 * Exactly twelve stable public export names.
 */
export const IntegrationPolicyGovernancePublicExports = Object.freeze([
  "IntegrationPolicyGovernancePublicIndexIdentity",
  "IntegrationPolicyGovernancePublicNamespace",
  "IntegrationPolicyGovernancePublicApiRegistry",
  "IntegrationPolicyGovernancePublicApiCount",
  "IntegrationPolicyGovernancePublicInventory",
  "IntegrationPolicyGovernancePublicRelease",
  "IntegrationPolicyGovernancePublicReadiness",
  "IntegrationPolicyGovernancePublicSummary",
  "IntegrationPolicyGovernanceConsumerEntry",
  "IntegrationPolicyGovernancePublicIndexPlatform",
  "IntegrationPolicyGovernancePublicExports",
  "IntegrationPolicyGovernancePublicMetadata",
] as const);

const PHASE_META = Object.freeze({
  "EIL-5:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "integrationPolicyGovernanceFoundation.ts",
    namespace: foundation.identity.foundationNamespace,
    canonicalReference: chainIds.foundationId,
  }),
  "EIL-5:2": Object.freeze({
    section: "Registry",
    version: registry.identity.version,
    sourceReference: "integrationPolicyGovernanceRegistry.ts",
    namespace: registry.identity.namespace,
    canonicalReference: chainIds.registryId,
  }),
  "EIL-5:3": Object.freeze({
    section: "Model",
    version: model.identity.version,
    sourceReference: "integrationPolicyGovernanceModel.ts",
    namespace: model.identity.namespace,
    canonicalReference: chainIds.modelId,
  }),
  "EIL-5:4": Object.freeze({
    section: "Validation",
    version: validation.identity.version,
    sourceReference: "integrationPolicyGovernanceValidation.ts",
    namespace: validation.identity.namespace,
    canonicalReference: chainIds.validationId,
  }),
  "EIL-5:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.version,
    sourceReference: "integrationPolicyGovernanceManifest.ts",
    namespace: manifest.identity.namespace,
    canonicalReference: chainIds.manifestId,
  }),
  "EIL-5:6": Object.freeze({
    section: "Platform",
    version: platform.identity.version,
    sourceReference: "integrationPolicyGovernancePlatform.ts",
    namespace: platform.identity.namespace,
    canonicalReference: chainIds.platformId,
  }),
  "EIL-5:7": Object.freeze({
    section: "Certification",
    version: certification.identity.version,
    sourceReference: "integrationPolicyGovernanceCertification.ts",
    namespace: certification.identity.namespace,
    canonicalReference: chainIds.certificationId,
  }),
  "EIL-5:8": Object.freeze({
    section: "Freeze",
    version: IntegrationPolicyGovernanceFreezeIdentity.version,
    sourceReference: "integrationPolicyGovernanceFreeze.ts",
    namespace: IntegrationPolicyGovernanceFreezeIdentity.namespace,
    canonicalReference: chainIds.freezeId,
  }),
  "EIL-5:9": Object.freeze({
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
  "IntegrationPolicyGovernanceRegistryIdentity",
  "IntegrationPolicyGovernanceCategoryRegistry",
  "IntegrationPolicyGovernanceContractRegistry",
  "IntegrationPolicyGovernanceCapabilityRegistry",
  "IntegrationPolicyGovernanceResponsibilityRegistry",
  "IntegrationPolicyGovernanceRegistryCollections",
  "IntegrationPolicyGovernanceRegistrySummary",
  "IntegrationPolicyGovernanceRegistryPlatform",
] as const);

const MODEL_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceModelIdentity",
  "IntegrationPolicyGovernanceDomainModels",
  "IntegrationPolicyGovernanceRelationshipModels",
  "IntegrationPolicyGovernanceTopologyModels",
  "IntegrationPolicyGovernanceLifecycleModels",
  "IntegrationPolicyGovernanceModelCollections",
  "IntegrationPolicyGovernanceModelSummary",
  "IntegrationPolicyGovernanceModelPlatform",
] as const);

const VALIDATION_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceValidationIdentity",
  "IntegrationPolicyGovernanceValidationRules",
  "IntegrationPolicyGovernanceValidationCategories",
  "IntegrationPolicyGovernanceValidationFindings",
  "IntegrationPolicyGovernanceValidationReadiness",
  "IntegrationPolicyGovernanceValidationCollections",
  "IntegrationPolicyGovernanceValidationSummary",
  "IntegrationPolicyGovernanceValidationPlatform",
] as const);

const MANIFEST_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceManifestIdentity",
  "IntegrationPolicyGovernanceArchitectureManifest",
  "IntegrationPolicyGovernanceInventoryManifest",
  "IntegrationPolicyGovernanceDependencyManifest",
  "IntegrationPolicyGovernanceCompatibilityManifest",
  "IntegrationPolicyGovernanceManifestCollections",
  "IntegrationPolicyGovernanceManifestSummary",
  "IntegrationPolicyGovernanceManifestPlatform",
] as const);

const PLATFORM_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernancePlatformIdentity",
  "IntegrationPolicyGovernancePlatformComposition",
  "IntegrationPolicyGovernancePlatformInventory",
  "IntegrationPolicyGovernancePlatformGuarantees",
  "IntegrationPolicyGovernancePlatformCompatibility",
  "IntegrationPolicyGovernancePlatformCollections",
  "IntegrationPolicyGovernancePlatformSummary",
  "IntegrationPolicyGovernancePlatform",
] as const);

const CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceCertificationIdentity",
  "IntegrationPolicyGovernanceCertificationCriteria",
  "IntegrationPolicyGovernanceCertificationGates",
  "IntegrationPolicyGovernanceComplianceDeclarations",
  "IntegrationPolicyGovernanceCertificationReadiness",
  "IntegrationPolicyGovernanceCertificationCollections",
  "IntegrationPolicyGovernanceCertificationSummary",
  "IntegrationPolicyGovernanceCertificationPlatform",
] as const);

const FREEZE_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceFreezeIdentity",
  "IntegrationPolicyGovernanceFreezeLocks",
  "IntegrationPolicyGovernanceFreezeBaselines",
  "IntegrationPolicyGovernanceFreezeCompatibility",
  "IntegrationPolicyGovernanceFreezeExtensions",
  "IntegrationPolicyGovernanceFreezeCollections",
  "IntegrationPolicyGovernanceFreezeSummary",
  "IntegrationPolicyGovernanceFreezePlatform",
] as const);

const classify = (exportName: string): PolicyGovernancePublicApiKind => {
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
  kind?: PolicyGovernancePublicApiKind,
): IntegrationPolicyGovernancePublicApi => {
  const meta = PHASE_META[phase];
  const resolvedKind = kind ?? classify(exportName);
  return Object.freeze({
    apiId: `EIL-5:9/PublicApi/${phase}/${exportName}`,
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
    upstreamApiId: upstreamApiId ?? `EIL-5:9/OwnedApi/${exportName}`,
    derivedFromFreeze: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  exportNames: readonly string[],
  startOrder: number,
): readonly IntegrationPolicyGovernancePublicApi[] =>
  Object.freeze(
    exportNames.map((exportName, index) =>
      publicApiEntry(phase, exportName, startOrder + index),
    ),
  );

const foundationEntries: readonly IntegrationPolicyGovernancePublicApi[] =
  Object.freeze(
    foundationApis.map((api, index) =>
      publicApiEntry(
        "EIL-5:1",
        api.exportName,
        index + 1,
        api.id,
        api.kind as PolicyGovernancePublicApiKind,
      ),
    ),
  );

const registryEntries = phaseEntries(
  "EIL-5:2",
  REGISTRY_EXPORTS,
  foundationEntries.length + 1,
);
const modelEntries = phaseEntries(
  "EIL-5:3",
  MODEL_EXPORTS,
  foundationEntries.length + registryEntries.length + 1,
);
const validationEntries = phaseEntries(
  "EIL-5:4",
  VALIDATION_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    1,
);
const manifestEntries = phaseEntries(
  "EIL-5:5",
  MANIFEST_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    1,
);
const platformEntries = phaseEntries(
  "EIL-5:6",
  PLATFORM_EXPORTS,
  foundationEntries.length +
    registryEntries.length +
    modelEntries.length +
    validationEntries.length +
    manifestEntries.length +
    1,
);
const certificationEntries = phaseEntries(
  "EIL-5:7",
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
  "EIL-5:8",
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
  "EIL-5:9",
  IntegrationPolicyGovernancePublicExports,
  publicIndexStartOrder,
);

const upstreamNamespaceSections: readonly IntegrationPolicyGovernancePublicNamespaceSection[] =
  Object.freeze(
    freeze.baselines.map((baseline) => {
      const phase = baseline.sourcePhase as Exclude<PhaseKey, "EIL-5:9">;
      const meta = PHASE_META[phase];
      return Object.freeze({
        sectionId: `EIL-5:9/Namespace/${meta.section.replace(/\s+/g, "")}`,
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

const publicIndexNamespaceSection: IntegrationPolicyGovernancePublicNamespaceSection =
  Object.freeze({
    sectionId: "EIL-5:9/Namespace/PublicIndex",
    section: "Public Index",
    phaseId: PUBLIC_INDEX_PHASE,
    namespace: PUBLIC_INDEX_NAMESPACE,
    canonicalReference: PUBLIC_INDEX_ID,
    ordinal: freeze.baselines.length + 1,
    metadataOnly: true as const,
    immutable: true as const,
  });

const publicNamespaceSections: readonly IntegrationPolicyGovernancePublicNamespaceSection[] =
  Object.freeze([
    ...upstreamNamespaceSections,
    publicIndexNamespaceSection,
  ]);

/**
 * Exactly nine ordered public namespace sections.
 * Derived from Freeze baselines plus Public Index.
 */
export const IntegrationPolicyGovernancePublicNamespace: IntegrationPolicyGovernancePublicNamespace =
  Object.freeze({
    namespaceId: "EIL-5:9/Namespace",
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
export const IntegrationPolicyGovernancePublicApiRegistry: readonly IntegrationPolicyGovernancePublicApi[] =
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
export const IntegrationPolicyGovernancePublicApiCount =
  IntegrationPolicyGovernancePublicApiRegistry.length;

/**
 * Immutable release metadata.
 */
export const IntegrationPolicyGovernancePublicRelease: IntegrationPolicyGovernancePublicRelease =
  Object.freeze({
    release: "Released" as const,
    certification: "Certified" as const,
    freeze: "Frozen" as const,
    stability: "Stable" as const,
    readiness: IntegrationPolicyGovernancePublicReadiness,
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
    releaseDate: "EIL-5.0.0" as const,
    releaseDescription:
      "Official public release of the frozen, certified EIL-5 Integration Policy & Governance Platform.",
    freezeId: chainIds.freezeId,
    freezeSummary: IntegrationPolicyGovernanceFreezeSummary,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Public inventory derived from Freeze and Public Index collections.
 */
export const IntegrationPolicyGovernancePublicInventory: IntegrationPolicyGovernancePublicInventory =
  Object.freeze({
    inventoryId: "EIL-5:9/Inventory",
    namespaceSectionCount:
      IntegrationPolicyGovernancePublicNamespace.sections.length,
    publicApiCount: IntegrationPolicyGovernancePublicApiRegistry.length,
    publicExportCount: IntegrationPolicyGovernancePublicExports.length,
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
export const IntegrationPolicyGovernanceConsumerEntry = Object.freeze({
  entryId: "EIL-5:9/ConsumerEntry",
  entryPoint: PUBLIC_INDEX_ENTRY,
  soleSupportedEntry: true as const,
  directImportPolicy: "PublicIndexOnly" as const,
  prohibitedDirectImports: Object.freeze([
    "integrationPolicyGovernanceFoundation.ts",
    "integrationPolicyGovernanceRegistry.ts",
    "integrationPolicyGovernanceModel.ts",
    "integrationPolicyGovernanceValidation.ts",
    "integrationPolicyGovernanceManifest.ts",
    "integrationPolicyGovernancePlatform.ts",
    "integrationPolicyGovernanceCertification.ts",
    "integrationPolicyGovernanceFreeze.ts",
  ]),
  freezeDependency: chainIds.freezeId,
  freezeEntryPoint: "integrationPolicyGovernanceFreeze.ts" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Deterministic public release summary.
 */
export const IntegrationPolicyGovernancePublicSummary: IntegrationPolicyGovernancePublicSummary =
  Object.freeze({
    publicIndexId: PUBLIC_INDEX_ID,
    version: PUBLIC_INDEX_VERSION,
    name: PUBLIC_INDEX_NAME,
    namespace: PUBLIC_INDEX_NAMESPACE,
    release: "Released" as const,
    certification: "Certified" as const,
    freeze: "Frozen" as const,
    stability: "Stable" as const,
    readiness: IntegrationPolicyGovernancePublicReadiness,
    freezeId: chainIds.freezeId,
    namespaceSectionCount:
      IntegrationPolicyGovernancePublicNamespace.sections.length,
    publicApiCount: IntegrationPolicyGovernancePublicApiRegistry.length,
    publicExportCount: IntegrationPolicyGovernancePublicExports.length,
    freezeInventoryTotal: freeze.inventory.totalFreezeEntryCount,
    consumerEntry: PUBLIC_INDEX_ENTRY,
    nextPhase: "EIL-5 Complete — ReadyForConsumer",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Public metadata envelope for consumers.
 */
export const IntegrationPolicyGovernancePublicMetadata: IntegrationPolicyGovernancePublicMetadata =
  Object.freeze({
    publicIndexId: PUBLIC_INDEX_ID,
    publicIndexName: PUBLIC_INDEX_NAME,
    publicIndexVersion: PUBLIC_INDEX_VERSION,
    publicIndexNamespace: PUBLIC_INDEX_NAMESPACE,
    layer: "EIL" as const,
    phase: PUBLIC_INDEX_PHASE,
    stage: "PublicIndex" as const,
    release: IntegrationPolicyGovernancePublicRelease.release,
    certification: IntegrationPolicyGovernancePublicRelease.certification,
    freeze: IntegrationPolicyGovernancePublicRelease.freeze,
    stability: IntegrationPolicyGovernancePublicRelease.stability,
    readiness: IntegrationPolicyGovernancePublicReadiness,
    releaseDate: IntegrationPolicyGovernancePublicRelease.releaseDate,
    solePublicEntryPoint: PUBLIC_INDEX_ENTRY,
    directImportPolicy: "PublicIndexOnly" as const,
    publicApiCount: IntegrationPolicyGovernancePublicApiRegistry.length,
    namespaceSectionCount:
      IntegrationPolicyGovernancePublicNamespace.sections.length,
    publicExportCount: IntegrationPolicyGovernancePublicExports.length,
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
 * Canonical immutable Integration Policy & Governance Public Index platform.
 * Sole entry point for EIL-5 consumers.
 */
export const IntegrationPolicyGovernancePublicIndexPlatform = Object.freeze({
  identity: IntegrationPolicyGovernancePublicIndexIdentity,
  namespace: IntegrationPolicyGovernancePublicNamespace,
  apiRegistry: IntegrationPolicyGovernancePublicApiRegistry,
  apiCount: IntegrationPolicyGovernancePublicApiCount,
  inventory: IntegrationPolicyGovernancePublicInventory,
  release: IntegrationPolicyGovernancePublicRelease,
  readiness: IntegrationPolicyGovernancePublicReadiness,
  summary: IntegrationPolicyGovernancePublicSummary,
  consumerEntry: IntegrationPolicyGovernanceConsumerEntry,
  exports: IntegrationPolicyGovernancePublicExports,
  metadata: IntegrationPolicyGovernancePublicMetadata,
  dependency: Object.freeze({
    dependencyId: "EIL-5:9/Dependency/EIL58Freeze",
    freezeOnly: true as const,
    freezeId: chainIds.freezeId,
    freezeVersion: chainIds.freezeVersion,
    directPreviousPhaseModule:
      "integrationPolicyGovernanceFreeze.ts" as const,
    freezeInternalImport: false as const,
    certificationDirectImport: false as const,
    platformDirectImport: false as const,
    manifestDirectImport: false as const,
    validationDirectImport: false as const,
    modelDirectImport: false as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    previousEilPlatformDependency: false as const,
    laterEil5PhaseImport: false as const,
    laterEilPhaseImport: false as const,
    canonicalPath:
      "EIL-5:9 → EIL-5:8 IntegrationPolicyGovernanceFreezePlatform (exclusive)",
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
  }),
  freezePlatform: freeze,
  freezeIdentity: IntegrationPolicyGovernanceFreezeIdentity,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: "Released" as const,
  nextPhase: "EIL-5 Complete — ReadyForConsumer",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimePlatform: false as const,
  governanceEngine: false as const,
  policyEnforcement: false as const,
  authorizationEngine: false as const,
  complianceEngine: false as const,
  orchestrationRuntime: false as const,
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
  importsLaterEil5Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
