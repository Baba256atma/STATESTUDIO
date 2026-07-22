import type { VisualizationRegistry } from "./visualizationRegistry.ts";

type CatalogName<Key extends keyof typeof VisualizationRegistry.catalog> =
  (typeof VisualizationRegistry.catalog)[Key] extends readonly { readonly name: infer Name }[]
    ? Name
    : string;

export interface VisualizationModelBase<Type extends string> {
  readonly id: string;
  readonly type: Type;
  readonly version: "1.0.0";
  readonly namespace: `nexora.eve.model.${string}`;
  readonly status: "Modeled";
  readonly stability: "Stable";
}

export interface VisualObjectModel extends VisualizationModelBase<"VisualObject"> {
  readonly visualObjectType: CatalogName<"visualObjectTypes">;
  readonly sceneReferenceRef: string;
  readonly visualStateRef: string;
  readonly sourceReference: string;
}
export interface SceneReferenceModel extends VisualizationModelBase<"SceneReference"> {
  readonly sceneType: CatalogName<"sceneTypes">;
  readonly directorSceneReference: string;
  readonly hierarchyRef: string;
}
export interface SceneNodeModel extends VisualizationModelBase<"SceneNode"> {
  readonly parentNodeRef: string | null;
  readonly childNodeRefs: readonly string[];
  readonly visualObjectRefs: readonly string[];
}
export interface SceneHierarchyModel extends VisualizationModelBase<"SceneHierarchy"> {
  readonly rootNodeRef: string;
  readonly nodeRefs: readonly string[];
  readonly layerRefs: readonly string[];
}
export interface ViewportModel extends VisualizationModelBase<"Viewport"> {
  readonly viewportType: CatalogName<"viewportTypes">;
  readonly cameraRef: string;
  readonly boundsMetadata: string;
}
export interface CameraModel extends VisualizationModelBase<"Camera"> {
  readonly cameraType: CatalogName<"cameraTypes">;
  readonly targetReference: string;
  readonly projectionMetadata: string;
}
export interface LayerModel extends VisualizationModelBase<"Layer"> {
  readonly layerType: CatalogName<"layerTypes">;
  readonly order: number;
  readonly renderingSurfaceRef: string;
}
export interface RenderingTargetModel extends VisualizationModelBase<"RenderingTarget"> {
  readonly renderingTargetType: CatalogName<"renderingTargets">;
  readonly viewportRef: string;
}
export interface RenderingSurfaceModel extends VisualizationModelBase<"RenderingSurface"> {
  readonly renderingSurfaceType: CatalogName<"renderingSurfaces">;
  readonly renderingTargetRef: string;
  readonly contextRef: string;
}
export interface RenderingContextModel extends VisualizationModelBase<"RenderingContext"> {
  readonly surfaceRef: string;
  readonly profileRef: string;
  readonly contextMetadata: string;
}
export interface VisualStateModel extends VisualizationModelBase<"VisualState"> {
  readonly visualStateType: CatalogName<"visualStateTypes">;
  readonly interactionStateRef: string;
  readonly runtimeState: false;
}
export interface InteractionStateModel extends VisualizationModelBase<"InteractionState"> {
  readonly interactionStateType: CatalogName<"interactionStateTypes">;
  readonly runtimeState: false;
}
export interface RenderingCapabilityModel extends VisualizationModelBase<"RenderingCapability"> {
  readonly capabilityType: CatalogName<"capabilityTypes">;
  readonly renderingProfileRef: string;
  readonly implementationProvided: false;
}
export interface RenderingProfileModel extends VisualizationModelBase<"RenderingProfile"> {
  readonly renderingMode: CatalogName<"renderingModes">;
  readonly capabilityRefs: readonly string[];
  readonly policyRefs: readonly string[];
}
export interface ExtensionPointModel extends VisualizationModelBase<"ExtensionPoint"> {
  readonly extensionPointType: string;
  readonly visualObjectRef: string;
  readonly implementationProvided: false;
}
export interface ModelIdentityModel extends VisualizationModelBase<"ModelIdentity"> {
  readonly modelRef: string;
  readonly canonicalName: string;
}
export interface ModelMetadataModel extends VisualizationModelBase<"ModelMetadata"> {
  readonly modelRef: string;
  readonly fields: readonly string[];
}
export interface ModelVersionModel extends VisualizationModelBase<"ModelVersion"> {
  readonly modelRef: string;
  readonly modelVersion: string;
}

export interface VisualizationModelDescriptor {
  readonly id: `EVE-1:3/Model/${string}`;
  readonly name: string;
  readonly type: string;
  readonly version: "1.0.0";
  readonly namespace: `nexora.eve.model.${string}`;
  readonly status: "Model";
  readonly stability: "Stable";
  readonly registryReference: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

