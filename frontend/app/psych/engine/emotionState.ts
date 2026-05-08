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
  const hasSadness = /\b(sad|sadness|lonely|alone|heavy|tired|exhausted|grief|down)\b/.test(text);
  const hasCalm = /\b(calm|peace|peaceful|soft|steady|safe)\b/.test(text);
  const hasGoal = /\b(goal|direction|purpose|path|aim|mission)\b/.test(text);
  const hasFear = /\b(fear|scared|afraid|anxious|anxiety)\b/.test(text);
  const hasAnger = /\b(angry|anger|stress|pressure|mad|rage|frustrated)\b/.test(text);
  const hasQuestion = /\b(why|how|what)\b/.test(text) || text.includes("?");

  return {
    intensity: hasAnger || hasFear || hasSadness || hasGoal || text.length > 20 ? 0.7 : 0.3,
    tension: hasAnger ? 0.8 : hasFear ? 0.48 : hasSadness ? 0.24 : 0.2,
    calm: hasCalm ? 0.72 : hasSadness ? 0.68 : 0.3,
    focus: hasGoal ? 0.72 : hasQuestion ? 0.8 : hasSadness ? 0.34 : 0.4,
    curiosity: hasGoal ? 0.62 : hasQuestion ? 0.7 : 0.3,
  };
}
