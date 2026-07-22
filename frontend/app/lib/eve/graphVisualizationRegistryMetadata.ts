import { GraphVisualizationFoundation } from "./graphVisualizationFoundation.ts";
import { GraphVisualizationRegistryInventory } from "./graphVisualizationRegistryInventory.ts";

export const GraphVisualizationRegistryMetadata = Object.freeze({
  id: "EVE-3:2/GraphVisualizationRegistry",
  name: "Graph Visualization Registry",
  version: "1.0.0",
  namespace: "nexora.eve.graph-visualization.registry",
  layer: "EVE",
  phase: "EVE-3:2",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  foundationReference: GraphVisualizationFoundation.metadata.id,
  upstreamPublicIndexReference: GraphVisualizationFoundation.metadata.upstreamPublicIndexReference,
  upstreamLockReference: GraphVisualizationFoundation.metadata.upstreamLockReference,
  inventory: GraphVisualizationRegistryInventory,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Graph visualization vocabularies", "Registry identities", "Registry categories",
      "Registry entries", "Registry policies", "Registry inventories",
      "Extension classifications", "Registry metadata",
    ] as const),
    runtimeOwnership: false,
  }),
  dependency: Object.freeze({
    graphVisualizationFoundationOnly: true,
    directPreviousPhaseModule: "graphVisualizationFoundation.ts",
    directEveTwoImport: false,
    directEveOneImport: false,
    otherPhaseDependencies: false,
  }),
  analyticsExecution: false,
  traversal: false,
  pathfinding: false,
  layoutExecution: false,
  relationshipInference: false,
  rendering: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
