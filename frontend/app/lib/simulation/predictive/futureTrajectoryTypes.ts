/**
 * D7:4:1 — Predictive future trajectory contracts.
 */

import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { TrajectoryGuardResult } from "./trajectoryGuards.ts";

export type FutureTrajectorySignalState =
  | "stabilizing"
  | "recovering"
  | "volatile"
  | "degrading"
  | "critical";

export interface FutureTrajectorySignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  trajectoryState: FutureTrajectorySignalState;
  directionalConfidence: number;
  dominantTrajectoryDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface TrajectoryDivergenceRecord {
  recordId: string;
  sourceDimension: string;
  targetDimension: string;
  divergenceScore: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface RecoveryDegradationTrendRecord {
  recordId: string;
  regionId: string;
  trendDirection: "recovery" | "degradation" | "mixed";
  trendStrength: number;
  explanation: string;
}

export interface PredictiveTrajectoryState {
  activeTrajectorySignals: readonly FutureTrajectorySignal[];
  trajectoryDivergenceRecords: readonly TrajectoryDivergenceRecord[];
  recoveryDegradationTrendRecords: readonly RecoveryDegradationTrendRecord[];
  degradationTrajectories: readonly string[];
  recoveryTrajectories: readonly string[];
  volatilityHotspots: readonly string[];
  futureStabilityScore: number;
  trajectoryVolatilityScore: number;
  trajectoryDivergenceScore: number;
  predictiveTrajectoryLabel: "stabilizing" | "recovering" | "volatile" | "degrading" | "critical";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveTrajectorySemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  divergenceSummaries: readonly string[];
  trendSummaries: readonly string[];
  bullets: readonly string[];
}

export interface PredictiveTrajectorySnapshot {
  trajectoryStateId: string;
  topologyId: string;
  resilienceStateId?: string;
  tick: number;
  state: PredictiveTrajectoryState;
  semantics: ExecutiveTrajectorySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future predictive trajectory UI contract (no rendering in D7:4:1). */
export interface TrajectoryPanelContract {
  trajectoryStateId: string;
  topologyId: string;
  futureStabilityScore: number;
  predictiveTrajectoryLabel: PredictiveTrajectoryState["predictiveTrajectoryLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly TrajectoryPanelSignalRow[];
  divergenceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "trajectory_overlay"
    | "predictive_timeline"
    | "future_volatility_dashboard"
    | "stabilization_degradation_heatmap"
    | "executive_trajectory_panel";
}

export interface TrajectoryPanelSignalRow {
  signalId: string;
  label: string;
  trajectoryState: FutureTrajectorySignalState;
  directionalConfidence: number;
}

export interface SimulationPredictiveTrajectoryContext {
  tick?: number;
  instabilityAccelerationFactor?: number;
  horizonStressFactor?: number;
}

export interface EvaluateFutureTrajectoriesInput {
  topology: OperationalUniverseTopology;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  alignmentState?: OrganizationalAlignmentDriftState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  simulationEvents?: readonly SimulationEvent[];
  predictiveContext?: SimulationPredictiveTrajectoryContext;
  tick?: number;
  trajectoryStateId?: string;
  priorTrajectoryFingerprints?: readonly string[];
}

export type EvaluateFutureTrajectoriesResult =
  | { ok: true; snapshot: PredictiveTrajectorySnapshot; panelContract: TrajectoryPanelContract }
  | { ok: false; guard: TrajectoryGuardResult };
