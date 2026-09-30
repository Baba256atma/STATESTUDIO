import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_MANUFACTURING_LONG,
  SIM_TEST_6_T50_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
  SIM_TEST_6_T69_FOCUSED,
  SIM_TEST_6_T71_FOCUSED,
  SIM_TEST_6_T77_FOCUSED,
  SIM_TEST_6_T83_FOCUSED,
  SIM_TEST_6_T85_FOCUSED,
  SIM_TEST_6_T88_FOCUSED,
  SIM_TEST_6_T89_FOCUSED,
  SIM_TEST_6_T92_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { SIM_TEST_5_MANUFACTURING_LIFECYCLE } from "./nexoraSimulationLifecycleJourneys.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function run(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({
      workspace: "overview", presentationState: "minimum", environmentIntent: "neutral",
    }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix10-${utterance}`,
  });
}

function can(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return turn.nextExecutiveContext.currentSubject?.subjectId ?? null;
}

test("FIX10 — production data is evidence, not Capacity", () => {
  const meaning = interpretCanonicalManagerMeaning({
    utterance: "What does the production data show?",
    subjects,
  });
  assert.equal(meaning.requestedOperation, "EVIDENCE");
  assert.notEqual(meaning.objectReference?.subjectId, "obj-capacity");
});

test("FIX10 — manufacturing T92 does not switch to Capacity", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T92_FOCUSED,
    runId: "sim-test-6-fix10-t92",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  const t91 = report.journeyObservations.find((item) => item.turn === 91)!;
  const t92 = report.journeyObservations.find((item) => item.turn === 92)!;
  assert.equal(t88.canonicalSubjectId, "obj-inventory");
  assert.equal(t89.canonicalSubjectId, "obj-inventory");
  assert.equal(t92.utterance, "What does the production data show?");
  assert.notEqual(t92.canonicalSubjectId, "obj-capacity");
  assert.equal(t92.canonicalSubjectId, t91.canonicalSubjectId);
  assert.equal(
    report.journeyFindings.some((item) => item.managerTurn === 92 && item.classification.includes("REFERENT")),
    false,
  );
  assert.doesNotMatch(t92.response, /definitely caused|confirmed cause/i);
  assert.equal(t92.decisionCount, 1);
  assert.equal(t92.executionCount, 1);
});

test("FIX10 — explicit domain data does not steal current subject", () => {
  const capacity = run("Show Capacity.");
  const inventoryData = run("What does the inventory data show?", capacity);
  assert.equal(can(inventoryData), "obj-capacity");
  const inventory = run("Switch to inventory.", capacity);
  const productionData = run("What does the production data show?", inventory);
  assert.equal(can(productionData), "obj-inventory");
  const generic = run("What does the data show?", inventory);
  assert.equal(can(generic), "obj-inventory");
});

test("FIX10 — delivery data, named CSV, and current-subject data keep kinds separate", () => {
  const inventory = run("Switch to inventory.", run("Show Capacity."));
  const deliveryData = run("What does the delivery data show?", inventory);
  assert.equal(can(deliveryData), "obj-inventory");
  const csvNamed = run("What does Production.csv show?", inventory);
  assert.notEqual(can(csvNamed), "obj-capacity");
  const aboutCapacity = run("What does production data show about capacity?", inventory);
  assert.notEqual(can(aboutCapacity), "obj-production");
});

test("FIX10 — data follow-up and deictic do not restore Capacity as subject", () => {
  const inventory = run("Switch to inventory.", run("Show Capacity."));
  const production = run("What does the production data show?", inventory);
  const changed = run("What changed?", production);
  const supports = run("What supports that?", changed);
  const explained = run("Explain this.", production);
  assert.equal(can(changed), "obj-inventory");
  assert.equal(can(supports), "obj-inventory");
  assert.notEqual(can(explained), "obj-capacity");
});

test("FIX10 — unknown supplier data does not fabricate a subject", () => {
  const start = run("Show Capacity.");
  const unknown = run("What does the supplier data show?", start);
  assert.equal(can(unknown), "obj-capacity");
  assert.doesNotMatch(unknown.response, /obj-supplier|Supplier Gap/i);
});

test("FIX10 — data query after ordinal clarification and after scenarios", () => {
  const switched = run("Switch to inventory.", run("Show Capacity."));
  const ordinal = run("The first one.", switched);
  const afterOrdinal = run("What does the production data show?", ordinal);
  assert.equal(can(afterOrdinal), can(ordinal));
  const scenarios = run("Show me the alternatives again.", switched);
  const afterScenario = run("What does the production data show?", scenarios);
  assert.notEqual(afterScenario.ncaConversationState?.dialogueMove, "FOLLOW_UP");
});

test("FIX10 — data query does not duplicate Decision or Execution", () => {
  const inventory = run("Switch to inventory.", run("Show Capacity."));
  const decided = run("What did we decide?", inventory);
  const data = run("What does the production data show?", decided);
  assert.ok(Object.keys(data.nextDecisionSession?.provenanceByDecisionId ?? {}).length <= 1);
  const execution = run("How is the execution going?", inventory);
  const dataAgain = run("What does the production data show?", execution);
  assert.ok(dataAgain.response.length > 0);
});

test("FIX10 — manufacturing long T92; FIX9 T89 preserved", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_LONG,
    runId: "sim-test-6-fix10-mfg",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  const t92 = report.journeyObservations.find((item) => item.turn === 92)!;
  assert.equal(t89.canonicalSubjectId, "obj-inventory");
  assert.notEqual(t92.canonicalSubjectId, "obj-capacity");
  assert.equal(
    report.journeyFindings.some((item) => item.managerTurn === 92),
    false,
  );
});

test("FIX10 — FIX9–FIX1, FAST, and SIM-TEST:5-FIX3 remain green", () => {
  const t89 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T89_FOCUSED, runId: "fix10-t89" });
  assert.equal(t89.journeyObservations.find((item) => item.turn === 89)?.canonicalSubjectId, "obj-inventory");
  const t88 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T88_FOCUSED, runId: "fix10-t88" });
  assert.equal(t88.journeyObservations.find((item) => item.turn === 88)?.canonicalSubjectId, "obj-inventory");
  const t85 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T85_FOCUSED, runId: "fix10-t85" });
  assert.equal(t85.journeyObservations.find((item) => item.turn === 85)?.stageActiveSubjectId, "obj-capacity");
  const t83 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T83_FOCUSED, runId: "fix10-t83" });
  assert.equal(t83.journeyObservations.find((item) => item.turn === 83)?.clarificationRequired, false);
  const t77 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T77_FOCUSED, runId: "fix10-t77" });
  assert.equal(t77.journeyFindings.some((item) => item.classification.includes("PREMATURE_DECISION")), false);
  const t71 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix10-t71" });
  assert.equal(t71.journeyObservations.find((item) => item.turn === 71)?.canonicalSubjectId, "obj-delivery");
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix10-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix10-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix10-t50" });
  assert.equal(t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50), false);
  const lifecycle = runNexoraSimulationTestJourney({ journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE, runId: "fix10-sim5" });
  assert.equal(lifecycle.findingCounts.S0, 0);
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix10-fast" });
  assert.equal(fast.findingCounts.S1, 0);
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix10-fresh" });
  assert.equal(fresh.findingCounts.S0, 0);
});
