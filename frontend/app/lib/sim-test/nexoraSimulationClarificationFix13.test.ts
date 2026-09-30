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
  SIM_TEST_6_PROJECT_T35_FOCUSED,
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
    messageIdSeed: `fix13-${utterance}`,
  });
}

test("FIX13 — Project T35 What changed? is not a third pending-issue clarification", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_T35_FOCUSED,
    runId: "sim-test-6-fix13-t35",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t33 = report.journeyObservations.find((item) => item.turn === 33)!;
  const t35 = report.journeyObservations.find((item) => item.turn === 35)!;
  assert.equal(t33.utterance, "What about the maintenance crisis?");
  assert.equal(t33.clarificationRequired, true);
  assert.equal(t35.utterance, "What changed?");
  assert.equal(t35.canonicalSubjectId, "obj-delivery");
  assert.equal(t35.clarificationRequired, false);
  assert.doesNotMatch(t35.response, /I'm not sure which issue you mean/i);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION")),
    false,
  );
  assert.doesNotMatch(t35.response, /ground truth|definitely caused|is causing/i);
  assert.match(t35.response, /not (?:a )?(?:measured impact|confirmed cause)|no authoritative|don't have a prior/i);
});

test("FIX13 — change questions leave unknown Maintenance pending rather than answering it", () => {
  const pending = run("What about the maintenance crisis?", run("Show Delivery."));
  assert.equal(pending.status, "clarification-required");
  const changed = run("What changed?", pending);
  assert.notEqual(changed.status, "clarification-required");
  assert.equal(changed.nextExecutiveContext.currentSubject?.subjectId, "obj-delivery");
  assert.doesNotMatch(changed.response, /I'm not sure which issue you mean/i);
});

test("FIX13 — unknown named issues still clarify", () => {
  const unknown = run("What about the maintenance crisis?", run("Show Delivery."));
  assert.equal(unknown.status, "clarification-required");
  assert.equal(unknown.nextExecutiveContext.currentSubject?.subjectId, "obj-delivery");
});

test("FIX13 — Project long T35; FIX12/FIX11/FIX10 remain green", () => {
  const project = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_LONG,
    runId: "sim-test-6-fix13-project",
  });
  assert.equal(project.findingCounts.S0, 0);
  assert.equal(project.findingCounts.S1, 0);
  assert.equal(
    project.journeyFindings.some((item) => item.managerTurn === 35),
    false,
  );
  const t18 = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_PROJECT_T18_FOCUSED,
    runId: "fix13-fix12-reg",
  });
  const issue = t18.journeyObservations.find((item) => item.turn === 18)!;
  assert.equal(issue.canonicalSubjectId, "obj-customer");
  assert.equal(issue.advisorReferentId, "obj-customer");
  const service = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_SERVICE_T18_FOCUSED,
    runId: "fix13-fix11-reg",
  });
  assert.equal(service.journeyObservations.find((item) => item.turn === 16)?.canonicalSubjectId, "obj-capacity");
  const t92 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T92_FOCUSED, runId: "fix13-t92" });
  assert.equal(
    t92.journeyFindings.some((item) => item.managerTurn === 92 && item.classification.includes("REFERENT")),
    false,
  );
});
