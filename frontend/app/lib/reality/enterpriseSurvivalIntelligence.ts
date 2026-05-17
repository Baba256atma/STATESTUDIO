/**
 * D7:7:8 — Enterprise survival intelligence for strategic continuity.
 */

import type {
  ContinuityFragmentationRecord,
  EnterpriseStrategicContinuitySignal,
  EnterpriseSurvivalRecord,
  LongHorizonContinuityRecord,
} from "./enterpriseStrategicContinuityTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseStrategicContinuityDev } from "./enterpriseStrategicContinuityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseSurvival(input: {
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  fragmentationRecords: readonly ContinuityFragmentationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseSurvivalRecord[] {
  const records: EnterpriseSurvivalRecord[] = [];
  const continuityIds = input.continuitySignals.map((s) => s.continuityId);

  const operationalPreservation = input.longHorizonContinuityRecords.find((r) =>
    r.recordId.includes("operational-preservation")
  );
  const resilienceContinuity = input.longHorizonContinuityRecords.find((r) =>
    r.recordId.includes("resilience-driven")
  );
  const collapseRisk = input.fragmentationRecords.find((r) => r.recordId.includes("collapse-risk"));

  const fragmentationPenalty =
    input.fragmentationRecords.length === 0
      ? 0
      : input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.fragmentationRecords.length;

  records.push(
    Object.freeze({
      recordId: "survival::operations",
      survivalDomain: "operations",
      survivalStrength: clamp01(
        (operationalPreservation?.continuityStrength ?? 0.35) * 0.5 +
          input.momentumState.organizationalMomentumScore * 0.35 -
          fragmentationPenalty * 0.1
      ),
      explanation:
        "Operations survival may persist when enterprise continuity preserves production and coordination through disruption.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "survival::logistics",
      survivalDomain: "logistics",
      survivalStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.45 +
          (resilienceContinuity?.continuityStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Logistics survival may remain broadly preserved across recovery coordination systems under adaptive continuity.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "survival::finance",
      survivalDomain: "finance",
      survivalStrength: clamp01(
        input.divergenceState.futureConvergenceScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          fragmentationPenalty * 0.08
      ),
      explanation:
        "Finance survival may depend on governance continuity stabilization during long-horizon persistence cycles.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "survival::recovery",
      survivalDomain: "recovery",
      survivalStrength: clamp01(
        (resilienceContinuity?.continuityStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.3
      ),
      explanation:
        "Recovery survival may advance when core recovery coordination persists despite operational disruption.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "survival::strategic-momentum",
      survivalDomain: "strategic_momentum",
      survivalStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          (collapseRisk?.fragmentationStrength ?? 0) * 0.15
      ),
      explanation:
        "Strategic momentum survival may reflect how continuity preserves long-horizon strategic existence across transformation.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "survival::systemic-equilibrium",
      survivalDomain: "systemic_equilibrium",
      survivalStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.5 +
          (operationalPreservation?.continuityStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Systemic equilibrium survival may balance operational pressure when continuity pathways sustain strategic persistence.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicContinuityDev("EnterpriseSurvival", {
    survivalRecordCount: records.length,
    fragmentationRecordCount: input.fragmentationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
