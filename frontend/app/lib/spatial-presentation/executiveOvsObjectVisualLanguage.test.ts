/**
 * NPA-T OVS:1 — Executive 3D Object Visual Language tests A–H.
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
import { EXECUTIVE_STAGE_MOTION } from "./executiveStageMotion.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE,
  EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY,
  EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY,
  getExecutiveOvsObjectVisualLanguageIdentity,
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsObjectVisualLanguage,
  resolveExecutiveOvsPrimitive,
  setExecutiveOvsObjectVisualLanguageEnabled,
  verifyExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";

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

test("OVS:1 identity / verify", () => {
  const identity = getExecutiveOvsObjectVisualLanguageIdentity();
  assert.equal(identity.id, "NPA-T OVS:1/Executive3DObjectVisualLanguage");
  assert.equal(
    identity.architecturalRole,
    "PresentationOnlyExecutiveObjectGeometryLanguage",
  );
  assert.equal(verifyExecutiveOvsObjectVisualLanguage(), true);
  assert.equal(EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsCamera, false);
  assert.equal(
    EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.introducesSecondCanvas,
    false,
  );
  assert.equal(
    EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.inventsBusinessStates,
    false,
  );
});

test("A — Geometry resolution is deterministic per category", () => {
  const expected = {
    goal: "orb",
    objective: "orb",
    kpi: "cylinder",
    measure: "cylinder",
    problem: "prism",
    issue: "prism",
    risk: "diamond",
    scenario: "rounded-block",
    decision: "hex-prism",
    execution: "rounded-block",
    action: "rounded-block",
    outcome: "ring",
    learning: "ring",
  } as const;
  for (const [kind, primitive] of Object.entries(expected)) {
    const language = resolveExecutiveOvsObjectVisualLanguage({
      objectKind: kind,
      enabled: true,
    });
    assert.equal(language.primitive, primitive, kind);
    assert.equal(
      resolveExecutiveOvsPrimitive(resolveExecutiveOvsObjectFamily(kind)),
      primitive,
    );
  }
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.goal, "orb");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.kpi, "cylinder");
  assert.notEqual(
    resolveExecutiveOvsObjectFamily("problem"),
    resolveExecutiveOvsObjectFamily("risk"),
  );
  assert.notEqual(
    resolveExecutiveOvsObjectVisualLanguage({ objectKind: "goal" }).primitive,
    resolveExecutiveOvsObjectVisualLanguage({ objectKind: "kpi" }).primitive,
  );
  const scenario = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "scenario",
    enabled: true,
  });
  const execution = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "execution",
    enabled: true,
  });
  assert.equal(scenario.primitive, execution.primitive);
  assert.notEqual(scenario.width / scenario.height, execution.width / execution.height);
  assert.ok(
    EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.scenario >
      EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.execution,
  );
  const distinct = new Set(
    ["goal", "kpi", "problem", "risk", "decision", "outcome"].map(
      (kind) =>
        resolveExecutiveOvsObjectVisualLanguage({ objectKind: kind }).primitive,
    ),
  );
  assert.equal(distinct.size, 6);
});

test("B — Geometry does not change canonical Object IDs or semantic Z", () => {
  setExecutiveOvsObjectVisualLanguageEnabled(true);
  const on = pipeline("obj-budget");
  setExecutiveOvsObjectVisualLanguageEnabled(false);
  const off = pipeline("obj-budget");
  setExecutiveOvsObjectVisualLanguageEnabled(true);
  assert.equal(on.state.focusedSubject?.id, "obj-budget");
  assert.equal(off.state.focusedSubject?.id, "obj-budget");
  assert.equal(on.presentation.scene.focusedObjectId, "obj-budget");
  const onIds = on.presentation.scene.objects.map((entry) => entry.id);
  const offIds = off.presentation.scene.objects.map((entry) => entry.id);
  assert.deepEqual(onIds, offIds);
  assert.ok(on.presentation.scene.objects.every((entry) => entry.targetPosition[2] === 0));
});

test("C — Selection still activates the same canonical Object", () => {
  const { state, presentation } = pipeline("obj-budget");
  assert.equal(state.selectedSubject?.id ?? state.focusedSubject?.id, "obj-budget");
  assert.equal(presentation.scene.focusedObjectId, "obj-budget");
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /onSelect\(\)/);
  assert.match(renderer, /ExecutiveOvsObjectBody/);
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.match(body, /interactiveHandlers/);
});

test("D — Existing selection/focus/status styling still reaches the Object", () => {
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /material\.color/);
  assert.match(renderer, /material\.emissiveIntensity/);
  assert.match(renderer, /ExecutiveObjectEdgeGeometry/);
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.metalness, 0.22);
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "problem",
    enabled: true,
  });
  assert.equal(language.material.roughness, 0.46);
});

test("E — Relationships still bind by canonical Object IDs", () => {
  const { presentation } = pipeline("obj-budget");
  for (const connection of presentation.scene.connections) {
    assert.ok(typeof connection.id === "string" && connection.id.length > 0);
    assert.ok(typeof connection.sourceId === "string");
    assert.ok(typeof connection.targetId === "string");
  }
  assert.equal(EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsRelationships, false);
  const connections = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageConnections.tsx"),
    "utf8",
  );
  assert.match(connections, /sourceId/);
  assert.match(connections, /targetId/);
});

test("F — Reduced motion remains STAGE-MOTION:1; OVS adds no animation loop", () => {
  assert.equal(EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs, 80);
  const motion = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageMotionController.tsx"),
    "utf8",
  );
  assert.match(motion, /prefers-reduced-motion/);
  const language = readFileSync(
    join(here, "./executiveOvsObjectVisualLanguage.ts"),
    "utf8",
  );
  assert.doesNotMatch(language, /useFrame/);
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.doesNotMatch(body, /useFrame/);
});

test("G — Unknown types fall back to Nexora rounded-block", () => {
  const unknown = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "unmapped-widget-xyz",
    enabled: true,
  });
  assert.equal(unknown.family, "operational");
  assert.equal(unknown.primitive, "rounded-block");
  assert.equal(unknown.fallback, true);
  const empty = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "",
    enabled: true,
  });
  assert.equal(empty.primitive, "rounded-block");
  const knownObject = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "object",
    enabled: true,
  });
  assert.equal(knownObject.primitive, "rounded-block");
  assert.equal(knownObject.fallback, false);
});

test("H — One existing Executive Stage R3F Canvas remains", () => {
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.match(canvas, /from "@react-three\/fiber"/);
  assert.match(canvas, /<Canvas/);
  assert.equal(canvas.split("<Canvas").length - 1, 1);
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /NexoraStageCanvas/);
  assert.match(host, /data-ovs-1-contract/);
  assert.doesNotMatch(host, /from "three"/);
  const renderer = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx"),
    "utf8",
  );
  assert.match(renderer, /ExecutiveOvsObjectBody/);
  assert.match(renderer, /ExecutiveObjectPremiumBody/);
  assert.doesNotMatch(renderer, /<Canvas/);
  const body = readFileSync(
    join(here, "../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx"),
    "utf8",
  );
  assert.doesNotMatch(body, /<Canvas/);
  assert.doesNotMatch(body, /transformStyle|preserve-3d/);
  assert.match(body, /Math\.PI \/ 2/);
});

test("OVS:1 does not rotate labels or own camera/motion", () => {
  assert.equal(EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsCamera, false);
  assert.equal(EXECUTIVE_OVS_OBJECT_VISUAL_LANGUAGE_BOUNDARY.ownsMotion, false);
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "goal",
    enabled: true,
  });
  assert.equal(language.rotationX, 0);
  assert.equal(language.rotationY, 0);
  assert.equal(language.backZ, 0);
  const label = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx"),
    "utf8",
  );
  assert.match(label, /Html|html/i);
});
