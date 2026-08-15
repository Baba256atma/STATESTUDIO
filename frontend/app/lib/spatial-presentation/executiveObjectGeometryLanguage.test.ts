/**
 * SP:2.2 — Object Type Geometry Language tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_GEOMETRY_CANONICAL_KINDS,
  EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE,
  EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY,
  EXECUTIVE_OBJECT_KIND_TO_SEMANTIC_FAMILY,
  EXECUTIVE_OBJECT_SEMANTIC_GEOMETRY_PROFILES,
  executiveObjectGeometryLanguageIdentity,
  getExecutiveObjectGeometryLanguageIdentity,
  resolveExecutiveObjectGeometryConnectionRadius,
  resolveExecutiveObjectGeometryFamily,
  resolveExecutiveObjectSemanticVisualFamily,
  verifyExecutiveObjectGeometryLanguage,
} from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectVisualPresentation,
} from "./executiveObjectVisualFoundation.ts";
import {
  applyExecutiveCameraNavigationAction,
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraIntent,
} from "./executiveCameraNavigation.ts";
import { resolveExecutiveCameraPresentation } from "./executiveCameraFoundation.ts";
import { resolveExecutiveDensityAwareFraming } from "./executiveDensityAwareFraming.ts";
import { resolveExecutiveObjectOcclusion } from "./executiveObjectOcclusion.ts";

const source = readFileSync(
  new URL("./executiveObjectGeometryLanguage.ts", import.meta.url),
  "utf8",
);

const stageObjectSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    import.meta.url,
  ),
  "utf8",
);

const geometryRendererSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("1. SP:2.2 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectGeometryLanguageIdentity();
  assert.equal(identity.id, executiveObjectGeometryLanguageIdentity);
  assert.equal(identity.version, "2.2.0");
  assert.equal(
    identity.upstreamVisualFoundation,
    "SP:2.1/ExecutiveObjectVisualFoundation",
  );
  assert.equal(
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.encodesStateInGeometry,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.usesObjectIdGeometryHacks,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.usesLabelNameGeometryHacks,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.replacesVisualFoundationAuthority,
    false,
  );
  assert.equal(verifyExecutiveObjectGeometryLanguage().ok, true);
  assert.doesNotMatch(source, /from ["']@react-three/);
  assert.doesNotMatch(source, /from ["']three["']/);
  assert.doesNotMatch(source, /objectId\s*===\s*["']obj-/);
  assert.doesNotMatch(source, /label\.includes/);
  assert.doesNotMatch(source, /name\s*===\s*["']Revenue["']/);
});

test("2. identical input produces identical geometry resolution", () => {
  const input = Object.freeze({ objectKind: "decision" });
  const a = resolveExecutiveObjectGeometryFamily(input);
  const b = resolveExecutiveObjectGeometryFamily(input);
  assert.deepEqual(a, b);
});

test("3. operational kinds share one semantic family", () => {
  for (const kind of ["object", "pack", "task"] as const) {
    const resolution = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    assert.equal(resolution.semanticFamily, "operational");
    assert.equal(resolution.geometryFamily, "block");
  }
});

test("4. different semantic families resolve distinct geometry profiles", () => {
  const expected = Object.freeze({
    object: { semantic: "operational", geometry: "block" },
    goal: { semantic: "goal", geometry: "orbital" },
    kpi: { semantic: "kpi", geometry: "cylindrical" },
    koi: { semantic: "kpi", geometry: "cylindrical" },
    problem: { semantic: "risk_problem", geometry: "block" },
    decision: { semantic: "decision", geometry: "rounded" },
    scenario: { semantic: "scenario", geometry: "planar" },
    execution: { semantic: "execution", geometry: "rounded" },
    insight: { semantic: "context", geometry: "orbital" },
    guidance: { semantic: "context", geometry: "orbital" },
  } as const);

  for (const [kind, mapping] of Object.entries(expected)) {
    const resolution = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    assert.equal(resolution.semanticFamily, mapping.semantic, kind);
    assert.equal(resolution.geometryFamily, mapping.geometry, kind);
  }

  // Decision vs execution share rounded family but differ in dimensions/profile.
  const decision = resolveExecutiveObjectGeometryFamily({ objectKind: "decision" });
  const execution = resolveExecutiveObjectGeometryFamily({
    objectKind: "execution",
  });
  assert.equal(decision.geometryFamily, execution.geometryFamily);
  assert.notDeepEqual(decision.dimensions, execution.dimensions);
  assert.notEqual(decision.semanticFamily, execution.semanticFamily);
});

test("5. state invariance — geometry ignores presentation state channels", () => {
  const kind = "problem";
  const base = resolveExecutiveObjectGeometryFamily({ objectKind: kind });

  const states = [
    { status: "stable", attention: "normal", focused: false, selected: false },
    { status: "watch", attention: "important", focused: false, selected: true },
    { status: "risk", attention: "critical", focused: true, selected: false },
    {
      status: "unresolved",
      attention: "normal",
      focused: false,
      selected: false,
      spatialRole: "background" as const,
      occlusionState: "substantial" as const,
    },
  ];

  for (const state of states) {
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: "obj-problem",
      objectKind: kind,
      selected: state.selected,
      focused: state.focused,
      attention: state.attention as "normal" | "important" | "critical",
      status: state.status,
      spatialRole: state.spatialRole,
      occlusionState: state.occlusionState,
    });
    assert.equal(visual.geometry.family, base.geometryFamily);
    assert.equal(visual.geometry.semanticFamily, base.semanticFamily);
    assert.deepEqual(visual.dimensions, base.dimensions);
    assert.equal(visual.geometry.resourceKey, base.resourceKey);
  }
});

test("6. unknown kind falls back to block", () => {
  for (const kind of ["", "future-type", "unknown", "Revenue", "risk"]) {
    const resolution = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    assert.equal(resolution.geometryFamily, "block");
    assert.equal(
      resolution.semanticFamily,
      kind === "" ? "unknown" : resolveExecutiveObjectSemanticVisualFamily(kind),
    );
  }
  // "risk" is not a canonical kind — must not guess from spelling.
  assert.equal(
    resolveExecutiveObjectSemanticVisualFamily("risk"),
    "unknown",
  );
  assert.equal(
    resolveExecutiveObjectGeometryFamily({ objectKind: "risk" }).geometryFamily,
    "block",
  );
});

test("7. no name/id-based geometry hacks", () => {
  const byKind = resolveExecutiveObjectGeometryFamily({ objectKind: "object" });
  // Same kind, different IDs/labels must not matter — resolver has no such fields.
  assert.equal(byKind.semanticFamily, "operational");
  assert.equal(
    Object.keys(resolveExecutiveObjectGeometryFamily({ objectKind: "object" }))
      .includes("objectId"),
    false,
  );
  assert.doesNotMatch(source, /obj-revenue|obj-delivery|obj-capacity/);
});

test("8. dimensions stay within Stage-safe envelope", () => {
  for (const kind of EXECUTIVE_OBJECT_GEOMETRY_CANONICAL_KINDS) {
    const resolution = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    const dims = resolution.dimensions;
    assert.ok(dims.width >= EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.minimumWidth);
    assert.ok(dims.width <= EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.maximumWidth);
    assert.ok(dims.height >= EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.minimumHeight);
    assert.ok(dims.height <= EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.maximumHeight);
    assert.ok(dims.depth >= EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.minimumDepth);
    assert.ok(dims.depth <= EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.maximumDepth);
  }
});

test("9. connection anchors are finite and family-aware", () => {
  for (const kind of [
    "object",
    "goal",
    "kpi",
    "problem",
    "decision",
    "scenario",
    "execution",
    "insight",
  ] as const) {
    const resolution = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    const radius = resolveExecutiveObjectGeometryConnectionRadius({
      geometryFamily: resolution.geometryFamily,
      dimensions: resolution.dimensions,
      scale: 1,
      connectionRadiusFactor: resolution.connectionRadiusFactor,
    });
    assert.ok(Number.isFinite(radius));
    assert.ok(radius >= 0.22 && radius <= 0.62);

    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: `id-${kind}`,
      objectKind: kind,
      selected: false,
      focused: false,
    });
    assert.equal(visual.connectionAnchor.objectId, `id-${kind}`);
    assert.deepEqual(visual.connectionAnchor.localOffset, { x: 0, y: 0, z: 0 });
    assert.ok(Number.isFinite(visual.connectionAnchor.radius));
  }
});

test("10. label anchors remain valid across families", () => {
  for (const kind of [
    "object",
    "goal",
    "kpi",
    "problem",
    "decision",
    "scenario",
    "execution",
  ] as const) {
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: `label-${kind}`,
      objectKind: kind,
      selected: false,
      focused: true,
      labelProminence: "full",
    });
    assert.equal(visual.labelAnchor.faceCamera, true);
    assert.equal(visual.labelAnchor.position, "above");
    assert.ok(visual.labelAnchor.offset > visual.dimensions.height * 0.5);
    assert.ok(Number.isFinite(visual.labelAnchor.offset));
  }
});

test("11. SP:2.1 remains visual authority — scale envelope preserved", () => {
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "focus-goal",
    objectKind: "goal",
    selected: false,
    focused: true,
    spatialRole: "focus",
    compositionScale: 2,
  });
  assert.ok(visual.scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis);
  assert.ok(
    visual.scale >= EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
  );
  assert.equal(visual.geometry.semanticFamily, "goal");
});

test("12. mixed-scene fixture — families coexist without mapping collisions", () => {
  const mixed = [
    { id: "op-1", kind: "object" },
    { id: "goal-1", kind: "goal" },
    { id: "prob-1", kind: "problem" },
    { id: "dec-1", kind: "decision" },
    { id: "scen-1", kind: "scenario" },
    { id: "exec-1", kind: "execution" },
  ] as const;

  const families = new Set<string>();
  for (const entry of mixed) {
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: entry.id,
      objectKind: entry.kind,
      selected: false,
      focused: entry.kind === "decision",
    });
    families.add(visual.geometry.semanticFamily);
    assert.equal(visual.objectId, entry.id);
    assert.equal(visual.objectKind, entry.kind);
  }
  assert.ok(families.has("operational"));
  assert.ok(families.has("goal"));
  assert.ok(families.has("risk_problem"));
  assert.ok(families.has("decision"));
  assert.ok(families.has("scenario"));
  assert.ok(families.has("execution"));
});

test("13. occlusion uses family-aware radii", () => {
  const kinds = ["object", "goal", "scenario", "kpi"] as const;
  const objects = kinds.map((kind, index) => {
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: kind,
      objectKind: kind,
      selected: false,
      focused: false,
    });
    return Object.freeze({
      objectId: kind,
      position: Object.freeze({
        x: index * 0.15,
        y: 0.1,
        z: 1.0 - index * 0.35,
      }),
      radius: visual.connectionAnchor.radius,
    });
  });

  const result = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: Object.freeze({ x: 3.8, y: 5.2, z: 7.6 }),
    cameraTarget: Object.freeze({ x: -0.22, y: 0.2, z: 0.02 }),
    fovDegrees: 38,
    aspect: 1.45,
  });

  assert.equal(result.objects.length, kinds.length);
  for (const entry of result.objects) {
    assert.ok(["clear", "partial", "substantial"].includes(entry.state));
  }
});

test("14. density framing remains safe with mixed family dimensions", () => {
  const framing = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: Object.freeze({
      minX: -2.4,
      maxX: 2.2,
      minY: -0.3,
      maxY: 0.5,
      minZ: -1.6,
      maxZ: 1.4,
    }),
  });
  assert.ok(Number.isFinite(framing.cameraDistance));
  assert.ok(framing.cameraDistance > 0);
});

test("15. navigation intents remain finite with mixed geometry scene", () => {
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
    assert.ok(Number.isFinite(presentation.position.y));
    assert.ok(Number.isFinite(presentation.position.z));
  }
});

test("16. relationship truth unchanged — connection identity preserved", () => {
  const relationship = Object.freeze({
    id: "rel-a-b",
    sourceId: "a",
    targetId: "b",
  });
  const sourceVisual = resolveExecutiveObjectVisualPresentation({
    objectId: relationship.sourceId,
    objectKind: "object",
    selected: true,
    focused: true,
  });
  const targetVisual = resolveExecutiveObjectVisualPresentation({
    objectId: relationship.targetId,
    objectKind: "problem",
    selected: false,
    focused: false,
  });
  assert.equal(sourceVisual.connectionAnchor.objectId, "a");
  assert.equal(targetVisual.connectionAnchor.objectId, "b");
  assert.equal(relationship.sourceId, "a");
  assert.equal(relationship.targetId, "b");
  assert.notEqual(
    sourceVisual.geometry.semanticFamily,
    targetVisual.geometry.semanticFamily,
  );
});

test("17. renderer is dumb — no kind switching in Stage JSX", () => {
  assert.match(stageObjectSource, /ExecutiveObjectGeometryRenderer/);
  assert.doesNotMatch(stageObjectSource, /if\s*\(\s*object\.kind/);
  assert.doesNotMatch(stageObjectSource, /kind\s*===\s*["']problem["']/);
  assert.doesNotMatch(geometryRendererSource, /objectKind/);
  assert.doesNotMatch(geometryRendererSource, /semanticFamily/);
  assert.match(geometryRendererSource, /family === "rounded"/);
  assert.match(geometryRendererSource, /family === "cylindrical"/);
  assert.match(geometryRendererSource, /family === "orbital"/);
});

test("18. mapping table covers all canonical kinds", () => {
  for (const kind of EXECUTIVE_OBJECT_GEOMETRY_CANONICAL_KINDS) {
    assert.ok(kind in EXECUTIVE_OBJECT_KIND_TO_SEMANTIC_FAMILY);
    const family = EXECUTIVE_OBJECT_KIND_TO_SEMANTIC_FAMILY[kind];
    assert.ok(family in EXECUTIVE_OBJECT_SEMANTIC_GEOMETRY_PROFILES);
  }
});

test("19. planar retains real thickness for orbit readability", () => {
  const scenario = resolveExecutiveObjectGeometryFamily({
    objectKind: "scenario",
  });
  assert.equal(scenario.geometryFamily, "planar");
  assert.ok(
    scenario.dimensions.depth >=
      EXECUTIVE_OBJECT_GEOMETRY_DIMENSION_ENVELOPE.minimumDepth,
  );
  assert.ok(scenario.dimensions.width > scenario.dimensions.depth);
});

test("20. focus does not remapp geometry family", () => {
  const overview = resolveExecutiveObjectVisualPresentation({
    objectId: "dec",
    objectKind: "decision",
    selected: false,
    focused: false,
    spatialRole: "overview",
  });
  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "dec",
    objectKind: "decision",
    selected: true,
    focused: true,
    spatialRole: "focus",
  });
  assert.equal(overview.geometry.family, focused.geometry.family);
  assert.equal(overview.geometry.semanticFamily, focused.geometry.semanticFamily);
  assert.deepEqual(overview.dimensions, focused.dimensions);
});
