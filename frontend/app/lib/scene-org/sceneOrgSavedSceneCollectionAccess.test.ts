/** NPA-T SAVED-SCENE-COLLECTION-ACCESS:1 — hydrated collection resolution. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import { createSceneOrgSavedScene, type SceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  extractSavedSceneOpenRequest,
  resolveSceneOrgSavedSceneAccess,
  shouldClaimSavedSceneOpenIntent,
} from "./sceneOrgSavedSceneCollectionAccess.ts";

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

const collection = [
  scene("scene-main", "Main", "obj-capacity"),
  scene("scene-risk-room", "Risk Room", "obj-risk"),
  scene("scene-capacity-review", "Capacity Review", "obj-capacity"),
];

test("extracts open/show/go-to wrappers without requiring a review suffix", () => {
  assert.equal(extractSavedSceneOpenRequest("open risk room").phrase, "risk room");
  assert.equal(extractSavedSceneOpenRequest("open the risk room").phrase, "risk room");
  assert.equal(extractSavedSceneOpenRequest("go to main").phrase, "main");
  assert.equal(extractSavedSceneOpenRequest("show capacity review").phrase, "capacity review");
  assert.equal(extractSavedSceneOpenRequest("open my delivery control scene").phrase, "delivery control");
  assert.equal(extractSavedSceneOpenRequest("open scene friday bottleneck").phrase, "friday bottleneck");
  assert.equal(extractSavedSceneOpenRequest("open risk room.").explicitScene, false);
  assert.equal(extractSavedSceneOpenRequest("open risk room scene").explicitScene, true);
});

test("does not steal reserved workspace/object collection phrases", () => {
  assert.equal(extractSavedSceneOpenRequest("open details").kind, "none");
  assert.equal(extractSavedSceneOpenRequest("open the advisor").kind, "none");
  assert.equal(extractSavedSceneOpenRequest("show problems").kind, "none");
  assert.equal(extractSavedSceneOpenRequest("show my saved scenes").kind, "list");
  assert.equal(extractSavedSceneOpenRequest("what scenes do i have").kind, "list");
});

test("Main, Risk Room, and Capacity Review resolve from the hydrated collection", () => {
  for (const [utterance, sceneId] of [
    ["Open Main", "scene-main"],
    ["open risk room", "scene-risk-room"],
    ["Open Capacity Review", "scene-capacity-review"],
  ] as const) {
    const extraction = extractSavedSceneOpenRequest(utterance.toLowerCase());
    const resolved = resolveSceneOrgSavedSceneAccess(collection, {
      phrase: extraction.phrase,
    });
    assert.equal(resolved.status, "matched");
    assert.equal(resolved.scene?.sceneId, sceneId);
  }
});

test("shell collection UI and OPEN_SCENE share the hydrated resolver", () => {
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.match(shell, /resolveSceneOrgSavedSceneAccess/);
  assert.match(shell, /NexoraSavedSceneCollectionAccess/);
  assert.match(shell, /savedScenes: savedScenesRef\.current/);
  const open = shell.slice(shell.indexOf('case "OPEN_SCENE"'), shell.indexOf('case "MAKE_DEFAULT_SCENE"'));
  assert.doesNotMatch(open, /persistSceneOrgSavedScenes/);
});

test("runtime-created names are addressable without a static vocabulary", () => {
  const hydrated = [...collection, scene("scene-friday-bottleneck", "Friday Bottleneck", "obj-delivery")];
  const extraction = extractSavedSceneOpenRequest("open friday bottleneck");
  const resolved = resolveSceneOrgSavedSceneAccess(hydrated, { phrase: extraction.phrase });
  assert.equal(resolved.scene?.sceneId, "scene-friday-bottleneck");
  const source = readFileSync(new URL("./sceneOrgSavedSceneCollectionAccess.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /friday bottleneck/i);
});

test("exact Scene name wins over a shorter sibling name", () => {
  const hydrated = [scene("scene-risk", "Risk", "obj-risk"), scene("scene-risk-room", "Risk Room", "obj-risk")];
  const resolved = resolveSceneOrgSavedSceneAccess(hydrated, { phrase: "Risk Room" });
  assert.equal(resolved.scene?.sceneId, "scene-risk-room");
  assert.equal(
    resolveSceneOrgSavedSceneAccess(hydrated, { phrase: "Capacity" }).status,
    "not-found",
  );
});

test("normalized duplicates are ambiguous and do not guess", () => {
  const hydrated = [
    scene("scene-delivery-hyphen", "Delivery-Control", "obj-delivery"),
    scene("scene-delivery-underscore", "delivery_control", "obj-delivery"),
  ];
  const resolved = resolveSceneOrgSavedSceneAccess(hydrated, {
    phrase: "delivery control",
  });
  assert.equal(resolved.status, "ambiguous");
  assert.equal(resolved.scene, null);
  assert.equal(resolved.candidates.length, 2);
});

test("unknown Scene names fail closed without a substitute", () => {
  const resolved = resolveSceneOrgSavedSceneAccess(collection, { phrase: "Finance Room" });
  assert.equal(resolved.status, "not-found");
  assert.equal(resolved.scene, null);
});

test("Scene vs object collision requires explicit scene wording", () => {
  const hydrated = [scene("scene-capacity", "Capacity", "obj-capacity")];
  const extraction = extractSavedSceneOpenRequest("open capacity");
  const resolution = resolveSceneOrgSavedSceneAccess(hydrated, { phrase: extraction.phrase });
  assert.equal(
    shouldClaimSavedSceneOpenIntent({
      extraction,
      resolution,
      catalogSubjectNames: ["Capacity", "Risk"],
    }),
    false,
  );
  assert.equal(
    shouldClaimSavedSceneOpenIntent({
      extraction: extractSavedSceneOpenRequest("open the capacity scene"),
      resolution,
      catalogSubjectNames: ["Capacity"],
    }),
    true,
  );
});

test("hydration pending does not become a permanent no-match", () => {
  const resolved = resolveSceneOrgSavedSceneAccess(collection, {
    phrase: "Main",
    hydrationStatus: "pending",
  });
  assert.equal(resolved.status, "pending");
});

test("empty collection and missing default fail closed", () => {
  assert.equal(resolveSceneOrgSavedSceneAccess([], { phrase: "Main" }).status, "empty");
  assert.equal(
    resolveSceneOrgSavedSceneAccess(collection, { defaultRequested: true }).status,
    "not-found",
  );
  const withDefault = [
    ...collection,
    scene("scene-home", "Home View", "obj-capacity", "DEFAULT_MANAGER"),
  ];
  assert.equal(
    resolveSceneOrgSavedSceneAccess(withDefault, { defaultRequested: true }).scene?.sceneId,
    "scene-home",
  );
});

test("intent consults the hydrated collection and still opens Capacity Review", () => {
  const withCollection = (utterance: string) =>
    resolveNexoraConversationalIntent({
      utterance,
      savedScenes: collection,
      catalogSubjectNames: ["Capacity", "Risk", "Customer"],
    }).intent.workspaceActionPayload;

  assert.equal(withCollection("Open Main")?.action, "OPEN_SCENE");
  assert.equal(withCollection("Open Main")?.sceneName, "Main");
  assert.equal(withCollection("Open Risk Room")?.action, "OPEN_SCENE");
  assert.equal(withCollection("Open Capacity Review")?.action, "OPEN_SCENE");
  assert.equal(withCollection("Open Finance Room"), null);
  assert.equal(
    resolveNexoraConversationalIntent({ utterance: "Open Capacity" }).intent.kind,
    "focus",
  );
  assert.equal(
    resolveNexoraConversationalIntent({
      utterance: "Open Capacity",
      savedScenes: [scene("scene-capacity", "Capacity")],
      catalogSubjectNames: ["Capacity"],
    }).intent.kind,
    "focus",
  );
});

test("scene-id lookup is distinct from canonical subject id", () => {
  const resolved = resolveSceneOrgSavedSceneAccess(collection, { sceneId: "scene-risk-room" });
  assert.equal(resolved.source, "scene-id");
  assert.equal(resolved.scene?.sceneId, "scene-risk-room");
  assert.notEqual(resolved.scene?.sceneId, resolved.scene?.canonicalReferences[0]?.canonicalId);
  assert.equal(
    resolveSceneOrgSavedSceneAccess(collection, { sceneId: "obj-risk" }).status,
    "not-found",
  );
});
