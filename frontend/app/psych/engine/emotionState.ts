export type EmotionState = {
  intensity: number;
  tension: number;
  calm: number;
  focus: number;
  curiosity: number;
};

export const DEFAULT_EMOTION_STATE: EmotionState = {
  intensity: 0.2,
  tension: 0.2,
  calm: 0.3,
  focus: 0.4,
  curiosity: 0.3,
};

export function mapChatToEmotion(input: string): EmotionState {
  const text = input.toLowerCase();

  return {
    intensity: text.length > 20 ? 0.7 : 0.3,
    tension: text.includes("angry") || text.includes("stress") ? 0.8 : 0.2,
    calm: text.includes("calm") || text.includes("peace") ? 0.7 : 0.3,
    focus: text.includes("why") || text.includes("how") ? 0.8 : 0.4,
    curiosity: text.includes("?") ? 0.7 : 0.3,
  };
}
