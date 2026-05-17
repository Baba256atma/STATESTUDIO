/**
 * D7:8:9 — Cross-intelligence synchronization modeling for unified meta-strategic intelligence.
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
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  CrossIntelligenceSynchronizationRecord,
  UnifiedMetaStrategicSignal,
  UnifiedMetaStrategicStateLabel,
} from "./unifiedMetaStrategicTypes.ts";
import { logUnifiedMetaStrategicDev } from "./unifiedMetaStrategicDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function unifiedStateFromProfile(
  coherence: number,
  synchronization: number,
  fragmentation: number
): UnifiedMetaStrategicStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmented";
  if (synchronization >= 0.55 && coherence >= 0.5) return "transforming";
  if (synchronization >= 0.5 && fragmentation < 0.45) return "adaptive";
  if (coherence >= 0.55 && fragmentation < 0.4) return "coherent";
  return fragmentation > coherence ? "fragmented" : "adaptive";
}

export function deriveUnifiedMetaStrategicSignals(input: {
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
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  unifiedMetaLeverageFactor?: number;
  ecosystemStressFactor?: number;
}): UnifiedMetaStrategicSignal[] {
  const leverage = clamp01(input.unifiedMetaLeverageFactor ?? 0);
  const stress = clamp01(input.ecosystemStressFactor ?? 0);
  const signals: UnifiedMetaStrategicSignal[] = [];

  const zoneSets = [
    input.strategicContinuityState.preservedContinuityZones,
    input.strategicEquilibriumState.balancedEquilibriumZones,
    input.strategicEvolutionState.adaptiveEvolutionZones,
    input.strategicResilienceState.adaptiveRecoveryZones,
    input.strategicDriftState.emergingDriftZones,
    input.metaCausalityState.strategicForceZones,
    input.strategicPatternState.adaptivePatternZones,
    input.metaStrategicState.adaptiveStrategyZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.strategicContinuityState.longHorizonStrategicContinuityScore * 0.2 +
        input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.2 +
        input.strategicEvolutionState.strategicEvolutionCoherenceScore * 0.15 +
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.15 +
        input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.1 +
        leverage * 0.08
    );
    const synchronization = clamp01(
      input.strategicResilienceState.adaptiveRecoveryScore * 0.2 +
        input.strategicEquilibriumState.systemicBalanceScore * 0.2 +
        input.strategicEvolutionState.adaptiveTransformationScore * 0.15 +
        input.metaCausalityState.metaCausalityCoherenceScore * 0.15 +
        leverage * 0.08
    );
    const fragmentation = clamp01(
      input.strategicContinuityState.fragmentationPressureScore * 0.2 +
        input.strategicEquilibriumState.equilibriumPressureScore * 0.2 +
        input.strategicEvolutionState.transformationPressureScore * 0.15 +
        input.strategicDriftState.strategicDriftInstabilityScore * 0.15 +
        stress * 0.1
    );

    const unifiedMetaState = unifiedStateFromProfile(coherence, synchronization, fragmentation);
    const unifiedMetaStrength = clamp01(
      coherence * 0.35 + synchronization * 0.35 + (1 - fragmentation) * 0.25
    );

    const drivers: string[] = [];
    if (unifiedMetaState === "coherent") drivers.push("unified_coherent", "ecosystem_aligned");
    if (unifiedMetaState === "adaptive") drivers.push("adaptive_unification", "layer_synchronization");
    if (unifiedMetaState === "transforming") drivers.push("transforming_ecosystem", "pathway_evolution");
    if (unifiedMetaState === "fragmented") drivers.push("meta_fragmentation", "coherence_strain");
    if (unifiedMetaState === "critical") drivers.push("ecosystem_critical", "destabilization_risk");

    signals.push(
      Object.freeze({
        unifiedMetaId: `unified-meta::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        unifiedMetaState,
        unifiedMetaStrength,
        dominantUnifiedDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["unified_meta_assessment"]
        ),
        executiveLabel:
          unifiedMetaState === "coherent" || unifiedMetaState === "adaptive"
            ? "Enterprise strategic intelligence layers may synchronize into one long-horizon cognition ecosystem"
            : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        unifiedMetaId: "unified-meta::fallback-coherence",
        affectedRegionIds: Object.freeze(fallback),
        unifiedMetaState: "adaptive",
        unifiedMetaStrength: clamp01(
          input.metaStrategicState.strategicMetaCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantUnifiedDrivers: Object.freeze(["baseline_unified_meta_assessment"]),
        executiveLabel:
          "Baseline unified meta-strategic assessment may apply across enterprise cognition systems",
      })
    );
  }

  logUnifiedMetaStrategicDev("UnifiedMeta", { unifiedMetaSignalCount: signals.length });
  return signals.sort((a, b) => a.unifiedMetaId.localeCompare(b.unifiedMetaId));
}

export function analyzeCrossIntelligenceSynchronization(input: {
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
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
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly CrossIntelligenceSynchronizationRecord[] {
  const records: CrossIntelligenceSynchronizationRecord[] = [];
  const unifiedIds = input.unifiedMetaSignals.map((s) => s.unifiedMetaId);
  const regions =
    input.unifiedMetaSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.unifiedMetaSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "sync::resilience-equilibrium",
      synchronizationType: "resilience_equilibrium_synchronization",
      synchronizationStrength: clamp01(
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.45 +
          input.strategicEquilibriumState.systemicBalanceScore * 0.35
      ),
      explanation:
        "Resilience and equilibrium synchronization may stabilize enterprise cognition when adaptive recovery aligns with systemic balance.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::continuity-evolution",
      synchronizationType: "continuity_evolution_coherence",
      synchronizationStrength: clamp01(
        input.strategicContinuityState.longHorizonStrategicContinuityScore * 0.45 +
          input.strategicEvolutionState.adaptiveTransformationScore * 0.35
      ),
      explanation:
        "Continuity and evolution coherence may preserve long-horizon direction as transformation pathways mature without fragmentation collapse.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::causality-drift",
      synchronizationType: "meta_causality_drift_interaction",
      synchronizationStrength: clamp01(
        input.metaCausalityState.metaCausalityCoherenceScore * 0.45 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.35
      ),
      explanation:
        "Meta-causality and drift interaction may reveal whether strategic forces remain aligned as intelligence coherence shifts over time.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::governance-recovery",
      synchronizationType: "governance_recovery_alignment",
      synchronizationStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.strategicResilienceState.adaptiveRecoveryScore * 0.35
      ),
      explanation:
        "Governance and recovery alignment may anchor unified intelligence when stabilization and adaptation reinforce one another.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::predictive-meta",
      synchronizationType: "predictive_meta_continuity",
      synchronizationStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.45 +
          input.strategicContinuityState.adaptiveContinuityScore * 0.35
      ),
      explanation:
        "Predictive and meta continuity may synchronize foresight with continuity preservation across evolving enterprise realities.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::long-horizon-coherence",
      synchronizationType: "long_horizon_strategic_coherence",
      synchronizationStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.35 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.35 +
          input.strategicPatternState.patternCoherenceScore * 0.25
      ),
      explanation:
        "Strong continuity preservation with stable equilibrium and adaptive resilience may indicate high unified strategic intelligence.",
      contributingUnifiedMetaIds: Object.freeze(unifiedIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logUnifiedMetaStrategicDev("MetaSynchronization", {
    synchronizationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateUnifiedStrategicCoherenceScore(input: {
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  crossIntelligenceSynchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState;
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
}): number {
  if (input.unifiedMetaSignals.length === 0) return 0;
  const signalAvg =
    input.unifiedMetaSignals.reduce((s, sig) => s + sig.unifiedMetaStrength, 0) /
    input.unifiedMetaSignals.length;
  const recordAvg =
    input.crossIntelligenceSynchronizationRecords.length === 0
      ? 0
      : input.crossIntelligenceSynchronizationRecords.reduce(
          (s, r) => s + r.synchronizationStrength,
          0
        ) / input.crossIntelligenceSynchronizationRecords.length;
  return clamp01(
    signalAvg * 0.3 +
      recordAvg * 0.3 +
      input.strategicContinuityState.longHorizonStrategicContinuityScore * 0.15 +
      input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.1 +
      input.strategicResilienceState.strategicResilienceCapacityScore * 0.1 -
      input.strategicDriftState.strategicDriftInstabilityScore * 0.05
  );
}

export function calculateMetaSynchronizationScore(input: {
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  crossIntelligenceSynchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
}): number {
  if (input.unifiedMetaSignals.length === 0) return 0;
  const synchronized = input.unifiedMetaSignals.filter(
    (s) => s.unifiedMetaState === "coherent" || s.unifiedMetaState === "adaptive"
  ).length;
  const syncRecord = input.crossIntelligenceSynchronizationRecords.find((r) =>
    r.recordId.includes("resilience-equilibrium")
  );
  return clamp01(
    (synchronized / Math.max(1, input.unifiedMetaSignals.length)) * 0.4 +
      (syncRecord?.synchronizationStrength ?? 0) * 0.35 +
      input.strategicResilienceState.adaptiveRecoveryScore * 0.12 +
      input.strategicEquilibriumState.systemicBalanceScore * 0.1
  );
}

export function identifySynchronizedMetaZones(
  signals: readonly UnifiedMetaStrategicSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.unifiedMetaState === "coherent" ||
      signal.unifiedMetaState === "adaptive" ||
      signal.unifiedMetaState === "transforming"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedMetaZones(
  signals: readonly UnifiedMetaStrategicSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.unifiedMetaState === "fragmented" || signal.unifiedMetaState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveUnifiedMetaLabel(input: {
  unifiedStrategicCoherenceScore: number;
  metaSynchronizationScore: number;
  ecosystemFragmentationScore: number;
  unifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
}): UnifiedMetaStrategicStateLabel {
  const critical = input.unifiedMetaSignals.filter((s) => s.unifiedMetaState === "critical").length;
  if (critical > 0 || input.ecosystemFragmentationScore >= 0.68) return "critical";
  const fragmented = input.unifiedMetaSignals.filter(
    (s) => s.unifiedMetaState === "fragmented"
  ).length;
  if (fragmented > 0 || input.ecosystemFragmentationScore >= 0.55) return "fragmented";
  const transforming = input.unifiedMetaSignals.filter(
    (s) => s.unifiedMetaState === "transforming"
  ).length;
  if (transforming > 0 && input.metaSynchronizationScore >= 0.5) return "transforming";
  const adaptive = input.unifiedMetaSignals.filter((s) => s.unifiedMetaState === "adaptive").length;
  if (adaptive > 0 && input.unifiedStrategicCoherenceScore >= 0.5) return "adaptive";
  if (input.unifiedStrategicCoherenceScore >= 0.5 && input.ecosystemFragmentationScore < 0.45) {
    return "coherent";
  }
  return input.ecosystemFragmentationScore > input.unifiedStrategicCoherenceScore
    ? "fragmented"
    : "adaptive";
}
