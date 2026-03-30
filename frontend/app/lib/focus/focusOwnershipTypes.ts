export type FocusOwnershipSource =
  | "none"
  | "user_click"
  | "narrative_step"
  | "backend_intelligence"
  | "war_room_action"
  | "executive_recommendation"
  | "scanner_primary";

export type FocusOwnershipState = {
  source: FocusOwnershipSource;
  objectId: string | null;
  isPersistent: boolean;
  reason: string | null;
};
