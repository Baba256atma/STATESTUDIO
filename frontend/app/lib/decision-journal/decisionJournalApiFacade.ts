/**
 * APP-8:7 — Decision Journal API facade.
 * Delegates to APP-8:2 through APP-8:6 public surfaces only.
 */

import {
  archiveDecisionJournalEntry,
  createDecisionJournalEntry,
  getDecisionJournalEntries,
  getDecisionJournalEntryById,
  updateDecisionJournalMetadata,
} from "./decisionJournalEngine.ts";
import {
  buildDecisionJournalEvidenceAssumptionModel,
  evaluateDecisionJournalAssumptions,
  evaluateDecisionJournalEvidence,
} from "./decisionJournalEvidenceAssumption.ts";
import {
  getDecisionJournalEntriesOrdered,
  getDecisionJournalRange,
  getDecisionJournalSummary,
  queryDecisionJournal,
} from "./decisionJournalQuery.ts";
import {
  buildDecisionJournalReflectionModel,
  extractDecisionJournalInsights,
} from "./decisionJournalReflection.ts";
import {
  buildDecisionJournalRetrospectiveModel,
  evaluateDecisionJournalOutcome,
  evaluateDecisionJournalRetrospective,
} from "./decisionJournalRetrospective.ts";
import {
  DECISION_JOURNAL_API_CONTRACT_VERSION,
  DECISION_JOURNAL_API_ERROR_CODES,
  apiError,
  apiFailure,
  apiSuccess,
  type DecisionJournalApi,
  type DecisionJournalApiCertificationResult,
  type DecisionJournalApiReflectionSummary,
  type DecisionJournalApiResponse,
} from "./decisionJournalApiTypes.ts";

function engineFailure<T>(reason: string): DecisionJournalApiResponse<T> {
  return apiFailure(reason, [apiError(DECISION_JOURNAL_API_ERROR_CODES.validationFailure, reason)]);
}

function entryNotFoundFailure<T>(): DecisionJournalApiResponse<T> {
  return apiFailure("Entry not found.", [
    apiError(DECISION_JOURNAL_API_ERROR_CODES.entryNotFound, "Entry not found.", "entryId"),
  ]);
}

function resolveEntry(entryId: string, workspaceId: string) {
  const entry = getDecisionJournalEntryById(entryId);
  if (!entry || entry.workspaceId !== workspaceId) {
    return null;
  }
  return entry;
}

export function createDecisionJournalApiFacade(
  certificationRunner?: () => DecisionJournalApiCertificationResult
): DecisionJournalApi {
  return Object.freeze({
    entries: Object.freeze({
      createEntry: (input) => {
        const result = createDecisionJournalEntry(input);
        return result.success && result.data
          ? apiSuccess("Entry created.", result.data)
          : engineFailure(result.reason);
      },
      getEntryById: (entryId) => apiSuccess("Entry retrieved.", getDecisionJournalEntryById(entryId)),
      getEntries: (workspaceId) => apiSuccess("Entries retrieved.", getDecisionJournalEntries(workspaceId)),
      updateEntryMetadata: (input) => {
        const result = updateDecisionJournalMetadata(input);
        return result.success && result.data
          ? apiSuccess("Entry metadata updated.", result.data)
          : engineFailure(result.reason);
      },
      archiveEntry: (entryId, workspaceId) => {
        const result = archiveDecisionJournalEntry(entryId, workspaceId);
        return result.success && result.data
          ? apiSuccess("Entry archived.", result.data)
          : engineFailure(result.reason);
      },
    }),
    query: Object.freeze({
      queryJournal: (filters) => {
        const result = queryDecisionJournal(filters);
        return result.success && result.data
          ? apiSuccess("Journal queried.", result.data)
          : engineFailure(result.reason);
      },
      getOrderedEntries: (filters) =>
        apiSuccess("Ordered entries retrieved.", getDecisionJournalEntriesOrdered(filters)),
      getRange: (workspaceId, updatedAtFrom, updatedAtTo, direction) => {
        const result = getDecisionJournalRange(workspaceId, updatedAtFrom, updatedAtTo, direction);
        return result.success && result.data
          ? apiSuccess("Journal range retrieved.", result.data)
          : engineFailure(result.reason);
      },
      getSummary: (filters) => apiSuccess("Journal summary retrieved.", getDecisionJournalSummary(filters)),
    }),
    reflection: Object.freeze({
      buildReflection: (input) => {
        const result = buildDecisionJournalReflectionModel(input);
        return result.success && result.data
          ? apiSuccess("Reflection model built.", result.data)
          : engineFailure(result.reason);
      },
      extractInsights: (input) => {
        const entries = getDecisionJournalEntriesOrdered({
          workspaceId: input.workspaceId,
          includeArchived: input.includeArchived,
        });
        return apiSuccess("Insights extracted.", extractDecisionJournalInsights(entries, input.workspaceId));
      },
      getReflectionSummary: (input) => {
        const result = buildDecisionJournalReflectionModel(input);
        if (!result.success || !result.data) {
          return engineFailure(result.reason);
        }
        const summary: DecisionJournalApiReflectionSummary = Object.freeze({
          workspaceId: result.data.workspaceId,
          entryCount: result.data.entryCount,
          insightCount: result.data.insightItems.length,
          evidenceSummary: result.data.evidenceSummary,
          confidenceSummary: result.data.confidenceSummary,
          reviewSummary: result.data.reviewSummary,
          generatedAt: result.data.generatedAt,
          readOnly: true as const,
        });
        return apiSuccess("Reflection summary retrieved.", summary);
      },
    }),
    quality: Object.freeze({
      buildEvidenceAssumptionModel: (input) => {
        const result = buildDecisionJournalEvidenceAssumptionModel(input);
        return result.success && result.data
          ? apiSuccess("Evidence/assumption model built.", result.data)
          : engineFailure(result.reason);
      },
      evaluateEvidence: (entryId, workspaceId) => {
        const entry = resolveEntry(entryId, workspaceId);
        if (!entry) {
          return entryNotFoundFailure();
        }
        return apiSuccess("Evidence evaluated.", evaluateDecisionJournalEvidence(entry));
      },
      evaluateAssumptions: (entryId, workspaceId) => {
        const entry = resolveEntry(entryId, workspaceId);
        if (!entry) {
          return entryNotFoundFailure();
        }
        return apiSuccess("Assumptions evaluated.", evaluateDecisionJournalAssumptions(entry));
      },
      detectQualityFlags: (input) => {
        const result = buildDecisionJournalEvidenceAssumptionModel(input);
        return result.success && result.data
          ? apiSuccess("Quality flags detected.", result.data.qualityFlags)
          : engineFailure(result.reason);
      },
    }),
    retrospective: Object.freeze({
      buildRetrospectiveModel: (input) => {
        const result = buildDecisionJournalRetrospectiveModel(input);
        return result.success && result.data
          ? apiSuccess("Retrospective model built.", result.data)
          : engineFailure(result.reason);
      },
      evaluateOutcome: (entryId, workspaceId) => {
        const entry = resolveEntry(entryId, workspaceId);
        if (!entry) {
          return entryNotFoundFailure();
        }
        return apiSuccess("Outcome evaluated.", evaluateDecisionJournalOutcome(entry));
      },
      evaluateRetrospective: (entryId, workspaceId) => {
        const entry = resolveEntry(entryId, workspaceId);
        if (!entry) {
          return entryNotFoundFailure();
        }
        const evidenceModel = evaluateDecisionJournalEvidence(entry);
        const assumptionModel = evaluateDecisionJournalAssumptions(entry);
        return apiSuccess(
          "Retrospective evaluated.",
          evaluateDecisionJournalRetrospective(entry, evidenceModel, assumptionModel)
        );
      },
    }),
    certification: Object.freeze({
      runCertification: () => {
        if (!certificationRunner) {
          return engineFailure("Certification runner is not bound.");
        }
        const result = certificationRunner();
        return apiSuccess(result.summary, result);
      },
    }),
    version: DECISION_JOURNAL_API_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const DecisionJournalApiFacade = Object.freeze({
  createDecisionJournalApiFacade,
});
