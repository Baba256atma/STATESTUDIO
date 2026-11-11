/**
 * STAGE-TOPOLOGY-AUTHORITY-FIX:1
 * No admitted layout edge keeps Flow. A resolved edge selects Network.
 * A Company or Goal overview anchor stays the hub.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { resolveActiveDemoProfileStageMaterials } from "../demo-profile/demoProfileStageCatalog.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  resetDemoProfileForTests,
} from "../demo-profile/demoProfileStore.ts";
import { resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import {
  resolveNexoraMVPStageScenePresentation,
  type NexoraMVPStageObject,
  type NexoraMVPStageScenePresentation,
} from "./nexora3DExecutiveStage.ts";
import {
  applyExecutiveNetworkTopologyToStagePresentation,
  resolveExecutiveStageLayoutEdges,
} from "./nexoraMVPExecutiveNetworkTopology.ts";
import type { NexoraMVPStageInteractionPresentation } from "./nexoraMVPObjectInteraction.ts";

const workspaceA = "ws-alpha";
const workspaceB = "ws-beta";

function peer(
  id: string,
  workspaceId = workspaceA,
): NexoraMVPStageObject {
  return Object.freeze({
    id,
    label: id,
    kind: "object",
    objectKind: "object",
    managerWorkspaceId: workspaceId,
    position: [0, 0, 0] as const,
    status: "stable",
    attention: "normal" as const,
  });
}

function sceneFor(
  objects: readonly NexoraMVPStageObject[],
  relationships: readonly { id: string; sourceId: string; targetId: string }[],
  workspaceId: string | null = workspaceA,
  focusedObjectId: string | null = null,
): NexoraMVPStageScenePresentation {
  return resolveNexoraMVPStageScenePresentation({
    objects,
    relationships,
    selectedObjectId: focusedObjectId,
    focusedObjectId,
    presentationState: "minimum",
    environmentIntent: "neutral",
    overviewOccupancy: "current-catalog",
    activeManagerWorkspaceId: workspaceId,
  });
}

function wrap(
  scene: NexoraMVPStageScenePresentation,
): NexoraMVPStageInteractionPresentation {
  return {
    mode: scene.mode === "focus" ? "object-focused" : "overview",
    scene,
    contextNodes: [],
    contextConnections: [],
    breadcrumb: [],
    canStepBack: false,
    focusedSubjectId: scene.focusedObjectId,
    selectedSubjectId: scene.selectedObjectId,
    emphasizedObjectIds: [],
    subordinateObjectIds: [],
    emphasizedRelationshipIds: [],
  };
}

function xs(scene: NexoraMVPStageScenePresentation): number[] {
  return scene.objects.map((object) => object.targetPosition[0]).sort((a, b) => a - b);
}

function adjacentPitch(scene: NexoraMVPStageScenePresentation): number {
  const values = xs(scene);
  let min = Number.POSITIVE_INFINITY;
  for (let index = 1; index < values.length; index += 1) {
    min = Math.min(min, values[index]! - values[index - 1]!);
  }
  return min;
}

test("three independent objects keep Flow spacing", () => {
  const scene = sceneFor(
    [peer("peer-a"), peer("peer-b"), peer("peer-c")],
    [],
  );
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene, scene);
  assert.equal(placed.scene.topologyKind, undefined);
  const pitch = adjacentPitch(placed.scene);
  assert.ok(pitch > 2.4 && pitch < 2.7, `flow pitch ${pitch}`);
});

test("five independent objects keep Flow spacing", () => {
  const scene = sceneFor(
    ["p1", "p2", "p3", "p4", "p5"].map((id) => peer(id)),
    [],
  );
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene, scene);
  const pitch = adjacentPitch(placed.scene);
  assert.ok(pitch > 1.1 && pitch < 1.4, `five-object flow pitch ${pitch}`);
  assert.equal(placed.scene.objects.length, 5);
});

test("a resolved object-object edge selects Network", () => {
  const objects = [peer("peer-a"), peer("peer-b"), peer("peer-c")];
  const scene = sceneFor(objects, [
    { id: "rel-a-b", sourceId: "peer-a", targetId: "peer-b" },
  ]);
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene.topologyKind, "executive-network");
  assert.notEqual(placed.scene, scene);
  assert.deepEqual(
    placed.scene.objects.map((object) => object.id).sort(),
    ["peer-a", "peer-b", "peer-c"],
  );
  const center = placed.scene.objects.find(
    (object) => object.presentationPosition?.x === 0 && object.presentationPosition?.y === 0,
  );
  assert.ok(center);
});

test("company hub without edges is not replaced by Flow or Network", () => {
  const company = Object.freeze({
    ...peer("company-a"),
    objectKind: "company",
  });
  const scene = sceneFor([company, peer("peer-a"), peer("peer-b")], []);
  assert.equal(scene.overviewAnchorId, "company-a");
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene, scene);
  assert.equal(placed.scene.overviewAnchorId, "company-a");
  const anchor = placed.scene.objects.find((object) => object.id === "company-a");
  assert.deepEqual(anchor?.targetPosition, [0, 0, 0]);
});

test("goal hub without edges is not replaced", () => {
  const goal = Object.freeze({
    ...peer("goal-a"),
    objectKind: "goal" as const,
  });
  const scene = sceneFor([goal, peer("peer-a")], []);
  assert.equal(scene.overviewAnchorId, "goal-a");
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene, scene);
  assert.deepEqual(
    placed.scene.objects.find((object) => object.id === "goal-a")?.targetPosition,
    [0, 0, 0],
  );
});

test("stale and cross-workspace edges do not authorize Network", () => {
  const objects = [peer("peer-a"), peer("peer-b")];
  const eligible = new Set(objects.map((object) => object.id));
  const stale = resolveExecutiveStageLayoutEdges({
    connections: [
      { id: "missing", sourceId: "peer-a", targetId: "not-on-stage" },
      { id: "hidden", sourceId: "peer-a", targetId: "peer-b", visualRole: "hidden" },
      { id: "context", sourceId: "peer-a", targetId: "peer-b", visualRole: "context" },
      { id: "loop", sourceId: "peer-a", targetId: "peer-a" },
      { id: "other-ws", sourceId: "peer-a", targetId: "peer-foreign" },
    ],
    eligibleObjectIds: eligible,
  });
  assert.deepEqual(stale, []);
  const foreign = sceneFor(
    [peer("peer-a", workspaceA), peer("peer-foreign", workspaceB)],
    [{ id: "cross", sourceId: "peer-a", targetId: "peer-foreign" }],
    workspaceA,
  );
  assert.equal(
    foreign.objects.some((object) => object.id === "peer-foreign"),
    false,
  );
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(foreign));
  assert.equal(placed.scene, foreign);
  assert.notEqual(placed.scene.topologyKind, "executive-network");
});

test("mixed connected and independent objects all remain", () => {
  const objects = [peer("linked-a"), peer("linked-b"), peer("solo")];
  const scene = sceneFor(objects, [
    { id: "rel", sourceId: "linked-a", targetId: "linked-b" },
  ]);
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene.topologyKind, "executive-network");
  assert.deepEqual(
    placed.scene.objects.map((object) => object.id).sort(),
    ["linked-a", "linked-b", "solo"],
  );
  assert.equal(
    placed.scene.connections.some((connection) => connection.id === "rel"),
    true,
  );
});

test("identical inputs produce identical positions", () => {
  const objects = [peer("peer-a"), peer("peer-b"), peer("peer-c")];
  const relationships = [{ id: "rel", sourceId: "peer-a", targetId: "peer-c" }];
  const first = applyExecutiveNetworkTopologyToStagePresentation(
    wrap(sceneFor(objects, relationships)),
  );
  const second = applyExecutiveNetworkTopologyToStagePresentation(
    wrap(sceneFor(objects, relationships)),
  );
  assert.deepEqual(
    first.scene.objects.map((object) => [object.id, object.targetPosition]),
    second.scene.objects.map((object) => [object.id, object.targetPosition]),
  );
});

test("selection and focus ids stay on the same objects", () => {
  const objects = [peer("peer-a"), peer("peer-b")];
  const scene = sceneFor(
    objects,
    [{ id: "rel", sourceId: "peer-a", targetId: "peer-b" }],
    workspaceA,
    "peer-a",
  );
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.focusedSubjectId, "peer-a");
  assert.equal(placed.selectedSubjectId, "peer-a");
  assert.equal(placed.scene.focusedObjectId, "peer-a");
  assert.equal(placed.scene.selectedObjectId, "peer-a");
  const focused = placed.scene.objects.find((object) => object.id === "peer-a");
  assert.equal(focused?.presentationPosition?.x, 0);
  assert.equal(focused?.presentationPosition?.y, 0);
});

test("focus without edges does not move the Flow coordinates", () => {
  const scene = sceneFor(
    [peer("peer-a"), peer("peer-b"), peer("peer-c")],
    [],
    workspaceA,
    "peer-b",
  );
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene, scene);
  assert.equal(placed.scene.focusedObjectId, "peer-b");
});

test("business demo peers keep Flow and do not use the 1.304 network pitch", () => {
  const objects = ["revenue", "inventory", "cost"].map((key) =>
    peer(`business-demo:ws:${key}`),
  );
  const scene = sceneFor(objects, []);
  const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
  assert.equal(placed.scene, scene);
  const pitch = adjacentPitch(placed.scene);
  assert.ok(pitch > 2.4 && pitch < 2.6, `pitch ${pitch}`);
  assert.ok(Math.abs(pitch - 1.304) > 0.5);
});

test("manufacturing and project catalogs do not gain a network overwrite without edges", () => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  try {
    for (const open of [openManufacturingDemo, openProjectDemo]) {
      open();
      const materials = resolveActiveDemoProfileStageMaterials();
      assert.ok(materials);
      assert.ok(materials.catalog.objects.length > 0);
      const scene = sceneFor(
        materials.catalog.objects,
        materials.catalog.relationships,
        materials.catalog.objects[0]?.managerWorkspaceId ?? workspaceA,
      );
      const placed = applyExecutiveNetworkTopologyToStagePresentation(wrap(scene));
      if (materials.catalog.relationships.length === 0) {
        assert.equal(placed.scene, scene);
        assert.notEqual(placed.scene.topologyKind, "executive-network");
      } else {
        assert.equal(placed.scene.objects.length, scene.objects.length);
      }
      assert.deepEqual(
        placed.scene.objects.map((object) => object.id).sort(),
        scene.objects.map((object) => object.id).sort(),
      );
    }
  } finally {
    resetDemoProfileForTests();
    resetCsvRealDataImportStoreForTests();
    resetWorkspaceRegistryForTests();
  }
});
