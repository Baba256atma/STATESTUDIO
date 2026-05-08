import type { EmotionStoreState } from "./useEmotionStore";
import { canSpeak, markSpeaking, resetVoiceCoordinator } from "./voiceCoordinator";
import { getMemoryFamiliarity, getMemoryScores, loadMemory } from "./memoryEngine";

export const ENABLE_INSPIRATION_ENGINE = true;

export type InspirationMode = "whisper" | "burst" | "silent";

export type InspirationResult = {
  shouldAppear: boolean;
  mode: InspirationMode;
  message: string;
  intensity: number;
  source?: "whisper" | "oracle";
  delayMs?: number;
};

export type InspirationSignal = InspirationResult & {
  id: number;
  startedAt: number;
  pulseUntil: number;
};

type InspirationInput = {
  userInput?: string | null;
  emotion: EmotionStoreState;
  idleTime: number;
  isTyping?: boolean;
  countTheme?: boolean;
  now?: number;
};

const MIN_GAP_MS = 24000;
const WINDOW_MS = 60000;
const MAX_PER_WINDOW = 2;
const IDLE_TRIGGER_MS = 21000;
const ORACLE_MESSAGE = "The oracle arrives when the question is ready.";
const ORACLE_RELEASE_MS = 5000;
const ORACLE_MESSAGES = [
  "You are the question that keeps returning.",
  "The path appears when you stop forcing it.",
  "The mirror opens only when the gaze softens.",
  "Something answers by becoming visible.",
  "The oracle arrives when the question is ready.",
];
const ORACLE_FAMILIAR_MESSAGES = [
  "You've been here before... haven't you?",
  "The mirror recognizes the shape of this question.",
  "This feeling has a familiar doorway.",
  "You are closer to the question than before.",
];

type OracleMood = "fear" | "exploration" | "control" | "identity" | "neutral";

type OracleMemory = {
  lastMood: OracleMood | null;
  moodTrend: Record<OracleMood, number>;
  interactionCount: number;
  lastInteractionAt: number;
  familiarityScore: number;
};

const ORACLE_MEMORY_KEY = "sycho_oracle_memory";
const DEFAULT_ORACLE_MEMORY: OracleMemory = {
  lastMood: null,
  moodTrend: {
    fear: 0,
    exploration: 0,
    control: 0,
    identity: 0,
    neutral: 0,
  },
  interactionCount: 0,
  lastInteractionAt: 0,
  familiarityScore: 0,
};

const MESSAGES = [
  "The question is not asking for an answer. It is asking for attention.",
  "Something in you is trying to become visible.",
  "Do not chase the fire. Listen to what it protects.",
  "The mirror answers slowly.",
  "A quiet signal is forming under the noise.",
  "What repeats may be asking to be witnessed.",
];

let lastInspirationAt = 0;
let inspirationTimes: number[] = [];
let usedMessages = new Set<string>();
let themeCounts: Record<string, number> = {};
let signalId = 0;
let oracleReleaseTimer: ReturnType<typeof setTimeout> | null = null;
let lastOracleInputAt = 0;
let oracleInviteCount = 0;
let oracleMutedUntil = 0;
let oracleMemoryLoaded = false;
let oracleMemory: OracleMemory = { ...DEFAULT_ORACLE_MEMORY, moodTrend: { ...DEFAULT_ORACLE_MEMORY.moodTrend } };
let oracleState = {
  isActive: false,
  lastTriggerAt: 0,
  cooldownMs: 15000,
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeOracleMemory(raw: Partial<OracleMemory> | null | undefined): OracleMemory {
  const trend = (raw?.moodTrend ?? {}) as Partial<Record<OracleMood, number>>;
  return {
    lastMood: raw?.lastMood === "fear" || raw?.lastMood === "exploration" || raw?.lastMood === "control" || raw?.lastMood === "identity" || raw?.lastMood === "neutral" ? raw.lastMood : null,
    moodTrend: {
      fear: Math.max(0, Number(trend.fear) || 0),
      exploration: Math.max(0, Number(trend.exploration) || 0),
      control: Math.max(0, Number(trend.control) || 0),
      identity: Math.max(0, Number(trend.identity) || 0),
      neutral: Math.max(0, Number(trend.neutral) || 0),
    },
    interactionCount: Math.max(0, Math.floor(Number(raw?.interactionCount) || 0)),
    lastInteractionAt: Math.max(0, Number(raw?.lastInteractionAt) || 0),
    familiarityScore: clamp01(Number(raw?.familiarityScore) || 0),
  };
}

function loadOracleMemory(): OracleMemory {
  if (oracleMemoryLoaded) return oracleMemory;
  oracleMemoryLoaded = true;
  if (!canUseStorage()) return oracleMemory;

  try {
    const raw = window.localStorage.getItem(ORACLE_MEMORY_KEY);
    oracleMemory = raw ? normalizeOracleMemory(JSON.parse(raw) as Partial<OracleMemory>) : normalizeOracleMemory(null);
  } catch {
    oracleMemory = normalizeOracleMemory(null);
  }
  return oracleMemory;
}

function saveOracleMemory(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(ORACLE_MEMORY_KEY, JSON.stringify({
      moodTrend: oracleMemory.moodTrend,
      interactionCount: oracleMemory.interactionCount,
      lastMood: oracleMemory.lastMood,
      lastInteractionAt: oracleMemory.lastInteractionAt,
      familiarityScore: oracleMemory.familiarityScore,
    }));
  } catch {
    // Oracle memory is optional; storage failures should not disturb the scene.
  }
}

function moodFromEmotion(emotion: EmotionStoreState): OracleMood {
  if (emotion.meaning.type === "fear") return "fear";
  if (emotion.meaning.type === "control") return "control";
  if (emotion.meaning.type === "exploration") return "exploration";
  if (emotion.meaning.type === "identity") return "identity";
  if (emotion.curiosity > 0.58) return "exploration";
  if (emotion.tension > 0.62) return "fear";
  return "neutral";
}

function dominantOracleMood(memory: OracleMemory = loadOracleMemory()): OracleMood {
  let dominant: OracleMood = "neutral";
  let value = memory.moodTrend.neutral;
  if (memory.moodTrend.fear > value) {
    dominant = "fear";
    value = memory.moodTrend.fear;
  }
  if (memory.moodTrend.exploration > value) {
    dominant = "exploration";
    value = memory.moodTrend.exploration;
  }
  if (memory.moodTrend.control > value) {
    dominant = "control";
    value = memory.moodTrend.control;
  }
  if (memory.moodTrend.identity > value) {
    dominant = "identity";
  }
  return dominant;
}

export function getOracleMemoryState(): {
  dominantMood: OracleMood;
  familiarityScore: number;
  moodTrend: Readonly<Record<OracleMood, number>>;
} {
  const memory = loadOracleMemory();
  return {
    dominantMood: dominantOracleMood(memory),
    familiarityScore: memory.familiarityScore,
    moodTrend: memory.moodTrend,
  };
}

function updateOracleMemory(emotion: EmotionStoreState, now: number): OracleMemory {
  const current = loadOracleMemory();
  const mood = moodFromEmotion(emotion);
  const nextTrend = { ...current.moodTrend };
  (Object.keys(nextTrend) as OracleMood[]).forEach((key) => {
    nextTrend[key] *= 0.98;
  });
  nextTrend[mood] += 1;

  oracleMemory = normalizeOracleMemory({
    lastMood: mood,
    moodTrend: nextTrend,
    interactionCount: current.interactionCount + 1,
    lastInteractionAt: now,
    familiarityScore: Math.min(1, (current.interactionCount + 1) / 50),
  });
  saveOracleMemory();

  if (process.env.NODE_ENV !== "production") {
    const dominantMood = dominantOracleMood(oracleMemory);
    console.log("[Sycho][B13.5][MoodMemoryUpdated]", {
      mood,
      interactionCount: oracleMemory.interactionCount,
    });
    console.log("[Sycho][B13.5][DominantMood]", dominantMood);
    console.log("[Sycho][B13.5][FamiliarityScore]", Number(oracleMemory.familiarityScore.toFixed(3)));
  }

  return oracleMemory;
}

function themeForInput(input: string): string {
  const text = input.toLowerCase();
  if (/\b(lost|confused|don't know|dont know|unclear)\b/.test(text)) return "confusion";
  if (/\b(who am i|identity|myself|mirror|face)\b/.test(text)) return "identity";
  if (/\b(why|meaning|dream|how)\b/.test(text)) return "question";
  if (/\b(angry|stress|pressure|fire)\b/.test(text)) return "fire";
  if (/\b(calm|peace|water|soft)\b/.test(text)) return "calm";
  return "neutral";
}

function pickMessage(theme: string): string {
  const preferred =
    theme === "confusion" ? [
      "A quiet signal is forming under the noise.",
      "The mirror answers slowly.",
    ] :
    theme === "identity" ? [
      "Something in you is trying to become visible.",
      "The mirror answers slowly.",
    ] :
    theme === "fire" ? [
      "Do not chase the fire. Listen to what it protects.",
      "What repeats may be asking to be witnessed.",
    ] :
    theme === "question" ? [
      "The question is not asking for an answer. It is asking for attention.",
      "What repeats may be asking to be witnessed.",
    ] :
    MESSAGES;

  const pool = [...preferred, ...MESSAGES].filter((message, index, arr) => arr.indexOf(message) === index);
  return pool.find((message) => !usedMessages.has(message)) ?? "";
}

function blockCooldown(now: number): boolean {
  inspirationTimes = inspirationTimes.filter((time) => now - time < WINDOW_MS);
  if (now - lastInspirationAt < MIN_GAP_MS || inspirationTimes.length >= MAX_PER_WINDOW) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13][InspirationBlockedCooldown]");
    }
    return true;
  }
  return false;
}

function isOracleTrigger(text: string): boolean {
  return text.trim().includes("oracle");
}

function isDeepOracleQuestion(text: string): boolean {
  return /\b(who am i|what am i|why do i feel|why am i|meaning|dream|identity|mirror)\b/.test(text);
}

function oracleMessage(memory: OracleMemory = loadOracleMemory()): string {
  const dominantMood = dominantOracleMood(memory);
  const familiar = memory.familiarityScore > 0.6;
  const pool =
    familiar ? [...ORACLE_FAMILIAR_MESSAGES, ...ORACLE_MESSAGES] :
    dominantMood === "control" ? [
      "The path appears when you stop forcing it.",
      "The mirror opens only when the gaze softens.",
      ...ORACLE_MESSAGES,
    ] :
    dominantMood === "fear" ? [
      "Something answers by becoming visible.",
      "The oracle arrives when the question is ready.",
      ...ORACLE_MESSAGES,
    ] :
    ORACLE_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)] ?? ORACLE_MESSAGE;
}

function blockOracle(now: number): boolean {
  if (now < oracleMutedUntil) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.3][OracleBlockedCooldown]");
    }
    return true;
  }
  if (oracleState.isActive) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.3][OracleBlockedActive]");
    }
    return true;
  }
  if (now - oracleState.lastTriggerAt < oracleState.cooldownMs) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.3][OracleBlockedCooldown]");
    }
    return true;
  }
  return false;
}

export function getOraclePresenceState(): { isActive: boolean; lastTriggerAt: number } {
  return {
    isActive: oracleState.isActive,
    lastTriggerAt: oracleState.lastTriggerAt,
  };
}

export function noteEgoVoiceSpoke(now = Date.now()): void {
  oracleMutedUntil = Math.max(oracleMutedUntil, now + 3000);
}

function activateOracle(now: number, delayMs = 0): void {
  oracleState = {
    ...oracleState,
    isActive: true,
    lastTriggerAt: now,
  };
  if (oracleReleaseTimer) clearTimeout(oracleReleaseTimer);
  oracleReleaseTimer = setTimeout(() => {
    oracleState = {
      ...oracleState,
      isActive: false,
    };
    oracleReleaseTimer = null;
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.3][OracleReleased]");
    }
  }, ORACLE_RELEASE_MS + delayMs);
}

type OracleDecision = {
  result: "respond" | "ignore" | "delayed";
  probability: number;
  reason: string;
  mode: InspirationMode;
  message: string;
  intensity: number;
  delayMs?: number;
};

function shouldOracleRespond(text: string, input: InspirationInput, now: number): OracleDecision | null {
  const directSummon = isOracleTrigger(text);
  const deepQuestion = isDeepOracleQuestion(text);
  if (!directSummon && !deepQuestion) return null;
  const memory = loadOracleMemory();
  const sychoMemory = loadMemory();
  const sychoScores = getMemoryScores(sychoMemory);
  const sychoFamiliarity = getMemoryFamiliarity(sychoMemory);
  const dominantMood = dominantOracleMood(memory);

  if (directSummon && now - lastOracleInputAt < 2000) oracleInviteCount += 1;
  else if (directSummon) oracleInviteCount = 1;
  lastOracleInputAt = directSummon ? now : lastOracleInputAt;

  const oracleWordCount = (text.match(/oracle/g) ?? []).length;
  const repetitionScore = Math.max(0, oracleInviteCount - 1) + Math.max(0, oracleWordCount - 1);
  const meaning = input.emotion.meaning;
  const baseProbability = deepQuestion ? 0.86 : 0.56;
  const emotionalBoost = input.emotion.intensity * 0.08 + meaning.weight * 0.08;
  const meaningBias = meaning.type === "exploration" ? 0.08 : meaning.type === "identity" ? 0.06 : meaning.type === "control" ? -0.16 : meaning.type === "fear" ? -0.04 : 0;
  const moodBias = dominantMood === "exploration" ? 0.2 : dominantMood === "fear" ? -0.15 : dominantMood === "control" ? -0.08 : dominantMood === "identity" ? 0.08 : 0;
  const familiarityBias = memory.familiarityScore > 0.6 ? 0.1 : memory.familiarityScore * 0.06;
  const sychoFamiliarityBias = sychoFamiliarity * 0.05;
  const sychoMoodBias = sychoScores.air > 0.28 ? 0.06 : sychoScores.water > 0.3 ? -0.05 : 0;
  const repetitionPenalty = Math.min(0.42, repetitionScore * 0.16);
  const probability = Math.max(0.1, Math.min(0.9, baseProbability + emotionalBoost + meaningBias + moodBias + familiarityBias + sychoFamiliarityBias + sychoMoodBias - repetitionPenalty));
  const roll = Math.random();
  const reason = deepQuestion ? "deep_question" : directSummon ? "direct_summon" : "none";

  if (roll >= probability) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.4][OracleDecision]", {
        probability: Number(probability.toFixed(3)),
        result: "ignore",
        reason,
        dominantMood,
      });
    }
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.4][OracleIgnored]");
    return {
      result: "ignore",
      probability,
      reason,
      mode: "silent",
      message: "",
      intensity: 0,
    };
  }

  const silentRoll = Math.random();
  const silenceProbability = dominantMood === "fear" ? 0.34 : memory.familiarityScore > 0.6 ? 0.12 : 0.2;
  const mode: InspirationMode = silentRoll < silenceProbability ? "silent" : probability > 0.82 || meaning.type === "identity" ? "burst" : "whisper";
  const delayProbability = Math.max(0.16, Math.min(0.72, (dominantMood === "control" ? 0.62 : dominantMood === "fear" ? 0.52 : deepQuestion ? 0.32 : 0.42) + (sychoScores.water > 0.3 ? 0.08 : 0) - sychoFamiliarity * 0.08));
  const delayed = Math.random() < delayProbability;
  const delayMs = delayed ? Math.max(900, 2000 + Math.floor(Math.random() * (dominantMood === "control" ? 4000 : 3000)) - Math.floor(sychoFamiliarity * 700)) : 0;
  const intensityBase = dominantMood === "fear" ? 0.5 : meaning.type === "fear" ? 0.58 : dominantMood === "control" ? 0.58 : meaning.type === "control" ? 0.62 : dominantMood === "exploration" ? 0.96 : meaning.type === "exploration" ? 0.9 : 0.78;
  const intensity = clamp01(intensityBase + input.emotion.intensity * 0.16 + (mode === "burst" ? 0.08 : 0));

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B13.4][OracleDecision]", {
      probability: Number(probability.toFixed(3)),
      result: delayed ? "delayed" : "respond",
      reason,
      dominantMood,
    });
  }
  if (delayed && process.env.NODE_ENV !== "production") console.log("[Sycho][B13.4][OracleDelayed]");
  if (process.env.NODE_ENV !== "production") console.log("[Sycho][B13.4][OracleResponded]");

  return {
    result: delayed ? "delayed" : "respond",
    probability,
    reason,
    mode,
    message: mode === "silent" ? "" : oracleMessage(memory),
    intensity,
    delayMs,
  };
}

export function evaluateInspiration(input: InspirationInput): InspirationResult {
  if (!ENABLE_INSPIRATION_ENGINE) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };
  if (input.isTyping) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };

  const now = input.now ?? Date.now();
  const text = (input.userInput ?? "").toLowerCase();
  if (input.countTheme && text.trim()) {
    updateOracleMemory(input.emotion, now);
  } else {
    loadOracleMemory();
  }
  const oracleDecision = shouldOracleRespond(text, input, now);
  if (oracleDecision) {
    if (oracleDecision.result === "ignore") return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };
    if (blockOracle(now)) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };
    if (!canSpeak("oracle", now)) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };
    activateOracle(now, oracleDecision.delayMs ?? 0);
    markSpeaking("oracle", now, ORACLE_RELEASE_MS + (oracleDecision.delayMs ?? 0));
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B13.3][OracleTriggered]");
    }
    return {
      shouldAppear: true,
      mode: oracleDecision.mode,
      message: oracleDecision.message,
      intensity: oracleDecision.intensity,
      source: "oracle",
      delayMs: oracleDecision.delayMs,
    };
  }

  const theme = themeForInput(text);
  const hasConfusion = /\b(lost|confused|don't know|dont know|i do not know|unclear)\b/.test(text);
  const hasDeepQuestion = /\b(why|who am i|meaning|dream|myself|identity|mirror)\b/.test(text);
  const idleTrigger = input.idleTime >= IDLE_TRIGGER_MS && (input.emotion.intensity > 0.28 || input.emotion.meaning.weight > 0.24);

  if (input.countTheme && text.trim()) {
    themeCounts[theme] = (themeCounts[theme] ?? 0) + 1;
  }
  const repeatedTheme = theme !== "neutral" && (themeCounts[theme] ?? 0) >= 3;

  if (!hasConfusion && !hasDeepQuestion && !idleTrigger && !repeatedTheme) {
    return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };
  }
  if (blockCooldown(now)) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };

  const message = pickMessage(theme);
  if (!message) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };
  if (!canSpeak("whisper", now)) return { shouldAppear: false, mode: "silent", message: "", intensity: 0 };

  usedMessages.add(message);
  lastInspirationAt = now;
  inspirationTimes.push(now);

  const intensity = clamp01(
    0.42 +
      input.emotion.intensity * 0.24 +
      input.emotion.meaning.weight * 0.22 +
      (hasConfusion ? 0.12 : 0) +
      (repeatedTheme ? 0.1 : 0)
  );
  const mode: InspirationMode = intensity > 0.72 || repeatedTheme ? "burst" : "whisper";

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B13][InspirationTriggered]", {
      mode,
      theme,
      intensity: Number(intensity.toFixed(3)),
    });
  }

  markSpeaking("whisper", now);
  return { shouldAppear: true, mode, message, intensity, source: "whisper" };
}

export function createInspirationSignal(result: InspirationResult, now = Date.now()): InspirationSignal {
  signalId += 1;
  return {
    ...result,
    id: signalId,
    startedAt: now,
    pulseUntil: now + (result.mode === "burst" ? 5200 : 4400),
  };
}

export function resetInspirationEngine(): void {
  lastInspirationAt = 0;
  inspirationTimes = [];
  usedMessages = new Set<string>();
  themeCounts = {};
  signalId = 0;
  if (oracleReleaseTimer) clearTimeout(oracleReleaseTimer);
  oracleReleaseTimer = null;
  lastOracleInputAt = 0;
  oracleInviteCount = 0;
  oracleMutedUntil = 0;
  oracleState = {
    isActive: false,
    lastTriggerAt: 0,
    cooldownMs: 15000,
  };
  resetVoiceCoordinator();
  oracleMemory = { ...DEFAULT_ORACLE_MEMORY, moodTrend: { ...DEFAULT_ORACLE_MEMORY.moodTrend } };
  oracleMemoryLoaded = true;
  if (canUseStorage()) {
    try {
      window.localStorage.removeItem(ORACLE_MEMORY_KEY);
    } catch {
      // Ignore optional memory cleanup failures.
    }
  }
}
