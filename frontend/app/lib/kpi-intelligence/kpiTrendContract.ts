/**
 * DS:5:4 — KPI Trend Intelligence Engine contract.
 *
 * Read-only trend profile for KPI movement over time.
 */

import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

export const KPI_TREND_ENGINE_DIAGNOSTIC = "[KPI_TREND_ENGINE]" as const;

export const KPI_TREND_UPDATED_DIAGNOSTIC = "[KPI_TREND_UPDATED]" as const;

export const KPI_TREND_ENGINE_VERSION = "5.4.0" as const;

export type KpiTrendDirection = "Improving" | "Stable" | "Declining" | "Volatile";

export type KpiHistoricalSnapshot = Readonly<{
  kpiId: string;
  value: number;
  capturedAt?: string;
}>;

export type KpiTrendProfile = Readonly<{
  kpiId: string;
  label: string;
  trendDirection: KpiTrendDirection;
  trendStrength: number;
  snapshotCount: number;
  sourceProfile?: KpiIntelligenceProfile;
}>;

export type KpiTrendRegistry = Readonly<{
  version: typeof KPI_TREND_ENGINE_VERSION;
  profiles: readonly KpiTrendProfile[];
  trendByKpiId: Readonly<Record<string, KpiTrendProfile>>;
  kpiCount: number;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof KPI_TREND_ENGINE_DIAGNOSTIC,
    typeof KPI_TREND_UPDATED_DIAGNOSTIC,
  ];
}>;

export type KpiTrendBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  profiles?: readonly KpiIntelligenceProfile[];
  historicalSnapshots?: readonly KpiHistoricalSnapshot[];
}>;

export const KPI_TREND_DIAGNOSTICS = Object.freeze([
  KPI_TREND_ENGINE_DIAGNOSTIC,
  KPI_TREND_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_TREND_REGISTRY: KpiTrendRegistry = Object.freeze({
  version: KPI_TREND_ENGINE_VERSION,
  profiles: Object.freeze([]),
  trendByKpiId: Object.freeze({}),
  kpiCount: 0,
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  diagnostics: KPI_TREND_DIAGNOSTICS,
});
