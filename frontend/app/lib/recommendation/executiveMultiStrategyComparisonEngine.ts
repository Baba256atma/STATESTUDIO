/**
 * D7:5:4 — Executive multi-strategy comparison engine (immutable, non-ranking).
 */

import type {
  EvaluateMultiStrategyComparisonInput,
  EvaluateMultiStrategyComparisonResult,
  ExecutiveMultiStrategyState,
  ExecutiveMultiStrategyComparisonSnapshot,
  MultiStrategyComparisonPanelContract,
} from "./multiStrategyComparisonTypes.ts";
import {
  COMPARISON_UNCERTAINTY_DISCLAIMER,
  NON_RANKING_DISCLAIMER,
  buildComparisonContentFingerprint,
  guardComparisonExecutiveSemantics,
  guardEvaluateMultiStrategyComparison,
} from "./comparisonGuards.ts";
import {
  analyzeStrategyPathways,
  calculateComparisonStabilityScore,
  calculatePathwayDivergenceScore,
  calculateResilienceRiskAsymmetryScore,
  classifyExecutiveComparisonLabel,
  deriveStrategyComparisonSignals,
  identifyBalancedStrategyZones,
  identifyDivergenceStrategyZones,
} from "./strategyOutcomeComparisonModel.ts";
import { analyzeStrategyDivergenceComparison } from "./divergenceComparisonAnalysis.ts";
import { analyzeExecutivePathwayEvaluation } from "./executivePathwayEvaluationIntelligence.ts";
import { buildExecutiveMultiStrategyComparisonSemantics } from "./executiveMultiStrategyComparisonSemantics.ts";
import { logStrategyComparisonDev } from "./comparisonDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function comparisonBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildMultiStrategyComparisonPanelContract(input: {
  snapshot: ExecutiveMultiStrategyComparisonSnapshot;
}): MultiStrategyComparisonPanelContract {
  const viewHint =
    input.snapshot.state.strategyDivergenceComparisonRecords.length > 2
      ? "strategy_divergence_heatmap"
      : input.snapshot.state.executivePathwayEvaluationRecords.length > 2
        ? "competing_pathway_panel"
        : input.snapshot.state.executiveComparisonLabel === "fragmented"
          ? "resilience_risk_comparison_timeline"
          : input.snapshot.state.activeStrategyComparisons.length > 2
            ? "executive_comparison_dashboard"
            : "multi_strategy_overlay";

  return Object.freeze({
    comparisonStateId: input.snapshot.comparisonStateId,
    topologyId: input.snapshot.topologyId,
    comparisonStabilityScore: input.snapshot.state.comparisonStabilityScore,
    executiveComparisonLabel: input.snapshot.state.executiveComparisonLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    nonRankingDisclaimer: input.snapshot.state.nonRankingDisclaimer,
    strategies: Object.freeze(
      input.snapshot.state.activeStrategyComparisons.map((s) =>
        Object.freeze({
          strategyId: s.strategyId,
          label: s.strategyLabel,
          comparisonState: s.comparisonState,
          comparisonStrength: s.comparisonStrength,
        })
      )
    ),
    pathwaySummaries: Object.freeze(
      input.snapshot.state.strategyPathwayRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate multi-strategy comparison (read-only; never ranks or selects a winning strategy).
 */
export function evaluateMultiStrategyComparison(
  input: EvaluateMultiStrategyComparisonInput
): EvaluateMultiStrategyComparisonResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.comparisonContext?.tick) || 0);
  const comparisonStateId = String(
    input.comparisonStateId ?? `multi-strategy-comparison::${topology.topologyId}::${tick}`
  ).trim();

  const comparisonLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.comparisonContext?.comparisonLeverageFactor ?? 0)
  );
  const divergenceStressFactor = clamp01Stress(input.comparisonContext?.divergenceStressFactor ?? 0);

  logStrategyComparisonDev("StrategyComparison", {
    comparisonStateId,
    topologyId: topology.topologyId,
    tick,
    tradeoffLabel: input.tradeoffState.executiveTradeoffLabel,
    recommendationLabel: input.recommendationState.strategicRecommendationLabel,
  });

  const activeStrategyComparisons = deriveStrategyComparisonSignals({
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    foresightState: input.foresightState,
    tradeoffState: input.tradeoffState,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    divergenceState: input.divergenceState,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    comparisonLeverageFactor,
    divergenceStressFactor,
  });

  const strategyPathwayRecords = analyzeStrategyPathways({
    comparisons: activeStrategyComparisons,
    adaptationState: input.adaptationState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    preventionState: input.preventionState,
  });

  const comparisonStabilityScore = calculateComparisonStabilityScore({
    comparisons: activeStrategyComparisons,
    confidenceState: input.confidenceState,
  });

  const pathwayDivergenceScore = calculatePathwayDivergenceScore({
    comparisons: activeStrategyComparisons,
    divergenceState: input.divergenceState,
  });

  const resilienceRiskAsymmetryScore = calculateResilienceRiskAsymmetryScore({
    comparisons: activeStrategyComparisons,
    resilienceState: input.resilienceState,
    preventionState: input.preventionState,
  });

  const strategyDivergenceComparisonRecords = analyzeStrategyDivergenceComparison({
    comparisons: activeStrategyComparisons,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    adaptationState: input.adaptationState,
  });

  const executivePathwayEvaluationRecords = analyzeExecutivePathwayEvaluation({
    comparisons: activeStrategyComparisons,
    pathwayRecords: strategyPathwayRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const tradeoffFingerprint = stableStringify({
    label: input.tradeoffState.executiveTradeoffLabel,
    balance: input.tradeoffState.strategicBalanceScore,
  });
  const recommendationFingerprint = stableStringify({
    label: input.recommendationState.strategicRecommendationLabel,
    count: input.recommendationState.activeRecommendations.length,
  });
  const confidenceFingerprint = stableStringify({
    label: input.confidenceState.recommendationConfidenceLabel,
    overall: input.confidenceState.overallConfidenceScore,
  });

  const pendingFingerprint = buildComparisonContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    tradeoffFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateMultiStrategyComparison({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    comparisons: activeStrategyComparisons,
    priorComparisonFingerprints: input.priorComparisonFingerprints,
    pendingFingerprint,
    comparisonStabilityScore,
    pathwayDivergenceScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveComparisonLabel = classifyExecutiveComparisonLabel({
    comparisonStabilityScore,
    pathwayDivergenceScore,
    divergenceState: input.divergenceState,
  });

  const state: ExecutiveMultiStrategyState = Object.freeze({
    activeStrategyComparisons: Object.freeze(activeStrategyComparisons),
    strategyPathwayRecords,
    strategyDivergenceComparisonRecords,
    executivePathwayEvaluationRecords,
    divergenceStrategyZones: identifyDivergenceStrategyZones(
      activeStrategyComparisons,
      input.divergenceState
    ),
    balancedStrategyZones: identifyBalancedStrategyZones(activeStrategyComparisons),
    comparisonStabilityScore,
    pathwayDivergenceScore,
    resilienceRiskAsymmetryScore,
    executiveComparisonLabel,
    uncertaintyDisclaimer: COMPARISON_UNCERTAINTY_DISCLAIMER,
    nonRankingDisclaimer: NON_RANKING_DISCLAIMER,
  });

  const semantics = buildExecutiveMultiStrategyComparisonSemantics({ state });
  const semanticsGuard = guardComparisonExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    comparisonStateId,
    executiveComparisonLabel,
    comparisonStabilityScore,
    pathwayDivergenceScore,
  });

  const snapshot: ExecutiveMultiStrategyComparisonSnapshot = Object.freeze({
    comparisonStateId,
    topologyId: topology.topologyId,
    tradeoffStateId: `executive-tradeoff::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      strategySummaries: Object.freeze([...semantics.strategySummaries]),
      pathwaySummaries: Object.freeze([...semantics.pathwaySummaries]),
      divergenceSummaries: Object.freeze([...semantics.divergenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: comparisonBuiltAt(tick),
  });

  const panelContract = buildMultiStrategyComparisonPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveMultiStrategyComparisonSnapshot(
  snapshot: ExecutiveMultiStrategyComparisonSnapshot
): ExecutiveMultiStrategyComparisonSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeStrategyComparisons: Object.freeze(
        snapshot.state.activeStrategyComparisons.map((s) => Object.freeze({ ...s }))
      ),
      strategyPathwayRecords: Object.freeze(
        snapshot.state.strategyPathwayRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategyDivergenceComparisonRecords: Object.freeze(
        snapshot.state.strategyDivergenceComparisonRecords.map((r) => Object.freeze({ ...r }))
      ),
      executivePathwayEvaluationRecords: Object.freeze(
        snapshot.state.executivePathwayEvaluationRecords.map((r) => Object.freeze({ ...r }))
      ),
      divergenceStrategyZones: Object.freeze([...snapshot.state.divergenceStrategyZones]),
      balancedStrategyZones: Object.freeze([...snapshot.state.balancedStrategyZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
