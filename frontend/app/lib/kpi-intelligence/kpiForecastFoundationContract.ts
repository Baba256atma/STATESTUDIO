/**
 * DS:5:8 — KPI Forecast Foundation contract.
 *
 * Forecast-ready structures for future projections, trend continuation, and
 * scenario forecasting inputs. No prediction authority.
 */

import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";
import type { KpiTrendProfile } from "./kpiTrendContract.ts";

export const KPI_FORECAST_FOUNDATION_DIAGNOSTIC = "[KPI_FORECAST_FOUNDATION]" as const;

export const KPI_FORECAST_READY_DIAGNOSTIC = "[KPI_FORECAST_READY]" as const;

export const KPI_FORECAST_FOUNDATION_VERSION = "5.8.0" as const;

export type KpiForecastScenarioInput = Readonly<{
  scenarioId: string;
  label: string;
  assumptions: Readonly<Record<string, unknown>>;
}>;

export type KpiFutureProjectionSlot = Readonly<{
  kpiId: string;
  label: string;
  horizon: "short" | "medium" | "long";
  projectionReady: true;
  predictedValue: null;
}>;

export type KpiTrendContinuationInput = Readonly<{
  kpiId: string;
  trendDirection: string;
  trendStrength: number;
  continuationReady: true;
}>;

export type KpiForecastFoundationProfile = Readonly<{
  kpiId: string;
  label: string;
  futureProjections: readonly KpiFutureProjectionSlot[];
  trendContinuation?: KpiTrendContinuationInput;
  scenarioInputs: readonly KpiForecastScenarioInput[];
  predictionActive: false;
  sourceProfile?: KpiIntelligenceProfile;
}>;

export type KpiForecastFoundationRegistry = Readonly<{
  version: typeof KPI_FORECAST_FOUNDATION_VERSION;
  profiles: readonly KpiForecastFoundationProfile[];
  forecastByKpiId: Readonly<Record<string, KpiForecastFoundationProfile>>;
  kpiCount: number;
  foundationOnly: true;
  predictionActive: false;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof KPI_FORECAST_FOUNDATION_DIAGNOSTIC,
    typeof KPI_FORECAST_READY_DIAGNOSTIC,
  ];
}>;

export type KpiForecastFoundationBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  intelligenceProfiles?: readonly KpiIntelligenceProfile[];
  trendProfiles?: readonly KpiTrendProfile[];
  scenarioInputs?: readonly KpiForecastScenarioInput[];
}>;

export const KPI_FORECAST_DIAGNOSTICS = Object.freeze([
  KPI_FORECAST_FOUNDATION_DIAGNOSTIC,
  KPI_FORECAST_READY_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_FORECAST_FOUNDATION_REGISTRY: KpiForecastFoundationRegistry =
  Object.freeze({
    version: KPI_FORECAST_FOUNDATION_VERSION,
    profiles: Object.freeze([]),
    forecastByKpiId: Object.freeze({}),
    kpiCount: 0,
    foundationOnly: true,
    predictionActive: false,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: KPI_FORECAST_DIAGNOSTICS,
  });
