import { emotionStore } from "./useEmotionStore";
import type { EmotionStoreState } from "./useEmotionStore";
import { canSpeak, markSpeaking } from "./voiceCoordinator";
import { getMemoryFamiliarity, loadMemory } from "./memoryEngine";

export const INNER_DIALOGUE_ENABLED_DEFAULT = true;

const INNER_DIALOGUE_STORAGE_KEY = "nexora_psych_inner_dialogue";
const MIN_IDLE_MS = 5200;
const MIN_COOLDOWN_MS = 15000;
const EXACT_REPEAT_BLOCK_MS = 20000;
const SIMILARITY_DECAY_MS = 75000;
const MAX_VOICE_MEMORY = 5;
const SIMILARITY_THRESHOLD = 0.7;

export type InnerDialogueTone = "whisper" | "neutral" | "intense" | "inner";

export type InnerDialogueMessage = {
  text: string;
  tone: InnerDialogueTone;
  source: "ego";
};

type InnerDialogueTickInput = {
  now?: number;
  idleForMs?: number;
  lastUserInput?: string;
  emotionIntensity?: number;
};

export type VoiceTonePreference = "calm" | "analytical" | "poetic" | "direct";
export type DominantEmotionPattern = "fear" | "control" | "curiosity" | "identity";
export type InteractionStyle = "short" | "long" | "question-driven" | "statement-driven";

export type InnerVoiceProfile = {
  tonePreference: VoiceTonePreference;
  dominantEmotionPattern: DominantEmotionPattern;
  reflectionDepth: number;
  interactionStyle: InteractionStyle;
  sensitivityLevel: number;
  lastEmotionalStates: DominantEmotionPattern[];
  lastMeaningfulTopics: Array<EmotionStoreState["meaning"]["type"]>;
};

let lastSpeakTime = 0;
let cooldownMs = MIN_COOLDOWN_MS;
let lastTopic: EmotionStoreState["meaning"]["type"] | null = null;
let lastInputHash = "";
let recentVoiceMessages: Array<{ text: string; spokenAt: number }> = [];
let voiceProfile: InnerVoiceProfile = createDefaultVoiceProfile();

type WeightedVariant = {
  text: string;
  weight: number;
};

type DialogueIntent = "identity" | "fear" | "control" | "exploration" | "focus" | "curiosity" | "storedFear" | "neutral";

function createDefaultVoiceProfile(): InnerVoiceProfile {
  return {
    tonePreference: "calm",
    dominantEmotionPattern: "curiosity",
    reflectionDepth: 0.28,
    interactionStyle: "statement-driven",
    sensitivityLevel: 0.28,
    lastEmotionalStates: [],
    lastMeaningfulTopics: [],
  };
}

const VARIANTS_BY_INTENT: Record<DialogueIntent, WeightedVariant[]> = {
  identity: [
    { text: "You are not only what you observe.", weight: 1.2 },
    { text: "The one watching is also changing.", weight: 1 },
    { text: "You are larger than this reflection.", weight: 0.9 },
    { text: "There is more self beneath the surface.", weight: 0.9 },
    { text: "Do not confuse the mirror with the whole of you.", weight: 0.75 },
    { text: "Something in you is looking back.", weight: 0.8 },
    { text: "You are returning to the mirror.", weight: 0.7 },
    { text: "Something familiar is looking back.", weight: 0.62 },
  ],
  fear: [
    { text: "The shadow is asking to be seen.", weight: 1.1 },
    { text: "Stay near the shadow. It may be protecting something.", weight: 0.9 },
    { text: "Fear is tightening around a hidden center.", weight: 0.85 },
    { text: "Something guarded is moving under this feeling.", weight: 0.8 },
    { text: "Do not rush away from the dark shape.", weight: 0.75 },
    { text: "A protective part of you has stepped forward.", weight: 0.7 },
  ],
  control: [
    { text: "You are focusing too much on control.", weight: 1.1 },
    { text: "Control is tightening the field.", weight: 1 },
    { text: "The system is becoming rigid around certainty.", weight: 0.8 },
    { text: "Something wants structure before it can soften.", weight: 0.75 },
    { text: "Notice where control becomes pressure.", weight: 0.85 },
    { text: "The grip is speaking louder than the need.", weight: 0.7 },
  ],
  exploration: [
    { text: "Why do you resist this feeling?", weight: 1 },
    { text: "The question is still moving beneath the surface.", weight: 0.9 },
    { text: "A question is opening under this feeling.", weight: 1 },
    { text: "Follow the question without forcing an answer.", weight: 0.8 },
    { text: "Curiosity is circling the hidden center.", weight: 0.75 },
    { text: "Something wants to be understood slowly.", weight: 0.8 },
    { text: "The question leaves a trace.", weight: 0.64 },
  ],
  focus: [
    { text: "Your center is listening before it speaks.", weight: 1 },
    { text: "The center is quiet, but not empty.", weight: 0.9 },
    { text: "A still point is forming inside the noise.", weight: 0.85 },
    { text: "Hold the center without naming it too quickly.", weight: 0.75 },
    { text: "Something in the middle is becoming clearer.", weight: 0.8 },
  ],
  curiosity: [
    { text: "A question is opening under this feeling.", weight: 1 },
    { text: "Curiosity is moving through the field.", weight: 0.9 },
    { text: "The unknown is becoming magnetic.", weight: 0.75 },
    { text: "Let the question breathe before it becomes an answer.", weight: 0.8 },
    { text: "A new angle is trying to appear.", weight: 0.8 },
  ],
  storedFear: [
    { text: "Something tense is holding its shape in the dark.", weight: 1 },
    { text: "The old tension has not fully dissolved.", weight: 0.8 },
    { text: "A guarded pattern is still nearby.", weight: 0.8 },
    { text: "The field remembers where it contracted.", weight: 0.7 },
    { text: "There is a held breath under the surface.", weight: 0.75 },
  ],
  neutral: [
    { text: "Something is forming beneath the surface...", weight: 1 },
    { text: "A quiet shape is beginning to gather.", weight: 0.9 },
    { text: "The field is listening.", weight: 0.8 },
    { text: "Something subtle is arranging itself.", weight: 0.8 },
    { text: "Stay still. The image is not finished.", weight: 0.7 },
  ],
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function isInnerDialogueEnabled(): boolean {
  if (!INNER_DIALOGUE_ENABLED_DEFAULT) return false;
  if (typeof window === "undefined") return INNER_DIALOGUE_ENABLED_DEFAULT;
  return window.localStorage.getItem(INNER_DIALOGUE_STORAGE_KEY) !== "off";
}

export function enableInnerDialogue(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INNER_DIALOGUE_STORAGE_KEY, "on");
}

export function disableInnerDialogue(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INNER_DIALOGUE_STORAGE_KEY, "off");
}

export function resetInnerDialogueEngine(): void {
  lastSpeakTime = 0;
  cooldownMs = MIN_COOLDOWN_MS;
  lastTopic = null;
  lastInputHash = "";
  recentVoiceMessages = [];
  voiceProfile = createDefaultVoiceProfile();
}

function smoothValue(current: number, signal: number): number {
  return clamp(current * 0.8 + signal * 0.2, 0, 1);
}

function patternFromState(state: EmotionStoreState): DominantEmotionPattern {
  if (state.meaning.type === "fear" || state.tension > 0.62) return "fear";
  if (state.meaning.type === "control") return "control";
  if (state.meaning.type === "identity" || state.focus > 0.62) return "identity";
  return "curiosity";
}

function modeOfPatterns(patterns: DominantEmotionPattern[]): DominantEmotionPattern {
  const counts: Record<DominantEmotionPattern, number> = { fear: 0, control: 0, curiosity: 0, identity: 0 };
  for (const pattern of patterns) counts[pattern] += 1;
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as DominantEmotionPattern) ?? "curiosity";
}

function styleFromInput(text: string): InteractionStyle {
  const trimmed = text.trim();
  const isQuestion = trimmed.includes("?") || /\b(why|how|what|who|meaning)\b/i.test(trimmed);
  if (isQuestion) return "question-driven";
  if (trimmed.length < 36) return "short";
  if (trimmed.length > 120) return "long";
  return "statement-driven";
}

function toneFromSignals(text: string, state: EmotionStoreState, currentTone: VoiceTonePreference): VoiceTonePreference {
  const lower = text.toLowerCase();
  if (/\b(explain|logic|because|why|reason|analyze|analysis)\b/.test(lower)) return "analytical";
  if (/\b(dream|soul|shadow|symbol|meaning|deep|mirror)\b/.test(lower) || state.meaning.weight > 0.72) return "poetic";
  if (text.trim().length < 28 || /\b(reset|start over|stop|just|tell me)\b/.test(lower)) return "direct";
  if (state.calm > state.tension + 0.2) return "calm";
  return currentTone;
}

export function updateInnerVoiceProfileFromUserInput(text: string, state: EmotionStoreState = emotionStore.current): void {
  const lower = text.toLowerCase();
  if (/\b(reset|start over)\b/.test(lower)) {
    voiceProfile = createDefaultVoiceProfile();
    return;
  }

  const pattern = patternFromState(state);
  const lastEmotionalStates = [...voiceProfile.lastEmotionalStates, pattern].slice(-3);
  const lastMeaningfulTopics = [...voiceProfile.lastMeaningfulTopics, state.meaning.type].slice(-3);
  const questionSignal = /\b(who|why|meaning|myself|identity|how)\b/.test(lower) || text.includes("?");
  const depthSignal = clamp((questionSignal ? 0.78 : 0.28) + state.meaning.weight * 0.18 + (text.length > 100 ? 0.12 : 0), 0, 1);
  const sensitivitySignal = clamp(state.intensity * 0.65 + state.tension * 0.25 + (pattern === "fear" ? 0.18 : 0), 0, 1);

  voiceProfile = {
    tonePreference: toneFromSignals(text, state, voiceProfile.tonePreference),
    dominantEmotionPattern: modeOfPatterns(lastEmotionalStates),
    reflectionDepth: smoothValue(voiceProfile.reflectionDepth, depthSignal),
    interactionStyle: styleFromInput(text),
    sensitivityLevel: smoothValue(voiceProfile.sensitivityLevel, sensitivitySignal),
    lastEmotionalStates,
    lastMeaningfulTopics,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B12.7.3][ProfileUpdate]", {
      tone: voiceProfile.tonePreference,
      depth: Number(voiceProfile.reflectionDepth.toFixed(2)),
      emotionPattern: voiceProfile.dominantEmotionPattern,
    });
  }
}

function nextCooldown(state: EmotionStoreState): number {
  const intensity = clamp(state.intensity * 0.7 + state.meaning.weight * 0.3, 0, 1);
  const base = 12000 - intensity * 5000;
  const modeOffset = state.personality.dominantMode === "reactive" ? -800 : state.personality.dominantMode === "explorative" ? 900 : 0;
  return clamp(base + modeOffset, 6000, 12000);
}

function toneForState(state: EmotionStoreState): InnerDialogueTone {
  if (voiceProfile.sensitivityLevel > 0.66 && state.intensity < 0.82) return "whisper";
  if (state.meaning.type === "fear" || state.intensity > 0.72) return "intense";
  if (state.intensity < 0.42 && state.meaning.weight < 0.55) return "whisper";
  return "neutral";
}

function intentForState(state: EmotionStoreState): DialogueIntent {
  const mode = state.personality.dominantMode;
  const topic = state.meaning.type;
  const repeatedTopic = lastTopic === topic;

  if (topic === "identity") {
    return "identity";
  }

  if (topic === "fear") {
    return "fear";
  }

  if (topic === "control") {
    return "control";
  }

  if (topic === "exploration") {
    return repeatedTopic || mode === "explorative" ? "exploration" : "exploration";
  }

  if (state.personality.focusBias > 0.55) return "focus";
  if (state.personality.curiosityBias > 0.55) return "curiosity";
  if (state.personality.fearBias > 0.55) return "storedFear";
  return "neutral";
}

function normalizeForSimilarity(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function textSimilarity(a: string, b: string): number {
  const aTokens = new Set(normalizeForSimilarity(a));
  const bTokens = new Set(normalizeForSimilarity(b));
  if (aTokens.size === 0 || bTokens.size === 0) return a.trim().toLowerCase() === b.trim().toLowerCase() ? 1 : 0;
  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) intersection += 1;
  }
  const union = new Set([...aTokens, ...bTokens]).size;
  return union === 0 ? 0 : intersection / union;
}

function weightedPick(variants: WeightedVariant[]): string {
  const total = variants.reduce((sum, variant) => sum + variant.weight, 0);
  let cursor = Math.random() * total;
  for (const variant of variants) {
    cursor -= variant.weight;
    if (cursor <= 0) return variant.text;
  }
  return variants[variants.length - 1]?.text ?? "Something is forming beneath the surface...";
}

function adaptMessageForProfile(text: string): string {
  let adapted = text;
  const memory = loadMemory();

  if (voiceProfile.sensitivityLevel > 0.68) {
    adapted = adapted
      .replace(/^Do not /, "Gently, do not ")
      .replace(/^Stay /, "Stay gently ")
      .replace(/^Notice /, "Softly notice ");
    if (!/gently|softly|slowly/i.test(adapted) && voiceProfile.tonePreference !== "direct") {
      adapted = `Gently, ${adapted.charAt(0).toLowerCase()}${adapted.slice(1)}`;
    }
  }

  if (voiceProfile.tonePreference === "analytical") {
    adapted = adapted
      .replace("Something", "A pattern")
      .replace("The shadow", "The signal")
      .replace("beneath the surface", "under the current state");
  } else if (voiceProfile.tonePreference === "poetic") {
    adapted = adapted
      .replace("A pattern", "A hidden shape")
      .replace("the current state", "the dark water")
      .replace("The signal", "The shadow");
  } else if (voiceProfile.tonePreference === "direct") {
    adapted = adapted
      .replace("beneath the surface", "under this")
      .replace("is asking to be seen", "needs attention");
  }

  if (voiceProfile.interactionStyle === "short") {
    adapted = adapted.split(/[.;]/)[0].trim();
    if (!/[.!?]$/.test(adapted)) adapted += ".";
  }

  if (voiceProfile.reflectionDepth < 0.35) {
    adapted = adapted
      .replace("hidden center", "center")
      .replace("beneath the surface", "under this")
      .replace("Do not confuse the mirror with the whole of you.", "You are more than this moment.");
  } else if (voiceProfile.reflectionDepth > 0.68 && voiceProfile.interactionStyle !== "short") {
    adapted = adapted
      .replace("Stay still.", "Stay still for a moment.")
      .replace("The field is listening.", "The field is listening; something subtle is answering.");
  }

  const familiarity = getMemoryFamiliarity(memory);
  if (familiarity > 0.7) {
    adapted = adapted
      .replace("I'm not sure", "I think I'm starting to see")
      .replace("Something is forming", "Something familiar is forming")
      .replace("The field is listening.", "The field is listening in a familiar way.");
  } else if (familiarity > 0.3) {
    adapted = adapted
      .replace("I'm not sure", "I am beginning to sense")
      .replace("Something inside me", "Something in me");
  }

  const repeatedTopic = voiceProfile.lastMeaningfulTopics.length >= 2 && new Set(voiceProfile.lastMeaningfulTopics).size === 1;
  if (repeatedTopic && voiceProfile.reflectionDepth > 0.48 && !/returning|again/i.test(adapted)) {
    adapted = `You are returning to this shape again. ${adapted}`;
  }

  return adapted;
}

function pruneVoiceMemory(now: number): void {
  recentVoiceMessages = recentVoiceMessages
    .filter((entry) => now - entry.spokenAt < SIMILARITY_DECAY_MS)
    .slice(-MAX_VOICE_MEMORY);
}

function isBlockedRepeat(candidate: string, now: number): boolean {
  for (const entry of recentVoiceMessages) {
    const age = now - entry.spokenAt;
    const exactRepeat = entry.text === candidate && age < EXACT_REPEAT_BLOCK_MS;
    const similarRepeat = age < SIMILARITY_DECAY_MS && textSimilarity(candidate, entry.text) > SIMILARITY_THRESHOLD;
    if (exactRepeat || similarRepeat) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Sycho][B12.7.2][VoiceBlockedRepeat]", {
          candidate,
          previous: entry.text,
          ageMs: age,
          similarity: Number(textSimilarity(candidate, entry.text).toFixed(2)),
        });
      }
      return true;
    }
  }
  return false;
}

function messageForState(state: EmotionStoreState, now: number): string | null {
  pruneVoiceMemory(now);
  const intent = intentForState(state);
  const variants = VARIANTS_BY_INTENT[intent];
  const attempts = Math.max(8, variants.length + 3);

  for (let i = 0; i < attempts; i += 1) {
    const candidate = adaptMessageForProfile(weightedPick(variants));
    if (!isBlockedRepeat(candidate, now)) return candidate;
  }

  return null;
}

function rememberVoiceMessage(text: string, now: number): void {
  recentVoiceMessages = [...recentVoiceMessages, { text, spokenAt: now }].slice(-MAX_VOICE_MEMORY);
}

export function tickInnerDialogue({ now = Date.now(), idleForMs = 0, lastUserInput = "", emotionIntensity }: InnerDialogueTickInput): InnerDialogueMessage | null {
  if (!isInnerDialogueEnabled()) return null;

  const isFirstRun = lastSpeakTime === 0;
  if (isFirstRun) lastSpeakTime = now;
  if (isFirstRun && !lastUserInput.trim()) return null;

  if (idleForMs < MIN_IDLE_MS) return null;
  if (!isFirstRun && now - lastSpeakTime < cooldownMs) return null;

  const state = emotionStore.current;
  const inputHash = lastUserInput.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 50);
  if (inputHash && inputHash === lastInputHash) return null;

  const intensity = emotionIntensity ?? state.intensity;
  const isDeep = /who am i|myself|why|meaning/i.test(lastUserInput);
  const isEmotional = intensity > 0.6;
  if (!isDeep && !isEmotional && state.intensity <= 0.25 && state.meaning.weight <= 0.2) return null;

  const probability = isDeep ? 0.7 : isEmotional ? 0.4 : 0.15;
  if (Math.random() > probability) return null;

  const text = messageForState(state, now);
  if (!text) {
    lastSpeakTime = now;
    cooldownMs = MIN_COOLDOWN_MS;
    return null;
  }

  if (!canSpeak("ego", now)) return null;

  const message: InnerDialogueMessage = {
    text,
    tone: "inner",
    source: "ego",
  };

  lastSpeakTime = now;
  lastInputHash = inputHash;
  cooldownMs = Math.max(MIN_COOLDOWN_MS, nextCooldown(state));
  lastTopic = state.meaning.type;
  rememberVoiceMessage(message.text, now);
  markSpeaking("ego", now);

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B12.7][InnerDialogueTriggered]", {
      text: message.text,
      tone: message.tone,
      cooldownMs,
      idleForMs,
    });
  }

  return message;
}
