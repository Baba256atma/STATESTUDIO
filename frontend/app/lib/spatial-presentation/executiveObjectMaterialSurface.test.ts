/**
 * SP:2.3 — Executive Material & Surface System tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_MATERIAL_DNA,
  EXECUTIVE_OBJECT_MATERIAL_INSTANCE_POLICY,
  EXECUTIVE_OBJECT_MATERIAL_PROFILES,
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY,
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS,
  executiveObjectMaterialSurfaceIdentity,
  getExecutiveObjectMaterialSurfaceIdentity,
  mixExecutiveObjectMaterialHex,
  resolveExecutiveObjectMaterialPresentation,
  resolveExecutiveObjectMaterialSurfaceTone,
  verifyExecutiveObjectMaterialSurface,
  type ExecutiveObjectMaterialInput,
} from "./executiveObjectMaterialSurface.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";
import { resolveExecutiveObjectOcclusion } from "./executiveObjectOcclusion.ts";
import { resolveExecutiveDensityAwareFraming } from "./executiveDensityAwareFraming.ts";
import {
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  applyExecutiveCameraNavigationAction,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraIntent,
} from "./executiveCameraNavigation.ts";
import { resolveExecutiveCameraPresentation } from "./executiveCameraFoundation.ts";

const source = readFileSync(
  new URL("./executiveObjectMaterialSurface.ts", import.meta.url),
  "utf8",
);

const rendererSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx",
    import.meta.url,
  ),
  "utf8",
);

const stageObjectSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    import.meta.url,
  ),
  "utf8",
);

const SEMANTIC_FAMILIES = [
  "operational",
  "goal",
  "kpi",
  "risk_problem",
  "decision",
  "scenario",
  "execution",
  "context",
  "unknown",
] as const;

const GEOMETRY_FAMILIES = [
  "block",
  "rounded",
  "cylindrical",
  "orbital",
  "planar",
] as const;

function baseMaterialInput(
  overrides: Partial<ExecutiveObjectMaterialInput> = {},
): ExecutiveObjectMaterialInput {
  return Object.freeze({
    geometryFamily: "block",
    semanticFamily: "operational",
    spatialRole: "overview",
    selected: false,
    focused: false,
    hovered: false,
    attention: "normal",
    status: "stable",
    occlusionState: "clear",
    stateMarker: "none",
    ...overrides,
  });
}

function assertBounded(
  presentation: ReturnType<typeof resolveExecutiveObjectMaterialPresentation>,
): void {
  const bounds = EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS;
  assert.ok(Number.isFinite(presentation.roughness));
  assert.ok(Number.isFinite(presentation.metalness));
  assert.ok(Number.isFinite(presentation.opacity));
  assert.ok(Number.isFinite(presentation.emissiveIntensity));
  assert.ok(Number.isFinite(presentation.envMapIntensity));
  assert.ok(
    presentation.roughness >= bounds.minimumRoughness &&
      presentation.roughness <= bounds.maximumRoughness,
  );
  assert.ok(
    presentation.metalness >= bounds.minimumMetalness &&
      presentation.metalness <= bounds.maximumMetalness,
  );
  assert.ok(
    presentation.opacity >= bounds.minimumOpacity &&
      presentation.opacity <= bounds.maximumOpacity,
  );
  assert.ok(
    presentation.emissiveIntensity >= bounds.minimumEmissive &&
      presentation.emissiveIntensity <= bounds.maximumEmissive,
  );
  assert.ok(
    presentation.envMapIntensity >= bounds.minimumEnvMapIntensity &&
      presentation.envMapIntensity <= bounds.maximumEnvMapIntensity,
  );
}

test("1. SP:2.3 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectMaterialSurfaceIdentity();
  assert.equal(identity.id, executiveObjectMaterialSurfaceIdentity);
  assert.equal(identity.version, "2.3.0");
  assert.equal(
    identity.upstreamVisualFoundation,
    "SP:2.1/ExecutiveObjectVisualFoundation",
  );
  assert.equal(
    identity.upstreamGeometryLanguage,
    "SP:2.2/ExecutiveObjectGeometryLanguage",
  );
  assert.equal(
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.introducesCustomShaders,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.finalizesSeverityHierarchy,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.usesObjectIdMaterialHacks,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.replacesVisualFoundationAuthority,
    false,
  );
  assert.equal(verifyExecutiveObjectMaterialSurface().ok, true);
  assert.doesNotMatch(source, /from ["']@react-three/);
  assert.doesNotMatch(source, /from ["']three["']/);
  assert.doesNotMatch(source, /objectId\s*===\s*["']/);
  assert.doesNotMatch(source, /label\.includes/);
  assert.doesNotMatch(source, /name\s*===\s*["']Revenue["']/);
  assert.doesNotMatch(source, /ShaderMaterial|onBeforeCompile|glsl/);
});

test("2. identical input produces identical material presentation", () => {
  const input = baseMaterialInput({
    semanticFamily: "decision",
    focused: true,
    status: "watch",
  });
  const a = resolveExecutiveObjectMaterialPresentation(input);
  const b = resolveExecutiveObjectMaterialPresentation(input);
  assert.deepEqual(a, b);
});

test("3. resolver does not mutate input", () => {
  const input = baseMaterialInput({
    selected: true,
    occlusionState: "partial",
    status: "risk",
  });
  const snapshot = JSON.stringify(input);
  resolveExecutiveObjectMaterialPresentation(input);
  assert.equal(JSON.stringify(input), snapshot);
});

test("4. numeric values are finite and bounded", () => {
  const presentation = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({
      compositionOpacity: 9,
      compositionEmissiveIntensity: 9,
      status: "unresolved",
      stateMarker: "unresolved",
    }),
  );
  assertBounded(presentation);
});

test("5. unknown family receives safe base fallback", () => {
  const presentation = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ semanticFamily: "unknown", geometryFamily: "block" }),
  );
  assert.equal(presentation.surfaceToken, "object.material.base");
  assert.equal(presentation.baseColor, EXECUTIVE_OBJECT_MATERIAL_DNA.baseBodyColor);
  assert.equal(presentation.toneMapped, true);
  assert.equal(presentation.depthWrite, true);
  assertBounded(presentation);
});

test("6. geometry family does not break material resolution", () => {
  for (const geometryFamily of GEOMETRY_FAMILIES) {
    const presentation = resolveExecutiveObjectMaterialPresentation(
      baseMaterialInput({ geometryFamily, semanticFamily: "operational" }),
    );
    assertBounded(presentation);
    assert.equal(presentation.surfaceToken, "object.material.operational");
  }
});

test("7. family cohesion — shared DNA with bounded variation", () => {
  const roughness: number[] = [];
  const metalness: number[] = [];
  const emissive: number[] = [];
  for (const semanticFamily of SEMANTIC_FAMILIES) {
    const presentation = resolveExecutiveObjectMaterialPresentation(
      baseMaterialInput({ semanticFamily, geometryFamily: "block" }),
    );
    assertBounded(presentation);
    roughness.push(presentation.roughness);
    metalness.push(presentation.metalness);
    emissive.push(presentation.emissiveIntensity);
    assert.ok(presentation.emissiveIntensity <= 0.12);
    assert.ok(presentation.opacity >= 0.8 || semanticFamily === "context" || semanticFamily === "scenario");
  }
  assert.ok(Math.max(...roughness) - Math.min(...roughness) <= 0.22);
  assert.ok(Math.max(...metalness) - Math.min(...metalness) <= 0.2);
  assert.ok(Math.max(...emissive) - Math.min(...emissive) <= 0.08);
});

test("8. state composition remains deterministic", () => {
  const cases: readonly ExecutiveObjectMaterialInput[] = [
    baseMaterialInput({ semanticFamily: "operational", status: "stable" }),
    baseMaterialInput({
      semanticFamily: "operational",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    }),
    baseMaterialInput({
      semanticFamily: "decision",
      focused: true,
      spatialRole: "focus",
    }),
    baseMaterialInput({
      semanticFamily: "scenario",
      spatialRole: "related",
    }),
    baseMaterialInput({
      semanticFamily: "risk_problem",
      spatialRole: "background",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    }),
    baseMaterialInput({
      semanticFamily: "operational",
      selected: true,
      status: "stable",
    }),
    baseMaterialInput({
      semanticFamily: "kpi",
      hovered: true,
      status: "watch",
    }),
    baseMaterialInput({
      semanticFamily: "risk_problem",
      occlusionState: "partial",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    }),
  ];

  for (const input of cases) {
    const a = resolveExecutiveObjectMaterialPresentation(input);
    const b = resolveExecutiveObjectMaterialPresentation(input);
    assert.deepEqual(a, b);
    assertBounded(a);
  }
});

test("9. state invariance — material does not change geometry or identity", () => {
  const kinds = ["object", "problem", "decision"] as const;
  for (const kind of kinds) {
    const normal = resolveExecutiveObjectVisualPresentation({
      objectId: `id-${kind}`,
      objectKind: kind,
      selected: false,
      focused: false,
      status: "stable",
      attention: "normal",
    });
    const critical = resolveExecutiveObjectVisualPresentation({
      objectId: `id-${kind}`,
      objectKind: kind,
      selected: true,
      focused: true,
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    });
    assert.equal(normal.objectId, critical.objectId);
    assert.equal(normal.objectKind, critical.objectKind);
    assert.equal(normal.geometry.family, critical.geometry.family);
    assert.equal(normal.geometry.semanticFamily, critical.geometry.semanticFamily);
    assert.deepEqual(normal.dimensions, critical.dimensions);
  }
});

test("10. focus material remains restrained", () => {
  const overview = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ semanticFamily: "operational" }),
  );
  const focused = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({
      semanticFamily: "operational",
      focused: true,
      spatialRole: "focus",
    }),
  );
  assert.ok(focused.emissiveIntensity > overview.emissiveIntensity);
  assert.ok(
    focused.emissiveIntensity <=
      EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumEmissive,
  );
  assert.ok(focused.opacity >= 0.96);
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "focus-op",
    objectKind: "object",
    selected: false,
    focused: true,
    spatialRole: "focus",
  });
  assert.equal(visual.geometry.semanticFamily, "operational");
  assert.equal(visual.emphasis.showFocusPedestal, true);
});

test("11. critical background remains discoverable without becoming focus", () => {
  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-a",
    objectKind: "object",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "stable",
    attention: "normal",
  });
  const backgroundCritical = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-b",
    objectKind: "problem",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    rimIntensity: 0.8,
    compositionOpacity: 0.28,
  });

  assert.equal(focused.spatialRole, "focus");
  assert.equal(focused.emphasis.focused, true);
  assert.equal(backgroundCritical.spatialRole, "background");
  assert.equal(backgroundCritical.emphasis.focused, false);
  assert.equal(backgroundCritical.geometry.semanticFamily, "risk_problem");
  assert.equal(backgroundCritical.material.surfaceTone, "object.surface.risk");
  assert.ok(
    backgroundCritical.material.opacity >=
      EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.backgroundCriticalFloor,
  );
  assert.ok(
    backgroundCritical.material.emissiveIntensity <=
      EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumEmissive,
  );
  assert.equal(backgroundCritical.edge.mode, "attention");
  assert.notEqual(focused.objectId, backgroundCritical.objectId);
});

test("12. hover is distinct from critical severity", () => {
  const hovered = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ hovered: true, status: "stable" }),
  );
  const critical = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    }),
  );
  assert.equal(hovered.surfaceTone, "object.surface.base");
  assert.equal(critical.surfaceTone, "object.surface.risk");
  assert.notEqual(hovered.color, critical.color);
});

test("13. occlusion assistance does not force extreme transparency", () => {
  const clear = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({
      semanticFamily: "risk_problem",
      status: "risk",
      attention: "critical",
    }),
  );
  const occluded = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({
      semanticFamily: "risk_problem",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
      occlusionState: "substantial",
    }),
  );
  assert.ok(
    occluded.opacity >= EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.minimumOpacity,
  );
  assert.ok(occluded.opacity >= 0.7 || occluded.transparent === true);
  assert.equal(occluded.depthWrite, true);
  assert.equal(occluded.depthTest, true);
  assert.equal(clear.surfaceTone, occluded.surfaceTone);

  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "occ-b",
    objectKind: "problem",
    selected: false,
    focused: false,
    status: "risk",
    attention: "critical",
    occlusionState: "substantial",
    silhouetteAssist: true,
    readabilityAssist: true,
  });
  const occlusion = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "occ-a",
        position: Object.freeze({ x: 0.2, y: 0.1, z: 1.1 }),
        radius: visual.connectionAnchor.radius,
      }),
      Object.freeze({
        objectId: "occ-b",
        position: Object.freeze({ x: 0.15, y: 0.12, z: -0.2 }),
        radius: visual.connectionAnchor.radius,
      }),
    ],
    cameraPosition: Object.freeze({ x: 3.8, y: 5.2, z: 7.6 }),
    cameraTarget: Object.freeze({ x: -0.22, y: 0.2, z: 0.02 }),
    fovDegrees: 38,
    aspect: 1.45,
  });
  assert.ok(occlusion.byId.has("occ-b"));
});

test("14. transparency profiles remain bounded and depth-safe", () => {
  for (const family of ["scenario", "context"] as const) {
    const presentation = resolveExecutiveObjectMaterialPresentation(
      baseMaterialInput({ semanticFamily: family }),
    );
    assert.equal(presentation.transparent, true);
    assert.ok(presentation.opacity >= 0.8);
    assert.ok(presentation.opacity < 0.985);
    assert.equal(presentation.depthWrite, true);
    assert.equal(presentation.depthTest, true);
  }
  const operational = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ semanticFamily: "operational" }),
  );
  assert.equal(operational.transparent, false);
  assert.equal(operational.opacity, 1);
});

test("15. renderer consumes resolved material — no JSX roughness/metalness policy", () => {
  assert.match(rendererSource, /material\.roughness/);
  assert.match(rendererSource, /material\.metalness/);
  assert.match(rendererSource, /material\.emissiveColor/);
  assert.match(rendererSource, /material\.envMapIntensity/);
  assert.match(stageObjectSource, /ExecutiveObjectGeometryRenderer/);
  assert.doesNotMatch(stageObjectSource, /roughness=\{0\./);
  assert.doesNotMatch(stageObjectSource, /metalness=\{0\./);
  assert.doesNotMatch(rendererSource, /roughness=\{0\./);
  assert.doesNotMatch(rendererSource, /metalness=\{0\./);
});

test("16. geometry-family material compatibility via visual authority", () => {
  const kinds = [
    "object",
    "goal",
    "kpi",
    "problem",
    "decision",
    "scenario",
    "execution",
    "insight",
  ] as const;
  for (const kind of kinds) {
    const geometry = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: `mat-${kind}`,
      objectKind: kind,
      selected: false,
      focused: false,
    });
    assert.equal(visual.geometry.family, geometry.geometryFamily);
    assert.equal(visual.material.surfaceToken.length > 0, true);
    assert.ok(visual.material.color.startsWith("#"));
    assert.ok(visual.material.emissiveColor.startsWith("#"));
    assert.equal(visual.material.toneMapped, true);
  }
});

test("17. navigation remains finite under mixed material scene", () => {
  const target = Object.freeze({ x: 0, y: 0.2, z: 0 });
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target,
  });
  let nav = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (const action of [
    "orbit-left",
    "orbit-right",
    "tilt-up",
    "tilt-down",
  ] as const) {
    nav = applyExecutiveCameraNavigationAction(nav, action, base);
    const intent = resolveNavigatedExecutiveCameraIntent({
      mode: "overview",
      target,
      navigation: nav,
    });
    const presentation = resolveExecutiveCameraPresentation(intent);
    assert.ok(Number.isFinite(presentation.position.x));
  }
});

test("18. density framing remains safe", () => {
  const framing = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
  });
  assert.ok(Number.isFinite(framing.cameraDistance));
  assert.ok(framing.cameraDistance > 0);
});

test("19. surface tone tokens remain status-compatible", () => {
  assert.equal(
    resolveExecutiveObjectMaterialSurfaceTone("stable"),
    "object.surface.base",
  );
  assert.equal(
    resolveExecutiveObjectMaterialSurfaceTone("watch"),
    "object.surface.watch",
  );
  assert.equal(
    resolveExecutiveObjectMaterialSurfaceTone("risk"),
    "object.surface.risk",
  );
  assert.equal(
    resolveExecutiveObjectMaterialSurfaceTone("unresolved"),
    "object.surface.unresolved",
  );
});

test("20. state tint is bounded — not full traffic-light body", () => {
  const stable = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ status: "stable" }),
  );
  const risk = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ status: "risk", attention: "critical" }),
  );
  assert.notEqual(stable.color, risk.color);
  assert.notEqual(risk.color.toLowerCase(), "#f87171");
  assert.notEqual(risk.color.toLowerCase(), "#ff0000");
  assert.equal(risk.baseColor, EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor);
  const mixed = mixExecutiveObjectMaterialHex("#536478", "#c07070", 0.34);
  assert.equal(risk.color, mixed);
});

test("21. instance policy forbids shared mutable materials and shaders", () => {
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_INSTANCE_POLICY.sharedMutableMaterials, false);
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_INSTANCE_POLICY.perObjectInstances, true);
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_INSTANCE_POLICY.customShaders, false);
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_DNA.noCustomShaders, true);
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_DNA.noNeonBody, true);
});

test("22. related remains subordinate to focus without disappearing", () => {
  const focus = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ focused: true, spatialRole: "focus" }),
  );
  const related = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ spatialRole: "related" }),
  );
  const background = resolveExecutiveObjectMaterialPresentation(
    baseMaterialInput({ spatialRole: "background" }),
  );
  assert.ok(focus.opacity >= related.opacity);
  assert.ok(related.opacity > background.opacity);
  assert.ok(
    background.opacity >=
      EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.backgroundNormalFloor,
  );
});
