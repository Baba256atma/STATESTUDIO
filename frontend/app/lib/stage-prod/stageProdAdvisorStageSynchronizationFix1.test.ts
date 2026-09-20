/** NPA-T STAGE-PROD:7-FIX1 — context-owned typed deictic references. */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import {
  activateManagerObjectFromClick,
  createEmptyManagerObjectSession,
  type ManagerObjectSession,
} from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function talk(
  utterance: string,
  options: Readonly<{
    previous?: Turn;
    runtime?: NexoraMVPObjectInteractionState;
    session?: ManagerObjectSession;
  }> = {},
): Turn {
  const previous = options.previous;
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: previous?.nextExecutiveContext,
    conversationContext: previous?.nextConversationContext,
    executiveSubjects: subjects,
    runtimeState: options.runtime ?? previous?.nextRuntimeState ?? initial(),
    catalog,
    previousManagerObjectSession:
      options.session ??
      previous?.managerObjectTurn.session ??
      createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    messageIdSeed: `stage-prod-7-fix1:${utterance}`,
  });
}

function assertClarifiesWithoutRisk(result: Turn): void {
  assert.equal(result.status, "clarification-required");
  assert.match(result.response, /which|clarif|do you mean/i);
  assert.equal(result.contextualManagerMeaning.objectReference, null);
  assert.notEqual(result.managerObjectTurn.activeObjectId, "obj-risk");
  assert.notEqual(result.nextRuntimeState.focusedSubject?.id, "obj-risk");
}

test("A — context-free this risk remains unresolved", () => {
  assertClarifiesWithoutRisk(talk("Explain this risk."));
});

test("B — exact canonical Stage-selected Risk owns this risk", () => {
  const runtime = selectNexoraMVPInteractionSubject(initial(), "obj-risk", catalog);
  const session = activateManagerObjectFromClick(
    createEmptyManagerObjectSession(),
    "obj-risk",
  );
  const result = talk("Explain this risk.", { runtime, session });
  assert.equal(result.managerObjectTurn.activeObjectId, "obj-risk");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-risk");
  assert.match(result.response, /Risk/i);
});

test("C — exact conversational Risk owns this risk", () => {
  const named = talk("Explain Risk.");
  const result = talk("Tell me more about this risk.", { previous: named });
  assert.equal(result.managerObjectTurn.activeObjectId, "obj-risk");
  assert.equal(
    result.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
    "obj-risk",
  );
});

test("D — a previously active Risk cannot resurrect after context changes", () => {
  const risk = talk("Explain Risk.");
  const capacity = talk("Explain Capacity Gap.", { previous: risk });
  assert.equal(capacity.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
  assertClarifiesWithoutRisk(talk("Explain this risk.", { previous: capacity }));
});

test("E — a current Problem is not substituted for a Risk", () => {
  const capacity = talk("Explain Capacity Gap.");
  const result = talk("Explain this risk.", { previous: capacity });
  assertClarifiesWithoutRisk(result);
  assert.notEqual(result.contextualManagerMeaning.objectReference?.subjectId, "ctx-problem-capacity");
});

test("F — explicit named Risk resolution is unchanged", () => {
  const result = talk("Explain Risk.");
  assert.equal(result.contextualManagerMeaning.objectReference?.subjectId, "obj-risk");
  assert.equal(result.managerObjectTurn.activeObjectId, "obj-risk");
  assert.match(result.response, /Risk/i);
});

test("G — generic it preserves a valid Stage-selected referent", () => {
  const runtime = selectNexoraMVPInteractionSubject(
    initial(),
    "ctx-problem-capacity",
    catalog,
  );
  const session = activateManagerObjectFromClick(
    createEmptyManagerObjectSession(),
    "ctx-problem-capacity",
  );
  const result = talk("Explain it.", { runtime, session });
  assert.equal(result.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "ctx-problem-capacity");
  assert.match(result.response, /Capacity Gap/i);
});

test("H — unresolved typed deictic repair performs zero canonical business writes", () => {
  const runtime = initial();
  const result = talk("Explain this risk.", { runtime });
  assert.equal(result.shouldCommitRuntime, false);
  assert.deepEqual(result.nextRuntimeState, runtime);
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(result.commandResult, null);
});
