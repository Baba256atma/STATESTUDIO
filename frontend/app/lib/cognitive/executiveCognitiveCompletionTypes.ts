/**
 * D7:6:10 — Executive cognitive orchestration completion contracts.
 */

import type { UnifiedExecutiveCognitiveEnvironmentIntelligenceState } from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
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
import type { ExecutiveCognitiveCompletionGuardResult } from "./cognitiveCompletionGuards.ts";

export type ExecutiveCognitiveCompletionStateLabel =
  | "stable"
  | "coherent"
  | "synchronized"
  | "fragmented"
  | "critical";

export interface ExecutiveCognitiveCompletionSignal {
  completionId: string;
  affectedRegionIds: readonly string[];
  completionState: ExecutiveCognitiveCompletionStateLabel;
  completionStrength: number;
  dominantCompletionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface FullCognitiveSynchronizationRecord {
  recordId: string;
  syncType:
    | "full_executive_cognition_synchronization"
    | "strategic_continuity_orchestration"
    | "predictive_awareness_coherence"
    | "narrative_timeline_alignment"
    | "governance_presence_continuity"
    | "operational_cognition_stability";
  syncStrength: number;
  explanation: string;
  contributingCompletionIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface PlatformCoherenceRecord {
  recordId: string;
  coherenceType:
    | "cross_platform_cognitive_fragmentation"
    | "unstable_orchestration_continuity"
    | "disconnected_strategic_cognition"
    | "synchronization_degradation"
    | "executive_coherence_instability"
    | "operational_cognition_overload";
  coherenceStrength: number;
  explanation: string;
  contributingCompletionIds: readonly string[];
}

export interface ExecutiveCognitionCompletionRecord {
  recordId: string;
  completionDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  completionStrength: number;
  explanation: string;
  contributingCompletionIds: readonly string[];
}

export interface ExecutiveCognitiveCompletionIntelligenceState {
  activeCompletionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  fullCognitiveSynchronizationRecords: readonly FullCognitiveSynchronizationRecord[];
  platformCoherenceRecords: readonly PlatformCoherenceRecord[];
  executiveCognitionCompletionRecords: readonly ExecutiveCognitionCompletionRecord[];
  synchronizedExecutiveZones: readonly string[];
  orchestrationInstabilityZones: readonly string[];
  overallCognitiveCoherenceScore: number;
  fullCognitiveSyncScore: number;
  platformCoherenceDegradationScore: number;
  executiveCompletionLabel: ExecutiveCognitiveCompletionStateLabel;
  completionAmbiguityDisclaimer: string;
  nonAutonomousCompletionDisclaimer: string;
}

export interface ExecutiveCognitiveCompletionSemantics {
  headline: string;
  summary: string;
  completionSummaries: readonly string[];
  syncSummaries: readonly string[];
  coherenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveCognitiveCompletionSnapshot {
  completionStateId: string;
  topologyId: string;
  environmentStateId?: string;
  tick: number;
  state: ExecutiveCognitiveCompletionIntelligenceState;
  semantics: ExecutiveCognitiveCompletionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future executive UX contract (no rendering in D7:6:10). */
export interface ExecutiveCognitiveCompletionPanelContract {
  completionStateId: string;
  topologyId: string;
  overallCognitiveCoherenceScore: number;
  executiveCompletionLabel: ExecutiveCognitiveCompletionIntelligenceState["executiveCompletionLabel"];
  completionAmbiguityDisclaimer: string;
  nonAutonomousCompletionDisclaimer: string;
  completionSignals: readonly ExecutiveCognitiveCompletionPanelRow[];
  syncSummaries: readonly string[];
  headline: string;
  viewHint:
    | "unified_cognition_overlay"
    | "executive_orchestration_dashboard"
    | "platform_coherence_heatmap"
    | "synchronized_cognition_timeline"
    | "complete_strategic_environment_panel";
}

export interface ExecutiveCognitiveCompletionPanelRow {
  completionId: string;
  completionState: ExecutiveCognitiveCompletionStateLabel;
  completionStrength: number;
}

export interface SimulationExecutiveCognitiveCompletionContext {
  tick?: number;
  completionLeverageFactor?: number;
  orchestrationStressFactor?: number;
}

export interface EvaluateExecutiveCognitiveCompletionInput {
  topology: OperationalUniverseTopology;
  environmentState: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
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
  completionContext?: SimulationExecutiveCognitiveCompletionContext;
  tick?: number;
  completionStateId?: string;
  priorCompletionFingerprints?: readonly string[];
}

export type EvaluateExecutiveCognitiveCompletionResult =
  | {
      ok: true;
      snapshot: ExecutiveCognitiveCompletionSnapshot;
      panelContract: ExecutiveCognitiveCompletionPanelContract;
    }
  | { ok: false; guard: ExecutiveCognitiveCompletionGuardResult };
