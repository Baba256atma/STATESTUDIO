/**
 * NPA-T DECK-AWARE-SAVED-SCENES:1
 * Deck ownership stays on the existing Saved Scene authority.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  assessSceneOrgSavedSceneOpen,
  listSceneOrgSavedScenesForDeck,
  resolveDeckSavedSceneRestoration,
} from "./sceneOrgSavedSceneCollectionAccess.ts";
import { applySceneOrgSavedSceneCollectionMutation } from "./sceneOrgSavedSceneCollectionMutation.ts";
import {
  forgetWorkspaceSavedScenes,
  loadSceneOrgSavedScenes,
  parseSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
  SCENE_ORG_SAVED_SCENE_STORAGE_KEY,
  type SceneOrgSavedSceneStorage,
} from "./sceneOrgSavedSceneDurability.ts";
import {
  allocateSceneOrgSavedSceneId,
  createSceneOrgSavedScene,
  type SceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract.ts";

const WORKSPACE = "npa_t_scene_company";
const OTHER = "npa_t_scene_other";

function scene(input: {
  sceneId: string;
  name: string;
  workspaceId?: string | null;
  ownerDeckId?: string | null;
  demoProfileId?: "manufacturing" | "project" | null;
  kind?: "SAVED" | "DEFAULT_MANAGER";
  canonicalId?: string;
}): SceneOrgSavedScene {
  return createSceneOrgSavedScene({
    sceneId: input.sceneId,
    name: input.name,
    kind: input.kind ?? "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: input.workspaceId,
    ownerDeckId: input.ownerDeckId,
    demoProfileId: input.demoProfileId,
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId: input.canonicalId ?? "data-source:production",
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth: "report",
      leftRegion: "management",
      rightRegion: "collapsed",
      detailWorkspace: "closed",
    },
  });
}

function memoryStorage(initial: string | null = null): SceneOrgSavedSceneStorage & {
  value: string | null;
  failWrite: boolean;
} {
  return {
    value: initial,
    failWrite: false,
    getItem(key) {
      assert.equal(key, SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
      return this.value;
    },
    setItem(key, value) {
      assert.equal(key, SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
      if (this.failWrite) throw new Error("write-failed");
      this.value = value;
    },
  };
}

test("manager scenes belong to one workspace and one deck", () => {
  const production = scene({
    sceneId: "scene-production-overview",
    name: "Production Overview",
    workspaceId: WORKSPACE,
    ownerDeckId: "production",
  });
  const finance = scene({
    sceneId: "scene-financial-performance",
    name: "Financial Performance",
    workspaceId: WORKSPACE,
    ownerDeckId: "finance",
  });
  const executive = scene({
    sceneId: "scene-company-overview",
    name: "Company Overview",
    workspaceId: WORKSPACE,
    ownerDeckId: "executive",
  });
  const foreign = scene({
    sceneId: "scene-foreign",
    name: "Foreign",
    workspaceId: OTHER,
    ownerDeckId: "production",
  });
  const legacy = scene({
    sceneId: "scene-legacy",
    name: "Legacy",
    workspaceId: WORKSPACE,
  });
  const records = [production, finance, executive, foreign, legacy];
  assert.equal(production.ownerDeckId, "production");
  assert.equal(legacy.ownerDeckId, undefined);
  assert.deepEqual(
    listSceneOrgSavedScenesForDeck(records, WORKSPACE, "production", "ACTIVE").map((entry) => entry.sceneId),
    ["scene-production-overview"],
  );
  assert.deepEqual(
    listSceneOrgSavedScenesForDeck(records, WORKSPACE, "finance", "ACTIVE").map((entry) => entry.name),
    ["Financial Performance"],
  );
  assert.deepEqual(
    listSceneOrgSavedScenesForDeck(records, WORKSPACE, "executive", "ACTIVE").map((entry) => entry.name),
    ["Company Overview"],
  );
  assert.deepEqual(listSceneOrgSavedScenesForDeck(records, OTHER, "production", "ACTIVE").map((entry) => entry.sceneId), ["scene-foreign"]);
  assert.deepEqual(listSceneOrgSavedScenesForDeck(records, WORKSPACE, "production", "ARCHIVED"), []);
  assert.deepEqual(listSceneOrgSavedScenesForDeck(records, WORKSPACE, "missing", "missing"), []);
  assert.equal(assessSceneOrgSavedSceneOpen(records, production.sceneId, OTHER, "production").status, "mismatch");
  assert.equal(assessSceneOrgSavedSceneOpen(records, production.sceneId, WORKSPACE, "finance").status, "mismatch");
  assert.equal(assessSceneOrgSavedSceneOpen(records, legacy.sceneId, WORKSPACE, "executive").status, "unassigned");
});

test("the same display name can exist in two decks without sharing one record", () => {
  const first = scene({
    sceneId: "scene-overview",
    name: "Overview",
    workspaceId: WORKSPACE,
    ownerDeckId: "production",
  });
  const requested = "scene-overview";
  const allocated = allocateSceneOrgSavedSceneId({
    requestedSceneId: requested,
    scenes: [first],
    managerWorkspaceId: WORKSPACE,
    ownerDeckId: "finance",
  });
  assert.equal(allocated, "scene-overview-finance");
  const second = scene({
    sceneId: allocated,
    name: "Overview",
    workspaceId: WORKSPACE,
    ownerDeckId: "finance",
  });
  assert.notEqual(first.sceneId, second.sceneId);
  const renamed = applySceneOrgSavedSceneCollectionMutation({
    scenes: [first, second],
    mutation: { kind: "rename", sceneId: second.sceneId, name: "Finance Overview" },
    managerWorkspaceId: WORKSPACE,
    ownerDeckId: "finance",
    storage: memoryStorage(),
  });
  assert.equal(renamed.status, "renamed");
  assert.equal(renamed.scene?.sceneId, second.sceneId);
  assert.equal(renamed.scenes.find((entry) => entry.sceneId === first.sceneId)?.name, "Overview");
});

test("legacy records stay unassigned and are not rewritten on load", () => {
  const legacy = scene({ sceneId: "scene-legacy", name: "Legacy", workspaceId: WORKSPACE });
  const storage = memoryStorage();
  assert.equal(persistSceneOrgSavedScenes([legacy], storage).persisted, true);
  assert.equal(storage.value?.includes("ownerDeckId"), false);
  const loaded = loadSceneOrgSavedScenes(storage);
  assert.equal(loaded.status, "loaded");
  assert.equal(loaded.scenes[0]?.sceneId, "scene-legacy");
  assert.equal(loaded.scenes[0]?.ownerDeckId, undefined);
  assert.equal(loaded.scenes[0]?.managerWorkspaceId, WORKSPACE);
  assert.deepEqual(listSceneOrgSavedScenesForDeck(loaded.scenes, WORKSPACE, "executive", "ACTIVE"), []);
});

test("persistence keeps deck ownership and rejects a failed write", () => {
  const saved = scene({
    sceneId: "scene-production-overview",
    name: "Production Overview",
    workspaceId: WORKSPACE,
    ownerDeckId: "production",
  });
  const storage = memoryStorage();
  assert.equal(persistSceneOrgSavedScenes([saved], storage).persisted, true);
  const refreshed = loadSceneOrgSavedScenes(storage);
  assert.equal(refreshed.scenes[0]?.ownerDeckId, "production");
  assert.equal(refreshed.scenes[0]?.layout.rightRegion, "collapsed");
  storage.failWrite = true;
  const before = storage.value;
  assert.deepEqual(persistSceneOrgSavedScenes([
    scene({ sceneId: "scene-new", name: "New", workspaceId: WORKSPACE, ownerDeckId: "finance" }),
  ], storage), { persisted: false, reason: "write-failed" });
  assert.equal(storage.value, before);
  assert.equal(loadSceneOrgSavedScenes(storage).scenes[0]?.sceneId, "scene-production-overview");
});

test("corrupt and unsupported scene storage does not replace existing records", () => {
  assert.equal(parseSceneOrgSavedScenes("{").status, "invalid");
  assert.equal(parseSceneOrgSavedScenes(JSON.stringify({
    identity: "NPA-T SAVED-SCENE-DURABILITY:1/LocalSavedSceneMetadata",
    version: 2,
    scenes: [],
  })).status, "incompatible");
});

test("two deck defaults load and a foreign deck default is untouched", () => {
  const production = scene({
    sceneId: "scene-production",
    name: "Production",
    workspaceId: WORKSPACE,
    ownerDeckId: "production",
    kind: "DEFAULT_MANAGER",
  });
  const finance = scene({
    sceneId: "scene-finance",
    name: "Finance",
    workspaceId: WORKSPACE,
    ownerDeckId: "finance",
    kind: "DEFAULT_MANAGER",
  });
  const storage = memoryStorage();
  persistSceneOrgSavedScenes([production, finance], storage);
  const loaded = loadSceneOrgSavedScenes(storage);
  assert.equal(loaded.rejectedRecords, 0);
  assert.deepEqual(loaded.scenes.map((entry) => entry.kind), ["DEFAULT_MANAGER", "DEFAULT_MANAGER"]);
  const changed = applySceneOrgSavedSceneCollectionMutation({
    scenes: loaded.scenes,
    mutation: { kind: "delete", sceneId: production.sceneId },
    managerWorkspaceId: WORKSPACE,
    ownerDeckId: "finance",
    storage,
  });
  assert.equal(changed.status, "not-found");
  assert.equal(changed.scenes.length, 2);
});

test("restoration uses current authorized ids and does not invent missing objects", () => {
  const references = [{ canonicalId: "data-source:production" }, { canonicalId: "data-source:finance" }];
  assert.equal(resolveDeckSavedSceneRestoration({
    references,
    authorizedIds: ["data-source:production", "data-source:finance"],
    loading: false,
  }).status, "restored");
  const removed = resolveDeckSavedSceneRestoration({
    references,
    authorizedIds: ["data-source:finance"],
    loading: false,
  });
  assert.equal(removed.status, "partial");
  assert.deepEqual(removed.unavailableIds, ["data-source:production"]);
  assert.equal(resolveDeckSavedSceneRestoration({
    references,
    authorizedIds: [],
    loading: false,
  }).status, "missing");
  assert.equal(resolveDeckSavedSceneRestoration({
    references,
    authorizedIds: [],
    loading: true,
  }).status, "loading");
});

test("demo scenes keep their profile ownership and do not gain a manager deck", () => {
  const manufacturing = scene({
    sceneId: "scene-capacity",
    name: "Capacity",
    workspaceId: "demo_workspace",
    demoProfileId: "manufacturing",
    ownerDeckId: "production",
    canonicalId: "obj-capacity",
  });
  const project = scene({
    sceneId: "scene-project",
    name: "Project",
    workspaceId: "demo_workspace",
    demoProfileId: "project",
    canonicalId: "demo-subject:project:project-control",
  });
  const business = scene({
    sceneId: "scene-business",
    name: "Business",
    workspaceId: "business_demo_workspace",
    ownerDeckId: "executive",
    canonicalId: "business-demo:business_demo_workspace:revenue",
  });
  assert.equal(manufacturing.ownerDeckId, undefined);
  assert.equal(manufacturing.demoProfileId, "manufacturing");
  assert.equal(project.demoProfileId, "project");
  assert.equal(business.ownerDeckId, undefined);
  assert.equal(business.sceneId, "scene-business");
  const storage = memoryStorage();
  persistSceneOrgSavedScenes([manufacturing, project, business], storage);
  const loaded = loadSceneOrgSavedScenes(storage);
  assert.deepEqual(loaded.scenes.map((entry) => entry.sceneId), [
    "scene-capacity",
    "scene-project",
    "scene-business",
  ]);
  assert.equal(loaded.scenes[0]?.demoProfileId, "manufacturing");
  assert.ok(loaded.scenes.every((entry) => entry.ownerDeckId == null));
  assert.equal(
    listSceneOrgSavedScenesForDeck(loaded.scenes, "demo_workspace", "production", "ACTIVE").length,
    0,
  );
});

test("deleting a workspace removes only that workspace's scenes", () => {
  const owned = scene({ sceneId: "scene-owned", name: "Owned", workspaceId: WORKSPACE, ownerDeckId: "production" });
  const kept = scene({ sceneId: "scene-kept", name: "Kept", workspaceId: OTHER, ownerDeckId: "finance" });
  const storage = memoryStorage();
  persistSceneOrgSavedScenes([owned, kept], storage);
  assert.equal(forgetWorkspaceSavedScenes(WORKSPACE, storage), true);
  const loaded = loadSceneOrgSavedScenes(storage);
  assert.deepEqual(loaded.scenes.map((entry) => entry.sceneId), ["scene-kept"]);
});
