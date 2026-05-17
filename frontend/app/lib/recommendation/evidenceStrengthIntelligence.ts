/**
 * D7:5:2 — Evidence-strength intelligence for recommendation confidence.
 */

import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type {
  EvidenceStrengthRecord,
  RecommendationConfidenceSignal,
} from "./recommendationConfidenceTypes.ts";
import { logConfidenceDev } from "./confidenceDevLog.ts";

export function analyzeEvidenceStrength(input: {
  signals: readonly RecommendationConfidenceSignal[];
  recommendationState: StrategicRecommendationState;
  foresightState: PredictiveExecutiveForesightState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  resilienceState: HumanSystemResilienceState;
  equilibriumState: EnterpriseEquilibriumState;
}): readonly EvidenceStrengthRecord[] {
  const records: EvidenceStrengthRecord[] = [];

  const logisticsRec = input.recommendationState.activeRecommendations.find((r) =>
    r.recommendationId.includes("logistics")
  );
  if (logisticsRec) {
    const logisticsSignal = input.signals.find((s) =>
      s.recommendationId === logisticsRec.recommendationId
    );
    records.push(
      Object.freeze({
        recordId: "evidence::logistics",
        evidenceDomain: "logistics",
        evidenceStrength: Number(
          Math.min(0.92, (logisticsSignal?.evidenceStrength ?? logisticsRec.recommendationStrength) * 0.85).toFixed(4)
        ),
        explanation:
          "Logistics-domain evidence quality may influence confidence in coordination stabilization recommendations.",
        contributingRecommendationIds: Object.freeze([logisticsRec.recommendationId]),
      })
    );
  }

  const recoveryRec = input.recommendationState.activeRecommendations.find((r) =>
    r.recommendationId.includes("recovery")
  );
  if (recoveryRec) {
    records.push(
      Object.freeze({
        recordId: "evidence::recovery",
        evidenceDomain: "recovery",
        evidenceStrength: Number(
          Math.min(
            0.92,
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.5 +
              input.resilienceState.enterpriseResilienceScore * 0.35
          ).toFixed(4)
        ),
        explanation:
          "Stable recovery trajectories with consistent resilience indicators may strengthen recommendation confidence.",
        contributingRecommendationIds: Object.freeze([recoveryRec.recommendationId]),
      })
    );
  }

  const dependencyRec = input.recommendationState.activeRecommendations.find((r) =>
    r.recommendationId.includes("dependency")
  );
  if (dependencyRec) {
    records.push(
      Object.freeze({
        recordId: "evidence::operations",
        evidenceDomain: "operations",
        evidenceStrength: Number(
          Math.min(0.92, dependencyRec.recommendationStrength * 0.8).toFixed(4)
        ),
        explanation:
          "Operational evidence on dependency concentration may support preventive recommendations when pressure signals align.",
        contributingRecommendationIds: Object.freeze([dependencyRec.recommendationId]),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "evidence::predictive-stability",
      evidenceDomain: "predictive_stability",
      evidenceStrength: Number(
        Math.min(
          0.92,
          (1 - input.trajectoryState.trajectoryVolatilityScore) * 0.5 +
            input.divergenceState.futureConvergenceScore * 0.4
        ).toFixed(4)
      ),
      explanation:
        "Predictive stability across trajectories and divergence branches affects overall recommendation reliability.",
      contributingRecommendationIds: Object.freeze(
        input.signals
          .filter((s) => s.confidenceState === "high" || s.confidenceState === "moderate")
          .map((s) => s.recommendationId)
          .slice(0, 4)
      ),
    })
  );

  records.push(
    Object.freeze({
      recordId: "evidence::equilibrium",
      evidenceDomain: "systemic_equilibrium",
      evidenceStrength: Number(
        Math.min(0.92, input.equilibriumState.equilibriumScore * 0.85).toFixed(4)
      ),
      explanation:
        "Systemic equilibrium quality may raise or lower executive confidence in equilibrium-restoration recommendations.",
      contributingRecommendationIds: Object.freeze(
        input.recommendationState.activeRecommendations
          .filter((r) => (r.dominantRecommendationDrivers ?? []).includes("equilibrium"))
          .map((r) => r.recommendationId)
      ),
    })
  );

  if (input.foresightState.strategicPreparednessScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "evidence::finance",
        evidenceDomain: "finance",
        evidenceStrength: Number(
          Math.min(0.92, input.foresightState.strategicPreparednessScore * 0.7).toFixed(4)
        ),
        explanation:
          "Finance-domain exposure may be indirectly supported when foresight preparedness aligns with operational evidence.",
        contributingRecommendationIds: Object.freeze(
          input.signals
            .filter((s) => s.affectedRegionIds.includes("finance"))
            .map((s) => s.recommendationId)
        ),
      })
    );
  }

  logConfidenceDev("EvidenceStrength", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
