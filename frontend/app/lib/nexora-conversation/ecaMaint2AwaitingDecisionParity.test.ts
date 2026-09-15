/**
 * NPA-T ECA:MAINT-2 — Awaiting-Decision State & Candidate Parity.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { compactJourneyStatusLabel } from "../manager-object/managerObjectExperienceComposer.ts";
import {
  applyEcaCommitmentToPresentedResponse,
  judgeEcaExecutiveCommitment,
  emptyEcaCommitmentSession,
} from "./ecaExecutiveCommitment.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  judgeEcaExecutiveRecommendation,
  emptyEcaRecommendationSession,
} from "./ecaExecutiveRecommendation.ts";

const CAPACITY = Object.freeze({
  id: "ctx-problem-capacity",
  label: "Capacity Gap",
  kind: "problem",
}) as EcaSubject;
const OPTION_A = Object.freeze({
  id: "ctx-scenario-capacity-expansion",
  label: "Capacity Expansion Plan",
  kind: "scenario",
}) as EcaSubject;
const OPTION_B = Object.freeze({
  id: "ctx-scenario-demand",
  label: "Demand Surge",
  kind: "scenario",
}) as EcaSubject;

function meaning(utterance: string, subject: EcaSubject = CAPACITY): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "REQUEST_INFORMATION",
    requestedOperation: "EXPLAIN",
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
    questionType: "WHAT",
    requestedDepth: "STANDARD",
    modality: "INTERROGATIVE",
    polarity: "NEUTRAL",
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
  } as unknown as CanonicalManagerMeaning);
}

function working(utterance: string, subject: EcaSubject = CAPACITY) {
  return composeEcaWorkingConversationContext({
    utterance,
    meaning: meaning(utterance, subject),
    stage: Object.freeze({
      available: true,
      workspace: "Executive workspace",
      focus: subject,
      selected: null,
      visible: Object.freeze([CAPACITY, OPTION_A, OPTION_B]),
      collection: null,
      theatreSceneId: null,
    }),
    subjects: Object.freeze([CAPACITY, OPTION_A, OPTION_B]),
  });
}

function review(
  utterance: string,
  extras: {
    decisionCandidate?: Readonly<{ id: string; label: string }> | null;
    candidateChoices?: readonly Readonly<{ id: string; label: string }>[];
    decisionNeeded?: boolean;
    decisionNeededSubjectLabel?: string | null;
    recommended?: Readonly<{ id: string; label: string }> | null;
    committedDecisionId?: string | null;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  let recommendation = judgeEcaExecutiveRecommendation({
    utterance,
    workingContext,
    actionPlan,
    session: emptyEcaRecommendationSession(),
  });
  if (extras.recommended) {
    recommendation = {
      ...recommendation,
      recommendedOption: extras.recommended,
      recommendationType: "PREFER_OPTION",
    };
  }
  const judgment = judgeEcaExecutiveCommitment({
    utterance,
    workingContext,
    actionPlan,
    recommendation,
    session: emptyEcaCommitmentSession(),
    decisionCandidate: extras.decisionCandidate,
    candidateChoices: extras.candidateChoices,
    decisionNeeded: extras.decisionNeeded,
    decisionNeededSubjectLabel: extras.decisionNeededSubjectLabel,
    committedDecisionId: extras.committedDecisionId,
  });
  return judgment;
}

test("ECA:MAINT-2 semantics — AWAITING_DECISION means Decision needed, not candidate under review", () => {
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "AWAITING_DECISION",
      decisionState: "none",
    }),
    "Decision needed",
  );
  assert.notEqual(
    compactJourneyStatusLabel({
      journeyState: "AWAITING_DECISION",
      decisionState: "none",
    }),
    "Awaiting decision",
  );
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "AWAITING_DECISION",
      decisionState: "awaiting-confirmation",
    }),
    "Awaiting confirmation",
  );
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "EXECUTING",
      decisionState: "committed",
    }),
    "Decision approved",
  );
});

test("ECA:MAINT-2 A/B — Decision needed, no candidate: coherent no-candidate review", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    decisionNeededSubjectLabel: "Capacity Gap",
  });
  assert.equal(judgment.commitmentReview, true);
  assert.equal(judgment.target, null);
  assert.match(judgment.managerFacingNote ?? "", /decision is needed on Capacity Gap/i);
  assert.match(judgment.managerFacingNote ?? "", /no specific option is currently under review/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /which business outcome/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
  const spoken = applyEcaCommitmentToPresentedResponse({
    source: "I can help investigate that, but I need to know which business outcome you're referring to.",
    utterance: "What would we be committing to?",
    judgment,
  });
  assert.match(spoken, /decision is needed on Capacity Gap/i);
  assert.doesNotMatch(spoken, /which business outcome/i);
});

test("ECA:MAINT-2 C — One valid candidate explained", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    decisionNeededSubjectLabel: "Capacity Gap",
    decisionCandidate: { id: OPTION_A.id, label: OPTION_A.label },
  });
  assert.equal(judgment.target?.id, OPTION_A.id);
  assert.match(judgment.managerFacingNote ?? "", /Capacity Expansion Plan/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /decision is needed on Capacity Gap/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:MAINT-2 D — Multiple candidates clarify", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    candidateChoices: [
      { id: OPTION_A.id, label: OPTION_A.label },
      { id: OPTION_B.id, label: OPTION_B.label },
    ],
  });
  assert.equal(judgment.targetResolution, "AMBIGUOUS");
  assert.equal(judgment.target, null);
  assert.match(judgment.managerFacingNote ?? "", /Which one|more than one/i);
});

test("ECA:MAINT-2 E — Recommendation only does not become commitment candidate", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    decisionNeededSubjectLabel: "Capacity Gap",
    // recommendation present but no theatre/review candidate and no recommendedOption on judgment path unless set
  });
  // Without recommendedOption / decisionCandidate, still no-candidate
  assert.equal(judgment.target, null);
  assert.match(judgment.managerFacingNote ?? "", /decision is needed/i);
});

test("ECA:MAINT-2 E2 — Recommendation option may inform review only when present on recommendation judgment", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    recommended: { id: OPTION_A.id, label: OPTION_A.label },
  });
  // Existing MAINT-1 priority: recommendation is a valid review target source
  assert.equal(judgment.target?.id, OPTION_A.id);
  assert.notEqual(judgment.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:MAINT-2 F — Candidate under review: label and ECA:8 agree on confirmation semantics", () => {
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "AWAITING_DECISION",
      decisionState: "awaiting-confirmation",
    }),
    "Awaiting confirmation",
  );
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    decisionCandidate: { id: OPTION_A.id, label: OPTION_A.label },
  });
  assert.equal(judgment.target?.label, OPTION_A.label);
  assert.equal(judgment.commitmentReview, true);
});

test("ECA:MAINT-2 G — Approved Decision does not keep Decision-needed chip", () => {
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "EXECUTING",
      decisionState: "committed",
    }),
    "Decision approved",
  );
  assert.notEqual(
    compactJourneyStatusLabel({
      journeyState: "EXECUTING",
      decisionState: "committed",
    }),
    "Decision needed",
  );
});

test("ECA:MAINT-2 H — Subject fidelity on Capacity when decision needed", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    decisionNeededSubjectLabel: "Capacity Gap",
  });
  assert.match(judgment.managerFacingNote ?? "", /Capacity Gap/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Demand Surge|Margin Pressure/i);
});

test("ECA:MAINT-2 I — Refresh/lifecycle: label follows decisionState, not stale Awaiting decision wording", () => {
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "AWAITING_DECISION",
      decisionState: "none",
    }),
    "Decision needed",
  );
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "AWAITING_DECISION",
      decisionState: "awaiting-confirmation",
    }),
    "Awaiting confirmation",
  );
  assert.equal(
    compactJourneyStatusLabel({
      journeyState: "EXECUTING",
      decisionState: "committed",
    }),
    "Decision approved",
  );
});

test("ECA:MAINT-2 J — Mutation safety", () => {
  const judgment = review("What would we be committing to?", {
    decisionNeeded: true,
    decisionNeededSubjectLabel: "Capacity Gap",
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.canonicalHandoffAllowed, false);
});
