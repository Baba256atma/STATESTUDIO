/**
 * NEA-5:9 — Gateway Routing Public Index.
 *
 * Sole supported public release surface for Gateway Routing (NEA-5).
 * Consumes only GatewayRoutingFreezePlatform. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by NEA-5:9.
 *
 * Public exports (exactly 12):
 *   GatewayRoutingPlatformPublicFoundation
 *   GatewayRoutingPublicApiRegistry
 *   GatewayRoutingPublicIndexId
 *   GatewayRoutingPublicIndexVersion
 *   GatewayRoutingPublicIndexName
 *   GatewayRoutingPublicIndexNamespace
 *   GatewayRoutingPublicReleaseStatus
 *   GatewayRoutingPublicCertificationStatus
 *   GatewayRoutingPublicFreezeStatus
 *   getGatewayRoutingPublicSummary()
 *   getGatewayRoutingPublicApiCount()
 *   getGatewayRoutingPublicReleaseMetadata()
 *
 * Future consumers must import only gatewayRoutingPublicIndex.ts.
 */

import { GatewayRoutingFreezePlatform } from "./gatewayRoutingFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type GatewayRoutingPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type GatewayRoutingPublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: GatewayRoutingPublicApiKind;
  version: string;
  status: "Released";
  stability: "Stable";
  sourceReference: string;
  public: true;
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  upstreamApiId: string;
  deterministicOrder: number;
}>;

type GatewayRoutingReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through NEA-5:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = GatewayRoutingFreezePlatform;
const certification = freeze.certification;
const platform = certification.platform;
const ns = platform.namespace;
const foundation = ns.foundation;
const registry = ns.registry;
const model = ns.model;
const validation = ns.validation;
const manifest = ns.manifest;

const foundationApis = foundation.apiRegistry;
const registryApis = registry.apiRegistry;
const modelApis = model.apiRegistry;
const validationApis = validation.apiRegistry;
const manifestApis = manifest.apiRegistry;
const platformApis = platform.apiRegistry;
const certificationApis = certification.apiRegistry;
const freezeApis = freeze.apiRegistry;

const chainIds = Object.freeze({
  freezeId: freeze.identity.freezeId,
  freezeVersion: freeze.identity.freezeVersion,
  certificationId: certification.identity.certificationId,
  platformId: platform.identity.platformId,
  manifestId: ns.manifest.identity.manifestId,
  validationId: ns.validation.identity.validationId,
  modelId: ns.model.identity.modelId,
  registryId: ns.registry.identity.registryId,
  foundationId: ns.foundation.identity.foundationId,
  routeIdentityCount: registry.collections.routeIdentityCount,
  domainModelCount: model.domainModels.modelCount,
});

// --------------------------------------------------------------------------
// Public Index identity and release constants.
// --------------------------------------------------------------------------

export const GatewayRoutingPublicIndexId =
  "NEA-5:9/GatewayRoutingPublicIndex" as const;

export const GatewayRoutingPublicIndexVersion = "1.0.0" as const;

export const GatewayRoutingPublicIndexName =
  "Gateway Routing Public Index" as const;

export const GatewayRoutingPublicIndexNamespace =
  "nexora.nea.gateway-routing.public-index" as const;

export const GatewayRoutingPublicReleaseStatus = "Released" as const;

export const GatewayRoutingPublicCertificationStatus = "Certified" as const;

export const GatewayRoutingPublicFreezeStatus = "Frozen" as const;

const GatewayRoutingPublicStabilityStatus = "Stable" as const;
const GatewayRoutingPublicArchitectureStatus = "Complete" as const;
const GatewayRoutingPublicConsumerReadiness = "ReadyForConsumer" as const;
const GatewayRoutingPublicNextPhaseReadiness = "NEA-5 Complete" as const;
const GatewayRoutingPublicArchitectureVersion = "NEA-5.0.0" as const;

const PUBLIC_INDEX_API_NAMES = Object.freeze([
  "GatewayRoutingPlatformPublicFoundation",
  "GatewayRoutingPublicApiRegistry",
  "GatewayRoutingPublicIndexId",
  "GatewayRoutingPublicIndexVersion",
  "GatewayRoutingPublicIndexName",
  "GatewayRoutingPublicIndexNamespace",
  "GatewayRoutingPublicReleaseStatus",
  "GatewayRoutingPublicCertificationStatus",
  "GatewayRoutingPublicFreezeStatus",
  "getGatewayRoutingPublicSummary",
  "getGatewayRoutingPublicApiCount",
  "getGatewayRoutingPublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "NEA-5:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "gatewayRoutingFoundation.ts",
  }),
  "NEA-5:2": Object.freeze({
    section: "Registry",
    version: registry.identity.registryVersion,
    sourceReference: "gatewayRoutingRegistry.ts",
  }),
  "NEA-5:3": Object.freeze({
    section: "Model",
    version: model.identity.modelVersion,
    sourceReference: "gatewayRoutingModel.ts",
  }),
  "NEA-5:4": Object.freeze({
    section: "Validation",
    version: validation.identity.validationVersion,
    sourceReference: "gatewayRoutingValidation.ts",
  }),
  "NEA-5:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.manifestVersion,
    sourceReference: "gatewayRoutingManifest.ts",
  }),
  "NEA-5:6": Object.freeze({
    section: "Platform",
    version: platform.identity.platformVersion,
    sourceReference: "gatewayRoutingPlatform.ts",
  }),
  "NEA-5:7": Object.freeze({
    section: "Certification",
    version: certification.identity.certificationVersion,
    sourceReference: "gatewayRoutingCertification.ts",
  }),
  "NEA-5:8": Object.freeze({
    section: "Freeze",
    version: freeze.identity.freezeVersion,
    sourceReference: "gatewayRoutingFreeze.ts",
  }),
  "NEA-5:9": Object.freeze({
    section: "PublicIndex",
    version: GatewayRoutingPublicIndexVersion,
    sourceReference: "gatewayRoutingPublicIndex.ts",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

type UpstreamApiSource = Readonly<{
  exportName: string;
  id?: string;
  apiId?: string;
  kind?: GatewayRoutingPublicApiKind;
  version?: string;
  sourceReference?: string;
}>;

const classify = (exportName: string): GatewayRoutingPublicApiKind => {
  if (exportName.startsWith("get")) {
    return "Helper";
  }
  if (
    exportName.endsWith("Id") ||
    exportName.endsWith("Name") ||
    exportName.endsWith("Version") ||
    exportName.endsWith("Namespace")
  ) {
    return "IdentityConstant";
  }
  if (
    exportName.endsWith("Status") ||
    exportName.endsWith("Readiness") ||
    exportName.endsWith("Registry")
  ) {
    return "MetadataConstant";
  }
  return "Aggregate";
};

const publicApiEntry = (
  phase: PhaseKey,
  source: UpstreamApiSource | string,
  order: number,
): GatewayRoutingPublicApiEntry => {
  const meta = PHASE_META[phase];
  const exportName = typeof source === "string" ? source : source.exportName;
  const kind =
    typeof source === "string"
      ? classify(exportName)
      : (source.kind ?? classify(exportName));
  const upstreamApiId =
    typeof source === "string"
      ? `NEA-5:9/OwnedApi/${exportName}`
      : (source.id ?? source.apiId ?? `NEA-5:9/OwnedApi/${exportName}`);
  return Object.freeze({
    id: `NEA-5:9/PublicApi/${phase}/${exportName}`,
    exportName,
    phase,
    section: meta.section,
    kind,
    version:
      typeof source === "string"
        ? meta.version
        : (source.version ?? meta.version),
    status: "Released" as const,
    stability: "Stable" as const,
    sourceReference:
      typeof source === "string"
        ? meta.sourceReference
        : (source.sourceReference ?? meta.sourceReference),
    public: true as const,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    upstreamApiId,
    deterministicOrder: order,
  });
};

const phaseEntries = (
  phase: PhaseKey,
  sources: readonly UpstreamApiSource[] | readonly string[],
  startOrder: number,
): readonly GatewayRoutingPublicApiEntry[] =>
  Object.freeze(
    sources.map((source, index) =>
      publicApiEntry(phase, source, startOrder + index),
    ),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries("NEA-5:1", foundationApis, nextOrder);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("NEA-5:2", registryApis, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("NEA-5:3", modelApis, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("NEA-5:4", validationApis, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("NEA-5:5", manifestApis, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("NEA-5:6", platformApis, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "NEA-5:7",
  certificationApis,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("NEA-5:8", freezeApis, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "NEA-5:9",
  PUBLIC_INDEX_API_NAMES,
  nextOrder,
);

/**
 * Architectural boundary for GatewayRoutingPublicApiRegistry.
 * Metadata only — not a top-level public export (preserves exactly 12).
 */
const GATEWAY_ROUTING_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE = Object.freeze({
  ownership: "Owns only the canonical public release surface of NEA-5.",
  prohibition:
    "Must never flatten, duplicate, reconstruct, or republish upstream phase architecture outside canonical Freeze references.",
  access:
    "Prior NEA-5 phases remain available exclusively through canonical references preserved by GatewayRoutingFreezePlatform.",
  principles: Object.freeze([
    "Sole Public Entry Point",
    "Canonical Reference Preservation",
    "Canonical Inventory Rule",
    "No Reconstruction Rule",
  ] as const),
} as const);

/**
 * Canonical immutable Public API registry for the NEA-5 public release surface.
 *
 * Registers Foundation through Public Index top-level exports exactly once,
 * derived through Freeze-reachable stage registries. No reconstructed inventories.
 */
export const GatewayRoutingPublicApiRegistry: readonly GatewayRoutingPublicApiEntry[] =
  Object.freeze([
    ...foundationEntries,
    ...registryEntries,
    ...modelEntries,
    ...validationEntries,
    ...manifestEntries,
    ...platformEntries,
    ...certificationEntries,
    ...freezeEntries,
    ...publicIndexEntries,
  ]);

const guarantee = (
  order: number,
  statement: string,
): GatewayRoutingReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `NEA-5:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Exactly seventeen release guarantees. */
const RELEASE_GUARANTEES: readonly GatewayRoutingReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform namespace."),
    guarantee(5, "Validation is reached only through Platform namespace."),
    guarantee(6, "Model is reached only through Platform namespace."),
    guarantee(7, "Registry is reached only through Platform namespace."),
    guarantee(8, "Foundation is reached only through Platform namespace."),
    guarantee(9, "All nine NEA-5 phases are published through one namespace."),
    guarantee(10, "All prior phases remain preserved by canonical reference."),
    guarantee(11, "Route identity registry remains Freeze-preserved."),
    guarantee(12, "Route Definition domain models remain Freeze-preserved."),
    guarantee(13, "All approved public APIs are registered exactly once."),
    guarantee(14, "API counts are derived from Freeze-reachable registries."),
    guarantee(15, "Canonical Inventory Rule is preserved through Freeze."),
    guarantee(16, "Runtime routing behavior remains absent."),
    guarantee(17, "Consumers must use the Public Index only; NEA-5 is Released."),
  ]);

const publicIndexMetadata = Object.freeze({
  publicIndexId: GatewayRoutingPublicIndexId,
  publicIndexName: GatewayRoutingPublicIndexName,
  publicIndexVersion: GatewayRoutingPublicIndexVersion,
  publicIndexNamespace: GatewayRoutingPublicIndexNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:9" as const,
  stage: "PublicIndex" as const,
  releaseStatus: GatewayRoutingPublicReleaseStatus,
  certificationStatus: GatewayRoutingPublicCertificationStatus,
  freezeStatus: GatewayRoutingPublicFreezeStatus,
  stabilityStatus: GatewayRoutingPublicStabilityStatus,
  architectureStatus: GatewayRoutingPublicArchitectureStatus,
  architectureVersion: GatewayRoutingPublicArchitectureVersion,
  consumerReadiness: GatewayRoutingPublicConsumerReadiness,
  nextPhaseReadiness: GatewayRoutingPublicNextPhaseReadiness,
  publicApiCount: GatewayRoutingPublicApiRegistry.length,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  architecturalPrinciple: GATEWAY_ROUTING_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE,
  solePublicEntryPoint: "gatewayRoutingPublicIndex.ts" as const,
  directImportPolicy: "PublicIndexOnly" as const,
  runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
  freezeId: chainIds.freezeId,
  freezeVersion: chainIds.freezeVersion,
  certificationId: chainIds.certificationId,
  platformId: chainIds.platformId,
  manifestId: chainIds.manifestId,
  validationId: chainIds.validationId,
  modelId: chainIds.modelId,
  registryId: chainIds.registryId,
  foundationId: chainIds.foundationId,
  routeIdentityCount: chainIds.routeIdentityCount,
  domainModelCount: chainIds.domainModelCount,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "gatewayRoutingFreeze.ts" as const,
  freezeOnly: true as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  earlierNeaStageDirectImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  certificationReachedThroughFreeze: true as const,
  platformReachedThroughCertification: true as const,
  namespaceReachedThroughPlatform: true as const,
  duplicatesFreezeMetadata: false as const,
  duplicatesCertificationMetadata: false as const,
  reconstructsUpstream: false as const,
});

/**
 * Canonical nine-section public namespace.
 * Prior phases preserved by reference through the Freeze chain.
 * This is the sole supported consumer entry point aggregate for NEA-5.
 */
export const GatewayRoutingPlatformPublicFoundation = Object.freeze({
  foundation,
  registry,
  model,
  validation,
  manifest,
  platform,
  certification,
  freeze,
  publicIndex: publicIndexMetadata,
  dependencyDeclarations,
  consumerImportPolicy: Object.freeze({
    soleSupportedEntryPoint: "gatewayRoutingPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    approvedFutureConsumers: Object.freeze([
      "Executive Engine",
      "Advisor",
      "Director",
      "EVE",
      "approved internal Nexora services",
    ] as const),
    architecturalAndMetadataAccessOnly: true as const,
    runtimeServiceOperational: false as const,
  }),
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  executesStrategies: false as const,
  implementsConsumerSelection: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiBehavior: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  routingBehavior: false as const,
  rebuildsInventories: false as const,
  rebuildsApiRegistries: false as const,
  recertifies: false as const,
  refreezes: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Exact unique Public API registry count derived from canonical collections. */
export function getGatewayRoutingPublicApiCount(): number {
  return GatewayRoutingPublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getGatewayRoutingPublicSummary() {
  const freezeSummary = freeze.summary;
  return Object.freeze({
    publicIndexId: GatewayRoutingPublicIndexId,
    version: GatewayRoutingPublicIndexVersion,
    name: GatewayRoutingPublicIndexName,
    namespace: GatewayRoutingPublicIndexNamespace,
    releaseStatus: GatewayRoutingPublicReleaseStatus,
    certificationStatus: GatewayRoutingPublicCertificationStatus,
    freezeStatus: GatewayRoutingPublicFreezeStatus,
    stabilityStatus: GatewayRoutingPublicStabilityStatus,
    architectureStatus: GatewayRoutingPublicArchitectureStatus,
    architectureVersion: GatewayRoutingPublicArchitectureVersion,
    consumerReadiness: GatewayRoutingPublicConsumerReadiness,
    nextPhaseReadiness: GatewayRoutingPublicNextPhaseReadiness,
    freezeId: chainIds.freezeId,
    certificationId: chainIds.certificationId,
    platformId: chainIds.platformId,
    manifestId: chainIds.manifestId,
    validationId: chainIds.validationId,
    modelId: chainIds.modelId,
    registryId: chainIds.registryId,
    foundationId: chainIds.foundationId,
    phaseCount: 9 as const,
    completedPhaseCount: 9 as const,
    publicNamespaceSectionCount: 9 as const,
    publicApiRegistryCount: GatewayRoutingPublicApiRegistry.length,
    nea59ExportCount: 12 as const,
    foundationApiCount: foundationApis.length,
    registryApiCount: registryApis.length,
    modelApiCount: modelApis.length,
    validationApiCount: validationApis.length,
    manifestApiCount: manifestApis.length,
    platformApiCount: platformApis.length,
    certificationApiCount: certificationApis.length,
    freezeApiCount: freezeApis.length,
    publicIndexApiCount: PUBLIC_INDEX_API_NAMES.length,
    routeIdentityCount: chainIds.routeIdentityCount,
    domainModelCount: chainIds.domainModelCount,
    certificationOutcome: freezeSummary.certificationOutcome,
    lockCount: freezeSummary.lockCount,
    lockedLockCount: freezeSummary.lockedLockCount,
    compatibilityCount: freezeSummary.compatibilityCount,
    frozenComponentCount: freezeSummary.componentCount,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    releaseGuaranteeCount: RELEASE_GUARANTEES.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Deterministic frozen Public Index release metadata. */
export function getGatewayRoutingPublicReleaseMetadata() {
  return Object.freeze({
    id: GatewayRoutingPublicIndexId,
    version: GatewayRoutingPublicIndexVersion,
    name: GatewayRoutingPublicIndexName,
    namespace: GatewayRoutingPublicIndexNamespace,
    layer: "NEA" as const,
    phase: "NEA-5:9" as const,
    stage: "PublicIndex" as const,
    releaseStatus: GatewayRoutingPublicReleaseStatus,
    certificationStatus: GatewayRoutingPublicCertificationStatus,
    freezeStatus: GatewayRoutingPublicFreezeStatus,
    stabilityStatus: GatewayRoutingPublicStabilityStatus,
    architectureStatus: GatewayRoutingPublicArchitectureStatus,
    architectureVersion: GatewayRoutingPublicArchitectureVersion,
    consumerReadiness: GatewayRoutingPublicConsumerReadiness,
    nextPhaseReadiness: GatewayRoutingPublicNextPhaseReadiness,
    canonicalEntryPoint: "gatewayRoutingPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    phaseCount: 9 as const,
    publicApiCount: GatewayRoutingPublicApiRegistry.length,
    routeIdentityCount: chainIds.routeIdentityCount,
    domainModelCount: chainIds.domainModelCount,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
