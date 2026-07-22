import type { DirectorModelDefinition } from "./directorModelTypes.ts";

const define = (
  type: string,
  registryReference: string,
  fields: readonly string[],
  deterministicOrder: number,
): DirectorModelDefinition => Object.freeze({
  id: `DIRECTOR-1:3/Model/${type}`,
  type,
  version: "1.0.0",
  namespace: `nexora.director.model.${type.toLowerCase()}`,
  status: "Model",
  stability: "Stable",
  registryReference,
  fields: Object.freeze([...fields]),
  deterministicOrder,
  metadataOnly: true,
  immutable: true,
});

export const DirectorSceneModels = Object.freeze([
  define("ExecutiveScene", "DIRECTOR-1:2/SceneType", ["id", "sceneType", "title", "description", "scenePlanRef", "visualizationPlanRef", "timelinePlanRef", "cameraPlanRef", "sceneLayerRefs", "sceneObjectRefs", "executiveFocusRef", "markerRefs", "transitionPlanRefs"], 1),
  define("ScenePlan", "DIRECTOR-1:2/ScenePlan", ["id", "orderedSteps", "focusTargetRefs", "cameraSequenceRefs", "timelineRefs", "transitionRefs", "visualizationPriorities"], 2),
  define("SceneObject", "DIRECTOR-1:2/SceneObjectType", ["id", "objectType", "sourceReference", "layerRef"], 3),
  define("SceneLayer", "DIRECTOR-1:2/SceneLayerType", ["id", "layerType", "order", "sceneObjectRefs"], 4),
] as const);

