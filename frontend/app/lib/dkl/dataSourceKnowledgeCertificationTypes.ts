/**
 * DKL-2:7 — Data Source & Knowledge Certification Types.
 *
 * Readonly, metadata-only contracts for the DKL-2:7 certification layer. This
 * module declares the shapes for the certification identity, component registry,
 * gates, evidence inventory, compatibility declarations, manifest, summary, and
 * the aggregate certification platform root.
 *
 * Responsibility: shared immutable certification vocabulary.
 * Ownership: owned exclusively by DKL-2:7.
 * Dependency rules: pure type/constant module; no phase imports.
 * Architectural purpose: the certification contract surface. No runtime
 * behavior, no side effects, no I/O.
 */

export const CERTIFICATION_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const CERTIFICATION_VERSION = "1.0.0";

export const CERTIFICATION_SOURCE_PHASE = "DKL-2:7";

export type CertificationStatus = "Certified";

export type CertificationReadiness = "ReadyForFreeze";

export type ComponentKind =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "PublicSurface";

export type GateCategory =
  | "Completeness"
  | "Integrity"
  | "Ownership"
  | "Dependency"
  | "PublicApi"
  | "Immutability"
  | "Determinism"
  | "RuntimeBoundary";

export type GateSeverity = "Critical" | "High" | "Medium";

export type GateExpectedStatus = "PASS";

export type GateActualStatus = "PASS";

export type GateResultStatus = "Certified";

export type EvidenceStatus = "Verified";

export type CompatibilityStatus = "Compatible";

export type EvidenceValue = string | number | boolean;

export interface CertificationIdentityDescriptor {
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly certificationName: string;
  readonly certificationNamespace: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly status: CertificationStatus;
  readonly readiness: CertificationReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly componentKind: ComponentKind;
  readonly sourcePhase: string;
  readonly publicModule: string;
  readonly status: CertificationStatus;
  readonly evidenceIds: readonly string[];
  readonly blockingIssueCount: 0;
  readonly warningCount: 0;
  readonly readiness: CertificationReadiness;
}

export interface CertificationComponentRegistry {
  readonly kind: "CertificationRegistry";
  readonly components: readonly CertificationComponentEntry[];
  readonly getComponentById: (componentId: string) => CertificationComponentEntry | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationGate {
  readonly gateId: string;
  readonly gateName: string;
  readonly description: string;
  readonly category: GateCategory;
  readonly severity: GateSeverity;
  readonly sourcePhases: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly expectedStatus: GateExpectedStatus;
  readonly actualStatus: GateActualStatus;
  readonly status: GateResultStatus;
  readonly blocking: boolean;
  readonly readinessImpact: string;
}

export interface CertificationGatesContainer {
  readonly kind: "CertificationGates";
  readonly gates: readonly CertificationGate[];
  readonly getGateById: (gateId: string) => CertificationGate | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationEvidenceItem {
  readonly evidenceId: string;
  readonly name: string;
  readonly description: string;
  readonly sourcePhase: string;
  readonly sourcePublicApi: string;
  readonly expectedValue: EvidenceValue;
  readonly actualValue: EvidenceValue;
  readonly status: EvidenceStatus;
}

export interface CertificationEvidenceInventory {
  readonly kind: "CertificationEvidence";
  readonly items: readonly CertificationEvidenceItem[];
  readonly getEvidenceById: (evidenceId: string) => CertificationEvidenceItem | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly status: CompatibilityStatus;
  readonly guarantees: readonly string[];
  readonly limitations: readonly string[];
}

export interface CertificationCompatibilityContainer {
  readonly kind: "CertificationCompatibility";
  readonly declarations: readonly CertificationCompatibilityDeclaration[];
  readonly getCompatibilityById: (
    compatibilityId: string,
  ) => CertificationCompatibilityDeclaration | undefined;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationManifestDescriptor {
  readonly certificationId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePhases: readonly string[];
  readonly dependencies: readonly string[];
  readonly componentCount: number;
  readonly gateCount: number;
  readonly evidenceCount: number;
  readonly compatibilityCount: number;
  readonly certifiedGateCount: number;
  readonly failedGateCount: number;
  readonly warningGateCount: number;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly certificationStatus: CertificationStatus;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly readiness: CertificationReadiness;
  readonly nextPhase: "DKL-2:8";
}

export interface CertificationSummaryDescriptor {
  readonly componentCount: number;
  readonly gateCount: number;
  readonly certifiedGateCount: number;
  readonly evidenceCount: number;
  readonly compatibilityCount: number;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly validationPassCount: number;
  readonly guaranteeCount: number;
  readonly registryEntryCount: number;
  readonly modelCount: number;
  readonly status: CertificationStatus;
  readonly readiness: CertificationReadiness;
  readonly nextPhase: "DKL-2:8";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface CertificationPlatformDescriptor {
  readonly identity: CertificationIdentityDescriptor;
  readonly registry: CertificationComponentRegistry;
  readonly gates: CertificationGatesContainer;
  readonly evidence: CertificationEvidenceInventory;
  readonly compatibility: CertificationCompatibilityContainer;
  readonly manifest: CertificationManifestDescriptor;
  readonly summary: CertificationSummaryDescriptor;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
}
