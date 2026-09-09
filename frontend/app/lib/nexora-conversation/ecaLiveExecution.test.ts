import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import { composeEcaWorkingConversationContext, type EcaSubject } from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  applyEcaLiveExecutionToPresentedResponse,
  emptyEcaLiveExecutionSession,
  judgeEcaLiveExecution,
  nextEcaLiveExecutionSession,
  type EcaLiveExecutionJudgment,
  type EcaLiveExecutionSession,
  type EcaLiveExecutionSnapshot,
} from "./ecaLiveExecution.ts";

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

function isolation(judgment: EcaLiveExecutionJudgment) {
  assert.equal(judgment.boundaries.mutatesBusinessState, false);
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.writesProblem, false);
  assert.equal(judgment.boundaries.writesScenario, false);
  assert.equal(judgment.boundaries.writesStage, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
  assert.equal(judgment.boundaries.createsSecondExecutionWriter, false);
  assert.equal(judgment.boundaries.replacesDth10, false);
  assert.equal(judgment.boundaries.createsMonitoringDaemon, false);
  assert.equal(judgment.boundaries.createsSecondInitiativeEngine, false);
  assert.equal(judgment.falseLive, false);
  assert.equal(judgment.falseDeviation, false);
  assert.equal(judgment.trustInflation, false);
}

function snapshot(status: string, extra: Partial<EcaLiveExecutionSnapshot> = {}): EcaLiveExecutionSnapshot {
  return Object.freeze({
    executionId: extra.executionId ?? "execution-decision-a",
    decisionId: extra.decisionId ?? "decision-a",
    title: extra.title ?? "Implement Scenario A",
    status,
    progress: extra.progress,
    ownerIds: extra.ownerIds ?? ["alex"],
    blockers: extra.blockers ?? [],
    risks: extra.risks ?? [],
  });
}

function play(
  utterance: string,
  extras: {
    execution?: EcaLiveExecutionSnapshot | null;
    expectedProgress?: number | null;
    capAvUnconfirmed?: boolean;
    answerType?: "ESTIMATE";
    session?: EcaLiveExecutionSession | null;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const judgment = judgeEcaLiveExecution({
    utterance,
    workingContext,
    actionPlan,
    answerIntake: extras.answerType
      ? ({ answerType: extras.answerType, confidence: "ESTIMATED", conflict: "NO_CONFLICT" } as never)
      : null,
    session: extras.session ?? emptyEcaLiveExecutionSession(),
    execution: extras.execution,
    expectedProgress: extras.expectedProgress,
    capAvUnconfirmed: extras.capAvUnconfirmed,
  });
  isolation(judgment);
  return {
    judgment,
    session: nextEcaLiveExecutionSession(extras.session ?? null, utterance, judgment, extras.execution),
  };
}

test("ECA:10 A — Live gate: Decision without started Execution is NOT_LIVE", () => {
  const { judgment } = play("How is execution going?", { execution: snapshot("planned") });
  assert.equal(judgment.liveState, "NOT_LIVE");
  assert.match(judgment.managerFacingNote ?? "", /not live|readiness/i);
});

test("ECA:10 B — Active Execution live summary does not mutate", () => {
  const { judgment } = play("How is it going?", { execution: snapshot("in-progress", { progress: 60 }) });
  assert.equal(judgment.liveState, "ACTIVE");
  assert.match(judgment.managerFacingNote ?? "", /60%/);
  assert.equal(judgment.boundaries.writesExecution, false);
});

test("ECA:10 C — Progress known, baseline missing → TRACK UNKNOWN", () => {
  const { judgment } = play("Are we on track?", { execution: snapshot("in-progress", { progress: 60 }) });
  assert.equal(judgment.progressValue, 60);
  assert.equal(judgment.trackStatus, "UNKNOWN");
  assert.match(judgment.managerFacingNote ?? "", /baseline/i);
});

test("ECA:10 D — Valid negative deviation", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 55 }),
    expectedProgress: 70,
  });
  assert.equal(judgment.trackStatus, "OFF_TRACK");
  assert.equal(judgment.deviation, "UNFAVORABLE_DEVIATION");
  assert.equal(judgment.unsupportedCause, false);
});

test("ECA:10 E — Favorable deviation does not claim Outcome", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 80 }),
    expectedProgress: 70,
  });
  assert.equal(judgment.deviation, "FAVORABLE_DEVIATION");
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Decision succeeded|Outcome/i);
});

test("ECA:10 F — Mixed change: progress up and new blocker", () => {
  const prior = play("How is it going?", { execution: snapshot("in-progress", { progress: 40 }) });
  const { judgment } = play("What changed?", {
    execution: snapshot("in-progress", {
      progress: 55,
      blockers: [{ label: "Supplier approval" }],
    }),
    session: prior.session,
  });
  assert.equal(judgment.deviation, "MIXED_DEVIATION");
  assert.match(judgment.managerFacingNote ?? "", /mixed/i);
});

test("ECA:10 G — Blocker vs Risk distinguished", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.riskIsBlocker, false);
  assert.match(judgment.managerFacingNote ?? "", /obstruction/i);
  assert.match(judgment.managerFacingNote ?? "", /Risk/i);
});

test("ECA:10 H — Risk alone is not blocked or off-track", () => {
  const { judgment } = play("How is it going?", {
    execution: snapshot("in-progress", {
      progress: 60,
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.liveState, "ACTIVE");
  assert.notEqual(judgment.liveState, "BLOCKED");
  assert.equal(judgment.trackStatus, "UNKNOWN");
  assert.equal(judgment.riskIsBlocker, false);
});

test("ECA:10 I — CAP_AV does not inflate capacity deviation", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 40 }),
    capAvUnconfirmed: true,
  });
  assert.equal(judgment.trackStatus, "UNKNOWN");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /capacity dropped/i);
});

test("ECA:10 J — Reported estimate is not confirmed progress", () => {
  const { judgment } = play("We’re about 60% done.", {
    execution: snapshot("in-progress", { progress: 40 }),
    answerType: "ESTIMATE",
  });
  assert.equal(judgment.progressStatus, "ESTIMATED");
  assert.notEqual(judgment.progressStatus, "CONFIRMED");
});

test("ECA:10 K — What changed with prior observation", () => {
  const prior = play("How is it going?", { execution: snapshot("in-progress", { progress: 40 }) });
  const { judgment } = play("What changed?", {
    execution: snapshot("in-progress", { progress: 55 }),
    session: prior.session,
  });
  assert.match(judgment.managerFacingNote ?? "", /40%[\s\S]*55%/);
});

test("ECA:10 L — No prior observation", () => {
  const { judgment } = play("What changed?", { execution: snapshot("in-progress", { progress: 40 }) });
  assert.match(judgment.managerFacingNote ?? "", /prior/i);
  assert.equal(judgment.deviation, "UNKNOWN");
});

test("ECA:10 M — One primary attention item", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      progress: 40,
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.primaryAttentionItem, "Supplier approval");
});

test("ECA:10 N — Acknowledged blocker is not unsolicited again", () => {
  const first = play("What needs my attention?", {
    execution: snapshot("in-progress", { blockers: [{ label: "Supplier approval" }] }),
  });
  const ack = play("I know about the blocker.", {
    execution: snapshot("in-progress", { blockers: [{ label: "Supplier approval" }] }),
    session: first.session,
  });
  assert.equal(ack.judgment.speak, false);
  assert.equal(ack.judgment.duplicateAttention, false);
});

test("ECA:10 O — Completion does not write Outcome", () => {
  const { judgment } = play("Did it work?", { execution: snapshot("completed", { progress: 100 }) });
  assert.equal(judgment.liveState, "COMPLETED");
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.match(judgment.managerFacingNote ?? "", /Outcome/i);
});

test("ECA:10 P — Is Decision working does not infer Outcome", () => {
  const { judgment } = play("Is this Decision working?", { execution: snapshot("in-progress", { progress: 80 }) });
  assert.match(judgment.managerFacingNote ?? "", /too early|Outcome/i);
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:10 Q — Read vs write", () => {
  const show = play("Show blockers.", {
    execution: snapshot("in-progress", { blockers: [{ label: "Supplier approval" }] }),
  });
  assert.equal(show.judgment.canonicalHandoffAllowed, false);
  assert.equal(show.judgment.boundaries.writesExecution, false);
  const add = play("Add Supplier Delay as a blocker.", { execution: snapshot("in-progress") });
  assert.equal(add.judgment.managerIntent, "WRITE");
  assert.equal(add.judgment.canonicalHandoffAllowed, true);
  assert.equal(add.judgment.boundaries.writesExecution, false);
});

test("ECA:10 R — Reassessment candidate does not mutate Decision", () => {
  const { judgment } = play("Does this change the Decision?", {
    execution: snapshot("in-progress", { blockers: [{ label: "Supplier approval" }] }),
  });
  assert.match(judgment.managerFacingNote ?? "", /reassess/i);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:10 S — Side question preserves live context without overlay", () => {
  const { judgment } = play("What does CAP_AV mean?", {
    execution: snapshot("in-progress", { progress: 60 }),
    capAvUnconfirmed: true,
  });
  assert.equal(judgment.speak, false);
  assert.equal(judgment.liveState, "ACTIVE");
});

test("ECA:10 T — Authority isolation", () => {
  const { judgment } = play("Update me.", { execution: snapshot("in-progress") });
  isolation(judgment);
});

test("ECA:10 sequence 1 — start then live review", () => {
  const before = play("Are we on track?", { execution: snapshot("ready") });
  assert.equal(before.judgment.liveState, "NOT_LIVE");
  const after = play("How is it going?", { execution: snapshot("in-progress", { progress: 20 }) });
  assert.equal(after.judgment.liveState, "ACTIVE");
  assert.equal(after.judgment.trackStatus, "UNKNOWN");
  assert.equal(after.judgment.boundaries.writesOutcome, false);
});

test("ECA:10 sequence 2 — new blocker attention", () => {
  const { judgment } = play("What's the biggest concern now?", {
    execution: snapshot("in-progress", { blockers: [{ label: "Supplier approval" }] }),
  });
  assert.equal(judgment.primaryAttentionItem, "Supplier approval");
});

test("ECA:10 sequence 3 — show blockers vs risks", () => {
  const blockers = play("Show blockers.", {
    execution: snapshot("in-progress", {
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
  });
  const risks = play("Show risks.", {
    execution: snapshot("in-progress", {
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.match(blockers.judgment.managerFacingNote ?? "", /Supplier approval/);
  assert.match(risks.judgment.managerFacingNote ?? "", /Risk/);
  assert.equal(risks.judgment.riskIsBlocker, false);
});

test("ECA:10 sequence 4 — missing baseline cannot determine behind", () => {
  const { judgment } = play("Are we behind?", { execution: snapshot("in-progress", { progress: 55 }) });
  assert.equal(judgment.trackStatus, "UNKNOWN");
});

test("ECA:10 sequence 5 — valid deviation", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 55 }),
    expectedProgress: 70,
  });
  assert.equal(judgment.deviation, "UNFAVORABLE_DEVIATION");
});

test("ECA:10 sequence 6 — reported estimate preserved", () => {
  const { judgment } = play("How are we doing?", {
    execution: snapshot("in-progress", { progress: 40 }),
    answerType: "ESTIMATE",
  });
  assert.equal(judgment.progressStatus, "ESTIMATED");
});

test("ECA:10 sequence 7 — material deviation may suggest reassessment", () => {
  const { judgment } = play("Does this change the Decision?", {
    execution: snapshot("blocked", { blockers: [{ label: "Supplier approval" }] }),
  });
  assert.equal(judgment.liveState, "BLOCKED");
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:10 sequence 8 — completion Outcome boundary", () => {
  const { judgment } = play("Did it work?", { execution: snapshot("completed") });
  assert.match(judgment.managerFacingNote ?? "", /work finished/i);
  assert.equal(judgment.boundaries.writesOutcome, false);
  const overlay = applyEcaLiveExecutionToPresentedResponse({
    source: "Execution is complete.",
    utterance: "Did it work?",
    judgment,
  });
  assert.match(overlay, /Outcome/i);
});
