import type { EmotionStoreState } from "./useEmotionStore";
import type { PsychElementId } from "../../lib/psych/reactionTypes";

export type SceneReactionSource = "chat" | "innerVoice";
export type SceneReactionMeaning = "fear" | "calm" | "identity" | "exploration" | "control" | "tension" | "stability" | "neutral";

export type SceneReactionSignal = {
  source: SceneReactionSource;
  meaningType: SceneReactionMeaning;
  intensity: number;
  affectedObjects: PsychElementId[];
  motion: number;
  glow: number;
  particles: number;
  orbitScale: number;
};

type MapSceneReactionInput = {
  source: SceneReactionSource;
  text: string;
  emotion: EmotionStoreState;
  userInput?: string | null;
};

const ALL_OBJECTS: PsychElementId[] = ["fire", "water", "air", "earth", "sun", "ego"];

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function getMeaningType(text: string, emotion: EmotionStoreState, userInput?: string | null): SceneReactionMeaning {
  const merged = `${text} ${userInput ?? ""}`.toLowerCase();
  if (/\b(fear|scared|afraid|shadow|dark|anxious|anxiety)\b/.test(merged) || emotion.meaning.type === "fear") return "fear";
  if (/\b(calm|peace|soft|safe|steady|breathe|gentle)\b/.test(merged) || emotion.calm > 0.62) return "calm";
  if (/\b(identity|self|myself|who|mirror|ego|center|observe)\b/.test(merged) || emotion.meaning.type === "identity") return "identity";
  if (/\b(why|how|question|curious|unknown|explore|understand)\b/.test(merged) || emotion.meaning.type === "exploration") return "exploration";
  if (/\b(control|must|rigid|grip|structure|pressure)\b/.test(merged) || emotion.meaning.type === "control") return "control";
  if (/\b(stress|tension|fire|drive|anger|angry)\b/.test(merged) || emotion.tension > 0.64) return "tension";
  if (/\b(ground|earth|stable|stability|settle)\b/.test(merged)) return "stability";
  return "neutral";
}

function affectedObjectsForMeaning(meaningType: SceneReactionMeaning): PsychElementId[] {
  if (meaningType === "fear") return ["ego", "fire", "air"];
  if (meaningType === "calm") return ["water", "earth", "ego"];
  if (meaningType === "identity") return ["ego", "sun"];
  if (meaningType === "exploration") return ["air", "sun", "ego"];
  if (meaningType === "control") return ["earth", "ego"];
  if (meaningType === "tension") return ["fire", "ego"];
  if (meaningType === "stability") return ["earth", "water"];
  return ALL_OBJECTS;
}

export function mapWordsToSceneReaction({ source, text, emotion, userInput }: MapSceneReactionInput): SceneReactionSignal {
  const meaningType = getMeaningType(text, emotion, userInput);
  const sourceWeight = source === "innerVoice" ? 0.18 : 0.12;
  const intensity = clamp01(emotion.intensity * 0.5 + emotion.meaning.weight * 0.32 + sourceWeight);

  if (meaningType === "fear") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: -0.18, glow: -0.08, particles: -0.08, orbitScale: -0.04 };
  }
  if (meaningType === "calm") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: -0.08, glow: 0.16, particles: 0.04, orbitScale: 0 };
  }
  if (meaningType === "identity") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: -0.04, glow: 0.22, particles: -0.04, orbitScale: -0.01 };
  }
  if (meaningType === "exploration") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: 0.22, glow: 0.08, particles: 0.22, orbitScale: 0.04 };
  }
  if (meaningType === "control") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: -0.22, glow: -0.02, particles: -0.1, orbitScale: -0.03 };
  }
  if (meaningType === "tension") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: 0.14, glow: 0.18, particles: 0.08, orbitScale: 0 };
  }
  if (meaningType === "stability") {
    return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: -0.16, glow: 0.08, particles: -0.06, orbitScale: -0.01 };
  }
  return { source, meaningType, intensity, affectedObjects: affectedObjectsForMeaning(meaningType), motion: 0.04, glow: 0.06, particles: 0.04, orbitScale: 0 };
}
