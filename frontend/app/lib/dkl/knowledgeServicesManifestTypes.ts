/**
 * DKL-7:5 — Knowledge Services Manifest Types.
 *
 * Readonly contracts for the canonical Knowledge Services Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-7:5.
 */

export type KnowledgeServicesManifestStage = "Manifest";

export type KnowledgeServicesManifestStatus = "ManifestComplete";

export type KnowledgeServicesManifestReadiness = "ReadyForPlatform";

export type KnowledgeServicesManifestArchitectureStatus =
  "CompleteThroughManifest";

export type KnowledgeServicesManifestDependencyType =
  | "CanonicalChain"
  | "FuturePhase"
  | "FutureConsumer";

export type KnowledgeServicesManifestDependencyDirection =
  | "Consumes"
  | "ProvidesFor";

export type KnowledgeServicesManifestCompatibilityStatus = "Compatible";

export interface KnowledgeServicesManifestIdentity {
  readonly manifestId: "DKL-7:5/KnowledgeServicesManifest";
  readonly manifestName: "Knowledge Services Manifest";
  readonly manifestVersion: string;
  readonly manifestNamespace: "nexora.dkl.knowledge-services.manifest";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: KnowledgeServicesManifestStage;
  readonly sourcePhase: "DKL-7:5";
  readonly owner: string;
  readonly status: KnowledgeServicesManifestStatus;
  readonly validationResult: "Pass";
  readonly architectureStatus: KnowledgeServicesManifestArchitectureStatus;
  readonly readiness: KnowledgeServicesManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesManifestMetadata {
  readonly metadataId: "DKL-7:5/KnowledgeServicesManifestMetadata";
  readonly manifestId: "DKL-7:5/KnowledgeServicesManifest";
  readonly description: string;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeBehavior: false;
  readonly transportNeutral: true;
  readonly persistenceNeutral: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesManifestArchitecturePhase {
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

export interface KnowledgeServicesManifestDependency {
  readonly dependencyId: string;
  readonly source: string;
  readonly target: string;
  readonly direction: KnowledgeServicesManifestDependencyDirection;
  readonly dependencyType: KnowledgeServicesManifestDependencyType;
  readonly required: boolean;
  readonly status: "Declared";
  readonly canonicalPath: string;
  readonly runtimeBehavior: "None";
  readonly introducesFutureImport: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly subject: string;
  readonly direction: string;
  readonly status: KnowledgeServicesManifestCompatibilityStatus;
  readonly compatibilityType: string;
  readonly dependencyPath: string;
  readonly ownershipConstraint: string;
  readonly boundaryConstraint: string;
  readonly runtimeAuthorization: "None";
  readonly changePolicy: string;
  readonly evidenceReference: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestOwnershipDeclaration {
  readonly ownershipId: string;
  readonly ownedCount: number;
  readonly nonOwnedCount: number;
  readonly ownedReferences: readonly string[];
  readonly nonOwnedReferences: readonly string[];
  readonly sourcePhase: "DKL-7:1";
  readonly preservedByReference: true;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesManifestBoundaryDeclaration {
  readonly boundaryId: string;
  readonly surface: string;
  readonly category: string;
  readonly ownership: "DKL-7";
  readonly enforcementStage: "ArchitectureDeclaration";
  readonly compatibilityRelevance: true;
  readonly foundationReference: string;
  readonly prohibited: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestServiceDeclaration {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly capabilityReference: string;
  readonly contractReference: string;
  readonly requestModelReference: string;
  readonly responseModelReference: string;
  readonly resultModelReference: string;
  readonly accessModeReference: string;
  readonly readOnly: true;
  readonly serviceStatus: "Registered";
  readonly runtimeImplementationStatus: "NotImplementedByManifest";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestCapabilityDeclaration {
  readonly capabilityId: string;
  readonly capabilityName: string;
  readonly serviceRelationship: string;
  readonly ownership: "DKL-7";
  readonly readOnly: true;
  readonly architectureStatus: "Registered";
  readonly sourcePhase: "DKL-7:1";
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly ownership: "DKL-7";
  readonly readOnly: true;
  readonly serviceReferences: readonly string[];
  readonly capabilityReferences: readonly string[];
  readonly lifecycleState: "Registered";
  readonly sourcePhase: "DKL-7:1";
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesManifestInventory {
  readonly inventoryId: "DKL-7:5/KnowledgeServicesManifestInventory";
  readonly completedPhaseCount: 5;
  readonly futurePhaseCount: 4;
  readonly totalDkl7PhaseCount: 9;
  readonly dependencyCount: 10;
  readonly ownedResponsibilityCount: number;
  readonly nonOwnedResponsibilityCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly serviceCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleStageCount: number;
  readonly requestCategoryCount: number;
  readonly responseCategoryCount: number;
  readonly accessModeCount: number;
  readonly mutationModeCount: 0;
  readonly serviceCapabilityRelationshipCount: number;
  readonly modelInventoryCount: number;
  readonly validationGroupCount: number;
  readonly validationRuleCount: number;
  readonly validationEvidenceCount: number;
  readonly validationResultCount: number;
  readonly compatibilityCount: 12;
  readonly guaranteeCount: 18;
  readonly publicApiCount: 12;
  readonly sectionCount: 18;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesManifestSummary {
  readonly manifestId: "DKL-7:5/KnowledgeServicesManifest";
  readonly version: string;
  readonly status: KnowledgeServicesManifestStatus;
  readonly readiness: KnowledgeServicesManifestReadiness;
  readonly architectureStatus: KnowledgeServicesManifestArchitectureStatus;
  readonly validationResult: "Pass";
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly serviceCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleCount: number;
  readonly ownedResponsibilityCount: number;
  readonly nonOwnedResponsibilityCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly requestCategoryCount: number;
  readonly responseCategoryCount: number;
  readonly accessModeCount: number;
  readonly mutationModeCount: number;
  readonly requestModelCount: number;
  readonly responseModelCount: number;
  readonly resultModelCount: number;
  readonly contextModelCount: number;
  readonly referenceModelCount: number;
  readonly graphModelCount: number;
  readonly relationshipCount: number;
  readonly totalModelInventoryCount: number;
  readonly validationGroupCount: number;
  readonly validationRuleCount: number;
  readonly validationEvidenceCount: number;
  readonly validationResultCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly validationFindingCount: number;
  readonly dependencyDeclarationCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly totalManifestInventoryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
