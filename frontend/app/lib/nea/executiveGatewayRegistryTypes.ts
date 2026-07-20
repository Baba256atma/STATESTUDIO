/**
 * NEA-1:2 — Executive Gateway Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Executive Gateway Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-1:2.
 */

/** Registry status for NEA-1:2. */
export type ExecutiveGatewayRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type ExecutiveGatewayRegistryReadiness = "ReadyForModel";

/** Registry-owned authentication method declarations. */
export type ExecutiveGatewayAuthenticationMethodId =
  | "None"
  | "ApiKeyReference"
  | "BearerTokenReference"
  | "OAuthReference"
  | "MutualTlsReference"
  | "SessionReference"
  | "SignedRequestReference"
  | "UnknownMethod";

/** Registry-owned diagnostic category declarations. */
export type ExecutiveGatewayDiagnosticCategoryId =
  | "Intake"
  | "Identification"
  | "Context"
  | "Authentication"
  | "Authorization"
  | "Trust"
  | "Consent"
  | "Normalization"
  | "Validation"
  | "Routing"
  | "Response"
  | "System";

/** Base registry entry shape. */
export interface ExecutiveGatewayRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-1:1" | "NEA-1:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface ExecutiveGatewayRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-1:2";
  readonly owner: string;
  readonly status: ExecutiveGatewayRegistryStatus;
  readonly readiness: ExecutiveGatewayRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface ExecutiveGatewayRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:2";
  readonly status: ExecutiveGatewayRegistryStatus;
  readonly readiness: ExecutiveGatewayRegistryReadiness;
  readonly foundationId: string;
  readonly sourceFamilyCount: number;
  readonly channelTypeCount: number;
  readonly modalityCount: number;
  readonly senderKindCount: number;
  readonly authenticationMethodCount: number;
  readonly authorizationStatusCount: number;
  readonly trustLevelCount: number;
  readonly consentStatusCount: number;
  readonly validationStatusCount: number;
  readonly routingDestinationCount: number;
  readonly lifecycleStateCount: number;
  readonly capabilityCount: number;
  readonly policyCount: number;
  readonly diagnosticCategoryCount: number;
  readonly totalRegistryEntryCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
