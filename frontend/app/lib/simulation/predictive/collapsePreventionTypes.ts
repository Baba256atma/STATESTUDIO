/**
 * D7:4:6 — Predictive systemic collapse prevention contracts.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { StrategicInflectionState } from "./cascadingConsequenceTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type { PreventionGuardResult } from "./preventionGuards.ts";

export type CollapsePreventionSignalState =
  | "monitoring"
  | "stabilizing"
  | "intervenable"
  | "fragile"
  | "critical";

export interface CollapsePreventionSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  preventionState: CollapsePreventionSignalState;
  preventionStrength: number;
  dominantPreventionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface StabilizationInterruptionRecord {
  recordId: string;
  originRegionId: string;
  interruptedCascadePath: string;
  interruptionScore: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface ResiliencePreservationRecord {
  recordId: string;
  regionId: string;
  preservationType:
    | "fragility_reduction"
    | "cascade_interruption"
    | "equilibrium_restoration"
    | "trust_stabilization"
    | "recovery_window";
  preservationStrength: number;
  explanation: string;
}

export interface PredictiveCollapsePreventionState {
  activePreventionSignals: readonly CollapsePreventionSignal[];
  stabilizationInterruptionRecords: readonly StabilizationInterruptionRecord[];
  resiliencePreservationRecords: readonly ResiliencePreservationRecord[];
  stabilizationInterventionZones: readonly string[];
  criticalCollapseZones: readonly string[];
  collapseInterruptionScore: number;
  criticalThresholdProximityScore: number;
  resiliencePreservationScore: number;
  predictivePreventionLabel:
    | "monitoring"
    | "intervenable"
    | "stabilizing"
    | "fragile"
    | "critical";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveCollapsePreventionSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  interruptionSummaries: readonly string[];
  preservationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface PredictiveCollapsePreventionSnapshot {
  preventionStateId: string;
  topologyId: string;
  recoveryOpportunityStateId?: string;
  cascadeStateId?: string;
  tick: number;
  state: PredictiveCollapsePreventionState;
  semantics: ExecutiveCollapsePreventionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future collapse prevention UI contract (no rendering in D7:4:6). */
export interface PreventionPanelContract {
  preventionStateId: string;
  topologyId: string;
  collapseInterruptionScore: number;
  predictivePreventionLabel: PredictiveCollapsePreventionState["predictivePreventionLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly PreventionPanelSignalRow[];
  interruptionSummaries: readonly string[];
  headline: string;
  viewHint:
    | "collapse_prevention_overlay"
    | "stabilization_opportunity_heatmap"
    | "predictive_prevention_dashboard"
    | "executive_prevention_timeline"
    | "resilience_preservation_panel";
}

export interface PreventionPanelSignalRow {
  signalId: string;
  label: string;
  preventionState: CollapsePreventionSignalState;
  preventionStrength: number;
}

export interface SimulationCollapsePreventionContext {
  tick?: number;
  preventionLeverageFactor?: number;
  thresholdStressFactor?: number;
}

export interface EvaluateCollapsePreventionInput {
  topology: OperationalUniverseTopology;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  inflectionState?: StrategicInflectionState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  simulationEvents?: readonly SimulationEvent[];
  preventionContext?: SimulationCollapsePreventionContext;
  tick?: number;
  preventionStateId?: string;
  priorPreventionFingerprints?: readonly string[];
}

export type EvaluateCollapsePreventionResult =
  | {
      ok: true;
      snapshot: PredictiveCollapsePreventionSnapshot;
      panelContract: PreventionPanelContract;
    }
  | { ok: false; guard: PreventionGuardResult };
