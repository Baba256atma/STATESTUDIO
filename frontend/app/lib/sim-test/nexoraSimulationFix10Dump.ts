import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_T92_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

const focused = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T92_FOCUSED, runId: "fix10-t92" });
console.log("FOCUSED", JSON.stringify({
  sig: focused.deterministicSignature,
  s0: focused.findingCounts.S0,
  s1: focused.findingCounts.S1,
  harness: focused.harnessStatus,
  findings: focused.journeyFindings.filter((item) => item.severity === "S1").map((item) => `${item.managerTurn}:${item.classification}`),
  lastDecision: focused.journeyObservations.at(-1)?.decisionId,
  lastExecution: focused.journeyObservations.at(-1)?.executionId,
}));
for (const turn of [88, 89, 90, 91, 92, 93]) {
  const row = focused.journeyObservations.find((item) => item.turn === turn);
  if (!row) continue;
  console.log("FOCUSED_TURN", JSON.stringify({
    turn: row.turn,
    utt: row.utterance,
    can: row.canonicalSubjectId,
    conv: row.conversationSubjectId,
    adv: row.advisorReferentId,
    stage: row.stageActiveSubjectId,
    clar: row.clarificationRequired,
    csv: row.csvVersions,
    dataPubs: row.dataPublicationIds,
    decisionCount: row.decisionCount,
    executionCount: row.executionCount,
    resp: row.response.slice(0, 220),
  }));
}

function summarize(label: string, journey: typeof SIM_TEST_6_MANUFACTURING_LONG) {
  const report = runNexoraSimulationTestJourney({ journey, runId: `fix10-${label}` });
  const s1 = report.journeyFindings.filter((item) => item.severity === "S1");
  console.log("JOURNEY", JSON.stringify({
    label,
    sig: report.deterministicSignature,
    s0: report.findingCounts.S0,
    s1: report.findingCounts.S1,
    harness: report.harnessStatus,
    decision: report.journeyObservations.at(-1)?.decisionId,
    decisionCount: report.journeyObservations.at(-1)?.decisionCount,
    execution: report.journeyObservations.at(-1)?.executionId,
    executionCount: report.journeyObservations.at(-1)?.executionCount,
    findings: s1.map((item) => `${item.managerTurn}:${item.classification}`),
  }));
  for (const turn of [18, 21, 35, 85, 88, 89, 90, 91, 92, 102]) {
    const row = report.journeyObservations.find((item) => item.turn === turn);
    if (!row) continue;
    console.log("TURN", JSON.stringify({
      journey: label,
      turn: row.turn,
      utt: row.utterance,
      can: row.canonicalSubjectId,
      adv: row.advisorReferentId ?? row.advisorReferentName,
      stage: row.stageActiveSubjectId,
      clar: row.clarificationRequired,
      csv: row.csvVersions,
      findings: s1.filter((item) => item.managerTurn === turn).map((item) => item.classification),
      resp: row.response.slice(0, 180),
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
