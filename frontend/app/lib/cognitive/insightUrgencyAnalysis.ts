/**
 * D7:6:4 — Insight-urgency analysis.
 */

import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type {
  ExecutiveInsightPrioritySignal,
  InsightUrgencyRecord,
} from "./executiveInsightPrioritizationTypes.ts";
import { logExecutiveInsightPrioritizationDev } from "./insightPrioritizationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeInsightUrgency(input: {
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  explainabilityState: ExecutiveExplainabilityState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): readonly InsightUrgencyRecord[] {
  const records: InsightUrgencyRecord[] = [];
  const insightIds = input.insightSignals.map((s) => s.insightId);

  const urgentSignals = input.insightSignals.filter(
    (s) => s.priorityState === "urgent" || s.priorityState === "critical"
  ).length;

  if (urgentSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "urgency::critical-operational-insight",
        urgencyType: "critical_operational_insight",
        urgencyStrength: clamp01(urgentSignals / Math.max(1, input.insightSignals.length)),
        explanation:
          "Critical operational insights may warrant executive visibility when multiple priority signals indicate urgent or critical states.",
        contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      })
    );
  }

  if (
    input.cognitiveLoadState.executiveCognitiveLoadLabel === "balanced" &&
    input.divergenceState.futureFragmentationScore < 0.35
  ) {
    records.push(
      Object.freeze({
        recordId: "urgency::low-value-noise",
        urgencyType: "low_value_signal_noise",
        urgencyStrength: clamp01(
          (1 - input.cognitiveLoadState.signalDensityScore) * 0.5 +
            input.divergenceState.futureConvergenceScore * 0.3
        ),
        explanation:
          "Low-value signal noise may be deprioritized when stable equilibrium reduces predictive volatility across operational surfaces.",
        contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "urgency::predictive-escalation-hotspot",
        urgencyType: "predictive_escalation_hotspot",
        urgencyStrength: clamp01(input.divergenceState.futureFragmentationScore),
        explanation:
          "Predictive escalation hotspots may elevate insight priority when future divergence pressure intensifies across strategic pathways.",
        contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryAccelerationScore >= 0.5 &&
    input.confidenceState.overallConfidenceScore >= 0.45 &&
    input.cognitiveLoadState.overloadEscalationScore < 0.5
  ) {
    records.push(
      Object.freeze({
        recordId: "urgency::resilience-opportunity",
        urgencyType: "resilience_opportunity_concentration",
        urgencyStrength: clamp01(
          input.recoveryOpportunityState.recoveryAccelerationScore * 0.5 +
            input.confidenceState.overallConfidenceScore * 0.35
        ),
        explanation:
          "High-confidence recovery opportunity with moderated fragility risk may elevate executive insight opportunity visibility.",
        contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      })
    );
  }

  if (input.governanceState.activeGovernanceSignals.length >= 3) {
    records.push(
      Object.freeze({
        recordId: "urgency::governance-sensitive",
        urgencyType: "governance_sensitive_intelligence",
        urgencyStrength: clamp01(
          (1 - input.governanceState.governanceStabilityScore) * 0.55 +
            input.governanceState.activeGovernanceSignals.length / 10
        ),
        explanation:
          "Governance-sensitive intelligence may require elevated prioritization when policy signals accumulate under strategic volatility.",
        contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.4) {
    const instability = clamp01(
      input.divergenceState.futureFragmentationScore * 0.45 +
        input.orchestrationState.orchestrationInstabilityScore * 0.35
    );
    if (instability >= 0.35) {
      records.push(
        Object.freeze({
          recordId: "urgency::future-instability",
          urgencyType: "future_instability_acceleration",
          urgencyStrength: instability,
          explanation:
            "Future instability acceleration may prioritize insights that connect predictive divergence with operational consequence pathways.",
          contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
        })
      );
    }
  }

  logExecutiveInsightPrioritizationDev("UrgencyRouting", {
    urgencyRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateUrgencyEscalationScore(input: {
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
  urgencyRecords: readonly InsightUrgencyRecord[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
}): number {
  const urgentCount = input.insightSignals.filter(
    (s) => s.priorityState === "urgent" || s.priorityState === "critical"
  ).length;
  const recordAvg =
    input.urgencyRecords.length === 0
      ? 0
      : input.urgencyRecords.reduce((s, r) => s + r.urgencyStrength, 0) /
        input.urgencyRecords.length;
  return clamp01(
    urgentCount / Math.max(1, input.insightSignals.length) * 0.4 +
      recordAvg * 0.35 +
      input.cognitiveLoadState.overloadEscalationScore * 0.2
  );
}
