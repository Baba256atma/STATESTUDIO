/**
 * NEA-7:7 — Intake Orchestration Certification Types.
 *
 * Readonly contracts for declarative Intake Orchestration certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-7:7.
 */

/** Certification status for NEA-7:7. */
export type IntakeOrchestrationCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type IntakeOrchestrationCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers — exactly seventeen. */
export type IntakeOrchestrationCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "ExecutiveIntakePackageIntegrity"
  | "IntakeIdentityRegistryIntegrity"
  | "ReferenceIntegrity"
  | "CanonicalReferenceIntegrity"
  | "OwnershipIntegrity"
  | "NamespaceIntegrity"
  | "PublicExportIntegrity"
  | "InventoryIntegrity"
  | "MetadataIntegrity"
  | "ArchitectureCompleteness"
  | "ConsumerReadiness";

/** Declarative gate outcome. */
export type IntakeOrchestrationCertificationGateOutcome = "Pass" | "Fail";

/** Certification gate declaration. */
export interface IntakeOrchestrationCertificationGate {
  readonly gateId: IntakeOrchestrationCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly outcome: IntakeOrchestrationCertificationGateOutcome;
  readonly evidenceRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface IntakeOrchestrationComplianceDeclaration {
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
export interface IntakeOrchestrationCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-7:7";
  readonly owner: string;
  readonly status: IntakeOrchestrationCertificationStatus;
  readonly readiness: IntakeOrchestrationCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface IntakeOrchestrationCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:7";
  readonly status: IntakeOrchestrationCertificationStatus;
  readonly readiness: IntakeOrchestrationCertificationReadiness;
  readonly platformId: string;
  readonly architectureVersion: string;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly complianceCount: number;
  readonly composedPhaseCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
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
