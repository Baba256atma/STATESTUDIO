/**
 * D7:5:4 — Divergence comparison analysis across strategic pathways.
 */

import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type {
  StrategyComparisonSignal,
  StrategyDivergenceComparisonRecord,
} from "./multiStrategyComparisonTypes.ts";
import { logStrategyComparisonDev } from "./comparisonDevLog.ts";

export function analyzeStrategyDivergenceComparison(input: {
  comparisons: readonly StrategyComparisonSignal[];
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  adaptationState: PredictiveStrategicAdaptationState;
}): readonly StrategyDivergenceComparisonRecord[] {
  const records: StrategyDivergenceComparisonRecord[] = [];

  const strategyA = input.comparisons.find((s) => s.strategyId === "strategy-a");
  const strategyB = input.comparisons.find((s) => s.strategyId === "strategy-b");

  if (strategyA && strategyB) {
    records.push(
      Object.freeze({
        recordId: "divergence::stabilization-vs-adaptive",
        comparisonType: "flexibility_stability",
        divergenceStrength: Number(
          Math.min(
            0.92,
            Math.abs(strategyA.comparisonStrength - strategyB.comparisonStrength) * 0.85
          ).toFixed(4)
        ),
        explanation:
          "Strategy A emphasizes stabilization while Strategy B increases adaptive resilience with higher near-term coordination volatility.",
        strategyIds: Object.freeze([strategyA.strategyId, strategyB.strategyId]),
      })
    );
  }

  if (strategyB) {
    records.push(
      Object.freeze({
        recordId: "divergence::restructuring-long-term",
        comparisonType: "short_long_term",
        divergenceStrength: Number(
          Math.min(
            0.92,
            input.adaptationState.adaptiveResilienceScore * 0.5 +
              input.divergenceState.futureFragmentationScore * 0.35
          ).toFixed(4)
        ),
        explanation:
          "Aggressive restructuring may improve long-term resilience although short-term instability exposure may increase.",
        strategyIds: Object.freeze([strategyB.strategyId]),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "divergence::resilience-risk",
        comparisonType: "resilience_risk_asymmetry",
        divergenceStrength: Number(
          Math.min(0.92, input.divergenceState.futureFragmentationScore * 0.8).toFixed(4)
        ),
        explanation:
          "Competing future pathways may create resilience and risk asymmetry across manufacturing and logistics domains.",
        strategyIds: Object.freeze(input.comparisons.map((s) => s.strategyId)),
      })
    );
  }

  if (input.trajectoryState.trajectoryVolatilityScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "divergence::strategic-volatility",
        comparisonType: "strategic_volatility",
        divergenceStrength: Number(
          Math.min(0.92, input.trajectoryState.trajectoryVolatilityScore * 0.85).toFixed(4)
        ),
        explanation:
          "Strategic volatility patterns may widen differences between stabilization-first and adaptive pathways.",
        strategyIds: Object.freeze(
          input.comparisons
            .filter((s) => s.comparisonState === "volatile" || s.comparisonState === "adaptive")
            .map((s) => s.strategyId)
        ),
      })
    );
  }

  const strategyC = input.comparisons.find((s) => s.strategyId === "strategy-c");
  if (strategyC && strategyA) {
    records.push(
      Object.freeze({
        recordId: "divergence::recovery-speed",
        comparisonType: "recovery_speed",
        divergenceStrength: Number(
          Math.min(
            0.92,
            Math.abs(strategyC.comparisonStrength - strategyA.comparisonStrength) * 0.7
          ).toFixed(4)
        ),
        explanation:
          "Recovery-speed differences may emerge between balanced coordination and stabilization-first pathways.",
        strategyIds: Object.freeze([strategyC.strategyId, strategyA.strategyId]),
      })
    );
  }

  logStrategyComparisonDev("FutureComparison", { divergenceRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
