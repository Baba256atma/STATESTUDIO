/**
 * MRP:10:6 — Executive Favorites Layer runtime.
 *
 * Read-only projection from workspace favorites registry.
 * No auto-favorites, no AI ranking, no inference.
 */

import { getExecutiveWorkspaceEntry } from "../executiveWorkspaceRegistryContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import {
  buildPinnedActionDisplayTitle,
  type PinnedWorkspaceAction,
  type WorkspaceFavoritesStateView,
} from "../../workspaces/workspaceFavoritesContract.ts";
import { previewPinnedActionLaunch } from "../../workspaces/workspaceFavoritesRegistry.ts";
import type {
  ExecutiveFavoriteCardView,
  ExecutiveFavoriteItemType,
  ExecutiveFavoritesLayerView,
} from "./executiveFavoritesLayerContract.ts";
import { EXECUTIVE_FAVORITE_TYPE_LABELS } from "./executiveFavoritesLayerContract.ts";

function formatLastAccessedLabel(timestamp: number): string {
  if (!timestamp) return "Not yet opened";
  const now = new Date();
  const date = new Date(timestamp);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfEntryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDelta = Math.round((startOfToday - startOfEntryDay) / 86_400_000);

  if (dayDelta === 0) return "Today";
  if (dayDelta === 1) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function resolveFavoriteItemType(
  item: PinnedWorkspaceAction
): ExecutiveFavoriteItemType {
  const target = item.workspaceTarget;
  if (target === "war_room") return "war_room";
  if (target === "scenario") return "scenario";
  if (target === "focus") return "object";
  if (target === "recommendations") return "recommendation";
  if (target && getExecutiveWorkspaceEntry(target).dashboardMode) {
    if (target === "analyze" || target === "compare") return "dashboard_mode";
    return "workspace";
  }
  return "workspace";
}

function resolveTypeLabel(
  itemType: ExecutiveFavoriteItemType,
  workspaceTarget: ExecutiveWorkspaceId | null
): string {
  if (itemType === "dashboard_mode" && workspaceTarget) {
    const entry = getExecutiveWorkspaceEntry(workspaceTarget);
    return `${entry.name} Workspace`;
  }
  if (itemType === "war_room") return "War Room";
  if (itemType === "scenario") return "Scenario";
  if (itemType === "object") return "Object";
  if (itemType === "recommendation") return "Recommendation";
  if (workspaceTarget) {
    return `${getExecutiveWorkspaceEntry(workspaceTarget).name} Workspace`;
  }
  return EXECUTIVE_FAVORITE_TYPE_LABELS[itemType];
}

function projectFavoriteCard(input: {
  item: PinnedWorkspaceAction;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  selectedObjectId: string | null;
}): ExecutiveFavoriteCardView {
  const itemType = resolveFavoriteItemType(input.item);
  const preview = previewPinnedActionLaunch({
    favoriteId: input.item.id,
    activeWorkspaceId: input.activeWorkspaceId,
    selectedObjectId: input.selectedObjectId,
  });

  return Object.freeze({
    id: input.item.id,
    name: buildPinnedActionDisplayTitle(input.item),
    itemType,
    typeLabel: resolveTypeLabel(itemType, input.item.workspaceTarget),
    lastAccessedAt: input.item.updatedTimestamp,
    lastAccessedLabel: formatLastAccessedLabel(input.item.updatedTimestamp),
    workspaceTarget: input.item.workspaceTarget,
    quickOpenLabel: preview.approved ? "Quick Open" : "Unavailable",
    launchable: preview.approved,
    sourceFavoriteId: input.item.id,
  });
}

export function buildExecutiveFavoritesLayerView(input: {
  snapshot: WorkspaceFavoritesStateView;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): ExecutiveFavoritesLayerView {
  const activeWorkspaceId = input.activeWorkspaceId ?? null;
  const selectedObjectId = input.selectedObjectId?.trim() || null;

  const favorites = input.snapshot.items.map((item) =>
    projectFavoriteCard({ item, activeWorkspaceId, selectedObjectId })
  );

  return Object.freeze({
    favorites: Object.freeze(favorites),
    evaluatedAt: Date.now(),
    source: "executive_favorites_layer",
  });
}
