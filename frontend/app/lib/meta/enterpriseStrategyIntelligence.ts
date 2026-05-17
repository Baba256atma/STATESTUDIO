/**
 * D7:8:1 — Enterprise strategy intelligence across long-horizon operational realities.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseStrategyRecord,
  MetaStrategicSignal,
  MetaCoherenceRecord,
  StrategicEvolutionRecord,
} from "./metaStrategicTypes.ts";
import { logMetaStrategicDev } from "./metaStrategicDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseStrategyIntelligence(input: {
  metaSignals: readonly MetaStrategicSignal[];
  strategicEvolutionRecords: readonly StrategicEvolutionRecord[];
  metaCoherenceRecords: readonly MetaCoherenceRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseStrategyRecord[] {
  const records: EnterpriseStrategyRecord[] = [];
  const metaIds = input.metaSignals.map((s) => s.metaId);

  records.push(
    Object.freeze({
      recordId: "enterprise-strategy::operations",
      strategyDomain: "operations",
      strategyStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.5 +
          input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.35
      ),
      explanation:
        "Operations strategy evolution may reflect how efficiency initiatives interact with recovery coordination across manufacturing and logistics domains.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-strategy::logistics",
      strategyDomain: "logistics",
      strategyStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          input.strategicRealityState.unifiedOperationalStateScore * 0.35
      ),
      explanation:
        "Logistics strategy evolution may shape dependency concentration and cross-domain flow stability under changing operational pressure.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-strategy::finance",
      strategyDomain: "finance",
      strategyStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance strategy evolution may influence capital allocation tradeoffs between optimization programs and resilience investment pathways.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-strategy::recovery",
      strategyDomain: "recovery",
      strategyStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery strategy evolution may determine whether stabilization gains persist or gradually increase dependency concentration over long horizons.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-strategy::momentum",
      strategyDomain: "strategic_momentum",
      strategyStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum evolution may signal whether enterprise initiatives sustain forward progress amid meta-strategic transformation pressure.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-strategy::equilibrium",
      strategyDomain: "systemic_equilibrium",
      strategyStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.divergenceState.futureFragmentationScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium strategy evolution may reveal optimization-vs-resilience tensions shaping long-horizon organizational trajectories.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    })
  );

  logMetaStrategicDev("EnterpriseMeta", { enterpriseStrategyRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
