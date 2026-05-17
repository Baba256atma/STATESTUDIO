/**
 * D7:4:8 — Long-horizon executive foresight analysis.
 */

import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveStrategicAdaptationState } from "./strategicAdaptationTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  ExecutiveForesightSignal,
  LongHorizonForesightRecord,
} from "./executiveForesightTypes.ts";
import { logForesightDev } from "./foresightDevLog.ts";

export function analyzeLongHorizonForesight(input: {
  topology: OperationalUniverseTopology;
  signals: readonly ExecutiveForesightSignal[];
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  preventionState: PredictiveCollapsePreventionState;
  adaptationState: PredictiveStrategicAdaptationState;
}): readonly LongHorizonForesightRecord[] {
  const records: LongHorizonForesightRecord[] = [];

  const repeatedStrain =
    input.preventionState.criticalThresholdProximityScore >= 0.45 ||
    input.cascadeState.cascadeAmplificationScore >= 0.45;

  if (repeatedStrain) {
    records.push(
      Object.freeze({
        recordId: "long-horizon::structural-fragility",
        regionId: "logistics",
        horizonType: "instability_trajectory",
        horizonStrength: Number(
          Math.min(
            0.92,
            input.preventionState.criticalThresholdProximityScore * 0.5 +
              input.cascadeState.cascadeAmplificationScore * 0.4
          ).toFixed(4)
        ),
        explanation:
          "Repeated dependency strain may indicate future structural equilibrium instability across logistics dependency systems.",
        contributingSignalIds: Object.freeze(
          input.signals
            .filter((s) => s.foresightState === "volatile" || s.foresightState === "critical")
            .map((s) => s.signalId)
            .slice(0, 4)
        ),
      })
    );
  }

  if (
    input.adaptationState.predictiveAdaptationLabel === "flexible" ||
    input.adaptationState.predictiveAdaptationLabel === "adaptive"
  ) {
    records.push(
      Object.freeze({
        recordId: "long-horizon::resilience-evolution",
        regionId: "manufacturing",
        horizonType: "resilience_evolution",
        horizonStrength: Number(
          Math.min(0.92, input.adaptationState.adaptiveResilienceScore * 0.85).toFixed(4)
        ),
        explanation:
          "Improving coordination resilience may strengthen long-horizon stabilization foresight across manufacturing and logistics domains.",
        contributingSignalIds: Object.freeze(
          input.signals
            .filter((s) => s.foresightState === "stabilizing" || s.foresightState === "developing")
            .map((s) => s.signalId)
            .slice(0, 4)
        ),
      })
    );
  }

  if (input.trajectoryState.trajectoryVolatilityScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "long-horizon::operational-drift",
        regionId: "customer_systems",
        horizonType: "operational_drift",
        horizonStrength: Number(
          Math.min(0.92, input.trajectoryState.trajectoryVolatilityScore * 0.8).toFixed(4)
        ),
        explanation:
          "Early instability trajectories may signal operational drift before escalation reaches executive thresholds.",
        contributingSignalIds: Object.freeze(
          input.signals.filter((s) => s.foresightState === "emerging").map((s) => s.signalId).slice(0, 3)
        ),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "long-horizon::equilibrium-transformation",
        regionId: "finance",
        horizonType: "equilibrium_transformation",
        horizonStrength: Number(
          Math.min(0.92, input.divergenceState.futureFragmentationScore * 0.75).toFixed(4)
        ),
        explanation:
          "Fragmented future branches may reshape long-term equilibrium pathways requiring executive preparation.",
        contributingSignalIds: Object.freeze(
          input.signals
            .filter((s) => (s.dominantForesightDrivers ?? []).includes("future_divergence"))
            .map((s) => s.signalId)
            .slice(0, 3)
        ),
      })
    );
  }

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const stabilizing = regionSignals.filter((s) => s.foresightState === "stabilizing");
    if (stabilizing.length === 0) continue;

    records.push(
      Object.freeze({
        recordId: `long-horizon::stabilization::${region.regionId}`,
        regionId: region.regionId,
        horizonType: "stabilization_opportunity",
        horizonStrength: Number(
          Math.min(
            0.92,
            stabilizing.reduce((sum, s) => sum + s.foresightStrength, 0) /
              Math.max(1, stabilizing.length)
          ).toFixed(4)
        ),
        explanation: `Long-horizon stabilization opportunity may emerge in ${region.label} as recovery and coordination patterns strengthen.`,
        contributingSignalIds: Object.freeze(stabilizing.map((s) => s.signalId)),
      })
    );
  }

  logForesightDev("LongHorizon", { recordCount: records.length });
  return Object.freeze(
    records.sort((a, b) => a.recordId.localeCompare(b.recordId))
  );
}
