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
    decisionCandidate?: Readonly<{ id: string; label: string }> | null;
    candidateChoices?: readonly Readonly<{ id: string; label: string }>[];
    decisionNeeded?: boolean;
    decisionNeededSubjectLabel?: string | null;
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
    decisionCandidate: extras.decisionCandidate,
    candidateChoices: extras.candidateChoices,
    decisionNeeded: extras.decisionNeeded,
    decisionNeededSubjectLabel: extras.decisionNeededSubjectLabel,
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

test("ECA:8 prompt A — Preference only", () => {
  const { judgment } = play("I prefer Demand Surge.");
  assert.equal(judgment.commitmentState, "PREFERENCE");
  assert.equal(judgment.canonicalHandoffAllowed, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt B — Positive evaluation is not commitment", () => {
  const { judgment } = play("That sounds like the best option.");
  assert.notEqual(judgment.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(judgment.canonicalHandoffAllowed, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt C — Explicit commitment hands off only", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Approve Scenario A." },
  ]);
  assert.ok(
    turns[1]?.judgment.commitmentState === "EXPLICIT_COMMITMENT" ||
      turns[1]?.judgment.commitmentState === "AWAITING_CONFIRMATION",
  );
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[1]?.judgment.boundaries.createsSecondDecisionWriter, false);
});

test("ECA:8 prompt D — READY without commitment", () => {
  const turns = chain([
    {
      utterance: "What do you recommend?",
      extras: {
        recPatch: {
          decisionReadiness: "READY",
          readiness: "READY",
          recommendationType: "PREFER_OPTION",
          recommendedOption: { id: "scenario-a", label: "Scenario A" },
        },
      },
    },
  ]);
  assert.equal(turns[0]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[0]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt E — Material challenge when approaching commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
  ]);
  assert.equal(turns[1]?.judgment.challengeRequired, true);
  assert.equal(turns[1]?.judgment.preDecisionChallenge, "CHALLENGE_CRITICAL_UNKNOWN");
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 prompt F — No invented challenge when READY", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "Choose Scenario A.",
      extras: {
        recPatch: {
          decisionReadiness: "READY",
          readiness: "READY",
          unresolvedCriticalNeedId: null,
          uncertainty: Object.freeze([]),
          tradeoffs: Object.freeze([]),
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.preDecisionChallenge, "NONE");
  assert.equal(turns[1]?.judgment.unnecessaryBlocker, false);
});

test("ECA:8 prompt G — One challenge only", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "Choose Scenario A.",
      extras: {
        ...blocked,
        recPatch: {
          ...blocked.recPatch,
          uncertainty: Object.freeze(["capacity", "timing", "staffing"]),
          tradeoffs: Object.freeze(["cost", "speed", "risk"]),
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.preDecisionChallenge, "CHALLENGE_CRITICAL_UNKNOWN");
  assert.equal(turns[1]?.judgment.challengeRequired, true);
});

test("ECA:8 prompt H — Challenge Yes resolves without Decision", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "Yes, I accept that risk.", extras: blocked },
  ]);
  assert.equal(turns[2]?.judgment.challengeAcknowledged, true);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt I — Challenge No blocks commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "No.", extras: blocked },
  ]);
  assert.equal(turns[2]?.judgment.canonicalHandoffAllowed, false);
  assert.notEqual(turns[2]?.judgment.commitmentState, "EXPLICIT_COMMITMENT");
});

test("ECA:8 prompt J — Accept uncertainty ≠ resolve uncertainty", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "I understand the uncertainty. Proceed.", extras: blocked },
  ]);
  assert.equal(turns[2]?.judgment.uncertaintyAcknowledged, true);
  assert.equal(turns[2]?.judgment.boundaries.writesDataTruth, false);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt K — CAP_AV safety on risk acceptance", () => {
  const capAvBlocked = {
    recPatch: {
      decisionReadiness: "BLOCKED" as const,
      readiness: "BLOCKED_BY_CRITICAL_UNKNOWN" as const,
      unresolvedCriticalNeedId: "cap-av",
      uncertainty: Object.freeze(["CAP_AV meaning unconfirmed"]),
    },
  };
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: capAvBlocked },
    {
      utterance: "I understand; proceed with the decision anyway.",
      extras: capAvBlocked,
    },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.writesDataTruth, false);
  assert.ok(turns[2]?.judgment.uncertaintyAcknowledged || turns[2]?.judgment.challengeAcknowledged);
  assert.equal(turns[2]?.recommendation.unresolvedCriticalNeedId, "cap-av");
});

test("ECA:8 prompt L — Preference conflicts with recommendation", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "I prefer Scenario B.",
      extras: {
        recPatch: {
          recommendedOption: { id: "scenario-a", label: "Scenario A" },
          counterEvidence: Object.freeze(["B has higher delivery risk."]),
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.commitmentState, "PREFERENCE");
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt M — Challenge answered once then commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "I understand. I still want to proceed with Scenario A.", extras: blocked },
    { utterance: "Approve Scenario A." },
  ]);
  assert.equal(turns[2]?.judgment.duplicateChallenge, false);
  assert.equal(turns[3]?.judgment.duplicateChallenge, false);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt N — New material evidence may reopen challenge", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "I understand. Proceed with Scenario A.", extras: blocked },
    { utterance: "Actually, cost matters more." },
    { utterance: "Confirm A." },
  ]);
  assert.ok(
    turns[4]?.judgment.preDecisionChallenge === "CHALLENGE_CRITERIA_CHANGE" ||
      turns[4]?.judgment.confirmationRequired === true ||
      turns[4]?.judgment.challengeRequired === true ||
      turns[4]?.judgment.canonicalHandoffAllowed === true,
  );
});

test("ECA:8 prompt O — Ambiguous Approve it", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Approve it." },
  ]);
  assert.equal(turns[1]?.judgment.targetResolution, "AMBIGUOUS");
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 prompt P — Safe Approve with bound candidate", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Approve Scenario A." },
  ]);
  assert.ok(turns[1]?.judgment.target?.label === "Scenario A" || turns[1]?.judgment.targetResolution === "RESOLVED");
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt Q — Stale approval after subject switch", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "What do you recommend?" },
    { utterance: "Forget this. Explain the Goal." },
    { utterance: "Approve it." },
  ]);
  assert.equal(turns[3]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt R — Cancellation", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Never mind. Don't approve it." },
  ]);
  assert.ok(
    turns[2]?.judgment.commitmentState === "CANCELLED" ||
      turns[2]?.judgment.canonicalHandoffAllowed === false,
  );
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt S — Existing Decision protected", () => {
  const { judgment } = play("Yes, that's the one.", {}, {
    committedDecisionId: "dec-approved-1",
    decisionCommitmentStatus: "applied",
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.createsSecondDecisionWriter, false);
  assert.equal(judgment.canonicalHandoffAllowed, false);
});

test("ECA:8 prompt T — Decision identity preserved", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Approve Scenario A." },
  ]);
  assert.equal(turns[1]?.judgment.target?.label, "Scenario A");
  assert.equal(turns[1]?.judgment.targetDrift, false);
});

test("ECA:8 prompt U — Recommendation ≠ commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "What do you recommend?",
      extras: {
        recPatch: {
          recommendationType: "PREFER_OPTION",
          recommendedOption: { id: "scenario-a", label: "Scenario A" },
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[1]?.judgment.boundaries.recommendationAcceptanceEqualsDecision, false);
});

test("ECA:8 prompt V — Readiness ≠ commitment", () => {
  const turns = chain([
    {
      utterance: "What should I check before deciding?",
      extras: { recPatch: { decisionReadiness: "READY", readiness: "READY" } },
    },
  ]);
  assert.equal(turns[0]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[0]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt W — Decision ≠ Execution", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Confirm." },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.startsExecution, false);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt X — No duplicate engine", () => {
  const { judgment } = play("Choose Scenario A.");
  assert.equal(judgment.boundaries.replacesCc10, false);
  assert.equal(judgment.boundaries.replacesDth8, false);
  assert.equal(judgment.boundaries.createsSecondConfirmationEngine, false);
  assert.equal(judgment.boundaries.createsSecondDecisionWriter, false);
});

test("ECA:8 prompt Y — Zero ECA Decision writes across samples", () => {
  for (const sample of [
    play("I prefer Scenario A."),
    play("That sounds like the best option."),
    ...chain([
      { utterance: "Compare Scenario A and Scenario B." },
      { utterance: "Choose Scenario A.", extras: blocked },
      { utterance: "Yes.", extras: blocked },
    ]),
  ]) {
    isolation(sample.judgment);
    assert.equal(sample.judgment.boundaries.commitsDecision, false);
  }
});

test("ECA:8 prompt Z — Explicit intent wins over commitment dialogue", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A." },
    { utterance: "Stop. Show me the Goal." },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
  assert.ok(
    turns[2]?.actionPlan.intent === "EXPLAIN" ||
      turns[2]?.actionPlan.intent === "UNDERSTAND" ||
      turns[2]?.actionPlan.intent === "SHOW" ||
      turns[2]?.judgment.commitmentState === "NONE" ||
      turns[2]?.judgment.canonicalHandoffAllowed === false,
  );
});

test("ECA:8 prompt multi-turn 1 — Recommendation → preference → check", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "What do you recommend?",
      extras: {
        recPatch: {
          recommendationType: "PREFER_OPTION",
          recommendedOption: { id: "scenario-a", label: "Scenario A" },
        },
      },
    },
    { utterance: "I prefer Scenario A." },
    { utterance: "What should I check before deciding?", extras: blocked },
  ]);
  assert.equal(turns[2]?.judgment.commitmentState, "PREFERENCE");
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt multi-turn 2 — Challenge → acceptance → commitment", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "Yes, I accept that risk.", extras: blocked },
    { utterance: "Approve Scenario A." },
  ]);
  assert.equal(turns[1]?.judgment.challengeRequired, true);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[3]?.judgment.boundaries.startsExecution, false);
});

test("ECA:8 prompt multi-turn 3 — Challenge rejection", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Choose Scenario A.", extras: blocked },
    { utterance: "No, I can't accept that.", extras: blocked },
  ]);
  assert.equal(turns[2]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:8 prompt multi-turn 4 — Stale commitment protection", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "What do you recommend?" },
    { utterance: "Forget this. Explain the Goal." },
    { utterance: "Approve it." },
  ]);
  assert.equal(turns[3]?.judgment.canonicalHandoffAllowed, false);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

const CAPACITY_CANDIDATE = Object.freeze({
  id: "ctx-scenario-capacity-expansion",
  label: "Capacity Expansion Plan",
});
const OUTCOME_LEAK = /which business outcome|help investigate that/i;
const LEAK = /\b(?:ECA(?::|-)|CC:\d|DTH|UNSPECIFIED)\b/i;

test("ECA:MAINT-1 A — Exact observed failure: commitment review binds current candidate", () => {
  const { judgment } = play("What would we be committing to?", {}, {
    decisionCandidate: CAPACITY_CANDIDATE,
    recPatch: {
      recommendedOption: {
        id: CAPACITY_CANDIDATE.id,
        label: CAPACITY_CANDIDATE.label,
      },
      decisionReadiness: "READY_WITH_CONDITIONS",
    },
  });
  assert.equal(judgment.commitmentReview, true);
  assert.notEqual(judgment.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(judgment.target?.label, CAPACITY_CANDIDATE.label);
  assert.match(judgment.managerFacingNote ?? "", /Capacity Expansion Plan/i);
  assert.match(judgment.managerFacingNote ?? "", /would not start execution|not start execution/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", OUTCOME_LEAK);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  const spoken = applyEcaCommitmentToPresentedResponse({
    source: "I can help investigate that, but I need to know which business outcome you're referring to.",
    utterance: "What would we be committing to?",
    judgment,
  });
  assert.doesNotMatch(spoken, OUTCOME_LEAK);
  assert.match(spoken, /Capacity Expansion Plan/i);
  assert.doesNotMatch(spoken, LEAK);
});

test("ECA:MAINT-1 B — Semantic variant: what exactly am I approving", () => {
  const { judgment } = play("What exactly am I approving?", {}, {
    decisionCandidate: CAPACITY_CANDIDATE,
  });
  assert.equal(judgment.commitmentReview, true);
  assert.equal(judgment.target?.id, CAPACITY_CANDIDATE.id);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.notEqual(judgment.commitmentState, "EXPLICIT_COMMITMENT");
});

test("ECA:MAINT-1 C — Recommendation distinction", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    {
      utterance: "Do you recommend it?",
      extras: {
        decisionCandidate: { id: "scenario-a", label: "Scenario A" },
        recPatch: {
          recommendationType: "PREFER_OPTION",
          recommendedOption: { id: "scenario-a", label: "Scenario A" },
        },
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.commitmentReview, false);
  assert.notEqual(turns[1]?.judgment.commitmentState, "EXPLICIT_COMMITMENT");
});

test("ECA:MAINT-1 D — Explicit commitment preserved", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Approve it.", extras: { decisionCandidate: { id: "scenario-a", label: "Scenario A" } } },
  ]);
  assert.equal(turns[1]?.judgment.commitmentReview, false);
  assert.ok(
    turns[1]?.judgment.commitmentState === "EXPLICIT_COMMITMENT" ||
      turns[1]?.judgment.commitmentState === "AWAITING_CONFIRMATION" ||
      turns[1]?.actionPlan.intent === "COMMIT_DECISION",
  );
});

test("ECA:MAINT-1 E — Execution distinction: Start it is not commitment review", () => {
  const { judgment, actionPlan } = play("Start it.", {}, {
    decisionCandidate: CAPACITY_CANDIDATE,
    committedDecisionId: "dec-1",
  });
  assert.equal(judgment.commitmentReview, false);
  assert.ok(actionPlan.intent === "REQUEST_EXECUTION_ACTION" || judgment.commitmentReview === false);
});

test("ECA:MAINT-1 F — No candidate clarifies without fabrication", () => {
  const { judgment } = play("What am I committing to?");
  assert.equal(judgment.commitmentReview, true);
  assert.equal(judgment.target, null);
  assert.equal(judgment.targetResolution, "UNKNOWN");
  assert.match(judgment.managerFacingNote ?? "", /no current Decision candidate|Name the option/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Capacity Expansion|Scenario A|Demand Surge/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:MAINT-1 G — Multiple candidates clarify", () => {
  const { judgment } = play("What would we be committing to?", {}, {
    candidateChoices: [
      { id: "scenario-a", label: "Scenario A" },
      { id: "scenario-b", label: "Scenario B" },
    ],
  });
  assert.equal(judgment.commitmentReview, true);
  assert.equal(judgment.targetResolution, "AMBIGUOUS");
  assert.equal(judgment.target, null);
  assert.match(judgment.managerFacingNote ?? "", /Which one|more than one/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:MAINT-1 H — Stale Outcome context: commitment candidate wins", () => {
  const { judgment } = play("What would we be committing to?", {}, {
    decisionCandidate: CAPACITY_CANDIDATE,
    recPatch: {
      // stale investigation-style uncertainty must not divert review
      uncertainty: Object.freeze(["Earlier Outcome observation remains inconclusive."]),
    },
  });
  assert.equal(judgment.target?.label, CAPACITY_CANDIDATE.label);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", OUTCOME_LEAK);
  assert.match(judgment.managerFacingNote ?? "", /Capacity Expansion Plan/i);
});

test("ECA:MAINT-1 I — Subject fidelity stays on Capacity candidate", () => {
  const { judgment } = play("What would we be committing to?", {}, {
    decisionCandidate: CAPACITY_CANDIDATE,
  });
  assert.match(judgment.target?.label ?? "", /Capacity/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Demand Surge|Pricing Response|Margin Pressure/i);
});

test("ECA:MAINT-1 J — Mutation safety on commitment review", () => {
  const { judgment } = play("What would we be committing to?", {}, {
    decisionCandidate: CAPACITY_CANDIDATE,
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.canonicalHandoffAllowed, false);
});
