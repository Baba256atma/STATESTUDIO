/**
 * D7:8:4 — Strategic-coherence degradation analysis.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type {
  LongHorizonIntelligenceDriftRecord,
  StrategicCoherenceDegradationRecord,
  StrategicIntelligenceDriftSignal,
} from "./strategicIntelligenceDriftTypes.ts";
import { logStrategicIntelligenceDriftDev } from "./strategicIntelligenceDriftDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicCoherenceDegradation(input: {
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  longHorizonIntelligenceDriftRecords: readonly LongHorizonIntelligenceDriftRecord[];
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicCoherenceDegradationRecord[] {
  const records: StrategicCoherenceDegradationRecord[] = [];
  const driftIds = input.driftSignals.map((s) => s.driftId);

  const driftingSignals = input.driftSignals.filter(
    (s) =>
      s.driftState === "drifting" ||
      s.driftState === "destabilizing" ||
      s.driftState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "degradation::strategic-intelligence",
      degradationType: "degrading_strategic_intelligence",
      degradationStrength: clamp01(
        driftingSignals / Math.max(1, input.driftSignals.length) * 0.5 +
          (1 - input.metaCausalityState.metaCausalityCoherenceScore) * 0.35
      ),
      explanation:
        "Degrading strategic intelligence may signal that enterprise reasoning systems are slowly losing coherence with resilience and continuity objectives.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "degradation::hidden-instability",
      degradationType: "hidden_long_horizon_instability",
      degradationStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.metaCausalityState.metaCausalityInstabilityScore * 0.35
      ),
      explanation:
        "Hidden long-horizon instability may accumulate when short-term operational success masks declining resilience capacity.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "degradation::predictive-overconfidence",
      degradationType: "predictive_overconfidence_drift",
      degradationStrength: clamp01(
        input.longHorizonIntelligenceDriftRecords.find((r) =>
          r.recordId.includes("predictive-instability")
        )?.driftStrength ?? 0.35
      ),
      explanation:
        "Predictive overconfidence drift may elevate when foresight stability weakens while decision confidence remains high.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "degradation::governance-erosion",
      degradationType: "governance_coherence_erosion",
      degradationStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.metaStrategicState.metaInstabilityScore * 0.3
      ),
      explanation:
        "Governance coherence erosion may reflect policy fatigue and coordination degradation across strategic cycles.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "degradation::resilience-pathways",
      degradationType: "resilience_degradation_pathways",
      degradationStrength: clamp01(
        input.longHorizonIntelligenceDriftRecords.find((r) =>
          r.recordId.includes("resilience-erosion")
        )?.driftStrength ?? 0.4
      ),
      explanation:
        "Resilience degradation pathways may form when optimization pressure repeatedly weakens redundancy and recovery capability.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "degradation::recursive-contradiction",
      degradationType: "recursive_strategic_contradictions",
      degradationStrength: clamp01(
        input.strategicPatternState.patternInstabilityScore * 0.4 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Recursive strategic contradictions may appear when competing incentives reinforce short-term gains while undermining long-horizon stability.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceDriftDev("IntelligenceDegradation", {
    degradationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicIntelligenceCoherenceScore(input: {
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  strategicCoherenceDegradationRecords: readonly StrategicCoherenceDegradationRecord[];
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  if (input.driftSignals.length === 0) return 0;
  const signalAvg =
    input.driftSignals.reduce((s, sig) => s + (1 - sig.driftStrength), 0) /
    input.driftSignals.length;
  const degradationPressure =
    input.strategicCoherenceDegradationRecords.length === 0
      ? 0
      : input.strategicCoherenceDegradationRecords.reduce(
          (s, r) => s + r.degradationStrength,
          0
        ) / input.strategicCoherenceDegradationRecords.length;
  return clamp01(
    signalAvg * 0.3 +
      (1 - degradationPressure) * 0.25 +
      input.metaCausalityState.metaCausalityCoherenceScore * 0.2 +
      input.metaStrategicState.strategicMetaCoherenceScore * 0.1 +
      input.strategicPatternState.patternCoherenceScore * 0.1 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.05 -
      input.metaCausalityState.metaCausalityInstabilityScore * 0.05
  );
}

export function calculateStrategicDriftInstabilityScore(input: {
  driftSignals: readonly StrategicIntelligenceDriftSignal[];
  strategicCoherenceDegradationRecords: readonly StrategicCoherenceDegradationRecord[];
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
}): number {
  const unstableSignals = input.driftSignals.filter(
    (s) => s.driftState === "destabilizing" || s.driftState === "critical"
  ).length;
  const degradationPressure =
    input.strategicCoherenceDegradationRecords.length === 0
      ? 0
      : input.strategicCoherenceDegradationRecords.reduce(
          (s, r) => s + r.degradationStrength,
          0
        ) / input.strategicCoherenceDegradationRecords.length;
  return clamp01(
    (unstableSignals / Math.max(1, input.driftSignals.length)) * 0.35 +
      degradationPressure * 0.35 +
      input.metaCausalityState.metaCausalityInstabilityScore * 0.15 +
      input.strategicPatternState.patternInstabilityScore * 0.1
  );
}
