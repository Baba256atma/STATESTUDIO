import { VisualizationSuiteFreezePlatform } from "./visualizationSuiteFreeze.ts";

export const VisualizationSuitePublicIndexId =
  "EVE-9:9/VisualizationSuitePublicIndex" as const;
export const VisualizationSuitePublicIndexVersion = "1.0.0" as const;
export const VisualizationSuitePublicIndexName =
  "Visualization Suite Public Index" as const;
export const VisualizationSuitePublicIndexNamespace =
  "nexora.eve.visualization-suite.public-index" as const;
export const VisualizationSuitePublicReleaseStatus = "Released" as const;
export const VisualizationSuitePublicCertificationStatus = "Certified" as const;
export const VisualizationSuitePublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "VisualizationSuitePublicFoundation",
  "VisualizationSuitePublicApiRegistry",
  "VisualizationSuitePublicIndexId",
  "VisualizationSuitePublicIndexVersion",
  "VisualizationSuitePublicIndexName",
  "VisualizationSuitePublicIndexNamespace",
  "VisualizationSuitePublicReleaseStatus",
  "VisualizationSuitePublicCertificationStatus",
  "VisualizationSuitePublicFreezeStatus",
  "getVisualizationSuitePublicSummary",
  "getVisualizationSuitePublicApiCount",
  "getVisualizationSuitePublicReleaseMetadata",
] as const);

const freeze = VisualizationSuiteFreezePlatform;
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
    id: `EVE-9:9/Namespace/${source.name}` as const,
    name: source.name,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    source: "VisualizationSuiteFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicIndexSection = Object.freeze({
  id: "EVE-9:9/Namespace/PublicIndex",
  name: "Public Index",
  canonicalReference: VisualizationSuitePublicIndexId,
  canonicalSource: PUBLIC_EXPORT_NAMES,
  source: "VisualizationSuitePublicIndex",
  deterministicOrder: upstreamNamespaceSections.length + 1,
  preservedByReference: true,
  metadataOnly: true,
  immutable: true,
} as const);

const VisualizationSuitePublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  publicIndexSection,
]);

const upstreamApiEntries = Object.freeze(upstreamPhaseSources.flatMap(
  (source, phaseIndex) => Object.keys(source.publicSurface).map(
    (exportName, exportIndex) => Object.freeze({
      id: `EVE-9:9/PublicApi/${source.name}/${exportName}` as const,
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
    id: `EVE-9:9/PublicApi/PublicIndex/${exportName}` as const,
    exportName,
    owningPhase: "Public Index",
    phaseIdentity: VisualizationSuitePublicIndexId,
    namespace: VisualizationSuitePublicIndexNamespace,
    version: VisualizationSuitePublicIndexVersion,
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

export const VisualizationSuitePublicApiRegistry = Object.freeze({
  id: "EVE-9:9/VisualizationSuitePublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.length,
  namespaceSectionCount: VisualizationSuitePublicNamespace.length,
  frozenInventory: freeze.inventory,
  canonicalInventoryRule: Object.freeze({
    consumesVisualizationSuiteFreezeOnly: true,
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

const VisualizationSuitePublicReleaseMetadata = Object.freeze({
  identity: Object.freeze({
    id: VisualizationSuitePublicIndexId,
    name: VisualizationSuitePublicIndexName,
    version: VisualizationSuitePublicIndexVersion,
    namespace: VisualizationSuitePublicIndexNamespace,
    layer: "EVE",
    phase: "EVE-9:9",
  }),
  release: VisualizationSuitePublicReleaseStatus,
  certification: VisualizationSuitePublicCertificationStatus,
  freeze: VisualizationSuitePublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  namespace: VisualizationSuitePublicNamespace,
  publicApiRegistry: VisualizationSuitePublicApiRegistry,
  certificationMetadata: freeze.certification.metadata,
  freezeMetadata: freeze.metadata,
  compatibility: freeze.compatibility,
  inventory: freeze.inventory,
  dependency: Object.freeze({
    visualizationSuiteFreezeOnly: true,
    directPreviousPhaseModule: "visualizationSuiteFreeze.ts",
    directCertificationImport: false,
    directPlatformImport: false,
    directManifestImport: false,
    directValidationImport: false,
    directModelImport: false,
    directRegistryImport: false,
    directFoundationImport: false,
    directEveOneThroughEightImport: false,
  }),
  ownership: Object.freeze({
    owns: Object.freeze(["Consumer-facing namespace", "Public API Registry",
      "Public release metadata", "Public readiness metadata",
      "Sole consumer entry declaration"]),
    doesNotOwn: Object.freeze(["Rendering execution",
      "Visualization orchestration", "Runtime validation",
      "Runtime certification", "Runtime freeze management", "Graph execution",
      "Timeline execution", "Dashboard rendering", "Animation runtime",
      "UI implementation", "Director orchestration", "Advisor logic",
      "Executive reasoning", "Business Objects", "Networking", "Persistence"]),
  }),
  soleConsumerEntryPoint: "visualizationSuitePublicIndex.ts",
  supportedConsumerEntries: Object.freeze([
    "visualizationSuitePublicIndex.ts",
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

export const VisualizationSuitePublicFoundation = Object.freeze({
  metadata: VisualizationSuitePublicReleaseMetadata,
  namespace: VisualizationSuitePublicNamespace,
  publicApiRegistry: VisualizationSuitePublicApiRegistry,
  frozenArchitecture: freeze,
  freezeCollections: freeze.inventory,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: "visualizationSuitePublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const VisualizationSuitePublicSummary = Object.freeze({
  ...VisualizationSuitePublicReleaseMetadata.identity,
  release: VisualizationSuitePublicReleaseMetadata.release,
  certification: VisualizationSuitePublicReleaseMetadata.certification,
  freeze: VisualizationSuitePublicReleaseMetadata.freeze,
  stability: VisualizationSuitePublicReleaseMetadata.stability,
  readiness: VisualizationSuitePublicReleaseMetadata.readiness,
  lockId: VisualizationSuitePublicReleaseMetadata.lockId,
  namespaceSectionCount: VisualizationSuitePublicNamespace.length,
  publicApiCount: VisualizationSuitePublicApiRegistry.apiCount,
  soleConsumerEntryPoint:
    VisualizationSuitePublicFoundation.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuitePublicSummary = () =>
  VisualizationSuitePublicSummary;
export const getVisualizationSuitePublicApiCount = () =>
  VisualizationSuitePublicApiRegistry.apiCount;
export const getVisualizationSuitePublicReleaseMetadata = () =>
  VisualizationSuitePublicReleaseMetadata;
