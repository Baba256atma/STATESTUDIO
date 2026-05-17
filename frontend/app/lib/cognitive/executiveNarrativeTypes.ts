/**
 * D7:6:5 — Executive narrative intelligence contracts.
 */

import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
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
import type { ExecutiveNarrativeGuardResult } from "./narrativeIntelligenceGuards.ts";

export type ExecutiveNarrativeStateLabel =
  | "clear"
  | "developing"
  | "complex"
  | "fragmented"
  | "critical";

export interface ExecutiveNarrativeSignal {
  narrativeId: string;
  affectedRegionIds: readonly string[];
  narrativeState: ExecutiveNarrativeStateLabel;
  narrativeStrength: number;
  dominantNarrativeDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface ExecutiveNarrativeContextRecord {
  recordId: string;
  contextType:
    | "operational_context_synthesis"
    | "strategic_continuity"
    | "resilience_narrative_framing"
    | "predictive_trajectory_interpretation"
    | "governance_aware_storytelling"
    | "recovery_sequencing_explanation";
  contextStrength: number;
  explanation: string;
  contributingNarrativeIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface NarrativeCoherenceRecord {
  recordId: string;
  coherenceType:
    | "fragmented_operational_interpretation"
    | "conflicting_strategic_narratives"
    | "low_context_presentation"
    | "unstable_narrative_continuity"
    | "governance_context_gap"
    | "predictive_interpretation_instability";
  coherenceStrength: number;
  explanation: string;
  contributingNarrativeIds: readonly string[];
}

export interface ExecutiveUnderstandingRecord {
  recordId: string;
  understandingDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  understandingStrength: number;
  explanation: string;
  contributingNarrativeIds: readonly string[];
}

export interface ExecutiveNarrativeIntelligenceState {
  activeNarratives: readonly ExecutiveNarrativeSignal[];
  strategicContextRecords: readonly ExecutiveNarrativeContextRecord[];
  narrativeCoherenceRecords: readonly NarrativeCoherenceRecord[];
  executiveUnderstandingRecords: readonly ExecutiveUnderstandingRecord[];
  strategicNarrativeZones: readonly string[];
  fragmentedNarrativeZones: readonly string[];
  narrativeClarityScore: number;
  strategicContextScore: number;
  narrativeFragmentationScore: number;
  executiveNarrativeLabel: ExecutiveNarrativeStateLabel;
  narrativeAmbiguityDisclaimer: string;
  nonManipulationNarrativeDisclaimer: string;
}

export interface ExecutiveNarrativeSemantics {
  headline: string;
  summary: string;
  narrativeSummaries: readonly string[];
  contextSummaries: readonly string[];
  coherenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveNarrativeSnapshot {
  narrativeStateId: string;
  topologyId: string;
  insightPrioritizationStateId?: string;
  tick: number;
  state: ExecutiveNarrativeIntelligenceState;
  semantics: ExecutiveNarrativeSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future narrative UI contract (no rendering in D7:6:5). */
export interface ExecutiveNarrativePanelContract {
  narrativeStateId: string;
  topologyId: string;
  narrativeClarityScore: number;
  executiveNarrativeLabel: ExecutiveNarrativeIntelligenceState["executiveNarrativeLabel"];
  narrativeAmbiguityDisclaimer: string;
  nonManipulationNarrativeDisclaimer: string;
  narrativeSignals: readonly ExecutiveNarrativePanelRow[];
  contextSummaries: readonly string[];
  headline: string;
  viewHint:
    | "narrative_overlay"
    | "executive_story_dashboard"
    | "strategic_context_timeline"
    | "narrative_continuity_map"
    | "operational_interpretation_panel";
}

export interface ExecutiveNarrativePanelRow {
  narrativeId: string;
  narrativeState: ExecutiveNarrativeStateLabel;
  narrativeStrength: number;
}

export interface SimulationExecutiveNarrativeContext {
  tick?: number;
  narrativeLeverageFactor?: number;
  coherenceStressFactor?: number;
}

export interface EvaluateExecutiveNarrativesInput {
  topology: OperationalUniverseTopology;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
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
  narrativeContext?: SimulationExecutiveNarrativeContext;
  tick?: number;
  narrativeStateId?: string;
  priorNarrativeFingerprints?: readonly string[];
}

export type EvaluateExecutiveNarrativesResult =
  | {
      ok: true;
      snapshot: ExecutiveNarrativeSnapshot;
      panelContract: ExecutiveNarrativePanelContract;
    }
  | { ok: false; guard: ExecutiveNarrativeGuardResult };
