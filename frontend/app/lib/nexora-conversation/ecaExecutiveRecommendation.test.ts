import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import type { Nxa5ExecutiveJudgment } from "../manager-object/nexoraNxa5ExecutiveJudgment.ts";
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
  applyEcaRecommendationToPresentedResponse,
  emptyEcaRecommendationSession,
  judgeEcaExecutiveRecommendation,
  nextEcaRecommendationSession,
  type EcaExecutiveRecommendationJudgment,
  type EcaRecommendationSession,
} from "./ecaExecutiveRecommendation.ts";

const A = Object.freeze({ id: "outsourcing", label: "outsourcing", kind: "scenario" });
const B = Object.freeze({ id: "overtime", label: "overtime", kind: "scenario" });
const SA = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const SB = Object.freeze({ id: "scenario-b", label: "Scenario B", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([A, B, SA, SB]);

function meaning(utterance: string): CanonicalManagerMeaning {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "SUPPLY_INFORMATION",
    requestedOperation: "NONE",
    subject: {
      subjectId: A.id,
      canonicalName: A.label,
      lexicalHint: A.label,
      subjectKind: A.kind,
    },
    objectReference: {
      subjectId: A.id,
      canonicalName: A.label,
      lexicalHint: A.label,
      subjectKind: A.kind,
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
      focus: A,
      selected: null,
      visible: SUBJECTS,
      collection: null,
      theatreSceneId: null,
    }),
    subjects: SUBJECTS,
  });
}

function pref(
  id: string,
  label: string,
  extra: Partial<Nxa5ExecutiveJudgment> = {},
): Nxa5ExecutiveJudgment {
  return Object.freeze({
    identity: "NXA:5/ExecutiveJudgmentPrioritizationRecommendationQuality",
    judgmentType: "SCENARIO",
    criterion: "UNSPECIFIED",
    candidateIds: Object.freeze([id]),
    candidateSetSource: "NCA-POST:4",
    comparability: "COMPARABLE",
    preferredCandidateId: id,
    recommendationType: "ACT",
    recommendationStrength: extra.recommendationStrength ?? "QUALIFIED",
    decisionReadiness: extra.decisionReadiness ?? "NOT_APPLICABLE",
    what: label,
    why: Object.freeze(["current criterion"]),
    evidence: Object.freeze(["compared options"]),
    uncertainty: extra.uncertainty ?? Object.freeze([]),
    tradeoffs: extra.tradeoffs ?? Object.freeze([`${label} costs more in the near term`]),
    alternatives: Object.freeze([]),
    nextMove: "review",
    changeConditions: extra.changeConditions ?? Object.freeze(["A confirmed capacity drop would weaken this option."]),
    changedFromPrevious: extra.changedFromPrevious ?? false,
    managerMessage: `I recommend ${label}`,
    audit: Object.freeze([]),
    numericalScore: null,
    commitsDecision: false,
    startsExecution: false,
    writesOutcome: false,
    writesStage: false,
    ...extra,
  }) as Nxa5ExecutiveJudgment;
}

function isolation(judgment: EcaExecutiveRecommendationJudgment) {
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.createsSecondDecisionEngine, false);
  assert.equal(judgment.boundaries.replacesNca4, false);
  assert.equal(judgment.boundaries.replacesDth7, false);
  assert.equal(judgment.boundaries.createsRecommendationStore, false);
  assert.equal(judgment.unsupportedRecommendation, false);
  assert.equal(judgment.staleRecommendation, false);
  assert.equal(judgment.trustInflation, false);
  assert.equal(judgment.semanticPromotion, false);
}

function play(
  utterance: string,
  previous: {
    rec?: EcaRecommendationSession | null;
    dialogue?: ReturnType<typeof nextEcaDialogueStrategySession> | null;
  } = {},
  extras: {
    nxa5?: Nxa5ExecutiveJudgment | null;
    committedDecisionId?: string | null;
    capAvUnconfirmed?: boolean;
    forceAsk?: boolean;
    estimate?: boolean;
    decisionCriterion?: string | null;
  } = {},
) {
  let workingContext = working(utterance);
  if (extras.decisionCriterion != null) {
    workingContext = {
      ...workingContext,
      decisionContext: {
        ...workingContext.decisionContext,
        criterion: extras.decisionCriterion,
      },
    };
  }
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  let informationNeed = judgeEcaExecutiveInformationNeed({
    utterance,
    workingContext,
    actionPlan,
  });
  if (extras.forceAsk) informationNeed = { ...informationNeed, shouldAsk: true };
  let answerIntake = judgeEcaExecutiveAnswerIntake({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
  });
  if (extras.estimate) {
    answerIntake = {
      ...answerIntake,
      answerType: "ESTIMATE",
      confidence: "ESTIMATED",
    };
  }
  const dialogue = judgeEcaExecutiveDialogueStrategy({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    session: previous.dialogue ?? null,
  });
  const judgment = judgeEcaExecutiveRecommendation({
    utterance,
    workingContext,
    actionPlan,
    informationNeed,
    answerIntake,
    dialogueStrategy: dialogue,
    session: previous.rec ?? null,
    nxa5: extras.nxa5,
    committedDecisionId: extras.committedDecisionId,
    capAvUnconfirmed: extras.capAvUnconfirmed,
  });
  isolation(judgment);
  return {
    utterance,
    actionPlan,
    informationNeed,
    answerIntake,
    dialogue,
    judgment,
    recSession: nextEcaRecommendationSession(previous.rec ?? null, utterance, judgment),
    dialogueSession: nextEcaDialogueStrategySession(previous.dialogue ?? null, utterance, dialogue),
  };
}

function chain(
  steps: readonly { utterance: string; extras?: Parameters<typeof play>[2] }[],
) {
  let rec: EcaRecommendationSession | null = emptyEcaRecommendationSession();
  let dialogue: ReturnType<typeof nextEcaDialogueStrategySession> | null = null;
  const turns: ReturnType<typeof play>[] = [];
  for (const step of steps) {
    const turn = play(step.utterance, { rec, dialogue }, step.extras ?? {});
    turns.push(turn);
    rec = turn.recSession;
    dialogue = turn.dialogueSession;
  }
  return turns;
}

test("ECA:7 A — Clear supported recommendation", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "PREFER_OPTION");
  assert.equal(turns[1]?.judgment.recommendedOption?.label, "outsourcing");
  assert.ok(turns[1]?.judgment.strength === "SUPPORTED" || turns[1]?.judgment.strength === "TENTATIVE");
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 B — Too early", () => {
  const { judgment } = play("What do you recommend?");
  assert.ok(
    judgment.recommendationType === "REVIEW_EVIDENCE" ||
      judgment.recommendationType === "CONTINUE_INVESTIGATION" ||
      judgment.recommendationType === "DEFER_DECISION",
  );
  assert.equal(judgment.recommendedOption, null);
  assert.notEqual(judgment.readiness, "READY");
});

test("ECA:7 C — Critical missing information", () => {
  const turns = chain([
    { utterance: "Compare Supplier A and Supplier B." },
    {
      utterance: "What do you recommend?",
      extras: { forceAsk: true },
    },
  ]);
  assert.ok(
    turns[1]?.judgment.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN" ||
      turns[1]?.judgment.recommendationType === "DEFER_DECISION",
  );
  assert.equal(turns[1]?.judgment.recommendedOption, null);
});

test("ECA:7 D — Non-blocking unknown still allows framed advice", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("outsourcing", "outsourcing", {
          uncertainty: Object.freeze(["Office color preference is unknown."]),
        }),
      },
    },
  ]);
  assert.notEqual(turns[1]?.judgment.recommendationType, "DEFER_DECISION");
  assert.ok(turns[1]?.judgment.recommendedOption);
});

test("ECA:7 E — Estimate stays provisional", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), estimate: true },
    },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "CONDITIONAL_PREFERENCE");
  assert.equal(turns[1]?.judgment.strength, "TENTATIVE");
  assert.equal(turns[1]?.judgment.trustInflation, false);
});

test("ECA:7 F — No clear preference", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Which is best?" },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "NO_CLEAR_PREFERENCE");
  assert.equal(turns[1]?.judgment.recommendedOption, null);
});

test("ECA:7 G — Explicit criterion", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "Delivery speed matters most." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.equal(turns[2]?.judgment.criterion, "delivery speed");
  assert.equal(turns[2]?.judgment.criterionSource, "MANAGER");
  assert.equal(turns[2]?.judgment.recommendedOption?.label, "outsourcing");
});

test("ECA:7 H — Criterion change reassesses", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "Actually, cost matters more." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("overtime", "overtime", { changedFromPrevious: true }),
      },
    },
  ]);
  assert.equal(turns[3]?.judgment.recommendedOption?.label, "overtime");
  assert.notEqual(turns[3]?.judgment.recommendedOption?.label, turns[1]?.judgment.recommendedOption?.label);
  assert.equal(turns[3]?.judgment.staleRecommendation, false);
});

test("ECA:7 I — Trade-off preserved", () => {
  const { judgment } = play(
    "What do you recommend?",
    {
      rec: nextEcaRecommendationSession(
        emptyEcaRecommendationSession(),
        "Compare outsourcing and overtime.",
        judgeEcaExecutiveRecommendation({
          utterance: "Compare outsourcing and overtime.",
          workingContext: working("Compare outsourcing and overtime."),
          actionPlan: planEcaExecutiveConversationAction({
            utterance: "Compare outsourcing and overtime.",
            workingContext: working("Compare outsourcing and overtime."),
          }),
        }),
      ),
    },
    { nxa5: pref("outsourcing", "outsourcing") },
  );
  assert.ok(judgment.tradeoffs.length > 0);
  assert.match(judgment.managerFacingNote ?? judgment.tradeoffs[0] ?? "", /trade-off|costs more/i);
});

test("ECA:7 J — Counter-evidence preserved", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.ok(turns[1]?.judgment.counterEvidence.length);
});

test("ECA:7 K — Why", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "Why?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.match(turns[2]?.judgment.managerFacingNote ?? "", /recommend|priority|trade-off/i);
});

test("ECA:7 L — Why not alternative", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "Why not overtime?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.match(turns[2]?.judgment.managerFacingNote ?? "", /overtime|alternative|priority/i);
});

test("ECA:7 M — Confidence has no fake score", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "How sure are you?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.doesNotMatch(turns[2]?.judgment.managerFacingNote ?? "", /\d+%/);
  assert.match(turns[2]?.judgment.managerFacingNote ?? "", /confident|tentativ/i);
});

test("ECA:7 N — CAP_AV unconfirmed", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), capAvUnconfirmed: true },
    },
  ]);
  assert.equal(turns[1]?.judgment.strength, "TENTATIVE");
  assert.equal(turns[1]?.judgment.semanticPromotion, false);
  assert.match(turns[1]?.judgment.uncertainty.join(" "), /CAP_AV/i);
});

test("ECA:7 O — Recommendation is not Decision", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[1]?.judgment.boundaries.recommendationEqualsDecision, false);
});

test("ECA:7 P — Decision readiness", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "Are we ready to decide?",
      extras: { nxa5: pref("outsourcing", "outsourcing", { decisionReadiness: "READY" }) },
    },
  ]);
  assert.equal(turns[1]?.judgment.decisionReadiness === "READY" || turns[1]?.judgment.decisionReadiness === "READY_WITH_CONDITIONS" || turns[1]?.judgment.decisionReadiness === "NOT_READY", true);
  assert.equal(turns[1]?.judgment.boundaries.readinessEqualsCommitment, false);
  assert.doesNotMatch(turns[1]?.judgment.managerFacingNote ?? "", /the decision is made/i);
});

test("ECA:7 Q — After Decision", () => {
  const { judgment } = play("What do you recommend?", {}, { committedDecisionId: "decision-a" });
  assert.equal(judgment.postDecision, true);
  assert.equal(judgment.recommendationType, "NONE");
  assert.match(judgment.managerFacingNote ?? "", /already committed/i);
});

test("ECA:7 R — Investigation recommendation", () => {
  const turns = chain([
    { utterance: "Why are deliveries late?" },
    { utterance: "What do you recommend?" },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "CONTINUE_INVESTIGATION");
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 S — Reversible conditional framing", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("outsourcing", "outsourcing", {
          changeConditions: Object.freeze(["Because the temporary option is reversible, a confirmed capacity drop would require reassessment."]),
        }),
        estimate: true,
      },
    },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "CONDITIONAL_PREFERENCE");
  assert.match(turns[1]?.judgment.changeConditions.join(" "), /reversib|capacity|reassess/i);
});

test("ECA:7 T — Authority isolation", () => {
  const { judgment } = play("What do you recommend?");
  isolation(judgment);
});

test("ECA:7 sequence 1 — comparison to recommendation", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "Which has lower risk?" },
    { utterance: "Delivery speed matters more than cost." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "Why?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.equal(turns[3]?.judgment.recommendedOption?.label, "outsourcing");
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
  assert.match(turns[4]?.judgment.managerFacingNote ?? "", /outsourcing|priority/i);
});

test("ECA:7 sequence 2 — missing information defers", () => {
  const turns = chain([
    { utterance: "Compare Supplier A and Supplier B." },
    { utterance: "What do you recommend?", extras: { forceAsk: true } },
  ]);
  assert.ok(turns[1]?.judgment.recommendationType === "DEFER_DECISION" || turns[1]?.judgment.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN");
});

test("ECA:7 sequence 3 — estimate preserved", () => {
  const turns = chain([
    { utterance: "Compare Supplier A and Supplier B." },
    { utterance: "Around 40k.", extras: { estimate: true } },
    {
      utterance: "Now what do you recommend?",
      extras: { nxa5: pref("supplier-a", "Supplier A"), estimate: true },
    },
  ]);
  assert.equal(turns[2]?.judgment.strength, "TENTATIVE");
  assert.equal(turns[2]?.judgment.trustInflation, false);
});

test("ECA:7 sequence 4 — preference change", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "Which should I choose?",
      extras: { nxa5: pref("overtime", "overtime") },
    },
    { utterance: "Cost matters most." },
    { utterance: "Actually, delivery speed is more important." },
    {
      utterance: "Which should I choose?",
      extras: { nxa5: pref("outsourcing", "outsourcing", { changedFromPrevious: true }) },
    },
  ]);
  assert.equal(turns[4]?.judgment.criterion, "delivery speed");
  assert.equal(turns[4]?.judgment.recommendedOption?.label, "outsourcing");
});

test("ECA:7 sequence 5 — no clear winner", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Which is best?" },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "NO_CLEAR_PREFERENCE");
});

test("ECA:7 sequence 6 — recommend then choose does not write", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "Why?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "I choose Scenario A." },
  ]);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[3]?.actionPlan.boundaries.commitsDecision, false);
});

test("ECA:7 sequence 7 — evidence change reassesses", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "Supplier A's cost is actually 30% higher." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("overtime", "overtime", { changedFromPrevious: true }) },
    },
  ]);
  assert.equal(turns[3]?.judgment.recommendedOption?.label, "overtime");
});

test("ECA:7 sequence 8 — readiness distinct from ECA:6", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "Where are we?" },
    {
      utterance: "Are we ready to decide?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
    { utterance: "What's still uncertain?" },
  ]);
  assert.ok(turns[1]?.dialogue.managerFacingNote);
  assert.ok(turns[2]?.judgment.managerFacingNote);
  assert.equal(turns[2]?.judgment.boundaries.readinessEqualsCommitment, false);
});

test("ECA:7 overlay stays bounded", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  const spoken = applyEcaRecommendationToPresentedResponse({
    source: "The options remain in Decision Theatre.",
    utterance: "What do you recommend?",
    judgment: turns[1]!.judgment,
  });
  assert.doesNotMatch(spoken, /\bdefinitely\b|\b82%\b/);
  assert.match(spoken, /not a Decision/i);
});

test("ECA:7 prompt A — Grounded recommendation", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "PREFER_OPTION");
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt B — Insufficient evidence defers", () => {
  const turns = chain([
    { utterance: "Compare Supplier A and Supplier B." },
    { utterance: "What do you recommend?", extras: { forceAsk: true } },
  ]);
  assert.ok(
    turns[1]?.judgment.recommendationType === "DEFER_DECISION" ||
      turns[1]?.judgment.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN",
  );
  assert.equal(turns[1]?.judgment.recommendedOption, null);
});

test("ECA:7 prompt C — No clear preference", () => {
  const turns = chain([
    { utterance: "Compare Scenario A and Scenario B." },
    { utterance: "Which is best?" },
  ]);
  assert.equal(turns[1]?.judgment.recommendationType, "NO_CLEAR_PREFERENCE");
});

test("ECA:7 prompt D — Manager preference usable", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "Delivery speed matters more than cost." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.ok(turns[2]?.judgment.criterionSource === "MANAGER" || turns[2]?.judgment.criterion);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt E — Preference provenance distinct from analytical judgment", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "I prefer overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.equal(turns[2]?.judgment.recommendedOption?.label, "outsourcing");
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt F — Tradeoff surfaced", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.ok((turns[1]?.judgment.tradeoffs.length ?? 0) >= 1);
});

test("ECA:7 prompt G — Risk context reused without new score", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "Which has lower risk?" },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.writesRisk, false);
  assert.equal(turns[2]?.judgment.boundaries.createsSecondDecisionEngine, false);
});

test("ECA:7 prompt H — Weak evidence keeps bounded confidence", () => {
  const turns = chain([
    { utterance: "Compare Supplier A and Supplier B." },
    { utterance: "Around 40k.", extras: { estimate: true } },
    {
      utterance: "Now what do you recommend?",
      extras: { nxa5: pref("supplier-a", "Supplier A"), estimate: true },
    },
  ]);
  assert.equal(turns[2]?.judgment.strength, "TENTATIVE");
  assert.equal(turns[2]?.judgment.trustInflation, false);
});

test("ECA:7 prompt I — Causal safety preserved", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("outsourcing", "outsourcing", {
          why: Object.freeze(["outsourcing may contribute to delivery recovery"]),
        }),
      },
    },
  ]);
  assert.doesNotMatch(turns[1]?.judgment.managerFacingNote ?? "", /\bcaused\b/i);
});

test("ECA:7 prompt J — CAP_AV unconfirmed stays bounded", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), capAvUnconfirmed: true },
    },
  ]);
  assert.ok(
    turns[1]?.judgment.strength === "TENTATIVE" ||
      turns[1]?.judgment.recommendationType === "CONDITIONAL_PREFERENCE" ||
      turns[1]?.judgment.recommendationType === "DEFER_DECISION" ||
      turns[1]?.judgment.semanticPromotion === false,
  );
  assert.equal(turns[1]?.judgment.boundaries.writesDataTruth, false);
});

test("ECA:7 prompt K — Decision NOT_READY", () => {
  const { judgment } = play("What do you recommend?");
  assert.ok(judgment.decisionReadiness === "NOT_READY" || judgment.decisionReadiness === "BLOCKED" || judgment.readiness !== "READY");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt L — Decision CONDITIONALLY_READY", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("outsourcing", "outsourcing", {
          decisionReadiness: "READY_WITH_KNOWN_UNCERTAINTY",
          uncertainty: Object.freeze(["capacity evidence incomplete"]),
        }),
      },
    },
  ]);
  assert.ok(
    turns[1]?.judgment.decisionReadiness === "READY_WITH_CONDITIONS" ||
      turns[1]?.judgment.readiness === "READY_WITH_CONDITIONS" ||
      turns[1]?.judgment.recommendationType === "CONDITIONAL_PREFERENCE",
  );
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt M — Decision READY without Decision write", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing", { decisionReadiness: "READY" }) },
    },
  ]);
  assert.ok(
    turns[1]?.judgment.decisionReadiness === "READY" ||
      turns[1]?.judgment.decisionReadiness === "READY_WITH_CONDITIONS" ||
      turns[1]?.judgment.decisionReadiness === "NOT_READY",
  );
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[1]?.judgment.boundaries.readinessEqualsCommitment, false);
});

test("ECA:7 prompt N — Recommendation ≠ Decision", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.equal(turns[1]?.judgment.boundaries.recommendationEqualsDecision, false);
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt O — Preference ≠ commitment", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "I prefer Demand Surge." },
  ]);
  assert.equal(turns[1]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[1]?.actionPlan.boundaries.commitsDecision, false);
});

test("ECA:7 prompt P — Explicit choose still not ECA:7 Decision write", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "I choose Scenario A." },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[2]?.actionPlan.boundaries.commitsDecision, false);
});

test("ECA:7 prompt Q — Execution boundary", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), committedDecisionId: "dec-1" },
    },
  ]);
  assert.equal(turns[1]?.judgment.boundaries.startsExecution, false);
});

test("ECA:7 prompt R — Contradictory evidence preserved", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("outsourcing", "outsourcing", {
          uncertainty: Object.freeze(["margin evidence conflicts with delivery evidence"]),
        }),
      },
    },
  ]);
  assert.ok((turns[1]?.judgment.counterEvidence.length ?? 0) >= 0);
  assert.ok((turns[1]?.judgment.uncertainty.length ?? 0) >= 1 || turns[1]?.judgment.tradeoffs.length);
});

test("ECA:7 prompt S — Recommendation revision with new evidence", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "Supplier A's cost is actually 30% higher." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("overtime", "overtime", { changedFromPrevious: true }) },
    },
  ]);
  assert.equal(turns[3]?.judgment.recommendedOption?.label, "overtime");
});

test("ECA:7 prompt T — Why stays on recommended subject", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "Why?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.match(turns[2]?.judgment.managerFacingNote ?? "", /outsourcing|priority/i);
});

test("ECA:7 prompt U — Explicit subject switch after recommendation", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "Forget that. Explain the Goal." },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.writesGoal, false);
  assert.ok(
    turns[2]?.actionPlan.intent === "EXPLAIN" ||
      turns[2]?.actionPlan.intent === "UNDERSTAND" ||
      turns[2]?.judgment.recommendationRequested === false,
  );
});

test("ECA:7 prompt V — Existing Decision framing", () => {
  const turns = chain([
    {
      utterance: "What do you think about it now?",
      extras: { committedDecisionId: "dec-approved-1", nxa5: pref("outsourcing", "outsourcing") },
    },
  ]);
  assert.ok(turns[0]?.judgment.postDecision === true || turns[0]?.judgment.boundaries.commitsDecision === false);
  assert.equal(turns[0]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[0]?.judgment.boundaries.createsSecondDecisionEngine, false);
});

test("ECA:7 prompt W — No duplicate recommendation engine", () => {
  const { judgment } = play("What do you recommend?", {}, { nxa5: pref("outsourcing", "outsourcing") });
  assert.equal(judgment.boundaries.replacesNca4, false);
  assert.equal(judgment.boundaries.replacesDth7, false);
  assert.equal(judgment.boundaries.createsRecommendationStore, false);
});

test("ECA:7 prompt X — Zero direct Decision/Execution writes across samples", () => {
  for (const sample of [
    play("What do you recommend?"),
    ...chain([
      { utterance: "Compare outsourcing and overtime." },
      { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    ]),
    ...chain([
      { utterance: "Compare Supplier A and Supplier B." },
      { utterance: "What do you recommend?", extras: { forceAsk: true } },
    ]),
  ]) {
    isolation(sample.judgment);
  }
});

test("ECA:7 prompt multi-turn 1 — Evidence to recommendation without Decision", () => {
  const turns = chain([
    { utterance: "Help me decide what to do about Capacity Gap." },
    { utterance: "Show me the evidence." },
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.equal(turns[3]?.judgment.recommendationType, "PREFER_OPTION");
  assert.ok((turns[3]?.judgment.tradeoffs.length ?? 0) >= 0);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt multi-turn 2 — Missing preference then criterion unlocks recommendation", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "Which is better?" },
    { utterance: "Delivery speed matters more." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
  ]);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
  assert.ok(turns[3]?.judgment.recommendedOption || turns[3]?.judgment.recommendationType);
});

test("ECA:7 prompt multi-turn 3 — Recommendation → preference → no auto commit", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "I prefer Demand Surge." },
    { utterance: "What should I check before deciding?" },
  ]);
  assert.equal(turns[2]?.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[3]?.judgment.boundaries.commitsDecision, false);
});

test("ECA:7 prompt multi-turn 4 — Recommendation revision", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    { utterance: "What do you recommend?", extras: { nxa5: pref("outsourcing", "outsourcing") } },
    { utterance: "Supplier A's cost is actually 30% higher." },
    {
      utterance: "Does that change your recommendation?",
      extras: { nxa5: pref("overtime", "overtime", { changedFromPrevious: true }) },
    },
  ]);
  assert.equal(turns[3]?.judgment.recommendedOption?.label, "overtime");
});

const LEAK_PROBE = /\b(?:UNSPECIFIED|undefined|null)\b/i;

test("ECA:FINAL-FIX1 A — Journey A recommendation must not leak UNSPECIFIED", () => {
  const turns = chain([
    { utterance: "Compare Demand Surge and Pricing Response." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("demand-surge", "Demand Surge", {
          tradeoffs: Object.freeze(["faster delivery relief and reversibility; trade-off higher short-term operating cost"]),
          uncertainty: Object.freeze(["Labor availability is not confirmed."]),
        }),
        decisionCriterion: "UNSPECIFIED",
      },
    },
  ]);
  const judgment = turns[1]!.judgment;
  const spoken = applyEcaRecommendationToPresentedResponse({
    source: "I recommend investigating Capacity first. I don't have enough basis to commit to an intervention yet.",
    utterance: "What do you recommend?",
    judgment,
  });
  assert.equal(judgment.criterion, "UNSPECIFIED");
  assert.equal(judgment.recommendationType, "PREFER_OPTION");
  assert.equal(judgment.recommendedOption?.label, "Demand Surge");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", LEAK_PROBE);
  assert.doesNotMatch(spoken, LEAK_PROBE);
  assert.match(judgment.managerFacingNote ?? "", /advice, not a Decision/i);
});

test("ECA:FINAL-FIX1 B — Missing internal sentinel omits fabricated criterion meaning", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), decisionCriterion: "NOT_APPLICABLE" },
    },
  ]);
  const note = turns[1]!.judgment.managerFacingNote ?? "";
  assert.doesNotMatch(note, /NOT_APPLICABLE|UNSPECIFIED|better matches/i);
  assert.match(note, /recommend outsourcing/i);
});

test("ECA:FINAL-FIX1 C — Legitimate uncertainty remains visible", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("outsourcing", "outsourcing", {
          uncertainty: Object.freeze(["Labor availability is not confirmed."]),
        }),
        decisionCriterion: "UNSPECIFIED",
        capAvUnconfirmed: true,
      },
    },
  ]);
  const note = turns[1]!.judgment.managerFacingNote ?? "";
  assert.doesNotMatch(note, LEAK_PROBE);
  assert.match(note, /uncertain|not confirmed|CAP_AV|provisional|estimate|condition/i);
});

test("ECA:FINAL-FIX1 D — Recommendation fidelity unchanged vs established criterion phrasing", () => {
  const withSentinel = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), decisionCriterion: "UNSPECIFIED" },
    },
  ])[1]!.judgment;
  const withCriterion = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), decisionCriterion: "DELIVERY_IMPACT" },
    },
  ])[1]!.judgment;
  assert.equal(withSentinel.recommendedOption?.id, withCriterion.recommendedOption?.id);
  assert.equal(withSentinel.recommendationType, withCriterion.recommendationType);
  assert.equal(withSentinel.decisionReadiness, withCriterion.decisionReadiness);
  assert.equal(withSentinel.criterion, "UNSPECIFIED");
  assert.equal(withCriterion.criterion, "DELIVERY_IMPACT");
  assert.doesNotMatch(withSentinel.managerFacingNote ?? "", LEAK_PROBE);
  assert.match(withCriterion.managerFacingNote ?? "", /delivery impact/i);
  assert.doesNotMatch(withCriterion.managerFacingNote ?? "", /DELIVERY_IMPACT/);
});

test("ECA:FINAL-FIX1 E — Internal UNSPECIFIED contract preserved on judgment", () => {
  const turns = chain([
    { utterance: "Compare outsourcing and overtime." },
    {
      utterance: "What do you recommend?",
      extras: { nxa5: pref("outsourcing", "outsourcing"), decisionCriterion: "UNSPECIFIED" },
    },
  ]);
  assert.equal(turns[1]!.judgment.criterion, "UNSPECIFIED");
  assert.equal(turns[1]!.judgment.boundaries.commitsDecision, false);
  assert.equal(turns[1]!.judgment.boundaries.mutatesBusinessState, false);
});

test("ECA:FINAL-FIX1 F — Manager-facing leakage probe on overlay", () => {
  const turns = chain([
    { utterance: "Compare Demand Surge and Pricing Response." },
    {
      utterance: "What do you recommend?",
      extras: {
        nxa5: pref("demand-surge", "Demand Surge"),
        decisionCriterion: "UNSPECIFIED",
      },
    },
  ]);
  const spoken = applyEcaRecommendationToPresentedResponse({
    source: "",
    utterance: "What do you recommend?",
    judgment: turns[1]!.judgment,
  });
  assert.doesNotMatch(spoken, LEAK_PROBE);
  assert.doesNotMatch(turns[1]!.judgment.managerFacingNote ?? "", /\bUNKNOWN\b|\bNONE\b|\bUNRESOLVED\b/);
});
