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
  SIM_TEST_6_PROJECT_LONG,
  SIM_TEST_6_PROJECT_T18_FOCUSED,
  SIM_TEST_6_SERVICE_T18_FOCUSED,
  SIM_TEST_6_T92_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";

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
    messageIdSeed: `fix12-${utterance}`,
  });
}

function ids(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return {
    can: turn.nextExecutiveContext.currentSubject?.subjectId ?? null,
    adv: turn.nxaAdvisorContract?.referentId ?? null,
  };
}

test("FIX12 — Project T18 this issue stays on Customer, not Capacity Gap", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_T18_FOCUSED,
    runId: "sim-test-6-fix12-t18",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t17 = report.journeyObservations.find((item) => item.turn === 17)!;
  const t18 = report.journeyObservations.find((item) => item.turn === 18)!;
  assert.equal(t17.canonicalSubjectId, "obj-customer");
  assert.equal(t18.utterance, "This issue — what is at stake?");
  assert.equal(t18.canonicalSubjectId, "obj-customer");
  assert.equal(t18.advisorReferentId, "obj-customer");
  assert.doesNotMatch(t18.advisorReferentId ?? "", /capacity/i);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("ADVISOR_DIVERGENCE")),
    false,
  );
  assert.doesNotMatch(t18.response, /ground truth|rms hidden/i);
});

test("FIX12 — equivalent this-issue utterances follow the active subject", () => {
  const customer = run("What about the customer impact?", run("Show Delivery."));
  assert.equal(ids(customer).can, "obj-customer");
  for (const utterance of [
    "This issue — what is at stake?",
    "What about this issue?",
    "Explain this issue.",
  ]) {
    const turn = run(utterance, customer);
    assert.equal(ids(turn).can, "obj-customer", utterance);
    assert.equal(ids(turn).adv, "obj-customer", utterance);
  }
});

test("FIX12 — this issue still follows a known Problem when that Problem is the active subject", () => {
  const gap = run("Tell me more about the Capacity Gap.");
  const stake = run("This issue — what is at stake?", gap);
  assert.equal(ids(gap).can, "ctx-problem-capacity");
  assert.equal(ids(stake).can, "ctx-problem-capacity");
  assert.equal(ids(stake).adv, "ctx-problem-capacity");
});

test("FIX12 — Project long T18; FIX11 named return and FIX10 T92 remain green", () => {
  const project = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_LONG,
    runId: "sim-test-6-fix12-project",
  });
  assert.equal(project.findingCounts.S0, 0);
  assert.equal(
    project.journeyFindings.some((item) => item.managerTurn === 18),
    false,
  );
  const service = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_SERVICE_T18_FOCUSED,
    runId: "fix12-fix11-reg",
  });
  const t16 = service.journeyObservations.find((item) => item.turn === 16)!;
  assert.equal(t16.utterance, "Go back to the capacity issue.");
  assert.equal(t16.canonicalSubjectId, "obj-capacity");
  assert.equal(t16.advisorReferentId, "obj-capacity");
  const t92 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T92_FOCUSED, runId: "fix12-t92" });
  assert.equal(
    t92.journeyFindings.some((item) => item.managerTurn === 92 && item.classification.includes("REFERENT")),
    false,
  );
});
