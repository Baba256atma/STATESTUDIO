/**
 * MRP:4F:2 — War Room commitment runtime state contract.
 *
 * War Room owns commitment state only — no Timeline or Scenario workspace ownership.
 */

import type { GeneratedScenarioId } from "../scenario/scenarioGenerationContract.ts";

export const WAR_ROOM_RUNTIME_STATE_TAG = "[MRP_WARROOM_RUNTIME]" as const;

export const WAR_ROOM_STATE_VERSION = "4F.3.0";

export type WarRoomStatus = "draft" | "review" | "approved" | "active" | "closed";

export type WarRoomState = Readonly<{
  activeDecisionId: string | null;
  activeScenarioId: GeneratedScenarioId | null;
  selectedStrategy: string | null;
  actionPlanIds: readonly string[];
  watchListIds: readonly string[];
  status: WarRoomStatus;
  revision: number;
  signature: string;
}>;

export type WarRoomStatePublishResult = Readonly<{
  changed: boolean;
  state: WarRoomState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const WAR_ROOM_STATUS_VALUES: readonly WarRoomStatus[] = Object.freeze([
  "draft",
  "review",
  "approved",
  "active",
  "closed",
]);

export const WAR_ROOM_STATUS_LABELS: Readonly<Record<WarRoomStatus, string>> = Object.freeze({
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  active: "Active",
  closed: "Closed",
});

export const DEFAULT_WAR_ROOM_STATE: WarRoomState = Object.freeze({
  activeDecisionId: null,
  activeScenarioId: null,
  selectedStrategy: null,
  actionPlanIds: Object.freeze([]),
  watchListIds: Object.freeze([]),
  status: "draft",
  revision: 0,
  signature: "war_room:runtime:draft:defaults",
});
