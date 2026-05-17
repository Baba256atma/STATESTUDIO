/**
 * D7:8:6 — Enterprise meta-strategic evolution intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseMetaStrategicEvolutionRecord,
  LongHorizonEvolutionRecord,
  StrategicTransformationRecord,
  StrategicIntelligenceEvolutionSignal,
} from "./strategicIntelligenceEvolutionTypes.ts";
import { logStrategicIntelligenceEvolutionDev } from "./strategicIntelligenceEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseMetaStrategicEvolutionIntelligence(input: {
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  longHorizonEvolutionRecords: readonly LongHorizonEvolutionRecord[];
  strategicTransformationRecords: readonly StrategicTransformationRecord[];
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseMetaStrategicEvolutionRecord[] {
  const records: EnterpriseMetaStrategicEvolutionRecord[] = [];
  const evolutionIds = input.evolutionSignals.map((s) => s.evolutionId);

  records.push(
    Object.freeze({
      recordId: "enterprise-meta-evolution::operations",
      evolutionDomain: "operations",
      evolutionStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          input.metaStrategicState.strategicEvolutionScore * 0.35
      ),
      explanation:
        "Operations evolution may reflect how strategic intelligence transforms manufacturing and service continuity across long-horizon realities.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-evolution::logistics",
      evolutionDomain: "logistics",
      evolutionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.longHorizonEvolutionRecords.find((r) =>
            r.recordId.includes("continuity-preservation")
          )?.evolutionStrength ?? 0.35)
      ),
      explanation:
        "Logistics evolution may mature flow networks as resilience adaptation reshapes dependency structures over time.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-evolution::finance",
      evolutionDomain: "finance",
      evolutionStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance evolution may track how capital allocation maturity sustains strategic intelligence transformation during volatility.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-evolution::recovery",
      evolutionDomain: "recovery",
      evolutionStrength: clamp01(
        input.strategicResilienceState.adaptiveRecoveryScore * 0.5 +
          (input.longHorizonEvolutionRecords.find((r) =>
            r.recordId.includes("resilience-maturity")
          )?.evolutionStrength ?? 0.35)
      ),
      explanation:
        "Recovery evolution may indicate whether resilience-driven adaptation strengthens long-horizon recovery capability over time.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-evolution::momentum",
      evolutionDomain: "strategic_momentum",
      evolutionStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum evolution may show how forward progress persists as intelligence matures amid optimization pressure.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-evolution::equilibrium",
      evolutionDomain: "systemic_equilibrium",
      evolutionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium evolution may preserve organizational balance as enterprise strategic intelligence transforms without fragmentation collapse.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceEvolutionDev("StrategicMaturity", {
    enterpriseMetaEvolutionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
