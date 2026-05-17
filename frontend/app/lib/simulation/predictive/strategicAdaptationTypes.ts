/**
 * D7:4:7 — Predictive strategic adaptation contracts.
 */

import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
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
import type { AdaptationGuardResult } from "./adaptationGuards.ts";

export type StrategicAdaptationSignalState =
  | "emerging"
  | "adaptive"
  | "flexible"
  | "strained"
  | "critical";

export interface StrategicAdaptationSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  adaptationState: StrategicAdaptationSignalState;
  adaptationStrength: number;
  dominantAdaptationDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface ResilienceFlexibilityRecord {
  recordId: string;
  regionId: string;
  flexibilityType:
    | "coordination_flexibility"
    | "operational_flexibility"
    | "recovery_adaptation"
    | "resilience_restructuring"
    | "equilibrium_adaptation";
  flexibilityStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface PredictiveAdaptationPathwayRecord {
  recordId: string;
  pathwayId: string;
  originRegionId: string;
  targetRegionIds: readonly string[];
  pathwayType: "pressure_response" | "recovery_adaptation" | "flexibility_shift" | "survivability";
  pathwayStrength: number;
  explanation: string;
}

export interface PredictiveStrategicAdaptationState {
  activeAdaptationSignals: readonly StrategicAdaptationSignal[];
  resilienceFlexibilityRecords: readonly ResilienceFlexibilityRecord[];
  predictiveAdaptationPathwayRecords: readonly PredictiveAdaptationPathwayRecord[];
  strategicFlexibilityZones: readonly string[];
  adaptationFragilityZones: readonly string[];
  transformationBottleneckZones: readonly string[];
  adaptiveResilienceScore: number;
  strategicFlexibilityScore: number;
  adaptationFragilityScore: number;
  predictiveAdaptationLabel: "emerging" | "adaptive" | "flexible" | "strained" | "critical";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveStrategicAdaptationSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  flexibilitySummaries: readonly string[];
  pathwaySummaries: readonly string[];
  bullets: readonly string[];
}

export interface PredictiveStrategicAdaptationSnapshot {
  adaptationStateId: string;
  topologyId: string;
  preventionStateId?: string;
  tick: number;
  state: PredictiveStrategicAdaptationState;
  semantics: ExecutiveStrategicAdaptationSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic adaptation UI contract (no rendering in D7:4:7). */
export interface AdaptationPanelContract {
  adaptationStateId: string;
  topologyId: string;
  adaptiveResilienceScore: number;
  predictiveAdaptationLabel: PredictiveStrategicAdaptationState["predictiveAdaptationLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly AdaptationPanelSignalRow[];
  pathwaySummaries: readonly string[];
  headline: string;
  viewHint:
    | "adaptation_overlay"
    | "strategic_flexibility_heatmap"
    | "adaptive_recovery_dashboard"
    | "executive_adaptation_timeline"
    | "resilience_transformation_panel";
}

export interface AdaptationPanelSignalRow {
  signalId: string;
  label: string;
  adaptationState: StrategicAdaptationSignalState;
  adaptationStrength: number;
}

export interface SimulationStrategicAdaptationContext {
  tick?: number;
  adaptationLeverageFactor?: number;
  rigidityStressFactor?: number;
}

export interface EvaluateStrategicAdaptationInput {
  topology: OperationalUniverseTopology;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  alignmentState?: OrganizationalAlignmentDriftState;
  leadershipState?: LeadershipDynamicsState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  simulationEvents?: readonly SimulationEvent[];
  adaptationContext?: SimulationStrategicAdaptationContext;
  tick?: number;
  adaptationStateId?: string;
  priorAdaptationFingerprints?: readonly string[];
}

export type EvaluateStrategicAdaptationResult =
  | {
      ok: true;
      snapshot: PredictiveStrategicAdaptationSnapshot;
      panelContract: AdaptationPanelContract;
    }
  | { ok: false; guard: AdaptationGuardResult };
