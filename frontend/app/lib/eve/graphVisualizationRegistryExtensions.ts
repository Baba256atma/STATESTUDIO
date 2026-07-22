import { GraphVisualizationFoundation } from "./graphVisualizationFoundation.ts";
import type { GraphVisualizationRegistryEntry } from "./graphVisualizationRegistryTypes.ts";

const extensionContract = GraphVisualizationFoundation.contracts.find(
  ({ name }) => name === "GraphExtensionPoint",
)!;

const names = Object.freeze([
  "GraphIdentityExtension", "GraphStructureExtension", "NodeExtension", "EdgeExtension",
  "ClusterExtension", "GroupExtension", "PathExtension", "GraphViewExtension",
  "ViewportExtension", "LayoutIntentExtension", "RelationshipMarkerExtension",
  "NodePresentationExtension", "EdgePresentationExtension", "GraphOutputExtension",
] as const);

export const GraphExtensionPointTypeRegistry: readonly GraphVisualizationRegistryEntry[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-3:2/GraphExtensionPointType/${name}`,
    key: name,
    canonicalName: name,
    description: `Declarative Graph Visualization extension classification for ${name}.`,
    category: "GraphExtensionPointType",
    foundationContractReference: extensionContract.id,
    ownershipReference: GraphVisualizationFoundation.ownership.id,
    boundaryReferences: Object.freeze([GraphVisualizationFoundation.boundaries.id]),
    lifecycleApplicability: GraphVisualizationFoundation.lifecycle.states,
    capabilityReferences: Object.freeze(
      GraphVisualizationFoundation.capabilities.map(({ id }) => id),
    ),
    stability: "Stable",
    version: "1.0.0",
    extensionClassification: name,
    deprecated: false,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

export const GraphVisualizationRegistryExtensions = Object.freeze({
  classifications: GraphExtensionPointTypeRegistry,
  foundationExtensionContract: extensionContract,
  foundationBoundaryReference: GraphVisualizationFoundation.boundaries,
  loadsPlugins: false,
  registersRuntimeImplementations: false,
  executesExtensions: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
