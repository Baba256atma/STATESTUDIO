/**
 * D7:7:1 — Nexora strategic reality engine foundation contracts.
 */

import type { ExecutiveCognitiveCompletionIntelligenceState } from "../cognitive/executiveCognitiveCompletionTypes.ts";
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
import type { OrganizationalFlowState } from "../simulation/flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../simulation/fragility/fragilityConcentrationTypes.ts";
import type { EnterprisePressureState } from "../simulation/pressure/dependencyPressureTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { StrategicRealityGuardResult } from "./strategicRealityGuards.ts";

export type StrategicRealityStateLabel =
  | "stable"
  | "evolving"
  | "adaptive"
  | "volatile"
  | "critical";

export interface StrategicRealitySignal {
  realityId: string;
  affectedRegionIds: readonly string[];
  realityState: StrategicRealityStateLabel;
  realityStrength: number;
  dominantRealityDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface UnifiedOperationalStateRecord {
  recordId: string;
  stateType:
    | "evolving_operational_ecosystem"
    | "interconnected_enterprise_states"
    | "resilience_evolution"
    | "fragility_propagation"
    | "governance_transformation"
    | "strategic_operational_continuity";
  stateStrength: number;
  explanation: string;
  contributingRealityIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface RealityEvolutionRecord {
  recordId: string;
  evolutionType:
    | "unstable_operational_ecosystem"
    | "fragmented_strategic_reality"
    | "operational_state_divergence"
    | "governance_instability_propagation"
    | "resilience_degradation"
    | "strategic_continuity_disruption";
  evolutionStrength: number;
  explanation: string;
  contributingRealityIds: readonly string[];
}

export interface EnterpriseWorldOrchestrationRecord {
  recordId: string;
  worldDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  orchestrationStrength: number;
  explanation: string;
  contributingRealityIds: readonly string[];
}

export interface StrategicRealityIntelligenceState {
  activeRealitySignals: readonly StrategicRealitySignal[];
  unifiedOperationalStateRecords: readonly UnifiedOperationalStateRecord[];
  realityEvolutionRecords: readonly RealityEvolutionRecord[];
  enterpriseWorldOrchestrationRecords: readonly EnterpriseWorldOrchestrationRecord[];
  evolvingRealityZones: readonly string[];
  unstableRealityZones: readonly string[];
  operationalRealityCoherenceScore: number;
  unifiedOperationalStateScore: number;
  realityInstabilityScore: number;
  executiveRealityLabel: StrategicRealityStateLabel;
  realityAmbiguityDisclaimer: string;
  nonAutonomousRealityDisclaimer: string;
}

export interface StrategicRealitySemantics {
  headline: string;
  summary: string;
  realitySummaries: readonly string[];
  operationalStateSummaries: readonly string[];
  evolutionSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicRealitySnapshot {
  realityStateId: string;
  topologyId: string;
  completionStateId?: string;
  tick: number;
  state: StrategicRealityIntelligenceState;
  semantics: StrategicRealitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic-reality UI contract (no rendering in D7:7:1). */
export interface StrategicRealityPanelContract {
  realityStateId: string;
  topologyId: string;
  operationalRealityCoherenceScore: number;
  executiveRealityLabel: StrategicRealityIntelligenceState["executiveRealityLabel"];
  realityAmbiguityDisclaimer: string;
  nonAutonomousRealityDisclaimer: string;
  realitySignals: readonly StrategicRealityPanelRow[];
  operationalStateSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_reality_overlay"
    | "operational_world_dashboard"
    | "reality_evolution_heatmap"
    | "enterprise_state_timeline"
    | "strategic_world_panel";
}

export interface StrategicRealityPanelRow {
  realityId: string;
  realityState: StrategicRealityStateLabel;
  realityStrength: number;
}

/** Operational universe inputs for strategic reality evaluation. */
export interface OperationalUniverseState {
  topology: OperationalUniverseTopology;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  governanceState: ExecutiveStrategicGovernanceState;
  flowState?: OrganizationalFlowState;
  fragilityMap?: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
}

export interface SimulationStrategicRealityContext {
  tick?: number;
  realityLeverageFactor?: number;
  evolutionStressFactor?: number;
}

export interface EvaluateStrategicRealityInput {
  topology: OperationalUniverseTopology;
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  simulationEvents?: readonly SimulationEvent[];
  realityContext?: SimulationStrategicRealityContext;
  tick?: number;
  realityStateId?: string;
  priorRealityFingerprints?: readonly string[];
}

export type EvaluateStrategicRealityResult =
  | {
      ok: true;
      snapshot: StrategicRealitySnapshot;
      panelContract: StrategicRealityPanelContract;
    }
  | { ok: false; guard: StrategicRealityGuardResult };
