export const ENABLE_MEANING_LAYER = true;

const MEANING_STORAGE_KEY = "nexora_psych_meaning";

export type MeaningSignal = {
  type: "identity" | "fear" | "control" | "exploration" | "neutral";
  weight: number;
};

export const NEUTRAL_MEANING_SIGNAL: MeaningSignal = {
  type: "neutral",
  weight: 0.3,
};

export function isMeaningLayerEnabled(): boolean {
  if (!ENABLE_MEANING_LAYER) return false;
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MEANING_STORAGE_KEY) !== "off";
}

export function enableMeaningLayer(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEANING_STORAGE_KEY, "on");
}

export function disableMeaningLayer(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEANING_STORAGE_KEY, "off");
}

export function interpretMeaning(input: string): MeaningSignal {
  const text = input.toLowerCase();

  if (text.includes("who am i") || text.includes("myself")) {
    return { type: "identity", weight: 0.9 };
  }

  if (text.includes("scared") || text.includes("fear")) {
    return { type: "fear", weight: 0.8 };
  }

  if (text.includes("control") || text.includes("must")) {
    return { type: "control", weight: 0.7 };
  }

  if (text.includes("why") || text.includes("how")) {
    return { type: "exploration", weight: 0.8 };
  }

  return { ...NEUTRAL_MEANING_SIGNAL };
}
