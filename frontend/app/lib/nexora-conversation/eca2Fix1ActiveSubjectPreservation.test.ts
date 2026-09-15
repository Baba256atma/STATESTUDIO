/**
 * NPA-T ECA:2-FIX1 — Active subject context preservation.
 * Repairs ECA:1 → ECA:2 handoff when operation follow-ups omit the subject label.
 * Does not redesign ECA:2 planner empty-subject guard.
 */
import assert from "node:assert/strict";
import test from "node:test";

import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaDataContext,
  type EcaMutationProposal,
  type EcaStageContext,
  type EcaSubject,
  type EcaWorkingConversationContext,
} from "./ecaWorkingConversationContext.ts";

const CAPACITY = Object.freeze({ id: "capacity-gap", label: "Capacity Gap", kind: "problem" });
const DEMAND = Object.freeze({ id: "demand-surge", label: "Demand Surge", kind: "scenario" });
const PRICING = Object.freeze({ id: "pricing-response", label: "Pricing Response", kind: "scenario" });
const A = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const B = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([CAPACITY, DEMAND, PRICING, A, B]);
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
    modality: "INTERROGATIVE",
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
    ...overrides,
  } as CanonicalManagerMeaning);
}

function context(
  utterance: string,
  overrides: Partial<CanonicalManagerMeaning> = {},
  options: {
    data?: EcaDataContext;
    ambiguity?: boolean;
    recentSubjects?: readonly EcaSubject[];
    stage?: EcaStageContext;
  } = {},
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
                {
                  subjectId: CAPACITY.id,
                  canonicalName: CAPACITY.label,
                  lexicalHint: CAPACITY.label,
                  subjectKind: CAPACITY.kind,
                },
                {
                  subjectId: DEMAND.id,
                  canonicalName: DEMAND.label,
                  lexicalHint: DEMAND.label,
                  subjectKind: DEMAND.kind,
                },
              ],
            },
            subject: null,
            objectReference: null,
          }
        : {}),
    }),
    stage: options.stage ?? STAGE,
    subjects: SUBJECTS,
    explicitAmbiguity: ambiguous,
    dataContext: options.data,
    recentSubjects: options.recentSubjects,
  });
}

function proposal(): EcaMutationProposal {
  return context("Add Supplier Delay as a Risk.", {
    subject: {
      subjectId: null,
      canonicalName: "Supplier Delay",
      lexicalHint: "Supplier Delay",
      subjectKind: "risk",
    },
    objectReference: {
      subjectId: null,
      canonicalName: "Supplier Delay",
      lexicalHint: "Supplier Delay",
      subjectKind: "risk",
    },
  }).mutationProposal!;
}

test("ECA:2-FIX1 A — Focused C evidence preserves Capacity Gap without re-speaking the label", () => {
  const workingContext = context("Show me the evidence.", {
    communicativeIntent: "ASK_EVIDENCE",
    requestedOperation: "EVIDENCE",
    questionType: "EVIDENCE",
  });
  assert.equal(workingContext.activeSubject?.id, CAPACITY.id);
  const plan = planEcaExecutiveConversationAction({
    utterance: "Show me the evidence.",
    workingContext,
  });
  assert.equal(plan.intent, "INSPECT_EVIDENCE");
  assert.equal(plan.nextAction, "SHOW_EVIDENCE");
  assert.equal(plan.subjects[0]?.id, CAPACITY.id);
});

test("ECA:2-FIX1 B — Multi-turn investigation keeps subject across operation changes", () => {
  const turns = [
    planEcaExecutiveConversationAction({
      utterance: "Why are deliveries late?",
      workingContext: context("Why are deliveries late?", {
        communicativeIntent: "REQUEST_INVESTIGATION",
        requestedOperation: "INVESTIGATE",
      }),
    }),
    planEcaExecutiveConversationAction({
      utterance: "Show me the evidence.",
      workingContext: context("Show me the evidence.", {
        communicativeIntent: "ASK_EVIDENCE",
        requestedOperation: "EVIDENCE",
      }),
    }),
    planEcaExecutiveConversationAction({
      utterance: "Which issue should we investigate first?",
      workingContext: context("Which issue should we investigate first?"),
      evidenceAvailability: "MISSING_AND_REQUIRED",
    }),
    planEcaExecutiveConversationAction({
      utterance: "Why?",
      workingContext: context("Why?", {
        communicativeIntent: "ASK_WHY",
        requestedOperation: "EXPLAIN",
      }),
    }),
  ];
  assert.deepEqual(turns.map((turn) => turn.intent), [
    "INVESTIGATE",
    "INSPECT_EVIDENCE",
    "PRIORITIZE",
    "EXPLAIN",
  ]);
  assert.ok(turns.every((turn) => turn.subjects[0]?.id === CAPACITY.id));
});

test("ECA:2-FIX1 C — Explicit subject switch yields Capacity Gap for Demand Surge", () => {
  const workingContext = context("Actually, investigate Demand Surge.", {
    communicativeIntent: "REQUEST_INVESTIGATION",
    requestedOperation: "INVESTIGATE",
    subject: {
      subjectId: DEMAND.id,
      canonicalName: DEMAND.label,
      lexicalHint: DEMAND.label,
      subjectKind: DEMAND.kind,
    },
    objectReference: {
      subjectId: DEMAND.id,
      canonicalName: DEMAND.label,
      lexicalHint: DEMAND.label,
      subjectKind: DEMAND.kind,
    },
  });
  assert.equal(workingContext.activeSubject?.id, DEMAND.id);
  assert.notEqual(workingContext.activeSubject?.id, CAPACITY.id);
  const plan = planEcaExecutiveConversationAction({
    utterance: "Actually, investigate Demand Surge.",
    workingContext,
  });
  assert.equal(plan.intent, "INVESTIGATE");
  assert.equal(plan.subjects[0]?.id, DEMAND.id);
});

test("ECA:2-FIX1 D — Explicit new subject Explain Pricing Response wins", () => {
  const workingContext = context("Explain Pricing Response.", {
    communicativeIntent: "ASK_EXPLANATION",
    requestedOperation: "EXPLAIN",
    questionType: "EXPLANATION",
    subject: {
      subjectId: PRICING.id,
      canonicalName: PRICING.label,
      lexicalHint: PRICING.label,
      subjectKind: PRICING.kind,
    },
    objectReference: {
      subjectId: PRICING.id,
      canonicalName: PRICING.label,
      lexicalHint: PRICING.label,
      subjectKind: PRICING.kind,
    },
  });
  assert.equal(workingContext.activeSubject?.id, PRICING.id);
});

test("ECA:2-FIX1 E — Compatible deictic evidence follow-up preserves Demand Surge", () => {
  const workingContext = context(
    "Show me the evidence.",
    {
      communicativeIntent: "ASK_EVIDENCE",
      requestedOperation: "EVIDENCE",
      questionType: "EVIDENCE",
      subject: {
        subjectId: DEMAND.id,
        canonicalName: DEMAND.label,
        lexicalHint: DEMAND.label,
        subjectKind: DEMAND.kind,
      },
      objectReference: {
        subjectId: DEMAND.id,
        canonicalName: DEMAND.label,
        lexicalHint: DEMAND.label,
        subjectKind: DEMAND.kind,
      },
    },
    { recentSubjects: [DEMAND] },
  );
  assert.equal(workingContext.activeSubject?.id, DEMAND.id);
  const plan = planEcaExecutiveConversationAction({
    utterance: "Show me the evidence.",
    workingContext,
  });
  assert.equal(plan.nextAction, "SHOW_EVIDENCE");
  assert.equal(plan.subjects[0]?.id, DEMAND.id);
});

test("ECA:2-FIX1 F — Ambiguous evidence follow-up clarifies instead of preserving a stale subject", () => {
  const workingContext = context(
    "Show me the evidence.",
    {
      communicativeIntent: "ASK_EVIDENCE",
      requestedOperation: "EVIDENCE",
      questionType: "EVIDENCE",
    },
    { ambiguity: true },
  );
  assert.equal(workingContext.interactionMode, "CLARIFY");
  assert.equal(workingContext.activeSubject, null);
  const plan = planEcaExecutiveConversationAction({
    utterance: "Show me the evidence.",
    workingContext,
  });
  assert.ok(
    plan.nextAction === "ASK_CLARIFICATION" ||
      plan.nextAction === "ASK_FOR_MISSING_INFORMATION",
  );
  assert.equal(plan.subjects.length, 0);
});

test("ECA:2-FIX1 G — Explicit scope change to scenarios does not keep Capacity Gap", () => {
  const workingContext = context(
    "Forget that. Show me the scenarios.",
    {
      communicativeIntent: "ASK_INFORMATION",
      requestedOperation: "STATUS",
      questionType: "STATUS",
      subject: null,
      objectReference: null,
    },
    {
      stage: {
        ...STAGE,
        collection: {
          kind: "SCENARIO",
          label: "Scenarios",
          members: [DEMAND, PRICING],
        },
      },
    },
  );
  assert.equal(workingContext.activeSubject, null);
  assert.equal(workingContext.activeCollection?.kind, "SCENARIO");
});

test("ECA:2-FIX1 historical — proposal Why? then Add it stays bound", () => {
  const activeProposal = proposal();
  const why = planEcaExecutiveConversationAction({
    utterance: "Why?",
    workingContext: context("Why?", {
      communicativeIntent: "ASK_WHY",
      requestedOperation: "EXPLAIN",
    }),
    activeProposal,
  });
  assert.equal(why.intent, "EXPLAIN");
  const confirmation = planEcaExecutiveConversationAction({
    utterance: "Add it.",
    workingContext: context("Add it."),
    activeProposal,
  });
  assert.equal(confirmation.requiredContext[0]?.referenceIds[0], activeProposal.proposalId);
  assert.equal(confirmation.authorityTarget, "Canonical Risk Writer");
  assert.equal(confirmation.boundaries.mutatesBusinessState, false);
});
