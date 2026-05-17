/**
 * D7:8:5 — Enterprise meta-strategic resilience intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseMetaStrategicResilienceRecord,
  LongHorizonResilienceRecord,
  StrategicRecoveryRecord,
  StrategicIntelligenceResilienceSignal,
} from "./strategicIntelligenceResilienceTypes.ts";
import { logStrategicIntelligenceResilienceDev } from "./strategicIntelligenceResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseMetaStrategicResilienceIntelligence(input: {
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  longHorizonResilienceRecords: readonly LongHorizonResilienceRecord[];
  strategicRecoveryRecords: readonly StrategicRecoveryRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseMetaStrategicResilienceRecord[] {
  const records: EnterpriseMetaStrategicResilienceRecord[] = [];
  const resilienceIds = input.resilienceSignals.map((s) => s.resilienceId);

  records.push(
    Object.freeze({
      recordId: "enterprise-meta-resilience::operations",
      resilienceDomain: "operations",
      resilienceStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.35
      ),
      explanation:
        "Operations resilience may reflect how strategic intelligence preserves manufacturing and service continuity under pressure.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-resilience::logistics",
      resilienceDomain: "logistics",
      resilienceStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.longHorizonResilienceRecords.find((r) =>
            r.recordId.includes("continuity-preservation")
          )?.resilienceStrength ?? 0.35)
      ),
      explanation:
        "Logistics resilience may stabilize flow networks when dependency pressure threatens long-horizon continuity.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-resilience::finance",
      resilienceDomain: "finance",
      resilienceStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance resilience may track capital allocation buffers that sustain strategic intelligence during volatility.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-resilience::recovery",
      resilienceDomain: "recovery",
      resilienceStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.longHorizonResilienceRecords.find((r) =>
            r.recordId.includes("recovery-adaptation")
          )?.resilienceStrength ?? 0.35)
      ),
      explanation:
        "Recovery resilience may indicate whether stabilization pathways rebuild degraded recovery capability over time.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-resilience::momentum",
      resilienceDomain: "strategic_momentum",
      resilienceStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum resilience may show how forward progress persists amid optimization pressure and predictive volatility.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-resilience::equilibrium",
      resilienceDomain: "systemic_equilibrium",
      resilienceStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium resilience may preserve long-horizon organizational balance as intelligence adapts without fragmentation collapse.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceResilienceDev("StrategicContinuity", {
    enterpriseMetaResilienceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
