import {
  DashboardExecutiveWorkspaceVisualizationValidationDiagnostics,
  DashboardExecutiveWorkspaceVisualizationValidationOutcomes,
  DashboardExecutiveWorkspaceVisualizationValidationSeverityLevels,
} from "./dashboardExecutiveWorkspaceVisualizationValidationDiagnostics.ts";
import {
  DashboardExecutiveWorkspaceVisualizationValidationGates,
  DashboardExecutiveWorkspaceVisualizationValidationReadinessDeclarations,
} from "./dashboardExecutiveWorkspaceVisualizationValidationMetadata.ts";
import { DashboardExecutiveWorkspaceVisualizationModelPlatform } from "./dashboardExecutiveWorkspaceVisualizationModel.ts";
import { DashboardExecutiveWorkspaceVisualizationValidationPolicies } from "./dashboardExecutiveWorkspaceVisualizationValidationPolicies.ts";
import {
  DashboardExecutiveWorkspaceVisualizationValidationCategories,
  DashboardExecutiveWorkspaceVisualizationValidationRules,
} from "./dashboardExecutiveWorkspaceVisualizationValidationRules.ts";

const model = DashboardExecutiveWorkspaceVisualizationModelPlatform;

export const DashboardExecutiveWorkspaceVisualizationValidationInventory =
  Object.freeze({
    categories: DashboardExecutiveWorkspaceVisualizationValidationCategories,
    rules: DashboardExecutiveWorkspaceVisualizationValidationRules,
    gates: DashboardExecutiveWorkspaceVisualizationValidationGates,
    diagnostics: DashboardExecutiveWorkspaceVisualizationValidationDiagnostics,
    severityLevels:
      DashboardExecutiveWorkspaceVisualizationValidationSeverityLevels,
    outcomes: DashboardExecutiveWorkspaceVisualizationValidationOutcomes,
    policies: DashboardExecutiveWorkspaceVisualizationValidationPolicies,
    readinessDeclarations:
      DashboardExecutiveWorkspaceVisualizationValidationReadinessDeclarations,
    modelDescriptors: model.descriptors,
    modelRelationships: model.relationships,
    modelComposition: model.composition,
    modelPolicies: model.policies,
    modelMetadata: model.metadata,
    modelInventory: model.inventory,
    modelIdentity: model.identity,
    modelRegistryReference: model.registry,
    counts: Object.freeze({
      categoryCount:
        DashboardExecutiveWorkspaceVisualizationValidationCategories.length,
      ruleCount: DashboardExecutiveWorkspaceVisualizationValidationRules.length,
      gateCount: DashboardExecutiveWorkspaceVisualizationValidationGates.length,
      diagnosticCount:
        DashboardExecutiveWorkspaceVisualizationValidationDiagnostics.length,
      severityLevelCount:
        DashboardExecutiveWorkspaceVisualizationValidationSeverityLevels.length,
      outcomeCount:
        DashboardExecutiveWorkspaceVisualizationValidationOutcomes.length,
      policyCount:
        DashboardExecutiveWorkspaceVisualizationValidationPolicies.length,
      readinessDeclarationCount:
        DashboardExecutiveWorkspaceVisualizationValidationReadinessDeclarations.length,
    }),
    modelCollectionsPreservedByReference: true,
    registryFoundationAndEveFivePreservedThroughModel: true,
    countsDerivedFromCanonicalCollections: true,
    hardcodedAggregateTotals: false,
    reconstructsModelCollections: false,
    duplicatesModelMetadata: false,
    maintainsParallelUpstreamInventory: false,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
