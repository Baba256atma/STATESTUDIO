/**
 * MRP:9:3 — Workspace Favorites Registry.
 *
 * Executive-owned pinned actions. Persistence isolated behind adapter interface.
 */

import {
  getExecutiveWorkspaceEntry,
  validateExecutiveWorkspaceOpenRequest,
  type ExecutiveWorkspaceId,
} from "../dashboard/executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import {
  warnFavoritesAuthorityBrake,
  warnFavoritesManagerBrake,
  warnFavoritesRegistryBrake,
  warnPinnedActionBrake,
  WORKSPACE_FAVORITES_REGISTRY_VERSION,
  type PinnedActionType,
  type PinnedWorkspaceAction,
  type PinnedActionLaunchValidation,
  type WorkspaceFavoritesPersistenceAdapter,
  type WorkspaceFavoritesSnapshot,
  type WorkspaceFavoritesStateView,
} from "./workspaceFavoritesContract.ts";

const STORAGE_KEY = "nexora:workspace-favorites:v1";
const MAX_FAVORITES = 12;

const DEFAULT_WORKSPACE_FAVORITE_IDS: readonly ExecutiveWorkspaceId[] = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
]);

type MutablePinnedItem = {
  id: string;
  title: string;
  description: string;
  workspaceTarget: ExecutiveWorkspaceId | null;
  actionType: PinnedActionType;
  iconMetadata: PinnedWorkspaceAction["iconMetadata"];
  customLabel: string | null;
  createdTimestamp: number;
  updatedTimestamp: number;
  sortOrder: number;
};

let registryInitialized = false;
let items: MutablePinnedItem[] = [];
let updatedAt = 0;
let storeRevision = 0;
let cachedSnapshotRevision = -1;
const listeners = new Set<() => void>();
let persistenceAdapter: WorkspaceFavoritesPersistenceAdapter = createDefaultPersistenceAdapter();
let cachedSnapshot: WorkspaceFavoritesStateView | null = null;

/** Stable empty snapshot for SSR, pre-init client render, and server snapshot path. */
export const WORKSPACE_FAVORITES_INITIAL_SNAPSHOT: WorkspaceFavoritesStateView = Object.freeze({
  items: Object.freeze([]),
  version: WORKSPACE_FAVORITES_REGISTRY_VERSION,
  updatedAt: 0,
  source: "workspace_favorites_registry",
});

/** Alias — server and pre-init client share one stable reference. */
export const WORKSPACE_FAVORITES_SERVER_SNAPSHOT: WorkspaceFavoritesStateView =
  WORKSPACE_FAVORITES_INITIAL_SNAPSHOT;

export function getWorkspaceFavoritesServerSnapshot(): WorkspaceFavoritesStateView {
  return WORKSPACE_FAVORITES_SERVER_SNAPSHOT;
}

function createDefaultPersistenceAdapter(): WorkspaceFavoritesPersistenceAdapter {
  return Object.freeze({
    load(): WorkspaceFavoritesSnapshot | null {
      if (typeof globalThis.localStorage === "undefined") return null;
      try {
        const raw = globalThis.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return parseSnapshot(raw);
      } catch {
        warnFavoritesRegistryBrake("Persistence load failed.", {});
        return null;
      }
    },
    save(snapshot: WorkspaceFavoritesSnapshot): void {
      if (typeof globalThis.localStorage === "undefined") return;
      try {
        globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        warnFavoritesRegistryBrake("Persistence save failed.", {});
      }
    },
    clear(): void {
      if (typeof globalThis.localStorage === "undefined") return;
      try {
        globalThis.localStorage.removeItem(STORAGE_KEY);
      } catch {
        warnFavoritesRegistryBrake("Persistence clear failed.", {});
      }
    },
  });
}

function parseSnapshot(raw: string): WorkspaceFavoritesSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as WorkspaceFavoritesSnapshot;
    if (!parsed || parsed.version !== WORKSPACE_FAVORITES_REGISTRY_VERSION) {
      warnFavoritesRegistryBrake("Snapshot version mismatch.", { version: parsed?.version ?? null });
      return null;
    }
    if (!Array.isArray(parsed.items)) {
      warnFavoritesRegistryBrake("Invalid snapshot shape.", {});
      return null;
    }
    return Object.freeze({
      version: WORKSPACE_FAVORITES_REGISTRY_VERSION,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      items: Object.freeze(parsed.items.filter(isValidPinnedItem)),
    });
  } catch {
    warnFavoritesRegistryBrake("Corrupt snapshot rejected.", {});
    return null;
  }
}

function isValidPinnedItem(value: unknown): value is PinnedWorkspaceAction {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.sortOrder === "number"
  );
}

function freezeItem(item: MutablePinnedItem): PinnedWorkspaceAction {
  return Object.freeze({ ...item });
}

function emitChange(): void {
  for (const listener of listeners) listener();
}

function syncCachedSnapshot(): WorkspaceFavoritesStateView {
  if (cachedSnapshot !== null && cachedSnapshotRevision === storeRevision) {
    return cachedSnapshot;
  }

  cachedSnapshot = Object.freeze({
    items: Object.freeze(items.map(freezeItem)),
    version: WORKSPACE_FAVORITES_REGISTRY_VERSION,
    updatedAt,
    source: "workspace_favorites_registry",
  });
  cachedSnapshotRevision = storeRevision;
  return cachedSnapshot;
}

function bumpStoreRevision(): void {
  markStoreMutated();
}

function markStoreMutated(at: number = Date.now()): void {
  storeRevision += 1;
  updatedAt = at;
}

function commitRegistryChange(): void {
  syncCachedSnapshot();
  emitChange();
}

function ensureRegistryInitialized(): void {
  if (registryInitialized) return;
  registryInitialized = true;
  initializeExecutiveWorkspaceRegistry();

  const loaded = persistenceAdapter.load();
  if (loaded && loaded.items.length > 0) {
    if (!Array.isArray(loaded.items)) {
      warnFavoritesRegistryBrake("Invalid favorite state.", { reason: "items_not_array" });
      items = [];
      bumpStoreRevision();
    } else {
      items = loaded.items.filter(isValidPinnedItem).map((item) => ({ ...item }));
      updatedAt = loaded.updatedAt;
      storeRevision += 1;
      normalizeSortOrders();
    }
  } else if (loaded === null) {
    items = [];
    markStoreMutated();
  } else {
    items = [];
    markStoreMutated(loaded.updatedAt);
  }

  syncCachedSnapshot();
}

function persistState(): void {
  const snapshot: WorkspaceFavoritesSnapshot = Object.freeze({
    version: WORKSPACE_FAVORITES_REGISTRY_VERSION,
    updatedAt,
    items: Object.freeze(items.map(freezeItem)),
  });
  persistenceAdapter.save(snapshot);
}

function normalizeSortOrders(): void {
  items.sort((a, b) => a.sortOrder - b.sortOrder);
  items.forEach((item, index) => {
    item.sortOrder = index;
  });
}

function buildDefaultItems(): MutablePinnedItem[] {
  initializeExecutiveWorkspaceRegistry();
  const now = Date.now();
  return DEFAULT_WORKSPACE_FAVORITE_IDS.map((workspaceId, index) => {
    const entry = getExecutiveWorkspaceEntry(workspaceId);
    return {
      id: `default:${workspaceId}`,
      title: entry.name,
      description: entry.description,
      workspaceTarget: workspaceId,
      actionType: "workspace" as const,
      iconMetadata: Object.freeze({ glyph: workspaceId, tone: "accent" as const }),
      customLabel: null,
      createdTimestamp: now,
      updatedTimestamp: now,
      sortOrder: index,
    };
  });
}

export function setWorkspaceFavoritesPersistenceAdapterForTests(
  adapter: WorkspaceFavoritesPersistenceAdapter | null
): void {
  persistenceAdapter = adapter ?? createDefaultPersistenceAdapter();
}

export function resetWorkspaceFavoritesRegistryForTests(): void {
  registryInitialized = false;
  items = [];
  updatedAt = 0;
  storeRevision = 0;
  cachedSnapshotRevision = -1;
  listeners.clear();
  cachedSnapshot = null;
  persistenceAdapter = createDefaultPersistenceAdapter();
}

export function initializeWorkspaceFavoritesRegistry(): WorkspaceFavoritesStateView {
  ensureRegistryInitialized();
  return syncCachedSnapshot();
}

export function subscribeWorkspaceFavorites(listener: () => void): () => void {
  const needsClientHydrationSync = !registryInitialized;
  ensureRegistryInitialized();
  if (listeners.has(listener)) {
    warnFavoritesRegistryBrake("Duplicate subscription.", { listenerCount: listeners.size });
  }
  listeners.add(listener);
  // First subscribe loads persisted favorites; notify React to re-read getSnapshot.
  if (needsClientHydrationSync) {
    listener();
  }
  return () => listeners.delete(listener);
}

/** Pure read — no init, no mutation, no localStorage. Returns stable pre-init snapshot until subscribe loads registry. */
export function getWorkspaceFavoritesSnapshot(): WorkspaceFavoritesStateView {
  if (!registryInitialized) {
    return WORKSPACE_FAVORITES_INITIAL_SNAPSHOT;
  }
  return syncCachedSnapshot();
}

export function listPinCandidateWorkspaceIds(): readonly ExecutiveWorkspaceId[] {
  initializeExecutiveWorkspaceRegistry();
  const pinned = new Set(
    items
      .map((item) => item.workspaceTarget)
      .filter((id): id is ExecutiveWorkspaceId => id !== null)
  );
  return Object.freeze(
    DEFAULT_WORKSPACE_FAVORITE_IDS.filter((id) => !pinned.has(id))
  );
}

export function pinWorkspaceAction(input: {
  workspaceId: ExecutiveWorkspaceId;
  customLabel?: string | null;
}): Readonly<{ success: boolean; item: PinnedWorkspaceAction | null; reason: string }> {
  initializeWorkspaceFavoritesRegistry();
  initializeExecutiveWorkspaceRegistry();

  const entry = getExecutiveWorkspaceEntry(input.workspaceId);
  if (entry.availability !== "available" || !entry.objectPanelAction) {
    warnFavoritesManagerBrake("Cannot pin unavailable workspace.", { workspaceId: input.workspaceId });
    return Object.freeze({ success: false, item: null, reason: "workspace_not_available" });
  }

  if (items.some((item) => item.workspaceTarget === input.workspaceId)) {
    warnFavoritesManagerBrake("Duplicate pin rejected.", { workspaceId: input.workspaceId });
    return Object.freeze({ success: false, item: null, reason: "already_pinned" });
  }

  if (items.length >= MAX_FAVORITES) {
    warnFavoritesManagerBrake("Favorites limit reached.", { max: MAX_FAVORITES });
    return Object.freeze({ success: false, item: null, reason: "favorites_limit_reached" });
  }

  const now = Date.now();
  const item: MutablePinnedItem = {
    id: `pin:${input.workspaceId}:${now}`,
    title: entry.name,
    description: entry.description,
    workspaceTarget: input.workspaceId,
    actionType: "workspace",
    iconMetadata: Object.freeze({ glyph: input.workspaceId, tone: "accent" }),
    customLabel: input.customLabel?.trim() || null,
    createdTimestamp: now,
    updatedTimestamp: now,
    sortOrder: items.length,
  };

  items.push(item);
  markStoreMutated(now);
  persistState();
  commitRegistryChange();

  return Object.freeze({ success: true, item: freezeItem(item), reason: "pinned" });
}

export function unpinWorkspaceAction(favoriteId: string): Readonly<{ success: boolean; reason: string }> {
  initializeWorkspaceFavoritesRegistry();
  const index = items.findIndex((item) => item.id === favoriteId);
  if (index < 0) {
    warnFavoritesManagerBrake("Favorite not found.", { favoriteId });
    return Object.freeze({ success: false, reason: "not_found" });
  }

  items.splice(index, 1);
  normalizeSortOrders();
  markStoreMutated();
  persistState();
  commitRegistryChange();
  return Object.freeze({ success: true, reason: "unpinned" });
}

export function reorderWorkspaceFavorite(input: {
  favoriteId: string;
  direction: "up" | "down";
}): Readonly<{ success: boolean; reason: string }> {
  initializeWorkspaceFavoritesRegistry();
  normalizeSortOrders();
  const index = items.findIndex((item) => item.id === input.favoriteId);
  if (index < 0) {
    warnFavoritesManagerBrake("Reorder target not found.", { favoriteId: input.favoriteId });
    return Object.freeze({ success: false, reason: "not_found" });
  }

  const targetIndex = input.direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) {
    warnFavoritesManagerBrake("Reorder out of bounds.", { favoriteId: input.favoriteId });
    return Object.freeze({ success: false, reason: "out_of_bounds" });
  }

  const current = items[index];
  const swap = items[targetIndex];
  const currentOrder = current.sortOrder;
  current.sortOrder = swap.sortOrder;
  swap.sortOrder = currentOrder;
  normalizeSortOrders();
  current.updatedTimestamp = Date.now();
  swap.updatedTimestamp = Date.now();
  markStoreMutated();
  persistState();
  commitRegistryChange();
  return Object.freeze({ success: true, reason: "reordered" });
}

export function renameWorkspaceFavoriteLabel(input: {
  favoriteId: string;
  customLabel: string | null;
}): Readonly<{ success: boolean; reason: string }> {
  initializeWorkspaceFavoritesRegistry();
  const item = items.find((entry) => entry.id === input.favoriteId);
  if (!item) {
    warnFavoritesManagerBrake("Rename target not found.", { favoriteId: input.favoriteId });
    return Object.freeze({ success: false, reason: "not_found" });
  }

  item.customLabel = input.customLabel?.trim() || null;
  item.updatedTimestamp = Date.now();
  markStoreMutated();
  persistState();
  commitRegistryChange();
  return Object.freeze({ success: true, reason: "renamed" });
}

export function resetWorkspaceFavorites(): Readonly<{ success: boolean; reason: string }> {
  initializeWorkspaceFavoritesRegistry();
  items = [];
  markStoreMutated();
  persistenceAdapter.clear();
  persistState();
  commitRegistryChange();
  return Object.freeze({ success: true, reason: "reset" });
}

export function restoreDefaultWorkspaceFavorites(): Readonly<{
  success: boolean;
  reason: string;
}> {
  initializeWorkspaceFavoritesRegistry();
  items = buildDefaultItems();
  markStoreMutated();
  persistState();
  commitRegistryChange();
  return Object.freeze({ success: true, reason: "defaults_restored" });
}

export function previewPinnedActionLaunch(input: {
  favoriteId: string;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): PinnedActionLaunchValidation {
  initializeWorkspaceFavoritesRegistry();
  initializeExecutiveWorkspaceRegistry();

  const item = items.find((entry) => entry.id === input.favoriteId);
  if (!item) {
    return Object.freeze({
      approved: false,
      favoriteId: null,
      workspaceId: null,
      reason: "not_found",
    });
  }

  const workspaceId = item.workspaceTarget;
  if (!workspaceId) {
    return Object.freeze({
      approved: false,
      favoriteId: item.id,
      workspaceId: null,
      reason: "missing_workspace_target",
    });
  }

  if (input.activeWorkspaceId === workspaceId) {
    return Object.freeze({
      approved: false,
      favoriteId: item.id,
      workspaceId,
      reason: "already_active",
    });
  }

  const registryValidation = validateExecutiveWorkspaceOpenRequest({ workspaceId });
  if (!registryValidation.valid) {
    return Object.freeze({
      approved: false,
      favoriteId: item.id,
      workspaceId,
      reason: registryValidation.reason,
    });
  }

  const requiresObject = Boolean(getExecutiveWorkspaceEntry(workspaceId).objectPanelAction);
  const hasObject = Boolean(input.selectedObjectId?.trim());
  if (requiresObject && !hasObject) {
    return Object.freeze({
      approved: false,
      favoriteId: item.id,
      workspaceId,
      reason: "missing_object",
    });
  }

  return Object.freeze({
    approved: true,
    favoriteId: item.id,
    workspaceId,
    reason: "launch_approved",
  });
}

export function validatePinnedActionLaunch(input: {
  favoriteId: string;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): PinnedActionLaunchValidation {
  const result = previewPinnedActionLaunch(input);
  if (result.approved) return result;

  if (result.reason === "not_found") {
    warnPinnedActionBrake("Favorite not found.", { favoriteId: input.favoriteId });
  } else if (result.reason === "missing_workspace_target") {
    warnPinnedActionBrake("Missing workspace target.", { favoriteId: result.favoriteId });
  } else if (result.reason === "already_active") {
    warnFavoritesAuthorityBrake("Active workspace launch blocked.", { workspaceId: result.workspaceId });
  } else if (result.reason === "missing_object") {
    warnFavoritesAuthorityBrake("Missing object for favorite launch.", { workspaceId: result.workspaceId });
  } else if (result.workspaceId) {
    warnFavoritesAuthorityBrake("Registry rejected favorite launch.", {
      workspaceId: result.workspaceId,
      reason: result.reason,
    });
  }

  return result;
}

export function recoverWorkspaceFavoritesFromSnapshot(
  snapshot: WorkspaceFavoritesSnapshot | null
): Readonly<{ recovered: boolean; itemCount: number; reason: string }> {
  initializeWorkspaceFavoritesRegistry();

  if (!snapshot) {
    warnFavoritesRegistryBrake("Recovery skipped — empty snapshot.", {});
    return Object.freeze({ recovered: false, itemCount: 0, reason: "empty_snapshot" });
  }

  if (snapshot.version !== WORKSPACE_FAVORITES_REGISTRY_VERSION || !Array.isArray(snapshot.items)) {
    warnFavoritesRegistryBrake("Recovery failed — invalid snapshot.", { version: snapshot.version });
    return Object.freeze({ recovered: false, itemCount: 0, reason: "invalid_snapshot" });
  }

  items = snapshot.items.filter(isValidPinnedItem).map((item) => ({ ...item }));
  markStoreMutated(typeof snapshot.updatedAt === "number" ? snapshot.updatedAt : Date.now());
  normalizeSortOrders();
  persistState();
  commitRegistryChange();
  return Object.freeze({
    recovered: true,
    itemCount: items.length,
    reason: "recovered",
  });
}
