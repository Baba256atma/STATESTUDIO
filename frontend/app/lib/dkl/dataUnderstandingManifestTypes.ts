/**
 * DKL-3:5 — Data Understanding Manifest Types.
 *
 * Readonly contracts for the canonical immutable Manifest layer.
 * Metadata publication only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:5.
 */

export interface DataUnderstandingManifestIdentityDescriptor {
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly manifestName: string;
  readonly manifestNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:5";
  readonly platformId: "DKL-3";
  readonly status: "ManifestComplete";
  readonly readiness: "ReadyForPlatform";
}

export interface ManifestComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly sourcePhase: string;
  readonly kind: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ManifestDependencyEntry {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly module: string;
  readonly version: string | null;
  readonly phase: string;
  readonly readiness: string;
  readonly required: true;
  readonly futurePhase: false;
}

export interface ManifestCompatibilityEntry {
  readonly compatibilityId: string;
  readonly name: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";
  readonly description: string;
}

export interface ManifestInventoryCounts {
  readonly foundationPhaseCount: 1;
  readonly registryPhaseCount: 1;
  readonly modelPhaseCount: 1;
  readonly validationPhaseCount: 1;
  readonly subjectCount: number;
  readonly candidateTypeCount: number;
  readonly candidateStatusCount: number;
  readonly evidenceCategoryCount: number;
  readonly evidencePriorityTierCount: number;
  readonly relationshipKindCount: number;
  readonly clarificationTypeCount: number;
  readonly clarificationStatusCount: number;
  readonly confidenceLevelCount: number;
  readonly ambiguityLevelCount: number;
  readonly lifecycleStateCount: number;
  readonly processingPolicyCount: number;
  readonly understandingScopeCount: number;
  readonly resultStatusCount: number;
  readonly validationRuleCount: number;
  readonly modelKindCount: number;
  readonly registryEntryFamilyCount: number;
  readonly referenceKindCount: number;
  readonly publicApiCount: number;
  readonly dependencyCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
}

export interface ManifestReadinessDescriptor {
  readonly FoundationComplete: true;
  readonly RegistryComplete: true;
  readonly ModelComplete: true;
  readonly ValidationComplete: true;
  readonly ManifestComplete: true;
  readonly ReadyForPlatform: true;
  readonly ReadyForCertification: true;
  readonly ReadyForFreeze: true;
  readonly ReadyForPublicIndex: true;
  readonly MetadataOnly: true;
  readonly Deterministic: true;
  readonly Immutable: true;
  readonly UnderstandingForbidden: true;
  readonly ValidationExecutionForbidden: true;
  readonly BusinessObjectCreationForbidden: true;
  readonly KnowledgeGraphForbidden: true;
  readonly PersistenceForbidden: true;
  readonly AIFree: true;
  readonly EngineFree: true;
}

export interface ManifestSummaryDescriptor {
  readonly totalSubjects: number;
  readonly totalCandidateTypes: number;
  readonly totalEvidenceCategories: number;
  readonly totalRelationshipTypes: number;
  readonly totalValidationRules: number;
  readonly totalPublicApis: number;
  readonly totalDependencies: number;
  readonly totalModels: number;
  readonly totalRegistries: number;
  readonly totalComponents: number;
  readonly totalReferences: number;
  readonly totalPhasesCompleted: 4;
  readonly platformId: "DKL-3";
  readonly nextPhase: "DKL-3:6";
}
