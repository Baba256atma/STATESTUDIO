/**
 * NEA-3:4 — Session & Conversation Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-3:4.
 */

import type {
  SessionConversationValidationCategoryId,
  SessionConversationValidationRelationship,
} from "./sessionConversationValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: SessionConversationValidationCategoryId,
  targetCategoryId: SessionConversationValidationCategoryId,
  description: string,
  order: number,
): SessionConversationValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-3:4/ValidationRelationship/${key}`,
    relationshipName,
    sourceCategoryId,
    targetCategoryId,
    description,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical validation category relationships. */
export const SessionConversationValidationRelationships: readonly SessionConversationValidationRelationship[] =
  Object.freeze([
    relationship("Session-SessionIdentity", "Session depends on Session Identity", "Session", "SessionIdentity", "Session validation requires session identity validation.", 1),
    relationship("Conversation-ConversationIdentity", "Conversation depends on Conversation Identity", "Conversation", "ConversationIdentity", "Conversation validation requires conversation identity validation.", 2),
    relationship("Conversation-Session", "Conversation depends on Session", "Conversation", "Session", "Conversation validation requires session validation.", 3),
    relationship("Conversation-Participant", "Conversation depends on Participant", "Conversation", "Participant", "Conversation validation requires participant validation.", 4),
    relationship("Conversation-Context", "Conversation depends on Context", "Conversation", "Context", "Conversation validation requires context validation.", 5),
    relationship("Conversation-ConversationType", "Conversation depends on Conversation Type", "Conversation", "ConversationType", "Conversation validation requires conversation type validation.", 6),
    relationship("Session-SessionState", "Session depends on Session State", "Session", "SessionState", "Session validation requires session state validation.", 7),
    relationship("Conversation-ConversationState", "Conversation depends on Conversation State", "Conversation", "ConversationState", "Conversation validation requires conversation state validation.", 8),
    relationship("MessageReference-Correlation", "Message Reference depends on Correlation", "MessageReference", "Correlation", "Message reference validation requires correlation validation.", 9),
    relationship("Correlation-Trace", "Correlation depends on Trace", "Correlation", "Trace", "Correlation validation may require trace validation.", 10),
    relationship("Session-SessionMetadata", "Session depends on Session Metadata", "Session", "SessionMetadata", "Session validation requires session metadata validation.", 11),
    relationship("Conversation-ConversationMetadata", "Conversation depends on Conversation Metadata", "Conversation", "ConversationMetadata", "Conversation validation requires conversation metadata validation.", 12),
    relationship("Configuration-Conversation", "Configuration depends on Conversation", "Configuration", "Conversation", "Configuration validation requires conversation validation.", 13),
    relationship("Diagnostics-Conversation", "Diagnostics depends on Conversation", "Diagnostics", "Conversation", "Diagnostics validation requires conversation validation.", 14),
    relationship("Result-Diagnostics", "Result depends on Diagnostics", "Result", "Diagnostics", "Result validation may require diagnostics validation.", 15),
    relationship("Result-Conversation", "Result depends on Conversation", "Result", "Conversation", "Result validation requires conversation validation.", 16),
    relationship("Summary-Conversation", "Summary depends on Conversation", "Summary", "Conversation", "Summary validation requires conversation validation.", 17),
    relationship("Summary-Session", "Summary depends on Session", "Summary", "Session", "Summary validation requires session validation.", 18),
    relationship("Summary-Result", "Summary depends on Result", "Summary", "Result", "Summary validation may require result validation.", 19),
    relationship("Context-Configuration", "Context depends on Configuration", "Context", "Configuration", "Context validation includes connector dimension via configuration.", 20),
    relationship("CrossModel-Conversation", "Cross-Model covers Conversation", "CrossModel", "Conversation", "Cross-model validation includes conversation relationships.", 21),
    relationship("CrossModel-Summary", "Cross-Model covers Summary", "CrossModel", "Summary", "Cross-model validation includes summary relationships.", 22),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 23),
    relationship("Platform-Conversation", "Platform Integrity covers Conversation", "PlatformIntegrity", "Conversation", "Platform integrity includes conversation composition integrity.", 24),
    relationship("Platform-Summary", "Platform Integrity covers Summary", "PlatformIntegrity", "Summary", "Platform integrity includes summary composition integrity.", 25),
  ]);

/** Canonical immutable validation relationship catalog. */
export const SessionConversationValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-3:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-3:4" as const,
  relationships: SessionConversationValidationRelationships,
  relationshipCount: SessionConversationValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
