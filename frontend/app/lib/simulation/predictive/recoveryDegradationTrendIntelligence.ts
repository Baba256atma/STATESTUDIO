/**
 * D7:4:1 — Recovery and degradation trend intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  FutureTrajectorySignal,
  RecoveryDegradationTrendRecord,
} from "./futureTrajectoryTypes.ts";
import { logTrajectoryDev } from "./trajectoryDevLog.ts";

export function analyzeRecoveryDegradationTrends(input: {
  topology: OperationalUniverseTopology;
  signals: readonly FutureTrajectorySignal[];
  momentumState: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  pressureState?: EnterprisePressureState;
  equilibriumState: EnterpriseEquilibriumState;
}): readonly RecoveryDegradationTrendRecord[] {
  const records: RecoveryDegradationTrendRecord[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const recovering = regionSignals.filter(
      (s) => s.trajectoryState === "recovering" || s.trajectoryState === "stabilizing"
    );
    const degrading = regionSignals.filter(
      (s) => s.trajectoryState === "degrading" || s.trajectoryState === "critical"
    );

    let trendDirection: RecoveryDegradationTrendRecord["trendDirection"] = "mixed";
    if (recovering.length > degrading.length) trendDirection = "recovery";
    else if (degrading.length > recovering.length) trendDirection = "degradation";

    const recoveryAvg =
      recovering.length > 0
        ? recovering.reduce((s, sig) => s + sig.directionalConfidence, 0) / recovering.length
        : 0;
    const degradationAvg =
      degrading.length > 0
        ? degrading.reduce((s, sig) => s + sig.directionalConfidence, 0) / degrading.length
        : 0;
    const trendStrength = Number(
      Math.min(
        1,
        Math.max(
          recoveryAvg,
          degradationAvg,
          input.momentumState.organizationalMomentumScore * 0.4,
          input.equilibriumState.equilibriumScore * 0.25
        )
      ).toFixed(4)
    );

    let explanation = "";
    if (trendDirection === "recovery") {
      explanation = `Recovery evolution trends in ${region.label} may strengthen under current momentum conditions.`;
    } else if (trendDirection === "degradation") {
      explanation = `Degradation trends in ${region.label} may intensify with sustained dependency pressure.`;
    } else {
      explanation = `Mixed recovery and degradation trends in ${region.label} suggest uneven future movement.`;
    }

    records.push(
      Object.freeze({
        recordId: `trend::${region.regionId}`,
        regionId: region.regionId,
        trendDirection,
        trendStrength,
        explanation,
      })
    );
  }

  if (
    input.momentumState.momentumTrendLabel === "recovering" &&
    (input.recoveryState?.stabilizationPotential ?? 0) > 0.5
  ) {
    records.push(
      Object.freeze({
        recordId: "trend::enterprise-recovery",
        regionId: "logistics",
        trendDirection: "recovery",
        trendStrength: Number(
          (
            input.momentumState.recoveryMomentumScore * 0.5 +
            (input.recoveryState?.stabilizationPotential ?? 0) * 0.5
          ).toFixed(4)
        ),
        explanation:
          "Enterprise recovery evolution may accelerate where coordination and operational recovery align.",
      })
    );
  }

  if (input.pressureState && input.pressureState.saturationRegions.length > 0) {
    records.push(
      Object.freeze({
        recordId: "trend::pressure-degradation",
        regionId: input.pressureState.saturationRegions[0] ?? "logistics",
        trendDirection: "degradation",
        trendStrength: Number(
          Math.min(1, input.pressureState.saturationRegions.length * 0.15 + 0.35).toFixed(4)
        ),
        explanation:
          "Increasing dependency pressure may elevate degradation trajectory risk across saturated regions.",
      })
    );
  }

  logTrajectoryDev("PredictiveFuture", { trendRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
