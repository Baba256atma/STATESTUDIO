/**
 * D7:8:4 — Long-horizon strategic intelligence drift modeling.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  LongHorizonIntelligenceDriftRecord,
  StrategicIntelligenceDriftSignal,
  StrategicIntelligenceDriftStateLabel,
} from "./strategicIntelligenceDriftTypes.ts";
import { logStrategicIntelligenceDriftDev } from "./strategicIntelligenceDriftDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function driftStateFromProfile(
  coherence: number,
  accumulation: number,
  destabilization: number
): StrategicIntelligenceDriftStateLabel {
  if (destabilization >= 0.72) return "critical";
  if (destabilization >= 0.58) return "destabilizing";
  if (accumulation >= 0.55 && coherence < 0.5) return "drifting";
  if (accumulation >= 0.45) return "emerging";
  if (coherence >= 0.55 && destabilization < 0.4) return "stable";
  return destabilization > coherence ? "drifting" : "emerging";
}

export function deriveStrategicIntelligenceDriftSignals(input: {
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  driftLeverageFactor?: number;
  coherenceStressFactor?: number;
}): StrategicIntelligenceDriftSignal[] {
  const leverage = clamp01(input.driftLeverageFactor ?? 0);
  const stress = clamp01(input.coherenceStressFactor ?? 0);
  const signals: StrategicIntelligenceDriftSignal[] = [];

  const zoneSets = [
    input.metaCausalityState.strategicForceZones,
    input.metaCausalityState.systemicMetaRiskZones,
    input.strategicPatternState.adaptivePatternZones,
    input.strategicPatternState.unstablePatternZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.metaCausalityState.metaCausalityCoherenceScore * 0.3 +
        input.metaStrategicState.strategicMetaCoherenceScore * 0.25 +
        input.strategicPatternState.patternCoherenceScore * 0.2 +
        leverage * 0.08
    );
    const accumulation = clamp01(
      input.metaCausalityState.metaCausalityInstabilityScore * 0.3 +
        input.strategicPatternState.patternInstabilityScore * 0.25 +
        input.metaStrategicState.metaInstabilityScore * 0.2 +
        stress * 0.1
    );
    const destabilization = clamp01(
      input.strategicRealityState.realityInstabilityScore * 0.35 +
        input.trajectoryState.trajectoryVolatilityScore * 0.25 +
        input.divergenceState.futureFragmentationScore * 0.2 +
        stress * 0.08
    );

    const driftState = driftStateFromProfile(coherence, accumulation, destabilization);
    const driftStrength = clamp01(
      (1 - coherence) * 0.35 + accumulation * 0.35 + destabilization * 0.25
    );

    const drivers: string[] = [];
    if (driftState === "stable") drivers.push("coherence_stable", "drift_contained");
    if (driftState === "emerging") drivers.push("drift_emergence", "early_degradation");
    if (driftState === "drifting") drivers.push("coherence_drift", "optimization_bias");
    if (driftState === "destabilizing") drivers.push("instability_accumulation", "resilience_erosion");
    if (driftState === "critical") drivers.push("critical_drift", "long_horizon_destabilization");

    signals.push(
      Object.freeze({
        driftId: `drift::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        driftState,
        driftStrength,
        dominantDriftDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["drift_assessment"]
        ),
        executiveLabel:
          driftState === "stable"
            ? "Strategic intelligence may remain coherent with limited long-horizon drift accumulation"
            : driftState === "emerging" || driftState === "drifting"
              ? "Gradual strategic intelligence drift may be accumulating across recurring decision cycles"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        driftId: "drift::fallback-intelligence",
        affectedRegionIds: Object.freeze(fallback),
        driftState: "emerging",
        driftStrength: clamp01(
          input.metaCausalityState.metaCausalityInstabilityScore * 0.4 + leverage * 0.2
        ),
        dominantDriftDrivers: Object.freeze(["baseline_drift_assessment"]),
        executiveLabel:
          "Baseline strategic intelligence drift assessment may apply across enterprise reasoning systems",
      })
    );
  }

  logStrategicIntelligenceDriftDev("StrategicDrift", { driftSignalCount: signals.length });
  return signals.sort((a, b) => a.driftId.localeCompare(b.driftId));
}

export function analyzeLongHorizonIntelligenceDrift(input: {
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly LongHorizonIntelligenceDriftRecord[] {
  const records: LongHorizonIntelligenceDriftRecord[] = [];
  const driftIds = input.driftSignals.map((s) => s.driftId);

  const regions =
    input.driftSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.driftSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "intelligence-drift::coherence-degradation",
      driftType: "strategic_coherence_degradation",
      driftStrength: clamp01(
        (1 - input.metaCausalityState.metaCausalityCoherenceScore) * 0.45 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Strategic coherence degradation may indicate gradual drift as enterprise reasoning systems lose alignment with long-horizon objectives.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "intelligence-drift::resilience-erosion",
      driftType: "resilience_erosion",
      driftStrength: clamp01(
        Math.abs(
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore -
            input.operationalUniverseState.momentumState.recoveryMomentumScore
        ) * 0.85
      ),
      explanation:
        "Repeated optimization bias with decreasing resilience redundancy may accelerate long-horizon strategic drift.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "intelligence-drift::governance-drift",
      driftType: "governance_drift",
      driftStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.operationalUniverseState.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance drift may emerge when policy fatigue and leadership fragmentation weaken coordination coherence over time.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "intelligence-drift::predictive-instability",
      driftType: "predictive_confidence_instability",
      driftStrength: clamp01(
        input.trajectoryState.trajectoryVolatilityScore * 0.45 +
          input.divergenceState.futureFragmentationScore * 0.35
      ),
      explanation:
        "Predictive-confidence instability may signal overconfidence drift that masks emerging long-horizon strategic fragility.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "intelligence-drift::continuity-weakening",
      driftType: "continuity_weakening",
      driftStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Continuity weakening may reflect how unnoticed strategic drift gradually destabilizes recovery and coordination pathways.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "intelligence-drift::strategic-fragmentation",
      driftType: "long_horizon_strategic_fragmentation",
      driftStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.4 +
          input.metaStrategicState.metaInstabilityScore * 0.35 +
          input.strategicPatternState.patternInstabilityScore * 0.2
      ),
      explanation:
        "Long-horizon strategic fragmentation may intensify when governance overload and prediction instability compound meta-strategic coherence drift.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicIntelligenceDriftDev("LongHorizonDrift", {
    longHorizonDriftRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateLongHorizonDriftScore(input: {
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  longHorizonIntelligenceDriftRecords: readonly LongHorizonIntelligenceDriftRecord[];
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
}): number {
  if (input.driftSignals.length === 0) return 0;
  const signalAvg =
    input.driftSignals.reduce((s, sig) => s + sig.driftStrength, 0) / input.driftSignals.length;
  const recordAvg =
    input.longHorizonIntelligenceDriftRecords.length === 0
      ? 0
      : input.longHorizonIntelligenceDriftRecords.reduce((s, r) => s + r.driftStrength, 0) /
        input.longHorizonIntelligenceDriftRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.metaCausalityState.metaCausalityInstabilityScore * 0.2 -
      input.metaCausalityState.metaCausalityCoherenceScore * 0.05
  );
}

export function identifyEmergingDriftZones(
  signals: readonly StrategicIntelligenceDriftSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.driftState === "stable" ||
      signal.driftState === "emerging" ||
      signal.driftState === "drifting"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyDegradedStrategicZones(
  signals: readonly StrategicIntelligenceDriftSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.driftState === "destabilizing" || signal.driftState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveDriftLabel(input: {
  strategicIntelligenceCoherenceScore: number;
  longHorizonDriftScore: number;
  strategicDriftInstabilityScore: number;
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
}): StrategicIntelligenceDriftStateLabel {
  const critical = input.driftSignals.filter((s) => s.driftState === "critical").length;
  if (critical > 0 || input.strategicDriftInstabilityScore >= 0.68) return "critical";
  const destabilizing = input.driftSignals.filter((s) => s.driftState === "destabilizing").length;
  if (destabilizing > 0 || input.strategicDriftInstabilityScore >= 0.55) return "destabilizing";
  const drifting = input.driftSignals.filter((s) => s.driftState === "drifting").length;
  if (drifting > 0 && input.longHorizonDriftScore >= 0.5) return "drifting";
  const emerging = input.driftSignals.filter((s) => s.driftState === "emerging").length;
  if (emerging > 0 && input.longHorizonDriftScore >= 0.4) return "emerging";
  if (input.strategicIntelligenceCoherenceScore >= 0.5 && input.strategicDriftInstabilityScore < 0.45) {
    return "stable";
  }
  return input.strategicDriftInstabilityScore > input.strategicIntelligenceCoherenceScore
    ? "drifting"
    : "emerging";
}
