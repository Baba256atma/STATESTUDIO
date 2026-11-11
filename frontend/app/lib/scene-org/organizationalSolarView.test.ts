import assert from "node:assert/strict";
import { test } from "node:test";
import { getTopologyGenerator } from "../scene/topology/topologyRegistry.ts";
import { generateHubTopology } from "../scene/topology/hubTopologyGenerator.ts";
import {
  ORGANIZATIONAL_SOLAR_NEUTRAL_NOTICE,
  ORGANIZATIONAL_SOLAR_VIEW,
  projectOrganizationalSolarLayout,
  STAGE_TOPOLOGY_FAMILY_STATUS,
} from "./organizationalSolarView.ts";
import { createSceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";
import {
  parseSceneOrgSavedScenes,
  sceneOrgSavedSceneDurabilityIdentity,
  serializeSceneOrgSavedScenes,
} from "./sceneOrgSavedSceneDurability.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "../decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";

const layout = {
  presentationDepth: "minimum" as const,
  leftRegion: "management" as const,
  rightRegion: "contextual" as const,
  detailWorkspace: "closed" as const,
};

test("stage topology families are not operational organizational graphs", () => {
  assert.deepEqual(STAGE_TOPOLOGY_FAMILY_STATUS, {
    star: "NOT IMPLEMENTED",
    ring: "DECLARED ONLY",
    mesh: "NOT IMPLEMENTED",
    bus: "NOT IMPLEMENTED",
    tree: "NOT IMPLEMENTED",
    hybrid: "DECLARED ONLY",
  });
  const nodes = [
    { id: "a", name: "A" },
    { id: "b", name: "B" },
    { id: "c", name: "C" },
  ];
  assert.equal(getTopologyGenerator("ring")(nodes).connections, undefined);
  assert.equal(getTopologyGenerator("hybrid")(nodes).connections, undefined);
  const hub = generateHubTopology(nodes);
  assert.ok(hub.connections);
  assert.equal(hub.connections.length, 2);
  assert.ok(hub.connections.every((edge) => edge.sourceId === "a"));
});

test("neutral solar layout places one object without inventing a center entity or edges", () => {
  const solar = projectOrganizationalSolarLayout({ objectIds: ["data-source:ws:finance"] });
  assert.equal(solar.semanticLevel, "neutral-presentation");
  assert.equal(solar.relationshipEdges.length, 0);
  assert.equal(solar.center.kind, "presentation-marker");
  assert.equal(solar.center.canonicalObjectId, null);
  assert.equal(solar.rings.length, 1);
  assert.equal(solar.rings[0]?.semanticType, "presentation-ring");
  assert.equal(solar.placements.length, 1);
  assert.equal(solar.placements[0]?.position.z, 0);
  assert.equal(solar.notice, ORGANIZATIONAL_SOLAR_NEUTRAL_NOTICE);
});

test("solar rings use equal angles, stable order, and no duplicate or blank ids", () => {
  const solar = projectOrganizationalSolarLayout({
    objectIds: ["b", "a", "a", " ", "c"],
  });
  assert.deepEqual(solar.placements.map((placement) => placement.canonicalObjectId), ["a", "b", "c"]);
  const angles = solar.placements.map((placement) => placement.angleRadians);
  const step = angles[1]! - angles[0]!;
  assert.ok(Math.abs(step - (2 * Math.PI) / 3) < 0.0001);
  assert.ok(Math.abs(angles[2]! - angles[1]! - step) < 0.0001);
  const again = projectOrganizationalSolarLayout({ objectIds: ["c", "b", "a"] });
  assert.deepEqual(again.placements, solar.placements);
});

test("twenty-one objects use multiple presentation rings inside the stage plane", () => {
  const ids = Array.from({ length: 21 }, (_, index) => `object-${String(index).padStart(2, "0")}`);
  const solar = projectOrganizationalSolarLayout({ objectIds: ids });
  assert.equal(solar.rings.length, 3);
  assert.equal(solar.placements.length, 21);
  assert.deepEqual(solar.rings.map((ring) => ring.objectIds.length), [8, 8, 5]);
  for (const placement of solar.placements) {
    assert.ok(Math.abs(placement.position.x) < 4);
    assert.ok(Math.abs(placement.position.y) < 4);
    assert.equal(placement.position.z, 0);
  }
  const unique = new Set(solar.placements.map((placement) => `${placement.position.x},${placement.position.y}`));
  assert.equal(unique.size, 21);
});

test("saved scenes keep stage and solar views independent without a new store", () => {
  const stage = createSceneOrgSavedScene({
    sceneId: "scene-a",
    name: "Scene A",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "company-a",
    ownerDeckId: "production",
    canonicalReferences: [],
    layout,
    stageView: null,
  });
  const solar = createSceneOrgSavedScene({
    sceneId: "scene-b",
    name: "Scene B",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "company-a",
    ownerDeckId: "production",
    canonicalReferences: [],
    layout,
    stageView: ORGANIZATIONAL_SOLAR_VIEW,
    spatialState: {
      schemaVersion: 1,
      coordinateSystem: "stage-plane-xy",
      objects: [{ canonicalObjectId: "data-source:company-a:finance", position: { x: 0, y: 1.45, z: 0 } }],
    },
  });
  assert.equal(stage.stageView, undefined);
  assert.equal(solar.stageView, ORGANIZATIONAL_SOLAR_VIEW);
  const raw = JSON.parse(serializeSceneOrgSavedScenes([stage, solar])) as {
    scenes: Array<Record<string, unknown>>;
  };
  raw.scenes[1]!.stageView = "not-a-solar-view";
  const parsed = parseSceneOrgSavedScenes(JSON.stringify({
    identity: sceneOrgSavedSceneDurabilityIdentity,
    version: 1,
    scenes: raw.scenes,
  }));
  assert.equal(parsed.status, "loaded");
  assert.equal(parsed.scenes[1]?.stageView, undefined);
  assert.equal(parsed.scenes[1]?.spatialState?.objects[0]?.position.y, 1.45);
});

test("solar positions stay on the existing data-object projector and do not add edges", () => {
  const solar = projectOrganizationalSolarLayout({ objectIds: ["data-source:ws:one"] });
  const placement = solar.placements[0]!;
  const projected = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [{
      id: "data-source:ws:one",
      label: "one.csv",
      sourceId: "one",
      unresolvedFieldCount: 0,
      relationships: [],
    }] as never,
    visibleDataObjectIds: ["data-source:ws:one"],
    selectedDataObjectId: null,
    businessFocusId: null,
    stageObjects: [],
    sceneIntentKind: "business" as never,
    labelSide: "top-right",
    spatialPositions: {
      "data-source:ws:one": { x: placement.position.x, y: placement.position.y },
    },
  });
  assert.equal(projected.participants.length, 1);
  assert.deepEqual(projected.participants[0]?.presentation.targetPosition, [
    placement.position.x,
    placement.position.y,
    0,
  ]);
  assert.equal(projected.connections.length, 0);
});
