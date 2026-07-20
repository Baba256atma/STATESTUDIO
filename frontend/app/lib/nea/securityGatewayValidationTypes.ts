/**
 * NEA-4:4 — Security Gateway Validation Types.
 *
 * Readonly contracts for declarative Security Gateway validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-4:4.
 */

/** Validation status for NEA-4:4. */
export type SecurityGatewayValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type SecurityGatewayValidationReadiness = "ReadyForManifest";

/** Validation category identifiers — exactly twenty-two. */
export type SecurityGatewayValidationCategoryId =
  | "SecurityIdentity"
  | "SecurityPrincipal"
  | "SecurityContext"
  | "AuthenticationContext"
  | "AuthorizationContext"
  | "TrustContext"
  | "ConsentContext"
  | "Role"
  | "Permission"
  | "SecurityClassification"
  | "SecurityPolicy"
  | "SecurityEvent"
  | "SecurityMetadata"
  | "SecurityDecisionDeclaration"
  | "SecurityResource"
  | "SecurityAction"
  | "SecurityConstraint"
  | "SecurityDiagnostic"
  | "SecurityResult"
  | "SecuritySummary"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-4:3 domain models. */
export type SecurityGatewayValidationTarget =
  | "SecurityIdentity"
  | "SecurityPrincipal"
  | "SecurityContext"
  | "AuthenticationContext"
  | "AuthorizationContext"
  | "TrustContext"
  | "ConsentContext"
  | "Role"
  | "Permission"
  | "SecurityClassification"
  | "SecurityPolicy"
  | "SecurityEvent"
  | "SecurityMetadata"
  | "SecurityDecisionDeclaration"
  | "SecurityResource"
  | "SecurityAction"
  | "SecurityConstraint"
  | "SecurityDiagnostic"
  | "SecurityResult"
  | "SecuritySummary"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type SecurityGatewayValidationSeverity = "Error" | "Warning" | "Info";

/** Declarative validation rule. */
export interface SecurityGatewayValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: SecurityGatewayValidationCategoryId;
  readonly targetModelKind: SecurityGatewayValidationTarget;
  readonly description: string;
  readonly severity: SecurityGatewayValidationSeverity;
  readonly modelReference: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface SecurityGatewayValidationCategory {
  readonly categoryId: SecurityGatewayValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: SecurityGatewayValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface SecurityGatewayValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: SecurityGatewayValidationCategoryId;
  readonly targetCategoryId: SecurityGatewayValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface SecurityGatewayValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface SecurityGatewayValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-4:4";
  readonly owner: string;
  readonly status: SecurityGatewayValidationStatus;
  readonly readiness: SecurityGatewayValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface SecurityGatewayValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:4";
  readonly status: SecurityGatewayValidationStatus;
  readonly readiness: SecurityGatewayValidationReadiness;
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
