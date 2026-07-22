import { VisualizationModel } from "./visualizationModel.ts";
import { VisualizationValidationDiagnostics } from "./visualizationValidationDiagnostics.ts";
import { VisualizationValidationPolicies } from "./visualizationValidationPolicies.ts";
import {
  VisualizationValidationCategories,
  VisualizationValidationGates,
  VisualizationValidationRules,
} from "./visualizationValidationRules.ts";

export const VisualizationValidationInventory = Object.freeze({
  categoryCount: VisualizationValidationCategories.length,
  ruleCount: VisualizationValidationRules.length,
  gateCount: VisualizationValidationGates.length,
  diagnosticCount: VisualizationValidationDiagnostics.length,
  policyCount: VisualizationValidationPolicies.length,
  modelCount: VisualizationModel.descriptors.length,
  relationshipCount: VisualizationModel.relationships.length,
  modelInventoryReference: VisualizationModel.inventory,
  countsDerivedFromCanonicalCollections: true,
  reconstructsModelInventory: false,
  duplicatesModelMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

