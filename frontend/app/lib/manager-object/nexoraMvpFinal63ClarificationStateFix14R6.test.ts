import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { evaluateClarificationGate } from "./nexoraMvpFinal63ClarificationGate.ts";
import { interpretContextualManagerTurn } from "./nexoraMvpFinal62ConversationContinuity.ts";

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
    messageIdSeed: `fix14-r6-${utterance}`,
  });
}

function competingPending(): Turn {
  const capacity = run("Show Capacity.", run("Show Delivery."));
  const pending = run("Explain that.", capacity);
  assert.equal(pending.clarificationTurn.action, "clarify");
  assert.ok(pending.managerObjectTurn.session.pendingClarification);
  return pending;
}

test("R6 A/B: current-turn compound ambiguity clarifies cold and with an active candidate", () => {
  const cold = run("Show the risk problem.");
  assert.equal(cold.clarificationTurn.action, "clarify");

  const afterRisk = run("Show the risk problem.", run("Show Risk."));
  assert.equal(afterRisk.naturalLanguageUnderstanding.ambiguity.unresolved, true);
  assert.equal(afterRisk.naturalLanguageUnderstanding.objectReference, null);
  assert.deepEqual(
    afterRisk.naturalLanguageUnderstanding.ambiguity.candidates
      .map((candidate) => candidate.subjectId)
      .sort(),
    ["ctx-problem-capacity", "ctx-problem-margin", "obj-risk"],
  );
  assert.equal(afterRisk.clarificationTurn.action, "clarify");
  assert.ok(afterRisk.managerObjectTurn.session.pendingClarification);
});

test("R6 C: context still resolves deictic and typed references it can reduce to one subject", () => {
  const sustained = run("Explain it.", run("Show Capacity.", run("Show Delivery.")));
  const that = run("Explain that.", sustained);
  assert.equal(that.clarificationTurn.action, "proceed");
  assert.equal(that.contextualManagerMeaning.objectReference?.subjectId, "obj-capacity");

  const evidence = run("What evidence do we have on that?", sustained);
  assert.equal(evidence.clarificationTurn.action, "proceed");

  const claim = run("What supports that claim?", run("Switch to inventory.", run("Show Capacity.")));
  assert.equal(claim.clarificationTurn.action, "proceed");
  assert.equal(claim.contextualManagerMeaning.objectReference?.subjectId, "obj-inventory");

  const it = run("Explain it.", run("Show Capacity.", run("Show Delivery.")));
  assert.equal(it.clarificationTurn.action, "proceed");
  assert.equal(it.contextualManagerMeaning.objectReference?.subjectId, "obj-capacity");
});

test("R6 D/E: Explain that clarifies only while two recent subjects compete", () => {
  competingPending();

  const single = run("Explain that.", run("Show Delivery."));
  assert.equal(single.clarificationTurn.action, "proceed");
  assert.equal(single.contextualManagerMeaning.objectReference?.subjectId, "obj-delivery");
});

test("R6 F: a live clarification resumes the original operation and chosen subject", () => {
  const byName = run("Capacity.", competingPending());
  assert.equal(byName.clarificationTurn.action, "resume");
  assert.equal(byName.clarificationTurn.resumeReference?.canonicalName, "Capacity");
  assert.equal(byName.intentResult.intent.kind, "explain");
  assert.equal(byName.managerObjectTurn.session.pendingClarification, null);

  const byOrdinal = run("The first one.", competingPending());
  assert.equal(byOrdinal.clarificationTurn.action, "resume");
  assert.equal(byOrdinal.managerObjectTurn.session.pendingClarification, null);
});

test("R6 G: reset and cancel clear clarification without wiping canonical context", () => {
  const pending = competingPending();
  const fresh = executeNexoraConversationalExperience({
    utterance: "Capacity.",
    executiveSubjects: subjects,
    runtimeState: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    catalog,
    previousManagerObjectSession: createEmptyManagerObjectSession(),
    messageIdSeed: "fix14-r6-reset",
  });
  assert.equal(fresh.managerObjectTurn.session.pendingClarification, null);

  const cancelled = run("Never mind.", pending);
  assert.equal(cancelled.managerObjectTurn.session.pendingClarification, null);
  assert.equal(
    cancelled.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
    "obj-capacity",
  );
});

test("R6 H/I: independent change and navigation requests supersede non-commitment clarification", () => {
  const changed = run("What changed?", competingPending());
  assert.notEqual(changed.clarificationTurn.action, "clarify");
  assert.equal(changed.managerObjectTurn.session.pendingClarification, null);

  const back = run("Go back.", competingPending());
  assert.equal(back.intentResult.intent.kind, "navigate-back");
  assert.notEqual(back.clarificationTurn.action, "clarify");
  assert.equal(back.managerObjectTurn.session.pendingClarification, null);
});

test("R6 J: commitment with competing recent subjects still requires a safe referent", () => {
  const capacity = run("Show Capacity.", run("Show Delivery."));
  const continuity = capacity.managerObjectTurn.session.conversationContinuity ?? null;
  const turnMeaning = interpretCanonicalManagerMeaning({ utterance: "Approve that.", subjects });
  const contextual = interpretContextualManagerTurn({
    turnMeaning,
    subjects,
    previousContinuity: continuity,
    executiveContext: null,
    managerSession: capacity.managerObjectTurn.session,
    stageFocusedId: null,
  });
  const gate = evaluateClarificationGate({
    contextual,
    intentKind: "commit-decision",
    continuity,
    subjects,
  });
  assert.equal(gate.consequence, "COMMITMENT");
  assert.equal(gate.required, true);

  const turn = run("Approve that.", capacity);
  assert.equal(turn.clarificationTurn.commitsDecision, false);
  assert.notEqual(turn.intentResult.intent.kind, "confirm-decision-commitment");
});
