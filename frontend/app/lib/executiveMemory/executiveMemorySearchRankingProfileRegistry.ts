/**
 * APP-4:9 — Executive Memory Ranking profile registry and built-in profiles.
 */

import {
  EXECUTIVE_MEMORY_RANKING_PROFILE_IDS,
  EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS,
} from "./executiveMemorySearchRankingConstants.ts";
import { createExecutiveMemoryRankingProfile, createExecutiveMemoryRankingRule } from "./executiveMemorySearchRankingModel.ts";
import type {
  CreateExecutiveMemoryRankingProfileInput,
  ExecutiveMemoryRankingProfile,
} from "./executiveMemorySearchRankingTypes.ts";

function rule(
  ruleType: (typeof EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS)[number],
  weight: number
) {
  return createExecutiveMemoryRankingRule({
    ruleId: `rule-${ruleType}`,
    ruleType,
    weight,
    enabled: true,
  });
}

function buildDefaultProfiles(): ExecutiveMemoryRankingProfile[] {
  const allRules = (weights: Partial<Record<(typeof EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS)[number], number>>) =>
    EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS.map((ruleType) =>
      rule(ruleType, weights[ruleType] ?? 10)
    );

  return [
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.default,
      label: "Default",
      description: "Balanced deterministic ranking across metadata signals.",
      rules: allRules({
        exact_identifier_match: 20,
        workspace_match: 15,
        intent_linkage: 12,
        scenario_linkage: 12,
        decision_linkage: 12,
        context_linkage: 10,
        confidence_score: 10,
        record_freshness: 8,
        active_state: 6,
        metadata_completeness: 5,
      }),
      builtIn: true,
    }),
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.recentFirst,
      label: "Recent First",
      description: "Prioritize record freshness and active lifecycle.",
      rules: allRules({ record_freshness: 40, active_state: 20, workspace_match: 10 }),
      builtIn: true,
    }),
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.highestConfidence,
      label: "Highest Confidence",
      description: "Prioritize confidence score and metadata completeness.",
      rules: allRules({ confidence_score: 45, metadata_completeness: 20, active_state: 10 }),
      builtIn: true,
    }),
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.intentFocus,
      label: "Intent Focus",
      description: "Prioritize intent linkage and workspace alignment.",
      rules: allRules({ intent_linkage: 40, workspace_match: 20, exact_identifier_match: 10 }),
      builtIn: true,
    }),
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.scenarioFocus,
      label: "Scenario Focus",
      description: "Prioritize scenario linkage and workspace alignment.",
      rules: allRules({ scenario_linkage: 40, workspace_match: 20, exact_identifier_match: 10 }),
      builtIn: true,
    }),
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.decisionFocus,
      label: "Decision Focus",
      description: "Prioritize decision linkage and confidence score.",
      rules: allRules({ decision_linkage: 40, confidence_score: 20, workspace_match: 10 }),
      builtIn: true,
    }),
    createExecutiveMemoryRankingProfile({
      profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.contextFocus,
      label: "Context Focus",
      description: "Prioritize business context linkage and metadata completeness.",
      rules: allRules({ context_linkage: 40, metadata_completeness: 20, workspace_match: 10 }),
      builtIn: true,
    }),
  ];
}

const customProfiles = new Map<string, ExecutiveMemoryRankingProfile>();
let builtInProfiles = buildDefaultProfiles();

export function resetExecutiveMemoryRankingProfileRegistryForTests(): void {
  customProfiles.clear();
  builtInProfiles = buildDefaultProfiles();
}

export function getRankingProfile(profileId: string): ExecutiveMemoryRankingProfile | null {
  const custom = customProfiles.get(profileId);
  if (custom) return custom;
  return builtInProfiles.find((profile) => profile.profileId === profileId) ?? null;
}

export function getRankingProfiles(): readonly ExecutiveMemoryRankingProfile[] {
  return Object.freeze(
    [...builtInProfiles, ...customProfiles.values()].sort((left, right) =>
      left.profileId.localeCompare(right.profileId)
    )
  );
}

export function registerRankingProfile(
  input: CreateExecutiveMemoryRankingProfileInput
): Readonly<{ success: boolean; reason: string; profile: ExecutiveMemoryRankingProfile | null }> {
  if (input.profileId.trim().length === 0) {
    return Object.freeze({ success: false, reason: "Profile id must not be empty.", profile: null });
  }
  if (builtInProfiles.some((profile) => profile.profileId === input.profileId)) {
    return Object.freeze({
      success: false,
      reason: `Built-in profile id is reserved: ${input.profileId}.`,
      profile: null,
    });
  }
  if (customProfiles.has(input.profileId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate ranking profile id: ${input.profileId}.`,
      profile: null,
    });
  }
  const profile = createExecutiveMemoryRankingProfile(input);
  customProfiles.set(profile.profileId, profile);
  return Object.freeze({ success: true, reason: "Ranking profile registered.", profile });
}

export function createRankingProfile(
  input: CreateExecutiveMemoryRankingProfileInput
): ExecutiveMemoryRankingProfile {
  return createExecutiveMemoryRankingProfile(input);
}

export const ExecutiveMemoryRankingProfileRegistry = Object.freeze({
  getRankingProfile,
  getRankingProfiles,
  registerRankingProfile,
  createRankingProfile,
  resetExecutiveMemoryRankingProfileRegistryForTests,
});
