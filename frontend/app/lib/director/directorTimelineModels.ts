import type { DirectorModelDefinition } from "./directorModelTypes.ts";

const model = (
  type: string,
  registryReference: string,
  fields: readonly string[],
  deterministicOrder: number,
): DirectorModelDefinition => Object.freeze({
  id: `DIRECTOR-1:3/Model/${type}`, type, version: "1.0.0",
  namespace: `nexora.director.model.${type.toLowerCase()}`,
  status: "Model", stability: "Stable", registryReference,
  fields: Object.freeze([...fields]), deterministicOrder,
  metadataOnly: true, immutable: true,
});

export const DirectorTimelineModels = Object.freeze([
  model("TimelinePlan", "DIRECTOR-1:2/TimelineType", ["id", "timelineType", "scale", "startReference", "endReference", "playbackMode", "snapshotReference"], 9),
  model("TransitionPlan", "DIRECTOR-1:2/TransitionType", ["id", "transitionType", "sourceSceneRef", "destinationSceneRef", "durationMetadata", "triggerMetadata"], 10),
  model("AnimationPlan", "DIRECTOR-1:2/AnimationInstructionType", ["id", "animationType", "targetSceneObjectRefs", "sequenceOrder", "emphasisMetadata"], 11),
  model("SceneMarker", "DIRECTOR-1:2/SceneMarkerType", ["id", "markerType", "sceneRef", "annotation", "sequenceOrder"], 12),
] as const);

