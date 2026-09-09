import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import { composeEcaWorkingConversationContext, type EcaSubject } from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  applyEcaOutcomeToPresentedResponse,
  emptyEcaOutcomeSession,
  judgeEcaExecutiveOutcome,
  nextEcaOutcomeSession,
  type EcaExecutiveOutcomeJudgment,
  type EcaOutcomeEvidence,
  type EcaOutcomeSession,
} from "./ecaExecutiveOutcome.ts";
import { formatOutcomePercentagePointDelta } from "@/app/lib/decision-theatre/nexoraDecisionTheatreOutcomeObservationComposer.ts";

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

function isolation(judgment: EcaExecutiveOutcomeJudgment) {
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.writesKpi, false);
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.createsSecondOutcomeWriter, false);
  assert.equal(judgment.boundaries.replacesDth11, false);
  assert.equal(judgment.boundaries.createsLearningEngine, false);
  assert.equal(judgment.boundaries.infersCausality, false);
  assert.equal(judgment.attribution, "NOT_ESTABLISHED");
}

function evidence(extra: Partial<EcaOutcomeEvidence> & Partial<EcaOutcomeEvidence["primary"]> = {}): EcaOutcomeEvidence {
  const primaryObserved = extra.observed ?? extra.primary?.observed ?? null;
  return Object.freeze({
    decisionId: extra.decisionId ?? "decision-a",
    executionId: extra.executionId ?? "execution-a",
    executionStatus: extra.executionStatus ?? "completed",
    primary:
      extra.primary === null
        ? null
        : Object.freeze({
            measure: extra.primary?.measure ?? "Delivery",
            observed: primaryObserved,
            baseline: extra.baseline ?? extra.primary?.baseline ?? null,
            target: extra.target ?? extra.primary?.target ?? null,
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
    answerType?: "ESTIMATE";
    conflict?: "VALUE_CONFLICT";
    capAvUnconfirmed?: boolean;
    recommendedOption?: string;
    chosenOption?: string;
    session?: EcaOutcomeSession | null;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const judgment = judgeEcaExecutiveOutcome({
    utterance,
    workingContext,
    actionPlan,
    answerIntake: extras.answerType || extras.conflict
      ? ({
          answerType: extras.answerType ?? "FACT_CLAIM",
          confidence: extras.answerType ? "ESTIMATED" : "CONFIRMED",
          conflict: extras.conflict ?? "NO_CONFLICT",
        } as never)
      : null,
    session: extras.session ?? emptyEcaOutcomeSession(),
    evidence: extras.evidence,
    recommendedOption: extras.recommendedOption,
    chosenOption: extras.chosenOption,
    capAvUnconfirmed: extras.capAvUnconfirmed,
  });
  isolation(judgment);
  return {
    judgment,
    session: nextEcaOutcomeSession(extras.session ?? null, utterance, judgment, extras.evidence),
  };
}

test("ECA:11 numerical contract — 91 to 94 is +3 percentage points vs Goal 96", () => {
  const fromBase = formatOutcomePercentagePointDelta(91, 94);
  const vsGoal = formatOutcomePercentagePointDelta(96, 94);
  assert.equal(fromBase.delta, 3);
  assert.match(fromBase.label, /\+3 percentage points/);
  assert.equal(vsGoal.delta, -2);
});

test("ECA:11 A — Execution complete, no Outcome", () => {
  const { judgment } = play("Did it work?", {
    evidence: evidence({ primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" }, executionStatus: "completed" }),
  });
  assert.equal(judgment.observationState, "NOT_YET_OBSERVED");
  assert.match(judgment.managerFacingNote ?? "", /complete/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /\bsucceeded\b|\bfailed\b/i);
});

test("ECA:11 B — Baseline + observation, no target", () => {
  const { judgment } = play("What happened?", { evidence: evidence({ observed: 94, baseline: 91 }) });
  assert.equal(judgment.baselineComparison, "IMPROVED");
  assert.equal(judgment.targetComparison, "UNKNOWN");
  assert.match(judgment.managerFacingNote ?? "", /3 percentage points/);
});

test("ECA:11 C — Baseline + observation + Goal", () => {
  const { judgment } = play("How did we do?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.baselineComparison, "IMPROVED");
  assert.equal(judgment.targetComparison, "NOT_MET");
  assert.match(judgment.managerFacingNote ?? "", /3 percentage points/);
  assert.match(judgment.managerFacingNote ?? "", /2 points below/i);
});

test("ECA:11 D — Goal met, no causal claim", () => {
  const { judgment } = play("Did we hit the Goal?", { evidence: evidence({ observed: 96, baseline: 91, target: 96 }) });
  assert.equal(judgment.targetComparison, "MET");
  assert.equal(judgment.attribution, "NOT_ESTABLISHED");
});

test("ECA:11 E — Goal exceeded is not Decision optimality", () => {
  const { judgment } = play("Did we hit the Goal?", { evidence: evidence({ observed: 98, baseline: 91, target: 96 }) });
  assert.equal(judgment.targetComparison, "EXCEEDED");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /optimal/i);
});

test("ECA:11 F — Deterioration is not automatic Decision failure", () => {
  const { judgment } = play("What happened?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.equal(judgment.baselineComparison, "DETERIORATED");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Decision failed/i);
});

test("ECA:11 G — Mixed Outcome", () => {
  const { judgment } = play("Was it successful?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      target: 96,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: null, unit: "%", source: "CONFIRMED" },
    }),
  });
  assert.equal(judgment.overallInterpretation, "MIXED");
  assert.match(judgment.managerFacingNote ?? "", /mixed/i);
});

test("ECA:11 H — Missing baseline", () => {
  const { judgment } = play("Did we improve?", { evidence: evidence({ observed: 94 }) });
  assert.equal(judgment.baselineComparison, "UNKNOWN");
  assert.match(judgment.managerFacingNote ?? "", /baseline/i);
});

test("ECA:11 I — Missing Goal", () => {
  const { judgment } = play("Did we hit the Goal?", { evidence: evidence({ observed: 94, baseline: 91 }) });
  assert.equal(judgment.targetComparison, "UNKNOWN");
  assert.match(judgment.managerFacingNote ?? "", /target/i);
});

test("ECA:11 J — Manager estimate not confirmed", () => {
  const { judgment } = play("How did we do?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, primary: { measure: "Delivery", observed: 94, baseline: 91, target: 96, unit: "%", source: "ESTIMATED" } }),
    answerType: "ESTIMATE",
  });
  assert.match(judgment.managerFacingNote ?? "", /reported/i);
});

test("ECA:11 K — Conflicting evidence", () => {
  const { judgment } = play("So we hit the Goal?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, conflicted: true }),
    conflict: "VALUE_CONFLICT",
  });
  assert.equal(judgment.observationState, "CONFLICTED");
  assert.notEqual(judgment.targetComparison, "MET");
});

test("ECA:11 L — Causality not established", () => {
  const { judgment } = play("Did our Decision cause it?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.attribution, "NOT_ESTABLISHED");
  assert.match(judgment.managerFacingNote ?? "", /doesn[’']t establish/i);
});

test("ECA:11 M — Execution complete vs business result", () => {
  const { judgment } = play("How did we do?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, executionStatus: "completed" }),
  });
  assert.match(judgment.managerFacingNote ?? "", /Execution completion remains separate/i);
});

test("ECA:11 N — Recommendation bias", () => {
  const { judgment } = play("Was choosing B a mistake?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    recommendedOption: "A",
    chosenOption: "B",
  });
  assert.match(judgment.managerFacingNote ?? "", /actually executed|mixed|success/i);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Nexora was right/i);
});

test("ECA:11 O — CAP_AV", () => {
  const { judgment } = play("Did capacity cause the improvement?", {
    evidence: evidence({ observed: 94, baseline: 91 }),
    capAvUnconfirmed: true,
  });
  assert.match(judgment.managerFacingNote ?? "", /CAP_AV/i);
  assert.equal(judgment.boundaries.infersCausality, false);
});

test("ECA:11 P — Stale pre-Execution evidence", () => {
  const { judgment } = play("What happened?", { evidence: evidence({ observed: 91, baseline: 90, preExecution: true }) });
  assert.equal(judgment.observationState, "STALE");
  assert.match(judgment.managerFacingNote ?? "", /predate|won[’']t treat/i);
});

test("ECA:11 Q — Outcome during active Execution", () => {
  const { judgment } = play("What happened?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96, executionStatus: "in-progress" }),
  });
  assert.equal(judgment.observationState, "PARTIALLY_OBSERVED");
  assert.match(judgment.managerFacingNote ?? "", /remains active/i);
});

test("ECA:11 R — Reassessment candidate", () => {
  const { judgment } = play("What should we do now?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.match(judgment.managerFacingNote ?? "", /reassess/i);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:11 S — Side question does not overlay", () => {
  const { judgment } = play("What does CAP_AV mean?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  assert.equal(judgment.speak, false);
});

test("ECA:11 T — Authority isolation", () => {
  const { judgment } = play("What happened?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  isolation(judgment);
});

test("ECA:11 sequence 1 — complete await result", () => {
  const { judgment } = play("Did it work?", {
    evidence: evidence({ primary: { measure: "Delivery", observed: null, baseline: null, target: null, unit: "%", source: "UNKNOWN" } }),
  });
  assert.equal(judgment.observationState, "NOT_YET_OBSERVED");
});

test("ECA:11 sequence 2 — observation arrives", () => {
  const { judgment } = play("How did we do?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    answerType: "ESTIMATE",
  });
  assert.equal(judgment.baselineComparison, "IMPROVED");
  assert.equal(judgment.targetComparison, "NOT_MET");
  assert.equal(judgment.attribution, "NOT_ESTABLISHED");
});

test("ECA:11 sequence 3 — why", () => {
  const { judgment } = play("Why did it improve?", { evidence: evidence({ observed: 94, baseline: 91 }) });
  assert.match(judgment.managerFacingNote ?? "", /establish/i);
});

test("ECA:11 sequence 4 — data conflict", () => {
  const { judgment } = play("So we hit the Goal?", {
    evidence: evidence({ observed: 94, target: 96, conflicted: true }),
    conflict: "VALUE_CONFLICT",
  });
  assert.equal(judgment.observationState, "CONFLICTED");
});

test("ECA:11 sequence 5 — mixed success question", () => {
  const { judgment } = play("Was it successful?", {
    evidence: evidence({
      observed: 94,
      baseline: 91,
      secondary: { measure: "Cost", observed: 112, baseline: 100, target: null, unit: "%", source: "CONFIRMED" },
    }),
  });
  assert.equal(judgment.overallInterpretation, "MIXED");
});

test("ECA:11 sequence 6 — choosing B", () => {
  const { judgment } = play("Was choosing B a mistake?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    recommendedOption: "A",
    chosenOption: "B",
  });
  assert.equal(judgment.successInflation, false);
});

test("ECA:11 sequence 7 — next step", () => {
  const { judgment } = play("What should we do now?", { evidence: evidence({ observed: 88, baseline: 91, target: 96 }) });
  assert.equal(judgment.boundaries.createsLearningEngine, false);
});

test("ECA:11 sequence 8 — side question then resume", () => {
  const first = play("Did we hit the Goal?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }) });
  const side = play("What does CAP_AV mean?", { evidence: evidence({ observed: 94, baseline: 91, target: 96 }), session: first.session });
  assert.equal(side.judgment.speak, false);
  const resume = play("Back to the result — why are we still below target?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
    session: side.session,
  });
  assert.equal(resume.judgment.managerIntent, "WHY");
  const overlay = applyEcaOutcomeToPresentedResponse({
    source: "Delivery remains below target.",
    utterance: "Why are we still below target?",
    judgment: resume.judgment,
  });
  assert.match(overlay, /establish/i);
});

test("ECA:11 overlay replaces generic command failure", () => {
  const { judgment } = play("Did we achieve the Goal?", {
    evidence: evidence({ observed: 94, baseline: 91, target: 96 }),
  });
  const overlay = applyEcaOutcomeToPresentedResponse({
    source: "Nexora couldn’t complete that request. Please try again.",
    utterance: "Did we achieve the Goal?",
    judgment,
  });
  assert.doesNotMatch(overlay, /couldn[’']t complete that request/i);
  assert.match(overlay, /2 percentage points below/);
});
