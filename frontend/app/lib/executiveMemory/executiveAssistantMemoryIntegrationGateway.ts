/**
 * APP-4:11 — Executive Assistant Memory gateway.
 * Read path: APP-4:9 Search → APP-4:4 Retrieval → APP-4:3 Storage (indirect).
 */

import { getExecutiveMemoryById as getStoredExecutiveMemoryById } from "./executiveMemoryRetrievalEngine.ts";
import { searchExecutiveMemories } from "./executiveMemorySearchEngine.ts";
import { explainExecutiveMemoryRanking } from "./executiveMemorySearchEngine.ts";
import { executiveAssistantMemoryIntegrationErrorFromCode } from "./executiveAssistantMemoryIntegrationErrors.ts";
import {
  evaluateExecutiveAssistantMemoryPermission,
  validateAssistantMemoryAccess,
} from "./executiveAssistantMemoryIntegrationAccessValidator.ts";
import {
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
} from "./executiveAssistantMemoryIntegrationCitationBuilder.ts";
import { createExecutiveAssistantMemoryRequest } from "./executiveAssistantMemoryIntegrationModel.ts";
import {
  EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS,
} from "./executiveAssistantMemoryIntegrationConstants.ts";
import { getAssistantRetrievalProfile } from "./executiveAssistantMemoryIntegrationProfileRegistry.ts";
import { resolveAssistantMemorySearchQuery } from "./executiveAssistantMemoryIntegrationResolver.ts";
import { recordExecutiveAssistantMemoryRetrieval } from "./executiveAssistantMemoryIntegrationStatistics.ts";
import type {
  CreateExecutiveAssistantMemoryRequestInput,
  ExecutiveAssistantMemoryRequest,
  ExecutiveAssistantMemoryResponse,
  ExecutiveAssistantMemorySelection,
} from "./executiveAssistantMemoryIntegrationTypes.ts";

function emptyResponse(
  reason: string,
  retrievalProfileId: string,
  executionTimeMs: number,
  error: ExecutiveAssistantMemoryResponse["error"] = null
): ExecutiveAssistantMemoryResponse {
  return Object.freeze({
    success: false,
    reason,
    selections: Object.freeze([]),
    permission: "read_denied",
    retrievalProfileId,
    executionTimeMs,
    error,
    readOnly: true as const,
  });
}

function buildSelections(input: {
  request: ExecutiveAssistantMemoryRequest;
  retrievalProfileId: string;
  rankingProfileId: string;
}): ExecutiveAssistantMemorySelection[] {
  const searchQuery = resolveAssistantMemorySearchQuery(input.request);
  const search = searchExecutiveMemories(searchQuery);
  if (!search.success) {
    return [];
  }

  const selections: ExecutiveAssistantMemorySelection[] = [];
  for (const ranked of search.rankedResults) {
    const access = evaluateExecutiveAssistantMemoryPermission({
      memoryId: ranked.record.record.id,
      allowArchived: input.request.allowArchived,
      allowLocked: input.request.allowLocked,
      includeSuperseded: input.request.includeSuperseded,
    });
    if (!access.allowed) continue;

    const rankingExplanation = explainExecutiveMemoryRanking({
      record: ranked.record,
      query: searchQuery,
      profileId: input.rankingProfileId,
    });

    const citation = buildAssistantMemoryCitation({
      record: ranked.record,
      retrievalProfileId: input.retrievalProfileId,
      rankingProfileId: input.rankingProfileId,
      selectionReasons: rankingExplanation.reasons.map((entry) => entry.reason),
    });
    if (!citation) continue;

    selections.push(
      Object.freeze({
        record: ranked.record,
        rank: ranked.rank,
        score: ranked.score,
        permission: access.permission,
        citation,
        explanation: explainAssistantMemorySelection({
          record: ranked.record,
          retrievalProfileId: input.retrievalProfileId,
          score: ranked.score,
          rankingReasons: rankingExplanation.reasons.map((entry) => entry.reason),
        }),
        readOnly: true as const,
      })
    );
  }

  return selections.sort((left, right) => {
    if (left.rank !== right.rank) return left.rank - right.rank;
    return left.record.record.id.localeCompare(right.record.record.id);
  });
}

export function retrieveAssistantMemory(
  input: CreateExecutiveAssistantMemoryRequestInput | ExecutiveAssistantMemoryRequest
): ExecutiveAssistantMemoryResponse {
  const started = Date.now();
  const request = "readOnly" in input ? input : createExecutiveAssistantMemoryRequest(input);
  const retrievalProfileId =
    request.retrievalProfileId ?? EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary;
  const profile = getAssistantRetrievalProfile(retrievalProfileId);

  const validation = validateAssistantMemoryAccess(request);
  if (!validation.valid) {
    const executionTimeMs = Date.now() - started;
    recordExecutiveAssistantMemoryRetrieval({
      executionTimeMs,
      retrievalProfileId,
      selectionCount: 0,
      denied: true,
    });
    return emptyResponse(
      validation.issues.map((entry) => entry.message).join("; "),
      retrievalProfileId,
      executionTimeMs,
      executiveAssistantMemoryIntegrationErrorFromCode(
        validation.issues.some((entry) => entry.code === "access_denied") ? "accessDenied" : "validationFailure",
        validation.issues.map((entry) => entry.message).join("; ")
      )
    );
  }

  if (request.recordId) {
    const stored = getStoredExecutiveMemoryById(request.recordId);
    if (!stored.success || !stored.data) {
      const executionTimeMs = Date.now() - started;
      return emptyResponse(
        `Memory not found: ${request.recordId}.`,
        retrievalProfileId,
        executionTimeMs,
        executiveAssistantMemoryIntegrationErrorFromCode("retrievalFailure", `Memory not found: ${request.recordId}.`)
      );
    }

    const access = evaluateExecutiveAssistantMemoryPermission({
      memoryId: request.recordId,
      allowArchived: request.allowArchived,
      allowLocked: request.allowLocked,
      includeSuperseded: request.includeSuperseded,
    });
    const rankingProfileId = profile?.rankingProfileId ?? "default";
    const searchQuery = resolveAssistantMemorySearchQuery(request);
    const rankingExplanation = explainExecutiveMemoryRanking({
      record: stored.data,
      query: searchQuery,
      profileId: rankingProfileId,
    });
    const citation = buildAssistantMemoryCitation({
      record: stored.data,
      retrievalProfileId,
      rankingProfileId,
      selectionReasons: rankingExplanation.reasons.map((entry) => entry.reason),
    });

    const executionTimeMs = Date.now() - started;
    recordExecutiveAssistantMemoryRetrieval({
      executionTimeMs,
      retrievalProfileId,
      selectionCount: citation ? 1 : 0,
      denied: !access.allowed,
    });

    if (!access.allowed || !citation) {
      return emptyResponse(access.reason, retrievalProfileId, executionTimeMs);
    }

    return Object.freeze({
      success: true,
      reason: "Assistant memory retrieved.",
      selections: Object.freeze([
        Object.freeze({
          record: stored.data,
          rank: 1,
          score: rankingExplanation.score,
          permission: access.permission,
          citation,
          explanation: explainAssistantMemorySelection({
            record: stored.data,
            retrievalProfileId,
            score: rankingExplanation.score,
            rankingReasons: rankingExplanation.reasons.map((entry) => entry.reason),
          }),
          readOnly: true as const,
        }),
      ]),
      permission: access.permission,
      retrievalProfileId,
      executionTimeMs,
      error: null,
      readOnly: true as const,
    });
  }

  const rankingProfileId = profile?.rankingProfileId ?? "default";
  const selections = buildSelections({ request, retrievalProfileId, rankingProfileId });
  const executionTimeMs = Date.now() - started;

  recordExecutiveAssistantMemoryRetrieval({
    executionTimeMs,
    retrievalProfileId,
    selectionCount: selections.length,
    denied: false,
  });

  return Object.freeze({
    success: true,
    reason: selections.length === 0 ? "No assistant-accessible memories matched." : "Assistant memories retrieved.",
    selections: Object.freeze(selections),
    permission: selections[0]?.permission ?? "read_allowed",
    retrievalProfileId,
    executionTimeMs,
    error: null,
    readOnly: true as const,
  });
}

export function retrieveAssistantMemoryByIntent(
  intentId: string,
  input: CreateExecutiveAssistantMemoryRequestInput = {}
) {
  return retrieveAssistantMemory(createExecutiveAssistantMemoryRequest({ ...input, intentId }));
}

export function retrieveAssistantMemoryByDecision(
  decisionId: string,
  input: CreateExecutiveAssistantMemoryRequestInput = {}
) {
  return retrieveAssistantMemory(createExecutiveAssistantMemoryRequest({ ...input, decisionId }));
}

export function retrieveAssistantMemoryByScenario(
  scenarioId: string,
  input: CreateExecutiveAssistantMemoryRequestInput = {}
) {
  return retrieveAssistantMemory(createExecutiveAssistantMemoryRequest({ ...input, scenarioId }));
}

export function retrieveAssistantMemoryByContext(
  contextId: string,
  input: CreateExecutiveAssistantMemoryRequestInput = {}
) {
  return retrieveAssistantMemory(createExecutiveAssistantMemoryRequest({ ...input, contextId }));
}

export function retrieveAssistantMemoryByWorkspace(
  workspaceId: string,
  input: CreateExecutiveAssistantMemoryRequestInput = {}
) {
  return retrieveAssistantMemory(createExecutiveAssistantMemoryRequest({ ...input, workspaceId }));
}

export const ExecutiveAssistantMemoryGateway = Object.freeze({
  retrieveAssistantMemory,
  retrieveAssistantMemoryByIntent,
  retrieveAssistantMemoryByDecision,
  retrieveAssistantMemoryByScenario,
  retrieveAssistantMemoryByContext,
  retrieveAssistantMemoryByWorkspace,
});
