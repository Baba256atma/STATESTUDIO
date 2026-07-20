/**
 * NEA-5:4 — Gateway Routing Validation Types.
 *
 * Readonly contracts for declarative Gateway Routing validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-5:4.
 */

/** Validation status for NEA-5:4. */
export type GatewayRoutingValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type GatewayRoutingValidationReadiness = "ReadyForManifest";

/** Validation category identifiers — exactly twenty-two. */
export type GatewayRoutingValidationCategoryId =
  | "RouteIdentity"
  | "RouteDefinition"
  | "RouteDestination"
  | "RouteDecision"
  | "RouteContext"
  | "RouteStrategy"
  | "RoutePriority"
  | "RouteStatus"
  | "RouteResult"
  | "RoutePolicy"
  | "RouteMetadata"
  | "RouteCapability"
  | "RouteLifecycle"
  | "RouteRequest"
  | "RouteResponse"
  | "RouteResolution"
  | "RouteDiagnostics"
  | "RouteSummary"
  | "RouteConfiguration"
  | "RouteReference"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-5:3 domain models. */
export type GatewayRoutingValidationTarget =
  | "RouteIdentity"
  | "RouteDefinition"
  | "RouteDestination"
  | "RouteDecision"
  | "RouteContext"
  | "RouteStrategy"
  | "RoutePriority"
  | "RouteStatus"
  | "RouteResult"
  | "RoutePolicy"
  | "RouteMetadata"
  | "RouteCapability"
  | "RouteLifecycle"
  | "RouteRequest"
  | "RouteResponse"
  | "RouteResolution"
  | "RouteDiagnostics"
  | "RouteSummary"
  | "RouteConfiguration"
  | "RouteReference"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type GatewayRoutingValidationSeverity = "Error" | "Warning" | "Info";

/** Declarative validation rule. */
export interface GatewayRoutingValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: GatewayRoutingValidationCategoryId;
  readonly targetModelKind: GatewayRoutingValidationTarget;
  readonly description: string;
  readonly severity: GatewayRoutingValidationSeverity;
  readonly modelReference: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface GatewayRoutingValidationCategory {
  readonly categoryId: GatewayRoutingValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: GatewayRoutingValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface GatewayRoutingValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: GatewayRoutingValidationCategoryId;
  readonly targetCategoryId: GatewayRoutingValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface GatewayRoutingValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface GatewayRoutingValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-5:4";
  readonly owner: string;
  readonly status: GatewayRoutingValidationStatus;
  readonly readiness: GatewayRoutingValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface GatewayRoutingValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:4";
  readonly status: GatewayRoutingValidationStatus;
  readonly readiness: GatewayRoutingValidationReadiness;
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
