/**
 * NEA-3:4 — Session & Conversation Validation Types.
 *
 * Readonly contracts for declarative Session & Conversation validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-3:4.
 */

/** Validation status for NEA-3:4. */
export type SessionConversationValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type SessionConversationValidationReadiness = "ReadyForManifest";

/** Validation category identifiers. */
export type SessionConversationValidationCategoryId =
  | "SessionIdentity"
  | "ConversationIdentity"
  | "Session"
  | "Conversation"
  | "Participant"
  | "MessageReference"
  | "Context"
  | "Correlation"
  | "Trace"
  | "SessionState"
  | "ConversationState"
  | "ConversationType"
  | "SessionMetadata"
  | "ConversationMetadata"
  | "Configuration"
  | "Diagnostics"
  | "Result"
  | "Summary"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-3:3 domain models. */
export type SessionConversationValidationTarget =
  | "SessionIdentity"
  | "ConversationIdentity"
  | "Session"
  | "Conversation"
  | "Participant"
  | "MessageReference"
  | "ConversationContext"
  | "Correlation"
  | "Trace"
  | "SessionState"
  | "ConversationState"
  | "ConversationType"
  | "SessionMetadata"
  | "ConversationMetadata"
  | "ConversationConfiguration"
  | "ConversationDiagnostics"
  | "ConversationResult"
  | "ConversationSummary"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type SessionConversationValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Declarative validation rule. */
export interface SessionConversationValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: SessionConversationValidationCategoryId;
  readonly targetModelKind: SessionConversationValidationTarget;
  readonly description: string;
  readonly severity: SessionConversationValidationSeverity;
  readonly modelReference: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface SessionConversationValidationCategory {
  readonly categoryId: SessionConversationValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: SessionConversationValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface SessionConversationValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: SessionConversationValidationCategoryId;
  readonly targetCategoryId: SessionConversationValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface SessionConversationValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface SessionConversationValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-3:4";
  readonly owner: string;
  readonly status: SessionConversationValidationStatus;
  readonly readiness: SessionConversationValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface SessionConversationValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:4";
  readonly status: SessionConversationValidationStatus;
  readonly readiness: SessionConversationValidationReadiness;
  readonly modelId: string;
  readonly categoryCount: number;
  readonly ruleCount: number;
  readonly relationshipCount: number;
  readonly policyCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
