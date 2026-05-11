import { test } from "node:test";
import * as assert from "node:assert/strict";

import { getAddObjectMenuItemsForDomain } from "./domainAddObjectAdapter.ts";
import { applyDomainCatalogSelectionToScene } from "./domainCatalogSelection.ts";
import type { SceneJson } from "../sceneTypes.ts";

function emptyScene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [],
      loops: [],
    },
  };
}

test("domain catalog selection inserts through canonical scene insertion shape", () => {
  const supplier = getAddObjectMenuItemsForDomain("supply_chain").find(
    (item) => item.templateId === "supply_chain_supplier"
  );
  assert.ok(supplier);

  const original = emptyScene();
  const result = applyDomainCatalogSelectionToScene({
    currentScene: original,
    item: supplier,
  });

  assert.equal(result.success, true);
  assert.ok(result.nextScene);
  assert.equal(original.scene.objects?.length, 0);
  assert.equal(result.nextScene.scene.objects?.length, 1);
  assert.equal(result.createdObjectId, "domain_supply_chain_supplier");
  const createdMeta = result.nextScene.scene.objects?.[0]?.meta as Record<string, unknown> | undefined;
  assert.equal(createdMeta?.createdFrom, "domain_catalog");
});

test("domain catalog selection preserves duplicate protection", () => {
  const inventory = getAddObjectMenuItemsForDomain("supply_chain").find(
    (item) => item.templateId === "supply_chain_inventory"
  );
  assert.ok(inventory);

  const first = applyDomainCatalogSelectionToScene({
    currentScene: emptyScene(),
    item: inventory,
  });
  assert.equal(first.success, true);
  assert.ok(first.nextScene);

  const duplicate = applyDomainCatalogSelectionToScene({
    currentScene: first.nextScene,
    item: inventory,
  });

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.nextScene, first.nextScene);
  assert.ok(duplicate.warnings?.includes("duplicate_object_skipped"));
});
