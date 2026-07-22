import { ChartMetricVisualizationFreezePlatform } from "./chartMetricVisualizationFreeze.ts";

export const ChartMetricVisualizationPublicIndexId =
  "EVE-5:9/ChartMetricVisualizationPublicIndex" as const;
export const ChartMetricVisualizationPublicIndexVersion = "1.0.0" as const;
export const ChartMetricVisualizationPublicIndexName =
  "Chart & Metric Visualization Public Index" as const;
export const ChartMetricVisualizationPublicIndexNamespace =
  "nexora.eve.chart-metric-visualization.public-index" as const;
export const ChartMetricVisualizationPublicReleaseStatus = "Released" as const;
export const ChartMetricVisualizationPublicCertificationStatus = "Certified" as const;
export const ChartMetricVisualizationPublicFreezeStatus = "Frozen" as const;
export const ChartMetricVisualizationPublicStabilityStatus = "Stable" as const;
export const ChartMetricVisualizationPublicReadinessStatus = "ReadyForConsumer" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "ChartMetricVisualizationPublicFoundation",
  "ChartMetricVisualizationPublicApiRegistry",
  "ChartMetricVisualizationPublicIndexId",
  "ChartMetricVisualizationPublicIndexVersion",
  "ChartMetricVisualizationPublicIndexName",
  "ChartMetricVisualizationPublicIndexNamespace",
  "ChartMetricVisualizationPublicReleaseStatus",
  "ChartMetricVisualizationPublicCertificationStatus",
  "ChartMetricVisualizationPublicFreezeStatus",
  "ChartMetricVisualizationPublicStabilityStatus",
  "ChartMetricVisualizationPublicReadinessStatus",
  "ChartMetricVisualizationPublicIndex",
] as const);

const freeze = ChartMetricVisualizationFreezePlatform;
const certification = freeze.certification;
const platform = certification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const upstreamPhaseSources = Object.freeze([
  Object.freeze({ section: "Foundation", identity: foundation.metadata,
    publicSurface: foundation }),
  Object.freeze({ section: "Registry", identity: registry.metadata,
    publicSurface: registry }),
  Object.freeze({ section: "Model", identity: model.metadata, publicSurface: model }),
  Object.freeze({ section: "Validation", identity: validation.metadata,
    publicSurface: validation }),
  Object.freeze({ section: "Manifest", identity: manifest.metadata,
    publicSurface: manifest }),
  Object.freeze({ section: "Platform", identity: platform.metadata,
    publicSurface: platform }),
  Object.freeze({ section: "Certification", identity: certification.metadata,
    publicSurface: certification }),
  Object.freeze({ section: "Freeze", identity: freeze.metadata, publicSurface: freeze }),
] as const);

const PublicIndexIdentity = Object.freeze({
  id: ChartMetricVisualizationPublicIndexId,
  name: ChartMetricVisualizationPublicIndexName,
  version: ChartMetricVisualizationPublicIndexVersion,
  namespace: ChartMetricVisualizationPublicIndexNamespace,
  layer: "EVE",
  phase: "EVE-5:9",
  release: ChartMetricVisualizationPublicReleaseStatus,
  certification: ChartMetricVisualizationPublicCertificationStatus,
  freeze: ChartMetricVisualizationPublicFreezeStatus,
  stability: ChartMetricVisualizationPublicStabilityStatus,
  readiness: ChartMetricVisualizationPublicReadinessStatus,
  metadataOnly: true,
  immutable: true,
} as const);

const upstreamNamespaceSections = Object.freeze(upstreamPhaseSources.map(
  (source, index) => Object.freeze({
    id: `EVE-5:9/Namespace/${source.section}` as const,
    name: source.section,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const PublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  Object.freeze({
    id: "EVE-5:9/Namespace/PublicIndex" as const,
    name: "Public Index",
    canonicalReference: ChartMetricVisualizationPublicIndexId,
    canonicalSource: PublicIndexIdentity,
    deterministicOrder: upstreamNamespaceSections.length + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  }),
]);

const upstreamApiEntries = Object.freeze(upstreamPhaseSources.flatMap(
  (source, phaseIndex) => Object.keys(source.publicSurface).map(
    (exportName, exportIndex) => Object.freeze({
      id: `EVE-5:9/PublicApi/${source.section}/${exportName}` as const,
      exportName,
      owningPhase: source.section,
      canonicalSourceReference: source.publicSurface,
      phaseOrder: phaseIndex + 1,
      exportOrder: exportIndex + 1,
      deterministicOrdinal: Object.freeze([phaseIndex + 1, exportIndex + 1] as const),
      preservedThroughFreeze: true,
      metadataOnly: true,
      immutable: true,
    })),
));

const publicIndexApiEntries = Object.freeze(PUBLIC_EXPORT_NAMES.map(
  (exportName, index) => Object.freeze({
    id: `EVE-5:9/PublicApi/PublicIndex/${exportName}` as const,
    exportName,
    owningPhase: "Public Index",
    canonicalSourceReference: PUBLIC_EXPORT_NAMES,
    phaseOrder: upstreamPhaseSources.length + 1,
    exportOrder: index + 1,
    deterministicOrdinal: Object.freeze([
      upstreamPhaseSources.length + 1, index + 1,
    ] as const),
    preservedThroughFreeze: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ChartMetricVisualizationPublicApiRegistry = Object.freeze([
  ...upstreamApiEntries,
  ...publicIndexApiEntries,
]);

const CanonicalInventoryRule = Object.freeze({
  consumesChartMetricVisualizationFreezeOnly: true,
  freezeCollectionsPreservedByReference: true,
  earlierPhasesReachableOnlyThroughFreeze: true,
  publicApiCountDerivedDynamically: true,
  deterministicOrdering: true,
  hardcodedPublicApiTotals: false,
  duplicatesFreezeMetadata: false,
  reconstructsUpstreamCollections: false,
  maintainsParallelUpstreamInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);

const PublicInventory = Object.freeze({
  namespaceSections: PublicNamespace,
  publicExports: PUBLIC_EXPORT_NAMES,
  publicApiRegistry: ChartMetricVisualizationPublicApiRegistry,
  freezeInventory: freeze.inventory,
  freezeLocks: freeze.locks,
  freezeBaselines: freeze.baselines,
  freezeRegistry: freeze.registry,
  freezeCompatibility: freeze.compatibility,
  freezeExtensions: freeze.extensions,
  consumerMetadata: Object.freeze({
    supportedEntryPoint: "chartMetricVisualizationPublicIndex.ts",
    entryPointCount: Object.freeze([
      "chartMetricVisualizationPublicIndex.ts",
    ] as const).length,
    metadataOnly: true,
    immutable: true,
  }),
  counts: Object.freeze({
    namespaceSectionCount: PublicNamespace.length,
    publicExportCount: PUBLIC_EXPORT_NAMES.length,
    publicApiCount: ChartMetricVisualizationPublicApiRegistry.length,
  }),
  canonicalInventoryRule: CanonicalInventoryRule,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ChartMetricVisualizationPublicIndex = Object.freeze({
  ...PublicIndexIdentity,
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  namespaceSections: PublicNamespace,
  publicApiRegistry: ChartMetricVisualizationPublicApiRegistry,
  inventory: PublicInventory,
  releaseMetadata: Object.freeze({
    release: ChartMetricVisualizationPublicReleaseStatus,
    certification: ChartMetricVisualizationPublicCertificationStatus,
    freeze: ChartMetricVisualizationPublicFreezeStatus,
    stability: ChartMetricVisualizationPublicStabilityStatus,
    readiness: ChartMetricVisualizationPublicReadinessStatus,
  }),
  dependency: Object.freeze({
    chartMetricVisualizationFreezeOnly: true,
    directModule: "chartMetricVisualizationFreeze.ts",
    directEarlierPhaseImports: false,
    directEveFourImports: false,
  }),
  soleConsumerEntryPoint: "chartMetricVisualizationPublicIndex.ts",
  calculation: false,
  aggregation: false,
  forecasting: false,
  rendering: false,
  dashboardExecution: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  deterministic: true,
} as const);

export const ChartMetricVisualizationPublicFoundation = Object.freeze({
  metadata: ChartMetricVisualizationPublicIndex,
  namespace: PublicNamespace,
  publicApiRegistry: ChartMetricVisualizationPublicApiRegistry,
  frozenArchitecture: freeze,
  freezeCollections: freeze.inventory,
  publicExports: PUBLIC_EXPORT_NAMES,
  inventory: PublicInventory,
  canonicalInventoryRule: CanonicalInventoryRule,
  soleConsumerEntryPoint: ChartMetricVisualizationPublicIndex.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
