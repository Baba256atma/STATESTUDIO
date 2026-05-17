/**
 * D7:8:4 — Enterprise strategic drift intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseStrategicDriftRecord,
  LongHorizonIntelligenceDriftRecord,
  StrategicCoherenceDegradationRecord,
  StrategicIntelligenceDriftSignal,
} from "./strategicIntelligenceDriftTypes.ts";
import { logStrategicIntelligenceDriftDev } from "./strategicIntelligenceDriftDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseStrategicDriftIntelligence(input: {
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  longHorizonIntelligenceDriftRecords: readonly LongHorizonIntelligenceDriftRecord[];
  strategicCoherenceDegradationRecords: readonly StrategicCoherenceDegradationRecord[];
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseStrategicDriftRecord[] {
  const records: EnterpriseStrategicDriftRecord[] = [];
  const driftIds = input.driftSignals.map((s) => s.driftId);

  records.push(
    Object.freeze({
      recordId: "enterprise-drift::operations",
      driftDomain: "operations",
      driftStrength: clamp01(
        (1 - input.strategicRealityState.operationalRealityCoherenceScore) * 0.4 +
          input.strategicRealityState.realityInstabilityScore * 0.35
      ),
      explanation:
        "Operations drift dynamics may reflect how optimization-driven decision cycles gradually reshape manufacturing and service coordination futures.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-drift::logistics",
      driftDomain: "logistics",
      driftStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          (input.longHorizonIntelligenceDriftRecords.find((r) =>
            r.recordId.includes("coherence-degradation")
          )?.driftStrength ?? 0.35)
      ),
      explanation:
        "Logistics drift may reveal how dependency concentration and coordination degradation accumulate across flow networks.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-drift::finance",
      driftDomain: "finance",
      driftStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.45 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance drift may track how capital allocation incentives amplify or dampen long-horizon strategic intelligence degradation.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-drift::recovery",
      driftDomain: "recovery",
      driftStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.45 +
          (input.longHorizonIntelligenceDriftRecords.find((r) =>
            r.recordId.includes("resilience-erosion")
          )?.driftStrength ?? 0.35)
      ),
      explanation:
        "Recovery drift may indicate whether resilience erosion pathways are weakening degraded recovery capability over time.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-drift::momentum",
      driftDomain: "strategic_momentum",
      driftStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum drift may show how forward progress masks accumulating coherence degradation across domains.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-drift::equilibrium",
      driftDomain: "systemic_equilibrium",
      driftStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.35 +
          input.divergenceState.futureFragmentationScore * 0.35 +
          input.metaCausalityState.metaCausalityInstabilityScore * 0.2
      ),
      explanation:
        "Systemic equilibrium drift may reveal how strategic intelligence degradation reshapes long-horizon organizational balance.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceDriftDev("MetaCoherence", {
    enterpriseDriftRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
