/**
 * D7:6:1 — Executive cognitive UX orchestration contracts.
 */

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
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { ExecutiveCognitiveUxGuardResult } from "./cognitiveUxGuards.ts";

export type ExecutiveCognitiveStateLabel =
  | "focused"
  | "stable"
  | "elevated"
  | "overloaded"
  | "critical";

export interface ExecutiveCognitiveSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  cognitiveState: ExecutiveCognitiveStateLabel;
  cognitiveStrength: number;
  dominantCognitiveDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface AttentionPriorityRecord {
  recordId: string;
  priorityType:
    | "executive_focus"
    | "operational_urgency"
    | "strategic_attention_routing"
    | "recovery_priority_elevation"
    | "fragility_visibility"
    | "governance_awareness";
  priorityStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface CognitiveLoadRecord {
  recordId: string;
  loadType:
    | "executive_overload"
    | "excessive_signal_density"
    | "fragmented_attention"
    | "complexity_escalation"
    | "low_clarity_interaction"
    | "unstable_orchestration_pattern";
  loadStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface ExecutiveInteractionRecord {
  recordId: string;
  interactionDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  interactionStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface ExecutiveCognitiveUxState {
  activeCognitiveSignals: readonly ExecutiveCognitiveSignal[];
  attentionPriorityRecords: readonly AttentionPriorityRecord[];
  cognitiveLoadRecords: readonly CognitiveLoadRecord[];
  executiveInteractionRecords: readonly ExecutiveInteractionRecord[];
  attentionPriorityZones: readonly string[];
  cognitiveOverloadZones: readonly string[];
  cognitiveClarityScore: number;
  attentionPriorityScore: number;
  cognitiveLoadScore: number;
  executiveCognitiveLabel: ExecutiveCognitiveStateLabel;
  cognitiveAmbiguityDisclaimer: string;
  nonManipulationDisclaimer: string;
}

export interface ExecutiveCognitiveUxSemantics {
  headline: string;
  summary: string;
  cognitiveSummaries: readonly string[];
  attentionSummaries: readonly string[];
  loadSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveCognitiveUxSnapshot {
  cognitiveUxStateId: string;
  topologyId: string;
  orchestrationStateId?: string;
  tick: number;
  state: ExecutiveCognitiveUxState;
  semantics: ExecutiveCognitiveUxSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future executive cognitive UX UI contract (no rendering in D7:6:1). */
export interface ExecutiveCognitiveUxPanelContract {
  cognitiveUxStateId: string;
  topologyId: string;
  cognitiveClarityScore: number;
  executiveCognitiveLabel: ExecutiveCognitiveUxState["executiveCognitiveLabel"];
  cognitiveAmbiguityDisclaimer: string;
  nonManipulationDisclaimer: string;
  cognitiveSignals: readonly ExecutiveCognitiveUxPanelRow[];
  attentionSummaries: readonly string[];
  headline: string;
  viewHint:
    | "executive_cognition_overlay"
    | "attention_priority_dashboard"
    | "cognitive_load_heatmap"
    | "strategic_focus_timeline"
    | "operational_clarity_panel";
}

export interface ExecutiveCognitiveUxPanelRow {
  signalId: string;
  cognitiveState: ExecutiveCognitiveStateLabel;
  cognitiveStrength: number;
}

export interface SimulationExecutiveCognitiveUxContext {
  tick?: number;
  cognitiveLeverageFactor?: number;
  overloadStressFactor?: number;
}

export interface EvaluateExecutiveCognitiveUxInput {
  topology: OperationalUniverseTopology;
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
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  cognitiveUxContext?: SimulationExecutiveCognitiveUxContext;
  tick?: number;
  cognitiveUxStateId?: string;
  priorCognitiveUxFingerprints?: readonly string[];
}

export type EvaluateExecutiveCognitiveUxResult =
  | {
      ok: true;
      snapshot: ExecutiveCognitiveUxSnapshot;
      panelContract: ExecutiveCognitiveUxPanelContract;
    }
  | { ok: false; guard: ExecutiveCognitiveUxGuardResult };
