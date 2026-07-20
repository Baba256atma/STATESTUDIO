/**
 * NEA-7:4 — Intake Orchestration Validation Types.
 *
 * Readonly contracts for declarative Intake Orchestration validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-7:4.
 */

/** Validation status for NEA-7:4. */
export type IntakeOrchestrationValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type IntakeOrchestrationValidationReadiness = "ReadyForManifest";

/** Validation category identifiers — 20 model kinds + CrossModel + PlatformIntegrity. */
export type IntakeOrchestrationValidationCategoryId =
  | "ExecutiveIntakePackage"
  | "IntakeIdentity"
  | "IntakeSource"
  | "IntakeContext"
  | "IntakeMetadata"
  | "MessageReference"
  | "SessionReference"
  | "ConversationReference"
  | "AuthenticationReference"
  | "RoutingReference"
  | "ConnectorReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "CorrelationReference"
  | "TraceReference"
  | "AttachmentReference"
  | "IntakeConfiguration"
  | "IntakeDiagnostics"
  | "IntakeResult"
  | "IntakeSummary"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-7:3 domain models. */
export type IntakeOrchestrationValidationTarget =
  | "ExecutiveIntakePackage"
  | "IntakeIdentity"
  | "IntakeSource"
  | "IntakeContext"
  | "IntakeMetadata"
  | "MessageReference"
  | "SessionReference"
  | "ConversationReference"
  | "AuthenticationReference"
  | "RoutingReference"
  | "ConnectorReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "CorrelationReference"
  | "TraceReference"
  | "AttachmentReference"
  | "IntakeConfiguration"
  | "IntakeDiagnostics"
  | "IntakeResult"
  | "IntakeSummary"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type IntakeOrchestrationValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Declarative validation rule. */
export interface IntakeOrchestrationValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: IntakeOrchestrationValidationCategoryId;
  readonly targetModelKind: IntakeOrchestrationValidationTarget;
  readonly description: string;
  readonly severity: IntakeOrchestrationValidationSeverity;
  readonly modelReference: string;
  readonly validationIntent: "DeclarativeStructureOnly";
  readonly executionStatus: "None";
  readonly ownership: "NEA-7:4";
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface IntakeOrchestrationValidationCategory {
  readonly categoryId: IntakeOrchestrationValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: IntakeOrchestrationValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface IntakeOrchestrationValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: IntakeOrchestrationValidationCategoryId;
  readonly targetCategoryId: IntakeOrchestrationValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface IntakeOrchestrationValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface IntakeOrchestrationValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-7:4";
  readonly owner: string;
  readonly status: IntakeOrchestrationValidationStatus;
  readonly readiness: IntakeOrchestrationValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface IntakeOrchestrationValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:4";
  readonly status: IntakeOrchestrationValidationStatus;
  readonly readiness: IntakeOrchestrationValidationReadiness;
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
