import { VisualizationRegistry } from "./visualizationRegistry.ts";

const relationships = Object.freeze([
  ["VisualObject", "SceneReference", "sceneReferenceRef"],
  ["SceneReference", "SceneHierarchy", "hierarchyRef"],
  ["SceneHierarchy", "Layer", "layerRefs"],
  ["Layer", "RenderingSurface", "renderingSurfaceRef"],
  ["RenderingSurface", "RenderingTarget", "renderingTargetRef"],
  ["RenderingTarget", "Viewport", "viewportRef"],
  ["Viewport", "Camera", "cameraRef"],
  ["VisualObject", "VisualState", "visualStateRef"],
  ["VisualState", "InteractionState", "interactionStateRef"],
  ["RenderingCapability", "RenderingProfile", "renderingProfileRef"],
  ["ExtensionPoint", "VisualObject", "visualObjectRef"],
] as const);

export const VisualizationModelRelationships = Object.freeze(
  relationships.map(([sourceModel, targetModel, referenceField], index) =>
    Object.freeze({
      id: `EVE-1:3/Relationship/${sourceModel}-${targetModel}`,
      sourceModel,
      targetModel,
      referenceField,
      registryReference: VisualizationRegistry.metadata.id,
      deterministicOrder: index + 1,
      runtimeReference: false,
      metadataOnly: true,
      immutable: true,
    })),
);

