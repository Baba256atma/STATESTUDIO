/**
 * D7:3:2 — Executive coordination dynamics contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { CoordinationGuardResult } from "./coordinationGuards.ts";

export type ExecutiveCoordinationStateLabel = "aligned" | "strained" | "fragmented" | "recovering";

export interface ExecutiveCoordinationSignal {
  signalId: string;
  participatingActorIds: readonly string[];
  coordinationState: ExecutiveCoordinationStateLabel;
  intensity: number;
  affectedRegionIds: readonly string[];
  executiveLabel?: string;
}

export interface CoordinationBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  participatingActorIds: readonly string[];
}

export interface CrossDomainSynchronizationRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  synchronizationQuality: number;
  frictionScore: number;
  participatingActorIds: readonly string[];
  explanation: string;
}

export interface ExecutiveCoordinationState {
  activeCoordinationSignals: readonly ExecutiveCoordinationSignal[];
  synchronizationRecords: readonly CrossDomainSynchronizationRecord[];
  coordinationBottlenecks: readonly CoordinationBottleneck[];
  alignmentZones: readonly string[];
  frictionZones: readonly string[];
  organizationalSynchronizationScore: number;
  coordinationFrictionScore: number;
  executiveAlignmentScore: number;
  coordinationDynamicsLabel: "synchronized" | "strained" | "fragmented" | "recovering";
}

export interface ExecutiveCoordinationSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  synchronizationSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveCoordinationSnapshot {
  coordinationStateId: string;
  topologyId: string;
  actorStateId?: string;
  tick: number;
  state: ExecutiveCoordinationState;
  semantics: ExecutiveCoordinationSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future coordination UI contract (no rendering in D7:3:2). */
export interface CoordinationPanelContract {
  coordinationStateId: string;
  topologyId: string;
  organizationalSynchronizationScore: number;
  executiveAlignmentScore: number;
  coordinationDynamicsLabel: ExecutiveCoordinationState["coordinationDynamicsLabel"];
  signals: readonly CoordinationPanelSignalRow[];
  bottlenecks: readonly CoordinationPanelBottleneckRow[];
  headline: string;
  viewHint:
    | "executive_coordination_overlay"
    | "synchronization_dashboard"
    | "alignment_heatmap"
    | "coordination_timeline"
    | "collaboration_panel";
}

export interface CoordinationPanelSignalRow {
  signalId: string;
  label: string;
  coordinationState: ExecutiveCoordinationStateLabel;
  intensity: number;
}

export interface CoordinationPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: CoordinationBottleneck["severity"];
  reason: string;
}

export interface SimulationCoordinationContext {
  tick?: number;
  communicationDelayFactor?: number;
}

export interface EvaluateExecutiveCoordinationInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  coordinationContext?: SimulationCoordinationContext;
  tick?: number;
  coordinationStateId?: string;
  priorCoordinationFingerprints?: readonly string[];
}

export type EvaluateExecutiveCoordinationResult =
  | { ok: true; snapshot: ExecutiveCoordinationSnapshot; panelContract: CoordinationPanelContract }
  | { ok: false; guard: CoordinationGuardResult };
