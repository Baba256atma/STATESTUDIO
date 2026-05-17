/**
 * D7:4:5 — Predictive recovery opportunity contracts.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { RecoveryOpportunityGuardResult } from "./recoveryOpportunityGuards.ts";

export type RecoveryOpportunitySignalState =
  | "emerging"
  | "stabilizing"
  | "accelerating"
  | "fragile"
  | "critical";

export interface RecoveryOpportunitySignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  opportunityState: RecoveryOpportunitySignalState;
  opportunityStrength: number;
  dominantOpportunityDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface RecoveryLeveragePointRecord {
  recordId: string;
  leverageRegionId: string;
  impactedRegionIds: readonly string[];
  leverageType:
    | "coordination_recovery"
    | "pressure_relief"
    | "resilience_amplification"
    | "equilibrium_restoration"
    | "trust_stabilization";
  leverageStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface PredictiveStabilizationRecord {
  recordId: string;
  regionId: string;
  stabilizationType: "flow_recovery" | "momentum_alignment" | "divergence_reduction" | "cascade_dampening";
  stabilizationPotential: number;
  explanation: string;
}

export interface PredictiveRecoveryOpportunityState {
  activeRecoverySignals: readonly RecoveryOpportunitySignal[];
  recoveryLeveragePointRecords: readonly RecoveryLeveragePointRecord[];
  predictiveStabilizationRecords: readonly PredictiveStabilizationRecord[];
  stabilizationOpportunityZones: readonly string[];
  fragileRecoveryZones: readonly string[];
  resilienceAccelerationZones: readonly string[];
  recoveryAccelerationScore: number;
  stabilizationPotentialScore: number;
  recoveryOpportunityLabel: "emerging" | "stabilizing" | "accelerating" | "fragile" | "limited";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveRecoveryOpportunitySemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  leverageSummaries: readonly string[];
  stabilizationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface PredictiveRecoveryOpportunitySnapshot {
  recoveryOpportunityStateId: string;
  topologyId: string;
  cascadeStateId?: string;
  tick: number;
  state: PredictiveRecoveryOpportunityState;
  semantics: ExecutiveRecoveryOpportunitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future recovery opportunity UI contract (no rendering in D7:4:5). */
export interface RecoveryOpportunityPanelContract {
  recoveryOpportunityStateId: string;
  topologyId: string;
  recoveryAccelerationScore: number;
  recoveryOpportunityLabel: PredictiveRecoveryOpportunityState["recoveryOpportunityLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly RecoveryOpportunityPanelSignalRow[];
  leverageSummaries: readonly string[];
  headline: string;
  viewHint:
    | "recovery_opportunity_overlay"
    | "stabilization_leverage_heatmap"
    | "predictive_recovery_dashboard"
    | "executive_recovery_timeline"
    | "resilience_opportunity_panel";
}

export interface RecoveryOpportunityPanelSignalRow {
  signalId: string;
  label: string;
  opportunityState: RecoveryOpportunitySignalState;
  opportunityStrength: number;
}

export interface SimulationRecoveryOpportunityContext {
  tick?: number;
  interventionLeverageFactor?: number;
  stabilizationStressFactor?: number;
}

export interface EvaluateRecoveryOpportunitiesInput {
  topology: OperationalUniverseTopology;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  simulationEvents?: readonly SimulationEvent[];
  recoveryOpportunityContext?: SimulationRecoveryOpportunityContext;
  tick?: number;
  recoveryOpportunityStateId?: string;
  priorRecoveryOpportunityFingerprints?: readonly string[];
}

export type EvaluateRecoveryOpportunitiesResult =
  | {
      ok: true;
      snapshot: PredictiveRecoveryOpportunitySnapshot;
      panelContract: RecoveryOpportunityPanelContract;
    }
  | { ok: false; guard: RecoveryOpportunityGuardResult };
