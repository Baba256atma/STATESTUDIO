/**
 * D7:7:6 — Enterprise strategic reality evolution intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseStrategicRealityEvolutionGuardResult } from "./enterpriseStrategicRealityEvolutionGuards.ts";

export type EnterpriseStrategicRealityEvolutionStateLabel =
  | "stable"
  | "transforming"
  | "adaptive"
  | "accelerating"
  | "critical";

export interface EnterpriseStrategicRealityEvolutionSignal {
  evolutionId: string;
  affectedRegionIds: readonly string[];
  evolutionState: EnterpriseStrategicRealityEvolutionStateLabel;
  evolutionStrength: number;
  dominantEvolutionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonTransformationRecord {
  recordId: string;
  transformationType:
    | "organizational_transformation"
    | "governance_evolution"
    | "resilience_adaptation"
    | "operational_restructuring"
    | "strategic_equilibrium_shift"
    | "recovery_to_transformation_pathway";
  transformationStrength: number;
  explanation: string;
  contributingEvolutionIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface EvolutionaryTransitionRecord {
  recordId: string;
  transitionType:
    | "unstable_organizational_transition"
    | "fragmented_transformation_pathway"
    | "resilience_driven_evolution"
    | "governance_transition_instability"
    | "operational_adaptation_acceleration"
    | "structural_strategic_change";
  transitionStrength: number;
  explanation: string;
  contributingEvolutionIds: readonly string[];
}

export interface EnterpriseTransformationRecord {
  recordId: string;
  transformationDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  transformationStrength: number;
  explanation: string;
  contributingEvolutionIds: readonly string[];
}

export interface EnterpriseStrategicRealityEvolutionIntelligenceState {
  activeEvolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  longHorizonTransformationRecords: readonly LongHorizonTransformationRecord[];
  evolutionaryTransitionRecords: readonly EvolutionaryTransitionRecord[];
  enterpriseTransformationRecords: readonly EnterpriseTransformationRecord[];
  adaptiveEvolutionZones: readonly string[];
  unstableTransitionZones: readonly string[];
  transformationCoherenceScore: number;
  longHorizonEvolutionScore: number;
  transitionInstabilityScore: number;
  executiveEvolutionLabel: EnterpriseStrategicRealityEvolutionStateLabel;
  evolutionAmbiguityDisclaimer: string;
  nonAutonomousEvolutionDisclaimer: string;
}

export interface EnterpriseStrategicRealityEvolutionSemantics {
  headline: string;
  summary: string;
  evolutionSummaries: readonly string[];
  transformationSummaries: readonly string[];
  transitionSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseStrategicRealityEvolutionSnapshot {
  evolutionStateId: string;
  topologyId: string;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseStrategicRealityEvolutionIntelligenceState;
  semantics: EnterpriseStrategicRealityEvolutionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future evolution UI contract (no rendering in D7:7:6). */
export interface EnterpriseStrategicRealityEvolutionPanelContract {
  evolutionStateId: string;
  topologyId: string;
  transformationCoherenceScore: number;
  executiveEvolutionLabel: EnterpriseStrategicRealityEvolutionIntelligenceState["executiveEvolutionLabel"];
  evolutionAmbiguityDisclaimer: string;
  nonAutonomousEvolutionDisclaimer: string;
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionPanelRow[];
  transformationSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_evolution_overlay"
    | "enterprise_transformation_dashboard"
    | "long_horizon_transition_heatmap"
    | "operational_evolution_timeline"
    | "transformation_coherence_panel";
}

export interface EnterpriseStrategicRealityEvolutionPanelRow {
  evolutionId: string;
  evolutionState: EnterpriseStrategicRealityEvolutionStateLabel;
  evolutionStrength: number;
}

export interface SimulationStrategicRealityEvolutionContext {
  tick?: number;
  evolutionLeverageFactor?: number;
  transitionPressureFactor?: number;
}

export interface EvaluateStrategicRealityEvolutionInput {
  topology: OperationalUniverseTopology;
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  simulationEvents?: readonly SimulationEvent[];
  evolutionContext?: SimulationStrategicRealityEvolutionContext;
  tick?: number;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorEvolutionFingerprints?: readonly string[];
}

export type EvaluateStrategicRealityEvolutionResult =
  | {
      ok: true;
      snapshot: EnterpriseStrategicRealityEvolutionSnapshot;
      panelContract: EnterpriseStrategicRealityEvolutionPanelContract;
    }
  | { ok: false; guard: EnterpriseStrategicRealityEvolutionGuardResult };
