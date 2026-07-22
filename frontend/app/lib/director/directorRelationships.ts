export const DirectorModelRelationships = Object.freeze([
  ["ExecutiveScene", "ScenePlan", "scenePlanRef"],
  ["ExecutiveScene", "SceneObject", "sceneObjectRefs"],
  ["ExecutiveScene", "SceneLayer", "sceneLayerRefs"],
  ["ExecutiveScene", "CameraPlan", "cameraPlanRef"],
  ["ExecutiveScene", "TimelinePlan", "timelinePlanRef"],
  ["ExecutiveScene", "VisualizationPlan", "visualizationPlanRef"],
  ["ExecutiveScene", "ExecutiveFocus", "executiveFocusRef"],
  ["ExecutiveScene", "SceneMarker", "markerRefs"],
  ["ExecutiveScene", "TransitionPlan", "transitionPlanRefs"],
  ["TransitionPlan", "ExecutiveScene", "sourceSceneRef,destinationSceneRef"],
  ["AnimationPlan", "SceneObject", "targetSceneObjectRefs"],
].map(([sourceModel, targetModel, referenceField], index) => Object.freeze({
  relationshipId: `DIRECTOR-1:3/Relationship/${sourceModel}-${targetModel}`,
  sourceModel,
  targetModel,
  referenceField,
  deterministicOrder: index + 1,
  runtimeReference: false,
  metadataOnly: true,
  immutable: true,
})));

