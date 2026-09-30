import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_SERVICE_T18_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

const focused = runNexoraSimulationTestJourney({
  journey: SIM_TEST_6_SERVICE_T18_FOCUSED,
  runId: "fix11-t18",
});
console.log("FOCUSED", JSON.stringify({
  sig: focused.deterministicSignature,
  s0: focused.findingCounts.S0,
  s1: focused.findingCounts.S1,
  findings: focused.journeyFindings.filter((item) => item.severity === "S1").map((item) => `${item.managerTurn}:${item.classification}`),
}));
for (const turn of [14, 15, 16, 17, 18]) {
  const row = focused.journeyObservations.find((item) => item.turn === turn);
  if (!row) continue;
  console.log("FOCUSED_TURN", JSON.stringify({
    turn: row.turn,
    utt: row.utterance,
    can: row.canonicalSubjectId,
    adv: row.advisorReferentId,
    clar: row.clarificationRequired,
    resp: row.response.slice(0, 160),
  }));
}

function summarize(label: string, journey: typeof SIM_TEST_6_SERVICE_PARITY) {
  const report = runNexoraSimulationTestJourney({ journey, runId: `fix11-${label}` });
  const s1 = report.journeyFindings.filter((item) => item.severity === "S1");
  console.log("JOURNEY", JSON.stringify({
    label,
    sig: report.deterministicSignature,
    s0: report.findingCounts.S0,
    s1: report.findingCounts.S1,
    findings: s1.map((item) => `${item.managerTurn}:${item.classification}`),
  }));
}

summarize("service", SIM_TEST_6_SERVICE_PARITY);
summarize("project", SIM_TEST_6_PROJECT_LONG);
summarize("logistics", SIM_TEST_6_LOGISTICS_PARITY);
summarize("manufacturing", SIM_TEST_6_MANUFACTURING_LONG);
summarize("fast", SIM_TEST_6_FAST_PARITY);
summarize("impatient", SIM_TEST_6_MANUFACTURING_IMPATIENT);
