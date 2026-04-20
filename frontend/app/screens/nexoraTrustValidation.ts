/**
 * B.12 — deterministic trust / validation on top of existing pipeline outputs (no ML).
 */

import type { FragilityDriver } from "../types/fragilityScanner";
import type { NexoraExecutionOutcome } from "../lib/execution/nexoraExecutionOutcome.ts";
import { getB13TrustEvidenceBiasMerged } from "../lib/domain/nexoraDomainPackRollout.ts";

export type NexoraTrustConfidenceTier = "low" | "medium" | "high";

export type NexoraTrustValidation = {
  confidenceScore: number;
  confidenceTier: NexoraTrustConfidenceTier;
  validationWarnings: readonly string[];
  hasContradiction: boolean;
  hasLowEvidence: boolean;
  hasPartialFailure: boolean;
  trustSummaryLine: string | null;
};

export type NexoraTrustValidationInput = {
  pipelineStatus: "idle" | "processing" | "ready" | "error";
  fragilityLevel: "low" | "medium" | "high" | "critical" | null;
  /** Ingestion / merged signal count used for evidence heuristics */
  mergedSignalCount: number;
  sourceCount: number;
  successfulSourceCount: number;
  mergeWarnings?: readonly string[];
  drivers: readonly FragilityDriver[];
  hasSummary: boolean;
  /** merge_meta.source_weights from multi-source trust-aware merge */
  sourceWeights?: Record<string, number> | null;
  /** B.13 — workspace / experience domain for evidence bias (optional). */
  domainId?: string | null;
  /** B.20 — last recorded execution outcome bias (optional). */
  executionOutcomeFeedback?: NexoraExecutionOutcome["outcomeLabel"] | null;
};

const EMPTY_WARNINGS: readonly string[] = Object.freeze([]);

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function avgSourceWeight(weights: Record<string, number> | null | undefined): number | null {
  if (!weights || typeof weights !== "object") return null;
  const vals = Object.values(weights).filter((v) => typeof v === "number" && Number.isFinite(v));
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function topDriverScores(drivers: readonly FragilityDriver[]): [number, number] {
  const sorted = [...drivers]
    .map((d) => (typeof d.score === "number" && Number.isFinite(d.score) ? d.score : 0))
    .sort((a, b) => b - a);
  return [sorted[0] ?? 0, sorted[1] ?? 0];
}

/**
 * Deterministic trust snapshot from merge stats + scanner output.
 */
export function evaluateNexoraTrustValidation(input: NexoraTrustValidationInput): NexoraTrustValidation {
  const warnings: string[] = [];
  const src = Math.max(1, Math.floor(input.sourceCount));
  const ok = clamp(Math.floor(input.successfulSourceCount), 0, src);
  const merged = Math.max(0, Math.floor(input.mergedSignalCount));
  const frag = input.fragilityLevel;
  const [d0, d1] = topDriverScores(input.drivers);

  const hasPartialFailure = ok < src && ok > 0;
  if (hasPartialFailure) {
    warnings.push("Partial source failure — not all inputs contributed.");
  }
  if (ok === 0) {
    warnings.push("No successful sources — result is not grounded in live inputs.");
  }

  const hasLowEvidence = merged < 2 || (ok === 1 && merged < 4);
  if (hasLowEvidence) {
    warnings.push("Low evidence depth — widen inputs before high-stakes action.");
  }

  let hasContradiction = false;
  if (frag === "low" && d0 >= 0.72) {
    hasContradiction = true;
    warnings.push("Possible contradiction: low headline fragility but strong driver emphasis.");
  }
  if ((frag === "medium" || frag === "high" || frag === "critical") && merged <= 1 && ok > 0) {
    hasContradiction = true;
    warnings.push("Possible contradiction: elevated fragility with very few merged signals.");
  }
  if (d0 >= 0.62 && d1 >= 0.62 && Math.abs(d0 - d1) < 0.09) {
    hasContradiction = true;
    warnings.push("Mixed strong drivers — narrative may be pulling in multiple directions.");
  }

  const coverage = ok / src;
  const weightAvg = avgSourceWeight(input.sourceWeights);
  let score = 0.42 + coverage * 0.28;
  if (merged >= 6) score += 0.12;
  else if (merged >= 3) score += 0.06;
  if (merged <= 1) score -= 0.18;
  if (weightAvg != null && weightAvg >= 0.88) score += 0.06;
  if (weightAvg != null && weightAvg < 0.62) score -= 0.08;
  if (hasPartialFailure) score -= 0.12;
  if (hasLowEvidence) score -= 0.1;
  if (hasContradiction) score -= 0.14;
  if (!input.hasSummary) score -= 0.05;
  if (input.pipelineStatus === "error") score -= 0.22;
  if (ok >= 2 && coverage >= 1 && !hasContradiction && !hasLowEvidence) score += 0.06;

  score += getB13TrustEvidenceBiasMerged(input.domainId, merged, ok);
  if (input.executionOutcomeFeedback === "worse") score -= 0.1;
  if (input.executionOutcomeFeedback === "better") score += 0.05;
  score = clamp(Number(score.toFixed(4)), 0, 1);
  score = clamp(score, 0.05, 0.97);

  let confidenceTier: NexoraTrustConfidenceTier = "medium";
  if (score >= 0.72) confidenceTier = "high";
  else if (score < 0.46) confidenceTier = "low";

  let trustSummaryLine: string | null = null;
  if (hasContradiction) {
    trustSummaryLine = "Mixed or conflicting signals — treat the summary cautiously.";
  } else if (hasPartialFailure) {
    trustSummaryLine = "Partial source failure; treat the result cautiously.";
  } else if (hasLowEvidence) {
    trustSummaryLine = "Low evidence — widen inputs before acting.";
  } else if (confidenceTier === "high" && ok >= 2) {
    trustSummaryLine = "Aligned signals from trusted sources.";
  } else if (confidenceTier === "high") {
    trustSummaryLine = "Strong internal consistency on available evidence.";
  } else if (confidenceTier === "medium") {
    trustSummaryLine = "Moderate confidence — validate key assumptions.";
  } else {
    trustSummaryLine = "Limited confidence — gather more evidence.";
  }

  const validationWarnings = warnings.length === 0 ? EMPTY_WARNINGS : Object.freeze([...warnings]);

  return {
    confidenceScore: score,
    confidenceTier,
    validationWarnings,
    hasContradiction,
    hasLowEvidence,
    hasPartialFailure,
    trustSummaryLine,
  };
}

export function buildNexoraTrustValidationSignature(v: NexoraTrustValidation): string {
  return JSON.stringify({
    t: v.confidenceTier,
    s: v.confidenceScore.toFixed(3),
    w: [...v.validationWarnings].join("|"),
    c: v.hasContradiction ? 1 : 0,
    l: v.hasLowEvidence ? 1 : 0,
    p: v.hasPartialFailure ? 1 : 0,
    line: v.trustSummaryLine,
  });
}
