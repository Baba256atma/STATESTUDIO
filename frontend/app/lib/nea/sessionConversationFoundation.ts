/**
 * NEA-3:1 — Session & Conversation Foundation.
 *
 * Immutable architectural foundation for Executive Session & Conversation.
 * Consumes only NEA-2 Channel Connectors Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-3:1.
 *
 * Public exports (exactly 8):
 *   SessionConversationFoundationId
 *   SessionConversationFoundationVersion
 *   SessionConversationFoundationName
 *   SessionConversationFoundationNamespace
 *   SessionConversationFoundationStatus
 *   SessionConversationFoundationReadiness
 *   SessionConversationFoundationPlatform
 *   getSessionConversationFoundationSummary()
 */

import { SessionConversationBoundaries } from "./sessionConversationBoundaries.ts";
import { SessionConversationCapabilityCatalog } from "./sessionConversationCapabilities.ts";
import { SessionConversationContractCatalog } from "./sessionConversationContracts.ts";
import type {
  SessionConversationFoundationIdentity,
  SessionConversationFoundationSummary,
} from "./sessionConversationFoundationTypes.ts";
import { SessionConversationLifecycle } from "./sessionConversationLifecycle.ts";
import { SessionConversationOwnership } from "./sessionConversationOwnership.ts";
import {
  ChannelConnectorPublicIndexId,
  ChannelConnectorPublicIndexNamespace,
  ChannelConnectorPublicIndexVersion,
} from "./channelConnectorPublicIndex.ts";

/** Canonical foundation identity. */
export const SessionConversationFoundationId =
  "NEA-3:1/SessionConversationFoundation" as const;

/** Human-readable foundation name. */
export const SessionConversationFoundationName =
  "Session & Conversation Foundation" as const;

/** Semantic version. */
export const SessionConversationFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationFoundationNamespace =
  "nexora.nea.session-conversation.foundation" as const;

/** Foundation status. */
export const SessionConversationFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const SessionConversationFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: SessionConversationFoundationIdentity = Object.freeze({
  foundationId: SessionConversationFoundationId,
  foundationName: SessionConversationFoundationName,
  foundationVersion: SessionConversationFoundationVersion,
  foundationNamespace: SessionConversationFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-3:1" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationFoundationStatus,
  readiness: SessionConversationFoundationReadiness,
  description:
    "Immutable architectural foundation defining contracts, vocabularies, capabilities, lifecycle, ownership, and boundaries for conversations through the Executive Gateway without implementing runtime session management or message processing.",
  publicIndexId: ChannelConnectorPublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:1/Dependency/NEA2PublicIndex",
  directPreviousPhaseModule: "channelConnectorPublicIndex.ts" as const,
  publicIndexOnly: true as const,
  publicIndexId: ChannelConnectorPublicIndexId,
  publicIndexVersion: ChannelConnectorPublicIndexVersion,
  publicIndexNamespace: ChannelConnectorPublicIndexNamespace,
  freezeDirectImport: false as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  circularDependency: false as const,
  canonicalPath:
    "NEA-3:1 → NEA-2 ChannelConnectorPublicIndex (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "participants",
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
    id: `NEA-3:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:1" as const,
    section: "Foundation" as const,
    kind,
    version: SessionConversationFoundationVersion,
    status: SessionConversationFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationFoundationApiRegistry = Object.freeze([
  foundationApi("SessionConversationFoundationId", "IdentityConstant"),
  foundationApi("SessionConversationFoundationVersion", "IdentityConstant"),
  foundationApi("SessionConversationFoundationName", "IdentityConstant"),
  foundationApi("SessionConversationFoundationNamespace", "IdentityConstant"),
  foundationApi("SessionConversationFoundationStatus", "MetadataConstant"),
  foundationApi("SessionConversationFoundationReadiness", "MetadataConstant"),
  foundationApi("SessionConversationFoundationPlatform", "Aggregate"),
  foundationApi("getSessionConversationFoundationSummary", "Helper"),
]);

const metadata = Object.freeze({
  metadataId: "NEA-3:1/SessionConversationFoundationMetadata",
  sourcePhase: "NEA-3:1" as const,
  foundationStatus: SessionConversationFoundationStatus,
  foundationVersion: SessionConversationFoundationVersion,
  publicIndexId: ChannelConnectorPublicIndexId,
  architectureVersion: "NEA-3.0.0" as const,
  contractCount: SessionConversationContractCatalog.contractCount,
  participantRoleCount: SessionConversationContractCatalog.participantRoleCount,
  contextDimensionCount:
    SessionConversationContractCatalog.contextDimensionCount,
  messageReferenceFieldCount:
    SessionConversationContractCatalog.messageReferenceFieldCount,
  capabilityCount: SessionConversationCapabilityCatalog.capabilityCount,
  sessionLifecycleStateCount:
    SessionConversationLifecycle.sessionLifecycleStateCount,
  conversationLifecycleStateCount:
    SessionConversationLifecycle.conversationLifecycleStateCount,
  nextPhase: "NEA-3:2 — Session & Conversation Registry",
  countsHardcoded: false as const,
  managesRuntimeSessions: false as const,
  processesMessages: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Build deterministic frozen Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
function buildSessionConversationFoundationSummary(): SessionConversationFoundationSummary {
  return Object.freeze({
    foundationId: SessionConversationFoundationId,
    version: SessionConversationFoundationVersion,
    name: SessionConversationFoundationName,
    namespace: SessionConversationFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-3:1" as const,
    status: SessionConversationFoundationStatus,
    readiness: SessionConversationFoundationReadiness,
    publicIndexId: ChannelConnectorPublicIndexId,
    contractCount: SessionConversationContractCatalog.contractCount,
    participantRoleCount:
      SessionConversationContractCatalog.participantRoleCount,
    capabilityCount: SessionConversationCapabilityCatalog.capabilityCount,
    sessionLifecycleStateCount:
      SessionConversationLifecycle.sessionLifecycleStateCount,
    conversationLifecycleStateCount:
      SessionConversationLifecycle.conversationLifecycleStateCount,
    ownershipCount: SessionConversationOwnership.ownsCount,
    nonOwnershipCount: SessionConversationOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SessionConversationBoundaries.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: metadata.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Session & Conversation Foundation platform.
 * Metadata only. No runtime sessions or message processing.
 */
export const SessionConversationFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: SessionConversationContractCatalog,
  participants: SessionConversationContractCatalog.participants,
  capabilities: SessionConversationCapabilityCatalog,
  lifecycle: SessionConversationLifecycle,
  ownership: SessionConversationOwnership,
  boundaries: SessionConversationBoundaries,
  metadata,
  summary: buildSessionConversationFoundationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-3:1/FoundationReadiness",
    readiness: SessionConversationFoundationReadiness,
    nextPhase: metadata.nextPhase,
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsSessionsManaged: false as const,
    claimsMessagesProcessed: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationFoundationStatus,
  nextPhase: metadata.nextPhase,
  downstreamReadiness: SessionConversationFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  authenticationExecution: false as const,
  authorizationExecution: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Session & Conversation Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getSessionConversationFoundationSummary(): SessionConversationFoundationSummary {
  return buildSessionConversationFoundationSummary();
}
