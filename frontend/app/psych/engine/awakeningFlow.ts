import type { ObjectState, PsychElementId } from "../../lib/psych/reactionTypes";

export type AwakeningStage =
  | "not_started"
  | "ego_awake"
  | "sun_awake"
  | "water_awake"
  | "fire_awake"
  | "air_awake"
  | "earth_awake"
  | "free_mode";

export const AWAKENING_STORAGE_KEY = "sycho_seen_awakening";

const STAGE_ORDER: AwakeningStage[] = [
  "not_started",
  "ego_awake",
  "sun_awake",
  "water_awake",
  "fire_awake",
  "air_awake",
  "earth_awake",
  "free_mode",
];

const AWAKENING_BY_STAGE: Record<AwakeningStage, Partial<Record<PsychElementId, number>>> = {
  not_started: {},
  ego_awake: { ego: 1 },
  sun_awake: { ego: 1, sun: 1 },
  water_awake: { ego: 1, sun: 0.82, water: 1, earth: 0.36 },
  fire_awake: { ego: 1, sun: 0.86, water: 1, earth: 0.42, fire: 1 },
  air_awake: { ego: 1, sun: 0.9, water: 1, earth: 0.5, fire: 1, air: 1 },
  earth_awake: { ego: 1, sun: 1, water: 1, earth: 1, fire: 1, air: 1 },
  free_mode: { ego: 1, sun: 1, water: 1, earth: 1, fire: 1, air: 1 },
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function stageIndex(stage: AwakeningStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function getNextAwakeningStage(stage: AwakeningStage): AwakeningStage {
  const index = stageIndex(stage);
  if (index < 0 || index >= STAGE_ORDER.length - 1) return "free_mode";
  return STAGE_ORDER[index + 1];
}

export function hasSeenAwakening(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(AWAKENING_STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}

export function markAwakeningSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AWAKENING_STORAGE_KEY, "true");
  } catch {
    // The awakening flow is visual-only; storage failure should not matter.
  }
}

export function resetAwakeningSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AWAKENING_STORAGE_KEY);
  } catch {
    // Reset should remain best-effort.
  }
}

export function accelerateAwakeningForInput(input: string, stage: AwakeningStage): AwakeningStage {
  if (stage === "free_mode") return stage;
  const text = input.toLowerCase();
  let target: AwakeningStage | null = null;

  if (/\b(sad|sadness|lonely|heavy|tired|grief|down)\b/.test(text)) target = "water_awake";
  else if (/\b(angry|anger|stress|pressure|action|move)\b/.test(text)) target = "fire_awake";
  else if (/\b(why|how|curious|question|confused)\b/.test(text)) target = "air_awake";
  else if (/\b(ground|stable|real|step|body)\b/.test(text)) target = "earth_awake";
  else if (/\b(goal|direction|purpose|clarity|power|hope)\b/.test(text)) target = "sun_awake";
  else if (/\b(who am i|what am i|myself|identity|mirror)\b/.test(text)) target = "ego_awake";

  if (!target) return stage;
  return stageIndex(target) > stageIndex(stage) ? target : stage;
}

export function applyAwakeningToObjects(
  objects: Record<PsychElementId, ObjectState>,
  stage: AwakeningStage
): Record<PsychElementId, ObjectState> {
  if (stage === "free_mode") return objects;
  const awakeMap = AWAKENING_BY_STAGE[stage];
  const next = { ...objects };

  (Object.keys(objects) as PsychElementId[]).forEach((id) => {
    const awake = clamp01(awakeMap[id] ?? 0.16);
    const brightnessScale = 0.24 + awake * 0.76;
    const activityScale = 0.18 + awake * 0.82;
    next[id] = {
      ...objects[id],
      brightness: clamp01(objects[id].brightness * brightnessScale),
      activity: clamp01(objects[id].activity * activityScale),
    };
  });

  return next;
}
