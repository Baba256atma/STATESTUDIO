/**
 * B.29 — Deterministic pilot review / improvement loop (no AI, no backend).
 * B.36 — Domain-aware wording via mapReviewByDomain (optional domainId).
 */

import { mapReviewByDomain, normalizeReviewDomain } from "./nexoraReviewDomain.ts";

export type NexoraPilotReview = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

export type NexoraPilotReviewInput = {
  metrics: {
    totalRuns: number;
    completedRuns: number;
    compareRate: number;
    decisionRate: number;
    outcomeRate: number;
    errorRate: number;
  };
  quality: {
    qualityTier: "low" | "medium" | "high";
    trend: "improving" | "stable" | "declining";
    summary: string;
  } | null;
  validation: {
    passRate: number;
  } | null;
};

function dedupeLines(lines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function pushUnique(bucket: string[], line: string): void {
  const t = line.trim();
  if (!t) return;
  if (bucket.includes(t)) return;
  bucket.push(t);
}

/** Stable JSON for deduped dev logging and idempotent regenerate. */
export function buildNexoraPilotReviewInputSignature(input: NexoraPilotReviewInput): string {
  return JSON.stringify({
    totalRuns: input.metrics.totalRuns,
    completedRuns: input.metrics.completedRuns,
    compareRate: Math.round(input.metrics.compareRate * 1000) / 1000,
    decisionRate: Math.round(input.metrics.decisionRate * 1000) / 1000,
    outcomeRate: Math.round(input.metrics.outcomeRate * 1000) / 1000,
    errorRate: Math.round(input.metrics.errorRate * 1000) / 1000,
    quality: input.quality
      ? {
          qualityTier: input.quality.qualityTier,
          trend: input.quality.trend,
          summary: input.quality.summary.slice(0, 120),
        }
      : null,
    validation: input.validation ? { passRate: Math.round(input.validation.passRate * 1000) / 1000 } : null,
  });
}

let lastB29PilotReviewLogSignature: string | null = null;

export function emitPilotReviewGeneratedDevOnce(signature: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (signature === lastB29PilotReviewLogSignature) return;
  lastB29PilotReviewLogSignature = signature;
  globalThis.console?.debug?.("[Nexora][B29] pilot_review_generated", { signature });
}

/** Reads B.21 snapshot from `__NEXORA_DEBUG__.lastDecisionQualityReview` (dev only, set by HomeScreen). */
export function readNexoraPilotReviewQualityFromDebug(): NexoraPilotReviewInput["quality"] {
  if (typeof window === "undefined") return null;
  const dbg = (window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> }).__NEXORA_DEBUG__;
  const raw = dbg?.lastDecisionQualityReview;
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const tier = o.qualityTier;
  const trend = o.trend;
  const summary = o.summary;
  if (tier !== "low" && tier !== "medium" && tier !== "high") return null;
  if (trend !== "improving" && trend !== "stable" && trend !== "declining") return null;
  if (typeof summary !== "string" || !summary.trim()) return null;
  return {
    qualityTier: tier,
    trend,
    summary: summary.trim(),
  };
}

function buildNexoraPilotReviewGeneric(input: NexoraPilotReviewInput): NexoraPilotReview {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  const m = input.metrics;
  const q = input.quality;
  const v = input.validation;

  if (m.compareRate < 0.6) {
    pushUnique(weaknesses, "Users are not exploring scenarios enough");
    pushUnique(recommendations, "Improve compare clarity and visibility");
  }
  if (m.decisionRate < 0.5) {
    pushUnique(weaknesses, "Users hesitate to make decisions");
    pushUnique(recommendations, "Improve recommendation clarity and action confidence");
  }
  if (m.outcomeRate < 0.3) {
    pushUnique(weaknesses, "Learning loop is weak");
    pushUnique(recommendations, "Improve outcome recording flow");
  }
  if (m.errorRate > 0.15) {
    pushUnique(weaknesses, "System reliability is still affecting usage");
    pushUnique(recommendations, "Improve reliability and error recovery");
  }

  if (q) {
    if (q.qualityTier === "low") {
      pushUnique(weaknesses, "Decision quality is weak");
      pushUnique(recommendations, "Review adaptive bias, memory, and decision heuristics");
    }
    if (q.trend === "declining") {
      pushUnique(weaknesses, "Decision quality is declining");
      pushUnique(recommendations, "Investigate outcome feedback and adaptive logic");
    }
    if (q.trend === "improving") {
      pushUnique(strengths, "Decision quality is improving over time");
    }
    if (q.qualityTier === "high") {
      pushUnique(strengths, "Decision outputs are performing well");
    }
  }

  if (v != null) {
    if (v.passRate < 0.75) {
      pushUnique(weaknesses, "Core scenario validation is not reliable enough");
      pushUnique(recommendations, "Improve mapping, signal interpretation, and domain calibration");
    }
    if (v.passRate >= 0.75) {
      pushUnique(strengths, "Core analysis is stable enough for pilot");
    }
  }

  const summary = pickPilotReviewSummary(input, strengths, weaknesses);

  return {
    summary,
    strengths: dedupeLines(strengths),
    weaknesses: dedupeLines(weaknesses),
    recommendations: dedupeLines(recommendations),
  };
}

export function buildNexoraPilotReview(input: NexoraPilotReviewInput, domainId?: string | null): NexoraPilotReview {
  return mapReviewByDomain(buildNexoraPilotReviewGeneric(input), normalizeReviewDomain(domainId));
}

function pickPilotReviewSummary(
  input: NexoraPilotReviewInput,
  strengths: string[],
  weaknesses: string[]
): string {
  const m = input.metrics;
  const v = input.validation?.passRate;
  const q = input.quality;

  if (m.totalRuns === 0 && v == null && q == null) {
    return "Not enough pilot usage yet — run assessments, validation, and record outcomes to populate this review.";
  }

  if (m.errorRate > 0.15 && v != null && v < 0.75) {
    return "Nexora is improving, but reliability and validation still need work.";
  }

  if (m.totalRuns >= 1 && m.outcomeRate < 0.3) {
    return "Nexora is promising for pilot, but users are not completing the learning loop.";
  }

  if (m.totalRuns >= 1 && v != null && v >= 0.75 && m.decisionRate < 0.5) {
    return "Nexora is analytically strong, but decision usage is still shallow.";
  }

  if (q?.trend === "improving" && weaknesses.length === 0) {
    return "Nexora is on a positive trajectory for pilot readiness.";
  }

  if (weaknesses.length === 0 && strengths.length > 0) {
    return "Current signals look favorable for pilot — keep monitoring usage and validation.";
  }

  if (weaknesses.length > 0) {
    return `Pilot needs attention in ${weaknesses.length} area(s) — prioritize recommendations below.`;
  }

  return "Continue gathering usage, validation, and quality signals to sharpen this review.";
}
