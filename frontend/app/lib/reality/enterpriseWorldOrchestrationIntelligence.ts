/**
 * D7:7:1 — Enterprise-world orchestration intelligence (strategic reality).
 */

import type {
  StrategicRealitySignal,
  EnterpriseWorldOrchestrationRecord,
  RealityEvolutionRecord,
  UnifiedOperationalStateRecord,
} from "./strategicRealityTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logStrategicRealityDev } from "./strategicRealityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseWorldOrchestration(input: {
  realitySignals: readonly StrategicRealitySignal[];
  stateRecords: readonly UnifiedOperationalStateRecord[];
  evolutionRecords: readonly RealityEvolutionRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseWorldOrchestrationRecord[] {
  const records: EnterpriseWorldOrchestrationRecord[] = [];
  const realityIds = input.realitySignals.map((s) => s.realityId);

  const resilienceEvolution = input.stateRecords.find((r) =>
    r.recordId.includes("resilience-evolution")
  );
  const operationalContinuity = input.stateRecords.find((r) =>
    r.recordId.includes("operational-continuity")
  );
  const evolvingEcosystem = input.stateRecords.find((r) =>
    r.recordId.includes("evolving-ecosystem")
  );

  records.push(
    Object.freeze({
      recordId: "world::operations",
      worldDomain: "operations",
      orchestrationStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (evolvingEcosystem?.stateStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational world evolution may improve when enterprise reality synchronizes momentum with strategic intelligence.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world::logistics",
      worldDomain: "logistics",
      orchestrationStrength: clamp01(
        (resilienceEvolution?.stateStrength ?? 0.4) * 0.55 +
          (operationalContinuity?.stateStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics world orchestration may trace recovery stabilization across manufacturing and logistics systems.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world::finance",
      worldDomain: "finance",
      orchestrationStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial world evolution may benefit when operational reality links pressure to long-horizon equilibrium.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world::recovery",
      worldDomain: "recovery",
      orchestrationStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.45 +
          (resilienceEvolution?.stateStrength ?? 0.35) * 0.35
      ),
      explanation:
        "Recovery-system world evolution may strengthen when stabilization pathways align across operational horizons.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world::strategic-momentum",
      worldDomain: "strategic_momentum",
      orchestrationStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum world evolution may reflect unified operational realities under executive control.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world::systemic-equilibrium",
      worldDomain: "systemic_equilibrium",
      orchestrationStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.evolutionRecords[0]?.evolutionStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium world orchestration may preserve strategic intelligence when reality remains operationally grounded.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
    })
  );

  logStrategicRealityDev("OperationalWorld", {
    worldRecordCount: records.length,
    evolutionCount: input.evolutionRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
