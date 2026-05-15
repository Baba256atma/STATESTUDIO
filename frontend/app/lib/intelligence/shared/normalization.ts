export type NormalizedSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type NormalizedConfidenceLevel =
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export function clamp01(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(numeric) ? numeric : 0)) * 100) / 100;
}

export function clamp100(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Math.round(Math.min(100, Math.max(0, Number.isFinite(numeric) ? numeric : 0)));
}

export function normalizeSeverity(value: unknown): NormalizedSeverity {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "critical") return "critical";
  if (text === "high" || text === "urgent") return "high";
  if (text === "medium" || text === "moderate" || text === "attention" || text === "watch") return "medium";
  return "low";
}

export function severityRank(value: unknown): number {
  const severity = normalizeSeverity(value);
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

export function confidenceLevelFromScore(score: unknown): NormalizedConfidenceLevel {
  const value = clamp01(score);
  if (value >= 0.86) return "very_high";
  if (value >= 0.68) return "high";
  if (value >= 0.42) return "moderate";
  return "low";
}

export function uniqueStrings(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

export function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
