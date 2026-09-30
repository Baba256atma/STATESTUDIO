import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_T50_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
  SIM_TEST_6_T69_FOCUSED,
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
    messageIdSeed: `fix3-${utterance}`,
  });
}

test("SIM-TEST:6-FIX3 — focused T69 unknown Supplier return clarifies instead of keeping Capacity", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T69_FOCUSED,
    runId: "sim-test-6-fix3-t69",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t64 = report.journeyObservations.find((item) => item.turn === 64)!;
  assert.equal(t64.canonicalSubjectId, "obj-delivery");
  const t69 = report.journeyObservations.find((item) => item.turn === 69)!;
  assert.equal(t69.utterance, "Go back to the supplier problem.");
  assert.equal(t69.canonicalSubjectId, "obj-capacity");
  assert.equal(t69.clarificationRequired, true);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("STALE_REFERENT") && item.managerTurn === 69),
    false,
  );
  assert.equal(t69.decisionCount, 1);
  assert.equal(t69.executionCount, 1);
});

test("FIX3 — current deictic, named target, historical return, and unknown targets", () => {
  const delivery = run("Show Delivery.");
  const here = run("What is the problem here?", delivery);
  assert.match(here.nxaAdvisorContract?.referentId ?? "", /delivery/i);

  const capacity = run("Show Capacity.", here);
  const named = run("What about delivery?", capacity);
  assert.match(named.nextRuntimeState.focusedSubject?.id ?? "", /delivery/i);

  const back = run("Go back to Capacity.", named);
  assert.match(back.nextRuntimeState.focusedSubject?.id ?? "", /capacity/i);
  const afterReturn = run("Explain this.", back);
  assert.match(afterReturn.nxaAdvisorContract?.referentId ?? "", /capacity/i);

  const customer = run("Show Customer.", afterReturn);
  const inventory = run("Show Inventory.", customer);
  const demand = run("Show Demand.", inventory);
  const current = run("Explain this.", demand);
  assert.match(current.nxaAdvisorContract?.referentId ?? "", /demand/i);

  const unknownSupplier = run("Go back to the supplier problem.", current);
  assert.equal(
    unknownSupplier.clarificationTurn.action === "clarify" || unknownSupplier.status === "clarification-required",
    true,
  );
  const unknownSchedule = run("What about the schedule issue?", demand);
  assert.equal(
    unknownSchedule.clarificationTurn.action === "clarify" || unknownSchedule.status === "clarification-required",
    true,
  );
  const unknownResource = run("What about resources?", demand);
  assert.equal(
    unknownResource.clarificationTurn.action === "clarify" || unknownResource.status === "clarification-required",
    true,
  );

  const fiction = run("Teleport all inventory to the finished-goods warehouse.", back);
  assert.match(fiction.nxaAdvisorContract?.referentId ?? "", /capacity/i);
});

test("FIX3 — FIX2 T64 and FIX1 T50 focused regressions remain green", () => {
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix3-t64" });
  assert.equal(t64.journeyFindings.some((item) => item.classification.includes("ADVISOR_DIVERGENCE")), false);
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix3-t50" });
  assert.equal(
    t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50),
    false,
  );
});

test("FIX3 — SIM-TEST:5-FIX3 Delivery return and unique Execution remain", () => {
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "fix3-fix3-reg",
  });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const last = manufacturing.journeyObservations.at(-1)!;
  assert.equal(last.decisionCount, 1);
  assert.equal(last.executionCount, 1);
});
