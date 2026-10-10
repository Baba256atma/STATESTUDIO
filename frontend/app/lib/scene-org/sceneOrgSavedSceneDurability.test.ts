/** NPA-T SAVED-SCENE-DURABILITY:1 — local metadata persistence certification. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  createSceneOrgSavedScene,
  resolveSceneOrgSavedScene,
  type SceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract.ts";
import {
  loadSceneOrgSavedScenes,
  parseSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
  SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY,
  SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
  SCENE_ORG_SAVED_SCENE_STORAGE_KEY,
  sceneOrgSavedSceneDurabilityIdentity,
  serializeSceneOrgSavedScenes,
  type SceneOrgSavedSceneStorage,
} from "./sceneOrgSavedSceneDurability.ts";

function scene(
  sceneId: string,
  canonicalId: string,
  presentationDepth: "minimum" | "report" | "operation" = "report",
  rightRegion: "contextual" | "collapsed" = "contextual",
): SceneOrgSavedScene {
  return createSceneOrgSavedScene({
    sceneId,
    name: sceneId.replace(/^scene-/, "").replaceAll("-", " "),
    kind: "SAVED",
    sceneIntentType: "manager-view",
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId,
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth,
      leftRegion: "management",
      rightRegion,
      detailWorkspace: presentationDepth === "operation" ? "open" : "closed",
    },
  });
}

function memoryStorage(initial?: string): SceneOrgSavedSceneStorage & {
  value: string | null;
  writes: number;
  failWrite: boolean;
} {
  return {
    value: initial ?? null,
    writes: 0,
    failWrite: false,
    getItem(key) {
      assert.equal(key, SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
      return this.value;
    },
    setItem(key, value) {
      assert.equal(key, SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
      this.writes += 1;
      if (this.failWrite) throw new Error("quota");
      this.value = value;
    },
  };
}

test("durability is truthfully browser-local, not account or cross-device bound", () => {
  assert.deepEqual(SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY, {
    classification: "LOCAL MVP DURABILITY",
    target: "browser-localStorage",
    scope: "browser-profile-and-device",
    accountBound: false,
    crossDevice: false,
    ownsCanonicalTruth: false,
    opensSceneDuringHydration: false,
  });
});

test("serialization persists only the certified whitelist and excludes temporary/business truth", () => {
  const durable = scene("scene-capacity-review", "obj-capacity");
  const temporary = createSceneOrgSavedScene({ ...scene("scene-temp", "obj-risk"), kind: "TEMPORARY" });
  const raw = serializeSceneOrgSavedScenes([
    { ...durable, status: "stale", kpi: "88%", evidence: ["secret"] } as SceneOrgSavedScene,
    temporary,
  ]);
  const parsed = JSON.parse(raw) as { scenes: Record<string, unknown>[] };
  assert.equal(parsed.scenes.length, 1);
  assert.deepEqual(Object.keys(parsed.scenes[0]!).sort(), [
    "canonicalReferences",
    "kind",
    "layout",
    "name",
    "sceneId",
    "sceneIntentType",
    "visibility",
  ]);
  assert.doesNotMatch(raw, /stale|88%|secret|scene-temp/);
});

test("Main, Risk Room, and Capacity Review survive a durable reload with stable IDs and order", () => {
  const storage = memoryStorage();
  const scenes = [
    scene("scene-main", "obj-growth", "minimum"),
    scene("scene-risk-room", "obj-risk", "report", "collapsed"),
    scene("scene-capacity-review", "obj-capacity", "operation"),
  ];
  assert.equal(persistSceneOrgSavedScenes(scenes, storage).persisted, true);
  const remounted = loadSceneOrgSavedScenes(storage);
  assert.equal(remounted.status, "loaded");
  assert.deepEqual(remounted.scenes.map((entry) => entry.sceneId), scenes.map((entry) => entry.sceneId));
  assert.deepEqual(remounted.scenes.map((entry) => entry.layout), scenes.map((entry) => entry.layout));
});

test("two durable views share one current canonical subject without cloning it", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes([
    scene("scene-capacity-review", "obj-capacity", "report"),
    scene("scene-capacity-actions", "obj-capacity", "operation"),
  ], storage);
  const hydrated = loadSceneOrgSavedScenes(storage).scenes;
  const canonical = Object.freeze({ id: "obj-capacity", utilization: 69, attention: "critical" });
  const report = resolveSceneOrgSavedScene(hydrated[0]!, () => canonical);
  const operation = resolveSceneOrgSavedScene(hydrated[1]!, () => canonical);
  assert.strictEqual(report.live[0]?.content, canonical);
  assert.strictEqual(operation.live[0]?.content, canonical);
  assert.notEqual(report.scene.layout.presentationDepth, operation.scene.layout.presentationDepth);
});

test("current truth wins after persistence and a later reload/open", () => {
  const storage = memoryStorage();
  const saved = scene("scene-capacity-review", "obj-capacity");
  let canonical: Readonly<{ id: string; utilization: number; attention: string }> =
    Object.freeze({ id: "obj-capacity", utilization: 88, attention: "important" });
  persistSceneOrgSavedScenes([saved], storage);
  canonical = Object.freeze({ id: "obj-capacity", utilization: 69, attention: "critical" });
  const hydrated = loadSceneOrgSavedScenes(storage).scenes[0]!;
  const opened = resolveSceneOrgSavedScene(hydrated, () => canonical);
  assert.strictEqual(opened.live[0]?.content, canonical);
  assert.deepEqual(opened.live[0]?.content, {
    id: "obj-capacity",
    utilization: 69,
    attention: "critical",
  });
});

test("corrupt records fail closed while valid records survive", () => {
  const valid = JSON.parse(serializeSceneOrgSavedScenes([scene("scene-main", "obj-growth")])) as {
    scenes: unknown[];
  };
  valid.scenes.push(
    { sceneId: "scene-bad", name: "Bad", kind: "SAVED", canonicalReferences: "not-an-array" },
    { ...valid.scenes[0] as object, sceneId: "scene-bad-depth", layout: { presentationDepth: "omniscient" } },
  );
  const result = parseSceneOrgSavedScenes(JSON.stringify(valid));
  assert.equal(result.status, "loaded");
  assert.equal(result.rejectedRecords, 2);
  assert.deepEqual(result.scenes.map((entry) => entry.sceneId), ["scene-main"]);
  assert.equal(parseSceneOrgSavedScenes("not-json").status, "invalid");
});

test("unsupported versions fail closed without guessing a migration", () => {
  const result = parseSceneOrgSavedScenes(JSON.stringify({
    identity: sceneOrgSavedSceneDurabilityIdentity,
    version: SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION + 1,
    scenes: [scene("scene-main", "obj-growth")],
  }));
  assert.equal(result.status, "incompatible");
  assert.deepEqual(result.scenes, []);
});

test("missing canonical subject remains missing after durable hydration", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes([scene("scene-risk-room", "obj-risk")], storage);
  const hydrated = loadSceneOrgSavedScenes(storage).scenes[0]!;
  const opened = resolveSceneOrgSavedScene(hydrated, () => null);
  assert.equal(opened.status, "canonical-subject-missing");
  assert.equal(opened.restoredCanonicalId, null);
});

test("failed writes preserve the prior atomic localStorage value and report failure", () => {
  const storage = memoryStorage();
  persistSceneOrgSavedScenes([scene("scene-main", "obj-growth")], storage);
  const before = storage.value;
  storage.failWrite = true;
  const result = persistSceneOrgSavedScenes([scene("scene-risk-room", "obj-risk")], storage);
  assert.deepEqual(result, { persisted: false, reason: "write-failed" });
  assert.equal(storage.value, before);
});

test("shell hydrates once and explicit save/default writes precede runtime acknowledgement", () => {
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((shell.match(/loadSceneOrgSavedScenes\(\)/g) ?? []).length, 1);
  const hydration = shell.slice(
    shell.indexOf("const loaded = loadSceneOrgSavedScenes()") - 40,
    shell.indexOf("const [activeSavedSceneId"),
  );
  assert.doesNotMatch(hydration, /persistSceneOrgSavedScenes/);
  const save = shell.slice(shell.indexOf('case "SAVE_SCENE"'), shell.indexOf('case "OPEN_SCENE"'));
  assert.ok(save.indexOf("persistSceneOrgSavedScenes") < save.indexOf("setSavedScenes"));
  assert.match(save, /previous Saved Scenes are unchanged/);
});
