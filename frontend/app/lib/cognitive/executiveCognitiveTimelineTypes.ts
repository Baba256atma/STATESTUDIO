/**
 * D7:6:6 — Executive cognitive timeline intelligence contracts.
 */

import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { ExecutiveCognitiveTimelineGuardResult } from "./cognitiveTimelineGuards.ts";

export type ExecutiveTimelineStateLabel =
  | "immediate"
  | "developing"
  | "transitional"
  | "long_horizon"
  | "critical";

export interface ExecutiveTimelineSignal {
  timelineId: string;
  affectedRegionIds: readonly string[];
  timelineState: ExecutiveTimelineStateLabel;
  timelineStrength: number;
  dominantTimelineDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface CognitiveHorizonRecord {
  recordId: string;
  horizonType:
    | "immediate_operational_timeline"
    | "mid_term_recovery_evolution"
    | "long_horizon_resilience_transformation"
    | "predictive_divergence_sequencing"
    | "stabilization_progression"
    | "governance_timeline_relationship";
  horizonStrength: number;
  explanation: string;
  contributingTimelineIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface TimelineFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "disconnected_strategic_timelines"
    | "conflicting_operational_horizons"
    | "unstable_temporal_sequencing"
    | "fragmented_recovery_evolution"
    | "urgency_horizon_mismatch"
    | "future_context_instability";
  fragmentationStrength: number;
  explanation: string;
  contributingTimelineIds: readonly string[];
}

export interface ExecutiveTemporalCognitionRecord {
  recordId: string;
  cognitionDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  cognitionStrength: number;
  explanation: string;
  contributingTimelineIds: readonly string[];
}

export interface ExecutiveCognitiveTimelineIntelligenceState {
  activeTimelineSignals: readonly ExecutiveTimelineSignal[];
  cognitiveHorizonRecords: readonly CognitiveHorizonRecord[];
  timelineFragmentationRecords: readonly TimelineFragmentationRecord[];
  executiveTemporalCognitionRecords: readonly ExecutiveTemporalCognitionRecord[];
  immediatePriorityZones: readonly string[];
  fragmentedTimelineZones: readonly string[];
  timelineClarityScore: number;
  multiHorizonScore: number;
  timelineFragmentationScore: number;
  executiveTimelineLabel: ExecutiveTimelineStateLabel;
  timelineAmbiguityDisclaimer: string;
  nonManipulationTimelineDisclaimer: string;
}

export interface ExecutiveCognitiveTimelineSemantics {
  headline: string;
  summary: string;
  timelineSummaries: readonly string[];
  horizonSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveCognitiveTimelineSnapshot {
  timelineStateId: string;
  topologyId: string;
  narrativeStateId?: string;
  tick: number;
  state: ExecutiveCognitiveTimelineIntelligenceState;
  semantics: ExecutiveCognitiveTimelineSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future timeline UI contract (no rendering in D7:6:6). */
export interface ExecutiveCognitiveTimelinePanelContract {
  timelineStateId: string;
  topologyId: string;
  timelineClarityScore: number;
  executiveTimelineLabel: ExecutiveCognitiveTimelineIntelligenceState["executiveTimelineLabel"];
  timelineAmbiguityDisclaimer: string;
  nonManipulationTimelineDisclaimer: string;
  timelineSignals: readonly ExecutiveCognitiveTimelinePanelRow[];
  horizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "timeline_overlay"
    | "executive_horizon_dashboard"
    | "temporal_heatmap"
    | "recovery_evolution_timeline"
    | "strategic_sequencing_panel";
}

export interface ExecutiveCognitiveTimelinePanelRow {
  timelineId: string;
  timelineState: ExecutiveTimelineStateLabel;
  timelineStrength: number;
}

export interface SimulationExecutiveCognitiveTimelineContext {
  tick?: number;
  timelineLeverageFactor?: number;
  horizonStressFactor?: number;
}

export interface EvaluateExecutiveCognitiveTimelinesInput {
  topology: OperationalUniverseTopology;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  foresightState: PredictiveExecutiveForesightState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  timelineContext?: SimulationExecutiveCognitiveTimelineContext;
  tick?: number;
  timelineStateId?: string;
  priorTimelineFingerprints?: readonly string[];
}

export type EvaluateExecutiveCognitiveTimelinesResult =
  | {
      ok: true;
      snapshot: ExecutiveCognitiveTimelineSnapshot;
      panelContract: ExecutiveCognitiveTimelinePanelContract;
    }
  | { ok: false; guard: ExecutiveCognitiveTimelineGuardResult };
