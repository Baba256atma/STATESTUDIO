import { VisualizationSuiteModelPlatform } from "./visualizationSuiteModel.ts";
import {
  VisualizationSuiteValidationDiagnostics,
  VisualizationSuiteValidationFailureCategories,
  VisualizationSuiteValidationOutcomes,
  VisualizationSuiteValidationRecommendationCategories,
  VisualizationSuiteValidationSeverityLevels,
} from "./visualizationSuiteValidationDiagnostics.ts";
import {
  VisualizationSuiteValidationGates,
  VisualizationSuiteValidationReadinessDeclarations,
} from "./visualizationSuiteValidationMetadata.ts";
import { VisualizationSuiteValidationPolicies } from "./visualizationSuiteValidationPolicies.ts";
import {
  VisualizationSuiteValidationCategories,
  VisualizationSuiteValidationRules,
} from "./visualizationSuiteValidationRules.ts";

const model = VisualizationSuiteModelPlatform;

export const VisualizationSuiteValidationInventory = Object.freeze({
  categories: VisualizationSuiteValidationCategories,
  rules: VisualizationSuiteValidationRules,
  gates: VisualizationSuiteValidationGates,
  diagnostics: VisualizationSuiteValidationDiagnostics,
  severityLevels: VisualizationSuiteValidationSeverityLevels,
  outcomes: VisualizationSuiteValidationOutcomes,
  failureCategories: VisualizationSuiteValidationFailureCategories,
  recommendationCategories:
    VisualizationSuiteValidationRecommendationCategories,
  policies: VisualizationSuiteValidationPolicies,
  readinessDeclarations: VisualizationSuiteValidationReadinessDeclarations,
  modelDescriptors: model.descriptors,
  modelRelationships: model.relationships,
  modelComposition: model.composition,
  modelPolicies: model.policies,
  modelMetadata: model.metadata,
  modelInventory: model.inventory,
  modelIdentity: model.identity,
  modelRegistryReference: model.registry,
  counts: Object.freeze({
    categoryCount: VisualizationSuiteValidationCategories.length,
    ruleCount: VisualizationSuiteValidationRules.length,
    gateCount: VisualizationSuiteValidationGates.length,
    diagnosticCount: VisualizationSuiteValidationDiagnostics.length,
    severityLevelCount: VisualizationSuiteValidationSeverityLevels.length,
    outcomeCount: VisualizationSuiteValidationOutcomes.length,
    failureCategoryCount: VisualizationSuiteValidationFailureCategories.length,
    recommendationCategoryCount:
      VisualizationSuiteValidationRecommendationCategories.length,
    policyCount: VisualizationSuiteValidationPolicies.length,
    readinessDeclarationCount:
      VisualizationSuiteValidationReadinessDeclarations.length,
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
