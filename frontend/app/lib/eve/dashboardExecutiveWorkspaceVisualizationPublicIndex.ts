import { DashboardExecutiveWorkspaceVisualizationFreezePlatform } from "./dashboardExecutiveWorkspaceVisualizationFreeze.ts";

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "DashboardExecutiveWorkspaceVisualizationPublicIndex",
  "dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity",
  "dashboardExecutiveWorkspaceVisualizationPublicIndexMetadata",
  "dashboardExecutiveWorkspaceVisualizationPublicIndexInventory",
  "dashboardExecutiveWorkspaceVisualizationPublicApiRegistry",
  "dashboardExecutiveWorkspaceVisualizationPublicApiCount",
  "dashboardExecutiveWorkspaceVisualizationNamespace",
  "dashboardExecutiveWorkspaceVisualizationReleaseMetadata",
  "dashboardExecutiveWorkspaceVisualizationReadiness",
  "dashboardExecutiveWorkspaceVisualizationConsumerEntry",
  "dashboardExecutiveWorkspaceVisualizationSummary",
  "dashboardExecutiveWorkspaceVisualizationStatus",
] as const);

const freeze = DashboardExecutiveWorkspaceVisualizationFreezePlatform;
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
  Object.freeze({ section: "Model", identity: model.metadata,
    publicSurface: model }),
  Object.freeze({ section: "Validation", identity: validation.metadata,
    publicSurface: validation }),
  Object.freeze({ section: "Manifest", identity: manifest.metadata,
    publicSurface: manifest }),
  Object.freeze({ section: "Platform", identity: platform.metadata,
    publicSurface: platform }),
  Object.freeze({ section: "Certification", identity: certification.metadata,
    publicSurface: certification }),
  Object.freeze({ section: "Freeze", identity: freeze.metadata,
    publicSurface: freeze }),
] as const);

export const dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity =
  Object.freeze({
    id: "EVE-6:9/DashboardExecutiveWorkspaceVisualizationPublicIndex",
    name: "Dashboard & Executive Workspace Visualization Public Index",
    version: "1.0.0",
    namespace:
      "nexora.eve.dashboard-executive-workspace-visualization.public-index",
    layer: "EVE",
    phase: "EVE-6:9",
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    metadataOnly: true,
    immutable: true,
  } as const);

const upstreamNamespaceSections = Object.freeze(upstreamPhaseSources.map(
  (source, index) => Object.freeze({
    id: `EVE-6:9/Namespace/${source.section}` as const,
    name: source.section,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

export const dashboardExecutiveWorkspaceVisualizationNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  Object.freeze({
    id: "EVE-6:9/Namespace/PublicIndex" as const,
    name: "Public Index",
    canonicalReference:
      dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity.id,
    canonicalSource: dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity,
    deterministicOrder: upstreamNamespaceSections.length + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  }),
]);

const upstreamApiEntries = Object.freeze(upstreamPhaseSources.flatMap(
  (source, phaseIndex) => Object.keys(source.publicSurface).map(
    (exportName, exportIndex) => Object.freeze({
      id: `EVE-6:9/PublicApi/${source.section}/${exportName}` as const,
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
    id: `EVE-6:9/PublicApi/PublicIndex/${exportName}` as const,
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

export const dashboardExecutiveWorkspaceVisualizationPublicApiRegistry =
  Object.freeze([...upstreamApiEntries, ...publicIndexApiEntries]);

export const dashboardExecutiveWorkspaceVisualizationPublicApiCount =
  dashboardExecutiveWorkspaceVisualizationPublicApiRegistry.length;

export const dashboardExecutiveWorkspaceVisualizationReadiness = Object.freeze({
  status: "ReadyForConsumer",
  freezeStatus: freeze.metadata.status,
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  metadataOnly: true,
  immutable: true,
} as const);

export const dashboardExecutiveWorkspaceVisualizationReleaseMetadata = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: dashboardExecutiveWorkspaceVisualizationReadiness.status,
  lockId: freeze.metadata.lockId,
} as const);

export const dashboardExecutiveWorkspaceVisualizationConsumerEntry = Object.freeze({
  supportedEntryPoint:
    "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts",
  entries: Object.freeze([
    "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);

const CanonicalInventoryRule = Object.freeze({
  consumesDashboardExecutiveWorkspaceVisualizationFreezeOnly: true,
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

export const dashboardExecutiveWorkspaceVisualizationPublicIndexInventory =
  Object.freeze({
    namespaceSections: dashboardExecutiveWorkspaceVisualizationNamespace,
    publicExports: PUBLIC_EXPORT_NAMES,
    publicApiRegistry:
      dashboardExecutiveWorkspaceVisualizationPublicApiRegistry,
    freezeInventory: freeze.inventory,
    freezeLocks: freeze.locks,
    freezeBaselines: freeze.baselines,
    freezeRegistry: freeze.registry,
    freezeCompatibility: freeze.compatibility,
    freezeExtensions: freeze.extensions,
    consumerMetadata: dashboardExecutiveWorkspaceVisualizationConsumerEntry,
    counts: Object.freeze({
      namespaceSectionCount:
        dashboardExecutiveWorkspaceVisualizationNamespace.length,
      publicExportCount: PUBLIC_EXPORT_NAMES.length,
      publicApiCount:
        dashboardExecutiveWorkspaceVisualizationPublicApiRegistry.length,
    }),
    canonicalInventoryRule: CanonicalInventoryRule,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const dashboardExecutiveWorkspaceVisualizationPublicIndexMetadata =
  Object.freeze({
    ...dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity,
    status: dashboardExecutiveWorkspaceVisualizationReleaseMetadata,
    readiness: dashboardExecutiveWorkspaceVisualizationReadiness,
    freezeReference: freeze.metadata.id,
    lockId: freeze.metadata.lockId,
    dependency: Object.freeze({
      dashboardExecutiveWorkspaceVisualizationFreezeOnly: true,
      directModule: "dashboardExecutiveWorkspaceVisualizationFreeze.ts",
      directEarlierPhaseImports: false,
      directEveFiveImports: false,
    }),
    soleConsumerEntryPoint:
      dashboardExecutiveWorkspaceVisualizationConsumerEntry.supportedEntryPoint,
    dashboardRuntime: false,
    widgetRuntime: false,
    layoutEngine: false,
    rendering: false,
    navigationRuntime: false,
    networking: false,
    persistence: false,
    services: false,
    factories: false,
    runtimeExecution: false,
    deterministic: true,
  } as const);

export const dashboardExecutiveWorkspaceVisualizationStatus = Object.freeze({
  release: dashboardExecutiveWorkspaceVisualizationReleaseMetadata.release,
  certification:
    dashboardExecutiveWorkspaceVisualizationReleaseMetadata.certification,
  freeze: dashboardExecutiveWorkspaceVisualizationReleaseMetadata.freeze,
  stability: dashboardExecutiveWorkspaceVisualizationReleaseMetadata.stability,
  readiness: dashboardExecutiveWorkspaceVisualizationReadiness.status,
} as const);

export const dashboardExecutiveWorkspaceVisualizationSummary = Object.freeze({
  identity: dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity,
  status: dashboardExecutiveWorkspaceVisualizationStatus,
  readiness: dashboardExecutiveWorkspaceVisualizationReadiness,
  inventory: dashboardExecutiveWorkspaceVisualizationPublicIndexInventory,
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  metadataOnly: true,
  immutable: true,
} as const);

export const DashboardExecutiveWorkspaceVisualizationPublicIndex = Object.freeze({
  metadata: dashboardExecutiveWorkspaceVisualizationPublicIndexMetadata,
  identity: dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity,
  inventory: dashboardExecutiveWorkspaceVisualizationPublicIndexInventory,
  namespace: dashboardExecutiveWorkspaceVisualizationNamespace,
  publicApiRegistry:
    dashboardExecutiveWorkspaceVisualizationPublicApiRegistry,
  publicApiCount: dashboardExecutiveWorkspaceVisualizationPublicApiCount,
  release: dashboardExecutiveWorkspaceVisualizationReleaseMetadata,
  readiness: dashboardExecutiveWorkspaceVisualizationReadiness,
  consumerEntry: dashboardExecutiveWorkspaceVisualizationConsumerEntry,
  summary: dashboardExecutiveWorkspaceVisualizationSummary,
  status: dashboardExecutiveWorkspaceVisualizationStatus,
  frozenArchitecture: freeze,
  freezeCollections: freeze.inventory,
  publicExports: PUBLIC_EXPORT_NAMES,
  canonicalInventoryRule: CanonicalInventoryRule,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
