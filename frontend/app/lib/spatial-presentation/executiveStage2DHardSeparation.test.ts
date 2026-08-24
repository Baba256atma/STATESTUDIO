/**
 * STAGE-2D:6V-FIX — Single-Plane Renderer & Hard XY Separation invariants A–T.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  resolveDataRealityAwareAdvisorPrimarySubjectId,
  resolveDataRealityAwareAdvisorBinding,
} from "../data-reality/dataRealityAwareAdvisorExperienceBinding.ts";
import {
  applyDataRealityAwareAdvisorBindingToAdvisorViewModel,
  resolveNexoraMVPDataRealityAwareAdvisorExperience,
} from "../nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
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
  buildNexoraMVPAdvisorContextBridge,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT,
  getExecutiveStage2DHardSeparationIdentity,
  resolveExecutiveStage2DHardSeparatedLayout,
  verifyExecutiveStage2DHardSeparation,
} from "./executiveStage2DHardSeparation.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import { isInsideExecutiveStage2DDialExclusion } from "./executiveStage2DVisualCertification.ts";

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

function overlapStats(objectId: string) {
  const readability = resolveExecutiveStage2DTopologyReadability({
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
    ],
  });
  return readability;
}

test("STAGE-2D:6V-FIX identity", () => {
  const identity = getExecutiveStage2DHardSeparationIdentity();
  assert.equal(identity.id, "STAGE-2D:6V-FIX/ExecutiveStage2DHardSeparation");
  assert.equal(identity.version, "2.6.2");
  assert.equal(verifyExecutiveStage2DHardSeparation().ok, true);
});

test("A — Budget authority across click → Advisor", () => {
  const { state, presentation } = pipeline("obj-budget");
  assert.equal(state.selectedSubject?.id, "obj-budget");
  assert.equal(state.focusedSubject?.id, "obj-budget");
  assert.equal(state.stage2dNavigationTrail?.activeObjectId, "obj-budget");
  assert.equal(presentation.scene.focusedObjectId, "obj-budget");
  assert.equal(presentation.scene.selectedObjectId, "obj-budget");
  const readability = (
    presentation.scene as {
      readonly stage2dReadability?: { readonly anchorObjectId?: string };
    }
  ).stage2dReadability;
  assert.equal(
    readability?.anchorObjectId ?? presentation.scene.focusedObjectId,
    "obj-budget",
  );

  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    focusedObjectId: "obj-budget",
    selectedObjectId: "obj-budget",
    selectedObjectIds: ["obj-budget"],
    presentationState: "minimum",
    currentWorkspace: "overview",
    requestedIntent: "investigate",
  });
  const advisor = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: "obj-budget",
    selectedObjectId: "obj-budget",
    presentationState: "minimum",
    workspace: "overview",
  });
  assert.equal(
    resolveDataRealityAwareAdvisorPrimarySubjectId(
      experience.runtimeState,
      "obj-budget",
      "obj-budget",
    ),
    "obj-budget",
  );
  // Unbound Budget → no DR primarySubject row; overlay must keep base Budget.
  const overlaid = applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
    {
      contextKey: "test",
      subjectId: "obj-budget",
      subjectLabel: "Budget",
      subjectKind: "object",
      title: "Budget",
      contextLine: "",
      recommendation: null,
      rationale: null,
      nextActions: [],
      warning: null,
      observation: null,
      priority: null,
      emptyReason: null,
    },
    advisor.advisorBinding,
  );
  assert.equal(overlaid.subjectId, "obj-budget");
  const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(bridge.focusedSubject?.id, "obj-budget");
});

test("B — Critical Capacity cannot steal Budget", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-budget",
    selectedObjectId: "obj-budget",
    selectedObjectIds: ["obj-budget"],
    presentationState: "minimum",
    currentWorkspace: "overview",
    requestedIntent: "investigate",
  });
  assert.equal(
    resolveDataRealityAwareAdvisorPrimarySubjectId(
      experience.runtimeState,
      "obj-budget",
      "obj-budget",
    ),
    "obj-budget",
  );
  const binding = resolveDataRealityAwareAdvisorBinding({
    runtimeState: experience.runtimeState,
    focusedObjectId: "obj-budget",
    selectedObjectId: "obj-budget",
  });
  // primarySubject row may be undefined (Budget unbound); must not be Capacity.
  assert.notEqual(binding.primarySubject?.objectId, "obj-capacity");
  const overlaid = applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
    {
      contextKey: "test",
      subjectId: "obj-budget",
      subjectLabel: "Budget",
      subjectKind: "object",
      title: "Budget",
      contextLine: "",
      recommendation: null,
      rationale: null,
      nextActions: [],
      warning: null,
      observation: null,
      priority: null,
      emptyReason: null,
    },
    binding,
  );
  assert.equal(overlaid.subjectId, "obj-budget");
});

test("C/D/E — Anchor center, fixed camera, semantic z=0", () => {
  for (const id of [
    "obj-budget",
    "obj-capacity",
    "obj-delivery",
    "obj-revenue",
    "obj-customer",
  ]) {
    const { presentation } = pipeline(id);
    const anchor = presentation.scene.objects.find((entry) => entry.id === id)!;
    assert.deepEqual(anchor.targetPosition, [0, 0, 0]);
    for (const object of presentation.scene.objects) {
      if (object.disclosureState === "hidden") continue;
      assert.equal(object.targetPosition[2], 0);
    }
    const camera = resolveExecutiveStageFixedCamera();
    assert.deepEqual(presentation.scene.camera.position, [
      0,
      0,
      EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
    ]);
    assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
    assert.equal(camera.position.z, 11);
  }
});

test("F/G/H — Planar body, rotation lock, one body (source)", () => {
  const geometry = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(geometry, /EXECUTIVE_STAGE_2D_PLANAR_BODY_THICKNESS = 0/);
  assert.match(geometry, /STAGE-OBJ:1|resolveExecutiveObject3DGeometryProfile|centerZ/);
  assert.match(geometry, /isExecutiveObject3DGeometryEnabled/);
  const objectSource = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(objectSource, /group\.rotation\.x = 0/);
  assert.match(objectSource, /group\.rotation\.y = 0/);
  assert.match(objectSource, /ringGeometry/);
});

test("I — Focus treatment planar", () => {
  const source = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.match(source, /planar focus ring/);
  assert.match(source, /ringGeometry/);
});

test("J/K/L/M/N — Hard layout zero overlaps + min gap + anchor immovable", () => {
  for (const id of [
    "obj-budget",
    "obj-capacity",
    "obj-delivery",
    "obj-revenue",
    "obj-customer",
  ]) {
    const readability = overlapStats(id);
    assert.ok(readability.mode === "anchored");
    assert.equal(readability.layoutOverlapCount, 0, id);
    assert.ok(
      (readability.layoutMinGap ?? 0) >=
        EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minVisualGap,
      `${id} minGap=${readability.layoutMinGap}`,
    );
    assert.ok(
      readability.layoutStatus === "valid" ||
        readability.layoutStatus === "degraded",
      id,
    );
    assert.deepEqual(readability.anchorPosition, { x: 0, y: 0, z: 0 });
    assert.equal(readability.positions[id]?.x, 0);
    assert.equal(readability.positions[id]?.y, 0);
    assert.equal(readability.positions[id]?.z, 0);
  }
});

test("O/P — Connections use hard-separated endpoints; no invented edges", () => {
  const readability = overlapStats("obj-delivery");
  assert.ok(readability.connectionRoutes.length > 0);
  for (const route of readability.connectionRoutes) {
    assert.equal(route.endpoints[0].z, 0);
    assert.equal(route.endpoints[1].z, 0);
    // Endpoints should match final layout positions of some visible objects.
    const matchesSource = Object.values(readability.positions).some(
      (position) =>
        position.x === route.endpoints[0].x &&
        position.y === route.endpoints[0].y,
    );
    const matchesTarget = Object.values(readability.positions).some(
      (position) =>
        position.x === route.endpoints[1].x &&
        position.y === route.endpoints[1].y,
    );
    assert.equal(matchesSource, true);
    assert.equal(matchesTarget, true);
  }
});

test("Q — Executive Thread does not occupy anchor (bridge placement)", () => {
  const source = readFileSync(
    join(here, "../nex-mvp/nexoraMVPExecutiveStage2DTopologyReadability.ts"),
    "utf8",
  );
  assert.match(source, /collapsed-thread/);
  assert.match(source, /resolveExecutiveThreadGatewayPosition/);
  assert.doesNotMatch(
    source,
    /role === "collapsed-thread"[\s\S]{0,200}targetPosition: Object\.freeze\(\[0, 0, 0\]/,
  );
});

test("R/S — Dial + Presentation reserved zones", () => {
  const hard = resolveExecutiveStage2DHardSeparatedLayout({
    anchorObjectId: "a",
    positions: {
      a: { x: 0, y: 0, z: 0 },
      b: { x: 2.0, y: -1.5, z: 0 },
      c: { x: 1.8, y: 1.6, z: 0 },
    },
    classifications: { a: "anchor", b: "related", c: "related" },
  });
  assert.equal(isInsideExecutiveStage2DDialExclusion(hard.positions.b!.x, hard.positions.b!.y), false);
  assert.ok(!(hard.positions.c!.x >= 1.55 && hard.positions.c!.y >= 1.35));
});

test("T — Deterministic hard separation", () => {
  const input = {
    anchorObjectId: "a",
    positions: {
      a: { x: 0, y: 0, z: 0 as const },
      b: { x: 0.2, y: 0.1, z: 0 as const },
      c: { x: -0.15, y: 0.05, z: 0 as const },
    },
    classifications: {
      a: "anchor" as const,
      b: "related" as const,
      c: "related" as const,
    },
  };
  const first = resolveExecutiveStage2DHardSeparatedLayout(input);
  const second = resolveExecutiveStage2DHardSeparatedLayout(input);
  assert.deepEqual(first.positions, second.positions);
  assert.equal(first.overlapCount, second.overlapCount);
  assert.equal(first.layoutStatus, second.layoutStatus);
});

test("Geometry renderer exposes STAGE-OBJ:1 object-geometry layer", () => {
  const geometry = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(geometry, /spatialLayer: "object-geometry"/);
  assert.match(geometry, /stageObj3d/);
  assert.match(geometry, /bodyCount: 1/);
});
