/**
 * MRP:10:6 — Executive Favorites Layer contract.
 *
 * Read-only presentation shapes for Dashboard Home favorites.
 * Favorites ≠ Recommendations. Display only — no management in this layer.
 */

import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";

export type ExecutiveFavoriteItemType =
  | "workspace"
  | "dashboard_mode"
  | "object"
  | "recommendation"
  | "scenario"
  | "war_room";

export type ExecutiveFavoriteCardView = Readonly<{
  id: string;
  name: string;
  itemType: ExecutiveFavoriteItemType;
  typeLabel: string;
  lastAccessedAt: number;
  lastAccessedLabel: string;
  workspaceTarget: ExecutiveWorkspaceId | null;
  quickOpenLabel: string;
  launchable: boolean;
  sourceFavoriteId: string;
}>;

export type ExecutiveFavoritesLayerView = Readonly<{
  favorites: readonly ExecutiveFavoriteCardView[];
  evaluatedAt: number;
  source: "executive_favorites_layer";
}>;

export const EXECUTIVE_FAVORITE_TYPE_LABELS: Readonly<Record<ExecutiveFavoriteItemType, string>> =
  Object.freeze({
    workspace: "Workspace",
    dashboard_mode: "Dashboard Mode",
    object: "Object",
    recommendation: "Recommendation",
    scenario: "Scenario",
    war_room: "War Room",
  });

/** Reserved slots for future favorite entity types. */
export const FUTURE_EXECUTIVE_FAVORITE_ENTITY_SLOTS = Object.freeze([
  "strategic_plan",
  "advisory_briefing",
  "simulation",
  "operational_investigation",
  "executive_playbook",
] as const);

const loggedBrakes = new Set<string>();

export function warnExecutiveFavoritesLayerBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ExecutiveFavoritesLayer][Brake]", { message, ...detail });
}

export function resetExecutiveFavoritesLayerBrakesForTests(): void {
  loggedBrakes.clear();
}
