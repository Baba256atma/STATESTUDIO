/**
 * NPA-T DTH-EXP:1 — Theatre Foundation tests.
 * Projection only. Does not implement Nexo families, animation, or a second Stage/Director.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  nexoraDecisionTheatreFoundationIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_CONTEXTUAL_ROLES } from "@/app/lib/vai/vaiContract.ts";
import {
  DTH_EXP_AUTHORITY_BOUNDARY,
  DTH_EXP_NEXO_FAMILY_IMPLEMENTATION,
  DTH_EXP_NEXO_SCENE_FAMILIES,
  DTH_EXP_NEXO_TIME_BOUNDARY,
  DTH_EXP_VAI_ROLE_AUTHORITY,
  DTH_EXP_VISUAL_ROLES,
  dthExpFoundationIdentity,
  dthExpPublicIndexIdentity,
  projectDthExpTheatreScene,
  verifyDthExpAuthorityBoundary,
} from "./dthExpPublicIndex.ts";
import * as PublicIndex from "./dthExpPublicIndex.ts";

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

test("DTH-EXP:1 public index and authority boundary", () => {
  assert.equal(dthExpPublicIndexIdentity, "NPA-T DTH-EXP:1/TheatreFoundationPublicIndex");
  assert.equal(dthExpFoundationIdentity, "NPA-T DTH-EXP:1/TheatreFoundation");
  assert.equal(verifyDthExpAuthorityBoundary().ok, true);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelStage, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelDirector, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.startsDthExp2, false);
  assert.deepEqual(
    [...DTH_EXP_AUTHORITY_BOUNDARY.consumptionPath],
    ["Manager Context", "Director", "Scene Composition", "Theatre Projection"],
  );
  assert.ok(Object.keys(PublicIndex).includes("projectDthExpTheatreScene"));
  assert.equal(Object.keys(PublicIndex).some((key) => /write|commit|approve|startExecution/i.test(key)), false);
});

test("1 — Theatre Scene references canonical Objects", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const theatre = dth(focused);
  const scene = projectDthExpTheatreScene({ theatre });
  assert.equal(scene.projectionStatus, "ok");
  assert.ok(scene.participatingCanonicalObjectIds.includes("obj-revenue"));
  assert.ok(scene.focalCanonicalObjectIds.includes("obj-revenue"));
  const actor = scene.actors.find((item) => item.canonicalObjectId === "obj-revenue");
  assert.ok(actor);
  assert.equal(actor?.objectAuthority, "NEX-MVP:4/catalog");
  assert.ok(
    scene.actors.every(
      (item) =>
        catalog.objects.some((object) => object.id === item.canonicalObjectId) ||
        catalog.contextSubjects.some((subject) => subject.id === item.canonicalObjectId),
    ),
  );
  assert.equal(scene.identity, dthExpFoundationIdentity);
});

test("2 — one Object can receive different visual roles without duplication", () => {
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const roles = [...DTH_EXP_VISUAL_ROLES];
  const scenes = roles.map((visualRole) =>
    projectDthExpTheatreScene({
      theatre,
      visualRolesByCanonicalObjectId: { "obj-revenue": visualRole },
    }),
  );
  const canonicalIds = scenes.map((scene) => {
    const actor = scene.actors.find((item) => item.canonicalObjectId === "obj-revenue");
    assert.equal(actor?.isCanonicalObjectDuplicate, false);
    return actor?.canonicalObjectId;
  });
  assert.ok(canonicalIds.every((id) => id === "obj-revenue"));
  assert.deepEqual(
    scenes.map((scene) => scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole),
    roles,
  );
  const actorCounts = scenes.map(
    (scene) => scene.actors.filter((item) => item.canonicalObjectId === "obj-revenue").length,
  );
  assert.ok(actorCounts.every((count) => count === 1));
});

test("3 — scene projection does not mutate canonical Object state", () => {
  const state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const theatre = dth(state);
  const beforeState = JSON.stringify(state);
  const beforeObjects = JSON.stringify(theatre.visibleExecutiveObjects);
  const beforeLifecycle = theatre.visibleExecutiveObjects.find((item) => item.id === "obj-revenue")?.lifecycleStatus;
  const scene = projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
    presentationByCanonicalObjectId: {
      "obj-revenue": {
        position: { x: 12, y: 8 },
        size: { width: 4, height: 4 },
        emphasis: "high",
      },
    },
  });
  assert.equal(JSON.stringify(state), beforeState);
  assert.equal(JSON.stringify(theatre.visibleExecutiveObjects), beforeObjects);
  assert.equal(
    theatre.visibleExecutiveObjects.find((item) => item.id === "obj-revenue")?.lifecycleStatus,
    beforeLifecycle,
  );
  assert.equal(scene.writes.canonicalObjects, false);
  const actor = scene.actors.find((item) => item.canonicalObjectId === "obj-revenue");
  assert.equal(actor?.presentation.position?.x, 12);
  assert.equal(actor?.presentationMutatesCanonicalObject, false);
});

test("4 — relationships retain existing authority/source", () => {
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const nmi = theatre.relationships[0]
    ? [
        {
          relationshipId: theatre.relationships[0].id,
          fromId: theatre.relationships[0].sourceId,
          toId: theatre.relationships[0].targetId,
          kind: "affects" as const,
          epistemicStatus: "DECLARED" as const,
          causal: false as const,
          convertsAssociationToCause: false as const,
          convertsAssumptionToFact: false as const,
          sourceAuthority: "NMI:1/relationship",
          sourceRef: "nmi:src:revenue-link",
        },
      ]
    : [];
  const scene = projectDthExpTheatreScene({
    theatre,
    nmiRelationships: nmi,
  });
  if (nmi.length === 0) {
    assert.ok(scene.relationships.every((item) => item.sourceAuthority.length > 0));
    assert.ok(scene.relationships.every((item) => item.sourceRef.length > 0));
  } else {
    const projected = scene.relationships.find((item) => item.relationshipId === nmi[0].relationshipId);
    assert.equal(projected?.sourceAuthority, "NMI:1/relationship");
    assert.equal(projected?.sourceRef, "nmi:src:revenue-link");
  }
  assert.ok(scene.relationships.every((item) => item.impliesCausality === false));
  assert.ok(scene.relationships.every((item) => item.manufacturedCausalTruth === false));
});

test("5 — Evidence is referenced, not copied into a new truth store", () => {
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const scene = projectDthExpTheatreScene({
    theatre,
    evidenceRefsByCanonicalObjectId: { "obj-revenue": ["cc8:evidence:otd"] },
    sceneEvidenceRefs: ["cc8:evidence:scene"],
  });
  const attachments = scene.evidenceAttachments.filter((item) => item.evidenceRef === "cc8:evidence:otd");
  assert.equal(attachments.length, 1);
  assert.equal(attachments[0]?.authority, "CC:8");
  assert.equal(attachments[0]?.copiesEvidence, false);
  assert.equal(attachments[0]?.copiesDataReality, false);
  assert.equal(scene.writes.evidence, false);
  assert.equal("evidencePayload" in scene, false);
});

test("6 — VAI roles are not redefined", () => {
  assert.equal(DTH_EXP_VAI_ROLE_AUTHORITY, VAI_CONTEXTUAL_ROLES);
  assert.deepEqual([...DTH_EXP_VAI_ROLE_AUTHORITY], [
    "LEVER",
    "OUTCOME",
    "PATH_OF_EFFECT",
    "MODERATOR",
    "CONTROL",
    "CONFOUNDER",
  ]);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.variableRoles, "VAI:1–8");
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelVaiRoleAuthority, false);
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const ok = projectDthExpTheatreScene({
    theatre,
    vaiRoleByCanonicalObjectId: { "obj-revenue": "LEVER" },
  });
  assert.equal(ok.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.vaiRoleRef, "LEVER");
  const rejected = projectDthExpTheatreScene({
    theatre,
    vaiRoleByCanonicalObjectId: { "obj-revenue": "DRIVER" },
  });
  assert.equal(rejected.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.vaiRoleRef, null);
  assert.ok(rejected.limitations.some((item) => item.startsWith("unknown-vai-role:")));
  assert.equal(rejected.writes.vaiRoles, false);
});

test("7 — Director authority is not duplicated", () => {
  const theatre = dth();
  const scene = projectDthExpTheatreScene({
    theatre,
    directorPlan: {
      intent: "NO_CHANGE",
      primaryTarget: null,
      targets: Object.freeze([]),
      collection: null,
      relationship: null,
      framing: "PRESERVE",
      stageEffect: "NONE",
      currentStageMode: "OVERVIEW",
      desiredStageMode: "OVERVIEW",
      alreadySatisfied: true,
      mutationRequired: false,
      presentationRelevant: false,
      businessMutationAllowed: false,
      reason: "preserve",
      authority: nexoraSemanticPresentationDirectorIdentity,
      preservesConversationTruth: true,
    },
  });
  assert.equal(scene.secondDirector, false);
  assert.equal(scene.directorComposition.secondDirector, false);
  assert.equal(scene.directorComposition.authority, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(scene.directorComposition.automaticNexoSelection, false);
  assert.equal(scene.writes.directorPlans, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.directorIntent, "DIR:1/SemanticPresentationDirectorStageIntentFoundation");
});

test("8 — existing Stage authority is preserved", () => {
  const theatre = dth();
  const scene = projectDthExpTheatreScene({ theatre });
  assert.equal(scene.secondStage, false);
  assert.equal(scene.stageHost, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(scene.stageInteractionAuthority, "NEX-MVP:4/NexoraObjectInteraction");
  assert.equal(theatre.sceneProvenance.stageAuthority, scene.stageHost);
  assert.equal(theatre.sceneProvenance.adapterIsParallelAuthority, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelStage, false);
});

test("9 — no new Decision/Execution/Outcome writer exists", () => {
  const scene = projectDthExpTheatreScene({ theatre: dth() });
  assert.equal(scene.writes.decisionState, false);
  assert.equal(scene.writes.executionState, false);
  assert.equal(scene.writes.outcome, false);
  assert.equal(scene.writes.learning, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelDecisionWriter, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelExecutionWriter, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.parallelOutcomeWriter, false);
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.execution, "CC:11");
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.outcome, "CORE-OUT / DTH:11");
});

test("10 — missing or partial Theatre projection fails safely", () => {
  const missing = projectDthExpTheatreScene({});
  assert.equal(missing.projectionStatus, "failed");
  assert.deepEqual([...missing.limitations], ["missing-theatre-projection"]);
  assert.equal(missing.actors.length, 0);
  assert.equal(missing.safeFallback, "preserve-existing-stage-and-dth");
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const partial = projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: {
      "obj-revenue": "bubble",
      "obj-missing": "bar",
    },
  });
  assert.equal(partial.projectionStatus, "partial");
  assert.ok(partial.limitations.includes("unknown-canonical-object:obj-missing"));
  assert.equal(partial.actors.some((item) => item.canonicalObjectId === "obj-missing"), false);
  assert.equal(partial.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "bubble");
});

test("11 — existing DTH behavior remains compatible", () => {
  const theatre = dth(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const before = JSON.parse(JSON.stringify(theatre));
  projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: { "obj-revenue": "impact-node" },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(theatre)), before);
  assert.equal(theatre.identity, nexoraDecisionTheatreFoundationIdentity);
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(theatre.writes.decisionState, false);
  assert.equal(theatre.sceneProvenance.directorAuthority, nexoraSemanticPresentationDirectorIdentity);
});

test("12 — NexoTime does not introduce a second Timeline authority", () => {
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineTheatreSystem, false);
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineEngine, false);
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.nexoTimeImplemented, false);
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.timelineIsVisualizationTechniqueInsideNexoTime, true);
  assert.equal(DTH_EXP_NEXO_FAMILY_IMPLEMENTATION.NexoTime, false);
  assert.equal(DTH_EXP_NEXO_SCENE_FAMILIES.includes("NexoTime"), true);
  const scene = projectDthExpTheatreScene({
    theatre: dth(),
    visualRolesByCanonicalObjectId: {},
  });
  assert.equal(scene.nexoTimeParallelTimeline, false);
  assert.equal(scene.nexoFamiliesImplemented, false);
});
