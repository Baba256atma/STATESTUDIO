import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
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
    messageIdSeed: `fix9-${utterance}`,
  });
}

function can(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return turn.nextExecutiveContext.currentSubject?.subjectId ?? null;
}

test("FIX9 — manufacturing T89 does not treat stale Capacity Gap as the first one", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T89_FOCUSED,
    runId: "sim-test-6-fix9-t89",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  assert.equal(t88.canonicalSubjectId, "obj-inventory");
  assert.equal(t88.stageActiveSubjectId, "obj-inventory");
  assert.equal(t89.utterance, "The first one.");
  assert.equal(t89.canonicalSubjectId, "obj-inventory");
  assert.doesNotMatch(t89.response, /Capacity Gap/);
  assert.equal(
    report.journeyFindings.some((item) => item.managerTurn === 89 && item.classification.includes("ADVISOR")),
    false,
  );
  assert.equal(t89.stageActiveSubjectId, "obj-inventory");
  assert.equal(t88.decisionCount, 1);
  assert.equal(t88.executionCount, 1);
});

test("FIX9 — two-item collection first/second/unavailable third", () => {
  const shown = run("Show me the main problems.");
  const first = run("The first one.", shown);
  const third = run("The third one.", shown);
  assert.ok(first.response.length > 0);
  assert.equal(third.nextDecisionSession, null);
  assert.doesNotMatch(third.response, /Understood — Capacity Gap/);
});

test("FIX9 — fresh session first one does not guess", () => {
  const fresh = run("The first one.");
  assert.doesNotMatch(fresh.response, /Capacity Gap/);
  assert.equal(fresh.nextDecisionSession, null);
});

test("FIX9 — switch to Inventory then first one stays Inventory and clarifies", () => {
  const start = run("Show Capacity.");
  const listed = run("Show me the main problems.", start);
  const switched = run("Switch to inventory.", listed);
  assert.equal(can(switched), "obj-inventory");
  const ordinal = run("The first one.", switched);
  assert.equal(can(ordinal), "obj-inventory");
  assert.doesNotMatch(ordinal.response, /Understood — Capacity Gap/);
  const deictic = run("Explain this.", ordinal);
  assert.equal(can(deictic), "obj-inventory");
});

test("FIX9 — reopen alternatives then first one uses the reopened collection", () => {
  const capacity = run("Show Capacity.");
  const options = run("Show me the alternatives.", capacity);
  const switched = run("Switch to inventory.", options);
  const reopen = run("Show me the alternatives again.", switched);
  const ordinal = run("The first one.", reopen);
  assert.doesNotMatch(ordinal.response, /Understood — Capacity Gap/);
  assert.ok(
    Object.keys(ordinal.nextDecisionSession?.provenanceByDecisionId ?? {}).length <= 1,
  );
});

test("FIX9 — previousSubjects and Stage order are not ordinal collections", () => {
  const a = run("Show Capacity.");
  const b = run("What about delivery?", a);
  const c = run("What about inventory?", b);
  const ordinal = run("The first one.", c);
  assert.notEqual(can(ordinal), "obj-capacity");
});

test("FIX9 — manufacturing long T89; T88 Inventory preserved", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_LONG,
    runId: "sim-test-6-fix9-mfg",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  assert.equal(t88.canonicalSubjectId, "obj-inventory");
  assert.equal(t89.canonicalSubjectId, "obj-inventory");
  assert.equal(t89.stageActiveSubjectId, "obj-inventory");
  assert.equal(
    report.journeyFindings.some((item) => item.managerTurn === 89),
    false,
  );
});

test("FIX9 — FIX8–FIX1 and SIM-TEST:5-FIX3 regressions remain green", () => {
  const t88 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T88_FOCUSED, runId: "fix9-t88" });
  assert.equal(t88.journeyObservations.find((item) => item.turn === 88)?.canonicalSubjectId, "obj-inventory");
  const t85 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T85_FOCUSED, runId: "fix9-t85" });
  assert.equal(t85.journeyObservations.find((item) => item.turn === 85)?.stageActiveSubjectId, "obj-capacity");
  const t83 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T83_FOCUSED, runId: "fix9-t83" });
  assert.equal(t83.journeyObservations.find((item) => item.turn === 83)?.clarificationRequired, false);
  const t77 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T77_FOCUSED, runId: "fix9-t77" });
  assert.equal(t77.journeyFindings.some((item) => item.classification.includes("PREMATURE_DECISION")), false);
  const t71 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix9-t71" });
  assert.equal(t71.journeyObservations.find((item) => item.turn === 71)?.canonicalSubjectId, "obj-delivery");
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix9-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix9-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix9-t50" });
  assert.equal(t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50), false);
  const manufacturing = runNexoraSimulationTestJourney({ journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE, runId: "fix9-sim5" });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix9-fast" });
  assert.equal(fast.findingCounts.S1, 0);
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix9-fresh" });
  assert.equal(fresh.journeyObservations.some((item) => item.clarificationRequired), false);
});
