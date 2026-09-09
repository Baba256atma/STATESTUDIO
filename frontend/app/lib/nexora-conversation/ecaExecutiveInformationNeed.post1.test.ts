import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  applyEcaInformationNeedToPresentedResponse,
  emptyEcaInformationNeedSession,
  isEcaInformationRequirementRequest,
  judgeEcaExecutiveInformationNeed,
  nextEcaInformationNeedSession,
  type EcaKnownInformation,
} from "./ecaExecutiveInformationNeed.ts";

const RISK = Object.freeze({ id: "obj-risk", label: "Risk", kind: "object" });
const MARGIN = Object.freeze({ id: "ctx-problem-margin", label: "Margin Pressure", kind: "problem" });
const CAPACITY = Object.freeze({ id: "ctx-problem-capacity", label: "Capacity Gap", kind: "problem" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([RISK, MARGIN, CAPACITY]);

function meaning(utterance: string, subject: EcaSubject = RISK): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "ASK_INFORMATION",
    requestedOperation: "NONE",
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
  } as CanonicalManagerMeaning);
}

function judge(
  utterance: string,
  extras: {
    known?: EcaKnownInformation | null;
    subject?: EcaSubject;
    session?: ReturnType<typeof emptyEcaInformationNeedSession>;
  } = {},
) {
  const subject = extras.subject ?? RISK;
  const workingContext = composeEcaWorkingConversationContext({
    utterance,
    meaning: meaning(utterance, subject),
    stage: Object.freeze({
      available: true,
      workspace: "Executive workspace",
      focus: subject,
      selected: null,
      visible: SUBJECTS,
      collection: null,
      theatreSceneId: null,
    }),
    subjects: SUBJECTS,
    dataContext: null,
    managerRole: null,
  });
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const judgment = judgeEcaExecutiveInformationNeed({
    utterance,
    workingContext,
    actionPlan,
    session: extras.session ?? emptyEcaInformationNeedSession(),
    known: extras.known ?? { associatedOthers: [MARGIN] },
  });
  return { workingContext, actionPlan, judgment };
}

const IDENTITY =
  "Nexora is the executive decision workspace: it keeps business objects, collections, and conversation on one shared truth.";

const REPRO =
  "you say: Nexora does not yet have enough evidence to determine this. what do you need for determine it ?";

test("ECA:4-POST1 speech act is not ordinary business need", () => {
  assert.equal(isEcaInformationRequirementRequest(REPRO), true);
  assert.equal(isEcaInformationRequirementRequest("What do you need?"), true);
  assert.equal(isEcaInformationRequirementRequest("What information do you need?"), true);
  assert.equal(isEcaInformationRequirementRequest("What evidence is missing?"), true);
  assert.equal(isEcaInformationRequirementRequest("What do you need from me?"), true);
  assert.equal(isEcaInformationRequirementRequest("How can we determine this?"), true);
  assert.equal(isEcaInformationRequirementRequest("What would confirm it?"), true);
  assert.equal(isEcaInformationRequirementRequest("We need to reduce cost."), false);
  assert.equal(isEcaInformationRequirementRequest("Do we need to reassess the Decision?"), false);
  assert.equal(isEcaInformationRequirementRequest("What do we need before starting?"), false);
  assert.equal(isEcaInformationRequirementRequest("What is Nexora?"), false);
});

test("ECA:4-POST1 A — exact reproduction uses ECA:4, not identity fallback", () => {
  const { judgment } = judge(REPRO);
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: IDENTITY,
    utterance: REPRO,
    judgment,
  });
  assert.doesNotMatch(spoken, /executive decision workspace/i);
  assert.match(spoken, /Risk/i);
  assert.match(spoken, /Margin Pressure/i);
  assert.doesNotMatch(spoken, /risk_probability|causal_score|correlation_coefficient/i);
  assert.equal(judgment.advisorConsumedInformationNeed, true);
  assert.equal(judgment.shouldAsk, false);
  assert.equal(judgment.boundaries.writesRisk, false);
});

test("ECA:4-POST1 B–D — information / evidence variants", () => {
  for (const utterance of [
    "What do you need?",
    "What information do you need?",
    "What evidence is missing?",
    "What would you need to determine that?",
    "What do you need to know?",
    "What is missing?",
    "What would help you determine it?",
    "What data do you need?",
    "What should I give you?",
  ]) {
    const { judgment } = judge(utterance);
    const spoken = applyEcaInformationNeedToPresentedResponse({
      source: IDENTITY,
      utterance,
      judgment,
    });
    assert.doesNotMatch(spoken, /executive decision workspace/i, utterance);
    assert.match(spoken, /evidence|timing|missing|data/i, utterance);
  }
});

test("ECA:4-POST1 E — from me prefers existing data", () => {
  const { judgment } = judge("What do you need from me?");
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: IDENTITY,
    utterance: "What do you need from me?",
    judgment,
  });
  assert.match(spoken, /may not need anything from you yet|already exists in the available data/i);
});

test("ECA:4-POST1 F — how can we determine this", () => {
  const { judgment } = judge("How can we determine this?");
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: IDENTITY,
    utterance: "How can we determine this?",
    judgment,
  });
  assert.match(spoken, /First, compare/i);
  assert.doesNotMatch(spoken, /I will prove|prove Risk causes/i);
});

test("ECA:4-POST1 G — what would confirm it does not overclaim causality", () => {
  const { judgment } = judge("What would confirm it?");
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: IDENTITY,
    utterance: "What would confirm it?",
    judgment,
  });
  assert.match(spoken, /strengthen|causality/i);
  assert.doesNotMatch(spoken, /would confirm causality|prove Risk causes/i);
});

test("ECA:4-POST1 H — pronoun it keeps Risk–Margin referent", () => {
  const { judgment } = judge("what do you need for determine it ?");
  assert.match(judgment.explanation ?? "", /Risk/);
  assert.match(judgment.explanation ?? "", /Margin Pressure/);
  assert.doesNotMatch(judgment.explanation ?? "", /executive decision workspace/);
});

test("ECA:4-POST1 I — existing margin history is not re-asked", () => {
  const { judgment } = judge("What evidence do you need?", {
    known: {
      associatedOthers: [MARGIN],
      confirmedDataByField: { marginHistory: "accepted" },
    },
  });
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: IDENTITY,
    utterance: "What evidence do you need?",
    judgment,
  });
  assert.match(spoken, /already have the margin/i);
  assert.doesNotMatch(spoken, /Give me margin history/i);
});

test("ECA:4-POST1 K — partial manager answer leaves remaining gap", () => {
  const ask = judge(REPRO);
  const session = nextEcaInformationNeedSession(null, REPRO, ask.judgment, [MARGIN]);
  const { judgment } = judge("Margin fell in July.", { session, known: { associatedOthers: [MARGIN] } });
  assert.equal(judgment.primaryNeed?.currentStatus, "PARTIAL");
  assert.match(judgment.explanation ?? "", /still need/i);
  assert.doesNotMatch(judgment.explanation ?? "", /What do you mean by margin/i);
});

test("ECA:4-POST1 L — I don’t know is not looped", () => {
  const ask = judge(REPRO);
  const session = nextEcaInformationNeedSession(null, REPRO, ask.judgment, [MARGIN]);
  const { judgment } = judge("I don't know.", { session });
  const spoken = applyEcaInformationNeedToPresentedResponse({
    source: "Understood.",
    utterance: "I don't know.",
    judgment,
  });
  assert.doesNotMatch(spoken, /\?/);
  assert.match(spoken, /unknown|unresolved/i);
});

test("ECA:4-POST1 M — two relationships ask one clarification", () => {
  const { judgment } = judge("What do you need to determine it?", {
    known: { associatedOthers: [MARGIN, CAPACITY] },
  });
  assert.equal(judgment.primaryNeed?.currentStatus, "AMBIGUOUS");
  assert.match(judgment.explanation ?? "", /Which unresolved relationship/i);
  assert.match(judgment.explanation ?? "", /Margin Pressure/);
});

test("ECA:4-POST1 O — ordinary need is not information acquisition", () => {
  assert.equal(isEcaInformationRequirementRequest("We need to reduce cost."), false);
  const { judgment } = judge("We need to reduce cost.");
  assert.equal(judgment.advisorConsumedInformationNeed, false);
});

test("ECA:4-POST1 Q — reassessment is not hijacked", () => {
  assert.equal(isEcaInformationRequirementRequest("Do we need to reassess the Decision?"), false);
});

test("ECA:4-POST1 P — execution readiness phrase is not hijacked", () => {
  assert.equal(isEcaInformationRequirementRequest("What do we need before starting?"), false);
});

test("ECA:4-POST1 R — CAP_AV is not treated as confirmed evidence requirement", () => {
  const { judgment } = judge("What do you still need for the Risk?", {
    known: {
      associatedOthers: [MARGIN],
      valuePresentByField: { CAP_AV: true },
      semanticStatusByField: { CAP_AV: "LIKELY" },
    },
    session: {
      ...emptyEcaInformationNeedSession(),
      lastFingerprint: "semantic:CAP_AV",
      lastAssociatedOthers: [MARGIN],
    },
  });
  assert.notEqual(judgment.primaryNeed?.informationType, "SEMANTIC_MEANING");
  assert.doesNotMatch(judgment.explanation ?? "", /CAP_AV represents available capacity as confirmed/);
});

test("ECA:4-POST1 T — write isolation", () => {
  const { judgment } = judge(REPRO);
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
});
