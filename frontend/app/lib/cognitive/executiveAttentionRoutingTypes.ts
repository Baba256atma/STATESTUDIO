/**
 * D7:6:2 — Executive attention routing intelligence contracts.
 */

import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicConsensusState } from "../recommendation/executiveConsensusTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { ExecutiveAttentionRoutingGuardResult } from "./attentionRoutingGuards.ts";

export type ExecutiveAttentionRoutingStateLabel =
  | "focused"
  | "elevated"
  | "distributed"
  | "fragmented"
  | "critical";

export interface ExecutiveAttentionRoutingSignal {
  routingId: string;
  affectedRegionIds: readonly string[];
  routingState: ExecutiveAttentionRoutingStateLabel;
  routingStrength: number;
  dominantRoutingDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface DynamicPriorityFlowRecord {
  recordId: string;
  flowType:
    | "urgency_escalation"
    | "fragility_priority_routing"
    | "recovery_focus_routing"
    | "governance_attention_weighting"
    | "predictive_risk_prioritization"
    | "resilience_opportunity_surfacing";
  flowStrength: number;
  explanation: string;
  contributingRoutingIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface AttentionFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "competing_priorities"
    | "fragmented_operational_attention"
    | "overload_focus_instability"
    | "excessive_signal_competition"
    | "unstable_urgency_escalation"
    | "strategic_distraction";
  fragmentationStrength: number;
  explanation: string;
  contributingRoutingIds: readonly string[];
}

export interface ExecutiveFocusOrchestrationRecord {
  recordId: string;
  focusDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  focusStrength: number;
  explanation: string;
  contributingRoutingIds: readonly string[];
}

export interface ExecutiveAttentionRoutingState {
  activeAttentionRoutes: readonly ExecutiveAttentionRoutingSignal[];
  dynamicPriorityFlowRecords: readonly DynamicPriorityFlowRecord[];
  attentionFragmentationRecords: readonly AttentionFragmentationRecord[];
  executiveFocusOrchestrationRecords: readonly ExecutiveFocusOrchestrationRecord[];
  highPriorityAttentionZones: readonly string[];
  fragmentedAttentionZones: readonly string[];
  focusStabilityScore: number;
  strategicUrgencyScore: number;
  attentionFragmentationScore: number;
  executiveAttentionRoutingLabel: ExecutiveAttentionRoutingStateLabel;
  routingAmbiguityDisclaimer: string;
  nonManipulationRoutingDisclaimer: string;
}

export interface ExecutiveAttentionRoutingSemantics {
  headline: string;
  summary: string;
  routingSummaries: readonly string[];
  priorityFlowSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveAttentionRoutingSnapshot {
  attentionRoutingStateId: string;
  topologyId: string;
  cognitiveUxStateId?: string;
  tick: number;
  state: ExecutiveAttentionRoutingState;
  semantics: ExecutiveAttentionRoutingSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future attention-routing UI contract (no rendering in D7:6:2). */
export interface ExecutiveAttentionRoutingPanelContract {
  attentionRoutingStateId: string;
  topologyId: string;
  focusStabilityScore: number;
  executiveAttentionRoutingLabel: ExecutiveAttentionRoutingState["executiveAttentionRoutingLabel"];
  routingAmbiguityDisclaimer: string;
  nonManipulationRoutingDisclaimer: string;
  attentionRoutes: readonly ExecutiveAttentionRoutingPanelRow[];
  priorityFlowSummaries: readonly string[];
  headline: string;
  viewHint:
    | "attention_routing_overlay"
    | "executive_focus_dashboard"
    | "urgency_heatmap"
    | "cognitive_priority_timeline"
    | "operational_focus_panel";
}

export interface ExecutiveAttentionRoutingPanelRow {
  routingId: string;
  routingState: ExecutiveAttentionRoutingStateLabel;
  routingStrength: number;
}

export interface SimulationExecutiveAttentionRoutingContext {
  tick?: number;
  routingLeverageFactor?: number;
  fragmentationStressFactor?: number;
}

export interface EvaluateExecutiveAttentionRoutingInput {
  topology: OperationalUniverseTopology;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  attentionRoutingContext?: SimulationExecutiveAttentionRoutingContext;
  tick?: number;
  attentionRoutingStateId?: string;
  priorAttentionRoutingFingerprints?: readonly string[];
}

export type EvaluateExecutiveAttentionRoutingResult =
  | {
      ok: true;
      snapshot: ExecutiveAttentionRoutingSnapshot;
      panelContract: ExecutiveAttentionRoutingPanelContract;
    }
  | { ok: false; guard: ExecutiveAttentionRoutingGuardResult };
