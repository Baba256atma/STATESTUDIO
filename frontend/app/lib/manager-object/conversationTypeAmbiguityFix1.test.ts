import assert from "node:assert/strict";
import test from "node:test";

import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyConversationContinuity } from "./conversationContinuitySnapshot.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { interpretContextualManagerTurn } from "./nexoraMvpFinal62ConversationContinuity.ts";
import { freezePendingClarification } from "./nexoraMvpFinal63ClarificationGate.ts";
import { interpretClarificationTurn } from "./nexoraMvpFinal63ClarificationResolver.ts";
import { applyResumedMeaningToIntent } from "./nexoraMvpFinal63SmartClarification.ts";

const subjects = projectDefaultNexoraMvpConversationalSubjects();

function pendingTypeStatus() {
  return freezePendingClarification({
    identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    reason: "TYPE_AMBIGUITY",
    originalUtterance: "What is its status?",
    requestedOperation: "STATUS",
    candidates: Object.freeze([
      Object.freeze({ subjectId: "decision-capacity", canonicalName: "Capacity Decision", subjectKind: "decision" }),
      Object.freeze({ subjectId: "execution-capacity", canonicalName: "Capacity Execution", subjectKind: "execution" }),
    ]),
    expectedAnswer: "choice",
    binaryCandidateId: null,
    question: "Are you asking about the decision or the execution?",
    questionSignature: "TYPE_AMBIGUITY:decision-capacity,execution-capacity:status",
    loopCount: 0,
    parked: false,
    consequence: "NAVIGATION",
    originalIntentKind: "unknown",
  });
}

function resolveAnswer(utterance: string) {
  const turnMeaning = interpretCanonicalManagerMeaning({ utterance, subjects });
  const contextual = interpretContextualManagerTurn({
    turnMeaning,
    subjects,
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: null,
    managerSession: createEmptyManagerObjectSession(),
    stageFocusedId: null,
  });
  const fresh = resolveNexoraConversationalIntent({ utterance });
  const clarification = interpretClarificationTurn({
    turnMeaning,
    contextual,
    pending: pendingTypeStatus(),
    continuity: createEmptyConversationContinuity(),
    subjects,
    intentKind: fresh.intent.kind,
  });
  return Object.freeze({
    clarification,
    resumed: applyResumedMeaningToIntent(fresh, contextual, clarification),
  });
}

test("TYPE-AMBIGUITY-FIX:1 valid Decision clarification consumes once and resumes Decision status", () => {
  const result = resolveAnswer("I mean the Decision.");
  assert.equal(result.clarification.action, "resume");
  assert.equal(result.clarification.pending, null);
  assert.equal(result.clarification.resumeReference?.subjectId, "decision-capacity");
  assert.equal(result.resumed.intent.kind, "decision-status");
  assert.equal(result.clarification.commitsDecision, false);
  assert.equal(result.clarification.startsExecution, false);
});

test("TYPE-AMBIGUITY-FIX:1 valid Execution clarification stays isolated from Decision", () => {
  const result = resolveAnswer("The Execution.");
  assert.equal(result.clarification.action, "resume");
  assert.equal(result.clarification.pending, null);
  assert.equal(result.clarification.resumeReference?.subjectId, "execution-capacity");
  assert.equal(result.resumed.intent.kind, "execution-status");
  assert.equal(result.clarification.commitsDecision, false);
  assert.equal(result.clarification.startsExecution, false);
});

test("TYPE-AMBIGUITY-FIX:1 insufficient clarification does not guess or clear pending state", () => {
  const result = resolveAnswer("Maybe.");
  assert.equal(result.clarification.action, "clarify");
  assert.ok(result.clarification.pending);
  assert.equal(result.clarification.resumeReference, null);
  assert.equal(result.resumed.intent.kind, "unknown");
  assert.equal(result.clarification.commitsDecision, false);
  assert.equal(result.clarification.startsExecution, false);
});
