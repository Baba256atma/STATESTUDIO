/**
 * NEA-3:7 — Session & Conversation Certification Types.
 *
 * Readonly contracts for declarative Session & Conversation certification.
 * Metadata-only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-3:7.
 */

/** Certification status for NEA-3:7. */
export type SessionConversationCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type SessionConversationCertificationReadiness = "ReadyForFreeze";

/** Certification gate identifiers. */
export type SessionConversationCertificationGateId =
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "SessionIdentityIntegrity"
  | "ConversationIdentityIntegrity"
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
export type SessionConversationCertificationGateOutcome = "Pass" | "Fail";

/** Certification gate declaration. */
export interface SessionConversationCertificationGate {
  readonly gateId: SessionConversationCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly outcome: SessionConversationCertificationGateOutcome;
  readonly evidenceRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compliance dimension declaration. */
export interface SessionConversationComplianceDeclaration {
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
export interface SessionConversationCertificationIdentity {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly certificationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:7";
  readonly stage: "Certification";
  readonly sourcePhase: "NEA-3:7";
  readonly owner: string;
  readonly status: SessionConversationCertificationStatus;
  readonly readiness: SessionConversationCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic certification summary. */
export interface SessionConversationCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:7";
  readonly status: SessionConversationCertificationStatus;
  readonly readiness: SessionConversationCertificationReadiness;
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
