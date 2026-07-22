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

export const DirectorCameraModels = Object.freeze([
  model("CameraPlan", "DIRECTOR-1:2/CameraFocusType", ["id", "focusType", "focusTargetRef", "targetRef", "zoomLevel", "orientation", "transitionRef"], 5),
  model("CameraTarget", "DIRECTOR-1:2/CameraTargetType", ["id", "targetType", "targetRefs"], 6),
] as const);

