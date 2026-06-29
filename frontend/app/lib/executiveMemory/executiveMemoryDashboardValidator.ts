/**
 * APP-4:12 — Executive Memory Dashboard validator.
 */

import type {
  ExecutiveMemoryDashboard,
  ExecutiveMemoryDashboardCategorySummary,
  ExecutiveMemoryDashboardSummary,
  ExecutiveMemoryDashboardValidationIssue,
  ExecutiveMemoryDashboardValidationResult,
  ExecutiveMemoryDashboardWorkspaceSummary,
} from "./executiveMemoryDashboardTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveMemoryDashboardValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveMemoryDashboardValidationIssue[]): ExecutiveMemoryDashboardValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function validateNonNegative(value: number, field: string, issues: ExecutiveMemoryDashboardValidationIssue[]): void {
  if (value < 0 || !Number.isFinite(value)) {
    issues.push(issue("invalid_dashboard_section", `${field} must be a non-negative finite number.`, field));
  }
}

function validateSummaryConsistency(
  summary: ExecutiveMemoryDashboardSummary,
  workspace: ExecutiveMemoryDashboardWorkspaceSummary,
  category: ExecutiveMemoryDashboardCategorySummary,
  issues: ExecutiveMemoryDashboardValidationIssue[]
): void {
  validateNonNegative(summary.totalMemories, "summary.totalMemories", issues);
  validateNonNegative(summary.activeMemories, "summary.activeMemories", issues);

  const workspaceTotal = Object.values(workspace.memoriesPerWorkspace).reduce((sum, count) => sum + count, 0);
  if (workspaceTotal !== summary.totalMemories) {
    issues.push(
      issue(
        "invalid_dashboard_section",
        "Workspace memory totals do not match platform summary.",
        "workspace.memoriesPerWorkspace"
      )
    );
  }

  const categoryTotal =
    category.intentMemories +
    category.scenarioMemories +
    category.decisionMemories +
    category.contextMemories +
    category.otherMemories;
  if (categoryTotal !== summary.totalMemories) {
    issues.push(
      issue(
        "invalid_dashboard_section",
        "Category memory totals do not match platform summary.",
        "category.categoryCounts"
      )
    );
  }
}

export function validateExecutiveMemoryDashboard(
  dashboard: Omit<ExecutiveMemoryDashboard, "success" | "reason" | "error">
): ExecutiveMemoryDashboardValidationResult {
  const issues: ExecutiveMemoryDashboardValidationIssue[] = [];

  if (!dashboard.generatedAt || dashboard.generatedAt.trim().length === 0) {
    issues.push(issue("invalid_dashboard_section", "generatedAt is required.", "generatedAt"));
  }

  validateSummaryConsistency(dashboard.summary, dashboard.workspace, dashboard.category, issues);
  validateNonNegative(dashboard.lifecycle.versionCount, "lifecycle.versionCount", issues);
  validateNonNegative(dashboard.search.searchesExecuted, "search.searchesExecuted", issues);
  validateNonNegative(dashboard.assistant.retrievalCount, "assistant.retrievalCount", issues);
  validateNonNegative(dashboard.usage.totalSearches, "usage.totalSearches", issues);

  if (dashboard.usage.totalSearches !== dashboard.search.searchesExecuted) {
    issues.push(
      issue("invalid_dashboard_section", "Usage search total inconsistent with search summary.", "usage.totalSearches")
    );
  }

  if (dashboard.usage.totalAssistantRetrievals !== dashboard.assistant.retrievalCount) {
    issues.push(
      issue(
        "invalid_dashboard_section",
        "Usage assistant retrieval total inconsistent with assistant summary.",
        "usage.totalAssistantRetrievals"
      )
    );
  }

  const requiredSections = [
    "summary",
    "health",
    "integrity",
    "lifecycle",
    "workspace",
    "category",
    "search",
    "assistant",
    "usage",
    "statistics",
  ] as const;
  for (const section of requiredSections) {
    if (dashboard[section] === undefined || dashboard[section] === null) {
      issues.push(issue("missing_statistics", `Missing dashboard section: ${section}.`, section));
    }
  }

  return result(issues);
}

export const ExecutiveMemoryDashboardValidator = Object.freeze({
  validateExecutiveMemoryDashboard,
});
