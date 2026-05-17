/**
 * D7:8:1 — Strategic-evolution modeling for meta-strategic intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { ExecutiveCognitiveCompletionIntelligenceState } from "../cognitive/executiveCognitiveCompletionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  MetaStrategicSignal,
  MetaStrategicStateLabel,
  StrategicEvolutionRecord,
} from "./metaStrategicTypes.ts";
import { logMetaStrategicDev } from "./metaStrategicDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function metaStateFromProfile(
  evolution: number,
  coherence: number,
  instability: number
): MetaStrategicStateLabel {
  if (instability >= 0.72) return "critical";
  if (instability >= 0.58) return "fragmented";
  if (evolution >= 0.55 && coherence >= 0.5) return "transforming";
  if (coherence >= 0.55 && instability < 0.4) return "adaptive";
  return instability > coherence ? "fragmented" : "stable";
}

export function deriveMetaStrategicSignals(input: {
  strategicRealityState: StrategicRealityIntelligenceState;
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  executiveOrchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  metaLeverageFactor?: number;
  evolutionStressFactor?: number;
}): MetaStrategicSignal[] {
  const leverage = clamp01(input.metaLeverageFactor ?? 0);
  const stress = clamp01(input.evolutionStressFactor ?? 0);
  const signals: MetaStrategicSignal[] = [];

  const zoneSets = [
    input.strategicRealityState.evolvingRealityZones,
    input.strategicRealityState.unstableRealityZones,
    input.operationalUniverseState.equilibriumState.stabilityZones,
    input.operationalUniverseState.equilibriumState.imbalanceZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const evolution = clamp01(
      input.strategicRealityState.unifiedOperationalStateScore * 0.3 +
        input.cognitiveCompletionState.overallCognitiveCoherenceScore * 0.25 +
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.2 +
        leverage * 0.08
    );
    const coherence = clamp01(
      input.strategicRealityState.operationalRealityCoherenceScore * 0.35 +
        input.executiveOrchestrationState.orchestrationCoherenceScore * 0.25 +
        input.foresightState.strategicPreparednessScore * 0.2 +
        leverage * 0.08
    );
    const instability = clamp01(
      input.strategicRealityState.realityInstabilityScore * 0.35 +
        input.trajectoryState.trajectoryVolatilityScore * 0.25 +
        input.divergenceState.futureFragmentationScore * 0.2 +
        stress * 0.1
    );

    const metaState = metaStateFromProfile(evolution, coherence, instability);
    const metaStrength = clamp01(
      evolution * 0.35 + coherence * 0.35 + (1 - instability) * 0.25
    );

    const drivers: string[] = [];
    if (metaState === "stable") drivers.push("strategy_stability", "coherent_evolution");
    if (metaState === "adaptive") drivers.push("adaptive_strategy", "governance_alignment");
    if (metaState === "transforming") drivers.push("strategic_transformation", "long_horizon_shift");
    if (metaState === "fragmented") drivers.push("strategy_fragmentation", "trajectory_divergence");
    if (metaState === "critical") drivers.push("meta_instability", "resilience_tradeoff_risk");

    signals.push(
      Object.freeze({
        metaId: `meta::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        metaState,
        metaStrength,
        dominantMetaDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["meta_strategic_assessment"]
        ),
        executiveLabel:
          metaState === "stable" || metaState === "adaptive"
            ? "Enterprise strategies may evolve coherently across operational domains under current governance"
            : metaState === "transforming"
              ? "Long-horizon strategic transformation may be reshaping enterprise decision ecosystems"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        metaId: "meta::fallback-strategic",
        affectedRegionIds: Object.freeze(fallback),
        metaState: "adaptive",
        metaStrength: clamp01(
          input.strategicRealityState.operationalRealityCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantMetaDrivers: Object.freeze(["baseline_meta_assessment"]),
        executiveLabel:
          "Baseline meta-strategic assessment may apply across enterprise strategy domains",
      })
    );
  }

  logMetaStrategicDev("MetaStrategy", { metaSignalCount: signals.length });
  return signals.sort((a, b) => a.metaId.localeCompare(b.metaId));
}

export function analyzeStrategicEvolution(input: {
  metaSignals: readonly MetaStrategicSignal[];
  strategicRealityState: StrategicRealityIntelligenceState;
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  executiveOrchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly StrategicEvolutionRecord[] {
  const records: StrategicEvolutionRecord[] = [];
  const metaIds = input.metaSignals.map((s) => s.metaId);

  const regions =
    input.metaSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.metaSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "evolution::strategy-lifecycle",
      evolutionType: "strategy_lifecycle_evolution",
      evolutionStrength: clamp01(
        input.strategicRealityState.unifiedOperationalStateScore * 0.45 +
          input.cognitiveCompletionState.overallCognitiveCoherenceScore * 0.35
      ),
      explanation:
        "Strategy lifecycle evolution may indicate how enterprise initiatives mature from stabilization through adaptation across operational cycles.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::strategic-drift",
      evolutionType: "strategic_drift_accumulation",
      evolutionStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.5 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35
      ),
      explanation:
        "Strategic drift accumulation may emerge when short-term optimization gradually diverges from long-horizon resilience objectives.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::resilience-tradeoff",
      evolutionType: "resilience_impact_tradeoff",
      evolutionStrength: clamp01(
        Math.abs(
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore -
            input.operationalUniverseState.momentumState.recoveryMomentumScore
        ) * 0.85
      ),
      explanation:
        "Resilience-impact tradeoffs may appear when efficiency optimization reduces redundancy while recovery systems remain under pressure.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::governance-adaptation",
      evolutionType: "governance_strategy_adaptation",
      evolutionStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.executiveOrchestrationState.orchestrationCoherenceScore * 0.35
      ),
      explanation:
        "Governance strategy adaptation may reflect how policy frameworks evolve to match shifting operational and predictive conditions.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::optimization-stability",
      evolutionType: "optimization_stability_tension",
      evolutionStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureFragmentationScore * 0.35 +
          input.cascadeState.cascadeAmplificationScore * 0.15
      ),
      explanation:
        "Optimization-vs-stability tension may intensify when aggressive efficiency gains begin weakening resilience equilibrium over long horizons.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::long-horizon-transformation",
      evolutionType: "long_horizon_strategic_transformation",
      evolutionStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.2
      ),
      explanation:
        "Long-horizon strategic transformation may reshape organizational trajectories as predictive foresight and operational reality co-evolve.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logMetaStrategicDev("StrategicEvolution", { evolutionRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicEvolutionScore(input: {
  metaSignals: readonly MetaStrategicSignal[];
  strategicEvolutionRecords: readonly StrategicEvolutionRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  if (input.metaSignals.length === 0) return 0;
  const signalAvg =
    input.metaSignals.reduce((s, sig) => s + sig.metaStrength, 0) / input.metaSignals.length;
  const evolutionAvg =
    input.strategicEvolutionRecords.length === 0
      ? 0
      : input.strategicEvolutionRecords.reduce((s, r) => s + r.evolutionStrength, 0) /
        input.strategicEvolutionRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      evolutionAvg * 0.35 +
      input.strategicRealityState.unifiedOperationalStateScore * 0.2 -
      input.strategicRealityState.realityInstabilityScore * 0.05
  );
}

export function identifyAdaptiveStrategyZones(
  signals: readonly MetaStrategicSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.metaState === "stable" || signal.metaState === "adaptive") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyUnstableMetaZones(
  signals: readonly MetaStrategicSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.metaState === "fragmented" ||
      signal.metaState === "critical" ||
      signal.metaState === "transforming"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveMetaLabel(input: {
  strategicMetaCoherenceScore: number;
  strategicEvolutionScore: number;
  metaInstabilityScore: number;
  metaSignals: readonly MetaStrategicSignal[];
}): MetaStrategicStateLabel {
  const critical = input.metaSignals.filter((s) => s.metaState === "critical").length;
  if (critical > 0 || input.metaInstabilityScore >= 0.68) return "critical";
  const fragmented = input.metaSignals.filter((s) => s.metaState === "fragmented").length;
  if (fragmented > 0 || input.metaInstabilityScore >= 0.55) return "fragmented";
  const transforming = input.metaSignals.filter((s) => s.metaState === "transforming").length;
  if (transforming > 0 && input.strategicEvolutionScore >= 0.5) return "transforming";
  const adaptive = input.metaSignals.filter((s) => s.metaState === "adaptive").length;
  if (adaptive > 0 && input.strategicMetaCoherenceScore >= 0.5) return "adaptive";
  if (input.strategicMetaCoherenceScore >= 0.5 && input.metaInstabilityScore < 0.45) {
    return "stable";
  }
  return input.metaInstabilityScore > input.strategicMetaCoherenceScore ? "fragmented" : "adaptive";
}
