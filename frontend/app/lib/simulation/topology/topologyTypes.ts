/**
 * D7:2:1 — Operational universe topology contracts.
 */

import type { TopologyGuardResult } from "./topologyGuards.ts";

export type OperationalDomainClass =
  | "executive"
  | "operational"
  | "infrastructure"
  | "strategic"
  | "financial"
  | "external_dependency"
  | "unclassified";

export type OperationalRelationshipType =
  | "dependency"
  | "resource_flow"
  | "financial_flow"
  | "operational_support"
  | "risk_exposure";

export interface TopologyObjectInput {
  objectId: string;
  label?: string;
  domain?: string;
  category?: string;
  role?: string;
  tags?: readonly string[];
  dependencies?: readonly string[];
  fragilityScore?: number;
}

export interface OperationalRegion {
  regionId: string;
  label: string;
  objectIds: readonly string[];
  operationalRole?: string;
  domainClass: OperationalDomainClass;
  fragilityScore?: number;
  executiveSummary?: string;
}

export interface OperationalRelationship {
  relationshipId: string;
  sourceRegionId: string;
  targetRegionId: string;
  relationshipType: OperationalRelationshipType;
  intensity: number;
  sourceObjectIds?: readonly string[];
  targetObjectIds?: readonly string[];
  executiveLabel?: string;
}

export interface CrossDomainDependencyChannel {
  channelId: string;
  fromRegionId: string;
  toRegionId: string;
  dependencyCount: number;
  averageIntensity: number;
  fragilityTransmissionScore: number;
  objectPairs: readonly string[];
}

export interface OperationalUniverseTopology {
  topologyId: string;
  createdAt: string;
  operationalRegions: readonly OperationalRegion[];
  crossDomainRelationships: readonly OperationalRelationship[];
  dependencyChannels: readonly CrossDomainDependencyChannel[];
  objectToRegionId: Readonly<Record<string, string>>;
  fingerprint: string;
}

export interface TopologyObjectClassification {
  objectId: string;
  regionId: string;
  domainClass: OperationalDomainClass;
  confidence: number;
  rationale: string;
}

export interface ExecutiveTopologySemantics {
  universeHeadline: string;
  regionSummaries: readonly string[];
  dependencySummaries: readonly string[];
  strategicBullets: readonly string[];
}

export interface OperationalUniverseTopologySnapshot {
  topology: OperationalUniverseTopology;
  classifications: readonly TopologyObjectClassification[];
  semantics: ExecutiveTopologySemantics;
  builtAt: string;
}

/** Future topology UI contract (no rendering in D7:2:1). */
export interface TopologyPanelContract {
  topologyId: string;
  regionCount: number;
  relationshipCount: number;
  regions: readonly TopologyPanelRegionRow[];
  relationships: readonly TopologyPanelRelationshipRow[];
  headline: string;
  viewHint: "universe_map" | "dependency_panel" | "region_navigation" | "fragility_heatmap";
}

export interface TopologyPanelRegionRow {
  regionId: string;
  label: string;
  objectCount: number;
  fragilityScore: number;
  domainClass: OperationalDomainClass;
  summary: string;
}

export interface TopologyPanelRelationshipRow {
  relationshipId: string;
  sourceLabel: string;
  targetLabel: string;
  relationshipType: OperationalRelationshipType;
  intensity: number;
  executiveLabel: string;
}

export interface BuildOperationalUniverseTopologyInput {
  topologyId?: string;
  objects: readonly TopologyObjectInput[];
  explicitRelationships?: readonly Omit<OperationalRelationship, "relationshipId" | "executiveLabel">[];
  regionOverrides?: Readonly<Record<string, string>>;
  simulationMetrics?: Readonly<Record<string, { fragility?: number; operationalLoad?: number }>>;
  priorTopologyFingerprints?: readonly string[];
}

export type BuildOperationalUniverseTopologyResult =
  | { ok: true; snapshot: OperationalUniverseTopologySnapshot; panelContract: TopologyPanelContract }
  | { ok: false; guard: TopologyGuardResult };
