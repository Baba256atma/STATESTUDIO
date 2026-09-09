import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import { judgeEcaExecutiveInformationNeed } from "./ecaExecutiveInformationNeed.ts";
import { judgeEcaExecutiveAnswerIntake } from "./ecaExecutiveAnswerIntake.ts";
import {
  judgeEcaExecutiveDialogueStrategy,
  nextEcaDialogueStrategySession,
} from "./ecaExecutiveDialogueStrategy.ts";
import {
  judgeEcaExecutiveRecommendation,
  nextEcaRecommendationSession,
  type EcaExecutiveRecommendationJudgment,
  type EcaRecommendationSession,
} from "./ecaExecutiveRecommendation.ts";
import {
  applyEcaCommitmentToPresentedResponse,
  emptyEcaCommitmentSession,
  judgeEcaExecutiveCommitment,
  nextEcaCommitmentSession,
  type EcaCommitmentSession,
  type EcaExecutiveCommitmentJudgment,
} from "./ecaExecutiveCommitment.ts";

const SA = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const SB = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([SA, SB]);

function meaning(utterance: string): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "SUPPLY_INFORMATION",
    requestedOperation: "NONE",
    subject: {
      subjectId: SA.id,
      canonicalName: SA.label,
      lexicalHint: SA.label,
      subjectKind: SA.kind,
    },
    objectReference: {
      subjectId: SA.id,
      canonicalName: SA.label,
      lexicalHint: SA.label,
      subjectKind: SA.kind,
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
      focus: SA,
      selected: null,
      visible: SUBJECTS,
      collection: null,
      theatreSceneId: null,
    }),
    subjects: SUBJECTS,
  });
}

function isolation(judgment: EcaExecutiveCommitmentJudgment) {
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.createsSecondDecisionWriter, false);
  assert.equal(judgment.boundaries.replacesCc10, false);
  assert.equal(judgment.boundaries.replacesDth8, false);
  assert.equal(judgment.boundaries.createsSecondConfirmationEngine, false);
  assert.equal(judgment.falseCommitment, false);
  assert.equal(judgment.staleYesMutation, false);
  assert.equal(judgment.targetDrift, false);
}

function play(
  utterance: string,
  previous: {
    rec?: EcaRecommendationSession | null;
    dialogue?: ReturnType<typeof nextEcaDialogueStrategySession> | null;
    commit?: EcaCommitmentSession | null;
  } = {},
  extras: {
    recPatch?: Partial<EcaExecutiveRecommendationJudgment>;
    committedDecisionId?: string | null;
    decisionCommitmentStatus?: string | null;
    conflict?: boolean;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const informationNeed = judgeEcaExecutiveInformationNeed({
    utterance,
    workingContext,
    actionPlan,
  });
  let answerIntake = judgeEcaExecutiveAnswerIntake({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
  });
  if (extras.conflict) {
    answerIntake = { ...answerIntake, conflict: "VALUE_CONFLICT" };
  }
  const dialogue = judgeEcaExecutiveDialogueStrategy({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    session: previous.dialogue ?? null,
  });
  let recommendation = judgeEcaExecutiveRecommendation({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    dialogueStrategy: dialogue,
    session: previous.rec ?? null,
    committedDecisionId: extras.committedDecisionId,
  });
  if (extras.recPatch) recommendation = { ...recommendation, ...extras.recPatch };
  const judgment = judgeEcaExecutiveCommitment({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    dialogueStrategy: dialogue,
    recommendation,
    session: previous.commit ?? null,
    committedDecisionId: extras.committedDecisionId,
    decisionCommitmentStatus: extras.decisionCommitmentStatus,
  });
  isolation(judgment);
  return {
    utterance,
    actionPlan,
    recommendation,
    judgment,
    recSession: nextEcaRecommendationSession(previous.rec ?? null, utterance, recommendation),
    dialogueSession: nextEcaDialogueStrategySession(previous.dialogue ?? null, utterance, dialogue),
    commitSession: nextEcaCommitmentSession(
      previous.commit ?? null,
      utterance,
      judgment,
      recommendation.criterion,
    ),
  };
}

function chain(
  steps: readonly { utterance: string; extras?: Parameters<typeof play>[2] }[],
) {
  let rec: EcaRecommendationSession | null = null;
  let dialogue: ReturnType<typeof nextEcaDialogueStrategySession> | null = null;
  let commit: EcaCommitmentSession | null = emptyEcaCommitmentSession();
  const turns: ReturnType<typeof play>[] = [];
  for (const step of steps) {
    const turn = play(step.utterance, { rec, dialogue, commit }, step.extras ?? {});
    turns.push(turn);
    rec = turn.recSession;
    dialogue = turn.dialogueSession;
    commit = turn.commitSession;
  }
  return turns;
}

const blocked = {
  recPatch: {
    decisionReadiness: "BLOCKED" as const,
    readiness: "BLOCKED_BY_CRITICAL_UNKNOWN" as const,
    unresolvedCriticalNeedId: "supplier-capacity",
  },
};

test("ECA:8 A — Preference is not commitment", () => {
  const { judgment } = play("I prefer Scenario A.");
  assert.equal(judgment.commitmentState, "PREFERENCE");
  assert.equal(judgment.canonicalHandoffAllowed, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:8 B — Explicit commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
  ]);
  assert.equal(turns[1]?.judgment.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(turns[1]?.actionPlan.authorityTarget, "CC:10 Decision Commitment");
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 C — Generic Yes without pending", () => {
  const { judgment } = play("Yes.");
  assert.equal(judgment.canonicalHandoffAllowed, false);
  assert.equal(judgment.staleYesMutation, false);
});

test("ECA:8 D — Yes with pending confirmation", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Yes." },
  ]);
  assert.equal(turns[2]?.judgment.canonicalHandoffAllowed, true);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 E — Ambiguous it", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose it." },
  ]);
  assert.equal(turns[1]?.judgment.targetResolution, "AMBIGUOUS");
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 F — Recommendation acceptance is not Decision", () => {
  const { judgment } = play("I agree with your recommendation.");
  assert.equal(judgment.commitmentState, "PREFERENCE");
  assert.equal(judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 G — Critical unknown challenge", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
  ]);
  assert.equal(turns[1]?.judgment.preDecisionChallenge, "CHALLENGE_CRITICAL_UNKNOWN");
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 H — Acknowledged uncertainty does not repeat", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "I understand. I still want to proceed with Scenario A.", extras: blocked },
  ]);
  assert.equal(turns[2]?.judgment.challengeAcknowledged, true);
  assert.equal(turns[2]?.judgment.duplicateChallenge, false);
  assert.match(turns[2]?.judgment.managerFacingNote ?? "", /acknowledged/i);
});

test("ECA:8 I — Manager rejects recommendation", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "I choose Scenario B.",
      extras: {
        recPatch: {
          recommendedOption: { id: "scenario-a", label: "Scenario A" },
          counterEvidence: Object.freeze(["B has higher delivery risk in the current comparison."]),
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.target?.label, "Scenario B");
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
  assert.match(turns[1]?.judgment.managerFacingNote ?? "", /B|risk|recommendation/i);
});

test("ECA:8 J — Criteria change challenges stale confirm", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Delivery speed matters most." },
    { utterance: "Choose Scenario A." },
    { utterance: "Actually, cost matters more." },
    { utterance: "Confirm A." },
  ]);
  assert.ok(
    turns[4]?.judgment.preDecisionChallenge === "CHALLENGE_CRITERIA_CHANGE" ||
      turns[4]?.judgment.confirmationRequired === true,
  );
});

test("ECA:8 K — Conflict challenge", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "Choose Scenario A.",
      extras: {
        conflict: true,
        recPatch: {
          decisionReadiness: "READY",
          readiness: "READY",
          unresolvedCriticalNeedId: null,
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.preDecisionChallenge, "CHALLENGE_CONFLICT");
  assert.equal(turns[1]?.judgment.boundaries.writesDataTruth, false);
});

test("ECA:8 L — Cancel", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Cancel." },
  ]);
  assert.equal(turns[2]?.judgment.commitmentState, "CANCELLED");
  assert.equal(turns[2]?.commitSession.awaitingConfirmation, false);
});

test("ECA:8 M — Change target before confirmation", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Actually B." },
  ]);
  assert.equal(turns[2]?.judgment.target?.label, "Scenario B");
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 N — Duplicate confirm does not write twice", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Yes." },
    { utterance: "Yes.", extras: { committedDecisionId: "decision-a", decisionCommitmentStatus: "already-committed" } },
  ]);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
  assert.match(turns[3]?.judgment.managerFacingNote ?? "", /already/i);
});

test("ECA:8 O — Existing Decision", () => {
  const { judgment } = play("Confirm A.", {}, { committedDecisionId: "decision-a" });
  assert.equal(judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 P — Decision vs Execution", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Yes." },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.startsExecution, false);
});

test("ECA:8 Q — Navigation is not commitment", () => {
  const { judgment } = play("Show Scenario A.");
  assert.notEqual(judgment.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 R — Refresh then Yes is stale", () => {
  const { judgment } = play("Yes.", { commit: emptyEcaCommitmentSession() });
  assert.equal(judgment.canonicalHandoffAllowed, false);
  assert.equal(judgment.staleYesMutation, false);
});

test("ECA:8 S — Do it is not a Decision default", () => {
  const { judgment } = play("Do it.");
  assert.equal(judgment.canonicalHandoffAllowed, false);
  assert.equal(judgment.commitmentState, "NONE");
});

test("ECA:8 T — Authority isolation", () => {
  const { judgment } = play("Choose Scenario A.");
  isolation(judgment);
});

test("ECA:8 sequence 1 — preference to commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Which is safer?" },
    { utterance: "I prefer Scenario A." },
    { utterance: "Why do you still prefer A?" },
    { utterance: "Okay, choose A." },
  ]);
  assert.equal(turns[2]?.judgment.commitmentState, "PREFERENCE");
  assert.equal(turns[4]?.judgment.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(turns[2]?.judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 sequence 2 — I agree then choose it", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "I agree." },
    { utterance: "Choose it." },
  ]);
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[2]?.judgment.targetResolution, "AMBIGUOUS");
});

test("ECA:8 sequence 3 — challenge then acknowledge", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "I understand the uncertainty. Proceed.", extras: blocked },
  ]);
  assert.equal(turns[1]?.judgment.preDecisionChallenge, "CHALLENGE_CRITICAL_UNKNOWN");
  assert.equal(turns[2]?.judgment.challengeAcknowledged, true);
});

test("ECA:8 sequence 4 — reject recommendation", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "I choose B.",
      extras: { recPatch: { recommendedOption: { id: "scenario-a", label: "Scenario A" } } },
    },
  ]);
  assert.ok(turns[1]?.judgment.target?.label.toLowerCase().includes("b"));
});

test("ECA:8 sequence 5 — ambiguous choose it", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Tell me more about both." },
    { utterance: "Choose it." },
  ]);
  assert.equal(turns[2]?.judgment.targetResolution, "AMBIGUOUS");
});

test("ECA:8 sequence 6 — change before confirm", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Actually B." },
  ]);
  assert.equal(turns[2]?.judgment.target?.label, "Scenario B");
});

test("ECA:8 sequence 7 — Decision does not start Execution", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Confirm." },
    { utterance: "Start it." },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.startsExecution, false);
  assert.equal(turns[3]?.judgment.boundaries.startsExecution, false);
});

test("ECA:8 sequence 8 — refresh safety", () => {
  chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
  ]);
  const afterRefresh = play("Yes.", { commit: emptyEcaCommitmentSession() });
  assert.equal(afterRefresh.judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 overlay what-am-I-approving", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "What exactly am I approving?" },
  ]);
  const spoken = applyEcaCommitmentToPresentedResponse({
    source: "Decision Theatre remains available.",
    utterance: "What exactly am I approving?",
    judgment: turns[2]!.judgment,
  });
  assert.match(spoken, /Decision/i);
  assert.match(spoken, /Execution/i);
});
