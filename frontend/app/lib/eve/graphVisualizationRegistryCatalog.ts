import { GraphVisualizationFoundation } from "./graphVisualizationFoundation.ts";
import { GraphExtensionPointTypeRegistry } from "./graphVisualizationRegistryExtensions.ts";
import type {
  GraphVisualizationRegistryCategory,
  GraphVisualizationRegistryEntry,
} from "./graphVisualizationRegistryTypes.ts";

const contract = (name: string) => GraphVisualizationFoundation.contracts.find(
  (item) => item.name === name,
)!;

const entries = (
  category: string,
  foundationContractName: string,
  names: readonly string[],
): readonly GraphVisualizationRegistryEntry[] => {
  const foundationContract = contract(foundationContractName);
  return Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-3:2/${category}/${name}`,
    key: name,
    canonicalName: name,
    description: `Canonical Graph Visualization ${category} classification for ${name}.`,
    category,
    foundationContractReference: foundationContract.id,
    ownershipReference: GraphVisualizationFoundation.ownership.id,
    boundaryReferences: Object.freeze([GraphVisualizationFoundation.boundaries.id]),
    lifecycleApplicability: GraphVisualizationFoundation.lifecycle.states,
    capabilityReferences: Object.freeze(
      GraphVisualizationFoundation.capabilities.map(({ id }) => id),
    ),
    stability: "Stable",
    version: "1.0.0",
    extensionClassification: null,
    deprecated: false,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));
};

export const GraphIdentityTypeRegistry = entries("GraphIdentityType", "GraphIdentity", ["CanonicalGraph", "ReferencedGraph", "CompositeGraph"]);
export const GraphReferenceTypeRegistry = entries("GraphReferenceType", "GraphReference", ["Canonical", "External", "Derived", "Upstream"]);
export const GraphStructureTypeRegistry = entries("GraphStructureType", "GraphStructure", ["Directed", "Undirected", "Mixed", "Hierarchical", "AcyclicIntent", "CyclicIntent", "SingleGraph", "MultiGraphIntent", "CompoundGraphIntent", "NestedGraphIntent"]);
export const GraphNodeTypeRegistry = entries("GraphNodeType", "GraphNode", ["Entity", "BusinessObjectReference", "Decision", "Scenario", "KPI", "Risk", "Goal", "Process", "Team", "Resource", "Event", "InformationObject", "AbstractGroup", "ExternalReference"]);
export const GraphEdgeTypeRegistry = entries("GraphEdgeType", "GraphEdge", ["DirectedRelationship", "UndirectedAssociation", "Dependency", "Influence", "Causality", "Ownership", "Flow", "Constraint", "Approval", "Escalation", "InformationTransfer", "Sequence", "Support", "Conflict"]);
export const GraphClusterTypeRegistry = entries("GraphClusterType", "GraphCluster", ["StructuralCluster", "SemanticCluster", "OrganizationalCluster", "ScenarioCluster", "DependencyCluster", "RiskCluster"]);
export const GraphGroupTypeRegistry = entries("GraphGroupType", "GraphGroup", ["OrganizationalGroup", "ScenarioGroup", "DependencyGroup", "RiskGroup", "DecisionGroup", "CollapsibleGroupIntent", "FixedGroupIntent", "NestedGroupIntent"]);
export const GraphPathTypeRegistry = entries("GraphPathType", "GraphPath", ["DependencyPath", "CausalPath", "DecisionPath", "EscalationPath", "InformationPath", "ApprovalPath", "ScenarioPath", "HighlightPath", "PrimaryPath", "SupportingPath"]);
export const GraphViewTypeRegistry = entries("GraphViewType", "GraphView", ["Overview", "Focused", "Contextual", "Comparison", "Presentation"]);
export const GraphViewportTypeRegistry = entries("GraphViewportType", "GraphViewport", ["Primary", "Secondary", "Embedded", "Reference"]);
export const LayoutIntentTypeRegistry = entries("LayoutIntentType", "LayoutIntent", ["Hierarchical", "Layered", "Radial", "Circular", "Grid", "Manual", "Preserved", "ForceDirectedIntent", "GeographicIntent", "TimelineOrientedIntent"]);
export const RelationshipMarkerTypeRegistry = entries("RelationshipMarkerType", "RelationshipMarker", ["Dependency", "Influence", "Causality", "Ownership", "Flow", "Constraint", "Risk", "Approval", "Escalation", "InformationTransfer", "Support", "Conflict"]);
const presentationNames = ["Standard", "Emphasized", "Muted", "Selected", "Focused", "Warning", "Critical", "Success", "Inactive", "Historical", "Forecast", "Scenario"] as const;
export const NodePresentationTypeRegistry = entries("NodePresentationType", "NodePresentation", presentationNames);
export const EdgePresentationTypeRegistry = entries("EdgePresentationType", "EdgePresentation", presentationNames);
export const GraphOutputTypeRegistry = entries("GraphOutputType", "GraphOutput", ["SceneOutputReference", "StaticGraphOutputIntent", "InteractiveGraphOutputIntent", "SnapshotOutputIntent", "PresentationOutputIntent", "DashboardEmbeddingIntent", "ExportIntent", "ComparisonOutputIntent"]);
export const GraphVisualizationProfileTypeRegistry = entries("GraphVisualizationProfileType", "GraphVisualizationProfile", ["Standard", "Executive", "AnalyticalIntent", "Presentation", "Compatibility"]);
export const GraphVisualizationPolicyTypeRegistry = entries("GraphVisualizationPolicyType", "GraphVisualizationPolicy", ["Stable", "Immutable", "Deterministic", "BoundarySafe", "ReferencePreserving"]);

const collectionByContract = Object.freeze({
  GraphIdentity: GraphIdentityTypeRegistry,
  GraphReference: GraphReferenceTypeRegistry,
  GraphStructure: GraphStructureTypeRegistry,
  GraphNode: GraphNodeTypeRegistry,
  GraphEdge: GraphEdgeTypeRegistry,
  GraphCluster: GraphClusterTypeRegistry,
  GraphGroup: GraphGroupTypeRegistry,
  GraphPath: GraphPathTypeRegistry,
  GraphView: GraphViewTypeRegistry,
  GraphViewport: GraphViewportTypeRegistry,
  LayoutIntent: LayoutIntentTypeRegistry,
  RelationshipMarker: RelationshipMarkerTypeRegistry,
  NodePresentation: NodePresentationTypeRegistry,
  EdgePresentation: EdgePresentationTypeRegistry,
  GraphOutput: GraphOutputTypeRegistry,
  GraphVisualizationProfile: GraphVisualizationProfileTypeRegistry,
  GraphVisualizationPolicy: GraphVisualizationPolicyTypeRegistry,
  GraphExtensionPoint: GraphExtensionPointTypeRegistry,
} as const);

export const GraphVisualizationRegistryCategories: readonly GraphVisualizationRegistryCategory[] =
  Object.freeze(GraphVisualizationFoundation.contracts.map((item, index) => Object.freeze({
    id: `EVE-3:2/Category/${item.name}`,
    key: item.name,
    canonicalName: item.name,
    description: `Foundation-derived Registry category for ${item.name}.`,
    foundationContract: item,
    ownershipReference: GraphVisualizationFoundation.ownership.id,
    deterministicOrder: index + 1,
    entryCollection: collectionByContract[item.name],
    extensionEligible: true,
    stability: "Stable",
    metadataOnly: true,
    immutable: true,
  })));

const registries = Object.freeze([
  GraphIdentityTypeRegistry, GraphReferenceTypeRegistry, GraphStructureTypeRegistry,
  GraphNodeTypeRegistry, GraphEdgeTypeRegistry, GraphClusterTypeRegistry,
  GraphGroupTypeRegistry, GraphPathTypeRegistry, GraphViewTypeRegistry,
  GraphViewportTypeRegistry, LayoutIntentTypeRegistry, RelationshipMarkerTypeRegistry,
  NodePresentationTypeRegistry, EdgePresentationTypeRegistry, GraphOutputTypeRegistry,
  GraphVisualizationProfileTypeRegistry, GraphVisualizationPolicyTypeRegistry,
  GraphExtensionPointTypeRegistry,
]);

export const GraphVisualizationRegistryCatalog = Object.freeze({
  graphIdentityTypes: GraphIdentityTypeRegistry,
  graphReferenceTypes: GraphReferenceTypeRegistry,
  graphStructureTypes: GraphStructureTypeRegistry,
  graphNodeTypes: GraphNodeTypeRegistry,
  graphEdgeTypes: GraphEdgeTypeRegistry,
  graphClusterTypes: GraphClusterTypeRegistry,
  graphGroupTypes: GraphGroupTypeRegistry,
  graphPathTypes: GraphPathTypeRegistry,
  graphViewTypes: GraphViewTypeRegistry,
  graphViewportTypes: GraphViewportTypeRegistry,
  layoutIntentTypes: LayoutIntentTypeRegistry,
  relationshipMarkerTypes: RelationshipMarkerTypeRegistry,
  nodePresentationTypes: NodePresentationTypeRegistry,
  edgePresentationTypes: EdgePresentationTypeRegistry,
  graphOutputTypes: GraphOutputTypeRegistry,
  graphVisualizationProfileTypes: GraphVisualizationProfileTypeRegistry,
  graphVisualizationPolicyTypes: GraphVisualizationPolicyTypeRegistry,
  graphExtensionPointTypes: GraphExtensionPointTypeRegistry,
  categories: GraphVisualizationRegistryCategories,
  registries,
  metadataOnly: true,
  immutable: true,
} as const);
