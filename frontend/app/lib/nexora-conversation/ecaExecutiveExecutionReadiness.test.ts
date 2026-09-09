import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import { composeEcaWorkingConversationContext, type EcaSubject } from "./ecaWorkingConversationContext.ts";
import { planEcaExecutiveConversationAction } from "./ecaExecutiveIntentActionPlan.ts";
import {
  applyEcaExecutionReadinessToPresentedResponse,
  emptyEcaExecutionReadinessSession,
  judgeEcaExecutiveExecutionReadiness,
  nextEcaExecutionReadinessSession,
  type EcaExecutionReadinessSession,
  type EcaExecutionSnapshot,
  type EcaExecutiveExecutionReadinessJudgment,
} from "./ecaExecutiveExecutionReadiness.ts";

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

function isolation(judgment: EcaExecutiveExecutionReadinessJudgment) {
  assert.equal(judgment.boundaries.createsExecution, false);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.boundaries.createsSecondExecutionWriter, false);
  assert.equal(judgment.boundaries.replacesCc11, false);
  assert.equal(judgment.boundaries.replacesDth9, false);
  assert.equal(judgment.implicitCreate, false);
  assert.equal(judgment.implicitStart, false);
}

function planned(status: string, extra: Partial<EcaExecutionSnapshot> = {}): EcaExecutionSnapshot {
  return Object.freeze({
    executionId: extra.executionId ?? "execution-decision-a",
    decisionId: extra.decisionId ?? "decision-a",
    title: extra.title ?? "Implement Scenario A",
    status,
    ownerIds: extra.ownerIds ?? [],
    blockers: extra.blockers ?? [],
    risks: extra.risks ?? [],
  });
}

function play(
  utterance: string,
  extras: {
    committedDecisionId?: string | null;
    execution?: EcaExecutionSnapshot | null;
    capAvUnconfirmed?: boolean;
    answerType?: "ESTIMATE";
    session?: EcaExecutionReadinessSession | null;
  } = {},
) {
  const workingContext = working(utterance);
  const actionPlan = planEcaExecutiveConversationAction({ utterance, workingContext });
  const judgment = judgeEcaExecutiveExecutionReadiness({
    utterance,
    workingContext,
    actionPlan,
    answerIntake: extras.answerType
      ? ({ answerType: extras.answerType, confidence: "ESTIMATED", conflict: "NO_CONFLICT" } as never)
      : null,
    session: extras.session ?? null,
    committedDecisionId: extras.committedDecisionId,
    execution: extras.execution,
    capAvUnconfirmed: extras.capAvUnconfirmed,
  });
  isolation(judgment);
  return {
    judgment,
    session: nextEcaExecutionReadinessSession(extras.session ?? null, utterance, judgment),
  };
}

test("ECA:9 A — Canonical Decision required", () => {
  const { judgment } = play("What’s next?");
  assert.equal(judgment.readiness, "NOT_APPLICABLE");
  assert.equal(judgment.postDecisionState, "NOT_APPLICABLE");
  assert.equal(judgment.canonicalStartAllowed, false);
});

test("ECA:9 B — Decision committed what's next", () => {
  const { judgment } = play("What’s next?", { committedDecisionId: "decision-a" });
  assert.notEqual(judgment.postDecisionState, "NOT_APPLICABLE");
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.canonicalStartAllowed, false);
});

test("ECA:9 C — Ready does not start", () => {
  const { judgment } = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
  });
  assert.equal(judgment.readiness, "READY");
  assert.equal(judgment.implicitStart, false);
  assert.equal(judgment.canonicalStartAllowed, false);
});

test("ECA:9 D — Missing owner is advisory, not invented", () => {
  const { judgment } = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    execution: planned("planned"),
  });
  assert.equal(judgment.ownerState, "UNKNOWN");
  assert.equal(judgment.readiness, "READY_WITH_CONDITIONS");
  assert.notEqual(judgment.readiness, "BLOCKED");
});

test("ECA:9 E — Optional unknown does not block", () => {
  const { judgment } = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
  });
  assert.equal(judgment.readiness, "READY");
  assert.equal(judgment.unnecessaryBlocker, false);
});

test("ECA:9 F — Existing blocker", () => {
  const { judgment } = play("What could stop us?", {
    committedDecisionId: "decision-a",
    execution: planned("blocked", {
      blockers: [{ blockerId: "b", label: "Supplier confirmation" }],
    }),
  });
  assert.equal(judgment.blockerState, "KNOWN");
  assert.match(judgment.managerFacingNote ?? "", /Supplier confirmation/i);
});

test("ECA:9 G — Risk is not automatically blocker", () => {
  const { judgment } = play("What could stop us?", {
    committedDecisionId: "decision-a",
    execution: planned("planned", {
      ownerIds: ["alex"],
      risks: [{ riskId: "r", label: "Capacity variability" }],
    }),
  });
  assert.equal(judgment.riskIsBlocker, false);
  assert.notEqual(judgment.readiness, "BLOCKED");
  assert.match(judgment.managerFacingNote ?? "", /risk/i);
});

test("ECA:9 H — CAP_AV not treated as capacity ready", () => {
  const { judgment } = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    capAvUnconfirmed: true,
  });
  assert.equal(judgment.trustInflation, false);
  assert.match(judgment.managerFacingNote ?? "", /CAP_AV/i);
});

test("ECA:9 I — Create vs start intent", () => {
  const create = play("Create the execution.", { committedDecisionId: "decision-a" });
  const start = play("Start it.", { committedDecisionId: "decision-a" });
  assert.equal(create.judgment.managerIntent, "CREATE");
  assert.equal(start.judgment.managerIntent, "START");
  assert.equal(create.judgment.cc11StartMayCreate, true);
  assert.equal(start.judgment.boundaries.illegalCreateStartCollapse, false);
});

test("ECA:9 J — Existing Execution is not duplicated", () => {
  const { judgment } = play("Create the execution.", {
    committedDecisionId: "decision-a",
    execution: planned("planned"),
  });
  assert.equal(judgment.canonicalCreateAllowed, false);
  assert.match(judgment.managerFacingNote ?? "", /already exists/i);
});

test("ECA:9 K — Already active start is idempotent", () => {
  const { judgment } = play("Start it.", {
    committedDecisionId: "decision-a",
    execution: planned("in-progress", { ownerIds: ["alex"] }),
  });
  assert.equal(judgment.readiness, "ALREADY_EXECUTING");
  assert.equal(judgment.canonicalStartAllowed, false);
});

test("ECA:9 L — Show execution is read-only", () => {
  const { judgment } = play("Show me the execution.", {
    committedDecisionId: "decision-a",
    execution: planned("planned"),
  });
  assert.equal(judgment.managerIntent, "REVIEW");
  assert.equal(judgment.boundaries.startsExecution, false);
});

test("ECA:9 M — Explicit start hands off only", () => {
  const { judgment } = play("Start it.", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
  });
  assert.equal(judgment.managerIntent, "START");
  assert.equal(judgment.canonicalStartAllowed, true);
  assert.equal(judgment.boundaries.startsExecution, false);
  assert.equal(judgment.canonicalAuthority, "CC:11 Execution Follow-up");
});

test("ECA:9 N — Decision does not change Execution", () => {
  const { judgment } = play("What’s next?", { committedDecisionId: "decision-a" });
  assert.equal(judgment.implicitCreate, false);
  assert.equal(judgment.boundaries.createsExecution, false);
});

test("ECA:9 O — Execution start does not write Outcome", () => {
  const { judgment } = play("Start it.", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
  });
  assert.equal(judgment.boundaries.writesOutcome, false);
});

test("ECA:9 P — Readiness reassessment after blocker", () => {
  const ready = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
  });
  assert.equal(ready.judgment.readiness, "READY");
  const blocked = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    execution: planned("blocked", { blockers: [{ label: "Supplier confirmation" }] }),
    session: ready.session,
  });
  assert.equal(blocked.judgment.readiness, "BLOCKED");
  assert.equal(blocked.judgment.staleReadiness, false);
});

test("ECA:9 Q — Side question does not overlay execution", () => {
  const { judgment } = play("What does CAP_AV mean?", { committedDecisionId: "decision-a" });
  assert.equal(judgment.managerIntent, "NONE");
  assert.equal(judgment.speak, false);
});

test("ECA:9 R — Manager defers", () => {
  const { judgment } = play("Don’t start yet.", { committedDecisionId: "decision-a" });
  assert.equal(judgment.managerIntent, "DEFER");
  assert.equal(judgment.canonicalStartAllowed, false);
});

test("ECA:9 S — Revisit Decision", () => {
  const { judgment } = play("I want to reconsider the Decision.", { committedDecisionId: "decision-a" });
  assert.equal(judgment.managerIntent, "RECONSIDER");
  assert.equal(judgment.canonicalStartAllowed, false);
  assert.equal(judgment.canonicalCreateAllowed, false);
});

test("ECA:9 T — Authority isolation", () => {
  const { judgment } = play("Start it.", { committedDecisionId: "decision-a" });
  isolation(judgment);
  assert.equal(judgment.boundaries.writesGoal, false);
  assert.equal(judgment.boundaries.writesRisk, false);
  assert.equal(judgment.boundaries.commitsDecision, false);
  assert.equal(judgment.boundaries.writesLearning, false);
});

test("ECA:9 sequence 1 — Decision then readiness", () => {
  const next = play("What’s next?", { committedDecisionId: "decision-a" });
  const ready = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    session: next.session,
  });
  assert.equal(next.judgment.implicitStart, false);
  assert.equal(ready.judgment.readiness === "READY" || ready.judgment.readiness === "READY_WITH_CONDITIONS", true);
});

test("ECA:9 sequence 2 — start with missing owner then acknowledge", () => {
  const start = play("Start it.", { committedDecisionId: "decision-a", execution: planned("planned") });
  const owned = play("Alex owns it.", {
    committedDecisionId: "decision-a",
    execution: planned("planned", { ownerIds: ["alex"] }),
    session: start.session,
  });
  assert.equal(start.judgment.ownerState, "UNKNOWN");
  assert.equal(owned.judgment.ownerState, "KNOWN");
});

test("ECA:9 sequence 3 — create show start", () => {
  const created = play("Create the execution.", { committedDecisionId: "decision-a" });
  const shown = play("Show me the execution.", {
    committedDecisionId: "decision-a",
    execution: planned("planned"),
    session: created.session,
  });
  const started = play("Start it.", {
    committedDecisionId: "decision-a",
    execution: planned("planned"),
    session: shown.session,
  });
  assert.equal(created.judgment.managerIntent, "CREATE");
  assert.equal(shown.judgment.boundaries.startsExecution, false);
  assert.equal(started.judgment.canonicalAuthority, "CC:11 Execution Follow-up");
});

test("ECA:9 sequence 4 — side question", () => {
  const ready = play("Are we ready to execute?", { committedDecisionId: "decision-a" });
  const side = play("What does CAP_AV mean?", {
    committedDecisionId: "decision-a",
    session: ready.session,
  });
  assert.equal(side.judgment.speak, false);
  assert.equal(side.session.lastDecisionId, "decision-a");
});

test("ECA:9 sequence 5 — risk vs blocker", () => {
  const { judgment } = play("What could stop us?", {
    committedDecisionId: "decision-a",
    execution: planned("planned", {
      blockers: [{ label: "Supplier approval" }],
      risks: [{ label: "Capacity variability" }],
    }),
  });
  assert.match(judgment.managerFacingNote ?? "", /blocker/i);
  assert.match(judgment.managerFacingNote ?? "", /risk/i);
});

test("ECA:9 sequence 6 — estimate qualifies readiness", () => {
  const { judgment } = play("Are we ready to execute?", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
    answerType: "ESTIMATE",
  });
  assert.equal(judgment.readiness, "READY_WITH_CONDITIONS");
  assert.equal(judgment.trustInflation, false);
});

test("ECA:9 sequence 7 — reconsider", () => {
  const { judgment } = play("Before we execute, I want to reconsider A.", {
    committedDecisionId: "decision-a",
  });
  assert.equal(judgment.managerIntent, "RECONSIDER");
  assert.equal(judgment.implicitCreate, false);
});

test("ECA:9 sequence 8 — active yields to live framing", () => {
  const { judgment } = play("What’s happening now?", {
    committedDecisionId: "decision-a",
    execution: planned("in-progress", { ownerIds: ["alex"] }),
  });
  assert.equal(judgment.readiness, "ALREADY_EXECUTING");
  assert.match(judgment.managerFacingNote ?? "", /already active/i);
});

test("ECA:9 overlay what-happens-if-I-start", () => {
  const { judgment } = play("What happens if I start?", {
    committedDecisionId: "decision-a",
    execution: planned("ready", { ownerIds: ["alex"] }),
  });
  const spoken = applyEcaExecutionReadinessToPresentedResponse({
    source: "Decision Theatre remains available.",
    utterance: "What happens if I start?",
    judgment,
  });
  assert.match(spoken, /Decision is committed|review the Execution|start/i);
});

test("ECA:9 empty session after refresh", () => {
  const { judgment } = play("Start it.", {
    committedDecisionId: null,
    session: emptyEcaExecutionReadinessSession(),
  });
  assert.equal(judgment.postDecisionState, "NOT_APPLICABLE");
});
