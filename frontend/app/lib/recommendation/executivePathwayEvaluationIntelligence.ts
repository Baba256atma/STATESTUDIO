/**
 * D7:5:4 — Executive pathway evaluation intelligence.
 */

import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type {
  ExecutivePathwayEvaluationRecord,
  StrategyComparisonSignal,
  StrategyPathwayRecord,
} from "./multiStrategyComparisonTypes.ts";
import { logStrategyComparisonDev } from "./comparisonDevLog.ts";

export function analyzeExecutivePathwayEvaluation(input: {
  comparisons: readonly StrategyComparisonSignal[];
  pathwayRecords: readonly StrategyPathwayRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutivePathwayEvaluationRecord[] {
  const records: ExecutivePathwayEvaluationRecord[] = [];

  const strategyA = input.comparisons.find((s) => s.strategyId === "strategy-a");
  const strategyB = input.comparisons.find((s) => s.strategyId === "strategy-b");

  if (strategyA) {
    records.push(
      Object.freeze({
        recordId: "evaluation::logistics-stabilization",
        evaluationDomain: "logistics",
        evaluationStrength: Number(Math.min(0.92, strategyA.comparisonStrength * 0.85).toFixed(4)),
        explanation:
          "Strategy A may provide stronger short-term stabilization across logistics recovery systems.",
        contributingStrategyIds: Object.freeze([strategyA.strategyId]),
      })
    );
  }

  if (strategyB) {
    records.push(
      Object.freeze({
        recordId: "evaluation::adaptive-resilience",
        evaluationDomain: "recovery",
        evaluationStrength: Number(Math.min(0.92, strategyB.comparisonStrength * 0.8).toFixed(4)),
        explanation:
          "Strategy B may increase long-term adaptive resilience across recovery-oriented domains.",
        contributingStrategyIds: Object.freeze([strategyB.strategyId]),
      })
    );
    records.push(
      Object.freeze({
        recordId: "evaluation::coordination-volatility",
        evaluationDomain: "operations",
        evaluationStrength: Number(
          Math.min(
            0.92,
            input.divergenceState.futureFragmentationScore * 0.5 +
              input.trajectoryState.trajectoryVolatilityScore * 0.35
          ).toFixed(4)
        ),
        explanation:
          "Strategy B may introduce higher near-term coordination volatility in operations and manufacturing.",
        contributingStrategyIds: Object.freeze([strategyB.strategyId]),
      })
    );
  }

  const fragilityPathway = input.pathwayRecords.find((p) => p.pathwayType === "fragility_reduction");
  if (fragilityPathway) {
    records.push(
      Object.freeze({
        recordId: "evaluation::finance-exposure",
        evaluationDomain: "finance",
        evaluationStrength: Number(Math.min(0.92, fragilityPathway.pathwayStrength * 0.65).toFixed(4)),
        explanation:
          "Fragility-reduction pathways may shift finance exposure as operational risk is rebalanced.",
        contributingStrategyIds: Object.freeze(fragilityPathway.contributingStrategyIds),
      })
    );
  }

  if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "evaluation::momentum",
        evaluationDomain: "strategic_momentum",
        evaluationStrength: Number(
          Math.min(0.92, input.trajectoryState.trajectoryVolatilityScore * 0.75).toFixed(4)
        ),
        explanation:
          "Competing strategies may reshape strategic momentum differently under accelerating failure conditions.",
        contributingStrategyIds: Object.freeze(input.comparisons.map((s) => s.strategyId)),
      })
    );
  }

  if (input.equilibriumState.equilibriumScore < 0.5) {
    records.push(
      Object.freeze({
        recordId: "evaluation::equilibrium",
        evaluationDomain: "systemic_equilibrium",
        evaluationStrength: Number(
          Math.min(0.92, (1 - input.equilibriumState.equilibriumScore) * 0.7).toFixed(4)
        ),
        explanation:
          "Systemic equilibrium may evolve differently depending on which strategic pathway executives prioritize.",
        contributingStrategyIds: Object.freeze(
          input.comparisons.filter((s) => s.comparisonState === "balanced").map((s) => s.strategyId)
        ),
      })
    );
  }

  logStrategyComparisonDev("PathwayEvaluation", { evaluationRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
