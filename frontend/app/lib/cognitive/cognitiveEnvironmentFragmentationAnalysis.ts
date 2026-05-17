/**
 * D7:6:9 — Cognitive-environment fragmentation analysis.
 */

import type { ExecutiveStrategicPresenceIntelligenceState } from "./executiveStrategicPresenceTypes.ts";
import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type {
  CognitiveEnvironmentFragmentationRecord,
  UnifiedExecutiveEnvironmentSignal,
} from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import { logUnifiedExecutiveCognitiveEnvironmentDev } from "./cognitiveEnvironmentDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

const STABILIZING_TIMELINE_LABELS = new Set([
  "developing",
  "transitional",
  "long_horizon",
]);

const COLLAPSE_IMMERSION_LABELS = new Set(["overloaded", "critical"]);

export function analyzeCognitiveEnvironmentFragmentation(input: {
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): readonly CognitiveEnvironmentFragmentationRecord[] {
  const records: CognitiveEnvironmentFragmentationRecord[] = [];
  const environmentIds = input.environmentSignals.map((s) => s.environmentId);

  const fragmentedSignals = input.environmentSignals.filter(
    (s) => s.environmentState === "fragmented" || s.environmentState === "critical"
  ).length;

  if (fragmentedSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::executive-experience",
        fragmentationType: "fragmented_executive_experience",
        fragmentationStrength: clamp01(
          fragmentedSignals / Math.max(1, input.environmentSignals.length)
        ),
        explanation:
          "Fragmented executive experience may emerge when cognitive layers no longer feel like one continuous environment.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  const timelineSuggestsStabilization =
    STABILIZING_TIMELINE_LABELS.has(input.timelineState.executiveTimelineLabel) &&
    input.timelineState.timelineClarityScore >= 0.45;
  const immersionSuggestsCollapse = COLLAPSE_IMMERSION_LABELS.has(
    input.immersionState.executiveImmersionLabel
  );

  if (timelineSuggestsStabilization && immersionSuggestsCollapse) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::layer-divergence",
        fragmentationType: "disconnected_cognitive_systems",
        fragmentationStrength: clamp01(
          input.immersionState.immersionOverloadScore * 0.5 +
            (1 - input.timelineState.timelineFragmentationScore) * 0.35
        ),
        explanation:
          "Environment fragmentation warning: timeline suggests stabilization while scenario immersion suggests collapse risk.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  if (
    input.narrativeState.executiveNarrativeLabel !== input.timelineState.executiveTimelineLabel &&
    (input.narrativeState.narrativeFragmentationScore >= 0.4 ||
      input.timelineState.timelineFragmentationScore >= 0.4)
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::context-transitions",
        fragmentationType: "unstable_context_transitions",
        fragmentationStrength: clamp01(
          input.narrativeState.narrativeFragmentationScore * 0.45 +
            input.timelineState.timelineFragmentationScore * 0.4
        ),
        explanation:
          "Unstable context transitions may occur when narrative and timeline layers diverge across panels.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  if (
    input.presenceState.executivePresenceLabel === "fragmented" ||
    input.presenceState.executivePresenceLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::continuity-breakdown",
        fragmentationType: "strategic_continuity_breakdown",
        fragmentationStrength: clamp01(input.presenceState.presenceFragmentationScore),
        explanation:
          "Strategic continuity breakdown may reduce leadership coherence when presence fragmentation persists.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  if (input.orchestrationState.orchestrationInstabilityScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::orchestration-inconsistent",
        fragmentationType: "inconsistent_cognitive_orchestration",
        fragmentationStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Inconsistent cognitive orchestration may fragment the unified environment when layer signals conflict.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  if (input.cognitiveUxState.cognitiveClarityScore < 0.4) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::context-discontinuity",
        fragmentationType: "operational_context_discontinuity",
        fragmentationStrength: clamp01(1 - input.cognitiveUxState.cognitiveClarityScore),
        explanation:
          "Operational-context discontinuity may appear when executive UX coherence falls below environment thresholds.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  if (input.cognitiveLoadState.executiveCognitiveLoadLabel === "overloaded") {
    records.push(
      Object.freeze({
        recordId: "fragmentation::load-fragmentation",
        fragmentationType: "disconnected_cognitive_systems",
        fragmentationStrength: clamp01(input.cognitiveLoadState.overloadEscalationScore * 0.85),
        explanation:
          "Disconnected cognitive systems may overload the unified environment when attention and load layers desynchronize.",
        contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      })
    );
  }

  logUnifiedExecutiveCognitiveEnvironmentDev("ExecutiveEnvironment", {
    fragmentationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateEnvironmentFragmentationScore(input: {
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  fragmentationRecords: readonly CognitiveEnvironmentFragmentationRecord[];
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
}): number {
  const fragmentedCount = input.environmentSignals.filter(
    (s) => s.environmentState === "fragmented" || s.environmentState === "critical"
  ).length;
  const recordAvg =
    input.fragmentationRecords.length === 0
      ? 0
      : input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.fragmentationRecords.length;
  return clamp01(
    fragmentedCount / Math.max(1, input.environmentSignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.presenceState.presenceFragmentationScore * 0.15 +
      input.immersionState.immersionOverloadScore * 0.1 +
      input.cognitiveLoadState.overloadEscalationScore * 0.08
  );
}
