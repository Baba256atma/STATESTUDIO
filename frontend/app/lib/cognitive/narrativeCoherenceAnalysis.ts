/**
 * D7:6:5 — Narrative-coherence analysis.
 */

import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveNarrativeSignal,
  NarrativeCoherenceRecord,
} from "./executiveNarrativeTypes.ts";
import { logExecutiveNarrativeDev } from "./narrativeIntelligenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeNarrativeCoherence(input: {
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly NarrativeCoherenceRecord[] {
  const records: NarrativeCoherenceRecord[] = [];
  const narrativeIds = input.narrativeSignals.map((n) => n.narrativeId);

  const fragmentedSignals = input.narrativeSignals.filter(
    (n) => n.narrativeState === "fragmented" || n.narrativeState === "critical"
  ).length;

  if (fragmentedSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "coherence::fragmented-interpretation",
        coherenceType: "fragmented_operational_interpretation",
        coherenceStrength: clamp01(
          fragmentedSignals / Math.max(1, input.narrativeSignals.length)
        ),
        explanation:
          "Fragmented operational interpretation may reduce decision quality when narrative synthesis remains incomplete under dense signals.",
        contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      })
    );
  }

  if (
    input.insightPrioritizationState.executiveInsightPrioritizationLabel === "urgent" &&
    input.cognitiveLoadState.executiveCognitiveLoadLabel === "overloaded"
  ) {
    records.push(
      Object.freeze({
        recordId: "coherence::conflicting-narratives",
        coherenceType: "conflicting_strategic_narratives",
        coherenceStrength: clamp01(
          input.insightPrioritizationState.urgencyEscalationScore * 0.5 +
            input.cognitiveLoadState.overloadEscalationScore * 0.4
        ),
        explanation:
          "Conflicting strategic narratives may emerge when urgent insights intersect with overloaded cognitive conditions.",
        contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      })
    );
  }

  if (input.explainabilityState.explanationClarityScore < 0.4) {
    records.push(
      Object.freeze({
        recordId: "coherence::low-context",
        coherenceType: "low_context_presentation",
        coherenceStrength: clamp01(1 - input.explainabilityState.explanationClarityScore),
        explanation:
          "Low-context intelligence presentation may impede executive understanding when explainability remains limited.",
        contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      })
    );
  }

  if (input.orchestrationState.orchestrationInstabilityScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "coherence::unstable-continuity",
        coherenceType: "unstable_narrative_continuity",
        coherenceStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Unstable narrative continuity may reflect orchestration volatility across strategic operational pathways.",
        contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      })
    );
  }

  if (input.governanceState.activeGovernanceSignals.length >= 3) {
    records.push(
      Object.freeze({
        recordId: "coherence::governance-gap",
        coherenceType: "governance_context_gap",
        coherenceStrength: clamp01(
          (1 - input.governanceState.governanceStabilityScore) * 0.5 +
            input.governanceState.activeGovernanceSignals.length / 10
        ),
        explanation:
          "Governance-context gaps may weaken narrative coherence when policy signals lack integrated strategic framing.",
        contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "coherence::predictive-instability",
        coherenceType: "predictive_interpretation_instability",
        coherenceStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.trajectoryState.trajectoryVolatilityScore * 0.35
        ),
        explanation:
          "Predictive interpretation instability may fragment executive narratives when future pathways diverge under operational stress.",
        contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      })
    );
  }

  logExecutiveNarrativeDev("NarrativeCoherence", {
    coherenceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateNarrativeFragmentationScore(input: {
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
  coherenceRecords: readonly NarrativeCoherenceRecord[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
}): number {
  const fragmentedCount = input.narrativeSignals.filter(
    (n) => n.narrativeState === "fragmented" || n.narrativeState === "critical"
  ).length;
  const recordAvg =
    input.coherenceRecords.length === 0
      ? 0
      : input.coherenceRecords.reduce((s, r) => s + r.coherenceStrength, 0) /
        input.coherenceRecords.length;
  return clamp01(
    fragmentedCount / Math.max(1, input.narrativeSignals.length) * 0.4 +
      recordAvg * 0.35 +
      input.cognitiveLoadState.overloadEscalationScore * 0.2
  );
}
