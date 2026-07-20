/**
 * NEA-8:7 — Executive Gateway Suite Certification Types.
 *
 * Readonly contracts for declarative Executive Gateway Suite certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-8:7.
 */

/** Certification status for NEA-8:7. */
export type ExecutiveGatewaySuiteCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type ExecutiveGatewaySuiteCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers — exactly eighteen. */
export type ExecutiveGatewaySuiteCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "SuiteCompositionIntegrity"
  | "ComponentIdentityIntegrity"
  | "CanonicalReferenceIntegrity"
  | "DependencyIntegrity"
  | "OwnershipIntegrity"
  | "NamespaceIntegrity"
  | "PublicExportIntegrity"
  | "InventoryIntegrity"
  | "MetadataIntegrity"
  | "ImmutabilityIntegrity"
  | "ArchitectureCompleteness"
  | "ConsumerReadiness";

/** Declarative gate outcome. */
export type ExecutiveGatewaySuiteCertificationGateOutcome = "Pass" | "Fail";

/** Gate evaluation status — declarative only. */
export type ExecutiveGatewaySuiteCertificationGateStatus = "Evaluated";

/** Certification gate declaration. */
export interface ExecutiveGatewaySuiteCertificationGate {
  readonly id: ExecutiveGatewaySuiteCertificationGateId;
  readonly name: string;
  readonly description: string;
  readonly status: ExecutiveGatewaySuiteCertificationGateStatus;
  readonly outcome: ExecutiveGatewaySuiteCertificationGateOutcome;
  readonly rationale: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface ExecutiveGatewaySuiteComplianceDeclaration {
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
export interface ExecutiveGatewaySuiteCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-8:7";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteCertificationStatus;
  readonly readiness: ExecutiveGatewaySuiteCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface ExecutiveGatewaySuiteCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:7";
  readonly status: ExecutiveGatewaySuiteCertificationStatus;
  readonly readiness: ExecutiveGatewaySuiteCertificationReadiness;
  readonly platformId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly architectureVersion: string;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly complianceCount: number;
  readonly composedPhaseCount: number;
  readonly suiteComponentCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly publicApiInventoryTotal: number;
  readonly namespaceSectionCount: number;
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
