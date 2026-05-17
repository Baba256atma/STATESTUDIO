/**
 * D7:3:6 — Strategic leadership load dynamics contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { LeadershipGuardResult } from "./leadershipGuards.ts";

export type LeadershipLoadStateLabel = "balanced" | "elevated" | "strained" | "saturated";

export interface LeadershipLoadSignal {
  signalId: string;
  affectedActorIds: readonly string[];
  affectedRegionIds: readonly string[];
  leadershipLoadState: LeadershipLoadStateLabel;
  intensity: number;
  dominantLoadDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface ExecutiveBurdenRecord {
  recordId: string;
  actorId: string;
  regionIds: readonly string[];
  burdenScore: number;
  decisionResponsibilityLoad: number;
  explanation: string;
}

export interface LeadershipSaturationBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  affectedActorIds: readonly string[];
  dominantDrivers: readonly string[];
}

export interface CoordinationCapacityRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  capacityLevel: number;
  overloadRisk: number;
  explanation: string;
}

export interface LeadershipDynamicsState {
  activeLeadershipSignals: readonly LeadershipLoadSignal[];
  burdenRecords: readonly ExecutiveBurdenRecord[];
  leadershipSaturationBottlenecks: readonly LeadershipSaturationBottleneck[];
  coordinationCapacityRecords: readonly CoordinationCapacityRecord[];
  leadershipSaturationZones: readonly string[];
  executiveLoadBalanceScore: number;
  coordinationCapacityLevel: number;
  leadershipBurdenScore: number;
  leadershipDynamicsLabel: "balanced" | "elevated" | "strained" | "saturated";
}

export interface ExecutiveLeadershipSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  burdenSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  capacitySummaries: readonly string[];
  bullets: readonly string[];
}

export interface LeadershipDynamicsSnapshot {
  leadershipStateId: string;
  topologyId: string;
  trustStateId?: string;
  tick: number;
  state: LeadershipDynamicsState;
  semantics: ExecutiveLeadershipSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future leadership load UI contract (no rendering in D7:3:6). */
export interface LeadershipPanelContract {
  leadershipStateId: string;
  topologyId: string;
  executiveLoadBalanceScore: number;
  coordinationCapacityLevel: number;
  leadershipDynamicsLabel: LeadershipDynamicsState["leadershipDynamicsLabel"];
  signals: readonly LeadershipPanelSignalRow[];
  bottlenecks: readonly LeadershipPanelBottleneckRow[];
  headline: string;
  viewHint:
    | "leadership_load_overlay"
    | "executive_burden_dashboard"
    | "coordination_capacity_heatmap"
    | "leadership_stability_timeline"
    | "strategic_oversight_panel";
}

export interface LeadershipPanelSignalRow {
  signalId: string;
  label: string;
  leadershipLoadState: LeadershipLoadStateLabel;
  intensity: number;
}

export interface LeadershipPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: LeadershipSaturationBottleneck["severity"];
  reason: string;
}

export interface SimulationLeadershipContext {
  tick?: number;
  strategicBurdenFactor?: number;
  oversightConcentrationFactor?: number;
}

export interface EvaluateLeadershipDynamicsInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  simulationEvents?: readonly SimulationEvent[];
  leadershipContext?: SimulationLeadershipContext;
  tick?: number;
  leadershipStateId?: string;
  priorLeadershipFingerprints?: readonly string[];
}

export type EvaluateLeadershipDynamicsResult =
  | { ok: true; snapshot: LeadershipDynamicsSnapshot; panelContract: LeadershipPanelContract }
  | { ok: false; guard: LeadershipGuardResult };
