import { logThreeColorBrake } from "./threeColorDevLog.ts";

export const NEXORA_THREE_COLOR_TOKENS: Record<string, string> = {
  "var(--nx-risk)": "#ef4444",
  "var(--nx-success)": "#22c55e",
  "var(--nx-warning)": "#f59e0b",
  "var(--nx-accent)": "#60a5fa",
  "var(--nx-accent-ink)": "#93c5fd",
  "var(--nx-muted)": "#64748b",
};

export function sanitizeThreeColor(input: unknown, fallback = "#94a3b8"): string {
  if (typeof input !== "string") return fallback;

  const value = input.trim();
  if (!value) return fallback;

  if (NEXORA_THREE_COLOR_TOKENS[value]) {
    return NEXORA_THREE_COLOR_TOKENS[value];
  }

  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
    return value;
  }

  if (/^[a-zA-Z]+$/.test(value) && !value.startsWith("var")) {
    return value;
  }

  if (
    value.includes("var(") ||
    value.includes("color-mix(") ||
    value.includes("rgb(") ||
    value.includes("rgba(") ||
    value.includes("hsl(") ||
    value.includes("hsla(")
  ) {
    logThreeColorBrake(value);
    return fallback;
  }

  return fallback;
}
