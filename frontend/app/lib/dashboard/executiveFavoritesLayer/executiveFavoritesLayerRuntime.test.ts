import test from "node:test";
import assert from "node:assert/strict";

import { resetExecutiveFavoritesLayerBrakesForTests } from "./executiveFavoritesLayerContract.ts";
import { buildExecutiveFavoritesLayerView } from "./executiveFavoritesLayerRuntime.ts";
import {
  initializeWorkspaceFavoritesRegistry,
  restoreDefaultWorkspaceFavorites,
  resetWorkspaceFavoritesRegistryForTests,
  setWorkspaceFavoritesPersistenceAdapterForTests,
} from "../../workspaces/workspaceFavoritesRegistry.ts";
import { resetWorkspaceFavoritesBrakesForTests } from "../../workspaces/workspaceFavoritesContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";

test.beforeEach(() => {
  resetExecutiveFavoritesLayerBrakesForTests();
  resetWorkspaceFavoritesBrakesForTests();
  resetWorkspaceFavoritesRegistryForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  setWorkspaceFavoritesPersistenceAdapterForTests(
    Object.freeze({ load: () => null, save: () => undefined, clear: () => undefined })
  );
});

test("favorites layer projects registry items read-only", () => {
  restoreDefaultWorkspaceFavorites();
  const snapshot = initializeWorkspaceFavoritesRegistry();
  const view = buildExecutiveFavoritesLayerView({ snapshot });

  assert.equal(view.source, "executive_favorites_layer");
  assert.equal(view.favorites.length, 4);
  assert.ok(view.favorites.some((entry) => entry.itemType === "dashboard_mode"));
  assert.ok(view.favorites.some((entry) => entry.itemType === "war_room"));
});

test("empty favorites layer shows no cards", () => {
  const snapshot = initializeWorkspaceFavoritesRegistry();
  const view = buildExecutiveFavoritesLayerView({ snapshot });
  assert.equal(view.favorites.length, 0);
});

test("favorite cards include type and last opened labels", () => {
  restoreDefaultWorkspaceFavorites();
  const snapshot = initializeWorkspaceFavoritesRegistry();
  const view = buildExecutiveFavoritesLayerView({
    snapshot,
    selectedObjectId: "line-1",
  });
  const analyze = view.favorites.find((entry) => entry.workspaceTarget === "analyze");
  assert.ok(analyze);
  assert.match(analyze.typeLabel, /Analyze/i);
  assert.ok(analyze.lastAccessedLabel.length > 0);
  assert.equal(analyze.quickOpenLabel, "Quick Open");
});
