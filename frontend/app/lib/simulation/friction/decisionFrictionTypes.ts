/**
 * D7:3:3 — Organizational decision friction contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { FrictionGuardResult } from "./decisionFrictionGuards.ts";

export type DecisionFrictionStateLabel = "low" | "moderate" | "high" | "critical";

export interface DecisionFrictionSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  frictionState: DecisionFrictionStateLabel;
  intensity: number;
  dominantFrictionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface DecisionLatencyRecord {
  recordId: string;
  regionId: string;
  latencyScore: number;
  chainDepth: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface ExecutionResistanceBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  dominantDrivers: readonly string[];
}

export interface OrganizationalDragRecord {
  recordId: string;
  sourceDomain: string;
  targetDomain: string;
  dragLevel: number;
  systemicEffect: string;
  explanation: string;
}

export interface OrganizationalDecisionFrictionState {
  activeFrictionSignals: readonly DecisionFrictionSignal[];
  latencyRecords: readonly DecisionLatencyRecord[];
  executionResistanceBottlenecks: readonly ExecutionResistanceBottleneck[];
  dragRecords: readonly OrganizationalDragRecord[];
  frictionHotspots: readonly string[];
  resistanceZones: readonly string[];
  executionLatencyScore: number;
  organizationalDragLevel: number;
  strategicResistanceScore: number;
  decisionFrictionLabel: "fluid" | "moderate" | "elevated" | "critical";
}

export interface ExecutiveDecisionFrictionSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  latencySummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  dragSummaries: readonly string[];
  bullets: readonly string[];
}

export interface OrganizationalDecisionFrictionSnapshot {
  frictionStateId: string;
  topologyId: string;
  coordinationStateId?: string;
  tick: number;
  state: OrganizationalDecisionFrictionState;
  semantics: ExecutiveDecisionFrictionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future decision friction UI contract (no rendering in D7:3:3). */
export interface DecisionFrictionPanelContract {
  frictionStateId: string;
  topologyId: string;
  executionLatencyScore: number;
  organizationalDragLevel: number;
  decisionFrictionLabel: OrganizationalDecisionFrictionState["decisionFrictionLabel"];
  signals: readonly DecisionFrictionPanelSignalRow[];
  bottlenecks: readonly DecisionFrictionPanelBottleneckRow[];
  headline: string;
  viewHint:
    | "decision_friction_heatmap"
    | "execution_latency_overlay"
    | "organizational_drag_dashboard"
    | "executive_friction_timeline"
    | "approval_bottleneck_panel";
}

export interface DecisionFrictionPanelSignalRow {
  signalId: string;
  label: string;
  frictionState: DecisionFrictionStateLabel;
  intensity: number;
}

export interface DecisionFrictionPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: ExecutionResistanceBottleneck["severity"];
  reason: string;
}

export interface SimulationDecisionFrictionContext {
  tick?: number;
  approvalChainDelayFactor?: number;
  implementationDragFactor?: number;
}

export interface EvaluateDecisionFrictionInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  simulationEvents?: readonly SimulationEvent[];
  frictionContext?: SimulationDecisionFrictionContext;
  tick?: number;
  frictionStateId?: string;
  priorFrictionFingerprints?: readonly string[];
}

export type EvaluateDecisionFrictionResult =
  | { ok: true; snapshot: OrganizationalDecisionFrictionSnapshot; panelContract: DecisionFrictionPanelContract }
  | { ok: false; guard: FrictionGuardResult };
