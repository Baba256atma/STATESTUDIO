/**
 * NPA-T STAGE-SPATIAL-PERSISTENCE:1
 * Stage-plane positions belong to the existing Saved Scene record.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { projectNexoraDecisionTheatreDataObjectsToStage } from "../decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import type { NexoraDecisionTheatreDataObject } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import type { NexoraMVPStageObjectPresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import { applySceneOrgSavedSceneCollectionMutation } from "./sceneOrgSavedSceneCollectionMutation.ts";
import { resolveDeckSavedSceneRestoration } from "./sceneOrgSavedSceneCollectionAccess.ts";
import {
  loadSceneOrgSavedScenes,
  parseSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
  SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
  SCENE_ORG_SAVED_SCENE_STORAGE_KEY,
  sceneOrgSavedSceneDurabilityIdentity,
  type SceneOrgSavedSceneStorage,
} from "./sceneOrgSavedSceneDurability.ts";
import {
  captureSceneOrgSavedSceneSpatialState,
  parseSceneOrgSavedSceneSpatialState,
  parseStagePlanePosition,
  resolveAuthorizedSceneSpatialPositions,
  SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM,
  SCENE_ORG_STAGE_PLANE_LIMIT,
} from "./sceneOrgSavedSceneSpatialState.ts";
import { createSceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";

const OBJECT_A = "data-source:acme:csv%3Aacme%3Aproduction-csv";
const OBJECT_B = "data-source:acme:csv%3Aacme%3Afinance-csv";

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

function spatial(id: string, x: number, y: number) {
  const captured = captureSceneOrgSavedSceneSpatialState([
    { canonicalObjectId: id, x, y },
  ]);
  assert.equal(captured.ok, true);
  assert.ok(captured.ok);
  return captured.spatialState;
}

function sceneWith(input: { sceneId: string; deckId: string; x: number; y: number; objectId?: string }) {
  return createSceneOrgSavedScene({
    sceneId: input.sceneId,
    name: input.sceneId,
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "acme",
    ownerDeckId: input.deckId,
    canonicalReferences: [],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
    spatialState: spatial(input.objectId ?? OBJECT_A, input.x, input.y),
  });
}

test("stage-plane coordinates accept finite coplanar values and reject invalid numbers", () => {
  assert.deepEqual(parseStagePlanePosition({ x: 1.25, y: -0.5, z: 0 }), { x: 1.25, y: -0.5, z: 0 });
  assert.equal(parseStagePlanePosition({ x: Number.NaN, y: 0, z: 0 }), null);
  assert.equal(parseStagePlanePosition({ x: Number.POSITIVE_INFINITY, y: 0, z: 0 }), null);
  assert.equal(parseStagePlanePosition({ x: 0, y: Number.NEGATIVE_INFINITY, z: 0 }), null);
  assert.equal(parseStagePlanePosition({ x: "1", y: 0, z: 0 }), null);
  assert.equal(parseStagePlanePosition({ x: 0, y: 0, z: 1 }), null);
  assert.equal(parseStagePlanePosition({ x: SCENE_ORG_STAGE_PLANE_LIMIT + 0.01, y: 0, z: 0 }), null);
  assert.equal(parseStagePlanePosition({ x: 0, y: 0 }), null);
  const zoom = parseSceneOrgSavedSceneSpatialState({
    schemaVersion: 1,
    coordinateSystem: SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM,
    zoom: 2,
    objects: [],
  });
  assert.equal(zoom, null);
  const scale = parseSceneOrgSavedSceneSpatialState({
    schemaVersion: 1,
    coordinateSystem: SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM,
    objects: [{ canonicalObjectId: OBJECT_A, position: { x: 0, y: 0, z: 0 }, scale: { x: 0, y: 0, z: 0 } }],
  });
  assert.equal(scale, null);
  assert.equal(parseSceneOrgSavedSceneSpatialState({
    schemaVersion: 2,
    coordinateSystem: SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM,
    objects: [],
  }), null);
  assert.equal(parseSceneOrgSavedSceneSpatialState(undefined), null);
  assert.equal(captureSceneOrgSavedSceneSpatialState([]).ok, true);
  assert.equal(captureSceneOrgSavedSceneSpatialState([{ canonicalObjectId: OBJECT_A, x: 9, y: 0 }]).ok, false);
});

test("legacy scenes stay valid and invalid spatial payloads do not replace them", () => {
  const storage = memoryStorage(JSON.stringify({
    identity: sceneOrgSavedSceneDurabilityIdentity,
    version: SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
    scenes: [{
      sceneId: "scene-legacy",
      name: "Legacy",
      kind: "SAVED",
      sceneIntentType: "manager-view",
      managerWorkspaceId: "acme",
      ownerDeckId: "production",
      canonicalReferences: [],
      layout: {
        presentationDepth: "minimum",
        leftRegion: "management",
        rightRegion: "contextual",
        detailWorkspace: "closed",
      },
      visibility: {},
    }],
  }));
  const legacy = loadSceneOrgSavedScenes(storage);
  assert.equal(legacy.status, "loaded");
  assert.equal(legacy.scenes[0]?.spatialState, undefined);
  const corrupt = parseSceneOrgSavedScenes(JSON.stringify({
    identity: sceneOrgSavedSceneDurabilityIdentity,
    version: 1,
    scenes: [{
      sceneId: "scene-corrupt-spatial",
      name: "Corrupt Spatial",
      kind: "SAVED",
      sceneIntentType: "manager-view",
      managerWorkspaceId: "acme",
      ownerDeckId: "production",
      canonicalReferences: [],
      layout: {
        presentationDepth: "minimum",
        leftRegion: "management",
        rightRegion: "contextual",
        detailWorkspace: "closed",
      },
      visibility: {},
      spatialState: { schemaVersion: 1, coordinateSystem: "stage-plane-xy", camera: { zoom: Number.NaN }, objects: [] },
    }],
  }));
  assert.equal(corrupt?.status, "loaded");
  assert.equal(corrupt?.rejectedRecords, 0);
  assert.equal(corrupt?.scenes[0]?.sceneId, "scene-corrupt-spatial");
  assert.equal(corrupt?.scenes[0]?.spatialState, undefined);
  assert.throws(() => createSceneOrgSavedScene({
    sceneId: "scene-bad",
    name: "Bad",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "acme",
    ownerDeckId: "production",
    canonicalReferences: [],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
    spatialState: {
      schemaVersion: 1,
      coordinateSystem: "stage-plane-xy",
      objects: [{ canonicalObjectId: OBJECT_A, position: { x: 99, y: 0, z: 0 } }],
    },
  }));
});

test("two scenes and two decks keep independent positions for one canonical object", () => {
  const sceneA = sceneWith({ sceneId: "scene-a", deckId: "production", x: 1.2, y: -1.8 });
  const sceneB = sceneWith({ sceneId: "scene-b", deckId: "production", x: -1.2, y: -0.6 });
  const sceneC = sceneWith({ sceneId: "scene-c", deckId: "executive", x: 0.4, y: 1.1 });
  const storage = memoryStorage();
  assert.equal(persistSceneOrgSavedScenes([sceneA, sceneB, sceneC], storage).persisted, true);
  storage.failWrite = true;
  const failed = persistSceneOrgSavedScenes([
    sceneWith({ sceneId: "scene-a", deckId: "production", x: 3, y: 3 }),
  ], storage);
  assert.equal(failed.persisted, false);
  storage.failWrite = false;
  const loaded = loadSceneOrgSavedScenes(storage);
  assert.equal(loaded.scenes.find((entry) => entry.sceneId === "scene-a")?.spatialState?.objects[0]?.position.x, 1.2);
  assert.equal(loaded.scenes.find((entry) => entry.sceneId === "scene-b")?.spatialState?.objects[0]?.position.x, -1.2);
  assert.equal(loaded.scenes.find((entry) => entry.sceneId === "scene-c")?.ownerDeckId, "executive");
  assert.equal(loaded.scenes.find((entry) => entry.sceneId === "scene-c")?.spatialState?.objects[0]?.position.y, 1.1);
  const renamed = applySceneOrgSavedSceneCollectionMutation({
    scenes: loaded.scenes,
    mutation: { kind: "rename", sceneId: "scene-a", name: "Plant Layout" },
    ownerDeckId: "production",
    storage,
  });
  assert.equal(renamed.status, "renamed");
  assert.equal(renamed.scene?.sceneId, "scene-a");
  assert.equal(renamed.scene?.spatialState?.objects[0]?.position.x, 1.2);
  const stored = JSON.parse(storage.value ?? "{}") as {
    scenes: Array<{ sceneId: string; spatialState?: { objects: Array<{ position: { x: number } }> } }>;
  };
  assert.equal(stored.scenes.find((entry) => entry.sceneId === "scene-a")?.spatialState?.objects[0]?.position.x, 1.2);
  assert.equal(JSON.stringify(stored).includes("Production Used"), false);
});

test("restoration applies only authorized ids and leaves the stored scene unchanged", () => {
  const scene = sceneWith({ sceneId: "scene-a", deckId: "production", x: 1, y: -1 });
  const both = captureSceneOrgSavedSceneSpatialState([
    { canonicalObjectId: OBJECT_A, x: 1, y: -1 },
    { canonicalObjectId: OBJECT_B, x: -1, y: -1 },
  ]);
  assert.equal(both.ok, true);
  assert.ok(both.ok);
  const partial = resolveAuthorizedSceneSpatialPositions({
    spatialState: both.spatialState,
    authorizedIds: [OBJECT_A],
  });
  assert.deepEqual(partial.positions[OBJECT_A], { x: 1, y: -1 });
  assert.equal(partial.positions[OBJECT_B], undefined);
  assert.deepEqual(partial.unavailableIds, [OBJECT_B]);
  const removed = resolveAuthorizedSceneSpatialPositions({
    spatialState: scene.spatialState,
    authorizedIds: [],
  });
  assert.deepEqual(removed.unavailableIds, [OBJECT_A]);
  assert.equal(Object.keys(removed.positions).length, 0);
  const loading = resolveDeckSavedSceneRestoration({
    references: [{ canonicalId: OBJECT_A }],
    authorizedIds: [],
    loading: true,
  });
  assert.equal(loading.status, "loading");
  assert.equal(scene.spatialState?.objects[0]?.position.x, 1);
});

function dataObject(id: string): NexoraDecisionTheatreDataObject {
  return {
    id,
    label: id,
    unresolvedFieldCount: 0,
    relationships: [],
  } as unknown as NexoraDecisionTheatreDataObject;
}

function stageObject(): NexoraMVPStageObjectPresentation {
  return {
    id: "catalog",
    label: "Catalog",
    kind: "object",
    role: "normal",
    overviewPosition: [0, 0, 0],
    targetPosition: [0, 0, 0],
    scale: 1,
    opacity: 1,
    emissiveIntensity: 0,
    labelProminence: "full",
    selected: false,
    focused: false,
    attention: "normal",
    status: "normal",
  } as NexoraMVPStageObjectPresentation;
}

test("saved positions override the solver only for valid authorized objects", () => {
  const input = {
    dataObjects: [dataObject(OBJECT_A), dataObject(OBJECT_B)],
    visibleDataObjectIds: [OBJECT_A, OBJECT_B],
    selectedDataObjectId: null,
    businessFocusId: null,
    stageObjects: [stageObject()],
    labelSide: "top-right" as const,
  };
  const solver = projectNexoraDecisionTheatreDataObjectsToStage(input);
  const restored = projectNexoraDecisionTheatreDataObjectsToStage({
    ...input,
    spatialPositions: { [OBJECT_A]: { x: 2.4, y: -0.8 } },
  });
  assert.deepEqual(restored.participants[0]?.presentation.targetPosition, [2.4, -0.8, 0]);
  assert.deepEqual(
    restored.participants[1]?.presentation.targetPosition,
    solver.participants[1]?.presentation.targetPosition,
  );
  assert.equal(restored.participants[0]?.presentation.labelSide, "top-right");
  assert.equal(restored.participants[0]?.presentation.labelTerritoryStatus, "owned");
  assert.equal(restored.participants[0]?.presentation.id, OBJECT_A);
  assert.deepEqual(restored.participants[0]?.presentation.presentationPosition, { x: 2.4, y: -0.8 });
  const rejected = projectNexoraDecisionTheatreDataObjectsToStage({
    ...input,
    spatialPositions: { [OBJECT_A]: { x: Number.NaN, y: 0 } },
  });
  assert.deepEqual(
    rejected.participants[0]?.presentation.targetPosition,
    solver.participants[0]?.presentation.targetPosition,
  );
});
