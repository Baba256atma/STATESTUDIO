/**
 * MRP:9:3 — Workspace Favorites + Pinned Actions contract.
 *
 * Favorites are executive-owned. Dashboard executes. Recommendations are separate.
 */

import type { ExecutiveWorkspaceId } from "../dashboard/executiveWorkspaceRegistryContract.ts";

export const WORKSPACE_FAVORITES_REGISTRY_VERSION = "9.3.0";

export type PinnedActionType =
  | "workspace"
  | "workspace_action"
  | "executive_flow"
  | "dashboard_shortcut"
  | "future";

export type PinnedIconMetadata = Readonly<{
  glyph?: string;
  tone?: "neutral" | "accent" | "warning" | "critical";
}>;

/** Generic pinned item — no workspace-specific UI fields. */
export type PinnedWorkspaceAction = Readonly<{
  id: string;
  title: string;
  description: string;
  workspaceTarget: ExecutiveWorkspaceId | null;
  actionType: PinnedActionType;
  iconMetadata: PinnedIconMetadata | null;
  customLabel: string | null;
  createdTimestamp: number;
  updatedTimestamp: number;
  sortOrder: number;
}>;

export type WorkspaceFavoritesSnapshot = Readonly<{
  version: string;
  items: readonly PinnedWorkspaceAction[];
  updatedAt: number;
}>;

export type WorkspaceFavoritesStateView = Readonly<{
  items: readonly PinnedWorkspaceAction[];
  version: string;
  updatedAt: number;
  source: "workspace_favorites_registry";
}>;

export type WorkspaceFavoritesPersistenceAdapter = Readonly<{
  load: () => WorkspaceFavoritesSnapshot | null;
  save: (snapshot: WorkspaceFavoritesSnapshot) => void;
  clear: () => void;
}>;

export type PinnedActionLaunchValidation = Readonly<{
  approved: boolean;
  favoriteId: string | null;
  workspaceId: ExecutiveWorkspaceId | null;
  reason: string;
}>;

const loggedBrakes = new Set<string>();

function logBrake(prefix: string, message: string, detail: Readonly<Record<string, unknown>> = {}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${prefix}:${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.(prefix, { message, ...detail });
}

export function warnFavoritesRegistryBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[FavoritesRegistry][Brake]", message, detail);
}

export function warnPinnedActionBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[PinnedAction][Brake]", message, detail);
}

export function warnFavoritesManagerBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[FavoritesManager][Brake]", message, detail);
}

export function warnFavoritesAuthorityBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[FavoritesAuthority][Brake]", message, detail);
}

export function resetWorkspaceFavoritesBrakesForTests(): void {
  loggedBrakes.clear();
}

export function buildPinnedActionDisplayTitle(item: PinnedWorkspaceAction): string {
  return item.customLabel?.trim() || item.title;
}
