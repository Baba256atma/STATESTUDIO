/**
 * D7:6:8 — Presence-fragmentation analysis.
 */

import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveStrategicPresenceSignal,
  PresenceFragmentationRecord,
} from "./executiveStrategicPresenceTypes.ts";
import { logExecutiveStrategicPresenceDev } from "./strategicPresenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzePresenceFragmentation(input: {
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly PresenceFragmentationRecord[] {
  const records: PresenceFragmentationRecord[] = [];
  const presenceIds = input.presenceSignals.map((s) => s.presenceId);

  const fragmentedSignals = input.presenceSignals.filter(
    (s) => s.presenceState === "fragmented" || s.presenceState === "critical"
  ).length;

  if (fragmentedSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::situational",
        fragmentationType: "situational_fragmentation",
        fragmentationStrength: clamp01(
          fragmentedSignals / Math.max(1, input.presenceSignals.length)
        ),
        explanation:
          "Strategic presence fragmentation may form when high volatility intersects with too many disconnected future branches.",
        contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.5 &&
    input.trajectoryState.trajectoryVolatilityScore >= 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::awareness-instability",
        fragmentationType: "awareness_instability",
        fragmentationStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.trajectoryState.trajectoryVolatilityScore * 0.4
        ),
        explanation:
          "Awareness instability may emerge when predictive volatility exceeds sustained situational continuity bounds.",
        contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      })
    );
  }

  if (
    input.narrativeState.executiveNarrativeLabel === "fragmented" ||
    input.timelineState.executiveTimelineLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::disconnected-cognition",
        fragmentationType: "disconnected_strategic_cognition",
        fragmentationStrength: clamp01(
          input.narrativeState.narrativeFragmentationScore * 0.5 +
            input.timelineState.timelineFragmentationScore * 0.4
        ),
        explanation:
          "Disconnected strategic cognition may weaken decision quality when narrative and timeline awareness diverge.",
        contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      })
    );
  }

  if (input.narrativeState.narrativeClarityScore < 0.4) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::context-loss",
        fragmentationType: "operational_context_loss",
        fragmentationStrength: clamp01(1 - input.narrativeState.narrativeClarityScore),
        explanation:
          "Operational-context loss may reduce situational clarity when strategic narrative synthesis remains limited.",
        contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      })
    );
  }

  if (input.immersionState.immersionOverloadScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::continuity-degradation",
        fragmentationType: "cognitive_continuity_degradation",
        fragmentationStrength: clamp01(input.immersionState.immersionOverloadScore),
        explanation:
          "Cognitive continuity degradation may occur when immersive exploration overload persists across decision cycles.",
        contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      })
    );
  }

  if (input.cognitiveLoadState.executiveCognitiveLoadLabel === "overloaded") {
    records.push(
      Object.freeze({
        recordId: "fragmentation::focus-instability",
        fragmentationType: "strategic_focus_instability",
        fragmentationStrength: clamp01(input.cognitiveLoadState.overloadEscalationScore),
        explanation:
          "Strategic-focus instability may appear when cognitive load remains elevated during sustained operational awareness.",
        contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      })
    );
  }

  logExecutiveStrategicPresenceDev("PresenceStability", {
    fragmentationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculatePresenceFragmentationScore(input: {
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  fragmentationRecords: readonly PresenceFragmentationRecord[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
}): number {
  const fragmentedCount = input.presenceSignals.filter(
    (s) => s.presenceState === "fragmented" || s.presenceState === "critical"
  ).length;
  const recordAvg =
    input.fragmentationRecords.length === 0
      ? 0
      : input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.fragmentationRecords.length;
  return clamp01(
    fragmentedCount / Math.max(1, input.presenceSignals.length) * 0.35 +
      recordAvg * 0.35 +
      input.cognitiveLoadState.overloadEscalationScore * 0.15 +
      input.immersionState.immersionOverloadScore * 0.1
  );
}
