/**
 * NEA-5:7 — Gateway Routing Certification Types.
 *
 * Readonly contracts for declarative Gateway Routing certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-5:7.
 */

/** Certification status for NEA-5:7. */
export type GatewayRoutingCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type GatewayRoutingCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers — exactly seventeen. */
export type GatewayRoutingCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "RouteIdentityIntegrity"
  | "RouteDefinitionIntegrity"
  | "CanonicalReferenceIntegrity"
  | "OwnershipIntegrity"
  | "NamespaceIntegrity"
  | "PublicExportIntegrity"
  | "InventoryIntegrity"
  | "MetadataIntegrity"
  | "ImmutabilityIntegrity"
  | "ArchitectureCompleteness"
  | "ConsumerReadiness";

/** Declarative gate outcome. */
export type GatewayRoutingCertificationGateOutcome = "Pass" | "Fail";

/** Certification gate declaration. */
export interface GatewayRoutingCertificationGate {
  readonly gateId: GatewayRoutingCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly outcome: GatewayRoutingCertificationGateOutcome;
  readonly evidenceRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface GatewayRoutingComplianceDeclaration {
  readonly complianceId: string;
  readonly complianceName: string;
  readonly description: string;
  readonly compliant: true;
  readonly platformReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical certification identity. */
export interface GatewayRoutingCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-5:7";
  readonly owner: string;
  readonly status: GatewayRoutingCertificationStatus;
  readonly readiness: GatewayRoutingCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface GatewayRoutingCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:7";
  readonly status: GatewayRoutingCertificationStatus;
  readonly readiness: GatewayRoutingCertificationReadiness;
  readonly platformId: string;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly complianceCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
