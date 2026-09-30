import assert from "node:assert/strict";
import test from "node:test";

import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
} from "../conversational-control/executiveContextSnapshot.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { resolveContextualManagerMeaning } from "../manager-object/conversationContinuityResolver.ts";
import { createEmptyConversationContinuity } from "../manager-object/conversationContinuitySnapshot.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import {
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_PROJECT_LONG,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

type Decisions = ReturnType<NonNullable<RmsCc5Turn["decisionRuntime"]>["listDecisions"]>;

// The Decision and Execution runtimes are shared across turns, so each turn's records are captured when it completes.
const recordsAtTurn = new WeakMap<RmsCc5Turn, { decisions: Decisions; executions: number }>();

function speak(utterances: readonly string[], seed: string): RmsCc5Turn[] {
  const turns: RmsCc5Turn[] = [];
  let previous: RmsCc5Turn | null = null;
  for (const [index, utterance] of utterances.entries()) {
    previous = speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `fix16-${seed}-${index}` });
    recordsAtTurn.set(previous, {
      decisions: [...(previous.decisionRuntime?.listDecisions() ?? [])],
      executions: previous.executionRuntime?.listExecutions().length ?? 0,
    });
    turns.push(previous);
  }
  return turns;
}

function decisions(turn: RmsCc5Turn): Decisions {
  return recordsAtTurn.get(turn)?.decisions ?? [];
}

function executions(turn: RmsCc5Turn): number {
  return recordsAtTurn.get(turn)?.executions ?? 0;
}

function layers(turn: RmsCc5Turn) {
  return {
    canonical: turn.nextExecutiveContext?.currentSubject?.subjectId ?? null,
    conversation: turn.managerObjectTurn.session.conversationContinuity?.activeSubjectId ?? null,
    advisor: turn.nxaAdvisorContract?.referentId ?? null,
    stage: turn.nextRuntimeState.focusedSubject?.id ?? null,
  };
}

function assertAligned(turn: RmsCc5Turn, subjectId: string, label: string): void {
  assert.deepEqual(
    layers(turn),
    { canonical: subjectId, conversation: subjectId, advisor: subjectId, stage: subjectId },
    label,
  );
}

test("FIX16 A: the Impatient T12-T16 cluster keeps every layer on the named Capacity return", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_IMPATIENT,
    runId: "fix16-a",
  });
  const rows = report.journeyObservations.filter((row) => row.turn >= 9 && row.turn <= 16);
  const byUtterance = (utterance: string) => rows.find((row) => row.utterance === utterance)!;
  for (const utterance of ["Back to capacity.", "Capacity again."]) {
    const row = byUtterance(utterance);
    assert.deepEqual(
      [row.canonicalSubjectId, row.conversationSubjectId, row.advisorReferentId, row.stageActiveSubjectId],
      ["obj-capacity", "obj-capacity", "obj-capacity", "obj-capacity"],
      utterance,
    );
    assert.equal(row.clarificationRequired, false, utterance);
  }
  assert.ok(
    !report.journeyFindings.some((finding) => finding.classification.endsWith("STALE_REFERENT")),
    report.journeyFindings.map((finding) => `${finding.managerTurn}:${finding.classification}`).join(" "),
  );
  const committed = byUtterance("Yes. Decide.");
  for (const row of rows.filter((item) => item.turn >= committed.turn)) {
    assert.equal(row.decisionCount, 1, row.utterance);
    assert.equal(row.decisionId ?? committed.decisionId, committed.decisionId, row.utterance);
  }
  for (const row of rows.filter((item) => item.turn > committed.turn)) {
    assert.equal(row.executionCount, 1, row.utterance);
  }
});

test("FIX16 B/F: a terse named return uses the FIX11 historical return and aligns every layer", () => {
  for (const utterance of ["Back to capacity.", "Go back to capacity.", "Return to capacity."]) {
    const [, , , returned] = speak(["Status.", "Capacity. Details.", "Delivery.", utterance], `b-${utterance}`);
    assert.equal(returned!.contextualManagerMeaning.continuityMove, "previous-referent", utterance);
    assert.equal(returned!.contextualManagerMeaning.provenance, "CONTEXT_PREVIOUS_SUBJECT", utterance);
    assert.equal(returned!.intentResult.intent.kind, "focus", utterance);
    assert.equal(returned!.status, "applied", utterance);
    assertAligned(returned!, "obj-capacity", utterance);
  }
});

test("FIX16 C: deictic follow-ups after the return stay on the returned subject", () => {
  const turns = speak(
    ["Status.", "Capacity. Details.", "Delivery.", "Back to capacity.", "Explain this.", "Why?"],
    "c",
  );
  for (const turn of turns.slice(4)) {
    assert.equal(turn.contextualManagerMeaning.objectReference?.subjectId, "obj-capacity");
    assertAligned(turn, "obj-capacity", turn.intentResult.intent.kind);
  }
  assert.match(turns[4]!.response, /Capacity/);
});

test("FIX16 D/E/L: returns move through multi-subject history without destroying it", () => {
  const turns = speak(
    ["Status.", "Capacity. Details.", "Delivery.", "Inventory.", "Back to capacity.", "Back to delivery.", "Back to capacity."],
    "d",
  );
  const [capacity, delivery, capacityAgain] = turns.slice(4);
  assertAligned(capacity!, "obj-capacity", "first return");
  assertAligned(delivery!, "obj-delivery", "return to delivery");
  assertAligned(capacityAgain!, "obj-capacity", "second return");
  for (const turn of turns.slice(4)) {
    assert.equal(turn.contextualManagerMeaning.continuityMove, "previous-referent");
  }
  const thread = capacityAgain!.managerObjectTurn.session.conversationContinuity?.thread ?? [];
  for (const subjectId of ["obj-delivery", "obj-inventory"]) {
    assert.ok(thread.some((frame) => frame.subjectId === subjectId), subjectId);
  }
});

test("FIX16: a historical qualifier in a named return still resolves the visited subject", () => {
  for (const utterance of ["Back to the known delivery issue.", "Go back to the known delivery issue."]) {
    const [, , , returned] = speak(["Status.", "Delivery.", "Capacity. Details.", utterance], `known-${utterance}`);
    assert.equal(returned!.contextualManagerMeaning.objectReference?.subjectId, "obj-delivery", utterance);
    assert.notEqual(returned!.status, "clarification-required", utterance);
    assertAligned(returned!, "obj-delivery", utterance);
  }
  const report = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_PROJECT_LONG, runId: "fix16-known" });
  const known = report.journeyObservations.find((row) => row.utterance === "Back to the known delivery issue.")!;
  assert.equal(known.clarificationRequired, false);
  assert.equal(known.canonicalSubjectId, "obj-delivery");
});

test("FIX16: bare Go back stays R2 navigation and collection returns are not subject returns", () => {
  const turns = speak(["Status.", "Capacity. Details.", "Delivery.", "Go back.", "Back to the problems."], "r2");
  const [back, problems] = turns.slice(3);
  assert.equal(back!.intentResult.intent.kind, "navigate-back");
  assert.equal(back!.contextualManagerMeaning.continuityMove, "backtrack");
  assert.equal(back!.nextExecutiveContext?.currentSubject?.subjectId, "obj-capacity");
  assert.notEqual(problems!.contextualManagerMeaning.continuityMove, "previous-referent");
  assert.notEqual(problems!.intentResult.intent.kind, "focus");
});

test("FIX16 G: an ambiguous terse named return stays unresolved for Smart Clarification", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const extra = freezeConversationalSubjectRecord({
    subjectId: "ctx-problem-capacity-alt",
    subjectKind: "problem",
    canonicalName: "Capacity Shortage",
    aliases: Object.freeze(["capacity shortage"]),
    businessKey: "ctx-problem-capacity-alt",
  });
  const subjects = [...projectManagerObjectConversationalSubjects(catalog), extra];
  const meaning = interpretCanonicalManagerMeaning({ utterance: "Back to the capacity problem.", subjects });
  const resolved = resolveContextualManagerMeaning({
    turnMeaning: meaning,
    subjects,
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: createEmptyNexoraExecutiveContextSnapshot({
      currentSubject: freezeExecutiveContextReference({
        subjectId: "obj-customer",
        subjectKind: "object",
        canonicalName: "Customer",
        source: "explicit",
        turnIndex: 3,
      }),
      previousSubjects: Object.freeze([
        freezeExecutiveContextReference({
          subjectId: "ctx-problem-capacity",
          subjectKind: "problem",
          canonicalName: "Capacity Gap",
          source: "conversation",
          turnIndex: 1,
        }),
        freezeExecutiveContextReference({
          subjectId: "ctx-problem-capacity-alt",
          subjectKind: "problem",
          canonicalName: "Capacity Shortage",
          source: "conversation",
          turnIndex: 2,
        }),
      ]),
      turnIndex: 3,
    }),
  });
  assert.equal(resolved.continuityMove, "previous-referent");
  assert.equal(resolved.objectReference, null);
  assert.equal(resolved.ambiguity.unresolved, true);
  assert.equal(resolved.ambiguity.reason, "multiple-objects");
});

test("FIX16 H: an unknown or unvisited target does not become the canonical subject", () => {
  const [, , inventory, supplier] = speak(
    ["Status.", "Capacity. Details.", "Back to inventory.", "Back to supplier."],
    "h",
  );
  assert.equal(inventory!.nextExecutiveContext?.currentSubject?.subjectId, "obj-capacity");
  assert.equal(inventory!.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(supplier!.contextualManagerMeaning.objectReference, null);
  assert.equal(supplier!.status, "clarification-required");
  assert.equal(supplier!.nextExecutiveContext?.currentSubject?.subjectId, "obj-capacity");
  assert.doesNotMatch(supplier!.response, /Supplier Delay has been added/i);
});

test("FIX16 I/J: a named return does not select or mutate the committed Decision or Execution", () => {
  const turns = speak(
    ["Status.", "Capacity. Details.", "Options.", "Go with B.", "Start it.", "Delivery.", "Back to capacity.", "Explain this."],
    "i",
  );
  const [committed, started] = [turns[3]!, turns[4]!];
  const decisionId = committed.decisionCommitmentResult?.decision?.decisionId;
  const scenarioId = committed.decisionCommitmentResult?.decision?.scenarioId;
  assert.ok(decisionId && scenarioId);
  assert.equal(executions(started), 1);
  for (const turn of turns.slice(5)) {
    assert.deepEqual(
      decisions(turn).map((item) => [item.decisionId, item.scenarioId]),
      [[decisionId, scenarioId]],
    );
    assert.equal(executions(turn), 1);
    assert.equal(turn.decisionCommitmentResult ?? null, null);
  }
  assertAligned(turns[6]!, "obj-capacity", "return after Execution");
  assert.notEqual(turns[6]!.nextExecutiveContext?.currentSubject?.subjectId, decisionId);
});

test("FIX16 K: a named return supersedes pending clarification without completing a soft commitment", () => {
  const soft = speak(
    ["Status.", "Delivery.", "Capacity. Details.", "Options.", "Maybe go with B.", "Back to delivery.", "Yes."],
    "k-soft",
  );
  assert.equal(soft[4]!.decisionCommitmentResult?.status, "confirmation-required");
  assertAligned(soft[5]!, "obj-delivery", "return during soft commitment");
  assert.equal(soft[6]!.decisionCommitmentResult?.status ?? null, null);
  assert.ok(soft.every((turn) => decisions(turn).length === 0));

  const clarifying = speak(
    ["Status.", "Capacity. Details.", "Delivery.", "Back to supplier.", "Back to capacity."],
    "k-clarify",
  );
  assert.equal(clarifying[3]!.status, "clarification-required");
  assert.equal(clarifying[4]!.status, "applied");
  assertAligned(clarifying[4]!, "obj-capacity", "return after pending clarification");
});
