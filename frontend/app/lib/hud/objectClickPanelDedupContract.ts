/**
 * MRP_HUD:10:5A — Object click panel authority deduplication contract.
 * One object click → one canonical panel intent → one write maximum.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";

export const OBJECT_CLICK_PANEL_TARGET_VIEW = "dashboard" as const;

/** Canonical dashboard context for object-click panel authority (matches object selection routing). */
export const OBJECT_CLICK_PANEL_DASHBOARD_CONTEXT: DashboardContext = "sources";

export type ObjectSelectionPanelIntent = Readonly<{
  source: "object_click";
  objectId: string;
  targetView: typeof OBJECT_CLICK_PANEL_TARGET_VIEW;
  dashboardContext: DashboardContext;
}>;

export type ObjectClickPanelDedupDecision =
  | Readonly<{ action: "apply"; reason: "changed_object" | "changed_mode" | "first_apply" }>
  | Readonly<{ action: "skip"; reason: "duplicate_signature" | "same_object_reclick" }>;

export type ObjectClickPanelDedupFrame = Readonly<{
  clickEventId: string;
  signature: string;
  appliedAt: number;
}>;

/** Interaction-frame guard window — same click event + signature within this window is deduped. */
export const OBJECT_CLICK_PANEL_DEDUP_FRAME_MS = 400;

export function buildObjectClickPanelIntent(objectId: string): ObjectSelectionPanelIntent {
  const normalized = objectId.trim();
  return Object.freeze({
    source: "object_click",
    objectId: normalized,
    targetView: OBJECT_CLICK_PANEL_TARGET_VIEW,
    dashboardContext: OBJECT_CLICK_PANEL_DASHBOARD_CONTEXT,
  });
}

export function buildObjectClickPanelIntentSignature(intent: ObjectSelectionPanelIntent): string {
  return `${intent.source}|${intent.objectId}|${intent.targetView}|${intent.dashboardContext}`;
}

export function buildObjectClickPanelDedupFrameKey(
  clickEventId: string,
  signature: string
): string {
  return `${clickEventId}::${signature}`;
}
