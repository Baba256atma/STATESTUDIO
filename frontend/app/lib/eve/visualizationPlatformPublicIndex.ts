import { VisualizationPlatformFreezePlatform } from "./visualizationPlatformFreeze.ts";

export const VisualizationPlatformPublicIndexId =
  "EVE-8:9/VisualizationPlatformPublicIndex" as const;
export const VisualizationPlatformPublicIndexVersion = "1.0.0" as const;
export const VisualizationPlatformPublicIndexName =
  "Visualization Platform Public Index" as const;
export const VisualizationPlatformPublicIndexNamespace =
  "nexora.eve.visualization-platform.public-index" as const;
export const VisualizationPlatformPublicReleaseStatus = "Released" as const;
export const VisualizationPlatformPublicCertificationStatus =
  "Certified" as const;
export const VisualizationPlatformPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "VisualizationPlatformPublicFoundation",
  "VisualizationPlatformPublicApiRegistry",
  "VisualizationPlatformPublicIndexId",
  "VisualizationPlatformPublicIndexVersion",
  "VisualizationPlatformPublicIndexName",
  "VisualizationPlatformPublicIndexNamespace",
  "VisualizationPlatformPublicReleaseStatus",
  "VisualizationPlatformPublicCertificationStatus",
  "VisualizationPlatformPublicFreezeStatus",
  "getVisualizationPlatformPublicSummary",
  "getVisualizationPlatformPublicApiCount",
  "getVisualizationPlatformPublicReleaseMetadata",
] as const);

const freeze = VisualizationPlatformFreezePlatform;
const certification = freeze.certification;
const platform = certification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const upstreamPhaseSources = Object.freeze([
  Object.freeze({ name: "Foundation", identity: foundation.identity,
    publicSurface: foundation }),
  Object.freeze({ name: "Registry", identity: registry.identity,
    publicSurface: registry }),
  Object.freeze({ name: "Model", identity: model.identity,
    publicSurface: model }),
  Object.freeze({ name: "Validation", identity: validation.identity,
    publicSurface: validation }),
  Object.freeze({ name: "Manifest", identity: manifest.identity,
    publicSurface: manifest }),
  Object.freeze({ name: "Platform", identity: platform.identity,
    publicSurface: platform }),
  Object.freeze({ name: "Certification", identity: certification.identity,
    publicSurface: certification }),
  Object.freeze({ name: "Freeze", identity: freeze.identity,
    publicSurface: freeze }),
] as const);

const upstreamNamespaceSections = Object.freeze(upstreamPhaseSources.map(
  (source, index) => Object.freeze({
    id: `EVE-8:9/Namespace/${source.name}` as const,
    name: source.name,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    source: "VisualizationPlatformFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicIndexSection = Object.freeze({
  id: "EVE-8:9/Namespace/PublicIndex",
  name: "Public Index",
  canonicalReference: VisualizationPlatformPublicIndexId,
  canonicalSource: PUBLIC_EXPORT_NAMES,
  source: "VisualizationPlatformPublicIndex",
  deterministicOrder: upstreamNamespaceSections.length + 1,
  preservedByReference: true,
  metadataOnly: true,
  immutable: true,
} as const);

const VisualizationPlatformPublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  publicIndexSection,
]);

const upstreamApiEntries = Object.freeze(upstreamPhaseSources.flatMap(
  (source, phaseIndex) => Object.keys(source.publicSurface).map(
    (exportName, exportIndex) => Object.freeze({
      id: `EVE-8:9/PublicApi/${source.name}/${exportName}` as const,
      exportName,
      owningPhase: source.name,
      phaseIdentity: source.identity.id,
      namespace: source.identity.namespace,
      version: source.identity.version,
      stability: "Stable",
      publicStatus: "Published",
      canonicalSourceReference: source.publicSurface,
      phaseOrder: phaseIndex + 1,
      exportOrder: exportIndex + 1,
      deterministicOrdinal: Object.freeze([
        phaseIndex + 1, exportIndex + 1,
      ] as const),
      derivedThroughFreeze: true,
      executableBehavior: false,
      metadataOnly: true,
      immutable: true,
    })),
));

const publicIndexApiEntries = Object.freeze(PUBLIC_EXPORT_NAMES.map(
  (exportName, index) => Object.freeze({
    id: `EVE-8:9/PublicApi/PublicIndex/${exportName}` as const,
    exportName,
    owningPhase: "Public Index",
    phaseIdentity: VisualizationPlatformPublicIndexId,
    namespace: VisualizationPlatformPublicIndexNamespace,
    version: VisualizationPlatformPublicIndexVersion,
    stability: "Stable",
    publicStatus: "Published",
    canonicalSourceReference: PUBLIC_EXPORT_NAMES,
    phaseOrder: upstreamPhaseSources.length + 1,
    exportOrder: index + 1,
    deterministicOrdinal: Object.freeze([
      upstreamPhaseSources.length + 1, index + 1,
    ] as const),
    derivedThroughFreeze: false,
    executableBehavior: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicApiEntries = Object.freeze([
  ...upstreamApiEntries,
  ...publicIndexApiEntries,
]);

export const VisualizationPlatformPublicApiRegistry = Object.freeze({
  id: "EVE-8:9/VisualizationPlatformPublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.length,
  namespaceSectionCount: VisualizationPlatformPublicNamespace.length,
  frozenInventory: freeze.inventory,
  canonicalInventoryRule: Object.freeze({
    consumesVisualizationPlatformFreezeOnly: true,
    freezeCollectionsPreservedByReference: true,
    earlierPhasesReachableOnlyThroughFreeze: true,
    derivedFromFreezeReachablePublicSurfaces: true,
    ownContributionDerivedFromActualExports: true,
    hardcodedApiTotals: false,
    hardcodedUpstreamPhaseCounts: false,
    recalculatesUpstreamInventories: false,
    duplicatesUpstreamMetadata: false,
    reconstructsUpstreamCollections: false,
    maintainsParallelPublicApiInventory: false,
    modifiesFrozenArchitecture: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const VisualizationPlatformPublicReleaseMetadata = Object.freeze({
  identity: Object.freeze({
    id: VisualizationPlatformPublicIndexId,
    name: VisualizationPlatformPublicIndexName,
    version: VisualizationPlatformPublicIndexVersion,
    namespace: VisualizationPlatformPublicIndexNamespace,
    layer: "EVE",
    phase: "EVE-8:9",
  }),
  release: VisualizationPlatformPublicReleaseStatus,
  certification: VisualizationPlatformPublicCertificationStatus,
  freeze: VisualizationPlatformPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  namespace: VisualizationPlatformPublicNamespace,
  publicApiRegistry: VisualizationPlatformPublicApiRegistry,
  certificationMetadata: freeze.certification.metadata,
  freezeMetadata: freeze.metadata,
  compatibility: freeze.compatibility,
  inventory: freeze.inventory,
  dependency: Object.freeze({
    visualizationPlatformFreezeOnly: true,
    directPreviousPhaseModule: "visualizationPlatformFreeze.ts",
    directCertificationImport: false,
    directPlatformImport: false,
    directManifestImport: false,
    directValidationImport: false,
    directModelImport: false,
    directRegistryImport: false,
    directFoundationImport: false,
    directEveOneThroughSevenImport: false,
  }),
  soleConsumerEntryPoint: "visualizationPlatformPublicIndex.ts",
  supportedConsumerEntries: Object.freeze([
    "visualizationPlatformPublicIndex.ts",
  ] as const),
  rendering: false,
  visualizationExecution: false,
  graphExecution: false,
  timelineExecution: false,
  dashboardExecution: false,
  animationExecution: false,
  gpuProcessing: false,
  validationRuntime: false,
  certificationRuntime: false,
  freezeRuntime: false,
  orchestration: false,
  ui: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const VisualizationPlatformPublicFoundation = Object.freeze({
  metadata: VisualizationPlatformPublicReleaseMetadata,
  namespace: VisualizationPlatformPublicNamespace,
  publicApiRegistry: VisualizationPlatformPublicApiRegistry,
  frozenArchitecture: freeze,
  freezeCollections: freeze.inventory,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: "visualizationPlatformPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const VisualizationPlatformPublicSummary = Object.freeze({
  ...VisualizationPlatformPublicReleaseMetadata.identity,
  release: VisualizationPlatformPublicReleaseMetadata.release,
  certification: VisualizationPlatformPublicReleaseMetadata.certification,
  freeze: VisualizationPlatformPublicReleaseMetadata.freeze,
  stability: VisualizationPlatformPublicReleaseMetadata.stability,
  readiness: VisualizationPlatformPublicReleaseMetadata.readiness,
  lockId: VisualizationPlatformPublicReleaseMetadata.lockId,
  namespaceSectionCount: VisualizationPlatformPublicNamespace.length,
  publicApiCount: VisualizationPlatformPublicApiRegistry.apiCount,
  soleConsumerEntryPoint:
    VisualizationPlatformPublicFoundation.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPlatformPublicSummary = () =>
  VisualizationPlatformPublicSummary;
export const getVisualizationPlatformPublicApiCount = () =>
  VisualizationPlatformPublicApiRegistry.apiCount;
export const getVisualizationPlatformPublicReleaseMetadata = () =>
  VisualizationPlatformPublicReleaseMetadata;
