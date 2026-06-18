import { buildObjectConfidenceRegistry } from "./ObjectConfidenceEngine.ts";
import { buildObjectHealthRegistry } from "./ObjectHealthEngine.ts";
import { buildObjectImpactRegistry } from "./ObjectImpactEngine.ts";
import { buildObjectImportanceRegistry } from "./ObjectImportanceEngine.ts";
import { buildObjectTrendRegistry } from "./ObjectTrendEngine.ts";
import {
  EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY,
  EXEC_OBJECT_INTELLIGENCE_DIAGNOSTICS,
  EXEC_OBJECT_INTELLIGENCE_VERSION,
  type ExecutiveObjectAttention,
  type ExecutiveObjectAttentionLevel,
  type ExecutiveObjectIntelligenceBuildInput,
  type ExecutiveObjectIntelligenceProfile,
  type ExecutiveObjectIntelligenceSummary,
} from "./executiveObjectIntelligenceSummaryContract.ts";
import type { ObjectConfidenceResult } from "./objectConfidenceContract.ts";
import type { ObjectHealthResult } from "./objectHealthContract.ts";
import type { ObjectImpactResult } from "./objectImpactContract.ts";
import type { ObjectImportanceProfile } from "./objectImportanceContract.ts";
import type { ObjectTrendProfile } from "./objectTrendContract.ts";

let latestExecutiveObjectIntelligenceSummary: ExecutiveObjectIntelligenceSummary =
  EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function byObjectId<T extends { objectId: string }>(profiles: readonly T[]): Readonly<Record<string, T>> {
  return Object.freeze(
    profiles.reduce<Record<string, T>>((registry, profile) => {
      registry[profile.objectId] = profile;
      return registry;
    }, {})
  );
}

function collectProfiles(input: ExecutiveObjectIntelligenceBuildInput): readonly ExecutiveObjectIntelligenceProfile[] {
  const healthProfiles = input.healthProfiles ?? buildObjectHealthRegistry(input).objects;
  const impactProfiles = input.impactProfiles ?? buildObjectImpactRegistry(input).objects;
  const confidenceProfiles = input.confidenceProfiles ?? buildObjectConfidenceRegistry(input).objects;
  const trendProfiles = input.trendProfiles ?? buildObjectTrendRegistry(input).profiles;
  const importanceProfiles = input.importanceProfiles ?? buildObjectImportanceRegistry(input).profiles;

  const healthById = byObjectId<ObjectHealthResult>(healthProfiles);
  const impactById = byObjectId<ObjectImpactResult>(impactProfiles);
  const confidenceById = byObjectId<ObjectConfidenceResult>(confidenceProfiles);
  const trendById = byObjectId<ObjectTrendProfile>(trendProfiles);
  const importanceById = byObjectId<ObjectImportanceProfile>(importanceProfiles);

  const ids = new Set<string>();
  healthProfiles.forEach((profile) => ids.add(profile.objectId));
  impactProfiles.forEach((profile) => ids.add(profile.objectId));
  confidenceProfiles.forEach((profile) => ids.add(profile.objectId));
  trendProfiles.forEach((profile) => ids.add(profile.objectId));
  importanceProfiles.forEach((profile) => ids.add(profile.objectId));

  return Object.freeze(
    [...ids].sort().map((objectId): ExecutiveObjectIntelligenceProfile =>
      Object.freeze({
        objectId,
        health: healthById[objectId],
        impact: impactById[objectId],
        confidence: confidenceById[objectId],
        trend: trendById[objectId],
        importance: importanceById[objectId],
      })
    )
  );
}

function topStrengths(profiles: readonly ExecutiveObjectIntelligenceProfile[]): readonly string[] {
  const strengths = profiles.flatMap((profile) => {
    const entries: string[] = [];
    if ((profile.health?.healthScore ?? 0) >= 85) entries.push(`${profile.objectId}: health ${profile.health!.healthScore}`);
    if ((profile.impact?.impactScore ?? 0) >= 85) entries.push(`${profile.objectId}: impact ${profile.impact!.impactScore}`);
    if ((profile.confidence?.confidenceScore ?? 0) >= 85) {
      entries.push(`${profile.objectId}: confidence ${profile.confidence!.confidenceScore}`);
    }
    if ((profile.importance?.importanceScore ?? 0) >= 85) {
      entries.push(`${profile.objectId}: importance ${profile.importance!.importanceScore}`);
    }
    if (profile.trend?.trendDirection === "Improving") entries.push(`${profile.objectId}: improving trend`);
    return entries;
  });
  return Object.freeze(strengths.slice(0, 5));
}

function topWeaknesses(profiles: readonly ExecutiveObjectIntelligenceProfile[]): readonly string[] {
  const weaknesses = profiles.flatMap((profile) => {
    const entries: string[] = [];
    if ((profile.health?.healthScore ?? 100) < 50) entries.push(`${profile.objectId}: health ${profile.health!.healthScore}`);
    if ((profile.confidence?.confidenceScore ?? 100) < 50) {
      entries.push(`${profile.objectId}: confidence ${profile.confidence!.confidenceScore}`);
    }
    if (profile.trend?.trendDirection === "Declining") entries.push(`${profile.objectId}: declining trend`);
    if (profile.trend?.trendDirection === "Volatile") entries.push(`${profile.objectId}: volatile trend`);
    return entries;
  });
  return Object.freeze(weaknesses.slice(0, 5));
}

function attentionLevel(profile: ExecutiveObjectIntelligenceProfile): ExecutiveObjectAttentionLevel {
  const health = profile.health?.healthScore ?? 100;
  const confidence = profile.confidence?.confidenceScore ?? 100;
  const impact = profile.impact?.impactScore ?? 0;
  const importance = profile.importance?.importanceScore ?? 0;
  const trend = profile.trend?.trendDirection;

  if ((health < 50 || trend === "Declining" || trend === "Volatile") && (impact >= 65 || importance >= 65)) {
    return "prioritize";
  }
  if (health < 70 || confidence < 60 || trend === "Declining" || trend === "Volatile") return "review";
  return "monitor";
}

function recommendedAttention(
  profiles: readonly ExecutiveObjectIntelligenceProfile[]
): readonly ExecutiveObjectAttention[] {
  const attention = profiles
    .map((profile): ExecutiveObjectAttention =>
      Object.freeze({
        objectId: profile.objectId,
        attentionLevel: attentionLevel(profile),
        reason: `${profile.objectId} health ${profile.health?.healthScore ?? "n/a"}, impact ${profile.impact?.impactScore ?? "n/a"}, importance ${profile.importance?.importanceScore ?? "n/a"}, trend ${profile.trend?.trendDirection ?? "n/a"}.`,
      })
    )
    .filter((entry) => entry.attentionLevel !== "monitor");

  const rank: Record<ExecutiveObjectAttentionLevel, number> = { prioritize: 0, review: 1, monitor: 2 };
  return Object.freeze(attention.sort((a, b) => rank[a.attentionLevel] - rank[b.attentionLevel]).slice(0, 5));
}

function buildExecutiveSummaryText(input: {
  objectCount: number;
  averageHealthScore: number;
  averageImpactScore: number;
  averageConfidenceScore: number;
  averageImportanceScore: number;
  recommendedAttentionCount: number;
}): string {
  if (input.objectCount === 0) return "No object intelligence is available.";
  return `Executive object intelligence covers ${input.objectCount} object(s): health ${input.averageHealthScore}, impact ${input.averageImpactScore}, confidence ${input.averageConfidenceScore}, importance ${input.averageImportanceScore}; ${input.recommendedAttentionCount} object(s) need attention.`;
}

export function buildExecutiveObjectIntelligenceSummary(
  input: ExecutiveObjectIntelligenceBuildInput = {}
): ExecutiveObjectIntelligenceSummary {
  const profiles = collectProfiles(input);
  if (profiles.length === 0) {
    latestExecutiveObjectIntelligenceSummary = EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY;
    return latestExecutiveObjectIntelligenceSummary;
  }

  const averageHealthScore = average(profiles.map((profile) => profile.health?.healthScore ?? 0));
  const averageImpactScore = average(profiles.map((profile) => profile.impact?.impactScore ?? 0));
  const averageConfidenceScore = average(profiles.map((profile) => profile.confidence?.confidenceScore ?? 0));
  const averageImportanceScore = average(profiles.map((profile) => profile.importance?.importanceScore ?? 0));
  const improvingCount = profiles.filter((profile) => profile.trend?.trendDirection === "Improving").length;
  const stableCount = profiles.filter((profile) => profile.trend?.trendDirection === "Stable").length;
  const decliningCount = profiles.filter((profile) => profile.trend?.trendDirection === "Declining").length;
  const volatileCount = profiles.filter((profile) => profile.trend?.trendDirection === "Volatile").length;
  const attention = recommendedAttention(profiles);

  latestExecutiveObjectIntelligenceSummary = Object.freeze({
    version: EXEC_OBJECT_INTELLIGENCE_VERSION,
    executiveSummary: buildExecutiveSummaryText({
      objectCount: profiles.length,
      averageHealthScore,
      averageImpactScore,
      averageConfidenceScore,
      averageImportanceScore,
      recommendedAttentionCount: attention.length,
    }),
    objectCount: profiles.length,
    averageHealthScore,
    averageImpactScore,
    averageConfidenceScore,
    averageImportanceScore,
    improvingCount,
    stableCount,
    decliningCount,
    volatileCount,
    topStrengths: topStrengths(profiles),
    topWeaknesses: topWeaknesses(profiles),
    recommendedAttention: attention,
    profiles,
    sceneMutation: false,
    simulation: false,
    diagnostics: EXEC_OBJECT_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestExecutiveObjectIntelligenceSummary;
}

export function getExecutiveObjectIntelligenceSummary(): ExecutiveObjectIntelligenceSummary {
  return latestExecutiveObjectIntelligenceSummary;
}

export function resetExecutiveObjectIntelligenceSummaryForTests(): void {
  latestExecutiveObjectIntelligenceSummary = EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY;
}
