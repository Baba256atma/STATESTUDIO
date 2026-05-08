import type { EmotionStoreState } from "./useEmotionStore";
import { mapEmotionToElements, type ElementScoreId } from "./emotionElementMapping";
import { ENABLE_DEBUG_LOGS } from "../../lib/featureFlags";
import { psychLogger } from "./psychLogger";

let lastVisualIntensityLogAt = 0;

export function mapScoreToVisual(score: number): {
  glow: number;
  scale: number;
  opacity: number;
  motion: number;
} {
  const clamped = Math.max(0, Math.min(1, score));
  return {
    glow: 0.2 + clamped * 0.8,
    scale: 1 + clamped * 0.15,
    opacity: 0.4 + clamped * 0.6,
    motion: clamped * 0.02,
  };
}

function visualEmotionType(state: EmotionStoreState): string {
  if (state.tension > 0.58 && state.tension >= state.calm && state.tension >= state.curiosity) return "anger";
  if (state.curiosity > 0.58 && state.curiosity >= state.tension) return "exploration";
  if (state.calm > 0.58 && state.calm > state.tension) return "sadness";
  if (state.meaning.type === "control" || state.meaning.type === "fear" || state.meaning.type === "exploration" || state.meaning.type === "identity") return state.meaning.type;
  return "neutral";
}

export function getElementVisualScore(element: ElementScoreId, state: EmotionStoreState): number {
  const scores = mapEmotionToElements({
    type: visualEmotionType(state),
    intensity: state.intensity,
  });
  return scores[element];
}

export function logVisualIntensity(element: ElementScoreId, score: number, lastLogAt: { current: number }): void {
  if (!ENABLE_DEBUG_LOGS) return;
  const now = performance.now();
  if (now - lastVisualIntensityLogAt < 5000) return;
  lastVisualIntensityLogAt = now;
  lastLogAt.current = now;
  psychLogger.trace("[B13.13][VisualIntensityApplied]", {
    element,
    score: Number(score.toFixed(3)),
  });
}
