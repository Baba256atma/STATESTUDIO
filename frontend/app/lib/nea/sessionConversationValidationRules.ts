/**
 * NEA-3:4 — Session & Conversation Validation Rules.
 *
 * Immutable declarative validation rules for NEA-3:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-3:4.
 */

import {
  SessionConversationModelId,
  SessionConversationModelPlatform,
} from "./sessionConversationModel.ts";
import type {
  SessionConversationValidationCategory,
  SessionConversationValidationCategoryId,
  SessionConversationValidationRule,
  SessionConversationValidationSeverity,
  SessionConversationValidationTarget,
} from "./sessionConversationValidationTypes.ts";

const model = SessionConversationModelPlatform;

const category = (
  categoryId: SessionConversationValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: SessionConversationValidationTarget,
  order: number,
): SessionConversationValidationCategory =>
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

/** Exactly twenty validation categories. */
export const SessionConversationValidationCategories: readonly SessionConversationValidationCategory[] =
  Object.freeze([
    category("SessionIdentity", "Session Identity Validation", "Validate session identity completeness and uniqueness.", "SessionIdentity", 1),
    category("ConversationIdentity", "Conversation Identity Validation", "Validate conversation identity completeness and uniqueness.", "ConversationIdentity", 2),
    category("Session", "Session Validation", "Validate session composition and lifecycle consistency.", "Session", 3),
    category("Conversation", "Conversation Validation", "Validate conversation composition and required references.", "Conversation", 4),
    category("Participant", "Participant Validation", "Validate canonical participant references only.", "Participant", 5),
    category("MessageReference", "Message Reference Validation", "Validate message reference integrity — no message processing.", "MessageReference", 6),
    category("Context", "Context Validation", "Validate canonical conversation context dimensions.", "ConversationContext", 7),
    category("Correlation", "Correlation Validation", "Validate correlation metadata consistency — no runtime tracing.", "Correlation", 8),
    category("Trace", "Trace Validation", "Validate trace metadata consistency — no runtime tracing.", "Trace", 9),
    category("SessionState", "Session State Validation", "Validate session states against canonical Registry declarations.", "SessionState", 10),
    category("ConversationState", "Conversation State Validation", "Validate conversation states against canonical Registry declarations.", "ConversationState", 11),
    category("ConversationType", "Conversation Type Validation", "Validate canonical conversation type references.", "ConversationType", 12),
    category("SessionMetadata", "Session Metadata Validation", "Validate session metadata completeness.", "SessionMetadata", 13),
    category("ConversationMetadata", "Conversation Metadata Validation", "Validate conversation metadata completeness.", "ConversationMetadata", 14),
    category("Configuration", "Configuration Validation", "Validate configuration completeness — no executable configuration.", "ConversationConfiguration", 15),
    category("Diagnostics", "Diagnostics Validation", "Validate conversation diagnostics metadata.", "ConversationDiagnostics", 16),
    category("Result", "Result Validation", "Validate conversation result structure — no execution.", "ConversationResult", 17),
    category("Summary", "Summary Validation", "Validate conversation summary composition.", "ConversationSummary", 18),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across session and conversation models.", "CrossModel", 19),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 20),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: SessionConversationValidationCategoryId,
  targetModelKind: SessionConversationValidationTarget,
  description: string,
  severity: SessionConversationValidationSeverity,
  order: number,
): SessionConversationValidationRule =>
  Object.freeze({
    ruleId: `NEA-3:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${SessionConversationModelId}/domainModels/${targetModelKind}`,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Canonical declarative validation rules.
 * One or more rules per category; all reference Model kinds.
 */
export const SessionConversationValidationRules: readonly SessionConversationValidationRule[] =
  Object.freeze([
    rule("SessionIdentity-Completeness", "Session Identity Completeness", "SessionIdentity", "SessionIdentity", "Session identity fields must be declared completely.", "Error", 1),
    rule("SessionIdentity-Unique", "Unique Session Identity", "SessionIdentity", "SessionIdentity", "Session identity ids must be unique.", "Error", 2),
    rule("SessionIdentity-Canonical", "Session Identity Canonical Reference", "SessionIdentity", "SessionIdentity", "Session identity must preserve canonical Registry references.", "Error", 3),
    rule("SessionIdentity-Version", "Session Identity Version Consistency", "SessionIdentity", "SessionIdentity", "Session version must be consistent with declared identity version.", "Error", 4),

    rule("ConversationIdentity-Completeness", "Conversation Identity Completeness", "ConversationIdentity", "ConversationIdentity", "Conversation identity fields must be declared completely.", "Error", 5),
    rule("ConversationIdentity-Unique", "Unique Conversation Identity", "ConversationIdentity", "ConversationIdentity", "Conversation identity ids must be unique.", "Error", 6),
    rule("ConversationIdentity-Canonical", "Conversation Identity Canonical Reference", "ConversationIdentity", "ConversationIdentity", "Conversation identity must preserve canonical Registry references.", "Error", 7),
    rule("ConversationIdentity-Version", "Conversation Identity Version Consistency", "ConversationIdentity", "ConversationIdentity", "Conversation version must be consistent with declared identity version.", "Error", 8),

    rule("Session-Composition", "Session Composition", "Session", "Session", "Session must compose required child models.", "Error", 9),
    rule("Session-Lifecycle", "Session Lifecycle Consistency", "Session", "Session", "Session lifecycle must remain consistent with declared states.", "Error", 10),
    rule("Session-Metadata", "Session Metadata Completeness", "Session", "Session", "Session metadata structure must be complete.", "Error", 11),
    rule("Session-State", "Session State Consistency", "Session", "Session", "Session state must match canonical session state declarations.", "Error", 12),
    rule("Session-NoRuntime", "Session Non-Runtime", "Session", "Session", "Session validation must not manage runtime sessions.", "Info", 13),

    rule("Conversation-Composition", "Conversation Composition", "Conversation", "Conversation", "Conversation must compose required child models.", "Error", 14),
    rule("Conversation-ParticipantRefs", "Conversation Participant References", "Conversation", "Conversation", "Conversation must declare canonical participant references.", "Error", 15),
    rule("Conversation-ContextRefs", "Conversation Context References", "Conversation", "Conversation", "Conversation must declare canonical context references.", "Error", 16),
    rule("Conversation-TypeRefs", "Conversation Type References", "Conversation", "Conversation", "Conversation must declare canonical conversation type references.", "Error", 17),
    rule("Conversation-Lifecycle", "Conversation Lifecycle Consistency", "Conversation", "Conversation", "Conversation lifecycle must remain consistent with declared states.", "Error", 18),
    rule("Conversation-Metadata", "Conversation Metadata Completeness", "Conversation", "Conversation", "Conversation metadata structure must be complete.", "Error", 19),
    rule("Conversation-NoRuntime", "Conversation Non-Runtime", "Conversation", "Conversation", "Conversation validation must not manage runtime conversations.", "Info", 20),

    rule("Participant-Canonical", "Participant Canonical Reference", "Participant", "Participant", "Participant must reference a canonical Registry participant role.", "Error", 21),

    rule("MessageReference-Integrity", "Message Reference Integrity", "MessageReference", "MessageReference", "Message reference structure must remain intact.", "Error", 22),
    rule("MessageReference-Parent", "Message Parent Reference", "MessageReference", "MessageReference", "Parent and reference relationships must be declarative only.", "Error", 23),
    rule("MessageReference-Sequence", "Message Sequence Metadata", "MessageReference", "MessageReference", "Sequence metadata must be declared when present.", "Error", 24),
    rule("MessageReference-Correlation", "Message Correlation Reference", "MessageReference", "MessageReference", "Message references must declare correlation metadata.", "Error", 25),
    rule("MessageReference-NoProcessing", "Message Non-Processing", "MessageReference", "MessageReference", "Message reference validation must not process or store messages.", "Info", 26),

    rule("Context-Canonical", "Context Canonical Dimensions", "Context", "ConversationContext", "Context must reference canonical context dimensions.", "Error", 27),

    rule("Correlation-Consistency", "Correlation Metadata Consistency", "Correlation", "Correlation", "Correlation metadata structure must be consistent.", "Error", 28),
    rule("Correlation-NoTracing", "Correlation Non-Tracing", "Correlation", "Correlation", "Correlation validation must not execute runtime tracing.", "Info", 29),

    rule("Trace-Consistency", "Trace Metadata Consistency", "Trace", "Trace", "Trace metadata structure must be consistent.", "Error", 30),
    rule("Trace-NoTracing", "Trace Non-Tracing", "Trace", "Trace", "Trace validation must not execute runtime tracing.", "Info", 31),

    rule("SessionState-Canonical", "Session State Canonical Reference", "SessionState", "SessionState", "Session state must reference canonical Registry session states.", "Error", 32),
    rule("ConversationState-Canonical", "Conversation State Canonical Reference", "ConversationState", "ConversationState", "Conversation state must reference canonical Registry conversation states.", "Error", 33),

    rule("ConversationType-Canonical", "Conversation Type Canonical Reference", "ConversationType", "ConversationType", "Conversation type must reference a canonical Registry type.", "Error", 34),

    rule("SessionMetadata-Completeness", "Session Metadata Completeness", "SessionMetadata", "SessionMetadata", "Session metadata model must be complete.", "Error", 35),
    rule("ConversationMetadata-Completeness", "Conversation Metadata Completeness", "ConversationMetadata", "ConversationMetadata", "Conversation metadata model must be complete.", "Error", 36),

    rule("Configuration-Completeness", "Configuration Completeness", "Configuration", "ConversationConfiguration", "Configuration metadata must be complete.", "Error", 37),
    rule("Configuration-NoExecutable", "Configuration Non-Executable", "Configuration", "ConversationConfiguration", "Configuration validation must not load executable configuration.", "Info", 38),

    rule("Diagnostics-Structure", "Diagnostics Structure", "Diagnostics", "ConversationDiagnostics", "Diagnostics metadata structure must be complete.", "Error", 39),
    rule("Result-Structure", "Result Structure", "Result", "ConversationResult", "Result structure must be complete.", "Error", 40),
    rule("Result-NoExecution", "Result Non-Execution", "Result", "ConversationResult", "Result validation must not execute processing.", "Info", 41),

    rule("Summary-Composition", "Summary Composition", "Summary", "ConversationSummary", "Summary must compose conversation and session references.", "Error", 42),

    rule("CrossModel-SessionIdentity", "Cross-Model Session Identity", "CrossModel", "CrossModel", "Session ↔ Identity relationship must remain consistent.", "Error", 43),
    rule("CrossModel-ConversationIdentity", "Cross-Model Conversation Identity", "CrossModel", "CrossModel", "Conversation ↔ Identity relationship must remain consistent.", "Error", 44),
    rule("CrossModel-ConversationSession", "Cross-Model Conversation Session", "CrossModel", "CrossModel", "Conversation ↔ Session relationship must remain consistent.", "Error", 45),
    rule("CrossModel-ConversationParticipant", "Cross-Model Conversation Participant", "CrossModel", "CrossModel", "Conversation ↔ Participant relationship must remain consistent.", "Error", 46),
    rule("CrossModel-ConversationContext", "Cross-Model Conversation Context", "CrossModel", "CrossModel", "Conversation ↔ Context relationship must remain consistent.", "Error", 47),
    rule("CrossModel-ConversationType", "Cross-Model Conversation Type", "CrossModel", "CrossModel", "Conversation ↔ Type relationship must remain consistent.", "Error", 48),
    rule("CrossModel-MessageCorrelation", "Cross-Model Message Correlation", "CrossModel", "CrossModel", "Message ↔ Correlation relationship must remain consistent.", "Error", 49),
    rule("CrossModel-CorrelationTrace", "Cross-Model Correlation Trace", "CrossModel", "CrossModel", "Correlation ↔ Trace relationship must remain consistent.", "Error", 50),
    rule("CrossModel-ResultDiagnostics", "Cross-Model Result Diagnostics", "CrossModel", "CrossModel", "Result ↔ Diagnostics relationship must remain consistent.", "Error", 51),
    rule("CrossModel-SummaryConversation", "Cross-Model Summary Conversation", "CrossModel", "CrossModel", "Summary ↔ Conversation relationship must remain consistent.", "Error", 52),

    rule("Platform-RegistryRefs", "Platform Registry References", "PlatformIntegrity", "Platform", "Canonical Registry references must be preserved through Model.", "Error", 53),
    rule("Platform-ModelRefs", "Platform Model References", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 54),
    rule("Platform-Ownership", "Platform Ownership Consistency", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 55),
    rule("Platform-DuplicatePrevention", "Platform Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and model values are forbidden.", "Error", 56),
    rule("Platform-RelationshipIntegrity", "Platform Relationship Integrity", "PlatformIntegrity", "Platform", "Relationship integrity must be preserved.", "Error", 57),
    rule("Platform-ImmutableComposition", "Platform Immutable Composition", "PlatformIntegrity", "Platform", "Immutable composition of Validation over Model must be preserved.", "Error", 58),
  ]);

/** Model anchors proving rules target NEA-3:3 domain models. */
export const SessionConversationValidationModelAnchors = Object.freeze({
  modelId: SessionConversationModelId,
  sourcePhase: "NEA-3:4" as const,
  domainModelCount: model.domainModels.modelCount,
  sessionIdentityModelCount: model.domainModels.sessionIdentityModelCount,
  conversationIdentityModelCount:
    model.domainModels.conversationIdentityModelCount,
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
export const SessionConversationValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-3:4/ValidationRuleCatalog",
  sourcePhase: "NEA-3:4" as const,
  categories: SessionConversationValidationCategories,
  rules: SessionConversationValidationRules,
  categoryCount: SessionConversationValidationCategories.length,
  ruleCount: SessionConversationValidationRules.length,
  modelAnchors: SessionConversationValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
