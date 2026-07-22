export type GraphVisualizationContractName =
  | "GraphIdentity" | "GraphReference" | "GraphStructure" | "GraphNode"
  | "GraphEdge" | "GraphCluster" | "GraphGroup" | "GraphPath"
  | "GraphView" | "GraphViewport" | "LayoutIntent" | "RelationshipMarker"
  | "NodePresentation" | "EdgePresentation" | "GraphOutput"
  | "GraphVisualizationProfile" | "GraphVisualizationPolicy"
  | "GraphExtensionPoint";

export type GraphVisualizationLifecycleState =
  | "Declared" | "Structured" | "Prepared" | "Published" | "Retired";

export type GraphLayoutIntent =
  | "Hierarchical" | "Radial" | "Layered" | "ForceDirected"
  | "Grid" | "Circular" | "Geographic" | "Manual" | "Preserved";

export type GraphRelationshipMarker =
  | "Dependency" | "Influence" | "Causality" | "Ownership" | "Flow"
  | "Constraint" | "Risk" | "Approval" | "Escalation" | "InformationTransfer";

export interface GraphVisualizationMetadataBase<Type extends string> {
  readonly id: string;
  readonly type: Type;
  readonly version: string;
  readonly namespace: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphIdentity extends GraphVisualizationMetadataBase<"GraphIdentity"> {
  readonly canonicalName: string;
  readonly ownershipReference: string;
  readonly lifecycleState: GraphVisualizationLifecycleState;
  readonly stability: "Stable";
}
export interface GraphReference extends GraphVisualizationMetadataBase<"GraphReference"> {
  readonly graphIdentityReference: string;
  readonly sourceReference: string;
}
export interface GraphStructure extends GraphVisualizationMetadataBase<"GraphStructure"> {
  readonly nodeCollectionReference: string;
  readonly edgeCollectionReference: string;
  readonly clusterCollectionReference: string;
  readonly pathCollectionReference: string;
  readonly directionality: string;
  readonly multiplicity: string;
  readonly hierarchy: string;
  readonly structuralMetadataReference: string;
}
export interface GraphNode extends GraphVisualizationMetadataBase<"GraphNode"> {
  readonly category: string;
  readonly sourceReference: string;
  readonly labelReference: string;
  readonly stateReference: string;
  readonly presentationReference: string;
  readonly clusterMembershipReferences: readonly string[];
  readonly extensionMetadataReference: string;
}
export interface GraphEdge extends GraphVisualizationMetadataBase<"GraphEdge"> {
  readonly sourceNodeReference: string;
  readonly targetNodeReference: string;
  readonly relationshipType: string;
  readonly direction: string;
  readonly cardinality: string;
  readonly stateReference: string;
  readonly presentationReference: string;
  readonly extensionMetadataReference: string;
}
export interface GraphCluster extends GraphVisualizationMetadataBase<"GraphCluster"> {
  readonly membershipReferences: readonly string[];
  readonly parentClusterReference: string | null;
  readonly presentationIntent: string;
  readonly collapseIntent: boolean;
  readonly expansionIntent: boolean;
  readonly boundaryIntent: string;
}
export interface GraphGroup extends GraphVisualizationMetadataBase<"GraphGroup"> {
  readonly membershipReferences: readonly string[];
  readonly parentGroupReference: string | null;
  readonly presentationIntent: string;
}
export interface GraphPath extends GraphVisualizationMetadataBase<"GraphPath"> {
  readonly orderedNodeReferences: readonly string[];
  readonly orderedEdgeReferences: readonly string[];
  readonly pathType: string;
  readonly emphasisIntent: string;
  readonly startReference: string;
  readonly endReference: string;
  readonly stateReference: string;
  readonly presentationIntent: string;
  readonly calculationProvided: false;
}
export interface GraphView extends GraphVisualizationMetadataBase<"GraphView"> {
  readonly structureReference: string;
  readonly viewportReference: string;
  readonly layoutIntentReference: string;
}
export interface GraphViewport extends GraphVisualizationMetadataBase<"GraphViewport"> {
  readonly sceneRenderingViewportReference: string;
  readonly viewReference: string;
}
export interface LayoutIntent extends GraphVisualizationMetadataBase<"LayoutIntent"> {
  readonly intent: GraphLayoutIntent;
  readonly executionProvided: false;
}
export interface RelationshipMarker extends GraphVisualizationMetadataBase<"RelationshipMarker"> {
  readonly marker: GraphRelationshipMarker;
  readonly inferenceProvided: false;
}
export interface NodePresentation extends GraphVisualizationMetadataBase<"NodePresentation"> {
  readonly nodeReference: string;
  readonly presentationIntent: string;
}
export interface EdgePresentation extends GraphVisualizationMetadataBase<"EdgePresentation"> {
  readonly edgeReference: string;
  readonly presentationIntent: string;
}
export interface GraphOutput extends GraphVisualizationMetadataBase<"GraphOutput"> {
  readonly sceneRenderingTargetReference: string;
  readonly graphViewReference: string;
  readonly viewportReference: string;
  readonly profileReference: string;
  readonly compatibilityMetadataReference: string;
  readonly extensionMetadataReference: string;
  readonly generationProvided: false;
}
export interface GraphVisualizationProfile extends GraphVisualizationMetadataBase<"GraphVisualizationProfile"> {
  readonly capabilityReferences: readonly string[];
  readonly policyReferences: readonly string[];
}
export interface GraphVisualizationPolicy extends GraphVisualizationMetadataBase<"GraphVisualizationPolicy"> {
  readonly description: string;
  readonly enforcement: "DescriptiveOnly";
}
export interface GraphExtensionPoint extends GraphVisualizationMetadataBase<"GraphExtensionPoint"> {
  readonly extensionType: string;
  readonly implementationProvided: false;
}

export interface GraphVisualizationContractDeclaration {
  readonly id: `EVE-3:1/Contract/${GraphVisualizationContractName}`;
  readonly name: GraphVisualizationContractName;
  readonly description: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}
