/**
 * D7:8:3 — Strategic-force propagation analysis.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type {
  LongHorizonCausalRecord,
  StrategicForcePropagationRecord,
  StrategicMetaCausalitySignal,
} from "./strategicMetaCausalityTypes.ts";
import { logStrategicMetaCausalityDev } from "./strategicMetaCausalityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicForcePropagation(input: {
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  longHorizonCausalRecords: readonly LongHorizonCausalRecord[];
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicForcePropagationRecord[] {
  const records: StrategicForcePropagationRecord[] = [];
  const metaCausalityIds = input.metaCausalitySignals.map((s) => s.metaCausalityId);

  const destabilizingSignals = input.metaCausalitySignals.filter(
    (s) => s.metaCausalityState === "destabilizing" || s.metaCausalityState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "force::hidden-drivers",
      forceType: "hidden_enterprise_strategic_drivers",
      forceStrength: clamp01(
        input.metaStrategicState.metaInstabilityScore * 0.4 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Hidden enterprise strategic drivers may accumulate when recurring incentives shape decisions without visible long-horizon tradeoff awareness.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "force::causal-amplification",
      forceType: "systemic_causal_amplification",
      forceStrength: clamp01(
        destabilizingSignals / Math.max(1, input.metaCausalitySignals.length) * 0.5 +
          input.strategicRealityState.realityInstabilityScore * 0.35
      ),
      explanation:
        "Systemic causal amplification may intensify when localized optimization forces propagate across recovery and logistics coordination systems.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "force::recursive-instability",
      forceType: "recursive_strategic_instability",
      forceStrength: clamp01(
        input.strategicPatternState.patternInstabilityScore * 0.45 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Recursive strategic instability may emerge when short-term gains repeatedly undermine shared resilience objectives across cycles.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "force::resilience-degradation",
      forceType: "resilience_degradation_forces",
      forceStrength: clamp01(
        Math.abs(
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore -
            input.operationalUniverseState.momentumState.recoveryMomentumScore
        ) * 0.85
      ),
      explanation:
        "Short-term optimization incentives combined with leadership performance pressure may form systemic resilience erosion forces.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "force::governance-conflicts",
      forceType: "governance_causality_conflicts",
      forceStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.operationalUniverseState.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance-causality conflicts may elevate when policy incentives diverge from operational continuity requirements over long horizons.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "force::long-horizon-contradiction",
      forceType: "long_horizon_strategic_contradictions",
      forceStrength: clamp01(
        input.longHorizonCausalRecords.find((r) =>
          r.recordId.includes("optimization-risk")
        )?.causalStrength ?? 0.35
      ),
      explanation:
        "Long-horizon strategic contradictions may appear when competing causal forces reinforce efficiency while undermining redundancy and recovery continuity.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
    })
  );

  logStrategicMetaCausalityDev("StrategicForce", {
    forcePropagationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateMetaCausalityCoherenceScore(input: {
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  strategicForcePropagationRecords: readonly StrategicForcePropagationRecord[];
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  if (input.metaCausalitySignals.length === 0) return 0;
  const signalAvg =
    input.metaCausalitySignals.reduce((s, sig) => s + sig.metaCausalityStrength, 0) /
    input.metaCausalitySignals.length;
  const forcePressure =
    input.strategicForcePropagationRecords.length === 0
      ? 0
      : input.strategicForcePropagationRecords.reduce((s, r) => s + r.forceStrength, 0) /
        input.strategicForcePropagationRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      (1 - forcePressure) * 0.3 +
      input.strategicPatternState.patternCoherenceScore * 0.15 +
      input.metaStrategicState.strategicMetaCoherenceScore * 0.1 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.05 -
      input.strategicPatternState.patternInstabilityScore * 0.05
  );
}

export function calculateMetaCausalityInstabilityScore(input: {
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  strategicForcePropagationRecords: readonly StrategicForcePropagationRecord[];
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
}): number {
  const unstableSignals = input.metaCausalitySignals.filter(
    (s) => s.metaCausalityState === "destabilizing" || s.metaCausalityState === "critical"
  ).length;
  const forcePressure =
    input.strategicForcePropagationRecords.length === 0
      ? 0
      : input.strategicForcePropagationRecords.reduce((s, r) => s + r.forceStrength, 0) /
        input.strategicForcePropagationRecords.length;
  return clamp01(
    (unstableSignals / Math.max(1, input.metaCausalitySignals.length)) * 0.35 +
      forcePressure * 0.35 +
      input.strategicPatternState.patternInstabilityScore * 0.15 +
      input.metaStrategicState.metaInstabilityScore * 0.1
  );
}
