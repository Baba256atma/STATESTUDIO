/**
 * DKL-7:7 — Knowledge Services Certification Types.
 *
 * Readonly contracts for the canonical Knowledge Services Certification.
 * Metadata-only. No runtime behavior. No executable validators.
 *
 * Ownership: owned exclusively by DKL-7:7.
 */

export type KnowledgeServicesCertificationStatus = "Certified";

export type KnowledgeServicesCertificationResult = "Pass" | "Fail" | "NotApplicable";

export type KnowledgeServicesCertificationOverallResult = "Pass";

export type KnowledgeServicesCertificationReadiness = "ReadyForFreeze";

export type KnowledgeServicesCertificationArchitectureStatus =
  "CertifiedThroughPlatform";

export type KnowledgeServicesCertificationGateGroupId =
  | "Identity"
  | "DependencyChain"
  | "FoundationIntegrity"
  | "RegistryIntegrity"
  | "ModelIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "OwnershipAndBoundaries"
  | "CompatibilityAndConsumers"
  | "RuntimeProhibitions"
  | "FreezeReadiness";

export type KnowledgeServicesCertificationGateSeverity =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informational";

export type KnowledgeServicesCertificationGateResult =
  KnowledgeServicesCertificationResult;

export type KnowledgeServicesCertificationGateId = string;

export interface KnowledgeServicesCertificationIdentity {
  readonly certificationId: "DKL-7:7/KnowledgeServicesCertification";
  readonly certificationName: "Knowledge Services Certification";
  readonly certificationVersion: string;
  readonly certificationNamespace: "nexora.dkl.knowledge-services.certification";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Certification";
  readonly sourcePhase: "DKL-7:7";
  readonly owner: string;
  readonly status: KnowledgeServicesCertificationStatus;
  readonly certificationResult: KnowledgeServicesCertificationOverallResult;
  readonly architectureStatus: KnowledgeServicesCertificationArchitectureStatus;
  readonly readiness: KnowledgeServicesCertificationReadiness;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly manifestId: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesCertificationMetadata {
  readonly metadataId: "DKL-7:7/KnowledgeServicesCertificationMetadata";
  readonly certificationId: "DKL-7:7/KnowledgeServicesCertification";
  readonly description: string;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeBehavior: false;
  readonly transportNeutral: true;
  readonly persistenceNeutral: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesCertificationGateGroup {
  readonly groupId: KnowledgeServicesCertificationGateGroupId;
  readonly groupName: string;
  readonly description: string;
  readonly gateCount: number;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertificationGate {
  readonly gateId: KnowledgeServicesCertificationGateId;
  readonly gateName: string;
  readonly description: string;
  readonly group: KnowledgeServicesCertificationGateGroupId;
  readonly severity: KnowledgeServicesCertificationGateSeverity;
  readonly subject: string;
  readonly expectedState: string;
  readonly certifiedState: string;
  readonly evidenceReferences: readonly string[];
  readonly result: KnowledgeServicesCertificationGateResult;
  readonly failureImpact: string;
  readonly freezeRelevance: string;
  readonly deterministicOrder: number;
  readonly runtimeBehavior: "None";
}

export interface KnowledgeServicesCertificationEvidence {
  readonly evidenceId: string;
  readonly gateReference: string;
  readonly evidenceType: string;
  readonly canonicalSubjectReference: string;
  readonly expectedArchitecturalState: string;
  readonly certifiedArchitecturalState: string;
  readonly sourcePhase: string;
  readonly canonicalReferencePath: string;
  readonly result: KnowledgeServicesCertificationGateResult;
  readonly immutabilityStatus: "Immutable";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertificationEvidenceReference {
  readonly evidenceId: string;
  readonly gateId: string;
}

export interface KnowledgeServicesCertificationGateResultRecord {
  readonly resultId: string;
  readonly gateId: string;
  readonly gateGroup: KnowledgeServicesCertificationGateGroupId;
  readonly severity: KnowledgeServicesCertificationGateSeverity;
  readonly evidenceReferences: readonly string[];
  readonly outcome: KnowledgeServicesCertificationGateResult;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertificationFinding {
  readonly findingId: string;
  readonly severity: KnowledgeServicesCertificationGateSeverity;
  readonly subject: string;
  readonly description: string;
  readonly gateReference: string | null;
  readonly altersGateInventory: false;
}

export interface KnowledgeServicesCertificationCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly subject: string;
  readonly direction: string;
  readonly compatibilityType: string;
  readonly status: "Compatible";
  readonly certificationResult: "Pass";
  readonly canonicalPath: string;
  readonly ownershipConstraint: string;
  readonly boundaryConstraint: string;
  readonly changePolicy: string;
  readonly runtimeAuthorization: "None";
  readonly evidenceReference: string;
  readonly freezeRelevance: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertificationRegressionCheck {
  readonly regressionId: string;
  readonly subject: string;
  readonly baseline: string;
  readonly certifiedValue: string;
  readonly status: "Pass";
  readonly changeClassification: string;
  readonly evidenceReference: string;
  readonly freezeImpact: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertificationGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: "Guaranteed";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertificationInventory {
  readonly inventoryId: "DKL-7:7/KnowledgeServicesCertificationInventory";
  readonly completedPhaseCount: 7;
  readonly futurePhaseCount: 2;
  readonly totalPhaseCount: 9;
  readonly sectionCount: 18;
  readonly gateGroupCount: 12;
  readonly gateCount: 18;
  readonly evidenceCount: 18;
  readonly resultCount: 18;
  readonly passedCount: 18;
  readonly failedCount: 0;
  readonly notApplicableCount: 0;
  readonly findingCount: 0;
  readonly compatibilityCount: 16;
  readonly regressionCount: 12;
  readonly guaranteeCount: 22;
  readonly publicApiCount: 12;
  readonly platformSectionCount: 20;
  readonly platformDependencyCount: 12;
  readonly platformConsumerCount: 4;
  readonly platformCompatibilityCount: 14;
  readonly platformGuaranteeCount: 20;
  readonly platformInventoryCount: 527;
  readonly serviceCount: 12;
  readonly capabilityCount: 12;
  readonly contractCount: 11;
  readonly modelInventoryCount: 79;
  readonly validationPassCount: 48;
  readonly manifestInventoryCount: 447;
  readonly ownedResponsibilityCount: 6;
  readonly nonOwnedResponsibilityCount: 24;
  readonly prohibitedSurfaceCount: 29;
  readonly mutationModeCount: 0;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesCertificationSummary {
  readonly certificationId: string;
  readonly version: string;
  readonly status: KnowledgeServicesCertificationStatus;
  readonly result: KnowledgeServicesCertificationOverallResult;
  readonly readiness: KnowledgeServicesCertificationReadiness;
  readonly architectureStatus: KnowledgeServicesCertificationArchitectureStatus;
  readonly platformId: string;
  readonly manifestId: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly certificationSectionCount: number;
  readonly gateGroupCount: number;
  readonly gateCount: number;
  readonly evidenceCount: number;
  readonly resultCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly notApplicableCount: number;
  readonly findingCount: number;
  readonly compatibilityCount: number;
  readonly regressionCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly platformSectionCount: number;
  readonly platformInventoryCount: 527;
  readonly manifestInventoryCount: 447;
  readonly modelInventoryCount: 79;
  readonly validationPassCount: 48;
  readonly serviceCount: 12;
  readonly capabilityCount: 12;
  readonly contractCount: 11;
  readonly ownedResponsibilityCount: 6;
  readonly nonOwnedResponsibilityCount: 24;
  readonly prohibitedSurfaceCount: 29;
  readonly mutationModeCount: 0;
  readonly certificationInventoryCount: 137;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesCertificationReport {
  readonly reportId: string;
  readonly certificationId: string;
  readonly overallResult: KnowledgeServicesCertificationOverallResult;
  readonly readiness: KnowledgeServicesCertificationReadiness;
  readonly gateCount: 18;
  readonly passedCount: 18;
  readonly failedCount: 0;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesCertifiedPhaseReference {
  readonly phaseId: string;
  readonly stage: string;
  readonly version: string;
  readonly completionStatus: string;
  readonly certified: boolean;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesCertifiedConsumerPath {
  readonly consumerId: string;
  readonly consumerName: string;
  readonly allowedAccessPath: string;
  readonly directImportAuthorization: boolean;
  readonly runtimeAuthorization: "None";
}

export interface KnowledgeServicesCertifiedBoundaryDeclaration {
  readonly boundariesId: string;
  readonly prohibitedSurfaceCount: 29;
  readonly weakenedProhibitions: false;
  readonly preservedByReference: true;
}

export interface KnowledgeServicesCertifiedOwnershipDeclaration {
  readonly ownershipId: string;
  readonly ownedCount: 6;
  readonly nonOwnedCount: 24;
  readonly ownershipExpanded: false;
  readonly preservedByReference: true;
}

export interface KnowledgeServicesCertificationPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}
