/**
 * DKL-5:2 — Knowledge Validation Registry.
 *
 * Canonical immutable registry for every approved Knowledge Validation concept
 * declared by DKL-5:1. Registers architecture definitions only. No evaluation,
 * rule execution, trust/score calculation, cleansing, remediation, or persistence.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import { KnowledgeValidationTargetRegistry } from "./knowledgeValidationTargetRegistry.ts";
import { KnowledgeValidationDimensionRegistry } from "./knowledgeValidationDimensionRegistry.ts";
import { KnowledgeValidationSignalRegistry } from "./knowledgeValidationSignalRegistry.ts";
import {
  KnowledgeValidationFindingRegistry,
  KnowledgeValidationIssueRegistry,
} from "./knowledgeValidationFindingRegistry.ts";
import {
  KnowledgeValidationAmbiguityTypeRegistry,
  KnowledgeValidationConflictTypeRegistry,
} from "./knowledgeValidationConflictAmbiguityRegistry.ts";
import {
  KnowledgeValidationBoundaryDeclarationRegistry,
  KnowledgeValidationCompatibilityPolicyRegistry,
  KnowledgeValidationConsumerReadinessRegistry,
  KnowledgeValidationCriterionTypeRegistry,
  KnowledgeValidationDependencyDeclarationRegistry,
  KnowledgeValidationEvidenceTypeRegistry,
  KnowledgeValidationExtensionPolicyRegistry,
  KnowledgeValidationLifecycleStateRegistry,
  KnowledgeValidationLimitationTypeRegistry,
  KnowledgeValidationOutcomeRegistry,
  KnowledgeValidationOwnershipDeclarationRegistry,
  KnowledgeValidationPublicFoundationApiRegistry,
  KnowledgeValidationRuleCategoryRegistry,
  KnowledgeValidationScopeTypeRegistry,
  KnowledgeValidationSeverityRegistry,
  KnowledgeValidationStatusRegistry,
  KnowledgeValidationTrustLevelRegistry,
} from "./knowledgeValidationRegistryCatalog.ts";
import { KnowledgeValidationRegistryOwnership } from "./knowledgeValidationRegistryOwnership.ts";
import { KnowledgeValidationRegistryDependencies } from "./knowledgeValidationRegistryDependencies.ts";
import type {
  KnowledgeValidationRegistryCollectionsDescriptor,
  KnowledgeValidationRegistryIdentityDescriptor,
  KnowledgeValidationRegistrySummaryDescriptor,
} from "./knowledgeValidationRegistryTypes.ts";

export const KnowledgeValidationRegistryVersion = "1.0.0";

export const KnowledgeValidationRegistryNamespace =
  "nexora.dkl.knowledge-validation.registry";

export const KnowledgeValidationRegistryIdentity: KnowledgeValidationRegistryIdentityDescriptor =
  Object.freeze({
    registryId: "DKL-5:2/KnowledgeValidationRegistry",
    registryVersion: KnowledgeValidationRegistryVersion,
    registryName: "Knowledge Validation Registry",
    registryNamespace: KnowledgeValidationRegistryNamespace,
    owner: "DKL-5 Knowledge Validation Registry",
    sourcePhase: "DKL-5:2",
    platformId: "DKL-5",
    platformVersion: KnowledgeValidationRegistryVersion,
    status: "RegistryComplete",
    readiness: "ReadyForModel",
  });

export const KnowledgeValidationRegistryCollections: KnowledgeValidationRegistryCollectionsDescriptor =
  Object.freeze({
    validationTargetTypes: KnowledgeValidationTargetRegistry,
    validationDimensions: KnowledgeValidationDimensionRegistry,
    validationStatuses: KnowledgeValidationStatusRegistry,
    validationOutcomes: KnowledgeValidationOutcomeRegistry,
    validationSeverities: KnowledgeValidationSeverityRegistry,
    knowledgeQualitySignals: KnowledgeValidationSignalRegistry,
    trustLevels: KnowledgeValidationTrustLevelRegistry,
    evidenceTypes: KnowledgeValidationEvidenceTypeRegistry,
    findingCategories: KnowledgeValidationFindingRegistry,
    issueCategories: KnowledgeValidationIssueRegistry,
    conflictTypes: KnowledgeValidationConflictTypeRegistry,
    ambiguityTypes: KnowledgeValidationAmbiguityTypeRegistry,
    limitationTypes: KnowledgeValidationLimitationTypeRegistry,
    consumerReadinessStates: KnowledgeValidationConsumerReadinessRegistry,
    validationLifecycleStates: KnowledgeValidationLifecycleStateRegistry,
    validationScopeTypes: KnowledgeValidationScopeTypeRegistry,
    validationCriterionTypes: KnowledgeValidationCriterionTypeRegistry,
    validationRuleCategories: KnowledgeValidationRuleCategoryRegistry,
    ownershipDeclarations: KnowledgeValidationOwnershipDeclarationRegistry,
    boundaryDeclarations: KnowledgeValidationBoundaryDeclarationRegistry,
    compatibilityPolicies: KnowledgeValidationCompatibilityPolicyRegistry,
    extensionPolicies: KnowledgeValidationExtensionPolicyRegistry,
    dependencyDeclarations: KnowledgeValidationDependencyDeclarationRegistry,
    publicFoundationApis: KnowledgeValidationPublicFoundationApiRegistry,
  });

const TOTAL_ENTRY_COUNT = Object.values(KnowledgeValidationRegistryCollections).reduce(
  (sum, entries) => sum + entries.length,
  0,
);

export const KnowledgeValidationRegistrySummary: KnowledgeValidationRegistrySummaryDescriptor =
  Object.freeze({
    registryId: KnowledgeValidationRegistryIdentity.registryId,
    registryVersion: KnowledgeValidationRegistryVersion,
    registryCategoryCount: 24,
    totalEntryCount: TOTAL_ENTRY_COUNT,
    validationTargetCount: KnowledgeValidationTargetRegistry.length,
    validationDimensionCount: KnowledgeValidationDimensionRegistry.length,
    qualitySignalCount: KnowledgeValidationSignalRegistry.length,
    outcomeCount: KnowledgeValidationOutcomeRegistry.length,
    severityCount: KnowledgeValidationSeverityRegistry.length,
    publicFoundationApiCount: KnowledgeValidationPublicFoundationApiRegistry.length,
    uniqueIdentifiersGuaranteed: true,
    uniqueNamesWithinRegistryGuaranteed: true,
    deterministicOrderingGuaranteed: true,
    immutableEntriesGuaranteed: true,
    registryCollectionsFrozen: true,
    metadataOnly: true,
    runtimeValidationForbidden: true,
    scoreCalculationForbidden: true,
    trustCalculationForbidden: true,
    mutableRegistrationForbidden: true,
    status: "RegistryComplete",
    readiness: "ReadyForModel",
  });

/** Canonical immutable Knowledge Validation Registry aggregate. */
export const KnowledgeValidationRegistry = Object.freeze({
  identity: KnowledgeValidationRegistryIdentity,
  version: KnowledgeValidationRegistryVersion,
  namespace: KnowledgeValidationRegistryNamespace,
  foundation: Object.freeze({
    identity: KnowledgeValidationFoundationIdentity,
    version: KnowledgeValidationFoundationVersion,
    readiness: KnowledgeValidationFoundation.readiness.ReadyForRegistry,
    referencedThroughPublicFoundation: true,
  }),
  collections: KnowledgeValidationRegistryCollections,
  ownership: KnowledgeValidationRegistryOwnership,
  dependencies: KnowledgeValidationRegistryDependencies,
  summary: KnowledgeValidationRegistrySummary,
  guarantees: Object.freeze({
    uniqueIdentifiers: true,
    uniqueNamesWithinEachRegistry: true,
    deterministicOrdering: true,
    immutableEntries: true,
    frozenRegistryCollections: true,
    explicitOwnership: true,
    explicitSourcePhase: true,
    stableMeanings: true,
    noDuplicateArchitecturalOwnership: true,
    noRuntimeValidators: true,
    noScoreCalculators: true,
    noTrustCalculators: true,
    noAutomaticRemediation: true,
    noDynamicPlugins: true,
    noMutableRegistration: true,
    noReflection: true,
    noAutoDiscovery: true,
    noSourceCodeScanning: true,
    noEnvironmentDependentBehavior: true,
  }),
  readiness: Object.freeze({
    RegistryComplete: true,
    ReadyForModel: true,
    MetadataOnly: true,
    RuntimeValidationForbidden: true,
    ScoreCalculationForbidden: true,
    TrustCalculationForbidden: true,
    DataCleansingForbidden: true,
    ConflictResolutionForbidden: true,
    AmbiguityResolutionForbidden: true,
    RemediationForbidden: true,
    PersistenceForbidden: true,
    Deterministic: true,
    Immutable: true,
  }),
  completionStatus: Object.freeze([
    "RegistryComplete",
    "ValidationTargetsRegistered",
    "ValidationDimensionsRegistered",
    "QualitySignalsRegistered",
    "OutcomesAndSeveritiesRegistered",
    "EvidenceFindingsConflictsAmbiguityRegistered",
    "TrustLevelsRegistered",
    "LifecycleRegistered",
    "OwnershipAndBoundariesRegistered",
    "FoundationApisRegistered",
    "MetadataOnly",
    "ReadyForModel",
  ]),
  nextPhase: "DKL-5:3 — Knowledge Validation Model",
  metadataOnly: true,
  registryOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeValidationRegistryOwnership,
  KnowledgeValidationRegistryDependencies,
};
