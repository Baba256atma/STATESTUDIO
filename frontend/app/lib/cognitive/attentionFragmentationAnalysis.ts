/**
 * D7:6:2 — Attention-fragmentation analysis.
 */

import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type {
  AttentionFragmentationRecord,
  ExecutiveAttentionRoutingSignal,
} from "./executiveAttentionRoutingTypes.ts";
import { logExecutiveAttentionRoutingDev } from "./attentionRoutingDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeAttentionFragmentation(input: {
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: ExecutiveExplainabilityState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
}): readonly AttentionFragmentationRecord[] {
  const records: AttentionFragmentationRecord[] = [];
  const routingIds = input.routingSignals.map((r) => r.routingId);

  const criticalRoutes = input.routingSignals.filter(
    (r) => r.routingState === "critical" || r.routingState === "fragmented"
  ).length;

  if (criticalRoutes > 1) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::competing-priorities",
        fragmentationType: "competing_priorities",
        fragmentationStrength: clamp01(
          criticalRoutes / Math.max(1, input.routingSignals.length)
        ),
        explanation:
          "Competing executive priorities may fragment attention when multiple routes signal critical or fragmented focus simultaneously.",
        contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      })
    );
  }

  if (input.cognitiveUxState.executiveCognitiveLabel === "overloaded") {
    records.push(
      Object.freeze({
        recordId: "fragmentation::fragmented-operational-attention",
        fragmentationType: "fragmented_operational_attention",
        fragmentationStrength: clamp01(input.cognitiveUxState.cognitiveLoadScore),
        explanation:
          "Fragmented operational attention may reduce decision quality when cognitive UX signals overload across domains.",
        contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      })
    );
  }

  if (
    input.explainabilityState.explanationClarityScore < 0.4 &&
    input.confidenceState.overallConfidenceScore < 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::overload-focus-instability",
        fragmentationType: "overload_focus_instability",
        fragmentationStrength: clamp01(
          (1 - input.explainabilityState.explanationClarityScore) * 0.45 +
            (1 - input.confidenceState.overallConfidenceScore) * 0.4
        ),
        explanation:
          "Overload-driven focus instability may emerge when low explainability coincides with low recommendation confidence.",
        contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      })
    );
  }

  const signalCompetition =
    input.routingSignals.length + input.cognitiveUxState.activeCognitiveSignals.length;
  if (signalCompetition >= 8) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::excessive-signal-competition",
        fragmentationType: "excessive_signal_competition",
        fragmentationStrength: clamp01(signalCompetition / 14),
        explanation:
          "Too many simultaneous critical alerts may create fragmented executive cognition risk through excessive signal competition.",
        contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.5 &&
    input.orchestrationState.orchestrationInstabilityScore >= 0.5
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::unstable-urgency-escalation",
        fragmentationType: "unstable_urgency_escalation",
        fragmentationStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.orchestrationState.orchestrationInstabilityScore * 0.4
        ),
        explanation:
          "Unstable urgency escalation may distract executives when divergence and orchestration instability rise together.",
        contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      })
    );
  }

  if (input.advisoryState.executiveAdvisoryLabel === "critical") {
    records.push(
      Object.freeze({
        recordId: "fragmentation::strategic-distraction",
        fragmentationType: "strategic_distraction",
        fragmentationStrength: clamp01(input.advisoryState.advisoryClarityScore * 0.3 + 0.4),
        explanation:
          "Strategic distraction patterns may emerge when advisory criticality competes with recovery and governance attention routes.",
        contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      })
    );
  }

  logExecutiveAttentionRoutingDev("AttentionFragmentation", {
    fragmentationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateAttentionFragmentationScore(input: {
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
  fragmentationRecords: readonly AttentionFragmentationRecord[];
  cognitiveUxState: ExecutiveCognitiveUxState;
}): number {
  const fragmented = input.routingSignals.filter(
    (r) => r.routingState === "fragmented" || r.routingState === "critical"
  ).length;
  const avgFrag =
    input.fragmentationRecords.length > 0
      ? input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.fragmentationRecords.length
      : 0;
  return clamp01(
    avgFrag * 0.5 +
      (fragmented / Math.max(1, input.routingSignals.length)) * 0.3 +
      input.cognitiveUxState.cognitiveLoadScore * 0.2
  );
}
