/**
 * D7:6:2 — Dynamic priority-flow modeling.
 */

import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicConsensusState } from "../recommendation/executiveConsensusTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type {
  DynamicPriorityFlowRecord,
  ExecutiveAttentionRoutingSignal,
  ExecutiveAttentionRoutingState,
  ExecutiveAttentionRoutingStateLabel,
} from "./executiveAttentionRoutingTypes.ts";
import { logExecutiveAttentionRoutingDev } from "./attentionRoutingDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function routingStateFromProfile(
  stability: number,
  urgency: number,
  fragmentation: number
): ExecutiveAttentionRoutingStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmented";
  if (urgency >= 0.62 && stability >= 0.4) return "elevated";
  if (stability >= 0.55 && fragmentation < 0.4) return "focused";
  if (fragmentation >= 0.45) return "distributed";
  return urgency > stability ? "elevated" : "distributed";
}

export function deriveExecutiveAttentionRoutingSignals(input: {
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  routingLeverageFactor?: number;
  fragmentationStressFactor?: number;
}): ExecutiveAttentionRoutingSignal[] {
  const leverage = clamp01(input.routingLeverageFactor ?? 0);
  const stress = clamp01(input.fragmentationStressFactor ?? 0);

  const signals: ExecutiveAttentionRoutingSignal[] = [];

  const zoneSets = [
    input.cognitiveUxState.attentionPriorityZones,
    input.cognitiveUxState.cognitiveOverloadZones,
    input.orchestrationState.orchestrationFragilityZones,
    input.consensusState.fragmentationZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const stability = clamp01(
      input.cognitiveUxState.cognitiveClarityScore * 0.25 +
        input.orchestrationState.orchestrationCoherenceScore * 0.22 +
        input.consensusState.executiveCoherenceScore * 0.2 +
        leverage * 0.1
    );
    const urgency = clamp01(
      input.cascadeState.cascadePropagationScore * 0.3 +
        input.divergenceState.futureFragmentationScore * 0.28 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2
    );
    const fragmentation = clamp01(
      input.cognitiveUxState.cognitiveLoadScore * 0.3 +
        input.consensusState.fragmentationEscalationScore * 0.28 +
        stress * 0.15
    );

    const routingState = routingStateFromProfile(stability, urgency, fragmentation);
    const routingStrength = clamp01(stability * 0.35 + urgency * 0.4 + (1 - fragmentation) * 0.2);

    const drivers: string[] = [];
    if (routingState === "focused") drivers.push("stable_recovery", "low_urgency");
    if (routingState === "elevated") drivers.push("fragility_escalation", "predictive_risk");
    if (routingState === "distributed") drivers.push("multi_domain_routing", "moderate_urgency");
    if (routingState === "fragmented") drivers.push("competing_alerts", "signal_competition");
    if (routingState === "critical") drivers.push("attention_concentration", "instability_spike");

    signals.push(
      Object.freeze({
        routingId: `routing::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        routingState,
        routingStrength,
        dominantRoutingDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["routing_assessment"]
        ),
        executiveLabel:
          routingState === "elevated" || routingState === "critical"
            ? "Executive attention may concentrate on instability signals in this zone cluster"
            : routingState === "focused"
              ? "Attention routing may de-escalate where recovery and governance remain stable"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        routingId: "routing::fallback-flow",
        affectedRegionIds: Object.freeze(fallback),
        routingState: "distributed",
        routingStrength: clamp01(input.cognitiveUxState.attentionPriorityScore * 0.45 + leverage * 0.2),
        dominantRoutingDrivers: Object.freeze(["baseline_routing_assessment"]),
        executiveLabel: "Baseline executive attention routing may apply across operational regions",
      })
    );
  }

  logExecutiveAttentionRoutingDev("AttentionRouting", { routingSignalCount: signals.length });
  return signals.sort((a, b) => a.routingId.localeCompare(b.routingId));
}

export function analyzeDynamicPriorityFlow(input: {
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  consensusState: ExecutiveStrategicConsensusState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): readonly DynamicPriorityFlowRecord[] {
  const records: DynamicPriorityFlowRecord[] = [];
  const routingIds = input.routingSignals.map((r) => r.routingId);

  const regions =
    input.routingSignals.flatMap((r) => r.affectedRegionIds).length > 0
      ? [...new Set(input.routingSignals.flatMap((r) => r.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "flow::urgency-escalation",
      flowType: "urgency_escalation",
      flowStrength: clamp01(
        input.cascadeState.cascadePropagationScore * 0.4 +
          input.divergenceState.futureFragmentationScore * 0.35
      ),
      explanation:
        "Urgency escalation may route executive attention toward conditions requiring immediate operational assessment.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "flow::fragility-priority",
      flowType: "fragility_priority_routing",
      flowStrength: clamp01(
        input.orchestrationState.orchestrationInstabilityScore * 0.45 +
          input.cognitiveUxState.cognitiveLoadScore * 0.3
      ),
      explanation:
        "Fragility-priority routing may elevate logistics and manufacturing stabilization when dependency pressure intensifies.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "flow::recovery-focus",
      flowType: "recovery_focus_routing",
      flowStrength: clamp01(
        input.recommendationState.stabilizationLeverageScore * 0.45 +
          input.recoveryOpportunityState.recoveryAccelerationScore * 0.35
      ),
      explanation:
        "Recovery-focus routing may prioritize coordinated stabilization before restructuring pathways expand.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "flow::governance-weighting",
      flowType: "governance_attention_weighting",
      flowStrength: clamp01(input.governanceState.governanceStabilityScore * 0.5),
      explanation:
        "Governance-attention weighting may surface oversight requirements without autonomous workflow steering.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "flow::predictive-risk",
      flowType: "predictive_risk_prioritization",
      flowStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.45 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35
      ),
      explanation:
        "Predictive-risk prioritization may shift attention when future divergence and low confidence coincide.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "flow::resilience-opportunity",
      flowType: "resilience_opportunity_surfacing",
      flowStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.4 +
          input.recoveryOpportunityState.recoveryAccelerationScore * 0.35
      ),
      explanation:
        "Resilience-opportunity surfacing may route attention toward leverage points when recovery momentum aligns with governance confidence.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveAttentionRoutingDev("PriorityFlow", { flowRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateFocusStabilityScore(input: {
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  if (input.routingSignals.length === 0) return 0;
  const avg =
    input.routingSignals.reduce((s, r) => s + r.routingStrength, 0) / input.routingSignals.length;
  return clamp01(
    avg * 0.35 +
      input.cognitiveUxState.cognitiveClarityScore * 0.3 +
      input.orchestrationState.orchestrationCoherenceScore * 0.25
  );
}

export function calculateStrategicUrgencyScore(input: {
  flowRecords: readonly DynamicPriorityFlowRecord[];
}): number {
  if (input.flowRecords.length === 0) return 0;
  const urgency = input.flowRecords.find((r) => r.recordId.includes("urgency-escalation"));
  const fragility = input.flowRecords.find((r) => r.recordId.includes("fragility-priority"));
  const avg =
    input.flowRecords.reduce((s, r) => s + r.flowStrength, 0) / input.flowRecords.length;
  return clamp01(avg * 0.5 + (urgency?.flowStrength ?? 0) * 0.25 + (fragility?.flowStrength ?? 0) * 0.2);
}

export function identifyHighPriorityAttentionZones(
  signals: readonly ExecutiveAttentionRoutingSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.routingState === "elevated" ||
      signal.routingState === "critical" ||
      signal.routingState === "focused"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedAttentionZones(
  signals: readonly ExecutiveAttentionRoutingSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.routingState === "fragmented" ||
      signal.routingState === "distributed" ||
      signal.routingState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveAttentionRoutingLabel(input: {
  focusStabilityScore: number;
  strategicUrgencyScore: number;
  attentionFragmentationScore: number;
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
}): ExecutiveAttentionRoutingState["executiveAttentionRoutingLabel"] {
  const critical = input.routingSignals.filter((r) => r.routingState === "critical").length;
  if (critical > 0 || input.attentionFragmentationScore >= 0.68) return "critical";
  if (input.attentionFragmentationScore >= 0.55) return "fragmented";
  if (input.attentionFragmentationScore >= 0.45) return "distributed";
  if (input.strategicUrgencyScore >= 0.58 && input.focusStabilityScore >= 0.45) return "elevated";
  if (input.focusStabilityScore >= 0.55 && input.attentionFragmentationScore < 0.4) {
    return "focused";
  }
  return input.strategicUrgencyScore > input.focusStabilityScore ? "elevated" : "distributed";
}
