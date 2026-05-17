/**
 * D7:6:4 — Strategic-value modeling for executive insight prioritization.
 */

import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type {
  ExecutiveInsightPrioritizationState,
  ExecutiveInsightPrioritySignal,
  ExecutiveInsightPriorityStateLabel,
  StrategicValueRecord,
} from "./executiveInsightPrioritizationTypes.ts";
import { logExecutiveInsightPrioritizationDev } from "./insightPrioritizationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function priorityStateFromProfile(
  value: number,
  urgency: number,
  escalation: number
): ExecutiveInsightPriorityStateLabel {
  if (escalation >= 0.72) return "critical";
  if (escalation >= 0.58) return "urgent";
  if (urgency >= 0.62) return "elevated";
  if (urgency >= 0.48 && value < 0.42) return "visible";
  if (value >= 0.55 && escalation < 0.4) return "background";
  return urgency > value ? "elevated" : "visible";
}

export function deriveExecutiveInsightPrioritySignals(input: {
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  insightLeverageFactor?: number;
  urgencyStressFactor?: number;
}): ExecutiveInsightPrioritySignal[] {
  const leverage = clamp01(input.insightLeverageFactor ?? 0);
  const stress = clamp01(input.urgencyStressFactor ?? 0);

  const signals: ExecutiveInsightPrioritySignal[] = [];

  const zoneSets = [
    input.cognitiveLoadState.overloadZones,
    input.cognitiveLoadState.stabilizedAttentionZones,
    input.attentionRoutingState.highPriorityAttentionZones,
    input.cognitiveUxState.attentionPriorityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const value = clamp01(
      input.confidenceState.overallConfidenceScore * 0.25 +
        input.recoveryOpportunityState.recoveryAccelerationScore * 0.25 +
        input.resilienceState.enterpriseResilienceScore * 0.2 +
        leverage * 0.1
    );
    const urgency = clamp01(
      input.cognitiveLoadState.signalDensityScore * 0.28 +
        input.cascadeState.cascadePropagationScore * 0.25 +
        input.divergenceState.futureFragmentationScore * 0.2 +
        stress * 0.12
    );
    const escalation = clamp01(
      input.cognitiveLoadState.overloadEscalationScore * 0.3 +
        input.trajectoryState.trajectoryVolatilityScore * 0.28 +
        input.governanceState.oversightRequirementScore * 0.2
    );

    const priorityState = priorityStateFromProfile(value, urgency, escalation);
    const priorityStrength = clamp01(value * 0.35 + urgency * 0.35 + escalation * 0.25);

    const drivers: string[] = [];
    if (priorityState === "background") drivers.push("stable_equilibrium", "low_strategic_value");
    if (priorityState === "visible") drivers.push("moderate_significance", "routine_visibility");
    if (priorityState === "elevated") drivers.push("strategic_value_density", "recovery_opportunity");
    if (priorityState === "urgent") drivers.push("predictive_escalation", "governance_sensitivity");
    if (priorityState === "critical") drivers.push("future_instability", "fragility_concentration");

    signals.push(
      Object.freeze({
        insightId: `insight::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        priorityState,
        priorityStrength,
        dominantPriorityDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["insight_assessment"]
        ),
        executiveLabel:
          priorityState === "urgent" || priorityState === "critical"
            ? "High-priority executive insight may warrant elevated visibility across operational intelligence surfaces"
            : priorityState === "background"
              ? "Lower-priority insight may remain in background when equilibrium and confidence remain stable"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        insightId: "insight::fallback-priority",
        affectedRegionIds: Object.freeze(fallback),
        priorityState: "visible",
        priorityStrength: clamp01(
          input.cognitiveLoadState.cognitiveBalanceScore * 0.4 + leverage * 0.2
        ),
        dominantPriorityDrivers: Object.freeze(["baseline_insight_assessment"]),
        executiveLabel:
          "Baseline executive insight prioritization may apply across strategic operational regions",
      })
    );
  }

  logExecutiveInsightPrioritizationDev("InsightPriority", {
    insightSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.insightId.localeCompare(b.insightId));
}

export function analyzeStrategicValue(input: {
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): readonly StrategicValueRecord[] {
  const records: StrategicValueRecord[] = [];
  const insightIds = input.insightSignals.map((s) => s.insightId);

  const regions =
    input.insightSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.insightSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const signalCount =
    input.insightSignals.length +
    input.cognitiveLoadState.activeLoadSignals.length +
    input.recommendationState.activeRecommendations.length;

  records.push(
    Object.freeze({
      recordId: "value::operational-significance",
      valueType: "operational_significance",
      valueStrength: clamp01(signalCount / 14),
      explanation:
        "Operational significance may elevate insight priority when multiple intelligence layers emit concurrent strategic indicators.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "value::predictive-urgency",
      valueType: "predictive_urgency",
      valueStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.4 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35 +
          input.cascadeState.cascadePropagationScore * 0.2
      ),
      explanation:
        "Critical future divergence may elevate strategic insight priority when predictive pathways fragment under operational stress.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "value::governance-sensitivity",
      valueType: "governance_sensitivity",
      valueStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.5 +
          input.governanceState.activeGovernanceSignals.length / 12
      ),
      explanation:
        "Governance-sensitive intelligence may warrant elevated visibility when policy volatility intersects strategic recommendations.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "value::recovery-opportunity",
      valueType: "recovery_opportunity_importance",
      valueStrength: clamp01(
        input.recoveryOpportunityState.recoveryAccelerationScore * 0.55 +
          input.confidenceState.overallConfidenceScore * 0.25
      ),
      explanation:
        "Recovery opportunity importance may elevate executive insight when stabilization leverage remains actionable under confidence.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "value::fragility-escalation",
      valueType: "fragility_escalation_impact",
      valueStrength: clamp01(input.cognitiveLoadState.overloadEscalationScore * 0.65),
      explanation:
        "Fragility escalation impact may concentrate strategic value where cognitive load and operational fragility align.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "value::resilience-concentration",
      valueType: "resilience_value_concentration",
      valueStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.45 +
          input.orchestrationState.orchestrationCoherenceScore * 0.3
      ),
      explanation:
        "Resilience-value concentration may surface insights that strengthen human-system capacity under executive control.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveInsightPrioritizationDev("StrategicValue", {
    valueRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicInsightScore(input: {
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  confidenceState: RecommendationConfidenceState;
}): number {
  if (input.insightSignals.length === 0) return 0;
  const avgStrength =
    input.insightSignals.reduce((s, i) => s + i.priorityStrength, 0) /
    input.insightSignals.length;
  return clamp01(
    avgStrength * 0.4 +
      input.cognitiveLoadState.cognitiveBalanceScore * 0.3 +
      input.confidenceState.overallConfidenceScore * 0.25
  );
}

export function calculateStrategicValueScore(input: {
  valueRecords: readonly StrategicValueRecord[];
}): number {
  if (input.valueRecords.length === 0) return 0;
  return clamp01(
    input.valueRecords.reduce((s, r) => s + r.valueStrength, 0) /
      input.valueRecords.length
  );
}

export function identifyElevatedInsightZones(
  signals: readonly ExecutiveInsightPrioritySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.priorityState === "urgent" ||
      signal.priorityState === "critical" ||
      signal.priorityState === "elevated"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyLowSignalNoiseZones(
  signals: readonly ExecutiveInsightPrioritySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.priorityState === "background" || signal.priorityState === "visible") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveInsightPrioritizationLabel(input: {
  strategicInsightScore: number;
  strategicValueScore: number;
  urgencyEscalationScore: number;
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
}): ExecutiveInsightPrioritizationState["executiveInsightPrioritizationLabel"] {
  const critical = input.insightSignals.filter((s) => s.priorityState === "critical").length;
  if (critical > 0 || input.urgencyEscalationScore >= 0.68) return "critical";
  if (input.urgencyEscalationScore >= 0.55) return "urgent";
  if (input.strategicValueScore >= 0.58) return "elevated";
  if (input.strategicValueScore >= 0.45 && input.strategicInsightScore < 0.45) {
    return "visible";
  }
  if (input.strategicInsightScore >= 0.55 && input.urgencyEscalationScore < 0.4) {
    return "background";
  }
  return input.urgencyEscalationScore > input.strategicInsightScore ? "urgent" : "visible";
}
