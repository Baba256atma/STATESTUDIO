/**
 * D7:4:2 — Multi-future divergence contracts.
 */

import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { DivergenceGuardResult } from "./divergenceGuards.ts";

export type FutureDivergenceSignalState =
  | "stable_split"
  | "volatile_split"
  | "converging"
  | "fragmenting"
  | "critical";

export interface FutureBranchRecord {
  branchId: string;
  branchLabel:
    | "stabilization"
    | "degradation"
    | "volatile_hybrid"
    | "recovery"
    | "equilibrium_drift";
  affectedRegionIds: readonly string[];
  branchStrength: number;
  explanation: string;
}

export interface FutureDivergenceSignal {
  signalId: string;
  futureBranchIds: readonly string[];
  divergenceState: FutureDivergenceSignalState;
  divergenceIntensity: number;
  dominantDivergenceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface DivergenceConvergenceRecord {
  recordId: string;
  sourceBranchId: string;
  targetBranchId: string;
  convergenceScore: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface StrategicFutureSeparationRecord {
  recordId: string;
  regionId: string;
  separationType: "stabilization_vs_degradation" | "recovery_vs_pressure" | "hybrid_volatility";
  separationStrength: number;
  branchIds: readonly string[];
  explanation: string;
}

export interface MultiFutureDivergenceState {
  activeDivergenceSignals: readonly FutureDivergenceSignal[];
  futureBranches: readonly FutureBranchRecord[];
  divergenceConvergenceRecords: readonly DivergenceConvergenceRecord[];
  strategicFutureSeparationRecords: readonly StrategicFutureSeparationRecord[];
  convergingFutureZones: readonly string[];
  fragmentedFutureZones: readonly string[];
  stabilizationFutureBranches: readonly string[];
  degradationFutureBranches: readonly string[];
  futureVolatilityScore: number;
  futureFragmentationScore: number;
  futureConvergenceScore: number;
  multiFutureDivergenceLabel:
    | "converging"
    | "stable_split"
    | "volatile_split"
    | "fragmenting"
    | "critical";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveDivergenceSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  branchSummaries: readonly string[];
  convergenceSummaries: readonly string[];
  separationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface MultiFutureDivergenceSnapshot {
  divergenceStateId: string;
  topologyId: string;
  trajectoryStateId?: string;
  tick: number;
  state: MultiFutureDivergenceState;
  semantics: ExecutiveDivergenceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future multi-future divergence UI contract (no rendering in D7:4:2). */
export interface DivergencePanelContract {
  divergenceStateId: string;
  topologyId: string;
  futureVolatilityScore: number;
  multiFutureDivergenceLabel: MultiFutureDivergenceState["multiFutureDivergenceLabel"];
  uncertaintyDisclaimer: string;
  branches: readonly DivergencePanelBranchRow[];
  divergenceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "multi_future_overlay"
    | "divergence_heatmap"
    | "future_branch_timeline"
    | "convergence_dashboard"
    | "executive_future_comparison_panel";
}

export interface DivergencePanelBranchRow {
  branchId: string;
  label: string;
  branchStrength: number;
}

export interface SimulationMultiFutureDivergenceContext {
  tick?: number;
  branchAmplificationFactor?: number;
  fragmentationStressFactor?: number;
}

export interface EvaluateFutureDivergenceInput {
  topology: OperationalUniverseTopology;
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  coordinationState?: ExecutiveCoordinationState;
  alignmentState?: OrganizationalAlignmentDriftState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  leadershipState?: LeadershipDynamicsState;
  simulationEvents?: readonly SimulationEvent[];
  divergenceContext?: SimulationMultiFutureDivergenceContext;
  tick?: number;
  divergenceStateId?: string;
  priorDivergenceFingerprints?: readonly string[];
}

export type EvaluateFutureDivergenceResult =
  | { ok: true; snapshot: MultiFutureDivergenceSnapshot; panelContract: DivergencePanelContract }
  | { ok: false; guard: DivergenceGuardResult };
