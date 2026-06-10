import test from "node:test";
import assert from "node:assert/strict";

import {
  initializeWorkspaceFavoritesRegistry,
  pinWorkspaceAction,
  unpinWorkspaceAction,
  reorderWorkspaceFavorite,
  renameWorkspaceFavoriteLabel,
  resetWorkspaceFavorites,
  restoreDefaultWorkspaceFavorites,
  validatePinnedActionLaunch,
  recoverWorkspaceFavoritesFromSnapshot,
  getWorkspaceFavoritesSnapshot,
  subscribeWorkspaceFavorites,
  getWorkspaceFavoritesServerSnapshot,
  WORKSPACE_FAVORITES_INITIAL_SNAPSHOT,
  WORKSPACE_FAVORITES_SERVER_SNAPSHOT,
  resetWorkspaceFavoritesRegistryForTests,
  setWorkspaceFavoritesPersistenceAdapterForTests,
} from "./workspaceFavoritesRegistry.ts";
import { resetWorkspaceFavoritesBrakesForTests, WORKSPACE_FAVORITES_REGISTRY_VERSION } from "./workspaceFavoritesContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import type { WorkspaceFavoritesPersistenceAdapter } from "./workspaceFavoritesContract.ts";

function createMemoryAdapter(initial: ReturnType<typeof initializeWorkspaceFavoritesRegistry> | null = null) {
  let stored: string | null = initial
    ? JSON.stringify({
        version: WORKSPACE_FAVORITES_REGISTRY_VERSION,
        updatedAt: initial.updatedAt,
        items: initial.items,
      })
    : null;

  const adapter: WorkspaceFavoritesPersistenceAdapter = Object.freeze({
    load() {
      if (!stored) return null;
      return JSON.parse(stored);
    },
    save(snapshot) {
      stored = JSON.stringify(snapshot);
    },
    clear() {
      stored = null;
    },
  });

  return adapter;
}

test.beforeEach(() => {
  resetWorkspaceFavoritesBrakesForTests();
  resetWorkspaceFavoritesRegistryForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  setWorkspaceFavoritesPersistenceAdapterForTests(createMemoryAdapter());
});

test("restore defaults pins analyze, compare, scenario, war room", () => {
  restoreDefaultWorkspaceFavorites();
  const state = initializeWorkspaceFavoritesRegistry();
  const targets = state.items.map((item) => item.workspaceTarget);
  assert.deepEqual(targets, ["analyze", "compare", "scenario", "war_room"]);
});

test("pin and unpin workspace favorite", () => {
  resetWorkspaceFavorites();
  const pin = pinWorkspaceAction({ workspaceId: "analyze" });
  assert.equal(pin.success, true);
  assert.equal(initializeWorkspaceFavoritesRegistry().items.length, 1);

  const unpin = unpinWorkspaceAction(pin.item!.id);
  assert.equal(unpin.success, true);
  assert.equal(initializeWorkspaceFavoritesRegistry().items.length, 0);
});

test("reorder favorites", () => {
  restoreDefaultWorkspaceFavorites();
  const state = initializeWorkspaceFavoritesRegistry();
  const firstId = state.items[0]!.id;
  reorderWorkspaceFavorite({ favoriteId: state.items[1]!.id, direction: "up" });
  const reordered = initializeWorkspaceFavoritesRegistry();
  assert.equal(reordered.items[0]!.id, state.items[1]!.id);
  assert.notEqual(reordered.items[0]!.id, firstId);
});

test("rename favorite label metadata only", () => {
  restoreDefaultWorkspaceFavorites();
  const item = initializeWorkspaceFavoritesRegistry().items[0]!;
  renameWorkspaceFavoriteLabel({ favoriteId: item.id, customLabel: "My Analyze" });
  const renamed = initializeWorkspaceFavoritesRegistry().items[0]!;
  assert.equal(renamed.customLabel, "My Analyze");
  assert.equal(renamed.title, item.title);
});

test("validate pinned launch approves inactive workspace with object", () => {
  restoreDefaultWorkspaceFavorites();
  const favorite = initializeWorkspaceFavoritesRegistry().items[0]!;
  const validation = validatePinnedActionLaunch({
    favoriteId: favorite.id,
    activeWorkspaceId: "compare",
    selectedObjectId: "line-1",
  });
  assert.equal(validation.approved, true);
  assert.equal(validation.workspaceId, favorite.workspaceTarget);
});

test("blocks launch for currently active workspace", () => {
  restoreDefaultWorkspaceFavorites();
  const favorite = initializeWorkspaceFavoritesRegistry().items[0]!;
  const validation = validatePinnedActionLaunch({
    favoriteId: favorite.id,
    activeWorkspaceId: favorite.workspaceTarget,
    selectedObjectId: "line-1",
  });
  assert.equal(validation.approved, false);
  assert.equal(validation.reason, "already_active");
});

test("blocks invalid favorite launch without object", () => {
  restoreDefaultWorkspaceFavorites();
  const favorite = initializeWorkspaceFavoritesRegistry().items[0]!;
  const validation = validatePinnedActionLaunch({
    favoriteId: favorite.id,
    activeWorkspaceId: null,
  });
  assert.equal(validation.approved, false);
  assert.equal(validation.reason, "missing_object");
});

test("registry recovery from corrupt snapshot fails safely", () => {
  const recovery = recoverWorkspaceFavoritesFromSnapshot({
    version: "0.0.0",
    updatedAt: Date.now(),
    items: [],
  });
  assert.equal(recovery.recovered, false);
});

test("favorites persist across registry re-init", () => {
  restoreDefaultWorkspaceFavorites();
  const before = initializeWorkspaceFavoritesRegistry();
  resetWorkspaceFavoritesRegistryForTests();
  setWorkspaceFavoritesPersistenceAdapterForTests(
    createMemoryAdapter(before)
  );
  const after = initializeWorkspaceFavoritesRegistry();
  assert.equal(after.items.length, before.items.length);
});

test("reset favorites clears registry", () => {
  restoreDefaultWorkspaceFavorites();
  resetWorkspaceFavorites();
  assert.equal(initializeWorkspaceFavoritesRegistry().items.length, 0);
});

test("getSnapshot returns stable reference when state unchanged", () => {
  restoreDefaultWorkspaceFavorites();
  const first = getWorkspaceFavoritesSnapshot();
  const second = getWorkspaceFavoritesSnapshot();
  assert.equal(first, second);
  assert.equal(first.updatedAt, second.updatedAt);
});

test("getSnapshot before init is pure and does not load persistence", () => {
  let loadCount = 0;
  setWorkspaceFavoritesPersistenceAdapterForTests(
    Object.freeze({
      load() {
        loadCount += 1;
        return null;
      },
      save() {},
      clear() {},
    })
  );

  const first = getWorkspaceFavoritesSnapshot();
  const second = getWorkspaceFavoritesSnapshot();
  assert.equal(first, WORKSPACE_FAVORITES_INITIAL_SNAPSHOT);
  assert.equal(second, first);
  assert.equal(loadCount, 0);
});

test("getSnapshot returns new reference after mutation", () => {
  resetWorkspaceFavorites();
  pinWorkspaceAction({ workspaceId: "analyze" });
  const before = getWorkspaceFavoritesSnapshot();
  pinWorkspaceAction({ workspaceId: "compare" });
  const after = getWorkspaceFavoritesSnapshot();
  assert.notEqual(before, after);
  assert.ok(after.updatedAt >= before.updatedAt);
});

test("server snapshot is stable empty reference", () => {
  assert.equal(getWorkspaceFavoritesServerSnapshot(), WORKSPACE_FAVORITES_SERVER_SNAPSHOT);
  assert.equal(getWorkspaceFavoritesServerSnapshot(), WORKSPACE_FAVORITES_INITIAL_SNAPSHOT);
  assert.equal(getWorkspaceFavoritesServerSnapshot(), getWorkspaceFavoritesServerSnapshot());
});

test("subscribe initializes registry and hydrates snapshot", () => {
  restoreDefaultWorkspaceFavorites();
  const persisted = initializeWorkspaceFavoritesRegistry();
  resetWorkspaceFavoritesRegistryForTests();
  setWorkspaceFavoritesPersistenceAdapterForTests(createMemoryAdapter(persisted));

  const preSubscribe = getWorkspaceFavoritesSnapshot();
  assert.equal(preSubscribe, WORKSPACE_FAVORITES_INITIAL_SNAPSHOT);

  let listenerCalls = 0;
  const unsubscribe = subscribeWorkspaceFavorites(() => {
    listenerCalls += 1;
  });

  assert.equal(listenerCalls, 1);
  const hydrated = getWorkspaceFavoritesSnapshot();
  assert.equal(hydrated.items.length, 4);
  assert.notEqual(hydrated, WORKSPACE_FAVORITES_INITIAL_SNAPSHOT);
  unsubscribe();
});
