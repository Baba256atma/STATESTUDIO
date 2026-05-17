/**
 * D7:5:3 — Executive decision tradeoff consequence intelligence.
 */

import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type {
  ExecutiveTradeoffConsequenceRecord,
  StrategicCostBenefitRecord,
  StrategicTradeoffSignal,
} from "./tradeoffAnalysisTypes.ts";
import { logTradeoffDev } from "./tradeoffDevLog.ts";

export function analyzeExecutiveTradeoffConsequences(input: {
  tradeoffs: readonly StrategicTradeoffSignal[];
  costBenefitRecords: readonly StrategicCostBenefitRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveTradeoffConsequenceRecord[] {
  const records: ExecutiveTradeoffConsequenceRecord[] = [];

  const logisticsTradeoff = input.tradeoffs.find((t) =>
    t.tradeoffId.includes("logistics-recovery")
  );
  if (logisticsTradeoff) {
    records.push(
      Object.freeze({
        recordId: "consequence::logistics",
        consequenceDomain: "logistics",
        consequenceStrength: Number(
          Math.min(0.92, logisticsTradeoff.tradeoffStrength * 0.85).toFixed(4)
        ),
        explanation:
          "Logistics tradeoffs may reshape dependency-pressure trajectories across manufacturing recovery systems.",
        contributingTradeoffIds: Object.freeze([logisticsTradeoff.tradeoffId]),
      })
    );
  }

  const dependencyCb = input.costBenefitRecords.find((r) =>
    r.recordId.includes("dependency")
  );
  if (dependencyCb) {
    records.push(
      Object.freeze({
        recordId: "consequence::operations",
        consequenceDomain: "operations",
        consequenceStrength: Number(
          Math.min(0.92, dependencyCb.benefitStrength * 0.7 + dependencyCb.costStrength * 0.2).toFixed(4)
        ),
        explanation:
          "Operational simplification tradeoffs may reduce fragility while lowering adaptability across manufacturing operations.",
        contributingTradeoffIds: Object.freeze(dependencyCb.contributingTradeoffIds),
      })
    );
    records.push(
      Object.freeze({
        recordId: "consequence::finance",
        consequenceDomain: "finance",
        consequenceStrength: Number(Math.min(0.92, dependencyCb.costStrength * 0.65).toFixed(4)),
        explanation:
          "Finance exposure may shift as dependency restructuring reallocates operational risk across domains.",
        contributingTradeoffIds: Object.freeze(dependencyCb.contributingTradeoffIds),
      })
    );
  }

  const recoveryTradeoff = input.tradeoffs.find((t) => t.tradeoffId.includes("recovery"));
  if (recoveryTradeoff) {
    records.push(
      Object.freeze({
        recordId: "consequence::recovery",
        consequenceDomain: "recovery",
        consequenceStrength: Number(
          Math.min(0.92, recoveryTradeoff.tradeoffStrength * 0.75).toFixed(4)
        ),
        explanation:
          "Recovery acceleration tradeoffs may influence stabilization timelines and leadership capacity requirements.",
        contributingTradeoffIds: Object.freeze([recoveryTradeoff.tradeoffId]),
      })
    );
  }

  if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "consequence::momentum",
        consequenceDomain: "strategic_momentum",
        consequenceStrength: Number(
          Math.min(0.92, input.trajectoryState.trajectoryVolatilityScore * 0.75).toFixed(4)
        ),
        explanation:
          "Tradeoff choices under failure momentum may materially affect how quickly operational degradation propagates.",
        contributingTradeoffIds: Object.freeze(
          input.tradeoffs
            .filter((t) => t.tradeoffState === "volatile" || t.tradeoffState === "critical")
            .map((t) => t.tradeoffId)
            .slice(0, 4)
        ),
      })
    );
  }

  if (input.equilibriumState.equilibriumScore < 0.5 || input.divergenceState.futureFragmentationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "consequence::equilibrium",
        consequenceDomain: "systemic_equilibrium",
        consequenceStrength: Number(
          Math.min(
            0.92,
            (1 - input.equilibriumState.equilibriumScore) * 0.5 +
              input.divergenceState.futureFragmentationScore * 0.4
          ).toFixed(4)
        ),
        explanation:
          "Systemic equilibrium may shift as executives balance competing stabilization and flexibility tradeoffs.",
        contributingTradeoffIds: Object.freeze(
          input.tradeoffs.filter((t) => t.tradeoffState !== "favorable").map((t) => t.tradeoffId).slice(0, 4)
        ),
      })
    );
  }

  logTradeoffDev("Tradeoff", { consequenceRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
