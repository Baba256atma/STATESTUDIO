/**
 * D7:8:9 — Enterprise unified meta-strategic intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseUnifiedMetaStrategicRecord,
  CrossIntelligenceSynchronizationRecord,
  UnifiedMetaCoherenceRecord,
  UnifiedMetaStrategicSignal,
} from "./unifiedMetaStrategicTypes.ts";
import { logUnifiedMetaStrategicDev } from "./unifiedMetaStrategicDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseUnifiedMetaStrategicIntelligence(input: {
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  crossIntelligenceSynchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
  unifiedMetaCoherenceRecords: readonly UnifiedMetaCoherenceRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseUnifiedMetaStrategicRecord[] {
  const records: EnterpriseUnifiedMetaStrategicRecord[] = [];
  const unifiedIds = input.unifiedMetaSignals.map((s) => s.unifiedMetaId);

  records.push(
    Object.freeze({
      recordId: "enterprise-unified-meta::operations",
      cognitionDomain: "operations",
      cognitionStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          (input.crossIntelligenceSynchronizationRecords.find((r) =>
            r.recordId.includes("long-horizon-coherence")
          )?.synchronizationStrength ?? 0.35)
      ),
      explanation:
        "Operations cognition may reflect how unified meta-intelligence preserves manufacturing and service coherence across all strategic layers.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-unified-meta::logistics",
      cognitionDomain: "logistics",
      cognitionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.crossIntelligenceSynchronizationRecords.find((r) =>
            r.recordId.includes("continuity-evolution")
          )?.synchronizationStrength ?? 0.35)
      ),
      explanation:
        "Logistics cognition may synchronize flow networks as continuity and evolution pathways align across the ecosystem.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-unified-meta::finance",
      cognitionDomain: "finance",
      cognitionStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance cognition may track capital allocation coherence within the unified strategic intelligence environment.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-unified-meta::recovery",
      cognitionDomain: "recovery",
      cognitionStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.crossIntelligenceSynchronizationRecords.find((r) =>
            r.recordId.includes("governance-recovery")
          )?.synchronizationStrength ?? 0.35)
      ),
      explanation:
        "Recovery cognition may indicate whether all meta-intelligence layers reinforce stabilization pathways over time.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-unified-meta::momentum",
      cognitionDomain: "strategic_momentum",
      cognitionStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum cognition may show how forward progress persists within one evolving enterprise intelligence ecosystem.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-unified-meta::equilibrium",
      cognitionDomain: "systemic_equilibrium",
      cognitionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium cognition may preserve organizational balance as all strategic intelligence systems interact as one ecosystem.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    })
  );

  logUnifiedMetaStrategicDev("EnterpriseCognition", {
    enterpriseUnifiedMetaRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
