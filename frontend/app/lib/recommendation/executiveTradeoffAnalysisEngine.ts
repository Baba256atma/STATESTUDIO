/**
 * D7:5:3 — Executive tradeoff analysis engine (immutable, non-mutating, no auto-selection).
 */

import type {
  EvaluateExecutiveTradeoffsInput,
  EvaluateExecutiveTradeoffsResult,
  ExecutiveTradeoffState,
  ExecutiveTradeoffSnapshot,
  TradeoffPanelContract,
} from "./tradeoffAnalysisTypes.ts";
import {
  NON_SELECTION_DISCLAIMER,
  TRADEOFF_UNCERTAINTY_DISCLAIMER,
  buildTradeoffContentFingerprint,
  guardEvaluateExecutiveTradeoffs,
  guardTradeoffExecutiveSemantics,
} from "./tradeoffGuards.ts";
import {
  analyzeStrategicCostBenefit,
  calculateBenefitAsymmetryScore,
  calculateOperationalCostScore,
  calculateStrategicBalanceScore,
  classifyExecutiveTradeoffLabel,
  deriveStrategicTradeoffSignals,
  identifyBenefitZones,
  identifyOperationalCostZones,
} from "./strategicCostBenefitModel.ts";
import { analyzeCompetingObjectives } from "./competingObjectiveAnalysis.ts";
import { analyzeExecutiveTradeoffConsequences } from "./executiveDecisionTradeoffIntelligence.ts";
import { buildExecutiveTradeoffSemantics } from "./executiveTradeoffSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../simulation/topology/operationalUniverseClassification.ts";
import { logTradeoffDev } from "./tradeoffDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function tradeoffBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildTradeoffPanelContract(input: {
  snapshot: ExecutiveTradeoffSnapshot;
}): TradeoffPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.competingObjectiveRecords.length > 2
      ? "competing_objective_panel"
      : input.snapshot.state.strategicCostBenefitRecords.length > 2
        ? "cost_benefit_heatmap"
        : input.snapshot.state.executiveTradeoffLabel === "volatile"
          ? "strategic_balance_timeline"
          : input.snapshot.state.operationalCostZones.length > 0
            ? "executive_comparison_dashboard"
            : "tradeoff_overlay";

  return Object.freeze({
    tradeoffStateId: input.snapshot.tradeoffStateId,
    topologyId: input.snapshot.topologyId,
    strategicBalanceScore: input.snapshot.state.strategicBalanceScore,
    executiveTradeoffLabel: input.snapshot.state.executiveTradeoffLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    nonSelectionDisclaimer: input.snapshot.state.nonSelectionDisclaimer,
    tradeoffs: Object.freeze(
      input.snapshot.state.activeTradeoffs.slice(0, 16).map((t) =>
        Object.freeze({
          tradeoffId: t.tradeoffId,
          label: t.affectedRegionIds.map(regionLabel).join(" · "),
          tradeoffState: t.tradeoffState,
          tradeoffStrength: t.tradeoffStrength,
        })
      )
    ),
    costBenefitSummaries: Object.freeze(
      input.snapshot.state.strategicCostBenefitRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive strategic tradeoffs (read-only; never auto-selects strategies).
 */
export function evaluateExecutiveTradeoffs(
  input: EvaluateExecutiveTradeoffsInput
): EvaluateExecutiveTradeoffsResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.tradeoffContext?.tick) || 0);
  const tradeoffStateId = String(
    input.tradeoffStateId ?? `executive-tradeoff::${topology.topologyId}::${tick}`
  ).trim();

  const tradeoffLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.tradeoffContext?.tradeoffLeverageFactor ?? 0)
  );
  const sacrificeStressFactor = clamp01Stress(input.tradeoffContext?.sacrificeStressFactor ?? 0);

  logTradeoffDev("Tradeoff", {
    tradeoffStateId,
    topologyId: topology.topologyId,
    tick,
    recommendationLabel: input.recommendationState.strategicRecommendationLabel,
    confidenceLabel: input.confidenceState.recommendationConfidenceLabel,
  });

  const activeTradeoffs = deriveStrategicTradeoffSignals({
    topology,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    foresightState: input.foresightState,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    tradeoffLeverageFactor,
    sacrificeStressFactor,
  });

  const strategicCostBenefitRecords = analyzeStrategicCostBenefit({
    topology,
    tradeoffs: activeTradeoffs,
    recommendationState: input.recommendationState,
    adaptationState: input.adaptationState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    preventionState: input.preventionState,
  });

  const strategicBalanceScore = calculateStrategicBalanceScore({
    tradeoffs: activeTradeoffs,
    costBenefitRecords: strategicCostBenefitRecords,
  });

  const operationalCostScore = calculateOperationalCostScore({
    costBenefitRecords: strategicCostBenefitRecords,
    preventionState: input.preventionState,
  });

  const benefitAsymmetryScore = calculateBenefitAsymmetryScore({
    costBenefitRecords: strategicCostBenefitRecords,
  });

  const competingObjectiveRecords = analyzeCompetingObjectives({
    tradeoffs: activeTradeoffs,
    adaptationState: input.adaptationState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    divergenceState: input.divergenceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const executiveTradeoffConsequenceRecords = analyzeExecutiveTradeoffConsequences({
    tradeoffs: activeTradeoffs,
    costBenefitRecords: strategicCostBenefitRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const recommendationFingerprint = stableStringify({
    label: input.recommendationState.strategicRecommendationLabel,
    count: input.recommendationState.activeRecommendations.length,
  });
  const confidenceFingerprint = stableStringify({
    label: input.confidenceState.recommendationConfidenceLabel,
    overall: input.confidenceState.overallConfidenceScore,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });

  const pendingFingerprint = buildTradeoffContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    foresightFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveTradeoffs({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    tradeoffs: activeTradeoffs,
    priorTradeoffFingerprints: input.priorTradeoffFingerprints,
    pendingFingerprint,
    strategicBalanceScore,
    benefitAsymmetryScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveTradeoffLabel = classifyExecutiveTradeoffLabel({
    strategicBalanceScore,
    operationalCostScore,
    benefitAsymmetryScore,
  });

  const state: ExecutiveTradeoffState = Object.freeze({
    activeTradeoffs: Object.freeze(activeTradeoffs),
    strategicCostBenefitRecords,
    competingObjectiveRecords,
    executiveTradeoffConsequenceRecords,
    benefitZones: identifyBenefitZones(activeTradeoffs, input.recommendationState),
    operationalCostZones: identifyOperationalCostZones(
      activeTradeoffs,
      input.recommendationState
    ),
    strategicBalanceScore,
    operationalCostScore,
    benefitAsymmetryScore,
    executiveTradeoffLabel,
    uncertaintyDisclaimer: TRADEOFF_UNCERTAINTY_DISCLAIMER,
    nonSelectionDisclaimer: NON_SELECTION_DISCLAIMER,
  });

  const semantics = buildExecutiveTradeoffSemantics({ state });
  const semanticsGuard = guardTradeoffExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    tradeoffStateId,
    executiveTradeoffLabel,
    strategicBalanceScore,
    operationalCostScore,
  });

  const snapshot: ExecutiveTradeoffSnapshot = Object.freeze({
    tradeoffStateId,
    topologyId: topology.topologyId,
    recommendationStateId: `strategic-recommendation::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      tradeoffSummaries: Object.freeze([...semantics.tradeoffSummaries]),
      costBenefitSummaries: Object.freeze([...semantics.costBenefitSummaries]),
      competingObjectiveSummaries: Object.freeze([...semantics.competingObjectiveSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: tradeoffBuiltAt(tick),
  });

  const panelContract = buildTradeoffPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveTradeoffSnapshot(
  snapshot: ExecutiveTradeoffSnapshot
): ExecutiveTradeoffSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeTradeoffs: Object.freeze(
        snapshot.state.activeTradeoffs.map((t) => Object.freeze({ ...t }))
      ),
      strategicCostBenefitRecords: Object.freeze(
        snapshot.state.strategicCostBenefitRecords.map((r) => Object.freeze({ ...r }))
      ),
      competingObjectiveRecords: Object.freeze(
        snapshot.state.competingObjectiveRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveTradeoffConsequenceRecords: Object.freeze(
        snapshot.state.executiveTradeoffConsequenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      benefitZones: Object.freeze([...snapshot.state.benefitZones]),
      operationalCostZones: Object.freeze([...snapshot.state.operationalCostZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
