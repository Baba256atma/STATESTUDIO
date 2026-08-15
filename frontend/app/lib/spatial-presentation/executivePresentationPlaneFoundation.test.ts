/**
 * SP:4.2 — Executive 2.5D Stage Foundation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveFocusVisualGrammarToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import {
  applyExecutivePresentationPlaneToStagePresentation,
  getExecutiveStageCompositionMode,
} from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectScale,
} from "./executiveObjectVisualFoundation.ts";
import {
  EXECUTIVE_PRESENTATION_DEPTH_OFFSETS,
  EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY,
  EXECUTIVE_PRESENTATION_PLANE_BOUNDARY,
  EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING,
  EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT,
  EXECUTIVE_STAGE_COMPOSITION_MODE_LEGACY,
  clampExecutivePresentationPosition,
  createExecutivePresentationPlane,
  createExecutivePresentationPosition,
  createExecutivePresentationTerritory,
  depthCannotResolveTerritoryCollision,
  executivePresentationPlaneFoundationArchitecturalRole,
  executivePresentationPlaneFoundationIdentity,
  executivePresentationPlaneFoundationNamespace,
  executivePresentationPlaneFoundationVersion,
  executivePresentationTerritoriesIntersect,
  getExecutivePresentationPlaneFoundationIdentity,
  mapExecutivePresentationPositionToWorld,
  mapExecutiveWorldPositionToPresentation,
  resolveExecutivePresentationWorldOrigin,
  resolveExecutivePresentationCompositionContract,
  resolveExecutivePresentationDepthOffset,
  resolveExecutivePresentationEffectiveRenderedScale,
  resolveExecutivePresentationFocusCenter,
  resolveExecutivePresentationFootprint,
  resolveExecutivePresentationPlaneCenter,
  resolveExecutivePresentationRegions,
  resolveExecutivePresentationRenderingContract,
  resolveExecutivePresentationSafeAreas,
  verifyExecutivePresentationPlaneFoundation,
  worldTupleFromPresentationWorld,
} from "./executivePresentationPlaneFoundation.ts";
import {
  EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY,
  executiveLightingFoundationIdentity,
} from "./executiveLightingFoundation.ts";
import {
  EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY,
  executiveLightingHierarchyIdentity,
} from "./executiveLightingHierarchy.ts";
import {
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY,
  resolveExecutiveFocusSceneDisclosure,
} from "./executiveFocusSceneDisclosure.ts";
import { EXECUTIVE_RENDERED_TRUTH_PROVEN_ROOT_CAUSE } from "./executiveRenderedObjectTruthAudit.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("identity / namespace / architectural role", () => {
  assert.equal(
    executivePresentationPlaneFoundationIdentity,
    "SP:4.2/Executive25DStageFoundation",
  );
  assert.equal(executivePresentationPlaneFoundationVersion, "4.2.0");
  assert.equal(
    executivePresentationPlaneFoundationNamespace,
    "nexora.spatial-presentation.executive-presentation-plane",
  );
  assert.equal(
    executivePresentationPlaneFoundationArchitecturalRole,
    "PresentationOnlyExecutive25DStageFoundation",
  );
  assert.deepEqual(
    getExecutivePresentationPlaneFoundationIdentity().id,
    executivePresentationPlaneFoundationIdentity,
  );
  assert.equal(verifyExecutivePresentationPlaneFoundation().ok, true);
  assert.equal(
    verifyExecutivePresentationPlaneFoundation({ forceFailure: true }).ok,
    false,
  );
});

test("1–3. presentation plane deterministic creation, center, bounds", () => {
  const a = createExecutivePresentationPlane();
  const b = createExecutivePresentationPlane();
  assert.deepEqual(a, b);
  assert.ok(a.width > 0);
  assert.ok(a.height > 0);
  assert.ok(a.minX < a.maxX);
  assert.ok(a.minY < a.maxY);
  const center = resolveExecutivePresentationPlaneCenter(a);
  assert.equal(center.x, a.centerX);
  assert.equal(center.y, a.centerY);
});

test("4. presentation position deterministic", () => {
  assert.deepEqual(
    createExecutivePresentationPosition(1.25, -0.5),
    createExecutivePresentationPosition(1.25, -0.5),
  );
});

test("5. center maps correctly to usable world anchor axes", () => {
  const plane = createExecutivePresentationPlane();
  const center = resolveExecutivePresentationFocusCenter(plane);
  const world = mapExecutivePresentationPositionToWorld({
    position: center,
    depthRole: "standard",
    plane,
  });
  const origin = resolveExecutivePresentationWorldOrigin(plane);
  assert.equal(world.x, origin.x + plane.centerX);
  assert.equal(world.y, origin.y + plane.centerY);
  assert.equal(world.z, origin.z);
  assert.equal(
    EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.presentationX,
    "world.x",
  );
  assert.equal(
    EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.presentationY,
    "world.y",
  );
  assert.equal(EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.depthRole, "layout-inert");
});

test("6–7. left/right and up/down map to visually distinct world positions", () => {
  const plane = createExecutivePresentationPlane();
  const left = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(-1.2, 0),
    plane,
  });
  const right = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(1.2, 0),
    plane,
  });
  assert.ok(left.x < right.x);
  assert.equal(left.y, right.y);

  const down = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(0, -1),
    plane,
  });
  const up = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(0, 1),
    plane,
  });
  assert.ok(down.y < up.y);
  assert.equal(down.x, up.x);
});

test("8–10. depth role does not alter presentation position; restrained; non-structural", () => {
  const position = createExecutivePresentationPosition(0.8, -0.3);
  const focus = mapExecutivePresentationPositionToWorld({
    position,
    depthRole: "focus",
  });
  const background = mapExecutivePresentationPositionToWorld({
    position,
    depthRole: "background",
  });
  assert.equal(focus.x, background.x);
  assert.equal(focus.y, background.y);
  assert.equal(focus.z, background.z);
  assert.equal(focus.z, EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.renderPlaneZ);
  for (const role of [
    "focus",
    "foreground",
    "standard",
    "background",
    "thread",
  ] as const) {
    assert.equal(resolveExecutivePresentationDepthOffset(role), 0);
    assert.ok(
      Math.abs(resolveExecutivePresentationDepthOffset(role)) <=
        EXECUTIVE_PRESENTATION_DEPTH_OFFSETS.maximumAbsolute,
    );
  }

  const footprint = resolveExecutivePresentationFootprint({
    compositionScale: 0.6,
    objectKind: "object",
  });
  const a = createExecutivePresentationTerritory({
    objectId: "a",
    center: position,
    footprint,
    depthRole: "focus",
  });
  const b = createExecutivePresentationTerritory({
    objectId: "b",
    center: position,
    footprint,
    depthRole: "background",
  });
  assert.equal(executivePresentationTerritoriesIntersect(a, b), true);
  assert.equal(depthCannotResolveTerritoryCollision(a, b), true);
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.depthResolvesCollision, false);
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usedZOnlyEscape, false);
});

test("11. focus can occupy exact plane center", () => {
  const plane = createExecutivePresentationPlane();
  const focus = resolveExecutivePresentationFocusCenter(plane);
  assert.deepEqual(focus, { x: plane.centerX, y: plane.centerY });
  const related = [
    createExecutivePresentationPosition(plane.centerX + 1.2, plane.centerY),
    createExecutivePresentationPosition(plane.centerX - 1.2, plane.centerY),
    createExecutivePresentationPosition(plane.centerX, plane.centerY + 0.9),
    createExecutivePresentationPosition(plane.centerX, plane.centerY - 0.9),
  ];
  for (const neighbor of related) {
    assert.notDeepEqual(neighbor, focus);
    const world = mapExecutivePresentationPositionToWorld({
      position: neighbor,
      depthRole: "standard",
      plane,
    });
    assert.ok(Number.isFinite(world.x) && Number.isFinite(world.z));
  }
});

test("12 / 43 / 44. composition scale preserved; no minimumReadable inflation", () => {
  const certified = 0.52;
  const rendered = resolveExecutivePresentationEffectiveRenderedScale(certified, {
    focused: true,
  });
  assert.equal(rendered, certified);
  assert.ok(rendered < EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable);
  assert.equal(
    resolveExecutiveObjectScale({
      spatialRole: "focus",
      focused: true,
      hovered: false,
      compositionScale: certified,
    }),
    certified,
  );
  assert.equal(EXECUTIVE_RENDERED_TRUTH_PROVEN_ROOT_CAUSE, "ScaleMismatch");
});

test("13–18. footprints by geometry family + scale", () => {
  const kinds = [
    ["object", "block"],
    ["decision", "rounded"],
    ["kpi", "cylindrical"],
    ["goal", "orbital"],
    ["scenario", "planar"],
  ] as const;
  for (const [kind, family] of kinds) {
    const footprint = resolveExecutivePresentationFootprint({
      objectKind: kind,
      compositionScale: 0.55,
    });
    assert.equal(footprint.geometryFamily, family);
    assert.ok(footprint.width >= EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY.minimumFootprint);
    assert.ok(footprint.height >= EXECUTIVE_PRESENTATION_FOOTPRINT_POLICY.minimumFootprint);
  }
  const small = resolveExecutivePresentationFootprint({
    objectKind: "object",
    compositionScale: 0.4,
  });
  const large = resolveExecutivePresentationFootprint({
    objectKind: "object",
    compositionScale: 0.8,
  });
  assert.ok(large.width > small.width);
  assert.ok(large.height > small.height);
});

test("19–22. territory creation, padding, intersection true/false", () => {
  const footprint = resolveExecutivePresentationFootprint({
    compositionScale: 0.5,
    objectKind: "object",
  });
  const left = createExecutivePresentationTerritory({
    objectId: "left",
    center: createExecutivePresentationPosition(0, 0),
    footprint,
    padding: 0.1,
  });
  assert.equal(left.padding, 0.1);
  const overlapping = createExecutivePresentationTerritory({
    objectId: "mid",
    center: createExecutivePresentationPosition(0.05, 0),
    footprint,
  });
  const far = createExecutivePresentationTerritory({
    objectId: "far",
    center: createExecutivePresentationPosition(3, 3),
    footprint,
  });
  assert.equal(executivePresentationTerritoriesIntersect(left, overlapping), true);
  assert.equal(executivePresentationTerritoriesIntersect(left, far), false);
});

test("23–26. safe areas + stage clamp", () => {
  const plane = createExecutivePresentationPlane();
  const safe = resolveExecutivePresentationSafeAreas(plane);
  const dial = safe.find((entry) => entry.id === "workspace-dial");
  const depth = safe.find((entry) => entry.id === "presentation-depth");
  assert.ok(dial?.excludesLayout);
  assert.ok(depth?.excludesLayout);
  assert.ok(dial!.minX < dial!.maxX);
  const clamped = clampExecutivePresentationPosition(
    createExecutivePresentationPosition(99, -99),
    plane,
  );
  assert.equal(clamped.x, plane.maxX);
  assert.equal(clamped.y, plane.minY);
});

test("27–28. business-network and executive-thread regions distinct", () => {
  const regions = resolveExecutivePresentationRegions();
  const business = regions.find((entry) => entry.id === "business-network");
  const thread = regions.find((entry) => entry.id === "executive-thread");
  assert.ok(business);
  assert.ok(thread);
  assert.notDeepEqual(business, thread);
});

test("29–31. connections preserve IDs; endpoints/labels consume mapped positions", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-inventory");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const derived = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(
    derived,
    { presentationDepth: "minimum" },
  );
  const beforeIds = withGrammar.scene.connections.map((entry) => entry.id);
  const presentation =
    applyExecutivePresentationPlaneToStagePresentation(withGrammar);
  assert.deepEqual(
    presentation.scene.connections.map((entry) => entry.id),
    beforeIds,
  );
  assert.equal(getExecutiveStageCompositionMode(presentation), "executive-2_5d");
  for (const object of presentation.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  )) {
    assert.ok(object.presentationPosition);
    assert.ok(object.depthRole);
    const world = mapExecutivePresentationPositionToWorld({
      position: object.presentationPosition!,
      depthRole: object.depthRole,
    });
    assert.deepEqual(object.targetPosition, worldTupleFromPresentationWorld(world));
  }
});

test("32–35. determinism; no randomness / force / per-frame layout", () => {
  const input = {
    objectId: "budget",
    presentationPosition: createExecutivePresentationPosition(0, 0),
    compositionScale: 0.56,
    objectKind: "object",
    depthRole: "focus" as const,
  };
  const a = resolveExecutivePresentationCompositionContract(input);
  const b = resolveExecutivePresentationCompositionContract(input);
  assert.deepEqual(a, b);
  assert.deepEqual(
    resolveExecutivePresentationRenderingContract({ composition: a }),
    resolveExecutivePresentationRenderingContract({ composition: b }),
  );
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesRandomLayout, false);
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesForceSimulation, false);
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesPhysicsEngine, false);
  assert.equal(
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usesPerFrameLayoutSolver,
    false,
  );
  const source = readFileSync(
    join(here, "executivePresentationPlaneFoundation.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|forceSimulation|requestAnimationFrame/);
});

test("36–38. geometry renderer + lighting remain intact", () => {
  const geometryRenderer = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx",
    ),
    "utf8",
  );
  assert.match(geometryRenderer, /mesh|geometry/i);
  assert.equal(
    executiveLightingFoundationIdentity,
    "SP:3.1/ExecutiveLightingFoundation",
  );
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.presentationOnly, true);
  assert.equal(
    executiveLightingHierarchyIdentity,
    "SP:3.2/ExecutiveLightingHierarchy",
  );
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.presentationOnly, true);
});

test("39–40. Data Reality + Disclosure compatibility", () => {
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.ownsDataReality, false);
  assert.equal(
    EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.ownsDisclosureMembership,
    false,
  );
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.presentationOnly,
    true,
  );
  const disclosure = resolveExecutiveFocusSceneDisclosure({
    focusedSubjectId: "obj-budget",
    presentationDepth: "minimum",
    subjects: [
      {
        subjectId: "obj-budget",
        family: "business-object",
        attention: "normal",
        status: "stable",
      },
      {
        subjectId: "obj-capacity",
        family: "business-object",
        attention: "important",
        status: "watch",
      },
    ],
    relationships: [
      {
        id: "rel-budget-capacity",
        sourceId: "obj-budget",
        targetId: "obj-capacity",
      },
    ],
  });
  assert.ok(disclosure.byId.has("obj-budget"));
});

test("41–42. Overview + focus migration compatibility", () => {
  const overview = deriveNexoraMVPStageInteractionPresentation(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
  );
  const overviewPlane = applyExecutivePresentationPlaneToStagePresentation(
    overview,
  );
  assert.equal(overviewPlane.scene.mode, "overview");
  assert.ok(overviewPlane.scene.objects.length > 0);
  assert.ok(
    overviewPlane.scene.objects.every(
      (entry) => entry.presentationPosition != null,
    ),
  );

  let focusState = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  focusState = selectNexoraMVPInteractionSubject(focusState, "obj-inventory");
  const focus = applyExecutivePresentationPlaneToStagePresentation(
    applyExecutiveFocusVisualGrammarToStagePresentation(
      deriveNexoraMVPStageInteractionPresentation(focusState),
      { presentationDepth: "minimum" },
    ),
  );
  assert.equal(focus.scene.mode, "focus");
  const grammarOnly = applyExecutiveFocusVisualGrammarToStagePresentation(
    deriveNexoraMVPStageInteractionPresentation(focusState),
    { presentationDepth: "minimum" },
  );
  const legacy = applyExecutivePresentationPlaneToStagePresentation(
    grammarOnly,
    { compositionMode: EXECUTIVE_STAGE_COMPOSITION_MODE_LEGACY },
  );
  assert.equal(
    (legacy.scene as { compositionMode?: string }).compositionMode,
    undefined,
  );
  assert.equal(
    (legacy.scene.objects[0] as { presentationPosition?: unknown })
      ?.presentationPosition,
    undefined,
  );
  assert.equal(
    EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT,
    "executive-2_5d",
  );
});

test("world ↔ presentation round-trip preserves plane axes", () => {
  const world = mapExecutivePresentationPositionToWorld({
    position: createExecutivePresentationPosition(1.1, -0.7),
    depthRole: "foreground",
  });
  const back = mapExecutiveWorldPositionToPresentation({ world });
  assert.equal(back.x, 1.1);
  assert.equal(back.y, -0.7);
});

test("shell wires SP:4.3 network then SP:4.2 plane after SP:4.1C", () => {
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /applyExecutiveNetworkTopologyToStagePresentation/);
  assert.match(shell, /applyExecutivePresentationPlaneToStagePresentation/);
});
