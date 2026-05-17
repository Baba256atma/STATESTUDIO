/**
 * D7:6:3 — Executive stability intelligence (cognitive load balancing).
 */

import type {
  ExecutiveCognitiveLoadSignal,
  ExecutiveStabilityRecord,
  OverloadDistributionRecord,
  SignalDensityRecord,
} from "./executiveCognitiveLoadTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveCognitiveLoadBalancingDev } from "./cognitiveLoadBalancingDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveStability(input: {
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
  densityRecords: readonly SignalDensityRecord[];
  distributionRecords: readonly OverloadDistributionRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveStabilityRecord[] {
  const records: ExecutiveStabilityRecord[] = [];
  const loadIds = input.loadSignals.map((l) => l.loadId);

  const focusBalancing = input.densityRecords.find((r) =>
    r.recordId.includes("strategic-focus-balancing")
  );
  const predictiveDensity = input.densityRecords.find((r) =>
    r.recordId.includes("predictive-complexity")
  );

  records.push(
    Object.freeze({
      recordId: "stability::operations",
      stabilityDomain: "operations",
      stabilityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (focusBalancing?.densityStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational stability may improve when cognitive load balancing distributes workload across enterprise intelligence surfaces.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::logistics",
      stabilityDomain: "logistics",
      stabilityStrength: clamp01(predictiveDensity?.densityStrength ?? 0.4),
      explanation:
        "Logistics stability may benefit when recovery-fragility escalation is balanced against predictive instability across distribution networks.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::finance",
      stabilityDomain: "finance",
      stabilityStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial stability may strengthen when equilibrium recovery reduces cognitive intensity across investment pathways.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::recovery",
      stabilityDomain: "recovery",
      stabilityStrength: clamp01(
        (focusBalancing?.densityStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system stability may improve when cognitive balancing prioritizes stabilization leverage before complexity expands.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::strategic-momentum",
      stabilityDomain: "strategic_momentum",
      stabilityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum stability may reflect how balanced cognitive load supports enterprise evolution under executive control.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::systemic-equilibrium",
      stabilityDomain: "systemic_equilibrium",
      stabilityStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.distributionRecords[0]?.distributionStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium stability may preserve decision quality when overload distribution remains within executive-controlled bounds.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
    })
  );

  logExecutiveCognitiveLoadBalancingDev("ExecutiveStability", {
    stabilityRecordCount: records.length,
    distributionCount: input.distributionRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
