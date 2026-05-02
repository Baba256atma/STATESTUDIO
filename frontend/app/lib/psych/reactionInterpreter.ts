import { PsychElementId, ReactionResult } from "./reactionTypes";

function mkEmptyEffects(): Record<PsychElementId, Partial<Record<string, unknown>>> {
  return {
    fire: {},
    water: {},
    air: {},
    earth: {},
    sun: {},
    ego: {},
  } as Record<PsychElementId, Partial<Record<string, unknown>>>;
}

export function interpretUserInput(text: string): ReactionResult {
  const t = (text || "").toLowerCase();
  const effects = mkEmptyEffects();
  const stateDelta: ReactionResult["stateDelta"] = {};
  let message: string | undefined;

  if (t.includes("stress") || t.includes("pressure")) {
    stateDelta.tension = 20;
    effects.fire = { activity: 0.2, brightness: 0.1 };
    message = "Tension detected — flame stirs.";
  } else if (t.includes("calm") || t.includes("peace")) {
    stateDelta.calm = 20;
    effects.water = { brightness: 0.2 };
    message = "Calmness encouraged — water glows.";
  } else if (t.includes("curious") || t.includes("why")) {
    stateDelta.curiosity = 15;
    effects.air = { activity: 0.2 };
    message = "Curiosity ripples — air quickens.";
  } else {
    // default small neutral energy increase
    stateDelta.energy = 5;
    message = "A subtle shift in energy.";
  }

  // Cast effects to correct type shape: Partial<ObjectState>
  const objectEffects = {
    fire: (effects.fire as any) || {},
    water: (effects.water as any) || {},
    air: (effects.air as any) || {},
    earth: (effects.earth as any) || {},
    sun: (effects.sun as any) || {},
    ego: (effects.ego as any) || {},
  } as Record<PsychElementId, Partial<any>>;

  return {
    stateDelta,
    objectEffects,
    message,
  } as ReactionResult;
}
