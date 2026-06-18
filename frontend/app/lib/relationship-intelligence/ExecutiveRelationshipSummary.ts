import { buildDependencyIntelligenceRegistry } from "./DependencyIntelligenceEngine.ts";
import { buildRelationshipInfluenceRegistry } from "./RelationshipInfluenceEngine.ts";
import { buildRelationshipIntelligenceRegistry } from "./RelationshipIntelligenceRuntime.ts";
import { buildRelationshipRiskExposureRegistry } from "./RelationshipRiskExposureEngine.ts";
import { buildRelationshipStrengthRegistry } from "./RelationshipStrengthEngine.ts";
import {
  EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY,
  EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTICS,
  EXEC_RELATIONSHIP_SUMMARY_VERSION,
  type ExecutiveRelationshipAttention,
  type ExecutiveRelationshipAttentionLevel,
  type ExecutiveRelationshipSummary,
  type ExecutiveRelationshipSummaryBuildInput,
  type ExecutiveRelationshipSummaryProfile,
} from "./executiveRelationshipSummaryContract.ts";
import type { DependencyProfile } from "./dependencyIntelligenceContract.ts";
import type { RelationshipInfluenceProfile } from "./relationshipInfluenceContract.ts";
import type { RelationshipIntelligenceProfile } from "./relationshipIntelligenceContract.ts";
import type { RelationshipRiskExposureProfile } from "./relationshipRiskExposureContract.ts";
import type { RelationshipStrengthProfile } from "./relationshipStrengthContract.ts";

let latestExecutiveRelationshipSummary: ExecutiveRelationshipSummary =
  EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function byRelationshipId<T extends { relationshipId: string }>(
  profiles: readonly T[]
): Readonly<Record<string, T>> {
  return Object.freeze(
    profiles.reduce<Record<string, T>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );
}

function collectProfiles(
  input: ExecutiveRelationshipSummaryBuildInput
): readonly ExecutiveRelationshipSummaryProfile[] {
  const intelligenceProfiles =
    input.intelligenceProfiles ?? buildRelationshipIntelligenceRegistry(input).profiles;
  const strengthProfiles =
    input.strengthProfiles ?? buildRelationshipStrengthRegistry(input).profiles;
  const dependencyProfiles =
    input.dependencyProfiles ?? buildDependencyIntelligenceRegistry(input).profiles;
  const influenceProfiles =
    input.influenceProfiles ?? buildRelationshipInfluenceRegistry(input).profiles;
  const riskExposureProfiles =
    input.riskExposureProfiles ?? buildRelationshipRiskExposureRegistry(input).profiles;

  const intelligenceById = byRelationshipId<RelationshipIntelligenceProfile>(intelligenceProfiles);
  const strengthById = byRelationshipId<RelationshipStrengthProfile>(strengthProfiles);
  const dependencyById = byRelationshipId<DependencyProfile>(dependencyProfiles);
  const influenceById = byRelationshipId<RelationshipInfluenceProfile>(influenceProfiles);
  const riskById = byRelationshipId<RelationshipRiskExposureProfile>(riskExposureProfiles);
  const ids = new Set<string>();

  intelligenceProfiles.forEach((profile) => ids.add(profile.relationshipId));
  strengthProfiles.forEach((profile) => ids.add(profile.relationshipId));
  dependencyProfiles.forEach((profile) => ids.add(profile.relationshipId));
  influenceProfiles.forEach((profile) => ids.add(profile.relationshipId));
  riskExposureProfiles.forEach((profile) => ids.add(profile.relationshipId));

  return Object.freeze(
    [...ids].sort().map((relationshipId): ExecutiveRelationshipSummaryProfile => {
      const intelligence = intelligenceById[relationshipId];
      const strength = strengthById[relationshipId];
      const dependency = dependencyById[relationshipId];
      const influence = influenceById[relationshipId];
      const riskExposure = riskById[relationshipId];
      return Object.freeze({
        relationshipId,
        sourceId:
          intelligence?.sourceId ??
          strength?.sourceId ??
          dependency?.sourceId ??
          influence?.sourceId ??
          riskExposure?.sourceId,
        targetId:
          intelligence?.targetId ??
          strength?.targetId ??
          dependency?.targetId ??
          influence?.targetId ??
          riskExposure?.targetId,
        intelligence,
        strength,
        dependency,
        influence,
        riskExposure,
      });
    })
  );
}

function topRisks(profiles: readonly ExecutiveRelationshipSummaryProfile[]): readonly string[] {
  return Object.freeze(
    profiles
      .filter((profile) => (profile.riskExposure?.riskExposureScore ?? 0) >= 60)
      .sort((a, b) => (b.riskExposure?.riskExposureScore ?? 0) - (a.riskExposure?.riskExposureScore ?? 0))
      .slice(0, 5)
      .map((profile) => `${profile.relationshipId}: risk ${profile.riskExposure!.riskExposureScore}`)
  );
}

function topDependencies(profiles: readonly ExecutiveRelationshipSummaryProfile[]): readonly string[] {
  return Object.freeze(
    profiles
      .filter((profile) => (profile.dependency?.dependencyScore ?? 0) >= 60)
      .sort((a, b) => (b.dependency?.dependencyScore ?? 0) - (a.dependency?.dependencyScore ?? 0))
      .slice(0, 5)
      .map((profile) => `${profile.relationshipId}: dependency ${profile.dependency!.dependencyScore}`)
  );
}

function topInfluencers(profiles: readonly ExecutiveRelationshipSummaryProfile[]): readonly string[] {
  return Object.freeze(
    profiles
      .filter((profile) => (profile.influence?.influenceScore ?? profile.intelligence?.influence ?? 0) >= 60)
      .sort(
        (a, b) =>
          (b.influence?.influenceScore ?? b.intelligence?.influence ?? 0) -
          (a.influence?.influenceScore ?? a.intelligence?.influence ?? 0)
      )
      .slice(0, 5)
      .map(
        (profile) =>
          `${profile.relationshipId}: influence ${profile.influence?.influenceScore ?? profile.intelligence!.influence}`
      )
  );
}

function attentionLevel(profile: ExecutiveRelationshipSummaryProfile): ExecutiveRelationshipAttentionLevel {
  const risk = profile.riskExposure?.riskExposureScore ?? 0;
  const dependency = profile.dependency?.dependencyScore ?? 0;
  const confidence = profile.intelligence?.confidence ?? 100;
  const strength = profile.strength?.strengthScore ?? 0;
  if ((risk >= 75 || dependency >= 80) && confidence < 70) return "prioritize";
  if (risk >= 65 || dependency >= 70 || confidence < 60 || strength < 40) return "review";
  return "monitor";
}

function recommendedAttention(
  profiles: readonly ExecutiveRelationshipSummaryProfile[]
): readonly ExecutiveRelationshipAttention[] {
  const rank: Record<ExecutiveRelationshipAttentionLevel, number> = {
    prioritize: 0,
    review: 1,
    monitor: 2,
  };
  return Object.freeze(
    profiles
      .map((profile): ExecutiveRelationshipAttention =>
        Object.freeze({
          relationshipId: profile.relationshipId,
          attentionLevel: attentionLevel(profile),
          reason: `${profile.relationshipId} risk ${profile.riskExposure?.riskExposureScore ?? "n/a"}, dependency ${profile.dependency?.dependencyScore ?? "n/a"}, confidence ${profile.intelligence?.confidence ?? "n/a"}.`,
        })
      )
      .filter((entry) => entry.attentionLevel !== "monitor")
      .sort((a, b) => rank[a.attentionLevel] - rank[b.attentionLevel])
      .slice(0, 5)
  );
}

function buildExecutiveSummaryText(input: {
  relationshipCount: number;
  averageStrengthScore: number;
  averageDependencyScore: number;
  averageInfluenceScore: number;
  averageConfidenceScore: number;
  averageRiskExposureScore: number;
  attentionCount: number;
}): string {
  if (input.relationshipCount === 0) return "No relationship intelligence is available.";
  return `Executive relationship intelligence covers ${input.relationshipCount} relationship(s): strength ${input.averageStrengthScore}, dependency ${input.averageDependencyScore}, influence ${input.averageInfluenceScore}, confidence ${input.averageConfidenceScore}, risk ${input.averageRiskExposureScore}; ${input.attentionCount} relationship(s) need attention.`;
}

export function buildExecutiveRelationshipSummary(
  input: ExecutiveRelationshipSummaryBuildInput = {}
): ExecutiveRelationshipSummary {
  const profiles = collectProfiles(input);
  if (profiles.length === 0) {
    latestExecutiveRelationshipSummary = EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY;
    return latestExecutiveRelationshipSummary;
  }

  const averageStrengthScore = average(profiles.map((profile) => profile.strength?.strengthScore ?? 0));
  const averageDependencyScore = average(profiles.map((profile) => profile.dependency?.dependencyScore ?? 0));
  const averageInfluenceScore = average(
    profiles.map((profile) => profile.influence?.influenceScore ?? profile.intelligence?.influence ?? 0)
  );
  const averageConfidenceScore = average(profiles.map((profile) => profile.intelligence?.confidence ?? 0));
  const averageRiskExposureScore = average(
    profiles.map((profile) => profile.riskExposure?.riskExposureScore ?? 0)
  );
  const attention = recommendedAttention(profiles);

  latestExecutiveRelationshipSummary = Object.freeze({
    version: EXEC_RELATIONSHIP_SUMMARY_VERSION,
    executiveSummary: buildExecutiveSummaryText({
      relationshipCount: profiles.length,
      averageStrengthScore,
      averageDependencyScore,
      averageInfluenceScore,
      averageConfidenceScore,
      averageRiskExposureScore,
      attentionCount: attention.length,
    }),
    relationshipCount: profiles.length,
    averageStrengthScore,
    averageDependencyScore,
    averageInfluenceScore,
    averageConfidenceScore,
    averageRiskExposureScore,
    topRisks: topRisks(profiles),
    topDependencies: topDependencies(profiles),
    topInfluencers: topInfluencers(profiles),
    recommendedAttention: attention,
    profiles,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTICS,
  });

  return latestExecutiveRelationshipSummary;
}

export function getExecutiveRelationshipSummary(): ExecutiveRelationshipSummary {
  return latestExecutiveRelationshipSummary;
}

export function resetExecutiveRelationshipSummaryForTests(): void {
  latestExecutiveRelationshipSummary = EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY;
}
