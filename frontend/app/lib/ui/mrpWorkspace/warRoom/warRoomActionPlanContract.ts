/**
 * MRP:4F:4 — War Room action plan surface contract.
 *
 * Execution planning owned by War Room — translates strategy into actions.
 */

export const WAR_ROOM_ACTION_PLAN_TAG = "[MRP_WARROOM_ACTION_PLAN]" as const;

export const WAR_ROOM_ACTION_PLAN_VERSION = "4F.4.0";

export const WAR_ROOM_ACTION_PLAN_CONTEXT = "war_room" as const;

export const WAR_ROOM_ACTION_PLAN_PURPOSE =
  "Translate strategy into actions." as const;

export type WarRoomActionPlanSectionId =
  | "immediate_actions"
  | "near_term_actions"
  | "long_term_actions";

export type WarRoomActionItemStatus = "pending" | "active" | "complete";

export type WarRoomActionItemPriority = "critical" | "high" | "medium" | "low";

export type WarRoomActionItem = Readonly<{
  id: string;
  title: string;
  owner: string;
  priority: WarRoomActionItemPriority;
  status: WarRoomActionItemStatus;
  sectionId: WarRoomActionPlanSectionId;
}>;

export type WarRoomActionPlanSection = Readonly<{
  id: WarRoomActionPlanSectionId;
  label: string;
  items: readonly WarRoomActionItem[];
}>;

export type WarRoomActionPlanLayer = Readonly<{
  sections: readonly WarRoomActionPlanSection[];
  executionPlanningOwned: true;
}>;

export type WarRoomActionPlanSurface = Readonly<{
  purpose: typeof WAR_ROOM_ACTION_PLAN_PURPOSE;
  sections: readonly WarRoomActionPlanSection[];
  dashboardContext: typeof WAR_ROOM_ACTION_PLAN_CONTEXT;
  executionPlanningOwned: true;
}>;

export const WAR_ROOM_ACTION_PLAN_SECTION_ORDER: readonly WarRoomActionPlanSectionId[] =
  Object.freeze(["immediate_actions", "near_term_actions", "long_term_actions"]);

export const WAR_ROOM_ACTION_PLAN_SECTION_LABELS: Readonly<
  Record<WarRoomActionPlanSectionId, string>
> = Object.freeze({
  immediate_actions: "Immediate Actions",
  near_term_actions: "Near-Term Actions",
  long_term_actions: "Long-Term Actions",
});

export const WAR_ROOM_ACTION_ITEM_STATUS_VALUES: readonly WarRoomActionItemStatus[] =
  Object.freeze(["pending", "active", "complete"]);

export const DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER: WarRoomActionPlanLayer = Object.freeze({
  sections: Object.freeze(
    WAR_ROOM_ACTION_PLAN_SECTION_ORDER.map((id) =>
      Object.freeze({
        id,
        label: WAR_ROOM_ACTION_PLAN_SECTION_LABELS[id],
        items: Object.freeze([]),
      })
    )
  ),
  executionPlanningOwned: true,
});

export const DEFAULT_WAR_ROOM_ACTION_PLAN_SURFACE: WarRoomActionPlanSurface = Object.freeze({
  purpose: WAR_ROOM_ACTION_PLAN_PURPOSE,
  sections: DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER.sections,
  dashboardContext: WAR_ROOM_ACTION_PLAN_CONTEXT,
  executionPlanningOwned: true,
});
