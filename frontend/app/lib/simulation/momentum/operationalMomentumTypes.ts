/**
 * D7:2:6 — Enterprise operational momentum contracts.
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { MomentumGuardResult } from "./momentumGuards.ts";

export type MomentumDirection =
  | "stabilizing"
  | "accelerating"
  | "degrading"
  | "recovering"
  | "stagnating";

export interface OperationalMomentumSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  momentumDirection: MomentumDirection;
  intensity: number;
  executiveLabel?: string;
}

export interface RegionMomentumProfile {
  regionId: string;
  momentumVector: number;
  accelerationRate: number;
  degradationRate: number;
  inertiaScore: number;
  recoveryMomentum: number;
  stabilizationVelocity: number;
  drivers: readonly string[];
}

export interface MomentumPropagationRecord {
  recordId: string;
  originRegionId: string;
  affectedRegionId: string;
  propagatedDirection: MomentumDirection;
  propagatedIntensity: number;
  hopDepth: number;
  explanation: string;
}

export interface EnterpriseMomentumState {
  activeMomentumSignals: readonly OperationalMomentumSignal[];
  regionProfiles: readonly RegionMomentumProfile[];
  propagationRecords: readonly MomentumPropagationRecord[];
  organizationalMomentumScore: number;
  recoveryMomentumScore: number;
  organizationalInertiaScore: number;
  accelerationZones: readonly string[];
  degradationZones: readonly string[];
  stagnationZones: readonly string[];
  momentumTrendLabel: "stabilizing" | "stagnating" | "accelerating_failure" | "recovering";
}

export interface ExecutiveMomentumSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  propagationSummaries: readonly string[];
  zoneSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseMomentumSnapshot {
  momentumStateId: string;
  topologyId: string;
  recoveryStateId?: string;
  tick: number;
  state: EnterpriseMomentumState;
  semantics: ExecutiveMomentumSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future momentum UI contract (no rendering in D7:2:6). */
export interface MomentumPanelContract {
  momentumStateId: string;
  topologyId: string;
  organizationalMomentumScore: number;
  recoveryMomentumScore: number;
  momentumTrendLabel: EnterpriseMomentumState["momentumTrendLabel"];
  signals: readonly MomentumPanelSignalRow[];
  accelerationZones: readonly string[];
  degradationZones: readonly string[];
  headline: string;
  viewHint:
    | "momentum_overlay"
    | "velocity_dashboard"
    | "stabilization_trend_map"
    | "momentum_timeline"
    | "acceleration_heatmap";
}

export interface MomentumPanelSignalRow {
  signalId: string;
  label: string;
  momentumDirection: MomentumDirection;
  intensity: number;
}

export interface RegionMomentumMetrics {
  operationalLoad?: number;
  fragility?: number;
  recoveryCapacity?: number;
  coordinationLag?: number;
}

export interface SimulationMomentumContext {
  tick?: number;
  cumulativeStressFactor?: number;
  activeEventCount?: number;
  priorTickMomentumScore?: number;
}

export interface EvaluateOperationalMomentumInput {
  topology: OperationalUniverseTopology;
  recoveryState: OrganizationalRecoveryState;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionMomentumMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  simulationState?: SimulationMomentumContext;
  tick?: number;
  momentumStateId?: string;
  priorMomentumFingerprints?: readonly string[];
}

export type EvaluateOperationalMomentumResult =
  | { ok: true; snapshot: EnterpriseMomentumSnapshot; panelContract: MomentumPanelContract }
  | { ok: false; guard: MomentumGuardResult };
