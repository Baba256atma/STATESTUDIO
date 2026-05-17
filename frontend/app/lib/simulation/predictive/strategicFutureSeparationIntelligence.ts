/**
 * D7:4:2 — Strategic future separation intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  FutureBranchRecord,
  StrategicFutureSeparationRecord,
} from "./multiFutureDivergenceTypes.ts";
import { CANONICAL_FUTURE_BRANCH_IDS } from "./futureBranchEvolutionModel.ts";
import { logDivergenceDev } from "./divergenceDevLog.ts";

export function analyzeStrategicFutureSeparation(input: {
  topology: OperationalUniverseTopology;
  branches: readonly FutureBranchRecord[];
  trajectoryState: PredictiveTrajectoryState;
  pressureState?: EnterprisePressureState;
  equilibriumState: EnterpriseEquilibriumState;
}): readonly StrategicFutureSeparationRecord[] {
  const records: StrategicFutureSeparationRecord[] = [];

  const stabilization = input.branches.find(
    (b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.stabilization
  );
  const degradation = input.branches.find(
    (b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.degradation
  );
  const hybrid = input.branches.find(
    (b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.volatileHybrid
  );

  for (const region of input.topology.operationalRegions) {
    const inStabilization = stabilization?.affectedRegionIds.includes(region.regionId);
    const inDegradation = degradation?.affectedRegionIds.includes(region.regionId);
    const inVolatility = input.trajectoryState.volatilityHotspots.includes(region.regionId);

    if (!inStabilization && !inDegradation && !inVolatility) continue;

    let separationType: StrategicFutureSeparationRecord["separationType"] =
      "hybrid_volatility";
    if (inStabilization && inDegradation) separationType = "stabilization_vs_degradation";
    else if (inStabilization && input.trajectoryState.recoveryTrajectories.includes(region.regionId)) {
      separationType = "recovery_vs_pressure";
    }

    const separationStrength = Number(
      Math.min(
        1,
        Math.abs((stabilization?.branchStrength ?? 0) - (degradation?.branchStrength ?? 0)) +
          (inVolatility ? 0.15 : 0)
      ).toFixed(4)
    );

    const branchIds = [
      ...(inStabilization ? [CANONICAL_FUTURE_BRANCH_IDS.stabilization] : []),
      ...(inDegradation ? [CANONICAL_FUTURE_BRANCH_IDS.degradation] : []),
      ...(inVolatility ? [CANONICAL_FUTURE_BRANCH_IDS.volatileHybrid] : []),
    ].sort();

    let explanation = "";
    if (separationType === "stabilization_vs_degradation") {
      explanation = `Operational futures in ${region.label} may diverge between stabilization and degradation branches.`;
    } else if (separationType === "recovery_vs_pressure") {
      explanation = `Recovery futures in ${region.label} may separate from pressure-driven degradation paths.`;
    } else {
      explanation = `Hybrid volatility may concentrate future uncertainty in ${region.label}.`;
    }

    records.push(
      Object.freeze({
        recordId: `separation::${region.regionId}`,
        regionId: region.regionId,
        separationType,
        separationStrength,
        branchIds: Object.freeze(branchIds),
        explanation,
      })
    );
  }

  if (
    input.pressureState &&
    input.pressureState.saturationRegions.length > 0 &&
    stabilization &&
    degradation
  ) {
    records.push(
      Object.freeze({
        recordId: "separation::enterprise-pressure",
        regionId: input.pressureState.saturationRegions[0] ?? "logistics",
        separationType: "stabilization_vs_degradation",
        separationStrength: Number(
          Math.min(
            1,
            input.pressureState.saturationRegions.length * 0.12 +
              degradation.branchStrength * 0.4
          ).toFixed(4)
        ),
        branchIds: Object.freeze([
          CANONICAL_FUTURE_BRANCH_IDS.stabilization,
          CANONICAL_FUTURE_BRANCH_IDS.degradation,
        ]),
        explanation:
          "Increasing dependency pressure may widen separation between logistics stabilization and manufacturing degradation futures.",
      })
    );
  }

  if (
    input.equilibriumState.equilibriumLabel === "critical_imbalance" &&
    hybrid &&
    hybrid.branchStrength >= 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "separation::equilibrium-hybrid",
        regionId: "manufacturing",
        separationType: "hybrid_volatility",
        separationStrength: Number(hybrid.branchStrength.toFixed(4)),
        branchIds: Object.freeze([
          CANONICAL_FUTURE_BRANCH_IDS.volatileHybrid,
          CANONICAL_FUTURE_BRANCH_IDS.equilibriumDrift,
        ]),
        explanation:
          "Equilibrium drift may amplify volatile hybrid futures across manufacturing and logistics domains.",
      })
    );
  }

  logDivergenceDev("FutureDivergence", { separationRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
