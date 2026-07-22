import { VisualizationFreeze } from "./visualizationFreeze.ts";

export const VisualizationPublicIndexId = "EVE-1:9/VisualizationPublicIndex" as const;
export const VisualizationPublicIndexVersion = "1.0.0" as const;
export const VisualizationPublicIndexName = "Visualization Public Index" as const;
export const VisualizationPublicIndexNamespace = "nexora.eve.visualization.public-index" as const;
export const VisualizationPublicReleaseStatus = "Released" as const;
export const VisualizationPublicCertificationStatus = "Certified" as const;
export const VisualizationPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "VisualizationPlatformPublicFoundation",
  "VisualizationPublicApiRegistry",
  "VisualizationPublicIndexId",
  "VisualizationPublicIndexVersion",
  "VisualizationPublicIndexName",
  "VisualizationPublicIndexNamespace",
  "VisualizationPublicReleaseStatus",
  "VisualizationPublicCertificationStatus",
  "VisualizationPublicFreezeStatus",
  "getVisualizationPublicSummary",
  "getVisualizationPublicApiCount",
  "getVisualizationPublicReleaseMetadata",
] as const);

const upstreamSections = Object.freeze(
  VisualizationFreeze.registry.entries.map((entry, index) => Object.freeze({
    id: `EVE-1:9/Namespace/${entry.phase}`,
    name: entry.phase,
    canonicalReference: entry.canonicalReference,
    source: "VisualizationFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const freezeSection = Object.freeze({
  id: "EVE-1:9/Namespace/Freeze",
  name: "Freeze",
  canonicalReference: VisualizationFreeze.identity.id,
  source: "VisualizationFreeze",
  deterministicOrder: upstreamSections.length + 1,
  preservedByReference: true,
  metadataOnly: true,
  immutable: true,
});

const publicIndexSection = Object.freeze({
  id: "EVE-1:9/Namespace/PublicIndex",
  name: "Public Index",
  canonicalReference: VisualizationPublicIndexId,
  source: "VisualizationFreeze",
  deterministicOrder: upstreamSections.length + 2,
  preservedByReference: true,
  metadataOnly: true,
  immutable: true,
});

const VisualizationPublicNamespace = Object.freeze([
  ...upstreamSections,
  freezeSection,
  publicIndexSection,
]);

const upstreamApiEntries = Object.freeze(
  upstreamSections.map((section, index) => Object.freeze({
    id: `EVE-1:9/PublicApi/${section.name}`,
    namespaceSection: section.name,
    apiReferences: Object.freeze([section.canonicalReference]),
    canonicalReference: section.canonicalReference,
    deterministicOrder: index + 1,
    derivedFromFreeze: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicApiEntries = Object.freeze([
  ...upstreamApiEntries,
  Object.freeze({
    id: "EVE-1:9/PublicApi/Freeze",
    namespaceSection: "Freeze",
    apiReferences: Object.freeze([
      VisualizationFreeze.identity.id,
      VisualizationFreeze.registry.id,
      VisualizationFreeze.locks[0]!.lockIdentifier,
    ]),
    canonicalReference: VisualizationFreeze.identity.id,
    deterministicOrder: upstreamApiEntries.length + 1,
    derivedFromFreeze: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "EVE-1:9/PublicApi/PublicIndex",
    namespaceSection: "Public Index",
    apiReferences: PUBLIC_EXPORT_NAMES,
    canonicalReference: VisualizationPublicIndexId,
    deterministicOrder: upstreamApiEntries.length + 2,
    derivedFromFreeze: true,
    metadataOnly: true,
    immutable: true,
  }),
]);

export const VisualizationPublicApiRegistry = Object.freeze({
  id: "EVE-1:9/PublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.reduce(
    (total, entry) => total + entry.apiReferences.length, 0,
  ),
  namespaceSectionCount: VisualizationPublicNamespace.length,
  frozenInventory: VisualizationFreeze.inventory,
  canonicalInventoryRule: Object.freeze({
    derivedFromFreezeReachableCollections: true,
    hardcodedApiTotals: false,
    recalculatesUpstreamInventories: false,
    duplicatesUpstreamMetadata: false,
    modifiesFrozenArchitecture: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const VisualizationPublicReleaseMetadata = Object.freeze({
  identity: Object.freeze({
    id: VisualizationPublicIndexId,
    name: VisualizationPublicIndexName,
    version: VisualizationPublicIndexVersion,
    namespace: VisualizationPublicIndexNamespace,
    layer: "Visualization Engine (EVE)",
    phase: "EVE-1:9",
  }),
  release: VisualizationPublicReleaseStatus,
  certification: VisualizationPublicCertificationStatus,
  freeze: VisualizationPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  namespace: VisualizationPublicNamespace,
  publicApiRegistry: VisualizationPublicApiRegistry,
  certificationMetadata: VisualizationFreeze.certification.metadata,
  freezeMetadata: VisualizationFreeze.identity,
  compatibility: VisualizationFreeze.compatibility,
  inventory: VisualizationFreeze.inventory,
  dependency: Object.freeze({
    visualizationFreezeOnly: true,
    directPreviousPhaseModule: "visualizationFreeze.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directManifestImport: false,
    directPlatformImport: false,
    directCertificationImport: false,
    downstreamEveDependencies: false,
  }),
  execution: false,
  visualizationRuntime: false,
  orchestration: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const VisualizationPlatformPublicFoundation = Object.freeze({
  metadata: VisualizationPublicReleaseMetadata,
  namespace: VisualizationPublicNamespace,
  publicApiRegistry: VisualizationPublicApiRegistry,
  frozenArchitecture: VisualizationFreeze,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: "visualizationPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const VisualizationPublicSummary = Object.freeze({
  ...VisualizationPublicReleaseMetadata.identity,
  release: VisualizationPublicReleaseMetadata.release,
  certification: VisualizationPublicReleaseMetadata.certification,
  freeze: VisualizationPublicReleaseMetadata.freeze,
  stability: VisualizationPublicReleaseMetadata.stability,
  readiness: VisualizationPublicReleaseMetadata.readiness,
  namespaceSectionCount: VisualizationPublicNamespace.length,
  publicApiCount: VisualizationPublicApiRegistry.apiCount,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPublicSummary = () => VisualizationPublicSummary;
export const getVisualizationPublicApiCount = () =>
  VisualizationPublicApiRegistry.apiCount;
export const getVisualizationPublicReleaseMetadata = () =>
  VisualizationPublicReleaseMetadata;

