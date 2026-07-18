/**
 * DKL-8:6 — Knowledge Governance Platform Types.
 *
 * Readonly contracts for the immutable Knowledge Governance Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-8:6.
 */

export type KnowledgeGovernancePlatformStatus = "PlatformDefined";

export type KnowledgeGovernancePlatformReadiness = "ReadyForCertification";

export interface KnowledgeGovernancePlatformPhaseReference {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly stage: string;
  readonly version: string;
  readonly status: string;
  readonly directPredecessor: string | null;
  readonly directSuccessor: string | null;
  readonly canonicalReferencePath: string;
  readonly architectureRole: string;
  readonly runtimeBehavior: "None";
  readonly completed: boolean;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernancePlatformDependency {
  readonly dependencyId: string;
  readonly name: string;
  readonly targetPhase: string;
  readonly relationship: string;
  readonly accessPath: string;
  readonly direct: boolean;
  readonly reconstructed: false;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernancePlatformCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly statement: string;
  readonly compatible: true;
  readonly targetPhase: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernancePlatformGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernancePlatformPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernancePlatformInventory {
  readonly inventoryId: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly totalDkl8PhaseCount: number;
  readonly dependencyCount: number;
  readonly manifestTotalEntryCount: number;
  readonly registryEntryCount: number;
  readonly subjectCount: number;
  readonly contractCount: number;
  readonly roleCount: number;
  readonly capabilityCount: number;
  readonly classificationCount: number;
  readonly sensitivityCount: number;
  readonly modelKindCount: number;
  readonly relationshipKindCount: number;
  readonly validationRuleCount: number;
  readonly validationCategoryCount: number;
  readonly validationGateCount: number;
  readonly ownershipDeclarationCount: number;
  readonly boundaryCount: number;
  readonly manifestSectionCount: number;
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly publicApiCount: number;
  readonly sectionCount: number;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeGovernancePlatformSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernancePlatformStatus;
  readonly readiness: KnowledgeGovernancePlatformReadiness;
  readonly upstreamDependency: string;
  readonly validationOutcome: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly registryEntryCount: number;
  readonly modelKindCount: number;
  readonly validationRuleCount: number;
  readonly manifestTotalEntryCount: number;
  readonly totalEntryCount: number;
  readonly sectionCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
