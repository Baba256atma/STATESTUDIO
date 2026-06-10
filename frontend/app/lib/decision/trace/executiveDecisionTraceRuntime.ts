/**
 * E2:72 — Memoized executive dashboard decision trace resolver.
 */

import { buildDecisionTimeline } from "../../governance/buildDecisionTimeline";
import { buildDecisionTimelineView } from "../../governance/buildDecisionTimelineView";
import type { DecisionTimelineViewEvent } from "../../governance/decisionTimelineModel";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import { guardHeavyComputation } from "../../ops/performanceGuard";
import { reportDashboardTrace } from "../../dashboard/dashboardPerformanceMetrics.ts";
import { recordDashboardTraceComputeFrequency } from "../../dashboard/dashboardPerformanceRegression.ts";
import { DASHBOARD_PERFORMANCE_BUDGETS } from "../../dashboard/dashboardPerformanceBudget.ts";
import {
  getExecutiveDecisionTraceCache,
  setExecutiveDecisionTraceCache,
} from "./executiveDecisionTraceCache";
import {
  buildExecutiveDecisionTraceInputSignature,
  extractExecutiveDecisionTraceSignatureInput,
  type ExecutiveDecisionTraceSignatureInput,
} from "./executiveDecisionTraceSignature";
import {
  traceDecisionTraceCached,
  traceDecisionTraceComputed,
  traceDecisionTraceSkipped,
} from "./decisionTraceDiagnostics";

export type ResolveExecutiveDashboardDecisionTraceInput = {
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
  sceneJson?: { scene?: { objects?: Array<{ id?: string | null }>; fragility?: { level?: unknown; score?: unknown } } } | null;
  objectSelection?: { selected_object_id?: string | null; highlighted_objects?: string[] | null } | null;
  activeMode?: string | null;
  scenarioId?: string | null;
  decisionId?: string | null;
  signatureInput?: ExecutiveDecisionTraceSignatureInput;
};

export function resolveExecutiveDashboardDecisionTrace(
  input: ResolveExecutiveDashboardDecisionTraceInput
): DecisionTimelineViewEvent[] {
  const signatureInput =
    input.signatureInput ??
    extractExecutiveDecisionTraceSignatureInput({
      responseData: input.responseData,
      canonicalRecommendation: input.canonicalRecommendation,
      memoryEntries: input.memoryEntries,
      sceneJson: input.sceneJson,
      objectSelection: input.objectSelection,
      activeMode: input.activeMode,
      scenarioId: input.scenarioId,
      decisionId: input.decisionId,
    });
  const signature = buildExecutiveDecisionTraceInputSignature(signatureInput);

  const cached = getExecutiveDecisionTraceCache(signature);
  if (cached) {
    traceDecisionTraceCached({ signature, computedAt: cached.computedAt });
    reportDashboardTrace({
      phase: "cache_hit",
      signature,
      durationMs: 0,
      fromCache: true,
      withinBudget: true,
      budgetMs: DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs,
    });
    return cached.traceResult;
  }

  const memoryEntries = input.memoryEntries ?? [];
  const canonicalRecommendation =
    input.canonicalRecommendation ??
    ((input.responseData?.canonical_recommendation as CanonicalRecommendation | null | undefined) ?? null);

  traceDecisionTraceComputed({ signature });
  recordDashboardTraceComputeFrequency({ signature, phase: "compute_start" });

  const started =
    typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  const traceResult = guardHeavyComputation(
    "executive_dashboard_decision_trace",
    () =>
      buildDecisionTimelineView(
        buildDecisionTimeline({
          responseData: input.responseData ?? null,
          canonicalRecommendation,
          memoryEntries,
        })
      ).slice(-3),
    DASHBOARD_PERFORMANCE_BUDGETS.performanceGuardWarnMs,
    { fromCache: false, signature }
  );
  const durationMs =
    (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now()) -
    started;

  reportDashboardTrace({
    phase: "compute_complete",
    signature,
    durationMs,
    fromCache: false,
    withinBudget: durationMs <= DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs,
    budgetMs: DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs,
    eventCount: traceResult.length,
  });

  setExecutiveDecisionTraceCache(signature, traceResult);
  return traceResult;
}

export function shouldSkipExecutiveDecisionTraceRecompute(
  previousSignature: string | null,
  nextSignature: string
): boolean {
  if (!previousSignature) return false;
  if (previousSignature === nextSignature) {
    traceDecisionTraceSkipped({ signature: nextSignature, reason: "unchanged_signature" });
    return true;
  }
  return false;
}

export {
  buildExecutiveDecisionTraceInputSignature,
  extractExecutiveDecisionTraceSignatureInput,
  extractDecisionTracePanelWriteSignature,
} from "./executiveDecisionTraceSignature";
