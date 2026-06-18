/**
 * DS:5:3 — KPI Health Engine contract.
 *
 * Read-only health profile for KPI intelligence.
 */

import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

export const KPI_HEALTH_ENGINE_DIAGNOSTIC = "[KPI_HEALTH_ENGINE]" as const;

export const KPI_HEALTH_UPDATED_DIAGNOSTIC = "[KPI_HEALTH_UPDATED]" as const;

export const KPI_HEALTH_ENGINE_VERSION = "5.3.0" as const;

export type KpiHealthState = "Healthy" | "Stable" | "Warning" | "Critical";

export type KpiHealthThresholds = Readonly<{
  healthy: number;
  stable: number;
  warning: number;
}>;

export type KpiHealthProfile = Readonly<{
  kpiId: string;
  label: string;
  healthScore: number;
  healthState: KpiHealthState;
  thresholds: KpiHealthThresholds;
  sourceProfile?: KpiIntelligenceProfile;
}>;

export type KpiHealthRegistry = Readonly<{
  version: typeof KPI_HEALTH_ENGINE_VERSION;
  profiles: readonly KpiHealthProfile[];
  healthByKpiId: Readonly<Record<string, KpiHealthProfile>>;
  kpiCount: number;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof KPI_HEALTH_ENGINE_DIAGNOSTIC,
    typeof KPI_HEALTH_UPDATED_DIAGNOSTIC,
  ];
}>;

export type KpiHealthBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  profiles?: readonly KpiIntelligenceProfile[];
  thresholds?: Partial<KpiHealthThresholds>;
}>;

export const DEFAULT_KPI_HEALTH_THRESHOLDS: KpiHealthThresholds = Object.freeze({
  healthy: 80,
  stable: 60,
  warning: 40,
});

export const KPI_HEALTH_DIAGNOSTICS = Object.freeze([
  KPI_HEALTH_ENGINE_DIAGNOSTIC,
  KPI_HEALTH_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_HEALTH_REGISTRY: KpiHealthRegistry = Object.freeze({
  version: KPI_HEALTH_ENGINE_VERSION,
  profiles: Object.freeze([]),
  healthByKpiId: Object.freeze({}),
  kpiCount: 0,
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  diagnostics: KPI_HEALTH_DIAGNOSTICS,
});
