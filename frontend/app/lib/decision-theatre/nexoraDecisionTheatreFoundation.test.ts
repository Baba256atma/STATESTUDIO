/**
 * DTH:1 — Decision Theatre foundation tests.
 * Projection only. Does not replace Stage, Director, Advisor, or Runtime tests.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { composeNexoraSemanticTurn } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  inspectNexoraDecisionTheatreProjection,
  nexoraDecisionTheatreCompatibilityAdapterIdentity,
  nexoraDecisionTheatreFoundationIdentity,
  nexoraDecisionTheatrePublicIndexIdentity,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  projectNexoraDecisionTheatreFoundation,
  resolveReservedTheatreRequest,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import * as PublicIndex from "./nexoraDecisionTheatrePublicIndex.ts";
import { evaluateNexoraDecisionTheatreInvariants } from "./nexoraDecisionTheatreInvariants.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function project(state: NexoraMVPObjectInteractionState, extra?: {
  readonly utterance?: string;
  readonly directorPlan?: Parameters<typeof projectNexoraDecisionTheatreFoundation>[0]["directorPlan"];
}) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    directorPlan: extra?.directorPlan ?? null,
    managerQuestion: extra?.utterance ?? null,
  });
}

function runConversation(
  utterance: string,
  state: NexoraMVPObjectInteractionState = initial(),
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: state.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: state.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: state,
    catalog,
    messageIdSeed: `dth1-${utterance}`,
  });
}

function collectionPlan(utterance: string, state = initial()) {
  const semantic = composeNexoraSemanticTurn({ utterance, catalog });
  const raw = semantic.diagnostics.collectionKind?.toLowerCase() ?? null;
  const kind =
    raw === "problem" || raw === "risk" || raw === "opportunity" ||
    raw === "scenario" || raw === "decision" || raw === "execution" || raw === "goal"
      ? raw
      : null;
  return directNexoraPresentation({
    owner: semantic.owner,
    presentationRequest: "COLLECTION",
    primaryReference: semantic.references.primary,
    references: semantic.references.references,
    collectionKind: kind,
    collectionScope: semantic.diagnostics.collectionScope,
    collectionMembers: semantic.canonicalCollectionMembers,
    currentStage: state,
  });
}

test("DTH:1 public index identity and export integrity", () => {
  assert.equal(nexoraDecisionTheatrePublicIndexIdentity, "DTH:1/DecisionTheatrePublicIndex");
  assert.equal(nexoraDecisionTheatreFoundationIdentity, "DTH:1/DecisionTheatreFoundation");
  assert.equal(
    nexoraDecisionTheatreCompatibilityAdapterIdentity,
    "DTH:1/ExistingStageCompatibilityAdapter",
  );
  assert.ok(Object.keys(PublicIndex).includes("projectNexoraDecisionTheatreFoundation"));
  assert.ok(Object.keys(PublicIndex).includes("inspectNexoraDecisionTheatreProjection"));
});

test("contract immutability, serialization, and determinism", () => {
  const theatre = project(initial());
  assert.equal(Object.isFrozen(theatre), true);
  assert.equal(Object.isFrozen(theatre.visibleExecutiveObjects), true);
  assert.throws(() => {
    (theatre as { version: string }).version = "mutated";
  });
  const again = project(initial());
  assert.equal(theatre.theatreSceneIdentity, again.theatreSceneIdentity);
  assert.deepEqual(JSON.parse(JSON.stringify(theatre)), JSON.parse(JSON.stringify(again)));
  const roundTrip = JSON.parse(JSON.stringify(theatre));
  assert.equal(roundTrip.identity, theatre.identity);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});

test("empty Stage remains stable and invents no objects", () => {
  const state = initial();
  const before = JSON.stringify(state);
  const theatre = project(state);
  assert.equal(JSON.stringify(state), before);
  assert.equal(theatre.primaryExecutiveObjectId, null);
  assert.equal(state.collectionContext ?? null, null);
  assert.equal(theatre.writes.canonicalObjects, false);
  assert.ok(
    theatre.visibleExecutiveObjects.every((item) =>
      catalog.objects.some((object) => object.id === item.id) ||
      catalog.contextSubjects.some((subject) => subject.id === item.id),
    ),
  );
});

test("single focused Object preserves focus versus selection", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const scene = deriveNexoraMVPStageInteractionPresentation(focused, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = project(focused);
  assert.equal(theatre.primaryExecutiveObjectId, "obj-revenue");
  assert.equal(theatre.selectedExecutiveObjectId, scene.selectedSubjectId);
  assert.equal(theatre.primaryExecutiveObjectId, scene.focusedSubjectId);
  assert.ok(theatre.visibleExecutiveObjects.some((item) => item.id === "obj-revenue" && item.focused));
  assert.equal(theatre.focusDistinctFromSelection, theatre.primaryExecutiveObjectId !== theatre.selectedExecutiveObjectId);
});

test("clicking an Object still centers it through existing interaction", () => {
  const next = selectNexoraMVPInteractionSubject(initial(), "obj-capacity", catalog);
  assert.equal(next.focusedSubject?.id, "obj-capacity");
  const theatre = project(next);
  assert.equal(theatre.primaryExecutiveObjectId, "obj-capacity");
  const scene = deriveNexoraMVPStageInteractionPresentation(next, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  assert.equal(scene.scene.mode, "focus");
  assert.equal(scene.focusedSubjectId, "obj-capacity");
});

test("related one-hop Objects remain disclosed and unrelated stay hidden", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const scene = deriveNexoraMVPStageInteractionPresentation(focused, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = project(focused);
  for (const id of scene.emphasizedObjectIds) {
    if (scene.scene.objects.find((object) => object.id === id)?.disclosureState === "hidden") continue;
    assert.ok(
      theatre.visibleExecutiveObjects.some((item) => item.id === id) ||
        theatre.hiddenExecutiveObjectIds.includes(id),
    );
  }
  const hiddenSceneIds = scene.scene.objects
    .filter((object) => object.disclosureState === "hidden" || object.spatialRole === "hidden")
    .map((object) => object.id);
  for (const id of hiddenSceneIds) {
    assert.ok(theatre.hiddenExecutiveObjectIds.includes(id));
    assert.equal(theatre.visibleExecutiveObjects.some((item) => item.id === id), false);
  }
  assert.equal(
    new Set(theatre.visibleExecutiveObjects.map((item) => item.id)).size,
    theatre.visibleExecutiveObjects.length,
  );
});

test("Escape / Overview and Back / Forward preserve navigation identity", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const trailBefore = state.stage2dNavigationTrail.objectIds.slice();
  const back = stepBackNexoraMVPObjectInteraction(state, catalog);
  const theatreBack = project(back);
  assert.equal(theatreBack.sceneProvenance.navigationHistoryDuplicated, false);
  assert.deepEqual(back.stage2dNavigationTrail.objectIds.slice(0, trailBefore.length), back.stage2dNavigationTrail.objectIds);
  const forward = stepForwardNexoraMVPObjectInteraction(back, catalog);
  assert.equal(project(forward).primaryExecutiveObjectId, state.focusedSubject?.id);
  const overview = resetNexoraMVPObjectInteractionOverview(state);
  const theatreOverview = project(overview);
  assert.equal(overview.mode, "overview");
  assert.equal(theatreOverview.primaryExecutiveObjectId, null);
});

test("collection presentation preserves membership without altering authority", () => {
  for (const utterance of ["show problems", "show scenarios", "show decisions", "show executions"]) {
    const plan = collectionPlan(utterance);
    if (plan.intent !== "SHOW_COLLECTION") continue;
    const stage = applyDirectorPlanToStage({ plan, state: initial(), catalog });
    const theatre = project(stage, { directorPlan: plan, utterance });
    assert.deepEqual(
      stage.collectionContext?.objectIds,
      plan.targets.map((item) => item.id),
    );
    assert.equal(plan.businessMutationAllowed, false);
    assert.equal(theatre.writes.decisionState, false);
    assert.equal(theatre.writes.executionState, false);
    assert.equal(theatre.directorProjection?.businessMutationAllowed, false);
    if (utterance === "show problems") {
      assert.deepEqual(stage.collectionContext?.objectIds, [
        "ctx-problem-capacity",
        "ctx-problem-margin",
      ]);
    }
  }
});

test("refresh produces the same canonical collection projection", () => {
  const plan = collectionPlan("show problems");
  const first = applyDirectorPlanToStage({ plan, state: initial(), catalog });
  const second = applyDirectorPlanToStage({
    plan: collectionPlan("show problems", first),
    state: first,
    catalog,
  });
  assert.equal(project(first).theatreSceneIdentity, project(second).theatreSceneIdentity);
  assert.deepEqual(first.collectionContext?.objectIds, second.collectionContext?.objectIds);
});

test("unsupported Theatre request and read-only questions preserve Stage", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const before = JSON.stringify(focused);
  const unsupported = projectNexoraDecisionTheatreFoundation({
    stageState: focused,
    catalog,
    managerQuestion: "open NexoTime replay",
    requestedTheatreCapability: "nexo-time-and-theatre-replay",
  });
  assert.equal(JSON.stringify(focused), before);
  assert.equal(unsupported.primaryExecutiveObjectId, "obj-revenue");
  assert.equal(unsupported.capabilities.requestedUnsupported, "nexo-time-and-theatre-replay");
  assert.equal(unsupported.capabilities.unsupported.includes("nexo-time-and-theatre-replay"), true);
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("nexo-graph-visual-grammar"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("war-room-atmosphere"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("scene-intent"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("scene-script"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("object-investigation"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-comparison"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-commitment"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("execution-readiness"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("live-execution"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("outcome-observation"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("learning-reassessment"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.ok(
    NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("executive-versus-iconic-object-language"),
  );
  assert.equal(resolveReservedTheatreRequest("open NexoTime replay"), "nexo-time-and-theatre-replay");
  assert.equal(resolveReservedTheatreRequest("show the NexoGraph war room"), null);
  assert.equal(resolveReservedTheatreRequest("open scene intent"), null);
  const explain = runConversation("Explain it", focused);
  assert.equal(explain.nextRuntimeState.focusedSubject?.id, "obj-revenue");
  assert.equal(explain.decisionTheatre?.primaryExecutiveObjectId, "obj-revenue");
  const comparison = runConversation("which one is more important?", focused);
  assert.equal(comparison.nextRuntimeState.focusedSubject?.id, "obj-revenue");
});

test("Advisor-readable context stays free of architecture codes", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog));
  const text = JSON.stringify(theatre.advisorReadable);
  assert.match(text, /Revenue/);
  assert.doesNotMatch(text, /DTH:1|DIR:1|NEX-MVP|REX-2|NexoGraph/);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.sceneIntentImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.sceneScriptImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.objectInvestigationImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.decisionComparisonImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.decisionCommitmentImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.executionReadinessImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.liveExecutionImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.outcomeObservationImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.learningReassessmentImplemented, true);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.businessMutationAllowed, false);
});

test("diagnostics prove the projection path without unauthorized mutation", () => {
  const state = selectNexoraMVPInteractionSubject(initial(), "obj-delivery", catalog);
  const input = Object.freeze({ stageState: state, catalog });
  const theatre = projectNexoraDecisionTheatreFoundation(input);
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: input,
  });
  assert.equal(diagnostics.preservedFocus, "obj-delivery");
  assert.ok(diagnostics.preservedObjectIds.includes("obj-delivery"));
  assert.equal(diagnostics.unauthorizedMutation, false);
  assert.equal(diagnostics.preservedPresentationLevel, "minimum");
  const unsupported = diagnostics.unsupportedFutureCapabilities as readonly string[];
  assert.equal(unsupported.includes("scene-intent"), false);
  assert.ok(unsupported.includes("visual-behavior-engine"));
  assert.equal(unsupported.includes("war-room-atmosphere"), false);
  assert.equal(diagnostics.visualAtmosphere, "none");
});

test("conversation path reuses DIR:1 then projects Theatre without a second Stage", () => {
  const problems = runConversation("show problems");
  assert.equal(problems.directorPlan?.intent, "SHOW_COLLECTION");
  assert.equal(problems.nextRuntimeState.collectionContext?.category, "problem");
  assert.equal(problems.decisionTheatre?.identity, nexoraDecisionTheatreFoundationIdentity);
  assert.deepEqual(
    problems.nextRuntimeState.collectionContext?.objectIds,
    problems.directorPlan?.targets.map((item) => item.id),
  );
  const focused = runConversation("show Margin Pressure");
  assert.equal(focused.nextRuntimeState.focusedSubject?.id, "ctx-problem-margin");
  assert.equal(focused.decisionTheatre?.primaryExecutiveObjectId, "ctx-problem-margin");
});

test("Decision and Execution confirmation safety remains outside Theatre writes", () => {
  const decisions = runConversation("show decisions");
  assert.equal(decisions.decisionTheatre?.writes.decisionState, false);
  assert.equal(decisions.decisionCommitmentResult ?? null, null);
  const executions = runConversation("show executions");
  assert.equal(executions.decisionTheatre?.writes.executionState, false);
  assert.equal(executions.decisionTheatre?.visualFoundation.decorativeAnimationIntroduced, false);
});

test("visibility, presentation level, attention, and relationship meaning are preserved", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const scene = deriveNexoraMVPStageInteractionPresentation(focused, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = project(focused);
  assert.equal(theatre.presentationLevel, focused.presentationState);
  for (const object of scene.scene.objects) {
    assert.equal(theatre.attentionByObjectId[object.id], object.attention);
  }
  for (const relationship of theatre.relationships) {
    assert.equal(relationship.impliesCausality, false);
    const source = catalog.objects.some((item) => item.id === relationship.sourceId) ||
      catalog.contextSubjects.some((item) => item.id === relationship.sourceId);
    const target = catalog.objects.some((item) => item.id === relationship.targetId) ||
      catalog.contextSubjects.some((item) => item.id === relationship.targetId);
    assert.equal(source && target, true);
  }
  assert.equal(theatre.sceneProvenance.adapterIsParallelAuthority, false);
});
