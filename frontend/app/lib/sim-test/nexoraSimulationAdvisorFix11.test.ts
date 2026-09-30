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
  SIM_TEST_6_SERVICE_PARITY,
  SIM_TEST_6_SERVICE_T18_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
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
    messageIdSeed: `fix11-${utterance}`,
  });
}

function can(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return turn.nextExecutiveContext.currentSubject?.subjectId ?? null;
}

test("FIX11 — Service T16–T18 Advisor follows canonical Capacity return", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_SERVICE_T18_FOCUSED,
    runId: "sim-test-6-fix11-t18",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t16 = report.journeyObservations.find((item) => item.turn === 16)!;
  const t17 = report.journeyObservations.find((item) => item.turn === 17)!;
  const t18 = report.journeyObservations.find((item) => item.turn === 18)!;
  assert.equal(t16.utterance, "Go back to the capacity issue.");
  assert.equal(t16.canonicalSubjectId, "obj-capacity");
  assert.equal(t16.advisorReferentId, "obj-capacity");
  assert.equal(t17.utterance, "That one.");
  assert.equal(t17.canonicalSubjectId, "obj-capacity");
  assert.equal(t17.advisorReferentId, "obj-capacity");
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("ADVISOR_DIVERGENCE")),
    false,
  );
  assert.equal(t18.utterance, "What about the resource issue?");
  assert.equal(t18.canonicalSubjectId, "obj-capacity");
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION")),
    false,
  );
  assert.doesNotMatch(t16.response + t17.response + t18.response, /ground truth|rms hidden/i);
});

test("FIX11 — stale Delivery cannot override a visited Capacity named return", () => {
  const delivery = run("What about delivery?", run("What about customer?", run("Show Capacity.")));
  assert.equal(can(delivery), "obj-delivery");
  const returned = run("Go back to the capacity issue.", delivery);
  assert.equal(can(returned), "obj-capacity");
  assert.equal(returned.nxaAdvisorContract?.referentId, "obj-capacity");
  const deictic = run("That one.", returned);
  assert.equal(can(deictic), "obj-capacity");
  assert.equal(deictic.nxaAdvisorContract?.referentId, "obj-capacity");
});

test("FIX11 — unknown resource issue still clarifies without fabricating", () => {
  const returned = run("Go back to the capacity issue.", run("What about delivery?", run("Show Capacity.")));
  const unknown = run("What about the resource issue?", returned);
  assert.equal(can(unknown), "obj-capacity");
  assert.equal(
    unknown.clarificationTurn.action === "clarify" || unknown.status === "clarification-required",
    true,
  );
  assert.doesNotMatch(unknown.response, /obj-resource|Resource Gap has been added/i);
});

test("FIX11 — Service parity T17/T18; FIX2 and FIX10 windows remain green", () => {
  const service = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_SERVICE_PARITY,
    runId: "sim-test-6-fix11-service",
  });
  assert.equal(service.findingCounts.S0, 0);
  assert.equal(
    service.journeyFindings.some((item) => item.managerTurn === 17 || item.managerTurn === 18),
    false,
  );
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix11-t64" });
  assert.equal(
    t64.journeyFindings.some((item) => item.classification.includes("ADVISOR_DIVERGENCE")),
    false,
  );
  const t92 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T92_FOCUSED, runId: "fix11-t92" });
  assert.equal(
    t92.journeyFindings.some((item) => item.managerTurn === 92 && item.classification.includes("REFERENT")),
    false,
  );
});
