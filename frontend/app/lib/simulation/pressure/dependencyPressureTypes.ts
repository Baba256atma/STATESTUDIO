/**
 * D7:2:3 — Enterprise dependency pressure contracts.
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { PressureGuardResult } from "./pressureGuards.ts";

export type DependencyPressureType =
  | "operational"
  | "resource"
  | "financial"
  | "approval"
  | "recovery"
  | "logistical";

export interface DependencyPressureSignal {
  signalId: string;
  sourceRegionId: string;
  targetRegionId: string;
  pressureType: DependencyPressureType;
  intensity: number;
  cascadeRisk?: number;
  propagationDepth?: number;
  executiveLabel?: string;
}

export interface RegionPressureAccumulation {
  regionId: string;
  accumulatedPressure: number;
  inboundPressure: number;
  dependencyConcentration: number;
  fragilityExposure: number;
}

export interface FragilityHotspot {
  hotspotId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  contributingSignalIds: readonly string[];
}

export interface PressurePropagationRecord {
  recordId: string;
  originRegionId: string;
  affectedRegionId: string;
  propagatedIntensity: number;
  hopDepth: number;
  pressureType: DependencyPressureType;
  explanation: string;
}

export interface EnterprisePressureState {
  activePressureSignals: readonly DependencyPressureSignal[];
  saturationRegions: readonly string[];
  fragilityHotspots: readonly FragilityHotspot[];
  regionAccumulations: readonly RegionPressureAccumulation[];
  propagationRecords: readonly PressurePropagationRecord[];
  systemicPressureScore: number;
  cascadeRiskScore: number;
  pressureStabilityLabel: "stable" | "elevated" | "critical";
}

export interface ExecutivePressureSemantics {
  headline: string;
  summary: string;
  saturationSummaries: readonly string[];
  hotspotSummaries: readonly string[];
  propagationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterprisePressureSnapshot {
  pressureStateId: string;
  topologyId: string;
  flowStateId?: string;
  tick: number;
  state: EnterprisePressureState;
  semantics: ExecutivePressureSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future pressure UI contract (no rendering in D7:2:3). */
export interface PressurePanelContract {
  pressureStateId: string;
  topologyId: string;
  systemicPressureScore: number;
  cascadeRiskScore: number;
  pressureStabilityLabel: EnterprisePressureState["pressureStabilityLabel"];
  signals: readonly PressurePanelSignalRow[];
  hotspots: readonly PressurePanelHotspotRow[];
  headline: string;
  viewHint:
    | "pressure_heatmap"
    | "dependency_stress_overlay"
    | "fragility_concentration"
    | "saturation_dashboard"
    | "pressure_timeline";
}

export interface PressurePanelSignalRow {
  signalId: string;
  sourceLabel: string;
  targetLabel: string;
  pressureType: DependencyPressureType;
  intensity: number;
}

export interface PressurePanelHotspotRow {
  regionId: string;
  label: string;
  severity: FragilityHotspot["severity"];
  reason: string;
}

export interface RegionPressureMetrics {
  fragility?: number;
  operationalLoad?: number;
  approvalDelay?: number;
  recoveryStrain?: number;
  dependencyConcentration?: number;
}

export interface SimulationPressureContext {
  tick?: number;
  activeEventCount?: number;
  cumulativeStressFactor?: number;
}

export interface EvaluateDependencyPressureInput {
  topology: OperationalUniverseTopology;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionPressureMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  simulationState?: SimulationPressureContext;
  tick?: number;
  pressureStateId?: string;
  priorPressureFingerprints?: readonly string[];
}

export type EvaluateDependencyPressureResult =
  | { ok: true; snapshot: EnterprisePressureSnapshot; panelContract: PressurePanelContract }
  | { ok: false; guard: PressureGuardResult };
