/**
 * D7:5:3 — Competing-objective tradeoff analysis.
 */

import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type {
  CompetingObjectiveRecord,
  StrategicTradeoffSignal,
} from "./tradeoffAnalysisTypes.ts";
import { logTradeoffDev } from "./tradeoffDevLog.ts";

export function analyzeCompetingObjectives(input: {
  tradeoffs: readonly StrategicTradeoffSignal[];
  adaptationState: PredictiveStrategicAdaptationState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  divergenceState: MultiFutureDivergenceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
}): readonly CompetingObjectiveRecord[] {
  const records: CompetingObjectiveRecord[] = [];

  if (
    input.adaptationState.strategicFlexibilityScore < 0.45 &&
    input.adaptationState.adaptiveResilienceScore >= 0.35
  ) {
    records.push(
      Object.freeze({
        recordId: "objective::resilience-flexibility",
        objectiveTension: "resilience_vs_flexibility",
        tensionStrength: Number(
          Math.min(
            0.92,
            input.adaptationState.adaptiveResilienceScore * 0.5 +
              (1 - input.adaptationState.strategicFlexibilityScore) * 0.4
          ).toFixed(4)
        ),
        explanation:
          "Resilience strengthening may compete with operational flexibility under sustained adaptation pressure.",
        contributingTradeoffIds: Object.freeze(
          input.tradeoffs
            .filter((t) =>
              (t.dominantTradeoffDrivers ?? []).includes("flexibility_sacrifice")
            )
            .map((t) => t.tradeoffId)
        ),
      })
    );
  }

  if (input.equilibriumState.equilibriumScore < 0.5 && input.momentumState.momentumTrendLabel !== "recovering") {
    records.push(
      Object.freeze({
        recordId: "objective::stability-growth",
        objectiveTension: "stability_vs_growth",
        tensionStrength: Number(
          Math.min(0.92, (1 - input.equilibriumState.equilibriumScore) * 0.75).toFixed(4)
        ),
        explanation:
          "Stability-oriented actions may trade off against growth momentum when equilibrium remains fragile.",
        contributingTradeoffIds: Object.freeze(
          input.tradeoffs.filter((t) => t.tradeoffState === "strained").map((t) => t.tradeoffId).slice(0, 3)
        ),
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryAccelerationScore >= 0.35 &&
    input.recoveryOpportunityState.stabilizationPotentialScore < 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "objective::recovery-efficiency",
        objectiveTension: "recovery_vs_efficiency",
        tensionStrength: Number(
          Math.min(
            0.92,
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.55 +
              (1 - input.recoveryOpportunityState.stabilizationPotentialScore) * 0.35
          ).toFixed(4)
        ),
        explanation:
          "Rapid recovery acceleration may trade off against operational efficiency until stabilization potential strengthens.",
        contributingTradeoffIds: Object.freeze(
          input.tradeoffs
            .filter((t) => (t.dominantTradeoffDrivers ?? []).includes("recovery_acceleration"))
            .map((t) => t.tradeoffId)
        ),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "objective::coordination-agility",
        objectiveTension: "coordination_vs_agility",
        tensionStrength: Number(
          Math.min(0.92, input.divergenceState.futureFragmentationScore * 0.8).toFixed(4)
        ),
        explanation:
          "Increased coordination oversight may conflict with organizational agility when futures remain fragmented.",
        contributingTradeoffIds: Object.freeze(
          input.tradeoffs
            .filter((t) => t.tradeoffId.includes("recovery") || t.tradeoffId.includes("logistics"))
            .map((t) => t.tradeoffId)
        ),
      })
    );
  }

  const recoveryAcceleration = input.tradeoffs.find((t) =>
    t.tradeoffId.includes("recovery-coordination")
  );
  if (recoveryAcceleration) {
    records.push(
      Object.freeze({
        recordId: "objective::short-long-term",
        objectiveTension: "short_term_vs_long_term",
        tensionStrength: Number(Math.min(0.92, recoveryAcceleration.tradeoffStrength * 0.85).toFixed(4)),
        explanation:
          "Rapid recovery acceleration may increase short-term operational fragility while supporting longer-term stabilization.",
        contributingTradeoffIds: Object.freeze([recoveryAcceleration.tradeoffId]),
      })
    );
  }

  logTradeoffDev("CompetingObjectives", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
