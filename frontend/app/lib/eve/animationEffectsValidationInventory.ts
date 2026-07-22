import {
  AnimationEffectsValidationDiagnostics,
  AnimationEffectsValidationFailureClassifications,
  AnimationEffectsValidationOutcomes,
  AnimationEffectsValidationRecommendationClassifications,
  AnimationEffectsValidationSeverityLevels,
} from "./animationEffectsValidationDiagnostics.ts";
import {
  AnimationEffectsValidationGates,
  AnimationEffectsValidationReadinessDeclarations,
} from "./animationEffectsValidationMetadata.ts";
import { AnimationEffectsModelPlatform } from "./animationEffectsModel.ts";
import { AnimationEffectsValidationPolicies } from "./animationEffectsValidationPolicies.ts";
import {
  AnimationEffectsValidationCategories,
  AnimationEffectsValidationRules,
} from "./animationEffectsValidationRules.ts";

const model = AnimationEffectsModelPlatform;

export const AnimationEffectsValidationInventory = Object.freeze({
  categories: AnimationEffectsValidationCategories,
  rules: AnimationEffectsValidationRules,
  gates: AnimationEffectsValidationGates,
  diagnostics: AnimationEffectsValidationDiagnostics,
  severityLevels: AnimationEffectsValidationSeverityLevels,
  outcomes: AnimationEffectsValidationOutcomes,
  failureClassifications: AnimationEffectsValidationFailureClassifications,
  recommendationClassifications:
    AnimationEffectsValidationRecommendationClassifications,
  policies: AnimationEffectsValidationPolicies,
  readinessDeclarations: AnimationEffectsValidationReadinessDeclarations,
  modelDescriptors: model.descriptors,
  modelRelationships: model.relationships,
  modelPolicies: model.policies,
  modelMetadata: model.metadata,
  modelInventory: model.inventory,
  modelIdentity: model.identity,
  modelRegistryReference: model.registry,
  counts: Object.freeze({
    categoryCount: AnimationEffectsValidationCategories.length,
    ruleCount: AnimationEffectsValidationRules.length,
    gateCount: AnimationEffectsValidationGates.length,
    diagnosticCount: AnimationEffectsValidationDiagnostics.length,
    severityLevelCount: AnimationEffectsValidationSeverityLevels.length,
    outcomeCount: AnimationEffectsValidationOutcomes.length,
    failureClassificationCount:
      AnimationEffectsValidationFailureClassifications.length,
    recommendationClassificationCount:
      AnimationEffectsValidationRecommendationClassifications.length,
    policyCount: AnimationEffectsValidationPolicies.length,
    readinessDeclarationCount:
      AnimationEffectsValidationReadinessDeclarations.length,
  }),
  modelCollectionsPreservedByReference: true,
  inventoriesDerivedExclusivelyFromModelCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsModelCollections: false,
  duplicatesModelMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
