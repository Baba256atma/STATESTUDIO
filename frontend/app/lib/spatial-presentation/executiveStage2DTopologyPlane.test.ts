/**
 * STAGE-2D:2 — True 2D Topology Plane invariants.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  resolveExecutiveStageFixedCamera,
} from "./executiveStage2DFixedCamera.ts";
import {
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_2D_RENDER_LAYER,
  EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY,
  createExecutiveStage2DPoint,
  executiveStage2DTopologyPlaneIdentity,
  executiveStage2DTopologyPlaneNamespace,
  executiveStage2DTopologyPlaneVersion,
  getExecutiveStage2DTopologyPlaneIdentity,
  normalizeExecutiveStage2DPosition,
  normalizeExecutiveStage2DPositionTuple,
  remapLegacyHubXzToExecutiveStage2D,
  verifyExecutiveStage2DTopologyPlane,
} from "./executiveStage2DTopologyPlane.ts";
import {
  EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY,
  EXECUTIVE_TOPOLOGY_STAGE_LAYOUT,
  resolveExecutiveTopologyGuidedStageComposition,
} from "./executiveTopologyGuidedStageComposition.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { generateHubTopology } from "../scene/topology/hubTopologyGenerator.ts";

const here = dirname(fileURLToPath(import.meta.url));

function overviewPresentation(presentationState: "minimum" | "report" | "operation" = "minimum") {
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState,
    environmentIntent: "neutral",
  });
  return deriveNexoraMVPStageInteractionPresentation(state);
}

function focusPresentation(
  objectId: string,
  presentationState: "minimum" | "report" | "operation" = "minimum",
) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState,
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState,
    environmentIntent: state.environmentIntent,
  });
  return deriveNexoraMVPStageInteractionPresentation(state);
}

function stage2dPipeline(
  objectId: string | null,
  presentationState: "minimum" | "report" | "operation" = "minimum",
) {
  const base =
    objectId == null
      ? overviewPresentation(presentationState)
      : focusPresentation(objectId, presentationState);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: presentationState,
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withTopology =
    applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  return applyExecutiveStageFixedCameraToStagePresentation(withTopology);
}

test("STAGE-2D:2 identity / version / namespace", () => {
  const identity = getExecutiveStage2DTopologyPlaneIdentity();
  assert.equal(identity.id, "STAGE-2D:2/ExecutiveStage2DTopologyPlane");
  assert.equal(identity.version, "2.2.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-topology-plane",
  );
  assert.equal(executiveStage2DTopologyPlaneIdentity, identity.id);
  assert.equal(executiveStage2DTopologyPlaneVersion, identity.version);
  assert.equal(executiveStage2DTopologyPlaneNamespace, identity.namespace);
  assert.equal(verifyExecutiveStage2DTopologyPlane().ok, true);
  assert.equal(EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY.stagePlane, "xy");
  assert.deepEqual(createExecutiveStage2DPoint(1, 2), { x: 1, y: 2 });
});

test("Invariant A — Normalization flattens poisoned Z", () => {
  assert.deepEqual(normalizeExecutiveStage2DPosition({ x: 2, y: 3, z: 8 }), {
    x: 2,
    y: 3,
    z: 0,
  });
  assert.deepEqual(normalizeExecutiveStage2DPositionTuple([2, 3, 8]), [2, 3, 0]);
  assert.equal(EXECUTIVE_STAGE_2D_DEPTH, 0);
});

test("Invariant B — Hub topology distributes through X/Y with z=0", () => {
  const raw = generateHubTopology([
    { id: "hub", name: "Hub" },
    { id: "a", name: "A" },
    { id: "b", name: "B" },
    { id: "c", name: "C" },
  ]);
  // Shared Type-C hub still emits XZ; Stage remapper converts to XY.
  const satellite = raw.nodes[1]!;
  assert.ok(satellite.position);
  const remapped = remapLegacyHubXzToExecutiveStage2D(satellite.position!);
  assert.equal(remapped.z, 0);
  assert.ok(Math.abs(remapped.x) > 0.01 || Math.abs(remapped.y) > 0.01);

  const composition = resolveExecutiveTopologyGuidedStageComposition({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    focusedObjectId: "obj-budget",
    topologyType: "hub",
  });
  assert.equal(composition.topology, "hub");
  for (const entry of composition.positions) {
    assert.equal(entry.position.z, 0, entry.objectId);
    assert.equal(entry.tuple[2], 0, entry.objectId);
  }
  assert.equal(EXECUTIVE_TOPOLOGY_STAGE_LAYOUT.depthPrimaryZ, 0);
});

test("Invariant C — Focused object z === 0", () => {
  const focused = stage2dPipeline("obj-budget");
  const object = focused.scene.objects.find((entry) => entry.id === "obj-budget");
  assert.ok(object);
  assert.equal(object!.targetPosition[2], 0);
  assert.equal(object!.overviewPosition[2], 0);
  assert.equal(focused.scene.focusedObjectId, "obj-budget");
});

test("Invariant D — Attention object z === 0", () => {
  const presentation = stage2dPipeline("obj-budget");
  const capacity = presentation.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  );
  assert.ok(capacity);
  assert.equal(capacity!.targetPosition[2], 0);
  assert.equal(capacity!.overviewPosition[2], 0);
});

test("Invariant E — Context nodes z === 0", () => {
  const presentation = stage2dPipeline("obj-revenue");
  assert.ok(presentation.contextNodes.length > 0);
  for (const node of presentation.contextNodes) {
    assert.equal(node.targetPosition[2], 0, node.id);
  }
});

test("Invariant F — Connection endpoints z === 0", () => {
  const presentation = stage2dPipeline("obj-budget");
  const byId = new Map(
    presentation.scene.objects.map((object) => [object.id, object]),
  );
  const contextById = new Map(
    presentation.contextNodes.map((node) => [node.id, node]),
  );
  for (const connection of presentation.scene.connections) {
    const source =
      byId.get(connection.sourceId) ?? contextById.get(connection.sourceId);
    const target =
      byId.get(connection.targetId) ?? contextById.get(connection.targetId);
    if (source) assert.equal(source.targetPosition[2], 0, connection.sourceId);
    if (target) assert.equal(target.targetPosition[2], 0, connection.targetId);
  }
  assert.equal(EXECUTIVE_STAGE_2D_RENDER_LAYER.connectionZFightingEpsilon, 0);
});

test("Invariant G — Presentation states do not alter semantic Z", () => {
  for (const state of ["minimum", "report", "operation"] as const) {
    const presentation = stage2dPipeline("obj-revenue", state);
    assert.equal(presentation.scene.presentationState, state);
    for (const object of presentation.scene.objects) {
      assert.equal(object.targetPosition[2], 0, `${state}:${object.id}`);
    }
    for (const node of presentation.contextNodes) {
      assert.equal(node.targetPosition[2], 0, `${state}:${node.id}`);
    }
  }
});

test("Invariant H — STAGE-2D:1 camera regression guard", () => {
  const camera = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.position, {
    x: 0,
    y: 0,
    z: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  });
  assert.deepEqual(camera.target, { x: 0, y: 0, z: 0 });
  const presentation = stage2dPipeline("obj-budget");
  assert.deepEqual(presentation.scene.camera.position, [0, 0, 11]);
  assert.deepEqual(presentation.scene.camera.target, [0, 0, 0]);
});

test("Stage host exposes STAGE-2D:2 observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-plane/);
  assert.match(host, /data-stage-position-mode/);
  assert.match(host, /data-focused-target-z/);
  assert.match(host, /applyExecutiveStage2DTopologyPlaneToStagePresentation/);

  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /applyExecutiveStage2DTopologyPlaneToStagePresentation/);
});

test("ring/cluster/hybrid remain deferred; auto uses flow/hub at z=0", () => {
  assert.equal(
    EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY.activatesRingClusterHybrid,
    false,
  );
  const auto = resolveExecutiveTopologyGuidedStageComposition({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    focusedObjectId: null,
    topologyType: "auto",
  });
  assert.ok(auto.topology === "flow" || auto.topology === "hub");
  for (const entry of auto.positions) {
    assert.equal(entry.tuple[2], 0);
  }
});
