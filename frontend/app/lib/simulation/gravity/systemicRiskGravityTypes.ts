/**
 * D7:2:8 — Enterprise systemic risk gravity contracts.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { GravityGuardResult } from "./gravityGuards.ts";

export type SystemicGravityLevel = "low" | "moderate" | "high" | "critical";

export interface SystemicRiskGravityZone {
  zoneId: string;
  affectedRegionIds: readonly string[];
  gravityLevel: SystemicGravityLevel;
  averageGravityScore: number;
  peakGravityScore: number;
  dominantGravityDrivers: readonly string[];
  executiveLabel?: string;
}

export interface RegionGravityProfile {
  regionId: string;
  gravityScore: number;
  instabilityAttraction: number;
  dependencyCentrality: number;
  recoverySuppression: number;
  collapseConvergence: number;
  destabilizingInfluence: number;
  drivers: readonly string[];
}

export interface InstabilityAttractor {
  attractorId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  contributingZoneIds: readonly string[];
}

export interface CrossDomainGravityRecord {
  recordId: string;
  sourceRegionId: string;
  targetRegionId: string;
  sourceDomainClass: string;
  targetDomainClass: string;
  gravitationalPull: number;
  explanation: string;
}

export interface RiskConvergenceRecord {
  recordId: string;
  originRegionId: string;
  affectedRegionId: string;
  convergenceIntensity: number;
  hopDepth: number;
  explanation: string;
}

export interface EnterpriseRiskGravityState {
  gravityZones: readonly SystemicRiskGravityZone[];
  regionProfiles: readonly RegionGravityProfile[];
  instabilityAttractors: readonly InstabilityAttractor[];
  crossDomainRecords: readonly CrossDomainGravityRecord[];
  convergenceRecords: readonly RiskConvergenceRecord[];
  systemicCollapsePressure: number;
  gravityConvergenceScore: number;
  instabilityAttractorRegions: readonly string[];
  convergenceHotspots: readonly string[];
  recoverySuppressionZones: readonly string[];
  gravityRiskLabel: "contained" | "elevated" | "critical";
}

export interface ExecutiveGravitySemantics {
  headline: string;
  summary: string;
  zoneSummaries: readonly string[];
  attractorSummaries: readonly string[];
  convergenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseRiskGravitySnapshot {
  gravityStateId: string;
  topologyId: string;
  equilibriumStateId?: string;
  tick: number;
  state: EnterpriseRiskGravityState;
  semantics: ExecutiveGravitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future gravity UI contract (no rendering in D7:2:8). */
export interface GravityPanelContract {
  gravityStateId: string;
  topologyId: string;
  systemicCollapsePressure: number;
  gravityConvergenceScore: number;
  gravityRiskLabel: EnterpriseRiskGravityState["gravityRiskLabel"];
  zones: readonly GravityPanelZoneRow[];
  attractors: readonly GravityPanelAttractorRow[];
  headline: string;
  viewHint:
    | "gravity_heatmap"
    | "instability_attractor_overlay"
    | "collapse_dashboard"
    | "gravity_timeline"
    | "convergence_panel";
}

export interface GravityPanelZoneRow {
  zoneId: string;
  label: string;
  gravityLevel: SystemicGravityLevel;
  regionCount: number;
}

export interface GravityPanelAttractorRow {
  regionId: string;
  label: string;
  severity: InstabilityAttractor["severity"];
  reason: string;
}

export interface RegionGravityMetrics {
  fragility?: number;
  operationalLoad?: number;
  recoveryCapacity?: number;
  dependencyConcentration?: number;
}

export interface SimulationGravityContext {
  tick?: number;
  cumulativeStressFactor?: number;
}

export interface EvaluateSystemicRiskGravityInput {
  topology: OperationalUniverseTopology;
  equilibriumState: EnterpriseEquilibriumState;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionGravityMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  simulationState?: SimulationGravityContext;
  tick?: number;
  gravityStateId?: string;
  priorGravityFingerprints?: readonly string[];
}

export type EvaluateSystemicRiskGravityResult =
  | { ok: true; snapshot: EnterpriseRiskGravitySnapshot; panelContract: GravityPanelContract }
  | { ok: false; guard: GravityGuardResult };
