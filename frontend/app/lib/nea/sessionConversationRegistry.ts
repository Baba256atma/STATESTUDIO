/**
 * NEA-3:2 — Session & Conversation Registry.
 *
 * Canonical immutable registry for Session & Conversation vocabularies and lookups.
 * Consumes only NEA-3:1 Session & Conversation Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-3:2.
 *
 * Public exports (exactly 8):
 *   SessionConversationRegistryId
 *   SessionConversationRegistryVersion
 *   SessionConversationRegistryName
 *   SessionConversationRegistryNamespace
 *   SessionConversationRegistryStatus
 *   SessionConversationRegistryReadiness
 *   SessionConversationRegistryPlatform
 *   getSessionConversationRegistrySummary()
 */

import {
  SessionConversationFoundationId,
  SessionConversationFoundationPlatform,
  SessionConversationFoundationVersion,
} from "./sessionConversationFoundation.ts";
import { SessionConversationCapabilityRegistryCatalog } from "./sessionConversationRegistryCapabilities.ts";
import { SessionConversationRegistryCollections } from "./sessionConversationRegistryCollections.ts";
import { SessionConversationRegistryMetadata } from "./sessionConversationRegistryMetadata.ts";
import {
  SessionConversationRegistryBoundaries,
  SessionConversationRegistryOwnership,
} from "./sessionConversationRegistryOwnership.ts";
import { SessionConversationPolicyRegistryCatalog } from "./sessionConversationRegistryPolicies.ts";
import type {
  SessionConversationRegistryIdentity,
  SessionConversationRegistrySummary,
} from "./sessionConversationRegistryTypes.ts";

/** Canonical registry identity. */
export const SessionConversationRegistryId =
  "NEA-3:2/SessionConversationRegistry" as const;

/** Human-readable registry name. */
export const SessionConversationRegistryName =
  "Session & Conversation Registry" as const;

/** Semantic version. */
export const SessionConversationRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationRegistryNamespace =
  "nexora.nea.session-conversation.registry" as const;

/** Registry status. */
export const SessionConversationRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const SessionConversationRegistryReadiness = "ReadyForModel" as const;

const identity: SessionConversationRegistryIdentity = Object.freeze({
  registryId: SessionConversationRegistryId,
  registryName: SessionConversationRegistryName,
  registryVersion: SessionConversationRegistryVersion,
  registryNamespace: SessionConversationRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-3:2" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationRegistryStatus,
  readiness: SessionConversationRegistryReadiness,
  foundationId: SessionConversationFoundationId,
  foundationVersion: SessionConversationFoundationVersion,
  description:
    "Canonical immutable registry of Session & Conversation identities, participant roles, conversation types, states, context dimensions, message references, correlation, traces, capabilities, lifecycle, statuses, and policies.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:2/Dependency/NEA31Foundation",
  directPreviousPhaseModule: "sessionConversationFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: SessionConversationFoundationId,
  foundationVersion: SessionConversationFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-3:2 → NEA-3:1 SessionConversationFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-3:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:2" as const,
    section: "Registry" as const,
    kind,
    version: SessionConversationRegistryVersion,
    status: SessionConversationRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationRegistryApiRegistry = Object.freeze([
  registryApi("SessionConversationRegistryId", "IdentityConstant"),
  registryApi("SessionConversationRegistryVersion", "IdentityConstant"),
  registryApi("SessionConversationRegistryName", "IdentityConstant"),
  registryApi("SessionConversationRegistryNamespace", "IdentityConstant"),
  registryApi("SessionConversationRegistryStatus", "MetadataConstant"),
  registryApi("SessionConversationRegistryReadiness", "MetadataConstant"),
  registryApi("SessionConversationRegistryPlatform", "Aggregate"),
  registryApi("getSessionConversationRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Session & Conversation Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const SessionConversationRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: SessionConversationRegistryCollections,
  capabilities: SessionConversationCapabilityRegistryCatalog,
  policies: SessionConversationPolicyRegistryCatalog,
  metadata: SessionConversationRegistryMetadata,
  ownership: SessionConversationRegistryOwnership,
  boundaries: SessionConversationRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-3:2/RegistryReadiness",
    readiness: SessionConversationRegistryReadiness,
    nextPhase: SessionConversationRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsSessionsManaged: false as const,
    claimsConversationsManaged: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationRegistryStatus,
  nextPhase: SessionConversationRegistryMetadata.nextPhase,
  downstreamReadiness: SessionConversationRegistryReadiness,
  foundationPlatform: SessionConversationFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Session & Conversation Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getSessionConversationRegistrySummary(): SessionConversationRegistrySummary {
  const meta = SessionConversationRegistryMetadata;
  return Object.freeze({
    registryId: SessionConversationRegistryId,
    version: SessionConversationRegistryVersion,
    name: SessionConversationRegistryName,
    namespace: SessionConversationRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-3:2" as const,
    status: SessionConversationRegistryStatus,
    readiness: SessionConversationRegistryReadiness,
    foundationId: SessionConversationFoundationId,
    sessionIdentityCount: meta.sessionIdentityCount,
    conversationIdentityCount: meta.conversationIdentityCount,
    participantRoleCount: meta.participantRoleCount,
    conversationTypeCount: meta.conversationTypeCount,
    sessionStateCount: meta.sessionStateCount,
    conversationStateCount: meta.conversationStateCount,
    contextDimensionCount: meta.contextDimensionCount,
    messageReferenceTypeCount: meta.messageReferenceTypeCount,
    correlationTypeCount: meta.correlationTypeCount,
    traceTypeCount: meta.traceTypeCount,
    capabilityCount: meta.capabilityCount,
    lifecycleEntryCount: meta.lifecycleEntryCount,
    statusCount: meta.statusCount,
    policyCount: meta.policyCount,
    totalRegistryEntryCount: meta.totalEntryCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
