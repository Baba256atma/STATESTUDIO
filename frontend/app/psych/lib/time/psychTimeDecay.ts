import type { ObjectState, PsychElementId, PsychState } from "../../../lib/psych/reactionTypes";

type ApplyPsychDecayInput = {
  psychState: PsychState;
  objects: Record<PsychElementId, ObjectState>;
  deltaSeconds: number;
};

type ApplyPsychDecayResult = {
  psychState: PsychState;
  objects: Record<PsychElementId, ObjectState>;
};

const OBJECT_BASELINE: Record<PsychElementId, ObjectState> = {
  fire: { id: "fire", brightness: 0.2, activity: 0.2 },
  water: { id: "water", brightness: 0.2, activity: 0.1 },
  air: { id: "air", brightness: 0.2, activity: 0.1 },
  earth: { id: "earth", brightness: 0.2, activity: 0.05 },
  sun: { id: "sun", brightness: 0.2, activity: 0.1 },
  ego: { id: "ego", brightness: 0.2, activity: 0.1 },
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function approach(current: number, target: number, amount: number): number {
  return current + (target - current) * clamp(amount, 0, 1);
}

export function applyPsychDecay({ psychState, objects, deltaSeconds }: ApplyPsychDecayInput): ApplyPsychDecayResult {
  const objectDecay = 1 - Math.exp(-0.035 * deltaSeconds);
  const stateDecay = 1 - Math.exp(-0.018 * deltaSeconds);
  const calmDecay = 1 - Math.exp(-0.007 * deltaSeconds);

  const nextState: PsychState = {
    energy: clamp(approach(psychState.energy, 50, stateDecay), 0, 100),
    calm: clamp(approach(psychState.calm, 50, calmDecay), 0, 100),
    tension: clamp(approach(psychState.tension, 50, stateDecay), 0, 100),
    curiosity: clamp(approach(psychState.curiosity, 50, stateDecay), 0, 100),
  };

  const nextObjects = {} as Record<PsychElementId, ObjectState>;
  (Object.keys(objects) as PsychElementId[]).forEach((id) => {
    const baseline = OBJECT_BASELINE[id];
    const object = objects[id];
    nextObjects[id] = {
      id,
      brightness: clamp(approach(object.brightness, baseline.brightness, objectDecay), 0, 1),
      activity: clamp(approach(object.activity, baseline.activity, objectDecay), 0, 1),
    };
  });

  return { psychState: nextState, objects: nextObjects };
}
