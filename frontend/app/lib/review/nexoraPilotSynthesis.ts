/**
 * B.33 — Unified pilot synthesis (deterministic, no AI, no backend persistence).
 * B.34 — Operator insight line (pilot UI) reuses NexoraPilotSynthesis.
 * B.36 — Domain-aware synthesis wording (optional domainId).
 */

import { buildNexoraMetricsSummary, loadNexoraMetricRecords } from "../metrics/nexoraMetrics.ts";
import type { NexoraMetricsSummary } from "../metrics/nexoraMetrics.ts";
import type { NexoraDecisionQualityReport } from "../quality/nexoraDecisionQuality.ts";
import { buildNexoraFeedbackSummary, loadNexoraFeedback } from "../feedback/nexoraFeedback.ts";
import {
  buildNexoraReadinessReport,
  readNexoraReadinessQualityFromDebug,
  type NexoraReadinessReport,
} from "./nexoraReadiness.ts";
import {
  buildNexoraPilotReview,
  readNexoraPilotReviewQualityFromDebug,
  type NexoraPilotReview,
} from "./nexoraPilotReview.ts";
import {
  emitDomainReviewSynthesisAppliedDevOnce,
  mapSynthesisByDomain,
  normalizeReviewDomain,
} from "./nexoraReviewDomain.ts";

export type NexoraPilotSynthesis = {
  overallStatus: "strong" | "moderate" | "weak";
  summary: string;
  keyFindings: string[];
  priorities: string[];
};

export type NexoraPilotSynthesisInput = {
  metrics: NexoraMetricsSummary;
  quality: NexoraDecisionQualityReport | null;
  validation: { passRate: number } | null;
  readiness: NexoraReadinessReport | null;
  feedback: {
    helpfulRate: number;
    negativeRate: number;
    confusionRate: number;
  };
  review: NexoraPilotReview | null;
};

const LOW_COMPARE = 0.35;
const LOW_DECISION = 0.35;
const LOW_OUTCOME = 0.25;
const LOW_VALIDATION = 0.6;
const HIGH_ERROR = 0.25;
const LOW_HELPFUL = 0.5;
const HIGH_CONFUSION = 0.2;

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

function dedupeKeepOrder(strings: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of strings) {
    const t = s.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function overallFromReadiness(readiness: NexoraReadinessReport | null): "strong" | "moderate" | "weak" | null {
  if (!readiness) return null;
  if (readiness.status === "not_ready") return "weak";
  if (readiness.status === "borderline") return "moderate";
  return "strong";
}

function overallFallback(input: NexoraPilotSynthesisInput): "strong" | "moderate" | "weak" {
  const m = input.metrics;
  const v = input.validation;
  const weakByValidation = v != null && v.passRate < LOW_VALIDATION;
  const weakByError = m.errorRate > HIGH_ERROR;
  if (weakByValidation || weakByError) return "weak";

  const mixed =
    m.compareRate < LOW_COMPARE ||
    m.decisionRate < LOW_DECISION ||
    m.outcomeRate < LOW_OUTCOME ||
    input.quality?.qualityTier === "low" ||
    input.quality?.qualityTier === "medium" ||
    (input.feedback.helpfulRate < LOW_HELPFUL && input.feedback.negativeRate + input.feedback.confusionRate > 0.02) ||
    input.feedback.confusionRate > HIGH_CONFUSION;

  if (mixed) return "moderate";
  return "strong";
}

function collectKeyFindings(input: NexoraPilotSynthesisInput): string[] {
  const m = input.metrics;
  const out: string[] = [];

  if (m.compareRate < LOW_COMPARE) {
    out.push("Users are not exploring scenarios");
  }
  if (m.decisionRate < LOW_DECISION) {
    out.push("Decision engagement is low");
  }
  if (m.outcomeRate < LOW_OUTCOME) {
    out.push("Learning loop is weak");
  }

  const q = input.quality;
  if (q?.qualityTier === "low") {
    out.push("Decision quality is weak");
  } else if (q?.trend === "improving" && q.qualityTier !== "low") {
    out.push("Decision quality is improving");
  }

  const v = input.validation;
  if (v != null && v.passRate < LOW_VALIDATION) {
    out.push("Core analysis is not reliable");
  }

  const f = input.feedback;
  const hasPerceptionSignal = f.negativeRate + f.confusionRate > 0.001 || Math.abs(f.helpfulRate - 0.5) > 0.001;
  if (hasPerceptionSignal) {
    if (f.helpfulRate < LOW_HELPFUL) {
      out.push("Users do not find results helpful");
    }
    if (f.confusionRate > HIGH_CONFUSION) {
      out.push("Results are confusing");
    }
  }

  const rw = input.review?.weaknesses ?? [];
  for (const w of rw.slice(0, 2)) {
    const t = String(w).trim();
    if (t) out.push(t);
  }

  return dedupeLines(out);
}

function collectPriorities(input: NexoraPilotSynthesisInput): string[] {
  const m = input.metrics;
  const v = input.validation;
  const q = input.quality;
  const f = input.feedback;
  const hasPerception = f.negativeRate + f.confusionRate > 0.001 || Math.abs(f.helpfulRate - 0.5) > 0.001;

  const tier1: string[] = [];
  if (m.errorRate > HIGH_ERROR) tier1.push("Improve reliability");
  if (v != null && v.passRate < LOW_VALIDATION) tier1.push("Improve mapping / signals");

  const tier2: string[] = [];
  if (q?.qualityTier === "low") tier2.push("Improve recommendation clarity");
  if (m.decisionRate < LOW_DECISION) tier2.push("Improve recommendation clarity");
  if (hasPerception && f.helpfulRate < LOW_HELPFUL) tier2.push("Improve recommendation clarity");

  const tier3: string[] = [];
  if (m.compareRate < LOW_COMPARE) tier3.push("Improve compare visibility");
  if (m.outcomeRate < LOW_OUTCOME) tier3.push("Improve outcome capture UX");
  if (hasPerception && f.confusionRate > HIGH_CONFUSION) tier3.push("Improve explanation layer");

  return dedupeKeepOrder([...tier1, ...tier2, ...tier3]).slice(0, 3);
}

function buildSummary(overall: NexoraPilotSynthesis["overallStatus"], input: NexoraPilotSynthesisInput): string {
  const m = input.metrics;
  if (overall === "weak") {
    if (input.readiness?.status === "not_ready") {
      return "Nexora is not yet reliable enough for pilot usage.";
    }
    if (m.errorRate > HIGH_ERROR) {
      return "Nexora is not yet reliable enough for pilot usage.";
    }
    return "Nexora needs attention before broader pilot use.";
  }
  if (overall === "moderate") {
    const shallow =
      m.compareRate < LOW_COMPARE || m.decisionRate < LOW_DECISION || m.outcomeRate < LOW_OUTCOME;
    if (shallow && (input.validation == null || (input.validation && input.validation.passRate >= LOW_VALIDATION))) {
      return "Nexora is analytically strong but user engagement is still shallow.";
    }
    return "Nexora is capable but signals are mixed — tighten workflows before scaling the pilot.";
  }
  return "Nexora is performing well and ready for controlled pilot.";
}

export function buildNexoraPilotSynthesisInputBaseSignature(input: NexoraPilotSynthesisInput): string {
  const m = input.metrics;
  const q = input.quality;
  const v = input.validation;
  const r = input.readiness;
  const f = input.feedback;
  const rw = input.review;
  return JSON.stringify({
    tr: m.totalRuns,
    cmp: Math.round(m.compareRate * 1000) / 1000,
    dec: Math.round(m.decisionRate * 1000) / 1000,
    out: Math.round(m.outcomeRate * 1000) / 1000,
    err: Math.round(m.errorRate * 1000) / 1000,
    qt: q?.qualityTier ?? null,
    trn: q?.trend ?? null,
    vp: v != null ? Math.round(v.passRate * 1000) / 1000 : null,
    rs: r?.status ?? null,
    rsc: r != null ? Math.round(r.score * 1000) / 1000 : null,
    fh: Math.round(f.helpfulRate * 1000) / 1000,
    fn: Math.round(f.negativeRate * 1000) / 1000,
    fc: Math.round(f.confusionRate * 1000) / 1000,
    ww: rw?.weaknesses?.slice(0, 3).map((w) => String(w).trim().slice(0, 80)) ?? null,
  });
}

export function buildNexoraPilotSynthesisInputSignature(
  input: NexoraPilotSynthesisInput,
  domainId?: string | null,
): string {
  const dom = normalizeReviewDomain(domainId);
  return `${buildNexoraPilotSynthesisInputBaseSignature(input)}|${dom}`;
}

let lastB33SynthesisLogSignature: string | null = null;

export function emitPilotSynthesisGeneratedDevOnce(signature: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (signature === lastB33SynthesisLogSignature) return;
  lastB33SynthesisLogSignature = signature;
  globalThis.console?.debug?.("[Nexora][B33] pilot_synthesis_generated", { signature });
}

export function buildNexoraPilotSynthesis(
  input: NexoraPilotSynthesisInput,
  domainId?: string | null,
): NexoraPilotSynthesis {
  const fromReady = overallFromReadiness(input.readiness);
  const overallStatus = fromReady ?? overallFallback(input);
  const keyFindings = collectKeyFindings(input);
  const priorities = collectPriorities(input);
  const summary = buildSummary(overallStatus, input);

  const domain = normalizeReviewDomain(domainId);
  const mapped = mapSynthesisByDomain({ overallStatus, summary, keyFindings, priorities }, domain);
  emitDomainReviewSynthesisAppliedDevOnce({
    baseSignature: buildNexoraPilotSynthesisInputBaseSignature(input),
    domain,
    summary: mapped.summary,
  });
  return mapped;
}

const EMPTY_METRICS: NexoraMetricsSummary = {
  totalRuns: 0,
  completedRuns: 0,
  compareRate: 0,
  decisionRate: 0,
  outcomeRate: 0,
  errorRate: 0,
};

/**
 * B.33 / B.34 — Same inputs as the dev Synthesis tab (B.28–B.32 + readiness), for browser-only callers.
 */
export function collectNexoraPilotSynthesisInputFromBrowser(
  validation: { passRate: number } | null,
  domainId?: string | null,
): NexoraPilotSynthesisInput {
  if (typeof window === "undefined") {
    return {
      metrics: EMPTY_METRICS,
      quality: null,
      validation,
      readiness: null,
      feedback: { helpfulRate: 0.5, negativeRate: 0, confusionRate: 0 },
      review: null,
    };
  }

  const records = loadNexoraMetricRecords();
  const metrics = buildNexoraMetricsSummary(records);
  const quality = readNexoraReadinessQualityFromDebug();
  const readinessInput = { metrics, quality, validation };
  const readiness = buildNexoraReadinessReport(readinessInput);

  const fbSummary = buildNexoraFeedbackSummary(loadNexoraFeedback());
  const feedback =
    fbSummary.total === 0
      ? { helpfulRate: 0.5, negativeRate: 0, confusionRate: 0 }
      : {
          helpfulRate: fbSummary.helpfulRate,
          negativeRate: fbSummary.negativeRate,
          confusionRate: fbSummary.confusionRate,
        };

  const reviewQuality = readNexoraPilotReviewQualityFromDebug();
  const review = buildNexoraPilotReview({ metrics, quality: reviewQuality, validation }, domainId);

  return {
    metrics,
    quality,
    validation,
    readiness,
    feedback,
    review,
  };
}

