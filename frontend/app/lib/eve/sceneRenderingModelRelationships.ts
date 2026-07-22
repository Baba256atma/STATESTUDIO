import { SceneRenderingRegistry } from "./sceneRenderingRegistry.ts";

const seeds = Object.freeze([
  ["Scene", "SceneReference", "sceneReferenceRef"],
  ["Scene", "SceneHierarchy", "hierarchyRef"],
  ["Scene", "RenderContext", "renderContextRef"],
  ["RenderContext", "RenderPass", "renderPassRefs"],
  ["RenderPass", "RenderStage", "stageRef"],
  ["RenderStage", "RenderLayer", "layerRefs"],
  ["RenderLayer", "RenderSurface", "surfaceRef"],
  ["RenderSurface", "RenderTarget", "targetRef"],
  ["RenderTarget", "OutputDescriptor", "outputDescriptorRef"],
  ["Scene", "FrameDescriptor", "frameDescriptorRef"],
  ["Scene", "CompositionDescriptor", "compositionDescriptorRef"],
  ["RenderingProfile", "RenderingCapability", "capabilityRefs"],
  ["ExtensionDescriptor", "Scene", "sceneRef"],
] as const);

export const SceneRenderingModelRelationships = Object.freeze(
  seeds.map(([sourceModel, targetModel, referenceField], index) => Object.freeze({
    id: `EVE-2:3/Relationship/${sourceModel}-${targetModel}`,
    sourceModel,
    targetModel,
    referenceField,
    registryReference: SceneRenderingRegistry.metadata.id,
    deterministicOrder: index + 1,
    graphExecution: false,
    runtimeReference: false,
    metadataOnly: true,
    immutable: true,
  })),
);

