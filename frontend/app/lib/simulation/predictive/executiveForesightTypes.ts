/**
 * D7:4:8 — Predictive executive foresight contracts.
 */

import type { PredictiveStrategicAdaptationState } from "./strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type { ForesightGuardResult } from "./foresightGuards.ts";

export type ExecutiveForesightSignalState =
  | "emerging"
  | "developing"
  | "stabilizing"
  | "volatile"
  | "critical";

export interface ExecutiveForesightSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  foresightState: ExecutiveForesightSignalState;
  foresightStrength: number;
  dominantForesightDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonForesightRecord {
  recordId: string;
  regionId: string;
  horizonType:
    | "instability_trajectory"
    | "stabilization_opportunity"
    | "operational_drift"
    | "resilience_evolution"
    | "equilibrium_transformation";
  horizonStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface ExecutivePreparationGapRecord {
  recordId: string;
  gapType:
    | "coordination_preparedness"
    | "resilience_readiness"
    | "structural_fragility"
    | "recovery_readiness"
    | "equilibrium_preparedness";
  regionId: string;
  gapSeverity: number;
  explanation: string;
}

export interface PredictiveExecutiveForesightState {
  activeForesightSignals: readonly ExecutiveForesightSignal[];
  longHorizonForesightRecords: readonly LongHorizonForesightRecord[];
  executivePreparationGapRecords: readonly ExecutivePreparationGapRecord[];
  foresightOpportunityZones: readonly string[];
  longHorizonRiskZones: readonly string[];
  futureReadinessZones: readonly string[];
  strategicPreparednessScore: number;
  longHorizonRiskScore: number;
  futureReadinessScore: number;
  predictiveForesightLabel: "emerging" | "developing" | "stabilizing" | "volatile" | "critical";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveForesightSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  preparationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface PredictiveExecutiveForesightSnapshot {
  foresightStateId: string;
  topologyId: string;
  adaptationStateId?: string;
  tick: number;
  state: PredictiveExecutiveForesightState;
  semantics: ExecutiveForesightSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future executive foresight UI contract (no rendering in D7:4:8). */
export interface ForesightPanelContract {
  foresightStateId: string;
  topologyId: string;
  strategicPreparednessScore: number;
  predictiveForesightLabel: PredictiveExecutiveForesightState["predictiveForesightLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly ForesightPanelSignalRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "foresight_overlay"
    | "executive_preparedness_dashboard"
    | "long_horizon_risk_heatmap"
    | "strategic_foresight_timeline"
    | "future_readiness_panel";
}

export interface ForesightPanelSignalRow {
  signalId: string;
  label: string;
  foresightState: ExecutiveForesightSignalState;
  foresightStrength: number;
}

export interface SimulationExecutiveForesightContext {
  tick?: number;
  foresightAmplificationFactor?: number;
  horizonStressFactor?: number;
}

export interface EvaluateExecutiveForesightInput {
  topology: OperationalUniverseTopology;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  foresightContext?: SimulationExecutiveForesightContext;
  tick?: number;
  foresightStateId?: string;
  priorForesightFingerprints?: readonly string[];
}

export type EvaluateExecutiveForesightResult =
  | { ok: true; snapshot: PredictiveExecutiveForesightSnapshot; panelContract: ForesightPanelContract }
  | { ok: false; guard: ForesightGuardResult };
