/**
 * D7:6:8 — Executive strategic presence intelligence contracts.
 */

import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
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
import type { ExecutiveStrategicPresenceGuardResult } from "./strategicPresenceGuards.ts";

export type ExecutiveStrategicPresenceStateLabel =
  | "aware"
  | "focused"
  | "sustained"
  | "fragmented"
  | "critical";

export interface ExecutiveStrategicPresenceSignal {
  presenceId: string;
  affectedRegionIds: readonly string[];
  presenceState: ExecutiveStrategicPresenceStateLabel;
  presenceStrength: number;
  dominantPresenceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface SituationalAwarenessLayerRecord {
  recordId: string;
  layerType:
    | "operational_awareness_continuity"
    | "strategic_context_retention"
    | "resilience_awareness_synchronization"
    | "governance_pressure_awareness"
    | "predictive_evolution_understanding"
    | "cross_domain_situational_cognition";
  layerStrength: number;
  explanation: string;
  contributingPresenceIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface PresenceFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "situational_fragmentation"
    | "awareness_instability"
    | "disconnected_strategic_cognition"
    | "operational_context_loss"
    | "cognitive_continuity_degradation"
    | "strategic_focus_instability";
  fragmentationStrength: number;
  explanation: string;
  contributingPresenceIds: readonly string[];
}

export interface ExecutiveContinuityRecord {
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
  contributingPresenceIds: readonly string[];
}

export interface ExecutiveStrategicPresenceIntelligenceState {
  activePresenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  situationalAwarenessLayerRecords: readonly SituationalAwarenessLayerRecord[];
  presenceFragmentationRecords: readonly PresenceFragmentationRecord[];
  executiveContinuityRecords: readonly ExecutiveContinuityRecord[];
  sustainedAwarenessZones: readonly string[];
  fragmentedPresenceZones: readonly string[];
  situationalContinuityScore: number;
  multiLayerAwarenessScore: number;
  presenceFragmentationScore: number;
  executivePresenceLabel: ExecutiveStrategicPresenceStateLabel;
  presenceAmbiguityDisclaimer: string;
  nonManipulationPresenceDisclaimer: string;
}

export interface ExecutiveStrategicPresenceSemantics {
  headline: string;
  summary: string;
  presenceSummaries: readonly string[];
  layerSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveStrategicPresenceSnapshot {
  presenceStateId: string;
  topologyId: string;
  immersionStateId?: string;
  tick: number;
  state: ExecutiveStrategicPresenceIntelligenceState;
  semantics: ExecutiveStrategicPresenceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic-presence UI contract (no rendering in D7:6:8). */
export interface ExecutiveStrategicPresencePanelContract {
  presenceStateId: string;
  topologyId: string;
  situationalContinuityScore: number;
  executivePresenceLabel: ExecutiveStrategicPresenceIntelligenceState["executivePresenceLabel"];
  presenceAmbiguityDisclaimer: string;
  nonManipulationPresenceDisclaimer: string;
  presenceSignals: readonly ExecutiveStrategicPresencePanelRow[];
  layerSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_presence_overlay"
    | "situational_awareness_dashboard"
    | "continuity_heatmap"
    | "executive_awareness_timeline"
    | "operational_context_panel";
}

export interface ExecutiveStrategicPresencePanelRow {
  presenceId: string;
  presenceState: ExecutiveStrategicPresenceStateLabel;
  presenceStrength: number;
}

export interface SimulationExecutiveStrategicPresenceContext {
  tick?: number;
  presenceLeverageFactor?: number;
  continuityStressFactor?: number;
}

export interface EvaluateExecutiveStrategicPresenceInput {
  topology: OperationalUniverseTopology;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
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
  presenceContext?: SimulationExecutiveStrategicPresenceContext;
  tick?: number;
  presenceStateId?: string;
  priorPresenceFingerprints?: readonly string[];
}

export type EvaluateExecutiveStrategicPresenceResult =
  | {
      ok: true;
      snapshot: ExecutiveStrategicPresenceSnapshot;
      panelContract: ExecutiveStrategicPresencePanelContract;
    }
  | { ok: false; guard: ExecutiveStrategicPresenceGuardResult };
