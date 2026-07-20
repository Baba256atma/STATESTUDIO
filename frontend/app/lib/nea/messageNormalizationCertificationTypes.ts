/**
 * NEA-6:7 — Message Normalization Certification Types.
 *
 * Readonly contracts for declarative Message Normalization certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-6:7.
 */

/** Certification status for NEA-6:7. */
export type MessageNormalizationCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type MessageNormalizationCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers — exactly seventeen. */
export type MessageNormalizationCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "ExecutiveMessageIntegrity"
  | "MessageIdentityRegistryIntegrity"
  | "PayloadRegistryIntegrity"
  | "CanonicalReferenceIntegrity"
  | "OwnershipIntegrity"
  | "NamespaceIntegrity"
  | "PublicExportIntegrity"
  | "InventoryIntegrity"
  | "MetadataIntegrity"
  | "ArchitectureCompleteness"
  | "ConsumerReadiness";

/** Declarative gate outcome. */
export type MessageNormalizationCertificationGateOutcome = "Pass" | "Fail";

/** Certification gate declaration. */
export interface MessageNormalizationCertificationGate {
  readonly gateId: MessageNormalizationCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly outcome: MessageNormalizationCertificationGateOutcome;
  readonly evidenceRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface MessageNormalizationComplianceDeclaration {
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
export interface MessageNormalizationCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-6:7";
  readonly owner: string;
  readonly status: MessageNormalizationCertificationStatus;
  readonly readiness: MessageNormalizationCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface MessageNormalizationCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:7";
  readonly status: MessageNormalizationCertificationStatus;
  readonly readiness: MessageNormalizationCertificationReadiness;
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
