/**
 * APP-4:11 — Executive Assistant Memory resolver (maps requests to APP-4:9 search queries).
 */

import { EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS } from "./executiveAssistantMemoryIntegrationConstants.ts";
import { getAssistantRetrievalProfile } from "./executiveAssistantMemoryIntegrationProfileRegistry.ts";
import type { ExecutiveAssistantMemoryRequest } from "./executiveAssistantMemoryIntegrationTypes.ts";
import type { CreateExecutiveMemorySearchQueryInput } from "./executiveMemorySearchRankingTypes.ts";

export function resolveAssistantMemorySearchQuery(
  request: ExecutiveAssistantMemoryRequest
): CreateExecutiveMemorySearchQueryInput {
  const profileId = request.retrievalProfileId ?? EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary;
  const profile = getAssistantRetrievalProfile(profileId);
  const rankingProfileId = profile?.rankingProfileId ?? "default";

  return Object.freeze({
    recordId: request.recordId,
    workspaceId: request.workspaceId,
    goalId: request.goalId,
    intentId: request.intentId,
    scenarioId: request.scenarioId,
    decisionId: request.decisionId,
    contextId: request.contextId,
    category: request.category,
    rankingProfileId,
    lifecycleState: request.allowArchived === false ? "active" : undefined,
    limit: request.limit,
  });
}

export const ExecutiveAssistantMemoryResolver = Object.freeze({
  resolveAssistantMemorySearchQuery,
});
