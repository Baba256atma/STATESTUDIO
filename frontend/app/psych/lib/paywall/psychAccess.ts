import type { ObjectState, PsychElementId } from "../../../lib/psych/reactionTypes";

export type AccessMode = "free" | "pro_preview";

const FREE_VISUAL_CAP = 0.52;

function capObject(object: ObjectState): ObjectState {
  return {
    ...object,
    brightness: Math.min(object.brightness, FREE_VISUAL_CAP),
    activity: Math.min(object.activity, FREE_VISUAL_CAP),
  };
}

export function capPsychObjectsForAccess(objects: Record<PsychElementId, ObjectState>, accessMode: AccessMode): Record<PsychElementId, ObjectState> {
  if (accessMode === "pro_preview") return objects;

  return {
    fire: capObject(objects.fire),
    water: capObject(objects.water),
    air: capObject(objects.air),
    earth: capObject(objects.earth),
    sun: capObject(objects.sun),
    ego: capObject(objects.ego),
  };
}

export function canShowDeeperInsight(accessMode: AccessMode): boolean {
  return accessMode === "pro_preview";
}
