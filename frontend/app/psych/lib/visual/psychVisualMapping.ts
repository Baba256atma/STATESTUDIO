import type { ObjectState, PsychElementId, PsychState } from "../../../lib/psych/reactionTypes";

export type PsychVisualProps = {
  glow: number;
  pulse: number;
  scale: number;
  rotation: number;
  colorShift: number;
};

type MapPsychToVisualInput = {
  psychState: PsychState;
  objects: Record<PsychElementId, ObjectState>;
  selectedId?: PsychElementId | null;
};

const OBJECT_IDS: PsychElementId[] = ["fire", "water", "air", "earth", "sun", "ego"];
const CINEMATIC_INTENSITY = 1.4;
const CINEMATIC_GLOW_BOOST = 1.2;
const CINEMATIC_PULSE_SPEED = 1.3;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function getDominantPsychState(psychState: PsychState): keyof PsychState {
  const entries = Object.entries(psychState) as Array<[keyof PsychState, number]>;
  return entries.reduce((best, next) => (next[1] > best[1] ? next : best))[0];
}

export function getStrongestVisualObject(visuals: Record<PsychElementId, PsychVisualProps>): PsychElementId {
  return OBJECT_IDS.reduce((best, id) => {
    const bestScore = visuals[best].glow + visuals[best].pulse * 0.35 + visuals[best].rotation * 0.2 + visuals[best].scale * 4;
    const score = visuals[id].glow + visuals[id].pulse * 0.35 + visuals[id].rotation * 0.2 + visuals[id].scale * 4;
    return score > bestScore ? id : best;
  }, "ego" as PsychElementId);
}

function getDominantElement(psychState: PsychState): PsychElementId {
  const dominantState = getDominantPsychState(psychState);
  if (dominantState === "tension") return "fire";
  if (dominantState === "calm") return "water";
  if (dominantState === "curiosity") return "air";
  if (dominantState === "energy") return "sun";
  return "ego";
}

export function mapPsychToVisual({ psychState, objects, selectedId }: MapPsychToVisualInput): Record<PsychElementId, PsychVisualProps> {
  const tension = clamp01(psychState.tension / 100);
  const calm = clamp01(psychState.calm / 100);
  const curiosity = clamp01(psychState.curiosity / 100);
  const energy = clamp01(psychState.energy / 100);

  const visual = {} as Record<PsychElementId, PsychVisualProps>;

  for (const id of OBJECT_IDS) {
    const object = objects[id];
    const brightness = object?.brightness ?? 0.2;
    const activity = object?.activity ?? 0.1;
    visual[id] = {
      glow: 0.1 + brightness * 1.2,
      pulse: 0.36 + activity * 1.0,
      scale: brightness * 0.05,
      rotation: 0.1 + activity * 1.0,
      colorShift: 0,
    };
  }

  visual.fire.glow += tension * 1.55;
  visual.fire.pulse += tension * 2.2;
  visual.fire.scale += tension * 0.1;
  visual.fire.rotation += tension * 0.5;
  visual.fire.colorShift += tension * 0.7;

  visual.ego.glow += tension * 0.68;
  visual.ego.pulse += tension * 0.42;
  visual.ego.scale += tension * 0.04;
  visual.ego.rotation += tension * 0.18;
  visual.ego.colorShift += tension * 0.85;

  visual.water.glow += calm * 1.2;
  visual.water.pulse = Math.max(0.24, visual.water.pulse - calm * 0.16);
  visual.water.scale += calm * 0.075;
  visual.water.rotation += calm * 0.2;
  visual.water.colorShift += calm * 0.35;

  visual.air.rotation += curiosity * 2.75;
  visual.air.pulse += curiosity * 0.9;
  visual.air.glow += curiosity * 0.85;
  visual.air.scale += curiosity * 0.045;

  visual.sun.glow += energy * 1.15;
  visual.sun.pulse += energy * 0.5;
  visual.sun.scale += energy * 0.08;

  const dominantElement = getDominantElement(psychState);
  for (const id of OBJECT_IDS) {
    if (id === dominantElement) {
      visual[id].glow += 0.3;
      visual[id].pulse += 0.25;
      visual[id].scale += 0.09;
      visual[id].rotation += 0.42;
    } else {
      visual[id].glow *= 0.9;
      visual[id].pulse *= 0.96;
    }
  }

  if (selectedId) {
    for (const id of OBJECT_IDS) {
      if (id === selectedId) {
        visual[id].glow += 0.75;
        visual[id].pulse += 0.55;
        visual[id].scale += 0.1;
        visual[id].rotation += 0.6;
      } else {
        visual[id].glow *= 0.82;
      }
    }
  }

  for (const id of OBJECT_IDS) {
    visual[id] = {
      glow: clamp(visual[id].glow * CINEMATIC_GLOW_BOOST, 0.08, 3),
      pulse: clamp(visual[id].pulse * CINEMATIC_PULSE_SPEED, 0.12, 3.6),
      scale: clamp(visual[id].scale * CINEMATIC_INTENSITY, 0, 0.26),
      rotation: clamp(visual[id].rotation * 1.14, 0.04, 3.8),
      colorShift: clamp01(visual[id].colorShift),
    };
  }

  return visual;
}
