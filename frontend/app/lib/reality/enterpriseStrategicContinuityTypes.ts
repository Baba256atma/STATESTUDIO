/**
 * D7:7:8 — Enterprise strategic reality continuity intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { EnterpriseStrategicRealityEvolutionIntelligenceState } from "./enterpriseStrategicRealityEvolutionTypes.ts";
import type { EnterpriseStrategicEquilibriumIntelligenceState } from "./enterpriseStrategicEquilibriumTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseStrategicContinuityGuardResult } from "./enterpriseStrategicContinuityGuards.ts";

export type EnterpriseStrategicContinuityStateLabel =
  | "stable"
  | "adaptive"
  | "strained"
  | "fragmenting"
  | "critical";

export interface EnterpriseStrategicContinuitySignal {
  continuityId: string;
  affectedRegionIds: readonly string[];
  continuityState: EnterpriseStrategicContinuityStateLabel;
  continuityStrength: number;
  dominantContinuityDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonContinuityRecord {
  recordId: string;
  continuityType:
    | "operational_continuity_preservation"
    | "long_horizon_organizational_survival"
    | "resilience_driven_continuity"
    | "governance_continuity_stabilization"
    | "adaptive_continuity_pathway"
    | "strategic_persistence_evolution";
  continuityStrength: number;
  explanation: string;
  contributingContinuityIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface ContinuityFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "continuity_degradation"
    | "organizational_survival_instability"
    | "resilience_exhaustion"
    | "governance_continuity_fragmentation"
    | "operational_persistence_failure"
    | "strategic_continuity_collapse_risk";
  fragmentationStrength: number;
  explanation: string;
  contributingContinuityIds: readonly string[];
}

export interface EnterpriseSurvivalRecord {
  recordId: string;
  survivalDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  survivalStrength: number;
  explanation: string;
  contributingContinuityIds: readonly string[];
}

export interface EnterpriseStrategicContinuityIntelligenceState {
  activeContinuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  continuityFragmentationRecords: readonly ContinuityFragmentationRecord[];
  enterpriseSurvivalRecords: readonly EnterpriseSurvivalRecord[];
  preservedContinuityZones: readonly string[];
  continuityFailureZones: readonly string[];
  longHorizonContinuityScore: number;
  continuityPreservationScore: number;
  continuityFragmentationScore: number;
  continuityPressureScore: number;
  executiveContinuityLabel: EnterpriseStrategicContinuityStateLabel;
  continuityAmbiguityDisclaimer: string;
  nonAutonomousContinuityDisclaimer: string;
}

export interface EnterpriseStrategicContinuitySemantics {
  headline: string;
  summary: string;
  continuitySummaries: readonly string[];
  persistenceSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseStrategicContinuitySnapshot {
  continuityStateId: string;
  topologyId: string;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseStrategicContinuityIntelligenceState;
  semantics: EnterpriseStrategicContinuitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future continuity UI contract (no rendering in D7:7:8). */
export interface EnterpriseStrategicContinuityPanelContract {
  continuityStateId: string;
  topologyId: string;
  longHorizonContinuityScore: number;
  executiveContinuityLabel: EnterpriseStrategicContinuityIntelligenceState["executiveContinuityLabel"];
  continuityAmbiguityDisclaimer: string;
  nonAutonomousContinuityDisclaimer: string;
  continuitySignals: readonly EnterpriseStrategicContinuityPanelRow[];
  persistenceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "continuity_overlay"
    | "enterprise_survival_dashboard"
    | "continuity_heatmap"
    | "operational_persistence_timeline"
    | "long_horizon_continuity_panel";
}

export interface EnterpriseStrategicContinuityPanelRow {
  continuityId: string;
  continuityState: EnterpriseStrategicContinuityStateLabel;
  continuityStrength: number;
}

export interface SimulationStrategicContinuityContext {
  tick?: number;
  continuityLeverageFactor?: number;
  survivalPressureFactor?: number;
}

export interface EvaluateStrategicContinuityInput {
  topology: OperationalUniverseTopology;
  equilibriumState: EnterpriseStrategicEquilibriumIntelligenceState;
  evolutionState: EnterpriseStrategicRealityEvolutionIntelligenceState;
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
  continuityContext?: SimulationStrategicContinuityContext;
  tick?: number;
  continuityStateId?: string;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorContinuityFingerprints?: readonly string[];
}

export type EvaluateStrategicContinuityResult =
  | {
      ok: true;
      snapshot: EnterpriseStrategicContinuitySnapshot;
      panelContract: EnterpriseStrategicContinuityPanelContract;
    }
  | { ok: false; guard: EnterpriseStrategicContinuityGuardResult };
