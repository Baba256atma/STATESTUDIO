/**
 * APP-2:12 — Executive Scenario Dashboard card model.
 * Dashboard card projections — no intelligence generation.
 */

export const EXECUTIVE_SCENARIO_DASHBOARD_CARDS_VERSION = "APP-2/12" as const;

export type ExecutiveScenarioDashboardCardKind =
  | "executive_summary"
  | "priority"
  | "dependency"
  | "conflict"
  | "opportunity"
  | "recommendation"
  | "risk"
  | "kpi"
  | "timeline";

export type ExecutiveScenarioDashboardEvidenceSource =
  | "summary"
  | "recommendation_portfolio"
  | "priority"
  | "dependency_graph"
  | "conflict_graph"
  | "opportunity_graph"
  | "risk"
  | "kpi";

export type ExecutiveScenarioDashboardCardEvidence = Readonly<{
  evidenceRefId: string;
  source: ExecutiveScenarioDashboardEvidenceSource;
  sourceRef: string;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveScenarioDashboardCard = Readonly<{
  cardId: string;
  kind: ExecutiveScenarioDashboardCardKind;
  title: string;
  content: string;
  evidence: readonly ExecutiveScenarioDashboardCardEvidence[];
  readOnly: true;
}>;

export const EXECUTIVE_SCENARIO_DASHBOARD_CARD_KINDS = Object.freeze([
  "executive_summary",
  "priority",
  "dependency",
  "conflict",
  "opportunity",
  "recommendation",
  "risk",
  "kpi",
  "timeline",
] as const satisfies readonly ExecutiveScenarioDashboardCardKind[]);

export const EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS = Object.freeze({
  executiveSummary: "dashboard-card-executive-summary",
  priority: "dashboard-card-priority",
  dependency: "dashboard-card-dependency",
  conflict: "dashboard-card-conflict",
  opportunity: "dashboard-card-opportunity",
  recommendation: "dashboard-card-recommendation",
  risk: "dashboard-card-risk",
  kpi: "dashboard-card-kpi",
  timeline: "dashboard-card-timeline",
} as const);

export function createExecutiveScenarioDashboardCard(
  input: Omit<ExecutiveScenarioDashboardCard, "readOnly">
): ExecutiveScenarioDashboardCard {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioDashboardCardEvidence(
  input: Omit<ExecutiveScenarioDashboardCardEvidence, "readOnly">
): ExecutiveScenarioDashboardCardEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function mapSummarySourceToDashboardEvidenceSource(
  source: string
): ExecutiveScenarioDashboardEvidenceSource {
  if (source === "dependency_graph") return "dependency_graph";
  if (source === "conflict_graph") return "conflict_graph";
  if (source === "opportunity_graph") return "opportunity_graph";
  if (source === "priority") return "priority";
  if (source === "risk") return "risk";
  if (source === "kpi") return "kpi";
  return "summary";
}
