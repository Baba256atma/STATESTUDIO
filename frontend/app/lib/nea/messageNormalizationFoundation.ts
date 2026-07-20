/**
 * NEA-6:1 — Message Normalization Foundation.
 *
 * Immutable architectural foundation for Message Normalization.
 * Consumes only NEA-5 Gateway Routing Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-6:1.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationFoundationId
 *   MessageNormalizationFoundationVersion
 *   MessageNormalizationFoundationName
 *   MessageNormalizationFoundationNamespace
 *   MessageNormalizationFoundationStatus
 *   MessageNormalizationFoundationReadiness
 *   MessageNormalizationFoundationPlatform
 *   getMessageNormalizationFoundationSummary()
 */

import { MessageNormalizationBoundaries } from "./messageNormalizationBoundaries.ts";
import { MessageNormalizationCapabilityCatalog } from "./messageNormalizationCapabilities.ts";
import { MessageNormalizationContractCatalog } from "./messageNormalizationContracts.ts";
import type {
  MessageNormalizationFoundationIdentity,
  MessageNormalizationFoundationSummary,
} from "./messageNormalizationFoundationTypes.ts";
import { MessageNormalizationLifecycle } from "./messageNormalizationLifecycle.ts";
import { MessageNormalizationOwnership } from "./messageNormalizationOwnership.ts";
import {
  GatewayRoutingPublicIndexId,
  GatewayRoutingPublicIndexNamespace,
  GatewayRoutingPublicIndexVersion,
} from "./gatewayRoutingPublicIndex.ts";

/** Canonical foundation identity. */
export const MessageNormalizationFoundationId =
  "NEA-6:1/MessageNormalizationFoundation" as const;

/** Human-readable foundation name. */
export const MessageNormalizationFoundationName =
  "Message Normalization Foundation" as const;

/** Semantic version. */
export const MessageNormalizationFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationFoundationNamespace =
  "nexora.nea.message-normalization.foundation" as const;

/** Foundation status. */
export const MessageNormalizationFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: MessageNormalizationFoundationIdentity = Object.freeze({
  foundationId: MessageNormalizationFoundationId,
  foundationName: MessageNormalizationFoundationName,
  foundationVersion: MessageNormalizationFoundationVersion,
  foundationNamespace: MessageNormalizationFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-6:1" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationFoundationStatus,
  readiness: MessageNormalizationFoundationReadiness,
  description:
    "Immutable architectural foundation defining the canonical Executive Message contract, context contracts, attachment references, normalization lifecycle, capabilities, ownership, and boundaries without implementing runtime normalization, parsing, or AI.",
  publicIndexId: GatewayRoutingPublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:1/Dependency/NEA5PublicIndex",
  directPreviousPhaseModule: "gatewayRoutingPublicIndex.ts" as const,
  publicIndexOnly: true as const,
  publicIndexId: GatewayRoutingPublicIndexId,
  publicIndexVersion: GatewayRoutingPublicIndexVersion,
  publicIndexNamespace: GatewayRoutingPublicIndexNamespace,
  freezeDirectImport: false as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  circularDependency: false as const,
  canonicalPath:
    "NEA-6:1 → NEA-5 GatewayRoutingPublicIndex (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "contexts",
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
    id: `NEA-6:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:1" as const,
    section: "Foundation" as const,
    kind,
    version: MessageNormalizationFoundationVersion,
    status: MessageNormalizationFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationFoundationApiRegistry = Object.freeze([
  foundationApi("MessageNormalizationFoundationId", "IdentityConstant"),
  foundationApi("MessageNormalizationFoundationVersion", "IdentityConstant"),
  foundationApi("MessageNormalizationFoundationName", "IdentityConstant"),
  foundationApi("MessageNormalizationFoundationNamespace", "IdentityConstant"),
  foundationApi("MessageNormalizationFoundationStatus", "MetadataConstant"),
  foundationApi("MessageNormalizationFoundationReadiness", "MetadataConstant"),
  foundationApi("MessageNormalizationFoundationPlatform", "Aggregate"),
  foundationApi("getMessageNormalizationFoundationSummary", "Helper"),
]);

const contexts = Object.freeze({
  catalogId: "NEA-6:1/ContextCatalog",
  sourcePhase: "NEA-6:1" as const,
  contextDimensions: MessageNormalizationContractCatalog.contextDimensions,
  contextDimensionCount:
    MessageNormalizationContractCatalog.contextDimensionCount,
  resolvesAtRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const attachments = Object.freeze({
  catalogId: "NEA-6:1/AttachmentCatalog",
  sourcePhase: "NEA-6:1" as const,
  attachmentKinds: MessageNormalizationContractCatalog.attachmentKinds,
  attachmentKindCount: MessageNormalizationContractCatalog.attachmentKindCount,
  storesFiles: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const results = Object.freeze({
  catalogId: "NEA-6:1/ResultCatalog",
  sourcePhase: "NEA-6:1" as const,
  results: MessageNormalizationContractCatalog.results,
  resultCount: MessageNormalizationContractCatalog.resultCount,
  processesAtRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const metadata = Object.freeze({
  metadataId: "NEA-6:1/MessageNormalizationFoundationMetadata",
  sourcePhase: "NEA-6:1" as const,
  foundationStatus: MessageNormalizationFoundationStatus,
  foundationVersion: MessageNormalizationFoundationVersion,
  publicIndexId: GatewayRoutingPublicIndexId,
  architectureVersion: "NEA-6.0.0" as const,
  contractCount: MessageNormalizationContractCatalog.contractCount,
  canonicalExecutiveMessageCount:
    MessageNormalizationContractCatalog.canonicalExecutiveMessageCount,
  contextDimensionCount:
    MessageNormalizationContractCatalog.contextDimensionCount,
  attachmentKindCount: MessageNormalizationContractCatalog.attachmentKindCount,
  resultCount: MessageNormalizationContractCatalog.resultCount,
  capabilityCount: MessageNormalizationCapabilityCatalog.capabilityCount,
  lifecycleStateCount: MessageNormalizationLifecycle.stateCount,
  nextPhase: "NEA-6:2 — Message Normalization Registry",
  countsHardcoded: false as const,
  implementsRuntimeNormalization: false as const,
  interpretsBusinessMeaning: false as const,
  modifiesUserIntent: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Build deterministic frozen Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
function buildMessageNormalizationFoundationSummary(): MessageNormalizationFoundationSummary {
  return Object.freeze({
    foundationId: MessageNormalizationFoundationId,
    version: MessageNormalizationFoundationVersion,
    name: MessageNormalizationFoundationName,
    namespace: MessageNormalizationFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-6:1" as const,
    status: MessageNormalizationFoundationStatus,
    readiness: MessageNormalizationFoundationReadiness,
    publicIndexId: GatewayRoutingPublicIndexId,
    contractCount: MessageNormalizationContractCatalog.contractCount,
    canonicalExecutiveMessageCount:
      MessageNormalizationContractCatalog.canonicalExecutiveMessageCount,
    contextDimensionCount:
      MessageNormalizationContractCatalog.contextDimensionCount,
    attachmentKindCount:
      MessageNormalizationContractCatalog.attachmentKindCount,
    resultCount: MessageNormalizationContractCatalog.resultCount,
    capabilityCount: MessageNormalizationCapabilityCatalog.capabilityCount,
    lifecycleStateCount: MessageNormalizationLifecycle.stateCount,
    ownershipCount: MessageNormalizationOwnership.ownsCount,
    nonOwnershipCount: MessageNormalizationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      MessageNormalizationBoundaries.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: metadata.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Message Normalization Foundation platform.
 * Metadata only. No runtime normalization, parsing, or AI.
 */
export const MessageNormalizationFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: MessageNormalizationContractCatalog,
  contexts,
  attachments,
  results,
  capabilities: MessageNormalizationCapabilityCatalog,
  lifecycle: MessageNormalizationLifecycle,
  ownership: MessageNormalizationOwnership,
  boundaries: MessageNormalizationBoundaries,
  metadata,
  summary: buildMessageNormalizationFoundationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-6:1/FoundationReadiness",
    readiness: MessageNormalizationFoundationReadiness,
    nextPhase: metadata.nextPhase,
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeNormalizationImplemented: false as const,
    claimsMessageParsingImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationFoundationStatus,
  nextPhase: metadata.nextPhase,
  downstreamReadiness: MessageNormalizationFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeNormalization: false as const,
  parsesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  modifiesUserIntent: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  implementsOauth: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getMessageNormalizationFoundationSummary(): MessageNormalizationFoundationSummary {
  return buildMessageNormalizationFoundationSummary();
}
