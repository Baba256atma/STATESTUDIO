/**
 * NEA-3:9 — Session & Conversation Public Index.
 *
 * Sole supported public release surface for Session & Conversation (NEA-3).
 * Consumes only SessionConversationFreezePlatform. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by NEA-3:9.
 *
 * Public exports (exactly 12):
 *   SessionConversationPlatformPublicFoundation
 *   SessionConversationPublicApiRegistry
 *   SessionConversationPublicIndexId
 *   SessionConversationPublicIndexVersion
 *   SessionConversationPublicIndexName
 *   SessionConversationPublicIndexNamespace
 *   SessionConversationPublicReleaseStatus
 *   SessionConversationPublicCertificationStatus
 *   SessionConversationPublicFreezeStatus
 *   getSessionConversationPublicSummary()
 *   getSessionConversationPublicApiCount()
 *   getSessionConversationPublicReleaseMetadata()
 *
 * Future consumers must import only sessionConversationPublicIndex.ts.
 */

import { SessionConversationFreezePlatform } from "./sessionConversationFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type SessionConversationPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type SessionConversationPublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: SessionConversationPublicApiKind;
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

type SessionConversationReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through NEA-3:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = SessionConversationFreezePlatform;
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
  sessionIdentityCount: registry.collections.sessionIdentityCount,
  conversationIdentityCount: registry.collections.conversationIdentityCount,
});

// --------------------------------------------------------------------------
// Public Index identity and release constants.
// --------------------------------------------------------------------------

export const SessionConversationPublicIndexId =
  "NEA-3:9/SessionConversationPublicIndex" as const;

export const SessionConversationPublicIndexVersion = "1.0.0" as const;

export const SessionConversationPublicIndexName =
  "Session & Conversation Public Index" as const;

export const SessionConversationPublicIndexNamespace =
  "nexora.nea.session-conversation.public-index" as const;

export const SessionConversationPublicReleaseStatus = "Released" as const;

export const SessionConversationPublicCertificationStatus =
  "Certified" as const;

export const SessionConversationPublicFreezeStatus = "Frozen" as const;

const SessionConversationPublicStabilityStatus = "Stable" as const;
const SessionConversationPublicArchitectureStatus = "Complete" as const;
const SessionConversationPublicConsumerReadiness = "ReadyForConsumer" as const;
const SessionConversationPublicNextPhaseReadiness = "NEA-3 Complete" as const;
const SessionConversationPublicArchitectureVersion = "NEA-3.0.0" as const;

const PUBLIC_INDEX_API_NAMES = Object.freeze([
  "SessionConversationPlatformPublicFoundation",
  "SessionConversationPublicApiRegistry",
  "SessionConversationPublicIndexId",
  "SessionConversationPublicIndexVersion",
  "SessionConversationPublicIndexName",
  "SessionConversationPublicIndexNamespace",
  "SessionConversationPublicReleaseStatus",
  "SessionConversationPublicCertificationStatus",
  "SessionConversationPublicFreezeStatus",
  "getSessionConversationPublicSummary",
  "getSessionConversationPublicApiCount",
  "getSessionConversationPublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "NEA-3:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "sessionConversationFoundation.ts",
  }),
  "NEA-3:2": Object.freeze({
    section: "Registry",
    version: registry.identity.registryVersion,
    sourceReference: "sessionConversationRegistry.ts",
  }),
  "NEA-3:3": Object.freeze({
    section: "Model",
    version: model.identity.modelVersion,
    sourceReference: "sessionConversationModel.ts",
  }),
  "NEA-3:4": Object.freeze({
    section: "Validation",
    version: validation.identity.validationVersion,
    sourceReference: "sessionConversationValidation.ts",
  }),
  "NEA-3:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.manifestVersion,
    sourceReference: "sessionConversationManifest.ts",
  }),
  "NEA-3:6": Object.freeze({
    section: "Platform",
    version: platform.identity.platformVersion,
    sourceReference: "sessionConversationPlatform.ts",
  }),
  "NEA-3:7": Object.freeze({
    section: "Certification",
    version: certification.identity.certificationVersion,
    sourceReference: "sessionConversationCertification.ts",
  }),
  "NEA-3:8": Object.freeze({
    section: "Freeze",
    version: freeze.identity.freezeVersion,
    sourceReference: "sessionConversationFreeze.ts",
  }),
  "NEA-3:9": Object.freeze({
    section: "PublicIndex",
    version: SessionConversationPublicIndexVersion,
    sourceReference: "sessionConversationPublicIndex.ts",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

type UpstreamApiSource = Readonly<{
  exportName: string;
  id?: string;
  apiId?: string;
  kind?: SessionConversationPublicApiKind;
  version?: string;
  sourceReference?: string;
}>;

const classify = (exportName: string): SessionConversationPublicApiKind => {
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
): SessionConversationPublicApiEntry => {
  const meta = PHASE_META[phase];
  const exportName = typeof source === "string" ? source : source.exportName;
  const kind =
    typeof source === "string"
      ? classify(exportName)
      : (source.kind ?? classify(exportName));
  const upstreamApiId =
    typeof source === "string"
      ? `NEA-3:9/OwnedApi/${exportName}`
      : (source.id ?? source.apiId ?? `NEA-3:9/OwnedApi/${exportName}`);
  return Object.freeze({
    id: `NEA-3:9/PublicApi/${phase}/${exportName}`,
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
): readonly SessionConversationPublicApiEntry[] =>
  Object.freeze(
    sources.map((source, index) =>
      publicApiEntry(phase, source, startOrder + index),
    ),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries("NEA-3:1", foundationApis, nextOrder);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("NEA-3:2", registryApis, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("NEA-3:3", modelApis, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("NEA-3:4", validationApis, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("NEA-3:5", manifestApis, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("NEA-3:6", platformApis, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "NEA-3:7",
  certificationApis,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("NEA-3:8", freezeApis, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "NEA-3:9",
  PUBLIC_INDEX_API_NAMES,
  nextOrder,
);

/**
 * Architectural boundary for SessionConversationPublicApiRegistry.
 * Metadata only — not a top-level public export (preserves exactly 12).
 */
const SESSION_CONVERSATION_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE = Object.freeze({
  ownership: "Owns only the canonical public release surface of NEA-3.",
  prohibition:
    "Must never flatten, duplicate, reconstruct, or republish upstream phase architecture outside canonical Freeze references.",
  access:
    "Prior NEA-3 phases remain available exclusively through canonical references preserved by SessionConversationFreezePlatform.",
  principles: Object.freeze([
    "Sole Public Entry Point",
    "Canonical Reference Preservation",
    "Canonical Inventory Rule",
    "No Reconstruction Rule",
  ] as const),
} as const);

/**
 * Canonical immutable Public API registry for the NEA-3 public release surface.
 *
 * Registers Foundation through Public Index top-level exports exactly once,
 * derived through Freeze-reachable stage registries. No reconstructed inventories.
 */
export const SessionConversationPublicApiRegistry: readonly SessionConversationPublicApiEntry[] =
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
): SessionConversationReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `NEA-3:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

const RELEASE_GUARANTEES: readonly SessionConversationReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform namespace."),
    guarantee(5, "Validation is reached only through Platform namespace."),
    guarantee(6, "Model is reached only through Platform namespace."),
    guarantee(7, "Registry is reached only through Platform namespace."),
    guarantee(8, "Foundation is reached only through Platform namespace."),
    guarantee(9, "All nine NEA-3 phases are published through one namespace."),
    guarantee(10, "All prior phases remain preserved by canonical reference."),
    guarantee(11, "Session identity registry remains Freeze-preserved."),
    guarantee(12, "Conversation identity registry remains Freeze-preserved."),
    guarantee(13, "All approved public APIs are registered exactly once."),
    guarantee(14, "API counts are derived from Freeze-reachable registries."),
    guarantee(15, "Canonical Inventory Rule is preserved through Freeze."),
    guarantee(16, "Runtime session and conversation behavior remains absent."),
    guarantee(17, "Consumers must use the Public Index only."),
    guarantee(18, "NEA-3 is released and ReadyForConsumer."),
  ]);

const publicIndexMetadata = Object.freeze({
  publicIndexId: SessionConversationPublicIndexId,
  publicIndexName: SessionConversationPublicIndexName,
  publicIndexVersion: SessionConversationPublicIndexVersion,
  publicIndexNamespace: SessionConversationPublicIndexNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:9" as const,
  stage: "PublicIndex" as const,
  releaseStatus: SessionConversationPublicReleaseStatus,
  certificationStatus: SessionConversationPublicCertificationStatus,
  freezeStatus: SessionConversationPublicFreezeStatus,
  stabilityStatus: SessionConversationPublicStabilityStatus,
  architectureStatus: SessionConversationPublicArchitectureStatus,
  architectureVersion: SessionConversationPublicArchitectureVersion,
  consumerReadiness: SessionConversationPublicConsumerReadiness,
  nextPhaseReadiness: SessionConversationPublicNextPhaseReadiness,
  publicApiCount: SessionConversationPublicApiRegistry.length,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  architecturalPrinciple:
    SESSION_CONVERSATION_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE,
  solePublicEntryPoint: "sessionConversationPublicIndex.ts" as const,
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
  sessionIdentityCount: chainIds.sessionIdentityCount,
  conversationIdentityCount: chainIds.conversationIdentityCount,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "sessionConversationFreeze.ts" as const,
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
 * This is the sole supported consumer entry point aggregate for NEA-3.
 */
export const SessionConversationPlatformPublicFoundation = Object.freeze({
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
    soleSupportedEntryPoint: "sessionConversationPublicIndex.ts" as const,
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
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
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
export function getSessionConversationPublicApiCount(): number {
  return SessionConversationPublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getSessionConversationPublicSummary() {
  const freezeSummary = freeze.summary;
  return Object.freeze({
    publicIndexId: SessionConversationPublicIndexId,
    version: SessionConversationPublicIndexVersion,
    name: SessionConversationPublicIndexName,
    namespace: SessionConversationPublicIndexNamespace,
    releaseStatus: SessionConversationPublicReleaseStatus,
    certificationStatus: SessionConversationPublicCertificationStatus,
    freezeStatus: SessionConversationPublicFreezeStatus,
    stabilityStatus: SessionConversationPublicStabilityStatus,
    architectureStatus: SessionConversationPublicArchitectureStatus,
    architectureVersion: SessionConversationPublicArchitectureVersion,
    consumerReadiness: SessionConversationPublicConsumerReadiness,
    nextPhaseReadiness: SessionConversationPublicNextPhaseReadiness,
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
    publicApiRegistryCount: SessionConversationPublicApiRegistry.length,
    nea39ExportCount: 12 as const,
    foundationApiCount: foundationApis.length,
    registryApiCount: registryApis.length,
    modelApiCount: modelApis.length,
    validationApiCount: validationApis.length,
    manifestApiCount: manifestApis.length,
    platformApiCount: platformApis.length,
    certificationApiCount: certificationApis.length,
    freezeApiCount: freezeApis.length,
    publicIndexApiCount: PUBLIC_INDEX_API_NAMES.length,
    sessionIdentityCount: chainIds.sessionIdentityCount,
    conversationIdentityCount: chainIds.conversationIdentityCount,
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
export function getSessionConversationPublicReleaseMetadata() {
  return Object.freeze({
    id: SessionConversationPublicIndexId,
    version: SessionConversationPublicIndexVersion,
    name: SessionConversationPublicIndexName,
    namespace: SessionConversationPublicIndexNamespace,
    layer: "NEA" as const,
    phase: "NEA-3:9" as const,
    stage: "PublicIndex" as const,
    releaseStatus: SessionConversationPublicReleaseStatus,
    certificationStatus: SessionConversationPublicCertificationStatus,
    freezeStatus: SessionConversationPublicFreezeStatus,
    stabilityStatus: SessionConversationPublicStabilityStatus,
    architectureStatus: SessionConversationPublicArchitectureStatus,
    architectureVersion: SessionConversationPublicArchitectureVersion,
    consumerReadiness: SessionConversationPublicConsumerReadiness,
    nextPhaseReadiness: SessionConversationPublicNextPhaseReadiness,
    canonicalEntryPoint: "sessionConversationPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    phaseCount: 9 as const,
    publicApiCount: SessionConversationPublicApiRegistry.length,
    sessionIdentityCount: chainIds.sessionIdentityCount,
    conversationIdentityCount: chainIds.conversationIdentityCount,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
