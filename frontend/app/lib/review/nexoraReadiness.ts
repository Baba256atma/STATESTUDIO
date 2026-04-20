/**
 * B.30 — Deterministic go-to-pilot readiness gate (no backend, no ML).
 */

import type { NexoraMetricsSummary } from "../metrics/nexoraMetrics.ts";
import type { NexoraDecisionQualityReport } from "../quality/nexoraDecisionQuality.ts";
import { readNexoraPilotReviewQualityFromDebug } from "./nexoraPilotReview.ts";

export type NexoraReadinessStatus = "ready" | "not_ready" | "borderline";

export type NexoraReadinessReport = {
  status: NexoraReadinessStatus;
  score: number;
  summary: string;
  blockers: string[];
  signals: {
    validationPassRate?: number;
    compareRate?: number;
    decisionRate?: number;
    outcomeRate?: number;
    errorRate?: number;
    qualityTier?: "low" | "medium" | "high";
  };
};

export type NexoraReadinessBuilderInput = {
  metrics: NexoraMetricsSummary;
  quality: NexoraDecisionQualityReport | null;
  validation: { passRate: number } | null;
};

function dedupeBlockers(lines: string[]): string[] {
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

export function buildNexoraReadinessInputSignature(input: NexoraReadinessBuilderInput): string {
  const m = input.metrics;
  const q = input.quality;
  const v = input.validation;
  return JSON.stringify({
    tr: m.totalRuns,
    cr: m.completedRuns,
    cmp: Math.round(m.compareRate * 1000) / 1000,
    dec: Math.round(m.decisionRate * 1000) / 1000,
    out: Math.round(m.outcomeRate * 1000) / 1000,
    err: Math.round(m.errorRate * 1000) / 1000,
    qt: q?.qualityTier ?? null,
    trn: q?.trend ?? null,
    vp: v != null ? Math.round(v.passRate * 1000) / 1000 : null,
  });
}

let lastB30ReadinessLogSignature: string | null = null;

export function emitReadinessEvaluatedDevOnce(signature: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (signature === lastB30ReadinessLogSignature) return;
  lastB30ReadinessLogSignature = signature;
  globalThis.console?.debug?.("[Nexora][B30] readiness_evaluated", { signature });
}

/** Maps B.29 debug snapshot into a minimal `NexoraDecisionQualityReport` for the readiness builder. */
export function readNexoraReadinessQualityFromDebug(): NexoraDecisionQualityReport | null {
  const q = readNexoraPilotReviewQualityFromDebug();
  if (!q) return null;
  return {
    score: 0,
    qualityTier: q.qualityTier,
    trend: q.trend,
    successfulRuns: 0,
    failedRuns: 0,
    totalRatedRuns: 0,
    summary: q.summary,
  };
}

function collectHardBlockers(input: NexoraReadinessBuilderInput): string[] {
  const b: string[] = [];
  if (input.validation != null && input.validation.passRate < 0.6) {
    b.push("Core analysis is not reliable");
  }
  if (input.metrics.errorRate > 0.25) {
    b.push("System reliability issues are too high");
  }
  if (input.quality?.qualityTier === "low") {
    b.push("Decision quality is too low");
  }
  return dedupeBlockers(b);
}

function computeSoftScore(input: NexoraReadinessBuilderInput): { passed: number; total: number } {
  const m = input.metrics;
  let passed = 0;
  let total = 0;

  if (input.validation != null) {
    total += 1;
    if (input.validation.passRate >= 0.75) passed += 1;
  }

  total += 1;
  if (m.compareRate >= 0.6) passed += 1;

  total += 1;
  if (m.decisionRate >= 0.5) passed += 1;

  total += 1;
  if (m.outcomeRate >= 0.3) passed += 1;

  total += 1;
  if (m.errorRate <= 0.15) passed += 1;

  if (input.quality != null) {
    total += 1;
    if (input.quality.qualityTier === "medium" || input.quality.qualityTier === "high") {
      passed += 1;
    }
  }

  return { passed, total };
}

function summaryForHardBlockers(blockers: string[]): string {
  const hasReliability = blockers.some((b) => b.includes("reliability"));
  const hasValidation = blockers.some((b) => b.includes("reliable") || b.includes("analysis"));
  if (hasReliability && hasValidation) {
    return "Nexora is not ready for pilot due to reliability and validation gaps.";
  }
  if (hasValidation) {
    return "Nexora is not ready for pilot — core analysis is not reliable enough.";
  }
  if (hasReliability) {
    return "Nexora is not ready for pilot — system reliability issues are too high.";
  }
  if (blockers.some((b) => b.includes("quality"))) {
    return "Nexora is not ready for pilot — decision quality is too low.";
  }
  return "Nexora is not ready for pilot — gate failed on hard requirements.";
}

function summaryForSoftStatus(status: NexoraReadinessStatus): string {
  if (status === "ready") {
    return "Nexora is ready for pilot use with stable analysis and acceptable usage patterns.";
  }
  if (status === "borderline") {
    return "Nexora is close to pilot-ready, but some workflow steps are underused.";
  }
  return "Nexora is not ready for pilot due to reliability and validation gaps.";
}

export function buildNexoraReadinessReport(input: NexoraReadinessBuilderInput): NexoraReadinessReport {
  const m = input.metrics;
  const signals: NexoraReadinessReport["signals"] = {
    compareRate: m.compareRate,
    decisionRate: m.decisionRate,
    outcomeRate: m.outcomeRate,
    errorRate: m.errorRate,
  };
  if (input.validation != null) {
    signals.validationPassRate = input.validation.passRate;
  }
  if (input.quality) {
    signals.qualityTier = input.quality.qualityTier;
  }

  const hardBlockers = collectHardBlockers(input);
  const { passed, total } = computeSoftScore(input);
  const score = total > 0 ? passed / total : 0;

  if (hardBlockers.length > 0) {
    return {
      status: "not_ready",
      score: Math.round(score * 1000) / 1000,
      summary: summaryForHardBlockers(hardBlockers),
      blockers: hardBlockers,
      signals,
    };
  }

  let status: NexoraReadinessStatus;
  if (score >= 0.75) status = "ready";
  else if (score >= 0.5) status = "borderline";
  else status = "not_ready";

  const blockers: string[] = [];
  if (status === "not_ready" || status === "borderline") {
    if (input.validation != null && input.validation.passRate < 0.75) {
      blockers.push("Validation pass rate is below the pilot bar (0.75).");
    }
    if (m.compareRate < 0.6) blockers.push("Compare usage is below target.");
    if (m.decisionRate < 0.5) blockers.push("Decision engagement is below target.");
    if (m.outcomeRate < 0.3) blockers.push("Outcome recording is below target.");
    if (m.errorRate > 0.15) blockers.push("Error rate is above the acceptable threshold.");
    if (input.quality != null && input.quality.qualityTier !== "medium" && input.quality.qualityTier !== "high") {
      blockers.push("Decision quality tier is not at medium or high.");
    }
  }

  return {
    status,
    score: Math.round(score * 1000) / 1000,
    summary: summaryForSoftStatus(status),
    blockers: status === "ready" ? [] : dedupeBlockers(blockers),
    signals,
  };
}
