/**
 * D7:6:7 — Executive scenario immersion intelligence contracts.
 */

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
import type { ExecutiveScenarioImmersionGuardResult } from "./scenarioImmersionGuards.ts";

export type ExecutiveScenarioImmersionStateLabel =
  | "observational"
  | "engaged"
  | "immersed"
  | "overloaded"
  | "critical";

export interface ExecutiveScenarioImmersionSignal {
  immersionId: string;
  affectedRegionIds: readonly string[];
  immersionState: ExecutiveScenarioImmersionStateLabel;
  immersionStrength: number;
  dominantImmersionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface ScenarioEvolutionLayerRecord {
  recordId: string;
  layerType:
    | "operational_evolution"
    | "predictive_future_progression"
    | "resilience_transformation_pathway"
    | "governance_pressure_evolution"
    | "strategic_consequence_propagation"
    | "recovery_sequencing_immersion";
  layerStrength: number;
  explanation: string;
  contributingImmersionIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface ImmersiveCognitionRecord {
  recordId: string;
  cognitionType:
    | "fragmented_scenario_understanding"
    | "immersion_overload"
    | "unstable_exploration_pathway"
    | "low_context_exploration"
    | "future_understanding_gap"
    | "scenario_coherence_degradation";
  cognitionStrength: number;
  explanation: string;
  contributingImmersionIds: readonly string[];
}

export interface ExecutiveScenarioExplorationRecord {
  recordId: string;
  explorationDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  explorationStrength: number;
  explanation: string;
  contributingImmersionIds: readonly string[];
}

export interface ExecutiveScenarioImmersionIntelligenceState {
  activeImmersionSignals: readonly ExecutiveScenarioImmersionSignal[];
  scenarioEvolutionLayerRecords: readonly ScenarioEvolutionLayerRecord[];
  immersiveCognitionRecords: readonly ImmersiveCognitionRecord[];
  executiveScenarioExplorationRecords: readonly ExecutiveScenarioExplorationRecord[];
  deepExplorationZones: readonly string[];
  cognitiveImmersionRiskZones: readonly string[];
  immersionClarityScore: number;
  multiLayerScenarioScore: number;
  immersionOverloadScore: number;
  executiveImmersionLabel: ExecutiveScenarioImmersionStateLabel;
  immersionAmbiguityDisclaimer: string;
  nonManipulationImmersionDisclaimer: string;
}

export interface ExecutiveScenarioImmersionSemantics {
  headline: string;
  summary: string;
  immersionSummaries: readonly string[];
  layerSummaries: readonly string[];
  cognitionSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveScenarioImmersionSnapshot {
  immersionStateId: string;
  topologyId: string;
  timelineStateId?: string;
  tick: number;
  state: ExecutiveScenarioImmersionIntelligenceState;
  semantics: ExecutiveScenarioImmersionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future scenario-immersion UI contract (no rendering in D7:6:7). */
export interface ExecutiveScenarioImmersionPanelContract {
  immersionStateId: string;
  topologyId: string;
  immersionClarityScore: number;
  executiveImmersionLabel: ExecutiveScenarioImmersionIntelligenceState["executiveImmersionLabel"];
  immersionAmbiguityDisclaimer: string;
  nonManipulationImmersionDisclaimer: string;
  immersionSignals: readonly ExecutiveScenarioImmersionPanelRow[];
  layerSummaries: readonly string[];
  headline: string;
  viewHint:
    | "immersive_scenario_overlay"
    | "executive_exploration_dashboard"
    | "operational_evolution_map"
    | "future_branch_timeline"
    | "strategic_immersion_panel";
}

export interface ExecutiveScenarioImmersionPanelRow {
  immersionId: string;
  immersionState: ExecutiveScenarioImmersionStateLabel;
  immersionStrength: number;
}

export interface SimulationExecutiveScenarioImmersionContext {
  tick?: number;
  immersionLeverageFactor?: number;
  explorationStressFactor?: number;
}

export interface EvaluateExecutiveScenarioImmersionInput {
  topology: OperationalUniverseTopology;
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
  immersionContext?: SimulationExecutiveScenarioImmersionContext;
  tick?: number;
  immersionStateId?: string;
  priorImmersionFingerprints?: readonly string[];
}

export type EvaluateExecutiveScenarioImmersionResult =
  | {
      ok: true;
      snapshot: ExecutiveScenarioImmersionSnapshot;
      panelContract: ExecutiveScenarioImmersionPanelContract;
    }
  | { ok: false; guard: ExecutiveScenarioImmersionGuardResult };
