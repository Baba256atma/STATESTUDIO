/**
 * DKL-3:7 — Data Understanding Certification Types.
 *
 * Readonly contracts for the canonical immutable Certification layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:7.
 */

export type CertificationGateStatus = "Certified";
export type CertificationGateResult = "PASS";
export type CertificationSeverity = "Critical" | "High" | "Medium";

export interface DataUnderstandingCertificationIdentityDescriptor {
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly certificationName: string;
  readonly certificationNamespace: string;
  readonly platformId: "DKL-3";
  readonly platformVersion: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:7";
  readonly status: "Certified";
  readonly readiness: "ReadyForFreeze";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationGate {
  readonly gateId: string;
  readonly gateName: string;
  readonly description: string;
  readonly category: string;
  readonly severity: CertificationSeverity;
  readonly sourcePhases: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly expectedStatus: CertificationGateResult;
  readonly actualStatus: CertificationGateResult;
  readonly status: CertificationGateStatus;
  readonly blocking: true;
  readonly readinessImpact: string;
}

export interface CertificationEvidenceItem {
  readonly evidenceId: string;
  readonly category: string;
  readonly description: string;
  readonly sourcePhase: string;
  readonly sourceReference: string;
  readonly certified: true;
  readonly limitations: string;
}

export interface CertificationCompatibilityEntry {
  readonly compatibilityId: string;
  readonly name: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";
  readonly description: string;
}

export interface CertificationComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly sourcePhase: string;
  readonly kind: string;
  readonly publicApiCount: 8;
  readonly certified: true;
}

export interface CertificationCounts {
  readonly gateCount: number;
  readonly certifiedGateCount: number;
  readonly evidenceCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly dependencyCount: number;
  readonly publicApiCount: 8;
  readonly phasesCertified: 6;
}

export interface CertificationReadinessDescriptor {
  readonly FoundationCertified: true;
  readonly RegistryCertified: true;
  readonly ModelCertified: true;
  readonly ValidationCertified: true;
  readonly ManifestCertified: true;
  readonly PlatformCertified: true;
  readonly DependenciesCertified: true;
  readonly CompatibilityCertified: true;
  readonly OwnershipCertified: true;
  readonly BoundaryCertified: true;
  readonly PublicApiCertified: true;
  readonly DeterministicCertified: true;
  readonly ImmutableCertified: true;
  readonly ReadyForFreeze: true;
  readonly Certified: true;
  readonly MetadataOnly: true;
  readonly CertificationOnly: true;
  readonly UnderstandingForbidden: true;
  readonly ValidationExecutionForbidden: true;
  readonly BusinessObjectCreationForbidden: true;
  readonly KnowledgeGraphForbidden: true;
  readonly PersistenceForbidden: true;
  readonly AIFree: true;
  readonly EngineFree: true;
}
