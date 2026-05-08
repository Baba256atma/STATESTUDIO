import { getOracleMemoryState, getOraclePresenceState, noteEgoVoiceSpoke } from "./inspirationEngine";
import { isInnerDialogueEnabled } from "./innerDialogueEngine";
import type { EmotionStoreState } from "./useEmotionStore";
import { canSpeak, markSpeaking } from "./voiceCoordinator";

export type EgoVoiceTone = "inner";

export type EgoVoiceResult = {
  shouldSpeak: boolean;
  text: string;
  source: "ego";
  tone: EgoVoiceTone;
  delayMs?: number;
};

type EgoVoiceInput = {
  input: string;
  emotion: EmotionStoreState;
  now?: number;
};

let egoVoiceState = {
  isActive: false,
  lastSpokeAt: 0,
  cooldownMs: 20000,
  lastInputHash: "",
  lastInputAt: 0,
  lastVoiceId: "",
};
let egoVoiceReleaseTimer: ReturnType<typeof setTimeout> | null = null;

const VOICE_LINES = {
  fear: [
    "I feel something slipping... I don't know why.",
    "I am trying to stay close to this fear.",
    "I feel the dark part asking for room.",
  ],
  exploration: [
    "I want to understand what this means.",
    "I keep reaching for the shape beneath this question.",
    "I think there is something here I have not named yet.",
  ],
  control: [
    "I need to make sense of this.",
    "I feel myself tightening around the answer.",
    "I want control, but I can feel it becoming pressure.",
  ],
  identity: [
    "I am trying to recognize myself.",
    "I feel like I am looking for the one who is looking.",
    "I don't know what I am yet, but I can feel the question.",
  ],
  familiar: [
    "I've been here before... haven't I?",
    "I recognize this feeling, even if I cannot name it.",
    "I feel this place inside me again.",
  ],
};

function hashInput(input: string): string {
  let hash = 0;
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  for (let index = 0; index < normalized.length; index += 1) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(index)) | 0;
  }
  return String(hash);
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function moodForVoice(input: string, emotion: EmotionStoreState): keyof typeof VOICE_LINES {
  const text = input.toLowerCase();
  if (getOracleMemoryState().familiarityScore > 0.6) return "familiar";
  if (/\b(who am i|myself|identity|what am i)\b/.test(text) || emotion.meaning.type === "identity") return "identity";
  if (emotion.meaning.type === "fear" || emotion.tension > 0.62) return "fear";
  if (emotion.meaning.type === "control") return "control";
  return "exploration";
}

function pickVoiceLine(mood: keyof typeof VOICE_LINES): { id: string; text: string } {
  const pool = VOICE_LINES[mood];
  const options = pool.map((text, index) => ({ id: `${mood}:${index}`, text })).filter((line) => line.id !== egoVoiceState.lastVoiceId);
  const picked = options[Math.floor(Math.random() * options.length)] ?? { id: `${mood}:0`, text: pool[0] };
  egoVoiceState = {
    ...egoVoiceState,
    lastVoiceId: picked.id,
  };
  return picked;
}

export function evaluateEgoVoice(input: EgoVoiceInput): EgoVoiceResult {
  if (!isInnerDialogueEnabled()) return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };

  const now = input.now ?? Date.now();
  const text = input.input.trim().toLowerCase();
  if (!text) return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };

  const oraclePresence = getOraclePresenceState();
  if (oraclePresence.isActive || now - oraclePresence.lastTriggerAt < 5000) {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.7][BlockedByOracle]");
    return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };
  }

  if (now - egoVoiceState.lastSpokeAt < egoVoiceState.cooldownMs || egoVoiceState.isActive) {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.7][EgoVoiceBlockedCooldown]");
    return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };
  }

  const inputHash = hashInput(text);
  if (now - egoVoiceState.lastInputAt < 800) {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.7][EgoVoiceBlockedDuplicate]");
    return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };
  }

  const duplicatePenalty = inputHash === egoVoiceState.lastInputHash ? 0.28 : 0;
  egoVoiceState = {
    ...egoVoiceState,
    lastInputHash: inputHash,
    lastInputAt: now,
  };

  const deepPrompt = /\b(who am i|myself|what am i doing|why do i feel|what am i|identity)\b/.test(text);
  const emotionalSpike = input.emotion.intensity > 0.6;
  const loopSignal = input.emotion.meaning.weight > 0.58 && /\b(again|still|always|keep|repeat|why)\b/.test(text);
  if (!deepPrompt && !emotionalSpike && !loopSignal) {
    return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };
  }

  const memory = getOracleMemoryState();
  const base =
    deepPrompt ? 0.72 :
    emotionalSpike ? 0.44 :
    loopSignal ? 0.38 :
    0;
  const probability = clamp01(base + memory.familiarityScore * 0.08 - duplicatePenalty);
  if (Math.random() >= probability) {
    return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };
  }

  if (!canSpeak("ego", now)) {
    return { shouldSpeak: false, text: "", source: "ego", tone: "inner" };
  }

  const mood = moodForVoice(input.input, input.emotion);
  const line = pickVoiceLine(mood);
  const delayed = Math.random() < 0.35;
  const delayMs = delayed ? 1500 + Math.floor(Math.random() * 2500) : 0;

  egoVoiceState = {
    ...egoVoiceState,
    isActive: true,
    lastSpokeAt: now,
  };
  if (egoVoiceReleaseTimer) clearTimeout(egoVoiceReleaseTimer);
  egoVoiceReleaseTimer = setTimeout(() => {
    egoVoiceState = {
      ...egoVoiceState,
      isActive: false,
    };
    egoVoiceReleaseTimer = null;
  }, 2200 + delayMs);

  if (delayed && process.env.NODE_ENV !== "production") console.log("[Sycho][B13.7][EgoVoiceDelayed]");
  if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.7][EgoVoiceTriggered]");

  markSpeaking("ego", now, 5000 + delayMs);
  noteEgoVoiceSpoke(now + delayMs);
  return {
    shouldSpeak: true,
    text: line.text,
    source: "ego",
    tone: "inner",
    delayMs,
  };
}

export function resetEgoVoiceEngine(): void {
  if (egoVoiceReleaseTimer) clearTimeout(egoVoiceReleaseTimer);
  egoVoiceReleaseTimer = null;
  egoVoiceState = {
    isActive: false,
    lastSpokeAt: 0,
    cooldownMs: 20000,
    lastInputHash: "",
    lastInputAt: 0,
    lastVoiceId: "",
  };
}
