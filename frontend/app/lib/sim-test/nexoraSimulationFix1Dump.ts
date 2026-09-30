import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_T50_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { clusterSimTest6Findings, uniqueSimTest6Findings } from "./nexoraSimulationLongSessionReport.ts";

const reports = [
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix1-focus" }),
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_MANUFACTURING_LONG, runId: "fix1-m" }),
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_PROJECT_LONG, runId: "fix1-p" }),
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_LOGISTICS_PARITY, runId: "fix1-l" }),
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_SERVICE_PARITY, runId: "fix1-s" }),
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix1-f" }),
  runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix1-n" }),
];
for (const report of reports) {
  const findings = uniqueSimTest6Findings([report]);
  const s1 = findings.filter((item) => item.severity === "S1");
  console.log(JSON.stringify({
    id: report.identity.journeyId,
    sig: report.deterministicSignature,
    turns: report.turns,
    s0: report.findingCounts.S0,
    s1: s1.length,
    clarTurns: report.journeyObservations.filter((item) => item.clarificationRequired).length,
    repeated: s1.filter((item) => item.classification.includes("REPEATED_CLARIFICATION")).map((item) => item.managerTurn),
    all: s1.map((item) => `${item.managerTurn}:${item.classification}`),
  }));
}
const mfg = reports[1];
for (const turn of [48, 49, 50, 64, 71, 77, 85, 89, 102]) {
  const row = mfg.journeyObservations.find((item) => item.turn === turn);
  if (!row) continue;
  console.log(JSON.stringify({
    turn,
    cl: row.clarificationRequired,
    sub: row.canonicalSubjectId,
    lab: row.focusedSubjectLabel,
    utt: row.utterance,
    findings: mfg.journeyFindings.filter((item) => item.managerTurn === turn).map((item) => item.classification),
  }));
}
console.log("clusters", clusterSimTest6Findings(uniqueSimTest6Findings(reports)).map((item) => `${item.signature}@${item.firstJourneyId}:T${item.firstTurn}`));
