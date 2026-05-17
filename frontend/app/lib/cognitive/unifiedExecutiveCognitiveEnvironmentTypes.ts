/**
 * D7:6:9 — Unified executive cognitive environment intelligence contracts.
 */

import type { ExecutiveStrategicPresenceIntelligenceState } from "./executiveStrategicPresenceTypes.ts";
import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { UnifiedExecutiveCognitiveEnvironmentGuardResult } from "./cognitiveEnvironmentGuards.ts";

export type UnifiedExecutiveEnvironmentStateLabel =
  | "coherent"
  | "synchronized"
  | "transitional"
  | "fragmented"
  | "critical";

export interface UnifiedExecutiveEnvironmentSignal {
  environmentId: string;
  affectedRegionIds: readonly string[];
  environmentState: UnifiedExecutiveEnvironmentStateLabel;
  environmentStrength: number;
  dominantEnvironmentDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface CrossCognitiveSynchronizationRecord {
  recordId: string;
  syncType:
    | "narrative_timeline_synchronization"
    | "immersion_presence_continuity"
    | "attention_load_coherence"
    | "governance_awareness_continuity"
    | "strategic_context_persistence"
    | "executive_cognition_stability";
  syncStrength: number;
  explanation: string;
  contributingEnvironmentIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface CognitiveEnvironmentFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "disconnected_cognitive_systems"
    | "fragmented_executive_experience"
    | "unstable_context_transitions"
    | "strategic_continuity_breakdown"
    | "inconsistent_cognitive_orchestration"
    | "operational_context_discontinuity";
  fragmentationStrength: number;
  explanation: string;
  contributingEnvironmentIds: readonly string[];
}

export interface ExecutiveEnvironmentContinuityRecord {
  recordId: string;
  continuityDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  continuityStrength: number;
  explanation: string;
  contributingEnvironmentIds: readonly string[];
}

export interface UnifiedExecutiveCognitiveEnvironmentIntelligenceState {
  activeEnvironmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  crossCognitiveSynchronizationRecords: readonly CrossCognitiveSynchronizationRecord[];
  cognitiveEnvironmentFragmentationRecords: readonly CognitiveEnvironmentFragmentationRecord[];
  executiveEnvironmentContinuityRecords: readonly ExecutiveEnvironmentContinuityRecord[];
  synchronizedCognitionZones: readonly string[];
  fragmentedEnvironmentZones: readonly string[];
  environmentCoherenceScore: number;
  crossCognitiveSyncScore: number;
  environmentFragmentationScore: number;
  executiveEnvironmentLabel: UnifiedExecutiveEnvironmentStateLabel;
  environmentAmbiguityDisclaimer: string;
  nonManipulationEnvironmentDisclaimer: string;
}

export interface UnifiedExecutiveCognitiveEnvironmentSemantics {
  headline: string;
  summary: string;
  environmentSummaries: readonly string[];
  syncSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface UnifiedExecutiveCognitiveEnvironmentSnapshot {
  environmentStateId: string;
  topologyId: string;
  presenceStateId?: string;
  tick: number;
  state: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
  semantics: UnifiedExecutiveCognitiveEnvironmentSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future unified-cognition UI contract (no rendering in D7:6:9). */
export interface UnifiedExecutiveCognitiveEnvironmentPanelContract {
  environmentStateId: string;
  topologyId: string;
  environmentCoherenceScore: number;
  executiveEnvironmentLabel: UnifiedExecutiveCognitiveEnvironmentIntelligenceState["executiveEnvironmentLabel"];
  environmentAmbiguityDisclaimer: string;
  nonManipulationEnvironmentDisclaimer: string;
  environmentSignals: readonly UnifiedExecutiveCognitiveEnvironmentPanelRow[];
  syncSummaries: readonly string[];
  headline: string;
  viewHint:
    | "unified_cognition_overlay"
    | "executive_environment_dashboard"
    | "continuity_heatmap"
    | "synchronized_cognition_timeline"
    | "unified_strategic_panel";
}

export interface UnifiedExecutiveCognitiveEnvironmentPanelRow {
  environmentId: string;
  environmentState: UnifiedExecutiveEnvironmentStateLabel;
  environmentStrength: number;
}

export interface SimulationUnifiedExecutiveCognitiveEnvironmentContext {
  tick?: number;
  environmentLeverageFactor?: number;
  syncStressFactor?: number;
}

export interface EvaluateUnifiedExecutiveEnvironmentInput {
  topology: OperationalUniverseTopology;
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  foresightState: PredictiveExecutiveForesightState;
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
  environmentContext?: SimulationUnifiedExecutiveCognitiveEnvironmentContext;
  tick?: number;
  environmentStateId?: string;
  priorEnvironmentFingerprints?: readonly string[];
}

export type EvaluateUnifiedExecutiveEnvironmentResult =
  | {
      ok: true;
      snapshot: UnifiedExecutiveCognitiveEnvironmentSnapshot;
      panelContract: UnifiedExecutiveCognitiveEnvironmentPanelContract;
    }
  | { ok: false; guard: UnifiedExecutiveCognitiveEnvironmentGuardResult };
