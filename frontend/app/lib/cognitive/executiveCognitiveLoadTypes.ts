/**
 * D7:6:3 — Executive cognitive load balancing intelligence contracts.
 */

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
import type { ExecutiveCognitiveLoadBalancingGuardResult } from "./cognitiveLoadBalancingGuards.ts";

export type ExecutiveCognitiveLoadStateLabel =
  | "balanced"
  | "elevated"
  | "dense"
  | "overloaded"
  | "critical";

export interface ExecutiveCognitiveLoadSignal {
  loadId: string;
  affectedRegionIds: readonly string[];
  loadState: ExecutiveCognitiveLoadStateLabel;
  loadStrength: number;
  dominantLoadDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface SignalDensityRecord {
  recordId: string;
  densityType:
    | "operational_signal_density"
    | "predictive_complexity"
    | "advisory_overload"
    | "urgency_saturation"
    | "strategic_focus_balancing"
    | "governance_alert_accumulation";
  densityStrength: number;
  explanation: string;
  contributingLoadIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface OverloadDistributionRecord {
  recordId: string;
  distributionType:
    | "executive_overload"
    | "fragmented_strategic_cognition"
    | "alert_density_saturation"
    | "unstable_interaction_complexity"
    | "focus_capacity_degradation"
    | "cognitive_fatigue_risk";
  distributionStrength: number;
  explanation: string;
  contributingLoadIds: readonly string[];
}

export interface ExecutiveStabilityRecord {
  recordId: string;
  stabilityDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  stabilityStrength: number;
  explanation: string;
  contributingLoadIds: readonly string[];
}

export interface ExecutiveCognitiveLoadBalancingState {
  activeLoadSignals: readonly ExecutiveCognitiveLoadSignal[];
  signalDensityRecords: readonly SignalDensityRecord[];
  overloadDistributionRecords: readonly OverloadDistributionRecord[];
  executiveStabilityRecords: readonly ExecutiveStabilityRecord[];
  overloadZones: readonly string[];
  stabilizedAttentionZones: readonly string[];
  cognitiveBalanceScore: number;
  signalDensityScore: number;
  overloadEscalationScore: number;
  executiveCognitiveLoadLabel: ExecutiveCognitiveLoadStateLabel;
  loadAmbiguityDisclaimer: string;
  nonManipulationLoadDisclaimer: string;
}

export interface ExecutiveCognitiveLoadBalancingSemantics {
  headline: string;
  summary: string;
  loadSummaries: readonly string[];
  densitySummaries: readonly string[];
  overloadSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveCognitiveLoadBalancingSnapshot {
  cognitiveLoadStateId: string;
  topologyId: string;
  attentionRoutingStateId?: string;
  tick: number;
  state: ExecutiveCognitiveLoadBalancingState;
  semantics: ExecutiveCognitiveLoadBalancingSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future cognitive-load UI contract (no rendering in D7:6:3). */
export interface ExecutiveCognitiveLoadPanelContract {
  cognitiveLoadStateId: string;
  topologyId: string;
  cognitiveBalanceScore: number;
  executiveCognitiveLoadLabel: ExecutiveCognitiveLoadBalancingState["executiveCognitiveLoadLabel"];
  loadAmbiguityDisclaimer: string;
  nonManipulationLoadDisclaimer: string;
  loadSignals: readonly ExecutiveCognitiveLoadPanelRow[];
  densitySummaries: readonly string[];
  headline: string;
  viewHint:
    | "cognitive_load_overlay"
    | "executive_balance_dashboard"
    | "overload_heatmap"
    | "signal_density_timeline"
    | "interaction_complexity_panel";
}

export interface ExecutiveCognitiveLoadPanelRow {
  loadId: string;
  loadState: ExecutiveCognitiveLoadStateLabel;
  loadStrength: number;
}

export interface SimulationExecutiveCognitiveLoadContext {
  tick?: number;
  loadLeverageFactor?: number;
  overloadStressFactor?: number;
}

export interface EvaluateExecutiveCognitiveLoadInput {
  topology: OperationalUniverseTopology;
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
  cognitiveLoadContext?: SimulationExecutiveCognitiveLoadContext;
  tick?: number;
  cognitiveLoadStateId?: string;
  priorCognitiveLoadFingerprints?: readonly string[];
}

export type EvaluateExecutiveCognitiveLoadResult =
  | {
      ok: true;
      snapshot: ExecutiveCognitiveLoadBalancingSnapshot;
      panelContract: ExecutiveCognitiveLoadPanelContract;
    }
  | { ok: false; guard: ExecutiveCognitiveLoadBalancingGuardResult };
