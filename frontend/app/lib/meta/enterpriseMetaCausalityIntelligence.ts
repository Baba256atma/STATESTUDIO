/**
 * D7:8:3 — Enterprise meta-causality intelligence across hidden strategic forces.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseMetaCausalityRecord,
  LongHorizonCausalRecord,
  StrategicForcePropagationRecord,
  StrategicMetaCausalitySignal,
} from "./strategicMetaCausalityTypes.ts";
import { logStrategicMetaCausalityDev } from "./strategicMetaCausalityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseMetaCausalityIntelligence(input: {
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  longHorizonCausalRecords: readonly LongHorizonCausalRecord[];
  strategicForcePropagationRecords: readonly StrategicForcePropagationRecord[];
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseMetaCausalityRecord[] {
  const records: EnterpriseMetaCausalityRecord[] = [];
  const metaCausalityIds = input.metaCausalitySignals.map((s) => s.metaCausalityId);

  records.push(
    Object.freeze({
      recordId: "enterprise-meta-causality::operations",
      causalityDomain: "operations",
      causalityStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.35
      ),
      explanation:
        "Operations meta-causality may reflect how recurring efficiency-maximization forces shape manufacturing and service coordination trajectories.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-causality::logistics",
      causalityDomain: "logistics",
      causalityStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.longHorizonCausalRecords.find((r) =>
            r.recordId.includes("strategic-force")
          )?.causalStrength ?? 0.35)
      ),
      explanation:
        "Logistics meta-causality may reveal how dependency concentration causal chains propagate through flow and recovery networks.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-causality::finance",
      causalityDomain: "finance",
      causalityStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance meta-causality may track how capital allocation incentives amplify or dampen long-horizon strategic force propagation.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-causality::recovery",
      causalityDomain: "recovery",
      causalityStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.longHorizonCausalRecords.find((r) =>
            r.recordId.includes("resilience-structures")
          )?.causalStrength ?? 0.35)
      ),
      explanation:
        "Recovery meta-causality may explain whether stabilization causal structures build durable resilience or recurring instability cycles.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-causality::momentum",
      causalityDomain: "strategic_momentum",
      causalityStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum meta-causality may show how hidden performance pressures shape forward progress across enterprise domains.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-causality::equilibrium",
      causalityDomain: "systemic_equilibrium",
      causalityStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.divergenceState.futureFragmentationScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium meta-causality may reveal how strategic forces recursively shape long-horizon organizational balance.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    })
  );

  logStrategicMetaCausalityDev("MetaPropagation", {
    enterpriseMetaCausalityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
