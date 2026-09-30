import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { inspectNxaManagerLanguage } from "../manager-object/nexoraNxa1ExecutiveAdvisorContract.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_T50_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";
import {
  SIM_TEST_5_MANUFACTURING_LIFECYCLE,
} from "./nexoraSimulationLifecycleJourneys.ts";

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
    messageIdSeed: `fix2-${utterance}`,
  });
}

test("SIM-TEST:6-FIX2 — focused T56–T68 no longer diverges Advisor at T64", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T64_FOCUSED,
    runId: "sim-test-6-fix2-t64",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t64 = report.journeyObservations.find((item) => item.turn === 64)!;
  assert.equal(t64.utterance, "What is the problem here?");
  assert.equal(t64.canonicalSubjectId, "obj-delivery");
  assert.match(t64.advisorReferentId ?? "", /delivery/i);
  assert.doesNotMatch(t64.advisorReferentId ?? "", /capacity/i);
  assert.doesNotMatch(t64.response, /couldn't find a clear match for “Problem Here”/i);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("ADVISOR_DIVERGENCE")),
    false,
  );
  assert.equal(t64.decisionCount, 1);
  assert.equal(t64.executionCount, 1);
});

test("SIM-TEST:6-FIX1 T50 focused regression remains green", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T50_FOCUSED,
    runId: "sim-test-6-fix2-t50",
  });
  assert.equal(report.harnessStatus, "PASS");
  const t50 = report.journeyObservations.find((item) => item.turn === 50)!;
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50),
    false,
  );
  assert.equal(t50.decisionCount, 1);
  assert.equal(t50.executionCount, 1);
});

test("FIX2 — current subject, deictic, lifecycle, and related mention stay on canonical context", () => {
  const delivery = run("Show Delivery.");
  const locative = run("What is the problem here?", delivery);
  assert.match(locative.nxaAdvisorContract?.referentId ?? "", /delivery/i);
  assert.doesNotMatch(locative.response, /Problem Here/i);

  const deictic = run("Explain this.", locative);
  assert.match(deictic.nxaAdvisorContract?.referentId ?? "", /delivery/i);

  const capacity = run("Show Capacity.");
  const afterExecAsk = run("How is this execution going?", capacity);
  const inventory = run("What about inventory?", afterExecAsk);
  assert.match(inventory.nxaAdvisorContract?.referentId ?? "", /inventory/i);
  assert.doesNotMatch(inventory.nxaAdvisorContract?.referentId ?? "", /capacity/i);

  const decisionAsk = run("This decision — is it still the active one?", inventory);
  assert.ok(
    (decisionAsk.nxaAdvisorContract?.referentId ?? decisionAsk.nxaAdvisorContract?.referentName ?? "").length > 0 ||
      decisionAsk.nxaAdvisorContract?.referentSource === "NCA2_ACTIVE_COLLECTION",
  );

  const compare = run("Compare the two options again.", decisionAsk);
  assert.equal(compare.shouldCommitRuntime === true && /decision/i.test(compare.nxaAdvisorContract?.referentId ?? ""), false);

  const historical = run("Go back to Delivery.", compare);
  assert.match(historical.nxaAdvisorContract?.referentId ?? "", /delivery/i);

  const unknown = run("Go back to the schedule issue.", historical);
  assert.ok(unknown.clarificationTurn?.action === "clarify" || /which|not sure|don't have|couldn't find|unknown/i.test(unknown.response));

  const related = run("Show Capacity.", unknown);
  const mentionsDelivery = run("How does this relate to other objects?", related);
  assert.match(mentionsDelivery.nxaAdvisorContract?.referentId ?? "", /capacity/i);
  assert.equal(inspectNxaManagerLanguage(mentionsDelivery.response).unsupportedCausalCertainty, false);

  const fiction = run("Teleport all inventory to the finished-goods warehouse.", related);
  assert.match(fiction.nxaAdvisorContract?.referentId ?? "", /capacity/i);
  assert.doesNotMatch(fiction.nxaAdvisorContract?.referentId ?? "", /inventory/i);

  const meaning = interpretCanonicalManagerMeaning({
    utterance: "What is the problem here?",
    subjects,
  });
  assert.equal(meaning.objectReference?.subjectId === "ctx-problem-capacity", false);
});

test("FIX2 — A→B→A and long-distance current subject beat a rich older Problem alias", () => {
  let turn = run("Show Capacity.");
  turn = run("Explain it.", turn);
  turn = run("Show Delivery.", turn);
  assert.match(turn.nxaAdvisorContract?.referentId ?? "", /delivery/i);
  turn = run("Show Capacity.", turn);
  assert.match(turn.nxaAdvisorContract?.referentId ?? "", /capacity/i);
  turn = run("Show Customer.", turn);
  turn = run("Show Inventory.", turn);
  turn = run("Show Demand.", turn);
  turn = run("Show Budget.", turn);
  turn = run("Show Margin.", turn);
  turn = run("Show Revenue.", turn);
  turn = run("Show Inventory.", turn);
  turn = run("Show Demand.", turn);
  turn = run("Show Customer.", turn);
  turn = run("What about delivery?", turn);
  assert.match(turn.nxaAdvisorContract?.referentId ?? "", /delivery/i);
  turn = run("What is the problem here?", turn);
  assert.match(turn.nxaAdvisorContract?.referentId ?? "", /delivery/i);
  assert.doesNotMatch(turn.nxaAdvisorContract?.referentId ?? "", /capacity/i);
  turn = run("Go back to Capacity.", turn);
  assert.match(turn.nxaAdvisorContract?.referentId ?? "", /capacity/i);
});

test("FIX2 — SIM-TEST:5-FIX3 execution identity remains unique on manufacturing lifecycle", () => {
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "sim-test-6-fix2-fix3-reg",
  });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const last = manufacturing.journeyObservations.at(-1)!;
  assert.equal(last.decisionCount, 1);
  assert.equal(last.executionCount, 1);
});
