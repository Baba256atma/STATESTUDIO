/**
 * D7:7:7 — Enterprise strategic reality equilibrium intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { EnterpriseStrategicRealityEvolutionIntelligenceState } from "./enterpriseStrategicRealityEvolutionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseStrategicEquilibriumGuardResult } from "./enterpriseStrategicEquilibriumGuards.ts";

export type EnterpriseStrategicEquilibriumStateLabel =
  | "balanced"
  | "adaptive"
  | "strained"
  | "destabilizing"
  | "critical";

export interface EnterpriseStrategicEquilibriumSignal {
  equilibriumId: string;
  affectedRegionIds: readonly string[];
  equilibriumState: EnterpriseStrategicEquilibriumStateLabel;
  equilibriumStrength: number;
  dominantEquilibriumDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface DynamicBalanceRecord {
  recordId: string;
  balanceType:
    | "pressure_recovery_balance"
    | "governance_stabilization"
    | "resilience_equilibrium_adaptation"
    | "operational_load_balancing"
    | "strategic_momentum_stabilization"
    | "long_horizon_continuity_balance";
  balanceStrength: number;
  explanation: string;
  contributingEquilibriumIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface EquilibriumInstabilityRecord {
  recordId: string;
  instabilityType:
    | "systemic_imbalance"
    | "operational_destabilization"
    | "resilience_capacity_mismatch"
    | "governance_equilibrium_degradation"
    | "pressure_accumulation_imbalance"
    | "strategic_continuity_instability";
  instabilityStrength: number;
  explanation: string;
  contributingEquilibriumIds: readonly string[];
}

export interface EnterpriseStabilityRecord {
  recordId: string;
  stabilityDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  stabilityStrength: number;
  explanation: string;
  contributingEquilibriumIds: readonly string[];
}

export interface EnterpriseStrategicEquilibriumIntelligenceState {
  activeEquilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
  dynamicBalanceRecords: readonly DynamicBalanceRecord[];
  equilibriumInstabilityRecords: readonly EquilibriumInstabilityRecord[];
  enterpriseStabilityRecords: readonly EnterpriseStabilityRecord[];
  stabilizedEquilibriumZones: readonly string[];
  destabilizedEquilibriumZones: readonly string[];
  systemicBalanceScore: number;
  dynamicBalanceScore: number;
  destabilizationPressureScore: number;
  executiveEquilibriumLabel: EnterpriseStrategicEquilibriumStateLabel;
  equilibriumAmbiguityDisclaimer: string;
  nonAutonomousEquilibriumDisclaimer: string;
}

export interface EnterpriseStrategicEquilibriumSemantics {
  headline: string;
  summary: string;
  equilibriumSummaries: readonly string[];
  balanceSummaries: readonly string[];
  instabilitySummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseStrategicEquilibriumSnapshot {
  equilibriumStateId: string;
  topologyId: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseStrategicEquilibriumIntelligenceState;
  semantics: EnterpriseStrategicEquilibriumSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future equilibrium UI contract (no rendering in D7:7:7). */
export interface EnterpriseStrategicEquilibriumPanelContract {
  equilibriumStateId: string;
  topologyId: string;
  systemicBalanceScore: number;
  executiveEquilibriumLabel: EnterpriseStrategicEquilibriumIntelligenceState["executiveEquilibriumLabel"];
  equilibriumAmbiguityDisclaimer: string;
  nonAutonomousEquilibriumDisclaimer: string;
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumPanelRow[];
  balanceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "equilibrium_overlay"
    | "systemic_balance_dashboard"
    | "stability_heatmap"
    | "equilibrium_timeline"
    | "operational_balance_panel";
}

export interface EnterpriseStrategicEquilibriumPanelRow {
  equilibriumId: string;
  equilibriumState: EnterpriseStrategicEquilibriumStateLabel;
  equilibriumStrength: number;
}

export interface SimulationStrategicEquilibriumContext {
  tick?: number;
  equilibriumLeverageFactor?: number;
  balancePressureFactor?: number;
}

export interface EvaluateStrategicEquilibriumInput {
  topology: OperationalUniverseTopology;
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
  equilibriumContext?: SimulationStrategicEquilibriumContext;
  tick?: number;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorEquilibriumFingerprints?: readonly string[];
}

export type EvaluateStrategicEquilibriumResult =
  | {
      ok: true;
      snapshot: EnterpriseStrategicEquilibriumSnapshot;
      panelContract: EnterpriseStrategicEquilibriumPanelContract;
    }
  | { ok: false; guard: EnterpriseStrategicEquilibriumGuardResult };
