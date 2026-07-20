/**
 * NEA-6:4 — Message Normalization Validation Rules.
 *
 * Immutable declarative validation rules for NEA-6:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-6:4.
 */

import {
  MessageNormalizationModelId,
  MessageNormalizationModelPlatform,
} from "./messageNormalizationModel.ts";
import type {
  MessageNormalizationValidationCategory,
  MessageNormalizationValidationCategoryId,
  MessageNormalizationValidationRule,
  MessageNormalizationValidationSeverity,
  MessageNormalizationValidationTarget,
} from "./messageNormalizationValidationTypes.ts";

const model = MessageNormalizationModelPlatform;

const category = (
  categoryId: MessageNormalizationValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: MessageNormalizationValidationTarget,
  order: number,
): MessageNormalizationValidationCategory =>
  Object.freeze({
    categoryId,
    categoryName,
    description,
    targetModelKind,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Validation categories: exactly 20 matching Model kinds, plus CrossModel and
 * PlatformIntegrity for cross-model and platform integrity rule groupings.
 * Domain category count remains 20 (matches Model kinds).
 */
export const MessageNormalizationValidationCategories: readonly MessageNormalizationValidationCategory[] =
  Object.freeze([
    category("ExecutiveMessage", "Executive Message Validation", "Validate executive message composition and required references.", "ExecutiveMessage", 1),
    category("MessageIdentity", "Message Identity Validation", "Validate message identity completeness and uniqueness.", "MessageIdentity", 2),
    category("Sender", "Sender Validation", "Validate sender structure — no authentication.", "Sender", 3),
    category("Recipient", "Recipient Validation", "Validate recipient structure — no delivery execution.", "Recipient", 4),
    category("Payload", "Payload Validation", "Validate payload references — no payload parsing.", "Payload", 5),
    category("PayloadType", "Payload Type Validation", "Validate canonical payload classification.", "PayloadType", 6),
    category("Metadata", "Metadata Validation", "Validate metadata completeness and references.", "Metadata", 7),
    category("Context", "Context Validation", "Validate workspace, tenant, channel, and connector references.", "Context", 8),
    category("Attachment", "Attachment Validation", "Validate attachment references — no file storage.", "Attachment", 9),
    category("Correlation", "Correlation Validation", "Validate correlation and trace references.", "Correlation", 10),
    category("Trace", "Trace Validation", "Validate trace metadata consistency — no runtime tracing.", "Trace", 11),
    category("DeliveryMetadata", "Delivery Metadata Validation", "Validate delivery metadata — no delivery execution.", "DeliveryMetadata", 12),
    category("SessionReference", "Session Reference Validation", "Validate opaque session references — no session runtime.", "SessionReference", 13),
    category("ConversationReference", "Conversation Reference Validation", "Validate opaque conversation references — no conversation management.", "ConversationReference", 14),
    category("WorkspaceReference", "Workspace Reference Validation", "Validate workspace context references.", "WorkspaceReference", 15),
    category("TenantReference", "Tenant Reference Validation", "Validate tenant context references.", "TenantReference", 16),
    category("ChannelReference", "Channel Reference Validation", "Validate channel context references.", "ChannelReference", 17),
    category("ConnectorReference", "Connector Reference Validation", "Validate connector context references.", "ConnectorReference", 18),
    category("NormalizationResult", "Normalization Result Validation", "Validate normalization result declaration.", "NormalizationResult", 19),
    category("MessageSummary", "Message Summary Validation", "Validate summary composition and executive message reference.", "MessageSummary", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across message normalization models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: MessageNormalizationValidationCategoryId,
  targetModelKind: MessageNormalizationValidationTarget,
  description: string,
  severity: MessageNormalizationValidationSeverity,
  order: number,
): MessageNormalizationValidationRule =>
  Object.freeze({
    ruleId: `NEA-6:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${MessageNormalizationModelId}/domainModels/${targetModelKind}`,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly fifty-eight declarative validation rules.
 * 42 domain + 10 cross-model + 6 platform integrity.
 * All reference Model kinds. No rule executes validation.
 */
export const MessageNormalizationValidationRules: readonly MessageNormalizationValidationRule[] =
  Object.freeze([
    rule("MessageIdentity-Completeness", "Message Identity Completeness", "MessageIdentity", "MessageIdentity", "Message identity fields must be declared completely.", "Error", 1),
    rule("MessageIdentity-Unique", "Unique Message Identity", "MessageIdentity", "MessageIdentity", "Message identity ids must be unique.", "Error", 2),
    rule("MessageIdentity-Canonical", "Message Identity Canonical Reference", "MessageIdentity", "MessageIdentity", "Message identity must preserve canonical Registry references.", "Error", 3),
    rule("MessageIdentity-Version", "Message Identity Version Consistency", "MessageIdentity", "MessageIdentity", "Message version must be consistent with declared identity version.", "Error", 4),

    rule("ExecutiveMessage-Composition", "Executive Message Composition", "ExecutiveMessage", "ExecutiveMessage", "Executive message must compose required child models.", "Error", 5),
    rule("ExecutiveMessage-Sender", "Executive Message Sender", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare a sender.", "Error", 6),
    rule("ExecutiveMessage-Recipient", "Executive Message Recipient", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare a recipient.", "Error", 7),
    rule("ExecutiveMessage-Payload", "Executive Message Payload", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare a payload.", "Error", 8),
    rule("ExecutiveMessage-Metadata", "Executive Message Metadata", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare metadata.", "Error", 9),
    rule("ExecutiveMessage-Context", "Executive Message Context", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare context.", "Error", 10),
    rule("ExecutiveMessage-Attachment", "Executive Message Attachment", "ExecutiveMessage", "ExecutiveMessage", "Executive message attachment references must be declarative only.", "Warning", 11),
    rule("ExecutiveMessage-Correlation", "Executive Message Correlation", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare correlation.", "Error", 12),
    rule("ExecutiveMessage-DeliveryMetadata", "Executive Message Delivery Metadata", "ExecutiveMessage", "ExecutiveMessage", "Executive message must declare delivery metadata.", "Error", 13),

    rule("Payload-PayloadType", "Payload Type Required", "Payload", "Payload", "Payload must declare a payload type.", "Error", 14),
    rule("Payload-Reference", "Payload Reference", "Payload", "Payload", "Payload must declare a payload reference — no parsing.", "Error", 15),
    rule("Payload-CanonicalClassification", "Payload Canonical Classification", "Payload", "Payload", "Payload classification must remain canonical.", "Error", 16),

    rule("Context-Workspace", "Context Workspace Reference", "Context", "Context", "Context must declare a workspace reference.", "Error", 17),
    rule("Context-Tenant", "Context Tenant Reference", "Context", "Context", "Context must declare a tenant reference.", "Error", 18),
    rule("Context-Channel", "Context Channel Reference", "Context", "Context", "Context must declare a channel reference.", "Error", 19),
    rule("Context-Connector", "Context Connector Reference", "Context", "Context", "Context must declare a connector reference.", "Error", 20),

    rule("Correlation-Reference", "Correlation Reference", "Correlation", "Correlation", "Correlation must declare a correlation reference.", "Error", 21),
    rule("Correlation-Trace", "Correlation Trace Reference", "Correlation", "Correlation", "Correlation must declare a trace reference.", "Error", 22),

    rule("Metadata-Completeness", "Metadata Completeness", "Metadata", "Metadata", "Metadata structure must be complete.", "Error", 23),
    rule("Metadata-References", "Metadata References", "Metadata", "Metadata", "Metadata references must remain canonical.", "Error", 24),

    rule("NormalizationResult-Declaration", "Normalization Result Declaration", "NormalizationResult", "NormalizationResult", "Normalization result must be declared.", "Error", 25),

    rule("MessageSummary-Composition", "Message Summary Composition", "MessageSummary", "MessageSummary", "Message summary must compose required references.", "Error", 26),
    rule("MessageSummary-ExecutiveMessage", "Message Summary Executive Message Reference", "MessageSummary", "MessageSummary", "Message summary must reference an executive message.", "Error", 27),

    rule("Sender-Completeness", "Sender Completeness", "Sender", "Sender", "Sender fields must be declared completely.", "Error", 28),
    rule("Sender-Canonical", "Sender Canonical Structure", "Sender", "Sender", "Sender must remain a declarative structure without authentication.", "Error", 29),

    rule("Recipient-Completeness", "Recipient Completeness", "Recipient", "Recipient", "Recipient fields must be declared completely.", "Error", 30),
    rule("Recipient-Canonical", "Recipient Canonical Structure", "Recipient", "Recipient", "Recipient must remain a declarative structure without delivery execution.", "Error", 31),

    rule("PayloadType-Canonical", "Payload Type Canonical Reference", "PayloadType", "PayloadType", "Payload type must reference a canonical classification.", "Error", 32),

    rule("Attachment-Reference", "Attachment Reference", "Attachment", "Attachment", "Attachment must declare a reference only.", "Error", 33),
    rule("Attachment-NoStorage", "Attachment Non-Storage", "Attachment", "Attachment", "Attachment validation must not store files.", "Info", 34),

    rule("Trace-Consistency", "Trace Consistency", "Trace", "Trace", "Trace metadata structure must be consistent.", "Error", 35),

    rule("DeliveryMetadata-Completeness", "Delivery Metadata Completeness", "DeliveryMetadata", "DeliveryMetadata", "Delivery metadata must be complete.", "Error", 36),

    rule("SessionReference-Opaque", "Session Reference Opaque", "SessionReference", "SessionReference", "Session reference must remain opaque — no session runtime.", "Error", 37),
    rule("ConversationReference-Opaque", "Conversation Reference Opaque", "ConversationReference", "ConversationReference", "Conversation reference must remain opaque — no conversation management.", "Error", 38),

    rule("WorkspaceReference-Canonical", "Workspace Reference Canonical", "WorkspaceReference", "WorkspaceReference", "Workspace reference must remain canonical.", "Error", 39),
    rule("TenantReference-Canonical", "Tenant Reference Canonical", "TenantReference", "TenantReference", "Tenant reference must remain canonical.", "Error", 40),
    rule("ChannelReference-Canonical", "Channel Reference Canonical", "ChannelReference", "ChannelReference", "Channel reference must remain canonical.", "Error", 41),
    rule("ConnectorReference-Canonical", "Connector Reference Canonical", "ConnectorReference", "ConnectorReference", "Connector reference must remain canonical.", "Error", 42),

    rule("CrossModel-ExecutiveMessageIdentity", "Cross-Model Executive Message Identity", "CrossModel", "CrossModel", "ExecutiveMessage ↔ MessageIdentity relationship must remain consistent.", "Error", 43),
    rule("CrossModel-ExecutiveMessagePayload", "Cross-Model Executive Message Payload", "CrossModel", "CrossModel", "ExecutiveMessage ↔ Payload relationship must remain consistent.", "Error", 44),
    rule("CrossModel-ExecutiveMessageContext", "Cross-Model Executive Message Context", "CrossModel", "CrossModel", "ExecutiveMessage ↔ Context relationship must remain consistent.", "Error", 45),
    rule("CrossModel-ExecutiveMessageMetadata", "Cross-Model Executive Message Metadata", "CrossModel", "CrossModel", "ExecutiveMessage ↔ Metadata relationship must remain consistent.", "Error", 46),
    rule("CrossModel-ExecutiveMessageCorrelation", "Cross-Model Executive Message Correlation", "CrossModel", "CrossModel", "ExecutiveMessage ↔ Correlation relationship must remain consistent.", "Error", 47),
    rule("CrossModel-CorrelationTrace", "Cross-Model Correlation Trace", "CrossModel", "CrossModel", "Correlation ↔ Trace relationship must remain consistent.", "Error", 48),
    rule("CrossModel-ContextWorkspace", "Cross-Model Context Workspace", "CrossModel", "CrossModel", "Context ↔ WorkspaceReference relationship must remain consistent.", "Error", 49),
    rule("CrossModel-ContextTenant", "Cross-Model Context Tenant", "CrossModel", "CrossModel", "Context ↔ TenantReference relationship must remain consistent.", "Error", 50),
    rule("CrossModel-PayloadPayloadType", "Cross-Model Payload Payload Type", "CrossModel", "CrossModel", "Payload ↔ PayloadType relationship must remain consistent.", "Error", 51),
    rule("CrossModel-SummaryExecutiveMessage", "Cross-Model Summary Executive Message", "CrossModel", "CrossModel", "MessageSummary ↔ ExecutiveMessage relationship must remain consistent.", "Error", 52),

    rule("Platform-CanonicalReferences", "Platform Canonical References", "PlatformIntegrity", "Platform", "Canonical Model and Registry references must be preserved.", "Error", 53),
    rule("Platform-Ownership", "Platform Ownership Consistency", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 54),
    rule("Platform-DuplicatePrevention", "Platform Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and model values are forbidden.", "Error", 55),
    rule("Platform-RelationshipIntegrity", "Platform Relationship Integrity", "PlatformIntegrity", "Platform", "Relationship integrity must be preserved.", "Error", 56),
    rule("Platform-ImmutableComposition", "Platform Immutable Composition", "PlatformIntegrity", "Platform", "Immutable composition of Validation over Model must be preserved.", "Error", 57),
    rule("Platform-ArchitecturalConsistency", "Platform Architectural Consistency", "PlatformIntegrity", "Platform", "Architectural consistency across Validation, Model, and Registry must be preserved.", "Error", 58),
  ]);

const DOMAIN_CATEGORIES = MessageNormalizationValidationCategories.filter(
  (item) =>
    item.categoryId !== "CrossModel" &&
    item.categoryId !== "PlatformIntegrity",
);

const CROSS_MODEL_RULES = MessageNormalizationValidationRules.filter(
  (item) => item.categoryId === "CrossModel",
);

const PLATFORM_INTEGRITY_RULES = MessageNormalizationValidationRules.filter(
  (item) => item.categoryId === "PlatformIntegrity",
);

/** Model anchors proving rules target NEA-6:3 domain models. */
export const MessageNormalizationValidationModelAnchors = Object.freeze({
  modelId: MessageNormalizationModelId,
  sourcePhase: "NEA-6:4" as const,
  domainModelCount: model.domainModels.modelCount,
  messageIdentityModelCount: model.domainModels.messageIdentityModelCount,
  relationshipCount: model.relationships.relationshipCount,
  domainModelKinds: Object.freeze(
    model.domainModels.models.map((item) => item.modelKind),
  ),
  preservesCanonicalModelReferences: true as const,
  duplicatesModelValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable rules catalog. */
export const MessageNormalizationValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-6:4/ValidationRuleCatalog",
  sourcePhase: "NEA-6:4" as const,
  categories: MessageNormalizationValidationCategories,
  rules: MessageNormalizationValidationRules,
  categoryCount: MessageNormalizationValidationCategories.length,
  domainCategoryCount: DOMAIN_CATEGORIES.length,
  ruleCount: MessageNormalizationValidationRules.length,
  crossModelRuleCount: CROSS_MODEL_RULES.length,
  platformIntegrityRuleCount: PLATFORM_INTEGRITY_RULES.length,
  modelAnchors: MessageNormalizationValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
