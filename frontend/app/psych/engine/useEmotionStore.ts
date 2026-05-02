import { DEFAULT_EMOTION_STATE, type EmotionState } from "./emotionState";
import { NEUTRAL_MEANING_SIGNAL, type MeaningSignal } from "./meaningInterpreter";
import { DEFAULT_PERSONALITY_PROFILE, type PersonalityProfile } from "./personalityProfile";

export type EmotionStoreState = EmotionState & {
  meaning: MeaningSignal;
  personality: PersonalityProfile;
  adaptivePersonalityEnabled: boolean;
  faceRevealUntil: number;
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
  },
};

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

export function useEmotionStore(): { current: EmotionStoreState } {
  return emotionStore;
}
