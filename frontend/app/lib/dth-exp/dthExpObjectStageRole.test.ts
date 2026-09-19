/**
 * NPA-T DTH-EXP:2 — Object Stage Roles tests.
 * Resolver and transition only. Does not implement Nexo families, animation, or Advisor control.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY,
  DTH_EXP_SCENE_ATTENTIONS,
  DTH_EXP_VAI_ROLE_AUTHORITY,
  describeDthExpVisualRoleTransition,
  dthExpObjectStageRoleIdentity,
  projectDthExpTheatreScene,
  resolveDthExpTheatreActor,
  verifyDthExpObjectStageRoleBoundary,
} from "./dthExpPublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function dth(state: NexoraMVPObjectInteractionState = initial()) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
  });
}

function catalogObject(id: string) {
  const found =
    catalog.objects.find((item) => item.id === id) ??
    catalog.contextSubjects.find((item) => item.id === id);
  assert.ok(found, `catalog missing ${id}`);
  return {
    id: found.id,
    kind: found.kind,
    label: found.label,
    authority: "NEX-MVP:4/catalog" as const,
  };
}

test("DTH-EXP:2 identity and boundary", () => {
  assert.equal(dthExpObjectStageRoleIdentity, "NPA-T DTH-EXP:2/ObjectStageRoles");
  assert.equal(verifyDthExpObjectStageRoleBoundary().ok, true);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.startsDthExp3, false);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.visualRoleIsPermanentObjectField, false);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.labelIsIdentityAuthority, false);
  assert.deepEqual([...DTH_EXP_SCENE_ATTENTIONS], [
    "focal",
    "emphasized",
    "contextual",
    "de-emphasized",
    "hidden",
    "collapsed",
  ]);
});

test("1 — Canonical Object resolves to a Theatre Actor", () => {
  const resolved = resolveDthExpTheatreActor({
    object: catalogObject("obj-revenue"),
    sceneIdentity: "scene:flow",
    visualRole: "flow-node",
  });
  assert.equal(resolved.status, "ok");
  assert.equal(resolved.actor?.isTheatreActorNotBusinessObject, true);
  assert.equal(resolved.writes.canonicalObjects, false);
  assert.equal(resolved.writes.objectVisualTypeField, false);
});

test("2 — Actor preserves canonical Object ID", () => {
  const resolved = resolveDthExpTheatreActor({
    object: catalogObject("obj-capacity"),
    sceneIdentity: "scene:a",
  });
  assert.equal(resolved.actor?.canonicalObjectId, "obj-capacity");
  assert.equal(resolved.actor?.referent.canonicalObjectId, "obj-capacity");
  assert.equal(resolved.actor?.actorId, "theatre-actor:obj-capacity");
});

test("3 — Visual role assignment does not mutate canonical Object state", () => {
  const object = catalogObject("obj-budget");
  const before = JSON.stringify(object);
  resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:bars",
    visualRole: "bar",
  });
  assert.equal(JSON.stringify(object), before);
  assert.equal("visualType" in object, false);
});

test("4 — One Object can change flow-node → bubble", () => {
  const object = catalogObject("obj-revenue");
  const flow = resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:flow",
    visualRole: "flow-node",
  });
  const bubble = resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:bubble",
    visualRole: "bubble",
  });
  assert.equal(flow.actor?.visualRole, "flow-node");
  assert.equal(bubble.actor?.visualRole, "bubble");
  assert.equal(flow.actor?.canonicalObjectId, bubble.actor?.canonicalObjectId);
  assert.equal(flow.actor?.visualRoleIsPermanent, false);
});

test("5 — One Object can change bubble → cause-node", () => {
  const object = catalogObject("obj-revenue");
  const bubble = resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:bubble",
    visualRole: "bubble",
  });
  const cause = resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:cause",
    visualRole: "cause-node",
  });
  assert.equal(bubble.actor?.visualRole, "bubble");
  assert.equal(cause.actor?.visualRole, "cause-node");
  assert.equal(bubble.actor?.canonicalObjectId, "obj-revenue");
  assert.equal(cause.actor?.canonicalObjectId, "obj-revenue");
});

test("6 — Role transition preserves canonical identity", () => {
  const object = catalogObject("obj-revenue");
  const from = resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:flow",
    visualRole: "flow-node",
    presentation: { position: { x: 0, y: 0 }, emphasis: "none" },
  }).actor;
  const to = resolveDthExpTheatreActor({
    object,
    sceneIdentity: "scene:cause",
    visualRole: "cause-node",
    presentation: { position: { x: 4, y: 1 }, emphasis: "high" },
    attention: "focal",
  }).actor;
  const transition = describeDthExpVisualRoleTransition({ from, to });
  assert.equal(transition.projectionStatus, "ok");
  assert.equal(transition.canonicalObjectId, "obj-revenue");
  assert.equal(transition.fromVisualRole, "flow-node");
  assert.equal(transition.toVisualRole, "cause-node");
  assert.equal(transition.presentationChanged.visualRole, true);
  assert.equal(transition.presentationChanged.position, true);
  assert.equal(transition.animationImplemented, false);
  assert.equal(transition.preserved.canonicalObjectId, true);
  assert.equal(transition.preserved.kpiTruth, true);
  assert.equal(transition.preserved.vaiRoleTruth, true);
});

test("7 — Multiple same-type Objects remain distinct", () => {
  const supplierA = resolveDthExpTheatreActor({
    object: { id: "obj-supplier-a", kind: "object", label: "Supplier" },
    sceneIdentity: "scene:flow",
    visualRole: "flow-node",
  });
  const supplierB = resolveDthExpTheatreActor({
    object: { id: "obj-supplier-b", kind: "object", label: "Supplier" },
    sceneIdentity: "scene:flow",
    visualRole: "flow-node",
  });
  assert.equal(supplierA.actor?.canonicalObjectKind, supplierB.actor?.canonicalObjectKind);
  assert.notEqual(supplierA.actor?.canonicalObjectId, supplierB.actor?.canonicalObjectId);
  assert.equal(supplierA.actor?.displayLabel, supplierB.actor?.displayLabel);
});

test("8 — Display labels are not used as identity authority", () => {
  const twin = resolveDthExpTheatreActor({
    object: { id: "obj-market-west", kind: "object", label: "Market" },
    sceneIdentity: "scene:flow",
  });
  assert.equal(twin.actor?.labelIsIdentityAuthority, false);
  assert.equal(twin.actor?.canonicalObjectId, "obj-market-west");
  assert.equal(twin.actor?.displayLabel, "Market");
  assert.equal(twin.actor?.referent.canonicalObjectId, "obj-market-west");
});

test("9 — Focus/emphasis changes presentation only", () => {
  const object = catalogObject("obj-budget");
  const before = JSON.stringify(object);
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-budget", catalog));
  const beforeTheatre = JSON.stringify(theatre.visibleExecutiveObjects);
  const scene = projectDthExpTheatreScene({
    theatre,
    attentionByCanonicalObjectId: {
      "obj-budget": "focal",
      "obj-revenue": "emphasized",
      "obj-delivery": "contextual",
    },
  });
  assert.equal(JSON.stringify(object), before);
  assert.equal(JSON.stringify(theatre.visibleExecutiveObjects), beforeTheatre);
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-budget")?.attention, "focal");
  assert.equal(scene.writes.canonicalObjects, false);
});

test("10 — Hidden/de-emphasized actors remain canonical Objects", () => {
  const hidden = resolveDthExpTheatreActor({
    object: catalogObject("obj-risk"),
    sceneIdentity: "scene:investigate",
    attention: "hidden",
    presentation: { visibility: "hidden" },
  });
  const faded = resolveDthExpTheatreActor({
    object: catalogObject("obj-inventory"),
    sceneIdentity: "scene:investigate",
    attention: "de-emphasized",
  });
  assert.equal(hidden.actor?.attention, "hidden");
  assert.equal(hidden.actor?.canonicalObjectId, "obj-risk");
  assert.equal(hidden.actor?.isTheatreActorNotBusinessObject, true);
  assert.equal(faded.actor?.attention, "de-emphasized");
  assert.equal(faded.actor?.canonicalObjectId, "obj-inventory");
});

test("11 — VAI analytical role and Theatre visual role remain independent", () => {
  const leverImpact = resolveDthExpTheatreActor({
    object: catalogObject("obj-capacity"),
    sceneIdentity: "scene:impact",
    visualRole: "impact-node",
    vaiRole: "LEVER",
  });
  const leverCause = resolveDthExpTheatreActor({
    object: catalogObject("obj-capacity"),
    sceneIdentity: "scene:cause",
    visualRole: "cause-node",
    vaiRole: "LEVER",
  });
  assert.equal(leverImpact.actor?.vaiRoleRef, "LEVER");
  assert.equal(leverImpact.actor?.visualRole, "impact-node");
  assert.equal(leverCause.actor?.visualRole, "cause-node");
  assert.equal(leverCause.actor?.vaiRoleRef, "LEVER");
  assert.equal(leverImpact.actor?.visualRoleMutatesVaiRole, false);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.visualRoleEqualsVaiRole, false);
  assert.deepEqual([...DTH_EXP_VAI_ROLE_AUTHORITY], [
    "LEVER",
    "OUTCOME",
    "PATH_OF_EFFECT",
    "MODERATOR",
    "CONTROL",
    "CONFOUNDER",
  ]);
});

test("12 — Evidence/Decision/Execution/Outcome state is not mutated", () => {
  const resolved = resolveDthExpTheatreActor({
    object: { ...catalogObject("obj-delivery"), evidenceRef: "cc8:otd" },
    sceneIdentity: "scene:outcome",
    visualRole: "outcome-marker",
  });
  assert.equal(resolved.writes.evidence, false);
  assert.equal(resolved.writes.decisionState, false);
  assert.equal(resolved.writes.executionState, false);
  assert.equal(resolved.writes.outcomeState, false);
  assert.equal(resolved.writes.kpiTruth, false);
  const scene = projectDthExpTheatreScene({ theatre: dth() });
  assert.equal(scene.writes.evidence, false);
  assert.equal(scene.writes.decisionState, false);
  assert.equal(scene.writes.executionState, false);
  assert.equal(scene.writes.outcome, false);
});

test("13 — Existing Stage authority remains unchanged", () => {
  const theatre = dth();
  const scene = projectDthExpTheatreScene({ theatre });
  assert.equal(scene.secondStage, false);
  assert.equal(scene.stageHost, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.stageHost, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.parallelStageStore, false);
});

test("14 — Existing Director authority remains unchanged", () => {
  const scene = projectDthExpTheatreScene({ theatre: dth() });
  assert.equal(scene.secondDirector, false);
  assert.equal(scene.directorComposition.authority, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.director, "DIR:1");
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.parallelPresentationAuthority, false);
});

test("15 — Invalid/missing canonical Object references fail safely", () => {
  const missing = resolveDthExpTheatreActor({
    object: null,
    sceneIdentity: "scene:x",
  });
  assert.equal(missing.status, "failed");
  assert.equal(missing.actor, null);
  assert.deepEqual([...missing.limitations], ["missing-canonical-object"]);
  const blank = resolveDthExpTheatreActor({
    object: { id: "   ", label: "Ghost" },
    sceneIdentity: "scene:x",
  });
  assert.equal(blank.status, "failed");
  assert.equal(blank.actor, null);
  const mismatch = describeDthExpVisualRoleTransition({
    from: resolveDthExpTheatreActor({
      object: { id: "obj-a", label: "A" },
      sceneIdentity: "s1",
    }).actor,
    to: resolveDthExpTheatreActor({
      object: { id: "obj-b", label: "A" },
      sceneIdentity: "s2",
    }).actor,
  });
  assert.equal(mismatch.projectionStatus, "failed");
  assert.ok(mismatch.limitations.includes("canonical-identity-mismatch"));
});

test("16 — DTH-EXP:1 invariants remain green via scene projection", () => {
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const before = JSON.parse(JSON.stringify(theatre));
  const scene = projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(theatre)), before);
  assert.equal(scene.identity, "NPA-T DTH-EXP:1/TheatreFoundation");
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
  assert.equal(scene.nexoFamiliesImplemented, false);
  assert.equal(DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY.nexoFamiliesImplemented, false);
});
