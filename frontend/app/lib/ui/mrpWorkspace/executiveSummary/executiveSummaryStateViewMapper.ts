/**
 * MRP:4:2 — Map ExecutiveSummaryState to workspace card views.
 */

import {
  EXECUTIVE_SUMMARY_SYSTEM_STATUS_LABELS,
  EXECUTIVE_SUMMARY_WORKSPACE_SECTION_ORDER,
  type ExecutiveSummaryWorkspaceCardTone,
  type ExecutiveSummaryWorkspaceCardView,
  type ExecutiveSummaryWorkspaceView,
} from "./executiveSummaryWorkspaceContract.ts";
import {
  EXECUTIVE_SUMMARY_EMPTY_DETAIL,
  EXECUTIVE_SUMMARY_EMPTY_HEADLINE,
  EXECUTIVE_SUMMARY_LOADING_DETAIL,
  EXECUTIVE_SUMMARY_LOADING_HEADLINE,
  type ExecutiveSummaryState,
} from "./executiveSummaryStateContract.ts";

function resolveSystemStatusTone(
  state: ExecutiveSummaryState
): ExecutiveSummaryWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  switch (state.systemStatus) {
    case "healthy":
      return "success";
    case "warning":
      return "warning";
    case "critical":
      return "critical";
    default:
      return "neutral";
  }
}

function resolveFieldTone(
  state: ExecutiveSummaryState,
  fallback: ExecutiveSummaryWorkspaceCardTone
): ExecutiveSummaryWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  return fallback;
}

export function buildExecutiveSummaryWorkspaceViewFromState(
  state: ExecutiveSummaryState
): ExecutiveSummaryWorkspaceView {
  const cards: ExecutiveSummaryWorkspaceCardView[] = [
    Object.freeze({
      id: "system_status",
      label: "System Status",
      headline:
        state.phase === "loading"
          ? EXECUTIVE_SUMMARY_LOADING_HEADLINE
          : state.phase === "empty"
            ? EXECUTIVE_SUMMARY_EMPTY_HEADLINE
            : EXECUTIVE_SUMMARY_SYSTEM_STATUS_LABELS[state.systemStatus],
      detail:
        state.phase === "loading"
          ? EXECUTIVE_SUMMARY_LOADING_DETAIL
          : state.phase === "empty"
            ? EXECUTIVE_SUMMARY_EMPTY_DETAIL
            : "Overall system condition from executive summary runtime state.",
      tone: resolveSystemStatusTone(state),
    }),
    Object.freeze({
      id: "top_risk",
      label: "Top Risk",
      headline: state.topRisk.headline,
      detail: state.topRisk.detail,
      tone: resolveFieldTone(state, "critical"),
    }),
    Object.freeze({
      id: "top_opportunity",
      label: "Top Opportunity",
      headline: state.topOpportunity.headline,
      detail: state.topOpportunity.detail,
      tone: resolveFieldTone(state, "accent"),
    }),
    Object.freeze({
      id: "recommended_attention",
      label: "Recommended Attention",
      headline: state.recommendedAttention.headline,
      detail: state.recommendedAttention.detail,
      tone: resolveFieldTone(state, "warning"),
    }),
  ];

  const orderedCards = EXECUTIVE_SUMMARY_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  return Object.freeze({
    workspaceId: "executive_summary",
    systemStatus: state.systemStatus,
    statusOptions: Object.freeze(["healthy", "warning", "critical"] as const),
    cards: Object.freeze(orderedCards),
    objectContext: state.objectContext,
    scanPurpose: "Understand overall system condition within 5–10 seconds.",
    phase: state.phase,
    revision: state.revision,
    source: "executive_summary_runtime_state",
  });
}
