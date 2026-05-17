/**
 * D7:2:5 — Organizational recovery capacity contracts.
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { RecoveryGuardResult } from "./recoveryGuards.ts";

export type RecoveryCapacityLevel = "weak" | "limited" | "stable" | "strong";

export interface RecoveryCapacityZone {
  zoneId: string;
  affectedRegionIds: readonly string[];
  recoveryCapacity: RecoveryCapacityLevel;
  averageRecoveryScore: number;
  peakRecoveryScore: number;
  stabilizationDrivers: readonly string[];
  executiveLabel?: string;
}

export interface RegionRecoveryProfile {
  regionId: string;
  recoveryCapacityScore: number;
  stabilizationEfficiency: number;
  recoveryCoordination: number;
  adaptiveRecovery: number;
  recoveryThroughput: number;
  resilienceDegradation: number;
  drivers: readonly string[];
}

export interface RecoveryBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  contributingRegionIds: readonly string[];
}

export interface RecoveryPropagationRecord {
  recordId: string;
  originRegionId: string;
  affectedRegionId: string;
  propagationOutcome: "stabilization" | "strain";
  propagatedStrength: number;
  hopDepth: number;
  explanation: string;
}

export interface OrganizationalRecoveryState {
  recoveryZones: readonly RecoveryCapacityZone[];
  regionProfiles: readonly RegionRecoveryProfile[];
  recoveryBottlenecks: readonly RecoveryBottleneck[];
  propagationRecords: readonly RecoveryPropagationRecord[];
  resilienceScore: number;
  stabilizationPotential: number;
  recoveryThroughputScore: number;
  recoveryBottleneckRegions: readonly string[];
  resilienceLabel: "robust" | "strained" | "fragile";
}

export interface ExecutiveRecoverySemantics {
  headline: string;
  summary: string;
  zoneSummaries: readonly string[];
  bottleneckSummaries: readonly string[];
  propagationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface OrganizationalRecoverySnapshot {
  recoveryStateId: string;
  topologyId: string;
  fragilityMapId?: string;
  tick: number;
  state: OrganizationalRecoveryState;
  semantics: ExecutiveRecoverySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future recovery UI contract (no rendering in D7:2:5). */
export interface RecoveryPanelContract {
  recoveryStateId: string;
  topologyId: string;
  resilienceScore: number;
  stabilizationPotential: number;
  resilienceLabel: OrganizationalRecoveryState["resilienceLabel"];
  zones: readonly RecoveryPanelZoneRow[];
  bottlenecks: readonly RecoveryPanelBottleneckRow[];
  headline: string;
  viewHint:
    | "resilience_dashboard"
    | "recovery_heatmap"
    | "stabilization_overlay"
    | "recovery_timeline"
    | "resilience_panel";
}

export interface RecoveryPanelZoneRow {
  zoneId: string;
  label: string;
  recoveryCapacity: RecoveryCapacityLevel;
  regionCount: number;
}

export interface RecoveryPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: RecoveryBottleneck["severity"];
  reason: string;
}

export interface RegionRecoveryMetrics {
  recoveryCapacity?: number;
  operationalLoad?: number;
  fragility?: number;
  approvalDelay?: number;
  coordinationStrength?: number;
}

export interface SimulationRecoveryContext {
  tick?: number;
  cumulativeStressFactor?: number;
  activeEventCount?: number;
}

export interface EvaluateRecoveryCapacityInput {
  topology: OperationalUniverseTopology;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionRecoveryMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  simulationState?: SimulationRecoveryContext;
  tick?: number;
  recoveryStateId?: string;
  priorRecoveryFingerprints?: readonly string[];
}

export type EvaluateRecoveryCapacityResult =
  | { ok: true; snapshot: OrganizationalRecoverySnapshot; panelContract: RecoveryPanelContract }
  | { ok: false; guard: RecoveryGuardResult };
