/**
 * Phase 5:4 — Advisory Explainability Layer logging.
 */

import type { AdvisoryExplanationBundle } from "./advisoryExplainabilityContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportAdvisoryExplainability(bundle: AdvisoryExplanationBundle): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `explainability:${bundle.guidance.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryExplainability]", {
    headline: bundle.guidance.headline,
    path: bundle.reasoningPath.pathLabel,
    drivers: bundle.confidenceDrivers.drivers.length,
    limiters: bundle.confidenceLimiters.limiters.length,
  });
}

export function reportGuidanceExplanation(guidance: AdvisoryExplanationBundle["guidance"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `guidance:${guidance.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][GuidanceExplanation]", guidance);
}

export function reportSupportingEvidence(evidence: AdvisoryExplanationBundle["supportingEvidence"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `evidence:${evidence.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][SupportingEvidence]", evidence);
}

export function reportConfidenceDriver(drivers: AdvisoryExplanationBundle["confidenceDrivers"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `driver:${drivers.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConfidenceDriver]", drivers);
}

export function reportConfidenceLimiter(limiters: AdvisoryExplanationBundle["confidenceLimiters"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `limiter:${limiters.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConfidenceLimiter]", limiters);
}

export function reportReasoningPath(path: AdvisoryExplanationBundle["reasoningPath"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `path:${path.pathLabel}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ReasoningPath]", path);
}

export function reportAssumption(layer: AdvisoryExplanationBundle["assumptionsAndUnknowns"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `assumption:${layer.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][Assumption]", layer);
}

export function resetAdvisoryExplainabilityLoggingForTests(): void {
  loggedKeys.clear();
}
