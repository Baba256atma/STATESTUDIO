/**
 * D7:8:6 — Long-horizon strategic intelligence evolution modeling.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  LongHorizonEvolutionRecord,
  StrategicIntelligenceEvolutionSignal,
  StrategicIntelligenceEvolutionStateLabel,
} from "./strategicIntelligenceEvolutionTypes.ts";
import { logStrategicIntelligenceEvolutionDev } from "./strategicIntelligenceEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function evolutionStateFromProfile(
  coherence: number,
  transformation: number,
  pressure: number
): StrategicIntelligenceEvolutionStateLabel {
  if (pressure >= 0.72) return "critical";
  if (pressure >= 0.58) return "transforming";
  if (transformation >= 0.58 && coherence >= 0.5) return "accelerating";
  if (transformation >= 0.5 && pressure < 0.45) return "adaptive";
  if (coherence >= 0.55 && pressure < 0.4) return "stable";
  return pressure > coherence ? "transforming" : "adaptive";
}

export function deriveStrategicIntelligenceEvolutionSignals(input: {
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
  evolutionLeverageFactor?: number;
  transformationStressFactor?: number;
}): StrategicIntelligenceEvolutionSignal[] {
  const leverage = clamp01(input.evolutionLeverageFactor ?? 0);
  const stress = clamp01(input.transformationStressFactor ?? 0);
  const signals: StrategicIntelligenceEvolutionSignal[] = [];

  const zoneSets = [
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
      input.strategicResilienceState.strategicResilienceCapacityScore * 0.25 +
        input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.25 +
        input.metaStrategicState.strategicMetaCoherenceScore * 0.2 +
        leverage * 0.08
    );
    const transformation = clamp01(
      input.metaStrategicState.strategicEvolutionScore * 0.3 +
        input.strategicPatternState.longHorizonPatternScore * 0.25 +
        input.strategicResilienceState.adaptiveRecoveryScore * 0.2 +
        leverage * 0.08
    );
    const pressure = clamp01(
      input.strategicDriftState.strategicDriftInstabilityScore * 0.3 +
        input.strategicResilienceState.recoveryPressureScore * 0.25 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        stress * 0.1
    );

    const evolutionState = evolutionStateFromProfile(coherence, transformation, pressure);
    const evolutionStrength = clamp01(
      coherence * 0.35 + transformation * 0.35 + (1 - pressure) * 0.25
    );

    const drivers: string[] = [];
    if (evolutionState === "stable") drivers.push("evolution_stable", "maturity_preserved");
    if (evolutionState === "adaptive") drivers.push("adaptive_transformation", "resilience_learning");
    if (evolutionState === "accelerating") drivers.push("positive_evolution", "capability_maturation");
    if (evolutionState === "transforming") drivers.push("transformation_instability", "pathway_tension");
    if (evolutionState === "critical") drivers.push("negative_evolution", "fragmentation_risk");

    signals.push(
      Object.freeze({
        evolutionId: `evolution::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        evolutionState,
        evolutionStrength,
        dominantEvolutionDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["evolution_assessment"]
        ),
        executiveLabel:
          evolutionState === "stable" || evolutionState === "adaptive"
            ? "Strategic intelligence may mature through resilience adaptation without fragmentation collapse"
            : evolutionState === "accelerating"
              ? "Positive strategic evolution may emerge as recovery adaptation and governance coordination strengthen"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        evolutionId: "evolution::fallback-coherence",
        affectedRegionIds: Object.freeze(fallback),
        evolutionState: "adaptive",
        evolutionStrength: clamp01(
          input.metaStrategicState.strategicEvolutionScore * 0.4 + leverage * 0.2
        ),
        dominantEvolutionDrivers: Object.freeze(["baseline_evolution_assessment"]),
        executiveLabel:
          "Baseline strategic intelligence evolution assessment may apply across enterprise cognition systems",
      })
    );
  }

  logStrategicIntelligenceEvolutionDev("StrategicEvolution", {
    evolutionSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.evolutionId.localeCompare(b.evolutionId));
}

export function analyzeLongHorizonEvolution(input: {
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
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
}): readonly LongHorizonEvolutionRecord[] {
  const records: LongHorizonEvolutionRecord[] = [];
  const evolutionIds = input.evolutionSignals.map((s) => s.evolutionId);

  const regions =
    input.evolutionSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.evolutionSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "evolution::capability-transformation",
      evolutionType: "strategic_capability_transformation",
      evolutionStrength: clamp01(
        input.metaStrategicState.strategicEvolutionScore * 0.45 +
          input.strategicPatternState.longHorizonPatternScore * 0.35
      ),
      explanation:
        "Strategic capability transformation may reshape organizational futures as enterprise cognition matures across long-horizon realities.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::governance-evolution",
      evolutionType: "governance_evolution",
      evolutionStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaCausalityState.metaCausalityCoherenceScore * 0.35
      ),
      explanation:
        "Improved governance transparency with strong resilience preservation may indicate positive strategic evolution trajectory.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::resilience-maturity",
      evolutionType: "resilience_adaptation_maturity",
      evolutionStrength: clamp01(
        input.strategicResilienceState.adaptiveRecoveryScore * 0.45 +
          input.strategicResilienceState.strategicResilienceCapacityScore * 0.35
      ),
      explanation:
        "Resilience adaptation maturity may track how repeated recovery adaptation strengthens strategic intelligence over time.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::predictive-refinement",
      evolutionType: "predictive_refinement",
      evolutionStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.45 +
          (1 - input.trajectoryState.trajectoryVolatilityScore) * 0.35
      ),
      explanation:
        "Predictive refinement may evolve foresight capacity as operational adaptation and strategic learning compound.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::continuity-preservation",
      evolutionType: "continuity_preservation_evolution",
      evolutionStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Continuity-preservation evolution may stabilize long-horizon organizational balance as intelligence transforms without collapse.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::cognition-transformation",
      evolutionType: "strategic_cognition_transformation",
      evolutionStrength: clamp01(
        input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.4 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.35 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.2
      ),
      explanation:
        "Strategic cognition transformation may reflect how enterprise intelligence adapts across operational pressure and resilience learning.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicIntelligenceEvolutionDev("LongHorizonEvolution", {
    longHorizonEvolutionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicEvolutionCoherenceScore(input: {
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  longHorizonEvolutionRecords: readonly LongHorizonEvolutionRecord[];
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
}): number {
  if (input.evolutionSignals.length === 0) return 0;
  const signalAvg =
    input.evolutionSignals.reduce((s, sig) => s + sig.evolutionStrength, 0) /
    input.evolutionSignals.length;
  const recordAvg =
    input.longHorizonEvolutionRecords.length === 0
      ? 0
      : input.longHorizonEvolutionRecords.reduce((s, r) => s + r.evolutionStrength, 0) /
        input.longHorizonEvolutionRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.strategicResilienceState.strategicResilienceCapacityScore * 0.15 +
      input.metaStrategicState.strategicEvolutionScore * 0.1 -
      input.strategicResilienceState.recoveryPressureScore * 0.05
  );
}

export function calculateAdaptiveTransformationScore(input: {
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  longHorizonEvolutionRecords: readonly LongHorizonEvolutionRecord[];
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
}): number {
  if (input.evolutionSignals.length === 0) return 0;
  const adaptive = input.evolutionSignals.filter(
    (s) => s.evolutionState === "adaptive" || s.evolutionState === "accelerating"
  ).length;
  const maturityRecord = input.longHorizonEvolutionRecords.find((r) =>
    r.recordId.includes("resilience-maturity")
  );
  return clamp01(
    (adaptive / Math.max(1, input.evolutionSignals.length)) * 0.4 +
      (maturityRecord?.evolutionStrength ?? 0) * 0.35 +
      input.strategicResilienceState.adaptiveRecoveryScore * 0.2
  );
}

export function identifyAdaptiveEvolutionZones(
  signals: readonly StrategicIntelligenceEvolutionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.evolutionState === "stable" ||
      signal.evolutionState === "adaptive" ||
      signal.evolutionState === "accelerating"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyUnstableTransformationZones(
  signals: readonly StrategicIntelligenceEvolutionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.evolutionState === "transforming" || signal.evolutionState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveEvolutionLabel(input: {
  strategicEvolutionCoherenceScore: number;
  adaptiveTransformationScore: number;
  transformationPressureScore: number;
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
}): StrategicIntelligenceEvolutionStateLabel {
  const critical = input.evolutionSignals.filter((s) => s.evolutionState === "critical").length;
  if (critical > 0 || input.transformationPressureScore >= 0.68) return "critical";
  const transforming = input.evolutionSignals.filter(
    (s) => s.evolutionState === "transforming"
  ).length;
  if (transforming > 0 || input.transformationPressureScore >= 0.55) return "transforming";
  const accelerating = input.evolutionSignals.filter(
    (s) => s.evolutionState === "accelerating"
  ).length;
  if (accelerating > 0 && input.adaptiveTransformationScore >= 0.5) return "accelerating";
  const adaptive = input.evolutionSignals.filter((s) => s.evolutionState === "adaptive").length;
  if (adaptive > 0 && input.strategicEvolutionCoherenceScore >= 0.5) return "adaptive";
  if (input.strategicEvolutionCoherenceScore >= 0.5 && input.transformationPressureScore < 0.45) {
    return "stable";
  }
  return input.transformationPressureScore > input.strategicEvolutionCoherenceScore
    ? "transforming"
    : "adaptive";
}
