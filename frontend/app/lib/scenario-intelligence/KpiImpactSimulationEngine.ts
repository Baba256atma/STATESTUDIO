import { buildKpiIntelligenceRegistry } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { buildKpiHealthRegistry, calculateKpiHealthProfile } from "../kpi-intelligence/KpiHealthEngine.ts";
import { buildKpiTrendRegistry, calculateKpiTrendProfile } from "../kpi-intelligence/KpiTrendEngine.ts";
import {
  buildKpiImpactRegistry,
  calculateKpiImpactProfile,
} from "../kpi-intelligence/KpiImpactEngine.ts";
import { buildKpiForecastFoundationRegistry } from "../kpi-intelligence/KpiForecastFoundation.ts";
import type { KpiIntelligenceCategory, KpiIntelligenceProfile } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { KpiHistoricalSnapshot, KpiTrendDirection } from "../kpi-intelligence/kpiTrendContract.ts";
import { buildScenarioBlueprintRegistry } from "./ScenarioBuilderEngine.ts";
import {
  EMPTY_KPI_IMPACT_PROFILE_REGISTRY,
  KPI_IMPACT_SIMULATION_DIAGNOSTICS,
  KPI_IMPACT_SIMULATION_ENGINE_VERSION,
  type KpiForecastHorizonImpact,
  type KpiForecastImpact,
  type KpiImpactProfile,
  type KpiImpactProfileRegistry,
  type KpiImpactSimulationBuildInput,
  type KpiImpactSimulationResult,
  type KpiImpactState,
} from "./kpiImpactSimulationContract.ts";
import type { ScenarioBlueprint, ScenarioKpiChange } from "./scenarioBuilderContract.ts";
import type { ScenarioType } from "./scenarioGenerationContract.ts";

let latestKpiImpactProfileRegistry: KpiImpactProfileRegistry = EMPTY_KPI_IMPACT_PROFILE_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readSceneKpis(sceneJson: unknown): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  if (!scene) return [];
  if (Array.isArray(scene.kpis)) return scene.kpis;
  if (Array.isArray(scene.metrics)) return scene.metrics;
  return [];
}

function readSceneSnapshots(sceneJson: unknown): readonly KpiHistoricalSnapshot[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  const snapshots = scene?.kpiSnapshots ?? scene?.historicalKpis ?? scene?.kpiHistory;
  if (!Array.isArray(snapshots)) return Object.freeze([]);
  return Object.freeze(
    snapshots
      .filter((snapshot): snapshot is KpiHistoricalSnapshot => {
        const record = snapshot as Partial<KpiHistoricalSnapshot>;
        return typeof record.kpiId === "string" && typeof record.value === "number";
      })
      .map((snapshot) => Object.freeze({ ...snapshot }))
  );
}

function invertedCategory(category: KpiIntelligenceCategory): boolean {
  return category === "Cost" || category === "Risk Exposure" || category === "Quality";
}

function resolveImpactState(delta: number, category: KpiIntelligenceCategory): KpiImpactState {
  const effectiveDelta = invertedCategory(category) ? -delta : delta;
  if (effectiveDelta > 1.5) return "Positive";
  if (effectiveDelta < -1.5) return "Negative";
  return "Neutral";
}

function normalizeDirection(value: unknown): "up" | "down" | "neutral" {
  const normalized = readString(value).toLowerCase();
  if (normalized === "up" || normalized === "increase" || normalized === "higher") return "up";
  if (normalized === "down" || normalized === "decrease" || normalized === "lower") return "down";
  return "neutral";
}

function buildProjectedIntelligenceProfile(
  baseline: KpiIntelligenceProfile,
  proposedRecord: Readonly<Record<string, unknown>>
): KpiIntelligenceProfile {
  return Object.freeze({
    ...baseline,
    value: readNumber(proposedRecord.value) ?? readNumber(proposedRecord.current) ?? baseline.value,
    target: readNumber(proposedRecord.target) ?? baseline.target,
    direction: normalizeDirection(proposedRecord.direction) || baseline.direction,
    confidence: clampScore(readNumber(proposedRecord.confidence) ?? baseline.confidence),
  });
}

function projectTrendDirection(
  baseline: KpiTrendDirection,
  forecastDelta: number,
  category: KpiIntelligenceCategory,
  scenarioType: ScenarioType
): KpiTrendDirection {
  const effectiveDelta = invertedCategory(category) ? -forecastDelta : forecastDelta;
  if (effectiveDelta >= 8) return "Improving";
  if (effectiveDelta <= -8) return "Declining";
  if (scenarioType === "risk" && effectiveDelta < 0) return "Declining";
  if (scenarioType === "opportunity" && effectiveDelta > 0) return "Improving";
  return baseline;
}

function horizonMultiplier(horizon: "short" | "medium" | "long"): number {
  if (horizon === "short") return 1;
  if (horizon === "medium") return 1.08;
  return 1.15;
}

function buildHorizonImpacts(
  baselineValue: number,
  projectedValue: number,
  category: KpiIntelligenceCategory
): readonly KpiForecastHorizonImpact[] {
  return Object.freeze(
    (["short", "medium", "long"] as const).map((horizon) => {
      const projected = clampScore(projectedValue * horizonMultiplier(horizon));
      const forecastDelta = projected - baselineValue;
      return Object.freeze({
        horizon,
        baselineValue,
        projectedValue: projected,
        forecastDelta,
        impactState: resolveImpactState(forecastDelta, category),
      });
    })
  );
}

function buildForecastImpact(
  baselineProfile: KpiIntelligenceProfile,
  projectedProfile: KpiIntelligenceProfile,
  scenarioType: ScenarioType,
  snapshots: readonly KpiHistoricalSnapshot[],
  rawRecord?: Readonly<Record<string, unknown>>
): KpiForecastImpact {
  const baselineHealth = calculateKpiHealthProfile(baselineProfile);
  const projectedHealth = calculateKpiHealthProfile(projectedProfile);
  const baselineTrend = calculateKpiTrendProfile(baselineProfile, snapshots);
  const projectedTrend = calculateKpiTrendProfile(projectedProfile, snapshots);
  const baselineImpact = calculateKpiImpactProfile(baselineProfile, rawRecord);
  const projectedImpact = calculateKpiImpactProfile(projectedProfile, rawRecord);

  const baselineValue = baselineProfile.value;
  const projectedValue = projectedProfile.value;
  const forecastDelta = projectedValue - baselineValue;
  const impactState =
    scenarioType === "baseline"
      ? "Neutral"
      : resolveImpactState(forecastDelta, baselineProfile.category);

  return Object.freeze({
    kpiId: baselineProfile.kpiId,
    label: baselineProfile.label,
    baselineValue,
    projectedValue,
    targetValue: baselineProfile.target,
    forecastDelta,
    impactState,
    baselineHealthScore: baselineHealth.healthScore,
    projectedHealthScore: projectedHealth.healthScore,
    baselineImpactScore: baselineImpact.impactScore,
    projectedImpactScore: projectedImpact.impactScore,
    trendDirection: baselineTrend.trendDirection,
    projectedTrendDirection: projectTrendDirection(
      baselineTrend.trendDirection,
      forecastDelta,
      baselineProfile.category,
      scenarioType
    ),
    horizonImpacts: buildHorizonImpacts(baselineValue, projectedValue, baselineProfile.category),
    forecastReady: true,
    predictionActive: false,
  });
}

function compositeImpactScore(forecastImpact: KpiForecastImpact): number {
  return clampScore(
    Math.abs(forecastImpact.forecastDelta) * 0.55 +
      Math.abs(forecastImpact.projectedHealthScore - forecastImpact.baselineHealthScore) * 0.25 +
      Math.abs(forecastImpact.projectedImpactScore - forecastImpact.baselineImpactScore) * 0.2
  );
}

function kpiChangeMap(blueprint: ScenarioBlueprint): Readonly<Record<string, ScenarioKpiChange>> {
  return Object.freeze(
    blueprint.kpiChanges.reduce<Record<string, ScenarioKpiChange>>((registry, change) => {
      registry[change.kpiId] = change;
      return registry;
    }, {})
  );
}

function buildImpactResult(
  baselineProfile: KpiIntelligenceProfile,
  scenarioId: string,
  scenarioType: ScenarioType,
  proposedRecord: Readonly<Record<string, unknown>>,
  snapshots: readonly KpiHistoricalSnapshot[],
  rawRecord?: Readonly<Record<string, unknown>>
): KpiImpactSimulationResult {
  const projectedProfile =
    scenarioType === "baseline"
      ? baselineProfile
      : buildProjectedIntelligenceProfile(baselineProfile, proposedRecord);
  const forecastImpact = buildForecastImpact(
    baselineProfile,
    projectedProfile,
    scenarioType,
    snapshots,
    rawRecord
  );

  return Object.freeze({
    kpiId: baselineProfile.kpiId,
    scenarioId,
    label: baselineProfile.label,
    forecastImpact,
    impactState: forecastImpact.impactState,
    compositeImpactScore: compositeImpactScore(forecastImpact),
    simulationReady: true,
    applied: false,
  });
}

function buildProfilesForBlueprint(
  blueprint: ScenarioBlueprint,
  intelligenceByKpiId: Readonly<Record<string, KpiIntelligenceProfile>>,
  snapshots: readonly KpiHistoricalSnapshot[]
): readonly KpiImpactProfile[] {
  const changes = kpiChangeMap(blueprint);
  const kpiIds = Object.keys(blueprint.baselineState.kpiSnapshots);

  const profiles = kpiIds
    .map((kpiId) => {
      const baselineProfile = intelligenceByKpiId[kpiId];
      if (!baselineProfile) return null;

      const kpiChange = changes[kpiId];
      const baselineSnapshot = blueprint.baselineState.kpiSnapshots[kpiId];
      const proposedRecord = Object.freeze({
        ...baselineSnapshot,
        ...(kpiChange?.proposedState ?? {}),
        id: kpiId,
        kpiId,
      });
      const impactResult = buildImpactResult(
        baselineProfile,
        blueprint.scenarioId,
        blueprint.scenarioType,
        proposedRecord,
        snapshots,
        proposedRecord
      );

      return Object.freeze({
        profileId: `kpi-impact:${blueprint.scenarioId}:${kpiId}`,
        scenarioId: blueprint.scenarioId,
        scenarioType: blueprint.scenarioType,
        kpiId,
        label: impactResult.label,
        impactResult,
        readOnly: true as const,
      });
    })
    .filter((profile) => profile != null) as KpiImpactProfile[];

  return Object.freeze(profiles);
}

function indexProfilesByKpiId(
  profiles: readonly KpiImpactProfile[]
): Readonly<Record<string, readonly KpiImpactProfile[]>> {
  const grouped = new Map<string, KpiImpactProfile[]>();
  for (const profile of profiles) {
    const bucket = grouped.get(profile.kpiId) ?? [];
    bucket.push(profile);
    grouped.set(profile.kpiId, bucket);
  }
  return Object.freeze(
    Object.fromEntries(
      [...grouped.entries()].map(([kpiId, bucket]) => [kpiId, Object.freeze([...bucket])])
    )
  );
}

function indexProfilesByScenarioId(
  profiles: readonly KpiImpactProfile[]
): Readonly<Record<string, readonly KpiImpactProfile[]>> {
  const grouped = new Map<string, KpiImpactProfile[]>();
  for (const profile of profiles) {
    const bucket = grouped.get(profile.scenarioId) ?? [];
    bucket.push(profile);
    grouped.set(profile.scenarioId, bucket);
  }
  return Object.freeze(
    Object.fromEntries(
      [...grouped.entries()].map(([scenarioId, bucket]) => [scenarioId, Object.freeze([...bucket])])
    )
  );
}

export function buildKpiImpactProfileRegistry(
  input: KpiImpactSimulationBuildInput = {}
): KpiImpactProfileRegistry {
  const kpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const snapshots = input.historicalSnapshots ?? readSceneSnapshots(input.sceneJson);
  const intelligenceInput = Object.freeze({
    sceneJson: input.sceneJson,
    kpis,
    dataSourceKpis: input.dataSourceKpis,
  });

  const intelligenceRegistry = buildKpiIntelligenceRegistry(intelligenceInput);
  buildKpiHealthRegistry({ ...intelligenceInput, profiles: intelligenceRegistry.profiles });
  buildKpiTrendRegistry({
    ...intelligenceInput,
    profiles: intelligenceRegistry.profiles,
    historicalSnapshots: snapshots,
  });
  buildKpiImpactRegistry({ ...intelligenceInput, profiles: intelligenceRegistry.profiles });
  buildKpiForecastFoundationRegistry({
    ...intelligenceInput,
    intelligenceProfiles: intelligenceRegistry.profiles,
  });

  const blueprintRegistry =
    input.blueprintRegistry ??
    buildScenarioBlueprintRegistry({
      sceneJson: input.sceneJson,
      kpis,
      objects: (input.sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects,
    });

  const scenarioIds = input.scenarioIds ? new Set(input.scenarioIds) : null;
  const blueprints = blueprintRegistry.blueprints.filter((blueprint) =>
    scenarioIds ? scenarioIds.has(blueprint.scenarioId) : true
  );

  const profiles = Object.freeze(
    blueprints.flatMap((blueprint) =>
      buildProfilesForBlueprint(blueprint, intelligenceRegistry.profileByKpiId, snapshots)
    )
  );
  const profileById = Object.freeze(
    profiles.reduce<Record<string, KpiImpactProfile>>((registry, profile) => {
      registry[profile.profileId] = profile;
      return registry;
    }, {})
  );

  latestKpiImpactProfileRegistry = Object.freeze({
    version: KPI_IMPACT_SIMULATION_ENGINE_VERSION,
    profiles,
    profileById,
    profilesByKpiId: indexProfilesByKpiId(profiles),
    profilesByScenarioId: indexProfilesByScenarioId(profiles),
    profileCount: profiles.length,
    kpiCount: intelligenceRegistry.kpiCount,
    scenarioCount: blueprints.length,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: KPI_IMPACT_SIMULATION_DIAGNOSTICS,
  });

  return latestKpiImpactProfileRegistry;
}

export function getKpiImpactProfileRegistry(): KpiImpactProfileRegistry {
  return latestKpiImpactProfileRegistry;
}

export function resetKpiImpactSimulationEngineForTests(): void {
  latestKpiImpactProfileRegistry = EMPTY_KPI_IMPACT_PROFILE_REGISTRY;
}

export const KpiImpactSimulationEngine = Object.freeze({
  buildKpiImpactProfileRegistry,
  getKpiImpactProfileRegistry,
});
