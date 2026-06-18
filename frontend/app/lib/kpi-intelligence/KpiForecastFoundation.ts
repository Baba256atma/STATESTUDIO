import { buildKpiIntelligenceRegistry } from "./KpiIntelligenceRuntime.ts";
import { buildKpiTrendRegistry } from "./KpiTrendEngine.ts";
import {
  EMPTY_KPI_FORECAST_FOUNDATION_REGISTRY,
  KPI_FORECAST_DIAGNOSTICS,
  KPI_FORECAST_FOUNDATION_VERSION,
  type KpiForecastFoundationBuildInput,
  type KpiForecastFoundationProfile,
  type KpiForecastFoundationRegistry,
  type KpiForecastScenarioInput,
  type KpiFutureProjectionSlot,
  type KpiTrendContinuationInput,
} from "./kpiForecastFoundationContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";
import type { KpiTrendProfile } from "./kpiTrendContract.ts";

let latestKpiForecastFoundationRegistry: KpiForecastFoundationRegistry =
  EMPTY_KPI_FORECAST_FOUNDATION_REGISTRY;

function byKpiId<T extends { kpiId: string }>(profiles: readonly T[]): Readonly<Record<string, T>> {
  return Object.freeze(
    profiles.reduce<Record<string, T>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );
}

function projectionSlots(profile: KpiIntelligenceProfile): readonly KpiFutureProjectionSlot[] {
  return Object.freeze(
    (["short", "medium", "long"] as const).map((horizon) =>
      Object.freeze({
        kpiId: profile.kpiId,
        label: profile.label,
        horizon,
        projectionReady: true,
        predictedValue: null,
      })
    )
  );
}

function trendContinuation(profile: KpiTrendProfile | undefined): KpiTrendContinuationInput | undefined {
  if (!profile) return undefined;
  return Object.freeze({
    kpiId: profile.kpiId,
    trendDirection: profile.trendDirection,
    trendStrength: profile.trendStrength,
    continuationReady: true,
  });
}

function scenarioInputsForKpi(
  kpiId: string,
  scenarioInputs: readonly KpiForecastScenarioInput[]
): readonly KpiForecastScenarioInput[] {
  return Object.freeze(
    scenarioInputs.map((scenario) =>
      Object.freeze({
        scenarioId: scenario.scenarioId,
        label: scenario.label,
        assumptions: Object.freeze({ ...scenario.assumptions, kpiId }),
      })
    )
  );
}

export function buildKpiForecastFoundationRegistry(
  input: KpiForecastFoundationBuildInput = {}
): KpiForecastFoundationRegistry {
  const intelligenceProfiles =
    input.intelligenceProfiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const trendProfiles =
    input.trendProfiles ?? buildKpiTrendRegistry({ ...input, profiles: intelligenceProfiles }).profiles;
  const trendById = byKpiId<KpiTrendProfile>(trendProfiles);
  const scenarioInputs = input.scenarioInputs ?? Object.freeze([]);
  const profiles = Object.freeze(
    intelligenceProfiles.map((profile): KpiForecastFoundationProfile =>
      Object.freeze({
        kpiId: profile.kpiId,
        label: profile.label,
        futureProjections: projectionSlots(profile),
        trendContinuation: trendContinuation(trendById[profile.kpiId]),
        scenarioInputs: scenarioInputsForKpi(profile.kpiId, scenarioInputs),
        predictionActive: false,
        sourceProfile: profile,
      })
    )
  );
  const forecastByKpiId = Object.freeze(
    profiles.reduce<Record<string, KpiForecastFoundationProfile>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );

  latestKpiForecastFoundationRegistry = Object.freeze({
    version: KPI_FORECAST_FOUNDATION_VERSION,
    profiles,
    forecastByKpiId,
    kpiCount: profiles.length,
    foundationOnly: true,
    predictionActive: false,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: KPI_FORECAST_DIAGNOSTICS,
  });

  return latestKpiForecastFoundationRegistry;
}

export function getKpiForecastFoundationRegistry(): KpiForecastFoundationRegistry {
  return latestKpiForecastFoundationRegistry;
}

export function resetKpiForecastFoundationForTests(): void {
  latestKpiForecastFoundationRegistry = EMPTY_KPI_FORECAST_FOUNDATION_REGISTRY;
}

export const KpiForecastFoundation = Object.freeze({
  buildKpiForecastFoundationRegistry,
  getKpiForecastFoundationRegistry,
});
