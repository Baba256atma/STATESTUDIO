import {
  ChartMetricVisualizationValidationDiagnostics,
  ChartMetricVisualizationValidationOutcomes,
  ChartMetricVisualizationValidationSeverityLevels,
} from "./chartMetricVisualizationValidationDiagnostics.ts";
import {
  ChartMetricVisualizationValidationGates,
  ChartMetricVisualizationValidationReadinessDeclarations,
} from "./chartMetricVisualizationValidationGates.ts";
import { ChartMetricVisualizationModelPlatform } from "./chartMetricVisualizationModel.ts";
import { ChartMetricVisualizationValidationPolicies } from "./chartMetricVisualizationValidationPolicies.ts";
import {
  ChartMetricVisualizationValidationCategories,
  ChartMetricVisualizationValidationRules,
} from "./chartMetricVisualizationValidationRules.ts";

export const ChartMetricVisualizationValidationInventory = Object.freeze({
  categories: ChartMetricVisualizationValidationCategories,
  rules: ChartMetricVisualizationValidationRules,
  gates: ChartMetricVisualizationValidationGates,
  diagnostics: ChartMetricVisualizationValidationDiagnostics,
  severityLevels: ChartMetricVisualizationValidationSeverityLevels,
  outcomes: ChartMetricVisualizationValidationOutcomes,
  policies: ChartMetricVisualizationValidationPolicies,
  readinessDeclarations: ChartMetricVisualizationValidationReadinessDeclarations,
  modelDescriptors: ChartMetricVisualizationModelPlatform.descriptors,
  modelRelationships: ChartMetricVisualizationModelPlatform.relationships,
  modelComposition: ChartMetricVisualizationModelPlatform.composition,
  modelPolicies: ChartMetricVisualizationModelPlatform.policies,
  modelMetadata: ChartMetricVisualizationModelPlatform.metadata,
  modelInventory: ChartMetricVisualizationModelPlatform.inventory,
  modelIdentity: ChartMetricVisualizationModelPlatform.identity,
  modelRegistryReference: ChartMetricVisualizationModelPlatform.registry,
  counts: Object.freeze({
    categoryCount: ChartMetricVisualizationValidationCategories.length,
    ruleCount: ChartMetricVisualizationValidationRules.length,
    gateCount: ChartMetricVisualizationValidationGates.length,
    diagnosticCount: ChartMetricVisualizationValidationDiagnostics.length,
    severityLevelCount: ChartMetricVisualizationValidationSeverityLevels.length,
    outcomeCount: ChartMetricVisualizationValidationOutcomes.length,
    policyCount: ChartMetricVisualizationValidationPolicies.length,
    readinessDeclarationCount:
      ChartMetricVisualizationValidationReadinessDeclarations.length,
  }),
  modelCollectionsPreservedByReference: true,
  registryAndFoundationPreservedThroughModel: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsModelCollections: false,
  duplicatesModelMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
