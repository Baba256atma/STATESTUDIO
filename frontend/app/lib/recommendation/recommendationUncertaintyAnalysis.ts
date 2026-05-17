/**
 * D7:5:2 — Recommendation uncertainty analysis.
 */

import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type {
  RecommendationConfidenceSignal,
  RecommendationUncertaintyRecord,
} from "./recommendationConfidenceTypes.ts";
import { logConfidenceDev } from "./confidenceDevLog.ts";

export function analyzeRecommendationUncertainty(input: {
  topology: OperationalUniverseTopology;
  signals: readonly RecommendationConfidenceSignal[];
  recommendationState: StrategicRecommendationState;
  foresightState: PredictiveExecutiveForesightState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
}): readonly RecommendationUncertaintyRecord[] {
  const records: RecommendationUncertaintyRecord[] = [];

  if (input.trajectoryState.trajectoryVolatilityScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "uncertainty::predictive-instability",
        regionId: "manufacturing",
        uncertaintyType: "predictive_instability",
        uncertaintyStrength: Number(
          Math.min(0.92, input.trajectoryState.trajectoryVolatilityScore * 0.85).toFixed(4)
        ),
        explanation:
          "Unstable predictive conditions may weaken confidence in trajectory-dependent recommendations.",
        contributingRecommendationIds: Object.freeze(
          input.signals
            .filter((s) => s.confidenceState === "volatile" || s.confidenceState === "uncertain")
            .map((s) => s.recommendationId)
            .slice(0, 4)
        ),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "uncertainty::divergence-amplification",
        regionId: "logistics",
        uncertaintyType: "divergence_amplification",
        uncertaintyStrength: Number(
          Math.min(0.92, input.divergenceState.futureFragmentationScore * 0.8).toFixed(4)
        ),
        explanation:
          "Future operational divergence may amplify uncertainty across manufacturing and logistics recommendations.",
        contributingRecommendationIds: Object.freeze(
          input.recommendationState.activeRecommendations
            .filter((r) => r.recommendationId.includes("logistics") || r.recommendationId.includes("dependency"))
            .map((r) => r.recommendationId)
        ),
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryOpportunityLabel === "stabilizing" &&
    input.divergenceState.futureFragmentationScore >= 0.4
  ) {
    const recoveryRecs = input.recommendationState.activeRecommendations.filter((r) =>
      r.recommendationId.includes("recovery")
    );
    records.push(
      Object.freeze({
        recordId: "uncertainty::recovery-divergence-tension",
        regionId: "manufacturing",
        uncertaintyType: "conflicting_drivers",
        uncertaintyStrength: Number(
          Math.min(
            0.92,
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.4 +
              input.divergenceState.futureFragmentationScore * 0.45
          ).toFixed(4)
        ),
        explanation:
          "Recovery opportunity exists although future divergence remains unstable, yielding moderately supported recommendations.",
        contributingRecommendationIds: Object.freeze(recoveryRecs.map((r) => r.recommendationId)),
      })
    );
  }

  if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "uncertainty::volatile-operations",
        regionId: "logistics",
        uncertaintyType: "volatile_operations",
        uncertaintyStrength: Number(Math.min(0.92, 0.65).toFixed(4)),
        explanation:
          "Volatile operational signals may weaken confidence in stabilization-oriented recommendations.",
        contributingRecommendationIds: Object.freeze(
          input.signals
            .filter((s) => s.confidenceState === "volatile" || s.confidenceState === "low")
            .map((s) => s.recommendationId)
            .slice(0, 3)
        ),
      })
    );
  }

  if (input.equilibriumState.equilibriumScore < 0.4) {
    records.push(
      Object.freeze({
        recordId: "uncertainty::intervention-assumption",
        regionId: "finance",
        uncertaintyType: "intervention_assumption",
        uncertaintyStrength: Number(
          Math.min(0.92, 1 - input.equilibriumState.equilibriumScore).toFixed(4)
        ),
        explanation:
          "Unstable equilibrium may introduce uncertainty into intervention assumptions underlying strategic recommendations.",
        contributingRecommendationIds: Object.freeze(
          input.recommendationState.activeRecommendations
            .filter((r) => r.recommendationState === "preventive" || r.recommendationState === "critical")
            .map((r) => r.recommendationId)
            .slice(0, 3)
        ),
      })
    );
  }

  const lowEvidence = input.signals.filter((s) => s.evidenceStrength < 0.35);
  if (lowEvidence.length > 0) {
    records.push(
      Object.freeze({
        recordId: "uncertainty::insufficient-evidence",
        regionId: lowEvidence[0]?.affectedRegionIds[0] ?? "logistics",
        uncertaintyType: "insufficient_evidence",
        uncertaintyStrength: Number(
          Math.min(
            0.92,
            lowEvidence.reduce((s, sig) => s + (1 - sig.evidenceStrength), 0) /
              Math.max(1, lowEvidence.length)
          ).toFixed(4)
        ),
        explanation:
          "Insufficient operational evidence may limit recommendation reliability for executive decision support.",
        contributingRecommendationIds: Object.freeze(lowEvidence.map((s) => s.recommendationId)),
      })
    );
  }

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const conflicting = regionSignals.filter(
      (s) =>
        (s.dominantConfidenceDrivers ?? []).includes("predictive_uncertainty") &&
        (s.dominantConfidenceDrivers ?? []).includes("resilience_backed")
    );
    if (conflicting.length === 0) continue;

    records.push(
      Object.freeze({
        recordId: `uncertainty::conflicting::${region.regionId}`,
        regionId: region.regionId,
        uncertaintyType: "conflicting_drivers",
        uncertaintyStrength: Number(
          Math.min(
            0.92,
            conflicting.reduce((s, sig) => s + sig.evidenceStrength, 0) /
              Math.max(1, conflicting.length)
          ).toFixed(4)
        ),
        explanation: `Conflicting recommendation drivers in ${region.label} may introduce operational ambiguity.`,
        contributingRecommendationIds: Object.freeze(conflicting.map((s) => s.recommendationId)),
      })
    );
  }

  logConfidenceDev("Uncertainty", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
