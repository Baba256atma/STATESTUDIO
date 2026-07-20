/**
 * NEA-1:9 — Executive Gateway Public Index.
 *
 * Sole supported public release surface for the Executive Gateway (NEA-1).
 * Consumes only ExecutiveGatewayFreezePlatform. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by NEA-1:9.
 *
 * Public exports (exactly 12):
 *   ExecutiveGatewayPlatformPublicFoundation
 *   ExecutiveGatewayPublicApiRegistry
 *   ExecutiveGatewayPublicIndexId
 *   ExecutiveGatewayPublicIndexVersion
 *   ExecutiveGatewayPublicIndexName
 *   ExecutiveGatewayPublicIndexNamespace
 *   ExecutiveGatewayPublicReleaseStatus
 *   ExecutiveGatewayPublicCertificationStatus
 *   ExecutiveGatewayPublicFreezeStatus
 *   getExecutiveGatewayPublicSummary()
 *   getExecutiveGatewayPublicApiCount()
 *   getExecutiveGatewayPublicReleaseMetadata()
 *
 * Future consumers must import only executiveGatewayPublicIndex.ts.
 */

import { ExecutiveGatewayFreezePlatform } from "./executiveGatewayFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type ExecutiveGatewayPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type ExecutiveGatewayPublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: ExecutiveGatewayPublicApiKind;
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

type ExecutiveGatewayReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through NEA-1:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = ExecutiveGatewayFreezePlatform;
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
});

// --------------------------------------------------------------------------
// Public Index identity and release constants.
// --------------------------------------------------------------------------

export const ExecutiveGatewayPublicIndexId =
  "NEA-1:9/ExecutiveGatewayPublicIndex" as const;

export const ExecutiveGatewayPublicIndexVersion = "1.0.0" as const;

export const ExecutiveGatewayPublicIndexName =
  "Executive Gateway Public Index" as const;

export const ExecutiveGatewayPublicIndexNamespace =
  "nexora.nea.executive-gateway.public-index" as const;

export const ExecutiveGatewayPublicReleaseStatus = "Released" as const;

export const ExecutiveGatewayPublicCertificationStatus = "Certified" as const;

export const ExecutiveGatewayPublicFreezeStatus = "Frozen" as const;

const ExecutiveGatewayPublicStabilityStatus = "Stable" as const;
const ExecutiveGatewayPublicArchitectureStatus = "Complete" as const;
const ExecutiveGatewayPublicConsumerReadiness = "ReadyForConsumer" as const;
const ExecutiveGatewayPublicNextPhaseReadiness =
  "NEA-1 Complete" as const;
const ExecutiveGatewayPublicArchitectureVersion = "NEA-1.0.0" as const;

const PUBLIC_INDEX_API_NAMES = Object.freeze([
  "ExecutiveGatewayPlatformPublicFoundation",
  "ExecutiveGatewayPublicApiRegistry",
  "ExecutiveGatewayPublicIndexId",
  "ExecutiveGatewayPublicIndexVersion",
  "ExecutiveGatewayPublicIndexName",
  "ExecutiveGatewayPublicIndexNamespace",
  "ExecutiveGatewayPublicReleaseStatus",
  "ExecutiveGatewayPublicCertificationStatus",
  "ExecutiveGatewayPublicFreezeStatus",
  "getExecutiveGatewayPublicSummary",
  "getExecutiveGatewayPublicApiCount",
  "getExecutiveGatewayPublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "NEA-1:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "executiveGatewayFoundation.ts",
  }),
  "NEA-1:2": Object.freeze({
    section: "Registry",
    version: registry.identity.registryVersion,
    sourceReference: "executiveGatewayRegistry.ts",
  }),
  "NEA-1:3": Object.freeze({
    section: "Model",
    version: model.identity.modelVersion,
    sourceReference: "executiveGatewayModel.ts",
  }),
  "NEA-1:4": Object.freeze({
    section: "Validation",
    version: validation.identity.validationVersion,
    sourceReference: "executiveGatewayValidation.ts",
  }),
  "NEA-1:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.manifestVersion,
    sourceReference: "executiveGatewayManifest.ts",
  }),
  "NEA-1:6": Object.freeze({
    section: "Platform",
    version: platform.identity.platformVersion,
    sourceReference: "executiveGatewayPlatform.ts",
  }),
  "NEA-1:7": Object.freeze({
    section: "Certification",
    version: certification.identity.certificationVersion,
    sourceReference: "executiveGatewayCertification.ts",
  }),
  "NEA-1:8": Object.freeze({
    section: "Freeze",
    version: freeze.identity.freezeVersion,
    sourceReference: "executiveGatewayFreeze.ts",
  }),
  "NEA-1:9": Object.freeze({
    section: "PublicIndex",
    version: ExecutiveGatewayPublicIndexVersion,
    sourceReference: "executiveGatewayPublicIndex.ts",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

type UpstreamApiSource = Readonly<{
  exportName: string;
  id?: string;
  apiId?: string;
  kind?: ExecutiveGatewayPublicApiKind;
  version?: string;
  sourceReference?: string;
}>;

const classify = (exportName: string): ExecutiveGatewayPublicApiKind => {
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
): ExecutiveGatewayPublicApiEntry => {
  const meta = PHASE_META[phase];
  const exportName = typeof source === "string" ? source : source.exportName;
  const kind =
    typeof source === "string"
      ? classify(exportName)
      : (source.kind ?? classify(exportName));
  const upstreamApiId =
    typeof source === "string"
      ? `NEA-1:9/OwnedApi/${exportName}`
      : (source.id ?? source.apiId ?? `NEA-1:9/OwnedApi/${exportName}`);
  return Object.freeze({
    id: `NEA-1:9/PublicApi/${phase}/${exportName}`,
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
): readonly ExecutiveGatewayPublicApiEntry[] =>
  Object.freeze(
    sources.map((source, index) =>
      publicApiEntry(phase, source, startOrder + index),
    ),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries("NEA-1:1", foundationApis, nextOrder);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("NEA-1:2", registryApis, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("NEA-1:3", modelApis, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("NEA-1:4", validationApis, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("NEA-1:5", manifestApis, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("NEA-1:6", platformApis, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "NEA-1:7",
  certificationApis,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("NEA-1:8", freezeApis, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "NEA-1:9",
  PUBLIC_INDEX_API_NAMES,
  nextOrder,
);

/**
 * Architectural boundary for ExecutiveGatewayPublicApiRegistry.
 * Metadata only — not a top-level public export (preserves exactly 12).
 */
const EXECUTIVE_GATEWAY_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE = Object.freeze({
  ownership: "Owns only the canonical public release surface of NEA-1.",
  prohibition:
    "Must never flatten, duplicate, reconstruct, or republish upstream phase architecture outside canonical Freeze references.",
  access:
    "Prior NEA-1 phases remain available exclusively through canonical references preserved by ExecutiveGatewayFreezePlatform.",
  principles: Object.freeze([
    "Sole Public Entry Point",
    "Canonical Reference Preservation",
    "Canonical Inventory Rule",
    "No Reconstruction Rule",
  ] as const),
} as const);

/**
 * Canonical immutable Public API registry for the NEA-1 public release surface.
 *
 * Registers Foundation through Public Index top-level exports exactly once,
 * derived through Freeze-reachable stage registries. No reconstructed inventories.
 */
export const ExecutiveGatewayPublicApiRegistry: readonly ExecutiveGatewayPublicApiEntry[] =
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
): ExecutiveGatewayReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `NEA-1:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

const RELEASE_GUARANTEES: readonly ExecutiveGatewayReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform namespace."),
    guarantee(5, "Validation is reached only through Platform namespace."),
    guarantee(6, "Model is reached only through Platform namespace."),
    guarantee(7, "Registry is reached only through Platform namespace."),
    guarantee(8, "Foundation is reached only through Platform namespace."),
    guarantee(9, "All nine NEA-1 phases are published through one namespace."),
    guarantee(10, "All prior phases remain preserved by canonical reference."),
    guarantee(11, "All approved public APIs are registered exactly once."),
    guarantee(12, "API counts are derived from Freeze-reachable registries."),
    guarantee(13, "Canonical Inventory Rule is preserved through Freeze."),
    guarantee(14, "Runtime Executive Gateway execution remains absent."),
    guarantee(15, "Consumers must use the Public Index only."),
    guarantee(16, "NEA-1 is released and ReadyForConsumer."),
  ]);

const publicIndexMetadata = Object.freeze({
  publicIndexId: ExecutiveGatewayPublicIndexId,
  publicIndexName: ExecutiveGatewayPublicIndexName,
  publicIndexVersion: ExecutiveGatewayPublicIndexVersion,
  publicIndexNamespace: ExecutiveGatewayPublicIndexNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:9" as const,
  stage: "PublicIndex" as const,
  releaseStatus: ExecutiveGatewayPublicReleaseStatus,
  certificationStatus: ExecutiveGatewayPublicCertificationStatus,
  freezeStatus: ExecutiveGatewayPublicFreezeStatus,
  stabilityStatus: ExecutiveGatewayPublicStabilityStatus,
  architectureStatus: ExecutiveGatewayPublicArchitectureStatus,
  architectureVersion: ExecutiveGatewayPublicArchitectureVersion,
  consumerReadiness: ExecutiveGatewayPublicConsumerReadiness,
  nextPhaseReadiness: ExecutiveGatewayPublicNextPhaseReadiness,
  publicApiCount: ExecutiveGatewayPublicApiRegistry.length,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  architecturalPrinciple:
    EXECUTIVE_GATEWAY_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE,
  solePublicEntryPoint: "executiveGatewayPublicIndex.ts" as const,
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
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "executiveGatewayFreeze.ts" as const,
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
 * This is the sole supported consumer entry point aggregate for NEA-1.
 */
export const ExecutiveGatewayPlatformPublicFoundation = Object.freeze({
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
    soleSupportedEntryPoint: "executiveGatewayPublicIndex.ts" as const,
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
  connectorImplementation: false as const,
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
export function getExecutiveGatewayPublicApiCount(): number {
  return ExecutiveGatewayPublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getExecutiveGatewayPublicSummary() {
  const freezeSummary = freeze.summary;
  return Object.freeze({
    publicIndexId: ExecutiveGatewayPublicIndexId,
    version: ExecutiveGatewayPublicIndexVersion,
    name: ExecutiveGatewayPublicIndexName,
    namespace: ExecutiveGatewayPublicIndexNamespace,
    releaseStatus: ExecutiveGatewayPublicReleaseStatus,
    certificationStatus: ExecutiveGatewayPublicCertificationStatus,
    freezeStatus: ExecutiveGatewayPublicFreezeStatus,
    stabilityStatus: ExecutiveGatewayPublicStabilityStatus,
    architectureStatus: ExecutiveGatewayPublicArchitectureStatus,
    architectureVersion: ExecutiveGatewayPublicArchitectureVersion,
    consumerReadiness: ExecutiveGatewayPublicConsumerReadiness,
    nextPhaseReadiness: ExecutiveGatewayPublicNextPhaseReadiness,
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
    publicApiRegistryCount: ExecutiveGatewayPublicApiRegistry.length,
    nea19ExportCount: 12 as const,
    foundationApiCount: foundationApis.length,
    registryApiCount: registryApis.length,
    modelApiCount: modelApis.length,
    validationApiCount: validationApis.length,
    manifestApiCount: manifestApis.length,
    platformApiCount: platformApis.length,
    certificationApiCount: certificationApis.length,
    freezeApiCount: freezeApis.length,
    publicIndexApiCount: PUBLIC_INDEX_API_NAMES.length,
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
export function getExecutiveGatewayPublicReleaseMetadata() {
  return Object.freeze({
    id: ExecutiveGatewayPublicIndexId,
    version: ExecutiveGatewayPublicIndexVersion,
    name: ExecutiveGatewayPublicIndexName,
    namespace: ExecutiveGatewayPublicIndexNamespace,
    layer: "NEA" as const,
    phase: "NEA-1:9" as const,
    stage: "PublicIndex" as const,
    releaseStatus: ExecutiveGatewayPublicReleaseStatus,
    certificationStatus: ExecutiveGatewayPublicCertificationStatus,
    freezeStatus: ExecutiveGatewayPublicFreezeStatus,
    stabilityStatus: ExecutiveGatewayPublicStabilityStatus,
    architectureStatus: ExecutiveGatewayPublicArchitectureStatus,
    architectureVersion: ExecutiveGatewayPublicArchitectureVersion,
    consumerReadiness: ExecutiveGatewayPublicConsumerReadiness,
    nextPhaseReadiness: ExecutiveGatewayPublicNextPhaseReadiness,
    canonicalEntryPoint: "executiveGatewayPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    phaseCount: 9 as const,
    publicApiCount: ExecutiveGatewayPublicApiRegistry.length,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
