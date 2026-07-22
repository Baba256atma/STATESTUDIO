import { TimelineVisualizationFreezePlatform } from "./timelineVisualizationFreeze.ts";

export const TimelineVisualizationPublicIndexId =
  "EVE-4:9/TimelineVisualizationPublicIndex" as const;
export const TimelineVisualizationPublicIndexVersion = "1.0.0" as const;
export const TimelineVisualizationPublicIndexName =
  "Timeline & Temporal Visualization Public Index" as const;
export const TimelineVisualizationPublicIndexNamespace =
  "nexora.eve.timeline-visualization.public-index" as const;
export const TimelineVisualizationPublicReleaseStatus = "Released" as const;
export const TimelineVisualizationPublicCertificationStatus = "Certified" as const;
export const TimelineVisualizationPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "TimelineVisualizationPlatformPublicFoundation",
  "TimelineVisualizationPublicApiRegistry",
  "TimelineVisualizationPublicIndexId",
  "TimelineVisualizationPublicIndexVersion",
  "TimelineVisualizationPublicIndexName",
  "TimelineVisualizationPublicIndexNamespace",
  "TimelineVisualizationPublicReleaseStatus",
  "TimelineVisualizationPublicCertificationStatus",
  "TimelineVisualizationPublicFreezeStatus",
  "getTimelineVisualizationPublicSummary",
  "getTimelineVisualizationPublicApiCount",
  "getTimelineVisualizationPublicReleaseMetadata",
] as const);

const freeze = TimelineVisualizationFreezePlatform;
const certification = freeze.certification;
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
  Object.freeze({ section: "certification", identity: certification.metadata,
    publicSurface: certification }),
  Object.freeze({ section: "freeze", identity: freeze.metadata, publicSurface: freeze }),
] as const);

const PublicIndexOwnedReleaseIdentity = Object.freeze({
  id: TimelineVisualizationPublicIndexId,
  name: TimelineVisualizationPublicIndexName,
  version: TimelineVisualizationPublicIndexVersion,
  namespace: TimelineVisualizationPublicIndexNamespace,
  layer: "EVE",
  phase: "EVE-4:9",
  release: TimelineVisualizationPublicReleaseStatus,
  certification: TimelineVisualizationPublicCertificationStatus,
  freeze: TimelineVisualizationPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

const upstreamNamespaceSections = Object.freeze(
  upstreamPhaseSources.map((source, index) => Object.freeze({
    id: `EVE-4:9/Namespace/${source.section}`,
    name: source.section,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    source: "TimelineVisualizationFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const TimelineVisualizationPublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  Object.freeze({
    id: "EVE-4:9/Namespace/publicIndex",
    name: "publicIndex",
    canonicalReference: TimelineVisualizationPublicIndexId,
    canonicalSource: PublicIndexOwnedReleaseIdentity,
    source: "TimelineVisualizationPublicIndex",
    deterministicOrder: upstreamNamespaceSections.length + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  }),
]);

const upstreamApiEntries = Object.freeze(
  upstreamPhaseSources.flatMap((source, phaseIndex) =>
    Object.keys(source.publicSurface).map((exportName, exportIndex) => Object.freeze({
      id: `EVE-4:9/PublicApi/${source.section}/${exportName}`,
      exportName,
      owningPhase: source.section,
      namespace: source.identity.namespace,
      version: source.identity.version,
      publicStatus: "Published",
      stability: "Stable",
      canonicalSourceReference: source.publicSurface,
      phaseOrder: phaseIndex + 1,
      exportOrder: exportIndex + 1,
      deterministicOrdinal: Object.freeze([phaseIndex + 1, exportIndex + 1]),
      derivedThroughFreeze: true,
      metadataOnly: true,
      immutable: true,
    }))),
);

const publicIndexApiEntries = Object.freeze(
  PUBLIC_EXPORT_NAMES.map((exportName, index) => Object.freeze({
    id: `EVE-4:9/PublicApi/publicIndex/${exportName}`,
    exportName,
    owningPhase: "publicIndex",
    namespace: TimelineVisualizationPublicIndexNamespace,
    version: TimelineVisualizationPublicIndexVersion,
    publicStatus: "Published",
    stability: "Stable",
    canonicalSourceReference: PUBLIC_EXPORT_NAMES,
    phaseOrder: upstreamPhaseSources.length + 1,
    exportOrder: index + 1,
    deterministicOrdinal: Object.freeze([upstreamPhaseSources.length + 1, index + 1]),
    derivedThroughFreeze: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const TimelineVisualizationPublicApiRegistry = Object.freeze([
  ...upstreamApiEntries,
  ...publicIndexApiEntries,
]);

const CanonicalInventoryRuleMetadata = Object.freeze({
  derivedFromFreezeReachablePublicSurfaces: true,
  ownContributionDerivedFromActualExports: true,
  hardcodedApiTotals: false,
  reconstructsUpstreamInventories: false,
  duplicatesUpstreamMetadata: false,
  modifiesFrozenArchitecture: false,
} as const);

const TimelineVisualizationPublicReleaseMetadata = Object.freeze({
  ...PublicIndexOwnedReleaseIdentity,
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  namespaceSections: TimelineVisualizationPublicNamespace,
  publicApiRegistry: TimelineVisualizationPublicApiRegistry,
  certificationMetadata: certification.metadata,
  freezeMetadata: freeze.metadata,
  frozenInventory: freeze.inventory,
  canonicalInventoryRule: CanonicalInventoryRuleMetadata,
  dependency: Object.freeze({
    timelineVisualizationFreezeOnly: true,
    directPreviousPhaseModule: "timelineVisualizationFreeze.ts",
    directCertificationImport: false,
    directPlatformImport: false,
    directManifestImport: false,
    directValidationImport: false,
    directModelImport: false,
    directRegistryImport: false,
    directFoundationImport: false,
    directGraphVisualizationImport: false,
    directEveThreeImports: false,
  }),
  soleConsumerEntryPoint: "frontend/app/lib/eve/timelineVisualizationPublicIndex.ts",
  execution: false,
  playback: false,
  animation: false,
  scheduling: false,
  rendering: false,
  simulation: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const TimelineVisualizationPlatformPublicFoundation = Object.freeze({
  metadata: TimelineVisualizationPublicReleaseMetadata,
  namespace: TimelineVisualizationPublicNamespace,
  publicApiRegistry: TimelineVisualizationPublicApiRegistry,
  frozenArchitecture: freeze,
  publicExports: PUBLIC_EXPORT_NAMES,
  canonicalInventoryRule: CanonicalInventoryRuleMetadata,
  soleConsumerEntryPoint: TimelineVisualizationPublicReleaseMetadata.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const TimelineVisualizationPublicSummary = Object.freeze({
  identity: PublicIndexOwnedReleaseIdentity,
  release: TimelineVisualizationPublicReleaseStatus,
  certification: TimelineVisualizationPublicCertificationStatus,
  freeze: TimelineVisualizationPublicFreezeStatus,
  stability: TimelineVisualizationPublicReleaseMetadata.stability,
  readiness: TimelineVisualizationPublicReleaseMetadata.readiness,
  namespaceSectionCount: TimelineVisualizationPublicNamespace.length,
  publicApiCount: TimelineVisualizationPublicApiRegistry.length,
  lockId: freeze.metadata.lockId,
  soleConsumerEntryPoint: TimelineVisualizationPublicReleaseMetadata.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
} as const);

export const getTimelineVisualizationPublicSummary = () =>
  TimelineVisualizationPublicSummary;
export const getTimelineVisualizationPublicApiCount = () =>
  TimelineVisualizationPublicApiRegistry.length;
export const getTimelineVisualizationPublicReleaseMetadata = () =>
  TimelineVisualizationPublicReleaseMetadata;
