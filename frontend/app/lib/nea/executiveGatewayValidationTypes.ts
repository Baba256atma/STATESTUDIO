/**
 * NEA-1:4 — Executive Gateway Validation Types.
 *
 * Readonly contracts for declarative Executive Gateway validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-1:4.
 */

/** Validation status for NEA-1:4. */
export type ExecutiveGatewayValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type ExecutiveGatewayValidationReadiness = "ReadyForManifest";

/** Validation category identifiers. */
export type ExecutiveGatewayValidationCategoryId =
  | "Identity"
  | "Sender"
  | "Tenant"
  | "Workspace"
  | "Context"
  | "Session"
  | "Conversation"
  | "Authentication"
  | "Authorization"
  | "Trust"
  | "Consent"
  | "Payload"
  | "Attachment"
  | "Metadata"
  | "Request"
  | "Routing"
  | "ValidationOutcome"
  | "Diagnostic"
  | "ProcessingResult"
  | "Response"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-1:3 domain models. */
export type ExecutiveGatewayValidationTarget =
  | "GatewayIdentity"
  | "GatewaySender"
  | "GatewayTenant"
  | "GatewayWorkspace"
  | "GatewayContext"
  | "GatewaySession"
  | "GatewayConversation"
  | "GatewayAuthentication"
  | "GatewayAuthorization"
  | "GatewayTrust"
  | "GatewayConsent"
  | "GatewayPayload"
  | "GatewayAttachment"
  | "GatewayMetadata"
  | "GatewayRequest"
  | "GatewayRouting"
  | "GatewayValidation"
  | "GatewayDiagnostic"
  | "GatewayProcessingResult"
  | "GatewayResponse"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type ExecutiveGatewayValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Declarative validation rule. */
export interface ExecutiveGatewayValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: ExecutiveGatewayValidationCategoryId;
  readonly targetModelKind: ExecutiveGatewayValidationTarget;
  readonly description: string;
  readonly severity: ExecutiveGatewayValidationSeverity;
  readonly modelReference: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface ExecutiveGatewayValidationCategory {
  readonly categoryId: ExecutiveGatewayValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: ExecutiveGatewayValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface ExecutiveGatewayValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: ExecutiveGatewayValidationCategoryId;
  readonly targetCategoryId: ExecutiveGatewayValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation policy declaration. */
export interface ExecutiveGatewayValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface ExecutiveGatewayValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-1:4";
  readonly owner: string;
  readonly status: ExecutiveGatewayValidationStatus;
  readonly readiness: ExecutiveGatewayValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface ExecutiveGatewayValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:4";
  readonly status: ExecutiveGatewayValidationStatus;
  readonly readiness: ExecutiveGatewayValidationReadiness;
  readonly modelId: string;
  readonly categoryCount: number;
  readonly ruleCount: number;
  readonly relationshipCount: number;
  readonly policyCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
