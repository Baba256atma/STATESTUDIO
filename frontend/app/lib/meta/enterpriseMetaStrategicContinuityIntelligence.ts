/**
 * D7:8:8 — Enterprise meta-strategic continuity intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseMetaStrategicContinuityRecord,
  LongHorizonContinuityRecord,
  ContinuityFragmentationRecord,
  StrategicIntelligenceContinuitySignal,
} from "./strategicIntelligenceContinuityTypes.ts";
import { logStrategicIntelligenceContinuityDev } from "./strategicIntelligenceContinuityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseMetaStrategicContinuityIntelligence(input: {
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  continuityFragmentationRecords: readonly ContinuityFragmentationRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseMetaStrategicContinuityRecord[] {
  const records: EnterpriseMetaStrategicContinuityRecord[] = [];
  const continuityIds = input.continuitySignals.map((s) => s.continuityId);

  records.push(
    Object.freeze({
      recordId: "enterprise-meta-continuity::operations",
      continuityDomain: "operations",
      continuityStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          (input.longHorizonContinuityRecords.find((r) =>
            r.recordId.includes("preservation")
          )?.continuityStrength ?? 0.35)
      ),
      explanation:
        "Operations continuity may reflect how strategic intelligence preserves manufacturing and service direction across disruption.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-continuity::logistics",
      continuityDomain: "logistics",
      continuityStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.longHorizonContinuityRecords.find((r) =>
            r.recordId.includes("persistence-structures")
          )?.continuityStrength ?? 0.35)
      ),
      explanation:
        "Logistics continuity may stabilize flow networks when dependency pressure threatens long-horizon organizational direction.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-continuity::finance",
      continuityDomain: "finance",
      continuityStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance continuity may track capital allocation stability that sustains strategic direction during volatility.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-continuity::recovery",
      continuityDomain: "recovery",
      continuityStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.longHorizonContinuityRecords.find((r) =>
            r.recordId.includes("resilience-stabilization")
          )?.continuityStrength ?? 0.35)
      ),
      explanation:
        "Recovery continuity may indicate whether stabilization pathways rebuild long-horizon direction after fragmentation pressure.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-continuity::momentum",
      continuityDomain: "strategic_momentum",
      continuityStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum continuity may show how forward direction persists amid optimization overload and predictive volatility.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-continuity::equilibrium",
      continuityDomain: "systemic_equilibrium",
      continuityStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium continuity may preserve long-horizon organizational balance as enterprise strategic intelligence maintains sustainable direction.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceContinuityDev("StrategicSurvival", {
    enterpriseMetaContinuityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
