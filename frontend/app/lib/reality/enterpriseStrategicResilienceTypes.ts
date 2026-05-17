/**
 * D7:7:5 — Enterprise strategic reality resilience intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseStrategicResilienceGuardResult } from "./enterpriseStrategicResilienceGuards.ts";

export type EnterpriseStrategicResilienceStateLabel =
  | "stable"
  | "adaptive"
  | "recovering"
  | "strained"
  | "critical";

export interface EnterpriseStrategicResilienceSignal {
  resilienceId: string;
  affectedRegionIds: readonly string[];
  resilienceState: EnterpriseStrategicResilienceStateLabel;
  resilienceStrength: number;
  dominantResilienceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface AdaptiveRecoveryRecord {
  recordId: string;
  recoveryType:
    | "operational_recovery_adaptation"
    | "governance_stabilization_capacity"
    | "resilience_under_pressure"
    | "continuity_preservation_pathway"
    | "organizational_recovery_coordination"
    | "long_horizon_resilience_evolution";
  recoveryStrength: number;
  explanation: string;
  contributingResilienceIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface ResilienceCapacityRecord {
  recordId: string;
  capacityType:
    | "resilience_degradation"
    | "adaptive_recovery_potential"
    | "continuity_stabilization_opportunity"
    | "governance_recovery_instability"
    | "operational_recovery_fatigue"
    | "resilience_collapse_risk";
  capacityStrength: number;
  explanation: string;
  contributingResilienceIds: readonly string[];
}

export interface EnterpriseResilienceContinuityRecord {
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
  contributingResilienceIds: readonly string[];
}

export interface EnterpriseStrategicResilienceIntelligenceState {
  activeResilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
  adaptiveRecoveryRecords: readonly AdaptiveRecoveryRecord[];
  resilienceCapacityRecords: readonly ResilienceCapacityRecord[];
  enterpriseResilienceContinuityRecords: readonly EnterpriseResilienceContinuityRecord[];
  adaptiveRecoveryZones: readonly string[];
  resilienceFailureZones: readonly string[];
  resilienceCapacityScore: number;
  adaptiveRecoveryScore: number;
  recoveryPressureScore: number;
  executiveResilienceLabel: EnterpriseStrategicResilienceStateLabel;
  resilienceAmbiguityDisclaimer: string;
  nonAutonomousResilienceDisclaimer: string;
}

export interface EnterpriseStrategicResilienceSemantics {
  headline: string;
  summary: string;
  resilienceSummaries: readonly string[];
  recoverySummaries: readonly string[];
  capacitySummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseStrategicResilienceSnapshot {
  resilienceStateId: string;
  topologyId: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseStrategicResilienceIntelligenceState;
  semantics: EnterpriseStrategicResilienceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future resilience UI contract (no rendering in D7:7:5). */
export interface EnterpriseStrategicResiliencePanelContract {
  resilienceStateId: string;
  topologyId: string;
  resilienceCapacityScore: number;
  executiveResilienceLabel: EnterpriseStrategicResilienceIntelligenceState["executiveResilienceLabel"];
  resilienceAmbiguityDisclaimer: string;
  nonAutonomousResilienceDisclaimer: string;
  resilienceSignals: readonly EnterpriseStrategicResiliencePanelRow[];
  recoverySummaries: readonly string[];
  headline: string;
  viewHint:
    | "resilience_overlay"
    | "adaptive_recovery_dashboard"
    | "resilience_capacity_heatmap"
    | "continuity_timeline"
    | "strategic_recovery_panel";
}

export interface EnterpriseStrategicResiliencePanelRow {
  resilienceId: string;
  resilienceState: EnterpriseStrategicResilienceStateLabel;
  resilienceStrength: number;
}

export interface SimulationStrategicResilienceContext {
  tick?: number;
  resilienceLeverageFactor?: number;
  recoveryPressureFactor?: number;
}

export interface EvaluateEnterpriseResilienceInput {
  topology: OperationalUniverseTopology;
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
  resilienceContext?: SimulationStrategicResilienceContext;
  tick?: number;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorResilienceFingerprints?: readonly string[];
}

export type EvaluateEnterpriseResilienceResult =
  | {
      ok: true;
      snapshot: EnterpriseStrategicResilienceSnapshot;
      panelContract: EnterpriseStrategicResiliencePanelContract;
    }
  | { ok: false; guard: EnterpriseStrategicResilienceGuardResult };
