import { GraphVisualizationFreeze } from "./graphVisualizationFreeze.ts";

export const GraphVisualizationPublicIndexId =
  "EVE-3:9/GraphVisualizationPublicIndex" as const;
export const GraphVisualizationPublicIndexVersion = "1.0.0" as const;
export const GraphVisualizationPublicIndexName =
  "Graph Visualization Public Index" as const;
export const GraphVisualizationPublicIndexNamespace =
  "nexora.eve.graph-visualization.public-index" as const;
export const GraphVisualizationPublicReleaseStatus = "Released" as const;
export const GraphVisualizationPublicCertificationStatus = "Certified" as const;
export const GraphVisualizationPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "GraphVisualizationPlatformPublicFoundation",
  "GraphVisualizationPublicApiRegistry",
  "GraphVisualizationPublicIndexId",
  "GraphVisualizationPublicIndexVersion",
  "GraphVisualizationPublicIndexName",
  "GraphVisualizationPublicIndexNamespace",
  "GraphVisualizationPublicReleaseStatus",
  "GraphVisualizationPublicCertificationStatus",
  "GraphVisualizationPublicFreezeStatus",
  "getGraphVisualizationPublicSummary",
  "getGraphVisualizationPublicApiCount",
  "getGraphVisualizationPublicReleaseMetadata",
] as const);

const certification = GraphVisualizationFreeze.certification;
const platform = certification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const upstreamPhaseSources = Object.freeze([
  Object.freeze({ section: "foundation", identity: foundation.metadata, publicSurface: foundation }),
  Object.freeze({ section: "registry", identity: registry.metadata, publicSurface: registry }),
  Object.freeze({ section: "model", identity: model.metadata, publicSurface: model }),
  Object.freeze({ section: "validation", identity: validation.metadata, publicSurface: validation }),
  Object.freeze({ section: "manifest", identity: manifest.metadata, publicSurface: manifest }),
  Object.freeze({ section: "platform", identity: platform.metadata, publicSurface: platform }),
  Object.freeze({ section: "certification", identity: certification.metadata, publicSurface: certification }),
  Object.freeze({ section: "freeze", identity: GraphVisualizationFreeze.identity,
    publicSurface: GraphVisualizationFreeze }),
] as const);

const PublicIndexOwnedReleaseIdentity = Object.freeze({
  id: GraphVisualizationPublicIndexId,
  name: GraphVisualizationPublicIndexName,
  version: GraphVisualizationPublicIndexVersion,
  namespace: GraphVisualizationPublicIndexNamespace,
  layer: "EVE",
  phase: "EVE-3:9",
  release: GraphVisualizationPublicReleaseStatus,
  certification: GraphVisualizationPublicCertificationStatus,
  freeze: GraphVisualizationPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

const upstreamNamespaceSections = Object.freeze(
  upstreamPhaseSources.map((source, index) => Object.freeze({
    id: `EVE-3:9/Namespace/${source.section}`,
    name: source.section,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    source: "GraphVisualizationFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const GraphVisualizationPublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  Object.freeze({
    id: "EVE-3:9/Namespace/publicIndex",
    name: "publicIndex",
    canonicalReference: GraphVisualizationPublicIndexId,
    canonicalSource: PublicIndexOwnedReleaseIdentity,
    source: "GraphVisualizationPublicIndex",
    deterministicOrder: upstreamNamespaceSections.length + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  }),
]);

const upstreamApiEntries = Object.freeze(
  upstreamPhaseSources.flatMap((source, phaseIndex) =>
    Object.keys(source.publicSurface).map((exportName, exportIndex) => Object.freeze({
      id: `EVE-3:9/PublicApi/${source.section}/${exportName}`,
      exportName,
      owningPhase: source.section,
      phaseIdentity: source.identity.id,
      phaseNamespace: source.identity.namespace,
      version: source.identity.version,
      publicStatus: "Published",
      stabilityStatus: "Stable",
      canonicalSourceReference: source.publicSurface,
      phaseOrder: phaseIndex + 1,
      exportOrder: exportIndex + 1,
      deterministicOrdinal: Object.freeze([phaseIndex + 1, exportIndex + 1]),
      derivedFromFreeze: true,
      metadataOnly: true,
      immutable: true,
    }))),
);

const publicIndexApiEntries = Object.freeze(
  PUBLIC_EXPORT_NAMES.map((exportName, index) => Object.freeze({
    id: `EVE-3:9/PublicApi/publicIndex/${exportName}`,
    exportName,
    owningPhase: "publicIndex",
    phaseIdentity: GraphVisualizationPublicIndexId,
    phaseNamespace: GraphVisualizationPublicIndexNamespace,
    version: GraphVisualizationPublicIndexVersion,
    publicStatus: "Published",
    stabilityStatus: "Stable",
    canonicalSourceReference: PUBLIC_EXPORT_NAMES,
    phaseOrder: upstreamPhaseSources.length + 1,
    exportOrder: index + 1,
    deterministicOrdinal: Object.freeze([upstreamPhaseSources.length + 1, index + 1]),
    derivedFromFreeze: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicApiEntries = Object.freeze([...upstreamApiEntries, ...publicIndexApiEntries]);

export const GraphVisualizationPublicApiRegistry = Object.freeze({
  id: "EVE-3:9/GraphVisualizationPublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.length,
  namespaceSectionCount: GraphVisualizationPublicNamespace.length,
  frozenInventory: GraphVisualizationFreeze.inventory,
  canonicalInventoryRule: Object.freeze({
    derivedFromFreezeReachablePublicSurfaces: true,
    ownContributionDerivedFromActualExports: true,
    hardcodedApiTotals: false,
    hardcodedUpstreamPhaseTotals: false,
    reconstructsUpstreamInventories: false,
    duplicatesUpstreamMetadata: false,
    modifiesFrozenArchitecture: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const GraphVisualizationPublicReleaseMetadata = Object.freeze({
  ...PublicIndexOwnedReleaseIdentity,
  freezeReference: GraphVisualizationFreeze.identity.id,
  lockId: GraphVisualizationFreeze.identity.lockId,
  namespaceSections: GraphVisualizationPublicNamespace,
  publicApiRegistry: GraphVisualizationPublicApiRegistry,
  certificationMetadata: GraphVisualizationFreeze.certification.metadata,
  freezeMetadata: GraphVisualizationFreeze.metadata,
  compatibility: GraphVisualizationFreeze.compatibility,
  inventory: GraphVisualizationFreeze.inventory,
  dependency: Object.freeze({
    graphVisualizationFreezeOnly: true,
    directPreviousPhaseModule: "graphVisualizationFreeze.ts",
    directCertificationImport: false,
    directPlatformImport: false,
    directManifestImport: false,
    directValidationImport: false,
    directModelImport: false,
    directRegistryImport: false,
    directFoundationImport: false,
    directEveTwoImport: false,
    directEveOneImport: false,
  }),
  soleConsumerEntryPoint: "frontend/app/lib/eve/graphVisualizationPublicIndex.ts",
  execution: false,
  graphProcessing: false,
  analytics: false,
  traversal: false,
  pathfinding: false,
  layoutExecution: false,
  rendering: false,
  interaction: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const GraphVisualizationPlatformPublicFoundation = Object.freeze({
  metadata: GraphVisualizationPublicReleaseMetadata,
  namespace: GraphVisualizationPublicNamespace,
  publicApiRegistry: GraphVisualizationPublicApiRegistry,
  frozenArchitecture: GraphVisualizationFreeze,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: GraphVisualizationPublicReleaseMetadata.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const GraphVisualizationPublicSummary = Object.freeze({
  id: GraphVisualizationPublicIndexId,
  release: GraphVisualizationPublicReleaseStatus,
  certification: GraphVisualizationPublicCertificationStatus,
  freeze: GraphVisualizationPublicFreezeStatus,
  stability: GraphVisualizationPublicReleaseMetadata.stability,
  readiness: GraphVisualizationPublicReleaseMetadata.readiness,
  namespaceSectionCount: GraphVisualizationPublicNamespace.length,
  publicApiCount: GraphVisualizationPublicApiRegistry.entries.length,
  lockId: GraphVisualizationFreeze.identity.lockId,
  soleConsumerEntryPoint: GraphVisualizationPublicReleaseMetadata.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
} as const);

export const getGraphVisualizationPublicSummary = () => GraphVisualizationPublicSummary;
export const getGraphVisualizationPublicApiCount = () =>
  GraphVisualizationPublicApiRegistry.entries.length;
export const getGraphVisualizationPublicReleaseMetadata = () =>
  GraphVisualizationPublicReleaseMetadata;
