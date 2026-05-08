import { getMemoryScores, type SychoMemory } from "./memoryEngine";
import { ENABLE_DEBUG_LOGS } from "../../lib/featureFlags";

export type ElementScores = {
  fire: number;
  water: number;
  air: number;
  earth: number;
  sun: number;
};

export type ElementScoreId = keyof ElementScores;

const ELEMENT_IDS: ElementScoreId[] = ["fire", "water", "air", "earth", "sun"];
let lastLoggedDominant: ElementScoreId | null = null;
let lastMemoryBiasDominant: ElementScoreId | null = null;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalizeScores(scores: ElementScores): ElementScores {
  const max = Math.max(...ELEMENT_IDS.map((id) => scores[id]));
  const scale = max > 1 ? 1 / max : 1;
  return {
    fire: clamp01(scores.fire * scale),
    water: clamp01(scores.water * scale),
    air: clamp01(scores.air * scale),
    earth: clamp01(scores.earth * scale),
    sun: clamp01(scores.sun * scale),
  };
}

export function suppressOpposingElements(scores: ElementScores): ElementScores {
  const next: ElementScores = { ...scores };
  const dominant = getDominantElement(scores);

  if (dominant === "water") {
    next.fire = Math.max(0, next.fire * 0.35);
    next.sun = Math.max(0, next.sun * 0.52);
  }
  if (dominant === "fire") {
    next.water = Math.max(0, next.water * 0.62);
  }
  if (dominant === "earth") {
    next.fire *= 0.82;
    next.air *= 0.82;
    next.sun *= 0.9;
    next.water = Math.max(next.water * 0.9, Math.min(next.water, 0.22));
  }

  return normalizeScores(next);
}

export function mapEmotionToElements(
  emotion: {
    type?: string;
    intensity: number;
  },
  archetype?: string | null
): ElementScores {
  const scores: ElementScores = {
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
    sun: 0,
  };

  switch (emotion.type) {
    case "sadness":
    case "sad":
    case "lonely":
    case "heavy":
    case "tired":
      scores.water += 0.65;
      scores.earth += 0.35;
      scores.fire -= 0.25;
      scores.sun -= 0.15;
      break;
    case "fear":
    case "scared":
      scores.water += 0.45;
      scores.earth += 0.25;
      scores.air += 0.12;
      break;
    case "anger":
    case "action":
    case "pressure":
      scores.fire += 0.6;
      scores.earth += 0.25;
      break;
    case "exploration":
    case "curiosity":
      scores.air += 0.55;
      scores.sun += 0.26;
      scores.earth += 0.16;
      break;
    case "control":
      scores.earth += 0.6;
      break;
    case "calm":
    case "peace":
      scores.water += 0.6;
      scores.earth += 0.3;
      break;
    case "goal":
    case "direction":
    case "purpose":
      scores.sun += 0.45;
      scores.air += 0.35;
      scores.earth += 0.25;
      break;
    case "confidence":
    case "clarity":
      scores.sun += 0.6;
      break;
    case "identity":
      scores.sun += 0.42;
      scores.air += 0.32;
      break;
    default:
      scores.sun += 0.3;
  }

  const boost = clamp01(emotion.intensity) * 0.4;
  ELEMENT_IDS.forEach((id) => {
    scores[id] += boost * 0.2;
  });

  if (archetype === "warrior") scores.fire += 0.2;
  if (archetype === "healer") scores.water += 0.2;
  if (archetype === "thinker") scores.air += 0.2;
  if (archetype === "builder") scores.earth += 0.2;
  if (archetype === "leader") scores.sun += 0.2;

  const normalized = suppressOpposingElements(normalizeScores(scores));
  if (ENABLE_DEBUG_LOGS) {
    const dominant = getDominantElement(normalized);
    if (dominant !== lastLoggedDominant) {
      lastLoggedDominant = dominant;
      console.log("[Sycho][B13.11][ElementScores]", { scores: normalized });
      console.log("[Sycho][v1-FIX][EmotionCalibrated]", { type: emotion.type, dominant, scores: normalized });
    }
  }
  return normalized;
}

export function getDominantElement(scores: ElementScores): ElementScoreId {
  return ELEMENT_IDS.reduce((best, id) => (scores[id] > scores[best] ? id : best), "sun");
}

export function applyMemoryBias(scores: ElementScores, memory: SychoMemory): ElementScores {
  const biased: ElementScores = { ...scores };
  const moodEMA = getMemoryScores(memory);
  ELEMENT_IDS.forEach((element) => {
    const bias = (moodEMA[element] - 0.2) * 0.2;
    biased[element] = clamp01(biased[element] + bias);
  });
  const normalized = suppressOpposingElements(normalizeScores(biased));
  if (ENABLE_DEBUG_LOGS) {
    const dominant = getDominantElement(normalized);
    if (dominant !== lastMemoryBiasDominant) {
      lastMemoryBiasDominant = dominant;
      console.log("[Sycho][B13.15][MemoryBiasApplied]");
    }
  }
  return normalized;
}
