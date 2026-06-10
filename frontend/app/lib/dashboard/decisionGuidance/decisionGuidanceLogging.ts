/**
 * Phase 5:5 — Decision Guidance Surface logging.
 */

import type { DecisionGuidanceSnapshot, DecisionGuidanceSurfaceModel } from "./decisionGuidanceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportDecisionGuidance(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `guidance:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DecisionGuidance]", detail);
}

export function reportDecisionFocus(focus: DecisionGuidanceSnapshot["decisionFocus"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `focus:${focus.focus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DecisionFocus]", focus);
}

export function reportExecutiveGuidance(guidance: DecisionGuidanceSnapshot["executiveGuidance"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `executive:${guidance.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExecutiveGuidance]", guidance);
}

export function reportConfidenceSummary(summary: DecisionGuidanceSnapshot["confidenceSummary"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${summary.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ConfidenceSummary]", summary);
}

export function reportExplanationSummary(summary: DecisionGuidanceSnapshot["explanationSummary"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `explanation:${summary.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExplanationSummary]", summary);
}

export function reportTradeoffSummary(summary: DecisionGuidanceSnapshot["tradeoffSummary"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tradeoff:${summary.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TradeoffSummary]", summary);
}

export function reportDecisionContext(context: DecisionGuidanceSnapshot["decisionContext"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `context:${context.summary}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DecisionContext]", context);
}

export function reportDecisionGuidanceSurface(model: DecisionGuidanceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.decisionFocus.focus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DecisionGuidance]", {
    surfaceId: model.surfaceId,
    focus: model.snapshot.decisionFocus.focus,
    confidence: model.snapshot.confidenceSummary.level,
  });
}

export function resetDecisionGuidanceLoggingForTests(): void {
  loggedKeys.clear();
}
