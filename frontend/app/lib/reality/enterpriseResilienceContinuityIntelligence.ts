/**
 * D7:7:5 — Enterprise resilience continuity intelligence.
 */

import type {
  AdaptiveRecoveryRecord,
  EnterpriseResilienceContinuityRecord,
  EnterpriseStrategicResilienceSignal,
  ResilienceCapacityRecord,
} from "./enterpriseStrategicResilienceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseStrategicResilienceDev } from "./enterpriseStrategicResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseResilienceContinuity(input: {
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
  adaptiveRecoveryRecords: readonly AdaptiveRecoveryRecord[];
  capacityRecords: readonly ResilienceCapacityRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseResilienceContinuityRecord[] {
  const records: EnterpriseResilienceContinuityRecord[] = [];
  const resilienceIds = input.resilienceSignals.map((s) => s.resilienceId);

  const operationalRecovery = input.adaptiveRecoveryRecords.find((r) =>
    r.recordId.includes("operational-adaptation")
  );
  const continuityPreservation = input.adaptiveRecoveryRecords.find((r) =>
    r.recordId.includes("continuity-preservation")
  );
  const collapseRisk = input.capacityRecords.find((r) => r.recordId.includes("collapse-risk"));

  const pressurePenalty =
    input.capacityRecords.length === 0
      ? 0
      : input.capacityRecords.reduce((s, r) => s + r.capacityStrength, 0) /
        input.capacityRecords.length;

  records.push(
    Object.freeze({
      recordId: "continuity::operations",
      continuityDomain: "operations",
      continuityStrength: clamp01(
        (operationalRecovery?.recoveryStrength ?? 0.35) * 0.5 +
          input.momentumState.organizationalMomentumScore * 0.35 -
          pressurePenalty * 0.1
      ),
      explanation:
        "Operations continuity may persist when resilience absorbs disruption across production and coordination layers.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::logistics",
      continuityDomain: "logistics",
      continuityStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.45 +
          (continuityPreservation?.recoveryStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Logistics continuity may strengthen when recovery systems across manufacturing domains adapt effectively under pressure.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::finance",
      continuityDomain: "finance",
      continuityStrength: clamp01(
        input.divergenceState.futureConvergenceScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          pressurePenalty * 0.08
      ),
      explanation:
        "Finance continuity may depend on governance stabilization during extended recovery pressure.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::recovery",
      continuityDomain: "recovery",
      continuityStrength: clamp01(
        (operationalRecovery?.recoveryStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.3
      ),
      explanation:
        "Recovery continuity may advance when adaptive pathways coordinate stabilization across enterprise domains.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::strategic-momentum",
      continuityDomain: "strategic_momentum",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          (collapseRisk?.capacityStrength ?? 0) * 0.15
      ),
      explanation:
        "Strategic momentum continuity may reflect how resilience preserves enterprise movement during disruption.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::systemic-equilibrium",
      continuityDomain: "systemic_equilibrium",
      continuityStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.5 +
          (continuityPreservation?.recoveryStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Systemic equilibrium continuity may balance operational pressure when recovery coordination remains effective.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicResilienceDev("RecoveryPressure", {
    continuityRecordCount: records.length,
    capacityRecordCount: input.capacityRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
