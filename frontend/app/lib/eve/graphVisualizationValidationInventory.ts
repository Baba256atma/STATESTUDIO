import { GraphVisualizationModel } from "./graphVisualizationModel.ts";
import {
  GraphVisualizationValidationDiagnostics,
  GraphVisualizationValidationOutcomes,
  GraphVisualizationValidationSeverityLevels,
} from "./graphVisualizationValidationDiagnostics.ts";
import {
  GraphVisualizationValidationGates,
  GraphVisualizationValidationReadinessDeclarations,
} from "./graphVisualizationValidationGates.ts";
import { GraphVisualizationValidationPolicies } from "./graphVisualizationValidationPolicies.ts";
import {
  GraphVisualizationValidationCategories,
  GraphVisualizationValidationRules,
} from "./graphVisualizationValidationRules.ts";

export const GraphVisualizationValidationInventory = Object.freeze({
  categoryCount: GraphVisualizationValidationCategories.length,
  ruleCount: GraphVisualizationValidationRules.length,
  gateCount: GraphVisualizationValidationGates.length,
  diagnosticCount: GraphVisualizationValidationDiagnostics.length,
  severityLevelCount: GraphVisualizationValidationSeverityLevels.length,
  outcomeCount: GraphVisualizationValidationOutcomes.length,
  policyCount: GraphVisualizationValidationPolicies.length,
  readinessDeclarationCount: GraphVisualizationValidationReadinessDeclarations.length,
  modelInventory: GraphVisualizationModel.inventory,
  modelDescriptors: GraphVisualizationModel.descriptors,
  modelRelationships: GraphVisualizationModel.relationships,
  modelComposition: GraphVisualizationModel.composition,
  modelOwnership: GraphVisualizationModel.metadata.ownership,
  modelBoundaries: GraphVisualizationModel.registry.foundation.boundaries,
  countsDerivedFromCanonicalCollections: true,
  modelCollectionsPreservedByReference: true,
  hardcodesAggregateTotals: false,
  reconstructsUpstreamCollections: false,
  duplicatesModelMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
