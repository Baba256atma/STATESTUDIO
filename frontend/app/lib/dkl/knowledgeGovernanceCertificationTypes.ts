/**
 * DKL-8:7 — Knowledge Governance Certification Types.
 *
 * Categories, outcomes, criteria, gates, and report contracts.
 * Metadata-only. No enforcement or runtime governance.
 *
 * Ownership: owned exclusively by DKL-8:7.
 */

export type KnowledgeGovernanceCertificationStatus = "Certified";

export type KnowledgeGovernanceCertificationReadiness = "ReadyForFreeze";

export type KnowledgeGovernanceCertificationOutcome =
  | "Pass"
  | "Fail"
  | "NotApplicable"
  | "NotEvaluated";

export type KnowledgeGovernanceCertificationCategory =
  | "Identity"
  | "Dependency"
  | "Architecture"
  | "PublicSurface"
  | "Inventory"
  | "ReferenceIntegrity"
  | "Ownership"
  | "Boundary"
  | "Compatibility"
  | "Immutability"
  | "Determinism"
  | "RuntimeProhibition"
  | "Readiness";

export type KnowledgeGovernanceCertificationCriterionName =
  | "IdentityCertified"
  | "DependencyCertified"
  | "ArchitectureChainCertified"
  | "PublicSurfaceCertified"
  | "ApiRegistryCertified"
  | "ManifestReferenceCertified"
  | "ValidationReferenceCertified"
  | "ModelReferenceCertified"
  | "RegistryReferenceCertified"
  | "FoundationReferenceCertified"
  | "OwnershipCertified"
  | "BoundariesCertified"
  | "CanonicalInventoryCertified"
  | "InventoryConsistencyCertified"
  | "ImmutabilityCertified"
  | "DeterminismCertified"
  | "RuntimeProhibitionsCertified"
  | "FreezeReadinessCertified";

export type KnowledgeGovernanceCertificationGateName =
  | "PlatformIdentityGate"
  | "DependencyIntegrityGate"
  | "ArchitectureChainGate"
  | "PublicSurfaceGate"
  | "ReferenceIntegrityGate"
  | "CanonicalInventoryGate"
  | "InventoryConsistencyGate"
  | "OwnershipBoundaryGate"
  | "CompatibilityGate"
  | "ImmutabilityGate"
  | "DeterminismGate"
  | "RuntimeProhibitionGate"
  | "FreezeReadinessGate";

export interface KnowledgeGovernanceCertificationCategoryDescriptor {
  readonly categoryId: string;
  readonly category: KnowledgeGovernanceCertificationCategory;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeGovernanceCertificationOutcomeDescriptor {
  readonly outcomeId: string;
  readonly outcome: KnowledgeGovernanceCertificationOutcome;
  readonly description: string;
  readonly isAuthorizationOutcome: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceCertificationCriterion {
  readonly id: string;
  readonly name: KnowledgeGovernanceCertificationCriterionName;
  readonly description: string;
  readonly category: KnowledgeGovernanceCertificationCategory;
  readonly required: true;
  readonly blocking: boolean;
  readonly sourcePhase: "DKL-8:7";
  readonly targetReference: string;
  readonly outcome: KnowledgeGovernanceCertificationOutcome;
  readonly status: "Active";
  readonly evidenceReferences: readonly string[];
  readonly expected: string;
  readonly actual: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceCertificationGate {
  readonly id: string;
  readonly name: KnowledgeGovernanceCertificationGateName;
  readonly requiredCriterionIds: readonly string[];
  readonly blocking: true;
  readonly outcome: KnowledgeGovernanceCertificationOutcome;
  readonly status: "Active";
  readonly sourcePhase: "DKL-8:7";
  readonly executesExternalBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceCertificationReport {
  readonly reportId: string;
  readonly certificationId: string;
  readonly targetPlatformId: string;
  readonly criterionCount: number;
  readonly passedCriterionCount: number;
  readonly failedCriterionCount: number;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly outcome: KnowledgeGovernanceCertificationOutcome;
  readonly status: KnowledgeGovernanceCertificationStatus;
  readonly readiness: KnowledgeGovernanceCertificationReadiness;
  readonly evidenceReferences: readonly string[];
  readonly generatesTimestamps: false;
  readonly persists: false;
  readonly transmits: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeGovernanceCertificationSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceCertificationStatus;
  readonly certificationOutcome: KnowledgeGovernanceCertificationOutcome;
  readonly readiness: KnowledgeGovernanceCertificationReadiness;
  readonly upstreamDependency: string;
  readonly criterionCount: number;
  readonly gateCount: number;
  readonly passedCriterionCount: number;
  readonly failedCriterionCount: number;
  readonly registryEntryCount: number;
  readonly modelKindCount: number;
  readonly validationRuleCount: number;
  readonly platformTotalEntryCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
