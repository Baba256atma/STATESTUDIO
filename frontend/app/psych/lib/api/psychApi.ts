import { apiBase } from "../../../lib/apiBase";

export type PsychInterpretResult = {
  emotion: string;
  intensity: number;
  secondary_emotion: string | null;
  focus: "self" | "others" | "environment";
  dominant_element: "fire" | "water" | "air" | "earth" | "ego" | "sun";
  confidence: number;
};

const DOMINANT_ELEMENTS = new Set(["fire", "water", "air", "earth", "ego", "sun"]);
const FOCUS_VALUES = new Set(["self", "others", "environment"]);

function clamp01(value: unknown, fallback: number): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(1, number));
}

export function normalizePsychState(raw: unknown): PsychInterpretResult {
  const value = typeof raw === "object" && raw != null ? raw as Record<string, unknown> : {};
  const dominant = typeof value.dominant_element === "string" && DOMINANT_ELEMENTS.has(value.dominant_element)
    ? value.dominant_element
    : "sun";
  const focus = typeof value.focus === "string" && FOCUS_VALUES.has(value.focus)
    ? value.focus
    : "self";

  return {
    emotion: typeof value.emotion === "string" && value.emotion.trim() ? value.emotion : "attention",
    intensity: clamp01(value.intensity, 0.4),
    secondary_emotion: typeof value.secondary_emotion === "string" && value.secondary_emotion.trim() ? value.secondary_emotion : null,
    focus: focus as PsychInterpretResult["focus"],
    dominant_element: dominant as PsychInterpretResult["dominant_element"],
    confidence: clamp01(value.confidence, 0.6),
  };
}

export async function interpretPsych(text: string, signal?: AbortSignal): Promise<PsychInterpretResult> {
  const response = await fetch(`${apiBase()}/psych/interpret`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });

  if (!response.ok) throw new Error(`Psych interpret failed: ${response.status}`);
  const raw = await response.json();
  return normalizePsychState(raw);
}
