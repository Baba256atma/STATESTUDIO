/**
 * NEA-3:1 — Session & Conversation Contracts.
 *
 * Immutable contract declarations for Session & Conversation Foundation surfaces.
 * Declarations only. No runtime enforcement. No session or message processing.
 *
 * Ownership: owned exclusively by NEA-3:1.
 */

import type {
  SessionConversationContractDeclaration,
  SessionConversationParticipantDeclaration,
  SessionConversationParticipantRole,
} from "./sessionConversationFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): SessionConversationContractDeclaration =>
  Object.freeze({
    contractId: `NEA-3:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly fourteen session & conversation foundation contracts.
 * Order is deterministic and immutable.
 */
export const SessionConversationContracts: readonly SessionConversationContractDeclaration[] =
  Object.freeze([
    contract(
      "SessionIdentity",
      "Session Identity",
      "Canonical identity fields for a declared executive session.",
      Object.freeze([
        "sessionId",
        "sessionName",
        "sessionVersion",
        "sessionNamespace",
        "sessionKind",
      ]),
      1,
    ),
    contract(
      "SessionReference",
      "Session Reference",
      "Opaque session reference metadata — no session management.",
      Object.freeze([
        "sessionRefId",
        "sessionId",
        "conversationRef",
        "managesSession",
      ]),
      2,
    ),
    contract(
      "SessionMetadata",
      "Session Metadata",
      "Immutable session metadata declarations without runtime state.",
      Object.freeze([
        "metadataId",
        "sessionId",
        "createdRef",
        "ownerRef",
        "metadataOnly",
      ]),
      3,
    ),
    contract(
      "SessionState",
      "Session State",
      "Declarative session state vocabulary — no runtime state machine.",
      Object.freeze(["state", "description", "executesRuntime"]),
      4,
    ),
    contract(
      "ConversationIdentity",
      "Conversation Identity",
      "Canonical identity fields for a declared conversation.",
      Object.freeze([
        "conversationId",
        "conversationName",
        "conversationVersion",
        "conversationNamespace",
        "conversationKind",
      ]),
      5,
    ),
    contract(
      "ConversationReference",
      "Conversation Reference",
      "Opaque conversation reference metadata — no conversation runtime.",
      Object.freeze([
        "conversationRefId",
        "conversationId",
        "sessionRef",
        "managesConversation",
      ]),
      6,
    ),
    contract(
      "ConversationMetadata",
      "Conversation Metadata",
      "Immutable conversation metadata declarations without runtime state.",
      Object.freeze([
        "metadataId",
        "conversationId",
        "startedRef",
        "ownerRef",
        "metadataOnly",
      ]),
      7,
    ),
    contract(
      "ConversationContext",
      "Conversation Context",
      "Declarative conversation context dimensions — no context runtime.",
      Object.freeze([
        "tenant",
        "workspace",
        "channel",
        "connector",
        "locale",
        "timezone",
        "organization",
      ]),
      8,
    ),
    contract(
      "Participant",
      "Participant",
      "Closed vocabulary of participant role classifications — identity only.",
      Object.freeze([
        "participantRoleId",
        "participantRoleName",
        "description",
        "managesRuntimeParticipant",
      ]),
      9,
    ),
    contract(
      "MessageReference",
      "Message Reference",
      "Opaque message reference metadata — no message storage or processing.",
      Object.freeze([
        "messageId",
        "parentMessageId",
        "correlationId",
        "traceId",
        "sequenceNumber",
        "timestampReference",
      ]),
      10,
    ),
    contract(
      "CorrelationTraceContext",
      "Correlation & Trace Context",
      "Immutable tracing metadata declarations — no runtime tracing.",
      Object.freeze([
        "correlationId",
        "traceId",
        "spanRef",
        "parentSpanRef",
        "executesTracing",
      ]),
      11,
    ),
    contract(
      "SessionConversationLifecycle",
      "Session & Conversation Lifecycle",
      "Ordered session and conversation lifecycle states — declarative only.",
      Object.freeze([
        "sessionStates",
        "conversationStates",
        "transitions",
        "executesRuntime",
      ]),
      12,
    ),
    contract(
      "SessionConversationOwnership",
      "Session & Conversation Ownership",
      "Ownership and non-ownership declarations for foundation surfaces.",
      Object.freeze(["owns", "doesNotOwn", "ownsRuntimeSessions"]),
      13,
    ),
    contract(
      "SessionConversationBoundaries",
      "Session & Conversation Boundaries",
      "Architectural boundary and prohibited surface declarations.",
      Object.freeze([
        "consumes",
        "provides",
        "prohibitedSurfaces",
        "managesRuntimeSessions",
      ]),
      14,
    ),
  ]);

const participant = (
  participantRoleId: SessionConversationParticipantRole,
  participantRoleName: string,
  description: string,
  order: number,
): SessionConversationParticipantDeclaration =>
  Object.freeze({
    participantRoleId,
    participantRoleName,
    description,
    managesRuntimeParticipant: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical participant role catalog — identity only. */
export const SessionConversationParticipants: readonly SessionConversationParticipantDeclaration[] =
  Object.freeze([
    participant(
      "HumanUser",
      "Human User",
      "Human user participant role classification.",
      1,
    ),
    participant(
      "Executive",
      "Executive",
      "Executive participant role classification.",
      2,
    ),
    participant(
      "ExternalUser",
      "External User",
      "External user participant role classification.",
      3,
    ),
    participant(
      "ApprovedAgent",
      "Approved Agent",
      "Approved agent participant role classification.",
      4,
    ),
    participant(
      "InternalService",
      "Internal Service",
      "Internal service participant role classification.",
      5,
    ),
    participant(
      "Connector",
      "Connector",
      "Connector participant role classification.",
      6,
    ),
    participant(
      "System",
      "System",
      "System participant role classification.",
      7,
    ),
  ]);

/** Canonical conversation context dimension catalog. */
export const SESSION_CONVERSATION_CONTEXT_DIMENSIONS = Object.freeze([
  "Tenant",
  "Workspace",
  "Channel",
  "Connector",
  "Locale",
  "Timezone",
  "Organization",
] as const);

/** Canonical message reference field catalog. */
export const SESSION_CONVERSATION_MESSAGE_REFERENCE_FIELDS = Object.freeze([
  "MessageIdentity",
  "ParentMessage",
  "CorrelationId",
  "TraceId",
  "SequenceNumber",
  "TimestampReference",
] as const);

/** Canonical immutable contracts catalog. */
export const SessionConversationContractCatalog = Object.freeze({
  catalogId: "NEA-3:1/ContractCatalog",
  sourcePhase: "NEA-3:1" as const,
  contracts: SessionConversationContracts,
  contractCount: SessionConversationContracts.length,
  participants: SessionConversationParticipants,
  participantRoleCount: SessionConversationParticipants.length,
  contextDimensions: SESSION_CONVERSATION_CONTEXT_DIMENSIONS,
  contextDimensionCount: SESSION_CONVERSATION_CONTEXT_DIMENSIONS.length,
  messageReferenceFields: SESSION_CONVERSATION_MESSAGE_REFERENCE_FIELDS,
  messageReferenceFieldCount:
    SESSION_CONVERSATION_MESSAGE_REFERENCE_FIELDS.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
