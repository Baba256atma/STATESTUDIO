/**
 * DKL-5:5 — Knowledge Validation Manifest Types.
 *
 * Readonly contracts for the canonical DKL-5 Manifest inventory.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

export interface KnowledgeValidationManifestIdentityDescriptor {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly phase: "DKL-5:5";
  readonly owner: string;
  readonly architectureType: "KnowledgeValidation";
  readonly sourcePhases: readonly ["DKL-5:1", "DKL-5:2", "DKL-5:3", "DKL-5:4"];
  readonly publicVisibility: "Public";
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly validationStatus: "Pass";
  readonly status: "ManifestComplete";
  readonly readiness: "ReadyForPlatform";
  readonly nextPhase: "DKL-5:6 — Knowledge Validation Platform";
}

export interface ManifestComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly sourcePhase: string;
  readonly kind: string;
  readonly publicApiCount: 8;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ManifestDependencyEntry {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly consumerPhase: string;
  readonly dependsOn: readonly string[];
  readonly order: number;
  readonly publicEntryPointOnly: true;
  readonly futurePhase: false;
  readonly circular: false;
}

export interface ManifestInventoryCounts {
  readonly phaseCount: 5;
  readonly componentCount: 5;
  readonly foundationPublicApiCount: 8;
  readonly registryPublicApiCount: 8;
  readonly modelPublicApiCount: 8;
  readonly validationPublicApiCount: 8;
  readonly manifestPublicApiCount: 8;
  readonly totalPublicApiCount: 40;
  readonly foundationContractCount: number;
  readonly validationTargetCount: number;
  readonly validationDimensionCount: number;
  readonly qualitySignalCount: number;
  readonly outcomeCount: number;
  readonly severityCount: number;
  readonly registryCollectionCount: number;
  readonly registryEntryCount: number;
  readonly canonicalModelCount: number;
  readonly modelRelationshipCount: number;
  readonly validationCategoryCount: number;
  readonly validationRuleCount: number;
  readonly validationEvidenceCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly ownershipDeclarationCount: number;
  readonly dependencyDeclarationCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly extensionDeclarationCount: number;
  readonly lifecycleStateCount: number;
}

export interface ManifestSummaryDescriptor {
  readonly manifestId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-5:5";
  readonly status: "ManifestComplete";
  readonly readiness: "ReadyForPlatform";
  readonly phaseCount: 5;
  readonly componentCount: 5;
  readonly totalPublicApiCount: 40;
  readonly validationStatus: string;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly registryEntryCount: number;
  readonly canonicalModelCount: number;
  readonly validationRuleCount: number;
  readonly readyForPlatform: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ManifestStatisticsDescriptor {
  readonly phaseCount: 5;
  readonly componentCount: 5;
  readonly totalPublicApiCount: 40;
  readonly foundationContractCount: number;
  readonly validationTargetCount: number;
  readonly validationDimensionCount: number;
  readonly qualitySignalCount: number;
  readonly outcomeCount: number;
  readonly severityCount: number;
  readonly registryCollectionCount: number;
  readonly registryEntryCount: number;
  readonly canonicalModelCount: number;
  readonly modelRelationshipCount: number;
  readonly validationCategoryCount: number;
  readonly validationRuleCount: number;
  readonly validationEvidenceCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly ownershipDeclarationCount: number;
  readonly dependencyDeclarationCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly extensionDeclarationCount: number;
  readonly lifecycleStateCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ManifestReadinessGate {
  readonly gateId: string;
  readonly description: string;
  readonly passed: boolean;
}

export interface ManifestReadinessDescriptor {
  readonly readinessId: string;
  readonly gates: readonly ManifestReadinessGate[];
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly allGatesPass: boolean;
  readonly readiness: "ReadyForPlatform" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ManifestCompatibilityEntry {
  readonly compatibilityId: string;
  readonly subject: string;
  readonly status: string;
  readonly description: string;
}

export interface ManifestExtensionEntry {
  readonly extensionId: string;
  readonly subject: string;
  readonly additive: true;
  readonly explicit: true;
  readonly versioned: true;
  readonly backwardCompatible: true;
  readonly mutableRuntimeRegistrationForbidden: true;
}
