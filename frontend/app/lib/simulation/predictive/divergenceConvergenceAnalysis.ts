/**
 * D7:4:2 — Divergence and convergence analysis.
 */

import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  DivergenceConvergenceRecord,
  FutureBranchRecord,
  FutureDivergenceSignal,
} from "./multiFutureDivergenceTypes.ts";
import { CANONICAL_FUTURE_BRANCH_IDS } from "./futureBranchEvolutionModel.ts";
import { logDivergenceDev } from "./divergenceDevLog.ts";

export function analyzeDivergenceConvergence(input: {
  branches: readonly FutureBranchRecord[];
  signals: readonly FutureDivergenceSignal[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  leadershipState?: LeadershipDynamicsState;
  futureConvergenceScore: number;
  futureFragmentationScore: number;
}): readonly DivergenceConvergenceRecord[] {
  const records: DivergenceConvergenceRecord[] = [];

  const stabilization = input.branches.find(
    (b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.stabilization
  );
  const degradation = input.branches.find(
    (b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.degradation
  );

  if (
    stabilization &&
    degradation &&
    stabilization.branchStrength > 0.5 &&
    degradation.branchStrength > 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "convergence::stabilization-degradation-tension",
        sourceBranchId: CANONICAL_FUTURE_BRANCH_IDS.stabilization,
        targetBranchId: CANONICAL_FUTURE_BRANCH_IDS.degradation,
        convergenceScore: Number(input.futureConvergenceScore.toFixed(4)),
        explanation:
          "Stabilization and degradation futures remain in tension, indicating an unstable future divergence pattern.",
        contributingSignalIds: Object.freeze(
          input.signals.map((s) => s.signalId).slice(0, 6)
        ),
      })
    );
  }

  if (
    input.momentumState.momentumTrendLabel !== "accelerating_failure" &&
    input.trajectoryState.predictiveTrajectoryLabel === "stabilizing" &&
    stabilization &&
    stabilization.branchStrength >= 0.55
  ) {
    records.push(
      Object.freeze({
        recordId: "convergence::operational-alignment",
        sourceBranchId: CANONICAL_FUTURE_BRANCH_IDS.stabilization,
        targetBranchId: CANONICAL_FUTURE_BRANCH_IDS.recovery,
        convergenceScore: Number(
          Math.min(1, input.futureConvergenceScore + 0.15).toFixed(4)
        ),
        explanation:
          "Operational stabilization may be converging toward a shared recovery future across coordinated regions.",
        contributingSignalIds: Object.freeze([]),
      })
    );
  }

  const leadershipSaturated =
    input.leadershipState?.leadershipDynamicsLabel === "saturated" ||
    (input.leadershipState?.leadershipBurdenScore ?? 0) >= 0.75;

  if (
    leadershipSaturated &&
    input.trajectoryState.futureStabilityScore > 0.45 &&
    input.trajectoryState.trajectoryVolatilityScore < 0.55
  ) {
    records.push(
      Object.freeze({
        recordId: "convergence::leadership-overload-divergence",
        sourceBranchId: CANONICAL_FUTURE_BRANCH_IDS.stabilization,
        targetBranchId: CANONICAL_FUTURE_BRANCH_IDS.volatileHybrid,
        convergenceScore: Number(
          Math.min(1, input.futureFragmentationScore + 0.2).toFixed(4)
        ),
        explanation:
          "Operational stabilization may improve while leadership overload increases, suggesting unstable future divergence.",
        contributingSignalIds: Object.freeze(
          input.signals
            .filter((s) => s.divergenceState === "volatile_split")
            .map((s) => s.signalId)
        ),
      })
    );
  }

  const fragmentingSignals = input.signals.filter(
    (s) => s.divergenceState === "fragmenting" || s.divergenceState === "critical"
  );
  if (fragmentingSignals.length > 0 && input.futureFragmentationScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "convergence::future-fragmentation",
        sourceBranchId: CANONICAL_FUTURE_BRANCH_IDS.degradation,
        targetBranchId: CANONICAL_FUTURE_BRANCH_IDS.volatileHybrid,
        convergenceScore: Number(input.futureFragmentationScore.toFixed(4)),
        explanation:
          "Future fragmentation may expand as instability amplifies separation between operational branches.",
        contributingSignalIds: Object.freeze(fragmentingSignals.map((s) => s.signalId)),
      })
    );
  }

  logDivergenceDev("Convergence", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
