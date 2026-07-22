import { GraphVisualizationRegistry } from "./graphVisualizationRegistry.ts";

const seeds = Object.freeze([
  ["GraphModel", "GraphIdentityModel", "identityReference"],
  ["GraphModel", "GraphStructureModel", "structureReference"],
  ["GraphModel", "GraphNodeModel", "nodeReferences"],
  ["GraphModel", "GraphEdgeModel", "edgeReferences"],
  ["GraphModel", "GraphClusterModel", "clusterReferences"],
  ["GraphModel", "GraphGroupModel", "groupReferences"],
  ["GraphModel", "GraphPathModel", "pathReferences"],
  ["GraphModel", "GraphViewModel", "viewReferences"],
  ["GraphViewModel", "GraphViewportModel", "viewportReference"],
  ["GraphNodeModel", "NodePresentationModel", "presentationReference"],
  ["GraphEdgeModel", "EdgePresentationModel", "presentationReference"],
  ["GraphModel", "LayoutIntentModel", "layoutIntentReference"],
  ["GraphModel", "GraphOutputModel", "outputReference"],
  ["GraphModel", "GraphVisualizationProfileModel", "profileReference"],
  ["GraphModel", "GraphVisualizationPolicyModel", "policyReference"],
  ["GraphModel", "GraphExtensionPointModel", "extensionReference"],
] as const);

export const GraphVisualizationModelRelationships = Object.freeze(
  seeds.map(([sourceModel, targetModel, referenceField], index) => Object.freeze({
    id: `EVE-3:3/Relationship/${sourceModel}-${targetModel}`,
    sourceModel,
    targetModel,
    referenceField,
    registryReference: GraphVisualizationRegistry.metadata.id,
    deterministicOrder: index + 1,
    traversalProvided: false,
    dependencyResolutionProvided: false,
    inferenceProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
