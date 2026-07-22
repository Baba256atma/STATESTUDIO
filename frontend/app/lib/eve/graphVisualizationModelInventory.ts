import { GraphVisualizationRegistry } from "./graphVisualizationRegistry.ts";
import {
  GraphVisualizationModelDescriptors,
  GraphVisualizationStructuralComposition,
} from "./graphVisualizationModelDescriptors.ts";
import { GraphVisualizationModelPolicies } from "./graphVisualizationModelPolicies.ts";
import { GraphVisualizationModelRelationships } from "./graphVisualizationModelRelationships.ts";

export const GraphVisualizationModelInventory = Object.freeze({
  modelCount: GraphVisualizationModelDescriptors.length,
  modelDescriptorCount: GraphVisualizationModelDescriptors.length,
  relationshipCount: GraphVisualizationModelRelationships.length,
  policyCount: GraphVisualizationModelPolicies.length,
  compositionEntryCount: GraphVisualizationStructuralComposition.length,
  registryCatalog: GraphVisualizationRegistry.catalog,
  registryInventory: GraphVisualizationRegistry.inventory,
  registryCollections: GraphVisualizationRegistry.catalog.registries,
  countsDerivedFromCanonicalCollections: true,
  registryCollectionsPreservedByReference: true,
  hardcodesAggregateTotals: false,
  reconstructsRegistryCollections: false,
  duplicatesRegistryMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
