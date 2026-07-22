import { GraphVisualizationRegistry } from "./graphVisualizationRegistry.ts";
import {
  GraphVisualizationModelDescriptors,
  GraphVisualizationStructuralComposition,
} from "./graphVisualizationModelDescriptors.ts";
import { GraphVisualizationModelInventory } from "./graphVisualizationModelInventory.ts";
import { GraphVisualizationModelMetadata } from "./graphVisualizationModelMetadata.ts";
import { GraphVisualizationModelPolicies } from "./graphVisualizationModelPolicies.ts";
import { GraphVisualizationModelRelationships } from "./graphVisualizationModelRelationships.ts";

export const GraphVisualizationModelIdentity = Object.freeze({
  id: GraphVisualizationModelMetadata.id,
  name: GraphVisualizationModelMetadata.name,
  version: GraphVisualizationModelMetadata.version,
  namespace: GraphVisualizationModelMetadata.namespace,
} as const);

export { GraphVisualizationModelInventory, GraphVisualizationModelMetadata };
export const GraphVisualizationModelReadiness = GraphVisualizationModelMetadata.readiness;

export const GraphVisualizationModel = Object.freeze({
  metadata: GraphVisualizationModelMetadata,
  registry: GraphVisualizationRegistry,
  descriptors: GraphVisualizationModelDescriptors,
  relationships: GraphVisualizationModelRelationships,
  composition: GraphVisualizationStructuralComposition,
  policies: GraphVisualizationModelPolicies,
  inventory: GraphVisualizationModelInventory,
  analyticsExecution: false,
  traversal: false,
  pathfinding: false,
  layoutExecution: false,
  rendering: false,
  runtimeInteraction: false,
  runtimeExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getGraphVisualizationModelSummary() {
  return GraphVisualizationModel.metadata;
}

export function getGraphVisualizationModelCount() {
  return GraphVisualizationModel.inventory.modelCount;
}

export function getGraphVisualizationModelReleaseMetadata() {
  return Object.freeze({
    identity: GraphVisualizationModelIdentity,
    status: GraphVisualizationModel.metadata.status,
    readiness: GraphVisualizationModel.metadata.readiness,
    registryReference: GraphVisualizationModel.metadata.registryReference,
  });
}
