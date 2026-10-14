/**
 * NPA-T MANAGER-WORKSPACE-ISOLATION:5 — Saved Scene workspace ownership.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { nmiFoundationIdentity } from "../nmi/nmiIdentity.ts";
import { bindWorkflowMode, createManagerWorkspace, readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { getActiveWorkspaceId, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import {
  assessSceneOrgSavedSceneOpen,
  listSceneOrgSavedScenesForManagerWorkspace,
} from "./sceneOrgSavedSceneCollectionAccess.ts";
import { applySceneOrgSavedSceneCollectionMutation } from "./sceneOrgSavedSceneCollectionMutation.ts";
import {
  applySavedSceneOwnershipMigration,
  loadSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
  SAVED_SCENE_OWNERSHIP_EVIDENCE,
  SCENE_ORG_SAVED_SCENE_STORAGE_KEY,
  type SceneOrgSavedSceneStorage,
} from "./sceneOrgSavedSceneDurability.ts";
import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  createSceneOrgSavedScene,
  SCENE_ORG_PLACEMENT_AUTHORITY_GUARD,
  type SceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract.ts";

const shellSource = readFileSync(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url), "utf8");

function scene(input: {
  sceneId: string;
  name: string;
  owner?: string | null;
  kind?: "SAVED" | "DEFAULT_MANAGER";
}): SceneOrgSavedScene {
  return createSceneOrgSavedScene({
    sceneId: input.sceneId,
    name: input.name,
    kind: input.kind ?? "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: input.owner,
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId: "obj-capacity",
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth: "report",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
  });
}

function memoryStorage(): SceneOrgSavedSceneStorage & { value: string | null } {
  return {
    value: null,
    getItem(key) {
      assert.equal(key, SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
      return this.value;
    },
    setItem(key, value) {
      assert.equal(key, SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
      this.value = value;
    },
  };
}

test.beforeEach(() => resetWorkspaceRegistryForTests());
test.afterEach(() => resetWorkspaceRegistryForTests());

test("MWI:5 I1–I7 I10 two Manager Workspaces isolate Saved Scenes, rename, delete, default, and the dial", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  const collection = [
    scene({ sceneId: "scene-baha-1", name: "BAHA Scene 1", owner: baha.workspaceId }),
    scene({ sceneId: "scene-baha-2", name: "BAHA Scene 2", owner: baha.workspaceId, kind: "DEFAULT_MANAGER" }),
    scene({ sceneId: "scene-factory-1", name: "Factory Scene 1", owner: factory.workspaceId, kind: "DEFAULT_MANAGER" }),
    scene({ sceneId: "scene-demo", name: "Demo Scene", owner: DEMO_WORKSPACE_ID }),
    scene({ sceneId: "scene-legacy", name: "Legacy Scene" }),
  ];

  assert.deepEqual(
    listSceneOrgSavedScenesForManagerWorkspace(collection, baha.workspaceId).map((entry) => entry.sceneId),
    ["scene-baha-1", "scene-baha-2"],
  );
  assert.deepEqual(
    listSceneOrgSavedScenesForManagerWorkspace(collection, factory.workspaceId).map((entry) => entry.sceneId),
    ["scene-factory-1"],
  );
  assert.deepEqual(
    listSceneOrgSavedScenesForManagerWorkspace(collection, DEMO_WORKSPACE_ID).map((entry) => entry.sceneId),
    ["scene-demo"],
  );
  assert.deepEqual(listSceneOrgSavedScenesForManagerWorkspace(collection, "overview"), []);
  assert.equal(collection.find((entry) => entry.sceneId === "scene-baha-1")?.managerWorkspaceId, baha.workspaceId);

  for (const mode of ["overview", "problem", "scenario", "decision", "execution"] as const) {
    bindWorkflowMode({ workspaceId: factory.workspaceId, workflowMode: mode });
    assert.equal(readLiveExecutiveDataWorkspaceId(), factory.workspaceId);
    assert.deepEqual(
      listSceneOrgSavedScenesForManagerWorkspace(collection, factory.workspaceId).map((entry) => entry.sceneId),
      ["scene-factory-1"],
    );
    assert.equal(collection[0]?.managerWorkspaceId, baha.workspaceId);
  }

  const storage = memoryStorage();
  const renamed = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-baha-1", name: "BAHA Scene 1 Renamed" },
    managerWorkspaceId: baha.workspaceId,
    storage,
  });
  assert.equal(renamed.status, "renamed");
  assert.equal(renamed.scene?.sceneId, "scene-baha-1");
  assert.equal(renamed.scene?.managerWorkspaceId, baha.workspaceId);
  const foreignRename = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "rename", sceneId: "scene-factory-1", name: "Taken" },
    managerWorkspaceId: baha.workspaceId,
    storage,
  });
  assert.equal(foreignRename.status, "not-found");
  assert.equal(foreignRename.scenes.find((entry) => entry.sceneId === "scene-factory-1")?.name, "Factory Scene 1");

  const foreignDelete = applySceneOrgSavedSceneCollectionMutation({
    scenes: collection,
    mutation: { kind: "delete", sceneId: "scene-factory-1" },
    managerWorkspaceId: baha.workspaceId,
    storage,
  });
  assert.equal(foreignDelete.status, "not-found");
  assert.equal(foreignDelete.scenes.some((entry) => entry.sceneId === "scene-factory-1"), true);

  assert.equal(persistSceneOrgSavedScenes(collection, storage).persisted, true);
  const hydrated = loadSceneOrgSavedScenes(storage).scenes;
  assert.equal(hydrated.find((entry) => entry.sceneId === "scene-baha-2")?.kind, "DEFAULT_MANAGER");
  assert.equal(hydrated.find((entry) => entry.sceneId === "scene-factory-1")?.kind, "DEFAULT_MANAGER");
  assert.equal(hydrated.find((entry) => entry.sceneId === "scene-baha-1")?.managerWorkspaceId, baha.workspaceId);
  assert.equal(hydrated.find((entry) => entry.sceneId === "scene-legacy")?.managerWorkspaceId, undefined);

  assert.equal(assessSceneOrgSavedSceneOpen(collection, "scene-factory-1", baha.workspaceId).status, "mismatch");
  assert.equal(assessSceneOrgSavedSceneOpen(collection, "scene-baha-1", baha.workspaceId).status, "allowed");
  assert.equal(assessSceneOrgSavedSceneOpen(collection, "scene-legacy", baha.workspaceId).status, "unassigned");
  assert.equal(SCENE_ORG_PLACEMENT_AUTHORITY_GUARD.copiesCanonicalBusinessState, false);
  assert.equal(SCENE_ORG_PLACEMENT_AUTHORITY_GUARD.createsPersistenceStore, false);
});

test("MWI:5 I8/I9 historical scenes stay unassigned unless one explicit proof names an owner", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  const historical = [scene({ sceneId: "scene-old", name: "Old View" })];
  const guessed = applySavedSceneOwnershipMigration(historical, {
    activeWorkspaceId: baha.workspaceId,
    proofs: [{ sceneId: "scene-old", targetWorkspaceId: baha.workspaceId, basis: "active-workspace" }],
  });
  assert.equal(guessed.changed, false);
  assert.equal(guessed.scenes, historical);
  assert.equal(guessed.scenes[0]?.managerWorkspaceId, undefined);
  assert.equal(SAVED_SCENE_OWNERSHIP_EVIDENCE.rejected.includes("active-workspace"), true);

  const conflict = applySavedSceneOwnershipMigration(historical, {
    proofs: [
      { sceneId: "scene-old", targetWorkspaceId: baha.workspaceId, basis: "explicit-source-link" },
      { sceneId: "scene-old", targetWorkspaceId: factory.workspaceId, basis: "business-project-reference" },
    ],
  });
  assert.equal(conflict.changed, false);
  assert.equal(conflict.scenes[0]?.managerWorkspaceId, undefined);

  const moved = applySavedSceneOwnershipMigration(historical, {
    activeWorkspaceId: factory.workspaceId,
    proofs: [{ sceneId: "scene-old", targetWorkspaceId: baha.workspaceId, basis: "explicit-source-link" }],
  });
  assert.equal(moved.changed, true);
  assert.equal(moved.scenes[0]?.sceneId, "scene-old");
  assert.equal(moved.scenes[0]?.managerWorkspaceId, baha.workspaceId);
  const second = applySavedSceneOwnershipMigration(moved.scenes, {
    proofs: [{ sceneId: "scene-old", targetWorkspaceId: factory.workspaceId, basis: "explicit-source-link" }],
  });
  assert.equal(second.changed, false);
  assert.equal(second.scenes, moved.scenes);
  assert.equal(second.scenes[0]?.managerWorkspaceId, baha.workspaceId);

  const workflowOwned = createSceneOrgSavedScene({
    ...scene({ sceneId: "scene-dial", name: "Dial" }),
    managerWorkspaceId: "decision",
  });
  assert.equal(workflowOwned.managerWorkspaceId, undefined);
  assert.deepEqual(listSceneOrgSavedScenesForManagerWorkspace([workflowOwned, ...moved.scenes], baha.workspaceId).map((entry) => entry.sceneId), ["scene-old"]);
});

test("MWI:5 shell binds new scenes to the live Manager Workspace and keeps Scene Org authority", () => {
  const save = shellSource.slice(shellSource.indexOf('case "SAVE_SCENE"'), shellSource.indexOf('case "SHOW_SAVED_SCENES"'));
  assert.match(save, /const sceneOwnerId = readLiveExecutiveDataWorkspaceId\(\)/);
  assert.match(save, /managerWorkspaceId: sceneOwnerId/);
  assert.doesNotMatch(save, /managerWorkspaceId: interaction\.workspace/);
  assert.match(shellSource, /listSceneOrgSavedScenesForManagerWorkspace/);
  assert.match(shellSource, /assessSceneOrgSavedSceneOpen/);
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(nmiFoundationIdentity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
});
