/**
 * NPA-T OVS-MATERIAL:1 — Day Stage material & readability (focused).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE,
  NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE_DAY,
  NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY,
  deriveNexoraMVPSceneEnvironmentVisualState,
} from "./nexoraMVPWorkspacePresentation.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "../spatial-presentation/executiveOvsObjectStateVisual.ts";
import { resolveExecutiveOvsObjectStateVisual } from "../spatial-presentation/executiveOvsObjectStateVisual.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE_DAY,
  resolveExecutiveOvsMaterialLanguage,
  resolveExecutiveOvsObjectVisualLanguage,
} from "../spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import { projectExecutiveOvsObjectKindHandoff } from "../spatial-presentation/projectExecutiveOvsObjectKindHandoff.ts";
import { EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS } from "../spatial-presentation/executiveObjectLabelInformationDensity.ts";
import { EXECUTIVE_OBJECT_GROUND_PRESENCE } from "../spatial-presentation/executiveObjectPresenceIdentity.ts";

const here = dirname(fileURLToPath(import.meta.url));
const frontend = join(here, "../..");

function read(rel: string): string {
  return readFileSync(join(here, rel), "utf8");
}

test("1 — Day background uses the workspace atmosphere Day overlay", () => {
  const day = deriveNexoraMVPSceneEnvironmentVisualState("neutral", {
    uiTheme: "day",
  });
  assert.equal(
    day.background,
    NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE_DAY.neutral.background,
  );
  assert.equal(day.background, "#8ec4ea");
  assert.equal(day.groundColor, "#8ec4ea");
  assert.ok(day.groundOpacity >= 0.9);
  assert.notEqual(day.background.toLowerCase(), "#d7e0ec");
  assert.notEqual(day.background.toLowerCase(), "#ffffff");
  assert.ok(day.fogNear > NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE.neutral.fogNear);
  assert.equal(
    NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.dayNightReplacesWorkspaceIntent,
    false,
  );
});

test("2 — Night theme remains independently resolved", () => {
  const night = deriveNexoraMVPSceneEnvironmentVisualState("neutral");
  const day = deriveNexoraMVPSceneEnvironmentVisualState("neutral", {
    uiTheme: "day",
  });
  assert.equal(night.background, "#152033");
  assert.notEqual(night.background, day.background);
  assert.equal(
    night.atmosphereHaze.center,
    "rgba(118, 158, 196, 0.42)",
  );
  assert.notEqual(night.atmosphereHaze.rim, day.atmosphereHaze.rim);
  assert.equal(night.objectSurfaceTreatment, day.objectSurfaceTreatment);
});

test("3 — Risk semantic form is unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  const risk = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "risk",
    enabled: true,
  });
  assert.equal(risk.primitive, "diamond");
  assert.equal(risk.family, "risk");
});

test("4 — Generic operational form is unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  const operational = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "object",
    enabled: true,
  });
  assert.equal(operational.primitive, "rounded-block");
  assert.equal(operational.family, "operational");
});

test("5 — OVS state still controls material independently of form", () => {
  const watch = resolveExecutiveOvsObjectStateVisual({ status: "watch" });
  const unresolved = resolveExecutiveOvsObjectStateVisual({
    status: "unresolved",
  });
  const stable = resolveExecutiveOvsObjectStateVisual({ status: "stable" });
  assert.equal(watch.managementClass, "watch");
  assert.equal(unresolved.managementClass, "unresolved");
  assert.ok(watch.emissiveScale > stable.emissiveScale);
  assert.ok(unresolved.roughnessBias > watch.roughnessBias);
  assert.equal(
    EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily,
    false,
  );
  const watchForm = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: "object",
    enabled: true,
  });
  assert.equal(watchForm.primitive, "rounded-block");
});

test("6 — Caption primary/secondary hierarchy is the label presentation contract", () => {
  const label = read("../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx");
  assert.match(label, /data-caption-role=\{index === 0 \? "primary" : "secondary"\}/);
  assert.match(label, /fontWeight: index === 0 \? 700 : 500/);
  assert.match(label, /opacity: index === 0 \? 1 : 0.58/);
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal, 0.94);
  assert.ok(
    EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal >
      EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.minimal,
  );
});

test("7 — No canonical-ID form hack is reintroduced", () => {
  const handoff = read("../spatial-presentation/projectExecutiveOvsObjectKindHandoff.ts");
  assert.match(handoff, /void input\.id/);
  assert.doesNotMatch(handoff, /obj-risk/);
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({ id: "obj-risk", kind: "object" }),
    "object",
  );
  assert.equal(
    projectExecutiveOvsObjectKindHandoff({
      id: "obj-other",
      kind: "object",
      objectKind: "risk",
    }),
    "risk",
  );
});

test("8 — No new duplicate material registry", () => {
  assert.equal(
    resolveExecutiveOvsMaterialLanguage("night"),
    EXECUTIVE_OVS_MATERIAL_LANGUAGE,
  );
  assert.equal(
    resolveExecutiveOvsMaterialLanguage("day"),
    EXECUTIVE_OVS_MATERIAL_LANGUAGE_DAY,
  );
  assert.ok(
    EXECUTIVE_OVS_MATERIAL_LANGUAGE_DAY.bodyShadeToward <
      EXECUTIVE_OVS_MATERIAL_LANGUAGE.bodyShadeToward,
  );
  assert.equal(EXECUTIVE_OVS_MATERIAL_LANGUAGE.innerLightSemanticAuthoritative, false);
  const language = read("../spatial-presentation/executiveOvsObjectVisualLanguage.ts");
  assert.doesNotMatch(language, /MaterialRegistryV2|DayMaterialStore|OvsMaterialCatalog/);
  const renderer = read("../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx");
  assert.match(renderer, /resolveExecutiveOvsMaterialLanguage/);
  assert.match(renderer, /ovsMaterial\.bodyShadeToward/);
  const body = read("../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx");
  assert.match(body, /visualLayerRole: "inner-light"/);
  assert.match(body, /sphereGeometry/);
  assert.doesNotMatch(body, /boxGeometry args=\{\[width \* 0\.28/);
  const objectSrc = read("../../executive/nex-mvp/stage/NexoraStageObject.tsx");
  assert.match(objectSrc, /visualLayerRole: "ground-presence"/);
  assert.doesNotMatch(
    objectSrc,
    /!isExecutiveOvsObjectVisualLanguageEnabled\(\) &&\s*isExecutive3DObjectTerritoryVisible/,
  );
  assert.equal(EXECUTIVE_OBJECT_GROUND_PRESENCE.style, "ground");
  assert.ok(EXECUTIVE_OBJECT_GROUND_PRESENCE.opacityPrimary < 0.12);
  const css = readFileSync(join(frontend, "globals.css"), "utf8");
  assert.match(css, /html\[data-theme="day"\]/);
  assert.match(css, /#8ec4ea/);
  assert.doesNotMatch(
    css,
    /html\[data-theme="day"\][\s\S]{0,400}--nx-stage-bg: radial-gradient\([^)]*#ffffff/,
  );
});
