/**
 * DKL-8:5 — Knowledge Governance Manifest Types.
 *
 * Readonly contracts for the immutable Knowledge Governance Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-8:5.
 */

export type KnowledgeGovernanceManifestStatus = "ManifestDefined";

export type KnowledgeGovernanceManifestReadiness = "ReadyForPlatform";

export interface KnowledgeGovernanceManifestArchitecturePhase {
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

export interface KnowledgeGovernanceManifestDependency {
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

export interface KnowledgeGovernanceManifestCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly statement: string;
  readonly compatible: true;
  readonly targetPhase: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceManifestGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceManifestPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceManifestOwnershipDeclaration {
  readonly ownershipId: string;
  readonly ownedCount: number;
  readonly nonOwnedCount: number;
  /** Preserved Registry ownership collection by canonical reference. */
  readonly owns: readonly { readonly id: string; readonly name: string }[];
  /** Preserved Registry non-ownership collection by canonical reference. */
  readonly doesNotOwn: readonly { readonly id: string; readonly name: string }[];
  readonly sourcePhase: "DKL-8:2";
  readonly preservedByReference: true;
  readonly metadataOnly: true;
}

export interface KnowledgeGovernanceManifestInventory {
  readonly inventoryId: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly totalDkl8PhaseCount: number;
  readonly dependencyCount: number;
  readonly registryEntryCount: number;
  readonly subjectCount: number;
  readonly contractCount: number;
  readonly roleCount: number;
  readonly capabilityCount: number;
  readonly classificationCount: number;
  readonly sensitivityCount: number;
  readonly accessIntentCount: number;
  readonly usagePolicyCount: number;
  readonly retentionIntentCount: number;
  readonly dispositionIntentCount: number;
  readonly auditIntentCount: number;
  readonly complianceIntentCount: number;
  readonly lifecycleStateCount: number;
  readonly lifecycleTransitionCount: number;
  readonly evidenceKindCount: number;
  readonly exceptionCategoryCount: number;
  readonly ownershipDeclarationCount: number;
  readonly boundaryCount: number;
  readonly modelKindCount: number;
  readonly relationshipKindCount: number;
  readonly assignmentModelCount: number;
  readonly policyModelCount: number;
  readonly lifecycleModelCount: number;
  readonly evidenceModelCount: number;
  readonly compositeModelCount: number;
  readonly validationRuleCount: number;
  readonly validationCategoryCount: number;
  readonly validationGateCount: number;
  readonly validationSeverityCount: number;
  readonly validationOutcomeCount: number;
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

export interface KnowledgeGovernanceManifestSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceManifestStatus;
  readonly readiness: KnowledgeGovernanceManifestReadiness;
  readonly upstreamDependency: string;
  readonly validationOutcome: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly registryEntryCount: number;
  readonly modelKindCount: number;
  readonly validationRuleCount: number;
  readonly totalEntryCount: number;
  readonly sectionCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
