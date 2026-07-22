import { TimelineVisualizationRegistryPlatform } from "./timelineVisualizationRegistry.ts";
import {
  TimelineVisualizationModelDescriptors,
  TimelineVisualizationStructuralComposition,
} from "./timelineVisualizationModelDescriptors.ts";
import { TimelineVisualizationModelPolicies } from "./timelineVisualizationModelPolicies.ts";
import { TimelineVisualizationModelRelationships } from "./timelineVisualizationModelRelationships.ts";

export const TimelineVisualizationModelInventory = Object.freeze({
  models: TimelineVisualizationModelDescriptors,
  relationships: TimelineVisualizationModelRelationships,
  policies: TimelineVisualizationModelPolicies,
  structuralComposition: TimelineVisualizationStructuralComposition,
  registryCatalog: TimelineVisualizationRegistryPlatform.catalog,
  registryInventory: TimelineVisualizationRegistryPlatform.inventory,
  registryPolicies: TimelineVisualizationRegistryPlatform.policies,
  registryExtensions: TimelineVisualizationRegistryPlatform.extensions,
  registryFoundationReference: TimelineVisualizationRegistryPlatform.foundation,
  counts: Object.freeze({
    modelCount: TimelineVisualizationModelDescriptors.length,
    relationshipCount: TimelineVisualizationModelRelationships.length,
    policyCount: TimelineVisualizationModelPolicies.length,
    compositionEntryCount: TimelineVisualizationStructuralComposition.length,
  }),
  registryCollectionsPreservedByReference: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateTotals: false,
  reconstructsRegistryCollections: false,
  duplicatesRegistryMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
