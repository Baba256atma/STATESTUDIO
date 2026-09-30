import assert from "node:assert/strict";
import test from "node:test";

import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import { classifyManagerJourney } from "./nexoraSimulationJourneyObservation.ts";
import { SIM_TEST_6_MANUFACTURING_IMPATIENT } from "./nexoraSimulationLongSessionJourneys.ts";
import type { NexoraSimulationJourneyTurnObservation } from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

type Decisions = ReturnType<NonNullable<RmsCc5Turn["decisionRuntime"]>["listDecisions"]>;

// The Decision and Execution runtimes are shared across turns, so each turn's records are captured when it completes.
const recordsAtTurn = new WeakMap<RmsCc5Turn, { decisions: Decisions; executions: readonly string[] }>();

function speak(utterances: readonly string[], seed: string): RmsCc5Turn[] {
  const turns: RmsCc5Turn[] = [];
  let previous: RmsCc5Turn | null = null;
  for (const [index, utterance] of utterances.entries()) {
    previous = speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `fix17-${seed}-${index}` });
    recordsAtTurn.set(previous, {
      decisions: [...(previous.decisionRuntime?.listDecisions() ?? [])],
      executions: (previous.executionRuntime?.listExecutions() ?? []).map((item) => item.executionId),
    });
    turns.push(previous);
  }
  return turns;
}

function decisions(turn: RmsCc5Turn): Decisions {
  return recordsAtTurn.get(turn)?.decisions ?? [];
}

function executions(turn: RmsCc5Turn): readonly string[] {
  return recordsAtTurn.get(turn)?.executions ?? [];
}

function layers(turn: RmsCc5Turn) {
  return {
    canonical: turn.nextExecutiveContext?.currentSubject?.subjectId ?? null,
    conversation: turn.managerObjectTurn.session.conversationContinuity?.activeSubjectId ?? null,
    dialogue: turn.managerObjectTurn.session.ncaConversationState?.activeSubject?.id ?? null,
    advisor: turn.nxaAdvisorContract?.referentId ?? null,
    stage: turn.nextRuntimeState.focusedSubject?.id ?? null,
  };
}

function assertAligned(turn: RmsCc5Turn, subjectId: string, label: string): void {
  assert.deepEqual(
    layers(turn),
    { canonical: subjectId, conversation: subjectId, dialogue: subjectId, advisor: subjectId, stage: subjectId },
    label,
  );
}

test("FIX17 A/B/L: Impatient back navigation keeps the Advisor on the canonical subject through T31", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_IMPATIENT,
    runId: "fix17-a",
  });
  const byTurn = (turn: number) => report.journeyObservations.find((row) => row.turn === turn)!;
  const back = byTurn(30);
  const anythingElse = byTurn(31);
  assert.equal(back.utterance, "The previous one.");
  assert.equal(anythingElse.utterance, "Anything else?");
  for (const row of [back, anythingElse]) {
    assert.deepEqual(
      [row.canonicalSubjectId, row.conversationSubjectId, row.advisorReferentId, row.stageActiveSubjectId],
      ["obj-inventory", "obj-inventory", "obj-inventory", "obj-inventory"],
      row.utterance,
    );
  }
  assert.deepEqual(
    report.journeyFindings.filter((finding) => finding.severity === "S1").map((finding) => finding.classification),
    [],
  );
  const committed = byTurn(9);
  for (const row of report.journeyObservations.filter((item) => item.turn >= 10)) {
    assert.equal(row.decisionCount, 1, row.utterance);
    assert.equal(row.decisionId, committed.decisionId, row.utterance);
    assert.equal(row.executionCount, 1, row.utterance);
  }
});

test("FIX17 C/F: back navigation commits the runtime focus so canonical, Advisor and Stage align", () => {
  for (const [utterances, expected] of [
    [["Status.", "Capacity. Details.", "Delivery.", "The previous one."], "obj-capacity"],
    [["Status.", "Delivery.", "Inventory.", "The previous one."], "obj-delivery"],
  ] as const) {
    const back = speak(utterances, `c-${expected}`).at(-1)!;
    assert.equal(back.contextualManagerMeaning.continuityMove, "backtrack");
    assert.equal(back.contextualManagerMeaning.requestedOperation, "FOCUS");
    assert.equal(back.naturalLanguageUnderstanding.requestedOperation, "NONE");
    assert.equal(back.commandResult?.command?.kind, "focus-subject");
    assert.equal(back.runtimeResult?.status, "applied");
    assert.equal(back.status, "applied");
    assertAligned(back, expected, utterances.join(" "));
  }
});

test("FIX17 G: the pre-return subject does not survive in the Advisor after back navigation", () => {
  const turns = speak(
    ["Status.", "Capacity. Details.", "Delivery.", "The previous one.", "Anything else?", "Explain this.", "Delivery."],
    "g",
  );
  assertAligned(turns[3]!, "obj-capacity", "back navigation");
  assertAligned(turns[4]!, "obj-capacity", "what-else follow-up");
  assertAligned(turns[5]!, "obj-capacity", "deictic explanation");
  assert.match(turns[5]!.response, /Capacity/);
  assertAligned(turns[6]!, "obj-delivery", "explicit return to Delivery");
});

test("FIX17 E/H: the previous operation does not ride along with back navigation", () => {
  const [, , , why, back] = speak(["Status.", "Capacity. Details.", "Delivery.", "Why?", "The previous one."], "h");
  assert.equal(why!.nxaAdvisorContract?.need, "INVESTIGATE");
  assert.notEqual(back!.nxaAdvisorContract?.need, "INVESTIGATE");
  assertAligned(back!, "obj-capacity", "back navigation after Why?");

  const [, , explicit] = speak(["Status.", "Capacity. Details.", "Show Delivery."], "h-explicit");
  assert.equal(explicit!.naturalLanguageUnderstanding.requestedOperation, "FOCUS");
  assertAligned(explicit!, "obj-delivery", "explicit focus still commits");
});

test("FIX17 E: a focus command is not committed when the contextual referent names another subject", () => {
  const turns = speak(["Status.", "Delivery.", "Inventory.", "The previous one.", "The previous one."], "e");
  const repeated = turns.at(-1)!;
  assert.equal(repeated.contextualManagerMeaning.requestedOperation, "FOCUS");
  assert.notEqual(
    repeated.contextualManagerMeaning.objectReference?.subjectId,
    repeated.contextResult.context.primarySubject?.subjectId,
  );
  assert.equal(
    repeated.nextExecutiveContext?.currentSubject?.subjectId,
    repeated.contextualManagerMeaning.objectReference?.subjectId,
  );
  assert.equal(repeated.nextRuntimeState.focusedSubject?.id, turns[3]!.nextRuntimeState.focusedSubject?.id);
});

test("FIX17 D: related Scenario and Decision context stays related without replacing the Stage subject", () => {
  const [, focus, options, committed] = speak(["Status.", "Capacity. Details.", "Options.", "Go with B."], "d");
  assertAligned(focus!, "obj-capacity", "focus");
  assert.equal(options!.nextExecutiveContext?.currentSubject?.subjectId, "obj-capacity");
  assert.equal(options!.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.ok((options!.nextScenarioSession?.candidateScenarioIds.length ?? 0) >= 2);
  assert.equal(committed!.decisionCommitmentResult?.status, "applied");
  assert.equal(committed!.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.match(committed!.decisionCommitmentResult?.decision?.title ?? "", /Capacity/);
});

test("FIX17 I/J/L: back navigation never hands the manager a historical Decision or Scenario", () => {
  const turns = speak(
    ["Status.", "Capacity. Details.", "Options.", "Go with B.", "Start it.", "Delivery.", "The previous one.", "Explain this."],
    "i",
  );
  const [committed, started, back, explain] = [turns[3]!, turns[4]!, turns[6]!, turns[7]!];
  const decisionId = committed.decisionCommitmentResult?.decision?.decisionId;
  const scenarioId = committed.decisionCommitmentResult?.decision?.scenarioId;
  assert.ok(decisionId && scenarioId);
  assert.equal(executions(started).length, 1);
  for (const turn of [back, explain]) {
    const canonical = turn.nextExecutiveContext?.currentSubject?.subjectId ?? "";
    assert.ok(!canonical.startsWith("cc10:") && !canonical.startsWith("cc9:"), canonical);
    assert.notEqual(turn.nxaAdvisorContract?.referentId, decisionId);
    assert.deepEqual(decisions(turn).map((item) => [item.decisionId, item.scenarioId]), [[decisionId, scenarioId]]);
    assert.deepEqual(executions(turn), executions(started));
  }
  assert.notEqual(back.status, "applied");
  assertAligned(explain, "obj-delivery", "deictic after unresolved back navigation");
});

test("FIX17 K: back navigation without a usable previous subject does not guess", () => {
  const cold = speak(["The previous one."], "k-cold")[0]!;
  assert.equal(cold.status, "clarification-required");
  assert.equal(cold.nextExecutiveContext?.currentSubject ?? null, null);
  assert.equal(cold.nextRuntimeState.focusedSubject ?? null, null);

  const [, , single] = speak(["Status.", "Capacity. Details.", "The previous one."], "k-single");
  assert.notEqual(single!.status, "applied");
  assertAligned(single!, "obj-capacity", "no previous subject");
});

function observation(overrides: Partial<NexoraSimulationJourneyTurnObservation>): NexoraSimulationJourneyTurnObservation {
  return Object.freeze({
    turn: 1, tick: 0, intent: "ORIENT", utterance: "", deictic: false, intendedSubject: null,
    response: "", conversationSubjectId: null, canonicalSubjectId: null, focusedSubjectLabel: null,
    nmiCanonicalId: null, advisorReferentId: null, advisorReferentName: null,
    mlevelL1: null, mlevelL2: null, mlevelL3: null, mlevelVisibleDepth: 0,
    ancestorApplicable: "NOT_APPLICABLE", stageActiveSubjectId: null, stageSelectedObjectId: null,
    sceneIntent: null, clarificationRequired: false, decisionStatus: null, npsState: null,
    npsProblemLabel: null, vaiFocalObjectId: null, vaiRoleSummaries: Object.freeze([]),
    dataPublicationIds: Object.freeze([]), csvVersions: Object.freeze([]),
    visibleNumbers: Object.freeze({}), observerHiddenNumbers: Object.freeze({}),
    problemId: null, scenarioId: null, decisionId: null, decisionCount: 0, executionId: null,
    executionCount: 0, executionStatus: null, npsOutcomeStatus: null, npsResolutionStatus: null,
    npsLearningStatus: null, npsLearningDurable: false, nxa3OutcomeState: null,
    epistemicMarks: Object.freeze([]), ...overrides,
  });
}

function aligned(turn: number, subjectId: string, overrides: Partial<NexoraSimulationJourneyTurnObservation> = {}) {
  return observation({
    turn,
    canonicalSubjectId: subjectId,
    conversationSubjectId: subjectId,
    advisorReferentId: subjectId,
    stageActiveSubjectId: subjectId,
    mlevelL1: subjectId,
    ...overrides,
  });
}

function classify(observations: readonly NexoraSimulationJourneyTurnObservation[]): readonly string[] {
  return classifyManagerJourney({
    testRunId: "fix17-observer",
    rmsRunId: "rms:fix17-observer",
    journey: SIM_TEST_6_MANUFACTURING_IMPATIENT,
    observations,
    causalOverclaimTurns: Object.freeze([]),
  }).findings
    .filter((finding) => finding.severity === "S1")
    .map((finding) => `${finding.managerTurn}:${finding.classification}`);
}

test("FIX17 Observer: back navigation to the previously held subject is not a wrong referent", () => {
  const findings = classify([
    aligned(1, "obj-capacity", { utterance: "Capacity.", intent: "FOCUS_PROBLEM", intendedSubject: "Capacity" }),
    aligned(2, "obj-inventory", { utterance: "Inventory.", intent: "CHANGE_CONTEXT", intendedSubject: "Inventory" }),
    aligned(3, "obj-capacity", { utterance: "Return to capacity.", intent: "RETURN_TO_SUBJECT", intendedSubject: "Capacity" }),
    aligned(4, "obj-capacity", { utterance: "Now?", intent: "ORIENT" }),
    aligned(5, "obj-inventory", { utterance: "The previous one.", intent: "FOLLOW_UP", deictic: true }),
  ]);
  assert.deepEqual(findings, []);
});

test("FIX17 Observer: back navigation to any other subject, or an unannounced deictic move, stays a wrong referent", () => {
  const history = [
    aligned(1, "obj-capacity", { utterance: "Capacity.", intent: "FOCUS_PROBLEM", intendedSubject: "Capacity" }),
    aligned(2, "obj-delivery", { utterance: "Delivery.", intent: "CHANGE_CONTEXT", intendedSubject: "Delivery" }),
    aligned(3, "obj-inventory", { utterance: "Inventory.", intent: "CHANGE_CONTEXT", intendedSubject: "Inventory" }),
  ];
  assert.deepEqual(
    classify([...history, aligned(4, "obj-capacity", { utterance: "The previous one.", intent: "FOLLOW_UP", deictic: true })]),
    ["4:JOURNEY/WRONG_REFERENT"],
  );
  assert.deepEqual(
    classify([...history, aligned(4, "obj-delivery", { utterance: "This.", intent: "FOLLOW_UP", deictic: true })]),
    ["4:JOURNEY/WRONG_REFERENT"],
  );
});

test("FIX17 Observer: an Advisor that stays behind after back navigation is still divergence", () => {
  const findings = classify([
    aligned(1, "obj-capacity", { utterance: "Capacity.", intent: "FOCUS_PROBLEM", intendedSubject: "Capacity" }),
    aligned(2, "obj-inventory", { utterance: "Inventory.", intent: "CHANGE_CONTEXT", intendedSubject: "Inventory" }),
    aligned(3, "obj-capacity", { utterance: "The previous one.", intent: "FOLLOW_UP", deictic: true, advisorReferentId: "obj-inventory" }),
  ]);
  assert.deepEqual(findings, ["3:JOURNEY/ADVISOR_DIVERGENCE"]);
});
