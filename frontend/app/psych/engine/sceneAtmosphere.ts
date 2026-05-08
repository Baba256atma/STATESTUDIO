import { getDominantElement, type ElementScores } from "./emotionElementMapping";
import type { EmotionStoreState } from "./useEmotionStore";
import { ENABLE_DEBUG_LOGS } from "../../lib/featureFlags";
import { psychLogger } from "./psychLogger";

export type AtmosphereState = {
  ambientIntensity: number;
  contrast: number;
  calmFactor: number;
  tensionFactor: number;
  warmth: number;
  brightness: number;
};

let lastAtmosphereLogAt = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function emotionInputFromStore(state: EmotionStoreState): { type?: string; intensity: number } {
  if (state.tension > 0.58 && state.tension >= state.calm && state.tension >= state.curiosity) {
    return { type: "anger", intensity: state.intensity };
  }
  if (state.calm > 0.58 && state.calm > state.tension) {
    return { type: "sadness", intensity: state.intensity };
  }
  if (state.curiosity > 0.58 && state.curiosity >= state.tension) {
    return { type: "exploration", intensity: state.intensity };
  }
  if (state.meaning.type === "control" || state.meaning.type === "fear" || state.meaning.type === "exploration" || state.meaning.type === "identity") {
    return { type: state.meaning.type, intensity: state.intensity };
  }
  return { type: "neutral", intensity: state.intensity };
}

export function buildAtmosphere(
  scores: ElementScores,
  emotion: { type?: string; intensity: number }
): AtmosphereState {
  const dominant = getDominantElement(scores);
  const intensity = clamp(emotion.intensity, 0, 1);

  const water = scores.water;
  const fire = scores.fire;
  const air = scores.air;
  const earth = scores.earth;
  const sun = scores.sun;

  const ambientIntensity = clamp(
    0.34 +
      fire * 0.18 +
      air * 0.12 +
      sun * 0.22 +
      earth * 0.04 -
      water * 0.08 +
      intensity * 0.08,
    0.2,
    0.9
  );
  const contrast = clamp(1 + fire * 0.08 + sun * 0.12 - earth * 0.06 - water * 0.05, 0.85, 1.15);
  const calmFactor = clamp(water * 0.78 + earth * 0.5 - fire * 0.22, 0, 1);
  const tensionFactor = clamp(fire * 0.86 + air * 0.34 + intensity * 0.12 - water * 0.2, 0, 1);
  const warmth = clamp(fire * 0.85 + sun * 0.65 - water * 0.7 - air * 0.05, -1, 1);
  const brightness = clamp(0.72 + sun * 0.26 + air * 0.18 + fire * 0.08 - water * 0.08 + intensity * 0.08, 0.6, 1.2);

  if (ENABLE_DEBUG_LOGS) {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastAtmosphereLogAt > 5000) {
      lastAtmosphereLogAt = now;
      psychLogger.trace("[B13.14][AtmosphereApplied]", {
        dominant,
        intensity: Number(intensity.toFixed(3)),
      });
    }
  }

  return {
    ambientIntensity,
    contrast,
    calmFactor,
    tensionFactor,
    warmth,
    brightness,
  };
}
