import assert from "node:assert/strict";
import test from "node:test";

import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_5_JOURNEYS,
  SIM_TEST_5_MANUFACTURING_LIFECYCLE,
  SIM_TEST_5_PROJECT_LIFECYCLE,
} from "./nexoraSimulationLifecycleJourneys.ts";

function commitTurns(report: ReturnType<typeof runNexoraSimulationTestJourney>) {
  return report.journeyObservations.filter((item) =>
    /option B|recovery plan|make that the decision|that'?s the decision|Start it\.|Put the decision/i.test(item.utterance),
  );
}

test("SIM-TEST:5-FIX1 — manufacturing Option B commitment reaches CC:10", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "sim-test-5-fix1-manufacturing",
  });
  assert.equal(report.harnessStatus, "PASS");
  const optionB = report.journeyObservations.find((item) => item.utterance === "Let's go with option B.");
  assert.ok(optionB, "manufacturing Option B turn missing");
  assert.equal(optionB.clarificationRequired, false);
  assert.ok((optionB.decisionCount ?? 0) >= 1 || optionB.decisionStatus === "confirmation-required");
  const afterCommit = report.journeyObservations.find((item) =>
    item.turn > (optionB.turn) && (item.decisionCount ?? 0) === 1,
  );
  assert.ok(afterCommit || (optionB.decisionCount ?? 0) === 1, "canonical Decision never appeared after Option B");
  const later = report.journeyObservations.filter((item) => item.turn >= optionB.turn);
  assert.ok(later.every((item) => (item.decisionCount ?? 0) <= 1));
  for (const item of commitTurns(report)) {
    process.stdout.write(
      `M T${item.turn} n=${item.decisionCount} status=${item.decisionStatus} id=${item.decisionId} clar=${item.clarificationRequired} ${item.utterance} => ${item.response.slice(0, 80)}\n`,
    );
  }
  process.stdout.write(`manufacturing signature ${report.deterministicSignature} S1=${report.findingCounts.S1}\n`);
  for (const finding of report.journeyFindings) {
    process.stdout.write(`MF ${finding.classification} T${finding.managerTurn} ${finding.observedBehavior.slice(0, 140)}\n`);
  }
});

test("SIM-TEST:5-FIX1 — visible option B is the second seeded candidate, not do-nothing-as-B", async () => {
  const { speakRmsManagerThroughCc5 } = await import("../rms/rmsManagerCc5Adapter.ts");
  const utterances = [
    "Tell me more about the capacity issue.",
    "Show me the alternatives.",
    "Compare them.",
    "What about option A?",
    "Let's go with option B.",
  ];
  let previous: ReturnType<typeof speakRmsManagerThroughCc5> | null = null;
  for (const [index, utterance] of utterances.entries()) {
    previous = speakRmsManagerThroughCc5({
      utterance,
      previous,
      messageIdSeed: `opt-order-${index}`,
    });
    const session = previous.nextScenarioSession;
    const names = (session?.candidateScenarioIds ?? []).map((id) => session?.scenariosById[id]?.name ?? id);
    process.stdout.write(`order T${index} ${JSON.stringify(names)} active=${session?.scenariosById[session.activeScenarioId ?? ""]?.name ?? "none"} ${previous.decisionCommitmentResult?.decision?.title ?? previous.decisionCommitmentResult?.status ?? "none"}\n`);
  }
  const session = previous!.nextScenarioSession;
  const names = (session?.candidateScenarioIds ?? []).map((id) => session?.scenariosById[id]?.name ?? id);
  assert.ok(names.length >= 2, names.join("|"));
  const optionBName = names[1];
  assert.equal(previous!.decisionCommitmentResult?.status, "applied");
  assert.equal(previous!.decisionCommitmentResult?.decision?.title, optionBName);
});

test("SIM-TEST:5-FIX1 — project delivery-plan commitment reaches CC:10", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_PROJECT_LIFECYCLE,
    runId: "sim-test-5-fix1-project",
  });
  assert.equal(report.harnessStatus, "PASS");
  const approve = report.journeyObservations.find((item) =>
    item.utterance === "Approve the delivery recovery plan.",
  );
  assert.ok(approve, "project approval turn missing");
  const decided = report.journeyObservations.some((item) => (item.decisionCount ?? 0) === 1);
  assert.equal(approve.clarificationRequired, false);
  assert.ok(decided, "project Decision never reached CC:10");
  assert.ok(report.journeyObservations.every((item) => (item.decisionCount ?? 0) <= 1));
  for (const item of commitTurns(report)) {
    process.stdout.write(
      `P T${item.turn} n=${item.decisionCount} status=${item.decisionStatus} id=${item.decisionId} clar=${item.clarificationRequired} ${item.utterance} => ${item.response.slice(0, 80)}\n`,
    );
  }
  process.stdout.write(`project signature ${report.deterministicSignature} S1=${report.findingCounts.S1}\n`);
  for (const finding of report.journeyFindings) {
    process.stdout.write(`PF ${finding.classification} T${finding.managerTurn} ${finding.observedBehavior.slice(0, 140)}\n`);
  }
});

test("SIM-TEST:5-FIX1 — remaining S1 after commitment repair (observe-only dump)", () => {
  for (const [index, journey] of SIM_TEST_5_JOURNEYS.entries()) {
    const report = runNexoraSimulationTestJourney({ journey, runId: `sim-test-5-fix1-dump-${index}` });
    process.stdout.write(
      `${journey.journeyId} ${report.deterministicSignature} S0=${report.findingCounts.S0} S1=${report.findingCounts.S1} harness=${report.harnessStatus}\n`,
    );
    for (const finding of report.journeyFindings) {
      process.stdout.write(`  ${finding.classification} T${finding.managerTurn} ${finding.observedBehavior.slice(0, 140)}\n`);
    }
    assert.equal(report.harnessStatus, "PASS");
    assert.equal(report.findingCounts.S0, 0);
  }
});
