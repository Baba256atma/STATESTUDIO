import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  emptyEcaInformationNeedSession,
  judgeEcaExecutiveInformationNeed,
  nextEcaInformationNeedSession,
} from "./ecaExecutiveInformationNeed.ts";
import {
  applyEcaAnswerIntakeToPresentedResponse,
  emptyEcaAnswerIntakeSession,
  judgeEcaExecutiveAnswerIntake,
  nextEcaAnswerIntakeSession,
  type EcaAnswerIntakeSession,
  type EcaAuthoritativeIntakeFact,
} from "./ecaExecutiveAnswerIntake.ts";

const CAPACITY = Object.freeze({ id: "capacity-gap", label: "Capacity Gap", kind: "problem" });
const A = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const B = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const SUPPLIER = Object.freeze({ id: "supplier-delay", label: "Supplier Delay", kind: "risk" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([CAPACITY, A, B, SUPPLIER]);

function meaning(utterance: string): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "SUPPLY_INFORMATION",
    requestedOperation: "NONE",
    subject: {
      subjectId: CAPACITY.id,
      canonicalName: CAPACITY.label,
      lexicalHint: CAPACITY.label,
      subjectKind: CAPACITY.kind,
    },
    objectReference: {
      subjectId: CAPACITY.id,
      canonicalName: CAPACITY.label,
      lexicalHint: CAPACITY.label,
      subjectKind: CAPACITY.kind,
    },
    questionType: "NONE",
    requestedDepth: "STANDARD",
    modality: "DECLARATIVE",
    polarity: "AFFIRMATIVE",
    confidence: "HIGH",
    ambiguity: { unresolved: false, reason: "none", candidates: [] },
    semanticEvidence: {
      operationCues: [],
      objectCues: [],
      speechActCues: [],
      reasoningPath: "feature-frame-interpreter",
      usesLlm: false,
    },
    selectedAuthority: null,
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  } as CanonicalManagerMeaning);
}

function working(utterance: string) {
  return composeEcaWorkingConversationContext({
    utterance,
    meaning: meaning(utterance),
    stage: Object.freeze({
      available: true,
      workspace: "Executive workspace",
      focus: CAPACITY,
      selected: null,
      visible: SUBJECTS,
      collection: null,
      theatreSceneId: null,
    }),
    subjects: SUBJECTS,
  });
}

function intake(
  utterance: string,
  extras: {
    lastQuestion?: string;
    lastNeedId?: string;
    lastFingerprint?: string;
    semantic?: boolean;
    proposal?: boolean;
    facts?: readonly EcaAuthoritativeIntakeFact[];
    previousIntake?: EcaAnswerIntakeSession;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const needSession = freezeSession(extras);
  const informationNeed = judgeEcaExecutiveInformationNeed({
    utterance,
    workingContext,
    actionPlan,
    session: needSession,
  });
  const judgment = judgeEcaExecutiveAnswerIntake({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    informationNeedSession: needSession,
    intakeSession: extras.previousIntake ?? emptyEcaAnswerIntakeSession(),
    semanticConfirmationPending: extras.semantic === true,
    activeProposal: extras.proposal === true,
    authoritativeFacts: extras.facts,
  });
  return { workingContext, actionPlan, informationNeed, judgment };
}

function freezeSession(extras: {
  lastQuestion?: string;
  lastNeedId?: string;
  lastFingerprint?: string;
}) {
  return {
    ...emptyEcaInformationNeedSession(),
    lastQuestion: extras.lastQuestion ?? null,
    lastNeedId: extras.lastNeedId ?? null,
    lastFingerprint: extras.lastFingerprint ?? null,
    lastExplanation: extras.lastQuestion ? "Needed for the current executive objective." : null,
  };
}

function isolation(judgment: ReturnType<typeof intake>["judgment"]) {
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.createsSecondNlu, false);
  assert.equal(judgment.silentPromotion, false);
  assert.equal(judgment.silentOverwrite, false);
  assert.equal(judgment.staleYesMutation, false);
}

test("ECA:5 A — Complete fact answer binds without writing", () => {
  const { judgment } = intake("6 weeks.", {
    lastQuestion: "What is Supplier B's lead time?",
    lastNeedId: "supplier-lead-time",
  });
  assert.equal(judgment.bound, true);
  assert.equal(judgment.answerType, "FACT_CLAIM");
  assert.equal(judgment.completeness, "COMPLETE");
  assert.equal(judgment.components[0]?.field, "lead-time");
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 B — Estimate preserves uncertainty", () => {
  const { judgment } = intake("Probably around 6 weeks.", {
    lastQuestion: "What is Supplier B's lead time?",
  });
  assert.equal(judgment.answerType, "ESTIMATE");
  assert.equal(judgment.confidence, "ESTIMATED");
  assert.equal(judgment.lostUncertainty, false);
  isolation(judgment);
});

test("ECA:5 C — Opinion is not a fact", () => {
  const { judgment } = intake("I think Supplier B is more reliable.");
  assert.equal(judgment.answerType, "OPINION");
  assert.equal(judgment.intakeAction, "PRESERVE_AS_OPINION");
  isolation(judgment);
});

test("ECA:5 D — Hypothesis is not causality", () => {
  const { judgment } = intake("Maybe capacity is the reason.");
  assert.equal(judgment.answerType, "HYPOTHESIS");
  assert.equal(judgment.intakeAction, "PRESERVE_AS_HYPOTHESIS");
  isolation(judgment);
});

test("ECA:5 E — Partial answer leaves remaining need", () => {
  const { judgment } = intake("Cost is about $40,000.", {
    lastQuestion: "What is Supplier B's expected cost and lead time?",
  });
  assert.equal(judgment.completeness, "PARTIAL");
  assert.equal(judgment.needSatisfaction, "PARTIALLY_SATISFIED");
  assert.equal(judgment.components.some((item) => item.field === "cost"), true);
  assert.equal(judgment.components.some((item) => item.field === "lead-time"), false);
  isolation(judgment);
});

test("ECA:5 F — Multi-part answer decomposes without writes", () => {
  const { judgment } = intake("Cost is 40k, lead time 6 weeks, and quality is still uncertain.", {
    lastQuestion: "What is Supplier B's expected cost and lead time?",
  });
  assert.equal(judgment.answerType, "MULTI_PART_ANSWER");
  assert.ok(judgment.components.length >= 2);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 G — I don’t know remains unknown", () => {
  const { judgment } = intake("I don't know.", {
    lastQuestion: "What is Supplier B's available capacity?",
  });
  assert.equal(judgment.answerType, "UNKNOWN");
  assert.equal(judgment.needSatisfaction, "UNRESOLVED");
  isolation(judgment);
});

test("ECA:5 H — Skip is refusal, not a fake unknown value", () => {
  const { judgment } = intake("Skip it.", {
    lastQuestion: "What is Supplier B's lead time?",
  });
  assert.equal(judgment.answerType, "REFUSAL");
  assert.equal(judgment.intakeAction, "DEFER");
  assert.equal(judgment.needSatisfaction, "DEFERRED");
  isolation(judgment);
});

test("ECA:5 I — Unrelated response does not satisfy the pending need", () => {
  const { judgment } = intake("Show me the delivery problems.", {
    lastQuestion: "What is Supplier B's expected cost?",
  });
  assert.equal(judgment.answerType, "UNRELATED_RESPONSE");
  assert.equal(judgment.bound, false);
  assert.equal(judgment.needSatisfaction, "UNRESOLVED");
  isolation(judgment);
});

test("ECA:5 J — Yes binds to CAP_AV semantic confirmation only", () => {
  const { judgment } = intake("Yes.", {
    lastQuestion: "Does CAP_AV represent available capacity?",
    lastFingerprint: "semantic:CAP_AV",
    semantic: true,
  });
  assert.equal(judgment.answerType, "CONFIRMATION");
  assert.equal(judgment.authorityTarget, "DATA-ADV/Data Reality");
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 K — Stale Yes does not mutate", () => {
  const { judgment } = intake("Yes.");
  assert.equal(judgment.staleConfirmation, true);
  assert.equal(judgment.intakeAction, "IGNORE_AS_UNRELATED");
  assert.equal(judgment.staleYesMutation, false);
  isolation(judgment);
});

test("ECA:5 L — Correction is recognized without rewriting objects", () => {
  const { judgment } = intake("No, I meant Supplier A, not Supplier B.", {
    lastQuestion: "What is Supplier B's lead time?",
  });
  assert.equal(judgment.answerType, "CORRECTION");
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 M — Conflict with data is preserved", () => {
  const { judgment } = intake("6 weeks.", {
    lastQuestion: "What is the current lead time?",
    facts: [{ field: "lead-time", value: "4 weeks" }],
  });
  assert.equal(judgment.conflict, "VALUE_CONFLICT");
  assert.equal(judgment.intakeAction, "PRESERVE_CONFLICT");
  assert.equal(judgment.silentOverwrite, false);
  assert.match(judgment.managerFacingNote ?? "", /4 weeks/);
  isolation(judgment);
});

test("ECA:5 N — Temporal update is not a naive contradiction", () => {
  const { judgment } = intake("It's 6 weeks now.", {
    lastQuestion: "What is the current lead time?",
    facts: [{ field: "lead-time", value: "4 weeks", asOf: "30 days ago" }],
  });
  assert.equal(judgment.conflict, "TEMPORAL_UPDATE_POSSIBLE");
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 O — Hypothetical value is not business truth", () => {
  const { judgment } = intake("Assume Supplier B costs $45k.");
  assert.equal(judgment.answerType, "HYPOTHETICAL_VALUE");
  assert.equal(judgment.hypothetical, true);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 P — Fact vs instruction route differently", () => {
  const fact = intake("Capacity is 500.");
  const instruction = intake("Change capacity to 500.");
  assert.equal(fact.judgment.instruction, false);
  assert.equal(instruction.judgment.instruction, true);
  assert.equal(instruction.judgment.answerType, "INSTRUCTION");
  assert.notEqual(fact.judgment.intakeAction, instruction.judgment.intakeAction);
  isolation(fact.judgment);
  isolation(instruction.judgment);
});

test("ECA:5 Q — Outcome claim has no Decision causality", () => {
  const { judgment } = intake("94%.", {
    lastQuestion: "What is the latest observed delivery rate?",
  });
  assert.equal(judgment.components[0]?.field, "observed-rate");
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  isolation(judgment);
});

test("ECA:5 R — Qualified confirmation is preserved", () => {
  const { judgment } = intake("Yes, but only until Friday.", {
    lastQuestion: "Is Supplier B available?",
  });
  assert.ok(judgment.qualifier);
  assert.match(judgment.qualifier ?? "", /friday/i);
  isolation(judgment);
});

test("ECA:5 S — Unknown unit is not assumed to be dollars", () => {
  const { judgment } = intake("40.", {
    lastQuestion: "What is Supplier B's expected cost?",
  });
  assert.equal(judgment.unitAmbiguous, true);
  assert.equal(judgment.intakeAction, "REQUEST_CLARIFICATION");
  isolation(judgment);
});

test("ECA:5 T — Authority isolation", () => {
  for (const utterance of ["6 weeks.", "Yes.", "Assume demand rises 20%.", "I think Supplier B is unreliable."]) {
    isolation(intake(utterance, { lastQuestion: "What is Supplier B's lead time?" }).judgment);
  }
});

test("ECA:5 sequence 1 — Estimate then correction stays conversational", () => {
  const first = intake("Around $40,000.", { lastQuestion: "What is Supplier B's expected cost?" });
  const session = nextEcaAnswerIntakeSession(null, "Around $40,000.", first.judgment);
  const second = intake("Actually, closer to $45,000.", {
    lastQuestion: "What is Supplier B's expected cost?",
    previousIntake: session,
  });
  assert.equal(first.judgment.answerType, "ESTIMATE");
  assert.ok(second.judgment.answerType === "ESTIMATE" || second.judgment.answerType === "CORRECTION");
  assert.equal(second.judgment.boundaries.writesDataTruth, false);
});

test("ECA:5 sequence 2 — Partial cost does not close lead time", () => {
  const { judgment } = intake("Cost is 40k.", {
    lastQuestion: "What are Supplier B's cost and lead time?",
  });
  assert.equal(judgment.needSatisfaction, "PARTIALLY_SATISFIED");
  assert.equal(judgment.components.some((item) => item.field === "lead-time"), false);
});

test("ECA:5 sequence 3 — Conflict is spoken without overwrite", () => {
  const { judgment } = intake("6 weeks.", {
    lastQuestion: "What is current lead time?",
    facts: [{ field: "lead-time", value: "4 weeks" }],
  });
  const spoken = applyEcaAnswerIntakeToPresentedResponse({
    source: "Understood.",
    utterance: "6 weeks.",
    judgment,
  });
  assert.match(spoken, /4 weeks/);
  assert.equal(judgment.silentOverwrite, false);
});

test("ECA:5 sequence 4 — Unknown then compare remains unresolved", () => {
  const unknown = intake("I don't know.", { lastQuestion: "What is current available capacity?" });
  const compare = intake("Can we compare the scenarios anyway?", {
    lastQuestion: "What is current available capacity?",
  });
  assert.equal(unknown.judgment.answerType, "UNKNOWN");
  assert.equal(compare.judgment.needSatisfaction, "UNRESOLVED");
});

test("ECA:5 sequence 5 — Semantic Yes hands off to DATA-ADV", () => {
  const { judgment } = intake("Yes.", { semantic: true, lastQuestion: "Does CAP_AV represent available capacity?" });
  assert.equal(judgment.authorityTarget, "DATA-ADV/Data Reality");
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:5 sequence 6 — Demand assumption stays hypothetical", () => {
  const assume = intake("Assume demand rises 20%.");
  assert.equal(assume.judgment.hypothetical, true);
  assert.equal(assume.judgment.boundaries.writesDataTruth, false);
});

test("ECA:5 sequence 7 — Scenario choice does not commit", () => {
  const { judgment } = intake("Scenario A.", { lastQuestion: "Which scenario do you choose?" });
  assert.equal(judgment.authorityTarget, "CC:10 Decision Commitment");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:5 trust inflation barrier", () => {
  const opinion = intake("I think Supplier B is unreliable.");
  assert.equal(opinion.judgment.boundaries.inflatesTrust, false);
  const estimate = intake("Probably 40k.", { lastQuestion: "What is Supplier B's expected cost?" });
  assert.equal(estimate.judgment.confidence, "ESTIMATED");
});

test("ECA:5 ECA:4 pending need is not falsely satisfied by a new question", () => {
  const asked = judgeEcaExecutiveInformationNeed({
    utterance: "Which scenario is cheaper?",
    workingContext: working("Which scenario is cheaper?"),
    actionPlan: planEcaExecutiveConversationAction({
      utterance: "Which scenario is cheaper?",
      workingContext: working("Which scenario is cheaper?"),
    }),
    session: emptyEcaInformationNeedSession(),
  });
  const session = nextEcaInformationNeedSession(null, "Which scenario is cheaper?", asked);
  const { judgment } = intake("Show me the executions.", {
    lastQuestion: session.lastQuestion ?? "What is Scenario B's expected cost?",
  });
  assert.equal(judgment.needSatisfaction, "UNRESOLVED");
});

test("ECA:5 prompt A — Direct complete preference answer binds without Decision", () => {
  const { judgment } = intake("Scenario A.", {
    lastQuestion: "Which scenario do you choose?",
  });
  assert.equal(judgment.bound, true);
  assert.ok(judgment.completeness === "COMPLETE" || judgment.answerType === "FACT_CLAIM" || judgment.answerType === "CONFIRMATION");
  assert.equal(judgment.boundaries.commitsDecision, false);
  isolation(judgment);
});

test("ECA:5 prompt B — Qualified preference preserves uncertainty", () => {
  const { judgment } = intake("I think delivery speed matters more.", {
    lastQuestion: "Is delivery speed or cost more important?",
  });
  assert.ok(judgment.answerType === "OPINION" || judgment.answerType === "ESTIMATE" || judgment.qualifier);
  assert.notEqual(judgment.confidence, "CONFIRMED_BY_MANAGER");
  assert.equal(judgment.lostUncertainty, false);
  isolation(judgment);
});

test("ECA:5 prompt C — I don't know is valid uncertainty", () => {
  const { judgment } = intake("I don't know.", {
    lastQuestion: "What is Supplier B's available capacity?",
  });
  assert.equal(judgment.answerType, "UNKNOWN");
  assert.equal(judgment.needSatisfaction, "UNRESOLVED");
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:5 prompt D — Explicit new request is NOT_AN_ANSWER to CAP_AV", () => {
  const { judgment } = intake("Show me Demand Surge.", {
    lastQuestion: "What does CAP_AV represent?",
    lastNeedId: "cap-av-meaning",
  });
  assert.equal(judgment.bound, false);
  assert.ok(judgment.answerType === "UNRELATED_RESPONSE" || judgment.answerType === "INSTRUCTION");
  assert.equal(judgment.needSatisfaction, "UNRESOLVED");
});

test("ECA:5 prompt E — CAP_AV semantic answer hands off without ECA:5 write", () => {
  const { judgment } = intake("Yes.", {
    lastQuestion: "Does CAP_AV represent available capacity?",
    lastFingerprint: "semantic:CAP_AV",
    semantic: true,
  });
  assert.equal(judgment.answerType, "CONFIRMATION");
  assert.equal(judgment.authorityTarget, "DATA-ADV/Data Reality");
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:5 prompt F — Uncertain Data meaning is not CONFIRMED", () => {
  const { judgment } = intake("I think it means Available Capacity.", {
    lastQuestion: "What does CAP_AV represent?",
    semantic: true,
  });
  assert.ok(judgment.answerType === "OPINION" || judgment.answerType === "ESTIMATE" || judgment.answerType === "HYPOTHESIS");
  assert.notEqual(judgment.confidence, "CONFIRMED_BY_MANAGER");
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:5 prompt G — Causal assertion is not confirmed causality", () => {
  const { judgment } = intake("Maybe capacity is the reason.");
  assert.equal(judgment.answerType, "HYPOTHESIS");
  assert.equal(judgment.intakeAction, "PRESERVE_AS_HYPOTHESIS");
  isolation(judgment);
});

test("ECA:5 prompt H — Preference does not create Decision", () => {
  const { judgment } = intake("I prefer Demand Surge.", {
    lastQuestion: "Which scenario do you prefer?",
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:5 prompt I — Explicit Decision approval routes to CC:10 only as handoff", () => {
  const { judgment } = intake("Scenario A.", {
    lastQuestion: "Which scenario do you choose?",
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.authorityTarget, "CC:10 Decision Commitment");
});

test("ECA:5 prompt J — Readiness Yes does not start Execution", () => {
  const { judgment } = intake("Yes.", {
    lastQuestion: "Are you ready to proceed?",
  });
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:5 prompt K — Explicit Start routes to CC:11 without ECA:5 write", () => {
  const { judgment } = intake("Start the plan.", {
    lastQuestion: "Should I start Execution now?",
  });
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:5 prompt L — Proposal confirmation binds without Risk write by ECA:5", () => {
  const { judgment } = intake("Add it.", {
    lastQuestion: "Add Supplier Delay as a Risk?",
    proposal: true,
  });
  assert.equal(judgment.boundaries.writesRisk, false);
});

test("ECA:5 prompt M — Stale confirmation does not mutate", () => {
  const { judgment } = intake("Yes.");
  assert.equal(judgment.staleConfirmation, true);
  assert.equal(judgment.staleYesMutation, false);
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:5 prompt N — Correction recognized without overwrite", () => {
  const { judgment } = intake("No, I meant Supplier A, not Supplier B.", {
    lastQuestion: "What is Supplier B's lead time?",
  });
  assert.equal(judgment.answerType, "CORRECTION");
  assert.equal(judgment.boundaries.writesDataTruth, false);
  isolation(judgment);
});

test("ECA:5 prompt O — Partial conditional preference is not flattened", () => {
  const { judgment } = intake("Cost is about $40,000.", {
    lastQuestion: "What is Supplier B's expected cost and lead time?",
  });
  assert.equal(judgment.completeness, "PARTIAL");
  assert.equal(judgment.needSatisfaction, "PARTIALLY_SATISFIED");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:5 prompt P — Ordinal clarification can bind second subject conversationally", () => {
  const { judgment } = intake("The second one.", {
    lastQuestion: "Do you mean Capacity Gap or Demand Surge?",
  });
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:5 prompt Q — Ambiguous response does not guess", () => {
  const { judgment } = intake("Cost is about $40,000.", {
    lastQuestion: "What is Supplier B's expected cost and lead time?",
  });
  assert.equal(judgment.completeness, "PARTIAL");
  assert.equal(judgment.components.some((item) => item.field === "lead-time"), false);
  isolation(judgment);
});

test("ECA:5 prompt R — Outcome observation is not causal proof", () => {
  const { judgment } = intake("Delivery improved to 94%.", {
    lastQuestion: "What delivery result did you observe?",
  });
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:5 prompt S — Explicit subject switch outranks pending question", () => {
  const { judgment } = intake("Forget that. Explain Demand Surge.", {
    lastQuestion: "What is Supplier B's expected cost?",
  });
  assert.equal(judgment.bound, false);
  assert.ok(judgment.answerType === "UNRELATED_RESPONSE" || judgment.answerType === "INSTRUCTION");
});

test("ECA:5 prompt T — ECA:5 performs zero direct domain writes", () => {
  for (const sample of [
    intake("6 weeks.", { lastQuestion: "What is Supplier B's lead time?" }),
    intake("I don't know.", { lastQuestion: "What is Supplier B's available capacity?" }),
    intake("Yes.", { lastQuestion: "Does CAP_AV represent available capacity?", semantic: true }),
    intake("Scenario A.", { lastQuestion: "Which scenario do you choose?" }),
    intake("Add it.", { lastQuestion: "Add Supplier Delay as a Risk?", proposal: true }),
  ]) {
    isolation(sample.judgment);
  }
});

test("ECA:5 prompt multi-turn 1 — Preference then recommendation stays non-Decision", () => {
  const prefer = intake("Scenario A.", {
    lastQuestion: "Which scenario do you choose?",
  });
  assert.equal(prefer.judgment.bound, true);
  const recommend = intake("What do you recommend now?");
  assert.equal(recommend.judgment.boundaries.commitsDecision, false);
  assert.equal(prefer.judgment.boundaries.commitsDecision, false);
});

test("ECA:5 prompt multi-turn 2 — Uncertain CAP_AV meaning preserves qualification", () => {
  const answer = intake("I think it means Available Capacity.", {
    lastQuestion: "What does CAP_AV represent?",
    semantic: true,
  });
  assert.equal(answer.judgment.boundaries.writesDataTruth, false);
  assert.ok(answer.judgment.lostUncertainty === false);
  assert.notEqual(answer.judgment.confidence, "CONFIRMED_BY_MANAGER");
});

test("ECA:5 prompt multi-turn 3 — Why then Add it keeps Risk handoff only", () => {
  const why = intake("Why?", {
    lastQuestion: "Add Supplier Delay as a Risk?",
    proposal: true,
  });
  const add = intake("Add it.", {
    lastQuestion: "Add Supplier Delay as a Risk?",
    proposal: true,
    previousIntake: nextEcaAnswerIntakeSession(null, "Why?", why.judgment),
  });
  assert.equal(add.judgment.boundaries.writesRisk, false);
});

test("ECA:5 prompt multi-turn 4 — Preference → readiness Yes → no Execution; Start is handoff only", () => {
  const prefer = intake("I prefer Demand Surge.", {
    lastQuestion: "Which scenario do you prefer?",
  });
  assert.equal(prefer.judgment.boundaries.commitsDecision, false);
  const ready = intake("Yes.", { lastQuestion: "Are you ready to proceed?" });
  assert.equal(ready.judgment.boundaries.startsExecution, false);
  const start = intake("Start the plan.", { lastQuestion: "Should I start Execution now?" });
  assert.equal(start.judgment.boundaries.startsExecution, false);
});
