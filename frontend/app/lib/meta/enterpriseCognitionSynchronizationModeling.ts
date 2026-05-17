/**
 * D7:8:10 — Full enterprise cognition synchronization modeling for meta-strategic completion.
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
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseCognitionSynchronizationRecord,
  MetaStrategicCompletionSignal,
  MetaStrategicCompletionStateLabel,
} from "./metaStrategicCompletionTypes.ts";
import { logMetaStrategicCompletionDev } from "./metaStrategicCompletionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function completionStateFromProfile(
  coherence: number,
  synchronization: number,
  fragmentation: number
): MetaStrategicCompletionStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmented";
  if (synchronization >= 0.58 && coherence >= 0.5) return "synchronized";
  if (coherence >= 0.55 && fragmentation < 0.45) return "coherent";
  if (coherence >= 0.5 && fragmentation < 0.4) return "stable";
  return fragmentation > coherence ? "fragmented" : "coherent";
}

export function deriveMetaStrategicCompletionSignals(input: {
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
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  completionLeverageFactor?: number;
  worldStressFactor?: number;
}): MetaStrategicCompletionSignal[] {
  const leverage = clamp01(input.completionLeverageFactor ?? 0);
  const stress = clamp01(input.worldStressFactor ?? 0);
  const signals: MetaStrategicCompletionSignal[] = [];

  const zoneSets = [
    input.unifiedMetaStrategicState.synchronizedMetaZones,
    input.strategicContinuityState.preservedContinuityZones,
    input.strategicEquilibriumState.balancedEquilibriumZones,
    input.strategicEvolutionState.adaptiveEvolutionZones,
    input.strategicResilienceState.adaptiveRecoveryZones,
    input.metaCausalityState.strategicForceZones,
    input.strategicPatternState.adaptivePatternZones,
    input.metaStrategicState.adaptiveStrategyZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.unifiedMetaStrategicState.unifiedStrategicCoherenceScore * 0.2 +
        input.strategicContinuityState.longHorizonStrategicContinuityScore * 0.15 +
        input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.15 +
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.1 +
        input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.1 +
        leverage * 0.08
    );
    const synchronization = clamp01(
      input.unifiedMetaStrategicState.metaSynchronizationScore * 0.25 +
        input.strategicResilienceState.adaptiveRecoveryScore * 0.2 +
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.15 +
        leverage * 0.08
    );
    const fragmentation = clamp01(
      input.unifiedMetaStrategicState.ecosystemFragmentationScore * 0.2 +
        input.strategicContinuityState.fragmentationPressureScore * 0.15 +
        input.strategicDriftState.strategicDriftInstabilityScore * 0.15 +
        stress * 0.1
    );

    const completionState = completionStateFromProfile(coherence, synchronization, fragmentation);
    const completionStrength = clamp01(
      coherence * 0.35 + synchronization * 0.35 + (1 - fragmentation) * 0.25
    );

    const drivers: string[] = [];
    if (completionState === "stable") drivers.push("completion_stable", "world_grounded");
    if (completionState === "coherent") drivers.push("meta_coherent", "layers_aligned");
    if (completionState === "synchronized") drivers.push("cognition_synchronized", "ecosystem_finalized");
    if (completionState === "fragmented") drivers.push("world_fragmentation", "pathway_disconnect");
    if (completionState === "critical") drivers.push("completion_critical", "ecosystem_risk");

    signals.push(
      Object.freeze({
        completionId: `completion::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        completionState,
        completionStrength,
        dominantCompletionDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["completion_assessment"]
        ),
        executiveLabel:
          completionState === "stable" ||
          completionState === "coherent" ||
          completionState === "synchronized"
            ? "Enterprise meta-strategic cognition may finalize into one integrated operational intelligence world"
            : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        completionId: "completion::fallback-finalization",
        affectedRegionIds: Object.freeze(fallback),
        completionState: "coherent",
        completionStrength: clamp01(
          input.unifiedMetaStrategicState.unifiedStrategicCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantCompletionDrivers: Object.freeze(["baseline_completion_assessment"]),
        executiveLabel:
          "Baseline meta-strategic completion assessment may apply across the enterprise cognition ecosystem",
      })
    );
  }

  logMetaStrategicCompletionDev("MetaCompletion", { completionSignalCount: signals.length });
  return signals.sort((a, b) => a.completionId.localeCompare(b.completionId));
}

export function analyzeEnterpriseCognitionSynchronization(input: {
  completionSignals: readonly MetaStrategicCompletionSignal[];
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
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly EnterpriseCognitionSynchronizationRecord[] {
  const records: EnterpriseCognitionSynchronizationRecord[] = [];
  const completionIds = input.completionSignals.map((s) => s.completionId);
  const regions =
    input.completionSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.completionSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "completion-sync::enterprise-cognition",
      synchronizationType: "enterprise_cognition_synchronization",
      synchronizationStrength: clamp01(
        input.unifiedMetaStrategicState.metaSynchronizationScore * 0.45 +
          input.unifiedMetaStrategicState.unifiedStrategicCoherenceScore * 0.35
      ),
      explanation:
        "Enterprise cognition synchronization may finalize all strategic layers into one meta-operational intelligence world.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "completion-sync::resilience-continuity",
      synchronizationType: "resilience_continuity_coherence",
      synchronizationStrength: clamp01(
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.45 +
          input.strategicContinuityState.longHorizonStrategicContinuityScore * 0.35
      ),
      explanation:
        "Resilience and continuity coherence may preserve long-horizon direction as recovery and stabilization reinforce one another.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "completion-sync::causality-evolution",
      synchronizationType: "causality_evolution_integration",
      synchronizationStrength: clamp01(
        input.metaCausalityState.metaCausalityCoherenceScore * 0.45 +
          input.strategicEvolutionState.adaptiveTransformationScore * 0.35
      ),
      explanation:
        "Causality and evolution integration may align strategic force pathways with transformation maturity across the ecosystem.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "completion-sync::equilibrium-stabilization",
      synchronizationType: "equilibrium_stabilization",
      synchronizationStrength: clamp01(
        input.strategicEquilibriumState.systemicBalanceScore * 0.45 +
          input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.35
      ),
      explanation:
        "Equilibrium stabilization may anchor unified meta-coherence when systemic balance persists across domains.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "completion-sync::governance-meta",
      synchronizationType: "governance_meta_continuity",
      synchronizationStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.35
      ),
      explanation:
        "Governance and meta continuity may synchronize decision systems with long-horizon strategic coherence preservation.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "completion-sync::long-horizon-coherence",
      synchronizationType: "long_horizon_strategic_coherence",
      synchronizationStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.35 +
          input.strategicPatternState.patternCoherenceScore * 0.3 +
          (1 - input.strategicDriftState.longHorizonDriftScore) * 0.25
      ),
      explanation:
        "Stable governance adaptation with strong resilience preservation and continuity stabilization may indicate high enterprise meta-coherence.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logMetaStrategicCompletionDev("MetaSynchronization", {
    synchronizationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateEnterpriseMetaCoherenceScore(input: {
  completionSignals: readonly MetaStrategicCompletionSignal[];
  enterpriseCognitionSynchronizationRecords: readonly EnterpriseCognitionSynchronizationRecord[];
  unifiedMetaStrategicState: UnifiedMetaStrategicIntelligenceState;
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
}): number {
  if (input.completionSignals.length === 0) return 0;
  const signalAvg =
    input.completionSignals.reduce((s, sig) => s + sig.completionStrength, 0) /
    input.completionSignals.length;
  const recordAvg =
    input.enterpriseCognitionSynchronizationRecords.length === 0
      ? 0
      : input.enterpriseCognitionSynchronizationRecords.reduce(
          (s, r) => s + r.synchronizationStrength,
          0
        ) / input.enterpriseCognitionSynchronizationRecords.length;
  return clamp01(
    signalAvg * 0.3 +
      recordAvg * 0.3 +
      input.unifiedMetaStrategicState.unifiedStrategicCoherenceScore * 0.15 +
      input.strategicContinuityState.longHorizonStrategicContinuityScore * 0.1 +
      input.strategicResilienceState.strategicResilienceCapacityScore * 0.1 -
      input.strategicDriftState.strategicDriftInstabilityScore * 0.05
  );
}

export function calculateCognitionSynchronizationScore(input: {
  completionSignals: readonly MetaStrategicCompletionSignal[];
  enterpriseCognitionSynchronizationRecords: readonly EnterpriseCognitionSynchronizationRecord[];
  unifiedMetaStrategicState: UnifiedMetaStrategicIntelligenceState;
}): number {
  if (input.completionSignals.length === 0) return 0;
  const synced = input.completionSignals.filter(
    (s) =>
      s.completionState === "stable" ||
      s.completionState === "coherent" ||
      s.completionState === "synchronized"
  ).length;
  const syncRecord = input.enterpriseCognitionSynchronizationRecords.find((r) =>
    r.recordId.includes("enterprise-cognition")
  );
  return clamp01(
    (synced / Math.max(1, input.completionSignals.length)) * 0.4 +
      (syncRecord?.synchronizationStrength ?? 0) * 0.35 +
      input.unifiedMetaStrategicState.metaSynchronizationScore * 0.2
  );
}

export function identifySynchronizedMetaWorldZones(
  signals: readonly MetaStrategicCompletionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.completionState === "stable" ||
      signal.completionState === "coherent" ||
      signal.completionState === "synchronized"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedMetaWorldZones(
  signals: readonly MetaStrategicCompletionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.completionState === "fragmented" || signal.completionState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveCompletionLabel(input: {
  enterpriseMetaCoherenceScore: number;
  cognitionSynchronizationScore: number;
  worldFragmentationScore: number;
  completionSignals: readonly MetaStrategicCompletionSignal[];
}): MetaStrategicCompletionStateLabel {
  const critical = input.completionSignals.filter((s) => s.completionState === "critical").length;
  if (critical > 0 || input.worldFragmentationScore >= 0.68) return "critical";
  const fragmented = input.completionSignals.filter((s) => s.completionState === "fragmented").length;
  if (fragmented > 0 || input.worldFragmentationScore >= 0.55) return "fragmented";
  const synchronized = input.completionSignals.filter(
    (s) => s.completionState === "synchronized"
  ).length;
  if (synchronized > 0 && input.cognitionSynchronizationScore >= 0.5) return "synchronized";
  const coherent = input.completionSignals.filter((s) => s.completionState === "coherent").length;
  if (coherent > 0 && input.enterpriseMetaCoherenceScore >= 0.5) return "coherent";
  if (input.enterpriseMetaCoherenceScore >= 0.5 && input.worldFragmentationScore < 0.45) {
    return "stable";
  }
  return input.worldFragmentationScore > input.enterpriseMetaCoherenceScore
    ? "fragmented"
    : "coherent";
}
