import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_T77_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

const focused = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T77_FOCUSED, runId: "fix5-t77-repaired" });
console.log("FOCUSED", JSON.stringify({
  sig: focused.deterministicSignature,
  s0: focused.findingCounts.S0,
  s1: focused.findingCounts.S1,
  harness: focused.harnessStatus,
  findings: focused.journeyFindings.filter((item) => item.severity === "S1").map((item) => `${item.managerTurn}:${item.classification}`),
}));

function summarize(label: string, journey: typeof SIM_TEST_6_MANUFACTURING_LONG) {
  const report = runNexoraSimulationTestJourney({ journey, runId: `fix5-${label}` });
  const s1 = report.journeyFindings.filter((item) => item.severity === "S1");
  const decisionChanges = report.journeyObservations.filter((item, index, all) => (item.decisionCount ?? 0) !== (all[index - 1]?.decisionCount ?? 0));
  const executionChanges = report.journeyObservations.filter((item, index, all) => (item.executionCount ?? 0) !== (all[index - 1]?.executionCount ?? 0));
  console.log("JOURNEY", JSON.stringify({
    label,
    id: journey.journeyId,
    sig: report.deterministicSignature,
    s0: report.findingCounts.S0,
    s1: report.findingCounts.S1,
    harness: report.harnessStatus,
    decision: report.journeyObservations.at(-1)?.decisionId,
    decisionCount: report.journeyObservations.at(-1)?.decisionCount,
    execution: report.journeyObservations.at(-1)?.executionId,
    executionCount: report.journeyObservations.at(-1)?.executionCount,
    decisionChanges: decisionChanges.map((item) => `${item.turn}:${item.decisionCount}:${item.decisionId}`),
    executionChanges: executionChanges.map((item) => `${item.turn}:${item.executionCount}:${item.executionId}`),
    findings: s1.map((item) => `${item.managerTurn}:${item.classification}:${item.likelyOwner}`),
  }));
  for (const turn of [17, 18, 21, 24, 30, 40, 41, 50, 64, 69, 71, 77, 78, 83, 85, 88, 89, 92, 102]) {
    const row = report.journeyObservations.find((item) => item.turn === turn);
    if (!row) continue;
    const findings = s1.filter((item) => item.managerTurn === turn).map((item) => item.classification);
    console.log("TURN", JSON.stringify({
      journey: label,
      turn: row.turn,
      utt: row.utterance,
      can: row.canonicalSubjectId,
      clar: row.clarificationRequired,
      d: row.decisionCount,
      e: row.executionCount,
      findings,
      resp: row.response.slice(0, 120),
    }));
  }
}

summarize("manufacturing", SIM_TEST_6_MANUFACTURING_LONG);
summarize("project", SIM_TEST_6_PROJECT_LONG);
summarize("logistics", SIM_TEST_6_LOGISTICS_PARITY);
summarize("service", SIM_TEST_6_SERVICE_PARITY);
summarize("fast", SIM_TEST_6_FAST_PARITY);
summarize("impatient", SIM_TEST_6_MANUFACTURING_IMPATIENT);
summarize("fresh", SIM_TEST_6_FRESH_SESSION);
