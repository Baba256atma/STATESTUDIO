/** NXA:5-FIX2 — canonical Advisor/Queue collection presentation parity. */
import assert from "node:assert/strict";
import test from "node:test";

import { mapNexoraConversationalCommand } from "../conversational-control/conversationalCommandMapper.ts";
import { resolveNexoraExecutiveConversationalContext } from "../conversational-control/conversationalContextResolver.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { mapConversationalCommandToRuntimeAction } from "../conversational-control/conversationalRuntimeActionAdapter.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "../conversational-control/executiveContextSnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionState,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import type { ExecutiveQueueCategory } from "../spatial-presentation/executiveStageProductivityContract.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function restoredExecutiveContext(subjectId: string, label: string) {
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: Object.freeze({
      subjectId,
      subjectKind: "problem",
      canonicalName: label,
      source: "runtime",
      turnIndex: 1,
    }),
    currentProblem: Object.freeze({
      subjectId,
      subjectKind: "problem",
      canonicalName: label,
      source: "runtime",
      turnIndex: 1,
    }),
    turnIndex: 1,
  });
}

function chat(
  utterance: string,
  runtimeState: NexoraMVPObjectInteractionState,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  restoreConversation = false,
) {
  const focusedId = runtimeState.focusedSubject?.id ?? null;
  return executeNexoraConversationalExperience({
    utterance,
    runtimeState,
    catalog,
    executiveSubjects: subjects,
    conversationContext: restoreConversation && focusedId
      ? Object.freeze({ currentSubjectId: focusedId })
      : previous?.nextConversationContext,
    executiveContext: restoreConversation && focusedId
      ? restoredExecutiveContext(focusedId, runtimeState.focusedSubject?.label ?? focusedId)
      : previous?.nextExecutiveContext,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa5-fix2-${utterance}`,
  });
}

function semanticPresentation(state: NexoraMVPObjectInteractionState) {
  const derived = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  return {
    mode: state.mode,
    presentationMode: derived.presentationMode ?? null,
    focused: state.focusedSubject?.id ?? null,
    selected: state.selectedSubject?.id ?? null,
    category: state.collectionContext?.category ?? null,
    members: [...(state.collectionContext?.objectIds ?? [])],
    rendered: derived.scene.objects
      .filter((item) => (state.collectionContext?.objectIds ?? []).includes(item.id) && item.opacity > 0.2)
      .map((item) => item.id),
    trailTip: state.stage2dNavigationTrail.objectIds[state.stage2dNavigationTrail.currentIndex] ?? null,
  };
}

const cases: readonly [ExecutiveQueueCategory, string][] = [
  ["problem", "show problems"],
  ["scenario", "show scenarios"],
  ["decision", "show decisions"],
  ["execution", "show executions"],
];

test("Advisor and Queue converge on the same canonical collection presentation", () => {
  for (const [category, utterance] of cases) {
    const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
    const advisor = chat(utterance, focused).nextRuntimeState;
    const queue = openNexoraMVPExecutiveQueueCollection(focused, category, catalog);
    assert.deepEqual(semanticPresentation(advisor), semanticPresentation(queue), category);
    assert.equal(advisor.focusedSubject, null, category);
    assert.ok((advisor.collectionContext?.objectIds.length ?? 0) > 0, category);
    if (category === "problem") {
      assert.match(chat(utterance, focused).response, /Current Problems/i, category);
    }
  }
});

test("Advisor still presents supported one-member Risks without inventing Queue parity", () => {
  const risk = chat("show risks", selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog));
  assert.equal(risk.nextRuntimeState.collectionContext?.category, "risk");
  assert.deepEqual(risk.nextRuntimeState.collectionContext?.objectIds, ["obj-risk"]);
  assert.equal(risk.nextRuntimeState.focusedSubject, null);
});

test("latest explicit command wins across focus and collection transitions", () => {
  let state = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  state = chat("show problems", state).nextRuntimeState;
  assert.equal(state.collectionContext?.category, "problem");
  assert.equal(state.focusedSubject, null);
  state = chat("show Capacity Gap", state).nextRuntimeState;
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(state.collectionContext, null);
  state = chat("show problems", state).nextRuntimeState;
  assert.equal(state.collectionContext?.category, "problem");
  assert.equal(state.focusedSubject, null);
});

test("knowledge and judgment turns do not mutate the presented collection", () => {
  const shown = chat("show problems", selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog));
  const before = semanticPresentation(shown.nextRuntimeState);
  const knowledge = chat("What is a Problem?", shown.nextRuntimeState, shown);
  assert.deepEqual(semanticPresentation(knowledge.nextRuntimeState), before);
  const judgment = chat("which one is more important?", shown.nextRuntimeState, shown);
  assert.deepEqual(semanticPresentation(judgment.nextRuntimeState), before);
  assert.doesNotMatch(judgment.response, /evaluated scenarios/i);
});

test("Stage readback follows the post-command collection and remains read-only", () => {
  const shown = chat("show problems", initial());
  const readback = chat("what is on stage now?", shown.nextRuntimeState, shown);
  assert.match(readback.response, /Capacity Gap/i);
  assert.match(readback.response, /Margin Pressure/i);
  assert.deepEqual(semanticPresentation(readback.nextRuntimeState), semanticPresentation(shown.nextRuntimeState));
});

test("collection trail preserves Back and Forward semantics", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const shown = chat("show problems", focused).nextRuntimeState;
  assert.equal(shown.collectionContext?.category, "problem");
  const back = stepBackNexoraMVPObjectInteraction(shown, catalog);
  assert.equal(back.focusedSubject?.id, "ctx-problem-margin");
  assert.equal(back.collectionContext, null);
  const forward = stepForwardNexoraMVPObjectInteraction(back, catalog);
  assert.equal(forward.collectionContext?.category, "problem");
  assert.equal(forward.focusedSubject, null);
});

test("rapid generic collection transitions have one deterministic last writer", () => {
  let turn = chat("show problems", initial());
  for (const utterance of ["show decisions", "show scenarios", "show problems"]) {
    turn = chat(utterance, turn.nextRuntimeState, turn);
  }
  assert.equal(turn.nextRuntimeState.collectionContext?.category, "problem");
  assert.deepEqual(turn.nextRuntimeState.collectionContext?.objectIds, ["ctx-problem-capacity", "ctx-problem-margin"]);
});

test("restored conversational subject cannot collapse an explicit collection command", () => {
  for (const subjectId of ["ctx-problem-margin", "ctx-problem-capacity"] as const) {
    const focused = selectNexoraMVPInteractionSubject(initial(), subjectId, catalog);
    const shown = chat("show problems", focused, undefined, true);
    const presentation = semanticPresentation(shown.nextRuntimeState);
    assert.equal(shown.shouldCommitRuntime, true, subjectId);
    assert.equal(presentation.presentationMode, "collection", subjectId);
    assert.equal(presentation.focused, null, subjectId);
    assert.deepEqual(presentation.members, ["ctx-problem-capacity", "ctx-problem-margin"], subjectId);
    assert.ok(presentation.members.every((id) => presentation.rendered.includes(id)), subjectId);
    assert.match(shown.response, /Capacity Gap/i);
    assert.match(shown.response, /Margin Pressure/i);
  }
});

test("unfiltered collection commands do not inherit a restored primary target", () => {
  for (const utterance of ["show problems", "show scenarios", "show decisions", "show executions"]) {
    const intent = resolveNexoraConversationalIntent({ utterance }).intent;
    const context = resolveNexoraExecutiveConversationalContext({
      intent,
      targetHints: intent.targetHints,
      conversationContext: Object.freeze({ currentSubjectId: "ctx-problem-margin" }),
      executiveSubjects: subjects,
    }).context;
    const mapping = mapNexoraConversationalCommand({ intent, context });
    const support = mapConversationalCommandToRuntimeAction(mapping.command!);
    assert.equal(support.supported, true, utterance);
    if (support.supported) {
      assert.equal(support.plan.runtimeActionKind, "open-queue-collection", utterance);
      assert.equal(support.plan.primaryTargetId, null, utterance);
    }
  }
});

test("knowledge questions do not present a collection after restored focus", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const knowledge = chat("What is Margin Pressure?", focused, undefined, true);
  assert.equal(knowledge.nextRuntimeState.focusedSubject?.id, "ctx-problem-margin");
  assert.equal(knowledge.nextRuntimeState.collectionContext, null);
});
