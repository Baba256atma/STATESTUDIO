/**
 * MRP:4F:1 — Map WarRoomWorkspaceState to workspace card views.
 */

import {
  WAR_ROOM_WORKSPACE_SECTION_LABELS,
  WAR_ROOM_WORKSPACE_SECTION_ORDER,
  type WarRoomWorkspaceCardTone,
  type WarRoomWorkspaceCardView,
  type WarRoomWorkspaceView,
} from "./warRoomWorkspaceContract.ts";
import { COMMITMENT_WORKSPACE_QUESTIONS } from "../governance/nexoraRule13CommitmentOwnershipContract.ts";
import {
  DEFAULT_WAR_ROOM_ACTION_PLAN_SURFACE,
  WAR_ROOM_ACTION_PLAN_PURPOSE,
} from "./warRoomActionPlanContract.ts";
import {
  DEFAULT_WAR_ROOM_MONITORING_SURFACE,
  WAR_ROOM_MONITORING_PURPOSE,
} from "./warRoomMonitoringContract.ts";
import {
  buildWarRoomActionPlanSurface,
  countWarRoomActionPlanItems,
} from "./warRoomActionPlanResolver.ts";
import {
  buildWarRoomMonitoringSurface,
  countWarRoomMonitoringSignals,
} from "./warRoomMonitoringResolver.ts";
import {
  WAR_ROOM_EMPTY_DETAIL,
  WAR_ROOM_EMPTY_HEADLINE,
  WAR_ROOM_LOADING_DETAIL,
  WAR_ROOM_LOADING_HEADLINE,
  type WarRoomFieldSnapshot,
  type WarRoomWorkspaceState,
} from "./warRoomWorkspaceStateContract.ts";

function resolveFieldTone(
  state: WarRoomWorkspaceState,
  fallback: WarRoomWorkspaceCardTone
): WarRoomWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  return fallback;
}

function buildFieldCard(
  id: WarRoomWorkspaceCardView["id"],
  label: string,
  field: WarRoomFieldSnapshot,
  state: WarRoomWorkspaceState,
  tone: WarRoomWorkspaceCardTone
): WarRoomWorkspaceCardView {
  return Object.freeze({
    id,
    label,
    headline:
      state.phase === "loading"
        ? WAR_ROOM_LOADING_HEADLINE
        : state.phase === "empty"
          ? WAR_ROOM_EMPTY_HEADLINE
          : field.headline,
    detail:
      state.phase === "loading"
        ? WAR_ROOM_LOADING_DETAIL
        : state.phase === "empty"
          ? WAR_ROOM_EMPTY_DETAIL
          : field.detail,
    tone: resolveFieldTone(state, tone),
  });
}

export function buildWarRoomWorkspaceViewFromState(
  state: WarRoomWorkspaceState
): WarRoomWorkspaceView {
  const cards: WarRoomWorkspaceCardView[] = [
    buildFieldCard(
      "strategy_summary",
      WAR_ROOM_WORKSPACE_SECTION_LABELS.strategy_summary,
      state.strategySummary,
      state,
      "accent"
    ),
    buildFieldCard(
      "active_decision",
      WAR_ROOM_WORKSPACE_SECTION_LABELS.active_decision,
      state.activeDecision,
      state,
      "warning"
    ),
    buildFieldCard(
      "action_plan",
      WAR_ROOM_WORKSPACE_SECTION_LABELS.action_plan,
      state.actionPlan,
      state,
      "neutral"
    ),
    buildFieldCard(
      "watch_list",
      WAR_ROOM_WORKSPACE_SECTION_LABELS.watch_list,
      state.watchList,
      state,
      "critical"
    ),
    buildFieldCard(
      "decision_status",
      WAR_ROOM_WORKSPACE_SECTION_LABELS.decision_status,
      state.decisionStatus,
      state,
      "success"
    ),
  ];

  const orderedCards = WAR_ROOM_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  const actionPlanSurface =
    countWarRoomActionPlanItems(state.actionPlanLayer) > 0
      ? buildWarRoomActionPlanSurface(state.actionPlanLayer)
      : DEFAULT_WAR_ROOM_ACTION_PLAN_SURFACE;

  const monitoringSurface =
    countWarRoomMonitoringSignals(state.monitoringLayer) > 0
      ? buildWarRoomMonitoringSurface(state.monitoringLayer)
      : DEFAULT_WAR_ROOM_MONITORING_SURFACE;

  const hasActionPlan = countWarRoomActionPlanItems(state.actionPlanLayer) > 0;
  const hasMonitoring = countWarRoomMonitoringSignals(state.monitoringLayer) > 0;
  const scanPurposeParts = [COMMITMENT_WORKSPACE_QUESTIONS.war_room];
  if (hasActionPlan) {
    scanPurposeParts.push(
      `${WAR_ROOM_ACTION_PLAN_PURPOSE} War Room owns execution planning — not simulation.`
    );
  }
  if (hasMonitoring) {
    scanPurposeParts.push(
      `${WAR_ROOM_MONITORING_PURPOSE} War Room tracks execution — Timeline owns history.`
    );
  }
  if (!hasActionPlan && !hasMonitoring) {
    scanPurposeParts.push(
      "Monitor commitment surfaces — War Room owns commitment, not simulation."
    );
  }

  return Object.freeze({
    workspaceId: "war_room",
    cards: Object.freeze(orderedCards),
    workspaceContext: state.workspaceContext,
    actionPlan: actionPlanSurface,
    monitoring: monitoringSurface,
    scanPurpose: scanPurposeParts.join(" "),
    phase: state.phase,
    revision: state.revision,
    source: "war_room_workspace_runtime_state",
    ownsCommitmentOnly: true,
  });
}
