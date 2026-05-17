/**
 * D7:6:8 — Executive continuity intelligence (strategic presence).
 */

import type {
  ExecutiveStrategicPresenceSignal,
  ExecutiveContinuityRecord,
  PresenceFragmentationRecord,
  SituationalAwarenessLayerRecord,
} from "./executiveStrategicPresenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveStrategicPresenceDev } from "./strategicPresenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveContinuity(input: {
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  layerRecords: readonly SituationalAwarenessLayerRecord[];
  fragmentationRecords: readonly PresenceFragmentationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveContinuityRecord[] {
  const records: ExecutiveContinuityRecord[] = [];
  const presenceIds = input.presenceSignals.map((s) => s.presenceId);

  const operationalLayer = input.layerRecords.find((r) =>
    r.recordId.includes("operational-awareness")
  );
  const recoveryLayer = input.layerRecords.find((r) =>
    r.recordId.includes("resilience-sync")
  );
  const predictiveLayer = input.layerRecords.find((r) =>
    r.recordId.includes("predictive-evolution")
  );

  records.push(
    Object.freeze({
      recordId: "continuity::operations",
      continuityDomain: "operations",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (operationalLayer?.layerStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational continuity may improve when sustained situational presence connects evolving intelligence to executive foresight.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::logistics",
      continuityDomain: "logistics",
      continuityStrength: clamp01(
        (operationalLayer?.layerStrength ?? 0.4) * 0.55 +
          (predictiveLayer?.layerStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics continuity may trace how recovery progression and fragility escalation remain visible across decision cycles.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::finance",
      continuityDomain: "finance",
      continuityStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial continuity may benefit when strategic presence links immediate pressure to long-horizon equilibrium shifts.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::recovery",
      continuityDomain: "recovery",
      continuityStrength: clamp01(
        (recoveryLayer?.layerStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system continuity may strengthen when stabilization trajectories remain cognitively accessible across horizons.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::strategic-momentum",
      continuityDomain: "strategic_momentum",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum continuity may reflect how sustained awareness supports enterprise evolution under executive control.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::systemic-equilibrium",
      continuityDomain: "systemic_equilibrium",
      continuityStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.fragmentationRecords[0]?.fragmentationStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium continuity may preserve leadership coherence when situational presence remains evidence-grounded.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
    })
  );

  logExecutiveStrategicPresenceDev("ExecutiveContinuity", {
    continuityRecordCount: records.length,
    fragmentationCount: input.fragmentationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
