import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { activateManagerObjectFromClick, createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { isExplicitPresentationRequest } from "../manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { classifyManagerJourney } from "./nexoraSimulationJourneyObservation.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import type { NexoraSimulationJourneyTurnObservation } from "./nexoraSimulationTestContract.ts";
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
    messageIdSeed: `fix7-${utterance}`,
  });
}

test("SIM-TEST:6-FIX7 — T85 focused reproduction Stage follows historical return", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T85_FOCUSED,
    runId: "sim-test-6-fix7-t85",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t83 = report.journeyObservations.find((item) => item.turn === 83)!;
  const t84 = report.journeyObservations.find((item) => item.turn === 84)!;
  const t85 = report.journeyObservations.find((item) => item.turn === 85)!;
  const t86 = report.journeyObservations.find((item) => item.turn === 86)!;
  const t87 = report.journeyObservations.find((item) => item.turn === 87)!;
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  assert.equal(t83.utterance, "Is there a new bottleneck I should know about?");
  assert.equal(t83.clarificationRequired, false);
  assert.equal(t83.canonicalSubjectId, "obj-delivery");
  assert.equal(t83.stageActiveSubjectId, "obj-delivery");
  assert.equal(t84.canonicalSubjectId, "obj-inventory");
  assert.equal(t84.stageActiveSubjectId, "obj-inventory");
  assert.equal(t85.utterance, "What were we saying about capacity?");
  assert.equal(t85.canonicalSubjectId, "obj-capacity");
  assert.equal(t85.stageActiveSubjectId, "obj-capacity");
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("STAGE_DIVERGENCE") && item.managerTurn === 85),
    false,
  );
  assert.equal(t86.stageActiveSubjectId, "obj-capacity");
  assert.equal(t87.stageActiveSubjectId, "obj-capacity");
  assert.equal(t88.utterance, "Switch to inventory.");
  assert.equal(t88.stageActiveSubjectId, "obj-inventory");
  assert.equal(t89.stageActiveSubjectId, "obj-inventory");
  assert.equal(
    report.journeyFindings.filter((item) =>
      item.classification.includes("STAGE_DIVERGENCE") && item.managerTurn >= 85 && item.managerTurn <= 89,
    ).length,
    0,
  );
  assert.equal(t85.decisionCount, 1);
  assert.equal(t85.executionCount, 1);
  assert.equal(t85.decisionId, DECISION_ID);
});

test("FIX7 — conversation explicit focus, historical return, switch-to, and preserve-on-knowledge", () => {
  assert.equal(isExplicitPresentationRequest("What were we saying about capacity?", "explain"), true);
  assert.equal(isExplicitPresentationRequest("Switch to inventory.", "focus"), true);
  assert.equal(isExplicitPresentationRequest("What did we decide?", "explain"), false);

  const delivery = run("Show Delivery.");
  assert.equal(delivery.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.equal(delivery.directorPlan?.intent, "FOCUS_OBJECT");

  const inventory = run("What about inventory?", delivery);
  assert.equal(inventory.nextRuntimeState.focusedSubject?.id, "obj-inventory");

  const returned = run("What were we saying about capacity?", inventory);
  assert.equal(returned.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(returned.directorPlan?.intent, "FOCUS_OBJECT");

  const knowledge = run("That one — still the same problem?", returned);
  assert.equal(knowledge.nextRuntimeState.focusedSubject?.id, "obj-capacity");

  const look = run("Look at that.", knowledge);
  assert.equal(look.nextRuntimeState.focusedSubject?.id, "obj-capacity");

  const switched = run("Switch to inventory.", look);
  assert.equal(switched.nextRuntimeState.focusedSubject?.id, "obj-inventory");

  const first = run("The first one.", switched);
  assert.equal(first.nextRuntimeState.focusedSubject?.id, "obj-inventory");
});

test("FIX7 — Stage click → conversation and conversation → Stage", () => {
  const clicked = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview", presentationState: "minimum", environmentIntent: "neutral",
    }),
    "obj-delivery",
    catalog,
  );
  const session = activateManagerObjectFromClick(createEmptyManagerObjectSession(), "obj-delivery");
  const fromClick = executeNexoraConversationalExperience({
    utterance: "Explain this.",
    executiveSubjects: subjects,
    runtimeState: clicked,
    catalog,
    previousManagerObjectSession: session,
    messageIdSeed: "fix7-click",
  });
  assert.equal(fromClick.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.match(fromClick.response, /Delivery/i);

  const focused = run("Show Delivery.");
  assert.equal(focused.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const again = run("Show Delivery.", focused);
  assert.equal(again.nextRuntimeState.focusedSubject?.id, "obj-delivery");
});

test("FIX7 — unknown return and clarification do not fabricate Stage; superseded updates", () => {
  const capacity = run("Show Capacity.");
  const unknown = run("Go back to the supplier problem.", capacity);
  assert.equal(unknown.clarificationTurn.action === "clarify" || unknown.status === "clarification-required", true);
  assert.equal(unknown.nextRuntimeState.focusedSubject?.id, "obj-capacity");

  const pending = run("What about Capacity Theatre?", run("Show Delivery."));
  assert.equal(pending.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const superseded = run("Show Inventory.", pending);
  assert.equal(superseded.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(superseded.managerObjectTurn.session.pendingClarification, null);
});

test("FIX7 — locative, named issue, Decision/Execution/scenario, and no-op preserve", () => {
  const delivery = run("Show Delivery.");
  const locative = run("What is the problem here?", delivery);
  assert.equal(locative.nextRuntimeState.focusedSubject?.id, "obj-delivery");

  const named = run("The delivery issue.", run("Show Capacity."));
  assert.equal(named.nextRuntimeState.focusedSubject?.id, "obj-delivery");

  const decided = run("What did we decide?", delivery);
  assert.equal(decided.nextRuntimeState.focusedSubject?.id, "obj-delivery");

  const execution = run("How is the execution going?", delivery);
  assert.equal(execution.nextRuntimeState.focusedSubject?.id, "obj-delivery");

  const explore = run("Show me the alternatives again.", delivery);
  assert.ok(explore.nextRuntimeState.focusedSubject?.id === "obj-delivery" || explore.clarificationTurn.action === "clarify");

  const compare = run("Compare those options without changing the decision.", delivery);
  assert.ok(
    compare.nextRuntimeState.focusedSubject?.id === "obj-delivery" ||
      compare.clarificationTurn.action === "clarify" ||
      compare.status === "clarification-required",
  );

  const tellMore = run("Tell me more about the capacity issue.", run("Show Capacity."));
  assert.equal(tellMore.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});

test("FIX7 — long Stage-changing sequence only when presentation requires", () => {
  const capacity = run("Show Capacity.");
  const delivery = run("What about delivery?", capacity);
  const customer = run("What about the customer impact?", delivery);
  const back = run("Go back to Capacity.", customer);
  assert.equal(back.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  const scenarios = run("Show me the alternatives again.", back);
  const afterDecision = run("What did we decide?", scenarios);
  const afterExecution = run("How is the execution going?", afterDecision);
  const toDelivery = run("Return to delivery.", afterExecution);
  assert.equal(toDelivery.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const pending = run("What about Capacity Theatre?", toDelivery);
  assert.equal(pending.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const independent = run("Is there a new bottleneck I should know about?", pending);
  assert.equal(independent.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const knowledge = run("What data do we have?", independent);
  assert.equal(knowledge.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const stageChange = run("What about inventory?", knowledge);
  assert.equal(stageChange.nextRuntimeState.focusedSubject?.id, "obj-inventory");
});

test("FIX7 — Observer does not score Stage persist without a presentation instruction as STAGE_DIVERGENCE", () => {
  const observations: NexoraSimulationJourneyTurnObservation[] = [
    observation({
      turn: 88,
      intent: "CHANGE_CONTEXT",
      utterance: "Switch to inventory.",
      intendedSubject: "Inventory",
      canonicalSubjectId: "obj-capacity",
      stageActiveSubjectId: "obj-inventory",
      mlevelL1: "obj-inventory",
      response: "Focused on Inventory.",
    }),
    observation({
      turn: 89,
      intent: "FOLLOW_UP",
      utterance: "The first one.",
      canonicalSubjectId: "obj-capacity",
      stageActiveSubjectId: "obj-inventory",
      mlevelL1: "obj-inventory",
      response: "Understood — Capacity Gap.",
    }),
  ];
  const findings = classifyManagerJourney({
    testRunId: "fix7-obs",
    rmsRunId: "rms:fix7-obs",
    journey: SIM_TEST_6_T85_FOCUSED,
    observations,
    causalOverclaimTurns: Object.freeze([]),
  }).findings;
  assert.equal(findings.some((item) => item.classification.includes("STAGE_DIVERGENCE") && item.managerTurn === 89), false);
});

function observation(overrides: Partial<NexoraSimulationJourneyTurnObservation>): NexoraSimulationJourneyTurnObservation {
  return Object.freeze({
    turn: 1, tick: 0, intent: "ORIENT", utterance: "", deictic: false, intendedSubject: null,
    response: "", conversationSubjectId: null, canonicalSubjectId: null, focusedSubjectLabel: null,
    nmiCanonicalId: null, advisorReferentId: null, advisorReferentName: null,
    mlevelL1: null, mlevelL2: null, mlevelL3: null, mlevelVisibleDepth: 0,
    ancestorApplicable: "NOT_APPLICABLE", stageActiveSubjectId: null, stageSelectedObjectId: null,
    sceneIntent: null, clarificationRequired: false, decisionStatus: null, npsState: null,
    npsProblemLabel: null, vaiFocalObjectId: null, vaiRoleSummaries: Object.freeze([]),
    dataPublicationIds: Object.freeze([]), csvVersions: Object.freeze([]),
    visibleNumbers: Object.freeze({}), observerHiddenNumbers: Object.freeze({}),
    problemId: null, scenarioId: null, decisionId: null, decisionCount: 0, executionId: null,
    executionCount: 0, executionStatus: null, npsOutcomeStatus: null, npsResolutionStatus: null,
    npsLearningStatus: null, npsLearningDurable: false, nxa3OutcomeState: null,
    epistemicMarks: Object.freeze([]), ...overrides,
  });
}

test("FIX7 — manufacturing long T85–T89 Stage remains synchronized", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_MANUFACTURING_LONG,
    runId: "sim-test-6-fix7-mfg",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t85 = report.journeyObservations.find((item) => item.turn === 85)!;
  const t88 = report.journeyObservations.find((item) => item.turn === 88)!;
  const t89 = report.journeyObservations.find((item) => item.turn === 89)!;
  assert.equal(t85.stageActiveSubjectId, "obj-capacity");
  assert.equal(t88.stageActiveSubjectId, "obj-inventory");
  assert.equal(t89.stageActiveSubjectId, "obj-inventory");
  assert.equal(
    report.journeyFindings.some((item) =>
      item.classification.includes("STAGE_DIVERGENCE") && item.managerTurn >= 85 && item.managerTurn <= 89,
    ),
    false,
  );
  assert.equal(t85.decisionCount, 1);
  assert.equal(t85.executionCount, 1);
});

test("FIX7 — FIX6–FIX1 and SIM-TEST:5-FIX3 regressions remain green", () => {
  const t83 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T83_FOCUSED, runId: "fix7-t83" });
  assert.equal(t83.journeyObservations.find((item) => item.turn === 83)?.clarificationRequired, false);
  const t77 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T77_FOCUSED, runId: "fix7-t77" });
  assert.equal(t77.journeyFindings.some((item) => item.classification.includes("PREMATURE_DECISION")), false);
  const t71 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix7-t71" });
  assert.equal(t71.journeyObservations.find((item) => item.turn === 71)?.canonicalSubjectId, "obj-delivery");
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix7-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix7-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix7-t50" });
  assert.equal(t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50), false);
  const manufacturing = runNexoraSimulationTestJourney({ journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE, runId: "fix7-sim5" });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix7-fast" });
  assert.equal(fast.findingCounts.S1, 0);
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix7-fresh" });
  assert.equal(fresh.journeyObservations.some((item) => item.clarificationRequired), false);
  assert.equal(fresh.journeyObservations.every((item) => (item.decisionCount ?? 0) === 0), true);
});
