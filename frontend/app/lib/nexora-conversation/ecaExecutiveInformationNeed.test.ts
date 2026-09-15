import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaDataContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import { judgeEcaExecutiveInitiative } from "./ecaExecutiveInitiativeJudgment.ts";
import {
  applyEcaInformationNeedToPresentedResponse,
  emptyEcaInformationNeedSession,
  judgeEcaExecutiveInformationNeed,
  nextEcaInformationNeedSession,
  type EcaInformationNeedSession,
  type EcaKnownInformation,
} from "./ecaExecutiveInformationNeed.ts";

const CAPACITY = Object.freeze({ id: "capacity-gap", label: "Capacity Gap", kind: "problem" });
const DEMAND = Object.freeze({ id: "demand-surge", label: "Demand Surge", kind: "problem" });
const SUPPLIER = Object.freeze({ id: "supplier-delay", label: "Supplier Delay", kind: "risk" });
const A = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const B = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([CAPACITY, DEMAND, SUPPLIER, A, B]);

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

function working(
  utterance: string,
  extras: {
    subject?: EcaSubject;
    visible?: readonly EcaSubject[];
    data?: EcaDataContext;
    meaningOverrides?: Partial<CanonicalManagerMeaning>;
    role?: string;
  } = {},
) {
  const subject = extras.subject ?? CAPACITY;
  return composeEcaWorkingConversationContext({
    utterance,
    meaning: meaning(utterance, {
      subject: {
        subjectId: subject.id,
        canonicalName: subject.label,
        lexicalHint: subject.label,
        subjectKind: subject.kind,
      },
      objectReference: {
        subjectId: subject.id,
        canonicalName: subject.label,
        lexicalHint: subject.label,
        subjectKind: subject.kind,
      },
      ...extras.meaningOverrides,
    }),
    stage: Object.freeze({
      available: true,
      workspace: "Executive workspace",
      focus: subject,
      selected: null,
      visible: extras.visible ?? SUBJECTS,
      collection: null,
      theatreSceneId: null,
    }),
    subjects: SUBJECTS,
    dataContext: extras.data ?? null,
    managerRole: extras.role ?? null,
  });
}

function judge(
  utterance: string,
  extras: {
    session?: EcaInformationNeedSession | null;
    known?: EcaKnownInformation | null;
    subject?: EcaSubject;
    data?: EcaDataContext;
    meaningOverrides?: Partial<CanonicalManagerMeaning>;
    lifecycle?: { committedDecisionId?: string | null; executionId?: string | null; outcomeId?: string | null };
    role?: string;
    initiative?: boolean;
  } = {},
) {
  const workingContext = working(utterance, extras);
  const actionPlan = planEcaExecutiveConversationAction({
    utterance,
    workingContext,
    lifecycle: extras.lifecycle,
  });
  const initiative = extras.initiative
    ? judgeEcaExecutiveInitiative({
        utterance,
        workingContext,
        actionPlan,
        session: null,
      })
    : null;
  const judgment = judgeEcaExecutiveInformationNeed({
    utterance,
    workingContext,
    actionPlan,
    initiative,
    session: extras.session ?? emptyEcaInformationNeedSession(),
    known: extras.known ?? null,
  });
  return { workingContext, actionPlan, judgment };
}

function boundaries(judgment: ReturnType<typeof judge>["judgment"]) {
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.createsSecondClarificationEngine, false);
  assert.equal(judgment.boundaries.createsEmployeeCommunication, false);
  assert.equal(judgment.unnecessaryQuestion, false);
  assert.equal(judgment.duplicateQuestion, false);
  if (judgment.question) {
    assert.equal(/tell me more|elaborate|provide more information|additional details/i.test(judgment.question.text), false);
  }
}

test("ECA:4 A — Already known delivery target is not re-asked", () => {
  const { judgment } = judge("Compare Scenario A and Scenario B using the on-time delivery target.", {
    known: { deliveryTarget: "96%" },
  });
  assert.equal(judgment.acquisitionAction, "NO_ACQUISITION_NEEDED");
  assert.equal(judgment.shouldAsk, false);
  assert.equal(judgment.primaryNeed?.currentStatus, "KNOWN_CONFIRMED");
  boundaries(judgment);
});

test("ECA:4 B — Missing required Scenario B cost", () => {
  const { judgment } = judge("Which scenario is cheaper?");
  assert.equal(judgment.primaryNeed?.informationType, "COST");
  assert.equal(judgment.primaryNeed?.currentStatus, "MISSING");
  assert.equal(judgment.primaryNeed?.necessity, "BLOCKING");
  assert.equal(judgment.shouldAsk, true);
  assert.match(judgment.question?.text ?? "", /scenario b/i);
  assert.match(judgment.question?.text ?? "", /cost/i);
  assert.equal(/tell me more/i.test(judgment.question?.text ?? ""), false);
  boundaries(judgment);
});

test("ECA:4 C — Optional missing information does not generate a question", () => {
  const { judgment } = judge("Explain Supplier Delay.", {
    subject: SUPPLIER,
    known: {
      missingFields: [{ subjectId: SUPPLIER.id, subjectLabel: SUPPLIER.label, field: "owner", necessity: "OPTIONAL" }],
    },
  });
  assert.equal(judgment.shouldAsk, false);
  assert.ok(
    judgment.acquisitionAction === "NO_ACQUISITION_NEEDED" ||
      judgment.primaryNeed?.necessity === "OPTIONAL" ||
      judgment.primaryNeed == null,
  );
  boundaries(judgment);
});

test("ECA:4 D — Ambiguity is not a business information gap", () => {
  const { judgment, actionPlan } = judge("Investigate it.", {
    meaningOverrides: {
      ambiguity: {
        unresolved: true,
        reason: "multiple-objects",
        candidates: [
          { subjectId: CAPACITY.id, canonicalName: CAPACITY.label, lexicalHint: "it", subjectKind: CAPACITY.kind },
          { subjectId: DEMAND.id, canonicalName: DEMAND.label, lexicalHint: "it", subjectKind: DEMAND.kind },
        ],
      },
    },
  });
  assert.equal(actionPlan.nextAction, "ASK_CLARIFICATION");
  assert.equal(judgment.primaryNeed?.currentStatus, "AMBIGUOUS");
  assert.equal(judgment.primaryNeed?.informationType, "REFERENCE");
  assert.equal(judgment.acquisitionAction, "ASK_CLARIFICATION");
  assert.equal(judgment.boundaries.createsSecondClarificationEngine, false);
  boundaries(judgment);
});

test("ECA:4 E — Semantic uncertainty is not a missing value", () => {
  const { judgment } = judge("Should I worry about CAP_AV?", {
    data: {
      sourceId: "csv-1",
      sourceLabel: "Capacity CSV",
      fieldId: "CAP_AV",
      fieldLabel: "CAP_AV",
      semanticStatus: "PROPOSED",
      evidenceRefs: Object.freeze(["csv-1:CAP_AV"]),
    },
    known: { valuePresentByField: { CAP_AV: true }, semanticStatusByField: { CAP_AV: "LIKELY" } },
  });
  assert.equal(judgment.primaryNeed?.currentStatus, "KNOWN_UNCONFIRMED");
  assert.notEqual(judgment.primaryNeed?.currentStatus, "MISSING");
  assert.equal(judgment.acquisitionAction, "REQUEST_SEMANTIC_CONFIRMATION");
  assert.match(judgment.question?.text ?? "", /available capacity/i);
  boundaries(judgment);
});

test("ECA:4 F — Existing Data Reality is used first", () => {
  const { judgment } = judge("Which scenario is cheaper?", {
    known: { confirmedDataByField: { "scenario-b-cost": "38000" } },
  });
  assert.equal(judgment.acquisitionAction, "USE_EXISTING_INFORMATION");
  assert.equal(judgment.shouldAsk, false);
  boundaries(judgment);
});

test("ECA:4 G — Manager is a suitable source for one focused question", () => {
  const { judgment } = judge("What is Supplier B's available capacity?");
  assert.equal(judgment.shouldAsk, true);
  assert.equal(judgment.primaryNeed?.sourceCandidates[0]?.source, "MANAGER");
  assert.equal(judgment.primaryNeed?.sourceCandidates[0]?.contacted, false);
  assert.match(judgment.question?.text ?? "", /capacity/i);
  assert.equal((judgment.question?.text.match(/\?/g) ?? []).length, 1);
  boundaries(judgment);
});

test("ECA:4 H — I don’t know remains unknown and is not repeated", () => {
  const first = judge("What is Supplier B's available capacity?");
  const session = nextEcaInformationNeedSession(null, "What is Supplier B's available capacity?", first.judgment);
  const { judgment } = judge("I don't know.", { session });
  assert.equal(judgment.shouldAsk, false);
  assert.equal(judgment.proceedWithUncertainty, true);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: "Understood.",
    utterance: "I don't know.",
    judgment,
  });
  assert.equal(/\?/.test(spoken) && /capacity/i.test(spoken), false);
  boundaries(judgment);
});

test("ECA:4 I — Skip is respected", () => {
  const first = judge("Do you know Supplier B's lead time?");
  const session = nextEcaInformationNeedSession(null, "Do you know Supplier B's lead time?", first.judgment);
  const { judgment } = judge("Skip it.", { session });
  assert.equal(judgment.acquisitionAction, "DEFER");
  assert.equal(judgment.shouldAsk, false);
  assert.equal(judgment.proceedWithUncertainty, true);
  boundaries(judgment);
});

test("ECA:4 J — Highest-value comparison gap is cost, not every empty field", () => {
  const { judgment } = judge("Which scenario is cheaper?", {
    known: {
      missingFields: [
        { subjectId: B.id, subjectLabel: B.label, field: "cost", necessity: "BLOCKING" },
        { subjectId: B.id, subjectLabel: B.label, field: "implementation-date", necessity: "OPTIONAL" },
        { subjectId: A.id, subjectLabel: A.label, field: "owner", necessity: "OPTIONAL" },
      ],
    },
  });
  assert.equal(judgment.primaryNeed?.informationType, "COST");
  assert.equal(judgment.shouldAsk, true);
  assert.equal(/implementation date|owner|lead time|capacity/i.test(judgment.question?.text ?? ""), false);
  boundaries(judgment);
});

test("ECA:4 K — Decision readiness asks without committing", () => {
  const { judgment } = judge("Review this Decision.", {
    known: {
      missingFields: [{ subjectId: SUPPLIER.id, subjectLabel: SUPPLIER.label, field: "risk-evidence", necessity: "IMPORTANT" }],
    },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.question?.type, "DECISION_INPUT");
  boundaries(judgment);
});

test("ECA:4 L — Execution readiness identifies the Decision prerequisite", () => {
  const { judgment, actionPlan } = judge("Start the plan.", {
    lifecycle: { committedDecisionId: null },
  });
  assert.equal(actionPlan.nextAction, "ASK_FOR_MISSING_INFORMATION");
  assert.equal(judgment.primaryNeed?.informationType, "PREREQUISITE");
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.shouldAsk, true);
  boundaries(judgment);
});

test("ECA:4 M — Outcome gap does not invent Outcome", () => {
  const { judgment } = judge("Did the plan work?");
  assert.equal(judgment.primaryNeed?.informationType, "OUTCOME");
  assert.match(judgment.question?.text ?? "", /observed/i);
  assert.equal(judgment.boundaries.writesOutcome, false);
  boundaries(judgment);
});

test("ECA:4 N — Causality gap does not assert causation", () => {
  const { judgment } = judge("Is Capacity Gap causing late delivery?", {
    known: { causalEvidenceSufficient: false },
  });
  assert.equal(judgment.primaryNeed?.informationType, "CAUSAL_EVIDENCE");
  assert.equal(judgment.acquisitionAction, "REQUEST_EVIDENCE");
  assert.equal(/yes, capacity gap is causing/i.test(judgment.question?.text ?? ""), false);
  boundaries(judgment);
});

test("ECA:4 O — One highest-value question among five unknown fields", () => {
  const { judgment } = judge("Which scenario is cheaper?", {
    known: {
      missingFields: [
        { subjectId: B.id, subjectLabel: B.label, field: "cost", necessity: "BLOCKING" },
        { subjectId: B.id, subjectLabel: B.label, field: "owner", necessity: "OPTIONAL" },
        { subjectId: B.id, subjectLabel: B.label, field: "color", necessity: "OPTIONAL" },
        { subjectId: A.id, subjectLabel: A.label, field: "notes", necessity: "OPTIONAL" },
        { subjectId: SUPPLIER.id, subjectLabel: SUPPLIER.label, field: "deadline", necessity: "OPTIONAL" },
      ],
    },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.equal((judgment.question?.text.match(/\?/g) ?? []).length <= 2, true);
  assert.match(judgment.question?.text ?? "", /cost/i);
  boundaries(judgment);
});

test("ECA:4 P — Why explains executive relevance", () => {
  const first = judge("Which scenario is cheaper?");
  const session = nextEcaInformationNeedSession(null, "Which scenario is cheaper?", first.judgment);
  const { judgment } = judge("Why do you need that?", { session });
  assert.match(judgment.explanation ?? "", /compar/i);
  assert.match(judgment.explanation ?? "", /cost/i);
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: "I can explain.",
    utterance: "Why do you need that?",
    judgment,
  });
  assert.match(spoken, /compar/i);
  assert.equal(session.lastFingerprint, first.judgment.primaryNeed?.provenance.fingerprint);
  boundaries(judgment);
});

test("ECA:4 Q — Suggested answers reuse ECA:2 suggestedManagerTurns", () => {
  const { judgment, actionPlan } = judge("Which scenario is cheaper?", {
    known: { boundedOptions: Object.freeze(["About $20,000", "About $40,000", "I don't know"]) },
  });
  assert.equal(judgment.reusedSuggestedManagerTurns, actionPlan.suggestedManagerTurns);
  assert.ok(judgment.reusedSuggestedManagerTurns.length <= 3);
  boundaries(judgment);
});

test("ECA:4 R — Suggested answers are not business facts", () => {
  const { judgment } = judge("What is Supplier B's available capacity?", {
    known: { boundedOptions: Object.freeze(["Labor", "Equipment", "Supplier limits"]) },
  });
  assert.equal(judgment.boundaries.suggestedAnswersAreFacts, false);
  assert.equal(judgment.question?.suggestedAnswersAreFacts, false);
  boundaries(judgment);
});

test("ECA:4 S — Answer does not write; mutation stays on the proposal path", () => {
  const asked = judge("Is Supplier Delay a Risk?");
  const session = nextEcaInformationNeedSession(
    {
      ...emptyEcaInformationNeedSession(),
      lastQuestion: "Is Supplier Delay a Risk?",
      lastFingerprint: "mutation-question",
    },
    "Is Supplier Delay a Risk?",
    asked.judgment,
  );
  const { judgment } = judge("Yes.", { session });
  assert.equal(judgment.answerWouldRequireCanonicalProposal, true);
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  boundaries(judgment);
});

test("ECA:4 T — Authority isolation", () => {
  const cases = [
    "Explain Capacity Gap.",
    "Which scenario is cheaper?",
    "Start the plan.",
    "Did the plan work?",
  ];
  for (const utterance of cases) {
    const { judgment } = judge(utterance);
    boundaries(judgment);
  }
});

test("ECA:4 sequence 1 — Comparison cost answer is not silently promoted", () => {
  const ask = judge("Compare Scenario A and Scenario B. Which is cheaper?");
  assert.equal(ask.judgment.shouldAsk, true);
  const session = nextEcaInformationNeedSession(null, "Which is cheaper?", ask.judgment);
  const answered = judge("About $40,000.", { session });
  assert.equal(answered.judgment.primaryNeed?.currentStatus, "KNOWN_UNCONFIRMED");
  assert.equal(answered.judgment.boundaries.writesDataTruth, false);
  assert.equal(answered.judgment.shouldAsk, false);
});

test("ECA:4 sequence 2 — Unknown does not repeat the question", () => {
  const ask = judge("What is Supplier B's available capacity?");
  const session = nextEcaInformationNeedSession(null, ask.workingContext.managerContext.meaning?.rawUtterance ?? "", ask.judgment);
  const unknown = judge("I don't know.", { session });
  const nextSession = nextEcaInformationNeedSession(session, "I don't know.", unknown.judgment);
  const again = judge("How are we doing?", { session: nextSession });
  assert.equal(again.judgment.shouldAsk, false);
  assert.equal(unknown.judgment.duplicateQuestion, false);
});

test("ECA:4 sequence 3 — Why preserves the pending need", () => {
  const ask = judge("Which scenario is cheaper?");
  const session = nextEcaInformationNeedSession(null, "Which scenario is cheaper?", ask.judgment);
  const why = judge("Why do you need that?", { session });
  const next = nextEcaInformationNeedSession(session, "Why do you need that?", why.judgment);
  assert.ok(next.lastQuestion);
  assert.match(why.judgment.explanation ?? "", /Scenario B|cost|compar/i);
});

test("ECA:4 sequence 4 — Skip then compare proceeds with uncertainty", () => {
  const ask = judge("Do you know Supplier B's lead time?");
  let session = nextEcaInformationNeedSession(null, "Do you know Supplier B's lead time?", ask.judgment);
  const skip = judge("Not now.", { session });
  session = nextEcaInformationNeedSession(session, "Not now.", skip.judgment);
  const compare = judge("Compare the scenarios anyway.", { session });
  assert.equal(compare.judgment.shouldAsk, false);
  assert.ok(
    compare.judgment.proceedWithUncertainty ||
      compare.judgment.acquisitionAction === "PROCEED_WITH_UNCERTAINTY" ||
      compare.judgment.acquisitionAction === "NO_ACQUISITION_NEEDED",
  );
});

test("ECA:4 sequence 5 — CAP_AV semantic clarification stays on DATA-ADV", () => {
  const { judgment } = judge("Should I worry about CAP_AV?", {
    data: {
      sourceId: "csv-1",
      sourceLabel: "Capacity CSV",
      fieldId: "CAP_AV",
      fieldLabel: "CAP_AV",
      semanticStatus: "PROPOSED",
      evidenceRefs: Object.freeze(["csv-1:CAP_AV"]),
    },
  });
  assert.equal(judgment.acquisitionAction, "REQUEST_SEMANTIC_CONFIRMATION");
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:4 sequence 6 — Decision readiness does not commit", () => {
  const { judgment } = judge("I want to make a Decision now.", {
    known: {
      missingFields: [{ subjectId: SUPPLIER.id, subjectLabel: SUPPLIER.label, field: "risk-evidence" }],
    },
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:4 questioning regression — existing explanation does not gain a new question", () => {
  const { judgment } = judge("Explain Capacity Gap.");
  assert.equal(judgment.shouldAsk, false);
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: "Capacity Gap is the shortfall between required and available capacity.",
    utterance: "Explain Capacity Gap.",
    judgment,
  });
  assert.equal(spoken.includes("?"), false);
});

test("ECA:4 ECA:3 intervention does not automatically ask", () => {
  const { judgment } = judge("How are we doing?", { initiative: true });
  assert.equal(judgment.shouldAsk, false);
});

test("ECA:4 question quality rejects vague patterns", () => {
  const { judgment } = judge("Which scenario is cheaper?");
  assert.equal(/tell me more|elaborate|provide more information/i.test(judgment.question?.text ?? ""), false);
});

test("ECA:4 prompt A — Known Goal information → shouldAsk false", () => {
  const { judgment } = judge("What is my current goal?", {
    known: { deliveryTarget: "Improve Delivery Reliability" },
  });
  assert.equal(judgment.shouldAsk, false);
  boundaries(judgment);
});

test("ECA:4 prompt B — Missing material preference → one question", () => {
  const { judgment } = judge("Which scenario is cheaper?");
  assert.equal(judgment.shouldAsk, true);
  assert.equal(judgment.primaryNeed?.informationType, "COST");
  assert.ok(judgment.question?.text);
  assert.equal(/tell me more|provide more information/i.test(judgment.question?.text ?? ""), false);
  boundaries(judgment);
});

test("ECA:4 prompt C — Missing non-material detail → shouldAsk false", () => {
  const { judgment } = judge("Explain Supplier Delay.", {
    subject: SUPPLIER,
    known: {
      missingFields: [
        {
          subjectId: SUPPLIER.id,
          subjectLabel: SUPPLIER.label,
          field: "nickname",
          necessity: "OPTIONAL",
        },
      ],
    },
  });
  assert.equal(judgment.shouldAsk, false);
});

test("ECA:4 prompt D — Already available Data → do not ask manager", () => {
  const { judgment } = judge("What is CAP_AV?", {
    known: {
      confirmedDataByField: { CAP_AV: "Available Capacity" },
      semanticStatusByField: { CAP_AV: "CONFIRMED" },
      valuePresentByField: { CAP_AV: true },
    },
    data: {
      sourceId: "src-1",
      sourceLabel: "ops.csv",
      fieldId: "CAP_AV",
      fieldLabel: "CAP_AV",
      semanticStatus: "CONFIRMED",
      evidenceRefs: Object.freeze(["csv-1:CAP_AV"]),
    },
  });
  assert.equal(judgment.shouldAsk, false);
  assert.ok(
    judgment.acquisitionAction === "USE_EXISTING_INFORMATION" ||
      judgment.acquisitionAction === "NO_ACQUISITION_NEEDED",
  );
});

test("ECA:4 prompt E — CAP_AV unconfirmed → semantic question, no Data write", () => {
  const { judgment } = judge("What does CAP_AV mean?", {
    known: {
      semanticStatusByField: { CAP_AV: "UNKNOWN" },
      valuePresentByField: { CAP_AV: true },
    },
    data: {
      sourceId: "src-1",
      sourceLabel: "ops.csv",
      fieldId: "CAP_AV",
      fieldLabel: "CAP_AV",
      semanticStatus: "UNKNOWN",
      evidenceRefs: Object.freeze(["csv-1:CAP_AV"]),
    },
  });
  assert.ok(
    judgment.shouldAsk === true ||
      judgment.acquisitionAction === "REQUEST_SEMANTIC_CONFIRMATION",
  );
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.notEqual(judgment.primaryNeed?.currentStatus, "MISSING");
});

test("ECA:4 prompt F — Ambiguous referent uses clarification, not acquisition", () => {
  const { judgment, actionPlan } = judge("Investigate it.", {
    meaningOverrides: {
      ambiguity: {
        unresolved: true,
        reason: "multiple-objects",
        candidates: [
          { subjectId: CAPACITY.id, canonicalName: CAPACITY.label, lexicalHint: "it", subjectKind: CAPACITY.kind },
          { subjectId: DEMAND.id, canonicalName: DEMAND.label, lexicalHint: "it", subjectKind: DEMAND.kind },
        ],
      },
    },
  });
  assert.ok(
    actionPlan.nextAction === "ASK_CLARIFICATION" ||
      judgment.acquisitionAction === "ASK_CLARIFICATION" ||
      judgment.shouldAsk === false,
  );
  assert.notEqual(judgment.primaryNeed?.informationType, "COST");
  assert.equal(judgment.boundaries.createsSecondClarificationEngine, false);
});

test("ECA:4 prompt G — Comparison criterion missing → one preference question", () => {
  const { judgment } = judge("Which scenario is cheaper?", {
    known: {
      missingFields: [
        { subjectId: B.id, subjectLabel: B.label, field: "cost", necessity: "BLOCKING" },
        { subjectId: B.id, subjectLabel: B.label, field: "implementation-date", necessity: "OPTIONAL" },
      ],
      boundedOptions: Object.freeze(["About $20,000", "About $40,000", "I don't know"]),
    },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.ok(judgment.question);
  assert.match(judgment.question?.text ?? "", /cost/i);
  boundaries(judgment);
});

test("ECA:4 prompt H — Decision-related ask does not commit", () => {
  const { judgment, actionPlan } = judge("Review this Decision.", {
    known: {
      missingFields: [
        {
          subjectId: SUPPLIER.id,
          subjectLabel: SUPPLIER.label,
          field: "risk-evidence",
          necessity: "IMPORTANT",
        },
      ],
    },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(actionPlan.boundaries.commitsDecision, false);
});

test("ECA:4 prompt I — Execution readiness may ask; Execution count unchanged", () => {
  const { judgment, actionPlan } = judge("Start the plan.", {
    lifecycle: { committedDecisionId: null },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.equal(judgment.primaryNeed?.informationType, "PREREQUISITE");
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(actionPlan.boundaries.startsExecution, false);
});

test("ECA:4 prompt J — Outcome observation ask without causality claim", () => {
  const { judgment } = judge("Did the plan work?");
  assert.equal(judgment.primaryNeed?.informationType, "OUTCOME");
  assert.doesNotMatch(judgment.question?.text ?? judgment.explanation ?? "", /\bcaused\b|\bproves\b/i);
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:4 prompt K — Unanswerable gap does not ask manager for invented knowledge", () => {
  const { judgment } = judge("Is Capacity Gap causing late delivery?", {
    known: { causalEvidenceSufficient: false },
  });
  assert.ok(
    judgment.acquisitionAction === "REQUEST_EVIDENCE" ||
      judgment.acquisitionAction === "PROCEED_WITH_UNCERTAINTY" ||
      judgment.acquisitionAction === "IDENTIFY_OTHER_SOURCE" ||
      judgment.shouldAsk === false,
  );
  assert.doesNotMatch(judgment.question?.text ?? "", /what caused/i);
});

test("ECA:4 prompt L — Already asked question is not repeated", () => {
  const first = judge("Which scenario is cheaper?");
  const session = nextEcaInformationNeedSession(null, "Which scenario is cheaper?", first.judgment);
  const second = judge("Explain Capacity Gap.", { session });
  assert.equal(first.judgment.shouldAsk, true);
  assert.equal(second.judgment.shouldAsk, false);
});

test("ECA:4 prompt M — Explicit subject switch drops stale acquisition", () => {
  const first = judge("Which scenario is cheaper?");
  const session = nextEcaInformationNeedSession(null, "Which scenario is cheaper?", first.judgment);
  const switched = judge("Forget that. Explain Demand Surge.", {
    session,
    subject: DEMAND,
    meaningOverrides: {
      requestedOperation: "EXPLAIN",
      communicativeIntent: "ASK_INFORMATION",
    },
  });
  assert.equal(switched.judgment.shouldAsk, false);
  assert.ok(
    switched.actionPlan.intent === "EXPLAIN" ||
      switched.actionPlan.intent === "UNDERSTAND" ||
      /demand surge/i.test(switched.workingContext.activeSubject?.label ?? ""),
  );
});

test("ECA:4 prompt N — Three gaps → ask exactly one highest-value question", () => {
  const { judgment } = judge("Which scenario is cheaper?", {
    known: {
      missingFields: [
        { subjectId: B.id, subjectLabel: B.label, field: "cost", necessity: "BLOCKING" },
        { subjectId: B.id, subjectLabel: B.label, field: "owner", necessity: "OPTIONAL" },
        { subjectId: B.id, subjectLabel: B.label, field: "color", necessity: "OPTIONAL" },
      ],
    },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.ok(judgment.question);
  assert.match(judgment.question?.text ?? "", /cost/i);
  assert.equal((judgment.question?.text.match(/\?/g) ?? []).length <= 2, true);
});

test("ECA:4 prompt O — Suggested answers are bounded options, not facts", () => {
  const { judgment } = judge("Which scenario is cheaper?", {
    known: { boundedOptions: Object.freeze(["About $20,000", "About $40,000", "I don't know"]) },
  });
  assert.equal(judgment.shouldAsk, true);
  assert.equal(judgment.question?.suggestedAnswersAreFacts, false);
  assert.equal(judgment.boundaries.suggestedAnswersAreFacts, false);
});

test("ECA:4 prompt P — Manager answer is not written by ECA:4 (no ECA:5)", () => {
  const asked = judge("Is Supplier Delay a Risk?");
  const session = nextEcaInformationNeedSession(
    {
      ...emptyEcaInformationNeedSession(),
      lastQuestion: "Is Supplier Delay a Risk?",
      lastFingerprint: "mutation-question",
    },
    "Is Supplier Delay a Risk?",
    asked.judgment,
  );
  const answered = judge("Yes.", { session });
  assert.equal(answered.judgment.boundaries.mutatesBusinessState, false);
  assert.equal(answered.judgment.boundaries.writesDataTruth, false);
  assert.equal(answered.judgment.answerWouldRequireCanonicalProposal, true);
});

test("ECA:4 prompt multi-turn 1 — Recommendation may ask one preference; no Decision", () => {
  const seek = judge("What should I do about Capacity Gap?");
  assert.equal(seek.actionPlan.boundaries.commitsDecision, false);
  const prefer = judge("Delivery speed matters more.");
  assert.equal(prefer.judgment.boundaries.commitsDecision, false);
  assert.equal(prefer.actionPlan.boundaries.commitsDecision, false);
});

test("ECA:4 prompt multi-turn 2 — CAP_AV uncertainty stays on DATA-ADV path", () => {
  const meaningAsk = judge("What does CAP_AV mean?", {
    known: {
      semanticStatusByField: { CAP_AV: "UNKNOWN" },
      valuePresentByField: { CAP_AV: true },
    },
    data: {
      sourceId: "src-1",
      sourceLabel: "ops.csv",
      fieldId: "CAP_AV",
      fieldLabel: "CAP_AV",
      semanticStatus: "UNKNOWN",
      evidenceRefs: Object.freeze(["csv-1:CAP_AV"]),
    },
  });
  assert.equal(meaningAsk.judgment.boundaries.writesDataTruth, false);
  assert.ok(
    meaningAsk.judgment.acquisitionAction === "REQUEST_SEMANTIC_CONFIRMATION" ||
      meaningAsk.judgment.shouldAsk === true ||
      meaningAsk.judgment.proceedWithUncertainty === true,
  );
});

test("ECA:4 prompt multi-turn 3 — Compare then choose asks criterion, no Decision", () => {
  const compare = judge("Compare Demand Surge and Pricing Response.");
  const choose = judge("Which scenario is cheaper?");
  assert.ok(compare.actionPlan.intent === "COMPARE" || compare.actionPlan.nextAction === "COMPARE");
  assert.equal(choose.judgment.boundaries.commitsDecision, false);
  assert.equal(choose.judgment.shouldAsk, true);
});

test("ECA:4 prompt multi-turn 4 — Execution readiness ask keeps Execution at zero", () => {
  const ready = judge("Start the plan.", {
    lifecycle: { committedDecisionId: null },
  });
  assert.equal(ready.judgment.boundaries.startsExecution, false);
  assert.equal(ready.judgment.shouldAsk, true);
  assert.doesNotMatch(ready.judgment.question?.text ?? ready.judgment.explanation ?? "", /\bis running\b/i);
});
