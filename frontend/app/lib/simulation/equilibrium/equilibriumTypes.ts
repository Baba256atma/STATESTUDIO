/**
 * D7:2:7 — Strategic operational equilibrium contracts.
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { EquilibriumGuardResult } from "./equilibriumGuards.ts";

export type EquilibriumState = "stable" | "strained" | "imbalanced" | "recovering" | "critical";

export interface OperationalEquilibriumSignal {
  signalId: string;
  affectedRegionIds: readonly string[];
  equilibriumState: EquilibriumState;
  intensity: number;
  executiveLabel?: string;
}

export interface RegionEquilibriumProfile {
  regionId: string;
  balanceScore: number;
  pressureRecoveryRatio: number;
  momentumAlignment: number;
  fragilityExposure: number;
  overextensionScore: number;
  driftVelocity: number;
  drivers: readonly string[];
}

export interface EquilibriumDriftRecord {
  recordId: string;
  regionId: string;
  driftDirection: "erosion" | "stabilization" | "neutral";
  driftMagnitude: number;
  explanation: string;
}

export interface CrossDomainEquilibriumRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  sourceDomainClass: string;
  targetDomainClass: string;
  balanceShift: number;
  explanation: string;
}

export interface EnterpriseEquilibriumState {
  activeEquilibriumSignals: readonly OperationalEquilibriumSignal[];
  regionProfiles: readonly RegionEquilibriumProfile[];
  driftRecords: readonly EquilibriumDriftRecord[];
  crossDomainRecords: readonly CrossDomainEquilibriumRecord[];
  equilibriumScore: number;
  balanceSustainabilityScore: number;
  instabilityDriftScore: number;
  stabilityZones: readonly string[];
  imbalanceZones: readonly string[];
  overextendedRegions: readonly string[];
  equilibriumLabel: "balanced" | "strained" | "critical_imbalance" | "recovering";
}

export interface ExecutiveEquilibriumSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  driftSummaries: readonly string[];
  crossDomainSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseEquilibriumSnapshot {
  equilibriumStateId: string;
  topologyId: string;
  momentumStateId?: string;
  tick: number;
  state: EnterpriseEquilibriumState;
  semantics: ExecutiveEquilibriumSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future equilibrium UI contract (no rendering in D7:2:7). */
export interface EquilibriumPanelContract {
  equilibriumStateId: string;
  topologyId: string;
  equilibriumScore: number;
  balanceSustainabilityScore: number;
  equilibriumLabel: EnterpriseEquilibriumState["equilibriumLabel"];
  signals: readonly EquilibriumPanelSignalRow[];
  imbalanceZones: readonly string[];
  stabilityZones: readonly string[];
  headline: string;
  viewHint:
    | "equilibrium_dashboard"
    | "balance_overlay"
    | "stability_heatmap"
    | "equilibrium_timeline"
    | "imbalance_panel";
}

export interface EquilibriumPanelSignalRow {
  signalId: string;
  label: string;
  equilibriumState: EquilibriumState;
  intensity: number;
}

export interface RegionEquilibriumMetrics {
  operationalLoad?: number;
  fragility?: number;
  recoveryCapacity?: number;
}

export interface SimulationEquilibriumContext {
  tick?: number;
  cumulativeStressFactor?: number;
  priorEquilibriumScore?: number;
}

export interface EvaluateOperationalEquilibriumInput {
  topology: OperationalUniverseTopology;
  momentumState: EnterpriseMomentumState;
  recoveryState: OrganizationalRecoveryState;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionEquilibriumMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  simulationState?: SimulationEquilibriumContext;
  tick?: number;
  equilibriumStateId?: string;
  priorEquilibriumFingerprints?: readonly string[];
}

export type EvaluateOperationalEquilibriumResult =
  | { ok: true; snapshot: EnterpriseEquilibriumSnapshot; panelContract: EquilibriumPanelContract }
  | { ok: false; guard: EquilibriumGuardResult };
