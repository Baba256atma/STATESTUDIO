import type { GraphVisualizationRegistry } from "./graphVisualizationRegistry.ts";

type RegistryKey<Key extends keyof typeof GraphVisualizationRegistry.catalog> =
  (typeof GraphVisualizationRegistry.catalog)[Key] extends readonly { readonly key: infer Value }[]
    ? Value : string;

export interface GraphVisualizationModelBase<Type extends string> {
  readonly id: string;
  readonly type: Type;
  readonly version: "1.0.0";
  readonly namespace: `nexora.eve.graph-visualization.model.${string}`;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphModel extends GraphVisualizationModelBase<"GraphModel"> {
  readonly graphReferenceType: RegistryKey<"graphReferenceTypes">;
  readonly identityReference: string;
  readonly structureReference: string;
  readonly nodeReferences: readonly string[];
  readonly edgeReferences: readonly string[];
}
export interface GraphIdentityModel extends GraphVisualizationModelBase<"GraphIdentityModel"> {
  readonly identityType: RegistryKey<"graphIdentityTypes">;
  readonly canonicalOwner: string;
}
export interface GraphStructureModel extends GraphVisualizationModelBase<"GraphStructureModel"> {
  readonly structureType: RegistryKey<"graphStructureTypes">;
  readonly nodeCollectionReference: string;
  readonly edgeCollectionReference: string;
}
export interface GraphNodeModel extends GraphVisualizationModelBase<"GraphNodeModel"> {
  readonly nodeType: RegistryKey<"graphNodeTypes">;
  readonly presentationReference: string;
}
export interface GraphEdgeModel extends GraphVisualizationModelBase<"GraphEdgeModel"> {
  readonly edgeType: RegistryKey<"graphEdgeTypes">;
  readonly sourceNodeReference: string;
  readonly targetNodeReference: string;
  readonly presentationReference: string;
}
export interface GraphClusterModel extends GraphVisualizationModelBase<"GraphClusterModel"> {
  readonly clusterType: RegistryKey<"graphClusterTypes">;
  readonly memberReferences: readonly string[];
}
export interface GraphGroupModel extends GraphVisualizationModelBase<"GraphGroupModel"> {
  readonly groupType: RegistryKey<"graphGroupTypes">;
  readonly memberReferences: readonly string[];
}
export interface GraphPathModel extends GraphVisualizationModelBase<"GraphPathModel"> {
  readonly pathType: RegistryKey<"graphPathTypes">;
  readonly orderedNodeReferences: readonly string[];
  readonly orderedEdgeReferences: readonly string[];
  readonly calculationProvided: false;
}
export interface GraphViewModel extends GraphVisualizationModelBase<"GraphViewModel"> {
  readonly viewType: RegistryKey<"graphViewTypes">;
  readonly viewportReference: string;
}
export interface GraphViewportModel extends GraphVisualizationModelBase<"GraphViewportModel"> {
  readonly viewportType: RegistryKey<"graphViewportTypes">;
  readonly sceneRenderingReference: string;
}
export interface LayoutIntentModel extends GraphVisualizationModelBase<"LayoutIntentModel"> {
  readonly layoutIntentType: RegistryKey<"layoutIntentTypes">;
  readonly executionProvided: false;
}
export interface RelationshipMarkerModel extends GraphVisualizationModelBase<"RelationshipMarkerModel"> {
  readonly markerType: RegistryKey<"relationshipMarkerTypes">;
  readonly inferenceProvided: false;
}
export interface NodePresentationModel extends GraphVisualizationModelBase<"NodePresentationModel"> {
  readonly presentationType: RegistryKey<"nodePresentationTypes">;
  readonly nodeReference: string;
}
export interface EdgePresentationModel extends GraphVisualizationModelBase<"EdgePresentationModel"> {
  readonly presentationType: RegistryKey<"edgePresentationTypes">;
  readonly edgeReference: string;
}
export interface GraphOutputModel extends GraphVisualizationModelBase<"GraphOutputModel"> {
  readonly outputType: RegistryKey<"graphOutputTypes">;
  readonly graphViewReference: string;
  readonly generationProvided: false;
}
export interface GraphVisualizationProfileModel extends GraphVisualizationModelBase<"GraphVisualizationProfileModel"> {
  readonly profileType: RegistryKey<"graphVisualizationProfileTypes">;
  readonly capabilityReferences: readonly string[];
}
export interface GraphVisualizationPolicyModel extends GraphVisualizationModelBase<"GraphVisualizationPolicyModel"> {
  readonly policyType: RegistryKey<"graphVisualizationPolicyTypes">;
  readonly enforcement: "DescriptiveOnly";
}
export interface GraphExtensionPointModel extends GraphVisualizationModelBase<"GraphExtensionPointModel"> {
  readonly extensionType: RegistryKey<"graphExtensionPointTypes">;
  readonly implementationProvided: false;
}

export interface GraphVisualizationModelDescriptor {
  readonly id: `EVE-3:3/Model/${string}`;
  readonly canonicalName: string;
  readonly registryReference: `EVE-3:2/${string}/${string}`;
  readonly namespace: `nexora.eve.graph-visualization.model.${string}`;
  readonly version: "1.0.0";
  readonly ownershipReference: "EVE-3:1/GraphVisualizationOwnership";
  readonly lifecycleReference: readonly string[];
  readonly capabilityReferences: readonly string[];
  readonly structuralMetadata: readonly string[];
  readonly boundaryReferences: readonly string[];
  readonly compatibilityMetadata: { readonly registryCompatible: true };
  readonly extensionMetadata: { readonly classification: string | null };
  readonly deterministicOrder: number;
  readonly stability: "Stable";
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
