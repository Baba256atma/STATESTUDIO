/**
 * MRP:4F:1–4F:6 — War Room workspace contract.
 */

import type { WarRoomActionPlanSurface } from "./warRoomActionPlanContract.ts";
import type { WarRoomMonitoringSurface } from "./warRoomMonitoringContract.ts";
import type { WarRoomWorkspaceContext } from "./warRoomWorkspaceContextContract.ts";

export const WAR_ROOM_FOUNDATION_TAG = "[MRP_WARROOM_FOUNDATION]" as const;
export const WAR_ROOM_CERTIFIED_TAG = "[MRP_WARROOM_CERTIFIED]" as const;
export const MRP_PHASE4F_COMPLETE_TAG = "[MRP_PHASE4F_COMPLETE]" as const;

export const WAR_ROOM_WORKSPACE_VERSION = "4F.6.0";

export const CANONICAL_WAR_ROOM_WORKSPACE_OWNER = "WarRoomWorkspace" as const;

export type WarRoomWorkspaceSectionId =
  | "strategy_summary"
  | "active_decision"
  | "action_plan"
  | "watch_list"
  | "decision_status";

export type WarRoomWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type WarRoomWorkspaceCardView = Readonly<{
  id: WarRoomWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: WarRoomWorkspaceCardTone;
}>;

export type WarRoomWorkspaceView = Readonly<{
  workspaceId: "war_room";
  cards: readonly WarRoomWorkspaceCardView[];
  workspaceContext: WarRoomWorkspaceContext;
  actionPlan: WarRoomActionPlanSurface;
  monitoring: WarRoomMonitoringSurface;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "war_room_workspace_foundation" | "war_room_workspace_runtime_state";
  ownsCommitmentOnly: true;
}>;

export const WAR_ROOM_WORKSPACE_SECTION_ORDER: readonly WarRoomWorkspaceSectionId[] =
  Object.freeze([
    "strategy_summary",
    "active_decision",
    "action_plan",
    "watch_list",
    "decision_status",
  ]);

export const WAR_ROOM_WORKSPACE_SECTION_LABELS: Readonly<
  Record<WarRoomWorkspaceSectionId, string>
> = Object.freeze({
  strategy_summary: "Strategy Summary",
  active_decision: "Active Decision",
  action_plan: "Action Plan",
  watch_list: "Watch List",
  decision_status: "Decision Status",
});
