/**
 * NEA-4:1 — Security Gateway Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Security Gateway.
 * Metadata-only. No authentication, authorization, or encryption runtime.
 *
 * Ownership: owned exclusively by NEA-4:1.
 */

/** Foundation status for NEA-4:1. */
export type SecurityGatewayFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type SecurityGatewayFoundationReadiness = "ReadyForRegistry";

/** Immutable security lifecycle states. */
export type SecurityLifecycleState =
  | "Declared"
  | "Classified"
  | "Reviewed"
  | "Approved"
  | "Deprecated";

/** Declarative security capability identifiers. */
export type SecurityGatewayCapabilityId =
  | "IdentityDeclaration"
  | "AuthenticationDeclaration"
  | "AuthorizationDeclaration"
  | "PermissionDeclaration"
  | "RoleDeclaration"
  | "TrustDeclaration"
  | "ConsentDeclaration"
  | "PolicyDeclaration"
  | "SecurityClassification"
  | "SecurityMetadataManagement";

/** Contract declaration for a security foundation surface. */
export interface SecurityGatewayContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Capability declaration. */
export interface SecurityGatewayCapabilityDeclaration {
  readonly capabilityId: SecurityGatewayCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical foundation identity. */
export interface SecurityGatewayFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-4:1";
  readonly owner: string;
  readonly status: SecurityGatewayFoundationStatus;
  readonly readiness: SecurityGatewayFoundationReadiness;
  readonly description: string;
  readonly publicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface SecurityGatewayFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:1";
  readonly status: SecurityGatewayFoundationStatus;
  readonly readiness: SecurityGatewayFoundationReadiness;
  readonly publicIndexId: string;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly lifecycleStateCount: number;
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
