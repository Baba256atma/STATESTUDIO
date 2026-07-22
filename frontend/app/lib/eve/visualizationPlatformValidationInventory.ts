import {
  VisualizationPlatformValidationDiagnostics,
  VisualizationPlatformValidationFailureCategories,
  VisualizationPlatformValidationOutcomes,
  VisualizationPlatformValidationRecommendationCategories,
  VisualizationPlatformValidationSeverityLevels,
} from "./visualizationPlatformValidationDiagnostics.ts";
import {
  VisualizationPlatformValidationGates,
  VisualizationPlatformValidationReadinessDeclarations,
} from "./visualizationPlatformValidationMetadata.ts";
import { VisualizationPlatformModelPlatform } from "./visualizationPlatformModel.ts";
import { VisualizationPlatformValidationPolicies } from "./visualizationPlatformValidationPolicies.ts";
import {
  VisualizationPlatformValidationCategories,
  VisualizationPlatformValidationRules,
} from "./visualizationPlatformValidationRules.ts";

const model = VisualizationPlatformModelPlatform;

export const VisualizationPlatformValidationInventory = Object.freeze({
  categories: VisualizationPlatformValidationCategories,
  rules: VisualizationPlatformValidationRules,
  gates: VisualizationPlatformValidationGates,
  diagnostics: VisualizationPlatformValidationDiagnostics,
  severityLevels: VisualizationPlatformValidationSeverityLevels,
  outcomes: VisualizationPlatformValidationOutcomes,
  failureCategories: VisualizationPlatformValidationFailureCategories,
  recommendationCategories:
    VisualizationPlatformValidationRecommendationCategories,
  policies: VisualizationPlatformValidationPolicies,
  readinessDeclarations: VisualizationPlatformValidationReadinessDeclarations,
  modelDescriptors: model.descriptors,
  modelRelationships: model.relationships,
  modelComposition: model.composition,
  modelPolicies: model.policies,
  modelMetadata: model.metadata,
  modelInventory: model.inventory,
  modelIdentity: model.identity,
  modelRegistryReference: model.registry,
  counts: Object.freeze({
    categoryCount: VisualizationPlatformValidationCategories.length,
    ruleCount: VisualizationPlatformValidationRules.length,
    gateCount: VisualizationPlatformValidationGates.length,
    diagnosticCount: VisualizationPlatformValidationDiagnostics.length,
    severityLevelCount: VisualizationPlatformValidationSeverityLevels.length,
    outcomeCount: VisualizationPlatformValidationOutcomes.length,
    failureCategoryCount:
      VisualizationPlatformValidationFailureCategories.length,
    recommendationCategoryCount:
      VisualizationPlatformValidationRecommendationCategories.length,
    policyCount: VisualizationPlatformValidationPolicies.length,
    readinessDeclarationCount:
      VisualizationPlatformValidationReadinessDeclarations.length,
  }),
  modelCollectionsPreservedByReference: true,
  inventoriesDerivedExclusivelyFromModelCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  duplicatesModelMetadata: false,
  reconstructsModelCollections: false,
  maintainsParallelUpstreamInventories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
