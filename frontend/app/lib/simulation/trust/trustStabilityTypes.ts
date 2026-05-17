/**
 * D7:3:5 — Organizational trust stability contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { TrustGuardResult } from "./trustGuards.ts";

export type OrganizationalTrustStateLabel =
  | "stable"
  | "strained"
  | "degrading"
  | "recovering"
  | "critical";

export interface OrganizationalTrustSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  trustState: OrganizationalTrustStateLabel;
  intensity: number;
  dominantTrustDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface CoordinationTrustRecord {
  recordId: string;
  regionId: string;
  coordinationTrustScore: number;
  confidenceStability: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface TrustStabilityBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  dominantDrivers: readonly string[];
}

export interface CrossDomainTrustRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  trustStabilityScore: number;
  fragilityScore: number;
  explanation: string;
}

export interface OrganizationalTrustState {
  activeTrustSignals: readonly OrganizationalTrustSignal[];
  coordinationTrustRecords: readonly CoordinationTrustRecord[];
  trustBottlenecks: readonly TrustStabilityBottleneck[];
  crossDomainTrustRecords: readonly CrossDomainTrustRecord[];
  trustFragilityZones: readonly string[];
  trustRecoveryZones: readonly string[];
  organizationalTrustScore: number;
  trustDegradationScore: number;
  trustRecoveryMomentum: number;
  trustStabilityLabel: "stable" | "strained" | "degrading" | "recovering" | "critical";
}

export interface ExecutiveTrustSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  coordinationTrustSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  crossDomainSummaries: readonly string[];
  bullets: readonly string[];
}

export interface OrganizationalTrustSnapshot {
  trustStateId: string;
  topologyId: string;
  influenceStateId?: string;
  tick: number;
  state: OrganizationalTrustState;
  semantics: ExecutiveTrustSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future trust stability UI contract (no rendering in D7:3:5). */
export interface TrustPanelContract {
  trustStateId: string;
  topologyId: string;
  organizationalTrustScore: number;
  trustStabilityLabel: OrganizationalTrustState["trustStabilityLabel"];
  signals: readonly TrustPanelSignalRow[];
  bottlenecks: readonly TrustPanelBottleneckRow[];
  headline: string;
  viewHint:
    | "trust_stability_overlay"
    | "organizational_confidence_dashboard"
    | "trust_fragility_heatmap"
    | "executive_trust_timeline"
    | "coordination_resilience_panel";
}

export interface TrustPanelSignalRow {
  signalId: string;
  label: string;
  trustState: OrganizationalTrustStateLabel;
  intensity: number;
}

export interface TrustPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: TrustStabilityBottleneck["severity"];
  reason: string;
}

export interface SimulationTrustContext {
  tick?: number;
  coordinationFailureFactor?: number;
  trustErosionFactor?: number;
}

export interface EvaluateOrganizationalTrustInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  simulationEvents?: readonly SimulationEvent[];
  trustContext?: SimulationTrustContext;
  tick?: number;
  trustStateId?: string;
  priorTrustFingerprints?: readonly string[];
}

export type EvaluateOrganizationalTrustResult =
  | { ok: true; snapshot: OrganizationalTrustSnapshot; panelContract: TrustPanelContract }
  | { ok: false; guard: TrustGuardResult };
