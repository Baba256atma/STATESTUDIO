/**
 * D7:8:5 — Long-horizon strategic intelligence resilience modeling.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  LongHorizonResilienceRecord,
  StrategicIntelligenceResilienceSignal,
  StrategicIntelligenceResilienceStateLabel,
} from "./strategicIntelligenceResilienceTypes.ts";
import { logStrategicIntelligenceResilienceDev } from "./strategicIntelligenceResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function resilienceStateFromProfile(
  capacity: number,
  adaptation: number,
  pressure: number
): StrategicIntelligenceResilienceStateLabel {
  if (pressure >= 0.72) return "critical";
  if (pressure >= 0.58) return "strained";
  if (adaptation >= 0.55 && capacity >= 0.5) return "recovering";
  if (adaptation >= 0.5 && pressure < 0.45) return "adaptive";
  if (capacity >= 0.55 && pressure < 0.4) return "stable";
  return pressure > capacity ? "strained" : "adaptive";
}

export function deriveStrategicIntelligenceResilienceSignals(input: {
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  resilienceLeverageFactor?: number;
  recoveryStressFactor?: number;
}): StrategicIntelligenceResilienceSignal[] {
  const leverage = clamp01(input.resilienceLeverageFactor ?? 0);
  const stress = clamp01(input.recoveryStressFactor ?? 0);
  const signals: StrategicIntelligenceResilienceSignal[] = [];

  const zoneSets = [
    input.strategicDriftState.emergingDriftZones,
    input.metaCausalityState.strategicForceZones,
    input.strategicPatternState.adaptivePatternZones,
    input.metaStrategicState.adaptiveStrategyZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const capacity = clamp01(
      input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.3 +
        input.metaCausalityState.metaCausalityCoherenceScore * 0.25 +
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.2 +
        leverage * 0.08
    );
    const adaptation = clamp01(
      input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35 +
        input.metaStrategicState.strategicEvolutionScore * 0.25 +
        input.strategicPatternState.longHorizonPatternScore * 0.2 +
        leverage * 0.08
    );
    const pressure = clamp01(
      input.strategicDriftState.strategicDriftInstabilityScore * 0.35 +
        input.strategicDriftState.longHorizonDriftScore * 0.25 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        stress * 0.1
    );

    const resilienceState = resilienceStateFromProfile(capacity, adaptation, pressure);
    const resilienceStrength = clamp01(
      capacity * 0.35 + adaptation * 0.35 + (1 - pressure) * 0.25
    );

    const drivers: string[] = [];
    if (resilienceState === "stable") drivers.push("resilience_stable", "coherence_preserved");
    if (resilienceState === "adaptive") drivers.push("adaptive_absorption", "pressure_tolerance");
    if (resilienceState === "recovering") drivers.push("recovery_adaptation", "coherence_restoration");
    if (resilienceState === "strained") drivers.push("resilience_strain", "recovery_fatigue_risk");
    if (resilienceState === "critical") drivers.push("resilience_exhaustion", "continuity_risk");

    signals.push(
      Object.freeze({
        resilienceId: `resilience::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        resilienceState,
        resilienceStrength,
        dominantResilienceDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["resilience_assessment"]
        ),
        executiveLabel:
          resilienceState === "stable" || resilienceState === "adaptive"
            ? "Strategic intelligence may absorb pressure while preserving long-horizon coherence"
            : resilienceState === "recovering"
              ? "Recovery adaptation may be stabilizing strategic intelligence under sustained pressure"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        resilienceId: "resilience::fallback-capacity",
        affectedRegionIds: Object.freeze(fallback),
        resilienceState: "adaptive",
        resilienceStrength: clamp01(
          input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantResilienceDrivers: Object.freeze(["baseline_resilience_assessment"]),
        executiveLabel:
          "Baseline strategic intelligence resilience assessment may apply across enterprise cognition systems",
      })
    );
  }

  logStrategicIntelligenceResilienceDev("StrategicResilience", {
    resilienceSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.resilienceId.localeCompare(b.resilienceId));
}

export function analyzeLongHorizonResilience(input: {
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly LongHorizonResilienceRecord[] {
  const records: LongHorizonResilienceRecord[] = [];
  const resilienceIds = input.resilienceSignals.map((s) => s.resilienceId);

  const regions =
    input.resilienceSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.resilienceSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "resilience::recovery-adaptation",
      resilienceType: "strategic_recovery_adaptation",
      resilienceStrength: clamp01(
        input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.45 +
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.35
      ),
      explanation:
        "Strategic recovery adaptation may enable enterprise intelligence to restore coherence after fragmentation without collapse.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "resilience::governance-stabilization",
      resilienceType: "governance_stabilization_capacity",
      resilienceStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaCausalityState.metaCausalityCoherenceScore * 0.35
      ),
      explanation:
        "Strong governance transparency with adaptive recovery coordination may indicate high strategic resilience capacity.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "resilience::under-pressure",
      resilienceType: "resilience_under_pressure_behavior",
      resilienceStrength: clamp01(
        (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.45 +
          input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.35
      ),
      explanation:
        "Resilience-under-pressure behavior may reflect how cognition absorbs instability while limiting coherence loss.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "resilience::continuity-preservation",
      resilienceType: "continuity_preservation_structures",
      resilienceStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Continuity-preservation structures may stabilize decision systems when predictive instability emerges.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "resilience::coherence-recovery",
      resilienceType: "strategic_coherence_recovery",
      resilienceStrength: clamp01(
        input.strategicDriftState.strategicIntelligenceCoherenceScore * 0.45 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.35
      ),
      explanation:
        "Strategic coherence recovery may rebuild alignment between optimization pressure and long-horizon objectives.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "resilience::long-horizon-evolution",
      resilienceType: "long_horizon_resilience_evolution",
      resilienceStrength: clamp01(
        input.metaStrategicState.strategicEvolutionScore * 0.4 +
          input.strategicPatternState.longHorizonPatternScore * 0.35 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.2
      ),
      explanation:
        "Long-horizon resilience evolution may track how enterprise intelligence adapts strategically without fragmentation collapse.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicIntelligenceResilienceDev("LongHorizonResilience", {
    longHorizonResilienceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicResilienceCapacityScore(input: {
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  longHorizonResilienceRecords: readonly LongHorizonResilienceRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): number {
  if (input.resilienceSignals.length === 0) return 0;
  const signalAvg =
    input.resilienceSignals.reduce((s, sig) => s + sig.resilienceStrength, 0) /
    input.resilienceSignals.length;
  const recordAvg =
    input.longHorizonResilienceRecords.length === 0
      ? 0
      : input.longHorizonResilienceRecords.reduce((s, r) => s + r.resilienceStrength, 0) /
        input.longHorizonResilienceRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.2 -
      input.strategicDriftState.strategicDriftInstabilityScore * 0.05
  );
}

export function calculateAdaptiveRecoveryScore(input: {
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  longHorizonResilienceRecords: readonly LongHorizonResilienceRecord[];
  operationalUniverseState: OperationalUniverseState;
}): number {
  if (input.resilienceSignals.length === 0) return 0;
  const adaptive = input.resilienceSignals.filter(
    (s) => s.resilienceState === "adaptive" || s.resilienceState === "recovering"
  ).length;
  const recoveryRecord = input.longHorizonResilienceRecords.find((r) =>
    r.recordId.includes("recovery-adaptation")
  );
  return clamp01(
    (adaptive / Math.max(1, input.resilienceSignals.length)) * 0.4 +
      (recoveryRecord?.resilienceStrength ?? 0) * 0.35 +
      input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.2
  );
}

export function identifyAdaptiveRecoveryZones(
  signals: readonly StrategicIntelligenceResilienceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.resilienceState === "stable" ||
      signal.resilienceState === "adaptive" ||
      signal.resilienceState === "recovering"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyResilienceFailureZones(
  signals: readonly StrategicIntelligenceResilienceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.resilienceState === "strained" || signal.resilienceState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveResilienceLabel(input: {
  strategicResilienceCapacityScore: number;
  adaptiveRecoveryScore: number;
  recoveryPressureScore: number;
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
}): StrategicIntelligenceResilienceStateLabel {
  const critical = input.resilienceSignals.filter((s) => s.resilienceState === "critical").length;
  if (critical > 0 || input.recoveryPressureScore >= 0.68) return "critical";
  const strained = input.resilienceSignals.filter((s) => s.resilienceState === "strained").length;
  if (strained > 0 || input.recoveryPressureScore >= 0.55) return "strained";
  const recovering = input.resilienceSignals.filter((s) => s.resilienceState === "recovering").length;
  if (recovering > 0 && input.adaptiveRecoveryScore >= 0.5) return "recovering";
  const adaptive = input.resilienceSignals.filter((s) => s.resilienceState === "adaptive").length;
  if (adaptive > 0 && input.strategicResilienceCapacityScore >= 0.5) return "adaptive";
  if (input.strategicResilienceCapacityScore >= 0.5 && input.recoveryPressureScore < 0.45) {
    return "stable";
  }
  return input.recoveryPressureScore > input.strategicResilienceCapacityScore
    ? "strained"
    : "adaptive";
}
