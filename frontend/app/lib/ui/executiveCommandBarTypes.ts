/** E2:15 — Executive top command bar contracts. */
// E2:16 Executive quick actions
// D4 Decision intelligence
// D6 Simulation execution
// D7 Advisory recommendations
// D8 Strategic memory
// D9 Governance review
// D10 Production readiness insights

import type { NexoraPipelineStatusUi } from "../../screens/nexoraPipelineStatus";

export type ExecutivePrioritySemantic = "normal" | "attention" | "warning" | "critical";

export type ExecutiveFrsiTrend = "increasing" | "stable" | "decreasing";

export type ExecutiveDecisionStatusPhase =
  | "pending"
  | "under_review"
  | "recommended"
  | "approved"
  | "rejected"
  | "executed";

export type ExecutiveReadinessPhase = "ready" | "needs_attention" | "monitoring" | "critical";

export type ExecutiveScenarioStatePhase = "baseline" | "active" | "recovery" | "surge" | "review";

export type ExecutiveCommandBarFrsiStatus = {
  score: number | null;
  fragilityLabel: string;
  trend: ExecutiveFrsiTrend;
  trendLabel: string;
  priority: ExecutivePrioritySemantic;
};

export type ExecutiveCommandBarScenarioStatus = {
  name: string;
  stateLabel: string;
  statePhase: ExecutiveScenarioStatePhase;
  priority: ExecutivePrioritySemantic;
};

export type ExecutiveCommandBarDecisionStatus = {
  phase: ExecutiveDecisionStatusPhase;
  label: string;
  priority: ExecutivePrioritySemantic;
};

export type ExecutiveCommandBarReadinessStatus = {
  phase: ExecutiveReadinessPhase;
  label: string;
  priority: ExecutivePrioritySemantic;
};

export type ExecutiveCommandBarActionId =
  | "analyze"
  | "simulate"
  | "compare"
  | "snapshot"
  | "replay"
  | "save_workspace"
  | "load_workspace";

export type ExecutiveCommandBarModel = {
  frsi: ExecutiveCommandBarFrsiStatus;
  scenario: ExecutiveCommandBarScenarioStatus;
  decision: ExecutiveCommandBarDecisionStatus;
  readiness: ExecutiveCommandBarReadinessStatus;
  miniInsight: string | null;
  actions: ExecutiveCommandBarActionId[];
};

export type BuildExecutiveCommandBarModelInput = {
  pipelineStatus: Pick<
    NexoraPipelineStatusUi,
    | "status"
    | "fragilityLevel"
    | "insightLine"
    | "summary"
    | "decisionPosture"
    | "decisionTone"
    | "confidenceScore"
    | "confidenceTier"
    | "decisionNextMove"
  >;
  scenarioName?: string | null;
  scenarioStateLabel?: string | null;
  selectedScenarioTitle?: string | null;
  domainLabel?: string | null;
  decisionPhaseOverride?: ExecutiveDecisionStatusPhase | null;
  readinessOverride?: ExecutiveReadinessPhase | null;
};

export const EXECUTIVE_COMMAND_BAR_ACTIONS: readonly {
  id: ExecutiveCommandBarActionId;
  label: string;
}[] = [
  { id: "analyze", label: "Analyze" },
  { id: "simulate", label: "Simulate" },
  { id: "compare", label: "Compare" },
  { id: "snapshot", label: "Snapshot" },
  { id: "replay", label: "Replay" },
  { id: "save_workspace", label: "Save" },
  { id: "load_workspace", label: "Load" },
] as const;

export function formatExecutiveDecisionStatusLabel(phase: ExecutiveDecisionStatusPhase): string {
  switch (phase) {
    case "pending":
      return "Pending";
    case "under_review":
      return "Under Review";
    case "recommended":
      return "Recommended";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "executed":
      return "Executed";
    default:
      return "Pending";
  }
}

export function formatExecutiveReadinessLabel(phase: ExecutiveReadinessPhase): string {
  switch (phase) {
    case "ready":
      return "Ready";
    case "needs_attention":
      return "Needs Attention";
    case "monitoring":
      return "Monitoring";
    case "critical":
      return "Critical";
    default:
      return "Monitoring";
  }
}

export function formatExecutiveFrsiTrendLabel(trend: ExecutiveFrsiTrend): string {
  if (trend === "increasing") return "↑ Increasing";
  if (trend === "decreasing") return "↓ Improving";
  return "→ Stable";
}
