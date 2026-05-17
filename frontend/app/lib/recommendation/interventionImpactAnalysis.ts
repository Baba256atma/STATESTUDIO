/**
 * D7:5:1 — Intervention-impact analysis for strategic recommendations.
 */

import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type {
  InterventionImpactRecord,
  StrategicRecommendationSignal,
} from "./strategicRecommendationTypes.ts";
import { logRecommendationDev } from "./recommendationDevLog.ts";

export function analyzeInterventionImpact(input: {
  topology: OperationalUniverseTopology;
  recommendations: readonly StrategicRecommendationSignal[];
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  cascadeState: PredictiveCascadeState;
}): readonly InterventionImpactRecord[] {
  const records: InterventionImpactRecord[] = [];

  const logisticsCoordination = input.recommendations.find((r) =>
    r.recommendationId.includes("logistics-coordination")
  );
  if (logisticsCoordination) {
    records.push(
      Object.freeze({
        recordId: "impact::logistics-coordination",
        regionId: "logistics",
        impactType: "cascade_mitigation",
        impactStrength: Number(
          Math.min(
            0.92,
            logisticsCoordination.recommendationStrength * 0.85 +
              input.cascadeState.cascadeAmplificationScore * 0.15
          ).toFixed(4)
        ),
        explanation:
          "Minor logistics coordination improvements may significantly reduce future cascading instability risk across manufacturing recovery systems.",
        contributingRecommendationIds: Object.freeze([logisticsCoordination.recommendationId]),
      })
    );
  }

  const dependencyRec = input.recommendations.find((r) =>
    r.recommendationId.includes("dependency-concentration")
  );
  if (dependencyRec) {
    records.push(
      Object.freeze({
        recordId: "impact::dependency-reduction",
        regionId: "manufacturing",
        impactType: "fragility_reduction",
        impactStrength: Number(
          Math.min(0.92, dependencyRec.recommendationStrength * 0.8).toFixed(4)
        ),
        explanation:
          "Reducing dependency bottlenecks may lower systemic fragility concentration and support stabilization pathways.",
        contributingRecommendationIds: Object.freeze([dependencyRec.recommendationId]),
      })
    );
  }

  const recoverySync = input.recommendations.find((r) =>
    r.recommendationId.includes("recovery-synchronization")
  );
  if (recoverySync) {
    records.push(
      Object.freeze({
        recordId: "impact::recovery-acceleration",
        regionId: "logistics",
        impactType: "recovery_acceleration",
        impactStrength: Number(
          Math.min(
            0.92,
            recoverySync.recommendationStrength * 0.7 +
              input.recoveryOpportunityState.recoveryAccelerationScore * 0.2
          ).toFixed(4)
        ),
        explanation:
          "Accelerating recovery synchronization may strengthen resilience leverage where momentum is stabilizing.",
        contributingRecommendationIds: Object.freeze([recoverySync.recommendationId]),
      })
    );
  }

  if (input.preventionState.criticalCollapseZones.length > 0) {
    const zone = input.preventionState.criticalCollapseZones[0] ?? "logistics";
    records.push(
      Object.freeze({
        recordId: "impact::stabilization-leverage",
        regionId: zone,
        impactType: "stabilization_leverage",
        impactStrength: Number(
          Math.min(0.92, input.preventionState.collapseInterruptionScore + 0.25).toFixed(4)
        ),
        explanation:
          "Low-risk stabilization actions in critical zones may interrupt collapse proximity before escalation.",
        contributingRecommendationIds: Object.freeze(
          input.recommendations
            .filter((r) => r.recommendationState === "preventive" || r.recommendationState === "stabilizing")
            .map((r) => r.recommendationId)
            .slice(0, 3)
        ),
      })
    );
  }

  if (input.recoveryOpportunityState.stabilizationPotentialScore >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "impact::equilibrium-restoration",
        regionId: "finance",
        impactType: "equilibrium_restoration",
        impactStrength: Number(
          Math.min(0.92, input.recoveryOpportunityState.stabilizationPotentialScore * 0.85).toFixed(4)
        ),
        explanation:
          "Equilibrium restoration pathways may emerge where stabilization potential aligns with recovery leverage.",
        contributingRecommendationIds: Object.freeze(
          input.recommendations
            .filter((r) => r.recommendationId.includes("equilibrium"))
            .map((r) => r.recommendationId)
        ),
      })
    );
  }

  for (const region of input.topology.operationalRegions) {
    const regionRecs = input.recommendations.filter((r) =>
      r.affectedRegionIds.includes(region.regionId)
    );
    const highImpact = regionRecs.filter((r) => r.recommendationStrength >= 0.55);
    if (highImpact.length === 0) continue;

    records.push(
      Object.freeze({
        recordId: `impact::region::${region.regionId}`,
        regionId: region.regionId,
        impactType: "stabilization_leverage",
        impactStrength: Number(
          Math.min(
            0.92,
            highImpact.reduce((s, r) => s + r.recommendationStrength, 0) /
              Math.max(1, highImpact.length)
          ).toFixed(4)
        ),
        explanation: `High-impact intervention opportunities may exist in ${region.label} based on current operational intelligence.`,
        contributingRecommendationIds: Object.freeze(highImpact.map((r) => r.recommendationId)),
      })
    );
  }

  logRecommendationDev("Intervention", { impactRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
