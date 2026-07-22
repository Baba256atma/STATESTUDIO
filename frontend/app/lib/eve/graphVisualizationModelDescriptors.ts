import { GraphVisualizationRegistry } from "./graphVisualizationRegistry.ts";
import type { GraphVisualizationModelDescriptor } from "./graphVisualizationModelTypes.ts";

type RegistryCollection = readonly {
  readonly id: `EVE-3:2/${string}/${string}`;
  readonly ownershipReference: "EVE-3:1/GraphVisualizationOwnership";
  readonly lifecycleApplicability: readonly string[];
  readonly capabilityReferences: readonly string[];
  readonly boundaryReferences: readonly string[];
  readonly extensionClassification: string | null;
}[];

const seeds: readonly [string, RegistryCollection, readonly string[]][] = Object.freeze([
  ["GraphModel", GraphVisualizationRegistry.catalog.graphReferenceTypes, ["identityReference", "structureReference", "nodeReferences", "edgeReferences"]],
  ["GraphIdentityModel", GraphVisualizationRegistry.catalog.graphIdentityTypes, ["identityType", "canonicalOwner"]],
  ["GraphStructureModel", GraphVisualizationRegistry.catalog.graphStructureTypes, ["structureType", "nodeCollectionReference", "edgeCollectionReference"]],
  ["GraphNodeModel", GraphVisualizationRegistry.catalog.graphNodeTypes, ["nodeType", "presentationReference"]],
  ["GraphEdgeModel", GraphVisualizationRegistry.catalog.graphEdgeTypes, ["edgeType", "sourceNodeReference", "targetNodeReference", "presentationReference"]],
  ["GraphClusterModel", GraphVisualizationRegistry.catalog.graphClusterTypes, ["clusterType", "memberReferences"]],
  ["GraphGroupModel", GraphVisualizationRegistry.catalog.graphGroupTypes, ["groupType", "memberReferences"]],
  ["GraphPathModel", GraphVisualizationRegistry.catalog.graphPathTypes, ["pathType", "orderedNodeReferences", "orderedEdgeReferences", "calculationProvided"]],
  ["GraphViewModel", GraphVisualizationRegistry.catalog.graphViewTypes, ["viewType", "viewportReference"]],
  ["GraphViewportModel", GraphVisualizationRegistry.catalog.graphViewportTypes, ["viewportType", "sceneRenderingReference"]],
  ["LayoutIntentModel", GraphVisualizationRegistry.catalog.layoutIntentTypes, ["layoutIntentType", "executionProvided"]],
  ["RelationshipMarkerModel", GraphVisualizationRegistry.catalog.relationshipMarkerTypes, ["markerType", "inferenceProvided"]],
  ["NodePresentationModel", GraphVisualizationRegistry.catalog.nodePresentationTypes, ["presentationType", "nodeReference"]],
  ["EdgePresentationModel", GraphVisualizationRegistry.catalog.edgePresentationTypes, ["presentationType", "edgeReference"]],
  ["GraphOutputModel", GraphVisualizationRegistry.catalog.graphOutputTypes, ["outputType", "graphViewReference", "generationProvided"]],
  ["GraphVisualizationProfileModel", GraphVisualizationRegistry.catalog.graphVisualizationProfileTypes, ["profileType", "capabilityReferences"]],
  ["GraphVisualizationPolicyModel", GraphVisualizationRegistry.catalog.graphVisualizationPolicyTypes, ["policyType", "enforcement"]],
  ["GraphExtensionPointModel", GraphVisualizationRegistry.catalog.graphExtensionPointTypes, ["extensionType", "implementationProvided"]],
]);

export const GraphVisualizationModelDescriptors: readonly GraphVisualizationModelDescriptor[] =
  Object.freeze(seeds.map(([canonicalName, collection, structuralMetadata], index) => {
    const registryEntry = collection[0]!;
    return Object.freeze({
      id: `EVE-3:3/Model/${canonicalName}`,
      canonicalName,
      registryReference: registryEntry.id,
      namespace: `nexora.eve.graph-visualization.model.${canonicalName.toLowerCase()}`,
      version: "1.0.0",
      ownershipReference: registryEntry.ownershipReference,
      lifecycleReference: registryEntry.lifecycleApplicability,
      capabilityReferences: registryEntry.capabilityReferences,
      structuralMetadata: Object.freeze([...structuralMetadata]),
      boundaryReferences: registryEntry.boundaryReferences,
      compatibilityMetadata: Object.freeze({ registryCompatible: true }),
      extensionMetadata: Object.freeze({ classification: registryEntry.extensionClassification }),
      deterministicOrder: index + 1,
      stability: "Stable",
      executableBehavior: false,
      metadataOnly: true,
      immutable: true,
    });
  }));

export const GraphVisualizationStructuralComposition = Object.freeze([
  "GraphRoot", "Identity", "Structure", "NodeCollection", "EdgeCollection",
  "ClusterCollection", "GroupCollection", "PathCollection", "ViewCollection",
  "Viewport", "PresentationCollection", "LayoutIntent", "OutputReference",
  "ProfileReference", "PolicyReference", "ExtensionReference",
].map((name, index) => Object.freeze({
  id: `EVE-3:3/Composition/${name}`,
  name,
  modelReference: GraphVisualizationModelDescriptors[
    Math.min(index, GraphVisualizationModelDescriptors.length - 1)
  ]!,
  deterministicOrder: index + 1,
  executionProvided: false,
  metadataOnly: true,
  immutable: true,
})));
