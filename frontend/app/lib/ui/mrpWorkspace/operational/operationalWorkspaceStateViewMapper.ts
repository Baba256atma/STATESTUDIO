/**
 * MRP:4:8 — Map OperationalWorkspaceState to workspace card views.
 */

import {
  OPERATIONAL_ACTIVITY_LABELS,
  OPERATIONAL_STATUS_LABELS,
  OPERATIONAL_WORKSPACE_SECTION_ORDER,
  type OperationalWorkspaceCardTone,
  type OperationalWorkspaceCardView,
  type OperationalWorkspaceView,
} from "./operationalWorkspaceContract.ts";
import {
  OPERATIONAL_EMPTY_DETAIL,
  OPERATIONAL_EMPTY_HEADLINE,
  OPERATIONAL_LOADING_DETAIL,
  OPERATIONAL_LOADING_HEADLINE,
  type OperationalWorkspaceState,
} from "./operationalWorkspaceStateContract.ts";

function resolveOperationalStatusTone(
  state: OperationalWorkspaceState
): OperationalWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  switch (state.operationalStatus) {
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

function resolveActivityLevelTone(
  state: OperationalWorkspaceState
): OperationalWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  switch (state.activityLevel) {
    case "low":
      return "success";
    case "medium":
      return "accent";
    case "high":
      return "warning";
    default:
      return "neutral";
  }
}

function resolveFieldTone(
  state: OperationalWorkspaceState,
  fallback: OperationalWorkspaceCardTone
): OperationalWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  return fallback;
}

export function buildOperationalWorkspaceViewFromState(
  state: OperationalWorkspaceState
): OperationalWorkspaceView {
  const cards: OperationalWorkspaceCardView[] = [
    Object.freeze({
      id: "operational_status",
      label: "Operational Status",
      headline:
        state.phase === "loading"
          ? OPERATIONAL_LOADING_HEADLINE
          : state.phase === "empty"
            ? OPERATIONAL_EMPTY_HEADLINE
            : OPERATIONAL_STATUS_LABELS[state.operationalStatus],
      detail:
        state.phase === "loading"
          ? OPERATIONAL_LOADING_DETAIL
          : state.phase === "empty"
            ? OPERATIONAL_EMPTY_DETAIL
            : "Overall operational condition from operational runtime state.",
      tone: resolveOperationalStatusTone(state),
    }),
    Object.freeze({
      id: "activity_level",
      label: "Activity Level",
      headline:
        state.phase === "loading"
          ? OPERATIONAL_LOADING_HEADLINE
          : state.phase === "empty"
            ? OPERATIONAL_EMPTY_HEADLINE
            : OPERATIONAL_ACTIVITY_LABELS[state.activityLevel],
      detail:
        state.phase === "loading"
          ? OPERATIONAL_LOADING_DETAIL
          : state.phase === "empty"
            ? OPERATIONAL_EMPTY_DETAIL
            : "Current activity intensity from operational runtime state.",
      tone: resolveActivityLevelTone(state),
    }),
    Object.freeze({
      id: "operational_focus",
      label: "Operational Focus",
      headline: state.operationalFocus.headline,
      detail: state.operationalFocus.detail,
      tone: resolveFieldTone(state, "warning"),
    }),
    Object.freeze({
      id: "operational_notes",
      label: "Operational Notes",
      headline: state.operationalNotes.headline,
      detail: state.operationalNotes.detail,
      tone: resolveFieldTone(state, "neutral"),
    }),
  ];

  const orderedCards = OPERATIONAL_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  return Object.freeze({
    workspaceId: "operational",
    operationalStatus: state.operationalStatus,
    statusOptions: Object.freeze(["healthy", "warning", "critical"] as const),
    activityLevel: state.activityLevel,
    activityOptions: Object.freeze(["low", "medium", "high"] as const),
    cards: Object.freeze(orderedCards),
    objectContext: state.objectContext,
    scanPurpose:
      "Understand current operational condition of the selected scope within 5–10 seconds.",
    phase: state.phase,
    revision: state.revision,
    source: "operational_workspace_runtime_state",
  });
}
