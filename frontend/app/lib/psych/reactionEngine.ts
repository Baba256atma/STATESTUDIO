import { PsychState, ObjectState, PsychElementId, ReactionResult } from "./reactionTypes";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function applyReaction(
  currentState: PsychState,
  currentObjects: Record<PsychElementId, ObjectState>,
  reaction: ReactionResult
): { nextState: PsychState; nextObjects: Record<PsychElementId, ObjectState> } {
  // Merge state
  const nextState: PsychState = {
    energy: clamp(currentState.energy + (reaction.stateDelta.energy ?? 0), 0, 100),
    calm: clamp(currentState.calm + (reaction.stateDelta.calm ?? 0), 0, 100),
    tension: clamp(currentState.tension + (reaction.stateDelta.tension ?? 0), 0, 100),
    curiosity: clamp(currentState.curiosity + (reaction.stateDelta.curiosity ?? 0), 0, 100),
  };

  // Apply object effects
  const nextObjects: Record<PsychElementId, ObjectState> = { ...currentObjects };
  (Object.keys(currentObjects) as PsychElementId[]).forEach((key) => {
    const cur = currentObjects[key];
    const eff = reaction.objectEffects?.[key] ?? {};
    const brightness = clamp(cur.brightness + (eff.brightness ?? 0), 0, 1);
    const activity = clamp(cur.activity + (eff.activity ?? 0), 0, 1);
    nextObjects[key] = { ...cur, brightness, activity };
  });

  return { nextState, nextObjects };
}
