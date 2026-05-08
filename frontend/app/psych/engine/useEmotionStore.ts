import { DEFAULT_EMOTION_STATE, type EmotionState } from "./emotionState";
import { NEUTRAL_MEANING_SIGNAL, type MeaningSignal } from "./meaningInterpreter";
import { DEFAULT_PERSONALITY_PROFILE, type PersonalityProfile } from "./personalityProfile";
import type { SceneReactionSignal } from "./sceneReactionMapping";

export type SceneReactionState = SceneReactionSignal & {
  pulseUntil: number;
  startedAt: number;
};

export type EyeContactTriggerState = {
  active: boolean;
  intensity: number;
  timestamp: number;
};

export type EmotionStoreState = EmotionState & {
  meaning: MeaningSignal;
  personality: PersonalityProfile;
  adaptivePersonalityEnabled: boolean;
  faceRevealUntil: number;
  egoSpeakPulseUntil: number;
  sceneReaction: SceneReactionState | null;
  eyeContactTrigger: EyeContactTriggerState;
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export const emotionStore: { current: EmotionStoreState } = {
  current: {
    ...DEFAULT_EMOTION_STATE,
    meaning: { ...NEUTRAL_MEANING_SIGNAL },
    personality: { ...DEFAULT_PERSONALITY_PROFILE },
    adaptivePersonalityEnabled: false,
    faceRevealUntil: 0,
    egoSpeakPulseUntil: 0,
    sceneReaction: null,
    eyeContactTrigger: {
      active: false,
      intensity: 0,
      timestamp: 0,
    },
  },
};

let lastSceneReactionAt = 0;

export function setEmotionState(
  nextEmotion: EmotionState,
  meaning: MeaningSignal = NEUTRAL_MEANING_SIGNAL,
  personality: PersonalityProfile = emotionStore.current.personality,
  adaptivePersonalityEnabled = emotionStore.current.adaptivePersonalityEnabled
): void {
  emotionStore.current = {
    intensity: clamp01(nextEmotion.intensity),
    tension: clamp01(nextEmotion.tension),
    calm: clamp01(nextEmotion.calm),
    focus: clamp01(nextEmotion.focus),
    curiosity: clamp01(nextEmotion.curiosity),
    meaning: {
      type: meaning.type,
      weight: clamp01(meaning.weight),
    },
    personality,
    adaptivePersonalityEnabled,
    faceRevealUntil: emotionStore.current.faceRevealUntil,
    egoSpeakPulseUntil: emotionStore.current.egoSpeakPulseUntil,
    sceneReaction: emotionStore.current.sceneReaction,
    eyeContactTrigger: emotionStore.current.eyeContactTrigger,
  };
}

export function setPersonalityProfile(personality: PersonalityProfile, adaptivePersonalityEnabled = emotionStore.current.adaptivePersonalityEnabled): void {
  emotionStore.current = {
    ...emotionStore.current,
    personality,
    adaptivePersonalityEnabled,
  };
}

export function revealEgoFaceDebug(durationMs = 5000): void {
  emotionStore.current = {
    ...emotionStore.current,
    faceRevealUntil: performance.now() + durationMs,
  };
}

export function triggerEgoSpeakPulse(durationMs = 1100): void {
  emotionStore.current = {
    ...emotionStore.current,
    egoSpeakPulseUntil: performance.now() + durationMs,
  };
}

export function triggerEyeContact(intensity: number): void {
  emotionStore.current = {
    ...emotionStore.current,
    eyeContactTrigger: {
      active: true,
      intensity: clamp01(intensity),
      timestamp: Date.now(),
    },
  };
}

export function triggerSceneReaction(reaction: SceneReactionSignal, durationMs = 1700): boolean {
  const now = performance.now();
  if (now - lastSceneReactionAt < 1100 && reaction.intensity < 0.72) return false;
  lastSceneReactionAt = now;
  emotionStore.current = {
    ...emotionStore.current,
    sceneReaction: {
      ...reaction,
      startedAt: now,
      pulseUntil: now + durationMs,
    },
  };
  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B12.8][SceneReaction]", {
      source: reaction.source === "innerVoice" ? "innerVoice" : "chat",
      meaningType: reaction.meaningType,
      affectedObjects: reaction.affectedObjects,
    });
  }
  return true;
}

export function useEmotionStore(): { current: EmotionStoreState } {
  return emotionStore;
}
