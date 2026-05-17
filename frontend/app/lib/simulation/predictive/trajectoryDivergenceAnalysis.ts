/**
 * D7:4:1 — Trajectory divergence analysis.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type {
  FutureTrajectorySignal,
  TrajectoryDivergenceRecord,
} from "./futureTrajectoryTypes.ts";
import { logTrajectoryDev } from "./trajectoryDevLog.ts";

export function analyzeTrajectoryDivergence(input: {
  signals: readonly FutureTrajectorySignal[];
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  trustState?: OrganizationalTrustState;
  trajectoryDivergenceScore: number;
}): readonly TrajectoryDivergenceRecord[] {
  const records: TrajectoryDivergenceRecord[] = [];

  const momentumRecovering = input.momentumState.momentumTrendLabel === "recovering";
  const trustDegrading =
    input.trustState &&
    (input.trustState.trustStabilityLabel === "degrading" ||
      input.trustState.trustStabilityLabel === "critical");

  if (momentumRecovering && trustDegrading) {
    records.push(
      Object.freeze({
        recordId: "divergence::momentum-trust",
        sourceDimension: "operational_recovery",
        targetDimension: "trust_stability",
        divergenceScore: Number(Math.min(1, input.trajectoryDivergenceScore + 0.2).toFixed(4)),
        explanation:
          "Operational recovery movement may improve while trust stability declines, indicating divergent trajectory patterns.",
        contributingSignalIds: Object.freeze(
          input.signals.map((s) => s.signalId).slice(0, 6)
        ),
      })
    );
  }

  const recoveringSignals = input.signals.filter((s) => s.trajectoryState === "recovering");
  const degradingSignals = input.signals.filter(
    (s) => s.trajectoryState === "degrading" || s.trajectoryState === "critical"
  );
  if (recoveringSignals.length > 0 && degradingSignals.length > 0) {
    records.push(
      Object.freeze({
        recordId: "divergence::mixed-futures",
        sourceDimension: "recovery_trajectory",
        targetDimension: "degradation_trajectory",
        divergenceScore: Number(input.trajectoryDivergenceScore.toFixed(4)),
        explanation:
          "Conflicting momentum directions suggest diverging operational futures across regions.",
        contributingSignalIds: Object.freeze(
          [...recoveringSignals, ...degradingSignals].map((s) => s.signalId).slice(0, 8)
        ),
      })
    );
  }

  if (
    input.equilibriumState.equilibriumLabel === "critical_imbalance" &&
    input.resilienceState.resilienceStabilityLabel === "adaptive"
  ) {
    records.push(
      Object.freeze({
        recordId: "divergence::equilibrium-resilience",
        sourceDimension: "systemic_equilibrium",
        targetDimension: "human_system_resilience",
        divergenceScore: Number(
          Math.min(1, input.equilibriumState.instabilityDriftScore + 0.15).toFixed(4)
        ),
        explanation:
          "Human-system resilience may strengthen while systemic equilibrium remains under strain.",
        contributingSignalIds: Object.freeze([]),
      })
    );
  }

  if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "divergence::instability-path",
        sourceDimension: "momentum",
        targetDimension: "instability",
        divergenceScore: Number(
          Math.min(1, input.momentumState.organizationalInertiaScore + 0.25).toFixed(4)
        ),
        explanation:
          "An emerging instability acceleration path may develop under current momentum conditions.",
        contributingSignalIds: Object.freeze(
          degradingSignals.map((s) => s.signalId)
        ),
      })
    );
  }

  logTrajectoryDev("TrajectoryDrift", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
