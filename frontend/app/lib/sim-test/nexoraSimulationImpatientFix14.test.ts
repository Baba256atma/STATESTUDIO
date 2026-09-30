import assert from "node:assert/strict";
import test from "node:test";

import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_PROJECT_T18_FOCUSED,
  SIM_TEST_6_PROJECT_T35_FOCUSED,
  SIM_TEST_6_SERVICE_T18_FOCUSED,
  SIM_TEST_6_T92_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

test("FIX14 — terse named detail request is a generic explicit focus", () => {
  for (const [utterance, expectedHint] of [
    ["Capacity. Details.", "capacity"],
    ["Delivery details.", "delivery"],
    ["Customer impact details.", "customer impact"],
  ] as const) {
    const intent = resolveNexoraConversationalIntent({ utterance }).intent;
    assert.equal(intent.kind, "focus");
    assert.equal(intent.requiresContext, false);
    assert.equal(intent.requiresTarget, true);
    assert.equal(intent.targetHints[0]?.raw, expectedHint);
  }
});

test("FIX14 — detail without a named subject does not invent one", () => {
  const intent = resolveNexoraConversationalIntent({ utterance: "Details." }).intent;
  assert.equal(intent.targetHints.length, 0);
});

test("FIX14 — Impatient T3 selects Capacity and all later S1s remain measured", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_IMPATIENT,
    runId: "sim-test-6-fix14-impatient",
  });
  const t3 = report.journeyObservations.find((item) => item.turn === 3)!;
  assert.equal(t3.utterance, "Capacity. Details.");
  assert.equal(t3.canonicalSubjectId, "obj-capacity");
  assert.equal(t3.conversationSubjectId, "obj-capacity");
  assert.equal(t3.advisorReferentId, "obj-capacity");
  assert.equal(t3.clarificationRequired, false);
  assert.equal(
    report.journeyFindings.some(
      (item) => item.managerTurn === 3 && item.classification.includes("SUBJECT_LOSS"),
    ),
    false,
  );
  assert.deepEqual(
    report.journeyFindings
      .filter((item) => item.severity === "S1")
      .map((item) => `${item.managerTurn}:${item.classification}`),
    // FIX15 resolved T8, FIX16 resolved T16, and FIX17 resolved T30/T31; any new S1 must fail here.
    [],
  );
});

test("FIX14 — FIX10 through FIX13 focused guards remain green", () => {
  const t92 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T92_FOCUSED, runId: "fix14-fix10" });
  assert.equal(
    t92.journeyFindings.some((item) => item.managerTurn === 92 && item.classification.includes("REFERENT")),
    false,
  );

  const service = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_SERVICE_T18_FOCUSED,
    runId: "fix14-fix11",
  });
  assert.equal(service.journeyObservations.find((item) => item.turn === 16)?.canonicalSubjectId, "obj-capacity");

  const projectT18 = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_T18_FOCUSED,
    runId: "fix14-fix12",
  });
  const issue = projectT18.journeyObservations.find((item) => item.turn === 18)!;
  assert.equal(issue.canonicalSubjectId, "obj-customer");
  assert.equal(issue.advisorReferentId, "obj-customer");

  const projectT35 = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_T35_FOCUSED,
    runId: "fix14-fix13",
  });
  const changed = projectT35.journeyObservations.find((item) => item.turn === 35)!;
  assert.equal(changed.canonicalSubjectId, "obj-delivery");
  assert.equal(changed.clarificationRequired, false);
});
