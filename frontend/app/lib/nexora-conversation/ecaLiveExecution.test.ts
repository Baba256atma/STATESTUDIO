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

test("ECA:10 prompt A — No Execution → NOT_LIVE", () => {
  const { judgment } = play("How is execution going?", { execution: snapshot("planned") });
  assert.equal(judgment.liveState, "NOT_LIVE");
  assert.equal(judgment.falseLive, false);
  assert.equal(judgment.boundaries.writesExecution, false);
});

test("ECA:10 prompt B — Canonical Active Execution identity", () => {
  const { judgment } = play("How is it going?", {
    execution: snapshot("in-progress", { executionId: "execution-demand", decisionId: "decision-demand", progress: 42 }),
  });
  assert.equal(judgment.liveState, "ACTIVE");
  assert.equal(judgment.executionId, "execution-demand");
  assert.equal(judgment.decisionId, "decision-demand");
});

test("ECA:10 prompt C — Status fidelity ACTIVE not invented BLOCKED", () => {
  const { judgment } = play("How is it going?", { execution: snapshot("in-progress", { progress: 50 }) });
  assert.equal(judgment.liveState, "ACTIVE");
  assert.notEqual(judgment.liveState, "BLOCKED");
  assert.notEqual(judgment.liveState, "COMPLETED");
});

test("ECA:10 prompt D — Known progress reports exact value", () => {
  const { judgment } = play("How is it going?", { execution: snapshot("in-progress", { progress: 42 }) });
  assert.equal(judgment.progressValue, 42);
  assert.match(judgment.managerFacingNote ?? "", /42%/);
});

test("ECA:10 prompt E — Unknown progress not estimated", () => {
  const { judgment } = play("How is it going?", { execution: snapshot("in-progress") });
  assert.equal(judgment.progressValue, null);
  assert.equal(judgment.progressStatus, "UNKNOWN");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /\b60%\b|\bestimated 5/i);
});

test("ECA:10 prompt F — ON_TRACK with valid reference", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 60 }),
    expectedProgress: 60,
  });
  assert.equal(judgment.trackStatus, "ON_TRACK");
  assert.equal(judgment.deviation, "NO_MATERIAL_DEVIATION");
});

test("ECA:10 prompt G — No false ON_TRACK without baseline", () => {
  const { judgment } = play("Are we on track?", { execution: snapshot("in-progress", { progress: 60 }) });
  assert.equal(judgment.trackStatus, "UNKNOWN");
  assert.notEqual(judgment.trackStatus, "ON_TRACK");
});

test("ECA:10 prompt H — WATCH / POSSIBLE_DEVIATION", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 40 }),
    expectedProgress: 60,
    capAvUnconfirmed: true,
  });
  assert.ok(judgment.trackStatus === "UNKNOWN" || judgment.deviation === "POSSIBLE_DEVIATION");
  assert.notEqual(judgment.liveState, "BLOCKED");
});

test("ECA:10 prompt I — DEVIATING / OFF_TRACK", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  assert.equal(judgment.trackStatus, "OFF_TRACK");
  assert.equal(judgment.deviation, "UNFAVORABLE_DEVIATION");
});

test("ECA:10 prompt J — No reference → no invented deviation", () => {
  const { judgment } = play("Are we on track?", { execution: snapshot("in-progress", { progress: 42 }) });
  assert.equal(judgment.trackStatus, "UNKNOWN");
  assert.notEqual(judgment.trackStatus, "OFF_TRACK");
  assert.equal(judgment.falseDeviation, false);
});

test("ECA:10 prompt K — BLOCKED from canonical blocker status", () => {
  const { judgment } = play("How is it going?", {
    execution: snapshot("blocked", { blockers: [{ label: "Supplier approval" }] }),
  });
  assert.equal(judgment.liveState, "BLOCKED");
  assert.equal(judgment.blockerState, "KNOWN");
});

test("ECA:10 prompt L — Risk ≠ Blocker", () => {
  const { judgment } = play("How is it going?", {
    execution: snapshot("in-progress", {
      progress: 60,
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.liveState, "ACTIVE");
  assert.equal(judgment.riskIsBlocker, false);
  assert.notEqual(judgment.liveState, "BLOCKED");
});

test("ECA:10 prompt M — Deviation ≠ Cause", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  assert.equal(judgment.unsupportedCause, false);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /caused by Capacity|Capacity Gap caused/i);
  assert.match(judgment.managerFacingNote ?? "", /won’t invent a cause|behind/i);
});

test("ECA:10 prompt N — Possible contributor language bounded", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 40 }),
    expectedProgress: 60,
    capAvUnconfirmed: true,
  });
  assert.equal(judgment.deviation, "POSSIBLE_DEVIATION");
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /capacity dropped|confirmed cause/i);
});

test("ECA:10 prompt O — CAP_AV semantic uncertainty", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 40 }),
    capAvUnconfirmed: true,
  });
  assert.equal(judgment.trustInflation, false);
  assert.equal(judgment.boundaries.writesDataTruth, false);
});

test("ECA:10 prompt P — Observed vs expected distinction", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  assert.equal(judgment.progressValue, 42);
  assert.match(judgment.managerFacingNote ?? "", /42%.*60%|60% expected/i);
});

test("ECA:10 prompt Q — Importance / urgency / confidence stay unmerged", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      progress: 42,
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
    expectedProgress: 60,
  });
  assert.equal(judgment.riskIsBlocker, false);
  assert.equal(judgment.trustInflation, false);
  assert.ok(judgment.progressStatus === "CONFIRMED" || judgment.progressValue === 42);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /\b82%\b|\bHIGH urgency\b/i);
});

test("ECA:10 prompt R — Milestone/blocker supports deviation without mutation", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      progress: 40,
      blockers: [{ label: "Missed supplier milestone" }],
    }),
    expectedProgress: 60,
  });
  assert.equal(judgment.blockerState, "KNOWN");
  assert.equal(judgment.boundaries.writesExecution, false);
});

test("ECA:10 prompt S — Goal safety", () => {
  const { judgment } = play("Will we hit the goal?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.doesNotMatch(judgment.managerFacingNote ?? "", /Goal will fail|Goal failed/i);
});

test("ECA:10 prompt T — Decision safety", () => {
  const { judgment } = play("Should we change the decision?", {
    execution: snapshot("in-progress", {
      progress: 42,
      blockers: [{ label: "Supplier approval" }],
    }),
    expectedProgress: 60,
  });
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.match(judgment.managerFacingNote ?? "", /does not itself change the Decision/i);
});

test("ECA:10 prompt U — Outcome / Learning boundary", () => {
  const { judgment } = play("Did it work?", { execution: snapshot("in-progress", { progress: 50 }) });
  assert.equal(judgment.boundaries.writesOutcome, false);
  assert.equal(judgment.boundaries.writesLearning, false);
  assert.match(judgment.managerFacingNote ?? "", /too early|Outcome/i);
});

test("ECA:10 prompt V — Attention ≠ forced intervention", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      progress: 60,
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.managerIntent, "ATTENTION");
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.riskIsBlocker, false);
});

test("ECA:10 prompt W — Intervention guidance advisory only", () => {
  const { judgment } = play("Should we change the plan?", {
    execution: snapshot("in-progress", {
      progress: 42,
      blockers: [{ label: "Supplier approval" }],
    }),
    expectedProgress: 60,
  });
  assert.equal(judgment.managerIntent, "REASSESS");
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
});

test("ECA:10 prompt X — Status question", () => {
  const { judgment } = play("How is execution going?", {
    execution: snapshot("in-progress", { progress: 42 }),
  });
  assert.equal(judgment.managerIntent, "SUMMARY");
  assert.equal(judgment.liveState, "ACTIVE");
  assert.match(judgment.managerFacingNote ?? "", /42%/);
});

test("ECA:10 prompt Y — On-track question", () => {
  const on = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 60 }),
    expectedProgress: 60,
  });
  const off = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  const unknown = play("Are we on track?", { execution: snapshot("in-progress", { progress: 42 }) });
  assert.equal(on.judgment.trackStatus, "ON_TRACK");
  assert.equal(off.judgment.trackStatus, "OFF_TRACK");
  assert.equal(unknown.judgment.trackStatus, "UNKNOWN");
});

test("ECA:10 prompt Z — Why / causal safety", () => {
  const { judgment } = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  assert.equal(judgment.unsupportedCause, false);
  assert.match(judgment.managerFacingNote ?? "", /won’t invent a cause/i);
});

test("ECA:10 prompt AA — What changed with and without history", () => {
  const withHistoryPrior = play("How is it going?", { execution: snapshot("in-progress", { progress: 40 }) });
  const withHistory = play("What changed?", {
    execution: snapshot("in-progress", { progress: 55 }),
    session: withHistoryPrior.session,
  });
  const without = play("What changed?", { execution: snapshot("in-progress", { progress: 55 }) });
  assert.match(withHistory.judgment.managerFacingNote ?? "", /40%|55%|moved/i);
  assert.match(without.judgment.managerFacingNote ?? "", /don’t have a prior|prior execution observation/i);
});

test("ECA:10 prompt AB — What should I do / bounded guidance", () => {
  const { judgment } = play("Should we change the plan?", {
    execution: snapshot("in-progress", {
      progress: 42,
      blockers: [{ label: "Supplier delay" }],
    }),
    expectedProgress: 60,
  });
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:10 prompt AC — Mutation request does not mutate", () => {
  const { judgment } = play("Pause it.", { execution: snapshot("in-progress", { progress: 50 }) });
  assert.equal(judgment.managerIntent, "WRITE");
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.canonicalHandoffAllowed, true);
  assert.match(judgment.managerFacingNote ?? "", /confirmation|Execution change/i);
});

test("ECA:10 prompt AD — Wrong/stale Scenario does not override Execution identity", () => {
  const { judgment } = play("How is it going?", {
    execution: snapshot("in-progress", {
      executionId: "execution-demand",
      decisionId: "decision-demand",
      title: "Implement Demand Surge",
      progress: 42,
    }),
  });
  assert.equal(judgment.executionId, "execution-demand");
  assert.equal(judgment.targetDrift, false);
});

test("ECA:10 prompt AE — Ambiguous / no live Execution clarifies", () => {
  const { judgment } = play("How is it going?");
  assert.equal(judgment.liveState, "NOT_LIVE");
  assert.equal(judgment.falseLive, false);
});

test("ECA:10 prompt AF — Refresh session preserves identity", () => {
  const first = play("How is it going?", {
    execution: snapshot("in-progress", { executionId: "execution-a", progress: 42 }),
  });
  const second = play("How is it going?", {
    execution: snapshot("in-progress", { executionId: "execution-a", progress: 42 }),
    session: first.session,
  });
  assert.equal(second.judgment.executionId, "execution-a");
  assert.equal(second.judgment.progressValue, 42);
  assert.equal(second.judgment.liveState, "ACTIVE");
});

test("ECA:10 prompt AG — Duplicate Execution protection", () => {
  const { judgment } = play("How is it going?", { execution: snapshot("in-progress", { progress: 50 }) });
  assert.equal(judgment.boundaries.createsSecondExecutionWriter, false);
  assert.equal(judgment.boundaries.writesExecution, false);
});

test("ECA:10 prompt AH — ECA:9 boundary when not live", () => {
  const { judgment } = play("Are we on track?", { execution: snapshot("planned") });
  assert.equal(judgment.liveState, "NOT_LIVE");
  assert.match(judgment.managerFacingNote ?? "", /readiness|not live|not.*active/i);
});

test("ECA:10 prompt AI — Zero ECA writes across samples", () => {
  for (const sample of [
    play("How is execution going?"),
    play("How is it going?", { execution: snapshot("in-progress", { progress: 42 }), expectedProgress: 60 }),
    play("Pause it.", { execution: snapshot("in-progress", { progress: 50 }) }),
    play("Did it work?", { execution: snapshot("completed") }),
  ]) {
    isolation(sample.judgment);
  }
});

test("ECA:10 prompt AJ — No duplicate intelligence authority", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.boundaries.replacesDth10, false);
  assert.equal(judgment.boundaries.replacesCc11, false);
  assert.equal(judgment.boundaries.createsMonitoringDaemon, false);
  assert.equal(judgment.boundaries.createsSecondInitiativeEngine, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:10 prompt multi-turn 1 — Start → live status", () => {
  const going = play("How is execution going?", {
    execution: snapshot("in-progress", { progress: 42 }),
  });
  assert.equal(going.judgment.liveState, "ACTIVE");
  assert.equal(going.judgment.progressValue, 42);
  assert.equal(going.judgment.boundaries.writesOutcome, false);
  assert.equal(going.judgment.boundaries.createsSecondExecutionWriter, false);
});

test("ECA:10 prompt multi-turn 2 — Deviation → why causal safety", () => {
  const track = play("Are we on track?", {
    execution: snapshot("in-progress", { progress: 42 }),
    expectedProgress: 60,
  });
  assert.equal(track.judgment.trackStatus, "OFF_TRACK");
  assert.equal(track.judgment.unsupportedCause, false);
  assert.match(track.judgment.managerFacingNote ?? "", /won’t invent a cause/i);
});

test("ECA:10 prompt multi-turn 3 — Risk → attention without false intervention", () => {
  const { judgment } = play("What needs my attention?", {
    execution: snapshot("in-progress", {
      progress: 60,
      risks: [{ label: "Supplier Delay Risk" }],
    }),
  });
  assert.equal(judgment.liveState, "ACTIVE");
  assert.equal(judgment.riskIsBlocker, false);
  assert.notEqual(judgment.liveState, "BLOCKED");
  assert.equal(judgment.boundaries.writesExecution, false);
});

test("ECA:10 prompt multi-turn 4 — Deviation → manager guidance no mutation", () => {
  const { judgment } = play("Should we change the plan?", {
    execution: snapshot("in-progress", {
      progress: 42,
      blockers: [{ label: "Supplier delay" }],
    }),
    expectedProgress: 60,
  });
  assert.equal(judgment.boundaries.writesExecution, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.writesOutcome, false);
});
