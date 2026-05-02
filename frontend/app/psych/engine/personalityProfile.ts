import type { EmotionState } from "./emotionState";
import type { MeaningSignal } from "./meaningInterpreter";

export const ENABLE_ADAPTIVE_PERSONALITY = true;

const PROFILE_STORAGE_KEY = "nexora_psych_profile_v1";
const ADAPTIVE_STORAGE_KEY = "nexora_psych_adaptive";
const MAX_PROFILE_SIZE_BYTES = 2048;

export type PersonalityProfile = {
  fearBias: number;
  calmBias: number;
  focusBias: number;
  curiosityBias: number;
  dominantMode: "stable" | "reactive" | "explorative";
  samples: number;
};

export const DEFAULT_PERSONALITY_PROFILE: PersonalityProfile = {
  fearBias: 0,
  calmBias: 0,
  focusBias: 0,
  curiosityBias: 0,
  dominantMode: "stable",
  samples: 0,
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalizeProfile(raw: Partial<PersonalityProfile>): PersonalityProfile {
  const fearBias = clamp01(Number(raw.fearBias) || 0);
  const calmBias = clamp01(Number(raw.calmBias) || 0);
  const focusBias = clamp01(Number(raw.focusBias) || 0);
  const curiosityBias = clamp01(Number(raw.curiosityBias) || 0);
  const dominantMode = raw.dominantMode === "reactive" || raw.dominantMode === "explorative" ? raw.dominantMode : "stable";
  const samples = Math.max(0, Math.min(9999, Math.floor(Number(raw.samples) || 0)));

  return { fearBias, calmBias, focusBias, curiosityBias, dominantMode, samples };
}

export function isAdaptivePersonalityEnabled(): boolean {
  if (!ENABLE_ADAPTIVE_PERSONALITY) return false;
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADAPTIVE_STORAGE_KEY) === "on";
}

export function enableAdaptivePersonality(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADAPTIVE_STORAGE_KEY, "on");
}

export function disableAdaptivePersonality(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADAPTIVE_STORAGE_KEY, "off");
}

export function resetAdaptivePersonality(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
}

export function loadPersonalityProfile(): PersonalityProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PERSONALITY_PROFILE };
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw || raw.length > MAX_PROFILE_SIZE_BYTES) return { ...DEFAULT_PERSONALITY_PROFILE };
    const parsed = JSON.parse(raw) as Partial<PersonalityProfile>;
    return normalizeProfile(parsed);
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return { ...DEFAULT_PERSONALITY_PROFILE };
  }
}

export function savePersonalityProfile(profile: PersonalityProfile): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = normalizeProfile(profile);
    const serialized = JSON.stringify(normalized);
    if (serialized.length > MAX_PROFILE_SIZE_BYTES) return;
    window.localStorage.setItem(PROFILE_STORAGE_KEY, serialized);
  } catch {
    // Best-effort only; adaptive personality must never break the scene.
  }
}

export function updatePersonalityProfile(profile: PersonalityProfile, emotion: EmotionState, meaning: MeaningSignal): PersonalityProfile {
  const rate = 0.05;
  const meaningFearBoost = meaning.type === "fear" ? meaning.weight * 0.15 : 0;
  const meaningFocusBoost = meaning.type === "identity" || meaning.type === "control" ? meaning.weight * 0.12 : 0;
  const meaningCuriosityBoost = meaning.type === "exploration" ? meaning.weight * 0.14 : 0;
  const fearBias = profile.fearBias + (clamp01(emotion.tension + meaningFearBoost) - profile.fearBias) * rate;
  const calmBias = profile.calmBias + (emotion.calm - profile.calmBias) * rate;
  const focusBias = profile.focusBias + (clamp01(emotion.focus + meaningFocusBoost) - profile.focusBias) * rate;
  const curiosityBias = profile.curiosityBias + (clamp01(emotion.curiosity + meaningCuriosityBoost) - profile.curiosityBias) * rate;

  return {
    fearBias,
    calmBias,
    focusBias,
    curiosityBias,
    dominantMode: curiosityBias > 0.6 ? "explorative" : fearBias > 0.6 ? "reactive" : "stable",
    samples: Math.min(9999, profile.samples + 1),
  };
}
