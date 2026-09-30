import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_PROJECT_T35_FOCUSED,
  SIM_TEST_6_SERVICE_PARITY,
} from "./nexoraSimulationLongSessionJourneys.ts";

const focused = runNexoraSimulationTestJourney({
  journey: SIM_TEST_6_PROJECT_T35_FOCUSED,
  runId: "fix13-t35",
});
console.log("FOCUSED", JSON.stringify({
  sig: focused.deterministicSignature,
  s0: focused.findingCounts.S0,
  s1: focused.findingCounts.S1,
  findings: focused.journeyFindings.filter((item) => item.severity === "S1").map((item) => `${item.managerTurn}:${item.classification}`),
}));
for (const turn of [33, 34, 35]) {
  const row = focused.journeyObservations.find((item) => item.turn === turn);
  if (!row) continue;
  console.log("FOCUSED_TURN", JSON.stringify({
    turn: row.turn,
    utt: row.utterance,
    can: row.canonicalSubjectId,
    adv: row.advisorReferentId,
    clar: row.clarificationRequired,
    resp: row.response.slice(0, 180),
  }));
}

function summarize(label: string, journey: typeof SIM_TEST_6_PROJECT_LONG) {
  const report = runNexoraSimulationTestJourney({ journey, runId: `fix13-${label}` });
  const s1 = report.journeyFindings.filter((item) => item.severity === "S1");
  console.log("JOURNEY", JSON.stringify({
    label,
    sig: report.deterministicSignature,
    s0: report.findingCounts.S0,
    s1: report.findingCounts.S1,
    findings: s1.map((item) => `${item.managerTurn}:${item.classification}`),
  }));
}

summarize("project", SIM_TEST_6_PROJECT_LONG);
summarize("service", SIM_TEST_6_SERVICE_PARITY);
summarize("logistics", SIM_TEST_6_LOGISTICS_PARITY);
summarize("manufacturing", SIM_TEST_6_MANUFACTURING_LONG);
summarize("fast", SIM_TEST_6_FAST_PARITY);
summarize("impatient", SIM_TEST_6_MANUFACTURING_IMPATIENT);
