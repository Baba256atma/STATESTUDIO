/**
 * NEA-7:9 — Intake Orchestration Public Index.
 *
 * Sole supported public release surface for Intake Orchestration (NEA-7).
 * Consumes only IntakeOrchestrationFreezePlatform. Metadata-only. Runtime-free.
 *
 * Ownership: owned exclusively by NEA-7:9.
 *
 * Public exports (exactly 12):
 *   IntakeOrchestrationPlatformPublicFoundation
 *   IntakeOrchestrationPublicApiRegistry
 *   IntakeOrchestrationPublicIndexId
 *   IntakeOrchestrationPublicIndexVersion
 *   IntakeOrchestrationPublicIndexName
 *   IntakeOrchestrationPublicIndexNamespace
 *   IntakeOrchestrationPublicReleaseStatus
 *   IntakeOrchestrationPublicCertificationStatus
 *   IntakeOrchestrationPublicFreezeStatus
 *   getIntakeOrchestrationPublicSummary()
 *   getIntakeOrchestrationPublicApiCount()
 *   getIntakeOrchestrationPublicReleaseMetadata()
 *
 * Future consumers must import only intakeOrchestrationPublicIndex.ts.
 */

import { IntakeOrchestrationFreezePlatform } from "./intakeOrchestrationFreeze.ts";

// --------------------------------------------------------------------------
// Local vocabulary (non-exported — keeps runtime exports at exactly twelve).
// --------------------------------------------------------------------------

type IntakeOrchestrationPublicApiKind =
  | "Aggregate"
  | "IdentityConstant"
  | "MetadataConstant"
  | "Helper";

type IntakeOrchestrationPublicApiEntry = Readonly<{
  id: string;
  exportName: string;
  phase: string;
  section: string;
  kind: IntakeOrchestrationPublicApiKind;
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

type IntakeOrchestrationReleaseGuarantee = Readonly<{
  guaranteeId: string;
  statement: string;
  status: "Guaranteed";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

// --------------------------------------------------------------------------
// Canonical references reachable through NEA-7:8 Freeze only.
// --------------------------------------------------------------------------

const freeze = IntakeOrchestrationFreezePlatform;
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
  intakeIdentityCount: registry.collections.intakeIdentityCount,
  referenceTypeCount: registry.collections.referenceTypeCount,
  domainModelCount: model.domainModels.modelCount,
  canonicalExecutiveIntakePackageCount:
    foundation.contracts.canonicalExecutiveIntakePackageCount,
  inventoryEntryCount: platform.metadata.inventoryEntryCount,
  totalArchitectureCount: platform.metadata.totalArchitectureCount,
  composedPhaseCount: platform.metadata.composedPhaseCount,
});

// --------------------------------------------------------------------------
// Public Index identity and release constants.
// --------------------------------------------------------------------------

export const IntakeOrchestrationPublicIndexId =
  "NEA-7:9/IntakeOrchestrationPublicIndex" as const;

export const IntakeOrchestrationPublicIndexVersion = "1.0.0" as const;

export const IntakeOrchestrationPublicIndexName =
  "Intake Orchestration Public Index" as const;

export const IntakeOrchestrationPublicIndexNamespace =
  "nexora.nea.intake-orchestration.public-index" as const;

export const IntakeOrchestrationPublicReleaseStatus = "Released" as const;

export const IntakeOrchestrationPublicCertificationStatus =
  "Certified" as const;

export const IntakeOrchestrationPublicFreezeStatus = "Frozen" as const;

const IntakeOrchestrationPublicStabilityStatus = "Stable" as const;
const IntakeOrchestrationPublicArchitectureStatus = "Complete" as const;
const IntakeOrchestrationPublicConsumerReadiness =
  "ReadyForConsumer" as const;
const IntakeOrchestrationPublicNextPhaseReadiness =
  "NEA-7 Complete" as const;
const IntakeOrchestrationPublicArchitectureVersion = "NEA-7.0.0" as const;

const PUBLIC_INDEX_API_NAMES = Object.freeze([
  "IntakeOrchestrationPlatformPublicFoundation",
  "IntakeOrchestrationPublicApiRegistry",
  "IntakeOrchestrationPublicIndexId",
  "IntakeOrchestrationPublicIndexVersion",
  "IntakeOrchestrationPublicIndexName",
  "IntakeOrchestrationPublicIndexNamespace",
  "IntakeOrchestrationPublicReleaseStatus",
  "IntakeOrchestrationPublicCertificationStatus",
  "IntakeOrchestrationPublicFreezeStatus",
  "getIntakeOrchestrationPublicSummary",
  "getIntakeOrchestrationPublicApiCount",
  "getIntakeOrchestrationPublicReleaseMetadata",
] as const);

const PHASE_META = Object.freeze({
  "NEA-7:1": Object.freeze({
    section: "Foundation",
    version: foundation.identity.foundationVersion,
    sourceReference: "intakeOrchestrationFoundation.ts",
  }),
  "NEA-7:2": Object.freeze({
    section: "Registry",
    version: registry.identity.registryVersion,
    sourceReference: "intakeOrchestrationRegistry.ts",
  }),
  "NEA-7:3": Object.freeze({
    section: "Model",
    version: model.identity.modelVersion,
    sourceReference: "intakeOrchestrationModel.ts",
  }),
  "NEA-7:4": Object.freeze({
    section: "Validation",
    version: validation.identity.validationVersion,
    sourceReference: "intakeOrchestrationValidation.ts",
  }),
  "NEA-7:5": Object.freeze({
    section: "Manifest",
    version: manifest.identity.manifestVersion,
    sourceReference: "intakeOrchestrationManifest.ts",
  }),
  "NEA-7:6": Object.freeze({
    section: "Platform",
    version: platform.identity.platformVersion,
    sourceReference: "intakeOrchestrationPlatform.ts",
  }),
  "NEA-7:7": Object.freeze({
    section: "Certification",
    version: certification.identity.certificationVersion,
    sourceReference: "intakeOrchestrationCertification.ts",
  }),
  "NEA-7:8": Object.freeze({
    section: "Freeze",
    version: freeze.identity.freezeVersion,
    sourceReference: "intakeOrchestrationFreeze.ts",
  }),
  "NEA-7:9": Object.freeze({
    section: "PublicIndex",
    version: IntakeOrchestrationPublicIndexVersion,
    sourceReference: "intakeOrchestrationPublicIndex.ts",
  }),
} as const);

type PhaseKey = keyof typeof PHASE_META;

type UpstreamApiSource = Readonly<{
  exportName: string;
  id?: string;
  apiId?: string;
  kind?: IntakeOrchestrationPublicApiKind;
  version?: string;
  sourceReference?: string;
}>;

const classify = (exportName: string): IntakeOrchestrationPublicApiKind => {
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
): IntakeOrchestrationPublicApiEntry => {
  const meta = PHASE_META[phase];
  const exportName = typeof source === "string" ? source : source.exportName;
  const kind =
    typeof source === "string"
      ? classify(exportName)
      : (source.kind ?? classify(exportName));
  const upstreamApiId =
    typeof source === "string"
      ? `NEA-7:9/OwnedApi/${exportName}`
      : (source.id ?? source.apiId ?? `NEA-7:9/OwnedApi/${exportName}`);
  return Object.freeze({
    id: `NEA-7:9/PublicApi/${phase}/${exportName}`,
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
): readonly IntakeOrchestrationPublicApiEntry[] =>
  Object.freeze(
    sources.map((source, index) =>
      publicApiEntry(phase, source, startOrder + index),
    ),
  );

let nextOrder = 1;
const foundationEntries = phaseEntries("NEA-7:1", foundationApis, nextOrder);
nextOrder += foundationEntries.length;
const registryEntries = phaseEntries("NEA-7:2", registryApis, nextOrder);
nextOrder += registryEntries.length;
const modelEntries = phaseEntries("NEA-7:3", modelApis, nextOrder);
nextOrder += modelEntries.length;
const validationEntries = phaseEntries("NEA-7:4", validationApis, nextOrder);
nextOrder += validationEntries.length;
const manifestEntries = phaseEntries("NEA-7:5", manifestApis, nextOrder);
nextOrder += manifestEntries.length;
const platformEntries = phaseEntries("NEA-7:6", platformApis, nextOrder);
nextOrder += platformEntries.length;
const certificationEntries = phaseEntries(
  "NEA-7:7",
  certificationApis,
  nextOrder,
);
nextOrder += certificationEntries.length;
const freezeEntries = phaseEntries("NEA-7:8", freezeApis, nextOrder);
nextOrder += freezeEntries.length;
const publicIndexEntries = phaseEntries(
  "NEA-7:9",
  PUBLIC_INDEX_API_NAMES,
  nextOrder,
);

/**
 * Architectural boundary for IntakeOrchestrationPublicApiRegistry.
 * Metadata only — not a top-level public export (preserves exactly 12).
 */
const INTAKE_ORCHESTRATION_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE =
  Object.freeze({
    ownership:
      "Owns only the canonical public release surface of NEA-7.",
    prohibition:
      "Must never flatten, duplicate, reconstruct, or republish upstream phase architecture outside canonical Freeze references.",
    access:
      "Prior NEA-7 phases remain available exclusively through canonical references preserved by IntakeOrchestrationFreezePlatform.",
    principles: Object.freeze([
      "Sole Public Entry Point",
      "Canonical Reference Preservation",
      "Canonical Inventory Rule",
      "No Reconstruction Rule",
    ] as const),
  } as const);

/**
 * Canonical immutable Public API registry for the NEA-7 public release surface.
 *
 * Registers Foundation through Public Index top-level exports exactly once,
 * derived through Freeze-reachable stage registries. No reconstructed inventories.
 */
export const IntakeOrchestrationPublicApiRegistry: readonly IntakeOrchestrationPublicApiEntry[] =
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
): IntakeOrchestrationReleaseGuarantee =>
  Object.freeze({
    guaranteeId: `NEA-7:9/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Exactly seventeen release guarantees. */
const RELEASE_GUARANTEES: readonly IntakeOrchestrationReleaseGuarantee[] =
  Object.freeze([
    guarantee(1, "Public Index consumes only Freeze directly."),
    guarantee(2, "Certification is reached only through Freeze."),
    guarantee(3, "Platform is reached only through Certification."),
    guarantee(4, "Manifest is reached only through Platform namespace."),
    guarantee(5, "Validation is reached only through Platform namespace."),
    guarantee(6, "Model is reached only through Platform namespace."),
    guarantee(7, "Registry is reached only through Platform namespace."),
    guarantee(8, "Foundation is reached only through Platform namespace."),
    guarantee(9, "All nine NEA-7 phases are published through one namespace."),
    guarantee(10, "All prior phases remain preserved by canonical reference."),
    guarantee(
      11,
      "Canonical Executive Intake Package contract remains Freeze-preserved.",
    ),
    guarantee(
      12,
      "Intake identity and reference registries remain Freeze-preserved.",
    ),
    guarantee(13, "All approved public APIs are registered exactly once."),
    guarantee(14, "API counts are derived from Freeze-reachable registries."),
    guarantee(15, "Canonical Inventory Rule is preserved through Freeze."),
    guarantee(16, "Runtime orchestration and DKL handoff remain absent."),
    guarantee(
      17,
      "Consumers must use the Public Index only; NEA-7 is Released.",
    ),
  ]);

const publicIndexMetadata = Object.freeze({
  publicIndexId: IntakeOrchestrationPublicIndexId,
  publicIndexName: IntakeOrchestrationPublicIndexName,
  publicIndexVersion: IntakeOrchestrationPublicIndexVersion,
  publicIndexNamespace: IntakeOrchestrationPublicIndexNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:9" as const,
  stage: "PublicIndex" as const,
  releaseStatus: IntakeOrchestrationPublicReleaseStatus,
  certificationStatus: IntakeOrchestrationPublicCertificationStatus,
  freezeStatus: IntakeOrchestrationPublicFreezeStatus,
  stabilityStatus: IntakeOrchestrationPublicStabilityStatus,
  architectureStatus: IntakeOrchestrationPublicArchitectureStatus,
  architectureVersion: IntakeOrchestrationPublicArchitectureVersion,
  consumerReadiness: IntakeOrchestrationPublicConsumerReadiness,
  nextPhaseReadiness: IntakeOrchestrationPublicNextPhaseReadiness,
  publicApiCount: IntakeOrchestrationPublicApiRegistry.length,
  namespaceSectionCount: 9 as const,
  phaseCount: 9 as const,
  releaseGuarantees: RELEASE_GUARANTEES,
  architecturalPrinciple:
    INTAKE_ORCHESTRATION_PUBLIC_INDEX_ARCHITECTURAL_PRINCIPLE,
  solePublicEntryPoint: "intakeOrchestrationPublicIndex.ts" as const,
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
  intakeIdentityCount: chainIds.intakeIdentityCount,
  referenceTypeCount: chainIds.referenceTypeCount,
  domainModelCount: chainIds.domainModelCount,
  canonicalExecutiveIntakePackageCount:
    chainIds.canonicalExecutiveIntakePackageCount,
  inventoryEntryCount: chainIds.inventoryEntryCount,
  totalArchitectureCount: chainIds.totalArchitectureCount,
  composedPhaseCount: chainIds.composedPhaseCount,
  runtimeBehavior: false as const,
  runtimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  executesDKLHandoff: false as const,
  invokesDKL: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "intakeOrchestrationFreeze.ts" as const,
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
 * This is the sole supported consumer entry point aggregate for NEA-7.
 */
export const IntakeOrchestrationPlatformPublicFoundation = Object.freeze({
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
    soleSupportedEntryPoint: "intakeOrchestrationPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    approvedFutureConsumers: Object.freeze([
      "Executive Engine",
      "Advisor",
      "Director",
      "EVE",
      "DKL (architectural readiness only)",
      "approved internal Nexora services",
    ] as const),
    architecturalAndMetadataAccessOnly: true as const,
    runtimeServiceOperational: false as const,
  }),
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  executesDKLHandoff: false as const,
  invokesDKL: false as const,
  serviceExecution: false as const,
  implementsRuntimeOrchestration: false as const,
  normalizesMessages: false as const,
  parsesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  implementsRouting: false as const,
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
export function getIntakeOrchestrationPublicApiCount(): number {
  return IntakeOrchestrationPublicApiRegistry.length;
}

/** Deterministic frozen Public Index summary. */
export function getIntakeOrchestrationPublicSummary() {
  const freezeSummary = freeze.summary;
  return Object.freeze({
    publicIndexId: IntakeOrchestrationPublicIndexId,
    version: IntakeOrchestrationPublicIndexVersion,
    name: IntakeOrchestrationPublicIndexName,
    namespace: IntakeOrchestrationPublicIndexNamespace,
    releaseStatus: IntakeOrchestrationPublicReleaseStatus,
    certificationStatus: IntakeOrchestrationPublicCertificationStatus,
    freezeStatus: IntakeOrchestrationPublicFreezeStatus,
    stabilityStatus: IntakeOrchestrationPublicStabilityStatus,
    architectureStatus: IntakeOrchestrationPublicArchitectureStatus,
    architectureVersion: IntakeOrchestrationPublicArchitectureVersion,
    consumerReadiness: IntakeOrchestrationPublicConsumerReadiness,
    nextPhaseReadiness: IntakeOrchestrationPublicNextPhaseReadiness,
    canonicalConsumerEntryPoint: "intakeOrchestrationPublicIndex.ts" as const,
    runtimeBehavior: false as const,
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
    publicApiRegistryCount: IntakeOrchestrationPublicApiRegistry.length,
    publicExportCount: 12 as const,
    nea79ExportCount: 12 as const,
    foundationApiCount: foundationApis.length,
    registryApiCount: registryApis.length,
    modelApiCount: modelApis.length,
    validationApiCount: validationApis.length,
    manifestApiCount: manifestApis.length,
    platformApiCount: platformApis.length,
    certificationApiCount: certificationApis.length,
    freezeApiCount: freezeApis.length,
    publicIndexApiCount: PUBLIC_INDEX_API_NAMES.length,
    upstreamPhaseApiCount:
      foundationApis.length +
      registryApis.length +
      modelApis.length +
      validationApis.length +
      manifestApis.length +
      platformApis.length +
      certificationApis.length +
      freezeApis.length,
    intakeIdentityCount: chainIds.intakeIdentityCount,
    referenceTypeCount: chainIds.referenceTypeCount,
    domainModelCount: chainIds.domainModelCount,
    canonicalExecutiveIntakePackageCount:
      chainIds.canonicalExecutiveIntakePackageCount,
    inventoryEntryCount: chainIds.inventoryEntryCount,
    totalArchitectureCount: chainIds.totalArchitectureCount,
    composedPhaseCount: chainIds.composedPhaseCount,
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
export function getIntakeOrchestrationPublicReleaseMetadata() {
  return Object.freeze({
    id: IntakeOrchestrationPublicIndexId,
    version: IntakeOrchestrationPublicIndexVersion,
    name: IntakeOrchestrationPublicIndexName,
    namespace: IntakeOrchestrationPublicIndexNamespace,
    layer: "NEA" as const,
    phase: "NEA-7:9" as const,
    stage: "PublicIndex" as const,
    releaseStatus: IntakeOrchestrationPublicReleaseStatus,
    certificationStatus: IntakeOrchestrationPublicCertificationStatus,
    freezeStatus: IntakeOrchestrationPublicFreezeStatus,
    stabilityStatus: IntakeOrchestrationPublicStabilityStatus,
    architectureStatus: IntakeOrchestrationPublicArchitectureStatus,
    architectureVersion: IntakeOrchestrationPublicArchitectureVersion,
    consumerReadiness: IntakeOrchestrationPublicConsumerReadiness,
    nextPhaseReadiness: IntakeOrchestrationPublicNextPhaseReadiness,
    canonicalEntryPoint: "intakeOrchestrationPublicIndex.ts" as const,
    directImportPolicy: "PublicIndexOnly" as const,
    upstreamFreezeReference: chainIds.freezeId,
    phaseCount: 9 as const,
    namespaceSectionCount: 9 as const,
    publicApiCount: IntakeOrchestrationPublicApiRegistry.length,
    intakeIdentityCount: chainIds.intakeIdentityCount,
    referenceTypeCount: chainIds.referenceTypeCount,
    domainModelCount: chainIds.domainModelCount,
    canonicalExecutiveIntakePackageCount:
      chainIds.canonicalExecutiveIntakePackageCount,
    inventoryEntryCount: chainIds.inventoryEntryCount,
    totalArchitectureCount: chainIds.totalArchitectureCount,
    composedPhaseCount: chainIds.composedPhaseCount,
    guaranteeCount: RELEASE_GUARANTEES.length,
    runtimeBehavior: false as const,
    runtimeOrchestration: false as const,
    assemblesRuntimePackage: false as const,
    executesDKLHandoff: false as const,
    invokesDKL: false as const,
    runtimeServiceStatus: "NotImplementedByPublicIndex" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
