import type {
  GraphVisualizationContractDeclaration,
  GraphVisualizationContractName,
} from "./graphVisualizationFoundationTypes.ts";

const seeds: readonly [GraphVisualizationContractName, readonly string[]][] = Object.freeze([
  ["GraphIdentity", ["id", "canonicalName", "version", "namespace", "ownershipReference", "lifecycleState", "stability"]],
  ["GraphReference", ["id", "graphIdentityReference", "sourceReference"]],
  ["GraphStructure", ["id", "nodeCollectionReference", "edgeCollectionReference", "clusterCollectionReference", "pathCollectionReference", "directionality", "multiplicity", "hierarchy", "structuralMetadataReference"]],
  ["GraphNode", ["id", "category", "sourceReference", "labelReference", "stateReference", "presentationReference", "clusterMembershipReferences", "extensionMetadataReference"]],
  ["GraphEdge", ["id", "sourceNodeReference", "targetNodeReference", "relationshipType", "direction", "cardinality", "stateReference", "presentationReference", "extensionMetadataReference"]],
  ["GraphCluster", ["id", "membershipReferences", "parentClusterReference", "presentationIntent", "collapseIntent", "expansionIntent", "boundaryIntent"]],
  ["GraphGroup", ["id", "membershipReferences", "parentGroupReference", "presentationIntent"]],
  ["GraphPath", ["id", "orderedNodeReferences", "orderedEdgeReferences", "pathType", "emphasisIntent", "startReference", "endReference", "stateReference", "presentationIntent", "calculationProvided"]],
  ["GraphView", ["id", "structureReference", "viewportReference", "layoutIntentReference"]],
  ["GraphViewport", ["id", "sceneRenderingViewportReference", "viewReference"]],
  ["LayoutIntent", ["id", "intent", "executionProvided"]],
  ["RelationshipMarker", ["id", "marker", "inferenceProvided"]],
  ["NodePresentation", ["id", "nodeReference", "presentationIntent"]],
  ["EdgePresentation", ["id", "edgeReference", "presentationIntent"]],
  ["GraphOutput", ["id", "sceneRenderingTargetReference", "graphViewReference", "viewportReference", "profileReference", "compatibilityMetadataReference", "extensionMetadataReference", "generationProvided"]],
  ["GraphVisualizationProfile", ["id", "capabilityReferences", "policyReferences"]],
  ["GraphVisualizationPolicy", ["id", "description", "enforcement"]],
  ["GraphExtensionPoint", ["id", "extensionType", "implementationProvided"]],
]);

export const GraphVisualizationContracts: readonly GraphVisualizationContractDeclaration[] =
  Object.freeze(seeds.map(([name, fields], index) => Object.freeze({
    id: `EVE-3:1/Contract/${name}`,
    name,
    description: `Canonical immutable Graph Visualization contract for ${name}.`,
    fields: Object.freeze([...fields]),
    deterministicOrder: index + 1,
    runtimeBehavior: "None",
    metadataOnly: true,
    immutable: true,
  })));

export const GraphVisualizationContractNames = Object.freeze(
  GraphVisualizationContracts.map(({ name }) => name),
);
