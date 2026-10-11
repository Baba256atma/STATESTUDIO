/** NPA-T SAVED-SCENE-COLLECTION-MANAGEMENT:1 — rename/delete collection mutation. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import { createSceneOrgSavedScene, type SceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";
import { resolveSceneOrgSavedSceneAccess } from "./sceneOrgSavedSceneCollectionAccess.ts";
import {
  persistSceneOrgSavedScenes,
  loadSceneOrgSavedScenes,
  type SceneOrgSavedScenePersistResult,
  type SceneOrgSavedSceneStorage,
} from "./sceneOrgSavedSceneDurability.ts";
import { applySceneOrgSavedSceneCollectionMutation } from "./sceneOrgSavedSceneCollectionMutation.ts";

function scene(
  sceneId: string,
  name: string,
  canonicalId = "obj-capacity",
  kind: SceneOrgSavedScene["kind"] = "SAVED",
): SceneOrgSavedScene {
  return createSceneOrgSavedScene({
    sceneId,
    name,
    kind,
    sceneIntentType: "manager-view",
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId,
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
  });
}

function memoryStorage(initial: string | null = null): SceneOrgSavedSceneStorage & {
  value: string | null;
  failWrite: boolean;
} {
  const storage = {
    value: initial,
    failWrite: false,
    getItem() {
      return storage.value;
    },
    setItem(_key: string, value: string) {
      if (storage.failWrite) throw new Error("write-failed");
      storage.value = value;
    },
  };
  return storage;
}

const collection = [
  scene("scene-main", "Main", "obj-capacity", "DEFAULT_MANAGER"),
  scene("scene-risk-room", "Risk Room", "obj-risk"),
  scene("scene-capacity-review", "Capacity Review", "obj-capacity"),
];

test("rename Risk Room to Enterprise Risk preserves sceneId and canonical references", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-risk-room", name: "Enterprise Risk" },
    storage,
  });
  assert.equal(result.status, "renamed");
  assert.equal(result.scene?.sceneId, "scene-risk-room");
  assert.equal(result.scene?.name, "Enterprise Risk");
  assert.equal(result.scene?.canonicalReferences[0]?.canonicalId, "obj-risk");
  assert.equal(result.scene?.kind, "SAVED");
  assert.equal(result.scenes.length, 3);
  assert.equal(result.scenes[1]?.sceneId, "scene-risk-room");
  const reloaded = loadSceneOrgSavedScenes(storage).scenes;
  assert.equal(reloaded.find((entry) => entry.sceneId === "scene-risk-room")?.name, "Enterprise Risk");
  assert.equal(
    resolveSceneOrgSavedSceneAccess(reloaded, { phrase: "Enterprise Risk" }).scene?.sceneId,
    "scene-risk-room",
  );
  assert.equal(
    resolveSceneOrgSavedSceneAccess(reloaded, { phrase: "Risk Room" }).status,
    "not-found",
  );
});

test("empty and whitespace-only rename fail closed without persistence", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const before = storage.value;
  for (const name of ["", "   "]) {
    const result = applySceneOrgSavedSceneCollectionMutation({
      scenes: collection,
      mutation: { kind: "rename", sceneId: "scene-risk-room", name },
      storage,
    });
    assert.equal(result.status, "invalid-name");
    assert.equal(result.scenes, collection);
    assert.equal(storage.value, before);
  }
});

test("rename to the same name is an unchanged no-op", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const before = storage.value;
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-risk-room", name: "Risk Room" },
    storage,
  });
  assert.equal(result.status, "unchanged");
  assert.equal(result.scene?.sceneId, "scene-risk-room");
  assert.equal(storage.value, before);
});

test("normalized name collisions are rejected rather than guessed", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const before = storage.value;
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-risk-room", name: "main" },
    storage,
  });
  assert.equal(result.status, "name-conflict");
  assert.equal(result.scenes.find((entry) => entry.sceneId === "scene-risk-room")?.name, "Risk Room");
  assert.equal(storage.value, before);
});

test("missing Scene ID rename/delete does not mutate by index or similar name", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const before = storage.value;
  const renamed = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-missing", name: "Enterprise Risk" },
    storage,
  });
  const deleted = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "delete", sceneId: "scene-missing" },
    storage,
  });
  assert.equal(renamed.status, "not-found");
  assert.equal(deleted.status, "not-found");
  assert.equal(storage.value, before);
  assert.equal(renamed.scenes.length, 3);
});

test("delete removes one Scene metadata record and preserves same-canonical siblings", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "delete", sceneId: "scene-capacity-review" },
    storage,
  });
  assert.equal(result.status, "deleted");
  assert.equal(result.scenes.length, 2);
  assert.equal(
    result.scenes.some((entry) => entry.sceneId === "scene-capacity-review"),
    false,
  );
  assert.equal(result.scenes.find((entry) => entry.sceneId === "scene-main")?.canonicalReferences[0]?.canonicalId, "obj-capacity");
  const reloaded = loadSceneOrgSavedScenes(storage).scenes;
  assert.equal(reloaded.length, 2);
  assert.equal(
    resolveSceneOrgSavedSceneAccess(reloaded, { phrase: "Capacity Review" }).status,
    "not-found",
  );
  assert.equal(
    resolveSceneOrgSavedSceneAccess(reloaded, { phrase: "Main" }).scene?.sceneId,
    "scene-main",
  );
});

test("default Scene rename preserves DEFAULT_MANAGER on the same sceneId", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-main", name: "Executive Home" },
    storage,
  });
  assert.equal(result.status, "renamed");
  assert.equal(result.scene?.kind, "DEFAULT_MANAGER");
  assert.equal(result.scene?.sceneId, "scene-main");
});

test("default Scene delete is allowed and does not promote another Scene", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "delete", sceneId: "scene-main" },
    storage,
  });
  assert.equal(result.status, "deleted");
  assert.equal(result.scenes.some((entry) => entry.kind === "DEFAULT_MANAGER"), false);
  assert.equal(result.scenes.length, 2);
});

test("last Scene delete yields an empty collection", () => {
  const storage = memoryStorage();
  const only = [scene("scene-risk-room", "Risk Room", "obj-risk")];
  persistSceneOrgSavedScenes(only, storage);
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: only,
    mutation: { kind: "delete", sceneId: "scene-risk-room" },
    storage,
  });
  assert.equal(result.status, "deleted");
  assert.deepEqual(result.scenes, []);
  assert.equal(loadSceneOrgSavedScenes(storage).scenes.length, 0);
});

test("failed rename and delete persistence preserve the prior collection", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes(collection, storage);
  const before = storage.value;
  storage.failWrite = true;
  const renamed = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-risk-room", name: "Enterprise Risk" },
    storage,
  });
  const deleted = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "delete", sceneId: "scene-risk-room" },
    storage,
  });
  assert.equal(renamed.status, "persistence-failed");
  assert.equal(deleted.status, "persistence-failed");
  assert.equal(renamed.scenes.find((entry) => entry.sceneId === "scene-risk-room")?.name, "Risk Room");
  assert.equal(deleted.scenes.length, 3);
  assert.equal(storage.value, before);
});

test("injected persist failure never reports success", () => {
  const persist = (): SceneOrgSavedScenePersistResult =>
    Object.freeze({ persisted: false, reason: "write-failed" });
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "delete", sceneId: "scene-risk-room" },
    persist,
  });
  assert.equal(result.status, "persistence-failed");
  assert.equal(result.scenes, collection);
});

test("rejected records are not mutation candidates because mutation uses the hydrated collection", () => {
  const hydrated = collection;
  const result = applySceneOrgSavedSceneCollectionMutation({
    scenes: hydrated,
    mutation: { kind: "rename", sceneId: "scene-bad", name: "Resurrected" },
  });
  assert.equal(result.status, "not-found");
  assert.equal(result.scenes, hydrated);
});

test("shell commits rename/delete through persist-first mutation and does not write localStorage from the UI", () => {
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  const ui = readFileSync(
    new URL("../../executive/nex-mvp/NexoraSavedSceneCollectionAccess.tsx", import.meta.url),
    "utf8",
  );
  assert.match(shell, /applySceneOrgSavedSceneCollectionMutation/);
  assert.match(shell, /data-saved-scene-mutation-status/);
  assert.doesNotMatch(ui, /localStorage/);
  assert.doesNotMatch(ui, /persistSceneOrgSavedScenes/);
  const source = readFileSync(
    new URL("./sceneOrgSavedSceneCollectionMutation.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /obj-risk|catalog|nmi|dataReality|watch/i);
});
