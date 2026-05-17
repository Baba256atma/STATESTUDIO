/**
 * D7:6:7 — Executive exploration intelligence (scenario immersion).
 */

import type {
  ExecutiveScenarioImmersionSignal,
  ExecutiveScenarioExplorationRecord,
  ImmersiveCognitionRecord,
  ScenarioEvolutionLayerRecord,
} from "./executiveScenarioImmersionTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveScenarioImmersionDev } from "./scenarioImmersionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveScenarioExploration(input: {
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
  layerRecords: readonly ScenarioEvolutionLayerRecord[];
  cognitionRecords: readonly ImmersiveCognitionRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveScenarioExplorationRecord[] {
  const records: ExecutiveScenarioExplorationRecord[] = [];
  const immersionIds = input.immersionSignals.map((s) => s.immersionId);

  const operationalLayer = input.layerRecords.find((r) =>
    r.recordId.includes("operational-evolution")
  );
  const recoveryLayer = input.layerRecords.find((r) =>
    r.recordId.includes("recovery-sequencing")
  );
  const predictiveLayer = input.layerRecords.find((r) =>
    r.recordId.includes("predictive-progression")
  );

  records.push(
    Object.freeze({
      recordId: "exploration::operations",
      explorationDomain: "operations",
      explorationStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (operationalLayer?.layerStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational exploration may improve when immersive scenarios connect evolving intelligence to executive foresight.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exploration::logistics",
      explorationDomain: "logistics",
      explorationStrength: clamp01(
        (operationalLayer?.layerStrength ?? 0.4) * 0.55 +
          (predictiveLayer?.layerStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics exploration may trace how dependency concentration propagates through immersive future timelines.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exploration::finance",
      explorationDomain: "finance",
      explorationStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial exploration may benefit when scenario immersion links immediate pressure to long-horizon equilibrium shifts.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exploration::recovery",
      explorationDomain: "recovery",
      explorationStrength: clamp01(
        (recoveryLayer?.layerStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system exploration may strengthen when stabilization sequencing is experienced across multiple operational horizons.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exploration::strategic-momentum",
      explorationDomain: "strategic_momentum",
      explorationStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum exploration may reflect how immersive futures support enterprise evolution under executive control.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exploration::systemic-equilibrium",
      explorationDomain: "systemic_equilibrium",
      explorationStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.cognitionRecords[0]?.cognitionStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium exploration may preserve foresight when immersive cognition remains evidence-grounded.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
    })
  );

  logExecutiveScenarioImmersionDev("ExecutiveExploration", {
    explorationRecordCount: records.length,
    cognitionCount: input.cognitionRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
