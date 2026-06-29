/**
 * APP-4:12 — Executive Memory Dashboard Engine.
 */

import {
  aggregateExecutiveMemoryDashboardAssistantSummary,
  aggregateExecutiveMemoryDashboardCategorySummary,
  aggregateExecutiveMemoryDashboardIntegrity,
  aggregateExecutiveMemoryDashboardLifecycleSummary,
  aggregateExecutiveMemoryDashboardSearchSummary,
  aggregateExecutiveMemoryDashboardSummary,
  aggregateExecutiveMemoryDashboardUsage,
  aggregateExecutiveMemoryDashboardWorkspaceSummary,
} from "./executiveMemoryDashboardAggregator.ts";
import { EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION } from "./executiveMemoryDashboardConstants.ts";
import { executiveMemoryDashboardErrorFromCode } from "./executiveMemoryDashboardErrors.ts";
import { analyzeExecutiveMemoryDashboardHealth } from "./executiveMemoryDashboardHealthAnalyzer.ts";
import { loadExecutiveMemoryDashboardSources } from "./executiveMemoryDashboardProvider.ts";
import {
  getExecutiveMemoryDashboardStatistics,
  recordExecutiveMemoryDashboardRefresh,
  resetExecutiveMemoryDashboardStatisticsForTests,
} from "./executiveMemoryDashboardStatistics.ts";
import { validateExecutiveMemoryDashboard } from "./executiveMemoryDashboardValidator.ts";
import type {
  ExecutiveMemoryDashboard,
  ExecutiveMemoryDashboardAssistantSummary,
  ExecutiveMemoryDashboardCategorySummary,
  ExecutiveMemoryDashboardEngineState,
  ExecutiveMemoryDashboardHealth,
  ExecutiveMemoryDashboardHealthThresholds,
  ExecutiveMemoryDashboardIntegrity,
  ExecutiveMemoryDashboardLifecycleSummary,
  ExecutiveMemoryDashboardSearchSummary,
  ExecutiveMemoryDashboardSummary,
  ExecutiveMemoryDashboardUsage,
  ExecutiveMemoryDashboardWorkspaceSummary,
} from "./executiveMemoryDashboardTypes.ts";

let initialized = false;

export function initializeExecutiveMemoryDashboardEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveMemoryDashboardEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Memory Dashboard engine initialized.",
    state: getExecutiveMemoryDashboardEngineState(timestamp),
  });
}

export function isExecutiveMemoryDashboardEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveMemoryDashboardEngineState(
  timestamp: string
): ExecutiveMemoryDashboardEngineState {
  return Object.freeze({
    engineId: "executive-memory-dashboard-engine",
    contractVersion: EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION,
    initialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveMemoryDashboardEngineForTests(): void {
  initialized = false;
  resetExecutiveMemoryDashboardStatisticsForTests();
}

function buildDashboardSections(timestamp: string, thresholds?: ExecutiveMemoryDashboardHealthThresholds) {
  const started = Date.now();
  const sectionTimes: Record<string, number> = {};

  const sourceStarted = Date.now();
  const sources = loadExecutiveMemoryDashboardSources(timestamp);
  sectionTimes.sources = Date.now() - sourceStarted;

  const summaryStarted = Date.now();
  const summary = aggregateExecutiveMemoryDashboardSummary(sources);
  sectionTimes.summary = Date.now() - summaryStarted;

  const integrityStarted = Date.now();
  const integrity = aggregateExecutiveMemoryDashboardIntegrity(sources);
  sectionTimes.integrity = Date.now() - integrityStarted;

  const workspaceStarted = Date.now();
  const workspace = aggregateExecutiveMemoryDashboardWorkspaceSummary(sources);
  sectionTimes.workspace = Date.now() - workspaceStarted;

  const categoryStarted = Date.now();
  const category = aggregateExecutiveMemoryDashboardCategorySummary(sources);
  sectionTimes.category = Date.now() - categoryStarted;

  const lifecycleStarted = Date.now();
  const lifecycle = aggregateExecutiveMemoryDashboardLifecycleSummary(sources);
  sectionTimes.lifecycle = Date.now() - lifecycleStarted;

  const searchStarted = Date.now();
  const search = aggregateExecutiveMemoryDashboardSearchSummary(sources);
  sectionTimes.search = Date.now() - searchStarted;

  const assistantStarted = Date.now();
  const assistant = aggregateExecutiveMemoryDashboardAssistantSummary(sources);
  sectionTimes.assistant = Date.now() - assistantStarted;

  const usageStarted = Date.now();
  const usage = aggregateExecutiveMemoryDashboardUsage(search, assistant);
  sectionTimes.usage = Date.now() - usageStarted;

  const healthStarted = Date.now();
  const health = analyzeExecutiveMemoryDashboardHealth({ summary, integrity, assistant, thresholds });
  sectionTimes.health = Date.now() - healthStarted;

  const aggregationDurationMs = Date.now() - started;

  return Object.freeze({
    summary,
    health,
    integrity,
    lifecycle,
    workspace,
    category,
    search,
    assistant,
    usage,
    statistics: getExecutiveMemoryDashboardStatistics(),
    generatedAt: timestamp,
    aggregationDurationMs,
    sectionTimes,
  });
}

export function getExecutiveMemoryDashboard(
  timestamp: string,
  thresholds?: ExecutiveMemoryDashboardHealthThresholds
): ExecutiveMemoryDashboard {
  try {
    const built = buildDashboardSections(timestamp, thresholds);
    const candidate = Object.freeze({
      summary: built.summary,
      health: built.health,
      integrity: built.integrity,
      lifecycle: built.lifecycle,
      workspace: built.workspace,
      category: built.category,
      search: built.search,
      assistant: built.assistant,
      usage: built.usage,
      statistics: built.statistics,
      generatedAt: built.generatedAt,
      readOnly: true as const,
    });

    const validation = validateExecutiveMemoryDashboard(candidate);
    recordExecutiveMemoryDashboardRefresh({
      aggregationDurationMs: built.aggregationDurationMs,
      sectionTimesMs: built.sectionTimes,
      validationFailed: !validation.valid,
    });

    if (!validation.valid) {
      return Object.freeze({
        success: false,
        reason: validation.issues.map((entry) => entry.message).join("; "),
        ...candidate,
        statistics: getExecutiveMemoryDashboardStatistics(),
        error: executiveMemoryDashboardErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        ),
        readOnly: true as const,
      });
    }

    return Object.freeze({
      success: true,
      reason: "Executive Memory Dashboard generated.",
      ...candidate,
      statistics: getExecutiveMemoryDashboardStatistics(),
      error: null,
      readOnly: true as const,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard aggregation failed.";
    return Object.freeze({
      success: false,
      reason: message,
      summary: Object.freeze({
        totalMemories: 0,
        activeMemories: 0,
        archivedMemories: 0,
        supersededMemories: 0,
        mergedMemories: 0,
        splitMemories: 0,
        lockedMemories: 0,
        ungovernedMemories: 0,
        readOnly: true as const,
      }),
      health: Object.freeze({ level: "critical", indicators: Object.freeze([message]), readOnly: true as const }),
      integrity: Object.freeze({
        valid: false,
        brokenReferences: 0,
        invalidVersionChains: 0,
        orphanRecords: 0,
        validationFailures: 0,
        integrityWarnings: 0,
        recordsInspected: 0,
        readOnly: true as const,
      }),
      lifecycle: Object.freeze({
        versionCount: 0,
        mergeCount: 0,
        splitCount: 0,
        supersedeCount: 0,
        archiveCount: 0,
        retentionPolicyUsage: Object.freeze({}),
        readOnly: true as const,
      }),
      workspace: Object.freeze({
        activeWorkspaces: 0,
        memoriesPerWorkspace: Object.freeze({}),
        workspaceDistribution: Object.freeze([]),
        readOnly: true as const,
      }),
      category: Object.freeze({
        intentMemories: 0,
        scenarioMemories: 0,
        decisionMemories: 0,
        contextMemories: 0,
        otherMemories: 0,
        categoryCounts: Object.freeze({}),
        readOnly: true as const,
      }),
      search: Object.freeze({
        searchesExecuted: 0,
        rankingExecutions: 0,
        profileUsage: Object.freeze({}),
        averageSearchTimeMs: 0,
        averageResults: 0,
        readOnly: true as const,
      }),
      assistant: Object.freeze({
        retrievalCount: 0,
        citationCount: 0,
        profileUsage: Object.freeze({}),
        accessDenials: 0,
        averageRetrievalTimeMs: 0,
        readOnly: true as const,
      }),
      usage: Object.freeze({
        totalSearches: 0,
        totalAssistantRetrievals: 0,
        totalCitations: 0,
        totalAccessDenials: 0,
        readOnly: true as const,
      }),
      statistics: getExecutiveMemoryDashboardStatistics(),
      generatedAt: timestamp,
      error: executiveMemoryDashboardErrorFromCode("aggregationFailure", message),
      readOnly: true as const,
    });
  }
}

export function getExecutiveMemorySummary(timestamp: string): ExecutiveMemoryDashboardSummary {
  return aggregateExecutiveMemoryDashboardSummary(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemoryHealth(
  timestamp: string,
  thresholds?: ExecutiveMemoryDashboardHealthThresholds
): ExecutiveMemoryDashboardHealth {
  const sources = loadExecutiveMemoryDashboardSources(timestamp);
  const summary = aggregateExecutiveMemoryDashboardSummary(sources);
  const integrity = aggregateExecutiveMemoryDashboardIntegrity(sources);
  const assistant = aggregateExecutiveMemoryDashboardAssistantSummary(sources);
  return analyzeExecutiveMemoryDashboardHealth({ summary, integrity, assistant, thresholds });
}

export function getExecutiveMemoryIntegritySummary(timestamp: string): ExecutiveMemoryDashboardIntegrity {
  return aggregateExecutiveMemoryDashboardIntegrity(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemoryLifecycleSummary(timestamp: string): ExecutiveMemoryDashboardLifecycleSummary {
  return aggregateExecutiveMemoryDashboardLifecycleSummary(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemoryWorkspaceSummary(timestamp: string): ExecutiveMemoryDashboardWorkspaceSummary {
  return aggregateExecutiveMemoryDashboardWorkspaceSummary(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemoryCategorySummary(timestamp: string): ExecutiveMemoryDashboardCategorySummary {
  return aggregateExecutiveMemoryDashboardCategorySummary(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemorySearchSummary(timestamp: string): ExecutiveMemoryDashboardSearchSummary {
  return aggregateExecutiveMemoryDashboardSearchSummary(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemoryAssistantSummary(timestamp: string): ExecutiveMemoryDashboardAssistantSummary {
  return aggregateExecutiveMemoryDashboardAssistantSummary(loadExecutiveMemoryDashboardSources(timestamp));
}

export function getExecutiveMemoryUsageSummary(timestamp: string): ExecutiveMemoryDashboardUsage {
  const sources = loadExecutiveMemoryDashboardSources(timestamp);
  const search = aggregateExecutiveMemoryDashboardSearchSummary(sources);
  const assistant = aggregateExecutiveMemoryDashboardAssistantSummary(sources);
  return aggregateExecutiveMemoryDashboardUsage(search, assistant);
}

export const ExecutiveMemoryDashboardEngine = Object.freeze({
  initializeExecutiveMemoryDashboardEngine,
  isExecutiveMemoryDashboardEngineInitialized,
  getExecutiveMemoryDashboardEngineState,
  resetExecutiveMemoryDashboardEngineForTests,
  getExecutiveMemoryDashboard,
  getExecutiveMemorySummary,
  getExecutiveMemoryHealth,
  getExecutiveMemoryIntegritySummary,
  getExecutiveMemoryLifecycleSummary,
  getExecutiveMemoryWorkspaceSummary,
  getExecutiveMemoryCategorySummary,
  getExecutiveMemorySearchSummary,
  getExecutiveMemoryAssistantSummary,
  getExecutiveMemoryUsageSummary,
  getExecutiveMemoryDashboardStatistics,
  version: EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION,
});
