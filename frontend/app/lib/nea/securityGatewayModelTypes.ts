/**
 * NEA-4:3 — Security Gateway Model Types.
 *
 * Strongly typed immutable domain model contracts for Security Gateway.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-4:3.
 */

/** Model status for NEA-4:3. */
export type SecurityGatewayModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type SecurityGatewayModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers — exactly twenty. */
export type SecurityGatewayModelKind =
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
  | "SecuritySummary";

/** Model-phase lifecycle states for domain model artifacts. */
export type SecurityGatewayModelLifecycleState =
  | "Declared"
  | "Typed"
  | "Composed"
  | "Related"
  | "Boundaried"
  | "ReadyForValidation";

/** Declared security decision outcomes — structure only. */
export type SecurityDecisionOutcomeId =
  | "Undetermined"
  | "Allowed"
  | "Denied"
  | "Conditional"
  | "ReviewRequired";

/** Registry collection names referenced by models. */
export type SecurityGatewayRegistryCollectionName =
  | "securityIdentities"
  | "classifications"
  | "authenticationMethods"
  | "authorizationLevels"
  | "trustLevels"
  | "consentStates"
  | "roles"
  | "permissions"
  | "securityPolicies"
  | "statuses"
  | "events"
  | "contextTypes"
  | "contracts"
  | "lifecycleEntries"
  | "capabilities"
  | "registryPolicies";

/** Registry reference — never duplicates registry values. */
export interface SecurityGatewayRegistryReference {
  readonly registryEntryId: string;
  readonly registryCollection: SecurityGatewayRegistryCollectionName;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
}

/** Domain model kind descriptor. */
export interface SecurityGatewayModelKindDescriptor {
  readonly modelKind: SecurityGatewayModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly SecurityGatewayRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly SecurityGatewayModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface SecurityGatewayModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: SecurityGatewayModelKind;
  readonly targetModelKind: SecurityGatewayModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Security Identity Model — structure only. */
export interface SecurityIdentityModel {
  readonly modelKind: "SecurityIdentity";
  readonly securityId: string;
  readonly version: string;
  readonly classification: string;
  readonly status: string;
  readonly lifecycle: string;
  readonly registryIdentityRef: string;
  readonly managesRuntimeSecurity: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Security Principal Model — structure only. */
export interface SecurityPrincipalModel {
  readonly modelKind: "SecurityPrincipal";
  readonly principalId: string;
  readonly principalName: string;
  readonly principalCategory: string;
  readonly registryRoleRef: string;
  readonly verifiesIdentity: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface SecurityGatewayModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-4:3";
  readonly owner: string;
  readonly status: SecurityGatewayModelStatus;
  readonly readiness: SecurityGatewayModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface SecurityGatewayModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:3";
  readonly status: SecurityGatewayModelStatus;
  readonly readiness: SecurityGatewayModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly securityIdentityModelCount: number;
  readonly securityPrincipalModelCount: number;
  readonly relationshipCount: number;
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
