/**
 * DKL-7:6 — Knowledge Services Platform Types.
 *
 * Readonly contracts for the canonical Knowledge Services Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-7:6.
 */

export type KnowledgeServicesPlatformStatus = "PlatformComplete";

export type KnowledgeServicesPlatformReadiness = "ReadyForCertification";

export type KnowledgeServicesPlatformArchitectureStatus =
  "CompleteThroughPlatform";

export type KnowledgeServicesPlatformAvailability =
  | "Declared"
  | "Registered"
  | "Modeled"
  | "Validated"
  | "Manifested"
  | "PlatformAvailable";

export interface KnowledgeServicesPlatformIdentity {
  readonly platformId: "DKL-7:6/KnowledgeServicesPlatform";
  readonly platformName: "Knowledge Services Platform";
  readonly platformVersion: string;
  readonly platformNamespace: "nexora.dkl.knowledge-services.platform";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Platform";
  readonly sourcePhase: "DKL-7:6";
  readonly owner: string;
  readonly status: KnowledgeServicesPlatformStatus;
  readonly architectureStatus: KnowledgeServicesPlatformArchitectureStatus;
  readonly validationResult: "Pass";
  readonly manifestStatus: "ManifestComplete";
  readonly readiness: KnowledgeServicesPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesPlatformMetadata {
  readonly metadataId: "DKL-7:6/KnowledgeServicesPlatformMetadata";
  readonly platformId: "DKL-7:6/KnowledgeServicesPlatform";
  readonly description: string;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeBehavior: false;
  readonly transportNeutral: true;
  readonly persistenceNeutral: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesPlatformPhaseReference {
  readonly phaseId: string;
  readonly stage: string;
  readonly version: string;
  readonly completionStatus: string;
  readonly predecessor: string | null;
  readonly successor: string | null;
  readonly canonicalReferencePath: string;
  readonly architectureRole: string;
  readonly runtimeBehavior: "None";
  readonly completed: boolean;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformDependency {
  readonly dependencyId: string;
  readonly source: string;
  readonly target: string;
  readonly direction: "Consumes" | "ProvidesFor";
  readonly dependencyType: "CanonicalChain" | "FuturePhase" | "FutureConsumer";
  readonly status: "Declared";
  readonly required: boolean;
  readonly canonicalPath: string;
  readonly ownershipRule: string;
  readonly boundaryRule: string;
  readonly runtimeAuthorization: "None";
  readonly introducesFutureImport: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly subject: string;
  readonly direction: string;
  readonly compatibilityType: string;
  readonly status: "Compatible";
  readonly canonicalPath: string;
  readonly ownershipConstraint: string;
  readonly boundaryConstraint: string;
  readonly changePolicy: string;
  readonly runtimeAuthorization: "None";
  readonly evidenceReference: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformConsumerDeclaration {
  readonly consumerId: string;
  readonly consumerName: string;
  readonly consumerType: string;
  readonly allowedAccessPath: string;
  readonly requiredPlatformStatus: KnowledgeServicesPlatformStatus;
  readonly requiredFutureReleaseSurface: string;
  readonly directImportAuthorization: boolean;
  readonly runtimeAuthorization: "None";
  readonly compatibilityStatus: "Compatible";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformServiceSurface {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly capabilityReference: string;
  readonly contractReference: string;
  readonly requestModelReference: string;
  readonly responseModelReference: string;
  readonly resultModelReference: string;
  readonly accessModeReference: string;
  readonly readOnly: true;
  readonly validationStatus: "Pass";
  readonly manifestStatus: "ManifestComplete";
  readonly platformAvailability: "PlatformAvailable";
  readonly runtimeImplementationStatus: "NotProvidedByPlatform";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformCapabilitySurface {
  readonly capabilityId: string;
  readonly name: string;
  readonly owningPhase: "DKL-7:1";
  readonly serviceRelationship: string;
  readonly contractRelationship: string;
  readonly readOnly: true;
  readonly validationResult: "Pass";
  readonly platformAvailability: "PlatformAvailable";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformContractSurface {
  readonly contractId: string;
  readonly contractName: string;
  readonly ownership: "DKL-7";
  readonly readOnly: true;
  readonly relatedServices: readonly string[];
  readonly relatedCapabilities: readonly string[];
  readonly lifecycleStage: "Registered";
  readonly validationStatus: "Pass";
  readonly platformAvailability: "PlatformAvailable";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesPlatformInventory {
  readonly inventoryId: "DKL-7:6/KnowledgeServicesPlatformInventory";
  readonly completedPhaseCount: 6;
  readonly futurePhaseCount: 3;
  readonly totalPhaseCount: 9;
  readonly sectionCount: 20;
  readonly dependencyCount: 12;
  readonly compatibilityCount: 14;
  readonly consumerCount: 4;
  readonly guaranteeCount: 20;
  readonly publicApiCount: 12;
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
  readonly manifestSectionCount: number;
  readonly manifestDependencyCount: number;
  readonly manifestCompatibilityCount: number;
  readonly manifestGuaranteeCount: number;
  readonly manifestPublicApiCount: number;
  readonly manifestInventoryCount: number;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesPlatformSummary {
  readonly platformId: "DKL-7:6/KnowledgeServicesPlatform";
  readonly version: string;
  readonly status: KnowledgeServicesPlatformStatus;
  readonly readiness: KnowledgeServicesPlatformReadiness;
  readonly architectureStatus: KnowledgeServicesPlatformArchitectureStatus;
  readonly validationResult: "Pass";
  readonly manifestStatus: "ManifestComplete";
  readonly manifestId: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly sectionCount: number;
  readonly serviceCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleCount: number;
  readonly ownedCount: number;
  readonly nonOwnedCount: number;
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
  readonly modelInventoryCount: number;
  readonly validationGroupCount: number;
  readonly validationRuleCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly manifestInventoryCount: number;
  readonly platformDependencyCount: number;
  readonly compatibilityCount: number;
  readonly consumerCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly platformInventoryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
