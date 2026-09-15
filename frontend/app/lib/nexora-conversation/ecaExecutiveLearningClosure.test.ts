import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import { composeEcaWorkingConversationContext, type EcaSubject } from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  emptyEcaOutcomeSession,
  judgeEcaExecutiveOutcome,
  type EcaOutcomeEvidence,
} from "./ecaExecutiveOutcome.ts";
import {
  applyEcaLearningClosureToPresentedResponse,
  emptyEcaLearningClosureSession,
  judgeEcaExecutiveLearningClosure,
  nextEcaLearningClosureSession,
  type EcaExecutiveLearningClosureJudgment,
  type EcaLearningClosureSession,
} from "./ecaExecutiveLearningClosure.ts";

const SA = Object.freeze({ id: "scenario-a", label: "Scenario A", kind: "scenario" });
const SUBJECTS: readonly EcaSubject[] = Object.freeze([SA]);

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

function isolation(judgment: EcaExecutiveLearningClosureJudgment) {
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesApp4, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.equal(judgment.boundaries.createsSecondLearningEngine, false);
  assert.equal(judgment.boundaries.replacesCoreOut2, false);
  assert.equal(judgment.boundaries.replacesDth12, false);
  assert.equal(judgment.boundaries.createsSecondObjectiveStore, false);
  assert.equal(judgment.boundaries.replacesEca6, false);
  assert.equal(judgment.causalLearningInflation, false);
  assert.equal(judgment.durableWrite, false);
  assert.equal(judgment.learningScope, "case-specific");
}

function evidence(extra: Partial<EcaOutcomeEvidence> & Partial<NonNullable<EcaOutcomeEvidence["primary"]>> = {}): EcaOutcomeEvidence {
  const observed = extra.primary
    ? extra.primary.observed
    : extra.observed === undefined
      ? 94
      : extra.observed;
  const baseline = extra.primary
    ? extra.primary.baseline
    : extra.baseline === undefined
      ? 91
      : extra.baseline;
  const target = extra.primary
    ? extra.primary.target
    : extra.target === undefined
      ? 96
      : extra.target;
  return Object.freeze({
    decisionId: extra.decisionId ?? "decision-b",
    executionId: extra.executionId ?? "execution-b",
    executionStatus: extra.executionStatus ?? "completed",
    primary:
      extra.primary === null
        ? null
        : Object.freeze({
            measure: extra.primary?.measure ?? "Delivery",
            observed,
            baseline,
            target,
            unit: "%",
            source: extra.primary?.source ?? "CONFIRMED",
          }),
    secondary: extra.secondary ?? null,
    conflicted: extra.conflicted ?? false,
    stale: extra.stale ?? false,
    preExecution: extra.preExecution ?? false,
  });
}

function play(
  utterance: string,
  extras: {
    evidence?: EcaOutcomeEvidence | null;
    capAvUnconfirmed?: boolean;
    pendingConfirmation?: boolean;
    priorHypothesis?: "capacity-pressure" | null;
    hypothesisObservation?: "supports" | "challenges" | "inconclusive" | null;
    recommendedOption?: string;
    chosenOption?: string;
    session?: EcaLearningClosureSession | null;
    conflicted?: boolean;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const outcome = judgeEcaExecutiveOutcome({
    utterance,
    workingContext,
    actionPlan,
    session: emptyEcaOutcomeSession(),
    evidence: extras.evidence ?? evidence(),
    capAvUnconfirmed: extras.capAvUnconfirmed,
    recommendedOption: extras.recommendedOption,
    chosenOption: extras.chosenOption,
  });
  const judgment = judgeEcaExecutiveLearningClosure({
    utterance,
    workingContext,
    actionPlan,
    outcome,
    session: extras.session ?? emptyEcaLearningClosureSession(),
    capAvUnconfirmed: extras.capAvUnconfirmed,
    pendingConfirmation: extras.pendingConfirmation,
    priorHypothesis: extras.priorHypothesis,
    hypothesisObservation: extras.hypothesisObservation,
    recommendedOption: extras.recommendedOption,
    chosenOption: extras.chosenOption,
  });
  isolation(judgment);
  return {
    outcome,
    judgment,
    session: nextEcaLearningClosureSession(extras.session ?? null, utterance, judgment),
  };
}

test("ECA:12 A — Outcome to bounded Learning, no causal promotion", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.learningState, "TENTATIVE");
  assert.match(judgment.managerFacingNote ?? "", /does not establish/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /proved capacity|Decision caused/i);
});

test("ECA:12 B — No Outcome means no Learning", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({
      primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" },
      executionStatus: "completed",
    }),
  });
  assert.equal(judgment.learningState, "NONE");
  assert.equal(judgment.closureState, "WAIT_FOR_EVIDENCE");
  assert.match(judgment.managerFacingNote ?? "", /enough evidence/i);
});

test("ECA:12 C — Target met is not Decision-correct Learning", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 96, baseline: 91, target: 96 }) });
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Decision was correct\b/i);
  assert.match(judgment.managerFacingNote ?? "", /does not prove the Decision was optimal/i);
});

test("ECA:12 D — Target missed may support reassessment, not Decision failed", () => {
  const { judgment } = play("Should we rethink the approach?", {
    evidence: evidence({ observed: 92, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.reassessmentWarranted, true);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Decision failed/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 E — Mixed Outcome preserves trade-off", () => {
  const { judgment } = play("Was this worth it?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      target: 96,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: 100, unit: "%", source: "CONFIRMED" },
    }),
  });
  assert.equal(judgment.learningState, "TENTATIVE");
  assert.match(judgment.managerFacingNote ?? "", /trade-off|cost/i);
});

test("ECA:12 F — Strengthened hypothesis is not proven", () => {
  const { judgment } = play("What did we learn?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "supports",
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.hypothesisEffect, "strengthened");
  assert.match(judgment.managerFacingNote ?? "", /doesn[’']t establish/i);
});

test("ECA:12 G — Weakened hypothesis is not disproven", () => {
  const { judgment } = play("What did we learn?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "challenges",
    evidence: evidence({ observed: 91, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.hypothesisEffect, "weakened");
  assert.match(judgment.managerFacingNote ?? "", /does not prove capacity is irrelevant/i);
});

test("ECA:12 H — Contradictory evidence is inconclusive", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, conflicted: true }),
  });
  assert.equal(judgment.learningState, "INCONCLUSIVE");
  assert.match(judgment.managerFacingNote ?? "", /inconsistent|reliable lesson/i);
});

test("ECA:12 I — CAP_AV is not causal Learning", () => {
  const { judgment } = play("So we proved capacity was the cause.", { capAvUnconfirmed: true });
  assert.match(judgment.managerFacingNote ?? "", /unconfirmed/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /capacity caused/i);
});

test("ECA:12 J — Reassessment candidate does not mutate Decision", () => {
  const { judgment } = play("Should we reconsider the approach?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "challenges",
    evidence: evidence({ observed: 92, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.reassessmentWarranted, true);
  assert.equal(judgment.closureState, "READY_TO_REASSESS");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 K — No reassessment needed when Goal met", () => {
  const { judgment } = play("Do we need to revisit the Decision?", {
    evidence: evidence({ observed: 96, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.reassessmentWarranted, false);
  assert.equal(judgment.closureState, "READY_TO_CLOSE");
});

test("ECA:12 L — Explicit manager closure", () => {
  const { judgment } = play("That’s enough. Close this review.");
  assert.equal(judgment.closureState, "READY_TO_CLOSE");
  assert.equal(judgment.boundaries.createsSecondObjectiveStore, false);
});

test("ECA:12 M — Keep open", () => {
  const { judgment } = play("Keep this open. I want to understand the cause.");
  assert.equal(judgment.closureState, "CONTINUE");
});

test("ECA:12 N — Accepted unknown allows Goal-result closure", () => {
  const first = play("Why didn't we get the last 2 points?");
  const { judgment } = play("That's okay. I don't need to investigate why. Are we done?", {
    session: first.session,
  });
  assert.equal(judgment.closureState, "READY_TO_CLOSE");
});

test("ECA:12 O — Blocking unknown: missing baseline", () => {
  const asked = play("Did the Decision improve delivery?", {
    evidence: evidence({ observed: 94, baseline: null, target: 96 }),
  });
  const { judgment } = play("Are we done?", {
    evidence: evidence({ observed: 94, baseline: null, target: 96 }),
    session: asked.session,
  });
  assert.equal(judgment.closureState, "BLOCKED");
  assert.match(judgment.managerFacingNote ?? "", /baseline/i);
});

test("ECA:12 P — Side question does not overlay", () => {
  const { judgment } = play("What does CAP_AV mean?");
  assert.equal(judgment.speak, false);
});

test("ECA:12 Q — Reopen uses existing objective overlay", () => {
  const closed = play("That’s enough. Close this review.");
  const { judgment } = play("Go back to the delivery result.", { session: closed.session });
  assert.equal(judgment.managerIntent, "REOPEN");
  assert.equal(judgment.boundaries.createsSecondObjectiveStore, false);
  assert.equal(nextEcaLearningClosureSession(closed.session, "Go back to the delivery result.", judgment).resumed, true);
});

test("ECA:12 R — Historical neutrality", () => {
  const { judgment } = play("What did we learn?", {
    recommendedOption: "A",
    chosenOption: "B",
    evidence: evidence({ observed: 96, baseline: 91, target: 96 }),
  });
  assert.match(judgment.managerFacingNote ?? "", /actually executed|earlier recommendation/i);
  assert.equal(judgment.boundaries.rewritesHistoricalRecommendation, false);
});

test("ECA:12 S — No durable Learning write", () => {
  const { judgment } = play("What did we learn?");
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesApp4, false);
});

test("ECA:12 T — Authority isolation", () => {
  const { judgment } = play("What did we learn?");
  isolation(judgment);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.boundaries.createsSecondInitiativeEngine, false);
});

test("ECA:12 sequence 1 — Goal met → close", () => {
  const learn = play("What did we learn?", { evidence: evidence({ observed: 96, baseline: 91, target: 96 }) });
  const elseQ = play("Anything else we need to investigate?", {
    evidence: evidence({ observed: 96, baseline: 91, target: 96 }),
    session: learn.session,
  });
  const close = play("No. That's enough.", {
    evidence: evidence({ observed: 96, baseline: 91, target: 96 }),
    session: elseQ.session,
  });
  assert.equal(close.judgment.closureState, "READY_TO_CLOSE");
  assert.equal(close.judgment.reassessmentWarranted, false);
});

test("ECA:12 sequence 2 — Goal miss → reassessment", () => {
  const learn = play("What did we learn?", { evidence: evidence({ observed: 92, baseline: 91, target: 96 }) });
  const rethink = play("Should we rethink the approach?", {
    evidence: evidence({ observed: 92, baseline: 91, target: 96 }),
    session: learn.session,
  });
  assert.equal(rethink.judgment.reassessmentWarranted, true);
  assert.equal(rethink.judgment.boundaries.commitsDecision, false);
});

test("ECA:12 sequence 3 — mixed repeat", () => {
  const mixed = evidence({
    observed: 94,
    baseline: 91,
    target: 96,
    secondary: { measure: "Cost", observed: 112, baseline: 100, target: 100, unit: "%", source: "CONFIRMED" },
  });
  const worth = play("Was this worth it?", { evidence: mixed });
  const again = play("Should we do it again?", { evidence: mixed, session: worth.session });
  assert.match(again.judgment.managerFacingNote ?? "", /will not automatically recommend repeating/i);
});

test("ECA:12 sequence 4 — accepted unknown", () => {
  const goal = play("Did we hit the Goal?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  const why = play("Why didn't we get the last 2 points?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    session: goal.session,
  });
  const done = play("That's okay. I don't need to investigate why. Are we done?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    session: why.session,
  });
  assert.equal(done.judgment.closureState, "READY_TO_CLOSE");
});

test("ECA:12 sequence 5 — blocking unknown", () => {
  const improve = play("Did the Decision improve delivery?", {
    evidence: evidence({ observed: 94, baseline: null, target: 96 }),
  });
  const done = play("Are we done?", {
    evidence: evidence({ observed: 94, baseline: null, target: 96 }),
    session: improve.session,
  });
  assert.notEqual(done.judgment.closureState, "READY_TO_CLOSE");
  assert.equal(done.judgment.closureState, "BLOCKED");
});

test("ECA:12 sequence 6 — manager overstates Learning", () => {
  const { judgment } = play("So we proved capacity was the cause.");
  assert.match(judgment.managerFacingNote ?? "", /doesn[’']t establish it as the sole cause/i);
});

test("ECA:12 sequence 7 — new objective is not sticky", () => {
  const closed = play("That’s enough. Close this review.");
  const next = play("Okay, now let's look at supplier cost.", { session: closed.session });
  assert.equal(next.judgment.stickyStaleObjective, false);
  assert.equal(next.judgment.speak, false);
});

test("ECA:12 sequence 8 — reopen", () => {
  const closed = play("That’s enough. Close this review.");
  const reopen = play("Go back to the delivery result. What did we learn about capacity?", { session: closed.session });
  assert.equal(reopen.session.resumed, true);
  assert.equal(reopen.judgment.boundaries.createsSecondObjectiveStore, false);
});

test("ECA:12 overlay replaces generic command failure", () => {
  const { judgment } = play("What did we learn?");
  const overlay = applyEcaLearningClosureToPresentedResponse({
    source: "Nexora couldn’t complete that request. Please try again.",
    utterance: "What did we learn?",
    judgment,
  });
  assert.doesNotMatch(overlay, /couldn[’']t complete that request/i);
});

test("ECA:12 prompt A — No Outcome → NO_RELIABLE_LEARNING", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({
      primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" },
    }),
  });
  assert.equal(judgment.learningState, "NONE");
  assert.equal(judgment.durableWrite, false);
});

test("ECA:12 prompt B — NOT_YET_OBSERVED → no Learning", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({
      primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" },
      executionStatus: "completed",
    }),
  });
  assert.equal(judgment.learningState, "NONE");
  assert.equal(judgment.closureState, "WAIT_FOR_EVIDENCE");
});

test("ECA:12 prompt C — PARTIALLY_OBSERVED → tentative only", () => {
  const { judgment, outcome } = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, executionStatus: "in-progress" }),
  });
  assert.equal(outcome.observationState, "PARTIALLY_OBSERVED");
  assert.ok(judgment.learningState === "TENTATIVE" || judgment.learningState === "WEAK");
  assert.notEqual(judgment.learningState, "SUPPORTED");
});

test("ECA:12 prompt D — CONFLICTED → no strong Learning", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, conflicted: true }),
  });
  assert.equal(judgment.learningState, "INCONCLUSIVE");
  assert.notEqual(judgment.learningState, "SUPPORTED");
});

test("ECA:12 prompt E — STALE Outcome limitation", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, stale: true, preExecution: true }),
  });
  assert.ok(judgment.learningState === "INCONCLUSIVE" || judgment.learningState === "NONE");
  assert.equal(judgment.durableWrite, false);
});

test("ECA:12 prompt F — FAVORABLE ≠ causal proof", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.causalLearningInflation, false);
  assert.match(judgment.managerFacingNote ?? "", /does not establish/i);
});

test("ECA:12 prompt G — UNFAVORABLE ≠ bad Decision", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Decision failed|bad Decision/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 prompt H — MIXED preserves tradeoff", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      target: 96,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: null, unit: "%", source: "CONFIRMED" },
    }),
  });
  assert.equal(judgment.learningState, "TENTATIVE");
  assert.match(judgment.managerFacingNote ?? "", /trade-off|cost|mixed/i);
});

test("ECA:12 prompt I — INCONCLUSIVE Outcome → no strong Learning", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, conflicted: true }),
  });
  assert.equal(judgment.learningState, "INCONCLUSIVE");
});

test("ECA:12 prompt J — Supported bounded Learning", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 96, baseline: 91, target: 96 }) });
  assert.equal(judgment.learningState, "SUPPORTED");
  assert.equal(judgment.learningScope, "case-specific");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Decision was correct\b|always/i);
});

test("ECA:12 prompt K — Tentative Learning uncertainty visible", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.learningState, "TENTATIVE");
  assert.match(judgment.managerFacingNote ?? "", /does not establish|uncertain|strengthen/i);
});

test("ECA:12 prompt L — Hypothesis only not promoted", () => {
  const { judgment } = play("What did we learn?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "supports",
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.hypothesisEffect, "strengthened");
  assert.match(judgment.managerFacingNote ?? "", /doesn[’']t establish/i);
  assert.notEqual(judgment.learningState, "SUPPORTED");
});

test("ECA:12 prompt M — No reliable Learning is valid", () => {
  const { judgment } = play("What did we learn?", {
    evidence: evidence({
      primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" },
    }),
  });
  assert.equal(judgment.learningState, "NONE");
  assert.match(judgment.managerFacingNote ?? "", /enough evidence|not yet/i);
});

test("ECA:12 prompt N — Single execution scope bounded", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.learningScope, "case-specific");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /always|universally|every time/i);
});

test("ECA:12 prompt O — Repeated evidence strengthens bounded only", () => {
  const { judgment } = play("What did we learn?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "supports",
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.hypothesisEffect, "strengthened");
  assert.equal(judgment.causalLearningInflation, false);
});

test("ECA:12 prompt P — Temporal sequence ≠ causality", () => {
  const { judgment } = play("So the execution caused the improvement?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.boundaries.infersCausality, false);
  assert.equal(judgment.causalLearningInflation, false);
});

test("ECA:12 prompt Q — Alternative explanations preserved", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.match(judgment.managerFacingNote ?? "", /does not establish|other|uncertain/i);
});

test("ECA:12 prompt R — Contradicted assumption identified", () => {
  const { judgment } = play("Should we rethink the approach?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "challenges",
    evidence: evidence({ observed: 92, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.reassessmentWarranted, true);
  assert.equal(judgment.reassessmentTarget, "ASSUMPTION");
});

test("ECA:12 prompt S — Aligned observation does not overclaim confirmation", () => {
  const { judgment } = play("What did we learn?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "supports",
    evidence: evidence({ observed: 96, baseline: 91, target: 96 }),
  });
  assert.match(judgment.managerFacingNote ?? "", /doesn[’']t establish|does not prove|optimal/i);
});

test("ECA:12 prompt T — Unresolved Data semantics", () => {
  const { judgment } = play("So we proved capacity was the cause.", {
    capAvUnconfirmed: true,
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /capacity caused/i);
});

test("ECA:12 prompt U — Manager causal assertion ≠ truth", () => {
  const { judgment } = play("So we proved capacity was the cause.", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.causalLearningInflation, false);
  assert.equal(judgment.boundaries.infersCausality, false);
});

test("ECA:12 prompt V — Favorable ≠ automatic repeat", () => {
  const { judgment } = play("Should we do this again?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.managerIntent, "REPEAT");
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /always repeat|must repeat/i);
});

test("ECA:12 prompt W — Unfavorable ≠ automatic never repeat", () => {
  const { judgment } = play("Should we do this again?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /never repeat|Decision failed/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 prompt X — Goal missed may reassess, no Goal mutation", () => {
  const { judgment } = play("Should we rethink the approach?", { evidence: evidence({ observed: 92, baseline: 91, target: 96 }) });
  assert.equal(judgment.reassessmentWarranted, true);
  assert.equal(judgment.boundaries.writesGoal, false);
});

test("ECA:12 prompt Y — Material assumption contradicted → reassessment", () => {
  const { judgment } = play("Should we reconsider?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "challenges",
    evidence: evidence({ observed: 92, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.reassessmentWarranted, true);
  assert.ok(judgment.reassessmentTarget === "ASSUMPTION" || judgment.reassessmentTarget === "EXECUTION_APPROACH");
});

test("ECA:12 prompt Z — New evidence can increase reassessment", () => {
  const met = play("Do we need to revisit the Decision?", { evidence: evidence({ observed: 96, baseline: 91, target: 96 }) });
  const missed = play("Should we rethink the approach?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.equal(met.judgment.reassessmentWarranted, false);
  assert.equal(missed.judgment.reassessmentWarranted, true);
});

test("ECA:12 prompt AA — Trivial/met Outcome no unnecessary reassessment", () => {
  const { judgment } = play("Do we need to revisit the Decision?", {
    evidence: evidence({ observed: 96, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.reassessmentWarranted, false);
});

test("ECA:12 prompt AB — Correct reassessment subject", () => {
  const assumption = play("Should we rethink the approach?", {
    priorHypothesis: "capacity-pressure",
    hypothesisObservation: "challenges",
    evidence: evidence({ observed: 92, baseline: 91, target: 96 }),
  });
  const mixed = play("Should we reconsider?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      target: 96,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: null, unit: "%", source: "CONFIRMED" },
    }),
  });
  assert.equal(assumption.judgment.reassessmentTarget, "ASSUMPTION");
  assert.ok(mixed.judgment.reassessmentTarget === "UNKNOWN" || mixed.judgment.reassessmentWarranted);
});

test("ECA:12 prompt AC — Reassessment advisory only", () => {
  const { judgment } = play("Should we change the decision?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.equal(judgment.boundaries.writesLearning, false);
});

test("ECA:12 prompt AD — Decision history unchanged", () => {
  const { judgment } = play("What did we learn?", {
    recommendedOption: "Scenario A",
    chosenOption: "Scenario B",
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.boundaries.rewritesHistoricalRecommendation, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 prompt AE — Risk not written", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.equal(judgment.boundaries.writesRisk, false);
});

test("ECA:12 prompt AF — What did we learn?", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.managerIntent, "LEARNING");
  assert.ok(judgment.learningStatement || judgment.managerFacingNote);
  assert.match(judgment.managerFacingNote ?? "", /does not establish|strengthen|target|bounded/i);
});

test("ECA:12 prompt AG — Why causal safety", () => {
  const { judgment } = play("So the execution caused the improvement?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.causalLearningInflation, false);
  assert.equal(judgment.boundaries.infersCausality, false);
});

test("ECA:12 prompt AH — Should we do this again? no second recommendation engine", () => {
  const { judgment } = play("Should we do this again?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.managerIntent, "REPEAT");
  assert.equal(judgment.boundaries.createsSecondLearningEngine, false);
  assert.equal(judgment.boundaries.replacesEca6, false);
});

test("ECA:12 prompt AI — Should we change the decision? advisory", () => {
  const { judgment } = play("Should we change the decision?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.equal(judgment.managerIntent, "REASSESS");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 prompt AJ — What would you change next time?", () => {
  const { judgment } = play("What would you change next time?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.managerIntent, "LEARNING");
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:12 prompt AK — Remember this → no durable write", () => {
  const { judgment } = play("Remember this.", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.durableWrite, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesApp4, false);
});

test("ECA:12 prompt AL — Refresh does not invent persistence", () => {
  const first = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  const second = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    session: emptyEcaLearningClosureSession(),
  });
  assert.equal(first.judgment.learningState, second.judgment.learningState);
  assert.equal(second.judgment.durableWrite, false);
  assert.equal(second.judgment.boundaries.writesApp4, false);
});

test("ECA:12 prompt AM — Writer protection across samples", () => {
  for (const sample of [
    play("What did we learn?"),
    play("What did we learn?", {
      evidence: evidence({
        primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" },
      }),
    }),
    play("Should we change the decision?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) }),
    play("Remember this.", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) }),
  ]) {
    isolation(sample.judgment);
  }
});

test("ECA:12 prompt AN — Durable Learning writes = 0", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 96, baseline: 91, target: 96 }) });
  assert.equal(judgment.durableWrite, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesApp4, false);
});

test("ECA:12 prompt AO — Duplicate-authority protection", () => {
  const { judgment } = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.boundaries.createsSecondLearningEngine, false);
  assert.equal(judgment.boundaries.replacesCoreOut2, false);
  assert.equal(judgment.boundaries.replacesDth12, false);
  assert.equal(judgment.boundaries.createsSecondObjectiveStore, false);
  assert.equal(judgment.boundaries.replacesEca6, false);
  assert.equal(judgment.boundaries.infersCausality, false);
});

test("ECA:12 prompt multi-turn 1 — Outcome → Learning", () => {
  const { judgment, outcome } = play("What did we learn?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(outcome.baselineComparison, "IMPROVED");
  assert.equal(outcome.targetComparison, "NOT_MET");
  assert.equal(judgment.learningState, "TENTATIVE");
  assert.match(judgment.managerFacingNote ?? "", /does not establish/i);
});

test("ECA:12 prompt multi-turn 2 — Learning → cause challenge", () => {
  const learned = play("What did we learn?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  const cause = play("So the execution caused the improvement?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    session: learned.session,
  });
  assert.equal(learned.judgment.learningState, "TENTATIVE");
  assert.equal(cause.judgment.causalLearningInflation, false);
  assert.equal(cause.judgment.boundaries.infersCausality, false);
});

test("ECA:12 prompt multi-turn 3 — Mixed → reassessment", () => {
  const learned = play("What should we learn from this?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      target: 96,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: null, unit: "%", source: "CONFIRMED" },
    }),
  });
  const reconsider = play("Should we reconsider?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      target: 96,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: null, unit: "%", source: "CONFIRMED" },
    }),
    session: learned.session,
  });
  assert.equal(learned.outcome.overallInterpretation, "MIXED");
  assert.equal(reconsider.judgment.reassessmentWarranted, true);
  assert.equal(reconsider.judgment.boundaries.commitsDecision, false);
});

test("ECA:12 prompt multi-turn 4 — Future use before trying again", () => {
  const { judgment } = play("What should we consider before trying this again?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  assert.equal(judgment.managerIntent, "LEARNING");
  assert.equal(judgment.learningScope, "case-specific");
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.durableWrite, false);
});
