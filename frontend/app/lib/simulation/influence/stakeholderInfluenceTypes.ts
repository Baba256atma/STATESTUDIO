/**
 * D7:3:4 — Stakeholder influence propagation contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { InfluenceGuardResult } from "./influenceGuards.ts";

export type StakeholderInfluenceStateLabel = "supportive" | "neutral" | "strained" | "resistant";

export interface StakeholderInfluenceSignal {
  signalId: string;
  sourceActorIds: readonly string[];
  affectedRegionIds: readonly string[];
  influenceState: StakeholderInfluenceStateLabel;
  intensity: number;
  propagationDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface InfluencePropagationRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  propagationStrength: number;
  resistanceScore: number;
  participatingActorIds: readonly string[];
  explanation: string;
}

export interface InfluenceBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  sourceActorIds: readonly string[];
}

export interface StakeholderInfluenceState {
  activeInfluenceSignals: readonly StakeholderInfluenceSignal[];
  propagationRecords: readonly InfluencePropagationRecord[];
  influenceBottlenecks: readonly InfluenceBottleneck[];
  influenceHotspots: readonly string[];
  resistanceZones: readonly string[];
  alignmentZones: readonly string[];
  organizationalAlignmentLevel: number;
  influencePropagationScore: number;
  resistanceConcentrationScore: number;
  influenceStabilityLabel: "stable" | "strained" | "fragmented" | "resistant";
}

export interface ExecutiveInfluenceSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  propagationSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StakeholderInfluenceSnapshot {
  influenceStateId: string;
  topologyId: string;
  frictionStateId?: string;
  tick: number;
  state: StakeholderInfluenceState;
  semantics: ExecutiveInfluenceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future stakeholder influence UI contract (no rendering in D7:3:4). */
export interface InfluencePanelContract {
  influenceStateId: string;
  topologyId: string;
  organizationalAlignmentLevel: number;
  influencePropagationScore: number;
  influenceStabilityLabel: StakeholderInfluenceState["influenceStabilityLabel"];
  signals: readonly InfluencePanelSignalRow[];
  bottlenecks: readonly InfluencePanelBottleneckRow[];
  headline: string;
  viewHint:
    | "influence_propagation_overlay"
    | "stakeholder_alignment_dashboard"
    | "resistance_heatmap"
    | "executive_influence_timeline"
    | "organizational_trust_panel";
}

export interface InfluencePanelSignalRow {
  signalId: string;
  label: string;
  influenceState: StakeholderInfluenceStateLabel;
  intensity: number;
}

export interface InfluencePanelBottleneckRow {
  regionId: string;
  label: string;
  severity: InfluenceBottleneck["severity"];
  reason: string;
}

export interface SimulationInfluenceContext {
  tick?: number;
  propagationDelayFactor?: number;
  trustAttenuationFactor?: number;
}

export interface EvaluateStakeholderInfluenceInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  simulationEvents?: readonly SimulationEvent[];
  influenceContext?: SimulationInfluenceContext;
  tick?: number;
  influenceStateId?: string;
  priorInfluenceFingerprints?: readonly string[];
}

export type EvaluateStakeholderInfluenceResult =
  | { ok: true; snapshot: StakeholderInfluenceSnapshot; panelContract: InfluencePanelContract }
  | { ok: false; guard: InfluenceGuardResult };
