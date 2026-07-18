/**
 * DKL-5:2 — Knowledge Validation Registry Types.
 *
 * Readonly metadata contracts for the canonical Knowledge Validation Registry.
 * Registry entries describe architecture definitions only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

export type RegistryLifecycleStatus = "Registered";
export type RegistryStabilityStatus = "Stable";
export type RegistryCompatibilityStatus =
  | "Compatible"
  | "ForwardCompatible"
  | "Restricted"
  | "Forbidden";
export type RegistryExtensionStatus = "Closed" | "AdditiveAllowed" | "MigrationRequired";
export type RegistryVisibility = "Public";

export type ValidationRegistryCategory =
  | "ValidationTargetType"
  | "ValidationDimension"
  | "ValidationStatus"
  | "ValidationOutcome"
  | "ValidationSeverity"
  | "KnowledgeQualitySignal"
  | "TrustLevel"
  | "EvidenceType"
  | "FindingCategory"
  | "IssueCategory"
  | "ConflictType"
  | "AmbiguityType"
  | "LimitationType"
  | "ConsumerReadinessState"
  | "ValidationLifecycleState"
  | "ValidationScopeType"
  | "ValidationCriterionType"
  | "ValidationRuleCategory"
  | "OwnershipDeclaration"
  | "BoundaryDeclaration"
  | "CompatibilityPolicy"
  | "ExtensionPolicy"
  | "DependencyDeclaration"
  | "PublicFoundationApi";

export interface KnowledgeValidationRegistryIdentityDescriptor {
  readonly registryId: string;
  readonly registryVersion: string;
  readonly registryName: string;
  readonly registryNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-5:2";
  readonly platformId: "DKL-5";
  readonly platformVersion: string;
  readonly status: "RegistryComplete";
  readonly readiness: "ReadyForModel";
}

export interface KnowledgeValidationRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly namespace: string;
  readonly description: string;
  readonly category: ValidationRegistryCategory;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly lifecycleStatus: RegistryLifecycleStatus;
  readonly stabilityStatus: RegistryStabilityStatus;
  readonly compatibilityStatus: RegistryCompatibilityStatus;
  readonly extensionStatus: RegistryExtensionStatus;
  readonly publicVisibility: RegistryVisibility;
  readonly deterministicOrder: number;
  readonly tags: readonly string[];
}

export interface ValidationTargetRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "ValidationTargetType";
  readonly sourceModelingConcept: string;
  readonly validationEligibility: true;
  readonly consumerImpact: string;
  readonly runtimeInstanceCreated: false;
}

export interface ValidationDimensionRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "ValidationDimension";
  readonly meaning: string;
  readonly scope: string;
  readonly applicableTargetTypes: readonly string[];
  readonly evidenceExpectations: string;
  readonly blockingPotential: boolean;
  readonly executiveRelevance: string;
  readonly validationLogicIncluded: false;
}

export interface QualitySignalRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "KnowledgeQualitySignal";
  readonly dimension: string;
  readonly meaning: string;
  readonly polarity: string;
  readonly severity: string;
  readonly consumerImpact: string;
  readonly clarificationRecommended: boolean;
  readonly blockingStatus: boolean;
  readonly numericScoreAssigned: false;
}

export interface OutcomeRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "ValidationOutcome";
  readonly meaning: string;
  readonly consumerUsability: boolean;
  readonly blockingBehaviorDeclaration: boolean;
  readonly clarificationRelevance: boolean;
  readonly executiveUseSuitability: string;
  readonly allowedLimitationHandling: string;
}

export interface SeverityRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "ValidationSeverity";
  readonly rank: number;
  readonly architecturalMeaning: string;
  readonly consumerImpact: string;
  readonly blockingDeclaration: boolean;
  readonly escalationOwnershipDeclaration: string;
  readonly notificationImplemented: false;
}

export interface FindingIssueRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "FindingCategory" | "IssueCategory";
  readonly applicableDimensions: readonly string[];
  readonly typicalSeverity: string;
  readonly blockingPotential: boolean;
  readonly clarificationRelevance: boolean;
  readonly remediationOwnershipDeclaration: string;
  readonly runtimeRemediationImplemented: false;
}

export interface TrustLevelRegistryEntry extends KnowledgeValidationRegistryEntry {
  readonly category: "TrustLevel";
  readonly meaning: string;
  readonly evidenceExpectation: string;
  readonly limitationsAllowed: boolean;
  readonly consumerSuitability: string;
  readonly executiveUseSuitability: string;
  readonly blockingStatus: boolean;
  readonly trustCalculated: false;
}

export interface KnowledgeValidationRegistryCollectionsDescriptor {
  readonly validationTargetTypes: readonly ValidationTargetRegistryEntry[];
  readonly validationDimensions: readonly ValidationDimensionRegistryEntry[];
  readonly validationStatuses: readonly KnowledgeValidationRegistryEntry[];
  readonly validationOutcomes: readonly OutcomeRegistryEntry[];
  readonly validationSeverities: readonly SeverityRegistryEntry[];
  readonly knowledgeQualitySignals: readonly QualitySignalRegistryEntry[];
  readonly trustLevels: readonly TrustLevelRegistryEntry[];
  readonly evidenceTypes: readonly KnowledgeValidationRegistryEntry[];
  readonly findingCategories: readonly FindingIssueRegistryEntry[];
  readonly issueCategories: readonly FindingIssueRegistryEntry[];
  readonly conflictTypes: readonly KnowledgeValidationRegistryEntry[];
  readonly ambiguityTypes: readonly KnowledgeValidationRegistryEntry[];
  readonly limitationTypes: readonly KnowledgeValidationRegistryEntry[];
  readonly consumerReadinessStates: readonly KnowledgeValidationRegistryEntry[];
  readonly validationLifecycleStates: readonly KnowledgeValidationRegistryEntry[];
  readonly validationScopeTypes: readonly KnowledgeValidationRegistryEntry[];
  readonly validationCriterionTypes: readonly KnowledgeValidationRegistryEntry[];
  readonly validationRuleCategories: readonly KnowledgeValidationRegistryEntry[];
  readonly ownershipDeclarations: readonly KnowledgeValidationRegistryEntry[];
  readonly boundaryDeclarations: readonly KnowledgeValidationRegistryEntry[];
  readonly compatibilityPolicies: readonly KnowledgeValidationRegistryEntry[];
  readonly extensionPolicies: readonly KnowledgeValidationRegistryEntry[];
  readonly dependencyDeclarations: readonly KnowledgeValidationRegistryEntry[];
  readonly publicFoundationApis: readonly KnowledgeValidationRegistryEntry[];
}

export interface KnowledgeValidationRegistrySummaryDescriptor {
  readonly registryId: string;
  readonly registryVersion: string;
  readonly registryCategoryCount: 24;
  readonly totalEntryCount: number;
  readonly validationTargetCount: number;
  readonly validationDimensionCount: number;
  readonly qualitySignalCount: number;
  readonly outcomeCount: number;
  readonly severityCount: number;
  readonly publicFoundationApiCount: number;
  readonly uniqueIdentifiersGuaranteed: true;
  readonly uniqueNamesWithinRegistryGuaranteed: true;
  readonly deterministicOrderingGuaranteed: true;
  readonly immutableEntriesGuaranteed: true;
  readonly registryCollectionsFrozen: true;
  readonly metadataOnly: true;
  readonly runtimeValidationForbidden: true;
  readonly scoreCalculationForbidden: true;
  readonly trustCalculationForbidden: true;
  readonly mutableRegistrationForbidden: true;
  readonly status: "RegistryComplete";
  readonly readiness: "ReadyForModel";
}
