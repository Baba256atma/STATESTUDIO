import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_JOURNEYS,
  SIM_TEST_6_LOGISTICS_PARITY,
  SIM_TEST_6_MANUFACTURING_IMPATIENT,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_T71_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

const focused = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix4-t71-repaired" });
console.log("FOCUSED", JSON.stringify({
  sig: focused.deterministicSignature,
  s0: focused.findingCounts.S0,
  s1: focused.findingCounts.S1,
  harness: focused.harnessStatus,
  findings: focused.journeyFindings.filter((item) => item.severity === "S1").map((item) => `${item.managerTurn}:${item.classification}`),
}));
for (const turn of [69, 70, 71, 77, 78, 83, 85, 88, 89, 92, 102]) {
  const row = focused.journeyObservations.find((item) => item.turn === turn);
  if (!row) continue;
  console.log("FOCUS_TURN", JSON.stringify({
    turn: row.turn,
    utt: row.utterance,
    intent: row.intent,
    clar: row.clarificationRequired,
    can: row.canonicalSubjectId,
    conv: row.conversationSubjectId,
    adv: row.advisorReferentId ?? row.advisorReferentName,
    stage: row.stageActiveSubjectId,
    findings: focused.journeyFindings.filter((item) => item.managerTurn === row.turn).map((item) => item.classification),
    resp: row.response.slice(0, 180),
  }));
}

function summarize(label: string, journey: typeof SIM_TEST_6_MANUFACTURING_LONG) {
  const report = runNexoraSimulationTestJourney({ journey, runId: `fix4-${label}` });
  const s1 = report.journeyFindings.filter((item) => item.severity === "S1");
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
    findings: s1.map((item) => `${item.managerTurn}:${item.classification}:${item.likelyOwner}`),
  }));
  for (const turn of [17, 18, 21, 24, 30, 50, 64, 69, 71, 77, 78, 83, 85, 86, 87, 88, 89, 92, 102]) {
    const row = report.journeyObservations.find((item) => item.turn === turn);
    if (!row) continue;
    const findings = s1.filter((item) => item.managerTurn === turn).map((item) => item.classification);
    if (findings.length === 0 && ![21, 24, 30, 50, 64, 69, 71, 77, 83, 85, 88, 92, 102].includes(turn)) continue;
    console.log("TURN", JSON.stringify({
      journey: label,
      turn: row.turn,
      utt: row.utterance,
      can: row.canonicalSubjectId,
      clar: row.clarificationRequired,
      adv: row.advisorReferentId,
      stage: row.stageActiveSubjectId,
      findings,
      resp: row.response.slice(0, 140),
    }));
  }
  return report;
}

summarize("manufacturing", SIM_TEST_6_MANUFACTURING_LONG);
summarize("project", SIM_TEST_6_PROJECT_LONG);
summarize("logistics", SIM_TEST_6_LOGISTICS_PARITY);
summarize("service", SIM_TEST_6_SERVICE_PARITY);
summarize("fast", SIM_TEST_6_FAST_PARITY);
summarize("impatient", SIM_TEST_6_MANUFACTURING_IMPATIENT);
summarize("fresh", SIM_TEST_6_FRESH_SESSION);
console.log("JOURNEY_COUNT", SIM_TEST_6_JOURNEYS.length);
