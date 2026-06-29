/**
 * APP-4:12 — Executive Memory Dashboard domain types.
 */

import type {
  EXECUTIVE_MEMORY_DASHBOARD_HEALTH_LEVELS,
} from "./executiveMemoryDashboardConstants.ts";

export type ExecutiveMemoryDashboardHealthLevel =
  (typeof EXECUTIVE_MEMORY_DASHBOARD_HEALTH_LEVELS)[number];

export type ExecutiveMemoryDashboardSummary = Readonly<{
  totalMemories: number;
  activeMemories: number;
  archivedMemories: number;
  supersededMemories: number;
  mergedMemories: number;
  splitMemories: number;
  lockedMemories: number;
  ungovernedMemories: number;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardHealth = Readonly<{
  level: ExecutiveMemoryDashboardHealthLevel;
  indicators: readonly string[];
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardIntegrity = Readonly<{
  valid: boolean;
  brokenReferences: number;
  invalidVersionChains: number;
  orphanRecords: number;
  validationFailures: number;
  integrityWarnings: number;
  recordsInspected: number;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardWorkspaceEntry = Readonly<{
  workspaceId: string;
  memoryCount: number;
  percentage: number;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardWorkspaceSummary = Readonly<{
  activeWorkspaces: number;
  memoriesPerWorkspace: Readonly<Record<string, number>>;
  workspaceDistribution: readonly ExecutiveMemoryDashboardWorkspaceEntry[];
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardCategorySummary = Readonly<{
  intentMemories: number;
  scenarioMemories: number;
  decisionMemories: number;
  contextMemories: number;
  otherMemories: number;
  categoryCounts: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardLifecycleSummary = Readonly<{
  versionCount: number;
  mergeCount: number;
  splitCount: number;
  supersedeCount: number;
  archiveCount: number;
  retentionPolicyUsage: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardSearchSummary = Readonly<{
  searchesExecuted: number;
  rankingExecutions: number;
  profileUsage: Readonly<Record<string, number>>;
  averageSearchTimeMs: number;
  averageResults: number;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardAssistantSummary = Readonly<{
  retrievalCount: number;
  citationCount: number;
  profileUsage: Readonly<Record<string, number>>;
  accessDenials: number;
  averageRetrievalTimeMs: number;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardUsage = Readonly<{
  totalSearches: number;
  totalAssistantRetrievals: number;
  totalCitations: number;
  totalAccessDenials: number;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardStatistics = Readonly<{
  dashboardRefreshes: number;
  lastAggregationDurationMs: number;
  totalAggregationDurationMs: number;
  averageAggregationDurationMs: number;
  validationFailures: number;
  sectionGenerationTimesMs: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboard = Readonly<{
  success: boolean;
  reason: string;
  summary: ExecutiveMemoryDashboardSummary;
  health: ExecutiveMemoryDashboardHealth;
  integrity: ExecutiveMemoryDashboardIntegrity;
  lifecycle: ExecutiveMemoryDashboardLifecycleSummary;
  workspace: ExecutiveMemoryDashboardWorkspaceSummary;
  category: ExecutiveMemoryDashboardCategorySummary;
  search: ExecutiveMemoryDashboardSearchSummary;
  assistant: ExecutiveMemoryDashboardAssistantSummary;
  usage: ExecutiveMemoryDashboardUsage;
  statistics: ExecutiveMemoryDashboardStatistics;
  generatedAt: string;
  error: ExecutiveMemoryDashboardError | null;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardEngineState = Readonly<{
  engineId: "executive-memory-dashboard-engine";
  contractVersion: string;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardHealthThresholds = Readonly<{
  integrityViolationWarning: number;
  integrityViolationCritical: number;
  ungovernedRecordWarning: number;
  archivedRatioWarning: number;
  accessDenialWarning: number;
  accessDenialCritical: number;
}>;

export type ExecutiveMemoryDashboardValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryDashboardValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveMemoryDashboardValidationIssue[];
  readOnly: true;
}>;
