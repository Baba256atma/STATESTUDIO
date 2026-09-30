import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { resolveContextualManagerMeaning } from "../manager-object/conversationContinuityResolver.ts";
import { createEmptyConversationContinuity } from "../manager-object/conversationContinuitySnapshot.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
} from "../conversational-control/executiveContextSnapshot.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_T50_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
  SIM_TEST_6_T69_FOCUSED,
  SIM_TEST_6_T71_FOCUSED,
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
    messageIdSeed: `fix4-${utterance}`,
  });
}

function subjectId(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return turn.nextRuntimeState.focusedSubject?.id ?? turn.nextExecutiveContext.currentSubject?.subjectId ?? null;
}

test("SIM-TEST:6-FIX4 — T71 focused reproduction selects Delivery, not Capacity", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T71_FOCUSED,
    runId: "sim-test-6-fix4-t71",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t69 = report.journeyObservations.find((item) => item.turn === 69)!;
  assert.equal(t69.utterance, "Go back to the supplier problem.");
  assert.equal(t69.clarificationRequired, true);
  assert.equal(t69.canonicalSubjectId, "obj-capacity");
  const t70 = report.journeyObservations.find((item) => item.turn === 70)!;
  assert.equal(t70.canonicalSubjectId, "obj-capacity");
  const t71 = report.journeyObservations.find((item) => item.turn === 71)!;
  assert.equal(t71.utterance, "The delivery issue.");
  assert.equal(t71.canonicalSubjectId, "obj-delivery");
  assert.equal(t71.clarificationRequired, false);
  assert.equal(
    report.journeyFindings.some(
      (item) => item.classification.includes("WRONG_REFERENT") && item.managerTurn === 71,
    ),
    false,
  );
  assert.equal(t71.decisionCount, 1);
  assert.equal(t71.executionCount, 1);
  assert.equal(t71.decisionId, "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1");
});

test("FIX4 — CC:1 treats a bare named issue as focus, not unknown", () => {
  const intent = resolveNexoraConversationalIntent({ utterance: "The delivery issue." }).intent;
  assert.equal(intent.kind, "focus");
  assert.equal(intent.targetHints[0]?.raw, "delivery");
});

test("FIX4 — current Object deictic, typed Problem, Decision, Execution, and Scenario option", () => {
  const delivery = run("Show Delivery.");
  const objectDeictic = run("Explain this.", delivery);
  assert.equal(subjectId(objectDeictic), "obj-delivery");

  const capacity = run("Show Capacity.", objectDeictic);
  const problemHere = run("What is the problem here?", capacity);
  assert.equal(subjectId(problemHere), "obj-capacity");

  const compare = run("What happens if I do nothing?", problemHere);
  assert.ok(compare.response.length > 0);

  const thatDecision = run("What decision did we make?", capacity);
  assert.doesNotMatch(thatDecision.response, /Supplier Delay has been added/i);

  const thatExecution = run("What about that execution?", capacity);
  assert.notEqual(thatExecution.clarificationTurn.action === "clarify" && subjectId(thatExecution) === "obj-supplier", true);
});

test("FIX4 — known historical return, unknown historical return, and post-return deictic", () => {
  const capacity = run("Show Capacity.");
  const delivery = run("Show Delivery.", capacity);
  const known = run("Go back to Delivery.", delivery);
  assert.equal(subjectId(known), "obj-delivery");
  const post = run("How does this affect operations?", known);
  assert.equal(subjectId(post), "obj-delivery");

  const unknown = run("Go back to the supplier problem.", post);
  assert.equal(unknown.clarificationTurn.action === "clarify" || unknown.status === "clarification-required", true);
  assert.notEqual(unknown.contextualManagerMeaning.objectReference?.subjectId, "obj-supplier");
});

test("FIX4 — current subject vs historical Problem; Object vs Decision and Execution stickiness", () => {
  const capacity = run("Show Capacity.");
  const delivery = run("Show Delivery.", capacity);
  const locative = run("What is the problem here?", delivery);
  assert.equal(subjectId(locative), "obj-delivery");

  const decisionAsk = run("What decision did we make?", locative);
  const backToDelivery = run("Show Delivery.", decisionAsk);
  const thisAfterDecision = run("What about this?", backToDelivery);
  assert.equal(subjectId(thisAfterDecision), "obj-delivery");

  const executionAsk = run("Where are we with execution?", thisAfterDecision);
  const afterExecution = run("Show Customer.", executionAsk);
  const thisAfterExecution = run("What about this?", afterExecution);
  assert.equal(subjectId(thisAfterExecution), "obj-customer");
});

test("FIX4 — clarification pending, resolved, and superseded referent", () => {
  const capacity = run("Show Capacity.");
  const pending = run("Go back to the supplier problem.", capacity);
  assert.equal(pending.clarificationTurn.action === "clarify" || pending.status === "clarification-required", true);
  const independent = run("The delivery issue.", pending);
  assert.equal(subjectId(independent), "obj-delivery");

  const resolved = run("Show Capacity.", independent);
  assert.equal(subjectId(resolved), "obj-capacity");
  const afterResolved = run("Explain this.", resolved);
  assert.equal(subjectId(afterResolved), "obj-capacity");

  const pendingAgain = run("Go back to the supplier problem.", afterResolved);
  const superseded = run("Show Inventory.", pendingAgain);
  assert.equal(subjectId(superseded), "obj-inventory");
});

test("FIX4 — A→B→C, A→B→A, long-distance return, related mention, fiction, labels, fresh session", () => {
  const a = run("Show Capacity.");
  const b = run("Show Delivery.", a);
  const c = run("Show Customer.", b);
  const deicticC = run("Explain this.", c);
  assert.equal(subjectId(deicticC), "obj-customer");

  const backA = run("Go back to Capacity.", deicticC);
  const deicticA = run("Explain this.", backA);
  assert.equal(subjectId(deicticA), "obj-capacity");

  const d = run("Show Delivery.", deicticA);
  const e = run("Show Customer.", d);
  const f = run("Show Inventory.", e);
  const g = run("Show Demand.", f);
  const h = run("Show Revenue.", g);
  const i = run("Show Budget.", h);
  const j = run("Show Delivery.", i);
  const k = run("Show Customer.", j);
  const l = run("Show Inventory.", k);
  const m = run("Show Demand.", l);
  const longReturn = run("Go back to Capacity.", m);
  assert.equal(subjectId(longReturn), "obj-capacity");

  const related = run("How does this affect operations?", longReturn);
  assert.equal(subjectId(related), "obj-capacity");

  const fiction = run("Teleport all inventory to the finished-goods warehouse.", related);
  assert.equal(subjectId(fiction), "obj-capacity");

  const extra = freezeConversationalSubjectRecord({
    subjectId: "obj-capacity-kpi",
    subjectKind: "object",
    canonicalName: "Capacity KPI",
    aliases: Object.freeze(["capacity kpi"]),
    businessKey: "obj-capacity-kpi",
  });
  const meaning = interpretCanonicalManagerMeaning({
    utterance: "Go back to the capacity problem.",
    subjects: [...subjects, extra],
  });
  const resolved = resolveContextualManagerMeaning({
    turnMeaning: meaning,
    subjects: [...subjects, extra],
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: createEmptyNexoraExecutiveContextSnapshot({
      currentSubject: freezeExecutiveContextReference({
        subjectId: "obj-customer",
        subjectKind: "object",
        canonicalName: "Customer",
        source: "explicit",
        turnIndex: 3,
      }),
      previousSubjects: Object.freeze([
        freezeExecutiveContextReference({
          subjectId: "obj-capacity-kpi",
          subjectKind: "object",
          canonicalName: "Capacity KPI",
          source: "conversation",
          turnIndex: 1,
        }),
        freezeExecutiveContextReference({
          subjectId: "ctx-problem-capacity",
          subjectKind: "problem",
          canonicalName: "Capacity Gap",
          source: "conversation",
          turnIndex: 2,
        }),
      ]),
      turnIndex: 3,
    }),
  });
  assert.equal(resolved.objectReference?.subjectId, "ctx-problem-capacity");

  const fresh = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_FRESH_SESSION,
    runId: "fix4-fresh",
  });
  assert.equal(fresh.findingCounts.S0, 0);
  const first = fresh.journeyObservations[0];
  assert.ok(first);
});

test("FIX4 — lifecycle-rich Problem→Scenario→Decision→Execution→switch→clarification→return→deictic", () => {
  const problem = run("Show Capacity.");
  const scenario = run("What happens if I do nothing?", problem);
  const decide = run("Do nothing.", scenario);
  const execute = run("Start execution.", decide);
  const switchSubject = run("Show Delivery.", execute);
  assert.equal(subjectId(switchSubject), "obj-delivery");
  const clarification = run("Go back to the supplier problem.", switchSubject);
  assert.equal(
    clarification.clarificationTurn.action === "clarify" || clarification.status === "clarification-required",
    true,
  );
  const historical = run("Go back to Capacity.", clarification);
  assert.equal(subjectId(historical), "obj-capacity");
  const deictic = run("How does this affect operations?", historical);
  assert.equal(subjectId(deictic), "obj-capacity");
});

test("FIX4 — Outcome boundary does not invent proven success", () => {
  const capacity = run("Show Capacity.");
  const outcome = run("Did it work?", capacity);
  assert.match(outcome.response, /too early|unknown|not yet|insufficient|don't have|cannot confirm|predicted|observed/i);
});

test("FIX4 — FIX3 T69, FIX2 T64, FIX1 T50, SIM-TEST:5-FIX3, FAST", () => {
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix4-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix4-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix4-t50" });
  assert.equal(
    t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50),
    false,
  );
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "fix4-sim5-fix3",
  });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const last = manufacturing.journeyObservations.at(-1)!;
  assert.equal(last.decisionCount, 1);
  assert.equal(last.executionCount, 1);
  const fast = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_FAST_PARITY,
    runId: "fix4-fast",
  });
  assert.equal(fast.findingCounts.S0, 0);
  assert.equal(fast.findingCounts.S1, 0);
});
