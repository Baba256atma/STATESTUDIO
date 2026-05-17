/**
 * D7:4:2 — Multi-future divergence intelligence engine (immutable, non-mutating).
 */

import type {
  EvaluateFutureDivergenceInput,
  EvaluateFutureDivergenceResult,
  DivergencePanelContract,
  MultiFutureDivergenceSnapshot,
  MultiFutureDivergenceState,
} from "./multiFutureDivergenceTypes.ts";
import {
  buildDivergenceContentFingerprint,
  DIVERGENCE_UNCERTAINTY_DISCLAIMER,
  guardDivergenceExecutiveSemantics,
  guardEvaluateFutureDivergence,
} from "./divergenceGuards.ts";
import {
  calculateFutureConvergenceScore,
  calculateFutureFragmentationScore,
  calculateFutureVolatilityScore,
  classifyMultiFutureDivergenceLabel,
  deriveFutureBranches,
  deriveFutureDivergenceSignals,
  identifyConvergingFutureZones,
  identifyDegradationFutureBranches,
  identifyFragmentedFutureZones,
  identifyStabilizationFutureBranches,
} from "./futureBranchEvolutionModel.ts";
import { analyzeDivergenceConvergence } from "./divergenceConvergenceAnalysis.ts";
import { analyzeStrategicFutureSeparation } from "./strategicFutureSeparationIntelligence.ts";
import { buildExecutiveDivergenceSemantics } from "./executiveDivergenceSemantics.ts";
import { logDivergenceDev } from "./divergenceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function divergenceBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildDivergencePanelContract(input: {
  snapshot: MultiFutureDivergenceSnapshot;
}): DivergencePanelContract {
  const viewHint =
    input.snapshot.state.divergenceConvergenceRecords.length > 0
      ? "convergence_dashboard"
      : input.snapshot.state.fragmentedFutureZones.length > 2
        ? "divergence_heatmap"
        : input.snapshot.state.futureBranches.length > 3
          ? "future_branch_timeline"
          : input.snapshot.state.multiFutureDivergenceLabel === "converging"
            ? "executive_future_comparison_panel"
            : "multi_future_overlay";

  return Object.freeze({
    divergenceStateId: input.snapshot.divergenceStateId,
    topologyId: input.snapshot.topologyId,
    futureVolatilityScore: input.snapshot.state.futureVolatilityScore,
    multiFutureDivergenceLabel: input.snapshot.state.multiFutureDivergenceLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    branches: Object.freeze(
      input.snapshot.state.futureBranches.slice(0, 8).map((branch) =>
        Object.freeze({
          branchId: branch.branchId,
          label: branch.branchLabel,
          branchStrength: branch.branchStrength,
        })
      )
    ),
    divergenceSummaries: Object.freeze(
      input.snapshot.state.divergenceConvergenceRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate multi-future divergence from trajectory and operational conditions (not guaranteed outcomes).
 */
export function evaluateFutureDivergence(
  input: EvaluateFutureDivergenceInput
): EvaluateFutureDivergenceResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.divergenceContext?.tick) || 0);
  const divergenceStateId = String(
    input.divergenceStateId ?? `multi-future-divergence::${topology.topologyId}::${tick}`
  ).trim();

  const branchAmplificationFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.006 +
      (input.divergenceContext?.branchAmplificationFactor ?? 0)
  );
  const fragmentationStressFactor = clamp01Stress(
    input.divergenceContext?.fragmentationStressFactor ?? 0
  );

  logDivergenceDev("FutureDivergence", {
    divergenceStateId,
    topologyId: topology.topologyId,
    tick,
    trajectoryLabel: input.trajectoryState.predictiveTrajectoryLabel,
  });

  const futureBranches = deriveFutureBranches({
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    resilienceState: input.resilienceState,
    coordinationState: input.coordinationState,
    alignmentState: input.alignmentState,
    pressureState: input.pressureState,
    trustState: input.trustState,
    branchAmplificationFactor,
  });

  const activeDivergenceSignals = deriveFutureDivergenceSignals({
    branches: futureBranches,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    resilienceState: input.resilienceState,
    fragmentationStressFactor,
  });

  const futureVolatilityScore = calculateFutureVolatilityScore({
    trajectoryState: input.trajectoryState,
    branches: futureBranches,
    fragmentationStressFactor,
  });

  const futureFragmentationScore = calculateFutureFragmentationScore({
    branches: futureBranches,
    trajectoryState: input.trajectoryState,
  });

  const futureConvergenceScore = calculateFutureConvergenceScore({
    branches: futureBranches,
    signals: activeDivergenceSignals,
  });

  const divergenceConvergenceRecords = analyzeDivergenceConvergence({
    branches: futureBranches,
    signals: activeDivergenceSignals,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    leadershipState: input.leadershipState,
    futureConvergenceScore,
    futureFragmentationScore,
  });

  const strategicFutureSeparationRecords = analyzeStrategicFutureSeparation({
    topology,
    branches: futureBranches,
    trajectoryState: input.trajectoryState,
    pressureState: input.pressureState,
    equilibriumState: input.equilibriumState,
  });

  const trajectoryFingerprint = stableStringify({
    label: input.trajectoryState.predictiveTrajectoryLabel,
    stability: input.trajectoryState.futureStabilityScore,
    divergence: input.trajectoryState.trajectoryDivergenceScore,
  });
  const momentumFingerprint = stableStringify({
    trend: input.momentumState.momentumTrendLabel,
    score: input.momentumState.organizationalMomentumScore,
  });
  const resilienceFingerprint = stableStringify({
    label: input.resilienceState.resilienceStabilityLabel,
    score: input.resilienceState.enterpriseResilienceScore,
  });

  const pendingFingerprint = buildDivergenceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    trajectoryFingerprint,
    momentumFingerprint,
    resilienceFingerprint,
    tick,
  });

  const knownBranchIds = futureBranches.map((b) => b.branchId);
  const guard = guardEvaluateFutureDivergence({
    topologyId: topology.topologyId,
    knownBranchIds,
    signals: activeDivergenceSignals,
    branches: futureBranches,
    priorDivergenceFingerprints: input.priorDivergenceFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const multiFutureDivergenceLabel = classifyMultiFutureDivergenceLabel({
    futureConvergenceScore,
    futureFragmentationScore,
    futureVolatilityScore,
  });

  const state: MultiFutureDivergenceState = Object.freeze({
    activeDivergenceSignals: Object.freeze(activeDivergenceSignals),
    futureBranches: Object.freeze(futureBranches),
    divergenceConvergenceRecords,
    strategicFutureSeparationRecords,
    convergingFutureZones: identifyConvergingFutureZones(futureBranches),
    fragmentedFutureZones: identifyFragmentedFutureZones(
      futureBranches,
      input.trajectoryState
    ),
    stabilizationFutureBranches: identifyStabilizationFutureBranches(futureBranches),
    degradationFutureBranches: identifyDegradationFutureBranches(futureBranches),
    futureVolatilityScore,
    futureFragmentationScore,
    futureConvergenceScore,
    multiFutureDivergenceLabel,
    uncertaintyDisclaimer: DIVERGENCE_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveDivergenceSemantics({ state });
  const semanticsGuard = guardDivergenceExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    divergenceStateId,
    multiFutureDivergenceLabel,
    futureVolatilityScore,
    futureFragmentationScore,
  });

  const snapshot: MultiFutureDivergenceSnapshot = Object.freeze({
    divergenceStateId,
    topologyId: topology.topologyId,
    trajectoryStateId: `predictive-trajectory::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      branchSummaries: Object.freeze([...semantics.branchSummaries]),
      convergenceSummaries: Object.freeze([...semantics.convergenceSummaries]),
      separationSummaries: Object.freeze([...semantics.separationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: divergenceBuiltAt(tick),
  });

  const panelContract = buildDivergencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeMultiFutureDivergenceSnapshot(
  snapshot: MultiFutureDivergenceSnapshot
): MultiFutureDivergenceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeDivergenceSignals: Object.freeze(
        snapshot.state.activeDivergenceSignals.map((s) => Object.freeze({ ...s }))
      ),
      futureBranches: Object.freeze(
        snapshot.state.futureBranches.map((b) => Object.freeze({ ...b }))
      ),
      divergenceConvergenceRecords: Object.freeze(
        snapshot.state.divergenceConvergenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicFutureSeparationRecords: Object.freeze(
        snapshot.state.strategicFutureSeparationRecords.map((r) => Object.freeze({ ...r }))
      ),
      convergingFutureZones: Object.freeze([...snapshot.state.convergingFutureZones]),
      fragmentedFutureZones: Object.freeze([...snapshot.state.fragmentedFutureZones]),
      stabilizationFutureBranches: Object.freeze([
        ...snapshot.state.stabilizationFutureBranches,
      ]),
      degradationFutureBranches: Object.freeze([...snapshot.state.degradationFutureBranches]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
