/**
 * NEA-6:4 — Message Normalization Validation Types.
 *
 * Readonly contracts for declarative Message Normalization validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-6:4.
 */

/** Validation status for NEA-6:4. */
export type MessageNormalizationValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type MessageNormalizationValidationReadiness = "ReadyForManifest";

/** Validation category identifiers — 20 model kinds + CrossModel + PlatformIntegrity. */
export type MessageNormalizationValidationCategoryId =
  | "ExecutiveMessage"
  | "MessageIdentity"
  | "Sender"
  | "Recipient"
  | "Payload"
  | "PayloadType"
  | "Metadata"
  | "Context"
  | "Attachment"
  | "Correlation"
  | "Trace"
  | "DeliveryMetadata"
  | "SessionReference"
  | "ConversationReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "ChannelReference"
  | "ConnectorReference"
  | "NormalizationResult"
  | "MessageSummary"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-6:3 domain models. */
export type MessageNormalizationValidationTarget =
  | "ExecutiveMessage"
  | "MessageIdentity"
  | "Sender"
  | "Recipient"
  | "Payload"
  | "PayloadType"
  | "Metadata"
  | "Context"
  | "Attachment"
  | "Correlation"
  | "Trace"
  | "DeliveryMetadata"
  | "SessionReference"
  | "ConversationReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "ChannelReference"
  | "ConnectorReference"
  | "NormalizationResult"
  | "MessageSummary"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type MessageNormalizationValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Declarative validation rule. */
export interface MessageNormalizationValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: MessageNormalizationValidationCategoryId;
  readonly targetModelKind: MessageNormalizationValidationTarget;
  readonly description: string;
  readonly severity: MessageNormalizationValidationSeverity;
  readonly modelReference: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface MessageNormalizationValidationCategory {
  readonly categoryId: MessageNormalizationValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: MessageNormalizationValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface MessageNormalizationValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: MessageNormalizationValidationCategoryId;
  readonly targetCategoryId: MessageNormalizationValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface MessageNormalizationValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface MessageNormalizationValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-6:4";
  readonly owner: string;
  readonly status: MessageNormalizationValidationStatus;
  readonly readiness: MessageNormalizationValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface MessageNormalizationValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:4";
  readonly status: MessageNormalizationValidationStatus;
  readonly readiness: MessageNormalizationValidationReadiness;
  readonly modelId: string;
  readonly categoryCount: number;
  readonly domainCategoryCount: number;
  readonly ruleCount: number;
  readonly crossModelRuleCount: number;
  readonly platformIntegrityRuleCount: number;
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
