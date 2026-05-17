/**
 * D7:5:1 — Executive recommendation influence on future operational trajectories.
 */

import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type {
  ExecutiveRecommendationInfluenceRecord,
  StrategicRecommendationSignal,
} from "./strategicRecommendationTypes.ts";
import { logRecommendationDev } from "./recommendationDevLog.ts";

export function analyzeExecutiveRecommendationInfluence(input: {
  recommendations: readonly StrategicRecommendationSignal[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): readonly ExecutiveRecommendationInfluenceRecord[] {
  const records: ExecutiveRecommendationInfluenceRecord[] = [];

  const logisticsRec = input.recommendations.find((r) =>
    r.recommendationId.includes("logistics")
  );
  if (logisticsRec) {
    records.push(
      Object.freeze({
        recordId: "influence::logistics",
        influenceDomain: "logistics",
        influenceStrength: Number(
          Math.min(0.92, logisticsRec.recommendationStrength * 0.85).toFixed(4)
        ),
        explanation:
          "Logistics coordination recommendations may influence future dependency-pressure trajectories across manufacturing recovery systems.",
        contributingRecommendationIds: Object.freeze([logisticsRec.recommendationId]),
      })
    );
  }

  const recoveryRec = input.recommendations.find((r) =>
    r.recommendationId.includes("recovery")
  );
  if (recoveryRec) {
    records.push(
      Object.freeze({
        recordId: "influence::recovery",
        influenceDomain: "recovery",
        influenceStrength: Number(
          Math.min(
            0.92,
            recoveryRec.recommendationStrength * 0.7 +
              input.recoveryOpportunityState.recoveryAccelerationScore * 0.2
          ).toFixed(4)
        ),
        explanation:
          "Recovery acceleration recommendations may positively influence stabilization trajectories where resilience aligns.",
        contributingRecommendationIds: Object.freeze([recoveryRec.recommendationId]),
      })
    );
  }

  if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "influence::strategic-momentum",
        influenceDomain: "strategic_momentum",
        influenceStrength: Number(
          Math.min(0.92, input.trajectoryState.trajectoryVolatilityScore * 0.75).toFixed(4)
        ),
        explanation:
          "Preventive recommendations may slow strategic momentum degradation if executive action is taken on stabilization advice.",
        contributingRecommendationIds: Object.freeze(
          input.recommendations
            .filter((r) => r.recommendationState === "preventive" || r.recommendationState === "critical")
            .map((r) => r.recommendationId)
            .slice(0, 4)
        ),
      })
    );
  }

  if (input.equilibriumState.equilibriumScore < 0.5) {
    records.push(
      Object.freeze({
        recordId: "influence::equilibrium",
        influenceDomain: "systemic_equilibrium",
        influenceStrength: Number(
          Math.min(0.92, (1 - input.equilibriumState.equilibriumScore) * 0.7).toFixed(4)
        ),
        explanation:
          "Equilibrium restoration recommendations may reshape systemic balance across finance and operational domains.",
        contributingRecommendationIds: Object.freeze(
          input.recommendations
            .filter((r) => (r.dominantRecommendationDrivers ?? []).includes("equilibrium"))
            .map((r) => r.recommendationId)
        ),
      })
    );
  }

  const dependencyRec = input.recommendations.find((r) =>
    r.recommendationId.includes("dependency")
  );
  if (dependencyRec) {
    records.push(
      Object.freeze({
        recordId: "influence::operations",
        influenceDomain: "operations",
        influenceStrength: Number(
          Math.min(0.92, dependencyRec.recommendationStrength * 0.8).toFixed(4)
        ),
        explanation:
          "Operational interventions targeting dependency concentration may reduce instability amplification in manufacturing systems.",
        contributingRecommendationIds: Object.freeze([dependencyRec.recommendationId]),
      })
    );
    records.push(
      Object.freeze({
        recordId: "influence::finance",
        influenceDomain: "finance",
        influenceStrength: Number(
          Math.min(0.92, dependencyRec.recommendationStrength * 0.55).toFixed(4)
        ),
        explanation:
          "Finance-domain exposure may ease as operational dependency pressure is reduced through executive-led coordination.",
        contributingRecommendationIds: Object.freeze([dependencyRec.recommendationId]),
      })
    );
  }

  logRecommendationDev("StrategicAction", { influenceRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
