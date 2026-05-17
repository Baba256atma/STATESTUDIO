/**
 * D7:3:1 — Strategic human actor simulation contracts.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { ActorGuardResult } from "./actorGuards.ts";

export type StrategicHumanActorRole =
  | "executive"
  | "manager"
  | "operator"
  | "stakeholder"
  | "coordinator";

export interface StrategicHumanActor {
  actorId: string;
  displayLabel: string;
  role: StrategicHumanActorRole;
  assignedRegionIds: readonly string[];
  influenceLevel: number;
  coordinationContribution: number;
  operationalParticipation: number;
}

export interface ActorRoleParticipation {
  participationId: string;
  actorId: string;
  role: StrategicHumanActorRole;
  regionId: string;
  participationIntensity: number;
  coordinationEffect: number;
  explanation: string;
}

export interface ActorSystemRelationship {
  relationshipId: string;
  actorId: string;
  regionId: string;
  influenceType:
    | "strategic_oversight"
    | "operational_coordination"
    | "recovery_support"
    | "stakeholder_alignment"
    | "flow_coordination";
  influenceStrength: number;
  explanation: string;
}

export interface HumanActorSimulationState {
  activeActors: readonly StrategicHumanActor[];
  roleParticipations: readonly ActorRoleParticipation[];
  actorSystemRelationships: readonly ActorSystemRelationship[];
  coordinationPressure: number;
  organizationalAlignmentScore: number;
  actorParticipationIntensity: number;
  coordinationQualityLabel: "aligned" | "strained" | "fragmented";
}

export interface ExecutiveActorSemantics {
  headline: string;
  summary: string;
  participationSummaries: readonly string[];
  coordinationSummaries: readonly string[];
  relationshipSummaries: readonly string[];
  bullets: readonly string[];
}

export interface HumanActorParticipationSnapshot {
  actorStateId: string;
  topologyId: string;
  tick: number;
  state: HumanActorSimulationState;
  semantics: ExecutiveActorSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future human actor UI contract (no rendering in D7:3:1). */
export interface ActorPanelContract {
  actorStateId: string;
  topologyId: string;
  coordinationPressure: number;
  organizationalAlignmentScore: number;
  coordinationQualityLabel: HumanActorSimulationState["coordinationQualityLabel"];
  actors: readonly ActorPanelRow[];
  headline: string;
  viewHint:
    | "actor_coordination_overlay"
    | "executive_participation_panel"
    | "interaction_map"
    | "stakeholder_influence_dashboard"
    | "coordination_heatmap";
}

export interface ActorPanelRow {
  actorId: string;
  label: string;
  role: StrategicHumanActorRole;
  influenceLevel: number;
  regionCount: number;
}

export interface ActorParticipationContext {
  tick?: number;
  coordinationLoadFactor?: number;
}

export interface EvaluateHumanActorParticipationInput {
  topology: OperationalUniverseTopology;
  actors?: readonly StrategicHumanActor[];
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
  recoveryState?: OrganizationalRecoveryState;
  simulationEvents?: readonly SimulationEvent[];
  participationContext?: ActorParticipationContext;
  tick?: number;
  actorStateId?: string;
  priorActorFingerprints?: readonly string[];
}

export type EvaluateHumanActorParticipationResult =
  | { ok: true; snapshot: HumanActorParticipationSnapshot; panelContract: ActorPanelContract }
  | { ok: false; guard: ActorGuardResult };
