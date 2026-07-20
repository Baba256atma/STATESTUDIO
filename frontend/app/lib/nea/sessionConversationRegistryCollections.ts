/**
 * NEA-3:2 — Session & Conversation Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation participants, lifecycle, and context are referenced — not duplicated.
 * Registry-owned vocabularies are declared here.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:2.
 */

import {
  SessionConversationFoundationId,
  SessionConversationFoundationPlatform,
} from "./sessionConversationFoundation.ts";
import type {
  ConversationIdentityDeclaration,
  SessionConversationCorrelationTypeId,
  SessionConversationMessageReferenceTypeId,
  SessionConversationRegistryEntry,
  SessionConversationStatusId,
  SessionConversationTraceTypeId,
  SessionConversationTypeId,
  SessionIdentityDeclaration,
} from "./sessionConversationRegistryTypes.ts";

const foundation = SessionConversationFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-3:1" | "NEA-3:2",
  foundationReference: string | null,
  order: number,
): SessionConversationRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Participant registry — Foundation canonical references preserved. */
export const SessionConversationParticipantRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze(
    foundation.participants.map((item) =>
      entry(
        item.participantRoleId,
        item.participantRoleName,
        item.description,
        "NEA-3:1",
        `${SessionConversationFoundationId}/participants/${item.participantRoleId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Session state registry — Foundation canonical references preserved. */
export const SessionStateRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.session.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation session lifecycle state ${state}.`,
        "NEA-3:1",
        `${SessionConversationFoundationId}/lifecycle/session/${state}`,
        index + 1,
      ),
    ),
  );

/** Conversation state registry — Foundation canonical references preserved. */
export const ConversationStateRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.conversation.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation conversation lifecycle state ${state}.`,
        "NEA-3:1",
        `${SessionConversationFoundationId}/lifecycle/conversation/${state}`,
        index + 1,
      ),
    ),
  );

/** Context dimension registry — Foundation canonical references preserved. */
export const SessionConversationContextRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze(
    foundation.contracts.contextDimensions.map((dimension, index) =>
      entry(
        dimension,
        dimension,
        `Foundation conversation context dimension ${dimension}.`,
        "NEA-3:1",
        `${SessionConversationFoundationId}/context/${dimension}`,
        index + 1,
      ),
    ),
  );

/** Combined lifecycle registry — session and conversation Foundation states. */
export const SessionConversationLifecycleRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    ...SessionStateRegistry.map((item) =>
      entry(
        `Session/${item.id}`,
        `Session ${item.label}`,
        item.description,
        "NEA-3:1",
        item.foundationReference,
        item.deterministicOrder,
      ),
    ),
    ...ConversationStateRegistry.map((item) =>
      entry(
        `Conversation/${item.id}`,
        `Conversation ${item.label}`,
        item.description,
        "NEA-3:1",
        item.foundationReference,
        SessionStateRegistry.length + item.deterministicOrder,
      ),
    ),
  ]);

const conversationType = (
  id: SessionConversationTypeId,
  label: string,
  description: string,
  order: number,
): SessionConversationRegistryEntry =>
  entry(id, label, description, "NEA-3:2", null, order);

/** Conversation type registry — Registry-owned. */
export const SessionConversationTypeRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    conversationType(
      "ExecutiveConversation",
      "Executive Conversation",
      "Executive conversation type classification.",
      1,
    ),
    conversationType(
      "AdvisoryConversation",
      "Advisory Conversation",
      "Advisory conversation type classification.",
      2,
    ),
    conversationType(
      "OperationalConversation",
      "Operational Conversation",
      "Operational conversation type classification.",
      3,
    ),
    conversationType(
      "SupportConversation",
      "Support Conversation",
      "Support conversation type classification.",
      4,
    ),
    conversationType(
      "NotificationConversation",
      "Notification Conversation",
      "Notification conversation type classification.",
      5,
    ),
    conversationType(
      "SystemConversation",
      "System Conversation",
      "System conversation type classification.",
      6,
    ),
    conversationType(
      "ExternalConversation",
      "External Conversation",
      "External conversation type classification.",
      7,
    ),
    conversationType(
      "InternalConversation",
      "Internal Conversation",
      "Internal conversation type classification.",
      8,
    ),
  ]);

const messageRef = (
  id: SessionConversationMessageReferenceTypeId,
  description: string,
  order: number,
): SessionConversationRegistryEntry =>
  entry(id, id, description, "NEA-3:2", null, order);

/** Message reference type registry — Registry-owned. */
export const SessionConversationMessageReferenceRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    messageRef("Root", "Root message reference type.", 1),
    messageRef("Parent", "Parent message reference type.", 2),
    messageRef("Reply", "Reply message reference type.", 3),
    messageRef("Forward", "Forward message reference type.", 4),
    messageRef("Reference", "Generic message reference type.", 5),
    messageRef("System", "System message reference type.", 6),
  ]);

const correlation = (
  id: SessionConversationCorrelationTypeId,
  description: string,
  order: number,
): SessionConversationRegistryEntry =>
  entry(id, id, description, "NEA-3:2", null, order);

/** Correlation type registry — Registry-owned. */
export const SessionConversationCorrelationRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    correlation("CorrelationId", "Correlation identifier metadata type.", 1),
    correlation("TraceId", "Trace identifier metadata type.", 2),
    correlation(
      "ConversationGroup",
      "Conversation group correlation metadata type.",
      3,
    ),
    correlation("SessionGroup", "Session group correlation metadata type.", 4),
  ]);

const trace = (
  id: SessionConversationTraceTypeId,
  description: string,
  order: number,
): SessionConversationRegistryEntry =>
  entry(id, id, description, "NEA-3:2", null, order);

/** Trace type registry — Registry-owned. */
export const SessionConversationTraceRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    trace("RootTrace", "Root trace metadata type.", 1),
    trace("ChildTrace", "Child trace metadata type.", 2),
    trace("SessionTrace", "Session-scoped trace metadata type.", 3),
    trace("ConversationTrace", "Conversation-scoped trace metadata type.", 4),
  ]);

const status = (
  id: SessionConversationStatusId,
  description: string,
  order: number,
): SessionConversationRegistryEntry =>
  entry(id, id, description, "NEA-3:2", null, order);

/** Status registry — Registry-owned. */
export const SessionConversationStatusRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    status("Declared", "Architecture declared status.", 1),
    status("Registered", "Architecture registered status.", 2),
    status("Certified", "Architecture certified status.", 3),
    status("Frozen", "Architecture frozen status.", 4),
    status("Deprecated", "Architecture deprecated status.", 5),
  ]);

const sessionIdentity = (
  key: string,
  sessionName: string,
  sessionState: string,
  order: number,
): SessionIdentityDeclaration =>
  Object.freeze({
    sessionId: `NEA-3:2/Session/${key}`,
    sessionName,
    sessionVersion: "1.0.0" as const,
    sessionState,
    sessionLifecycle: "Created→Active→Suspended→Closed",
    sessionStatus: "Registered" as const,
    managesRuntimeSession: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Session identity registry — one declarative identity per conversation type pairing.
 * Identity is declarative only. No runtime sessions.
 */
export const SessionIdentityRegistry: readonly SessionIdentityDeclaration[] =
  Object.freeze([
    sessionIdentity("Executive", "Executive Session", "Active", 1),
    sessionIdentity("Advisory", "Advisory Session", "Active", 2),
    sessionIdentity("Operational", "Operational Session", "Active", 3),
    sessionIdentity("Support", "Support Session", "Active", 4),
    sessionIdentity("Notification", "Notification Session", "Created", 5),
    sessionIdentity("System", "System Session", "Active", 6),
    sessionIdentity("External", "External Session", "Active", 7),
    sessionIdentity("Internal", "Internal Session", "Active", 8),
  ]);

const conversationIdentity = (
  typeId: SessionConversationTypeId,
  conversationName: string,
  conversationLifecycle: string,
  order: number,
): ConversationIdentityDeclaration =>
  Object.freeze({
    conversationId: `NEA-3:2/Conversation/${typeId}`,
    conversationName,
    conversationVersion: "1.0.0" as const,
    conversationType: typeId,
    conversationStatus: "Registered" as const,
    conversationLifecycle,
    managesRuntimeConversation: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Conversation identity registry — one declarative identity per conversation type.
 * Identity is declarative only. No runtime conversations.
 */
export const ConversationIdentityRegistry: readonly ConversationIdentityDeclaration[] =
  Object.freeze([
    conversationIdentity(
      "ExecutiveConversation",
      "Executive Conversation",
      "Active",
      1,
    ),
    conversationIdentity(
      "AdvisoryConversation",
      "Advisory Conversation",
      "Active",
      2,
    ),
    conversationIdentity(
      "OperationalConversation",
      "Operational Conversation",
      "Active",
      3,
    ),
    conversationIdentity(
      "SupportConversation",
      "Support Conversation",
      "Waiting",
      4,
    ),
    conversationIdentity(
      "NotificationConversation",
      "Notification Conversation",
      "Started",
      5,
    ),
    conversationIdentity(
      "SystemConversation",
      "System Conversation",
      "Active",
      6,
    ),
    conversationIdentity(
      "ExternalConversation",
      "External Conversation",
      "Active",
      7,
    ),
    conversationIdentity(
      "InternalConversation",
      "Internal Conversation",
      "Active",
      8,
    ),
  ]);

/** Aggregate collections object for platform composition. */
export const SessionConversationRegistryCollections = Object.freeze({
  collectionsId: "NEA-3:2/RegistryCollections",
  sourcePhase: "NEA-3:2" as const,
  sessionIdentities: SessionIdentityRegistry,
  conversationIdentities: ConversationIdentityRegistry,
  participants: SessionConversationParticipantRegistry,
  conversationTypes: SessionConversationTypeRegistry,
  sessionStates: SessionStateRegistry,
  conversationStates: ConversationStateRegistry,
  contextDimensions: SessionConversationContextRegistry,
  messageReferenceTypes: SessionConversationMessageReferenceRegistry,
  correlationTypes: SessionConversationCorrelationRegistry,
  traceTypes: SessionConversationTraceRegistry,
  lifecycleEntries: SessionConversationLifecycleRegistry,
  statuses: SessionConversationStatusRegistry,
  sessionIdentityCount: SessionIdentityRegistry.length,
  conversationIdentityCount: ConversationIdentityRegistry.length,
  participantRoleCount: SessionConversationParticipantRegistry.length,
  conversationTypeCount: SessionConversationTypeRegistry.length,
  sessionStateCount: SessionStateRegistry.length,
  conversationStateCount: ConversationStateRegistry.length,
  contextDimensionCount: SessionConversationContextRegistry.length,
  messageReferenceTypeCount:
    SessionConversationMessageReferenceRegistry.length,
  correlationTypeCount: SessionConversationCorrelationRegistry.length,
  traceTypeCount: SessionConversationTraceRegistry.length,
  lifecycleEntryCount: SessionConversationLifecycleRegistry.length,
  statusCount: SessionConversationStatusRegistry.length,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
