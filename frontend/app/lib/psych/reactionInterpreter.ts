import { PsychElementId, ObjectState, ReactionResult } from "./reactionTypes";

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

  const objectEffects: Record<PsychElementId, Partial<ObjectState>> = {
    fire: effects.fire,
    water: effects.water,
    air: effects.air,
    earth: effects.earth,
    sun: effects.sun,
    ego: effects.ego,
  };

  return {
    stateDelta,
    objectEffects,
    message,
  };
}
