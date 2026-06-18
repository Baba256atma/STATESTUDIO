/**
 * DS:5:2 — KPI Discovery Engine contract.
 *
 * Read-only discovery surface for KPI candidates found in data sources,
 * objects, and relationships.
 */

import type { KpiIntelligenceCategory } from "./kpiIntelligenceContract.ts";

export const KPI_DISCOVERY_ENGINE_DIAGNOSTIC = "[KPI_DISCOVERY_ENGINE]" as const;

export const KPI_DISCOVERY_COMPLETE_DIAGNOSTIC = "[KPI_DISCOVERY_COMPLETE]" as const;

export const KPI_DISCOVERY_ENGINE_VERSION = "5.2.0" as const;

export type DiscoveredKpiSource = "data_source" | "object" | "relationship";

export type DiscoveredKpi = Readonly<{
  kpiId: string;
  name: string;
  type: KpiIntelligenceCategory;
  source: DiscoveredKpiSource;
  sourceId: string;
  confidence: number;
}>;

export type DiscoveredKpiRegistry = Readonly<{
  version: typeof KPI_DISCOVERY_ENGINE_VERSION;
  discoveredKpis: readonly DiscoveredKpi[];
  discoveredKpiById: Readonly<Record<string, DiscoveredKpi>>;
  discoveredCount: number;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  relationshipMutation: false;
  diagnostics: readonly [
    typeof KPI_DISCOVERY_ENGINE_DIAGNOSTIC,
    typeof KPI_DISCOVERY_COMPLETE_DIAGNOSTIC,
  ];
}>;

export type KpiDiscoveryBuildInput = Readonly<{
  sceneJson?: unknown;
  dataSources?: readonly unknown[];
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
}>;

export const KPI_DISCOVERY_DIAGNOSTICS = Object.freeze([
  KPI_DISCOVERY_ENGINE_DIAGNOSTIC,
  KPI_DISCOVERY_COMPLETE_DIAGNOSTIC,
] as const);

export const EMPTY_DISCOVERED_KPI_REGISTRY: DiscoveredKpiRegistry = Object.freeze({
  version: KPI_DISCOVERY_ENGINE_VERSION,
  discoveredKpis: Object.freeze([]),
  discoveredKpiById: Object.freeze({}),
  discoveredCount: 0,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  relationshipMutation: false,
  diagnostics: KPI_DISCOVERY_DIAGNOSTICS,
});
