import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { activateManagerObjectFromClick, createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { resolveContextualManagerMeaning } from "../manager-object/conversationContinuityResolver.ts";
import { createEmptyConversationContinuity } from "../manager-object/conversationContinuitySnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
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
} from "./nexoraSimulationLongSessionJourneys.ts";
import { SIM_TEST_5_MANUFACTURING_LIFECYCLE } from "./nexoraSimulationLifecycleJourneys.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const DECISION_ID = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";

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
    messageIdSeed: `fix8-${utterance}`,
  });
}

function can(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return turn.nextExecutiveContext.currentSubject?.subjectId ?? null;
}

test("SIM-TEST:6-FIX8 — T88 focused Switch to inventory commits canonical Inventory", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T88_FOCUSED,
    runId: "sim-test-6-fix8-t88",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t85 = report.journeyObservations.find((item) => item.turn === 85)!;
  const t87 = report.journeyObservations.find((item) => item.turn === 87)!;
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  assert.equal(t85.canonicalSubjectId, "obj-capacity");
  assert.equal(t85.stageActiveSubjectId, "obj-capacity");
  assert.equal(t87.canonicalSubjectId, "obj-capacity");
  assert.equal(t87.stageActiveSubjectId, "obj-capacity");
  assert.equal(t88.utterance, "Switch to inventory.");
  assert.equal(t88.canonicalSubjectId, "obj-inventory");
  assert.equal(t88.stageActiveSubjectId, "obj-inventory");
  assert.equal(
    report.journeyFindings.some((item) => item.managerTurn === 88 && item.classification.includes("REFERENT")),
    false,
  );
  assert.equal(t89.stageActiveSubjectId, "obj-inventory");
  assert.equal(t88.decisionCount, 1);
  assert.equal(t88.executionCount, 1);
  assert.equal(t88.decisionId, DECISION_ID);
});

test("FIX8 — CC:1 and 6.1/6.2 select Inventory independently of Stage", () => {
  const intent = resolveNexoraConversationalIntent({ utterance: "Switch to inventory." }).intent;
  assert.equal(intent.kind, "focus");
  assert.equal(intent.targetHints[0]?.raw, "inventory");
  const meaning = interpretCanonicalManagerMeaning({ utterance: "Switch to inventory.", subjects });
  assert.equal(meaning.objectReference?.subjectId, "obj-inventory");
  assert.equal(meaning.requestedOperation, "FOCUS");
  const contextual = resolveContextualManagerMeaning({
    turnMeaning: meaning,
    subjects,
    previousContinuity: { ...createEmptyConversationContinuity(), activeSubjectId: "obj-capacity" },
  });
  assert.equal(contextual.objectReference?.subjectId, "obj-inventory");
  assert.equal(contextual.provenance, "EXPLICIT_CURRENT_TURN");
  const inventory = contextual.candidates.find((item) => item.subjectId === "obj-inventory");
  const capacity = contextual.candidates.find((item) => item.subjectId === "obj-capacity");
  assert.equal(inventory?.provenance, "NLU_CURRENT_TURN");
  assert.equal(capacity?.provenance, "CONTEXT_ACTIVE_SUBJECT");
});

test("FIX8 — Capacity → Inventory → Delivery → Capacity; repeated switch is idempotent", () => {
  const capacity = run("Show Capacity.");
  const inventory = run("Switch to inventory.", capacity);
  assert.equal(can(inventory), "obj-inventory");
  assert.equal(inventory.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  const delivery = run("Switch to Delivery.", inventory);
  assert.equal(can(delivery), "obj-delivery");
  const back = run("Switch to Capacity.", delivery);
  assert.equal(can(back), "obj-capacity");
  const again = run("Switch to Capacity.", back);
  assert.equal(can(again), "obj-capacity");
  const historical = run("Switch to inventory.", again);
  assert.equal(can(historical), "obj-inventory");
  const nonHistorical = run("Show Capacity.");
  const freshInventory = run("Switch to inventory.", nonHistorical);
  assert.equal(can(freshInventory), "obj-inventory");
});

test("FIX8 — unknown Supplier switch clarifies; incomplete switch does not guess", () => {
  const inventory = run("Switch to inventory.", run("Show Capacity."));
  const unknown = run("Switch to Supplier.", inventory);
  assert.doesNotMatch(unknown.response, /Supplier Delay has been added/i);
  assert.notEqual(can(unknown), "obj-supplier");
  const incomplete = run("Switch to.", inventory);
  assert.notEqual(can(incomplete), "obj-capacity");
  const bare = run("Switch.", inventory);
  assert.equal(can(bare), "obj-inventory");
});

test("FIX8 — pending TYPE/REFERENCE ambiguity is superseded by known switch", () => {
  const pending = run("What about Capacity Theatre?", run("Show Delivery."));
  const switched = run("Switch to inventory.", pending);
  assert.equal(can(switched), "obj-inventory");
  assert.equal(switched.managerObjectTurn.session.pendingClarification, null);
  const look = run("Look at that.", run("Show Capacity."));
  const afterLook = run("Switch to inventory.", look);
  assert.equal(can(afterLook), "obj-inventory");
  assert.equal(afterLook.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  const afterAnswer = run("Delivery.", run("What about Capacity Theatre?", run("Show Capacity.")));
  const afterResolved = run("Switch to inventory.", afterAnswer);
  assert.equal(can(afterResolved), "obj-inventory");
});

test("FIX8 — deictic, knowledge, and locative follow-ups stay on Inventory", () => {
  const inventory = run("Switch to inventory.", run("Show Capacity."));
  const deictic = run("What is happening with this?", inventory);
  assert.equal(can(deictic), "obj-inventory");
  const knowledge = run("What supports that claim?", inventory);
  assert.notEqual(knowledge.clarificationTurn.action, "clarify");
  assert.equal(can(knowledge), "obj-inventory");
  const problem = run("What is the problem here?", inventory);
  assert.notEqual(can(problem), "obj-capacity");
});

test("FIX8 — mention/compare Inventory does not force a switch; historical return and named issue remain", () => {
  const delivery = run("Show Delivery.");
  const mention = run("Does Inventory affect Delivery?", delivery);
  assert.equal(can(mention), "obj-delivery");
  const named = run("The delivery issue.", run("Show Capacity."));
  assert.equal(can(named), "obj-delivery");
  const returned = run("What were we saying about capacity?", run("What about inventory?", run("Show Delivery.")));
  assert.equal(can(returned), "obj-capacity");
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});

test("FIX8 — Stage click, scenario/Decision/Execution, and no duplicate lifecycle", () => {
  const clicked = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview", presentationState: "minimum", environmentIntent: "neutral",
    }),
    "obj-delivery",
    catalog,
  );
  const fromClick = executeNexoraConversationalExperience({
    utterance: "Explain this.",
    executiveSubjects: subjects,
    runtimeState: clicked,
    catalog,
    previousManagerObjectSession: activateManagerObjectFromClick(createEmptyManagerObjectSession(), "obj-delivery"),
    messageIdSeed: "fix8-click",
  });
  assert.equal(fromClick.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.match(fromClick.response, /Delivery/i);

  const inventory = run("Switch to inventory.", run("Show Capacity."));
  const explore = run("Show me the alternatives again.", inventory);
  assert.notEqual(can(explore), "obj-capacity");
  const decided = run("What did we decide?", inventory);
  assert.ok(
    Object.keys(decided.nextDecisionSession?.provenanceByDecisionId ?? {}).length <= 1,
  );
  const execution = run("How is the execution going?", inventory);
  assert.ok(execution.response.length > 0);
  const outcome = run("Did it work?", inventory);
  assert.doesNotMatch(outcome.response, /successfully resolved|confirmed success/i);

  const history = run("Go back to Capacity.", inventory);
  assert.ok(can(history) === "obj-capacity" || can(history) === "ctx-problem-capacity");
  const unknownReturn = run("Go back to the supplier problem.", inventory);
  assert.equal(unknownReturn.clarificationTurn.action === "clarify" || unknownReturn.status === "clarification-required", true);
});

test("FIX8 — long-distance switch after Capacity history ends on Inventory", () => {
  const start = run("Show Capacity.");
  const delivery = run("What about delivery?", start);
  const returned = run("What were we saying about capacity?", run("What about inventory?", delivery));
  const knowledge = run("That one — still the same problem?", returned);
  const switched = run("Switch to inventory.", knowledge);
  assert.equal(can(switched), "obj-inventory");
  const deictic = run("Explain this.", switched);
  assert.equal(can(deictic), "obj-inventory");
});

test("FIX8 — manufacturing long T88; T85–T89 Stage preserved", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_LONG,
    runId: "sim-test-6-fix8-mfg",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  assert.equal(t88.canonicalSubjectId, "obj-inventory");
  assert.equal(t88.stageActiveSubjectId, "obj-inventory");
  assert.equal(
    report.journeyFindings.some((item) => item.managerTurn === 88),
    false,
  );
  const t85 = report.journeyObservations.find((item) => item.turn === 85)!;
  assert.equal(t85.canonicalSubjectId, "obj-capacity");
  assert.equal(t85.stageActiveSubjectId, "obj-capacity");
  assert.equal(t88.decisionCount, 1);
  assert.equal(t88.executionCount, 1);
});

test("FIX8 — FIX7–FIX1 and SIM-TEST:5-FIX3 regressions remain green", () => {
  const t85 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T85_FOCUSED, runId: "fix8-t85" });
  assert.equal(t85.journeyObservations.find((item) => item.turn === 85)?.stageActiveSubjectId, "obj-capacity");
  const t83 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T83_FOCUSED, runId: "fix8-t83" });
  assert.equal(t83.journeyObservations.find((item) => item.turn === 83)?.clarificationRequired, false);
  const t77 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T77_FOCUSED, runId: "fix8-t77" });
  assert.equal(t77.journeyFindings.some((item) => item.classification.includes("PREMATURE_DECISION")), false);
  const t71 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix8-t71" });
  assert.equal(t71.journeyObservations.find((item) => item.turn === 71)?.canonicalSubjectId, "obj-delivery");
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix8-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix8-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix8-t50" });
  assert.equal(t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50), false);
  const manufacturing = runNexoraSimulationTestJourney({ journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE, runId: "fix8-sim5" });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix8-fast" });
  assert.equal(fast.findingCounts.S1, 0);
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix8-fresh" });
  assert.equal(fresh.journeyObservations.some((item) => item.clarificationRequired), false);
});
