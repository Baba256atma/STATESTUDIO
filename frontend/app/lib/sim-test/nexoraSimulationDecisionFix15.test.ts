import assert from "node:assert/strict";
import test from "node:test";

import { resolveNexoraConversationalIntentOnly } from "../conversational-control/conversationalIntentResolver.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import { SIM_TEST_6_MANUFACTURING_IMPATIENT } from "./nexoraSimulationLongSessionJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

type Decisions = ReturnType<NonNullable<RmsCc5Turn["decisionRuntime"]>["listDecisions"]>;

// The Decision runtime is shared across turns, so each turn's Decisions are captured when it completes.
const decisionsAtTurn = new WeakMap<RmsCc5Turn, Decisions>();

function speak(utterances: readonly string[], seed: string): RmsCc5Turn[] {
  const turns: RmsCc5Turn[] = [];
  let previous: RmsCc5Turn | null = null;
  for (const [index, utterance] of utterances.entries()) {
    previous = speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `fix15-${seed}-${index}` });
    decisionsAtTurn.set(previous, [...(previous.decisionRuntime?.listDecisions() ?? [])]);
    turns.push(previous);
  }
  return turns;
}

function decisions(turn: RmsCc5Turn): Decisions {
  return decisionsAtTurn.get(turn) ?? [];
}

function presentedCollection(turn: RmsCc5Turn): readonly string[] {
  return turn.nextScenarioSession?.candidateScenarioIds ?? [];
}

test("FIX15 CC:1: terse option and commitment language uses the existing intent families", () => {
  for (const utterance of ["Options.", "Alternatives.", "The options."]) {
    const intent = resolveNexoraConversationalIntentOnly({ utterance });
    assert.equal(intent.kind, "compare-scenarios", utterance);
    assert.equal(intent.requiresContext, true, utterance);
  }
  for (const utterance of ["Go with B.", "Go with option B."]) {
    const intent = resolveNexoraConversationalIntentOnly({ utterance });
    assert.equal(intent.kind, "commit-decision", utterance);
    assert.equal(intent.decisionCommitmentPayload?.strength, "explicit", utterance);
  }
  const recommendation = resolveNexoraConversationalIntentOnly({ utterance: "Go with your recommendation." });
  assert.equal(recommendation.targetHints[0]?.raw, "your recommendation");
  const soft = resolveNexoraConversationalIntentOnly({ utterance: "Maybe go with B." });
  assert.equal(soft.decisionCommitmentPayload?.strength, "soft");
});

test("FIX15 A: the Impatient T6-T9 sequence commits exactly one Decision through CC:10", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_IMPATIENT,
    runId: "fix15-a",
  });
  const byUtterance = (utterance: string) =>
    report.journeyObservations.find((row) => row.utterance === utterance)!;
  const why = byUtterance("Why?");
  const options = byUtterance("Options.");
  const goWithB = byUtterance("Go with B.");
  const confirm = byUtterance("Yes. Decide.");
  assert.deepEqual(
    [why.decisionCount, options.decisionCount, goWithB.decisionCount, confirm.decisionCount],
    [0, 0, 1, 1],
  );
  assert.equal(goWithB.clarificationRequired, false);
  assert.equal(confirm.decisionId, goWithB.decisionId);
  assert.ok(
    !report.journeyFindings.some((finding) => finding.classification.endsWith("MISSING_DECISION")),
    report.journeyFindings.map((finding) => `${finding.managerTurn}:${finding.classification}`).join(" "),
  );
  assert.ok(report.journeyObservations.every((row) => (row.decisionCount ?? 0) <= 1));
});

test("FIX15 B/K: Options. establishes the subject's candidate collection without selecting or committing", () => {
  const [, focus, options, compare] = speak(["Status.", "Capacity. Details.", "Options.", "Compare."], "b");
  assert.equal(focus!.nextExecutiveContext?.currentSubject?.subjectId, "obj-capacity");
  assert.equal(options!.intentResult.intent.kind, "compare-scenarios");
  const collection = presentedCollection(options!);
  assert.equal(collection.length, 2);
  for (const id of collection) {
    assert.ok(
      options!.nextScenarioSession?.scenariosById[id]?.subjectIds.includes("obj-capacity"),
      `${id} is not a Capacity candidate`,
    );
  }
  for (const turn of [options!, compare!]) {
    assert.equal(turn.decisionCommitmentResult ?? null, null);
    assert.equal(turn.nextDecisionSession?.pendingConfirmation ?? null, null);
    assert.equal(decisions(turn).length, 0);
  }
});

test("FIX15 C/F: a valid B resolves to the canonical candidate the presented collection holds at that position", () => {
  const [, , options, goWithB] = speak(["Status.", "Capacity. Details.", "Options.", "Go with B."], "c");
  const expectedScenarioId = presentedCollection(options!)[1]!;
  const result = goWithB!.decisionCommitmentResult!;
  assert.equal(goWithB!.intentResult.intent.kind, "commit-decision");
  assert.equal(result.status, "applied");
  assert.equal(result.candidate?.scenarioId, expectedScenarioId);
  assert.equal(result.decision?.scenarioId, expectedScenarioId);
  assert.equal(
    result.decision?.title,
    options!.nextScenarioSession?.scenariosById[expectedScenarioId]?.name,
  );
  const approved = decisions(goWithB!);
  assert.equal(approved.length, 1);
  assert.equal(approved[0]?.decisionId, result.decision?.decisionId);
  assert.equal(goWithB!.nextExecutiveContext?.currentSubject?.subjectId, result.decision?.decisionId);
});

test("FIX15 D: Go with option B. and Choose B. reach the same canonical candidate", () => {
  const reference = speak(["Status.", "Capacity. Details.", "Options.", "Go with B."], "d-ref").at(-1)!;
  for (const utterance of ["Go with option B.", "Choose B.", "Let's go with option B."]) {
    const turn = speak(["Status.", "Capacity. Details.", "Options.", utterance], `d-${utterance}`).at(-1)!;
    assert.equal(turn.decisionCommitmentResult?.status, "applied", utterance);
    assert.equal(
      turn.decisionCommitmentResult?.decision?.scenarioId,
      reference.decisionCommitmentResult?.decision?.scenarioId,
      utterance,
    );
    assert.equal(decisions(turn).length, 1, utterance);
  }
});

test("FIX15 E: confirmation completes an existing pending candidate commitment", () => {
  for (const confirmation of ["Yes.", "Yes, make that the decision."]) {
    const [, , options, soft, confirmed] = speak(
      ["Status.", "Capacity. Details.", "Options.", "Maybe go with B.", confirmation],
      `e-${confirmation}`,
    );
    const expectedScenarioId = presentedCollection(options!)[1]!;
    assert.equal(soft!.decisionCommitmentResult?.status, "confirmation-required", confirmation);
    assert.equal(decisions(soft!).length, 0, confirmation);
    assert.equal(confirmed!.decisionCommitmentResult?.status, "applied", confirmation);
    assert.equal(confirmed!.decisionCommitmentResult?.decision?.scenarioId, expectedScenarioId, confirmation);
    assert.equal(decisions(confirmed!).length, 1, confirmation);
  }
});

test("FIX15 G: B without an established option collection clarifies and creates no Decision", () => {
  for (const utterances of [
    ["Go with B."],
    ["Status.", "Capacity. Details.", "Go with B.", "Yes."],
    ["Options.", "Go with B."],
    ["Show me the alternatives.", "Let's go with option B."],
  ]) {
    const turns = speak(utterances, `g-${utterances.join("|")}`);
    const goWithB = turns.find((turn) => turn.intentResult.intent.kind === "commit-decision")!;
    assert.equal(goWithB.decisionCommitmentResult?.status, "clarification-required", utterances.join(" "));
    assert.ok(turns.every((turn) => decisions(turn).length === 0), utterances.join(" "));
  }
  const coldOptions = speak(["Options."], "g-cold-options")[0]!;
  assert.equal(presentedCollection(coldOptions).length, 0);
});

test("FIX15 H: a reference the collection cannot map clarifies, and Yes. does not turn it into a Decision", () => {
  const turns = speak(["Status.", "Capacity. Details.", "Options.", "Go with C.", "Yes."], "h");
  assert.equal(presentedCollection(turns[2]!).length, 2);
  assert.equal(turns[3]!.decisionCommitmentResult?.status, "clarification-required");
  assert.equal(turns[4]!.decisionCommitmentResult?.status ?? null, null);
  assert.ok(turns.every((turn) => decisions(turn).length === 0));
});

test("FIX15 I: B does not select a stale candidate after the conversation moves to another subject", () => {
  for (const utterances of [
    ["Status.", "Capacity. Details.", "Options.", "Delivery. Details.", "Go with B."],
    ["Status.", "Capacity. Details.", "Show me the alternatives.", "Delivery. Details.", "Let's go with option B."],
  ]) {
    const turns = speak(utterances, `i-${utterances.join("|")}`);
    const last = turns.at(-1)!;
    assert.equal(last.decisionCommitmentResult?.status, "clarification-required", utterances.join(" "));
    assert.ok(turns.every((turn) => decisions(turn).length === 0), utterances.join(" "));
  }
  const withDeliverySet = speak(
    ["Status.", "Capacity. Details.", "Options.", "Delivery. Details.", "Options.", "Go with B."],
    "i-delivery-set",
  );
  const last = withDeliverySet.at(-1)!;
  assert.notEqual(last.decisionCommitmentResult?.status, "clarification-required");
  assert.equal(
    decisions(last).some((item) => /capacity/i.test(item.title)),
    false,
  );
});

test("FIX15 J: Yes. Decide. without a candidate commitment creates no Decision", () => {
  for (const utterances of [["Yes. Decide."], ["Status.", "Capacity. Details.", "Yes. Decide."]]) {
    const turns = speak(utterances, `j-${utterances.join("|")}`);
    assert.ok(turns.every((turn) => decisions(turn).length === 0), utterances.join(" "));
    assert.ok(turns.every((turn) => turn.decisionCommitmentResult?.status !== "applied"), utterances.join(" "));
  }
});

test("FIX15 L: repeated commitment and confirmation never duplicate the Decision", () => {
  const turns = speak(
    ["Status.", "Capacity. Details.", "Options.", "Go with B.", "Yes, make that the decision.", "Go with B.", "Yes. Decide."],
    "l",
  );
  const [committed, confirmed, repeated] = [turns[3]!, turns[4]!, turns[5]!];
  assert.equal(committed.decisionCommitmentResult?.status, "applied");
  assert.equal(confirmed.decisionCommitmentResult?.status, "already-committed");
  assert.equal(repeated.decisionCommitmentResult?.status, "already-committed");
  assert.ok(turns.slice(3).every((turn) => decisions(turn).length === 1));
  assert.equal(
    decisions(turns.at(-1)!)[0]?.decisionId,
    committed.decisionCommitmentResult?.decision?.decisionId,
  );
});
