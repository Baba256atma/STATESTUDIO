import { GraphVisualizationFoundation } from "./graphVisualizationFoundation.ts";
import { GraphVisualizationRegistryCatalog } from "./graphVisualizationRegistryCatalog.ts";
import { GraphVisualizationRegistryExtensions } from "./graphVisualizationRegistryExtensions.ts";
import { GraphVisualizationRegistryInventory } from "./graphVisualizationRegistryInventory.ts";
import { GraphVisualizationRegistryMetadata } from "./graphVisualizationRegistryMetadata.ts";
import { GraphVisualizationRegistryPolicies } from "./graphVisualizationRegistryPolicies.ts";

export const GraphVisualizationRegistryIdentity = Object.freeze({
  id: GraphVisualizationRegistryMetadata.id,
  name: GraphVisualizationRegistryMetadata.name,
  version: GraphVisualizationRegistryMetadata.version,
  namespace: GraphVisualizationRegistryMetadata.namespace,
} as const);

export { GraphVisualizationRegistryInventory, GraphVisualizationRegistryMetadata };
export const GraphVisualizationRegistryReadiness = GraphVisualizationRegistryMetadata.readiness;

export const GraphVisualizationRegistry = Object.freeze({
  metadata: GraphVisualizationRegistryMetadata,
  foundation: GraphVisualizationFoundation,
  catalog: GraphVisualizationRegistryCatalog,
  policies: GraphVisualizationRegistryPolicies,
  extensions: GraphVisualizationRegistryExtensions,
  inventory: GraphVisualizationRegistryInventory,
  analyticsExecution: false,
  traversal: false,
  pathfinding: false,
  layoutExecution: false,
  relationshipInference: false,
  rendering: false,
  runtimeExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getGraphVisualizationRegistrySummary() {
  return GraphVisualizationRegistry.metadata;
}

export function getGraphVisualizationRegistryCount() {
  return GraphVisualizationRegistry.inventory.registryEntryCount;
}

export function getGraphVisualizationRegistryReleaseMetadata() {
  return Object.freeze({
    identity: GraphVisualizationRegistryIdentity,
    status: GraphVisualizationRegistry.metadata.status,
    readiness: GraphVisualizationRegistry.metadata.readiness,
    foundationReference: GraphVisualizationRegistry.metadata.foundationReference,
  });
}
