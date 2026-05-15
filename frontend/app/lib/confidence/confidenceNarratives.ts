import type { ConfidenceLevel } from "./decisionConfidenceTypes.ts";

function clean(value: string | undefined): string {
  return String(value ?? "").trim() || "this recommendation";
}

export function confidenceLevelFromScore(score: number): ConfidenceLevel {
  const safe = Math.min(1, Math.max(0, Number.isFinite(score) ? score : 0));
  if (safe >= 0.88) return "very_high";
  if (safe >= 0.68) return "high";
  if (safe >= 0.42) return "moderate";
  return "low";
}

export function buildConfidenceRationale(params: {
  level: ConfidenceLevel;
  focus?: string;
  supportingSignalCount?: number;
  uncertaintyCount?: number;
}): string {
  const focus = clean(params.focus);
  const support = params.supportingSignalCount ?? 0;
  const uncertainty = params.uncertaintyCount ?? 0;
  if (params.level === "very_high") {
    return `Confidence is very high because ${focus} is supported by stable, repeated operational evidence.`;
  }
  if (params.level === "high") {
    return `Confidence remains high because ${focus} is supported by consistent operational signals.`;
  }
  if (params.level === "moderate") {
    return `Confidence is moderate because ${focus} has useful support, but ${uncertainty || support < 2 ? "some uncertainty remains" : "evidence is still developing"}.`;
  }
  return `Confidence is limited because ${focus} lacks enough stable evidence for stronger executive certainty.`;
}

export function summarizeConfidence(params: {
  level: ConfidenceLevel;
  score: number;
  uncertaintyFactors?: string[];
}): string {
  const uncertainty = params.uncertaintyFactors?.[0];
  if (uncertainty) return `${params.level.replace("_", " ")} confidence with uncertainty: ${uncertainty}`;
  return `${params.level.replace("_", " ")} confidence based on current deterministic evidence.`;
}
