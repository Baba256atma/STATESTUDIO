/**
 * NPA-T OVS-FORM-WIRING:1 recertification.
 *
 * Canonical management identity → existing OVS family/primitive.
 * Does not assign invented shapes to generic business objects.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { collectManagerObjectContext } from "@/app/lib/manager-object/managerObjectContext.ts";
import { resolveNexoraMVPStageScenePresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import {
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
  getNexoraMVPStageObjectFixtures,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  resolveExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";

const here = dirname(fileURLToPath(import.meta.url));

const GENERIC_IDS = [
  "obj-capacity",
  "obj-inventory",
  "obj-demand",
  "obj-customer",
  "obj-delivery",
  "obj-budget",
  "obj-revenue",
] as const;

function liveScene() {
  return resolveNexoraMVPStageScenePresentation({
    objects: getNexoraMVPStageObjectFixtures(),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-risk",
    focusedObjectId: "obj-risk",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function formFromPresentation(input: {
  readonly id: string;
  readonly kind: string;
  readonly objectKind?: string;
}) {
  const cue = projectExecutiveOvsObjectKindHandoff(input);
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: cue,
    enabled: true,
  });
  return Object.freeze({
    cue,
    family: language.family,
    primitive: language.primitive,
  });
}

test("A — canonical Risk objectKind reaches the OVS handoff", () => {
  const record = getNexoraMVPStageObjectFixtures().find(
    (object) => object.id === "obj-risk",
  );
  assert.equal(record?.objectKind, "risk");
  assert.equal(collectManagerObjectContext("obj-risk").objectKind.value, "risk");
  const scene = liveScene();
  const projected = scene.objects.find((object) => object.id === "obj-risk");
  assert.equal(projected?.kind, "object");
  assert.equal(projected?.objectKind, "risk");
  const form = formFromPresentation({
    id: projected!.id,
    kind: projected!.kind,
    objectKind: projected!.objectKind,
  });
  assert.equal(form.cue, "risk");
});

test("B — OVS maps Risk semantics to diamond", () => {
  const form = formFromPresentation({
    id: "obj-exposure",
    kind: "object",
    objectKind: "risk",
  });
  assert.equal(form.family, "risk");
  assert.equal(form.primitive, "diamond");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
});

test("C — Risk form does not require the canonical id", () => {
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({
      id: "obj-risk",
      kind: "object",
    }),
    "object",
  );
  const withoutId = formFromPresentation({
    id: "not-the-canonical-risk-id",
    kind: "object",
    objectKind: "risk",
  });
  assert.equal(withoutId.primitive, "diamond");
  const handoff = readFileSync(
    join(here, "./projectExecutiveOvsObjectKindHandoff.ts"),
    "utf8",
  );
  assert.doesNotMatch(handoff, /obj-risk/);
  assert.doesNotMatch(handoff, /NEXORA_MVP_CANONICAL_RISK_OBJECT_ID/);
  assert.doesNotMatch(handoff, /input\.label/);
  const stage = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(stage, /objectKind: presentation\.objectKind/);
});

test("D — seven generic live bodies stay operational rounded-block", () => {
  const scene = liveScene();
  for (const id of GENERIC_IDS) {
    const record = getNexoraMVPStageObjectFixtures().find((object) => object.id === id);
    const projected = scene.objects.find((object) => object.id === id);
    assert.equal(record?.kind, "object", id);
    assert.equal(record?.objectKind, undefined, id);
    assert.equal(projected?.objectKind, undefined, id);
    const form = formFromPresentation({
      id,
      kind: projected?.kind ?? "object",
      objectKind: projected?.objectKind,
    });
    assert.equal(form.cue, "object", id);
    assert.equal(form.family, "operational", id);
    assert.equal(form.primitive, "rounded-block", id);
    assert.notEqual(form.family, "risk", id);
  }
});

test("E — management state does not change semantic form", () => {
  const statuses = ["stable", "watch", "risk", "unresolved"] as const;
  const attentions = ["normal", "elevated", "important", "critical"] as const;
  for (const status of statuses) {
    for (const attention of attentions) {
      const risk = resolveExecutiveOvsObjectStateVisual({
        objectKind: "risk",
        status,
        attention,
      });
      const inventory = resolveExecutiveOvsObjectStateVisual({
        objectKind: "object",
        status,
        attention,
      });
      assert.equal(risk.geometryFamily, "risk", `${status}/${attention}`);
      assert.equal(risk.geometryPrimitive, "diamond", `${status}/${attention}`);
      assert.equal(inventory.geometryFamily, "operational", `${status}/${attention}`);
      assert.equal(
        inventory.geometryPrimitive,
        "rounded-block",
        `${status}/${attention}`,
      );
    }
  }
});

test("F — live Stage adapter forwards catalog objectKind into the handoff", () => {
  const scene = liveScene();
  const risk = scene.objects.find((object) => object.id === "obj-risk");
  const inventory = scene.objects.find((object) => object.id === "obj-inventory");
  assert.equal(
    formFromPresentation({
      id: risk!.id,
      kind: risk!.kind,
      objectKind: risk!.objectKind,
    }).primitive,
    "diamond",
  );
  assert.equal(
    formFromPresentation({
      id: inventory!.id,
      kind: inventory!.kind,
      objectKind: inventory!.objectKind,
    }).primitive,
    "rounded-block",
  );
  const stage = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(stage, /projectExecutiveOvsObjectKindHandoff/);
  assert.match(shell, /objectKind: focusedObject\?\.objectKind/);
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.outcome, "ring");
});
