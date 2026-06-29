/**
 * APP-4:11 — Assistant retrieval profile registry (maps to APP-4:9 ranking profiles).
 */

import { EXECUTIVE_MEMORY_RANKING_PROFILE_IDS } from "./executiveMemorySearchRankingConstants.ts";
import {
  EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS,
} from "./executiveAssistantMemoryIntegrationConstants.ts";
import { createExecutiveAssistantRetrievalProfile } from "./executiveAssistantMemoryIntegrationModel.ts";
import type { ExecutiveAssistantRetrievalProfile } from "./executiveAssistantMemoryIntegrationTypes.ts";

function buildBuiltInProfiles(): ExecutiveAssistantRetrievalProfile[] {
  return [
    createExecutiveAssistantRetrievalProfile({
      profileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary,
      label: "Executive Summary",
      description: "Balanced executive memory summary retrieval.",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.default,
    }),
    createExecutiveAssistantRetrievalProfile({
      profileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.decisionReview,
      label: "Decision Review",
      description: "Decision-focused memory retrieval for assistant review.",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.decisionFocus,
    }),
    createExecutiveAssistantRetrievalProfile({
      profileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.scenarioReview,
      label: "Scenario Review",
      description: "Scenario-focused memory retrieval for assistant review.",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.scenarioFocus,
    }),
    createExecutiveAssistantRetrievalProfile({
      profileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.contextReview,
      label: "Context Review",
      description: "Business context-focused memory retrieval.",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.contextFocus,
    }),
    createExecutiveAssistantRetrievalProfile({
      profileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.timelineReview,
      label: "Timeline Review",
      description: "Recency-focused memory retrieval for timeline review.",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.recentFirst,
    }),
  ];
}

let profiles = buildBuiltInProfiles();

export function resetExecutiveAssistantRetrievalProfilesForTests(): void {
  profiles = buildBuiltInProfiles();
}

export function getAssistantRetrievalProfile(profileId: string): ExecutiveAssistantRetrievalProfile | null {
  return profiles.find((entry) => entry.profileId === profileId) ?? null;
}

export function listAssistantRetrievalProfiles(): readonly ExecutiveAssistantRetrievalProfile[] {
  return Object.freeze([...profiles]);
}

export const ExecutiveAssistantRetrievalProfileRegistry = Object.freeze({
  getAssistantRetrievalProfile,
  listAssistantRetrievalProfiles,
  resetExecutiveAssistantRetrievalProfilesForTests,
});
