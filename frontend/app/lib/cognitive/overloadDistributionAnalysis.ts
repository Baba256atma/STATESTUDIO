/**
 * D7:6:3 — Overload-distribution analysis.
 */

import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type {
  ExecutiveCognitiveLoadSignal,
  OverloadDistributionRecord,
} from "./executiveCognitiveLoadTypes.ts";
import { logExecutiveCognitiveLoadBalancingDev } from "./cognitiveLoadBalancingDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeOverloadDistribution(input: {
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
  cognitiveUxState: ExecutiveCognitiveUxState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  explainabilityState: ExecutiveExplainabilityState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
}): readonly OverloadDistributionRecord[] {
  const records: OverloadDistributionRecord[] = [];
  const loadIds = input.loadSignals.map((l) => l.loadId);

  const overloadedSignals = input.loadSignals.filter(
    (l) => l.loadState === "overloaded" || l.loadState === "critical"
  ).length;

  if (overloadedSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "distribution::executive-overload",
        distributionType: "executive_overload",
        distributionStrength: clamp01(
          overloadedSignals / Math.max(1, input.loadSignals.length)
        ),
        explanation:
          "Executive overload conditions may form when multiple load signals indicate overloaded or critical cognitive states.",
        contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      })
    );
  }

  if (
    input.attentionRoutingState.executiveAttentionRoutingLabel === "fragmented" ||
    input.attentionRoutingState.executiveAttentionRoutingLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "distribution::fragmented-cognition",
        distributionType: "fragmented_strategic_cognition",
        distributionStrength: clamp01(input.attentionRoutingState.attentionFragmentationScore),
        explanation:
          "Fragmented strategic cognition may reduce decision quality when attention routing remains fragmented under dense signals.",
        contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      })
    );
  }

  const alertDensity =
    input.loadSignals.length +
    input.cognitiveUxState.cognitiveLoadRecords.length +
    input.governanceState.activeGovernanceSignals.length;
  if (alertDensity >= 10) {
    records.push(
      Object.freeze({
        recordId: "distribution::alert-density-saturation",
        distributionType: "alert_density_saturation",
        distributionStrength: clamp01(alertDensity / 16),
        explanation:
          "Alert-density saturation may elevate executive overload risk when governance and cognitive alerts accumulate concurrently.",
        contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      })
    );
  }

  if (
    input.orchestrationState.executiveOrchestrationLabel === "volatile" ||
    input.orchestrationState.executiveOrchestrationLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "distribution::unstable-complexity",
        distributionType: "unstable_interaction_complexity",
        distributionStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Unstable interaction complexity may degrade focus capacity when orchestration instability propagates into cognitive layers.",
        contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      })
    );
  }

  if (
    input.explainabilityState.explanationClarityScore < 0.4 &&
    input.confidenceState.overallConfidenceScore < 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "distribution::focus-capacity-degradation",
        distributionType: "focus_capacity_degradation",
        distributionStrength: clamp01(
          (1 - input.explainabilityState.explanationClarityScore) * 0.45 +
            (1 - input.confidenceState.overallConfidenceScore) * 0.4
        ),
        explanation:
          "Focus-capacity degradation may emerge when low explainability coincides with low recommendation confidence under high signal density.",
        contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.5 &&
    (1 - input.governanceState.governanceStabilityScore) >= 0.5
  ) {
    records.push(
      Object.freeze({
        recordId: "distribution::cognitive-fatigue-risk",
        distributionType: "cognitive_fatigue_risk",
        distributionStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            (1 - input.governanceState.governanceStabilityScore) * 0.4
        ),
        explanation:
          "Multiple competing predictive escalations combined with high governance instability may elevate executive overload risk.",
        contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      })
    );
  }

  logExecutiveCognitiveLoadBalancingDev("LoadBalancing", {
    distributionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateOverloadEscalationScore(input: {
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
  distributionRecords: readonly OverloadDistributionRecord[];
  cognitiveUxState: ExecutiveCognitiveUxState;
}): number {
  const overloaded = input.loadSignals.filter(
    (l) => l.loadState === "overloaded" || l.loadState === "critical"
  ).length;
  const avg =
    input.distributionRecords.length > 0
      ? input.distributionRecords.reduce((s, r) => s + r.distributionStrength, 0) /
        input.distributionRecords.length
      : 0;
  return clamp01(
    avg * 0.5 +
      (overloaded / Math.max(1, input.loadSignals.length)) * 0.3 +
      input.cognitiveUxState.cognitiveLoadScore * 0.2
  );
}
