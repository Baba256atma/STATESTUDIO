import { buildKpiHealthRegistry } from "./KpiHealthEngine.ts";
import { buildKpiDependencyRegistry } from "./KpiDependencyEngine.ts";
import { buildKpiImpactRegistry } from "./KpiImpactEngine.ts";
import { buildKpiIntelligenceRegistry } from "./KpiIntelligenceRuntime.ts";
import { buildKpiTrendRegistry } from "./KpiTrendEngine.ts";
import {
  EMPTY_EXECUTIVE_KPI_SUMMARY,
  EXEC_KPI_SUMMARY_DIAGNOSTICS,
  EXEC_KPI_SUMMARY_VERSION,
  type ExecutiveKpiAttention,
  type ExecutiveKpiAttentionLevel,
  type ExecutiveKpiSummary,
  type ExecutiveKpiSummaryBuildInput,
  type ExecutiveKpiSummaryProfile,
} from "./executiveKpiSummaryContract.ts";
import type { KpiHealthProfile } from "./kpiHealthContract.ts";
import type { KpiDependencyProfile } from "./kpiDependencyContract.ts";
import type { KpiImpactProfile } from "./kpiImpactContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";
import type { KpiTrendProfile } from "./kpiTrendContract.ts";

let latestExecutiveKpiSummary: ExecutiveKpiSummary = EMPTY_EXECUTIVE_KPI_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function byKpiId<T extends { kpiId: string }>(profiles: readonly T[]): Readonly<Record<string, T>> {
  return Object.freeze(
    profiles.reduce<Record<string, T>>((registry, profile) => {
      registry[profile.kpiId] = profile;
      return registry;
    }, {})
  );
}

function collectProfiles(input: ExecutiveKpiSummaryBuildInput): readonly ExecutiveKpiSummaryProfile[] {
  const intelligenceProfiles =
    input.intelligenceProfiles ?? buildKpiIntelligenceRegistry(input).profiles;
  const healthProfiles =
    input.healthProfiles ?? buildKpiHealthRegistry({ ...input, profiles: intelligenceProfiles }).profiles;
  const trendProfiles =
    input.trendProfiles ?? buildKpiTrendRegistry({ ...input, profiles: intelligenceProfiles }).profiles;
  const impactProfiles =
    input.impactProfiles ?? buildKpiImpactRegistry({ ...input, profiles: intelligenceProfiles }).profiles;
  const dependencyProfiles =
    input.dependencyProfiles ??
    buildKpiDependencyRegistry({ ...input, profiles: intelligenceProfiles, impactProfiles }).profiles;

  const intelligenceById = byKpiId<KpiIntelligenceProfile>(intelligenceProfiles);
  const healthById = byKpiId<KpiHealthProfile>(healthProfiles);
  const trendById = byKpiId<KpiTrendProfile>(trendProfiles);
  const impactById = byKpiId<KpiImpactProfile>(impactProfiles);
  const dependencyById = byKpiId<KpiDependencyProfile>(dependencyProfiles);
  const ids = new Set<string>();

  intelligenceProfiles.forEach((profile) => ids.add(profile.kpiId));
  healthProfiles.forEach((profile) => ids.add(profile.kpiId));
  trendProfiles.forEach((profile) => ids.add(profile.kpiId));
  impactProfiles.forEach((profile) => ids.add(profile.kpiId));
  dependencyProfiles.forEach((profile) => ids.add(profile.kpiId));

  return Object.freeze(
    [...ids].sort().map((kpiId): ExecutiveKpiSummaryProfile => {
      const intelligence = intelligenceById[kpiId];
      const health = healthById[kpiId];
      const trend = trendById[kpiId];
      const impact = impactById[kpiId];
      const dependency = dependencyById[kpiId];
      const label = intelligence?.label ?? health?.label ?? trend?.label ?? impact?.label ?? kpiId;
      return Object.freeze({
        kpiId,
        label,
        confidenceScore: intelligence?.confidence ?? 0,
        dependencyScore: dependency?.dependencyScore ?? 0,
        dependency,
        intelligence,
        health,
        trend,
        impact,
      });
    })
  );
}

function topPerformingKpis(profiles: readonly ExecutiveKpiSummaryProfile[]): readonly string[] {
  return Object.freeze(
    profiles
      .filter((profile) => (profile.health?.healthScore ?? 0) >= 70)
      .sort((a, b) => (b.health?.healthScore ?? 0) - (a.health?.healthScore ?? 0))
      .slice(0, 5)
      .map((profile) => `${profile.kpiId}: health ${profile.health!.healthScore}`)
  );
}

function topDecliningKpis(profiles: readonly ExecutiveKpiSummaryProfile[]): readonly string[] {
  return Object.freeze(
    profiles
      .filter((profile) => profile.trend?.trendDirection === "Declining")
      .sort((a, b) => (b.trend?.trendStrength ?? 0) - (a.trend?.trendStrength ?? 0))
      .slice(0, 5)
      .map((profile) => `${profile.kpiId}: declining ${profile.trend!.trendStrength}`)
  );
}

function topCriticalKpis(profiles: readonly ExecutiveKpiSummaryProfile[]): readonly string[] {
  return Object.freeze(
    profiles
      .filter(
        (profile) =>
          profile.health?.healthState === "Critical" ||
          profile.impact?.impactLevel === "Critical" ||
          profile.dependencyScore >= 85
      )
      .sort(
        (a, b) =>
          (b.impact?.impactScore ?? 0) +
          (100 - (b.health?.healthScore ?? 100)) +
          b.dependencyScore -
          ((a.impact?.impactScore ?? 0) + (100 - (a.health?.healthScore ?? 100)) + a.dependencyScore)
      )
      .slice(0, 5)
      .map((profile) => `${profile.kpiId}: impact ${profile.impact?.impactScore ?? "n/a"}, health ${profile.health?.healthScore ?? "n/a"}`)
  );
}

function attentionLevel(profile: ExecutiveKpiSummaryProfile): ExecutiveKpiAttentionLevel {
  const health = profile.health?.healthScore ?? 100;
  const impact = profile.impact?.impactScore ?? 0;
  const trend = profile.trend?.trendDirection;
  const confidence = profile.confidenceScore;
  if ((health < 40 || trend === "Declining") && impact >= 80) return "prioritize";
  if (health < 60 || trend === "Volatile" || impact >= 85 || profile.dependencyScore >= 85 || confidence < 55) {
    return "review";
  }
  return "monitor";
}

function recommendedAttention(
  profiles: readonly ExecutiveKpiSummaryProfile[]
): readonly ExecutiveKpiAttention[] {
  const rank: Record<ExecutiveKpiAttentionLevel, number> = {
    prioritize: 0,
    review: 1,
    monitor: 2,
  };
  return Object.freeze(
    profiles
      .map((profile): ExecutiveKpiAttention =>
        Object.freeze({
          kpiId: profile.kpiId,
          attentionLevel: attentionLevel(profile),
          reason: `${profile.kpiId} health ${profile.health?.healthScore ?? "n/a"}, trend ${profile.trend?.trendDirection ?? "n/a"}, impact ${profile.impact?.impactScore ?? "n/a"}, dependency ${profile.dependencyScore}, confidence ${profile.confidenceScore}.`,
        })
      )
      .filter((entry) => entry.attentionLevel !== "monitor")
      .sort((a, b) => rank[a.attentionLevel] - rank[b.attentionLevel])
      .slice(0, 5)
  );
}

function buildExecutiveSummaryText(input: {
  kpiCount: number;
  averageHealthScore: number;
  averageTrendStrength: number;
  averageImpactScore: number;
  averageDependencyScore: number;
  averageConfidenceScore: number;
  attentionCount: number;
}): string {
  if (input.kpiCount === 0) return "No KPI intelligence is available.";
  return `Executive KPI intelligence covers ${input.kpiCount} KPI(s): health ${input.averageHealthScore}, trend strength ${input.averageTrendStrength}, impact ${input.averageImpactScore}, dependency ${input.averageDependencyScore}, confidence ${input.averageConfidenceScore}; ${input.attentionCount} KPI(s) need attention.`;
}

export function buildExecutiveKpiSummary(
  input: ExecutiveKpiSummaryBuildInput = {}
): ExecutiveKpiSummary {
  const profiles = collectProfiles(input);
  if (profiles.length === 0) {
    latestExecutiveKpiSummary = EMPTY_EXECUTIVE_KPI_SUMMARY;
    return latestExecutiveKpiSummary;
  }

  const averageHealthScore = average(profiles.map((profile) => profile.health?.healthScore ?? 0));
  const averageTrendStrength = average(profiles.map((profile) => profile.trend?.trendStrength ?? 0));
  const averageImpactScore = average(profiles.map((profile) => profile.impact?.impactScore ?? 0));
  const averageDependencyScore = average(profiles.map((profile) => profile.dependencyScore));
  const averageConfidenceScore = average(profiles.map((profile) => profile.confidenceScore));
  const attention = recommendedAttention(profiles);

  latestExecutiveKpiSummary = Object.freeze({
    version: EXEC_KPI_SUMMARY_VERSION,
    executiveSummary: buildExecutiveSummaryText({
      kpiCount: profiles.length,
      averageHealthScore,
      averageTrendStrength,
      averageImpactScore,
      averageDependencyScore,
      averageConfidenceScore,
      attentionCount: attention.length,
    }),
    kpiCount: profiles.length,
    averageHealthScore,
    averageTrendStrength,
    averageImpactScore,
    averageDependencyScore,
    averageConfidenceScore,
    topPerformingKpis: topPerformingKpis(profiles),
    topDecliningKpis: topDecliningKpis(profiles),
    topCriticalKpis: topCriticalKpis(profiles),
    recommendedAttention: attention,
    profiles,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: EXEC_KPI_SUMMARY_DIAGNOSTICS,
  });

  return latestExecutiveKpiSummary;
}

export function getExecutiveKpiSummary(): ExecutiveKpiSummary {
  return latestExecutiveKpiSummary;
}

export function resetExecutiveKpiSummaryForTests(): void {
  latestExecutiveKpiSummary = EMPTY_EXECUTIVE_KPI_SUMMARY;
}
