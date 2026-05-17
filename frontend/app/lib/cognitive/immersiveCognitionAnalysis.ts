/**
 * D7:6:7 — Immersive cognition analysis.
 */

import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveScenarioImmersionSignal,
  ImmersiveCognitionRecord,
} from "./executiveScenarioImmersionTypes.ts";
import { logExecutiveScenarioImmersionDev } from "./scenarioImmersionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeImmersiveCognition(input: {
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly ImmersiveCognitionRecord[] {
  const records: ImmersiveCognitionRecord[] = [];
  const immersionIds = input.immersionSignals.map((s) => s.immersionId);

  const overloadedSignals = input.immersionSignals.filter(
    (s) => s.immersionState === "overloaded" || s.immersionState === "critical"
  ).length;

  if (overloadedSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "cognition::immersion-overload",
        cognitionType: "immersion_overload",
        cognitionStrength: clamp01(
          overloadedSignals / Math.max(1, input.immersionSignals.length)
        ),
        explanation:
          "Immersion overload may form when too many simultaneous future branches intersect with high predictive volatility.",
        contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      })
    );
  }

  if (
    input.narrativeState.executiveNarrativeLabel === "fragmented" ||
    input.timelineState.executiveTimelineLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "cognition::fragmented-understanding",
        cognitionType: "fragmented_scenario_understanding",
        cognitionStrength: clamp01(
          input.narrativeState.narrativeFragmentationScore * 0.5 +
            input.timelineState.timelineFragmentationScore * 0.4
        ),
        explanation:
          "Fragmented scenario understanding may reduce decision quality when narrative and timeline cognition diverge.",
        contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      })
    );
  }

  if (input.narrativeState.narrativeClarityScore < 0.4) {
    records.push(
      Object.freeze({
        recordId: "cognition::low-context",
        cognitionType: "low_context_exploration",
        cognitionStrength: clamp01(1 - input.narrativeState.narrativeClarityScore),
        explanation:
          "Low-context strategic exploration may impede immersive understanding when narrative synthesis remains limited.",
        contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "cognition::unstable-pathway",
        cognitionType: "unstable_exploration_pathway",
        cognitionStrength: clamp01(input.divergenceState.futureFragmentationScore),
        explanation:
          "Unstable exploration pathways may emerge when predictive divergence exceeds scenario coherence bounds.",
        contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      })
    );
  }

  if (input.foresightState.longHorizonRiskScore >= 0.5 && input.foresightState.futureReadinessScore < 0.45) {
    records.push(
      Object.freeze({
        recordId: "cognition::future-gap",
        cognitionType: "future_understanding_gap",
        cognitionStrength: clamp01(
          input.foresightState.longHorizonRiskScore * 0.55 +
            (1 - input.foresightState.futureReadinessScore) * 0.35
        ),
        explanation:
          "Future-understanding gaps may appear when long-horizon risk outpaces executive readiness during scenario exploration.",
        contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      })
    );
  }

  if (input.cognitiveLoadState.executiveCognitiveLoadLabel === "overloaded") {
    records.push(
      Object.freeze({
        recordId: "cognition::coherence-degradation",
        cognitionType: "scenario_coherence_degradation",
        cognitionStrength: clamp01(input.cognitiveLoadState.overloadEscalationScore),
        explanation:
          "Scenario-coherence degradation may occur when cognitive load remains elevated across immersive branches.",
        contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      })
    );
  }

  logExecutiveScenarioImmersionDev("FutureImmersion", {
    cognitionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateImmersionOverloadScore(input: {
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
  cognitionRecords: readonly ImmersiveCognitionRecord[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
}): number {
  const overloadedCount = input.immersionSignals.filter(
    (s) => s.immersionState === "overloaded" || s.immersionState === "critical"
  ).length;
  const recordAvg =
    input.cognitionRecords.length === 0
      ? 0
      : input.cognitionRecords.reduce((s, r) => s + r.cognitionStrength, 0) /
        input.cognitionRecords.length;
  return clamp01(
    overloadedCount / Math.max(1, input.immersionSignals.length) * 0.4 +
      recordAvg * 0.35 +
      input.cognitiveLoadState.overloadEscalationScore * 0.2
  );
}
