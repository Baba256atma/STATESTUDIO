import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaDataContext,
  type EcaMutationProposal,
  type EcaSubject,
  type EcaWorkingConversationContext,
} from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";

const CAPACITY = Object.freeze({ id: "capacity-gap", label: "Capacity Gap", kind: "problem" });
const DEMAND = Object.freeze({ id: "demand-surge", label: "Demand Surge", kind: "problem" });
const A = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const B = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([CAPACITY, DEMAND, A, B]);
const STAGE = Object.freeze({
  available: true,
  workspace: "Executive workspace",
  focus: CAPACITY,
  selected: null,
  visible: SUBJECTS,
  collection: null,
  theatreSceneId: null,
});

function meaning(
  utterance: string,
  overrides: Partial<CanonicalManagerMeaning> = {},
): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "ASK_INFORMATION",
    requestedOperation: "NONE",
    subject: { subjectId: CAPACITY.id, canonicalName: CAPACITY.label, lexicalHint: CAPACITY.label, subjectKind: CAPACITY.kind },
    objectReference: { subjectId: CAPACITY.id, canonicalName: CAPACITY.label, lexicalHint: CAPACITY.label, subjectKind: CAPACITY.kind },
    questionType: "NONE",
    requestedDepth: "STANDARD",
    modality: "INTERROGATIVE",
    polarity: "AFFIRMATIVE",
    confidence: "HIGH",
    ambiguity: { unresolved: false, reason: "none", candidates: [] },
    semanticEvidence: { operationCues: [], objectCues: [], speechActCues: [], reasoningPath: "feature-frame-interpreter", usesLlm: false },
    selectedAuthority: null,
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
    ...overrides,
  } as CanonicalManagerMeaning);
}

function context(
  utterance: string,
  overrides: Partial<CanonicalManagerMeaning> = {},
  options: { data?: EcaDataContext; ambiguity?: boolean } = {},
): EcaWorkingConversationContext {
  const ambiguous = options.ambiguity === true;
  return composeEcaWorkingConversationContext({
    utterance,
    meaning: meaning(utterance, {
      ...overrides,
      ...(ambiguous
        ? {
            ambiguity: {
              unresolved: true,
              reason: "multiple-objects",
              candidates: [
                { subjectId: CAPACITY.id, canonicalName: CAPACITY.label, lexicalHint: CAPACITY.label, subjectKind: CAPACITY.kind },
                { subjectId: DEMAND.id, canonicalName: DEMAND.label, lexicalHint: DEMAND.label, subjectKind: DEMAND.kind },
              ],
            },
            subject: null,
            objectReference: null,
          }
        : {}),
    }),
    stage: STAGE,
    subjects: SUBJECTS,
    explicitAmbiguity: ambiguous,
    dataContext: options.data,
  });
}

function comparisonContext(utterance: string, criterion: string | null = null): EcaWorkingConversationContext {
  const base = context(utterance, { communicativeIntent: "ASK_COMPARISON", requestedOperation: "COMPARE", questionType: "COMPARISON" });
  return Object.freeze({
    ...base,
    decisionContext: Object.freeze({ comparisonSubjects: Object.freeze([A, B]), criterion }),
  });
}

function proposal(): EcaMutationProposal {
  return context("Add Supplier Delay as a Risk.", {
    subject: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" },
    objectReference: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" },
  }).mutationProposal!;
}

test("ECA:2 focused A — Explain plans EXPLAIN without Stage mutation", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Explain Capacity Gap.", workingContext: context("Explain Capacity Gap.", { communicativeIntent: "ASK_EXPLANATION", requestedOperation: "EXPLAIN", questionType: "EXPLANATION" }) });
  assert.equal(plan.intent, "EXPLAIN");
  assert.equal(plan.nextAction, "EXPLAIN");
  assert.equal(plan.boundaries.writesStage, false);
});

test("ECA:2 focused B — Investigation preserves causal uncertainty", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Why are deliveries late?", workingContext: context("Why are deliveries late?", { communicativeIntent: "REQUEST_INVESTIGATION", requestedOperation: "INVESTIGATE", questionType: "CAUSE" }) });
  assert.equal(plan.intent, "INVESTIGATE");
  assert.match(plan.uncertainty.reasons.join(" "), /No causal claim/);
});

test("ECA:2 focused C — Evidence preserves active subject", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Show me the evidence.", workingContext: context("Show me the evidence.", { communicativeIntent: "ASK_EVIDENCE", requestedOperation: "EVIDENCE", questionType: "EVIDENCE" }) });
  assert.equal(plan.intent, "INSPECT_EVIDENCE");
  assert.equal(plan.nextAction, "SHOW_EVIDENCE");
  assert.equal(plan.subjects[0]?.id, CAPACITY.id);
});

test("ECA:2 focused D — Comparison keeps both references and commits no Decision", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Compare Scenario A and Scenario B.", workingContext: comparisonContext("Compare Scenario A and Scenario B.") });
  assert.equal(plan.intent, "COMPARE");
  assert.deepEqual(plan.subjects.map((item) => item.id), [A.id, B.id]);
  assert.equal(plan.nextAction, "COMPARE");
  assert.equal(plan.boundaries.commitsDecision, false);
});

test("ECA:2 focused E — Comparison follow-up keeps set and changes criterion", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Which has lower risk?", workingContext: comparisonContext("Which has lower risk?", "cost") });
  assert.equal(plan.intent, "EVALUATE");
  assert.equal(plan.objective, "risk");
  assert.deepEqual(plan.subjects.map((item) => item.id), [A.id, B.id]);
});

test("ECA:2 focused F — Recommendation never commits a Decision", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "What should I do?", workingContext: context("What should I do?", { communicativeIntent: "ASK_RECOMMENDATION", requestedOperation: "RECOMMEND", questionType: "RECOMMENDATION" }) });
  assert.equal(plan.intent, "SEEK_RECOMMENDATION");
  assert.equal(plan.nextAction, "RECOMMEND_INVESTIGATION");
  assert.equal(plan.boundaries.commitsDecision, false);
});

test("ECA:2 focused G — Ambiguity asks and never guesses", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Investigate it.", workingContext: context("Investigate it.", { communicativeIntent: "REQUEST_INVESTIGATION", requestedOperation: "INVESTIGATE" }, { ambiguity: true }) });
  assert.equal(plan.intent, "INVESTIGATE");
  assert.equal(plan.nextAction, "ASK_CLARIFICATION");
  assert.equal(plan.subjects.length, 0);
});

test("ECA:2 focused H — Missing ranking evidence exposes uncertainty", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Which supplier risk is most serious?", workingContext: context("Which supplier risk is most serious?"), evidenceAvailability: "MISSING_AND_REQUIRED" });
  assert.equal(plan.intent, "PRIORITIZE");
  assert.equal(plan.nextAction, "SHOW_UNCERTAINTY");
  assert.ok(plan.alternatives.includes("ASK_FOR_MISSING_INFORMATION"));
});

test("ECA:2 focused I — Mutation reuses proposal and never writes", () => {
  const workingContext = context("Add Supplier Delay as a Risk.", { subject: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" }, objectReference: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" } });
  const plan = planEcaExecutiveConversationAction({ utterance: "Add Supplier Delay as a Risk.", workingContext });
  assert.equal(plan.intent, "PROPOSE_CHANGE");
  assert.equal(plan.nextAction, "PREPARE_PROPOSAL");
  assert.equal(plan.requiredContext[0]?.referenceIds[0], workingContext.mutationProposal?.proposalId);
  assert.equal(plan.boundaries.mutatesBusinessState, false);
});

test("ECA:2 focused J/K/L — confirmation is bound and cancellation calls no writer", () => {
  const activeProposal = proposal();
  const confirmed = planEcaExecutiveConversationAction({ utterance: "Add it.", workingContext: context("Add it."), activeProposal });
  assert.equal(confirmed.intent, "CONFIRM_ACTION");
  assert.equal(confirmed.nextAction, "HANDOFF_TO_CANONICAL_AUTHORITY");
  assert.equal(confirmed.authorityTarget, "Canonical Risk Writer");
  const stale = planEcaExecutiveConversationAction({ utterance: "Add it.", workingContext: context("Add it."), activeProposal: null });
  assert.equal(stale.nextAction, "NO_SAFE_ACTION");
  assert.equal(stale.authorityTarget, null);
  const cancelled = planEcaExecutiveConversationAction({ utterance: "Never mind.", workingContext: context("Never mind."), activeProposal });
  assert.equal(cancelled.intent, "CANCEL_ACTION");
  assert.equal(cancelled.authorityTarget, null);
  assert.equal(cancelled.boundaries.mutatesBusinessState, false);
});

test("ECA:2 focused M — Decision intent routes to existing authority", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "I choose Scenario A.", workingContext: comparisonContext("I choose Scenario A.") });
  assert.equal(plan.intent, "COMMIT_DECISION");
  assert.equal(plan.authorityTarget, "CC:10 Decision Commitment");
  assert.equal(plan.boundaries.commitsDecision, false);
});

test("ECA:2 focused N/O — Execution requires committed Decision", () => {
  const valid = planEcaExecutiveConversationAction({ utterance: "Start it.", workingContext: context("Start it."), lifecycle: { committedDecisionId: "decision-a" } });
  assert.equal(valid.intent, "REQUEST_EXECUTION_ACTION");
  assert.equal(valid.nextAction, "HANDOFF_TO_CANONICAL_AUTHORITY");
  assert.equal(valid.authorityTarget, "CC:11 Execution Follow-up");
  assert.equal(valid.boundaries.startsExecution, false);
  const invalid = planEcaExecutiveConversationAction({ utterance: "Start it.", workingContext: context("Start it.") });
  assert.equal(invalid.nextAction, "ASK_FOR_MISSING_INFORMATION");
  assert.equal(invalid.requiredContext[0]?.availability, "MISSING_AND_REQUIRED");
});

test("ECA:2 focused P — Outcome keeps lifecycle reference and causality boundary", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Did it work?", workingContext: context("Did it work?"), lifecycle: { executionId: "execution-a", outcomeId: "outcome-a" } });
  assert.equal(plan.intent, "REVIEW_OUTCOME");
  assert.equal(plan.authorityTarget, "Decision Theatre Outcome Intelligence");
  assert.ok(plan.requiredContext.some((item) => item.referenceIds.includes("execution-a")));
  assert.match(plan.uncertainty.reasons.join(" "), /does not establish Decision causality/);
});

test("ECA:2 focused Q — CAP_AV likely semantics remain uncertain", () => {
  const data = Object.freeze({ sourceId: "csv-1", sourceLabel: "Capacity CSV", fieldId: "CAP_AV", fieldLabel: "CAP_AV", semanticStatus: "PROPOSED" as const, evidenceRefs: Object.freeze(["csv-1:CAP_AV"]) });
  const plan = planEcaExecutiveConversationAction({ utterance: "Should I worry about CAP_AV?", workingContext: context("Should I worry about CAP_AV?", {}, { data }) });
  assert.equal(plan.intent, "EVALUATE");
  assert.equal(plan.nextAction, "SHOW_UNCERTAINTY");
  assert.match(plan.uncertainty.reasons.join(" "), /proposed, not manager-confirmed/);
});

test("ECA:2 focused R — Explicit subject switch wins", () => {
  const switched = context("Actually, investigate Demand Surge.", {
    communicativeIntent: "REQUEST_INVESTIGATION",
    requestedOperation: "INVESTIGATE",
    subject: { subjectId: DEMAND.id, canonicalName: DEMAND.label, lexicalHint: DEMAND.label, subjectKind: DEMAND.kind },
    objectReference: { subjectId: DEMAND.id, canonicalName: DEMAND.label, lexicalHint: DEMAND.label, subjectKind: DEMAND.kind },
  });
  const plan = planEcaExecutiveConversationAction({ utterance: "Actually, investigate Demand Surge.", workingContext: switched });
  assert.equal(plan.intent, "INVESTIGATE");
  assert.equal(plan.subjects[0]?.id, DEMAND.id);
});

test("ECA:2 focused S — Explicit comparison wins over Stage focus", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "Compare Scenario A and Scenario B.", workingContext: comparisonContext("Compare Scenario A and Scenario B.") });
  assert.equal(plan.intent, "COMPARE");
  assert.deepEqual(plan.subjects.map((item) => item.id), [A.id, B.id]);
  assert.notEqual(plan.subjects[0]?.id, STAGE.focus.id);
});

test("ECA:2 focused T — One primary and at most two bounded alternatives", () => {
  const plan = planEcaExecutiveConversationAction({ utterance: "What should I do?", workingContext: context("What should I do?", { communicativeIntent: "ASK_RECOMMENDATION", requestedOperation: "RECOMMEND" }), evidenceAvailability: "AVAILABLE" });
  assert.equal(plan.nextAction, "RECOMMEND_OPTION");
  assert.ok(plan.alternatives.length <= 2);
  assert.ok(plan.suggestedManagerTurns.length >= 1);
  assert.ok(plan.suggestedManagerTurns.length <= 3);
});

test("ECA:2 focused Q alternative — unconfirmed CAP_AV asks for semantic confirmation without treating it as truth", () => {
  const data = Object.freeze({ sourceId: "csv-1", sourceLabel: "Capacity CSV", fieldId: "CAP_AV", fieldLabel: "CAP_AV", semanticStatus: "PROPOSED" as const, evidenceRefs: Object.freeze(["csv-1:CAP_AV"]) });
  const plan = planEcaExecutiveConversationAction({ utterance: "Should I worry about CAP_AV?", workingContext: context("Should I worry about CAP_AV?", {}, { data }) });
  assert.equal(plan.nextAction, "SHOW_UNCERTAINTY");
  assert.ok(plan.alternatives.includes("ASK_FOR_MISSING_INFORMATION"));
  assert.equal(plan.authorityTarget, "DATA-ADV/Data Reality");
});

test("ECA:2 multi-turn 1 — Investigation evolves without losing subject", () => {
  const turns = [
    planEcaExecutiveConversationAction({ utterance: "Why are deliveries late?", workingContext: context("Why are deliveries late?", { communicativeIntent: "REQUEST_INVESTIGATION", requestedOperation: "INVESTIGATE" }) }),
    planEcaExecutiveConversationAction({ utterance: "Show me the evidence.", workingContext: context("Show me the evidence.", { communicativeIntent: "ASK_EVIDENCE", requestedOperation: "EVIDENCE" }) }),
    planEcaExecutiveConversationAction({ utterance: "Which issue should we investigate first?", workingContext: context("Which issue should we investigate first?"), evidenceAvailability: "MISSING_AND_REQUIRED" }),
    planEcaExecutiveConversationAction({ utterance: "Why?", workingContext: context("Why?", { communicativeIntent: "ASK_WHY", requestedOperation: "EXPLAIN" }) }),
  ];
  assert.deepEqual(turns.map((turn) => turn.intent), ["INVESTIGATE", "INSPECT_EVIDENCE", "PRIORITIZE", "EXPLAIN"]);
  assert.ok(turns.every((turn) => turn.subjects[0]?.id === CAPACITY.id));
});

test("ECA:2 multi-turn 2 — Show, compare, evaluate, recommend without commitment", () => {
  const turns = [
    planEcaExecutiveConversationAction({ utterance: "Show the scenarios.", workingContext: context("Show the scenarios.") }),
    planEcaExecutiveConversationAction({ utterance: "Compare A and B.", workingContext: comparisonContext("Compare A and B.") }),
    planEcaExecutiveConversationAction({ utterance: "Which is safer?", workingContext: comparisonContext("Which is safer?") }),
    planEcaExecutiveConversationAction({ utterance: "What do you recommend?", workingContext: comparisonContext("What do you recommend?"), evidenceAvailability: "AVAILABLE" }),
  ];
  assert.deepEqual(turns.map((turn) => turn.intent), ["SHOW", "COMPARE", "EVALUATE", "SEEK_RECOMMENDATION"]);
  assert.ok(turns.every((turn) => turn.boundaries.commitsDecision === false));
});

test("ECA:2 multi-turn 3 — Explanation preserves active proposal for bound confirmation", () => {
  const activeProposal = proposal();
  const why = planEcaExecutiveConversationAction({ utterance: "Why?", workingContext: context("Why?", { communicativeIntent: "ASK_WHY", requestedOperation: "EXPLAIN" }), activeProposal });
  assert.equal(why.intent, "EXPLAIN");
  const confirmation = planEcaExecutiveConversationAction({ utterance: "Add it.", workingContext: context("Add it."), activeProposal });
  assert.equal(confirmation.requiredContext[0]?.referenceIds[0], activeProposal.proposalId);
});

test("ECA:2 multi-turn 4 — Comparison, Decision, Execution stay authority-separated", () => {
  const compared = planEcaExecutiveConversationAction({ utterance: "Compare A and B.", workingContext: comparisonContext("Compare A and B.") });
  const chosen = planEcaExecutiveConversationAction({ utterance: "I choose A.", workingContext: comparisonContext("I choose A.") });
  const startWithoutDecision = planEcaExecutiveConversationAction({ utterance: "Start it.", workingContext: context("Start it.") });
  assert.equal(compared.boundaries.commitsDecision, false);
  assert.equal(chosen.authorityTarget, "CC:10 Decision Commitment");
  assert.equal(startWithoutDecision.nextAction, "ASK_FOR_MISSING_INFORMATION");
  assert.equal(startWithoutDecision.boundaries.startsExecution, false);
});
