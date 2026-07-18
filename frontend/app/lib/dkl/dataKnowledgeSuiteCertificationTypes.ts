/**
 * DKL-9:7 — Data Knowledge Suite Certification Types.
 *
 * Categories, outcomes, criteria, gates, and report contracts.
 * Metadata-only. No enforcement or runtime certification execution.
 *
 * Ownership: owned exclusively by DKL-9:7.
 */

export type DataKnowledgeSuiteCertificationStatus = "Certified";

export type DataKnowledgeSuiteCertificationReadiness = "ReadyForFreeze";

export type DataKnowledgeSuiteCertificationOutcome =
  | "Pass"
  | "Fail"
  | "NotApplicable"
  | "NotEvaluated";

export type DataKnowledgeSuiteCertificationCategory =
  | "Identity"
  | "Dependency"
  | "Platform"
  | "CapabilityCatalog"
  | "Ownership"
  | "Boundaries"
  | "Compatibility"
  | "Guarantees"
  | "CanonicalReferences"
  | "CanonicalInventory"
  | "PlatformMetadata"
  | "PlatformReadiness";

export type DataKnowledgeSuiteCertificationGateName =
  | "IdentityGate"
  | "DependencyGate"
  | "PlatformIntegrityGate"
  | "CapabilityCatalogGate"
  | "OwnershipBoundaryGate"
  | "CompatibilityGate"
  | "GuaranteesGate"
  | "ReferenceIntegrityGate"
  | "CanonicalInventoryGate"
  | "PlatformMetadataGate"
  | "ImmutabilityGate"
  | "RuntimeProhibitionGate"
  | "FreezeReadinessGate";

export interface DataKnowledgeSuiteCertificationCategoryDescriptor {
  readonly categoryId: string;
  readonly category: DataKnowledgeSuiteCertificationCategory;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteCertificationOutcomeDescriptor {
  readonly outcomeId: string;
  readonly outcome: DataKnowledgeSuiteCertificationOutcome;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteCertificationCriterion {
  readonly id: string;
  readonly name: string;
  readonly category: DataKnowledgeSuiteCertificationCategory;
  readonly description: string;
  readonly required: true;
  readonly status: "Active";
  readonly outcome: DataKnowledgeSuiteCertificationOutcome;
  readonly sourceReference: string;
  readonly expected: string;
  readonly actual: string;
  readonly sourcePhase: "DKL-9:7";
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteCertificationGate {
  readonly id: string;
  readonly name: DataKnowledgeSuiteCertificationGateName;
  readonly requiredCriterionIds: readonly string[];
  readonly blocking: true;
  readonly outcome: DataKnowledgeSuiteCertificationOutcome;
  readonly status: "Active";
  readonly readinessResult?: "ReadyForFreeze";
  readonly sourcePhase: "DKL-9:7";
  readonly executesExternalBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteCertificationReport {
  readonly reportId: string;
  readonly certificationId: string;
  readonly targetPlatformId: string;
  readonly criterionCount: number;
  readonly passedCriteria: number;
  readonly failedCriteria: number;
  readonly gateCount: number;
  readonly passedGates: number;
  readonly failedGates: number;
  readonly result: DataKnowledgeSuiteCertificationOutcome;
  readonly status: DataKnowledgeSuiteCertificationStatus;
  readonly readiness: DataKnowledgeSuiteCertificationReadiness;
  readonly evidenceReferences: readonly string[];
  readonly generatesTimestamps: false;
  readonly persists: false;
  readonly transmits: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteCertificationSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteCertificationStatus;
  readonly certificationOutcome: DataKnowledgeSuiteCertificationOutcome;
  readonly readiness: DataKnowledgeSuiteCertificationReadiness;
  readonly upstreamDependency: string;
  readonly criterionCount: number;
  readonly gateCount: number;
  readonly passedCriterionCount: number;
  readonly failedCriterionCount: number;
  readonly capabilityCount: number;
  readonly publicApiInventoryTotal: number;
  readonly platformTotalEntryCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
