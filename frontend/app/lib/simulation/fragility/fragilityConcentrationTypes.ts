/**
 * D7:2:4 — Operational fragility concentration contracts.
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { FragilityGuardResult } from "./fragilityGuards.ts";

export type FragilityConcentrationLevel = "low" | "moderate" | "high" | "critical";

export interface FragilityConcentrationZone {
  zoneId: string;
  affectedRegionIds: readonly string[];
  concentrationLevel: FragilityConcentrationLevel;
  averageFragilityScore: number;
  peakFragilityScore: number;
  dominantFragilityDrivers: readonly string[];
  executiveLabel?: string;
}

export interface RegionFragilityProfile {
  regionId: string;
  fragilityScore: number;
  recoveryWeakness: number;
  dependencyOverload: number;
  propagationSusceptibility: number;
  resilienceReduction: number;
  drivers: readonly string[];
}

export interface CrossDomainVulnerabilityCorridor {
  corridorId: string;
  sourceRegionId: string;
  targetRegionId: string;
  sourceDomainClass: string;
  targetDomainClass: string;
  crossDomainExposure: number;
  explanation: string;
}

export interface OperationalFragilityMap {
  fragilityZones: readonly FragilityConcentrationZone[];
  regionProfiles: readonly RegionFragilityProfile[];
  vulnerabilityCorridors: readonly CrossDomainVulnerabilityCorridor[];
  systemicExposureScore: number;
  cascadePotentialScore: number;
  criticalRegions: readonly string[];
  concentrationHotspots: readonly string[];
  concentrationDensity: number;
  collapseRiskLabel: "contained" | "elevated" | "approaching";
}

export interface ExecutiveFragilitySemantics {
  headline: string;
  summary: string;
  zoneSummaries: readonly string[];
  corridorSummaries: readonly string[];
  criticalRegionSummaries: readonly string[];
  bullets: readonly string[];
}

export interface FragilityConcentrationSnapshot {
  fragilityMapId: string;
  topologyId: string;
  pressureStateId?: string;
  flowStateId?: string;
  tick: number;
  map: OperationalFragilityMap;
  semantics: ExecutiveFragilitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future fragility UI contract (no rendering in D7:2:4). */
export interface FragilityPanelContract {
  fragilityMapId: string;
  topologyId: string;
  systemicExposureScore: number;
  cascadePotentialScore: number;
  collapseRiskLabel: OperationalFragilityMap["collapseRiskLabel"];
  zones: readonly FragilityPanelZoneRow[];
  criticalRegions: readonly FragilityPanelRegionRow[];
  headline: string;
  viewHint:
    | "fragility_heatmap"
    | "systemic_exposure_overlay"
    | "vulnerability_dashboard"
    | "fragility_timeline"
    | "concentration_clusters";
}

export interface FragilityPanelZoneRow {
  zoneId: string;
  label: string;
  concentrationLevel: FragilityConcentrationLevel;
  regionCount: number;
}

export interface FragilityPanelRegionRow {
  regionId: string;
  label: string;
  fragilityScore: number;
}

export interface RegionFragilityMetrics {
  fragility?: number;
  operationalLoad?: number;
  recoveryCapacity?: number;
  approvalDelay?: number;
  dependencyConcentration?: number;
}

export interface SimulationFragilityContext {
  tick?: number;
  cumulativeStressFactor?: number;
  activeEventCount?: number;
}

export interface MapOperationalFragilityInput {
  topology: OperationalUniverseTopology;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionFragilityMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  simulationState?: SimulationFragilityContext;
  tick?: number;
  fragilityMapId?: string;
  priorFragilityFingerprints?: readonly string[];
}

export type MapOperationalFragilityResult =
  | { ok: true; snapshot: FragilityConcentrationSnapshot; panelContract: FragilityPanelContract }
  | { ok: false; guard: FragilityGuardResult };
