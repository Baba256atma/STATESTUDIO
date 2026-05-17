/**
 * D7:4:1 — Predictive future trajectory intelligence engine (immutable, non-mutating).
 */

import type {
  EvaluateFutureTrajectoriesInput,
  EvaluateFutureTrajectoriesResult,
  PredictiveTrajectorySnapshot,
  PredictiveTrajectoryState,
  TrajectoryPanelContract,
} from "./futureTrajectoryTypes.ts";
import {
  buildTrajectoryContentFingerprint,
  guardEvaluateFutureTrajectories,
  guardTrajectoryExecutiveSemantics,
  UNCERTAINTY_DISCLAIMER,
} from "./trajectoryGuards.ts";
import {
  calculateFutureStabilityScore,
  calculateTrajectoryDivergenceScore,
  calculateTrajectoryVolatilityScore,
  classifyPredictiveTrajectoryLabel,
  deriveFutureTrajectorySignals,
  identifyPredictiveDegradationTrajectories,
  identifyPredictiveRecoveryTrajectories,
  identifyPredictiveVolatilityHotspots,
} from "./directionalEvolutionModel.ts";
import { analyzeTrajectoryDivergence } from "./trajectoryDivergenceAnalysis.ts";
import { analyzeRecoveryDegradationTrends } from "./recoveryDegradationTrendIntelligence.ts";
import { buildExecutiveTrajectorySemantics } from "./executiveTrajectorySemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logTrajectoryDev } from "./trajectoryDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function trajectoryBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildTrajectoryPanelContract(input: {
  snapshot: PredictiveTrajectorySnapshot;
}): TrajectoryPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.trajectoryDivergenceRecords.length > 0
      ? "predictive_timeline"
      : input.snapshot.state.volatilityHotspots.length > 2
        ? "future_volatility_dashboard"
        : input.snapshot.state.degradationTrajectories.length > 0 &&
            input.snapshot.state.recoveryTrajectories.length > 0
          ? "stabilization_degradation_heatmap"
          : input.snapshot.state.predictiveTrajectoryLabel === "stabilizing"
            ? "executive_trajectory_panel"
            : "trajectory_overlay";

  return Object.freeze({
    trajectoryStateId: input.snapshot.trajectoryStateId,
    topologyId: input.snapshot.topologyId,
    futureStabilityScore: input.snapshot.state.futureStabilityScore,
    predictiveTrajectoryLabel: input.snapshot.state.predictiveTrajectoryLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activeTrajectorySignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          trajectoryState: signal.trajectoryState,
          directionalConfidence: signal.directionalConfidence,
        })
      )
    ),
    divergenceSummaries: Object.freeze(
      input.snapshot.state.trajectoryDivergenceRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate directional future trajectories from current operational conditions (not certain forecasts).
 */
export function evaluateFutureTrajectories(
  input: EvaluateFutureTrajectoriesInput
): EvaluateFutureTrajectoriesResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.predictiveContext?.tick) || 0);
  const trajectoryStateId = String(
    input.trajectoryStateId ?? `predictive-trajectory::${topology.topologyId}::${tick}`
  ).trim();

  const instabilityAccelerationFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.008 +
      (input.predictiveContext?.instabilityAccelerationFactor ?? 0)
  );
  const horizonStressFactor = clamp01Stress(input.predictiveContext?.horizonStressFactor ?? 0);

  logTrajectoryDev("PredictiveFuture", {
    trajectoryStateId,
    topologyId: topology.topologyId,
    tick,
    momentumLabel: input.momentumState.momentumTrendLabel,
    equilibriumLabel: input.equilibriumState.equilibriumLabel,
  });

  const activeTrajectorySignals = deriveFutureTrajectorySignals({
    topology,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    resilienceState: input.resilienceState,
    recoveryState: input.recoveryState,
    coordinationState: input.coordinationState,
    alignmentState: input.alignmentState,
    pressureState: input.pressureState,
    instabilityAccelerationFactor,
    horizonStressFactor,
  });

  const futureStabilityScore = calculateFutureStabilityScore({
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    resilienceState: input.resilienceState,
    signals: activeTrajectorySignals,
  });

  const trajectoryVolatilityScore = calculateTrajectoryVolatilityScore({
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    signals: activeTrajectorySignals,
    horizonStressFactor,
  });

  const trajectoryDivergenceScore = calculateTrajectoryDivergenceScore({
    signals: activeTrajectorySignals,
    momentumState: input.momentumState,
    resilienceState: input.resilienceState,
  });

  const trajectoryDivergenceRecords = analyzeTrajectoryDivergence({
    signals: activeTrajectorySignals,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    resilienceState: input.resilienceState,
    trustState: input.trustState,
    trajectoryDivergenceScore,
  });

  const recoveryDegradationTrendRecords = analyzeRecoveryDegradationTrends({
    topology,
    signals: activeTrajectorySignals,
    momentumState: input.momentumState,
    recoveryState: input.recoveryState,
    pressureState: input.pressureState,
    equilibriumState: input.equilibriumState,
  });

  const momentumFingerprint = stableStringify({
    trend: input.momentumState.momentumTrendLabel,
    score: input.momentumState.organizationalMomentumScore,
  });
  const equilibriumFingerprint = stableStringify({
    label: input.equilibriumState.equilibriumLabel,
    score: input.equilibriumState.equilibriumScore,
  });
  const resilienceFingerprint = stableStringify({
    label: input.resilienceState.resilienceStabilityLabel,
    score: input.resilienceState.enterpriseResilienceScore,
  });

  const pendingFingerprint = buildTrajectoryContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    momentumFingerprint,
    equilibriumFingerprint,
    resilienceFingerprint,
    tick,
  });

  const guard = guardEvaluateFutureTrajectories({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeTrajectorySignals,
    priorTrajectoryFingerprints: input.priorTrajectoryFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const predictiveTrajectoryLabel = classifyPredictiveTrajectoryLabel({
    futureStabilityScore,
    trajectoryVolatilityScore,
    trajectoryDivergenceScore,
  });

  const state: PredictiveTrajectoryState = Object.freeze({
    activeTrajectorySignals: Object.freeze(activeTrajectorySignals),
    trajectoryDivergenceRecords,
    recoveryDegradationTrendRecords,
    degradationTrajectories: identifyPredictiveDegradationTrajectories(activeTrajectorySignals),
    recoveryTrajectories: identifyPredictiveRecoveryTrajectories(activeTrajectorySignals),
    volatilityHotspots: identifyPredictiveVolatilityHotspots(activeTrajectorySignals),
    futureStabilityScore,
    trajectoryVolatilityScore,
    trajectoryDivergenceScore,
    predictiveTrajectoryLabel,
    uncertaintyDisclaimer: UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveTrajectorySemantics({ state });
  const semanticsGuard = guardTrajectoryExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    trajectoryStateId,
    predictiveTrajectoryLabel,
    futureStabilityScore,
    trajectoryVolatilityScore,
  });

  const snapshot: PredictiveTrajectorySnapshot = Object.freeze({
    trajectoryStateId,
    topologyId: topology.topologyId,
    resilienceStateId: `human-system-resilience::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      divergenceSummaries: Object.freeze([...semantics.divergenceSummaries]),
      trendSummaries: Object.freeze([...semantics.trendSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: trajectoryBuiltAt(tick),
  });

  const panelContract = buildTrajectoryPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezePredictiveTrajectorySnapshot(
  snapshot: PredictiveTrajectorySnapshot
): PredictiveTrajectorySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeTrajectorySignals: Object.freeze(
        snapshot.state.activeTrajectorySignals.map((s) => Object.freeze({ ...s }))
      ),
      trajectoryDivergenceRecords: Object.freeze(
        snapshot.state.trajectoryDivergenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      recoveryDegradationTrendRecords: Object.freeze(
        snapshot.state.recoveryDegradationTrendRecords.map((r) => Object.freeze({ ...r }))
      ),
      degradationTrajectories: Object.freeze([...snapshot.state.degradationTrajectories]),
      recoveryTrajectories: Object.freeze([...snapshot.state.recoveryTrajectories]),
      volatilityHotspots: Object.freeze([...snapshot.state.volatilityHotspots]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
