import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { freezePendingClarification } from "./nexoraMvpFinal63ClarificationGate.ts";
import { interpretClarificationTurn } from "./nexoraMvpFinal63ClarificationResolver.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import { interpretContextualManagerTurn } from "./nexoraMvpFinal62ConversationContinuity.ts";
import { createEmptyConversationContinuity } from "./conversationContinuitySnapshot.ts";

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
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix1-lifetime-${utterance}`,
  });
}

function staleMissingSubjectPending() {
  return freezePendingClarification({
    identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    reason: "MISSING_SUBJECT",
    originalUtterance: "Which one do you want me to show?",
    requestedOperation: "FOCUS",
    candidates: Object.freeze([]),
    expectedAnswer: "subject",
    binaryCandidateId: null,
    question: "Which one do you want me to show?",
    questionSignature: "MISSING_SUBJECT::Which one do you want me to show?",
    loopCount: 0,
    parked: false,
    consequence: "NAVIGATION",
    originalIntentKind: "unknown",
  });
}

function interpret(utterance: string, pending = staleMissingSubjectPending()) {
  const turnMeaning = interpretCanonicalManagerMeaning({ utterance, subjects });
  const contextual = interpretContextualManagerTurn({
    turnMeaning,
    subjects,
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: null,
    managerSession: createEmptyManagerObjectSession(),
    stageFocusedId: null,
  });
  return interpretClarificationTurn({
    turnMeaning,
    contextual,
    pending,
    continuity: createEmptyConversationContinuity(),
    subjects,
    intentKind: "unknown",
  });
}

test("genuine ambiguity can create and continue clarification", () => {
  const missing = run("Go back to the supplier problem.");
  assert.equal(missing.clarificationTurn.action === "clarify" || missing.status === "clarification-required", true);
  const continued = run("That one.", missing);
  assert.equal(
    continued.clarificationTurn.action === "clarify" ||
      continued.clarificationTurn.action === "resume" ||
      continued.status === "clarification-required",
    true,
  );
});

test("manager supplies a named subject and pending clarification closes", () => {
  const missing = run("Go back to the supplier problem.");
  const resolved = run("Show Capacity.", missing);
  assert.notEqual(resolved.clarificationTurn.action, "clarify");
  assert.equal(resolved.managerObjectTurn.session.pendingClarification, null);
  assert.equal(resolved.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});

test("explicit cancel closes pending clarification", () => {
  const missing = run("Go back to the supplier problem.");
  const cancelled = run("Never mind.", missing);
  assert.equal(cancelled.clarificationTurn.action === "cancel" || cancelled.managerObjectTurn.session.pendingClarification == null, true);
});

test("independently resolvable comparison supersedes empty-candidate pending", () => {
  const result = interpret("That option we compared earlier — remind me of the difference.");
  assert.equal(result.action, "proceed");
  assert.equal(result.cancelled, true);
  assert.equal(result.pending, null);
});

test("decision query supersedes empty-candidate pending", () => {
  const result = interpret("This decision — is it still the active one?");
  assert.equal(result.action, "proceed");
  assert.equal(result.pending, null);
});

test("change questions supersede empty-candidate pending without guessing a new subject", () => {
  for (const utterance of ["What changed?", "What's changed?", "Has anything changed?", "What changed with this?"]) {
    const result = interpret(utterance);
    assert.equal(result.action, "proceed", utterance);
    assert.equal(result.pending, null, utterance);
  }
});

test("bare deictic answer does not blindly cancel genuine pending", () => {
  const result = interpret("That one.");
  assert.notEqual(result.action, "proceed");
});

test("known historical Delivery return still resolves", () => {
  const delivery = run("Show Delivery.");
  const customer = run("What about the customer impact?", delivery);
  const returned = run("Go back to the delivery issue.", customer);
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.notEqual(returned.status, "clarification-required");
});

test("unknown named return supersedes pending clarification and still clarifies", () => {
  const schedule = run("What about the schedule issue?", run("Show Capacity."));
  assert.equal(
    schedule.clarificationTurn.action === "clarify" || schedule.status === "clarification-required",
    true,
  );
  const supplier = run("Go back to the supplier problem.", schedule);
  assert.equal(
    supplier.clarificationTurn.action === "clarify" || supplier.status === "clarification-required",
    true,
  );
  assert.equal(supplier.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.doesNotMatch(supplier.response, /Supplier Delay has been added/i);
});

test("unknown Schedule, Resource, and Supplier still do not fabricate objects", () => {
  const delivery = run("Show Delivery.");
  for (const utterance of [
    "Go back to the schedule issue.",
    "What about resources?",
    "Go back to the supplier problem.",
  ]) {
    const turn = run(utterance, delivery);
    assert.notEqual(turn.nextRuntimeState.focusedSubject?.id, "obj-supplier");
    assert.notEqual(turn.contextualManagerMeaning.objectReference?.subjectId, "obj-schedule");
    assert.notEqual(turn.contextualManagerMeaning.objectReference?.subjectId, "obj-resource");
  }
});

test("resolved clarification does not reappear after later named conversation", () => {
  const missing = run("Go back to the supplier problem.");
  const capacity = run("Show Capacity.", missing);
  const delivery = run("What about delivery?", capacity);
  const customer = run("What about the customer impact?", delivery);
  const later = run("Explain this.", customer);
  assert.notEqual(later.clarificationTurn.action, "clarify");
  assert.equal(later.managerObjectTurn.session.pendingClarification, null);
});
