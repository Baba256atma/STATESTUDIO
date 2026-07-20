/**
 * NEA-6:4 — Message Normalization Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-6:4.
 */

import type {
  MessageNormalizationValidationCategoryId,
  MessageNormalizationValidationRelationship,
} from "./messageNormalizationValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: MessageNormalizationValidationCategoryId,
  targetCategoryId: MessageNormalizationValidationCategoryId,
  description: string,
  order: number,
): MessageNormalizationValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-6:4/ValidationRelationship/${key}`,
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
export const MessageNormalizationValidationRelationships: readonly MessageNormalizationValidationRelationship[] =
  Object.freeze([
    relationship("ExecutiveMessage-MessageIdentity", "Executive Message depends on Message Identity", "ExecutiveMessage", "MessageIdentity", "Executive message validation requires message identity validation.", 1),
    relationship("ExecutiveMessage-Sender", "Executive Message depends on Sender", "ExecutiveMessage", "Sender", "Executive message validation requires sender validation.", 2),
    relationship("ExecutiveMessage-Recipient", "Executive Message depends on Recipient", "ExecutiveMessage", "Recipient", "Executive message validation requires recipient validation.", 3),
    relationship("ExecutiveMessage-Payload", "Executive Message depends on Payload", "ExecutiveMessage", "Payload", "Executive message validation requires payload validation.", 4),
    relationship("ExecutiveMessage-Metadata", "Executive Message depends on Metadata", "ExecutiveMessage", "Metadata", "Executive message validation requires metadata validation.", 5),
    relationship("ExecutiveMessage-Context", "Executive Message depends on Context", "ExecutiveMessage", "Context", "Executive message validation requires context validation.", 6),
    relationship("ExecutiveMessage-Attachment", "Executive Message depends on Attachment", "ExecutiveMessage", "Attachment", "Executive message validation may require attachment validation.", 7),
    relationship("ExecutiveMessage-Correlation", "Executive Message depends on Correlation", "ExecutiveMessage", "Correlation", "Executive message validation requires correlation validation.", 8),
    relationship("Correlation-Trace", "Correlation depends on Trace", "Correlation", "Trace", "Correlation validation requires trace validation.", 9),
    relationship("ExecutiveMessage-DeliveryMetadata", "Executive Message depends on Delivery Metadata", "ExecutiveMessage", "DeliveryMetadata", "Executive message validation requires delivery metadata validation.", 10),
    relationship("ExecutiveMessage-SessionReference", "Executive Message depends on Session Reference", "ExecutiveMessage", "SessionReference", "Executive message validation requires session reference validation.", 11),
    relationship("ExecutiveMessage-ConversationReference", "Executive Message depends on Conversation Reference", "ExecutiveMessage", "ConversationReference", "Executive message validation requires conversation reference validation.", 12),
    relationship("Context-WorkspaceReference", "Context depends on Workspace Reference", "Context", "WorkspaceReference", "Context validation requires workspace reference validation.", 13),
    relationship("Context-TenantReference", "Context depends on Tenant Reference", "Context", "TenantReference", "Context validation requires tenant reference validation.", 14),
    relationship("Context-ChannelReference", "Context depends on Channel Reference", "Context", "ChannelReference", "Context validation requires channel reference validation.", 15),
    relationship("Context-ConnectorReference", "Context depends on Connector Reference", "Context", "ConnectorReference", "Context validation requires connector reference validation.", 16),
    relationship("Payload-PayloadType", "Payload depends on Payload Type", "Payload", "PayloadType", "Payload validation requires payload type validation.", 17),
    relationship("ExecutiveMessage-NormalizationResult", "Executive Message depends on Normalization Result", "ExecutiveMessage", "NormalizationResult", "Executive message validation requires normalization result validation.", 18),
    relationship("MessageSummary-ExecutiveMessage", "Message Summary depends on Executive Message", "MessageSummary", "ExecutiveMessage", "Message summary validation requires executive message validation.", 19),
    relationship("MessageSummary-NormalizationResult", "Message Summary depends on Normalization Result", "MessageSummary", "NormalizationResult", "Message summary validation requires normalization result validation.", 20),
    relationship("CrossModel-ExecutiveMessage", "Cross-Model covers Executive Message", "CrossModel", "ExecutiveMessage", "Cross-model validation includes executive message relationships.", 21),
    relationship("CrossModel-MessageSummary", "Cross-Model covers Message Summary", "CrossModel", "MessageSummary", "Cross-model validation includes message summary relationships.", 22),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 23),
    relationship("Platform-ExecutiveMessage", "Platform Integrity covers Executive Message", "PlatformIntegrity", "ExecutiveMessage", "Platform integrity includes executive message composition integrity.", 24),
    relationship("Platform-MessageSummary", "Platform Integrity covers Message Summary", "PlatformIntegrity", "MessageSummary", "Platform integrity includes message summary composition integrity.", 25),
  ]);

/** Canonical immutable validation relationship catalog. */
export const MessageNormalizationValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-6:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-6:4" as const,
  relationships: MessageNormalizationValidationRelationships,
  relationshipCount: MessageNormalizationValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
