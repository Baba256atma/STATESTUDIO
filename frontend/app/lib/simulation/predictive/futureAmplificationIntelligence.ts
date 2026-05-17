/**
 * D7:4:4 — Future amplification intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  FutureAmplificationRecord,
  PredictiveCascadeSignal,
} from "./cascadingConsequenceTypes.ts";
import { logCascadeDev } from "./cascadeDevLog.ts";

export function analyzeFutureAmplification(input: {
  topology: OperationalUniverseTopology;
  signals: readonly PredictiveCascadeSignal[];
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  cascadeAmplificationScore: number;
}): readonly FutureAmplificationRecord[] {
  const records: FutureAmplificationRecord[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const amplifying = regionSignals.filter(
      (s) => s.cascadeState === "amplifying" || s.cascadeState === "critical"
    );
    if (amplifying.length === 0) continue;

    const strength = Number(
      Math.min(
        1,
        amplifying.reduce((s, sig) => s + sig.propagationIntensity, 0) / amplifying.length
      ).toFixed(4)
    );

    records.push(
      Object.freeze({
        recordId: `amplification::${region.regionId}`,
        regionId: region.regionId,
        amplificationType: "instability",
        amplificationStrength: strength,
        explanation: `Future instability amplification may intensify cascading consequences in ${region.label}.`,
      })
    );
  }

  if (
    input.pressureState &&
    input.pressureState.saturationRegions.length > 0 &&
    input.momentumState.momentumTrendLabel === "accelerating_failure"
  ) {
    records.push(
      Object.freeze({
        recordId: "amplification::pressure-chain",
        regionId: input.pressureState.saturationRegions[0] ?? "logistics",
        amplificationType: "pressure_chain",
        amplificationStrength: Number(
          Math.min(
            1,
            input.pressureState.saturationRegions.length * 0.1 +
              input.cascadeAmplificationScore * 0.4
          ).toFixed(4)
        ),
        explanation:
          "Dependency pressure increase may cascade through logistics instability into recovery degradation and equilibrium imbalance.",
      })
    );
  }

  const stabilizing = input.signals.filter((s) => s.cascadeState === "stabilizing");
  if (stabilizing.length > 0 && input.trajectoryState.recoveryTrajectories.length > 0) {
    records.push(
      Object.freeze({
        recordId: "amplification::recovery-ripple",
        regionId: input.trajectoryState.recoveryTrajectories[0] ?? "logistics",
        amplificationType: "recovery_ripple",
        amplificationStrength: Number(
          (
            stabilizing.reduce((s, sig) => s + sig.propagationIntensity, 0) /
            Math.max(1, stabilizing.length)
          ).toFixed(4)
        ),
        explanation:
          "Recovery synchronization improvement may propagate resilience effects and accelerate stabilization across connected domains.",
      })
    );
  }

  if (input.equilibriumState.equilibriumLabel === "critical_imbalance") {
    records.push(
      Object.freeze({
        recordId: "amplification::equilibrium-drift",
        regionId: input.equilibriumState.imbalanceZones[0] ?? "manufacturing",
        amplificationType: "equilibrium_drift",
        amplificationStrength: Number(
          input.equilibriumState.instabilityDriftScore.toFixed(4)
        ),
        explanation:
          "Equilibrium drift may amplify future consequence chains across imbalanced operational regions.",
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "amplification::divergence-loop",
        regionId: input.divergenceState.fragmentedFutureZones[0] ?? "manufacturing",
        amplificationType: "instability",
        amplificationStrength: Number(input.divergenceState.futureFragmentationScore.toFixed(4)),
        explanation:
          "Systemic destabilization loops may emerge as fragmented futures amplify cascading operational consequences.",
      })
    );
  }

  logCascadeDev("CascadeAmplification", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
