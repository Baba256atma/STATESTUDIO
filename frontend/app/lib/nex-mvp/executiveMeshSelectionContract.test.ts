/**
 * STAGE-MESH-RAYCAST-FIX:1
 * The visible body is the raycast target. A nearer body wins over the
 * atmosphere plane. A demo-profile change drops a subject that is not in
 * the destination catalog. Selection and focus move together.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial, OctahedronGeometry, PerspectiveCamera, PlaneGeometry, Raycaster, Scene, SphereGeometry, TorusGeometry, Vector2 } from "three";

import { resolveActiveDemoProfileStageMaterials } from "../demo-profile/demoProfileStageCatalog.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  resetDemoProfileForTests,
} from "../demo-profile/demoProfileStore.ts";
import { resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { shouldResetExecutiveStage2DToOverview } from "../spatial-presentation/executiveStage2DTopologyReadability.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  executiveSubjectRemainsInCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";

const bodySource = readFileSync(
  new URL("../../executive/nex-mvp/stage/ExecutiveOvsObjectBody.tsx", import.meta.url),
  "utf8",
);
const labelSource = readFileSync(
  new URL("../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx", import.meta.url),
  "utf8",
);
const atmosphereSource = readFileSync(
  new URL("../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx", import.meta.url),
  "utf8",
);

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function hitOrder(
  geometry: BoxGeometry | SphereGeometry | CylinderGeometry | OctahedronGeometry | TorusGeometry,
  aim: [number, number, number] = [0, 0, 0],
) {
  const scene = new Scene();
  const body = new Mesh(geometry, new MeshStandardMaterial());
  body.position.set(0, 0, 0);
  const plane = new Mesh(new PlaneGeometry(48, 48), new MeshStandardMaterial());
  plane.position.set(0, 0, -6);
  scene.add(body, plane);
  const camera = new PerspectiveCamera(42, 16 / 9, 0.1, 80);
  camera.position.set(1.5, 1.9, 11);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  scene.updateMatrixWorld(true);
  const raycaster = new Raycaster();
  const ndc = body.localToWorld(camera.position.clone().set(aim[0], aim[1], aim[2])).project(camera);
  raycaster.setFromCamera(new Vector2(ndc.x, ndc.y), camera);
  return raycaster.intersectObjects(scene.children, true).map((hit) => hit.object).filter((object): object is Mesh => object instanceof Mesh);
}

test("visible body geometries expose a raycast and win over the background plane", () => {
  const geometries = [
    new BoxGeometry(0.7, 0.7, 0.4),
    new SphereGeometry(0.35, 16, 12),
    new CylinderGeometry(0.3, 0.3, 0.6, 12),
    new OctahedronGeometry(0.4, 0),
    new TorusGeometry(0.3, 0.08, 8, 16),
  ];
  for (const geometry of geometries) {
    const mesh = new Mesh(geometry);
    assert.equal(typeof mesh.raycast, "function");
    geometry.computeBoundingSphere();
    assert.ok((geometry.boundingSphere?.radius ?? 0) > 0);
    const hits = hitOrder(
      geometry,
      geometry.type === "TorusGeometry" ? [0.3, 0, 0] : [0, 0, 0],
    );
    assert.equal(hits[0]?.geometry, geometry);
    assert.notEqual(hits[0]?.geometry.type, "PlaneGeometry");
  }
});

test("a ray that misses the body reaches the background plane only", () => {
  const scene = new Scene();
  const body = new Mesh(new BoxGeometry(0.4, 0.4, 0.4));
  const plane = new Mesh(new PlaneGeometry(48, 48));
  plane.position.set(0, 0, -6);
  scene.add(body, plane);
  const camera = new PerspectiveCamera(42, 16 / 9, 0.1, 80);
  camera.position.set(0, 0, 11);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  scene.updateMatrixWorld(true);
  const raycaster = new Raycaster();
  raycaster.setFromCamera(new Vector2(0.85, 0.85), camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  assert.equal(hits[0]?.object, plane);
  assert.equal(hits.some((hit) => hit.object === body), false);
});

test("OVS interactive bodies keep raycast and labels stay pointer-transparent", () => {
  const interactiveBody = bodySource.slice(bodySource.indexOf('if (primitive === "rounded-block")'));
  assert.match(interactiveBody, /interactiveHandlers/);
  assert.equal(interactiveBody.includes("raycast={() => null}"), false);
  assert.match(bodySource, /function InnerLight/);
  assert.match(labelSource, /pointerEvents: label\.pointerEvents/);
  assert.match(atmosphereSource, /onClearSelection\(\)/);
  assert.match(atmosphereSource, /position=\{\[0, 0, -6\]\}/);
});

test("object selection sets the same canonical id on selection and focus", () => {
  const initial = initialState();
  const first = selectNexoraMVPInteractionSubject(initial, "obj-capacity");
  const second = selectNexoraMVPInteractionSubject(initial, "obj-capacity");
  assert.equal(first.mode, "object-focused");
  assert.equal(first.selectedSubject?.id, "obj-capacity");
  assert.equal(first.focusedSubject?.id, "obj-capacity");
  assert.equal(second.selectedSubject?.id, first.selectedSubject?.id);
  assert.equal(second.focusedSubject?.id, first.focusedSubject?.id);
  const cleared = resetNexoraMVPObjectInteractionOverview(first);
  assert.equal(cleared.selectedSubject, null);
  assert.equal(cleared.focusedSubject, null);
  assert.equal(cleared.mode, "overview");
});

test("overview misses do not reset and focused empty clicks do", () => {
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "background",
      topologyMode: "overview",
      hitKind: "none",
    }),
    false,
  );
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "background",
      topologyMode: "anchored",
      hitKind: "none",
    }),
    true,
  );
  assert.equal(
    shouldResetExecutiveStage2DToOverview({
      source: "background",
      topologyMode: "anchored",
      hitKind: "object",
    }),
    false,
  );
});

test("manufacturing capacity does not remain authorized in the project catalog", () => {
  resetWorkspaceRegistryForTests();
  resetDemoProfileForTests();
  openManufacturingDemo();
  const manufacturing = resolveActiveDemoProfileStageMaterials();
  assert.equal(
    executiveSubjectRemainsInCatalog(
      "obj-capacity",
      (manufacturing?.catalog.objects ?? []).map((object) => object.id),
    ),
    true,
  );
  openProjectDemo();
  const projectIds = (resolveActiveDemoProfileStageMaterials()?.catalog.objects ?? []).map(
    (object) => object.id,
  );
  assert.equal(projectIds.includes("demo-subject:project:project-control"), true);
  assert.equal(executiveSubjectRemainsInCatalog("obj-capacity", projectIds), false);
  assert.equal(executiveSubjectRemainsInCatalog(null, projectIds), true);
  assert.equal(
    executiveSubjectRemainsInCatalog("demo-subject:project:project-control", projectIds),
    true,
  );
});
