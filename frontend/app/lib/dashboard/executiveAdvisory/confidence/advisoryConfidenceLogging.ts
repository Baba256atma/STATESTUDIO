/**
 * Phase 5:3 — Advisory Confidence Framework logging.
 */

import type { AdvisoryConfidenceEvaluation } from "./advisoryConfidenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportConfidenceAggregation(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `aggregation:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConfidenceAggregation]", detail);
}

export function reportAdvisoryConfidenceFramework(evaluation: AdvisoryConfidenceEvaluation): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${evaluation.overall.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryConfidence]", {
    overall: evaluation.overall.level,
    coverage: evaluation.coverage.level,
    consistency: evaluation.consistency.level,
    freshness: evaluation.freshness.level,
    diversity: evaluation.diversity.level,
    stability: evaluation.stability.level,
  });
}

export function reportEvidenceCoverage(coverage: AdvisoryConfidenceEvaluation["coverage"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `coverage:${coverage.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][EvidenceCoverage]", coverage);
}

export function reportEvidenceConsistency(consistency: AdvisoryConfidenceEvaluation["consistency"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `consistency:${consistency.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][EvidenceConsistency]", consistency);
}

export function reportEvidenceFreshness(freshness: AdvisoryConfidenceEvaluation["freshness"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `freshness:${freshness.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][EvidenceFreshness]", freshness);
}

export function reportSourceDiversity(diversity: AdvisoryConfidenceEvaluation["diversity"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `diversity:${diversity.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][SourceDiversity]", diversity);
}

export function reportReasoningStability(stability: AdvisoryConfidenceEvaluation["stability"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `stability:${stability.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ReasoningStability]", stability);
}

export function resetAdvisoryConfidenceLoggingForTests(): void {
  loggedKeys.clear();
}
