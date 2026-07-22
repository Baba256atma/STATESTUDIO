import { VisualizationRegistry } from "./visualizationRegistry.ts";
import type { VisualizationModelDescriptor } from "./visualizationModelTypes.ts";

const registryId = VisualizationRegistry.metadata.id;
const seeds = Object.freeze([
  ["VisualObject", ["id", "visualObjectType", "sceneReferenceRef", "visualStateRef", "sourceReference"]],
  ["SceneReference", ["id", "sceneType", "directorSceneReference", "hierarchyRef"]],
  ["SceneNode", ["id", "parentNodeRef", "childNodeRefs", "visualObjectRefs"]],
  ["SceneHierarchy", ["id", "rootNodeRef", "nodeRefs", "layerRefs"]],
  ["Viewport", ["id", "viewportType", "cameraRef", "boundsMetadata"]],
  ["Camera", ["id", "cameraType", "targetReference", "projectionMetadata"]],
  ["Layer", ["id", "layerType", "order", "renderingSurfaceRef"]],
  ["RenderingTarget", ["id", "renderingTargetType", "viewportRef"]],
  ["RenderingSurface", ["id", "renderingSurfaceType", "renderingTargetRef", "contextRef"]],
  ["RenderingContext", ["id", "surfaceRef", "profileRef", "contextMetadata"]],
  ["VisualState", ["id", "visualStateType", "interactionStateRef", "runtimeState"]],
  ["InteractionState", ["id", "interactionStateType", "runtimeState"]],
  ["RenderingCapability", ["id", "capabilityType", "renderingProfileRef", "implementationProvided"]],
  ["RenderingProfile", ["id", "renderingMode", "capabilityRefs", "policyRefs"]],
  ["ExtensionPoint", ["id", "extensionPointType", "visualObjectRef", "implementationProvided"]],
  ["ModelIdentity", ["id", "modelRef", "canonicalName"]],
  ["ModelMetadata", ["id", "modelRef", "fields"]],
  ["ModelVersion", ["id", "modelRef", "modelVersion"]],
] as const);

export const VisualizationModelDescriptors: readonly VisualizationModelDescriptor[] =
  Object.freeze(seeds.map(([name, fields], index) => Object.freeze({
    id: `EVE-1:3/Model/${name}`,
    name,
    type: name,
    version: "1.0.0",
    namespace: `nexora.eve.model.${name.toLowerCase()}`,
    status: "Model",
    stability: "Stable",
    registryReference: registryId,
    fields: Object.freeze([...fields]),
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

