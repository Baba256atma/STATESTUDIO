/**
 * STAGE-3DOBJ:3 — Premium Executive Object Form Language invariants A–AE.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import {
  applyExecutiveStage2DTopologyRecompositionToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import { MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH } from "./executive3DObjectVisualProfile.ts";
import { resolveExecutive3DObjectFaceSymbology } from "./executive3DObjectFaceSymbology.ts";
import {
  EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY,
  PREMIUM_FORM_SYMBOL_BODY_RATIO,
  applyExecutivePremiumFormAspect,
  getExecutive3DObjectPremiumFormIdentity,
  getExecutive3DObjectPremiumFormObservability,
  isExecutive3DObjectPremiumFormEnabled,
  resolveExecutivePremiumObjectForm,
  setExecutive3DObjectPremiumFormEnabled,
  verifyExecutive3DObjectPremiumForm,
} from "./executive3DObjectPremiumForm.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  return {
    state,
    presentation: applyExecutiveStageFixedCameraToStagePresentation(withRecomp),
  };
}

function snapshot(objectId: string) {
  const { presentation } = pipeline(objectId);
  return Object.freeze(
    presentation.scene.objects
      .filter((entry) => entry.disclosureState !== "hidden")
      .map((entry) =>
        Object.freeze({
          id: entry.id,
          x: entry.targetPosition[0],
          y: entry.targetPosition[1],
          z: entry.targetPosition[2],
        }),
      )
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
  );
}

function overlapFor(objectId: string) {
  return resolveExecutiveStage2DTopologyReadability({
    anchorObjectId: objectId,
    presentationState: "minimum",
    objects: [
      "obj-budget",
      "obj-capacity",
      "obj-delivery",
      "obj-revenue",
      "obj-customer",
      "obj-risk",
      "obj-inventory",
      "obj-demand",
    ].map((id) => Object.freeze({ objectId: id })),
    relationships: [
      Object.freeze({ id: "r1", sourceId: "obj-budget", targetId: "obj-capacity" }),
      Object.freeze({ id: "r2", sourceId: "obj-budget", targetId: "obj-delivery" }),
      Object.freeze({ id: "r3", sourceId: "obj-capacity", targetId: "obj-delivery" }),
      Object.freeze({ id: "r4", sourceId: "obj-delivery", targetId: "obj-customer" }),
      Object.freeze({ id: "r5", sourceId: "obj-revenue", targetId: "obj-customer" }),
      Object.freeze({ id: "r6", sourceId: "obj-revenue", targetId: "obj-budget" }),
      Object.freeze({ id: "r7", sourceId: "obj-capacity", targetId: "obj-inventory" }),
      Object.freeze({ id: "r8", sourceId: "obj-delivery", targetId: "obj-risk" }),
    ],
  });
}

test("Identity / verify — STAGE-3DOBJ:3 premium form", () => {
  setExecutive3DObjectPremiumFormEnabled(true);
  const identity = getExecutive3DObjectPremiumFormIdentity();
  assert.equal(
    identity.id,
    "STAGE-3DOBJ:3/PremiumExecutiveObjectFormLanguage",
  );
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-3d-object-premium-form",
  );
  assert.equal(verifyExecutive3DObjectPremiumForm().ok, true);
  assert.equal(isExecutive3DObjectPremiumFormEnabled(), true);
});

test("A/B/C/D — Semantic z=0, anchor, camera, Deep-Z unchanged", () => {
  setExecutive3DObjectPremiumFormEnabled(true);
  for (const id of ["obj-capacity", "obj-risk", "obj-revenue"]) {
    const { presentation } = pipeline(id);
    const anchor = presentation.scene.objects.find((e) => e.id === id)!;
    assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
    for (const object of presentation.scene.objects) {
      if (object.disclosureState === "hidden") continue;
      assert.equal(object.targetPosition[2], 0);
    }
    assert.deepEqual(presentation.scene.camera.position, [
      0,
      0,
      EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
    ]);
  }
  assert.equal(resolveExecutiveStageFixedCamera().position.z, 11);
  assert.equal(EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.changesSemanticZ, false);
  const scene = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /NexoraStageDeepZEnvironment/);
});

test("E/F/G — Local +Z volume; rear on plane; depth capped", () => {
  const form = resolveExecutivePremiumObjectForm({
    objectKind: "object",
    presentationLevel: "operation",
    enabled: true,
  });
  assert.equal(form.backZ, 0);
  assert.ok(form.frontZ > 0);
  assert.ok(form.centerZ > 0 && form.centerZ < form.frontZ);
  assert.ok(form.depth <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH);
  assert.equal(
    EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.geometryOrigin,
    "back-on-plane-front-toward-camera",
  );
});

test("H/I — Business is premium plate, not generic cube", () => {
  const business = resolveExecutivePremiumObjectForm({
    objectKind: "obj-capacity Capacity object",
    enabled: true,
  });
  assert.equal(business.isGenericCube, false);
  assert.equal(business.bodyProfile, "precision-executive-plate");
  assert.ok(business.aspectRatio >= 1.15 && business.aspectRatio <= 1.35);
  assert.ok(business.frontScale >= 0.94 && business.frontScale <= 0.98);
  assert.equal(business.recessProfile, "machined-rounded-inset");
  assert.equal(business.bevelProfile, "soft-precision-chamfer");
});

test("J/K/L/M/N/O — Distinct family forms; context subordinate", () => {
  const profiles = {
    business: resolveExecutivePremiumObjectForm({ objectKind: "object", enabled: true }),
    goal: resolveExecutivePremiumObjectForm({ objectKind: "goal", enabled: true }),
    problem: resolveExecutivePremiumObjectForm({ objectKind: "problem", enabled: true }),
    risk: resolveExecutivePremiumObjectForm({ objectKind: "risk", enabled: true }),
    scenario: resolveExecutivePremiumObjectForm({ objectKind: "scenario", enabled: true }),
    decision: resolveExecutivePremiumObjectForm({ objectKind: "decision", enabled: true }),
    execution: resolveExecutivePremiumObjectForm({ objectKind: "execution", enabled: true }),
    context: resolveExecutivePremiumObjectForm({ objectKind: "context", enabled: true }),
  };
  assert.equal(profiles.risk.bodyProfile, "faceted-diamond");
  assert.equal(profiles.problem.bodyProfile, "constrained-angular-plate");
  assert.equal(profiles.scenario.bodyProfile, "layered-soft-hex");
  assert.equal(profiles.decision.bodyProfile, "decisive-hex-plate");
  assert.equal(profiles.execution.bodyProfile, "operational-plate");
  assert.equal(profiles.goal.bodyProfile, "target-puck");
  assert.equal(profiles.context.bodyProfile, "subordinate-plate");
  assert.ok(profiles.context.depth <= profiles.business.depth);
  const bodySet = new Set(
    Object.values(profiles).map((p) => p.bodyProfile),
  );
  assert.equal(bodySet.size, Object.keys(profiles).length);
});

test("P/Q/R/S — Form-first; symbols subordinate; certification modes exist", () => {
  setExecutive3DObjectPremiumFormEnabled(true);
  const form = resolveExecutivePremiumObjectForm({
    objectKind: "object",
    enabled: true,
  });
  assert.ok(form.symbolScaleFactor <= 0.45);
  const face = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  assert.ok(face.symbolScale < 0.45);
  assert.ok(
    face.symbolBodyRatio <= PREMIUM_FORM_SYMBOL_BODY_RATIO.max + 0.08,
  );
  assert.equal(
    EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.visualHierarchy,
    "form>surface>edge>symbol>state",
  );
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectPremiumBody.tsx"),
    "utf8",
  );
  assert.match(body, /ExtrudeGeometry|cylinderGeometry/);
  const stageObject = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(stageObject, /isExecutive3DObjectTerritoryVisible/);
});

test("T/U/V — State / focus / selection do not modify physical form", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.stateModifiesForm, false);
  assert.equal(EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.createsFocusShell, false);
  assert.equal(
    EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.createsSelectionShell,
    false,
  );
  const normal = resolveExecutivePremiumObjectForm({
    objectKind: "object",
    interactionState: "overview",
    enabled: true,
  });
  const focused = resolveExecutivePremiumObjectForm({
    objectKind: "object",
    interactionState: "focused",
    enabled: true,
  });
  assert.equal(normal.bodyProfile, focused.bodyProfile);
  assert.equal(normal.aspectRatio, focused.aspectRatio);
  assert.equal(normal.frontScale, focused.frontScale);
});

test("W/X — Hard separation + reserved-region wiring present", () => {
  const hard = readFileSync(
    join(here, "./executiveStage2DHardSeparation.ts"),
    "utf8",
  );
  assert.match(hard, /isExecutive3DObjectPremiumFormEnabled/);
  assert.match(hard, /silhouettePadBoost/);
  const reserved = readFileSync(
    join(here, "./executiveStageReservedRegionContainment.ts"),
    "utf8",
  );
  assert.match(reserved, /STAGE-OBJ:4-FIX|reserved/);
  const readability = overlapFor("obj-capacity");
  assert.ok(readability);
});

test("Y/Z/AA/AB/AC — Label / thread / motion / raycast / relationships unchanged", () => {
  assert.equal(EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.ownsLabels, false);
  assert.equal(
    EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.appliesToThreadGateway,
    false,
  );
  assert.equal(EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.movesCamera, false);
  assert.equal(
    EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.inventsRelationships,
    false,
  );
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectPremiumBody.tsx"),
    "utf8",
  );
  assert.match(body, /raycast=\{\(\) => null\}/);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /ExecutiveObjectPremiumBody/);
  assert.match(renderer, /obj3dForm/);
});

test("AD — Form ON/OFF semantic positions identical", () => {
  setExecutive3DObjectPremiumFormEnabled(true);
  const on = snapshot("obj-capacity");
  setExecutive3DObjectPremiumFormEnabled(false);
  const off = snapshot("obj-capacity");
  setExecutive3DObjectPremiumFormEnabled(true);
  assert.deepEqual(on, off);
});

test("AE — Deterministic premium form for same inputs", () => {
  const a = resolveExecutivePremiumObjectForm({
    objectKind: "obj-capacity Capacity",
    presentationLevel: "report",
    interactionState: "focused",
    enabled: true,
  });
  const b = resolveExecutivePremiumObjectForm({
    objectKind: "obj-capacity Capacity",
    presentationLevel: "report",
    interactionState: "focused",
    enabled: true,
  });
  assert.deepEqual(a, b);
  const sized = applyExecutivePremiumFormAspect({
    width: 1.05,
    height: 1.05,
    aspectRatio: a.aspectRatio,
    enabled: true,
  });
  assert.ok(Math.abs(sized.width / sized.height - a.aspectRatio) < 1e-5);
});

test("Observability + presentation levels", () => {
  const obs = getExecutive3DObjectPremiumFormObservability({
    enabled: true,
    objectKind: "obj-capacity Capacity",
    presentationLevel: "minimum",
  });
  assert.equal(obs.contract, "stage-3dobj-3");
  assert.equal(obs.enabled, "true");
  assert.equal(obs.formProfile, "precision-executive-plate");
  for (const level of ["minimum", "report", "operation"] as const) {
    const form = resolveExecutivePremiumObjectForm({
      objectKind: "object",
      presentationLevel: level,
      enabled: true,
    });
    assert.equal(form.bodyProfile, "precision-executive-plate");
    assert.ok(form.depth > 0 && form.depth <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH);
  }
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-3dobj-form-contract/);
  assert.match(host, /data-stage-3dobj-form-enabled/);
  assert.match(host, /data-stage-3dobj-aspect-ratio/);
});

test("OFF path resolves legacy slab profile", () => {
  const off = resolveExecutivePremiumObjectForm({
    objectKind: "object",
    enabled: false,
  });
  assert.equal(off.enabled, false);
  assert.equal(off.bodyProfile, "legacy-slab");
  assert.equal(off.aspectRatio, 1);
  assert.equal(off.frontScale, 1);
  assert.equal(off.taper, 0);
});
