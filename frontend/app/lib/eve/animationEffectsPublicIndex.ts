import { AnimationEffectsFreezePlatform } from "./animationEffectsFreeze.ts";

export const AnimationEffectsPublicIndexId =
  "EVE-7:9/AnimationEffectsPublicIndex" as const;
export const AnimationEffectsPublicIndexVersion = "1.0.0" as const;
export const AnimationEffectsPublicIndexName =
  "Animation & Effects Public Index" as const;
export const AnimationEffectsPublicIndexNamespace =
  "nexora.eve.animation-effects.public-index" as const;
export const AnimationEffectsPublicReleaseStatus = "Released" as const;
export const AnimationEffectsPublicCertificationStatus = "Certified" as const;
export const AnimationEffectsPublicFreezeStatus = "Frozen" as const;

const PUBLIC_EXPORT_NAMES = Object.freeze([
  "AnimationEffectsPlatformPublicFoundation",
  "AnimationEffectsPublicApiRegistry",
  "AnimationEffectsPublicIndexId",
  "AnimationEffectsPublicIndexVersion",
  "AnimationEffectsPublicIndexName",
  "AnimationEffectsPublicIndexNamespace",
  "AnimationEffectsPublicReleaseStatus",
  "AnimationEffectsPublicCertificationStatus",
  "AnimationEffectsPublicFreezeStatus",
  "getAnimationEffectsPublicSummary",
  "getAnimationEffectsPublicApiCount",
  "getAnimationEffectsPublicReleaseMetadata",
] as const);

const freeze = AnimationEffectsFreezePlatform;
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
    id: `EVE-7:9/Namespace/${source.name}` as const,
    name: source.name,
    canonicalReference: source.identity.id,
    canonicalSource: source.publicSurface,
    source: "AnimationEffectsFreeze",
    deterministicOrder: index + 1,
    preservedByReference: true,
    metadataOnly: true,
    immutable: true,
  })),
);

const publicIndexSection = Object.freeze({
  id: "EVE-7:9/Namespace/PublicIndex",
  name: "Public Index",
  canonicalReference: AnimationEffectsPublicIndexId,
  canonicalSource: PUBLIC_EXPORT_NAMES,
  source: "AnimationEffectsPublicIndex",
  deterministicOrder: upstreamNamespaceSections.length + 1,
  preservedByReference: true,
  metadataOnly: true,
  immutable: true,
} as const);

const AnimationEffectsPublicNamespace = Object.freeze([
  ...upstreamNamespaceSections,
  publicIndexSection,
]);

const upstreamApiEntries = Object.freeze(upstreamPhaseSources.flatMap(
  (source, phaseIndex) => Object.keys(source.publicSurface).map(
    (exportName, exportIndex) => Object.freeze({
      id: `EVE-7:9/PublicApi/${source.name}/${exportName}` as const,
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
    id: `EVE-7:9/PublicApi/PublicIndex/${exportName}` as const,
    exportName,
    owningPhase: "Public Index",
    phaseIdentity: AnimationEffectsPublicIndexId,
    namespace: AnimationEffectsPublicIndexNamespace,
    version: AnimationEffectsPublicIndexVersion,
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

export const AnimationEffectsPublicApiRegistry = Object.freeze({
  id: "EVE-7:9/AnimationEffectsPublicApiRegistry",
  entries: publicApiEntries,
  apiCount: publicApiEntries.length,
  namespaceSectionCount: AnimationEffectsPublicNamespace.length,
  frozenInventory: freeze.inventory,
  canonicalInventoryRule: Object.freeze({
    consumesAnimationEffectsFreezeOnly: true,
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

const AnimationEffectsPublicReleaseMetadata = Object.freeze({
  identity: Object.freeze({
    id: AnimationEffectsPublicIndexId,
    name: AnimationEffectsPublicIndexName,
    version: AnimationEffectsPublicIndexVersion,
    namespace: AnimationEffectsPublicIndexNamespace,
    layer: "EVE",
    phase: "EVE-7:9",
  }),
  release: AnimationEffectsPublicReleaseStatus,
  certification: AnimationEffectsPublicCertificationStatus,
  freeze: AnimationEffectsPublicFreezeStatus,
  stability: "Stable",
  readiness: "ReadyForConsumer",
  freezeReference: freeze.metadata.id,
  lockId: freeze.metadata.lockId,
  namespace: AnimationEffectsPublicNamespace,
  publicApiRegistry: AnimationEffectsPublicApiRegistry,
  certificationMetadata: freeze.certification.metadata,
  freezeMetadata: freeze.metadata,
  compatibility: freeze.compatibility,
  inventory: freeze.inventory,
  dependency: Object.freeze({
    animationEffectsFreezeOnly: true,
    directPreviousPhaseModule: "animationEffectsFreeze.ts",
    directCertificationImport: false,
    directPlatformImport: false,
    directManifestImport: false,
    directValidationImport: false,
    directModelImport: false,
    directRegistryImport: false,
    directFoundationImport: false,
    directSceneRenderingImport: false,
    directEveOneImport: false,
  }),
  soleConsumerEntryPoint: "animationEffectsPublicIndex.ts",
  supportedConsumerEntries: Object.freeze([
    "animationEffectsPublicIndex.ts",
  ] as const),
  animationExecution: false,
  scheduling: false,
  transitionExecution: false,
  timingExecution: false,
  rendering: false,
  frameGeneration: false,
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

export const AnimationEffectsPlatformPublicFoundation = Object.freeze({
  metadata: AnimationEffectsPublicReleaseMetadata,
  namespace: AnimationEffectsPublicNamespace,
  publicApiRegistry: AnimationEffectsPublicApiRegistry,
  frozenArchitecture: freeze,
  freezeCollections: freeze.inventory,
  publicExports: PUBLIC_EXPORT_NAMES,
  soleConsumerEntryPoint: "animationEffectsPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const AnimationEffectsPublicSummary = Object.freeze({
  ...AnimationEffectsPublicReleaseMetadata.identity,
  release: AnimationEffectsPublicReleaseMetadata.release,
  certification: AnimationEffectsPublicReleaseMetadata.certification,
  freeze: AnimationEffectsPublicReleaseMetadata.freeze,
  stability: AnimationEffectsPublicReleaseMetadata.stability,
  readiness: AnimationEffectsPublicReleaseMetadata.readiness,
  lockId: AnimationEffectsPublicReleaseMetadata.lockId,
  namespaceSectionCount: AnimationEffectsPublicNamespace.length,
  publicApiCount: AnimationEffectsPublicApiRegistry.apiCount,
  soleConsumerEntryPoint:
    AnimationEffectsPlatformPublicFoundation.soleConsumerEntryPoint,
  metadataOnly: true,
  immutable: true,
} as const);

export const getAnimationEffectsPublicSummary = () =>
  AnimationEffectsPublicSummary;
export const getAnimationEffectsPublicApiCount = () =>
  AnimationEffectsPublicApiRegistry.apiCount;
export const getAnimationEffectsPublicReleaseMetadata = () =>
  AnimationEffectsPublicReleaseMetadata;
