/**
 * D7:4:5 — Predictive stabilization intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  PredictiveStabilizationRecord,
  RecoveryOpportunitySignal,
} from "./recoveryOpportunityTypes.ts";
import { logRecoveryOpportunityDev } from "./recoveryOpportunityDevLog.ts";

export function analyzePredictiveStabilization(input: {
  topology: OperationalUniverseTopology;
  signals: readonly RecoveryOpportunitySignal[];
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  stabilizationPotentialScore: number;
}): readonly PredictiveStabilizationRecord[] {
  const records: PredictiveStabilizationRecord[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const stabilizing = regionSignals.filter(
      (s) => s.opportunityState === "stabilizing" || s.opportunityState === "accelerating"
    );
    if (stabilizing.length === 0) continue;

    const stabilizationPotential = Number(
      Math.min(
        1,
        stabilizing.reduce((s, sig) => s + sig.opportunityStrength, 0) / stabilizing.length
      ).toFixed(4)
    );

    records.push(
      Object.freeze({
        recordId: `stabilization::${region.regionId}`,
        regionId: region.regionId,
        stabilizationType: "flow_recovery",
        stabilizationPotential,
        explanation: `Recovery opportunities in ${region.label} may reshape future operational evolution toward stabilization.`,
      })
    );
  }

  if (input.momentumState.momentumTrendLabel === "recovering") {
    records.push(
      Object.freeze({
        recordId: "stabilization::momentum-alignment",
        regionId: input.trajectoryState.recoveryTrajectories[0] ?? "logistics",
        stabilizationType: "momentum_alignment",
        stabilizationPotential: Number(
          (
            input.momentumState.recoveryMomentumScore * 0.5 +
            input.stabilizationPotentialScore * 0.5
          ).toFixed(4)
        ),
        explanation:
          "Recovery momentum alignment may propagate stabilization effects across connected operational domains.",
      })
    );
  }

  if (
    input.divergenceState.futureConvergenceScore > 0.45 &&
    input.stabilizationPotentialScore > 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "stabilization::divergence-reduction",
        regionId: input.divergenceState.convergingFutureZones[0] ?? "logistics",
        stabilizationType: "divergence_reduction",
        stabilizationPotential: Number(
          Math.min(
            1,
            input.divergenceState.futureConvergenceScore * 0.55 +
              input.stabilizationPotentialScore * 0.35
          ).toFixed(4)
        ),
        explanation:
          "Reduced dependency pressure and operational flow stabilization may lower future divergence across enterprise branches.",
      })
    );
  }

  if (input.cascadeState.cascadeStabilizationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "stabilization::cascade-dampening",
        regionId: input.cascadeState.stabilizationZones[0] ?? "logistics",
        stabilizationType: "cascade_dampening",
        stabilizationPotential: Number(input.cascadeState.cascadeStabilizationScore.toFixed(4)),
        explanation:
          "Stabilization ripples may dampen cascading consequences and support equilibrium recovery trajectories.",
      })
    );
  }

  if (input.equilibriumState.equilibriumLabel === "recovering") {
    records.push(
      Object.freeze({
        recordId: "stabilization::equilibrium-restoration",
        regionId: input.equilibriumState.stabilityZones[0] ?? "finance",
        stabilizationType: "flow_recovery",
        stabilizationPotential: Number(input.equilibriumState.equilibriumScore.toFixed(4)),
        explanation:
          "Systemic equilibrium restoration potential may accelerate where recovery opportunities align with momentum recovery.",
      })
    );
  }

  if (records.length === 0 && input.signals.length > 0) {
    records.push(
      Object.freeze({
        recordId: "stabilization::enterprise-emerging",
        regionId: input.topology.operationalRegions[0]?.regionId ?? "logistics",
        stabilizationType: "flow_recovery",
        stabilizationPotential: Number(input.stabilizationPotentialScore.toFixed(4)),
        explanation:
          "Limited stabilization potential may emerge as recovery opportunity signals develop across the operational universe.",
      })
    );
  }

  logRecoveryOpportunityDev("StabilizationPotential", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
