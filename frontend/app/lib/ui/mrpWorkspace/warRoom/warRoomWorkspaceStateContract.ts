/**
 * MRP:4F:1 / 4F:2 / 4F:4 / 4F:5 — War Room workspace runtime state contract.
 */

import {
  DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
  type WarRoomActionPlanLayer,
} from "./warRoomActionPlanContract.ts";
import {
  DEFAULT_WAR_ROOM_MONITORING_LAYER,
  type WarRoomMonitoringLayer,
} from "./warRoomMonitoringContract.ts";
import {
  DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
  type WarRoomWorkspaceContext,
} from "./warRoomWorkspaceContextContract.ts";

export const WAR_ROOM_STATE_TAG = "[WAR_ROOM_STATE]" as const;
export const WAR_ROOM_RUNTIME_TAG = "[WAR_ROOM_RUNTIME]" as const;

export const WAR_ROOM_WORKSPACE_STATE_VERSION = "4F.5.0";

export type WarRoomWorkspaceStatePhase = "loading" | "ready" | "empty";

export type WarRoomFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type WarRoomWorkspaceState = Readonly<{
  phase: WarRoomWorkspaceStatePhase;
  workspaceContext: WarRoomWorkspaceContext;
  actionPlanLayer: WarRoomActionPlanLayer;
  actionPlanExecutionOwned: true;
  monitoringLayer: WarRoomMonitoringLayer;
  monitoringExecutionTracked: true;
  strategySummary: WarRoomFieldSnapshot;
  activeDecision: WarRoomFieldSnapshot;
  actionPlan: WarRoomFieldSnapshot;
  watchList: WarRoomFieldSnapshot;
  decisionStatus: WarRoomFieldSnapshot;
  revision: number;
  signature: string;
}>;

export type WarRoomWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: WarRoomWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const WAR_ROOM_LOADING_HEADLINE = "Loading…";
export const WAR_ROOM_LOADING_DETAIL = "Retrieving war room workspace runtime state.";

export const WAR_ROOM_EMPTY_HEADLINE = "No data available";
export const WAR_ROOM_EMPTY_DETAIL = "War room workspace runtime returned an empty state.";

export const DEFAULT_STRATEGY_SUMMARY: WarRoomFieldSnapshot = Object.freeze({
  headline: "No strategy summary signal",
  detail: "Runtime connected — strategy summary intelligence not wired in MRP:4F:1.",
});

export const DEFAULT_ACTIVE_DECISION: WarRoomFieldSnapshot = Object.freeze({
  headline: "No active decision signal",
  detail: "Runtime connected — active decision intelligence not wired in MRP:4F:1.",
});

export const DEFAULT_ACTION_PLAN: WarRoomFieldSnapshot = Object.freeze({
  headline: "No action plan signal",
  detail: "Runtime connected — action plan intelligence not wired in MRP:4F:1.",
});

export const DEFAULT_WATCH_LIST: WarRoomFieldSnapshot = Object.freeze({
  headline: "No watch list signal",
  detail: "Runtime connected — watch list intelligence not wired in MRP:4F:1.",
});

export const DEFAULT_DECISION_STATUS: WarRoomFieldSnapshot = Object.freeze({
  headline: "No decision status signal",
  detail: "Runtime connected — decision status intelligence not wired in MRP:4F:1.",
});

export const DEFAULT_WAR_ROOM_READY_STATE: WarRoomWorkspaceState = Object.freeze({
  phase: "ready",
  workspaceContext: DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
  actionPlanLayer: DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
  actionPlanExecutionOwned: true,
  monitoringLayer: DEFAULT_WAR_ROOM_MONITORING_LAYER,
  monitoringExecutionTracked: true,
  strategySummary: DEFAULT_STRATEGY_SUMMARY,
  activeDecision: DEFAULT_ACTIVE_DECISION,
  actionPlan: DEFAULT_ACTION_PLAN,
  watchList: DEFAULT_WATCH_LIST,
  decisionStatus: DEFAULT_DECISION_STATUS,
  revision: 0,
  signature: "war_room:ready:defaults",
});
