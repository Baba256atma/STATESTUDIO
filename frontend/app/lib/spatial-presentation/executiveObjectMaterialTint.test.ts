/**
 * NPA-T VISUAL-SYSTEM:2 — executive material & semantic tint (focused A–N).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { NEXORA_MVP_CANONICAL_RISK_OBJECT_ID } from "../nex-mvp/nexoraMVPStageFixtures.ts";
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
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE,
} from "./executiveOvsObjectVisualLanguage.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "./executiveOvsObjectStateVisual.ts";
import { resolveExecutiveOvsObjectStateVisual } from "./executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY } from "./executiveOvsIsometricTheatreVisual.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";
import {
  EXECUTIVE_OBJECT_MATERIAL_DNA,
  EXECUTIVE_OBJECT_MATERIAL_PROFILES,
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY,
  mixExecutiveObjectMaterialHex,
  resolveExecutiveObjectMaterialPresentation,
} from "./executiveObjectMaterialSurface.ts";
import { EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES } from "./executiveObjectStateVisualHierarchy.ts";
import {
  EXECUTIVE_DEFAULT_LIGHTING_TOKENS,
  EXECUTIVE_LIGHTING_OBJECT_IDENTITY_PRESERVATION,
  mixExecutiveLightingHex,
  resolveExecutiveLightingProfile,
} from "./executiveLightingFoundation.ts";

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
  return applyExecutiveStageFixedCameraToStagePresentation(withRecomp);
}

test("A — Family material profiles remain one existing registry", () => {
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.ownsBusinessTruth, false);
  assert.ok("operational" in EXECUTIVE_OBJECT_MATERIAL_PROFILES);
  assert.ok("decision" in EXECUTIVE_OBJECT_MATERIAL_PROFILES);
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_DNA.noNeonBody, true);
});

test("B — Operational base remains neutral", () => {
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor, "#4a5563");
  assert.equal(
    EXECUTIVE_OBJECT_MATERIAL_DNA.baseBodyColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor,
  );
});

test("C — Representative family colors differ but remain restrained", () => {
  const colors = [
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.goal.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.kpi.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.risk_problem.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.risk.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.scenario.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.decision.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.execution.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.outcome.baseColor,
  ];
  assert.equal(new Set(colors).size, colors.length);
  for (const hex of colors) {
    assert.notEqual(hex.toLowerCase(), "#22c55e");
    assert.notEqual(hex.toLowerCase(), "#ef4444");
    assert.notEqual(hex.toLowerCase(), "#fcd34d");
    assert.notEqual(hex.toLowerCase(), "#86efac");
  }
});

test("D — Watch body tint contribution is reduced", () => {
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint, 0.07);
  assert.ok(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint < 0.26);
  const stable = resolveExecutiveObjectMaterialPresentation({
    geometryFamily: "block",
    semanticFamily: "operational",
    status: "stable",
  });
  const watch = resolveExecutiveObjectMaterialPresentation({
    geometryFamily: "block",
    semanticFamily: "operational",
    status: "watch",
  });
  assert.equal(stable.baseColor, watch.baseColor);
  const goldBody = mixExecutiveObjectMaterialHex(
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor,
    "#c4a035",
    0.26,
  );
  assert.notEqual(watch.color, goldBody);
});

test("E — Watch state cues remain available through existing OVS:2", () => {
  const watch = resolveExecutiveOvsObjectStateVisual({ status: "watch" });
  assert.equal(watch.managementClass, "watch");
  assert.ok(watch.edgeOpacity > 0);
  assert.equal(watch.edgeStyle, "solid");
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
});

test("F — Critical remains stronger than Watch", () => {
  assert.ok(
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceTint >
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.surfaceTint,
  );
  assert.ok(
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.emissiveLift >
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.emissiveLift,
  );
  assert.ok(
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.edgeOpacity >
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.edgeOpacity,
  );
});

test("G — Unresolved remains restrained", () => {
  assert.equal(EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.unresolved.surfaceTint, 0.08);
  assert.ok(
    EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.unresolved.surfaceTint <
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.surfaceTint,
  );
});

test("H — Workspace environment does not replace Object family material", () => {
  const operational = EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor;
  const decision = EXECUTIVE_OBJECT_MATERIAL_PROFILES.decision.baseColor;
  assert.notEqual(operational, decision);
  assert.equal(
    EXECUTIVE_LIGHTING_OBJECT_IDENTITY_PRESERVATION.replacesFillWithWorkspaceHue,
    false,
  );
});

test("I — Decision/Execution workspace hints do not paint Object bodies gold/green", () => {
  const commit = resolveExecutiveLightingProfile({
    environment: {
      fillLightColor: "#fcd34d",
      keyLightColor: "#f8fafc",
    },
  });
  const execute = resolveExecutiveLightingProfile({
    environment: {
      fillLightColor: "#86efac",
      keyLightColor: "#f0fdf4",
    },
  });
  assert.notEqual(commit.tokens.fillColor, "#fcd34d");
  assert.notEqual(execute.tokens.fillColor, "#86efac");
  assert.equal(
    commit.tokens.fillColor,
    mixExecutiveLightingHex(
      EXECUTIVE_DEFAULT_LIGHTING_TOKENS.fillColor,
      "#fcd34d",
      EXECUTIVE_LIGHTING_OBJECT_IDENTITY_PRESERVATION.fillHintMix,
    ),
  );
});

test("J — Geometry map unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.decision, "hex-prism");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.metalness, 0.22);
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.roughness, 0.46);
});

test("K — Object Z unchanged", () => {
  const presentation = pipeline("obj-capacity");
  assert.ok(
    presentation.scene.objects.every((entry) => entry.targetPosition[2] === 0),
  );
});

test("L — Camera unchanged", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
});

test("M — OVS:3 unchanged", () => {
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
});

test("N — No new color/state/theme registry", () => {
  const material = readFileSync(
    join(here, "./executiveObjectMaterialSurface.ts"),
    "utf8",
  );
  assert.doesNotMatch(material, /WorkspaceMoodStore|VisualSystemV2|paletteEngine/);
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({
      id: NEXORA_MVP_CANONICAL_RISK_OBJECT_ID,
      kind: "object",
    }),
    "risk",
  );
  const risk = resolveExecutiveObjectMaterialPresentation({
    geometryFamily: "block",
    semanticFamily: "unknown",
    objectKind: "risk",
    status: "unresolved",
  });
  const problem = resolveExecutiveObjectMaterialPresentation({
    geometryFamily: "block",
    semanticFamily: "risk_problem",
    objectKind: "problem",
    status: "stable",
  });
  assert.equal(risk.baseColor, EXECUTIVE_OBJECT_MATERIAL_PROFILES.risk.baseColor);
  assert.equal(
    problem.baseColor,
    EXECUTIVE_OBJECT_MATERIAL_PROFILES.risk_problem.baseColor,
  );
  assert.notEqual(risk.baseColor, problem.baseColor);
});
