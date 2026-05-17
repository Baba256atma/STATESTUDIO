/**
 * D7:3:8 — Enterprise human-system resilience contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { HumanSystemResilienceGuardResult } from "./humanSystemResilienceGuards.ts";

export type HumanSystemResilienceSignalState =
  | "adaptive"
  | "stable"
  | "strained"
  | "fragile"
  | "recovering";

export interface HumanSystemResilienceSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  resilienceState: HumanSystemResilienceSignalState;
  intensity: number;
  dominantResilienceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface AdaptiveCoordinationRecord {
  recordId: string;
  regionId: string;
  adaptationScore: number;
  synchronizationQuality: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface ResilienceBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  dominantDrivers: readonly string[];
}

export interface CrossDomainResilienceRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  resilienceScore: number;
  fragilityScore: number;
  explanation: string;
}

export interface HumanSystemResilienceState {
  activeResilienceSignals: readonly HumanSystemResilienceSignal[];
  adaptiveCoordinationRecords: readonly AdaptiveCoordinationRecord[];
  resilienceBottlenecks: readonly ResilienceBottleneck[];
  crossDomainResilienceRecords: readonly CrossDomainResilienceRecord[];
  resilienceFragilityZones: readonly string[];
  adaptiveRecoveryZones: readonly string[];
  enterpriseResilienceScore: number;
  resilienceDegradationScore: number;
  humanSystemAdaptationLevel: number;
  resilienceStabilityLabel: "adaptive" | "stable" | "strained" | "fragile" | "recovering";
}

export interface ExecutiveResilienceSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  adaptationSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  crossDomainSummaries: readonly string[];
  bullets: readonly string[];
}

export interface HumanSystemResilienceSnapshot {
  resilienceStateId: string;
  topologyId: string;
  alignmentStateId?: string;
  tick: number;
  state: HumanSystemResilienceState;
  semantics: ExecutiveResilienceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future human-system resilience UI contract (no rendering in D7:3:8). */
export interface ResiliencePanelContract {
  resilienceStateId: string;
  topologyId: string;
  enterpriseResilienceScore: number;
  humanSystemAdaptationLevel: number;
  resilienceStabilityLabel: HumanSystemResilienceState["resilienceStabilityLabel"];
  signals: readonly ResiliencePanelSignalRow[];
  bottlenecks: readonly ResiliencePanelBottleneckRow[];
  headline: string;
  viewHint:
    | "resilience_overlay"
    | "adaptive_recovery_dashboard"
    | "resilience_fragility_heatmap"
    | "executive_resilience_timeline"
    | "human_system_recovery_panel";
}

export interface ResiliencePanelSignalRow {
  signalId: string;
  label: string;
  resilienceState: HumanSystemResilienceSignalState;
  intensity: number;
}

export interface ResiliencePanelBottleneckRow {
  regionId: string;
  label: string;
  severity: ResilienceBottleneck["severity"];
  reason: string;
}

export interface SimulationHumanSystemResilienceContext {
  tick?: number;
  resilienceFatigueFactor?: number;
  adaptationStressFactor?: number;
}

export interface EvaluateHumanSystemResilienceInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  alignmentState: OrganizationalAlignmentDriftState;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  simulationEvents?: readonly SimulationEvent[];
  resilienceContext?: SimulationHumanSystemResilienceContext;
  tick?: number;
  resilienceStateId?: string;
  priorResilienceFingerprints?: readonly string[];
}

export type EvaluateHumanSystemResilienceResult =
  | { ok: true; snapshot: HumanSystemResilienceSnapshot; panelContract: ResiliencePanelContract }
  | { ok: false; guard: HumanSystemResilienceGuardResult };
