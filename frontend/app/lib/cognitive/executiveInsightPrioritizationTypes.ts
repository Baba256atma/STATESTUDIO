/**
 * D7:6:4 — Executive insight prioritization intelligence contracts.
 */

import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
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
import type { ExecutiveInsightPrioritizationGuardResult } from "./insightPrioritizationGuards.ts";

export type ExecutiveInsightPriorityStateLabel =
  | "background"
  | "visible"
  | "elevated"
  | "urgent"
  | "critical";

export interface ExecutiveInsightPrioritySignal {
  insightId: string;
  affectedRegionIds: readonly string[];
  priorityState: ExecutiveInsightPriorityStateLabel;
  priorityStrength: number;
  dominantPriorityDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface StrategicValueRecord {
  recordId: string;
  valueType:
    | "operational_significance"
    | "predictive_urgency"
    | "governance_sensitivity"
    | "recovery_opportunity_importance"
    | "fragility_escalation_impact"
    | "resilience_value_concentration";
  valueStrength: number;
  explanation: string;
  contributingInsightIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface InsightUrgencyRecord {
  recordId: string;
  urgencyType:
    | "critical_operational_insight"
    | "low_value_signal_noise"
    | "predictive_escalation_hotspot"
    | "resilience_opportunity_concentration"
    | "governance_sensitive_intelligence"
    | "future_instability_acceleration";
  urgencyStrength: number;
  explanation: string;
  contributingInsightIds: readonly string[];
}

export interface ExecutiveInsightRecord {
  recordId: string;
  insightDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  insightStrength: number;
  explanation: string;
  contributingInsightIds: readonly string[];
}

export interface ExecutiveInsightPrioritizationState {
  activeInsightPriorities: readonly ExecutiveInsightPrioritySignal[];
  strategicValueRecords: readonly StrategicValueRecord[];
  insightUrgencyRecords: readonly InsightUrgencyRecord[];
  executiveInsightRecords: readonly ExecutiveInsightRecord[];
  elevatedInsightZones: readonly string[];
  lowSignalNoiseZones: readonly string[];
  strategicInsightScore: number;
  strategicValueScore: number;
  urgencyEscalationScore: number;
  executiveInsightPrioritizationLabel: ExecutiveInsightPriorityStateLabel;
  prioritizationAmbiguityDisclaimer: string;
  nonManipulationPrioritizationDisclaimer: string;
}

export interface ExecutiveInsightPrioritizationSemantics {
  headline: string;
  summary: string;
  insightSummaries: readonly string[];
  valueSummaries: readonly string[];
  urgencySummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveInsightPrioritizationSnapshot {
  insightPrioritizationStateId: string;
  topologyId: string;
  cognitiveLoadStateId?: string;
  tick: number;
  state: ExecutiveInsightPrioritizationState;
  semantics: ExecutiveInsightPrioritizationSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future insight-priority UI contract (no rendering in D7:6:4). */
export interface ExecutiveInsightPrioritizationPanelContract {
  insightPrioritizationStateId: string;
  topologyId: string;
  strategicInsightScore: number;
  executiveInsightPrioritizationLabel: ExecutiveInsightPrioritizationState["executiveInsightPrioritizationLabel"];
  prioritizationAmbiguityDisclaimer: string;
  nonManipulationPrioritizationDisclaimer: string;
  insightSignals: readonly ExecutiveInsightPrioritizationPanelRow[];
  valueSummaries: readonly string[];
  headline: string;
  viewHint:
    | "insight_priority_overlay"
    | "executive_value_dashboard"
    | "urgency_heatmap"
    | "signal_importance_timeline"
    | "strategic_value_panel";
}

export interface ExecutiveInsightPrioritizationPanelRow {
  insightId: string;
  priorityState: ExecutiveInsightPriorityStateLabel;
  priorityStrength: number;
}

export interface SimulationExecutiveInsightPrioritizationContext {
  tick?: number;
  insightLeverageFactor?: number;
  urgencyStressFactor?: number;
}

export interface EvaluateExecutiveInsightPrioritizationInput {
  topology: OperationalUniverseTopology;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
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
  insightPrioritizationContext?: SimulationExecutiveInsightPrioritizationContext;
  tick?: number;
  insightPrioritizationStateId?: string;
  priorInsightPrioritizationFingerprints?: readonly string[];
}

export type EvaluateExecutiveInsightPrioritizationResult =
  | {
      ok: true;
      snapshot: ExecutiveInsightPrioritizationSnapshot;
      panelContract: ExecutiveInsightPrioritizationPanelContract;
    }
  | { ok: false; guard: ExecutiveInsightPrioritizationGuardResult };
