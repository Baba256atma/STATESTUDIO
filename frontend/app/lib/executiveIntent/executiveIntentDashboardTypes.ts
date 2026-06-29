/**
 * APP-3:13 — Executive Intent dashboard types.
 * Presentation metadata only — consumes APP-3:11 reasoning model.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { DashboardIntentDiagnostic } from "./executiveIntentDashboardDiagnostics.ts";

export const EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION = "APP-3/13" as const;

export type DashboardIntentStatus =
  | "ready"
  | "needs_clarification"
  | "blocked"
  | "archived"
  | "incomplete"
  | "unknown";

export type DashboardIntentSectionKey =
  | "executive_summary"
  | "intent_overview"
  | "current_state"
  | "classification"
  | "confidence"
  | "conflicts"
  | "dependencies"
  | "evolution"
  | "known_information"
  | "unknown_information"
  | "highlights"
  | "issues"
  | "readiness"
  | "diagnostics";

export type DashboardIntentCardKey =
  | "executive_summary"
  | "intent"
  | "state"
  | "confidence"
  | "conflict"
  | "dependency"
  | "evolution"
  | "unknowns"
  | "readiness";

export type DashboardIntentMetricKey =
  | "confidence_score"
  | "conflict_count"
  | "dependency_count"
  | "unknown_count"
  | "evolution_depth"
  | "classification_count"
  | "readiness_state"
  | "highlight_count"
  | "issue_count";

export type DashboardIntentBadgeKey =
  | "ready"
  | "blocked"
  | "needs_clarification"
  | "high_confidence"
  | "conflict_detected"
  | "dependency_present"
  | "recently_updated"
  | "archived"
  | "future_compatible";

export type DashboardIntentWidgetKey =
  | "summary"
  | "status"
  | "confidence"
  | "conflict"
  | "dependency"
  | "evolution"
  | "readiness"
  | "unknowns";

export type DashboardIntentSection = Readonly<{
  sectionId: string;
  sectionKey: DashboardIntentSectionKey;
  title: string;
  body: string;
  available: boolean;
  layoutPanelId: string | null;
  readOnly: true;
}>;

export type DashboardIntentCard = Readonly<{
  cardId: string;
  cardKey: DashboardIntentCardKey;
  title: string;
  subtitle: string;
  body: string;
  available: boolean;
  emphasis: "primary" | "secondary" | "neutral" | "warning" | "critical";
  readOnly: true;
}>;

export type DashboardIntentMetric = Readonly<{
  metricId: string;
  metricKey: DashboardIntentMetricKey;
  label: string;
  value: string;
  numericValue: number | null;
  unit: string | null;
  readOnly: true;
}>;

export type DashboardIntentBadge = Readonly<{
  badgeId: string;
  badgeKey: DashboardIntentBadgeKey;
  label: string;
  active: boolean;
  readOnly: true;
}>;

export type DashboardIntentWidget = Readonly<{
  widgetId: string;
  widgetKey: DashboardIntentWidgetKey;
  title: string;
  description: string;
  layoutPanelId: string;
  cardKeys: readonly DashboardIntentCardKey[];
  metricKeys: readonly DashboardIntentMetricKey[];
  available: boolean;
  readOnly: true;
}>;

export type DashboardIntentSummary = Readonly<{
  summaryId: string;
  headline: string;
  intentLabel: string;
  status: DashboardIntentStatus;
  confidenceLevel: string | null;
  primaryClassification: string | null;
  metricCount: number;
  cardCount: number;
  badgeCount: number;
  readOnly: true;
}>;

export type DashboardIntentFlags = Readonly<{
  dashboardReady: boolean;
  reasoningAvailable: boolean;
  readyForDashboard: boolean;
  hasConflicts: boolean;
  hasDependencies: boolean;
  hasEvolutionHistory: boolean;
  lowConfidence: boolean;
  multipleUnknowns: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type DashboardIntentMetadata = Readonly<{
  dashboardIntegrationVersion: typeof EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION;
  reasoningEngineVersion: string | null;
  reasoningId: string | null;
  assistantIntegrationVersion: string | null;
  enginesConsumed: readonly string[];
  layoutId: string | null;
  sectionCount: number;
  widgetCount: number;
  readOnly: true;
}>;

export type DashboardIntentModel = Readonly<{
  modelId: string;
  workspaceId: ExecutiveIntentWorkspaceId | null;
  focusIntentId: IntentIdentifier | null;
  status: DashboardIntentStatus;
  summary: DashboardIntentSummary;
  sections: readonly DashboardIntentSection[];
  cards: readonly DashboardIntentCard[];
  metrics: readonly DashboardIntentMetric[];
  badges: readonly DashboardIntentBadge[];
  widgets: readonly DashboardIntentWidget[];
  flags: DashboardIntentFlags;
  diagnostics: readonly DashboardIntentDiagnostic[];
  metadata: DashboardIntentMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type DashboardIntentValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:14 extension. */
export type DashboardIntentFutureExtension = Readonly<{
  platformCertificationBindings: null;
  layoutRenderingBindings: null;
}>;

export const DASHBOARD_FUTURE_EXTENSION: DashboardIntentFutureExtension = Object.freeze({
  platformCertificationBindings: null,
  layoutRenderingBindings: null,
});

export function createDashboardIntentModel(
  input: Omit<DashboardIntentModel, "readOnly">
): DashboardIntentModel {
  return Object.freeze({ ...input, readOnly: true as const });
}
