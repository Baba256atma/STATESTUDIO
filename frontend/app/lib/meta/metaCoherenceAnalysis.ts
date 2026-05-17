/**
 * D7:8:1 — Meta-coherence analysis for enterprise meta-strategic intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { ExecutiveCognitiveCompletionIntelligenceState } from "../cognitive/executiveCognitiveCompletionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type {
  MetaCoherenceRecord,
  MetaStrategicSignal,
  StrategicEvolutionRecord,
} from "./metaStrategicTypes.ts";
import { logMetaStrategicDev } from "./metaStrategicDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeMetaCoherence(input: {
  metaSignals: readonly MetaStrategicSignal[];
  strategicEvolutionRecords: readonly StrategicEvolutionRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  executiveOrchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
}): readonly MetaCoherenceRecord[] {
  const records: MetaCoherenceRecord[] = [];
  const metaIds = input.metaSignals.map((s) => s.metaId);

  const unstableSignals = input.metaSignals.filter(
    (s) =>
      s.metaState === "fragmented" ||
      s.metaState === "critical" ||
      s.metaState === "transforming"
  ).length;

  records.push(
    Object.freeze({
      recordId: "coherence::conflicting-trajectories",
      coherenceType: "conflicting_strategic_trajectories",
      coherenceStrength: clamp01(
        unstableSignals / Math.max(1, input.metaSignals.length) * 0.5 +
          input.strategicRealityState.realityInstabilityScore * 0.35
      ),
      explanation:
        "Conflicting strategic trajectories may emerge when optimization, recovery, and growth initiatives pull enterprise systems in divergent directions.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::unstable-patterns",
      coherenceType: "unstable_enterprise_strategy_patterns",
      coherenceStrength: clamp01(
        input.executiveOrchestrationState.orchestrationInstabilityScore * 0.45 +
          input.cognitiveCompletionState.platformCoherenceDegradationScore * 0.35
      ),
      explanation:
        "Unstable enterprise strategy patterns may signal meta-strategic drift when coordination quality weakens under sustained strategic pressure.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::resilience-optimization",
      coherenceType: "resilience_optimization_imbalance",
      coherenceStrength: clamp01(
        input.strategicEvolutionRecords.find((r) =>
          r.recordId.includes("optimization-stability")
        )?.evolutionStrength ?? 0.4
      ),
      explanation:
        "Resilience-optimization imbalance may introduce meta-strategic instability when efficiency gains gradually weaken long-horizon equilibrium capacity.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::long-horizon-fragmentation",
      coherenceType: "long_horizon_strategic_fragmentation",
      coherenceStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.4 +
          unstableSignals / Math.max(1, input.metaSignals.length) * 0.35
      ),
      explanation:
        "Long-horizon strategic fragmentation may intensify when predictive divergence and operational reality drift compound across domains.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::governance-instability",
      coherenceType: "governance_strategy_instability",
      coherenceStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.operationalUniverseState.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance-strategy instability may elevate when policy frameworks lag behind accelerating operational and strategic transformation.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::recursive-contradiction",
      coherenceType: "recursive_strategic_contradiction",
      coherenceStrength: clamp01(
        input.strategicEvolutionRecords.find((r) =>
          r.recordId.includes("strategic-drift")
        )?.evolutionStrength ?? 0.35
      ),
      explanation:
        "Recursive strategic contradictions may appear when competing initiatives reinforce short-term gains while undermining shared long-horizon objectives.",
      contributingMetaIds: Object.freeze(metaIds.slice(0, 4)),
    })
  );

  logMetaStrategicDev("MetaCoherence", { coherenceRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicMetaCoherenceScore(input: {
  metaSignals: readonly MetaStrategicSignal[];
  metaCoherenceRecords: readonly MetaCoherenceRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
  executiveOrchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  if (input.metaSignals.length === 0) return 0;
  const signalAvg =
    input.metaSignals.reduce((s, sig) => s + sig.metaStrength, 0) / input.metaSignals.length;
  const coherenceAvg =
    input.metaCoherenceRecords.length === 0
      ? 0
      : 1 -
        input.metaCoherenceRecords.reduce((s, r) => s + r.coherenceStrength, 0) /
          input.metaCoherenceRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      coherenceAvg * 0.3 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.2 +
      input.executiveOrchestrationState.orchestrationCoherenceScore * 0.1 -
      input.strategicRealityState.realityInstabilityScore * 0.05
  );
}

export function calculateMetaInstabilityScore(input: {
  metaSignals: readonly MetaStrategicSignal[];
  metaCoherenceRecords: readonly MetaCoherenceRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  const unstableSignals = input.metaSignals.filter(
    (s) =>
      s.metaState === "fragmented" ||
      s.metaState === "critical" ||
      s.metaState === "transforming"
  ).length;
  const coherencePressure =
    input.metaCoherenceRecords.length === 0
      ? 0
      : input.metaCoherenceRecords.reduce((s, r) => s + r.coherenceStrength, 0) /
        input.metaCoherenceRecords.length;
  return clamp01(
    (unstableSignals / Math.max(1, input.metaSignals.length)) * 0.35 +
      coherencePressure * 0.35 +
      input.strategicRealityState.realityInstabilityScore * 0.25
  );
}
