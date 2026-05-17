/**
 * D7:6:10 — Platform-coherence analysis for orchestration completion.
 */

import type { UnifiedExecutiveCognitiveEnvironmentIntelligenceState } from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import type { ExecutiveStrategicPresenceIntelligenceState } from "./executiveStrategicPresenceTypes.ts";
import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type {
  ExecutiveCognitiveCompletionSignal,
  PlatformCoherenceRecord,
} from "./executiveCognitiveCompletionTypes.ts";
import { logExecutiveCognitiveCompletionDev } from "./cognitiveCompletionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzePlatformCoherence(input: {
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  environmentState: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): readonly PlatformCoherenceRecord[] {
  const records: PlatformCoherenceRecord[] = [];
  const completionIds = input.completionSignals.map((s) => s.completionId);

  const fragmentedCompletion = input.completionSignals.filter(
    (s) => s.completionState === "fragmented" || s.completionState === "critical"
  ).length;

  if (fragmentedCompletion > 0) {
    records.push(
      Object.freeze({
        recordId: "coherence::cross-platform-fragmentation",
        coherenceType: "cross_platform_cognitive_fragmentation",
        coherenceStrength: clamp01(
          fragmentedCompletion / Math.max(1, input.completionSignals.length)
        ),
        explanation:
          "Cross-platform cognitive fragmentation may emerge when executive layers no longer behave as one environment.",
        contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      })
    );
  }

  const strongInsights =
    input.insightPrioritizationState.strategicInsightScore >= 0.55 ||
    input.insightPrioritizationState.executiveInsightPrioritizationLabel === "urgent" ||
    input.insightPrioritizationState.executiveInsightPrioritizationLabel === "critical";
  const fragmentedTimelines =
    input.timelineState.executiveTimelineLabel === "critical" ||
    input.timelineState.timelineFragmentationScore >= 0.5;

  if (strongInsights && fragmentedTimelines) {
    records.push(
      Object.freeze({
        recordId: "coherence::orchestration-degradation",
        coherenceType: "synchronization_degradation",
        coherenceStrength: clamp01(
          input.insightPrioritizationState.urgencyEscalationScore * 0.45 +
            input.timelineState.timelineFragmentationScore * 0.45
        ),
        explanation:
          "Orchestration coherence degradation may occur when strong strategic recommendations intersect with fragmented cognitive timelines.",
        contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      })
    );
  }

  if (input.orchestrationState.orchestrationInstabilityScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "coherence::unstable-continuity",
        coherenceType: "unstable_orchestration_continuity",
        coherenceStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Unstable orchestration continuity may reduce platform-wide coherence during high-volatility decision cycles.",
        contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      })
    );
  }

  if (
    input.narrativeState.executiveNarrativeLabel === "fragmented" ||
    input.environmentState.executiveEnvironmentLabel === "fragmented"
  ) {
    records.push(
      Object.freeze({
        recordId: "coherence::disconnected-cognition",
        coherenceType: "disconnected_strategic_cognition",
        coherenceStrength: clamp01(
          input.narrativeState.narrativeFragmentationScore * 0.5 +
            input.environmentState.environmentFragmentationScore * 0.4
        ),
        explanation:
          "Disconnected strategic cognition may weaken completion when narrative and environment layers diverge.",
        contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      })
    );
  }

  if (input.environmentState.environmentFragmentationScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "coherence::executive-instability",
        coherenceType: "executive_coherence_instability",
        coherenceStrength: clamp01(input.environmentState.environmentFragmentationScore),
        explanation:
          "Executive coherence instability may appear when unified environment fragmentation persists at platform scale.",
        contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      })
    );
  }

  if (
    input.cognitiveLoadState.executiveCognitiveLoadLabel === "overloaded" ||
    input.immersionState.immersionOverloadScore >= 0.55
  ) {
    records.push(
      Object.freeze({
        recordId: "coherence::cognition-overload",
        coherenceType: "operational_cognition_overload",
        coherenceStrength: clamp01(
          input.cognitiveLoadState.overloadEscalationScore * 0.5 +
            input.immersionState.immersionOverloadScore * 0.4
        ),
        explanation:
          "Operational cognition overload may impede orchestration completion when immersive and load layers remain elevated.",
        contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      })
    );
  }

  logExecutiveCognitiveCompletionDev("PlatformCoherence", {
    coherenceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculatePlatformCoherenceDegradationScore(input: {
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  coherenceRecords: readonly PlatformCoherenceRecord[];
  environmentState: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const fragmentedCount = input.completionSignals.filter(
    (s) => s.completionState === "fragmented" || s.completionState === "critical"
  ).length;
  const recordAvg =
    input.coherenceRecords.length === 0
      ? 0
      : input.coherenceRecords.reduce((s, r) => s + r.coherenceStrength, 0) /
        input.coherenceRecords.length;
  return clamp01(
    fragmentedCount / Math.max(1, input.completionSignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.environmentState.environmentFragmentationScore * 0.15 +
      input.presenceState.presenceFragmentationScore * 0.1 +
      input.orchestrationState.orchestrationInstabilityScore * 0.08
  );
}
