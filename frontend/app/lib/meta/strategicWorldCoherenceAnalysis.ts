/**
 * D7:8:10 — Strategic-world coherence analysis for meta-strategic completion.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { StrategicIntelligenceEquilibriumIntelligenceState } from "./strategicIntelligenceEquilibriumTypes.ts";
import type { StrategicIntelligenceContinuityIntelligenceState } from "./strategicIntelligenceContinuityTypes.ts";
import type { UnifiedMetaStrategicIntelligenceState } from "./unifiedMetaStrategicTypes.ts";
import type {
  EnterpriseCognitionSynchronizationRecord,
  StrategicWorldCoherenceRecord,
  MetaStrategicCompletionSignal,
} from "./metaStrategicCompletionTypes.ts";
import { logMetaStrategicCompletionDev } from "./metaStrategicCompletionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicWorldCoherence(input: {
  completionSignals: readonly MetaStrategicCompletionSignal[];
  enterpriseCognitionSynchronizationRecords: readonly EnterpriseCognitionSynchronizationRecord[];
  unifiedMetaStrategicState: UnifiedMetaStrategicIntelligenceState;
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState;
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicWorldCoherenceRecord[] {
  const records: StrategicWorldCoherenceRecord[] = [];
  const completionIds = input.completionSignals.map((s) => s.completionId);
  const fragmentedSignals = input.completionSignals.filter(
    (s) => s.completionState === "fragmented" || s.completionState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "world-coherence::cognition-fragmentation",
      coherenceType: "enterprise_cognition_fragmentation",
      coherenceStrength: clamp01(
        fragmentedSignals / Math.max(1, input.completionSignals.length) * 0.5 +
          input.unifiedMetaStrategicState.ecosystemFragmentationScore * 0.35
      ),
      explanation:
        "Operational continuity improving while meta-drift accelerates may signal enterprise cognition fragmentation risk.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world-coherence::unstable-coherence",
      coherenceType: "unstable_strategic_coherence",
      coherenceStrength: clamp01(
        input.strategicEvolutionState.transformationPressureScore * 0.4 +
          input.strategicEquilibriumState.equilibriumPressureScore * 0.35
      ),
      explanation:
        "Unstable strategic coherence may emerge when transformation and equilibrium pressures diverge across the meta-world.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world-coherence::disconnected-pathways",
      coherenceType: "disconnected_meta_pathways",
      coherenceStrength: clamp01(
        input.metaCausalityState.metaCausalityCoherenceScore * 0.35 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Disconnected meta-intelligence pathways may weaken finalization of the enterprise strategic cognition ecosystem.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world-coherence::continuity-equilibrium-imbalance",
      coherenceType: "continuity_equilibrium_imbalance",
      coherenceStrength: clamp01(
        Math.abs(
          input.strategicContinuityState.fragmentationPressureScore -
            input.strategicEquilibriumState.equilibriumPressureScore
        ) * 0.55 +
          input.strategicContinuityState.fragmentationPressureScore * 0.2
      ),
      explanation:
        "Continuity and equilibrium imbalance may destabilize the unified meta-operational intelligence world.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world-coherence::predictive-meta-instability",
      coherenceType: "predictive_meta_instability",
      coherenceStrength: clamp01(
        input.metaStrategicState.metaInstabilityScore * 0.45 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Predictive and meta instability may threaten long-horizon coherence across the completed cognition platform.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "world-coherence::cognition-degradation",
      coherenceType: "long_horizon_cognition_degradation",
      coherenceStrength: clamp01(
        input.strategicDriftState.longHorizonDriftScore * 0.4 +
          input.strategicDriftState.strategicDriftInstabilityScore * 0.35 +
          input.strategicResilienceState.recoveryPressureScore * 0.15
      ),
      explanation:
        "Long-horizon cognition degradation may compound when drift, recovery pressure, and fragmentation align across layers.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    })
  );

  logMetaStrategicCompletionDev("StrategicWorld", {
    worldCoherenceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateWorldFragmentationScore(input: {
  completionSignals: readonly MetaStrategicCompletionSignal[];
  strategicWorldCoherenceRecords: readonly StrategicWorldCoherenceRecord[];
  unifiedMetaStrategicState: UnifiedMetaStrategicIntelligenceState;
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
}): number {
  const fragmentedSignals = input.completionSignals.filter(
    (s) => s.completionState === "fragmented" || s.completionState === "critical"
  ).length;
  const worldPressure =
    input.strategicWorldCoherenceRecords.length === 0
      ? 0
      : input.strategicWorldCoherenceRecords.reduce((s, r) => s + r.coherenceStrength, 0) /
        input.strategicWorldCoherenceRecords.length;
  return clamp01(
    (fragmentedSignals / Math.max(1, input.completionSignals.length)) * 0.3 +
      worldPressure * 0.3 +
      input.unifiedMetaStrategicState.ecosystemFragmentationScore * 0.2 +
      input.strategicContinuityState.fragmentationPressureScore * 0.1 +
      input.strategicDriftState.strategicDriftInstabilityScore * 0.05
  );
}
