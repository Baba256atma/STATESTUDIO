/**
 * DS:5:6 — KPI Impact Intelligence Engine contract.
 *
 * Read-only executive impact profile for KPIs.
 */

import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

export const KPI_IMPACT_ENGINE_DIAGNOSTIC = "[KPI_IMPACT_ENGINE]" as const;

export const KPI_IMPACT_UPDATED_DIAGNOSTIC = "[KPI_IMPACT_UPDATED]" as const;

export const KPI_IMPACT_ENGINE_VERSION = "5.6.0" as const;

export type KpiImpactLevel = "Low" | "Medium" | "High" | "Critical";

export type KpiImpactFactors = Readonly<{
  businessInfluence: number;
  financialInfluence: number;
  operationalInfluence: number;
}>;

export type KpiImpactProfile = Readonly<{
  kpiId: string;
  label: string;
  impactScore: number;
  impactLevel: KpiImpactLevel;
  impactFactors: KpiImpactFactors;
  sourceProfile?: KpiIntelligenceProfile;
}>;

export type KpiImpactRegistry = Readonly<{
  version: typeof KPI_IMPACT_ENGINE_VERSION;
  profiles: readonly KpiImpactProfile[];
  impactByKpiId: Readonly<Record<string, KpiImpactProfile>>;
  kpiCount: number;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof KPI_IMPACT_ENGINE_DIAGNOSTIC,
    typeof KPI_IMPACT_UPDATED_DIAGNOSTIC,
  ];
}>;

export type KpiImpactBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  profiles?: readonly KpiIntelligenceProfile[];
}>;

export const KPI_IMPACT_DIAGNOSTICS = Object.freeze([
  KPI_IMPACT_ENGINE_DIAGNOSTIC,
  KPI_IMPACT_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_IMPACT_REGISTRY: KpiImpactRegistry = Object.freeze({
  version: KPI_IMPACT_ENGINE_VERSION,
  profiles: Object.freeze([]),
  impactByKpiId: Object.freeze({}),
  kpiCount: 0,
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  diagnostics: KPI_IMPACT_DIAGNOSTICS,
});
