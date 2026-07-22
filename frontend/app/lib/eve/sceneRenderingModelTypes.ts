import type { SceneRenderingRegistry } from "./sceneRenderingRegistry.ts";

type RegistryKey<Key extends keyof typeof SceneRenderingRegistry.catalog> =
  (typeof SceneRenderingRegistry.catalog)[Key] extends readonly { readonly key: infer Value }[]
    ? Value
    : string;

export interface SceneRenderingModelBase<Type extends string> {
  readonly id: string;
  readonly type: Type;
  readonly version: "1.0.0";
  readonly namespace: `nexora.eve.scene-rendering.model.${string}`;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneModel extends SceneRenderingModelBase<"Scene"> {
  readonly sceneType: RegistryKey<"sceneTypes">;
  readonly sceneReferenceRef: string;
  readonly hierarchyRef: string;
  readonly renderContextRef: string;
  readonly frameDescriptorRef: string;
  readonly compositionDescriptorRef: string;
}
export interface SceneReferenceModel extends SceneRenderingModelBase<"SceneReference"> {
  readonly referenceType: RegistryKey<"sceneReferenceTypes">;
  readonly visualizationReference: string;
}
export interface SceneHierarchyModel extends SceneRenderingModelBase<"SceneHierarchy"> {
  readonly parentSceneRef: string | null;
  readonly childSceneRefs: readonly string[];
  readonly layerRefs: readonly string[];
}
export interface RenderContextModel extends SceneRenderingModelBase<"RenderContext"> {
  readonly contextType: RegistryKey<"renderContextTypes">;
  readonly renderPassRefs: readonly string[];
}
export interface RenderPassModel extends SceneRenderingModelBase<"RenderPass"> {
  readonly passType: RegistryKey<"renderPassTypes">;
  readonly stageRef: string;
  readonly order: number;
}
export interface RenderStageModel extends SceneRenderingModelBase<"RenderStage"> {
  readonly stageType: RegistryKey<"renderStageTypes">;
  readonly layerRefs: readonly string[];
}
export interface RenderLayerModel extends SceneRenderingModelBase<"RenderLayer"> {
  readonly layerType: RegistryKey<"renderLayerTypes">;
  readonly surfaceRef: string;
  readonly order: number;
}
export interface RenderTargetModel extends SceneRenderingModelBase<"RenderTarget"> {
  readonly targetType: RegistryKey<"renderTargetTypes">;
  readonly outputDescriptorRef: string;
}
export interface RenderSurfaceModel extends SceneRenderingModelBase<"RenderSurface"> {
  readonly surfaceType: RegistryKey<"renderSurfaceTypes">;
  readonly targetRef: string;
}
export interface FrameDescriptorModel extends SceneRenderingModelBase<"FrameDescriptor"> {
  readonly frameType: RegistryKey<"frameDescriptorTypes">;
  readonly sceneRef: string;
  readonly frameGeneration: false;
}
export interface CompositionDescriptorModel extends SceneRenderingModelBase<"CompositionDescriptor"> {
  readonly compositionType: RegistryKey<"compositionTypes">;
  readonly sceneRef: string;
  readonly executionProvided: false;
}
export interface OutputDescriptorModel extends SceneRenderingModelBase<"OutputDescriptor"> {
  readonly outputType: RegistryKey<"outputDescriptorTypes">;
  readonly targetRef: string;
}
export interface RenderingProfileModel extends SceneRenderingModelBase<"RenderingProfile"> {
  readonly profileType: RegistryKey<"renderingProfileTypes">;
  readonly capabilityRefs: readonly string[];
}
export interface RenderingCapabilityModel extends SceneRenderingModelBase<"RenderingCapability"> {
  readonly capabilityType: RegistryKey<"renderingCapabilityTypes">;
  readonly implementationProvided: false;
}
export interface ExtensionDescriptorModel extends SceneRenderingModelBase<"ExtensionDescriptor"> {
  readonly extensionType: RegistryKey<"extensionPointTypes">;
  readonly sceneRef: string;
  readonly implementationProvided: false;
}
export interface ModelIdentityModel extends SceneRenderingModelBase<"ModelIdentity"> {
  readonly modelRef: string;
  readonly canonicalName: string;
}
export interface ModelMetadataModel extends SceneRenderingModelBase<"ModelMetadata"> {
  readonly modelRef: string;
  readonly fieldNames: readonly string[];
}
export interface ModelVersionModel extends SceneRenderingModelBase<"ModelVersion"> {
  readonly modelRef: string;
  readonly modelVersion: string;
}

export interface SceneRenderingModelDescriptor {
  readonly id: `EVE-2:3/Model/${string}`;
  readonly canonicalName: string;
  readonly registryReference: `EVE-2:2/${string}/${string}`;
  readonly categoryReference: `EVE-2:2/Category/${string}`;
  readonly ownershipReference: "EVE-2:1/SceneRenderingOwnership";
  readonly boundaryReference: "EVE-2:1/SceneRenderingBoundaries";
  readonly lifecycleApplicability: readonly string[];
  readonly capabilityApplicability: readonly string[];
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string | null;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

