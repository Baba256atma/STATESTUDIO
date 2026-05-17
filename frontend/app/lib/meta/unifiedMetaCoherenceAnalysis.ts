/**
 * D7:8:9 — Unified meta-coherence analysis for enterprise cognition ecosystem.
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
import type {
  CrossIntelligenceSynchronizationRecord,
  UnifiedMetaCoherenceRecord,
  UnifiedMetaStrategicSignal,
} from "./unifiedMetaStrategicTypes.ts";
import { logUnifiedMetaStrategicDev } from "./unifiedMetaStrategicDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeUnifiedMetaCoherence(input: {
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  crossIntelligenceSynchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
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
}): readonly UnifiedMetaCoherenceRecord[] {
  const records: UnifiedMetaCoherenceRecord[] = [];
  const unifiedIds = input.unifiedMetaSignals.map((s) => s.unifiedMetaId);
  const fragmentedSignals = input.unifiedMetaSignals.filter(
    (s) => s.unifiedMetaState === "fragmented" || s.unifiedMetaState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "coherence::fragmented-cognition",
      coherenceType: "fragmented_enterprise_cognition",
      coherenceStrength: clamp01(
        fragmentedSignals / Math.max(1, input.unifiedMetaSignals.length) * 0.5 +
          input.strategicContinuityState.fragmentationPressureScore * 0.35
      ),
      explanation:
        "Fragmented enterprise cognition may signal disconnected strategic pathways across meta-intelligence layers.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::disconnected-pathways",
      coherenceType: "disconnected_strategic_pathways",
      coherenceStrength: clamp01(
        input.strategicEvolutionState.transformationPressureScore * 0.4 +
          input.strategicDriftState.longHorizonDriftScore * 0.35
      ),
      explanation:
        "Disconnected strategic pathways may emerge when evolution and drift pull cognition in opposing directions.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::long-horizon-degradation",
      coherenceType: "long_horizon_coherence_degradation",
      coherenceStrength: clamp01(
        input.strategicDriftState.strategicDriftInstabilityScore * 0.45 +
          input.strategicDriftState.longHorizonDriftScore * 0.35
      ),
      explanation:
        "Long-horizon coherence degradation may elevate when strategic drift accelerates despite improving operational continuity.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::resilience-equilibrium-imbalance",
      coherenceType: "resilience_equilibrium_imbalance",
      coherenceStrength: clamp01(
        Math.abs(
          input.strategicResilienceState.recoveryPressureScore -
            input.strategicEquilibriumState.equilibriumPressureScore
        ) * 0.55 +
          input.strategicResilienceState.recoveryPressureScore * 0.25
      ),
      explanation:
        "Resilience and equilibrium imbalance may indicate meta-coherence instability when recovery and balance pressures diverge.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::predictive-meta-instability",
      coherenceType: "predictive_meta_instability",
      coherenceStrength: clamp01(
        input.metaStrategicState.metaInstabilityScore * 0.45 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Predictive and meta instability may weaken unified intelligence when foresight and pattern layers desynchronize.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::ecosystem-fragmentation",
      coherenceType: "strategic_ecosystem_fragmentation",
      coherenceStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.4 +
          input.strategicEquilibriumState.equilibriumPressureScore * 0.3 +
          input.strategicContinuityState.fragmentationPressureScore * 0.25
      ),
      explanation:
        "Optimization pressure with leadership fragmentation and continuity degradation may signal unified strategic destabilization.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
    })
  );

  logUnifiedMetaStrategicDev("StrategicCoherence", {
    unifiedMetaCoherenceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateEcosystemFragmentationScore(input: {
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  unifiedMetaCoherenceRecords: readonly UnifiedMetaCoherenceRecord[];
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState;
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
}): number {
  const fragmentedSignals = input.unifiedMetaSignals.filter(
    (s) => s.unifiedMetaState === "fragmented" || s.unifiedMetaState === "critical"
  ).length;
  const coherencePressure =
    input.unifiedMetaCoherenceRecords.length === 0
      ? 0
      : input.unifiedMetaCoherenceRecords.reduce((s, r) => s + r.coherenceStrength, 0) /
        input.unifiedMetaCoherenceRecords.length;
  return clamp01(
    (fragmentedSignals / Math.max(1, input.unifiedMetaSignals.length)) * 0.3 +
      coherencePressure * 0.3 +
      input.strategicContinuityState.fragmentationPressureScore * 0.15 +
      input.strategicEquilibriumState.equilibriumPressureScore * 0.1 +
      input.strategicEvolutionState.transformationPressureScore * 0.1 +
      input.strategicDriftState.strategicDriftInstabilityScore * 0.05
  );
}
