/**
 * NEA-1:7 — Executive Gateway Certification Types.
 *
 * Readonly contracts for declarative Executive Gateway certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-1:7.
 */

/** Certification status for NEA-1:7. */
export type ExecutiveGatewayCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type ExecutiveGatewayCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers. */
export type ExecutiveGatewayCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "CanonicalReferenceIntegrity"
  | "OwnershipIntegrity"
  | "NamespaceIntegrity"
  | "PublicExportIntegrity"
  | "InventoryIntegrity"
  | "MetadataIntegrity"
  | "ReadinessIntegrity"
  | "ImmutabilityIntegrity"
  | "ArchitectureCompleteness"
  | "ConsumerReadiness";

/** Declarative gate outcome. */
export type ExecutiveGatewayCertificationGateOutcome = "Pass" | "Fail";

/** Certification gate declaration. */
export interface ExecutiveGatewayCertificationGate {
  readonly gateId: ExecutiveGatewayCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly outcome: ExecutiveGatewayCertificationGateOutcome;
  readonly evidenceRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface ExecutiveGatewayComplianceDeclaration {
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
export interface ExecutiveGatewayCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-1:7";
  readonly owner: string;
  readonly status: ExecutiveGatewayCertificationStatus;
  readonly readiness: ExecutiveGatewayCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface ExecutiveGatewayCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:7";
  readonly status: ExecutiveGatewayCertificationStatus;
  readonly readiness: ExecutiveGatewayCertificationReadiness;
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
