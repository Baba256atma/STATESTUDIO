/**
 * D7:8:2 — Long-horizon strategic pattern modeling.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  LongHorizonPatternRecord,
  StrategicPatternEvolutionSignal,
  StrategicPatternStateLabel,
} from "./strategicPatternEvolutionTypes.ts";
import { logStrategicPatternEvolutionDev } from "./strategicPatternEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function patternStateFromProfile(
  recurrence: number,
  stabilization: number,
  degradation: number
): StrategicPatternStateLabel {
  if (degradation >= 0.72) return "critical";
  if (degradation >= 0.58) return "degrading";
  if (recurrence >= 0.55 && stabilization >= 0.5) return "adaptive";
  if (stabilization >= 0.55 && degradation < 0.4) return "stabilizing";
  return recurrence >= 0.45 ? "emerging" : degradation > stabilization ? "degrading" : "emerging";
}

export function deriveStrategicPatternEvolutionSignals(input: {
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  patternLeverageFactor?: number;
  recurrenceStressFactor?: number;
}): StrategicPatternEvolutionSignal[] {
  const leverage = clamp01(input.patternLeverageFactor ?? 0);
  const stress = clamp01(input.recurrenceStressFactor ?? 0);
  const signals: StrategicPatternEvolutionSignal[] = [];

  const zoneSets = [
    input.metaStrategicState.adaptiveStrategyZones,
    input.metaStrategicState.unstableMetaZones,
    input.strategicRealityState.evolvingRealityZones,
    input.strategicRealityState.unstableRealityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const recurrence = clamp01(
      input.metaStrategicState.strategicEvolutionScore * 0.3 +
        input.strategicRealityState.unifiedOperationalStateScore * 0.25 +
        leverage * 0.1
    );
    const stabilization = clamp01(
      input.metaStrategicState.strategicMetaCoherenceScore * 0.35 +
        input.strategicRealityState.operationalRealityCoherenceScore * 0.25 +
        input.foresightState.strategicPreparednessScore * 0.15 +
        leverage * 0.08
    );
    const degradation = clamp01(
      input.metaStrategicState.metaInstabilityScore * 0.35 +
        input.strategicRealityState.realityInstabilityScore * 0.25 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        stress * 0.1
    );

    const patternState = patternStateFromProfile(recurrence, stabilization, degradation);
    const patternStrength = clamp01(
      recurrence * 0.35 + stabilization * 0.35 + (1 - degradation) * 0.25
    );

    const drivers: string[] = [];
    if (patternState === "emerging") drivers.push("pattern_emergence", "recurring_behavior");
    if (patternState === "stabilizing") drivers.push("pattern_stabilization", "continuity_structure");
    if (patternState === "adaptive") drivers.push("adaptive_pattern", "resilience_growth");
    if (patternState === "degrading") drivers.push("pattern_degradation", "fragility_accumulation");
    if (patternState === "critical") drivers.push("pattern_criticality", "recovery_instability");

    signals.push(
      Object.freeze({
        patternId: `pattern::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        patternState,
        patternStrength,
        dominantPatternDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["pattern_assessment"]
        ),
        executiveLabel:
          patternState === "stabilizing" || patternState === "adaptive"
            ? "Recurring strategic behaviors may be stabilizing into recognizable long-horizon enterprise patterns"
            : patternState === "degrading"
              ? "Recurring optimization pressures may be forming a degrading fragility pattern across domains"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        patternId: "pattern::fallback-recurring",
        affectedRegionIds: Object.freeze(fallback),
        patternState: "emerging",
        patternStrength: clamp01(
          input.metaStrategicState.strategicMetaCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantPatternDrivers: Object.freeze(["baseline_pattern_assessment"]),
        executiveLabel:
          "Baseline strategic pattern assessment may apply across recurring enterprise behaviors",
      })
    );
  }

  logStrategicPatternEvolutionDev("StrategicPattern", {
    patternSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.patternId.localeCompare(b.patternId));
}

export function analyzeLongHorizonPatterns(input: {
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly LongHorizonPatternRecord[] {
  const records: LongHorizonPatternRecord[] = [];
  const patternIds = input.patternSignals.map((s) => s.patternId);

  const regions =
    input.patternSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.patternSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "long-horizon::recurring-operational",
      patternType: "recurring_operational_strategies",
      patternStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.strategicRealityState.unifiedOperationalStateScore * 0.35
      ),
      explanation:
        "Recurring operational strategies may form recognizable patterns when similar efficiency and recovery decisions repeat across cycles.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "long-horizon::governance-behavior",
      patternType: "governance_behavior_patterns",
      patternStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.35
      ),
      explanation:
        "Governance behavior patterns may emerge when coordination and oversight rhythms repeat under sustained strategic pressure.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "long-horizon::resilience-adaptation",
      patternType: "resilience_adaptation_cycles",
      patternStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.45 +
          input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Repeated recovery coordination improvement with reduced fragility propagation may indicate a positive resilience evolution pattern.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "long-horizon::continuity-preservation",
      patternType: "continuity_preservation_structures",
      patternStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Continuity-preservation structures may strengthen when adaptive governance coordination repeatedly reinforces equilibrium pathways.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "long-horizon::optimization-risk",
      patternType: "optimization_risk_tradeoffs",
      patternStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.35 +
          input.metaStrategicState.metaInstabilityScore * 0.35 +
          input.cascadeState.cascadeAmplificationScore * 0.15
      ),
      explanation:
        "Optimization-risk tradeoff patterns may emerge when short-term efficiency gains repeatedly weaken long-horizon resilience equilibrium.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "long-horizon::evolution-trajectory",
      patternType: "strategic_evolution_trajectories",
      patternStrength: clamp01(
        input.metaStrategicState.strategicEvolutionScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.2
      ),
      explanation:
        "Strategic evolution trajectories may reveal how recurring decisions reshape enterprise operational realities over extended horizons.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicPatternEvolutionDev("PatternEvolution", {
    longHorizonRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateLongHorizonPatternScore(input: {
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  longHorizonPatternRecords: readonly LongHorizonPatternRecord[];
  metaStrategicState: MetaStrategicIntelligenceState;
}): number {
  if (input.patternSignals.length === 0) return 0;
  const signalAvg =
    input.patternSignals.reduce((s, sig) => s + sig.patternStrength, 0) /
    input.patternSignals.length;
  const recordAvg =
    input.longHorizonPatternRecords.length === 0
      ? 0
      : input.longHorizonPatternRecords.reduce((s, r) => s + r.patternStrength, 0) /
        input.longHorizonPatternRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.metaStrategicState.strategicEvolutionScore * 0.2 -
      input.metaStrategicState.metaInstabilityScore * 0.05
  );
}

export function identifyAdaptivePatternZones(
  signals: readonly StrategicPatternEvolutionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.patternState === "stabilizing" ||
      signal.patternState === "adaptive" ||
      signal.patternState === "emerging"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyUnstablePatternZones(
  signals: readonly StrategicPatternEvolutionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.patternState === "degrading" || signal.patternState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutivePatternLabel(input: {
  patternCoherenceScore: number;
  longHorizonPatternScore: number;
  patternInstabilityScore: number;
  patternSignals: readonly StrategicPatternEvolutionSignal[];
}): StrategicPatternStateLabel {
  const critical = input.patternSignals.filter((s) => s.patternState === "critical").length;
  if (critical > 0 || input.patternInstabilityScore >= 0.68) return "critical";
  const degrading = input.patternSignals.filter((s) => s.patternState === "degrading").length;
  if (degrading > 0 || input.patternInstabilityScore >= 0.55) return "degrading";
  const adaptive = input.patternSignals.filter((s) => s.patternState === "adaptive").length;
  if (adaptive > 0 && input.longHorizonPatternScore >= 0.5) return "adaptive";
  const stabilizing = input.patternSignals.filter((s) => s.patternState === "stabilizing").length;
  if (stabilizing > 0 && input.patternCoherenceScore >= 0.5) return "stabilizing";
  if (input.patternCoherenceScore >= 0.45 && input.patternInstabilityScore < 0.45) {
    return "emerging";
  }
  return input.patternInstabilityScore > input.patternCoherenceScore ? "degrading" : "emerging";
}
