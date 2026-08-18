/**
 * UX:4-FIX4 — navigation trail occurrence identity invariants A–Q.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraStageInteractionBreadcrumb } from "../../executive/nex-mvp/stage/NexoraStageInteractionBreadcrumb.tsx";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createEmptyExecutiveStage2DNavigationTrail,
  pushExecutiveStage2DNavigationEntry,
  stepBackExecutiveStage2DNavigationTrail,
  stepForwardExecutiveStage2DNavigationTrail,
} from "../spatial-presentation/executiveStage2DNavigationTrail.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  executeNexoraMVPNextBestAction,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
} from "./nexoraMVPObjectInteraction.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function focusTrail(...subjectIds: string[]) {
  return subjectIds.reduce(
    (state, subjectId) =>
      selectNexoraMVPInteractionSubject(state, subjectId, catalog),
    initial(),
  );
}

function converse(
  utterance: string,
  state = initial(),
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: {},
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? state,
    catalog,
    executiveContext: previous?.nextExecutiveContext,
    pendingTurnExpectation: previous?.nextPendingTurnExpectation ?? null,
    messageIdSeed: `ux4-fix4-${utterance}`,
  });
}

function assertUnique(values: readonly string[]) {
  assert.equal(new Set(values).size, values.length);
}

test("A–B — occurrence identity is unique and stable", () => {
  let trail = createEmptyExecutiveStage2DNavigationTrail();
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-capacity");
  trail = pushExecutiveStage2DNavigationEntry(trail, "ctx-problem-capacity");
  assert.equal(trail.objectIds.length, trail.trailEntryIds.length);
  assertUnique(trail.trailEntryIds);
  const stable = [...trail.trailEntryIds];
  trail = stepBackExecutiveStage2DNavigationTrail(trail);
  trail = stepForwardExecutiveStage2DNavigationTrail(trail);
  assert.deepEqual(trail.trailEntryIds, stable);
});

test("C — legitimate repeated subject keeps distinct occurrences", () => {
  const state = focusTrail(
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-problem-capacity",
  );
  const matches = state.stage2dNavigationTrail.objectIds
    .map((subjectId, index) => ({ subjectId, index }))
    .filter((entry) => entry.subjectId === "ctx-problem-capacity");
  assert.equal(matches.length, 2);
  assert.notEqual(
    state.stage2dNavigationTrail.trailEntryIds[matches[0]!.index],
    state.stage2dNavigationTrail.trailEntryIds[matches[1]!.index],
  );
});

test("D — adjacent current-subject selection is a complete history no-op", () => {
  const before = focusTrail("obj-capacity", "ctx-problem-capacity");
  const after = selectNexoraMVPInteractionSubject(
    before,
    "ctx-problem-capacity",
    catalog,
  );
  assert.deepEqual(after.stage2dNavigationTrail, before.stage2dNavigationTrail);
  assert.equal(after.focusedSubject?.id, "ctx-problem-capacity");
});

test("E and Q — breadcrumb carries occurrence keys without React warnings", () => {
  const state = focusTrail(
    "obj-capacity",
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
    "ctx-problem-capacity",
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  const ids = presentation.breadcrumb
    .map((entry) => entry.navigationTrailEntryId)
    .filter((id): id is string => id != null);
  assert.equal(ids.length, presentation.breadcrumb.length);
  assertUnique(ids);

  const errors: unknown[][] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args);
  };
  try {
    renderToStaticMarkup(
      React.createElement(NexoraStageInteractionBreadcrumb, {
        breadcrumb: presentation.breadcrumb,
        canStepBack: presentation.canStepBack,
        canStepForward: presentation.canStepForward,
        currentObjectId: presentation.focusedSubjectId,
        currentTrailIndex:
          presentation.stage2dNavigationTrail?.currentIndex ?? -1,
        onStepBack: () => undefined,
        onStepForward: () => undefined,
        onOverview: () => undefined,
        onNavigateTrailIndex: () => undefined,
      }),
    );
  } finally {
    console.error = originalError;
  }
  assert.equal(
    errors.some((args) => /same key|unique "key"/i.test(args.join(" "))),
    false,
  );
});

test("F–G — Back and Forward restore exact repeated occurrences", () => {
  let state = focusTrail(
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-problem-capacity",
  );
  const firstGapOccurrence = state.stage2dNavigationTrail.trailEntryIds[0];
  const secondGapOccurrence = state.stage2dNavigationTrail.trailEntryIds[2];
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-scenario-capacity");
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(
    state.stage2dNavigationTrail.trailEntryIds[
      state.stage2dNavigationTrail.currentIndex
    ],
    firstGapOccurrence,
  );
  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(
    state.stage2dNavigationTrail.trailEntryIds[
      state.stage2dNavigationTrail.currentIndex
    ],
    secondGapOccurrence,
  );
});

test("H — new navigation after Back replaces the Forward branch without ID reuse", () => {
  let state = focusTrail(
    "obj-capacity",
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
  );
  const removedId = state.stage2dNavigationTrail.trailEntryIds[2];
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-risk", catalog);
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-capacity",
    "ctx-problem-capacity",
    "obj-risk",
  ]);
  assert.notEqual(state.stage2dNavigationTrail.trailEntryIds[2], removedId);
});

test("H2 — context navigation after Back focuses the requested subject", () => {
  let state = focusTrail(
    "obj-capacity",
    "ctx-scenario-capacity",
    "obj-capacity",
  );
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-scenario-capacity");
  assert.equal(state.expandExecutiveThread, false);

  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  assert.equal(state.selectedSubject?.id, "ctx-problem-margin");
  assert.equal(state.focusedSubject?.id, "ctx-problem-margin");
  assert.deepEqual(state.stage2dNavigationTrail.objectIds, [
    "obj-capacity",
    "ctx-scenario-capacity",
    "ctx-problem-margin",
  ]);
  assertUnique(state.stage2dNavigationTrail.trailEntryIds);
});

test("I–K — Advisor button and conversation produce one equivalent transition", () => {
  const risk = focusTrail("obj-risk");
  const nba =
    deriveNexoraMVPStageInteractionPresentation(risk, catalog).nextBestAction
      ?.recommendedAction;
  assert.ok(nba);
  const action = executeNexoraMVPNextBestAction(nba, catalog);
  assert.equal(action.type, "select-subject");
  if (action.type !== "select-subject") throw new Error("Expected subject action");
  const button = selectNexoraMVPInteractionSubject(
    risk,
    action.subjectId,
    catalog,
  );
  const conversation = converse("Review Margin Pressure", risk);
  assert.equal(conversation.nextRuntimeState.focusedSubject?.id, action.subjectId);
  assert.deepEqual(
    conversation.nextRuntimeState.stage2dNavigationTrail,
    button.stage2dNavigationTrail,
  );
  assert.equal(button.stage2dNavigationTrail.objectIds.length, 2);
});

test("L — Queue collection and selected subject have separate occurrence identities", () => {
  let state = openNexoraMVPExecutiveQueueCollection(
    initial(),
    "problem",
    catalog,
  );
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-capacity",
    catalog,
  );
  assert.equal(state.stage2dNavigationTrail.objectIds.length, 2);
  assert.match(state.stage2dNavigationTrail.objectIds[0]!, /collection/);
  assert.equal(
    state.stage2dNavigationTrail.objectIds[1],
    "ctx-problem-capacity",
  );
  assertUnique(state.stage2dNavigationTrail.trailEntryIds);
});

test("M–N — FIX3 review and FIX2 pending continuity remain intact", () => {
  const margin = converse("Review Margin Pressure", focusTrail("obj-risk"));
  assert.equal(margin.nextRuntimeState.focusedSubject?.id, "ctx-problem-margin");
  const capacity = converse("Focus on Capacity");
  const greeting = converse("Hi", capacity.nextRuntimeState, capacity);
  const yes = converse("yes", greeting.nextRuntimeState, greeting);
  assert.equal(yes.decisionCommitmentResult, null);
  assert.equal(yes.pendingTurnResolution?.status, "answered");
});

test("O–P — centered Stage and Advisor synchronization remain intact", () => {
  const state = focusTrail("obj-capacity", "ctx-problem-capacity");
  const base = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  const grammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const network = applyExecutiveNetworkTopologyToStagePresentation(grammar);
  const plane = applyExecutivePresentationPlaneToStagePresentation(network);
  const flat = applyExecutiveStage2DTopologyPlaneToStagePresentation(plane);
  const recomposed =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(flat);
  const presentation =
    applyExecutiveStageFixedCameraToStagePresentation(recomposed);
  const focused = presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.deepEqual(focused.targetPosition, [
    EXECUTIVE_STAGE_2D_CENTER.x,
    EXECUTIVE_STAGE_2D_CENTER.y,
    0,
  ]);
  assert.ok(
    presentation.scene.objects.every(
      (object) => object.targetPosition[2] === 0,
    ),
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, base);
  assert.equal(advisor.advisorSubjectId, "ctx-problem-capacity");
});
