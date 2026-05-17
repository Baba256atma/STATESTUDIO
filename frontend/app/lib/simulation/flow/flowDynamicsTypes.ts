/**
 * D7:2:2 — Organizational flow dynamics contracts.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { FlowGuardResult } from "./flowGuards.ts";

export type OrganizationalFlowType =
  | "resource"
  | "financial"
  | "information"
  | "operational"
  | "strategic";

export interface OrganizationalFlow {
  flowId: string;
  sourceRegionId: string;
  targetRegionId: string;
  flowType: OrganizationalFlowType;
  intensity: number;
  throughput?: number;
  pressureContribution?: number;
  executiveLabel?: string;
}

export interface RegionFlowPressure {
  regionId: string;
  inboundIntensity: number;
  outboundIntensity: number;
  netPressure: number;
  congestionScore: number;
}

export interface OperationalBottleneck {
  bottleneckId: string;
  regionId: string;
  severity: "moderate" | "high" | "critical";
  reason: string;
  contributingFlowIds: readonly string[];
}

export interface OrganizationalFlowState {
  activeFlows: readonly OrganizationalFlow[];
  bottleneckRegions: readonly string[];
  bottlenecks: readonly OperationalBottleneck[];
  regionPressures: readonly RegionFlowPressure[];
  flowPressureScore: number;
  operationalMomentum: number;
  momentumLabel: "healthy" | "strained" | "unstable";
}

export interface ExecutiveFlowSemantics {
  headline: string;
  summary: string;
  bottleneckSummaries: readonly string[];
  flowSummaries: readonly string[];
  bullets: readonly string[];
}

export interface OrganizationalFlowSnapshot {
  flowStateId: string;
  topologyId: string;
  tick: number;
  state: OrganizationalFlowState;
  semantics: ExecutiveFlowSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future flow UI contract (no rendering in D7:2:2). */
export interface FlowPanelContract {
  flowStateId: string;
  topologyId: string;
  flowPressureScore: number;
  operationalMomentum: number;
  momentumLabel: OrganizationalFlowState["momentumLabel"];
  flows: readonly FlowPanelFlowRow[];
  bottlenecks: readonly FlowPanelBottleneckRow[];
  headline: string;
  viewHint: "circulation_map" | "bottleneck_heatmap" | "throughput_dashboard" | "flow_pressure";
}

export interface FlowPanelFlowRow {
  flowId: string;
  sourceLabel: string;
  targetLabel: string;
  flowType: OrganizationalFlowType;
  intensity: number;
}

export interface FlowPanelBottleneckRow {
  regionId: string;
  label: string;
  severity: OperationalBottleneck["severity"];
  reason: string;
}

export interface RegionFlowMetrics {
  fragility?: number;
  operationalLoad?: number;
  throughput?: number;
  recoveryCapacity?: number;
}

export interface CalculateOrganizationalFlowsInput {
  topology: OperationalUniverseTopology;
  regionMetrics?: Readonly<Record<string, RegionFlowMetrics>>;
  simulationEvents?: readonly SimulationEvent[];
  tick?: number;
  flowStateId?: string;
  priorFlowFingerprints?: readonly string[];
}

export type CalculateOrganizationalFlowsResult =
  | { ok: true; snapshot: OrganizationalFlowSnapshot; panelContract: FlowPanelContract }
  | { ok: false; guard: FlowGuardResult };
