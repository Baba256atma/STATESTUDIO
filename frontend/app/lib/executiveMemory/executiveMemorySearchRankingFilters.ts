/**
 * APP-4:9 — Executive Memory Search post-filter utilities.
 */

import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type { ExecutiveMemorySearchQuery } from "./executiveMemorySearchRankingTypes.ts";

function recordReferences(record: ExecutiveMemoryStoredRecord): readonly { referenceType: string; targetId: string }[] {
  const entries = [
    ...record.record.references,
    ...record.record.metadata.references,
  ];
  return entries;
}

function matchesRiskOrKpi(record: ExecutiveMemoryStoredRecord, type: "risk" | "kpi", targetId: string): boolean {
  return recordReferences(record).some(
    (reference) => reference.referenceType === type && reference.targetId === targetId
  );
}

export function applyExecutiveMemorySearchPostFilters(
  records: readonly ExecutiveMemoryStoredRecord[],
  query: ExecutiveMemorySearchQuery
): ExecutiveMemoryStoredRecord[] {
  return records.filter((record) => {
    if (query.contextId) {
      const contextId = record.record.businessContext?.contextId ?? null;
      if (contextId !== query.contextId) return false;
    }
    if (query.riskId && !matchesRiskOrKpi(record, "risk", query.riskId)) return false;
    if (query.kpiId && !matchesRiskOrKpi(record, "kpi", query.kpiId)) return false;

    const score = record.record.confidence?.score;
    if (query.confidenceMin !== undefined) {
      if (score === undefined || score === null || score < query.confidenceMin) return false;
    }
    if (query.confidenceMax !== undefined) {
      if (score === undefined || score === null || score > query.confidenceMax) return false;
    }

    return true;
  });
}

export function mapExecutiveMemorySearchQueryToRetrievalInput(
  query: ExecutiveMemorySearchQuery
): Readonly<{
  id?: string;
  workspaceId?: string;
  goalId?: string;
  intentId?: string;
  scenarioId?: string;
  decisionId?: string;
  category?: string;
  providerId?: string;
  tags?: readonly string[];
  referenceIds?: readonly string[];
  lifecycleState?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  limit?: number;
  offset?: number;
}> {
  return Object.freeze({
    id: query.recordId,
    workspaceId: query.workspaceId,
    goalId: query.goalId,
    intentId: query.intentId,
    scenarioId: query.scenarioId,
    decisionId: query.decisionId,
    category: query.category,
    providerId: query.providerId,
    tags: query.tags,
    referenceIds: query.referenceIds,
    lifecycleState: query.lifecycleState,
    createdAfter: query.createdAfter,
    createdBefore: query.createdBefore,
    updatedAfter: query.updatedAfter,
    updatedBefore: query.updatedBefore,
    limit: query.limit,
    offset: query.offset,
  });
}

export function trackExecutiveMemorySearchFilterUsage(
  query: ExecutiveMemorySearchQuery
): readonly string[] {
  const used: string[] = [];
  if (query.recordId) used.push("recordId");
  if (query.workspaceId) used.push("workspaceId");
  if (query.goalId) used.push("goalId");
  if (query.intentId) used.push("intentId");
  if (query.scenarioId) used.push("scenarioId");
  if (query.decisionId) used.push("decisionId");
  if (query.contextId) used.push("contextId");
  if (query.category) used.push("category");
  if (query.providerId) used.push("providerId");
  if (query.tags?.length) used.push("tags");
  if (query.referenceIds?.length) used.push("referenceIds");
  if (query.riskId) used.push("riskId");
  if (query.kpiId) used.push("kpiId");
  if (query.lifecycleState) used.push("lifecycleState");
  if (query.confidenceMin !== undefined || query.confidenceMax !== undefined) used.push("confidenceRange");
  if (query.createdAfter || query.createdBefore) used.push("createdDate");
  if (query.updatedAfter || query.updatedBefore) used.push("updatedDate");
  return Object.freeze(used);
}
