/**
 * MRP:4F:2 — War Room commitment runtime state selectors.
 */

import {
  WAR_ROOM_STATUS_LABELS,
  type WarRoomState,
  type WarRoomStatus,
} from "./warRoomStateContract.ts";

export function selectWarRoomActiveDecisionId(state: WarRoomState): string | null {
  return state.activeDecisionId;
}

export function selectWarRoomActiveScenarioId(state: WarRoomState): WarRoomState["activeScenarioId"] {
  return state.activeScenarioId;
}

export function selectWarRoomSelectedStrategy(state: WarRoomState): string | null {
  return state.selectedStrategy;
}

export function selectWarRoomActionPlanIds(state: WarRoomState): readonly string[] {
  return state.actionPlanIds;
}

export function selectWarRoomWatchListIds(state: WarRoomState): readonly string[] {
  return state.watchListIds;
}

export function selectWarRoomStatus(state: WarRoomState): WarRoomStatus {
  return state.status;
}

export function selectWarRoomStatusLabel(state: WarRoomState): string {
  return WAR_ROOM_STATUS_LABELS[state.status];
}

export function selectWarRoomHasActiveDecision(state: WarRoomState): boolean {
  return state.activeDecisionId !== null;
}

export function selectWarRoomHasActionPlans(state: WarRoomState): boolean {
  return state.actionPlanIds.length > 0;
}

export function selectWarRoomHasWatchItems(state: WarRoomState): boolean {
  return state.watchListIds.length > 0;
}

export function selectWarRoomIsCommitmentActive(state: WarRoomState): boolean {
  return state.status === "active";
}

export function selectWarRoomIsCommitmentClosed(state: WarRoomState): boolean {
  return state.status === "closed";
}

export function selectWarRoomIsUnderReview(state: WarRoomState): boolean {
  return state.status === "review";
}
