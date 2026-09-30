import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_T85_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

const focused = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T85_FOCUSED, runId: "fix7-t85-repaired" });
console.log("FOCUSED", JSON.stringify({
  sig: focused.deterministicSignature,
  s0: focused.findingCounts.S0,
  s1: focused.findingCounts.S1,
  harness: focused.harnessStatus,
  findings: focused.journeyFindings.filter((item) => item.severity === "S1").map((item) => `${item.managerTurn}:${item.classification}`),
}));

function summarize(label: string, journey: typeof SIM_TEST_6_MANUFACTURING_LONG) {
  const report = runNexoraSimulationTestJourney({ journey, runId: `fix7-${label}` });
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
  let prevStage: string | null = null;
  for (const row of report.journeyObservations) {
    const stageChanged = row.stageActiveSubjectId !== prevStage;
    if (stageChanged && row.stageActiveSubjectId) {
      console.log("STAGE_TX", JSON.stringify({
        journey: label,
        turn: row.turn,
        utt: row.utterance.slice(0, 70),
        can: row.canonicalSubjectId,
        stage: row.stageActiveSubjectId,
        prevStage,
        m1: row.mlevelL1,
      }));
    }
    prevStage = row.stageActiveSubjectId;
  }
  for (const turn of [18, 21, 24, 30, 35, 50, 64, 69, 71, 77, 78, 83, 85, 86, 87, 88, 89, 92, 102]) {
    const row = report.journeyObservations.find((item) => item.turn === turn);
    if (!row) continue;
    console.log("TURN", JSON.stringify({
      journey: label,
      turn: row.turn,
      utt: row.utterance,
      can: row.canonicalSubjectId,
      stage: row.stageActiveSubjectId,
      selected: row.stageSelectedObjectId,
      m1: row.mlevelL1,
      clar: row.clarificationRequired,
      findings: s1.filter((item) => item.managerTurn === turn).map((item) => item.classification),
      resp: row.response.slice(0, 110),
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
