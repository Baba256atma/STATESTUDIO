/**
 * DKL-7:8 — Knowledge Services Freeze Types.
 *
 * Readonly contracts for the canonical Knowledge Services Freeze.
 * Metadata-only. No runtime locks. No service behavior.
 *
 * Ownership: owned exclusively by DKL-7:8.
 */

export type KnowledgeServicesFreezeStatus = "Frozen";

export type KnowledgeServicesFreezeReadiness = "ReadyForPublicIndex";

export type KnowledgeServicesFreezeArchitectureStatus = "StableAndFrozen";

export type KnowledgeServicesFreezeLockId =
  "DKL-7-KNOWLEDGE-SERVICES-LOCKED";

export type KnowledgeServicesFreezeLockStatus = "Locked";

export type KnowledgeServicesFreezeBaselineStatus = "FrozenAndMatched";

export type KnowledgeServicesFreezeCompatibilityStatus = "Compatible";

export type KnowledgeServicesFreezeChangePolicy =
  | "Forbidden"
  | "AdditiveOnly"
  | "VersionedReCertificationRequired";

export type KnowledgeServicesFreezeLockType =
  | "PublicApiLock"
  | "DependencyChainLock"
  | "OwnershipLock"
  | "BoundaryLock"
  | "ServiceInventoryLock"
  | "CapabilityInventoryLock"
  | "ContractInventoryLock"
  | "ModelInventoryLock"
  | "ValidationStateLock"
  | "CompatibilityLock"
  | "RuntimeProhibitionLock"
  | "CertificationBaselineLock";

export type KnowledgeServicesFreezeLockScope =
  | "Identity"
  | "Dependency"
  | "Ownership"
  | "Boundary"
  | "Inventory"
  | "Validation"
  | "Compatibility"
  | "Runtime"
  | "Certification"
  | "PublicApi";

export interface KnowledgeServicesFreezeIdentity {
  readonly freezeId: "DKL-7:8/KnowledgeServicesFreeze";
  readonly freezeName: "Knowledge Services Freeze";
  readonly freezeVersion: string;
  readonly freezeNamespace: "nexora.dkl.knowledge-services.freeze";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Freeze";
  readonly sourcePhase: "DKL-7:8";
  readonly owner: string;
  readonly status: KnowledgeServicesFreezeStatus;
  readonly certificationStatus: "Certified";
  readonly certificationResult: "Pass";
  readonly architectureStatus: KnowledgeServicesFreezeArchitectureStatus;
  readonly freezeLock: KnowledgeServicesFreezeLockId;
  readonly readiness: KnowledgeServicesFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly platformId: string;
  readonly manifestId: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesFreezeMetadata {
  readonly metadataId: "DKL-7:8/KnowledgeServicesFreezeMetadata";
  readonly freezeId: "DKL-7:8/KnowledgeServicesFreeze";
  readonly description: string;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeBehavior: false;
  readonly runtimeLocking: false;
  readonly transportNeutral: true;
  readonly persistenceNeutral: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesFreezeCertifiedComponent {
  readonly componentId: string;
  readonly phaseId: string;
  readonly stage: string;
  readonly version: string;
  readonly certifiedStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly protectionStatus: "Protected";
  readonly canonicalReferencePath: string;
  readonly ownershipStatus: string;
  readonly boundaryStatus: string;
  readonly compatibilityStatus: "Compatible";
  readonly changePolicy: KnowledgeServicesFreezeChangePolicy;
  readonly publicIndexRelevance: string;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeRegistryEntry {
  readonly registryId: "DKL-7:8/KnowledgeServicesFreezeRegistry";
  readonly registryVersion: "1.0.0";
  readonly componentCount: 8;
  readonly certifiedCount: 8;
  readonly frozenCount: 8;
  readonly protectedCount: 8;
  readonly failedCount: 0;
  readonly components: readonly KnowledgeServicesFreezeCertifiedComponent[];
  readonly canonicalPhaseOrder: readonly string[];
  readonly lockReferences: readonly string[];
  readonly readinessStatus: KnowledgeServicesFreezeReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesFreezeBaseline {
  readonly baselineId: string;
  readonly subject: string;
  readonly certifiedValue: string;
  readonly frozenValue: string;
  readonly sourcePhase: string;
  readonly canonicalPath: string;
  readonly lockReference: string;
  readonly regressionImpact: string;
  readonly status: KnowledgeServicesFreezeBaselineStatus;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeBaselineValue {
  readonly key: string;
  readonly value: string | number;
}

export interface KnowledgeServicesFreezeLock {
  readonly lockId: string;
  readonly lockName: string;
  readonly lockType: KnowledgeServicesFreezeLockType;
  readonly lockScope: KnowledgeServicesFreezeLockScope;
  readonly protectedSubject: string;
  readonly protectedBaselineReferences: readonly string[];
  readonly allowedChangeType: string;
  readonly prohibitedChangeType: string;
  readonly compatibilityRequirement: string;
  readonly certificationRequirement: string;
  readonly publicIndexRelevance: string;
  readonly lockStatus: KnowledgeServicesFreezeLockStatus;
  readonly runtimeEnforcement: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly subject: string;
  readonly direction: string;
  readonly compatibilityType: string;
  readonly status: KnowledgeServicesFreezeCompatibilityStatus;
  readonly freezeStatus: "Frozen";
  readonly runtimeAuthorization: "None";
  readonly canonicalPath: string;
  readonly protectedLockReferences: readonly string[];
  readonly ownershipConstraint: string;
  readonly boundaryConstraint: string;
  readonly changePolicy: KnowledgeServicesFreezeChangePolicy;
  readonly publicIndexRelevance: string;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeExtensionPolicy {
  readonly extensionId: string;
  readonly subject: string;
  readonly allowedChange: string;
  readonly prohibitedChange: string;
  readonly backwardCompatibilityRequirement: true;
  readonly certificationRequirement: true;
  readonly reFreezeRequirement: true;
  readonly versioningRequirement: true;
  readonly ownershipPreservation: true;
  readonly boundaryPreservation: true;
  readonly runtimeAuthorization: "None";
  readonly changeClass: "Additive" | "Versioned";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeProtectedSurface {
  readonly surfaceId: string;
  readonly subject: string;
  readonly protectionStatus: "Protected";
  readonly lockReferences: readonly string[];
}

export interface KnowledgeServicesFreezeDependencyDeclaration {
  readonly dependencyId: string;
  readonly source: string;
  readonly target: string;
  readonly direction: string;
  readonly dependencyType: string;
  readonly status: "Declared";
  readonly canonicalPath: string;
  readonly required: boolean;
  readonly lockReference: string;
  readonly ownershipRule: string;
  readonly boundaryRule: string;
  readonly runtimeAuthorization: "None";
  readonly introducesFutureImport: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeOwnershipDeclaration {
  readonly ownershipId: string;
  readonly ownedCount: 6;
  readonly nonOwnedCount: 24;
  readonly ownershipExpanded: false;
  readonly preservedByReference: true;
}

export interface KnowledgeServicesFreezeBoundaryDeclaration {
  readonly boundariesId: string;
  readonly prohibitedSurfaceCount: 29;
  readonly weakenedProhibitions: false;
  readonly preservedByReference: true;
}

export interface KnowledgeServicesPublicIndexReadinessDeclaration {
  readonly readinessId: "DKL-7:8/PublicIndexPreparation";
  readonly freezeStatus: "Frozen";
  readonly certificationStatus: "Certified";
  readonly certificationResult: "Pass";
  readonly allComponentsFrozen: true;
  readonly allLocksActive: true;
  readonly allBaselinesMatch: true;
  readonly allCompatibilityCompatible: true;
  readonly allExtensionPoliciesSafe: true;
  readonly mutationModesRemainZero: true;
  readonly runtimeBehaviorRemainsAbsent: true;
  readonly canonicalChainIntact: true;
  readonly publicReleaseSurfaceCanBeCreated: true;
  readonly readiness: "ReadyForPublicIndex";
  readonly released: false;
  readonly readyForConsumer: false;
  readonly stablePublicApi: false;
  readonly publicNamespaceComplete: false;
  readonly publicIndexImplemented: false;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesFreezeGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: "Guaranteed";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesFreezeInventory {
  readonly inventoryId: "DKL-7:8/KnowledgeServicesFreezeInventory";
  readonly completedPhaseCount: 8;
  readonly futurePhaseCount: 1;
  readonly totalPhaseCount: 9;
  readonly sectionCount: 18;
  readonly frozenComponentCount: 8;
  readonly certifiedComponentCount: 8;
  readonly protectedComponentCount: 8;
  readonly baselineCount: 18;
  readonly matchedBaselineCount: 18;
  readonly lockCount: 12;
  readonly activeLockCount: 12;
  readonly dependencyCount: 12;
  readonly compatibilityCount: 18;
  readonly extensionPolicyCount: 8;
  readonly guaranteeCount: 24;
  readonly publicApiCount: 12;
  readonly certificationGateGroupCount: 12;
  readonly certificationGateCount: 18;
  readonly certificationEvidenceCount: 18;
  readonly certificationResultCount: 18;
  readonly certificationPassedCount: 18;
  readonly certificationFailedCount: 0;
  readonly certificationCompatibilityCount: 16;
  readonly certificationRegressionCount: 12;
  readonly certificationGuaranteeCount: 22;
  readonly certificationInventoryCount: 137;
  readonly serviceCount: 12;
  readonly capabilityCount: 12;
  readonly contractCount: 11;
  readonly modelInventoryCount: 79;
  readonly validationPassCount: 48;
  readonly manifestInventoryCount: 447;
  readonly platformInventoryCount: 527;
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

export interface KnowledgeServicesFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly status: KnowledgeServicesFreezeStatus;
  readonly lock: KnowledgeServicesFreezeLockId;
  readonly architectureStatus: KnowledgeServicesFreezeArchitectureStatus;
  readonly readiness: KnowledgeServicesFreezeReadiness;
  readonly certificationId: string;
  readonly platformId: string;
  readonly manifestId: string;
  readonly validationId: string;
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly dkl6PublicIndexId: string;
  readonly completedPhaseCount: number;
  readonly futurePhaseCount: number;
  readonly sectionCount: number;
  readonly frozenComponentCount: number;
  readonly certifiedComponentCount: number;
  readonly protectedComponentCount: number;
  readonly baselineCount: number;
  readonly matchedBaselineCount: number;
  readonly lockCount: number;
  readonly activeLockCount: number;
  readonly dependencyCount: number;
  readonly compatibilityCount: number;
  readonly extensionPolicyCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly serviceCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly modelInventoryCount: number;
  readonly validationPassCount: number;
  readonly manifestInventoryCount: 447;
  readonly platformInventoryCount: 527;
  readonly certificationInventoryCount: 137;
  readonly ownedResponsibilityCount: number;
  readonly nonOwnedResponsibilityCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly mutationModeCount: number;
  readonly runtimeBehaviorStatus: "Absent";
  readonly freezeInventoryCount: 121;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesFreezeReport {
  readonly reportId: string;
  readonly freezeId: string;
  readonly status: KnowledgeServicesFreezeStatus;
  readonly readiness: KnowledgeServicesFreezeReadiness;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesFreezePublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly runtimeLock: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}
