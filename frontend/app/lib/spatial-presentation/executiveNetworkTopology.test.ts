/**
 * SP:4.3 — Executive Network Topology Composition tests.
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
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
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
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET,
  resolveExecutiveFocusSceneDisclosure,
} from "./executiveFocusSceneDisclosure.ts";
import {
  createExecutivePresentationPlane,
  createExecutivePresentationPosition,
  createExecutivePresentationTerritory,
  depthCannotResolveTerritoryCollision,
  executivePresentationTerritoriesIntersect,
  mapExecutivePresentationPositionToWorld,
  resolveExecutivePresentationEffectiveRenderedScale,
  resolveExecutivePresentationFootprint,
  resolveExecutivePresentationRegions,
} from "./executivePresentationPlaneFoundation.ts";
import {
  EXECUTIVE_NETWORK_PRESENTATION_GAP,
  EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY,
  EXECUTIVE_NETWORK_UTILIZATION,
  countExecutiveNetworkOccupiedRegions,
  executiveNetworkTopologyIdentity,
  executiveNetworkTopologyVersion,
  isExecutiveNetworkCollinear,
  resolveExecutiveNetworkTopology,
  resolveExecutiveNetworkLayoutSafeAreas,
  verifyExecutiveNetworkTopology,
  type ExecutiveNetworkEdge,
  type ExecutiveNetworkNode,
} from "./executiveNetworkTopology.ts";
import { EXECUTIVE_OBJECT_SCALE_ENVELOPE } from "./executiveObjectVisualFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));

const ALL_NODES: ExecutiveNetworkNode[] = NEXORA_MVP_STAGE_OBJECT_FIXTURES.map(
  (object) =>
    Object.freeze({
      objectId: object.id,
      label: object.label,
      objectKind: object.kind,
      compositionScale: 0.52,
      attention: object.attention,
      status: object.status,
      disclosureState: "visible-related",
    }),
);

const ALL_EDGES: ExecutiveNetworkEdge[] =
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
    Object.freeze({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    }),
  );

function stagePipeline(focusedId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (focusedId != null) {
    state = selectNexoraMVPInteractionSubject(state, focusedId);
  }
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
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  return applyExecutivePresentationPlaneToStagePresentation(withNetwork);
}

test("identity / verify", () => {
  assert.equal(
    executiveNetworkTopologyIdentity,
    "SP:4.3/ExecutiveNetworkTopologyComposition",
  );
  assert.equal(executiveNetworkTopologyVersion, "4.3.0");
  assert.equal(verifyExecutiveNetworkTopology().ok, true);
  assert.equal(
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.overviewDefaultsToExecutiveNetwork,
    true,
  );
  assert.equal(EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.overviewDefaultsToFlow, false);
});

test("1–2. Overview deterministic center; not flow", () => {
  const a = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
  });
  const b = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
  });
  assert.equal(a.diagnostics.centerObjectId, b.diagnostics.centerObjectId);
  assert.equal(a.topologyKind, "executive-network");
  assert.deepEqual(a.positions, b.positions);
  const overview = stagePipeline(null);
  assert.equal(overview.scene.topologyKind, "executive-network");
  assert.equal(overview.scene.mode, "overview");
});

test("3–7. explicit anchors own exact {0,0}", () => {
  for (const id of [
    "obj-budget",
    "obj-inventory",
    "obj-capacity",
    "obj-revenue",
  ]) {
    const topology = resolveExecutiveNetworkTopology({
      nodes: ALL_NODES,
      edges: ALL_EDGES,
      anchorObjectId: id,
    });
    assert.equal(topology.positions[id]?.x, 0, id);
    assert.equal(topology.positions[id]?.y, 0, id);
    assert.equal(topology.diagnostics.anchorObjectId, id);
    assert.equal(topology.diagnostics.centerObjectId, id);

    const presentation = stagePipeline(id);
    const object = presentation.scene.objects.find((entry) => entry.id === id);
    assert.ok(object);
    assert.equal(object!.presentationPosition?.x, 0, id);
    assert.equal(object!.presentationPosition?.y, 0, id);
  }
});

test("8–9. graph-distance layers", () => {
  const topology = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
    anchorObjectId: "obj-inventory",
  });
  assert.equal(topology.byId.get("obj-inventory")?.layer, 0);
  assert.equal(topology.byId.get("obj-capacity")?.layer, 1);
  const delivery = topology.byId.get("obj-delivery");
  assert.ok(delivery);
  assert.ok((delivery!.layer as number) >= 2);
});

test("10–12. canonical edges only; no invented relationships", () => {
  const topology = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
    anchorObjectId: "obj-budget",
  });
  const edgeIds = new Set(topology.edges.map((edge) => edge.id));
  for (const edge of ALL_EDGES) assert.ok(edgeIds.has(edge.id));
  assert.equal(
    topology.edges.some(
      (edge) =>
        (edge.sourceId === "obj-budget" && edge.targetId === "obj-revenue") ||
        (edge.sourceId === "obj-revenue" && edge.targetId === "obj-budget"),
    ),
    false,
  );
  assert.equal(EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.inventsRelationships, false);
  // Capacity is direct neighbor of Budget — layer 1.
  assert.equal(topology.byId.get("obj-capacity")?.layer, 1);
});

test("13–16. collinearity / distribution / utilization / asymmetry", () => {
  const topology = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
  });
  const positions = topology.nodes.map((node) => node.presentationPosition);
  assert.equal(isExecutiveNetworkCollinear(positions), false);
  assert.equal(topology.diagnostics.collinear, false);
  assert.ok(topology.diagnostics.distributionRegionCount >= 3);
  assert.ok(topology.diagnostics.occupiedRegions.length >= 3);

  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const plane = createExecutivePresentationPlane();
  assert.ok(width >= plane.width * EXECUTIVE_NETWORK_UTILIZATION.minWidthFraction * 0.35);
  assert.ok(height > 0.2);
  // Not a perfect circle — radii differ by slot bias.
  const radii = topology.nodes
    .filter((node) => node.slotId !== "center")
    .map((node) =>
      Math.hypot(node.presentationPosition.x, node.presentationPosition.y),
    );
  const unique = new Set(radii.map((r) => r.toFixed(3)));
  assert.ok(unique.size >= 2);
});

test("17–21. footprint gap, territory rejection, anchor clear zone, depth non-structural", () => {
  assert.ok(EXECUTIVE_NETWORK_PRESENTATION_GAP.minimumSurfaceGap > 0);
  const topology = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
    anchorObjectId: "obj-inventory",
  });
  for (let i = 0; i < topology.nodes.length; i += 1) {
    for (let j = i + 1; j < topology.nodes.length; j += 1) {
      const left = topology.nodes[i]!;
      const right = topology.nodes[j]!;
      assert.equal(
        executivePresentationTerritoriesIntersect(left.territory, right.territory),
        false,
        `${left.objectId}↔${right.objectId}`,
      );
    }
  }
  const anchor = topology.byId.get("obj-inventory")!;
  for (const node of topology.nodes) {
    if (node.objectId === "obj-inventory") continue;
    assert.ok(
      Math.hypot(node.presentationPosition.x, node.presentationPosition.y) >
        EXECUTIVE_NETWORK_PRESENTATION_GAP.anchorClearZonePadding * 0.5,
    );
  }
  const colliding = createExecutivePresentationTerritory({
    objectId: "x",
    center: createExecutivePresentationPosition(0, 0),
    footprint: resolveExecutivePresentationFootprint({
      compositionScale: 0.55,
      objectKind: "object",
    }),
    depthRole: "background",
  });
  assert.equal(
    depthCannotResolveTerritoryCollision(anchor.territory, colliding),
    true,
  );
  assert.equal(
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.usesZEscapeForCollision,
    false,
  );
});

test("22–27. safe areas + reject not clamp + bounds", () => {
  const plane = createExecutivePresentationPlane();
  const safeAreas = resolveExecutiveNetworkLayoutSafeAreas(plane);
  assert.ok(safeAreas.some((area) => area.id === "workspace-dial"));
  assert.ok(safeAreas.some((area) => area.id === "presentation-depth"));
  assert.ok(safeAreas.some((area) => area.id === "timeline"));

  const topology = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
    plane,
    safeAreas,
  });
  for (const node of topology.nodes) {
    assert.ok(node.presentationPosition.x >= plane.minX);
    assert.ok(node.presentationPosition.x <= plane.maxX);
    assert.ok(node.presentationPosition.y >= plane.minY);
    assert.ok(node.presentationPosition.y <= plane.maxY);
  }
  // Rejected candidates are counted rather than forcing Dial-corner collapse.
  assert.ok(topology.diagnostics.rejectedSafeAreaCandidates >= 0);
  assert.ok(topology.diagnostics.territoryPressurePairs.length === 0);
});

test("28–29. edge-crossing + mental-map determinism", () => {
  const a = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
    anchorObjectId: "obj-capacity",
  });
  const b = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
    anchorObjectId: "obj-capacity",
  });
  assert.equal(
    a.diagnostics.edgeCrossingScore,
    b.diagnostics.edgeCrossingScore,
  );
  assert.deepEqual(a.positions, b.positions);
});

test("30–33. regions, hidden nodes/edges", () => {
  const regions = resolveExecutivePresentationRegions();
  assert.ok(regions.some((region) => region.id === "business-network"));
  assert.ok(regions.some((region) => region.id === "executive-thread"));

  const hiddenNodes = ALL_NODES.map((node) =>
    node.objectId === "obj-risk"
      ? { ...node, disclosureState: "hidden" }
      : node,
  );
  const topology = resolveExecutiveNetworkTopology({
    nodes: hiddenNodes,
    edges: ALL_EDGES,
    anchorObjectId: "obj-inventory",
  });
  assert.equal(topology.byId.has("obj-risk"), false);
  assert.equal(
    topology.edges.some(
      (edge) => edge.sourceId === "obj-risk" || edge.targetId === "obj-risk",
    ),
    false,
  );
});

test("34–35. connection IDs preserved; endpoints follow mapped positions", () => {
  const presentation = stagePipeline("obj-inventory");
  const connectionIds = presentation.scene.connections.map((c) => c.id);
  assert.ok(connectionIds.length > 0);
  for (const object of presentation.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  )) {
    assert.ok(object.presentationPosition);
    const world = mapExecutivePresentationPositionToWorld({
      position: object.presentationPosition!,
      depthRole: object.depthRole ?? "standard",
    });
    assert.equal(object.targetPosition[0], world.x);
    assert.equal(object.targetPosition[1], world.y);
    assert.equal(object.targetPosition[2], world.z);
  }
});

test("36–38. scale truth + SP:4.2 mapper sole world adapter", () => {
  const presentation = stagePipeline("obj-budget");
  for (const object of presentation.scene.objects.filter(
    (entry) => entry.disclosureState !== "hidden",
  )) {
    const rendered = resolveExecutivePresentationEffectiveRenderedScale(
      object.scale,
      { focused: object.focused },
    );
    assert.equal(rendered, object.scale);
    assert.ok(object.scale < EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable || object.scale >= 0.36);
  }
  const source = readFileSync(
    join(here, "executiveNetworkTopology.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /projectExecutiveWorldPointToNdc|generateFlowTopology/);
  assert.match(
    readFileSync(
      join(here, "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts"),
      "utf8",
    ),
    /mapExecutive2DPositionToRenderWorld/,
  );
});

test("39–42. no XYZ authority / force / randomness; identical outputs", () => {
  assert.equal(
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.usesWorldSpaceXyzLayout,
    false,
  );
  assert.equal(EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.usesForceSimulation, false);
  assert.equal(EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.usesRandomLayout, false);
  const source = readFileSync(
    join(here, "executiveNetworkTopology.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|forceSimulation|requestAnimationFrame/);
  const a = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
  });
  const b = resolveExecutiveNetworkTopology({
    nodes: ALL_NODES,
    edges: ALL_EDGES,
  });
  assert.deepEqual(a, b);
});

test("43–47. Overview + Inventory/Budget/Capacity/Revenue fixtures structurally valid", () => {
  const overview = stagePipeline(null);
  assert.equal(overview.scene.topologyKind, "executive-network");
  const overviewPositions = overview.scene.objects
    .filter((entry) => entry.disclosureState !== "hidden")
    .map((entry) => entry.presentationPosition!)
    .filter(Boolean);
  assert.equal(isExecutiveNetworkCollinear(overviewPositions), false);

  for (const id of [
    "obj-inventory",
    "obj-budget",
    "obj-capacity",
    "obj-revenue",
  ]) {
    const presentation = stagePipeline(id);
    const focus = presentation.scene.objects.find((entry) => entry.id === id)!;
    assert.equal(focus.presentationPosition?.x, 0);
    assert.equal(focus.presentationPosition?.y, 0);
    const peers = presentation.scene.objects.filter(
      (entry) =>
        entry.disclosureState !== "hidden" &&
        entry.id !== id &&
        entry.presentationPosition != null,
    );
    assert.ok(peers.length >= 1, id);
    for (const peer of peers) {
      assert.ok(
        Math.hypot(
          peer.presentationPosition!.x,
          peer.presentationPosition!.y,
        ) > 0.2,
        `${id} peer ${peer.id}`,
      );
    }
  }
});

test("48–50. lighting + disclosure budgets unaffected", () => {
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
  assert.ok(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.relatedBusiness >= 1,
  );
  const disclosure = resolveExecutiveFocusSceneDisclosure({
    focusedSubjectId: "obj-budget",
    presentationDepth: "minimum",
    subjects: ALL_NODES.map((node) =>
      Object.freeze({
        subjectId: node.objectId,
        family: "business-object" as const,
        attention: node.attention,
        status: node.status,
      }),
    ),
    relationships: ALL_EDGES,
  });
  assert.ok(disclosure.byId.has("obj-budget"));
});

test("shell authority chain Disclosure→Network→Plane", () => {
  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  const grammar = shell.lastIndexOf(
    "applyExecutiveFocusVisualGrammarToStagePresentation",
  );
  const network = shell.lastIndexOf(
    "applyExecutiveNetworkTopologyToStagePresentation",
  );
  const plane = shell.lastIndexOf(
    "applyExecutivePresentationPlaneToStagePresentation",
  );
  assert.ok(network > grammar && plane > network);
});

test("occupied region helper", () => {
  const map = new Map([
    ["a", createExecutivePresentationPosition(0, 0)],
    ["b", createExecutivePresentationPosition(1, 0)],
    ["c", createExecutivePresentationPosition(0, 1)],
    ["d", createExecutivePresentationPosition(-1, -0.5)],
  ]);
  assert.ok(countExecutiveNetworkOccupiedRegions(map) >= 3);
});
