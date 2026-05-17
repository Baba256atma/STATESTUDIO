/**
 * D7:6:6 — Timeline-fragmentation analysis.
 */

import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveTimelineSignal,
  TimelineFragmentationRecord,
} from "./executiveCognitiveTimelineTypes.ts";
import { logExecutiveCognitiveTimelineDev } from "./cognitiveTimelineDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeTimelineFragmentation(input: {
  timelineSignals: readonly ExecutiveTimelineSignal[];
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly TimelineFragmentationRecord[] {
  const records: TimelineFragmentationRecord[] = [];
  const timelineIds = input.timelineSignals.map((t) => t.timelineId);

  const tensionSignals = input.timelineSignals.filter(
    (t) => t.timelineState === "critical" || t.timelineState === "transitional"
  ).length;

  if (tensionSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::disconnected-timelines",
        fragmentationType: "disconnected_strategic_timelines",
        fragmentationStrength: clamp01(
          tensionSignals / Math.max(1, input.timelineSignals.length)
        ),
        explanation:
          "Disconnected strategic timelines may reduce decision stability when horizons lack integrated temporal framing.",
        contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      })
    );
  }

  if (
    input.insightPrioritizationState.executiveInsightPrioritizationLabel === "urgent" &&
    input.foresightState.predictiveForesightLabel === "stabilizing"
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::conflicting-horizons",
        fragmentationType: "conflicting_operational_horizons",
        fragmentationStrength: clamp01(
          input.insightPrioritizationState.urgencyEscalationScore * 0.45 +
            (1 - input.foresightState.longHorizonRiskScore) * 0.35
        ),
        explanation:
          "Conflicting operational horizons may create executive timeline tension when urgent signals intersect stabilizing long-horizon foresight.",
        contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      })
    );
  }

  if (input.narrativeState.narrativeFragmentationScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::unstable-sequencing",
        fragmentationType: "unstable_temporal_sequencing",
        fragmentationStrength: clamp01(input.narrativeState.narrativeFragmentationScore),
        explanation:
          "Unstable temporal sequencing may fragment timeline cognition when narrative continuity weakens.",
        contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      })
    );
  }

  if (input.cognitiveLoadState.executiveCognitiveLoadLabel === "overloaded") {
    records.push(
      Object.freeze({
        recordId: "fragmentation::recovery-evolution",
        fragmentationType: "fragmented_recovery_evolution",
        fragmentationStrength: clamp01(input.cognitiveLoadState.overloadEscalationScore),
        explanation:
          "Fragmented recovery evolution may impede mid-term coordination when cognitive load remains elevated.",
        contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      })
    );
  }

  const immediateRisk =
    input.cognitiveLoadState.overloadEscalationScore >= 0.5 &&
    input.foresightState.strategicPreparednessScore >= 0.45;
  if (immediateRisk) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::urgency-mismatch",
        fragmentationType: "urgency_horizon_mismatch",
        fragmentationStrength: clamp01(
          input.cognitiveLoadState.overloadEscalationScore * 0.5 +
            input.foresightState.futureReadinessScore * 0.35
        ),
        explanation:
          "Immediate fragility escalation combined with long-term stabilization potential may create executive timeline tension.",
        contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::future-instability",
        fragmentationType: "future_context_instability",
        fragmentationStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.trajectoryState.trajectoryVolatilityScore * 0.35
        ),
        explanation:
          "Future-context instability may fragment timeline understanding when predictive pathways diverge under stress.",
        contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      })
    );
  }

  logExecutiveCognitiveTimelineDev("TimelineClarity", {
    fragmentationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateTimelineFragmentationScore(input: {
  timelineSignals: readonly ExecutiveTimelineSignal[];
  fragmentationRecords: readonly TimelineFragmentationRecord[];
  narrativeState: ExecutiveNarrativeIntelligenceState;
}): number {
  const tensionCount = input.timelineSignals.filter(
    (t) => t.timelineState === "critical" || t.timelineState === "transitional"
  ).length;
  const recordAvg =
    input.fragmentationRecords.length === 0
      ? 0
      : input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.fragmentationRecords.length;
  return clamp01(
    tensionCount / Math.max(1, input.timelineSignals.length) * 0.4 +
      recordAvg * 0.35 +
      input.narrativeState.narrativeFragmentationScore * 0.2
  );
}
