import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix14-r2-${utterance}`,
  });
}

test("R2: complete back navigation reaches the existing history authority", () => {
  const revenue = run("Focus on Revenue");
  const capacity = run("Focus on Capacity", revenue);
  const back = run("Go back", capacity);

  assert.equal(back.intentResult.intent.kind, "navigate-back");
  assert.equal(back.status, "applied");
  assert.equal(back.commandResult?.command?.kind, "navigate-back");
  assert.equal(back.runtimeResult?.status, "applied");
  assert.equal(back.nextRuntimeState.focusedSubject?.id, "obj-revenue");
  assert.equal(back.clarificationTurn.action, "proceed");
});

test("R2: non-commitment clarification does not capture independent navigation", () => {
  const revenue = run("Focus on Revenue");
  const capacity = run("Focus on Capacity", revenue);
  const pending = run("Go back to the supplier problem.", capacity);
  assert.equal(pending.status, "clarification-required");
  assert.equal(pending.managerObjectTurn.session.pendingClarification?.consequence, "NAVIGATION");

  const back = run("Go back", pending);
  assert.equal(back.status, "applied");
  assert.equal(back.nextRuntimeState.focusedSubject?.id, "obj-revenue");
  assert.equal(back.managerObjectTurn.session.pendingClarification, null);
});

test("R2: no-target back navigation remains a no-fabrication runtime no-op", () => {
  const back = run("Go back");

  assert.equal(back.intentResult.intent.kind, "navigate-back");
  assert.equal(back.status, "applied");
  assert.equal(back.nextRuntimeState.mode, "overview");
  assert.equal(back.nextRuntimeState.focusedSubject, null);
  assert.equal(back.nextConversationContext.currentSubjectId, null);
});

test("R2: genuine clarification answers and named historical returns keep their semantics", () => {
  const pending = run("Go back to the supplier problem.");
  const answer = run("Capacity.", pending);
  assert.equal(answer.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(answer.managerObjectTurn.session.pendingClarification, null);

  const delivery = run("Show Delivery.", answer);
  const customer = run("What about the customer impact?", delivery);
  const returned = run("Go back to the delivery issue.", customer);
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.notEqual(returned.status, "clarification-required");
});

test("R2: unrelated wording containing back is not navigation", () => {
  const result = resolveNexoraConversationalIntent({
    utterance: "What is holding Revenue back?",
  });
  assert.notEqual(result.intent.kind, "navigate-back");
});
