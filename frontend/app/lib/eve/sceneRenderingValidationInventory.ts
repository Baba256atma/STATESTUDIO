import { SceneRenderingModel } from "./sceneRenderingModel.ts";
import { SceneRenderingValidationDiagnostics } from "./sceneRenderingValidationDiagnostics.ts";
import { SceneRenderingValidationPolicies } from "./sceneRenderingValidationPolicies.ts";
import {
  SceneRenderingValidationCategories,
  SceneRenderingValidationGates,
  SceneRenderingValidationRules,
} from "./sceneRenderingValidationRules.ts";

export const SceneRenderingValidationInventory = Object.freeze({
  categoryCount: SceneRenderingValidationCategories.length,
  ruleCount: SceneRenderingValidationRules.length,
  gateCount: SceneRenderingValidationGates.length,
  diagnosticCount: SceneRenderingValidationDiagnostics.length,
  policyCount: SceneRenderingValidationPolicies.length,
  modelDescriptorCount: SceneRenderingModel.descriptors.length,
  relationshipCount: SceneRenderingModel.relationships.length,
  modelInventoryReference: SceneRenderingModel.inventory,
  modelDescriptorsReference: SceneRenderingModel.descriptors,
  modelRelationshipsReference: SceneRenderingModel.relationships,
  countsDerivedFromCanonicalCollections: true,
  modelCollectionsPreservedByReference: true,
  hardcodesInventoryTotals: false,
  reconstructsModelInventory: false,
  duplicatesModelMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
