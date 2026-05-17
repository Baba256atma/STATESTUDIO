/**
 * D7:8:10 — Enterprise meta-strategic completion intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseMetaStrategicCompletionRecord,
  EnterpriseCognitionSynchronizationRecord,
  StrategicWorldCoherenceRecord,
  MetaStrategicCompletionSignal,
} from "./metaStrategicCompletionTypes.ts";
import { logMetaStrategicCompletionDev } from "./metaStrategicCompletionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseMetaStrategicCompletionIntelligence(input: {
  completionSignals: readonly MetaStrategicCompletionSignal[];
  enterpriseCognitionSynchronizationRecords: readonly EnterpriseCognitionSynchronizationRecord[];
  strategicWorldCoherenceRecords: readonly StrategicWorldCoherenceRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseMetaStrategicCompletionRecord[] {
  const records: EnterpriseMetaStrategicCompletionRecord[] = [];
  const completionIds = input.completionSignals.map((s) => s.completionId);

  records.push(
    Object.freeze({
      recordId: "enterprise-completion::operations",
      completionDomain: "operations",
      completionStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          (input.enterpriseCognitionSynchronizationRecords.find((r) =>
            r.recordId.includes("long-horizon-coherence")
          )?.synchronizationStrength ?? 0.35)
      ),
      explanation:
        "Operations completion may finalize how all strategic cognition layers preserve manufacturing and service coherence in one world.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-completion::logistics",
      completionDomain: "logistics",
      completionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.enterpriseCognitionSynchronizationRecords.find((r) =>
            r.recordId.includes("resilience-continuity")
          )?.synchronizationStrength ?? 0.35)
      ),
      explanation:
        "Logistics completion may synchronize flow networks as resilience and continuity finalize across the ecosystem.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-completion::finance",
      completionDomain: "finance",
      completionStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance completion may anchor capital allocation within the completed enterprise meta-cognitive platform.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-completion::recovery",
      completionDomain: "recovery",
      completionStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.enterpriseCognitionSynchronizationRecords.find((r) =>
            r.recordId.includes("equilibrium-stabilization")
          )?.synchronizationStrength ?? 0.35)
      ),
      explanation:
        "Recovery completion may indicate whether all cognition systems reinforce stabilization pathways in the finalized world.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-completion::momentum",
      completionDomain: "strategic_momentum",
      completionStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum completion may show how forward progress persists within the completed meta-operational intelligence environment.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-completion::equilibrium",
      completionDomain: "systemic_equilibrium",
      completionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium completion may preserve organizational balance as all strategic cognition systems finalize into one unified world.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    })
  );

  logMetaStrategicCompletionDev("EnterpriseCognition", {
    enterpriseCompletionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
