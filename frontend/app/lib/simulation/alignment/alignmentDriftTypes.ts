/**
 * D7:3:7 — Organizational alignment drift contracts.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
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
import type { AlignmentGuardResult } from "./alignmentGuards.ts";

export type OrganizationalAlignmentSignalState = "aligned" | "drifting" | "fragmented" | "recovering";

export interface OrganizationalAlignmentSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  alignmentState: OrganizationalAlignmentSignalState;
  intensity: number;
  dominantAlignmentDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface DriftAccumulationRecord {
  recordId: string;
  regionId: string;
  driftScore: number;
  accumulationRate: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface AlignmentFragmentationBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  dominantDrivers: readonly string[];
}

export interface CrossDomainAlignmentRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  coherenceScore: number;
  divergenceScore: number;
  explanation: string;
}

export interface OrganizationalAlignmentDriftState {
  activeAlignmentSignals: readonly OrganizationalAlignmentSignal[];
  driftAccumulationRecords: readonly DriftAccumulationRecord[];
  alignmentFragmentationBottlenecks: readonly AlignmentFragmentationBottleneck[];
  crossDomainAlignmentRecords: readonly CrossDomainAlignmentRecord[];
  alignmentDriftZones: readonly string[];
  coherenceRecoveryZones: readonly string[];
  enterpriseAlignmentScore: number;
  alignmentDriftScore: number;
  strategicCoherenceLevel: number;
  alignmentDriftLabel: "coherent" | "drifting" | "fragmented" | "recovering";
}

export interface ExecutiveAlignmentSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  driftSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  crossDomainSummaries: readonly string[];
  bullets: readonly string[];
}

export interface OrganizationalAlignmentSnapshot {
  alignmentStateId: string;
  topologyId: string;
  leadershipStateId?: string;
  tick: number;
  state: OrganizationalAlignmentDriftState;
  semantics: ExecutiveAlignmentSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future alignment drift UI contract (no rendering in D7:3:7). */
export interface AlignmentPanelContract {
  alignmentStateId: string;
  topologyId: string;
  enterpriseAlignmentScore: number;
  strategicCoherenceLevel: number;
  alignmentDriftLabel: OrganizationalAlignmentDriftState["alignmentDriftLabel"];
  signals: readonly AlignmentPanelSignalRow[];
  bottlenecks: readonly AlignmentPanelBottleneckRow[];
  headline: string;
  viewHint:
    | "alignment_drift_overlay"
    | "strategic_coherence_dashboard"
    | "fragmentation_heatmap"
    | "executive_alignment_timeline"
    | "organizational_coherence_panel";
}

export interface AlignmentPanelSignalRow {
  signalId: string;
  label: string;
  alignmentState: OrganizationalAlignmentSignalState;
  intensity: number;
}

export interface AlignmentPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: AlignmentFragmentationBottleneck["severity"];
  reason: string;
}

export interface SimulationAlignmentContext {
  tick?: number;
  priorityFragmentationFactor?: number;
  coordinationDivergenceFactor?: number;
}

export interface EvaluateOrganizationalAlignmentInput {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
  simulationEvents?: readonly SimulationEvent[];
  alignmentContext?: SimulationAlignmentContext;
  tick?: number;
  alignmentStateId?: string;
  priorAlignmentFingerprints?: readonly string[];
}

export type EvaluateOrganizationalAlignmentResult =
  | { ok: true; snapshot: OrganizationalAlignmentSnapshot; panelContract: AlignmentPanelContract }
  | { ok: false; guard: AlignmentGuardResult };
