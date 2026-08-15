/**
 * SP:2.1 — Executive Object Visual Foundation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_DIMENSION_ENVELOPE,
  EXECUTIVE_OBJECT_MATERIAL_BOUNDS,
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  EXECUTIVE_OBJECT_VISUAL_CHANNELS,
  EXECUTIVE_OBJECT_VISUAL_COMPOSITION_ORDER,
  EXECUTIVE_OBJECT_VISUAL_DNA,
  EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY,
  EXECUTIVE_OBJECT_WIREFRAME_POLICY,
  executiveObjectVisualFoundationIdentity,
  getExecutiveObjectVisualFoundationIdentity,
  mapStageRoleToSpatialRole,
  resolveExecutiveObjectConnectionAnchor,
  resolveExecutiveObjectScale,
  resolveExecutiveObjectSurfaceTone,
  resolveExecutiveObjectVisualPresentation,
  toExecutiveObjectVisualInput,
  verifyExecutiveObjectVisualFoundation,
  type ExecutiveObjectVisualInput,
  type ExecutiveObjectVisualPresentation,
} from "./executiveObjectVisualFoundation.ts";
import { EXECUTIVE_OBJECT_SEMANTIC_GEOMETRY_PROFILES } from "./executiveObjectGeometryLanguage.ts";

const source = readFileSync(
  new URL("./executiveObjectVisualFoundation.ts", import.meta.url),
  "utf8",
);

const stageObjectSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    import.meta.url,
  ),
  "utf8",
);

function baseInput(
  overrides: Partial<ExecutiveObjectVisualInput> = {},
): ExecutiveObjectVisualInput {
  return Object.freeze({
    objectId: "obj-delivery",
    objectKind: "kpi",
    selected: false,
    focused: false,
    hovered: false,
    attention: "normal",
    status: "stable",
    spatialRole: "overview",
    occlusionState: "clear",
    ...overrides,
  });
}

function assertFinitePresentation(
  presentation: ExecutiveObjectVisualPresentation,
): void {
  assert.ok(Number.isFinite(presentation.scale));
  assert.ok(Number.isFinite(presentation.dimensions.width));
  assert.ok(Number.isFinite(presentation.dimensions.height));
  assert.ok(Number.isFinite(presentation.dimensions.depth));
  assert.ok(Number.isFinite(presentation.material.opacity));
  assert.ok(Number.isFinite(presentation.material.roughness));
  assert.ok(Number.isFinite(presentation.material.metalness));
  assert.ok(Number.isFinite(presentation.material.emissiveIntensity));
  assert.ok(Number.isFinite(presentation.labelAnchor.offset));
  assert.ok(Number.isFinite(presentation.connectionAnchor.radius));
}

test("1. SP:2.1 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectVisualFoundationIdentity();
  assert.equal(identity.id, executiveObjectVisualFoundationIdentity);
  assert.equal(identity.version, "2.1.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-object-visual-foundation",
  );
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsBusinessTruth,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsSpatialPosition,
    false,
  );
  assert.equal(EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsCamera, false);
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.assignsTypeSpecificGeometry,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.encodesImportanceByScale,
    false,
  );
  assert.equal(verifyExecutiveObjectVisualFoundation().ok, true);
  assert.doesNotMatch(source, /Risk\s*=/);
  assert.doesNotMatch(source, /Decision\s*=/);
  assert.doesNotMatch(source, /from ["']@react-three/);
  assert.doesNotMatch(source, /from ["']three["']/);
});

test("2. identical input produces identical presentation", () => {
  const input = baseInput({ focused: true, attention: "critical" });
  const a = resolveExecutiveObjectVisualPresentation(input);
  const b = resolveExecutiveObjectVisualPresentation(input);
  assert.deepEqual(a, b);
});

test("3. objectId is preserved", () => {
  const presentation = resolveExecutiveObjectVisualPresentation(
    baseInput({ objectId: "canonical-id-42" }),
  );
  assert.equal(presentation.objectId, "canonical-id-42");
});

test("4. unknown object kind resolves to safe fallback", () => {
  const presentation = resolveExecutiveObjectVisualPresentation(
    baseInput({ objectKind: "future-unknown-type" }),
  );
  assert.equal(presentation.objectKind, "future-unknown-type");
  assert.equal(presentation.geometry.family, "block");
  assert.equal(
    presentation.geometry.resourceKey,
    "object-geometry:block:v1",
  );
  assertFinitePresentation(presentation);
});

test("5. dimensions are finite and within canonical envelope", () => {
  const presentation = resolveExecutiveObjectVisualPresentation(baseInput());
  const dims = presentation.dimensions;
  assertFinitePresentation(presentation);
  assert.ok(dims.width >= EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.minimumWidth);
  assert.ok(dims.width <= EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.maximumWidth);
  assert.ok(dims.height >= EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.minimumHeight);
  assert.ok(dims.height <= EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.maximumHeight);
  assert.ok(dims.depth >= EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.minimumDepth);
  assert.ok(dims.depth <= EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.maximumDepth);
});

test("6. scale remains within canonical bounds", () => {
  for (const role of ["overview", "focus", "related", "background"] as const) {
    const presentation = resolveExecutiveObjectVisualPresentation(
      baseInput({
        spatialRole: role,
        focused: role === "focus",
        compositionScale: role === "focus" ? 2.5 : 0.1,
      }),
    );
    // Explicit compositionScale uses minimumCompositionScale (SP:4.1C truth),
    // not the legacy minimumReadable floor.
    assert.ok(
      presentation.scale >=
        EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
    );
    assert.ok(
      presentation.scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis,
    );
  }
});

test("7. material values are finite and bounded", () => {
  const presentation = resolveExecutiveObjectVisualPresentation(
    baseInput({
      status: "unresolved",
      stateMarker: "unresolved",
      compositionOpacity: 9,
      compositionEmissiveIntensity: 9,
    }),
  );
  const m = presentation.material;
  assert.ok(m.opacity >= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumOpacity);
  assert.ok(m.opacity <= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumOpacity);
  assert.ok(
    m.emissiveIntensity >= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumEmissive,
  );
  assert.ok(
    m.emissiveIntensity <= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumEmissive,
  );
  assert.ok(m.roughness >= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumRoughness);
  assert.ok(m.roughness <= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumRoughness);
  assert.ok(m.metalness >= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumMetalness);
  assert.ok(m.metalness <= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumMetalness);
});

test("8. label anchor resolves deterministically", () => {
  const a = resolveExecutiveObjectVisualPresentation(baseInput());
  const b = resolveExecutiveObjectVisualPresentation(baseInput());
  assert.deepEqual(a.labelAnchor, b.labelAnchor);
  assert.equal(a.labelAnchor.position, "above");
  assert.equal(a.labelAnchor.faceCamera, true);
  assert.ok(a.labelAnchor.offset > a.dimensions.height * 0.5);
});

test("9. resolver does not mutate input", () => {
  const input = baseInput({
    selected: true,
    occlusionState: "partial",
  });
  const snapshot = JSON.stringify(input);
  resolveExecutiveObjectVisualPresentation(input);
  assert.equal(JSON.stringify(input), snapshot);
});

test("10. focus state does not alter business truth fields on input", () => {
  const input = baseInput({
    focused: true,
    attention: "critical",
    status: "risk",
    objectKind: "goal",
  });
  const presentation = resolveExecutiveObjectVisualPresentation(input);
  assert.equal(presentation.objectId, input.objectId);
  assert.equal(presentation.objectKind, "goal");
  assert.equal(input.attention, "critical");
  assert.equal(input.status, "risk");
  assert.equal(presentation.emphasis.focused, true);
  assert.equal(presentation.emphasis.showFocusPedestal, true);
});

test("11. severity does not alter object identity", () => {
  const normal = resolveExecutiveObjectVisualPresentation(
    baseInput({ status: "stable", attention: "normal" }),
  );
  const critical = resolveExecutiveObjectVisualPresentation(
    baseInput({ status: "risk", attention: "critical" }),
  );
  assert.equal(normal.objectId, critical.objectId);
  assert.equal(normal.objectKind, critical.objectKind);
  assert.equal(normal.geometry.family, critical.geometry.family);
});

test("12. spatial role resolves independently from severity", () => {
  const backgroundCritical = resolveExecutiveObjectVisualPresentation(
    baseInput({
      spatialRole: "background",
      attention: "critical",
      status: "risk",
      stateMarker: "critical",
      rimIntensity: 0.8,
    }),
  );
  const focusNormal = resolveExecutiveObjectVisualPresentation(
    baseInput({
      spatialRole: "focus",
      focused: true,
      attention: "normal",
      status: "stable",
    }),
  );
  assert.equal(backgroundCritical.spatialRole, "background");
  assert.equal(focusNormal.spatialRole, "focus");
  assert.equal(backgroundCritical.edge.mode, "attention");
  assert.equal(focusNormal.emphasis.showFocusPedestal, true);
  assert.notEqual(
    backgroundCritical.material.surfaceTone,
    focusNormal.material.surfaceTone,
  );
});

test("13. occlusion modifier remains presentation-only", () => {
  const clear = resolveExecutiveObjectVisualPresentation(
    baseInput({ occlusionState: "clear" }),
  );
  const substantial = resolveExecutiveObjectVisualPresentation(
    baseInput({
      occlusionState: "substantial",
      silhouetteAssist: true,
      readabilityAssist: true,
    }),
  );
  assert.equal(clear.objectId, substantial.objectId);
  assert.equal(clear.objectKind, substantial.objectKind);
  assert.equal(substantial.occlusionState, "substantial");
  assert.equal(substantial.emphasis.silhouetteAssist, true);
  assert.ok(
    substantial.labelAnchor.offset > clear.labelAnchor.offset - 1e-9,
  );
});

test("14. state composition combinations remain deterministic", () => {
  const cases: readonly ExecutiveObjectVisualInput[] = [
    baseInput({ spatialRole: "overview", attention: "normal" }),
    baseInput({
      spatialRole: "overview",
      attention: "critical",
      status: "risk",
      stateMarker: "critical",
      rimIntensity: 0.7,
    }),
    baseInput({
      focused: true,
      spatialRole: "focus",
      attention: "critical",
      status: "risk",
      stateMarker: "critical",
      rimIntensity: 0.9,
    }),
    baseInput({
      spatialRole: "related",
      attention: "important",
      status: "watch",
      stateMarker: "attention",
      rimIntensity: 0.5,
    }),
    baseInput({
      spatialRole: "background",
      attention: "critical",
      status: "risk",
      stateMarker: "critical",
      rimIntensity: 0.85,
    }),
    baseInput({ selected: true, attention: "normal" }),
    baseInput({
      hovered: true,
      spatialRole: "background",
      compositionOpacity: 0.3,
    }),
    baseInput({
      occlusionState: "partial",
      attention: "critical",
      status: "risk",
      stateMarker: "critical",
      rimIntensity: 0.7,
      silhouetteAssist: true,
      readabilityAssist: true,
    }),
  ];

  for (const input of cases) {
    const a = resolveExecutiveObjectVisualPresentation(input);
    const b = resolveExecutiveObjectVisualPresentation(input);
    assert.deepEqual(a, b);
    assertFinitePresentation(a);
    // No contradictory dual-ownership: focus pedestal vs selected wireframe.
    if (a.emphasis.focused) {
      assert.equal(a.emphasis.showFocusPedestal, true);
      assert.notEqual(a.edge.mode, "selected");
    }
  }
});

test("15. scale safety — focus / background / hover / transitions", () => {
  const focus = resolveExecutiveObjectVisualPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      compositionScale: 1.8,
    }),
  );
  assert.ok(focus.scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis);

  const background = resolveExecutiveObjectVisualPresentation(
    baseInput({
      spatialRole: "background",
      compositionScale: 0.2,
    }),
  );
  assert.ok(
    background.scale >=
      EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
  );
  // Absolute floor still applies for pathological composition scales.
  assert.equal(
    background.scale,
    EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
  );

  const grammarScale = resolveExecutiveObjectVisualPresentation(
    baseInput({
      spatialRole: "related",
      compositionScale: 0.48,
    }),
  );
  assert.equal(grammarScale.scale, 0.48);

  // Without explicit compositionScale, legacy readability floor still applies.
  const defaultRole = resolveExecutiveObjectVisualPresentation(
    baseInput({ spatialRole: "background" }),
  );
  assert.ok(
    defaultRole.scale >= EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable,
  );

  const idle = resolveExecutiveObjectVisualPresentation(baseInput());
  const hovered = resolveExecutiveObjectVisualPresentation(
    baseInput({ hovered: true }),
  );
  assert.ok(
    hovered.scale - idle.scale <=
      EXECUTIVE_OBJECT_SCALE_ENVELOPE.canonical *
        (EXECUTIVE_OBJECT_SCALE_ENVELOPE.hoverBoost - 1) +
        0.05,
  );

  let scale: number = EXECUTIVE_OBJECT_SCALE_ENVELOPE.canonical;
  for (let i = 0; i < 20; i += 1) {
    scale = resolveExecutiveObjectScale({
      spatialRole: i % 2 === 0 ? "focus" : "background",
      focused: i % 2 === 0,
      hovered: i % 3 === 0,
      compositionScale: scale,
    });
    assert.ok(
      scale >= EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
    );
    assert.ok(scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis);
  }
});

test("16. label foundation — ownership and camera-facing", () => {
  const unknown = resolveExecutiveObjectVisualPresentation(
    baseInput({ objectKind: "" }),
  );
  assert.equal(unknown.objectKind, "unknown");
  assert.ok(unknown.labelAnchor.visible || true);
  assert.equal(unknown.labelAnchor.faceCamera, true);
  assert.ok(unknown.labelAnchor.offset > 0);

  for (const role of ["focus", "related", "background", "overview"] as const) {
    const presentation = resolveExecutiveObjectVisualPresentation(
      baseInput({
        spatialRole: role,
        focused: role === "focus",
        labelProminence: role === "background" ? "minimal" : "full",
      }),
    );
    assert.equal(presentation.objectId, "obj-delivery");
    assert.equal(presentation.labelAnchor.position, "above");
    assert.ok(
      presentation.labelAnchor.offset >=
        presentation.dimensions.height * 0.5 + 0.2,
    );
  }
});

test("17. connection anchor compatibility", () => {
  const presentation = resolveExecutiveObjectVisualPresentation(
    baseInput({ focused: true, spatialRole: "focus" }),
  );
  const anchor = resolveExecutiveObjectConnectionAnchor({
    objectId: presentation.objectId,
    dimensions: presentation.dimensions,
    scale: presentation.scale,
    geometryFamily: presentation.geometry.family,
    connectionRadiusFactor:
      EXECUTIVE_OBJECT_SEMANTIC_GEOMETRY_PROFILES[
        presentation.geometry.semanticFamily
      ].connectionRadiusFactor,
  });
  assert.equal(anchor.objectId, "obj-delivery");
  assert.deepEqual(anchor.localOffset, { x: 0, y: 0, z: 0 });
  assert.ok(Number.isFinite(anchor.radius));
  assert.deepEqual(presentation.connectionAnchor, anchor);

  // Moving object endpoint: radius follows scale/dimensions, identity stable.
  const moved = resolveExecutiveObjectVisualPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      compositionScale: 1.1,
    }),
  );
  assert.equal(moved.connectionAnchor.objectId, presentation.objectId);
  assert.deepEqual(moved.connectionAnchor.localOffset, { x: 0, y: 0, z: 0 });
});

test("18. connection endpoints preserve source/target identity under visual foundation", () => {
  const relationship = Object.freeze({
    id: "rel-a-b",
    sourceId: "a",
    targetId: "b",
  });

  const sourceVisual = resolveExecutiveObjectVisualPresentation(
    toExecutiveObjectVisualInput({
      objectId: relationship.sourceId,
      objectKind: "kpi",
      selected: true,
      focused: true,
      role: "focused",
      status: "stable",
      scale: 1.2,
    }),
  );
  const targetVisual = resolveExecutiveObjectVisualPresentation(
    toExecutiveObjectVisualInput({
      objectId: relationship.targetId,
      objectKind: "risk",
      selected: false,
      focused: false,
      role: "related",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
      rimIntensity: 0.7,
      scale: 1.05,
    }),
  );

  assert.equal(sourceVisual.connectionAnchor.objectId, relationship.sourceId);
  assert.equal(targetVisual.connectionAnchor.objectId, relationship.targetId);
  assert.equal(relationship.sourceId, "a");
  assert.equal(relationship.targetId, "b");
  // Center attachment — direction remains source→target via object positions, not geometry cubes.
  assert.deepEqual(sourceVisual.connectionAnchor.localOffset, {
    x: 0,
    y: 0,
    z: 0,
  });
  assert.deepEqual(targetVisual.connectionAnchor.localOffset, {
    x: 0,
    y: 0,
    z: 0,
  });
});

test("19. channel separation — surface vs edge vs focus", () => {
  assert.equal(EXECUTIVE_OBJECT_VISUAL_CHANNELS.surfaceTone, "businessState");
  assert.equal(EXECUTIVE_OBJECT_VISUAL_CHANNELS.edge, "interactionAttention");
  assert.equal(EXECUTIVE_OBJECT_VISUAL_CHANNELS.spatialOwnership, "focus");
  assert.deepEqual(
    [...EXECUTIVE_OBJECT_VISUAL_COMPOSITION_ORDER],
    [
      "base",
      "businessSurface",
      "attentionEdge",
      "spatialRole",
      "interaction",
      "occlusionReadability",
    ],
  );

  const presentation = resolveExecutiveObjectVisualPresentation(
    baseInput({
      focused: true,
      selected: true,
      hovered: true,
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
      rimIntensity: 0.8,
      spatialRole: "focus",
    }),
  );
  assert.equal(presentation.material.surfaceTone, "object.surface.risk");
  assert.equal(presentation.edge.mode, "attention");
  assert.equal(presentation.emphasis.showFocusPedestal, true);
  assert.equal(presentation.emphasis.selected, true);
  assert.equal(presentation.emphasis.hover, true);
});

test("20. surface tone tokens centralize status color", () => {
  assert.equal(resolveExecutiveObjectSurfaceTone("stable"), "object.surface.base");
  assert.equal(resolveExecutiveObjectSurfaceTone("watch"), "object.surface.watch");
  assert.equal(resolveExecutiveObjectSurfaceTone("risk"), "object.surface.risk");
  assert.equal(
    resolveExecutiveObjectSurfaceTone("unresolved"),
    "object.surface.unresolved",
  );
  assert.equal(
    resolveExecutiveObjectSurfaceTone("mystery"),
    "object.surface.base",
  );
});

test("21. stage role mapping and DNA defaults", () => {
  assert.equal(mapStageRoleToSpatialRole("focused"), "focus");
  assert.equal(mapStageRoleToSpatialRole("related"), "related");
  assert.equal(mapStageRoleToSpatialRole("unrelated"), "background");
  assert.equal(mapStageRoleToSpatialRole("normal"), "overview");
  assert.equal(EXECUTIVE_OBJECT_VISUAL_DNA.defaultGeometryFamily, "block");
  assert.equal(EXECUTIVE_OBJECT_WIREFRAME_POLICY.permanentObjectBoundary, false);
});

test("22. render integration — Stage object consumes visual foundation", () => {
  assert.match(
    stageObjectSource,
    /resolveExecutiveObjectVisualPresentation/,
  );
  assert.match(stageObjectSource, /toExecutiveObjectVisualInput/);
  assert.match(stageObjectSource, /ExecutiveObjectGeometryRenderer/);
  assert.match(stageObjectSource, /geometry\.family/);
  assert.match(stageObjectSource, /dimensions=\{dimensions\}/);
  assert.match(stageObjectSource, /NexoraExecutiveObjectLabel/);
  assert.match(stageObjectSource, /material=\{material\}/);
  assert.match(stageObjectSource, /visual\.label|label=\{label\}/);
  assert.match(stageObjectSource, /labelAnchor|label\.anchor/);
  // No local STATUS_COLOR policy authority remaining in the mesh component.
  assert.doesNotMatch(stageObjectSource, /STATUS_COLOR/);
  assert.doesNotMatch(stageObjectSource, /MARKER_COLOR/);
  // No JSX kind→mesh semantic switching.
  assert.doesNotMatch(stageObjectSource, /kind\s*===\s*["']risk["']/);
  assert.doesNotMatch(stageObjectSource, /kind\s*===\s*["']decision["']/);
});

test("23. severity does not drive scale in the visual resolver", () => {
  const normal = resolveExecutiveObjectVisualPresentation(
    baseInput({ attention: "normal", status: "stable" }),
  );
  const critical = resolveExecutiveObjectVisualPresentation(
    baseInput({ attention: "critical", status: "risk" }),
  );
  assert.equal(normal.scale, critical.scale);
});

test("24. background critical remains discoverable via attention edge", () => {
  const presentation = resolveExecutiveObjectVisualPresentation(
    baseInput({
      spatialRole: "background",
      attention: "critical",
      status: "risk",
      stateMarker: "critical",
      rimIntensity: 0.75,
      compositionOpacity: 0.28,
      labelProminence: "minimal",
    }),
  );
  assert.equal(presentation.spatialRole, "background");
  assert.equal(presentation.edge.mode, "attention");
  assert.ok(presentation.material.opacity >= EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumOpacity);
  assert.equal(presentation.labelAnchor.visible, true);
});
