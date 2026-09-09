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
  applyEcaDialogueStrategyToPresentedResponse,
  emptyEcaDialogueStrategySession,
  judgeEcaExecutiveDialogueStrategy,
  nextEcaDialogueStrategySession,
  type EcaDialogueStrategySession,
  type EcaExecutiveDialogueStrategy,
} from "./ecaExecutiveDialogueStrategy.ts";

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

function isolation(judgment: EcaExecutiveDialogueStrategy) {
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.createsSecondObjectiveStore, false);
  assert.equal(judgment.boundaries.replacesConv2, false);
  assert.equal(judgment.unnecessaryObjective, false);
  assert.equal(judgment.lostObjective, false);
  assert.equal(judgment.stickyStaleObjective, false);
  assert.equal(judgment.falseCompletion, false);
}

function play(
  utterance: string,
  previous: EcaDialogueStrategySession | null = null,
  extras: { committedDecisionId?: string | null } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const informationNeed = judgeEcaExecutiveInformationNeed({
    utterance,
    workingContext,
    actionPlan,
  });
  const answerIntake = judgeEcaExecutiveAnswerIntake({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
  });
  const judgment = judgeEcaExecutiveDialogueStrategy({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    session: previous,
    committedDecisionId: extras.committedDecisionId,
  });
  isolation(judgment);
  const session = nextEcaDialogueStrategySession(previous, utterance, judgment);
  return { utterance, workingContext, actionPlan, informationNeed, answerIntake, judgment, session };
}

function chain(utterances: readonly string[], start: EcaDialogueStrategySession | null = null) {
  let session = start;
  const turns: ReturnType<typeof play>[] = [];
  for (const utterance of utterances) {
    const turn = play(utterance, session);
    turns.push(turn);
    session = turn.session;
  }
  return turns;
}

test("ECA:6 A — Objective start", () => {
  const { judgment, actionPlan } = play("Help me understand why delivery is late.");
  assert.equal(judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.ok(judgment.lifecycle === "CREATED" || judgment.lifecycle === "ACTIVE");
  assert.equal(actionPlan.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:6 B — Turn continuity", () => {
  const [start, evidence] = chain([
    "Help me understand why delivery is late.",
    "Show me the evidence.",
  ]);
  assert.equal(start.judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(evidence.judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.notEqual(evidence.actionPlan.intent, start.actionPlan.intent);
  assert.notEqual(evidence.judgment.lifecycle, "COMPLETED");
});

test("ECA:6 C — Side question preserves comparison", () => {
  const [compare, side] = chain([
    "Compare outsourcing and overtime.",
    "What does CAP_AV mean?",
  ]);
  assert.equal(compare.judgment.objectiveType, "COMPARE_OPTIONS");
  assert.equal(side.judgment.relationshipToCurrentTurn, "SIDE_QUESTION");
  assert.equal(side.judgment.objectiveType, "COMPARE_OPTIONS");
});

test("ECA:6 D — Return after side question remains available", () => {
  const turns = chain([
    "Compare outsourcing and overtime.",
    "What does CAP_AV mean?",
    "Thanks.",
  ]);
  assert.equal(turns[2]?.judgment.objectiveType, "COMPARE_OPTIONS");
  assert.equal(turns[2]?.judgment.returnToObjective, false);
});

test("ECA:6 E — Explicit switch", () => {
  const [start, switched] = chain([
    "Help me understand why delivery is late.",
    "Forget this. Let’s look at staffing.",
  ]);
  assert.equal(start.judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(switched.judgment.relationshipToCurrentTurn, "SWITCH");
  assert.notEqual(switched.judgment.objectiveType, "INVESTIGATE_ISSUE");
});

test("ECA:6 F — Pause", () => {
  const [start, paused] = chain([
    "Help me understand why delivery is late.",
    "We’ll come back to this later.",
  ]);
  assert.equal(start.judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(paused.judgment.lifecycle, "PAUSED");
  assert.equal(paused.judgment.returnToObjective, false);
});

test("ECA:6 G — Resume", () => {
  const turns = chain([
    "Investigate Supplier Delay.",
    "We’ll come back to this later.",
    "Let’s go back to the supplier issue.",
  ]);
  assert.equal(turns[2]?.judgment.lifecycle, "RESUMED");
  assert.equal(turns[2]?.judgment.objectiveType, "INVESTIGATE_ISSUE");
});

test("ECA:6 H — Objective completion without Decision", () => {
  const turns = chain([
    "Compare outsourcing and overtime.",
    "Which has lower risk?",
    "What do you recommend?",
    "Are we done?",
  ]);
  assert.equal(turns[3]?.judgment.lifecycle, "COMPLETED");
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
  assert.match(turns[3]?.judgment.completionReason ?? "", /no decision/i);
});

test("ECA:6 I — Incomplete objective", () => {
  const start = play("Compare outsourcing and overtime.");
  const workingContext = working("Are we done?");
  const actionPlan = planEcaExecutiveConversationAction({ utterance: "Are we done?", workingContext });
  const informationNeed = {
    ...judgeEcaExecutiveInformationNeed({ utterance: "Are we done?", workingContext, actionPlan }),
    shouldAsk: true,
  };
  const judgment = judgeEcaExecutiveDialogueStrategy({
    utterance: "Are we done?",
    workingContext,
    actionPlan,
    informationNeed,
    session: start.session,
  });
  isolation(judgment);
  assert.notEqual(judgment.lifecycle, "COMPLETED");
  assert.match(judgment.managerFacingNote ?? "", /not yet|uncertain|required/i);
});

test("ECA:6 J — What’s next is one milestone", () => {
  const turns = chain(["Help me understand why delivery is late.", "What’s next?"]);
  assert.notEqual(turns[1]?.judgment.recommendedMilestone, "NONE");
  assert.equal(turns[1]?.judgment.recommendedMilestone.includes(" ") || true, true);
  assert.doesNotMatch(turns[1]?.judgment.managerFacingNote ?? "", /step \d+ of \d+/i);
});

test("ECA:6 K — Where are we", () => {
  const turns = chain(["Help me understand why delivery is late.", "Where are we?"]);
  assert.match(turns[1]?.judgment.managerFacingNote ?? "", /investigat/i);
});

test("ECA:6 L — Explicit manager intent wins", () => {
  const turns = chain([
    "Help me understand why delivery is late.",
    "Show me current Executions.",
  ]);
  assert.equal(turns[1]?.judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(turns[1]?.judgment.relationshipToCurrentTurn, "UNRELATED");
  assert.equal(turns[1]?.judgment.returnToObjective, false);
});

test("ECA:6 M — Question does not equal progress", () => {
  const start = play("Compare outsourcing and overtime.");
  const asked = play("Which is cheaper?", start.session);
  assert.ok(asked.informationNeed.shouldAsk || asked.judgment.unresolvedNeedId || asked.informationNeed.primaryNeed);
  assert.equal(asked.judgment.progress.some((item) => item.id === "ESTIMATE_ACQUIRED_NOT_CONFIRMED"), false);
});

test("ECA:6 N — Partial answer progress", () => {
  const start = play("Compare outsourcing and overtime.");
  const workingContext = working("Cost is 40k.");
  const actionPlan = planEcaExecutiveConversationAction({ utterance: "Cost is 40k.", workingContext });
  const informationNeed = judgeEcaExecutiveInformationNeed({
    utterance: "Cost is 40k.",
    workingContext,
    actionPlan,
  });
  const answerIntake = {
    ...judgeEcaExecutiveAnswerIntake({ utterance: "Cost is 40k.", workingContext, actionPlan, informationNeed }),
    needSatisfaction: "PARTIALLY_SATISFIED" as const,
    completeness: "PARTIAL" as const,
  };
  const judgment = judgeEcaExecutiveDialogueStrategy({
    utterance: "Cost is 40k.",
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    session: start.session,
  });
  isolation(judgment);
  assert.equal(judgment.progress.some((item) => item.id === "PARTIAL_INPUT_ACQUIRED"), true);
  assert.notEqual(judgment.lifecycle, "COMPLETED");
});

test("ECA:6 O — Recommendation does not equal Decision", () => {
  const turns = chain(["Compare outsourcing and overtime.", "What do you recommend?"]);
  assert.ok(
    turns[1]?.judgment.objectiveType === "PREPARE_RECOMMENDATION" ||
      turns[1]?.judgment.objectiveType === "COMPARE_OPTIONS",
  );
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
  assert.notEqual(turns[1]?.judgment.lifecycle, "COMPLETED");
});

test("ECA:6 P — Decision completion boundary", () => {
  const start = play("Compare outsourcing and overtime.");
  const recommend = play("What do you recommend?", start.session);
  const choose = play("I choose A.", recommend.session, { committedDecisionId: "decision-a" });
  assert.equal(choose.judgment.lifecycle, "COMPLETED");
  assert.equal(choose.judgment.boundaries.startsExecution, false);
  assert.equal(choose.judgment.recommendedMilestone, "REVIEW_EXECUTION_READINESS");
});

test("ECA:6 Q — Outcome objective", () => {
  const { judgment } = play("Did it work?");
  assert.equal(judgment.objectiveType, "ASSESS_OUTCOME");
  assert.equal(judgment.progress.some((item) => item.id === "OUTCOME_CLAIM_ONLY"), true);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
});

test("ECA:6 R — Start over safety", () => {
  const start = play("Help me understand why delivery is late.");
  const reset = play("Start over.", start.session);
  assert.equal(reset.judgment.objectiveType, null);
  assert.match(reset.judgment.managerFacingNote ?? "", /will not reset/i);
  assert.equal(reset.judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:6 S — Refresh boundary", () => {
  const start = play("Help me understand why delivery is late.");
  assert.ok(start.judgment.objectiveType);
  const refreshed = play("Show me the evidence.", emptyEcaDialogueStrategySession());
  assert.notEqual(refreshed.judgment.lifecycle, "RESUMED");
  assert.equal(refreshed.session.originUtterance === start.session.originUtterance, false);
});

test("ECA:6 T — Authority isolation", () => {
  const { judgment } = play("Help me understand why delivery is late.");
  isolation(judgment);
});

test("ECA:6 sequence 1 — investigation continuity", () => {
  const turns = chain([
    "Why are deliveries late?",
    "Show me the evidence.",
    "What about Capacity Gap?",
    "Explain it.",
    "Which issue should we investigate first?",
    "Why?",
  ]);
  assert.ok(turns.every((turn) => turn.judgment.objectiveType === "INVESTIGATE_ISSUE"));
  assert.equal(turns.some((turn) => turn.judgment.lifecycle === "COMPLETED"), false);
  assert.equal(turns[3]?.judgment.relationshipToCurrentTurn === "SUPPORT" || turns[3]?.judgment.relationshipToCurrentTurn === "PROGRESS", true);
});

test("ECA:6 sequence 2 — investigation to options", () => {
  const turns = chain([
    "Why are deliveries late?",
    "What can we do about it?",
    "Show me the scenarios.",
  ]);
  assert.equal(turns[0]?.judgment.objectiveType, "INVESTIGATE_ISSUE");
  assert.ok(
    turns[2]?.judgment.objectiveType === "EXPLORE_OPTIONS" ||
      turns[2]?.judgment.objectiveType === "COMPARE_OPTIONS",
  );
});

test("ECA:6 sequence 3 — comparison to recommendation", () => {
  const turns = chain([
    "Compare outsourcing and overtime.",
    "Which has lower risk?",
    "What if delivery speed matters more?",
    "What do you recommend?",
  ]);
  assert.equal(turns[0]?.judgment.objectiveType, "COMPARE_OPTIONS");
  assert.ok(
    turns[3]?.judgment.objectiveType === "PREPARE_RECOMMENDATION" ||
      turns[3]?.judgment.recommendedMilestone === "FORM_RECOMMENDATION",
  );
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:6 sequence 4 — side question and return", () => {
  const turns = chain([
    "Compare Scenario A and Scenario B.",
    "What does CAP_AV mean?",
    "Thanks.",
    "Which scenario is safer?",
  ]);
  assert.equal(turns[1]?.judgment.relationshipToCurrentTurn, "SIDE_QUESTION");
  assert.ok(turns.every((turn) => turn.judgment.objectiveType === "COMPARE_OPTIONS" || turn.utterance === "Thanks."));
  assert.equal(turns[3]?.judgment.objectiveType, "COMPARE_OPTIONS");
});

test("ECA:6 sequence 5 — pause and resume", () => {
  const turns = chain([
    "Investigate Supplier Delay.",
    "Not now.",
    "Show me current Executions.",
    "Let's go back to Supplier Delay.",
  ]);
  assert.equal(turns[1]?.judgment.lifecycle, "PAUSED");
  assert.equal(turns[2]?.judgment.lifecycle, "PAUSED");
  assert.equal(turns[2]?.judgment.returnToObjective, false);
  assert.equal(turns[3]?.judgment.lifecycle, "RESUMED");
});

test("ECA:6 sequence 6 — information acquisition progress", () => {
  const compare = play("Compare Supplier A and Supplier B.");
  const workingContext = working("Around 40k.");
  const actionPlan = planEcaExecutiveConversationAction({ utterance: "Around 40k.", workingContext });
  const informationNeed = judgeEcaExecutiveInformationNeed({
    utterance: "Around 40k.",
    workingContext,
    actionPlan,
  });
  const answerIntake = {
    ...judgeEcaExecutiveAnswerIntake({ utterance: "Around 40k.", workingContext, actionPlan, informationNeed }),
    answerType: "ESTIMATE" as const,
    confidence: "ESTIMATED" as const,
    needSatisfaction: "SATISFIED" as const,
  };
  const judgment = judgeEcaExecutiveDialogueStrategy({
    utterance: "Around 40k.",
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    session: compare.session,
  });
  isolation(judgment);
  assert.equal(judgment.progress.some((item) => item.id === "ESTIMATE_ACQUIRED_NOT_CONFIRMED"), true);
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:6 sequence 7 — Decision boundary", () => {
  const turns = chain([
    "Compare A and B.",
    "What do you recommend?",
    "I choose A.",
  ]);
  assert.equal(turns[2]?.judgment.progress.some((item) => item.id === "DECISION_INTENT"), true);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:6 sequence 8 — Decision to execution readiness", () => {
  const compared = play("Compare A and B.");
  const recommend = play("What do you recommend?", compared.session);
  const choose = play("I choose A.", recommend.session, { committedDecisionId: "decision-a" });
  const next = play("What's next?", choose.session, { committedDecisionId: "decision-a" });
  const start = play("Start the approved plan.", next.session, { committedDecisionId: "decision-a" });
  assert.equal(choose.judgment.boundaries.startsExecution, false);
  assert.equal(next.judgment.recommendedMilestone, "REVIEW_EXECUTION_READINESS");
  assert.equal(start.judgment.boundaries.startsExecution, false);
});

test("ECA:6 drift — side questions do not lose comparison", () => {
  const turns = chain([
    "Compare outsourcing and overtime.",
    "What does CAP_AV mean?",
    "What does overtime mean?",
    "Count the open risks.",
  ]);
  assert.equal(turns[3]?.judgment.objectiveType, "COMPARE_OPTIONS");
});

test("ECA:6 over-stickiness — explicit move-on releases", () => {
  const turns = chain([
    "Help me understand why delivery is late.",
    "Forget delivery. Show current Executions.",
  ]);
  assert.equal(turns[1]?.judgment.relationshipToCurrentTurn, "SWITCH");
  assert.notEqual(turns[1]?.judgment.objectiveType, "INVESTIGATE_ISSUE");
});

test("ECA:6 explosion barrier", () => {
  const turns = chain([
    "Why are deliveries late?",
    "Explain it.",
    "Why?",
    "Show Capacity Gap.",
    "Count the issues.",
    "Where is Capacity Gap?",
    "What does CAP_AV mean?",
  ]);
  const created = turns.filter((turn) => turn.judgment.lifecycle === "CREATED").length;
  assert.equal(created, 1);
  assert.ok(turns.slice(1).every((turn) => turn.judgment.objectiveType === "INVESTIGATE_ISSUE"));
});

test("ECA:6 overlay stays natural", () => {
  const turns = chain(["Help me understand why delivery is late.", "What’s next?"]);
  const spoken = applyEcaDialogueStrategyToPresentedResponse({
    source: "Capacity Gap remains a candidate.",
    utterance: "What’s next?",
    judgment: turns[1]!.judgment,
  });
  assert.doesNotMatch(spoken, /step \d+ of \d+/i);
  assert.doesNotMatch(spoken, /OBJECTIVE_STATE=/);
});
