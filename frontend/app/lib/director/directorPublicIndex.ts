import { DirectorFreeze } from "./directorFreeze.ts";

export const DirectorPublicIndexId = "DIRECTOR-1:9/DirectorPublicIndex" as const;
export const DirectorPublicIndexVersion = "1.0.0" as const;
export const DirectorPublicIndexName = "Director Public Index" as const;
export const DirectorPublicIndexNamespace = "nexora.director.public-index" as const;
export const DirectorPublicReleaseStatus = "Released" as const;
export const DirectorPublicCertificationStatus = "Certified" as const;
export const DirectorPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "DirectorPlatformPublicFoundation",
  "DirectorPublicApiRegistry",
  "DirectorPublicIndexId",
  "DirectorPublicIndexVersion",
  "DirectorPublicIndexName",
  "DirectorPublicIndexNamespace",
  "DirectorPublicReleaseStatus",
  "DirectorPublicCertificationStatus",
  "DirectorPublicFreezeStatus",
  "getDirectorPublicSummary",
  "getDirectorPublicApiCount",
  "getDirectorPublicReleaseMetadata",
] as const);

const upstreamSections = Object.freeze(
  [...DirectorFreeze.registry.entries].reverse().map((entry, index) =>
    Object.freeze({
      id: `DIRECTOR-1:9/Namespace/${entry.architectureLayer}`,
      name: entry.architectureLayer.toLowerCase(),
      canonicalReference: entry.canonicalReference,
      source: "DirectorFreeze",
      deterministicOrder: index + 1,
      metadataOnly: true,
      immutable: true,
    })),
);

const freezeSection = Object.freeze({
  id: "DIRECTOR-1:9/Namespace/Freeze",
  name: "freeze",
  canonicalReference: DirectorFreeze.metadata.freezeId,
  source: "DirectorFreeze",
  deterministicOrder: upstreamSections.length + 1,
  metadataOnly: true,
  immutable: true,
});

const publicIndexSection = Object.freeze({
  id: "DIRECTOR-1:9/Namespace/PublicIndex",
  name: "publicIndex",
  canonicalReference: DirectorPublicIndexId,
  source: "DirectorFreeze",
  deterministicOrder: upstreamSections.length + 2,
  metadataOnly: true,
  immutable: true,
});

const DirectorPublicNamespace = Object.freeze([
  ...upstreamSections,
  freezeSection,
  publicIndexSection,
]);

const upstreamApiEntries = Object.freeze(
  DirectorPublicNamespace.slice(0, -2).map((section, index) => Object.freeze({
    id: `DIRECTOR-1:9/PublicApi/${section.name}`,
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
    id: "DIRECTOR-1:9/PublicApi/freeze",
    namespaceSection: "freeze",
    apiReferences: DirectorFreeze.publicExports,
    canonicalReference: DirectorFreeze.metadata.freezeId,
    deterministicOrder: upstreamApiEntries.length + 1,
    derivedFromFreeze: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "DIRECTOR-1:9/PublicApi/publicIndex",
    namespaceSection: "publicIndex",
    apiReferences: PUBLIC_EXPORT_NAMES,
    canonicalReference: DirectorPublicIndexId,
    deterministicOrder: upstreamApiEntries.length + 2,
    derivedFromFreeze: true,
    metadataOnly: true,
    immutable: true,
  }),
]);

export const DirectorPublicApiRegistry = Object.freeze({
  registryId: "DIRECTOR-1:9/PublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.reduce(
    (total, entry) => total + entry.apiReferences.length, 0,
  ),
  namespaceSectionCount: DirectorPublicNamespace.length,
  inventorySummary: DirectorFreeze.registry.certifiedInventory,
  canonicalInventoryRule: Object.freeze({
    derivedFromFreezeReachableCollections: true,
    hardcodedTotals: false,
    reconstructsArchitecture: false,
    duplicatesMetadata: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const DirectorPublicReleaseMetadata = Object.freeze({
  identity: Object.freeze({
    id: DirectorPublicIndexId,
    name: DirectorPublicIndexName,
    version: DirectorPublicIndexVersion,
    namespace: DirectorPublicIndexNamespace,
    layer: "Director",
    phase: "Director-1:9",
  }),
  release: DirectorPublicReleaseStatus,
  certification: DirectorPublicCertificationStatus,
  freeze: DirectorPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  compatibilitySummary: DirectorFreeze.compatibility,
  inventorySummary: DirectorPublicApiRegistry.inventorySummary,
  architectureSummary: DirectorPublicNamespace,
  dependency: Object.freeze({
    freezeOnly: true,
    freezeReference: DirectorFreeze.metadata.freezeId,
    directPreviousPhaseModule: "directorFreeze.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directManifestImport: false,
    directPlatformImport: false,
    directCertificationImport: false,
    downstreamDirectorDependencies: false,
    importsEve: false,
  }),
  services: false,
  factories: false,
  execution: false,
  orchestration: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const DirectorPlatformPublicFoundation = Object.freeze({
  metadata: DirectorPublicReleaseMetadata,
  namespace: DirectorPublicNamespace,
  publicApiRegistry: DirectorPublicApiRegistry,
  frozenArchitecture: DirectorFreeze,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: "directorPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const DirectorPublicSummary = Object.freeze({
  ...DirectorPublicReleaseMetadata.identity,
  release: DirectorPublicReleaseMetadata.release,
  certification: DirectorPublicReleaseMetadata.certification,
  freeze: DirectorPublicReleaseMetadata.freeze,
  stability: DirectorPublicReleaseMetadata.stability,
  readiness: DirectorPublicReleaseMetadata.readiness,
  namespaceSectionCount: DirectorPublicNamespace.length,
  publicApiCount: DirectorPublicApiRegistry.apiCount,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDirectorPublicSummary = () => DirectorPublicSummary;
export const getDirectorPublicApiCount = () => DirectorPublicApiRegistry.apiCount;
export const getDirectorPublicReleaseMetadata = () =>
  DirectorPublicReleaseMetadata;

