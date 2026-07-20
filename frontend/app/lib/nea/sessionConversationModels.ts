/**
 * NEA-3:3 — Session & Conversation Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No business logic. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:3.
 */

import {
  SessionConversationRegistryId,
  SessionConversationRegistryPlatform,
} from "./sessionConversationRegistry.ts";
import type {
  ConversationIdentityModel,
  SessionConversationModelKindDescriptor,
  SessionIdentityModel,
} from "./sessionConversationModelTypes.ts";

const registry = SessionConversationRegistryPlatform;

const kind = (
  modelKind: SessionConversationModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: SessionConversationModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: SessionConversationModelKindDescriptor["composesModels"],
  order: number,
): SessionConversationModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Session & Conversation domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const SessionConversationDomainModels: readonly SessionConversationModelKindDescriptor[] =
  Object.freeze([
    kind(
      "SessionIdentity",
      "Session Identity Model",
      "Immutable session identity structure.",
      Object.freeze(["sessionIdentities"]),
      5,
      Object.freeze([]),
      1,
    ),
    kind(
      "ConversationIdentity",
      "Conversation Identity Model",
      "Immutable conversation identity structure.",
      Object.freeze(["conversationIdentities"]),
      6,
      Object.freeze([]),
      2,
    ),
    kind(
      "Session",
      "Session Model",
      "Session metadata composed from Registry references.",
      Object.freeze(["sessionIdentities", "sessionStates", "statuses"]),
      6,
      Object.freeze(["SessionIdentity", "SessionState"]),
      3,
    ),
    kind(
      "Conversation",
      "Conversation Model",
      "Conversation metadata composed from Registry references.",
      Object.freeze([
        "conversationIdentities",
        "conversationTypes",
        "conversationStates",
      ]),
      7,
      Object.freeze([
        "ConversationIdentity",
        "ConversationType",
        "ConversationState",
      ]),
      4,
    ),
    kind(
      "Participant",
      "Participant Model",
      "Participant metadata from Registry.",
      Object.freeze(["participants"]),
      3,
      Object.freeze([]),
      5,
    ),
    kind(
      "MessageReference",
      "Message Reference Model",
      "Message reference metadata — no message storage.",
      Object.freeze(["messageReferenceTypes", "correlationTypes"]),
      6,
      Object.freeze(["Correlation"]),
      6,
    ),
    kind(
      "ConversationContext",
      "Conversation Context Model",
      "Immutable conversation context dimensions from Registry.",
      Object.freeze(["contextDimensions"]),
      7,
      Object.freeze([]),
      7,
    ),
    kind(
      "Correlation",
      "Correlation Model",
      "Correlation metadata only — no runtime tracing.",
      Object.freeze(["correlationTypes"]),
      3,
      Object.freeze([]),
      8,
    ),
    kind(
      "Trace",
      "Trace Model",
      "Trace metadata only — no runtime tracing.",
      Object.freeze(["traceTypes"]),
      3,
      Object.freeze([]),
      9,
    ),
    kind(
      "SessionLifecycle",
      "Session Lifecycle Model",
      "Session lifecycle metadata from Registry.",
      Object.freeze(["sessionStates", "lifecycleEntries"]),
      4,
      Object.freeze(["SessionState"]),
      10,
    ),
    kind(
      "ConversationLifecycle",
      "Conversation Lifecycle Model",
      "Conversation lifecycle metadata from Registry.",
      Object.freeze(["conversationStates", "lifecycleEntries"]),
      4,
      Object.freeze(["ConversationState"]),
      11,
    ),
    kind(
      "ConversationState",
      "Conversation State Model",
      "Canonical conversation state metadata.",
      Object.freeze(["conversationStates"]),
      2,
      Object.freeze([]),
      12,
    ),
    kind(
      "SessionState",
      "Session State Model",
      "Canonical session state metadata.",
      Object.freeze(["sessionStates"]),
      2,
      Object.freeze([]),
      13,
    ),
    kind(
      "ConversationType",
      "Conversation Type Model",
      "Canonical conversation classification metadata.",
      Object.freeze(["conversationTypes"]),
      3,
      Object.freeze([]),
      14,
    ),
    kind(
      "SessionMetadata",
      "Session Metadata Model",
      "Immutable session metadata structure.",
      Object.freeze(["sessionIdentities", "statuses"]),
      5,
      Object.freeze(["SessionIdentity"]),
      15,
    ),
    kind(
      "ConversationMetadata",
      "Conversation Metadata Model",
      "Immutable conversation metadata structure.",
      Object.freeze(["conversationIdentities", "statuses"]),
      5,
      Object.freeze(["ConversationIdentity"]),
      16,
    ),
    kind(
      "ConversationConfiguration",
      "Conversation Configuration Model",
      "Declarative configuration metadata — no executable configuration.",
      Object.freeze(["conversationTypes", "contextDimensions"]),
      5,
      Object.freeze(["ConversationType", "ConversationContext"]),
      17,
    ),
    kind(
      "ConversationDiagnostics",
      "Conversation Diagnostics Model",
      "Conversation diagnostics metadata structure.",
      Object.freeze(["conversationStates", "statuses"]),
      4,
      Object.freeze(["ConversationState"]),
      18,
    ),
    kind(
      "ConversationResult",
      "Conversation Result Model",
      "Conversation processing metadata — no execution.",
      Object.freeze(["statuses", "conversationStates"]),
      5,
      Object.freeze(["ConversationDiagnostics"]),
      19,
    ),
    kind(
      "ConversationSummary",
      "Conversation Summary Model",
      "Immutable conversation summary composed from domain models.",
      Object.freeze([
        "conversationIdentities",
        "sessionIdentities",
        "statuses",
      ]),
      8,
      Object.freeze([
        "Conversation",
        "Session",
        "ConversationResult",
      ]),
      20,
    ),
  ]);

/**
 * Session identity model instances derived from Registry session identities.
 * Structure only — no runtime session management.
 */
export const SessionIdentityModels: readonly SessionIdentityModel[] =
  Object.freeze(
    registry.collections.sessionIdentities.map((item) =>
      Object.freeze({
        modelKind: "SessionIdentity" as const,
        sessionId: item.sessionId,
        sessionVersion: item.sessionVersion,
        sessionState: item.sessionState,
        sessionLifecycle: item.sessionLifecycle,
        sessionStatus: item.sessionStatus,
        registryIdentityRef: item.sessionId,
        managesRuntimeSession: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/**
 * Conversation identity model instances derived from Registry conversation identities.
 * Structure only — no runtime conversation processing.
 */
export const ConversationIdentityModels: readonly ConversationIdentityModel[] =
  Object.freeze(
    registry.collections.conversationIdentities.map((item) =>
      Object.freeze({
        modelKind: "ConversationIdentity" as const,
        conversationId: item.conversationId,
        conversationVersion: item.conversationVersion,
        conversationType: item.conversationType,
        conversationState: item.conversationLifecycle,
        conversationLifecycle: item.conversationLifecycle,
        conversationStatus: item.conversationStatus,
        registryIdentityRef: item.conversationId,
        managesRuntimeConversation: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Registry anchors — counts derived from Registry collections by reference. */
export const SessionConversationModelRegistryAnchors = Object.freeze({
  registryId: SessionConversationRegistryId,
  sourcePhase: "NEA-3:3" as const,
  sessionIdentityCount: registry.collections.sessionIdentityCount,
  conversationIdentityCount: registry.collections.conversationIdentityCount,
  participantRoleCount: registry.collections.participantRoleCount,
  conversationTypeCount: registry.collections.conversationTypeCount,
  sessionStateCount: registry.collections.sessionStateCount,
  conversationStateCount: registry.collections.conversationStateCount,
  contextDimensionCount: registry.collections.contextDimensionCount,
  messageReferenceTypeCount: registry.collections.messageReferenceTypeCount,
  correlationTypeCount: registry.collections.correlationTypeCount,
  traceTypeCount: registry.collections.traceTypeCount,
  lifecycleEntryCount: registry.collections.lifecycleEntryCount,
  statusCount: registry.collections.statusCount,
  capabilityCount: registry.capabilities.capabilityCount,
  policyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const SessionConversationDomainModelCatalog = Object.freeze({
  catalogId: "NEA-3:3/DomainModelCatalog",
  sourcePhase: "NEA-3:3" as const,
  models: SessionConversationDomainModels,
  modelCount: SessionConversationDomainModels.length,
  sessionIdentityModels: SessionIdentityModels,
  sessionIdentityModelCount: SessionIdentityModels.length,
  conversationIdentityModels: ConversationIdentityModels,
  conversationIdentityModelCount: ConversationIdentityModels.length,
  registryAnchors: SessionConversationModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
