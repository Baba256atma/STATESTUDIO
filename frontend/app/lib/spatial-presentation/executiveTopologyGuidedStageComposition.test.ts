/**
 * SP:4.1 — Topology-Guided Executive Stage Composition tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { resolveNexoraMVPStageScenePresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  resolveExecutiveLightingEmphasis,
} from "./executiveLightingHierarchy.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
} from "./executiveSpatialComposition.ts";
import {
  EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY,
  EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY,
  EXECUTIVE_TOPOLOGY_STAGE_LAYOUT,
  calibrateExecutiveTopologyStagePositions,
  executiveTopologyGuidedStageCompositionArchitecturalRole,
  executiveTopologyGuidedStageCompositionIdentity,
  executiveTopologyGuidedStageCompositionNamespace,
  executiveTopologyGuidedStageCompositionVersion,
  getExecutiveTopologyGuidedStageCompositionIdentity,
  resolveExecutiveTopologyFlowOrder,
  resolveExecutiveTopologyGuidedStageComposition,
  selectExecutiveTopologyType,
  verifyExecutiveTopologyGuidedStageComposition,
} from "./executiveTopologyGuidedStageComposition.ts";

const source = readFileSync(
  new URL("./executiveTopologyGuidedStageComposition.ts", import.meta.url),
  "utf8",
);

const stageSource = readFileSync(
  new URL("../nex-mvp/nexora3DExecutiveStage.ts", import.meta.url),
  "utf8",
);

function fixtureObjects() {
  return NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) =>
    Object.freeze({
      objectId: object.id,
      label: object.label,
      attention: object.attention,
      status: object.status,
    }),
  );
}

function fixtureRelationships() {
  return NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((relationship) =>
    Object.freeze({
      id: relationship.id,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
    }),
  );
}

function isFinitePosition(position: {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}): boolean {
  return (
    Number.isFinite(position.x) &&
    Number.isFinite(position.y) &&
    Number.isFinite(position.z)
  );
}

test("1. deterministic flow topology", () => {
  const input = Object.freeze({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: null,
    topologyType: "flow" as const,
  });
  const a = resolveExecutiveTopologyGuidedStageComposition(input);
  const b = resolveExecutiveTopologyGuidedStageComposition(input);
  assert.equal(a.topology, "flow");
  assert.deepEqual(a.positions, b.positions);
  assert.deepEqual(a.flowOrder, b.flowOrder);
});

test("2. deterministic hub topology", () => {
  const input = Object.freeze({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-revenue",
    topologyType: "hub" as const,
  });
  const a = resolveExecutiveTopologyGuidedStageComposition(input);
  const b = resolveExecutiveTopologyGuidedStageComposition(input);
  assert.equal(a.topology, "hub");
  assert.deepEqual(a.positions, b.positions);
  assert.equal(a.hubAnchorObjectId, "obj-revenue");
});

test("3. focused object becomes hub anchor", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-capacity",
    topologyType: "auto",
  });
  assert.equal(result.topology, "hub");
  assert.equal(result.hubAnchorObjectId, "obj-capacity");
  assert.equal(result.flowOrder[0], "obj-capacity");
  const anchor = result.byId.get("obj-capacity")!;
  assert.equal(anchor.depthRole, "primary");
  assert.deepEqual(anchor.tuple, [
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.x,
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.y,
    0,
  ]);
});

test("4. only canonical relationships used", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-delivery",
  });
  assert.equal(
    result.canonicalConnections.length,
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.length,
  );
  for (const connection of result.canonicalConnections) {
    assert.ok(
      NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
        (fixture) => fixture.id === connection.id,
      ),
    );
  }
  assert.ok(result.relatedObjectIds.includes("obj-capacity"));
  assert.ok(result.relatedObjectIds.includes("obj-customer"));
  assert.ok(result.relatedObjectIds.includes("obj-risk"));
  assert.ok(result.relatedObjectIds.includes("obj-demand"));
  assert.equal(result.relatedObjectIds.includes("obj-budget"), false);
});

test("5. no invented edges", () => {
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.inventsEdges, false);
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-revenue",
  });
  // Revenue and Capacity are not directly connected in fixtures.
  assert.equal(
    result.canonicalConnections.some(
      (connection) =>
        (connection.sourceId === "obj-revenue" &&
          connection.targetId === "obj-capacity") ||
        (connection.sourceId === "obj-capacity" &&
          connection.targetId === "obj-revenue"),
    ),
    false,
  );
  assert.doesNotMatch(source, /fabricateRelationship|synthesizeEdge|inventCanonicalEdge/);
});

test("6. stable object IDs", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-delivery",
  });
  const ids = result.positions.map((entry) => entry.objectId).sort();
  assert.deepEqual(
    ids,
    [...NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) => object.id)].sort(),
  );
  for (const entry of result.positions) {
    assert.equal(entry.topologyNodeId, entry.objectId);
  }
});

test("7. auto selects hub when focus exists", () => {
  const selection = selectExecutiveTopologyType({
    focusedObjectId: "obj-revenue",
    objectIds: fixtureObjects().map((object) => object.objectId),
    requested: "auto",
  });
  assert.equal(selection.topology, "hub");
  assert.equal(selection.autoSelected, true);
  assert.match(selection.selectionReason, /hub/);
});

test("8. auto selects flow for eligible Overview", () => {
  const selection = selectExecutiveTopologyType({
    focusedObjectId: null,
    objectIds: fixtureObjects().map((object) => object.objectId),
    requested: "auto",
  });
  assert.equal(selection.topology, "flow");
  assert.equal(selection.autoSelected, true);
  assert.match(selection.selectionReason, /flow/);
});

test("9. topology positions are finite", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-delivery",
  });
  for (const entry of result.positions) {
    assert.ok(isFinitePosition(entry.position));
    assert.ok(entry.tuple.every((value) => Number.isFinite(value)));
  }
});

test("10. bounded Z depth", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-revenue",
  });
  const bounds = EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  for (const entry of result.positions) {
    assert.ok(entry.position.z >= bounds.minZ - 0.001);
    assert.ok(entry.position.z <= bounds.maxZ + 0.001);
    assert.ok(entry.position.x >= bounds.minX - 0.001);
    assert.ok(entry.position.x <= bounds.maxX + 0.001);
  }
  const zs = result.positions.map((entry) => entry.position.z);
  assert.ok(
    Math.max(...zs) - Math.min(...zs) <=
      bounds.maxZ - bounds.minZ + 0.001,
  );
});

test("11. no duplicate node positions under normal supported fixtures", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: null,
  });
  const keys = result.positions.map(
    (entry) =>
      `${entry.position.x.toFixed(4)}:${entry.position.y.toFixed(4)}:${entry.position.z.toFixed(4)}`,
  );
  assert.equal(new Set(keys).size, keys.length);
});

test("12. topology result stable across identical input", () => {
  const input = Object.freeze({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-capacity" as string | null,
    topologyType: "auto" as const,
  });
  const a = resolveExecutiveTopologyGuidedStageComposition(input);
  const b = resolveExecutiveTopologyGuidedStageComposition(input);
  assert.equal(JSON.stringify(a.positions), JSON.stringify(b.positions));
  assert.equal(a.generatedAt, 0);
  assert.equal(b.generatedAt, 0);
  assert.doesNotMatch(source, /Math\.random|performance\.now/);
});

test("13. flow ordering preserved", () => {
  const order = resolveExecutiveTopologyFlowOrder({
    objectIds: ["revenue", "capacity", "delivery", "customer"],
    relationships: [
      { id: "1", sourceId: "capacity", targetId: "delivery" },
      { id: "2", sourceId: "delivery", targetId: "customer" },
      { id: "3", sourceId: "customer", targetId: "revenue" },
    ],
  });
  assert.ok(order.indexOf("capacity") < order.indexOf("delivery"));
  assert.ok(order.indexOf("delivery") < order.indexOf("customer"));
  assert.ok(order.indexOf("customer") < order.indexOf("revenue"));

  const flow = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: null,
    topologyType: "flow",
  });
  const again = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: null,
    topologyType: "flow",
  });
  assert.deepEqual(flow.flowOrder, again.flowOrder);
  assert.ok(flow.flowOrder.length === fixtureObjects().length);
});

test("14. hub anchor preserved after calibration", () => {
  const result = resolveExecutiveTopologyGuidedStageComposition({
    objects: fixtureObjects(),
    relationships: fixtureRelationships(),
    focusedObjectId: "obj-delivery",
  });
  const before = result.byId.get("obj-delivery")!.position;
  const calibrated = calibrateExecutiveTopologyStagePositions({
    positions: new Map(
      result.positions.map((entry) => [entry.objectId, entry.position]),
    ),
    orderedObjectIds: result.flowOrder,
    hubAnchorObjectId: "obj-delivery",
  });
  assert.deepEqual(calibrated.get("obj-delivery"), before);
});

test("15. existing lighting hierarchy unaffected", () => {
  const lighting = resolveExecutiveLightingEmphasis({
    objectId: "obj-revenue",
    focused: true,
    attention: "elevated",
  });
  assert.equal(lighting.level, "primary");
  assert.equal(
    lighting.strength,
    EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength,
  );
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.replacesSp32LightingHierarchy,
    false,
  );
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.replacesSp31Lighting,
    false,
  );
});

test("16. Data Reality unchanged", () => {
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.ownsDataReality,
    false,
  );
  assert.doesNotMatch(
    source,
    /resolveDataReality|mutateDataReality|from\s+["'].*data-reality/,
  );
});

test("17. focus/attention state unchanged", () => {
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.ownsFocusSemantics,
    false,
  );
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.ownsAttentionSemantics,
    false,
  );
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-delivery",
    focusedObjectId: "obj-delivery",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const focused = scene.objects.find((entry) => entry.id === "obj-delivery")!;
  assert.equal(focused.focused, true);
  assert.equal(focused.attention, "important");
  assert.equal(focused.role, "focused");
});

test("18. Stage relationship semantics unchanged", () => {
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-delivery",
    focusedObjectId: "obj-delivery",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(
    scene.connections.length,
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.length,
  );
  assert.ok(
    scene.connections.every((connection) =>
      NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
        (fixture) => fixture.id === connection.id,
      ),
    ),
  );
  const emphasized = scene.connections.filter((entry) => entry.emphasized);
  assert.ok(
    emphasized.every(
      (entry) =>
        entry.sourceId === "obj-delivery" || entry.targetId === "obj-delivery",
    ),
  );
});

test("19. performance/bounded-complexity invariant", () => {
  assert.equal(EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.usesForceSimulation, false);
  assert.equal(EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.usesPhysicsEngine, false);
  assert.equal(EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.perFrameRecalculation, false);
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.activatesRingClusterHybrid,
    false,
  );
  assert.ok(EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.maximumLayoutPasses <= 4);
  assert.doesNotMatch(source, /d3-force|from\s+["']cannon|from\s+["']@dimforge\/rapier/);
});

test("20. compatibility with existing Stage fixtures", () => {
  const identity = getExecutiveTopologyGuidedStageCompositionIdentity();
  assert.equal(
    executiveTopologyGuidedStageCompositionIdentity,
    "SP:4.1/TopologyGuidedExecutiveStageComposition",
  );
  assert.equal(identity.version, "4.1.0");
  assert.equal(
    executiveTopologyGuidedStageCompositionNamespace,
    "nexora.spatial-presentation.topology-guided-stage",
  );
  assert.equal(
    executiveTopologyGuidedStageCompositionArchitecturalRole,
    "PresentationOnlyTopologyGuidedExecutiveStageComposition",
  );
  assert.equal(executiveTopologyGuidedStageCompositionVersion, "4.1.0");

  const overview = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(overview.mode, "overview");
  assert.equal(overview.objects.length, 8);
  assert.match(stageSource, /resolveExecutiveTopologyGuidedStageComposition/);

  const focused = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: "obj-delivery",
    focusedObjectId: "obj-delivery",
    presentationState: "report",
    environmentIntent: "investigate",
  });
  const delivery = focused.objects.find((entry) => entry.id === "obj-delivery")!;
  assert.deepEqual(delivery.targetPosition, [
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.x,
    EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.hubAnchor.y,
    0,
  ]);

  assert.equal(verifyExecutiveTopologyGuidedStageComposition().ok, true);
});
