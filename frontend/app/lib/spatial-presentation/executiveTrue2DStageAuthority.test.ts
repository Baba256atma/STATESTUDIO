/**
 * SP:4.3B — Executive True-2D Stage Authority invariants.
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
  applyExecutiveNetworkTopologyToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import {
  applyExecutivePresentationPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY,
  executiveLightingFoundationIdentity,
} from "./executiveLightingFoundation.ts";
import {
  EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY,
  executiveLightingHierarchyIdentity,
} from "./executiveLightingHierarchy.ts";
import {
  EXECUTIVE_NETWORK_PRESENTATION_GAP,
  resolveExecutiveNetworkLayoutSafeAreas,
  resolveExecutiveNetworkTopology,
} from "./executiveNetworkTopology.ts";
import {
  EXECUTIVE_PRESENTATION_DEPTH_OFFSETS,
  EXECUTIVE_PRESENTATION_PLANE_BOUNDARY,
  EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING,
  EXECUTIVE_RENDER_PLANE_Z,
  createExecutive2DPosition,
  createExecutivePresentationPosition,
  executivePresentationTerritoriesIntersect,
  mapExecutive2DPositionToRenderWorld,
  mapExecutivePresentationPositionToWorld,
  resolveExecutivePresentationCompositionContract,
  resolveExecutivePresentationDepthOffset,
  resolveExecutivePresentationEffectiveRenderedScale,
  resolveExecutivePresentationFootprint,
} from "./executivePresentationPlaneFoundation.ts";
import {
  resolveExecutiveObjectGeometryFamily,
} from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_TRUE_2D_STAGE_BOUNDARY,
  EXECUTIVE_TRUE_2D_STAGE_LAW,
  executiveTrue2DStageAuthorityIdentity,
  executiveTrue2DStageAuthorityVersion,
  getExecutiveTrue2DStageAuthorityIdentity,
} from "./executiveTrue2DStageAuthority.ts";
import {
  projectExecutiveUsableStageAnchorToNdc,
} from "./executiveUsableStageViewport.ts";
import {
  DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT,
  EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
} from "./executiveCameraFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));

function focusPipeline(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  return applyExecutivePresentationPlaneToStagePresentation(
    applyExecutiveNetworkTopologyToStagePresentation(
      applyExecutiveFocusVisualGrammarToStagePresentation(
        deriveNexoraMVPStageInteractionPresentation(state),
        { presentationDepth: "minimum" },
      ),
    ),
  );
}

function overviewPipeline() {
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  return applyExecutivePresentationPlaneToStagePresentation(
    applyExecutiveNetworkTopologyToStagePresentation(
      applyExecutiveFocusVisualGrammarToStagePresentation(
        deriveNexoraMVPStageInteractionPresentation(state),
        { presentationDepth: "minimum" },
      ),
    ),
  );
}

function territoryGap2D(
  left: {
    readonly center: { readonly x: number; readonly y: number };
    readonly width: number;
    readonly height: number;
    readonly padding: number;
  },
  right: {
    readonly center: { readonly x: number; readonly y: number };
    readonly width: number;
    readonly height: number;
    readonly padding: number;
  },
): number {
  const a = {
    minX: left.center.x - left.width / 2 - left.padding,
    maxX: left.center.x + left.width / 2 + left.padding,
    minY: left.center.y - left.height / 2 - left.padding,
    maxY: left.center.y + left.height / 2 + left.padding,
  };
  const b = {
    minX: right.center.x - right.width / 2 - right.padding,
    maxX: right.center.x + right.width / 2 + right.padding,
    minY: right.center.y - right.height / 2 - right.padding,
    maxY: right.center.y + right.height / 2 + right.padding,
  };
  const gapX =
    a.maxX < b.minX
      ? b.minX - a.maxX
      : b.maxX < a.minX
        ? a.minX - b.maxX
        : 0;
  const gapY =
    a.maxY < b.minY
      ? b.minY - a.maxY
      : b.maxY < a.minY
        ? a.minY - b.maxY
        : 0;
  if (gapX === 0 && gapY === 0) return 0;
  if (gapX === 0) return gapY;
  if (gapY === 0) return gapX;
  return Math.hypot(gapX, gapY);
}

test("identity / law", () => {
  assert.equal(
    executiveTrue2DStageAuthorityIdentity,
    "SP:4.3B/ExecutiveTrue2DStageAuthority",
  );
  assert.equal(executiveTrue2DStageAuthorityVersion, "4.3.2");
  assert.equal(
    getExecutiveTrue2DStageAuthorityIdentity().id,
    executiveTrue2DStageAuthorityIdentity,
  );
  assert.equal(EXECUTIVE_TRUE_2D_STAGE_LAW.layoutPositionShape, "{x,y}");
  assert.equal(EXECUTIVE_TRUE_2D_STAGE_BOUNDARY.depthRolePositionEffect, 0);
});

test("1. active topology position has only {x,y} authority", () => {
  const presentation = focusPipeline("obj-delivery");
  for (const object of presentation.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  )) {
    assert.ok(object.presentationPosition);
    assert.equal(
      Object.keys(object.presentationPosition!).sort().join(","),
      "x,y",
    );
  }
  assert.equal(
    EXECUTIVE_PRESENTATION_WORLD_AXIS_MAPPING.depthRole,
    "layout-inert",
  );
});

test("2. all Stage nodes share constant render-plane depth", () => {
  const presentation = focusPipeline("obj-delivery");
  const zs = presentation.scene.objects
    .filter((entry) => entry.disclosureState !== "hidden")
    .map((entry) => entry.targetPosition[2]);
  assert.ok(zs.length > 0);
  for (const z of zs) {
    assert.equal(z, EXECUTIVE_RENDER_PLANE_Z);
  }
  const contextZs = presentation.contextNodes
    .filter((entry) => entry.disclosureState !== "hidden")
    .map((entry) => entry.targetPosition[2]);
  for (const z of contextZs) {
    assert.equal(z, EXECUTIVE_RENDER_PLANE_Z);
  }
});

test("3. depthRole cannot change node position", () => {
  const position = createExecutive2DPosition(0.7, -0.4);
  const roles = [
    "focus",
    "foreground",
    "standard",
    "background",
    "thread",
  ] as const;
  const worlds = roles.map((depthRole) =>
    mapExecutivePresentationPositionToWorld({ position, depthRole }),
  );
  for (const world of worlds) {
    assert.deepEqual(world, worlds[0]);
    assert.equal(world.z, EXECUTIVE_RENDER_PLANE_Z);
  }
  assert.equal(EXECUTIVE_PRESENTATION_DEPTH_OFFSETS.positionEffect, 0);
  assert.equal(resolveExecutivePresentationDepthOffset("focus"), 0);
  assert.equal(resolveExecutivePresentationDepthOffset("thread"), 0);
});

test("4. legacy topology Z cannot change node position", () => {
  const bridge = readFileSync(
    join(here, "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts"),
    "utf8",
  );
  assert.match(bridge, /presentationPosition != null/);
  const withNative = resolveExecutivePresentationCompositionContract({
    objectId: "legacy-z-probe",
    presentationPosition: createExecutivePresentationPosition(0.5, 0.25),
    compositionScale: 0.5,
  });
  const mapped = mapExecutive2DPositionToRenderWorld({
    position: withNative.presentationPosition,
  });
  // Poisoned legacy XYZ must not alter 2D→world result.
  const poisoned = mapExecutive2DPositionToRenderWorld({
    position: createExecutive2DPosition(0.5, 0.25),
    worldOrigin: { x: mapped.x - 0.5, y: mapped.y - 0.25, z: 99 },
  });
  assert.equal(poisoned.z, EXECUTIVE_RENDER_PLANE_Z);
  assert.notEqual(poisoned.z, 99);
  assert.equal(EXECUTIVE_TRUE_2D_STAGE_BOUNDARY.legacyXyzActiveAuthority, false);
});

test("5–10. focus {0,0} maps to usable center for Delivery/Budget/Inventory/Revenue/Capacity", () => {
  const projected = projectExecutiveUsableStageAnchorToNdc();
  assert.equal(projected.withinTolerance, true);

  for (const id of [
    "obj-delivery",
    "obj-budget",
    "obj-inventory",
    "obj-revenue",
    "obj-capacity",
  ]) {
    const presentation = focusPipeline(id);
    const focus = presentation.scene.objects.find((entry) => entry.id === id);
    assert.ok(focus, id);
    assert.equal(focus!.presentationPosition?.x, 0, id);
    assert.equal(focus!.presentationPosition?.y, 0, id);
    const expected = mapExecutive2DPositionToRenderWorld({
      position: createExecutive2DPosition(0, 0),
    });
    assert.equal(focus!.targetPosition[0], expected.x, id);
    assert.equal(focus!.targetPosition[1], expected.y, id);
    assert.equal(focus!.targetPosition[2], EXECUTIVE_RENDER_PLANE_Z, id);
  }
});

test("11. Overview remains network topology", () => {
  const presentation = overviewPipeline();
  assert.equal(presentation.scene.mode, "overview");
  assert.equal(presentation.scene.topologyKind, "executive-network");
  assert.equal(presentation.scene.focusedObjectId, null);
});

test("12–13. 2D territories do not overlap; minimum gap preserved", () => {
  const presentation = focusPipeline("obj-delivery");
  const visible = presentation.scene.objects.filter(
    (entry) =>
      entry.disclosureState !== "hidden" && entry.presentationPosition != null,
  );
  const territories = visible.map((entry) =>
    resolveExecutivePresentationCompositionContract({
      objectId: entry.id,
      presentationPosition: entry.presentationPosition!,
      compositionScale: entry.scale,
      objectKind: entry.kind,
      depthRole: entry.depthRole ?? "standard",
      region: entry.presentationRegion,
    }).territory,
  );
  for (let i = 0; i < territories.length; i += 1) {
    for (let j = i + 1; j < territories.length; j += 1) {
      const left = territories[i]!;
      const right = territories[j]!;
      assert.equal(
        executivePresentationTerritoriesIntersect(left, right),
        false,
        `${left.objectId}∩${right.objectId}`,
      );
      assert.ok(
        territoryGap2D(left, right) >=
          EXECUTIVE_NETWORK_PRESENTATION_GAP.minimumSurfaceGap - 1e-6,
        `gap ${left.objectId}/${right.objectId}`,
      );
    }
  }
});

test("14. no Z collision escape exists", () => {
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.usedZOnlyEscape, false);
  assert.equal(EXECUTIVE_PRESENTATION_PLANE_BOUNDARY.depthResolvesCollision, false);
  assert.equal(EXECUTIVE_TRUE_2D_STAGE_BOUNDARY.zCollisionEscapeForbidden, true);
  const source = readFileSync(
    join(here, "executivePresentationPlaneFoundation.ts"),
    "utf8",
  );
  assert.match(source, /positionEffect: 0/);
  assert.doesNotMatch(
    source,
    /collision[\s\S]{0,80}depthOffset|zOnlyEscape\s*=\s*true/,
  );
});

test("15. safe areas operate in 2D", () => {
  const areas = resolveExecutiveNetworkLayoutSafeAreas();
  for (const area of areas) {
    assert.ok("minX" in area && "maxX" in area && "minY" in area && "maxY" in area);
    assert.equal("minZ" in area, false);
  }
});

test("16. connections use final 2D endpoints", () => {
  const presentation = focusPipeline("obj-delivery");
  const byId = new Map<
    string,
    {
      readonly presentationPosition?: Readonly<{ readonly x: number; readonly y: number }>;
      readonly targetPosition: readonly [number, number, number];
    }
  >();
  for (const entry of presentation.scene.objects) {
    byId.set(entry.id, entry);
  }
  for (const entry of presentation.contextNodes) {
    byId.set(entry.id, entry);
  }
  for (const connection of presentation.scene.connections.filter(
    (entry) => entry.visualRole !== "hidden",
  )) {
    const source = byId.get(connection.sourceId);
    const target = byId.get(connection.targetId);
    if (!source || !target) continue;
    assert.ok(source.presentationPosition);
    assert.ok(target.presentationPosition);
    assert.equal(source.targetPosition[2], EXECUTIVE_RENDER_PLANE_Z);
    assert.equal(target.targetPosition[2], EXECUTIVE_RENDER_PLANE_Z);
  }
  const connectionsSource = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageConnections.tsx"),
    "utf8",
  );
  assert.match(connectionsSource, /targetPosition/);
});

test("17. canonical relationships unchanged", () => {
  const edges = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
    Object.freeze({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    }),
  );
  assert.equal(
    edges.some(
      (edge) =>
        String(edge.sourceId) === "obj-delivery" &&
        String(edge.targetId) === "obj-budget",
    ),
    false,
  );
  const topology = resolveExecutiveNetworkTopology({
    nodes: [
      {
        objectId: "obj-delivery",
        compositionScale: 0.55,
        disclosureState: "visible-primary",
      },
      {
        objectId: "obj-capacity",
        compositionScale: 0.5,
        disclosureState: "visible-related",
      },
    ],
    edges,
    anchorObjectId: "obj-delivery",
  });
  assert.equal(topology.positions["obj-delivery"]?.x, 0);
  assert.equal(topology.positions["obj-delivery"]?.y, 0);
});

test("18. compositionScale truth preserved", () => {
  const presentation = focusPipeline("obj-budget");
  for (const object of presentation.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  )) {
    assert.equal(
      resolveExecutivePresentationEffectiveRenderedScale(object.scale, {
        focused: object.focused,
      }),
      object.scale,
    );
  }
});

test("19. SP:3 lighting unaffected", () => {
  assert.equal(
    executiveLightingFoundationIdentity,
    "SP:3.1/ExecutiveLightingFoundation",
  );
  assert.equal(
    executiveLightingHierarchyIdentity,
    "SP:3.2/ExecutiveLightingHierarchy",
  );
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsBusinessTruth, false);
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsBusinessTruth, false);
});

test("20. geometry remains 3D", () => {
  for (const kind of ["object", "metric", "decision", "insight"]) {
    const family = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    assert.ok(family.dimensions.width > 0);
    assert.ok(family.dimensions.height > 0);
    assert.ok(family.dimensions.depth > 0);
  }
  const footprint = resolveExecutivePresentationFootprint({
    compositionScale: 0.55,
    objectKind: "object",
  });
  assert.ok(footprint.geometryFamily);
});

test("21. deterministic identical input → identical layout", () => {
  const a = focusPipeline("obj-inventory");
  const b = focusPipeline("obj-inventory");
  assert.deepEqual(
    a.scene.objects.map((entry) => entry.targetPosition),
    b.scene.objects.map((entry) => entry.targetPosition),
  );
  assert.deepEqual(
    a.scene.objects.map((entry) => entry.presentationPosition),
    b.scene.objects.map((entry) => entry.presentationPosition),
  );
});

test("22. animation destination uses final 2D mapped position", () => {
  const presentation = focusPipeline("obj-delivery");
  const delivery = presentation.scene.objects.find(
    (entry) => entry.id === "obj-delivery",
  )!;
  const mapped = mapExecutive2DPositionToRenderWorld({
    position: createExecutive2DPosition(0, 0),
  });
  assert.deepEqual(delivery.targetPosition, [mapped.x, mapped.y, mapped.z]);
  assert.equal(mapped.z, EXECUTIVE_RENDER_PLANE_Z);
});

test("camera supports 2D mental model (restrained angle)", () => {
  assert.ok(
    EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth <= (12 * Math.PI) / 180,
  );
  assert.ok(
    EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.defaultElevation <=
      (22 * Math.PI) / 180,
  );
  assert.ok(DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT.elevation <= (18 * Math.PI) / 180);
  assert.equal(EXECUTIVE_TRUE_2D_STAGE_BOUNDARY.freeOrbit, false);
  assert.equal(EXECUTIVE_TRUE_2D_STAGE_BOUNDARY.cameraIsTopology, false);
});
