/**
 * DS:5:5 — KPI Dependency Intelligence Engine contract.
 *
 * Read-only dependency profile for KPI business dependencies.
 */

import type { KpiImpactProfile } from "./kpiImpactContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

export const KPI_DEPENDENCY_ENGINE_DIAGNOSTIC = "[KPI_DEPENDENCY_ENGINE]" as const;

export const KPI_DEPENDENCY_UPDATED_DIAGNOSTIC = "[KPI_DEPENDENCY_UPDATED]" as const;

export const KPI_DEPENDENCY_ENGINE_VERSION = "5.5.0" as const;

export type KpiDependencyLevel = "Independent" | "Dependent" | "Highly Dependent" | "Critical Dependency";

export type KpiDependencyProfile = Readonly<{
  kpiId: string;
  label: string;
  dependencyScore: number;
  dependencyLevel: KpiDependencyLevel;
  dependencyCount: number;
  sourceProfile?: KpiIntelligenceProfile;
  impactProfile?: KpiImpactProfile;
}>;

export type KpiDependencyRegistry = Readonly<{
  version: typeof KPI_DEPENDENCY_ENGINE_VERSION;
  profiles: readonly KpiDependencyProfile[];
  dependencyByKpiId: Readonly<Record<string, KpiDependencyProfile>>;
  kpiCount: number;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof KPI_DEPENDENCY_ENGINE_DIAGNOSTIC,
    typeof KPI_DEPENDENCY_UPDATED_DIAGNOSTIC,
  ];
}>;

export type KpiDependencyBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  profiles?: readonly KpiIntelligenceProfile[];
  impactProfiles?: readonly KpiImpactProfile[];
}>;

export const KPI_DEPENDENCY_DIAGNOSTICS = Object.freeze([
  KPI_DEPENDENCY_ENGINE_DIAGNOSTIC,
  KPI_DEPENDENCY_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_DEPENDENCY_REGISTRY: KpiDependencyRegistry = Object.freeze({
  version: KPI_DEPENDENCY_ENGINE_VERSION,
  profiles: Object.freeze([]),
  dependencyByKpiId: Object.freeze({}),
  kpiCount: 0,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  diagnostics: KPI_DEPENDENCY_DIAGNOSTICS,
});
