/**
 * APP-4:12 — Executive Memory Dashboard aggregator.
 */

import { EXECUTIVE_MEMORY_DASHBOARD_CATEGORY_GROUPS } from "./executiveMemoryDashboardConstants.ts";
import type { ExecutiveMemoryDashboardSourceSnapshot } from "./executiveMemoryDashboardProvider.ts";
import type {
  ExecutiveMemoryDashboardAssistantSummary,
  ExecutiveMemoryDashboardCategorySummary,
  ExecutiveMemoryDashboardIntegrity,
  ExecutiveMemoryDashboardLifecycleSummary,
  ExecutiveMemoryDashboardSearchSummary,
  ExecutiveMemoryDashboardSummary,
  ExecutiveMemoryDashboardUsage,
  ExecutiveMemoryDashboardWorkspaceSummary,
} from "./executiveMemoryDashboardTypes.ts";

function countGovernanceState(
  lifecycles: ExecutiveMemoryDashboardSourceSnapshot["lifecycles"],
  state: string
): number {
  return lifecycles.filter((entry) => entry.governanceState === state).length;
}

export function aggregateExecutiveMemoryDashboardSummary(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardSummary {
  const lifecycleIds = new Set(sources.lifecycles.map((entry) => entry.memoryId));
  const ungovernedMemories = sources.records.filter((entry) => !lifecycleIds.has(entry.record.id)).length;

  return Object.freeze({
    totalMemories: sources.records.length,
    activeMemories:
      countGovernanceState(sources.lifecycles, "active") +
      ungovernedMemories,
    archivedMemories: countGovernanceState(sources.lifecycles, "archived"),
    supersededMemories: countGovernanceState(sources.lifecycles, "superseded"),
    mergedMemories: countGovernanceState(sources.lifecycles, "merged"),
    splitMemories: countGovernanceState(sources.lifecycles, "split"),
    lockedMemories: countGovernanceState(sources.lifecycles, "locked"),
    ungovernedMemories,
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardIntegrity(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardIntegrity {
  let brokenReferences = 0;
  let invalidVersionChains = 0;
  let orphanRecords = 0;
  let validationFailures = 0;
  let integrityWarnings = 0;

  for (const issue of sources.integrityReport.issues) {
    const message = issue.message.toLowerCase();
    if (message.includes("broken reference")) {
      brokenReferences += 1;
    } else if (message.includes("version")) {
      invalidVersionChains += 1;
    } else if (message.includes("orphan")) {
      orphanRecords += 1;
    } else if (message.includes("without lifecycle governance")) {
      integrityWarnings += 1;
    } else {
      validationFailures += 1;
    }
  }

  return Object.freeze({
    valid: sources.integrityReport.valid,
    brokenReferences,
    invalidVersionChains,
    orphanRecords,
    validationFailures,
    integrityWarnings,
    recordsInspected: sources.integrityReport.recordsInspected,
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardWorkspaceSummary(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardWorkspaceSummary {
  const memoriesPerWorkspace: Record<string, number> = {};
  for (const record of sources.records) {
    const workspaceId = record.record.workspaceId;
    memoriesPerWorkspace[workspaceId] = (memoriesPerWorkspace[workspaceId] ?? 0) + 1;
  }

  const total = sources.records.length;
  const workspaceDistribution = Object.entries(memoriesPerWorkspace)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([workspaceId, memoryCount]) =>
      Object.freeze({
        workspaceId,
        memoryCount,
        percentage: total === 0 ? 0 : memoryCount / total,
        readOnly: true as const,
      })
    );

  return Object.freeze({
    activeWorkspaces: workspaceDistribution.length,
    memoriesPerWorkspace: Object.freeze({ ...memoriesPerWorkspace }),
    workspaceDistribution: Object.freeze(workspaceDistribution),
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardCategorySummary(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardCategorySummary {
  const categoryCounts: Record<string, number> = {};
  for (const record of sources.records) {
    const category = record.record.category;
    categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
  }

  const intentMemories = categoryCounts[EXECUTIVE_MEMORY_DASHBOARD_CATEGORY_GROUPS.intent] ?? 0;
  const scenarioMemories = categoryCounts[EXECUTIVE_MEMORY_DASHBOARD_CATEGORY_GROUPS.scenario] ?? 0;
  const decisionMemories = categoryCounts[EXECUTIVE_MEMORY_DASHBOARD_CATEGORY_GROUPS.decision] ?? 0;
  const contextMemories = categoryCounts[EXECUTIVE_MEMORY_DASHBOARD_CATEGORY_GROUPS.context] ?? 0;
  const groupedTotal = intentMemories + scenarioMemories + decisionMemories + contextMemories;

  return Object.freeze({
    intentMemories,
    scenarioMemories,
    decisionMemories,
    contextMemories,
    otherMemories: Math.max(0, sources.records.length - groupedTotal),
    categoryCounts: Object.freeze({ ...categoryCounts }),
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardLifecycleSummary(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardLifecycleSummary {
  return Object.freeze({
    versionCount: sources.lifecycleStatistics.totalVersions,
    mergeCount: sources.mergeOperations.length,
    splitCount: sources.splitOperations.length,
    supersedeCount: sources.supersedeOperations.length,
    archiveCount: sources.lifecycleStatistics.archivedMemories,
    retentionPolicyUsage: Object.freeze({ ...sources.lifecycleStatistics.retentionPolicyUsage }),
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardSearchSummary(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardSearchSummary {
  return Object.freeze({
    searchesExecuted: sources.searchStatistics.searchesExecuted,
    rankingExecutions: sources.searchStatistics.rankingsExecuted,
    profileUsage: Object.freeze({ ...sources.searchStatistics.profileUsage }),
    averageSearchTimeMs: sources.searchStatistics.averageExecutionTimeMs,
    averageResults: sources.searchStatistics.averageResults,
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardAssistantSummary(
  sources: ExecutiveMemoryDashboardSourceSnapshot
): ExecutiveMemoryDashboardAssistantSummary {
  return Object.freeze({
    retrievalCount: sources.assistantStatistics.assistantRetrievalCount,
    citationCount: sources.assistantStatistics.citationCount,
    profileUsage: Object.freeze({ ...sources.assistantStatistics.profileUsage }),
    accessDenials: sources.assistantStatistics.accessDenialCount,
    averageRetrievalTimeMs: sources.assistantStatistics.averageRetrievalTimeMs,
    readOnly: true as const,
  });
}

export function aggregateExecutiveMemoryDashboardUsage(
  search: ExecutiveMemoryDashboardSearchSummary,
  assistant: ExecutiveMemoryDashboardAssistantSummary
): ExecutiveMemoryDashboardUsage {
  return Object.freeze({
    totalSearches: search.searchesExecuted,
    totalAssistantRetrievals: assistant.retrievalCount,
    totalCitations: assistant.citationCount,
    totalAccessDenials: assistant.accessDenials,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryDashboardAggregator = Object.freeze({
  aggregateExecutiveMemoryDashboardSummary,
  aggregateExecutiveMemoryDashboardIntegrity,
  aggregateExecutiveMemoryDashboardWorkspaceSummary,
  aggregateExecutiveMemoryDashboardCategorySummary,
  aggregateExecutiveMemoryDashboardLifecycleSummary,
  aggregateExecutiveMemoryDashboardSearchSummary,
  aggregateExecutiveMemoryDashboardAssistantSummary,
  aggregateExecutiveMemoryDashboardUsage,
});
