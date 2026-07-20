/**
 * NEA-2:7 — Channel Connectors Certification Types.
 *
 * Readonly contracts for declarative Channel Connectors certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-2:7.
 */

/** Certification status for NEA-2:7. */
export type ChannelConnectorCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type ChannelConnectorCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers. */
export type ChannelConnectorCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "ConnectorIdentityIntegrity"
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
export type ChannelConnectorCertificationGateOutcome = "Pass" | "Fail";

/** Certification gate declaration. */
export interface ChannelConnectorCertificationGate {
  readonly gateId: ChannelConnectorCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly outcome: ChannelConnectorCertificationGateOutcome;
  readonly evidenceRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface ChannelConnectorComplianceDeclaration {
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
export interface ChannelConnectorCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-2:7";
  readonly owner: string;
  readonly status: ChannelConnectorCertificationStatus;
  readonly readiness: ChannelConnectorCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface ChannelConnectorCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:7";
  readonly status: ChannelConnectorCertificationStatus;
  readonly readiness: ChannelConnectorCertificationReadiness;
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
