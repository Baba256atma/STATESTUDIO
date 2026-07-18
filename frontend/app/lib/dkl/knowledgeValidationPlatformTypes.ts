/**
 * DKL-5:6 — Knowledge Validation Platform Types.
 *
 * Readonly contracts for the canonical immutable Platform composition layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:6.
 */

export interface KnowledgeValidationPlatformIdentityDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly phase: "DKL-5:6";
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
  readonly owner: string;
  readonly architectureType: "KnowledgeValidation";
  readonly sourcePhases: readonly [
    "DKL-5:1",
    "DKL-5:2",
    "DKL-5:3",
    "DKL-5:4",
    "DKL-5:5",
  ];
  readonly sectionCount: 6;
  readonly componentCount: 5;
  readonly validationStatus: "Pass";
  readonly stabilityStatus: "Stable";
  readonly compatibilityStatus: "Compatible";
  readonly extensionStatus: "AdditiveAllowed";
  readonly publicVisibility: "Public";
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly certificationTarget: "DKL-5:7 — Knowledge Validation Certification";
  readonly freezeTarget: "DKL-5:8 — Knowledge Validation Freeze";
  readonly publicIndexTarget: "DKL-5:9 — Knowledge Validation Public Index";
}

export interface PlatformComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly phase: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly readiness: string;
  readonly sourcePublicEntryPoint: string;
  readonly owner: string;
  readonly dependencyOrder: number;
  readonly platformPosition: number;
  readonly publicApiCount: 8;
  readonly includedByReference: true;
  readonly ownedByPlatform: false;
  readonly stability: "Stable";
  readonly compatibility: "Compatible";
  readonly extensionStatus: "AdditiveAllowed";
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PlatformDependencyEntry {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly module: string;
  readonly version: string;
  readonly phase: string;
  readonly readiness: string;
  readonly dependencyOrder: number;
  readonly required: true;
  readonly futurePhase: false;
  readonly publicEntryPointOnly: true;
  readonly circular: false;
}

export interface PlatformCompatibilityEntry {
  readonly compatibilityId: string;
  readonly subject: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";
  readonly description: string;
}

export interface PlatformExtensionEntry {
  readonly extensionId: string;
  readonly subject: string;
  readonly ownedBy: string;
  readonly additive: true;
  readonly explicit: true;
  readonly versioned: true;
  readonly backwardCompatible: true;
  readonly mutableRuntimeRegistrationForbidden: true;
}

export interface PlatformReadinessGate {
  readonly gateId: string;
  readonly description: string;
  readonly status: "Pass" | "Fail";
  readonly expected: string;
  readonly actual: string;
}

export interface PlatformInventoryDescriptor {
  readonly upstreamComponentCount: 5;
  readonly platformSectionCount: 6;
  readonly upstreamPublicApiCount: 40;
  readonly platformPublicApiCount: 8;
  readonly totalPublicApiCount: 48;
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
  readonly validationResultCount: number;
  readonly validationEvidenceCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly manifestReadinessGateCount: number;
  readonly compatibilityDeclarationCount: number;
  readonly extensionDeclarationCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipDeclarationCount: number;
  readonly dependencyDeclarationCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface PlatformSummaryDescriptor {
  readonly platformId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-5:6";
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
  readonly sectionCount: 6;
  readonly componentCount: 5;
  readonly dependencyCount: 5;
  readonly readinessGateCount: number;
  readonly readinessGatesPassed: number;
  readonly readinessGatesFailed: number;
  readonly allReadinessGatesPass: boolean;
  readonly totalPublicApiCount: 48;
  readonly validationStatus: "Pass";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface PlatformStatusDescriptor {
  readonly status: "PlatformComplete";
  readonly readiness: "ReadyForCertification";
  readonly validationStatus: "Pass";
  readonly allReadinessGatesPass: boolean;
  readonly foundationComplete: true;
  readonly registryComplete: true;
  readonly modelComplete: true;
  readonly validationComplete: true;
  readonly validationPass: true;
  readonly manifestComplete: true;
  readonly platformComplete: true;
  readonly runtimeBehaviorForbidden: true;
  readonly ownershipConflictsAbsent: true;
  readonly nextPhase: "DKL-5:7 — Knowledge Validation Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
