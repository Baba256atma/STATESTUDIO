import { SceneRenderingFreeze } from "./sceneRenderingFreeze.ts";

export const SceneRenderingPublicIndexId = "EVE-2:9/SceneRenderingPublicIndex" as const;
export const SceneRenderingPublicIndexVersion = "1.0.0" as const;
export const SceneRenderingPublicIndexName = "Scene Rendering Public Index" as const;
export const SceneRenderingPublicIndexNamespace =
  "nexora.eve.scene-rendering.public-index" as const;
export const SceneRenderingPublicReleaseStatus = "Released" as const;
export const SceneRenderingPublicCertificationStatus = "Certified" as const;
export const SceneRenderingPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "SceneRenderingPlatformPublicFoundation",
  "SceneRenderingPublicApiRegistry",
  "SceneRenderingPublicIndexId",
  "SceneRenderingPublicIndexVersion",
  "SceneRenderingPublicIndexName",
  "SceneRenderingPublicIndexNamespace",
  "SceneRenderingPublicReleaseStatus",
  "SceneRenderingPublicCertificationStatus",
  "SceneRenderingPublicFreezeStatus",
  "getSceneRenderingPublicSummary",
  "getSceneRenderingPublicApiCount",
  "getSceneRenderingPublicReleaseMetadata",
] as const);

const certification = SceneRenderingFreeze.certification;
const platform = certification.platform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const upstreamPhaseSources = Object.freeze([
  Object.freeze({ name: "Foundation", identity: foundation.identity, publicSurface: foundation }),
  Object.freeze({ name: "Registry", identity: registry.metadata, publicSurface: registry }),
  Object.freeze({ name: "Model", identity: model.metadata, publicSurface: model }),
  Object.freeze({ name: "Validation", identity: validation.metadata, publicSurface: validation }),
  Object.freeze({ name: "Manifest", identity: manifest.metadata, publicSurface: manifest }),
  Object.freeze({ name: "Platform", identity: platform.metadata, publicSurface: platform }),
  Object.freeze({ name: "Certification", identity: certification.metadata, publicSurface: certification }),
  Object.freeze({ name: "Freeze", identity: SceneRenderingFreeze.identity, publicSurface: SceneRenderingFreeze }),
] as const);

const upstreamNamespaceSections = Object.freeze(
  upstreamPhaseSources.map((source, index) => Object.freeze({
    id: `EVE-2:9/Namespace/${source.name}`,
    name: source.name,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    source: "SceneRenderingFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicIndexSection = Object.freeze({
  id: "EVE-2:9/Namespace/PublicIndex",
  name: "Public Index",
  canonicalReference: SceneRenderingPublicIndexId,
  canonicalSource: PUBLIC_EXPORT_NAMES,
  source: "SceneRenderingPublicIndex",
  deterministicOrder: upstreamNamespaceSections.length + 1,
  preservedByReference: true,
  metadataOnly: true,
  immutable: true,
});

const SceneRenderingPublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  publicIndexSection,
]);

const upstreamApiEntries = Object.freeze(
  upstreamPhaseSources.flatMap((source, phaseIndex) =>
    Object.keys(source.publicSurface).map((exportName, exportIndex) => Object.freeze({
      id: `EVE-2:9/PublicApi/${source.name}/${exportName}`,
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
      deterministicOrdinal: Object.freeze([phaseIndex + 1, exportIndex + 1]),
      derivedFromFreeze: true,
      metadataOnly: true,
      immutable: true,
    }))),
);

const publicIndexApiEntries = Object.freeze(
  PUBLIC_EXPORT_NAMES.map((exportName, index) => Object.freeze({
    id: `EVE-2:9/PublicApi/PublicIndex/${exportName}`,
    exportName,
    owningPhase: "Public Index",
    phaseIdentity: SceneRenderingPublicIndexId,
    namespace: SceneRenderingPublicIndexNamespace,
    version: SceneRenderingPublicIndexVersion,
    stability: "Stable",
    publicStatus: "Published",
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

export const SceneRenderingPublicApiRegistry = Object.freeze({
  id: "EVE-2:9/SceneRenderingPublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.length,
  namespaceSectionCount: SceneRenderingPublicNamespace.length,
  frozenInventory: SceneRenderingFreeze.inventory,
  canonicalInventoryRule: Object.freeze({
    derivedFromFreezeReachablePublicSurfaces: true,
    ownContributionDerivedFromActualExports: true,
    hardcodedApiTotals: false,
    hardcodedUpstreamPhaseCounts: false,
    recalculatesUpstreamInventories: false,
    duplicatesUpstreamMetadata: false,
    modifiesFrozenArchitecture: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const SceneRenderingPublicReleaseMetadata = Object.freeze({
  identity: Object.freeze({
    id: SceneRenderingPublicIndexId,
    name: SceneRenderingPublicIndexName,
    version: SceneRenderingPublicIndexVersion,
    namespace: SceneRenderingPublicIndexNamespace,
    layer: "EVE",
    phase: "EVE-2:9",
  }),
  release: SceneRenderingPublicReleaseStatus,
  certification: SceneRenderingPublicCertificationStatus,
  freeze: SceneRenderingPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  freezeReference: SceneRenderingFreeze.identity.id,
  lockId: SceneRenderingFreeze.identity.lockId,
  namespace: SceneRenderingPublicNamespace,
  publicApiRegistry: SceneRenderingPublicApiRegistry,
  certificationMetadata: SceneRenderingFreeze.certification.metadata,
  freezeMetadata: SceneRenderingFreeze.metadata,
  compatibility: SceneRenderingFreeze.compatibility,
  inventory: SceneRenderingFreeze.inventory,
  dependency: Object.freeze({
    sceneRenderingFreezeOnly: true,
    directPreviousPhaseModule: "sceneRenderingFreeze.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directManifestImport: false,
    directPlatformImport: false,
    directCertificationImport: false,
    directEveOneImport: false,
  }),
  execution: false,
  renderingRuntime: false,
  sceneExecution: false,
  frameGeneration: false,
  orchestration: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const SceneRenderingPlatformPublicFoundation = Object.freeze({
  metadata: SceneRenderingPublicReleaseMetadata,
  namespace: SceneRenderingPublicNamespace,
  publicApiRegistry: SceneRenderingPublicApiRegistry,
  frozenArchitecture: SceneRenderingFreeze,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: "sceneRenderingPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const SceneRenderingPublicSummary = Object.freeze({
  ...SceneRenderingPublicReleaseMetadata.identity,
  release: SceneRenderingPublicReleaseMetadata.release,
  certification: SceneRenderingPublicReleaseMetadata.certification,
  freeze: SceneRenderingPublicReleaseMetadata.freeze,
  stability: SceneRenderingPublicReleaseMetadata.stability,
  readiness: SceneRenderingPublicReleaseMetadata.readiness,
  lockId: SceneRenderingPublicReleaseMetadata.lockId,
  namespaceSectionCount: SceneRenderingPublicNamespace.length,
  publicApiCount: SceneRenderingPublicApiRegistry.apiCount,
  soleConsumerEntryPoint: SceneRenderingPlatformPublicFoundation.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
} as const);

export const getSceneRenderingPublicSummary = () => SceneRenderingPublicSummary;
export const getSceneRenderingPublicApiCount = () => SceneRenderingPublicApiRegistry.apiCount;
export const getSceneRenderingPublicReleaseMetadata = () => SceneRenderingPublicReleaseMetadata;
