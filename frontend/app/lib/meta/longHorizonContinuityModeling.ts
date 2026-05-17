/**
 * D7:8:8 — Long-horizon strategic intelligence continuity modeling.
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
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  LongHorizonContinuityRecord,
  StrategicIntelligenceContinuitySignal,
  StrategicIntelligenceContinuityStateLabel,
} from "./strategicIntelligenceContinuityTypes.ts";
import { logStrategicIntelligenceContinuityDev } from "./strategicIntelligenceContinuityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function continuityStateFromProfile(
  persistence: number,
  adaptation: number,
  fragmentation: number
): StrategicIntelligenceContinuityStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmenting";
  if (adaptation >= 0.55 && persistence >= 0.5) return "recovering";
  if (adaptation >= 0.5 && fragmentation < 0.45) return "adaptive";
  if (persistence >= 0.55 && fragmentation < 0.4) return "stable";
  return fragmentation > persistence ? "fragmenting" : "adaptive";
}

export function deriveStrategicIntelligenceContinuitySignals(input: {
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
  continuityLeverageFactor?: number;
  disruptionStressFactor?: number;
}): StrategicIntelligenceContinuitySignal[] {
  const leverage = clamp01(input.continuityLeverageFactor ?? 0);
  const stress = clamp01(input.disruptionStressFactor ?? 0);
  const signals: StrategicIntelligenceContinuitySignal[] = [];

  const zoneSets = [
    input.strategicEquilibriumState.balancedEquilibriumZones,
    input.strategicEvolutionState.adaptiveEvolutionZones,
    input.strategicResilienceState.adaptiveRecoveryZones,
    input.strategicDriftState.emergingDriftZones,
    input.metaCausalityState.strategicForceZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const persistence = clamp01(
      input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.25 +
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.25 +
        input.foresightState.futureReadinessScore * 0.2 +
        leverage * 0.08
    );
    const adaptation = clamp01(
      input.strategicResilienceState.adaptiveRecoveryScore * 0.3 +
        input.strategicEvolutionState.adaptiveTransformationScore * 0.25 +
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.2 +
        leverage * 0.08
    );
    const fragmentation = clamp01(
      input.strategicEquilibriumState.equilibriumPressureScore * 0.25 +
        input.strategicEvolutionState.transformationPressureScore * 0.25 +
        input.strategicDriftState.strategicDriftInstabilityScore * 0.2 +
        stress * 0.1
    );

    const continuityState = continuityStateFromProfile(persistence, adaptation, fragmentation);
    const continuityStrength = clamp01(
      persistence * 0.35 + adaptation * 0.35 + (1 - fragmentation) * 0.25
    );

    const drivers: string[] = [];
    if (continuityState === "stable") drivers.push("continuity_stable", "direction_preserved");
    if (continuityState === "adaptive") drivers.push("adaptive_continuity", "coherence_absorption");
    if (continuityState === "recovering") drivers.push("continuity_recovery", "stabilization_pathway");
    if (continuityState === "fragmenting") drivers.push("fragmentation_risk", "continuity_strain");
    if (continuityState === "critical") drivers.push("continuity_collapse_risk", "survival_threat");

    signals.push(
      Object.freeze({
        continuityId: `continuity::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        continuityState,
        continuityStrength,
        dominantContinuityDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["continuity_assessment"]
        ),
        executiveLabel:
          continuityState === "stable" || continuityState === "adaptive"
            ? "Strategic continuity may preserve long-horizon direction across disruption and transformation"
            : continuityState === "recovering"
              ? "Recovery adaptation may be stabilizing strategic continuity after sustained pressure"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        continuityId: "continuity::fallback-persistence",
        affectedRegionIds: Object.freeze(fallback),
        continuityState: "adaptive",
        continuityStrength: clamp01(
          input.strategicResilienceState.strategicResilienceCapacityScore * 0.4 + leverage * 0.2
        ),
        dominantContinuityDrivers: Object.freeze(["baseline_continuity_assessment"]),
        executiveLabel:
          "Baseline strategic intelligence continuity assessment may apply across enterprise cognition systems",
      })
    );
  }

  logStrategicIntelligenceContinuityDev("StrategicContinuity", {
    continuitySignalCount: signals.length,
  });
  return signals.sort((a, b) => a.continuityId.localeCompare(b.continuityId));
}

export function analyzeLongHorizonContinuity(input: {
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
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
}): readonly LongHorizonContinuityRecord[] {
  const records: LongHorizonContinuityRecord[] = [];
  const continuityIds = input.continuitySignals.map((s) => s.continuityId);
  const regions =
    input.continuitySignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.continuitySignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "continuity::preservation",
      continuityType: "strategic_continuity_preservation",
      continuityStrength: clamp01(
        input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.4 +
          input.strategicResilienceState.strategicResilienceCapacityScore * 0.35
      ),
      explanation:
        "Strategic continuity preservation may sustain enterprise intelligence direction across disruption and long-horizon evolution.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::governance-adaptation",
      continuityType: "governance_continuity_adaptation",
      continuityStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaCausalityState.metaCausalityCoherenceScore * 0.35
      ),
      explanation:
        "Strong governance transparency with stable resilience adaptation may indicate high strategic continuity capacity.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::resilience-stabilization",
      continuityType: "resilience_driven_continuity_stabilization",
      continuityStrength: clamp01(
        input.strategicResilienceState.adaptiveRecoveryScore * 0.45 +
          input.strategicResilienceState.strategicResilienceCapacityScore * 0.35
      ),
      explanation:
        "Resilience-driven continuity stabilization may preserve coherence when operational instability occurs but governance remains coherent.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::under-pressure",
      continuityType: "continuity_under_pressure_behavior",
      continuityStrength: clamp01(
        (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.45 +
          input.strategicEquilibriumState.systemicBalanceScore * 0.35
      ),
      explanation:
        "Continuity-under-pressure behavior may reflect how cognition absorbs instability while maintaining operational meaning across time.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::persistence-structures",
      continuityType: "strategic_persistence_structures",
      continuityStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Strategic persistence structures may anchor long-horizon direction when predictive coherence preservation stabilizes decision systems.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::survival-pathways",
      continuityType: "long_horizon_strategic_survival_pathways",
      continuityStrength: clamp01(
        input.strategicEvolutionState.strategicEvolutionCoherenceScore * 0.35 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.35 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.25
      ),
      explanation:
        "Long-horizon strategic survival pathways may sustain organizational direction as intelligence adapts without fragmentation collapse.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicIntelligenceContinuityDev("LongHorizonPersistence", {
    longHorizonContinuityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateLongHorizonStrategicContinuityScore(input: {
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
}): number {
  if (input.continuitySignals.length === 0) return 0;
  const signalAvg =
    input.continuitySignals.reduce((s, sig) => s + sig.continuityStrength, 0) /
    input.continuitySignals.length;
  const recordAvg =
    input.longHorizonContinuityRecords.length === 0
      ? 0
      : input.longHorizonContinuityRecords.reduce((s, r) => s + r.continuityStrength, 0) /
        input.longHorizonContinuityRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.strategicEquilibriumState.strategicEquilibriumCoherenceScore * 0.15 +
      input.strategicResilienceState.strategicResilienceCapacityScore * 0.1 -
      input.strategicEquilibriumState.equilibriumPressureScore * 0.05
  );
}

export function calculateAdaptiveContinuityScore(input: {
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
}): number {
  if (input.continuitySignals.length === 0) return 0;
  const adaptive = input.continuitySignals.filter(
    (s) =>
      s.continuityState === "adaptive" ||
      s.continuityState === "recovering" ||
      s.continuityState === "stable"
  ).length;
  const stabilizationRecord = input.longHorizonContinuityRecords.find((r) =>
    r.recordId.includes("resilience-stabilization")
  );
  return clamp01(
    (adaptive / Math.max(1, input.continuitySignals.length)) * 0.4 +
      (stabilizationRecord?.continuityStrength ?? 0) * 0.35 +
      input.strategicResilienceState.adaptiveRecoveryScore * 0.2
  );
}

export function identifyPreservedContinuityZones(
  signals: readonly StrategicIntelligenceContinuitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.continuityState === "stable" ||
      signal.continuityState === "adaptive" ||
      signal.continuityState === "recovering"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyContinuityFailureZones(
  signals: readonly StrategicIntelligenceContinuitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.continuityState === "fragmenting" || signal.continuityState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveContinuityLabel(input: {
  longHorizonStrategicContinuityScore: number;
  adaptiveContinuityScore: number;
  fragmentationPressureScore: number;
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
}): StrategicIntelligenceContinuityStateLabel {
  const critical = input.continuitySignals.filter((s) => s.continuityState === "critical").length;
  if (critical > 0 || input.fragmentationPressureScore >= 0.68) return "critical";
  const fragmenting = input.continuitySignals.filter(
    (s) => s.continuityState === "fragmenting"
  ).length;
  if (fragmenting > 0 || input.fragmentationPressureScore >= 0.55) return "fragmenting";
  const recovering = input.continuitySignals.filter((s) => s.continuityState === "recovering").length;
  if (recovering > 0 && input.adaptiveContinuityScore >= 0.5) return "recovering";
  const adaptive = input.continuitySignals.filter((s) => s.continuityState === "adaptive").length;
  if (adaptive > 0 && input.longHorizonStrategicContinuityScore >= 0.5) return "adaptive";
  if (input.longHorizonStrategicContinuityScore >= 0.5 && input.fragmentationPressureScore < 0.45) {
    return "stable";
  }
  return input.fragmentationPressureScore > input.longHorizonStrategicContinuityScore
    ? "fragmenting"
    : "adaptive";
}
