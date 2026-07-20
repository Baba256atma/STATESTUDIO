/**
 * NEA-7:1 — Intake Orchestration Foundation.
 *
 * Immutable architectural foundation for Executive Intake Orchestration.
 * Consumes only NEA-6 Message Normalization Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-7:1.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationFoundationId
 *   IntakeOrchestrationFoundationVersion
 *   IntakeOrchestrationFoundationName
 *   IntakeOrchestrationFoundationNamespace
 *   IntakeOrchestrationFoundationStatus
 *   IntakeOrchestrationFoundationReadiness
 *   IntakeOrchestrationFoundationPlatform
 *   getIntakeOrchestrationFoundationSummary()
 */

import { IntakeOrchestrationBoundaries } from "./intakeOrchestrationBoundaries.ts";
import { IntakeOrchestrationCapabilityCatalog } from "./intakeOrchestrationCapabilities.ts";
import { IntakeOrchestrationContractCatalog } from "./intakeOrchestrationContracts.ts";
import type {
  IntakeOrchestrationFoundationIdentity,
  IntakeOrchestrationFoundationSummary,
} from "./intakeOrchestrationFoundationTypes.ts";
import { IntakeOrchestrationLifecycle } from "./intakeOrchestrationLifecycle.ts";
import { IntakeOrchestrationOwnership } from "./intakeOrchestrationOwnership.ts";
import {
  MessageNormalizationPublicIndexId,
  MessageNormalizationPublicIndexNamespace,
  MessageNormalizationPublicIndexVersion,
} from "./messageNormalizationPublicIndex.ts";

/** Canonical foundation identity. */
export const IntakeOrchestrationFoundationId =
  "NEA-7:1/IntakeOrchestrationFoundation" as const;

/** Human-readable foundation name. */
export const IntakeOrchestrationFoundationName =
  "Intake Orchestration Foundation" as const;

/** Semantic version. */
export const IntakeOrchestrationFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationFoundationNamespace =
  "nexora.nea.intake-orchestration.foundation" as const;

/** Foundation status. */
export const IntakeOrchestrationFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: IntakeOrchestrationFoundationIdentity = Object.freeze({
  foundationId: IntakeOrchestrationFoundationId,
  foundationName: IntakeOrchestrationFoundationName,
  foundationVersion: IntakeOrchestrationFoundationVersion,
  foundationNamespace: IntakeOrchestrationFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-7:1" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationFoundationStatus,
  readiness: IntakeOrchestrationFoundationReadiness,
  description:
    "Immutable architectural foundation declaring how NEA-1 through NEA-6 outputs assemble into one canonical Executive Intake Package — the sole handoff contract to DKL — without runtime orchestration, execution, or AI.",
  publicIndexId: MessageNormalizationPublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:1/Dependency/NEA6PublicIndex",
  directPreviousPhaseModule: "messageNormalizationPublicIndex.ts" as const,
  publicIndexOnly: true as const,
  publicIndexId: MessageNormalizationPublicIndexId,
  publicIndexVersion: MessageNormalizationPublicIndexVersion,
  publicIndexNamespace: MessageNormalizationPublicIndexNamespace,
  freezeDirectImport: false as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  circularDependency: false as const,
  canonicalPath:
    "NEA-7:1 → NEA-6 MessageNormalizationPublicIndex (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "references",
  "attachments",
  "results",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-7:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntakeOrchestrationFoundationVersion,
    status: IntakeOrchestrationFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationFoundationApiRegistry = Object.freeze([
  foundationApi("IntakeOrchestrationFoundationId", "IdentityConstant"),
  foundationApi("IntakeOrchestrationFoundationVersion", "IdentityConstant"),
  foundationApi("IntakeOrchestrationFoundationName", "IdentityConstant"),
  foundationApi("IntakeOrchestrationFoundationNamespace", "IdentityConstant"),
  foundationApi("IntakeOrchestrationFoundationStatus", "MetadataConstant"),
  foundationApi("IntakeOrchestrationFoundationReadiness", "MetadataConstant"),
  foundationApi("IntakeOrchestrationFoundationPlatform", "Aggregate"),
  foundationApi("getIntakeOrchestrationFoundationSummary", "Helper"),
]);

const references = Object.freeze({
  catalogId: "NEA-7:1/ReferenceCatalog",
  sourcePhase: "NEA-7:1" as const,
  referenceGroups: IntakeOrchestrationContractCatalog.referenceGroups,
  referenceGroupCount: IntakeOrchestrationContractCatalog.referenceGroupCount,
  resolvesAtRuntime: false as const,
  duplicatesUpstreamContent: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const attachments = Object.freeze({
  catalogId: "NEA-7:1/AttachmentCatalog",
  sourcePhase: "NEA-7:1" as const,
  attachmentKinds: IntakeOrchestrationContractCatalog.attachmentKinds,
  attachmentKindCount: IntakeOrchestrationContractCatalog.attachmentKindCount,
  storesFiles: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const results = Object.freeze({
  catalogId: "NEA-7:1/ResultCatalog",
  sourcePhase: "NEA-7:1" as const,
  results: IntakeOrchestrationContractCatalog.results,
  resultCount: IntakeOrchestrationContractCatalog.resultCount,
  processesAtRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const metadata = Object.freeze({
  metadataId: "NEA-7:1/IntakeOrchestrationFoundationMetadata",
  sourcePhase: "NEA-7:1" as const,
  foundationStatus: IntakeOrchestrationFoundationStatus,
  foundationVersion: IntakeOrchestrationFoundationVersion,
  publicIndexId: MessageNormalizationPublicIndexId,
  architectureVersion: "NEA-7.0.0" as const,
  contractCount: IntakeOrchestrationContractCatalog.contractCount,
  canonicalExecutiveIntakePackageCount:
    IntakeOrchestrationContractCatalog.canonicalExecutiveIntakePackageCount,
  referenceGroupCount: IntakeOrchestrationContractCatalog.referenceGroupCount,
  attachmentKindCount: IntakeOrchestrationContractCatalog.attachmentKindCount,
  resultCount: IntakeOrchestrationContractCatalog.resultCount,
  capabilityCount: IntakeOrchestrationCapabilityCatalog.capabilityCount,
  lifecycleStateCount: IntakeOrchestrationLifecycle.stateCount,
  nextPhase: "NEA-7:2 — Intake Orchestration Registry",
  countsHardcoded: false as const,
  executesOrchestration: false as const,
  interpretsBusinessMeaning: false as const,
  invokesDkl: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Build deterministic frozen Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
function buildIntakeOrchestrationFoundationSummary(): IntakeOrchestrationFoundationSummary {
  return Object.freeze({
    foundationId: IntakeOrchestrationFoundationId,
    version: IntakeOrchestrationFoundationVersion,
    name: IntakeOrchestrationFoundationName,
    namespace: IntakeOrchestrationFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-7:1" as const,
    status: IntakeOrchestrationFoundationStatus,
    readiness: IntakeOrchestrationFoundationReadiness,
    publicIndexId: MessageNormalizationPublicIndexId,
    contractCount: IntakeOrchestrationContractCatalog.contractCount,
    canonicalExecutiveIntakePackageCount:
      IntakeOrchestrationContractCatalog.canonicalExecutiveIntakePackageCount,
    referenceGroupCount:
      IntakeOrchestrationContractCatalog.referenceGroupCount,
    attachmentKindCount:
      IntakeOrchestrationContractCatalog.attachmentKindCount,
    resultCount: IntakeOrchestrationContractCatalog.resultCount,
    capabilityCount: IntakeOrchestrationCapabilityCatalog.capabilityCount,
    lifecycleStateCount: IntakeOrchestrationLifecycle.stateCount,
    ownershipCount: IntakeOrchestrationOwnership.ownsCount,
    nonOwnershipCount: IntakeOrchestrationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationBoundaries.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: metadata.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Intake Orchestration Foundation platform.
 * Metadata only. No runtime orchestration, execution, or AI.
 */
export const IntakeOrchestrationFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: IntakeOrchestrationContractCatalog,
  references,
  attachments,
  results,
  capabilities: IntakeOrchestrationCapabilityCatalog,
  lifecycle: IntakeOrchestrationLifecycle,
  ownership: IntakeOrchestrationOwnership,
  boundaries: IntakeOrchestrationBoundaries,
  metadata,
  summary: buildIntakeOrchestrationFoundationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-7:1/FoundationReadiness",
    readiness: IntakeOrchestrationFoundationReadiness,
    nextPhase: metadata.nextPhase,
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeOrchestrationImplemented: false as const,
    claimsDklInvoked: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationFoundationStatus,
  nextPhase: metadata.nextPhase,
  downstreamReadiness: IntakeOrchestrationFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  executesOrchestration: false as const,
  executesRouting: false as const,
  executesNormalization: false as const,
  buildsBusinessObjects: false as const,
  interpretsBusinessMeaning: false as const,
  parsesMessages: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getIntakeOrchestrationFoundationSummary(): IntakeOrchestrationFoundationSummary {
  return buildIntakeOrchestrationFoundationSummary();
}
