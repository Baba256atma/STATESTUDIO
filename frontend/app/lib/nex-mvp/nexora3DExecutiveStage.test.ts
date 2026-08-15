import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_3D_EXECUTIVE_STAGE_BOUNDARY as boundary,
  getNexora3DExecutiveStageIdentity,
  nexora3DExecutiveStageIdentity,
  nexora3DExecutiveStageNamespace,
  nexora3DExecutiveStageUpstreamFoundationIdentity,
  nexora3DExecutiveStageUpstreamShellIdentity,
  nexora3DExecutiveStageVersion,
  resolveNexoraMVPStageScenePresentation,
  verifyNexora3DExecutiveStage,
} from "./nexora3DExecutiveStage.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "./nexoraMVPStageFixtures.ts";

const source = readFileSync(
  new URL("./nexora3DExecutiveStage.ts", import.meta.url),
  "utf8",
);

test("1. exact NEX-MVP:3 identity and version", () => {
  const identity = getNexora3DExecutiveStageIdentity();
  assert.equal(nexora3DExecutiveStageIdentity, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(identity.id, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(nexora3DExecutiveStageVersion, "1.3.0");
  assert.equal(identity.version, "1.3.0");
  assert.equal(nexora3DExecutiveStageNamespace, "nexora.mvp.executive-stage");
  assert.equal(
    identity.architecturalRole,
    "MVPSpatialExecutiveInteractionSurface",
  );
});

test("2. immediate MVP dependencies declared", () => {
  assert.equal(
    nexora3DExecutiveStageUpstreamShellIdentity,
    "NEX-MVP:2/NexoraExecutiveShell",
  );
  assert.equal(
    nexora3DExecutiveStageUpstreamFoundationIdentity,
    "NEX-MVP:1/NexoraMVPApplicationFoundation",
  );
  assert.equal(
    boundary.soleImmediateShellDependency,
    "NEX-MVP:2/NexoraExecutiveShell",
  );
});

test("3. fixture object IDs remain stable", () => {
  assert.equal(NEXORA_MVP_STAGE_OBJECT_FIXTURES.length, 8);
  assert.deepEqual(
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((entry) => entry.id),
    [
      "obj-revenue",
      "obj-capacity",
      "obj-budget",
      "obj-customer",
      "obj-delivery",
      "obj-risk",
      "obj-inventory",
      "obj-demand",
    ],
  );
});

test("4. overview presentation accepts presentation state and environment", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(scene.mode, "overview");
  assert.equal(scene.presentationState, "minimum");
  assert.equal(scene.environmentIntent, "neutral");
  assert.equal(scene.objects.length, 8);
  assert.ok(scene.objects.every((entry) => entry.role === "normal"));
});

test("5. selection/focus establishes focused and related roles", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-delivery",
    focusedObjectId: "obj-delivery",
    presentationState: "report",
    environmentIntent: "investigate",
  });
  assert.equal(scene.mode, "focus");
  assert.equal(scene.presentationState, "report");
  assert.equal(scene.environmentIntent, "investigate");
  const focused = scene.objects.find((entry) => entry.id === "obj-delivery");
  assert.equal(focused?.role, "focused");
  assert.equal(focused?.focused, true);
  // STAGE-2D / STAGE-PROD:0 — topology Z remains 0; local +Z is visual only.
  assert.equal(focused?.targetPosition[0], 0);
  assert.equal(focused?.targetPosition[2], 0);

  const relatedIds = scene.objects
    .filter((entry) => entry.role === "related")
    .map((entry) => entry.id)
    .sort();
  assert.ok(relatedIds.includes("obj-capacity"));
  assert.ok(relatedIds.includes("obj-customer"));
  assert.ok(scene.objects.some((entry) => entry.spatialRole === "watch"));
  assert.ok(scene.objects.some((entry) => entry.role === "unrelated"));
});

test("6. related objects get related presentation; unrelated subordinate", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-delivery",
    focusedObjectId: "obj-delivery",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const related = scene.objects.filter((entry) => entry.role === "related");
  const unrelated = scene.objects.filter((entry) => entry.role === "unrelated");
  assert.ok(related.every((entry) => entry.opacity >= 0.9));
  assert.ok(unrelated.every((entry) => entry.opacity <= 0.35));
  assert.ok(unrelated.every((entry) => entry.scale < 1));
});

test("7. focused connections are emphasized", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-delivery",
    focusedObjectId: "obj-delivery",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const emphasized = scene.connections.filter((entry) => entry.emphasized);
  assert.ok(emphasized.length >= 3);
  assert.ok(
    emphasized.every(
      (entry) =>
        entry.sourceId === "obj-delivery" || entry.targetId === "obj-delivery",
    ),
  );
  const soft = scene.connections.filter((entry) => !entry.emphasized);
  assert.ok(soft.every((entry) => entry.opacity < 0.2));
});

test("8. reset to overview clears focus composition", () => {
  const focused = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-risk",
    focusedObjectId: "obj-risk",
    presentationState: "operation",
    environmentIntent: "execute",
  });
  assert.equal(focused.mode, "focus");

  const overview = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "operation",
    environmentIntent: "execute",
  });
  assert.equal(overview.mode, "overview");
  assert.equal(overview.focusedObjectId, null);
  assert.ok(overview.objects.every((entry) => entry.role === "normal"));
  assert.ok(overview.connections.every((entry) => entry.emphasized === false));
});

test("9. mapping is deterministic and verification passes", () => {
  assert.equal(verifyNexora3DExecutiveStage().ok, true);
  const a = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-budget",
    focusedObjectId: "obj-budget",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const b = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-budget",
    focusedObjectId: "obj-budget",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});

test("10. pure mapping module has no React/Three imports", () => {
  assert.doesNotMatch(source, /\bfrom\s+["']react(?:-dom)?["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  assert.doesNotMatch(source, /@react-three\/drei/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:nol|dri|ex-dri|rex|nex-ci)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.ownsRuntimeSemantics, false);
  assert.equal(boundary.inventsDomainLogicInMeshes, false);
});

test("11. STAGE-PROD:0 / STAGE-2D overview keeps topology Z = 0", () => {
  const overview = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const visible = overview.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  );
  assert.ok(visible.length > 0);
  assert.ok(visible.length < overview.objects.length);
  assert.ok(
    overview.objects.every((entry) => entry.targetPosition[2] === 0),
  );
  assert.ok(
    overview.objects.every((entry) => entry.overviewPosition[2] === 0),
  );
  // Progressive disclosure — not every business object is shown.
  assert.ok(
    visible.every(
      (entry) =>
        entry.spatialRole === "watch" ||
        entry.spatialRole === "related" ||
        entry.spatialRole === "center",
    ),
  );
});
